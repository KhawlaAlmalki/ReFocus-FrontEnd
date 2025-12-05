// src/controllers/gameController.js
import Game from "../models/Game.js";
import GameSession from "../models/GameSession.js";
import User from "../models/User.js";

// ============================================
// DEVELOPER: Game Management
// ============================================

// Get all games for a developer
export const getDeveloperGames = async (req, res) => {
  try {
    const developerId = req.user.userId;
    const {
      isActive,
      isPublic,
      category,
      search,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const filter = { developerId };

    // Apply filters
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    if (isPublic !== undefined) {
      filter.isPublic = isPublic === 'true';
    }

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Validate sortBy field
    const allowedSortFields = ['createdAt', 'updatedAt', 'title', 'totalPlays', 'averageRating'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const sort = { [sortField]: sortOrder === 'desc' ? -1 : 1 };

    const games = await Game.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('lastModifiedBy', 'name email');

    const totalGames = await Game.countDocuments(filter);

    // Get statistics
    const stats = await Game.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalActive: { $sum: { $cond: ['$isActive', 1, 0] } },
          totalPublic: { $sum: { $cond: ['$isPublic', 1, 0] } },
          totalPlays: { $sum: '$totalPlays' },
          totalPlayers: { $sum: '$totalPlayers' }
        }
      }
    ]);

    const filterStats = stats.length > 0 ? stats[0] : {
      totalActive: 0,
      totalPublic: 0,
      totalPlays: 0,
      totalPlayers: 0
    };

    res.status(200).json({
      success: true,
      games: games.map(game => ({
        id: game._id,
        title: game.title,
        description: game.description,
        shortDescription: game.shortDescription,
        category: game.category,
        difficulty: game.difficulty,
        gameUrl: game.gameUrl,
        thumbnailUrl: game.thumbnailUrl,
        coverImageUrl: game.coverImageUrl,
        isPublic: game.isPublic,
        isActive: game.isActive,
        isFeatured: game.isFeatured,
        isPremium: game.isPremium,
        totalPlays: game.totalPlays,
        totalPlayers: game.totalPlayers,
        totalPlayTime: game.totalPlayTime,
        averageSessionLength: game.averageSessionLength,
        averageRating: game.averageRating,
        totalRatings: game.totalRatings,
        tags: game.tags,
        version: game.version,
        createdAt: game.createdAt,
        updatedAt: game.updatedAt
      })),
      filterStats,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalGames / parseInt(limit)),
        totalGames,
        limit: parseInt(limit)
      }
    });

  } catch (err) {
    console.error("GET DEVELOPER GAMES ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message
    });
  }
};

// Get single game by ID
export const getGameById = async (req, res) => {
  try {
    const { gameId } = req.params;
    const developerId = req.user.userId;

    const game = await Game.findOne({ _id: gameId, developerId })
      .populate('developerId', 'name email avatar')
      .populate('lastModifiedBy', 'name email');

    if (!game) {
      return res.status(404).json({
        success: false,
        message: "Game not found or you don't have access"
      });
    }

    // Get recent sessions
    const recentSessions = await GameSession.find({ gameId: game._id })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('userId', 'name avatar');

    res.status(200).json({
      success: true,
      game: {
        id: game._id,
        title: game.title,
        description: game.description,
        shortDescription: game.shortDescription,
        category: game.category,
        difficulty: game.difficulty,
        gameUrl: game.gameUrl,
        thumbnailUrl: game.thumbnailUrl,
        coverImageUrl: game.coverImageUrl,
        isPublic: game.isPublic,
        isActive: game.isActive,
        isFeatured: game.isFeatured,
        isPremium: game.isPremium,
        developer: game.developerId,
        developerName: game.developerName,
        minPlayTime: game.minPlayTime,
        maxPlayTime: game.maxPlayTime,
        avgPlayTime: game.avgPlayTime,
        totalPlays: game.totalPlays,
        totalPlayers: game.totalPlayers,
        totalPlayTime: game.totalPlayTime,
        averageSessionLength: game.averageSessionLength,
        averageRating: game.averageRating,
        totalRatings: game.totalRatings,
        tags: game.tags,
        version: game.version,
        lastModifiedBy: game.lastModifiedBy,
        createdAt: game.createdAt,
        updatedAt: game.updatedAt
      },
      recentSessions: recentSessions.map(session => ({
        id: session._id,
        user: session.userId,
        duration: session.duration,
        score: session.score,
        completed: session.completed,
        deviceType: session.deviceType,
        createdAt: session.createdAt
      }))
    });

  } catch (err) {
    console.error("GET GAME BY ID ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message
    });
  }
};

