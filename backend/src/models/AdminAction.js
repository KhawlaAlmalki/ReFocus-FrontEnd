// src/models/AdminAction.js
import mongoose from "mongoose";

const adminActionSchema = new mongoose.Schema(
  {
    // ===== ACTION DETAILS =====
    actionType: {
      type: String,
      enum: ['deactivate', 'activate', 'ban', 'unban', 'delete', 'update', 'password_reset'],
      required: true
    },

    reason: {
      type: String,
      required: true,
      maxlength: 1000
    },

    // ===== TARGET USER =====
    targetUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    targetUserEmail: {
      type: String,
      required: true
    },

    targetUserName: {
      type: String,
      required: true
    },

    // ===== ADMIN WHO PERFORMED ACTION =====
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    adminEmail: {
      type: String,
      required: true
    },

    adminName: {
      type: String,
      required: true
    },

    // ===== ADDITIONAL DETAILS =====
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },

    ipAddress: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// ===== INDEXES =====
adminActionSchema.index({ targetUserId: 1, createdAt: -1 });
adminActionSchema.index({ adminId: 1, createdAt: -1 });
adminActionSchema.index({ actionType: 1, createdAt: -1 });

export default mongoose.model("AdminAction", adminActionSchema);
