// src/controllers/gameSubmissionController.js
import Game from "../models/Game.js";
import GameReview from "../models/GameReview.js";
import GameVersion from "../models/GameVersion.js";
import License from "../models/License.js";

// ============================================
// DEVELOPER SUBMISSION HANDLERS
// ============================================

// Submit game for review
export const submitGameForReview = async (req, res) => {
  try {
    const { gameId } = req.params;
    const developerId = req.user.userId;
    const { changeLog, changes } = req.body;

    // Verify game ownership
    const game = await Game.findOne({ _id: gameId, developerId });
    if (!game) {
      return res.status(404).json({
        success: false,
        message: "Game not found or you don't have access"
      });
    }

    // Check if already in review
    if (game.submissionStatus === 'In Review') {
      return res.status(400).json({
        success: false,
        message: "Game is already in review"
      });
    }

    // Check if game is complete before submission
    const validationErrors = [];

    if (!game.title || game.title.trim() === '') {
      validationErrors.push("Title is required");
    }

    if (!game.description || game.description.trim() === '') {
      validationErrors.push("Description is required");
    }

    if (!game.gameUrl) {
      validationErrors.push("Game file is required");
    }

    if (!game.coverImageUrl) {
      validationErrors.push("Cover image is required");
    }

    if (!game.screenshots || game.screenshots.length < 2) {
      validationErrors.push("At least 2 screenshots are required");
    }

    // Check if license exists
    const license = await License.findOne({ gameId });
    if (!license || !license.isComplete()) {
      validationErrors.push("Complete license information is required");
    }

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Game cannot be submitted. Please complete all required fields.",
        errors: validationErrors
      });
    }

    // Create version snapshot
    const versionNumber = game.version || '1.0.0';
    const gameVersion = await GameVersion.create({
      gameId: game._id,
      versionNumber,
      versionTag: 'stable',
      snapshot: {
        title: game.title,
        description: game.description,
        shortDescription: game.shortDescription,
        category: game.category,
        difficulty: game.difficulty,
        gameUrl: game.gameUrl,
        thumbnailUrl: game.thumbnailUrl,
        coverImageUrl: game.coverImageUrl,
        screenshots: game.screenshots.map(s => ({
          url: s.url,
          fileName: s.fileName,
          dimensions: s.dimensions,
          aspectRatio: s.aspectRatio
        })),
        minPlayTime: game.minPlayTime,
        maxPlayTime: game.maxPlayTime,
        avgPlayTime: game.avgPlayTime,
        tags: game.tags,
        hasLicense: !!license,
        licenseId: license?._id
      },
      status: 'In Review',
      changeLog: changeLog || 'Initial submission for review',
      changes: changes || [],
      createdBy: developerId,
      isCurrentVersion: true
    });

    // Update game status
    game.submissionStatus = 'In Review';
    game.isLocked = true;
    game.submittedForReviewAt = new Date();
    game.lastModifiedBy = developerId;

    await game.save();

    res.status(200).json({
      success: true,
      message: "Game submitted for review successfully. Your game is now locked and cannot be edited during the review process.",
      submission: {
        gameId: game._id,
        versionId: gameVersion._id,
        status: game.submissionStatus,
        submittedAt: game.submittedForReviewAt,
        isLocked: game.isLocked,
        estimatedReviewTime: "2-5 business days"
      }
    });

  } catch (err) {
    console.error("SUBMIT GAME FOR REVIEW ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error while submitting game for review",
      error: err.message
    });
  }
};