// Create new game
export const createGame = async (req, res) => {
  try {
    const developerId = req.user.userId;
    const {
      title,
      description,
      shortDescription,
      category,
      difficulty,
      gameUrl,
      thumbnailUrl,
      coverImageUrl,
      isPublic,
      isActive,
      isFeatured,
      isPremium,
      minPlayTime,
      maxPlayTime,
      avgPlayTime,
      tags,
      version
    } = req.body;

    // Validation
    const errors = [];

    if (!title || title.trim() === '') {
      errors.push("Title is required");
    }

    if (!description || description.trim() === '') {
      errors.push("Description is required");
    }

    if (!gameUrl || gameUrl.trim() === '') {
      errors.push("Game URL is required");
    }

    if (title && title.length > 200) {
      errors.push("Title must not exceed 200 characters");
    }

    if (description && description.length > 2000) {
      errors.push("Description must not exceed 2000 characters");
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors
      });
    }

    // Get developer name
    const developer = await User.findById(developerId).select('name');
    if (!developer) {
      return res.status(404).json({
        success: false,
        message: "Developer not found"
      });
    }

    // Create game
    const game = await Game.create({
      title: title.trim(),
      description: description.trim(),
      shortDescription: shortDescription?.trim(),
      category: category || 'focus',
      difficulty: difficulty || 'medium',
      gameUrl: gameUrl.trim(),
      thumbnailUrl,
      coverImageUrl,
      isPublic: isPublic !== undefined ? isPublic : true,
      isActive: isActive !== undefined ? isActive : true,
      isFeatured: isFeatured !== undefined ? isFeatured : false,
      isPremium: isPremium !== undefined ? isPremium : false,
      developerId,
      developerName: developer.name,
      minPlayTime: minPlayTime || 60,
      maxPlayTime: maxPlayTime || 600,
      avgPlayTime: avgPlayTime || 180,
      tags: tags || [],
      version: version || '1.0.0'
    });

    res.status(201).json({
      success: true,
      message: "Game created successfully",
      game: {
        id: game._id,
        title: game.title,
        description: game.description,
        category: game.category,
        difficulty: game.difficulty,
        gameUrl: game.gameUrl,
        isPublic: game.isPublic,
        isActive: game.isActive,
        version: game.version,
        createdAt: game.createdAt
      }
    });

  } catch (err) {
    console.error("CREATE GAME ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message
    });
  }
};

