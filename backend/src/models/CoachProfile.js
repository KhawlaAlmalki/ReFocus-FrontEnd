// src/models/CoachProfile.js
import mongoose from "mongoose";

const coachProfileSchema = new mongoose.Schema(
  {
    // ===== LINKED USER =====
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },

    coachRequestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CoachRequest',
      required: true
    },

    // ===== PUBLIC PROFILE =====
    displayName: {
      type: String,
      required: true
    },

    avatar: {
      type: String,
      default: null
    },

    bio: {
      type: String,
      required: true,
      maxlength: 1000
    },

    expertise: {
      type: [String],
      required: true
    },

    experience: {
      type: String,
      required: true,
      maxlength: 1000
    },

    certifications: [{
      name: { type: String },
      issuer: { type: String },
      year: { type: Number },
      certificateUrl: { type: String }
    }],

    // ===== SOCIAL LINKS =====
    socialLinks: {
      linkedin: { type: String },
      website: { type: String },
      twitter: { type: String },
      instagram: { type: String }
    },

    // ===== COACH STATS =====
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },

    totalReviews: {
      type: Number,
      default: 0
    },

    totalMentees: {
      type: Number,
      default: 0
    },

    activeMentees: {
      type: Number,
      default: 0
    },

    completedSessions: {
      type: Number,
      default: 0
    },

    // ===== AVAILABILITY =====
    isAvailable: {
      type: Boolean,
      default: true
    },

    maxMentees: {
      type: Number,
      default: 10
    },

    // ===== SETTINGS =====
    isPubliclyVisible: {
      type: Boolean,
      default: true
    },

    // ===== VERIFICATION =====
    isVerified: {
      type: Boolean,
      default: false
    },

    verifiedAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

export default mongoose.model("CoachProfile", coachProfileSchema);