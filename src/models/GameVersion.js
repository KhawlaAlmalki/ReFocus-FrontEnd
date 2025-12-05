// src/models/GameVersion.js
import mongoose from "mongoose";

const gameVersionSchema = new mongoose.Schema({
  // ============================================
  // Version Identity
  // ============================================

  gameId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    required: true
  },

  versionNumber: {
    type: String,
    required: true // e.g., "1.0.0", "1.1.0", "2.0.0"
  },

  versionTag: {
    type: String,
    default: null // e.g., "beta", "stable", "hotfix"
  },

  // ============================================
  // Snapshot of Game Data at This Version
  // ============================================

  snapshot: {
    // Basic Information
    title: String,
    description: String,
    shortDescription: String,

    // Game Details
    category: String,
    difficulty: String,

    // Files
    gameUrl: String,
    thumbnailUrl: String,
    coverImageUrl: String,
    screenshots: [{
      url: String,
      fileName: String,
      dimensions: {
        width: Number,
        height: Number
      },
      aspectRatio: String
    }],

    // Settings
    minPlayTime: Number,
    maxPlayTime: Number,
    avgPlayTime: Number,
    tags: [String],

    // License snapshot (if exists)
    hasLicense: Boolean,
    licenseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'License'
    }
  },

  // ============================================
  // Version Status & Approval
  // ============================================

  status: {
    type: String,
    enum: ['Draft', 'In Review', 'Changes Requested', 'Approved', 'Published', 'Rejected', 'Reverted'],
    default: 'Draft'
  },

  isApproved: {
    type: Boolean,
    default: false
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

  isPublished: {
    type: Boolean,
    default: false
  },

  publishedAt: {
    type: Date,
    default: null
  },

  // ============================================
  // Review Information
  // ============================================

  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },

  reviewedAt: {
    type: Date,
    default: null
  },

  reviewerComments: {
    type: String,
    maxlength: 5000,
    default: null
  },

  rejectionReason: {
    type: String,
    maxlength: 2000,
    default: null
  },

  // ============================================
  // Version Metadata
  // ============================================

  changeLog: {
    type: String,
    maxlength: 5000,
    default: null
  },

  changes: [{
    type: {
      type: String,
      enum: ['Feature', 'Bugfix', 'Enhancement', 'Breaking Change', 'Other'],
      required: true
    },
    description: {
      type: String,
      required: true
    }
  }],

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Track if this version is currently active
  isCurrentVersion: {
    type: Boolean,
    default: false
  },

  // Track if this is a rollback/revert
  isRevert: {
    type: Boolean,
    default: false
  },

  revertedFrom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GameVersion',
    default: null
  },

  revertedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GameVersion',
    default: null
  },

  revertedAt: {
    type: Date,
    default: null
  },

  revertedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },

  // ============================================
  // File Checksums (for integrity verification)
  // ============================================

  checksums: {
    gameFile: String,
    coverImage: String,
    thumbnail: String
  },

  // Size information
  totalSize: {
    type: Number,
    default: 0 // in bytes
  }

}, {
  timestamps: true
});

// ============================================
// INDEXES
// ============================================

gameVersionSchema.index({ gameId: 1, createdAt: -1 });
gameVersionSchema.index({ gameId: 1, versionNumber: 1 });
gameVersionSchema.index({ gameId: 1, isCurrentVersion: 1 });
gameVersionSchema.index({ status: 1 });
gameVersionSchema.index({ isApproved: 1, isPublished: 1 });

// ============================================
// METHODS
// ============================================

// Check if this version can be reverted to
gameVersionSchema.methods.canRevertTo = function() {
  return this.isApproved && this.status !== 'Rejected' && !this.isRevert;
};

// Get version summary
gameVersionSchema.methods.getSummary = function() {
  return {
    id: this._id,
    versionNumber: this.versionNumber,
    versionTag: this.versionTag,
    status: this.status,
    isApproved: this.isApproved,
    isCurrentVersion: this.isCurrentVersion,
    isRevert: this.isRevert,
    approvedAt: this.approvedAt,
    publishedAt: this.publishedAt,
    createdAt: this.createdAt,
    canRevertTo: this.canRevertTo()
  };
};

// Format size for display
gameVersionSchema.methods.getFormattedSize = function() {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (this.totalSize === 0) return '0 Bytes';
  const i = Math.floor(Math.log(this.totalSize) / Math.log(1024));
  return Math.round(this.totalSize / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
};

// ============================================
// STATICS
// ============================================

// Get latest approved version for a game
gameVersionSchema.statics.getLatestApproved = async function(gameId) {
  return this.findOne({
    gameId,
    isApproved: true,
    status: { $ne: 'Rejected' }
  })
  .sort({ approvedAt: -1 })
  .exec();
};

// Get current active version for a game
gameVersionSchema.statics.getCurrentVersion = async function(gameId) {
  return this.findOne({
    gameId,
    isCurrentVersion: true
  }).exec();
};

// Get all versions for a game
gameVersionSchema.statics.getAllVersions = async function(gameId) {
  return this.find({ gameId })
    .sort({ createdAt: -1 })
    .populate('createdBy', 'name email')
    .populate('approvedBy', 'name email')
    .populate('reviewedBy', 'name email')
    .exec();
};

const GameVersion = mongoose.model("GameVersion", gameVersionSchema);

export default GameVersion;
