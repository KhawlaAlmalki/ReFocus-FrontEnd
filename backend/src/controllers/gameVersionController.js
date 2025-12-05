// src/controllers/gameVersionController.js
import Game from "../models/Game.js";
import GameVersion from "../models/GameVersion.js";
import fs from "fs";
import path from "path";

// ============================================
// VERSION MANAGEMENT HANDLERS
// ============================================

// Get all versions for a game
export const getGameVersions = async (req, res) => {
  try {
    const { gameId } = req.params;
    const developerId = req.user.userId;

    // Verify game ownership
    const game = await Game.findOne({ _id: gameId, developerId });
    if (!game) {
      return res.status(404).json({
        success: false,
        message: "Game not found or you don't have access"
      });
    }

    // Get all versions
    const versions = await GameVersion.getAllVersions(gameId);

    res.status(200).json({
      success: true,
      count: versions.length,
      currentVersion: game.version,
      versions: versions.map(v => ({
        id: v._id,
        versionNumber: v.versionNumber,
        versionTag: v.versionTag,
        status: v.status,
        isApproved: v.isApproved,
        isCurrentVersion: v.isCurrentVersion,
        isRevert: v.isRevert,
        createdAt: v.createdAt,
        createdBy: v.createdBy ? {
          name: v.createdBy.name,
          email: v.createdBy.email
        } : null,
        approvedAt: v.approvedAt,
        approvedBy: v.approvedBy ? {
          name: v.approvedBy.name,
          email: v.approvedBy.email
        } : null,
        publishedAt: v.publishedAt,
        changeLog: v.changeLog,
        changes: v.changes,
        canRevertTo: v.canRevertTo(),
        totalSize: v.getFormattedSize()
      }))
    });

  } catch (err) {
    console.error("GET GAME VERSIONS ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error while retrieving game versions",
      error: err.message
    });
  }
};

// Get specific version details
export const getVersionDetails = async (req, res) => {
  try {
    const { gameId, versionId } = req.params;
    const developerId = req.user.userId;

    // Verify game ownership
    const game = await Game.findOne({ _id: gameId, developerId });
    if (!game) {
      return res.status(404).json({
        success: false,
        message: "Game not found or you don't have access"
      });
    }

    // Get version
    const version = await GameVersion.findOne({ _id: versionId, gameId })
      .populate('createdBy', 'name email')
      .populate('approvedBy', 'name email')
      .populate('reviewedBy', 'name email')
      .populate('revertedFrom')
      .populate('revertedTo');

    if (!version) {
      return res.status(404).json({
        success: false,
        message: "Version not found"
      });
    }

    res.status(200).json({
      success: true,
      version: {
        id: version._id,
        versionNumber: version.versionNumber,
        versionTag: version.versionTag,
        status: version.status,
        isApproved: version.isApproved,
        isCurrentVersion: version.isCurrentVersion,
        isRevert: version.isRevert,
        snapshot: version.snapshot,
        changeLog: version.changeLog,
        changes: version.changes,
        createdAt: version.createdAt,
        createdBy: version.createdBy ? {
          name: version.createdBy.name,
          email: version.createdBy.email
        } : null,
        approvedAt: version.approvedAt,
        approvedBy: version.approvedBy ? {
          name: version.approvedBy.name,
          email: version.approvedBy.email
        } : null,
        reviewedAt: version.reviewedAt,
        reviewedBy: version.reviewedBy ? {
          name: version.reviewedBy.name,
          email: version.reviewedBy.email
        } : null,
        reviewerComments: version.reviewerComments,
        rejectionReason: version.rejectionReason,
        revertInfo: version.isRevert ? {
          revertedFrom: version.revertedFrom?.versionNumber,
          revertedTo: version.revertedTo?.versionNumber,
          revertedAt: version.revertedAt,
          revertedBy: version.revertedBy
        } : null,
        canRevertTo: version.canRevertTo(),
        totalSize: version.getFormattedSize()
      }
    });

  } catch (err) {
    console.error("GET VERSION DETAILS ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error while retrieving version details",
      error: err.message
    });
  }
};