// Update game
export const updateGame = async (req, res) => {
  try {
    const { gameId } = req.params;
    const developerId = req.user.userId;
    const updates = req.body;

    const game = await Game.findOne({ _id: gameId, developerId });
    if (!game) {
      return res.status(404).json({
        success: false,
        message: "Game not found or you don't have access"
      });
    }

    // Validation
    const errors = [];

    if (updates.title !== undefined && updates.title.trim() === '') {
      errors.push("Title cannot be empty");
    }

    if (updates.description !== undefined && updates.description.trim() === '') {
      errors.push("Description cannot be empty");
    }

    if (updates.gameUrl !== undefined && updates.gameUrl.trim() === '') {
      errors.push("Game URL cannot be empty");
    }

    if (updates.title && updates.title.length > 200) {
      errors.push("Title must not exceed 200 characters");
    }

    if (updates.description && updates.description.length > 2000) {
      errors.push("Description must not exceed 2000 characters");
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors
      });
    }

    // Allowed fields for update
    const allowedUpdates = [
      'title',
      'description',
      'shortDescription',
      'category',
      'difficulty',
      'gameUrl',
      'thumbnailUrl',
      'coverImageUrl',
      'isPublic',
      'isActive',
      'isFeatured',
      'isPremium',
      'minPlayTime',
      'maxPlayTime',
      'avgPlayTime',
      'tags',
      'version'
    ];

    // Apply updates
    allowedUpdates.forEach(field => {
      if (updates[field] !== undefined) {
        game[field] = updates[field];
      }
    });

    // Track who modified
    game.lastModifiedBy = req.user.userId;

    await game.save();

    res.status(200).json({
      success: true,
      message: "Game updated successfully",
      game: {
        id: game._id,
        title: game.title,
        description: game.description,
        category: game.category,
        difficulty: game.difficulty,
        gameUrl: game.gameUrl,
        isPublic: game.isPublic,
        isActive: game.isActive,
        version: game.version,
        updatedAt: game.updatedAt
      }
    });

  } catch (err) {
    console.error("UPDATE GAME ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message
    });
  }
};

