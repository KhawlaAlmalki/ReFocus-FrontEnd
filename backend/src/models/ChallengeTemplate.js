// src/models/ChallengeTemplate.js
import mongoose from "mongoose";

const challengeTemplateSchema = new mongoose.Schema(
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
      maxlength: 500
    },

    // ===== CHALLENGE DETAILS =====
    category: {
      type: String,
      enum: [
        'focus',
        'productivity',
        'mindfulness',
        'health',
        'learning',
        'creativity',
        'social',
        'habits',
        'fitness',
        'other'
      ],
      default: 'focus'
    },

    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium'
    },

    duration: {
      value: {
        type: Number,
        required: true,
        min: 1
      },
      unit: {
        type: String,
        enum: ['days', 'weeks', 'months'],
        default: 'days'
      }
    },

    // ===== GOALS & TARGETS =====
    targetMetric: {
      type: String,
      maxlength: 100
    },

    targetValue: {
      type: Number,
      min: 0
    },

    targetUnit: {
      type: String,
      maxlength: 50
    },

    // ===== REWARDS & GAMIFICATION =====
    pointsReward: {
      type: Number,
      default: 0,
      min: 0
    },

    badgeIcon: {
      type: String,
      default: null
    },

    badgeName: {
      type: String,
      maxlength: 100
    },

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

    // ===== INSTRUCTIONS & GUIDANCE =====
    instructions: {
      type: [String],
      default: []
    },

    tips: {
      type: [String],
      default: []
    },

    resources: [{
      title: String,
      url: String,
      description: String
    }],

    // ===== MEDIA =====
    imageUrl: {
      type: String,
      default: null
    },

    iconUrl: {
      type: String,
      default: null
    },

    // ===== TRACKING & ANALYTICS =====
    totalParticipants: {
      type: Number,
      default: 0
    },

    totalCompletions: {
      type: Number,
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

    // ===== CREATOR INFO =====
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    lastModifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },

    // ===== METADATA =====
    tags: {
      type: [String],
      default: []
    },

    prerequisites: {
      type: String,
      maxlength: 500
    },

    ageRestriction: {
      type: Number,
      min: 0,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// ===== INDEXES =====
challengeTemplateSchema.index({ isPublic: 1, isActive: 1 });
challengeTemplateSchema.index({ category: 1 });
challengeTemplateSchema.index({ difficulty: 1 });
challengeTemplateSchema.index({ isFeatured: 1, createdAt: -1 });
challengeTemplateSchema.index({ tags: 1 });

// ===== METHODS =====
challengeTemplateSchema.methods.calculateCompletionRate = function() {
  if (this.totalParticipants === 0) return 0;
  return ((this.totalCompletions / this.totalParticipants) * 100).toFixed(2);
};

export default mongoose.model("ChallengeTemplate", challengeTemplateSchema);
