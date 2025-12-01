// src/controllers/userController.js
import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

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
        isApprovedCoach: user.isApprovedCoach,
        isPendingCoach: user.isPendingCoach,
        preferences: user.preferences,
        isEmailVerified: user.isEmailVerified,
        lastLogin: user.lastLogin,
        loginCount: user.loginCount,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (err) {
    console.error("GET PROFILE ERROR:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const updates = req.body;

    const allowedUpdates = [
      'name',
      'bio',
      'phone',
      'dateOfBirth',
      'gender',
      'avatar',
      'preferences'
    ];

    const restrictedFields = [
      'email',
      'password',
      'role',
      'isApprovedCoach',
      'isPendingCoach',
      'coachRequestId',
      'coachProfileId',
      'isEmailVerified',
      'isActive',
      'isBanned',
      'lastLogin',
      'loginCount'
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

    if (filteredUpdates.preferences) {
      const prefs = filteredUpdates.preferences;

      if (prefs.theme && !['light', 'dark', 'auto'].includes(prefs.theme)) {
        return res.status(400).json({
          message: "Invalid theme value. Must be 'light', 'dark', or 'auto'"
        });
      }

      if (prefs.gender && !['male', 'female', 'other', 'prefer-not-to-say'].includes(prefs.gender)) {
        return res.status(400).json({
          message: "Invalid gender value"
        });
      }
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: filteredUpdates },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
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
        updatedAt: user.updatedAt
      }
    });

  } catch (err) {
    console.error("UPDATE PROFILE ERROR:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required"
      });
    }

    const { validatePassword } = await import("../utils/validation.js");

    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        message: "New password does not meet requirements",
        errors: passwordValidation.errors
      });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({
        message: "New password must be different from current password"
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({
      message: "Password changed successfully"
    });

  } catch (err) {
    console.error("CHANGE PASSWORD ERROR:", err);
    res.status(500).json({
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