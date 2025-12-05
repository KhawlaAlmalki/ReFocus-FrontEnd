// src/models/Challenge.js
import mongoose from "mongoose";

const challengeSchema = new mongoose.Schema(
  {
    // ===== REFERENCE TO TEMPLATE =====
    templateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ChallengeTemplate',
      required: true
    },

    // ===== PARTICIPANT INFO =====
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    // ===== CHALLENGE DETAILS (copied from template at creation) =====
    title: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    },

    category: {
      type: String,
      required: true
    },

    difficulty: {
      type: String,
      required: true
    },

    duration: {
      value: Number,
      unit: String
    },

    targetMetric: String,
    targetValue: Number,
    targetUnit: String,

    // ===== CHALLENGE STATUS =====
    status: {
      type: String,
      enum: ['not_started', 'in_progress', 'completed', 'failed', 'abandoned'],
      default: 'not_started'
    },

    startDate: {
      type: Date,
      default: null
    },

    endDate: {
      type: Date,
      default: null
    },

    completedDate: {
      type: Date,
      default: null
    },

    // ===== PROGRESS TRACKING =====
    currentProgress: {
      type: Number,
      default: 0
    },

    progressPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },

    // ===== DAILY TRACKING =====
    dailyProgress: [{
      date: {
        type: Date,
        required: true
      },
      value: {
        type: Number,
        default: 0
      },
      notes: String,
      completed: {
        type: Boolean,
        default: false
      }
    }],

    streakCount: {
      type: Number,
      default: 0
    },

    longestStreak: {
      type: Number,
      default: 0
    },

    // ===== REWARDS =====
    pointsEarned: {
      type: Number,
      default: 0
    },

    badgeEarned: {
      type: Boolean,
      default: false
    },

    // ===== USER FEEDBACK =====
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null
    },

    review: {
      type: String,
      maxlength: 1000,
      default: null
    },

    // ===== REMINDERS =====
    reminderEnabled: {
      type: Boolean,
      default: false
    },

    reminderTime: {
      type: String, // Format: "HH:MM"
      default: null
    },

    // ===== NOTES =====
    userNotes: {
      type: String,
      maxlength: 2000
    }
  },
  {
    timestamps: true
  }
);

// ===== INDEXES =====
challengeSchema.index({ userId: 1, status: 1 });
challengeSchema.index({ templateId: 1 });
challengeSchema.index({ startDate: 1 });
challengeSchema.index({ status: 1, completedDate: -1 });

// ===== METHODS =====
challengeSchema.methods.updateProgress = function(value) {
  this.currentProgress = value;
  if (this.targetValue > 0) {
    this.progressPercentage = Math.min(100, (value / this.targetValue) * 100);
  }
  return this.save();
};

challengeSchema.methods.markAsCompleted = function() {
  this.status = 'completed';
  this.completedDate = new Date();
  this.progressPercentage = 100;
  this.badgeEarned = true;
  return this.save();
};

export default mongoose.model("Challenge", challengeSchema);