// Revert to a previous version
export const revertToVersion = async (req, res) => {
  try {
    const { gameId, versionId } = req.params;
    const developerId = req.user.userId;
    const { confirmation } = req.body;

    // Verify game ownership
    const game = await Game.findOne({ _id: gameId, developerId });
    if (!game) {
      return res.status(404).json({
        success: false,
        message: "Game not found or you don't have access"
      });
    }

    // Check if game is locked
    if (game.isLocked) {
      return res.status(403).json({
        success: false,
        message: "Cannot revert version while game is locked during review"
      });
    }

    // Require confirmation
    if (!confirmation || confirmation !== game.title) {
      return res.status(400).json({
        success: false,
        message: "Please confirm the revert by providing the exact game title",
        required: "Set confirmation field to the exact game title"
      });
    }

    // Get target version to revert to
    const targetVersion = await GameVersion.findOne({ _id: versionId, gameId });
    if (!targetVersion) {
      return res.status(404).json({
        success: false,
        message: "Version not found"
      });
    }

    // Check if version can be reverted to
    if (!targetVersion.canRevertTo()) {
      return res.status(400).json({
        success: false,
        message: "This version cannot be reverted to. Only approved, non-rejected, non-revert versions can be restored.",
        versionStatus: targetVersion.status,
        isApproved: targetVersion.isApproved,
        isRevert: targetVersion.isRevert
      });
    }

    // Get current version to store reference
    const currentVersion = await GameVersion.getCurrentVersion(gameId);

    // Create snapshot of current state before reverting
    if (currentVersion) {
      currentVersion.isCurrentVersion = false;
      await currentVersion.save();
    }

    // Restore game state from target version snapshot
    const snapshot = targetVersion.snapshot;

    game.title = snapshot.title;
    game.description = snapshot.description;
    game.shortDescription = snapshot.shortDescription;
    game.category = snapshot.category;
    game.difficulty = snapshot.difficulty;
    game.gameUrl = snapshot.gameUrl;
    game.thumbnailUrl = snapshot.thumbnailUrl;
    game.coverImageUrl = snapshot.coverImageUrl;
    game.screenshots = snapshot.screenshots.map(s => ({
      url: s.url,
      fileName: s.fileName,
      dimensions: s.dimensions,
      aspectRatio: s.aspectRatio,
      uploadedAt: new Date(),
      order: snapshot.screenshots.indexOf(s)
    }));
    game.minPlayTime = snapshot.minPlayTime;
    game.maxPlayTime = snapshot.maxPlayTime;
    game.avgPlayTime = snapshot.avgPlayTime;
    game.tags = snapshot.tags;

    // Update version number
    const newVersionNumber = incrementVersion(game.version, 'patch');
    game.version = newVersionNumber;

    // Reset submission status to draft after revert
    game.submissionStatus = 'Draft';
    game.isLocked = false;
    game.lastModifiedBy = developerId;

    await game.save();

    // Create new version record for the revert
    const revertVersion = await GameVersion.create({
      gameId: game._id,
      versionNumber: newVersionNumber,
      versionTag: 'revert',
      snapshot: {
        title: snapshot.title,
        description: snapshot.description,
        shortDescription: snapshot.shortDescription,
        category: snapshot.category,
        difficulty: snapshot.difficulty,
        gameUrl: snapshot.gameUrl,
        thumbnailUrl: snapshot.thumbnailUrl,
        coverImageUrl: snapshot.coverImageUrl,
        screenshots: snapshot.screenshots,
        minPlayTime: snapshot.minPlayTime,
        maxPlayTime: snapshot.maxPlayTime,
        avgPlayTime: snapshot.avgPlayTime,
        tags: snapshot.tags,
        hasLicense: snapshot.hasLicense,
        licenseId: snapshot.licenseId
      },
      status: 'Draft',
      changeLog: `Reverted to version ${targetVersion.versionNumber}`,
      changes: [{
        type: 'Other',
        description: `Restored game state from version ${targetVersion.versionNumber}`
      }],
      createdBy: developerId,
      isCurrentVersion: true,
      isRevert: true,
      revertedFrom: currentVersion?._id,
      revertedTo: targetVersion._id,
      revertedAt: new Date(),
      revertedBy: developerId
    });

    // Update target version reference
    targetVersion.revertedFrom = revertVersion._id;
    await targetVersion.save();

    res.status(200).json({
      success: true,
      message: `Successfully reverted to version ${targetVersion.versionNumber}. Your game has been restored to its previous stable state.`,
      revert: {
        newVersionNumber,
        revertedToVersion: targetVersion.versionNumber,
        revertedAt: new Date(),
        newStatus: game.submissionStatus,
        isLocked: game.isLocked,
        snapshot: {
          title: game.title,
          description: game.description,
          gameUrl: game.gameUrl,
          screenshotCount: game.screenshots.length
        }
      }
    });

  } catch (err) {
    console.error("REVERT TO VERSION ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error while reverting to version",
      error: err.message
    });
  }
};

