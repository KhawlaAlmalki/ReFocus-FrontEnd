// src/controllers/userController.js
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import multer from "multer";
import path from "path";
import fs from "fs";
import { validatePassword, validateEmail, validateName } from "../utils/validation.js";
import { sendVerificationEmail } from "../utils/emailService.js";

export const getProfile = async (req, res) => {
  try {
    console.log("=== GET PROFILE CALLED - NEW VERSION ===");
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.avatar,
        focusGoal: user.bio, // Using bio as focusGoal for now
        isVerified: user.isEmailVerified,
        bio: user.bio,
        specialization: user.specialization,
        yearsOfExperience: user.yearsOfExperience,
        phone: user.phone,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        isApprovedCoach: user.isApprovedCoach,
        isPendingCoach: user.isPendingCoach,
        preferences: user.preferences,
        lastLogin: user.lastLogin,
        loginCount: user.loginCount,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (err) {
    console.error("GET PROFILE ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, email, profilePicture, bio, specialization, yearsOfExperience } = req.body;

    const errors = [];
    let emailChanged = false;

    // Get current user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Validate and update name if provided
    if (name !== undefined) {
      const nameValidation = validateName(name);
      if (!nameValidation.isValid) {
        errors.push(nameValidation.error);
      } else {
        user.name = name;
      }
    }

    // Validate and update email if provided
    if (email !== undefined && email !== user.email) {
      const emailValidation = validateEmail(email);
      if (!emailValidation.isValid) {
        errors.push(emailValidation.error);
      } else {
        // Check if email already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser && existingUser._id.toString() !== userId) {
          return res.status(409).json({
            success: false,
            message: "Email is already in use by another account"
          });
        }

        // Email change requires re-verification
        user.email = email.toLowerCase();
        user.isEmailVerified = false;

        // Generate new verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        user.verificationToken = verificationToken;
        user.verificationTokenExpires = verificationTokenExpires;
        emailChanged = true;

        // Send verification email to new address
        try {
          await sendVerificationEmail(user.email, user.name, verificationToken);
        } catch (emailError) {
          console.error('Failed to send verification email:', emailError);
        }
      }
    }

    // Update profile picture if provided
    if (profilePicture !== undefined) {
      // Simple URL validation
      if (profilePicture && !profilePicture.startsWith('http')) {
        errors.push("Profile picture must be a valid URL");
      } else {
        user.avatar = profilePicture;
      }
    }

    // Update bio if provided
    if (bio !== undefined) {
      if (bio && bio.length > 500) {
        errors.push("Bio must not exceed 500 characters");
      } else {
        user.bio = bio;
      }
    }

    // Update specialization if provided (coach profile field)
    if (specialization !== undefined) {
      if (specialization && specialization.length > 200) {
        errors.push("Specialization must not exceed 200 characters");
      } else {
        user.specialization = specialization;
      }
    }

    // Update years of experience if provided (coach profile field)
    if (yearsOfExperience !== undefined) {
      const years = Number(yearsOfExperience);
      if (isNaN(years)) {
        errors.push("Years of experience must be a valid number");
      } else if (years < 0 || years > 100) {
        errors.push("Years of experience must be between 0 and 100");
      } else {
        user.yearsOfExperience = years;
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors
      });
    }

    // Save the updated user
    await user.save();

    const response = {
      success: true,
      message: emailChanged
        ? "Profile updated. Please verify your new email address."
        : "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.avatar,
        bio: user.bio,
        specialization: user.specialization,
        yearsOfExperience: user.yearsOfExperience,
        isVerified: user.isEmailVerified
      }
    };

    if (emailChanged) {
      response.emailChanged = true;
    }

    res.status(200).json(response);

  } catch (err) {
    console.error("UPDATE PROFILE ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Validate required fields
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password, new password, and confirm password are required"
      });
    }

    // Check if new password and confirm password match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match"
      });
    }

    // Validate new password strength
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: "New password does not meet requirements",
        errors: passwordValidation.errors
      });
    }

    // Find user
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect"
      });
    }

    // Check if new password is same as current
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from current password"
      });
    }

    // Update password
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully"
    });

  } catch (err) {
    console.error("CHANGE PASSWORD ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
        specialization: user.specialization,
        yearsOfExperience: user.yearsOfExperience,
        isApprovedCoach: user.isApprovedCoach,
        createdAt: user.createdAt
      }
    });

  } catch (err) {
    console.error("GET USER BY ID ERROR:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};

// Get public coach profile (accessible to all authenticated users)
export const getCoachProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.coachId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Coach not found"
      });
    }

    // Only show profile if user is an approved coach
    if (!user.isApprovedCoach) {
      return res.status(403).json({
        success: false,
        message: "This user is not an approved coach"
      });
    }

    res.status(200).json({
      success: true,
      coach: {
        id: user._id,
        name: user.name,
        avatar: user.avatar,
        bio: user.bio,
        specialization: user.specialization,
        yearsOfExperience: user.yearsOfExperience,
        createdAt: user.createdAt
      }
    });

  } catch (err) {
    console.error("GET COACH PROFILE ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message
    });
  }
};

// Get all approved coaches (accessible to all authenticated users)
export const getAllCoaches = async (req, res) => {
  try {
    const coaches = await User.find({ isApprovedCoach: true })
      .select('name avatar bio specialization yearsOfExperience createdAt')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: coaches.length,
      coaches: coaches.map(coach => ({
        id: coach._id,
        name: coach.name,
        avatar: coach.avatar,
        bio: coach.bio,
        specialization: coach.specialization,
        yearsOfExperience: coach.yearsOfExperience,
        createdAt: coach.createdAt
      }))
    });

  } catch (err) {
    console.error("GET ALL COACHES ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message
    });
  }
};

// Configure multer for profile picture uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/profile-pictures';
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + req.user.userId + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Accept only image files
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files (jpg, jpeg, png, gif) are allowed'));
  }
};

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max file size
  },
  fileFilter: fileFilter
});

// Upload profile picture
export const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded"
      });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      // Delete uploaded file if user not found
      fs.unlinkSync(req.file.path);
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Delete old profile picture if exists
    if (user.avatar && user.avatar.startsWith('/uploads/')) {
      const oldFilePath = user.avatar.replace(/^\//, '');
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    // Save new profile picture path
    const pictureUrl = `/uploads/profile-pictures/${req.file.filename}`;
    user.avatar = pictureUrl;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile picture uploaded successfully",
      profilePicture: pictureUrl
    });

  } catch (err) {
    // Delete uploaded file if error occurs
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    console.error("UPLOAD PROFILE PICTURE ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error while uploading profile picture",
      error: err.message
    });
  }
};

// Delete profile picture
export const deleteProfilePicture = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (!user.avatar) {
      return res.status(400).json({
        success: false,
        message: "No profile picture to delete"
      });
    }

    // Delete file from storage if it's a local file
    if (user.avatar.startsWith('/uploads/')) {
      const filePath = user.avatar.replace(/^\//, '');
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (fileErr) {
          console.error("Error deleting file:", fileErr);
        }
      }
    }

    // Remove avatar from user document
    user.avatar = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile picture deleted successfully"
    });

  } catch (err) {
    console.error("DELETE PROFILE PICTURE ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error while deleting profile picture",
      error: err.message
    });
  }
};