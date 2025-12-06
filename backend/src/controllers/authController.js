// src/controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { validatePassword, validateEmail, validateName, sanitizeInput } from "../utils/validation.js";

export const register = async (req, res) => {
  try {
    let { name, email, password } = req.body;

    name = sanitizeInput(name);
    email = sanitizeInput(email);

    const nameValidation = validateName(name);
    if (!nameValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: nameValidation.error
      });
    }

    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: emailValidation.error
      });
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: passwordValidation.errors[0] || "Password does not meet requirements"
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // NO EMAIL VERIFICATION - Create user as verified immediately
    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      isEmailVerified: true, // Auto-verified
      verificationToken: null,
      verificationTokenExpires: null
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      userId: newUser._id
    });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error during registration",
      error: err.message,
    });
  }
};

// ===== EMAIL VERIFICATION REMOVED =====
// No longer needed - users are auto-verified on registration

// Get current user profile
export const getCurrentUser = async (req, res) => {
  try {
    // req.user is set by auth middleware
    const userId = req.user.userId;

    const user = await User.findById(userId).select('-password -verificationToken -verificationTokenExpires');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "User data loaded",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isEmailVerified,
        profilePicture: user.avatar,
        bio: user.bio,
        goal: user.goal,
        phone: user.phone,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        preferences: user.preferences,
        isActive: user.isActive,
        isApprovedCoach: user.isApprovedCoach,
        isPendingCoach: user.isPendingCoach,
        coachProfileId: user.coachProfileId,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
        loginCount: user.loginCount
      }
    });

  } catch (err) {
    console.error("GET CURRENT USER ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error while fetching user profile",
      error: err.message
    });
  }
};

// Update current user profile (name, email, goal only)
export const updateCurrentUser = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, email, goal } = req.body;

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
        return res.status(400).json({
          success: false,
          message: nameValidation.error
        });
      }
      user.name = name;
    }

    // Validate and update email if provided
    if (email !== undefined && email !== user.email) {
      const emailValidation = validateEmail(email);
      if (!emailValidation.isValid) {
        return res.status(400).json({
          success: false,
          message: emailValidation.error
        });
      }

      // Check if email already exists
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser && existingUser._id.toString() !== userId) {
        return res.status(409).json({
          success: false,
          message: "Email is already in use by another account"
        });
      }

      user.email = email.toLowerCase();
    }

    // Update goal if provided
    if (goal !== undefined) {
      if (goal && goal.length > 200) {
        return res.status(400).json({
          success: false,
          message: "Goal must not exceed 200 characters"
        });
      }
      user.goal = goal;
    }

    // Save the updated user
    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isEmailVerified,
        profilePicture: user.avatar,
        bio: user.bio,
        goal: user.goal,
        phone: user.phone,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        preferences: user.preferences,
        isActive: user.isActive,
        isApprovedCoach: user.isApprovedCoach,
        isPendingCoach: user.isPendingCoach,
        coachProfileId: user.coachProfileId,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
        loginCount: user.loginCount
      }
    });

  } catch (err) {
    console.error("UPDATE CURRENT USER ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error while updating profile",
      error: err.message
    });
  }
};

// Logout user
export const logout = async (req, res) => {
  try {
    // In a stateless JWT system, logout is handled client-side by removing the token
    // However, we can log this event or implement token blacklisting if needed

    // For now, just return success
    // Client should remove the token from storage
    res.status(200).json({
      success: true,
      message: "Logged out successfully"
    });

  } catch (err) {
    console.error("LOGOUT ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error during logout",
      error: err.message
    });
  }
};