// Compare two versions
export const compareVersions = async (req, res) => {
  try {
    const { gameId } = req.params;
    const { versionId1, versionId2 } = req.query;
    const developerId = req.user.userId;

    // Verify game ownership
    const game = await Game.findOne({ _id: gameId, developerId });
    if (!game) {
      return res.status(404).json({
        success: false,
        message: "Game not found or you don't have access"
      });
    }

    if (!versionId1 || !versionId2) {
      return res.status(400).json({
        success: false,
        message: "Both versionId1 and versionId2 query parameters are required"
      });
    }

    // Get both versions
    const version1 = await GameVersion.findOne({ _id: versionId1, gameId });
    const version2 = await GameVersion.findOne({ _id: versionId2, gameId });

    if (!version1 || !version2) {
      return res.status(404).json({
        success: false,
        message: "One or both versions not found"
      });
    }

    // Compare snapshots
    const differences = compareSnapshots(version1.snapshot, version2.snapshot);

    res.status(200).json({
      success: true,
      comparison: {
        version1: {
          id: version1._id,
          versionNumber: version1.versionNumber,
          createdAt: version1.createdAt,
          status: version1.status
        },
        version2: {
          id: version2._id,
          versionNumber: version2.versionNumber,
          createdAt: version2.createdAt,
          status: version2.status
        },
        differences,
        hasChanges: differences.length > 0
      }
    });

  } catch (err) {
    console.error("COMPARE VERSIONS ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error while comparing versions",
      error: err.message
    });
  }
};

// Get version approval history
export const getVersionApprovalHistory = async (req, res) => {
  try {
    const { gameId } = req.params;
    const developerId = req.user.userId;

    // Verify game ownership
    const game = await Game.findOne({ _id: gameId, developerId });
    if (!game) {
      return res.status(404).json({
        success: false,
        message: "Game not found or you don't have access"
      });
    }

    // Get all approved versions
    const approvedVersions = await GameVersion.find({
      gameId,
      isApproved: true
    })
    .sort({ approvedAt: -1 })
    .populate('approvedBy', 'name email')
    .select('versionNumber approvedAt approvedBy status publishedAt changeLog');

    res.status(200).json({
      success: true,
      count: approvedVersions.length,
      approvalHistory: approvedVersions.map(v => ({
        versionNumber: v.versionNumber,
        status: v.status,
        approvedAt: v.approvedAt,
        approvedBy: v.approvedBy ? {
          name: v.approvedBy.name,
          email: v.approvedBy.email
        } : null,
        publishedAt: v.publishedAt,
        changeLog: v.changeLog,
        isPublished: !!v.publishedAt
      }))
    });

  } catch (err) {
    console.error("GET VERSION APPROVAL HISTORY ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error while retrieving approval history",
      error: err.message
    });
  }
};

// ============================================
// HELPER FUNCTIONS
// ============================================

// Increment version number
function incrementVersion(currentVersion, type = 'patch') {
  const parts = currentVersion.split('.').map(Number);

  switch (type) {
    case 'major':
      parts[0]++;
      parts[1] = 0;
      parts[2] = 0;
      break;
    case 'minor':
      parts[1]++;
      parts[2] = 0;
      break;
    case 'patch':
    default:
      parts[2]++;
      break;
  }

  return parts.join('.');
}

// Compare two snapshots and find differences
function compareSnapshots(snapshot1, snapshot2) {
  const differences = [];

  // Compare basic fields
  const fieldsToCompare = [
    'title', 'description', 'shortDescription', 'category',
    'difficulty', 'gameUrl', 'thumbnailUrl', 'coverImageUrl',
    'minPlayTime', 'maxPlayTime', 'avgPlayTime'
  ];

  for (const field of fieldsToCompare) {
    if (snapshot1[field] !== snapshot2[field]) {
      differences.push({
        field,
        oldValue: snapshot1[field],
        newValue: snapshot2[field],
        type: 'modified'
      });
    }
  }

  // Compare tags
  if (JSON.stringify(snapshot1.tags) !== JSON.stringify(snapshot2.tags)) {
    differences.push({
      field: 'tags',
      oldValue: snapshot1.tags,
      newValue: snapshot2.tags,
      type: 'modified'
    });
  }

  // Compare screenshots
  if (snapshot1.screenshots.length !== snapshot2.screenshots.length) {
    differences.push({
      field: 'screenshots',
      oldValue: `${snapshot1.screenshots.length} screenshots`,
      newValue: `${snapshot2.screenshots.length} screenshots`,
      type: 'count_changed'
    });
  }

  // Compare screenshot URLs
  const screenshots1 = snapshot1.screenshots.map(s => s.url).sort();
  const screenshots2 = snapshot2.screenshots.map(s => s.url).sort();

  if (JSON.stringify(screenshots1) !== JSON.stringify(screenshots2)) {
    const added = screenshots2.filter(url => !screenshots1.includes(url));
    const removed = screenshots1.filter(url => !screenshots2.includes(url));

    if (added.length > 0) {
      differences.push({
        field: 'screenshots',
        type: 'added',
        value: added
      });
    }

    if (removed.length > 0) {
      differences.push({
        field: 'screenshots',
        type: 'removed',
        value: removed
      });
    }
  }

  return differences;
}