// Get submission status
export const getSubmissionStatus = async (req, res) => {
  try {
    const { gameId } = req.params;
    const developerId = req.user.userId;

    // Verify game ownership
    const game = await Game.findOne({ _id: gameId, developerId })
      .populate('lastReviewedBy', 'name email')
      .populate('approvedBy', 'name email');

    if (!game) {
      return res.status(404).json({
        success: false,
        message: "Game not found or you don't have access"
      });
    }

    // Get latest review
    const latestReview = await GameReview.getLatestReview(gameId);

    // Get version history
    const versions = await GameVersion.find({ gameId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('versionNumber status isApproved createdAt');

    // Build status timeline
    const timeline = [];

    timeline.push({
      status: 'Draft',
      date: game.createdAt,
      completed: true
    });

    if (game.submittedForReviewAt) {
      timeline.push({
        status: 'In Review',
        date: game.submittedForReviewAt,
        completed: game.submissionStatus !== 'Draft'
      });
    }

    if (game.submissionStatus === 'Changes Requested') {
      timeline.push({
        status: 'Changes Requested',
        date: game.lastReviewedAt,
        completed: true,
        changes: game.requestedChanges
      });
    }

    if (game.approvedAt) {
      timeline.push({
        status: 'Approved',
        date: game.approvedAt,
        completed: true,
        approvedBy: game.approvedBy?.name
      });
    }

    if (game.publishedAt) {
      timeline.push({
        status: 'Published',
        date: game.publishedAt,
        completed: true
      });
    }

    res.status(200).json({
      success: true,
      submission: {
        gameId: game._id,
        title: game.title,
        currentStatus: game.submissionStatus,
        isLocked: game.isLocked,
        timeline,
        submittedAt: game.submittedForReviewAt,
        lastReviewedAt: game.lastReviewedAt,
        approvedAt: game.approvedAt,
        publishedAt: game.publishedAt,
        reviewerComments: game.reviewerComments,
        requestedChanges: game.requestedChanges.map(change => ({
          id: change._id,
          change: change.change,
          priority: change.priority,
          category: change.category,
          resolved: change.resolved,
          resolvedAt: change.resolvedAt
        })),
        latestReview: latestReview ? latestReview.getSummary() : null,
        recentVersions: versions
      }
    });

  } catch (err) {
    console.error("GET SUBMISSION STATUS ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error while retrieving submission status",
      error: err.message
    });
  }
};

// Mark requested change as resolved
export const markChangeResolved = async (req, res) => {
  try {
    const { gameId, changeId } = req.params;
    const developerId = req.user.userId;

    // Verify game ownership
    const game = await Game.findOne({ _id: gameId, developerId });
    if (!game) {
      return res.status(404).json({
        success: false,
        message: "Game not found or you don't have access"
      });
    }

    // Find the requested change
    const change = game.requestedChanges.id(changeId);
    if (!change) {
      return res.status(404).json({
        success: false,
        message: "Requested change not found"
      });
    }

    // Mark as resolved
    change.resolved = true;
    change.resolvedAt = new Date();

    await game.save();

    // Check if all changes are resolved
    const allResolved = game.requestedChanges.every(c => c.resolved);

    res.status(200).json({
      success: true,
      message: "Change marked as resolved",
      allChangesResolved: allResolved,
      remainingChanges: game.requestedChanges.filter(c => !c.resolved).length
    });

  } catch (err) {
    console.error("MARK CHANGE RESOLVED ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message
    });
  }
};

// Resubmit after changes
export const resubmitGame = async (req, res) => {
  try {
    const { gameId } = req.params;
    const developerId = req.user.userId;
    const { changeLog } = req.body;

    // Verify game ownership
    const game = await Game.findOne({ _id: gameId, developerId });
    if (!game) {
      return res.status(404).json({
        success: false,
        message: "Game not found or you don't have access"
      });
    }

    // Check if game is in correct status for resubmission
    if (game.submissionStatus !== 'Changes Requested' && game.submissionStatus !== 'Rejected') {
      return res.status(400).json({
        success: false,
        message: "Game can only be resubmitted if changes were requested or it was rejected"
      });
    }

    // Check if all critical changes are resolved
    const unresolvedCritical = game.requestedChanges.filter(
      c => c.priority === 'Critical' && !c.resolved
    );

    if (unresolvedCritical.length > 0) {
      return res.status(400).json({
        success: false,
        message: "All critical changes must be resolved before resubmission",
        unresolvedChanges: unresolvedCritical.map(c => c.change)
      });
    }

    // Create new version snapshot
    const versionNumber = incrementVersion(game.version);
    const gameVersion = await GameVersion.create({
      gameId: game._id,
      versionNumber,
      versionTag: 'resubmission',
      snapshot: {
        title: game.title,
        description: game.description,
        shortDescription: game.shortDescription,
        category: game.category,
        difficulty: game.difficulty,
        gameUrl: game.gameUrl,
        thumbnailUrl: game.thumbnailUrl,
        coverImageUrl: game.coverImageUrl,
        screenshots: game.screenshots.map(s => ({
          url: s.url,
          fileName: s.fileName,
          dimensions: s.dimensions,
          aspectRatio: s.aspectRatio
        })),
        minPlayTime: game.minPlayTime,
        maxPlayTime: game.maxPlayTime,
        avgPlayTime: game.avgPlayTime,
        tags: game.tags
      },
      status: 'In Review',
      changeLog: changeLog || 'Resubmission after requested changes',
      createdBy: developerId,
      isCurrentVersion: true
    });

    // Update game status
    game.submissionStatus = 'In Review';
    game.isLocked = true;
    game.submittedForReviewAt = new Date();
    game.version = versionNumber;
    game.lastModifiedBy = developerId;

    await game.save();

    res.status(200).json({
      success: true,
      message: "Game resubmitted for review successfully",
      submission: {
        gameId: game._id,
        versionId: gameVersion._id,
        versionNumber,
        status: game.submissionStatus,
        submittedAt: game.submittedForReviewAt,
        isLocked: game.isLocked
      }
    });

  } catch (err) {
    console.error("RESUBMIT GAME ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error while resubmitting game",
      error: err.message
    });
  }
};

