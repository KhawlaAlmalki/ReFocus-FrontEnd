// src/routes/admin.js
import express from "express";
import {
  getAllUsers,
  getUserDetails,
  updateUser,
  resetUserPassword,
  deactivateUser,
  activateUser,
  banUser,
  unbanUser,
  deleteUser,
  getSystemStats,
  getAdminActions,
  getUserAdminActions,
  exportUsers
} from "../controllers/adminController.js";
import {
  getAllChallengeTemplates,
  getChallengeTemplateById,
  createChallengeTemplate,
  updateChallengeTemplate,
  deleteChallengeTemplate,
  getChallengeStatistics
} from "../controllers/challengeTemplateController.js";
import {
  getAllAudioFiles,
  getAudioFileById,
  uploadNewAudioFile,
  updateAudioFileMetadata,
  replaceAudioFile,
  deleteAudioFile,
  getAudioStatistics,
  uploadAudio
} from "../controllers/audioController.js";
import {
  getPlatformAnalytics,
  getUserGrowthAnalytics,
  getEngagementAnalytics
} from "../controllers/analyticsController.js";
import {
  getPendingReviews,
  startGameReview,
  submitReviewDecision
} from "../controllers/gameSubmissionController.js";
import auth from "../middleware/auth.js";
import { isAdmin } from "../middleware/roleCheck.js";

const router = express.Router();

// All admin routes require authentication and admin role
router.use(auth, isAdmin);

// System statistics
router.get("/stats", getSystemStats);

// Admin action logs
router.get("/actions", getAdminActions);
router.get("/users/:userId/actions", getUserAdminActions);

// User management
router.get("/users/export", exportUsers); // Export must come before generic routes
router.get("/users", getAllUsers);
router.get("/users/:userId", getUserDetails);
router.put("/users/:userId", updateUser);

// Password management
router.put("/users/:userId/reset-password", resetUserPassword);

// Account status management
router.put("/users/:userId/deactivate", deactivateUser);
router.put("/users/:userId/activate", activateUser);
router.put("/users/:userId/ban", banUser);
router.put("/users/:userId/unban", unbanUser);

// Permanent deletion
router.delete("/users/:userId", deleteUser);

// ============================================
// Challenge Management
// ============================================

// Challenge statistics
router.get("/challenges/stats", getChallengeStatistics);

// Challenge template CRUD
router.get("/challenges", getAllChallengeTemplates);
router.post("/challenges", createChallengeTemplate);
router.get("/challenges/:templateId", getChallengeTemplateById);
router.put("/challenges/:templateId", updateChallengeTemplate);
router.delete("/challenges/:templateId", deleteChallengeTemplate);

// ============================================
// Audio File Management
// ============================================

// Audio library statistics
router.get("/audio/stats", getAudioStatistics);

// Audio file CRUD
router.get("/audio", getAllAudioFiles);
router.post("/audio", uploadAudio.single('audioFile'), uploadNewAudioFile);
router.get("/audio/:audioId", getAudioFileById);
router.put("/audio/:audioId", updateAudioFileMetadata);
router.put("/audio/:audioId/replace", uploadAudio.single('audioFile'), replaceAudioFile);
router.delete("/audio/:audioId", deleteAudioFile);

// ============================================
// Platform Analytics Dashboard
// ============================================

router.get("/analytics/platform", getPlatformAnalytics);
router.get("/analytics/user-growth", getUserGrowthAnalytics);
router.get("/analytics/engagement", getEngagementAnalytics);

// ============================================
// Game Review Management
// ============================================

// Get games pending review
router.get("/reviews/pending", getPendingReviews);

// Start reviewing a game
router.post("/reviews/games/:gameId/start", startGameReview);

// Submit review decision
router.post("/reviews/games/:gameId/decision", submitReviewDecision);

export default router;