// src/routes/dev.js
import express from "express";
import {
  getDeveloperGamesAnalytics,
  getGameDetailedAnalytics,
  getGamePerformanceTrends,
  compareGames
} from "../controllers/gameAnalyticsController.js";
import {
  getDeveloperGames,
  getGameById,
  createGame,
  updateGame,
  deleteGame,
  testDataSync,
  verifyAPIHealth,
  getSyncConfirmation
} from "../controllers/gameController.js";
import {
  uploadGameFile,
  uploadGameWithFiles,
  replaceGameFiles,
  uploadGameAssets,
  getUploadRequirements
} from "../controllers/gameUploadController.js";
import {
  uploadLicenseFile,
  getLicenseByGameId,
  submitLicenseInformation,
  uploadLicenseFiles,
  deleteLicenseFile,
  submitForReview as submitLicenseForReview,
  getLicenseRequirements,
  getDeveloperLicenses
} from "../controllers/licenseController.js";
import {
  uploadMediaFile,
  uploadCoverImage,
  uploadScreenshots,
  deleteScreenshot,
  getMediaRequirements,
  getGameMedia
} from "../controllers/gameMediaController.js";
import {
  submitGameForReview,
  getSubmissionStatus,
  markChangeResolved,
  resubmitGame,
  getDeveloperSubmissions
} from "../controllers/gameSubmissionController.js";
import {
  getGameVersions,
  getVersionDetails,
  revertToVersion,
  compareVersions,
  getVersionApprovalHistory
} from "../controllers/gameVersionController.js";
import auth from "../middleware/auth.js";
import { isDeveloper } from "../middleware/roleCheck.js";

const router = express.Router();

// All developer routes require authentication and developer role
router.use(auth, isDeveloper);

// ============================================
// Game Management & API
// ============================================

// Testing & Verification Endpoints
router.get("/api/test-sync", testDataSync);
router.get("/api/health", verifyAPIHealth);
router.get("/api/sync-confirmation", getSyncConfirmation);

// Game CRUD
router.get("/games", getDeveloperGames);
router.post("/games", createGame);
router.get("/games/:gameId", getGameById);
router.put("/games/:gameId", updateGame);
router.delete("/games/:gameId", deleteGame);

// ============================================
// Game File Uploads
// ============================================

// Get upload requirements
router.get("/games/upload-requirements", getUploadRequirements);

// Upload new game with files
router.post("/games/upload", uploadGameFile.single('gameFile'), uploadGameWithFiles);

// Replace game files
router.put("/games/:gameId/files", uploadGameFile.single('gameFile'), replaceGameFiles);

// Upload game assets (thumbnails, covers)
router.post("/games/:gameId/assets", uploadGameFile.single('assetFile'), uploadGameAssets);

// ============================================
// Game Analytics Dashboard
// ============================================

// Get overview of all developer's games
router.get("/analytics/games", getDeveloperGamesAnalytics);

// Get detailed analytics for a specific game
router.get("/analytics/games/:gameId", getGameDetailedAnalytics);

// Get performance trends for a specific game
router.get("/analytics/games/:gameId/trends", getGamePerformanceTrends);

// Compare multiple games
router.get("/analytics/games/compare", compareGames);

// ============================================
// License and Ownership Management
// ============================================

// Get license requirements
router.get("/licenses/requirements", getLicenseRequirements);

// Get all developer's licenses
router.get("/licenses", getDeveloperLicenses);

// Get license for a specific game
router.get("/games/:gameId/license", getLicenseByGameId);

// Submit or update license information
router.post("/games/:gameId/license", submitLicenseInformation);
router.put("/games/:gameId/license", submitLicenseInformation);

// Upload license files (multiple files)
router.post("/games/:gameId/license/files", uploadLicenseFile.array('licenseFiles', 10), uploadLicenseFiles);

// Delete a license file
router.delete("/games/:gameId/license/files/:fileId", deleteLicenseFile);

// Submit license for review
router.post("/games/:gameId/license/submit", submitLicenseForReview);

// ============================================
// Game Media Management
// ============================================

// Get media requirements
router.get("/media/requirements", getMediaRequirements);

// Get game media
router.get("/games/:gameId/media", getGameMedia);

// Upload cover image
router.post("/games/:gameId/media/cover", uploadMediaFile.single('coverImage'), uploadCoverImage);

// Upload screenshots (2-5 required)
router.post("/games/:gameId/media/screenshots", uploadMediaFile.array('screenshots', 5), uploadScreenshots);

// Delete a screenshot
router.delete("/games/:gameId/media/screenshots/:screenshotId", deleteScreenshot);

// ============================================
// Game Submission & Review
// ============================================

// Get all developer's submissions
router.get("/submissions", getDeveloperSubmissions);

// Submit game for review
router.post("/games/:gameId/submit", submitGameForReview);

// Get submission status
router.get("/games/:gameId/submission", getSubmissionStatus);

// Resubmit game after changes
router.post("/games/:gameId/resubmit", resubmitGame);

// Mark requested change as resolved
router.put("/games/:gameId/changes/:changeId/resolve", markChangeResolved);

// ============================================
// Version Control
// ============================================

// Get all versions for a game
router.get("/games/:gameId/versions", getGameVersions);

// Get specific version details
router.get("/games/:gameId/versions/:versionId", getVersionDetails);

// Revert to a previous version
router.post("/games/:gameId/versions/:versionId/revert", revertToVersion);

// Compare two versions
router.get("/games/:gameId/versions/compare", compareVersions);

// Get approval history
router.get("/games/:gameId/versions/approval-history", getVersionApprovalHistory);

export default router;
