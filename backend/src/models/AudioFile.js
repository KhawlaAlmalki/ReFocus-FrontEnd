// src/models/AudioFile.js
import mongoose from "mongoose";

const audioFileSchema = new mongoose.Schema(
  {
    // ===== FILE INFORMATION =====
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },

    description: {
      type: String,
      maxlength: 1000
    },

    fileName: {
      type: String,
      required: true
    },

    filePath: {
      type: String,
      required: true
    },

    fileUrl: {
      type: String,
      required: true
    },

    fileSize: {
      type: Number, // in bytes
      required: true
    },

    mimeType: {
      type: String,
      required: true
    },

    // ===== AUDIO METADATA =====
    duration: {
      type: Number, // in seconds
      default: 0
    },

    format: {
      type: String, // mp3, wav, ogg, etc.
      required: true
    },

    bitrate: {
      type: Number, // in kbps
      default: null
    },

    sampleRate: {
      type: Number, // in Hz
      default: null
    },

    // ===== CATEGORIZATION =====
    category: {
      type: String,
      enum: [
        'meditation',
        'focus',
        'sleep',
        'relaxation',
        'nature_sounds',
        'breathing',
        'guided_meditation',
        'music',
        'affirmations',
        'white_noise',
        'binaural_beats',
        'other'
      ],
      default: 'meditation'
    },

    tags: {
      type: [String],
      default: []
    },

    // ===== VISIBILITY & ACCESS =====
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

    // ===== ADDITIONAL INFO =====
    artist: {
      type: String,
      maxlength: 100
    },

    narrator: {
      type: String,
      maxlength: 100
    },

    language: {
      type: String,
      default: 'en'
    },

    thumbnailUrl: {
      type: String,
      default: null
    },

    coverImageUrl: {
      type: String,
      default: null
    },

    // ===== USAGE STATISTICS =====
    playCount: {
      type: Number,
      default: 0
    },

    downloadCount: {
      type: Number,
      default: 0
    },

    favoriteCount: {
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

    // ===== VERSION CONTROL =====
    version: {
      type: Number,
      default: 1
    },

    replacedFileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AudioFile',
      default: null
    },

    // ===== CREATOR & MODIFIER =====
    uploadedBy: {
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
    transcription: {
      type: String,
      maxlength: 10000
    },

    notes: {
      type: String,
      maxlength: 2000
    }
  },
  {
    timestamps: true
  }
);

// ===== INDEXES =====
audioFileSchema.index({ category: 1, isActive: 1 });
audioFileSchema.index({ isPublic: 1, isFeatured: 1 });
audioFileSchema.index({ tags: 1 });
audioFileSchema.index({ uploadedBy: 1 });
audioFileSchema.index({ playCount: -1 });

// ===== METHODS =====
audioFileSchema.methods.incrementPlayCount = function() {
  this.playCount += 1;
  return this.save();
};

audioFileSchema.methods.incrementDownloadCount = function() {
  this.downloadCount += 1;
  return this.save();
};

audioFileSchema.methods.formatFileSize = function() {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (this.fileSize === 0) return '0 Bytes';
  const i = Math.floor(Math.log(this.fileSize) / Math.log(1024));
  return Math.round(this.fileSize / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
};

audioFileSchema.methods.formatDuration = function() {
  const hours = Math.floor(this.duration / 3600);
  const minutes = Math.floor((this.duration % 3600) / 60);
  const seconds = Math.floor(this.duration % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export default mongoose.model("AudioFile", audioFileSchema);
