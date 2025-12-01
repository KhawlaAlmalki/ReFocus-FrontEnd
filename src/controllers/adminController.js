// src/controllers/adminController.js
import User from "../models/User.js";
import CoachRequest from "../models/CoachRequest.js";
import CoachProfile from "../models/CoachProfile.js";
import bcrypt from "bcryptjs";

export const getAllUsers = async (req, res) => {
  try {
    const {
      role,
      isActive,
      isBanned,
      search,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const filter = {};

    if (role) {
      filter.role = role;
    }

    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    if (isBanned !== undefined) {
      filter.isBanned = isBanned === 'true';
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    const users = await User.find(filter)
      .select('-password')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('coachProfileId', 'rating totalMentees');

    const totalUsers = await User.countDocuments(filter);

    res.status(200).json({
      users: users.map(user => ({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
        phone: user.phone,
        isActive: user.isActive,
        isBanned: user.isBanned,
        isEmailVerified: user.isEmailVerified,
        isPendingCoach: user.isPendingCoach,
        isApprovedCoach: user.isApprovedCoach,
        lastLogin: user.lastLogin,
        loginCount: user.loginCount,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        coachProfile: user.coachProfileId || null
      })),
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalUsers / parseInt(limit)),
        totalUsers,
        limit: parseInt(limit)
      }
    });

  } catch (err) {
    console.error("GET ALL USERS ERROR:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};

export const getUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId)
      .select('-password')
      .populate('coachRequestId')
      .populate('coachProfileId');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
        phone: user.phone,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        preferences: user.preferences,
        isActive: user.isActive,
        isBanned: user.isBanned,
        isEmailVerified: user.isEmailVerified,
        isPendingCoach: user.isPendingCoach,
        isApprovedCoach: user.isApprovedCoach,
        coachRequest: user.coachRequestId || null,
        coachProfile: user.coachProfileId || null,
        lastLogin: user.lastLogin,
        loginCount: user.loginCount,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });

  } catch (err) {
    console.error("GET USER DETAILS ERROR:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;

    const allowedUpdates = [
      'name',
      'email',
      'role',
      'avatar',
      'bio',
      'phone',
      'dateOfBirth',
      'gender',
      'isActive',
      'isBanned',
      'isEmailVerified',
      'preferences'
    ];

    const filteredUpdates = {};
    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        filteredUpdates[key] = updates[key];
      }
    });

    if (filteredUpdates.role) {
      const validRoles = ['user', 'coach', 'admin', 'developer'];
      if (!validRoles.includes(filteredUpdates.role)) {
        return res.status(400).json({
          message: "Invalid role. Must be: user, coach, admin, or developer"
        });
      }
    }

    if (filteredUpdates.email) {
      const existingUser = await User.findOne({
        email: filteredUpdates.email,
        _id: { $ne: userId }
      });

      if (existingUser) {
        return res.status(409).json({ message: "Email already in use" });
      }
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: filteredUpdates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
        phone: user.phone,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        isActive: user.isActive,
        isBanned: user.isBanned,
        isEmailVerified: user.isEmailVerified,
        preferences: user.preferences,
        updatedAt: user.updatedAt
      }
    });

  } catch (err) {
    console.error("UPDATE USER ERROR:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};

export const resetUserPassword = async (req, res) => {
  try {
    const { userId } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ message: "New password is required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters"
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({
      message: "Password reset successfully",
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });

  } catch (err) {
    console.error("RESET USER PASSWORD ERROR:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};

export const deactivateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isActive) {
      return res.status(400).json({ message: "User is already deactivated" });
    }

    user.isActive = false;
    await user.save();

    res.status(200).json({
      message: "User deactivated successfully",
      reason: reason || "No reason provided",
      user: {
        id: user._id,
        email: user.email,
        isActive: user.isActive
      }
    });

  } catch (err) {
    console.error("DEACTIVATE USER ERROR:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};

export const activateUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isActive) {
      return res.status(400).json({ message: "User is already active" });
    }

    user.isActive = true;
    await user.save();

    res.status(200).json({
      message: "User activated successfully",
      user: {
        id: user._id,
        email: user.email,
        isActive: user.isActive
      }
    });

  } catch (err) {
    console.error("ACTIVATE USER ERROR:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};

export const banUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({ message: "Ban reason is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isBanned) {
      return res.status(400).json({ message: "User is already banned" });
    }

    user.isBanned = true;
    user.isActive = false;
    await user.save();

    res.status(200).json({
      message: "User banned successfully",
      reason,
      user: {
        id: user._id,
        email: user.email,
        isBanned: user.isBanned,
        isActive: user.isActive
      }
    });

  } catch (err) {
    console.error("BAN USER ERROR:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};

export const unbanUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isBanned) {
      return res.status(400).json({ message: "User is not banned" });
    }

    user.isBanned = false;
    user.isActive = true;
    await user.save();

    res.status(200).json({
      message: "User unbanned successfully",
      user: {
        id: user._id,
        email: user.email,
        isBanned: user.isBanned,
        isActive: user.isActive
      }
    });

  } catch (err) {
    console.error("UNBAN USER ERROR:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { confirmEmail } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (confirmEmail !== user.email) {
      return res.status(400).json({
        message: "Email confirmation does not match. Cannot delete user."
      });
    }

    if (user.coachRequestId) {
      await CoachRequest.findByIdAndDelete(user.coachRequestId);
    }

    if (user.coachProfileId) {
      await CoachProfile.findByIdAndDelete(user.coachProfileId);
    }

    await User.findByIdAndDelete(userId);

    res.status(200).json({
      message: "User and associated data deleted permanently",
      deletedUser: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });

  } catch (err) {
    console.error("DELETE USER ERROR:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};

export const getSystemStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const bannedUsers = await User.countDocuments({ isBanned: true });

    const totalCoaches = await User.countDocuments({ isApprovedCoach: true });
    const pendingCoachApplications = await CoachRequest.countDocuments({ status: 'pending' });

    const usersByRole = await User.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      stats: {
        totalUsers,
        activeUsers,bannedUsers,
        totalCoaches,
        pendingCoachApplications,
        usersByRole: usersByRole.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {})
      }
    });

  } catch (err) {
    console.error("GET SYSTEM STATS ERROR:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};