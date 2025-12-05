// src/models/Game.js
import mongoose from "mongoose";

const gameSchema = new mongoose.Schema(
  {
    // ===== BASIC INFORMATION =====
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },

    description: {
      type: String,
      required: true,
      maxlength: 2000
    },

    shortDescription: {
      type: String,
      maxlength: 300
    },

    // ===== GAME DETAILS =====
    category: {
      type: String,
      enum: ['focus', 'memory', 'puzzle', 'relaxation', 'creativity', 'strategy', 'reflex', 'other'],
      default: 'focus'
    },

    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium'
    },

    // ===== GAME FILES =====
    gameUrl: {
      type: String,
      required: true
    },

    thumbnailUrl: {
      type: String,
      default: null
    },

    coverImageUrl: {
      type: String,
      default: null
    },

    // ===== GAME MEDIA (SCREENSHOTS) =====
    screenshots: [{
      url: {
        type: String,
        required: true
      },
      fileName: String,
      fileSize: Number,
      dimensions: {
        width: Number,
        height: Number
      },
      aspectRatio: String,
      uploadedAt: {
        type: Date,
        default: Date.now
      },
      order: {
        type: Number,
        default: 0
      }
    }],

    // ===== VISIBILITY & STATUS =====
    isPublic: {
      type: Boolean,
      default: true
    },

    isActive: {
      type: Boolean,
      default: true
    },

    isFeatured: {
      type: Boolean,
      default: false
    },

    isPremium: {
      type: Boolean,
      default: false
    },

    // ===== SUBMISSION & REVIEW STATUS =====
    submissionStatus: {
      type: String,
      enum: ['Draft', 'In Review', 'Changes Requested', 'Approved', 'Published', 'Rejected'],
      default: 'Draft'
    },

    isLocked: {
      type: Boolean,
      default: false // Locked during review
    },

    submittedForReviewAt: {
      type: Date,
      default: null
    },

    lastReviewedAt: {
      type: Date,
      default: null
    },

    lastReviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },

    approvedAt: {
      type: Date,
      default: null
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },

    publishedAt: {
      type: Date,
      default: null
    },

    rejectedAt: {
      type: Date,
      default: null
    },

    rejectionReason: {
      type: String,
      maxlength: 2000,
      default: null
    },

    reviewerComments: {
      type: String,
      maxlength: 5000,
      default: null
    },

    requestedChanges: [{
      change: {
        type: String,
        required: true
      },
      priority: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Critical'],
        default: 'Medium'
      },
      category: {
        type: String,
        enum: ['Functionality', 'Policy Compliance', 'Content', 'Performance', 'UI/UX', 'Documentation', 'Other'],
        default: 'Other'
      },
      resolved: {
        type: Boolean,
        default: false
      },
      resolvedAt: {
        type: Date,
        default: null
      }
    }],

    // ===== DEVELOPER INFO =====
    developerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    developerName: {
      type: String,
      required: true
    },

    // ===== GAME SETTINGS =====
    minPlayTime: {
      type: Number, // in seconds
      default: 60
    },

    maxPlayTime: {
      type: Number, // in seconds
      default: 600
    },

    avgPlayTime: {
      type: Number, // in seconds
      default: 180
    },

    // ===== ANALYTICS =====
    totalPlays: {
      type: Number,
      default: 0
    },

    totalPlayers: {
      type: Number,
      default: 0
    },

    totalPlayTime: {
      type: Number, // in seconds
      default: 0
    },

    averageSessionLength: {
      type: Number, // in seconds
      default: 0
    },

    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },

    totalRatings: {
      type: Number,
      default: 0
    },

    // ===== METADATA =====
    tags: {
      type: [String],
      default: []
    },

    version: {
      type: String,
      default: '1.0.0'
    },

    lastModifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  },
  {
    timestamps: true
  }
);

// ===== INDEXES =====
gameSchema.index({ isPublic: 1, isActive: 1 });
gameSchema.index({ category: 1 });
gameSchema.index({ developerId: 1 });
gameSchema.index({ totalPlays: -1 });
gameSchema.index({ submissionStatus: 1 });
gameSchema.index({ submittedForReviewAt: -1 });

export default mongoose.model("Game", gameSchema);
