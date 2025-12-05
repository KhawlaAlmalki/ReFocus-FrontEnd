// src/models/GameSession.js
import mongoose from "mongoose";

const gameSessionSchema = new mongoose.Schema(
  {
    // ===== REFERENCES =====
    gameId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Game',
      required: true
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    // ===== SESSION DETAILS =====
    startTime: {
      type: Date,
      required: true,
      default: Date.now
    },

    endTime: {
      type: Date,
      default: null
    },

    duration: {
      type: Number, // in seconds
      default: 0
    },

    // ===== SESSION DATA =====
    score: {
      type: Number,
      default: null
    },

    level: {
      type: Number,
      default: 1
    },

    completed: {
      type: Boolean,
      default: false
    },

    // ===== DEVICE & PLATFORM =====
    deviceType: {
      type: String,
      enum: ['desktop', 'mobile', 'tablet', 'unknown'],
      default: 'unknown'
    },

    browser: {
      type: String,
      default: null
    },

    os: {
      type: String,
      default: null
    },

    // ===== SESSION METADATA =====
    sessionData: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },

    // ===== ENGAGEMENT METRICS =====
    interactions: {
      type: Number,
      default: 0
    },

    pauseCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// ===== INDEXES =====
gameSessionSchema.index({ gameId: 1, createdAt: -1 });
gameSessionSchema.index({ userId: 1, createdAt: -1 });
gameSessionSchema.index({ startTime: 1 });
gameSessionSchema.index({ gameId: 1, userId: 1, createdAt: -1 });

export default mongoose.model("GameSession", gameSessionSchema);
