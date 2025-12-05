// src/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // ===== AUTHENTICATION =====
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6
    },

    // ===== ROLE & PERMISSIONS =====
    role: {
      type: String,
      enum: ['user', 'coach', 'admin', 'developer'],
      default: 'user'
    },

    // ===== COACH STATUS =====
    isPendingCoach: {
      type: Boolean,
      default: false
    },

    isApprovedCoach: {
      type: Boolean,
      default: false
    },

    coachRequestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CoachRequest',
      default: null
    },

    coachProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CoachProfile',
      default: null
    },

    // ===== PROFILE INFORMATION =====
    avatar: {
      type: String,
      default: null
    },

    bio: {
      type: String,
      default: '',
      maxlength: 500
    },

    // ===== COACH PROFILE FIELDS =====
    specialization: {
      type: String,
      default: null,
      maxlength: 200
    },

    yearsOfExperience: {
      type: Number,
      default: null,
      min: 0,
      max: 100
    },

    phone: {
      type: String,
      default: null
    },

    dateOfBirth: {
      type: Date,
      default: null
    },

    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'prefer-not-to-say', null],
      default: null
    },

    // ===== APP SETTINGS =====
    preferences: {
      language: { type: String, default: 'en' },
      theme: { type: String, enum: ['light', 'dark', 'auto'], default: 'auto' },
      notifications: {
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: true },
        sms: { type: Boolean, default: false }
      }
    },

    // ===== ACCOUNT STATUS =====
    isEmailVerified: {
      type: Boolean,
      default: false
    },

    verificationToken: {
      type: String,
      default: null
    },

    verificationTokenExpires: {
      type: Date,
      default: null
    },

    isActive: {
      type: Boolean,
      default: true
    },

    isBanned: {
      type: Boolean,
      default: false
    },

    // ===== ACCOUNT STATUS HISTORY =====
    statusChangedAt: {
      type: Date,
      default: null
    },

    statusChangedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },

    statusChangeReason: {
      type: String,
      default: null
    },

    // ===== TRACKING =====
    lastLogin: {
      type: Date,
      default: null
    },

    loginCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// ===== INDEXES =====
userSchema.index({ role: 1 });

// ===== METHODS =====
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.verificationToken;
  delete user.verificationTokenExpires;
  return user;
};

export default mongoose.model("User", userSchema);