// Get all developer's submissions
export const getDeveloperSubmissions = async (req, res) => {
  try {
    const developerId = req.user.userId;
    const { status } = req.query;

    const query = { developerId };
    if (status) {
      query.submissionStatus = status;
    }

    const games = await Game.find(query)
      .select('title submissionStatus isLocked submittedForReviewAt lastReviewedAt approvedAt publishedAt requestedChanges')
      .sort({ submittedForReviewAt: -1 });

    const submissions = games.map(game => ({
      id: game._id,
      title: game.title,
      status: game.submissionStatus,
      isLocked: game.isLocked,
      submittedAt: game.submittedForReviewAt,
      lastReviewedAt: game.lastReviewedAt,
      approvedAt: game.approvedAt,
      publishedAt: game.publishedAt,
      pendingChanges: game.requestedChanges.filter(c => !c.resolved).length,
      totalChanges: game.requestedChanges.length
    }));

    res.status(200).json({
      success: true,
      count: submissions.length,
      submissions
    });

  } catch (err) {
    console.error("GET DEVELOPER SUBMISSIONS ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message
    });
  }
};

// ============================================
// ADMIN REVIEW HANDLERS
// ============================================

// Get games pending review (Admin only)
export const getPendingReviews = async (req, res) => {
  try {
    const games = await Game.find({ submissionStatus: 'In Review' })
      .populate('developerId', 'name email')
      .sort({ submittedForReviewAt: 1 })
      .select('title developerName submittedForReviewAt version category');

    res.status(200).json({
      success: true,
      count: games.length,
      games: games.map(game => ({
        id: game._id,
        title: game.title,
        developer: {
          id: game.developerId._id,
          name: game.developerName || game.developerId.name,
          email: game.developerId.email
        },
        submittedAt: game.submittedForReviewAt,
        version: game.version,
        category: game.category
      }))
    });

  } catch (err) {
    console.error("GET PENDING REVIEWS ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message
    });
  }
};

// Start game review (Admin only)
export const startGameReview = async (req, res) => {
  try {
    const { gameId } = req.params;
    const reviewerId = req.user.userId;

    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({
        success: false,
        message: "Game not found"
      });
    }

    if (game.submissionStatus !== 'In Review') {
      return res.status(400).json({
        success: false,
        message: "Game is not in review status"
      });
    }

    // Get current version
    const currentVersion = await GameVersion.getCurrentVersion(gameId);

    // Create review record
    const review = await GameReview.create({
      gameId: game._id,
      versionId: currentVersion?._id,
      reviewerId,
      reviewType: game.submittedForReviewAt === game.createdAt ? 'Initial Submission' : 'Resubmission',
      status: 'In Review',
      startedAt: new Date()
    });

    res.status(200).json({
      success: true,
      message: "Review started successfully",
      review: {
        id: review._id,
        gameId: game._id,
        gameTitle: game.title,
        reviewType: review.reviewType,
        startedAt: review.startedAt
      }
    });

  } catch (err) {
    console.error("START GAME REVIEW ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message
    });
  }
};

