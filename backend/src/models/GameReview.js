// src/models/GameReview.js
import mongoose from "mongoose";

const gameReviewSchema = new mongoose.Schema({
  // ============================================
  // Review Identity
  // ============================================

  gameId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    required: true
  },

  versionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GameVersion',
    default: null
  },

  reviewerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // ============================================
  // Review Details
  // ============================================

  reviewType: {
    type: String,
    enum: ['Initial Submission', 'Resubmission', 'Update Review', 'Policy Review'],
    required: true
  },

  status: {
    type: String,
    enum: ['Approved', 'Changes Requested', 'Rejected'],
    required: true
  },

  // ============================================
  // Review Feedback
  // ============================================

  overallComments: {
    type: String,
    maxlength: 5000,
    default: null
  },

  // Functional Testing
  functionalityTest: {
    passed: {
      type: Boolean,
      default: null
    },
    comments: {
      type: String,
      maxlength: 2000,
      default: null
    },
    issues: [{
      description: String,
      severity: {
        type: String,
        enum: ['Minor', 'Major', 'Critical']
      }
    }]
  },

  // Policy Compliance
  policyCompliance: {
    passed: {
      type: Boolean,
      default: null
    },
    comments: {
      type: String,
      maxlength: 2000,
      default: null
    },
    violations: [{
      policy: String,
      description: String,
      severity: {
        type: String,
        enum: ['Minor', 'Major', 'Critical']
      }
    }]
  },

  // Content Review
  contentReview: {
    appropriate: {
      type: Boolean,
      default: null
    },
    comments: {
      type: String,
      maxlength: 2000,
      default: null
    },
    concerns: [{
      type: String,
      enum: ['Violent Content', 'Inappropriate Language', 'Mature Themes', 'Copyright Concerns', 'Other']
    }]
  },

  // Performance Testing
  performanceTest: {
    passed: {
      type: Boolean,
      default: null
    },
    comments: {
      type: String,
      maxlength: 2000,
      default: null
    },
    metrics: {
      loadTime: Number, // in milliseconds
      fps: Number,
      memory: Number // in MB
    }
  },

  // UI/UX Evaluation
  uiuxEvaluation: {
    passed: {
      type: Boolean,
      default: null
    },
    comments: {
      type: String,
      maxlength: 2000,
      default: null
    }
  },

  // ============================================
  // Requested Changes
  // ============================================

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
    mustFix: {
      type: Boolean,
      default: false
    }
  }],

  // ============================================
  // Rejection Information
  // ============================================

  rejectionReason: {
    type: String,
    maxlength: 2000,
    default: null
  },

  canResubmit: {
    type: Boolean,
    default: true
  },

  // ============================================
  // Review Timeline
  // ============================================

  startedAt: {
    type: Date,
    default: Date.now
  },

  completedAt: {
    type: Date,
    default: null
  },

  reviewDuration: {
    type: Number, // in minutes
    default: null
  },

  // ============================================
  // Developer Response
  // ============================================

  developerResponse: {
    responded: {
      type: Boolean,
      default: false
    },
    responseText: {
      type: String,
      maxlength: 2000,
      default: null
    },
    respondedAt: {
      type: Date,
      default: null
    }
  },

  // ============================================
  // Follow-up
  // ============================================

  requiresFollowUp: {
    type: Boolean,
    default: false
  },

  followUpReviewId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GameReview',
    default: null
  },

  isFollowUp: {
    type: Boolean,
    default: false
  },

  previousReviewId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GameReview',
    default: null
  }

}, {
  timestamps: true
});

// ============================================
// INDEXES
// ============================================

gameReviewSchema.index({ gameId: 1, createdAt: -1 });
gameReviewSchema.index({ reviewerId: 1 });
gameReviewSchema.index({ status: 1 });
gameReviewSchema.index({ completedAt: -1 });

// ============================================
// METHODS
// ============================================

// Check if all tests passed
gameReviewSchema.methods.allTestsPassed = function() {
  return (
    (this.functionalityTest.passed === null || this.functionalityTest.passed === true) &&
    (this.policyCompliance.passed === null || this.policyCompliance.passed === true) &&
    (this.contentReview.appropriate === null || this.contentReview.appropriate === true) &&
    (this.performanceTest.passed === null || this.performanceTest.passed === true) &&
    (this.uiuxEvaluation.passed === null || this.uiuxEvaluation.passed === true)
  );
};

// Get review summary
gameReviewSchema.methods.getSummary = function() {
  return {
    id: this._id,
    reviewType: this.reviewType,
    status: this.status,
    allTestsPassed: this.allTestsPassed(),
    requestedChangesCount: this.requestedChanges.length,
    criticalChangesCount: this.requestedChanges.filter(c => c.priority === 'Critical').length,
    completedAt: this.completedAt,
    reviewDuration: this.reviewDuration,
    requiresFollowUp: this.requiresFollowUp
  };
};

// Calculate review duration
gameReviewSchema.methods.calculateDuration = function() {
  if (this.completedAt && this.startedAt) {
    const duration = Math.round((this.completedAt - this.startedAt) / (1000 * 60)); // minutes
    this.reviewDuration = duration;
  }
};

// ============================================
// STATICS
// ============================================

// Get latest review for a game
gameReviewSchema.statics.getLatestReview = async function(gameId) {
  return this.findOne({ gameId })
    .sort({ createdAt: -1 })
    .populate('reviewerId', 'name email')
    .exec();
};

// Get all reviews for a game
gameReviewSchema.statics.getAllReviews = async function(gameId) {
  return this.find({ gameId })
    .sort({ createdAt: -1 })
    .populate('reviewerId', 'name email')
    .exec();
};

// Get pending reviews for a reviewer
gameReviewSchema.statics.getPendingReviews = async function(reviewerId) {
  return this.find({
    reviewerId,
    completedAt: null
  })
  .sort({ startedAt: 1 })
  .populate('gameId', 'title developerName')
  .exec();
};

const GameReview = mongoose.model("GameReview", gameReviewSchema);

export default GameReview;
