// src/models/CoachRequest.js
import mongoose from "mongoose";

const coachRequestSchema = new mongoose.Schema(
  {
    // ===== APPLICANT INFO =====
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    // ===== APPLICATION DETAILS =====
    expertise: {
      type: [String],
      required: true,
      validate: {
        validator: function(arr) {
          return arr.length > 0 && arr.length <= 5;
        },
        message: "Please provide 1-5 areas of expertise"
      }
    },

    bio: {
      type: String,
      required: true,
      minlength: 100,
      maxlength: 1000
    },

    experience: {
      type: String,
      required: true,
      minlength: 50,
      maxlength: 1000
    },

    certifications: [{
      name: { type: String, required: true },
      issuer: { type: String, required: true },
      year: { type: Number, required: true },
      certificateUrl: { type: String }
    }],

    socialLinks: {
      linkedin: { type: String },
      website: { type: String },
      twitter: { type: String },
      instagram: { type: String }
    },

    // ===== APPLICATION STATUS =====
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },

    // ===== ADMIN REVIEW =====
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },

    reviewedAt: {
      type: Date,
      default: null
    },

    rejectionReason: {
      type: String,
      default: null
    },

    adminNotes: {
      type: String,
      default: null
    }
  },
  { timestamps: true }
);

// ===== INDEXES =====
coachRequestSchema.index({ userId: 1 });
coachRequestSchema.index({ status: 1 });
coachRequestSchema.index({ createdAt: -1 });

export default mongoose.model("CoachRequest", coachRequestSchema);