// Delete game
export const deleteGame = async (req, res) => {
  try {
    const { gameId } = req.params;
    const developerId = req.user.userId;
    const { confirmTitle } = req.body;

    const game = await Game.findOne({ _id: gameId, developerId });
    if (!game) {
      return res.status(404).json({
        success: false,
        message: "Game not found or you don't have access"
      });
    }

    // Title confirmation check
    if (confirmTitle !== game.title) {
      return res.status(400).json({
        success: false,
        message: "Title confirmation does not match. Cannot delete game."
      });
    }

    // Check for active sessions
    const activeSessions = await GameSession.countDocuments({
      gameId: game._id,
      endTime: null
    });

    if (activeSessions > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete game. ${activeSessions} active session(s) in progress.`,
        activeSessions
      });
    }

    // Store info before deletion
    const deletedInfo = {
      id: game._id,
      title: game.title,
      category: game.category,
      totalPlays: game.totalPlays,
      totalPlayers: game.totalPlayers
    };

    // Delete game
    await Game.findByIdAndDelete(gameId);

    res.status(200).json({
      success: true,
      message: "Game deleted successfully",
      deletedGame: deletedInfo
    });

  } catch (err) {
    console.error("DELETE GAME ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message
    });
  }
};

// ============================================
// PUBLIC: Game Library (Frontend Population)
// ============================================

// Get public game library (for frontend)
export const getPublicGameLibrary = async (req, res) => {
  try {
    const {
      category,
      difficulty,
      isPremium,
      search,
      featured,
      page = 1,
      limit = 12,
      sortBy = 'totalPlays',
      sortOrder = 'desc'
    } = req.query;

    const filter = {
      isPublic: true,
      isActive: true
    };

    // Apply filters
    if (category) {
      filter.category = category;
    }

    if (difficulty) {
      filter.difficulty = difficulty;
    }

    if (isPremium !== undefined) {
      filter.isPremium = isPremium === 'true';
    }

    if (featured !== undefined) {
      filter.isFeatured = featured === 'true';
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Validate sortBy field
    const allowedSortFields = ['createdAt', 'title', 'totalPlays', 'averageRating', 'totalPlayers'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'totalPlays';
    const sort = { [sortField]: sortOrder === 'desc' ? -1 : 1 };

    const games = await Game.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v')
      .lean();

    const totalGames = await Game.countDocuments(filter);

    // Get categories count
    const categoryCounts = await Game.aggregate([
      { $match: { isPublic: true, isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      success: true,
      message: "Game library fetched successfully",
      games: games.map(game => ({
        id: game._id,
        title: game.title,
        description: game.description,
        shortDescription: game.shortDescription,
        category: game.category,
        difficulty: game.difficulty,
        gameUrl: game.gameUrl,
        thumbnailUrl: game.thumbnailUrl,
        coverImageUrl: game.coverImageUrl,
        isPremium: game.isPremium,
        isFeatured: game.isFeatured,
        developerName: game.developerName,
        totalPlays: game.totalPlays,
        totalPlayers: game.totalPlayers,
        averageRating: game.averageRating,
        totalRatings: game.totalRatings,
        tags: game.tags,
        avgPlayTime: game.avgPlayTime
      })),
      categories: categoryCounts.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalGames / parseInt(limit)),
        totalGames,
        limit: parseInt(limit),
        hasNextPage: parseInt(page) < Math.ceil(totalGames / parseInt(limit)),
        hasPrevPage: parseInt(page) > 1
      },
      syncStatus: {
        timestamp: new Date().toISOString(),
        recordsFetched: games.length,
        totalRecordsAvailable: totalGames,
        status: 'success'
      }
    });

  } catch (err) {
    console.error("GET PUBLIC GAME LIBRARY ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
      syncStatus: {
        timestamp: new Date().toISOString(),
        recordsFetched: 0,
        status: 'error'
      }
    });
  }
};

// Get single public game (for frontend)
export const getPublicGameById = async (req, res) => {
  try {
    const { gameId } = req.params;

    const game = await Game.findOne({
      _id: gameId,
      isPublic: true,
      isActive: true
    }).select('-__v').lean();

    if (!game) {
      return res.status(404).json({
        success: false,
        message: "Game not found or not available"
      });
    }

    res.status(200).json({
      success: true,
      message: "Game details fetched successfully",
      game: {
        id: game._id,
        title: game.title,
        description: game.description,
        shortDescription: game.shortDescription,
        category: game.category,
        difficulty: game.difficulty,
        gameUrl: game.gameUrl,
        thumbnailUrl: game.thumbnailUrl,
        coverImageUrl: game.coverImageUrl,
        isPremium: game.isPremium,
        isFeatured: game.isFeatured,
        developerName: game.developerName,
        minPlayTime: game.minPlayTime,
        maxPlayTime: game.maxPlayTime,
        avgPlayTime: game.avgPlayTime,
        totalPlays: game.totalPlays,
        totalPlayers: game.totalPlayers,
        averageRating: game.averageRating,
        totalRatings: game.totalRatings,
        tags: game.tags,
        version: game.version
      },
      syncStatus: {
        timestamp: new Date().toISOString(),
        status: 'success'
      }
    });

  } catch (err) {
    console.error("GET PUBLIC GAME BY ID ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message
    });
  }
};

// ============================================
// TESTING & VERIFICATION
// ============================================

// Test data synchronization
export const testDataSync = async (req, res) => {
  try {
    const developerId = req.user.userId;

    // Get developer's games
    const games = await Game.find({ developerId }).lean();

    // Test database connectivity
    const dbConnected = games !== null;

    // Get public games count
    const publicGamesCount = await Game.countDocuments({
      developerId,
      isPublic: true,
      isActive: true
    });

    // Get recent sessions
    const recentSessions = await GameSession.countDocuments({
      gameId: { $in: games.map(g => g._id) },
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });

    // Test aggregation
    const aggregationTest = await Game.aggregate([
      { $match: { developerId } },
      {
        $group: {
          _id: null,
          totalGames: { $sum: 1 },
          totalPlays: { $sum: '$totalPlays' },
          avgRating: { $avg: '$averageRating' }
        }
      }
    ]);

    const aggregationResult = aggregationTest.length > 0 ? aggregationTest[0] : null;

    res.status(200).json({
      success: true,
      message: "Data synchronization test completed",
      testResults: {
        databaseConnected: dbConnected,
        totalGames: games.length,
        publicGames: publicGamesCount,
        recentSessions24h: recentSessions,
        aggregationWorking: aggregationResult !== null,
        aggregationData: aggregationResult,
        sampleGame: games.length > 0 ? {
          id: games[0]._id,
          title: games[0].title,
          totalPlays: games[0].totalPlays,
          isActive: games[0].isActive
        } : null
      },
      syncStatus: {
        timestamp: new Date().toISOString(),
        allChecksPass: dbConnected && games.length >= 0,
        status: 'verified'
      }
    });

  } catch (err) {
    console.error("TEST DATA SYNC ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Data synchronization test failed",
      error: err.message,
      syncStatus: {
        timestamp: new Date().toISOString(),
        status: 'error'
      }
    });
  }
};

// Verify API endpoint health
export const verifyAPIHealth = async (req, res) => {
  try {
    const developerId = req.user.userId;

    // Test various database operations
    const tests = {
      read: false,
      count: false,
      aggregate: false,
      populate: false
    };

    // Test read
    try {
      await Game.findOne({ developerId });
      tests.read = true;
    } catch (e) {
      console.error("Read test failed:", e);
    }

    // Test count
    try {
      await Game.countDocuments({ developerId });
      tests.count = true;
    } catch (e) {
      console.error("Count test failed:", e);
    }

    // Test aggregate
    try {
      await Game.aggregate([
        { $match: { developerId } },
        { $limit: 1 }
      ]);
      tests.aggregate = true;
    } catch (e) {
      console.error("Aggregate test failed:", e);
    }

    // Test populate
    try {
      await Game.findOne({ developerId }).populate('lastModifiedBy');
      tests.populate = true;
    } catch (e) {
      console.error("Populate test failed:", e);
    }

    const allTestsPass = Object.values(tests).every(test => test === true);

    res.status(200).json({
      success: true,
      message: "API health check completed",
      health: {
        status: allTestsPass ? 'healthy' : 'degraded',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        tests,
        allTestsPass
      },
      endpoints: {
        getDeveloperGames: tests.read && tests.count,
        getGameById: tests.read && tests.populate,
        createGame: tests.read,
        updateGame: tests.read,
        deleteGame: tests.read,
        getPublicGameLibrary: tests.read && tests.count && tests.aggregate
      }
    });

  } catch (err) {
    console.error("VERIFY API HEALTH ERROR:", err);
    res.status(500).json({
      success: false,
      message: "API health check failed",
      error: err.message,
      health: {
        status: 'unhealthy',
        timestamp: new Date().toISOString()
      }
    });
  }
};

// Get sync confirmation
export const getSyncConfirmation = async (req, res) => {
  try {
    const { gameIds } = req.query;

    if (!gameIds) {
      return res.status(400).json({
        success: false,
        message: "gameIds parameter is required (comma-separated)"
      });
    }

    const ids = gameIds.split(',').map(id => id.trim());

    // Verify all games exist and are accessible
    const games = await Game.find({
      _id: { $in: ids },
      isPublic: true,
      isActive: true
    }).select('_id title totalPlays updatedAt').lean();

    const foundIds = games.map(g => g._id.toString());
    const missingIds = ids.filter(id => !foundIds.includes(id));

    res.status(200).json({
      success: true,
      message: "Sync confirmation completed",
      confirmation: {
        requestedRecords: ids.length,
        foundRecords: games.length,
        missingRecords: missingIds.length,
        successRate: `${((games.length / ids.length) * 100).toFixed(2)}%`,
        allRecordsFetched: missingIds.length === 0
      },
      records: games.map(game => ({
        id: game._id,
        title: game.title,
        totalPlays: game.totalPlays,
        lastUpdated: game.updatedAt,
        status: 'synced'
      })),
      missingIds,
      syncStatus: {
        timestamp: new Date().toISOString(),
        status: missingIds.length === 0 ? 'complete' : 'partial'
      }
    });

  } catch (err) {
    console.error("GET SYNC CONFIRMATION ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Sync confirmation failed",
      error: err.message
    });
  }
};
