// src/controllers/coachController.js
import User from "../models/User.js";
import CoachRequest from "../models/CoachRequest.js";
import CoachProfile from "../models/CoachProfile.js";
import { sendCoachApprovalEmail, sendCoachRejectionEmail } from "../utils/emailService.js";

export const applyToBeCoach = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { expertise, bio, experience, certifications, socialLinks } = req.body;

    if (!expertise || !Array.isArray(expertise) || expertise.length === 0) {
      return res.status(400).json({ message: "Please provide at least one area of expertise" });
    }

    if (!bio || bio.length < 100) {
      return res.status(400).json({ message: "Bio must be at least 100 characters" });
    }

    if (!experience || experience.length < 50) {
      return res.status(400).json({ message: "Experience description must be at least 50 characters" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isApprovedCoach) {
      return res.status(400).json({ message: "You are already an approved coach" });
    }

    if (user.isPendingCoach) {
      return res.status(400).json({ message: "You already have a pending coach application" });
    }

    const coachRequest = await CoachRequest.create({
      userId,
      expertise,
      bio,
      experience,
      certifications: certifications || [],
      socialLinks: socialLinks || {},
      status: 'pending'
    });

    user.isPendingCoach = true;
    user.coachRequestId = coachRequest._id;
    await user.save();

    res.status(201).json({
      message: "Coach application submitted successfully",
      application: {
        id: coachRequest._id,
        status: coachRequest.status,
        submittedAt: coachRequest.createdAt
      }
    });

  } catch (err) {
    console.error("APPLY TO BE COACH ERROR:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};

export const getMyApplication = async (req, res) => {
  try {
    const userId = req.user.userId;

    const application = await CoachRequest.findOne({ userId })
      .sort({ createdAt: -1 });

    if (!application) {
      return res.status(404).json({ message: "No coach application found" });
    }

    res.status(200).json({
      application: {
        id: application._id,
        expertise: application.expertise,
        bio: application.bio,
        experience: application.experience,
        certifications: application.certifications,
        socialLinks: application.socialLinks,
        status: application.status,
        rejectionReason: application.rejectionReason,
        submittedAt: application.createdAt,
        reviewedAt: application.reviewedAt
      }
    });

  } catch (err) {
    console.error("GET MY APPLICATION ERROR:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};

export const getAllApplications = async (req, res) => {
  try {
    const { status } = req.query;

    const filter = {};
    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      filter.status = status;
    }

    const applications = await CoachRequest.find(filter)
      .populate('userId', 'name email avatar')
      .populate('reviewedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: applications.length,
      applications: applications.map(app => ({
        id: app._id,
        applicant: {
          id: app.userId._id,
          name: app.userId.name,
          email: app.userId.email,
          avatar: app.userId.avatar
        },
        expertise: app.expertise,
        bio: app.bio,
        experience: app.experience,
        certifications: app.certifications,
        socialLinks: app.socialLinks,
        status: app.status,
        rejectionReason: app.rejectionReason,
        adminNotes: app.adminNotes,
        reviewedBy: app.reviewedBy ? {
          id: app.reviewedBy._id,
          name: app.reviewedBy.name
        } : null,
        submittedAt: app.createdAt,
        reviewedAt: app.reviewedAt
      }))
    });

  } catch (err) {
    console.error("GET ALL APPLICATIONS ERROR:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};

export const approveApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const adminId = req.user.userId;

    const application = await CoachRequest.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.status !== 'pending') {
      return res.status(400).json({ message: "Application already reviewed" });
    }

    application.status = 'approved';
    application.reviewedBy = adminId;
    application.reviewedAt = new Date();
    await application.save();

    const user = await User.findById(application.userId);
    user.isPendingCoach = false;
    user.isApprovedCoach = true;
    user.role = 'coach';
    await user.save();

    const coachProfile = await CoachProfile.create({
      userId: application.userId,
      coachRequestId: application._id,
      displayName: user.name,
      avatar: user.avatar,
      bio: application.bio,
      expertise: application.expertise,
      experience: application.experience,
      certifications: application.certifications,
      socialLinks: application.socialLinks
    });

    user.coachProfileId = coachProfile._id;
    await user.save();

    // Send approval email notification
    try {
      await sendCoachApprovalEmail(user.email, user.name);
    } catch (emailError) {
      console.error('Failed to send approval email:', emailError);
      // Continue even if email fails - don't block the approval
    }

    res.status(200).json({
      message: "Coach application approved successfully",
      coachProfile: {
        id: coachProfile._id,
        userId: coachProfile.userId
      }
    });

  } catch (err) {
    console.error("APPROVE APPLICATION ERROR:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};

export const rejectApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { rejectionReason, adminNotes } = req.body;
    const adminId = req.user.userId;

    if (!rejectionReason) {
      return res.status(400).json({ message: "Rejection reason is required" });
    }

    const application = await CoachRequest.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.status !== 'pending') {
      return res.status(400).json({ message: "Application already reviewed" });
    }

    application.status = 'rejected';
    application.rejectionReason = rejectionReason;
    application.adminNotes = adminNotes || null;
    application.reviewedBy = adminId;
    application.reviewedAt = new Date();
    await application.save();

    const user = await User.findById(application.userId);
    user.isPendingCoach = false;
    user.isApprovedCoach = false;
    await user.save();

    // Send rejection email notification
    try {
      await sendCoachRejectionEmail(user.email, user.name, rejectionReason);
    } catch (emailError) {
      console.error('Failed to send rejection email:', emailError);
      // Continue even if email fails - don't block the rejection
    }

    res.status(200).json({
      message: "Coach application rejected",
      rejectionReason
    });

  } catch (err) {
    console.error("REJECT APPLICATION ERROR:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};

export const getAllCoachProfiles = async (req, res) => {
  try {
    const { isAvailable, expertise } = req.query;

    const filter = { isPubliclyVisible: true };

    if (isAvailable === 'true') {
      filter.isAvailable = true;
    }

    if (expertise) {
      filter.expertise = expertise;
    }

    const profiles = await CoachProfile.find(filter)
      .populate('userId', 'name email')
      .sort({ rating: -1, totalReviews: -1 });

    res.status(200).json({
      count: profiles.length,
      coaches: profiles.map(profile => ({
        id: profile._id,
        userId: profile.userId._id,
        displayName: profile.displayName,
        avatar: profile.avatar,
        bio: profile.bio,
        expertise: profile.expertise,
        experience: profile.experience,
        certifications: profile.certifications,
        socialLinks: profile.socialLinks,
        rating: profile.rating,
        totalReviews: profile.totalReviews,
        totalMentees: profile.totalMentees,
        activeMentees: profile.activeMentees,
        isAvailable: profile.isAvailable,
        isVerified: profile.isVerified,
        createdAt: profile.createdAt
      }))
    });

  } catch (err) {
    console.error("GET ALL COACH PROFILES ERROR:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};

export const getCoachProfile = async (req, res) => {
  try {
    const { coachId } = req.params;

    const profile = await CoachProfile.findById(coachId)
      .populate('userId', 'name email');

    if (!profile) {
      return res.status(404).json({ message: "Coach profile not found" });
    }

    if (!profile.isPubliclyVisible) {
      return res.status(403).json({ message: "This coach profile is not publicly visible" });
    }

    res.status(200).json({
      coach: {
        id: profile._id,
        userId: profile.userId._id,
        displayName: profile.displayName,
        avatar: profile.avatar,
        bio: profile.bio,
        expertise: profile.expertise,
        experience: profile.experience,
        certifications: profile.certifications,
        socialLinks: profile.socialLinks,
        rating: profile.rating,
        totalReviews: profile.totalReviews,
        totalMentees: profile.totalMentees,
        activeMentees: profile.activeMentees,
        completedSessions: profile.completedSessions,
        isAvailable: profile.isAvailable,
        maxMentees: profile.maxMentees,
        isVerified: profile.isVerified,
        createdAt: profile.createdAt
      }
    });

  } catch (err) {
    console.error("GET COACH PROFILE ERROR:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};

export const getMyCoachProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isApprovedCoach) {
      return res.status(403).json({
        message: "You are not an approved coach",
        isPendingCoach: user.isPendingCoach
      });
    }

    const profile = await CoachProfile.findOne({ userId });
    if (!profile) {
      return res.status(404).json({ message: "Coach profile not found" });
    }

    res.status(200).json({
      profile: {
        id: profile._id,
        userId: profile.userId,
        displayName: profile.displayName,
        avatar: profile.avatar,
        bio: profile.bio,
        expertise: profile.expertise,
        experience: profile.experience,
        certifications: profile.certifications,
        socialLinks: profile.socialLinks,
        rating: profile.rating,
        totalReviews: profile.totalReviews,
        totalMentees: profile.totalMentees,
        activeMentees: profile.activeMentees,
        completedSessions: profile.completedSessions,
        isAvailable: profile.isAvailable,
        maxMentees: profile.maxMentees,
        isPubliclyVisible: profile.isPubliclyVisible,
        isVerified: profile.isVerified,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt
      }
    });

  } catch (err) {
    console.error("GET MY COACH PROFILE ERROR:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};

export const updateMyCoachProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const updates = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isApprovedCoach) {
      return res.status(403).json({
        message: "You are not an approved coach"
      });
    }

    const allowedUpdates = [
      'displayName',
      'avatar',
      'bio',
      'expertise',
      'experience',
      'certifications',
      'socialLinks',
      'isAvailable',
      'maxMentees',
      'isPubliclyVisible'
    ];

    const restrictedFields = [
      'userId',
      'coachRequestId',
      'rating',
      'totalReviews',
      'totalMentees',
      'activeMentees',
      'completedSessions',
      'isVerified',
      'verifiedAt'
    ];

    const attemptedRestricted = Object.keys(updates).filter(key =>
      restrictedFields.includes(key)
    );

    if (attemptedRestricted.length > 0) {
      return res.status(400).json({
        message: "Cannot update restricted fields",
        restrictedFields: attemptedRestricted
      });
    }

    const filteredUpdates = {};
    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        filteredUpdates[key] = updates[key];
      }
    });

    if (filteredUpdates.bio && filteredUpdates.bio.length > 1000) {
      return res.status(400).json({
        message: "Bio must not exceed 1000 characters"
      });
    }

    if (filteredUpdates.experience && filteredUpdates.experience.length > 1000) {
      return res.status(400).json({
        message: "Experience must not exceed 1000 characters"
      });
    }

    if (filteredUpdates.expertise) {
      if (!Array.isArray(filteredUpdates.expertise) || filteredUpdates.expertise.length === 0) {
        return res.status(400).json({
          message: "Expertise must be a non-empty array"
        });
      }
      if (filteredUpdates.expertise.length > 10) {
        return res.status(400).json({
          message: "Maximum 10 areas of expertise allowed"
        });
      }
    }

    if (filteredUpdates.maxMentees !== undefined) {
      const maxMentees = parseInt(filteredUpdates.maxMentees);
      if (isNaN(maxMentees) || maxMentees < 1 || maxMentees > 100) {
        return res.status(400).json({
          message: "Max mentees must be between 1 and 100"
        });
      }
      filteredUpdates.maxMentees = maxMentees;
    }

    const profile = await CoachProfile.findOneAndUpdate(
      { userId },
      { $set: filteredUpdates },
      { new: true, runValidators: true }
    );

    if (!profile) {
      return res.status(404).json({ message: "Coach profile not found" });
    }

    res.status(200).json({
      message: "Coach profile updated successfully",
      profile: {
        id: profile._id,
        displayName: profile.displayName,
        avatar: profile.avatar,
        bio: profile.bio,
        expertise: profile.expertise,
        experience: profile.experience,
        certifications: profile.certifications,
        socialLinks: profile.socialLinks,
        isAvailable: profile.isAvailable,
        maxMentees: profile.maxMentees,
        isPubliclyVisible: profile.isPubliclyVisible,
        updatedAt: profile.updatedAt
      }
    });

  } catch (err) {
    console.error("UPDATE MY COACH PROFILE ERROR:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};