// Submit review decision (Admin only)
export const submitReviewDecision = async (req, res) => {
  try {
    const { gameId } = req.params;
    const reviewerId = req.user.userId;
    const {
      status,
      overallComments,
      functionalityTest,
      policyCompliance,
      contentReview,
      performanceTest,
      uiuxEvaluation,
      requestedChanges,
      rejectionReason
    } = req.body;

    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({
        success: false,
        message: "Game not found"
      });
    }

    // Get or create review record
    let review = await GameReview.findOne({
      gameId,
      reviewerId,
      completedAt: null
    });

    if (!review) {
      const currentVersion = await GameVersion.getCurrentVersion(gameId);
      review = await GameReview.create({
        gameId: game._id,
        versionId: currentVersion?._id,
        reviewerId,
        reviewType: 'Update Review',
        status,
        startedAt: new Date()
      });
    }

    // Update review with decision
    review.status = status;
    review.overallComments = overallComments;
    review.functionalityTest = functionalityTest || {};
    review.policyCompliance = policyCompliance || {};
    review.contentReview = contentReview || {};
    review.performanceTest = performanceTest || {};
    review.uiuxEvaluation = uiuxEvaluation || {};
    review.requestedChanges = requestedChanges || [];
    review.rejectionReason = rejectionReason;
    review.completedAt = new Date();
    review.calculateDuration();

    await review.save();

    // Update game based on decision
    if (status === 'Approved') {
      game.submissionStatus = 'Approved';
      game.isLocked = false;
      game.approvedAt = new Date();
      game.approvedBy = reviewerId;
      game.lastReviewedAt = new Date();
      game.lastReviewedBy = reviewerId;
      game.reviewerComments = overallComments;

      // Update version
      const currentVersion = await GameVersion.getCurrentVersion(gameId);
      if (currentVersion) {
        currentVersion.status = 'Approved';
        currentVersion.isApproved = true;
        currentVersion.approvedAt = new Date();
        currentVersion.approvedBy = reviewerId;
        await currentVersion.save();
      }

    } else if (status === 'Changes Requested') {
      game.submissionStatus = 'Changes Requested';
      game.isLocked = false;
      game.lastReviewedAt = new Date();
      game.lastReviewedBy = reviewerId;
      game.reviewerComments = overallComments;
      game.requestedChanges = requestedChanges.map(change => ({
        ...change,
        resolved: false
      }));

      // Update version
      const currentVersion = await GameVersion.getCurrentVersion(gameId);
      if (currentVersion) {
        currentVersion.status = 'Changes Requested';
        currentVersion.reviewedAt = new Date();
        currentVersion.reviewedBy = reviewerId;
        currentVersion.reviewerComments = overallComments;
        await currentVersion.save();
      }

    } else if (status === 'Rejected') {
      game.submissionStatus = 'Rejected';
      game.isLocked = false;
      game.rejectedAt = new Date();
      game.rejectionReason = rejectionReason;
      game.lastReviewedAt = new Date();
      game.lastReviewedBy = reviewerId;
      game.reviewerComments = overallComments;

      // Update version
      const currentVersion = await GameVersion.getCurrentVersion(gameId);
      if (currentVersion) {
        currentVersion.status = 'Rejected';
        currentVersion.rejectionReason = rejectionReason;
        currentVersion.reviewedAt = new Date();
        currentVersion.reviewedBy = reviewerId;
        await currentVersion.save();
      }
    }

    await game.save();

    res.status(200).json({
      success: true,
      message: `Game ${status.toLowerCase()} successfully`,
      review: {
        id: review._id,
        status: review.status,
        completedAt: review.completedAt,
        reviewDuration: review.reviewDuration
      },
      game: {
        id: game._id,
        submissionStatus: game.submissionStatus,
        isLocked: game.isLocked
      }
    });

  } catch (err) {
    console.error("SUBMIT REVIEW DECISION ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message
    });
  }
};

// ============================================
// HELPER FUNCTIONS
// ============================================

function incrementVersion(currentVersion) {
  const parts = currentVersion.split('.');
  parts[2] = parseInt(parts[2]) + 1;
  return parts.join('.');
}
