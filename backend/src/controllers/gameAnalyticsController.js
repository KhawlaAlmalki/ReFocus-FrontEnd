// src/controllers/gameAnalyticsController.js
import Game from "../models/Game.js";
import GameSession from "../models/GameSession.js";
import User from "../models/User.js";

// ============================================
// DEVELOPER: Game Analytics Dashboard
// ============================================

// Get all games for a developer with analytics overview
export const getDeveloperGamesAnalytics = async (req, res) => {
  try {
    const { timeRange = 7 } = req.query; // 7 or 30 days
    const developerId = req.user.userId;

    const days = parseInt(timeRange);
    const fromDate = new Date(Date.now() - (days * 24 * 60 * 60 * 1000));

    // Get all games by developer
    const games = await Game.find({ developerId });

    // Get analytics for each game
    const gamesWithAnalytics = await Promise.all(
      games.map(async (game) => {
        // Sessions in time period
        const sessionsInPeriod = await GameSession.countDocuments({
          gameId: game._id,
          createdAt: { $gte: fromDate }
        });

        // Unique players in period
        const uniquePlayers = await GameSession.distinct('userId', {
          gameId: game._id,
          createdAt: { $gte: fromDate }
        });

        // Session statistics
        const sessionStats = await GameSession.aggregate([
          {
            $match: {
              gameId: game._id,
              createdAt: { $gte: fromDate }
            }
          },
          {
            $group: {
              _id: null,
              totalDuration: { $sum: '$duration' },
              avgDuration: { $avg: '$duration' },
              totalScore: { $sum: '$score' },
              avgScore: { $avg: '$score' },
              completedSessions: {
                $sum: { $cond: ['$completed', 1, 0] }
              }
            }
          }
        ]);

        const stats = sessionStats.length > 0 ? sessionStats[0] : {
          totalDuration: 0,
          avgDuration: 0,
          totalScore: 0,
          avgScore: 0,
          completedSessions: 0
        };

        return {
          id: game._id,
          title: game.title,
          category: game.category,
          isActive: game.isActive,
          totalPlaysAllTime: game.totalPlays,
          totalPlayersAllTime: game.totalPlayers,
          sessionsInPeriod,
          uniquePlayersInPeriod: uniquePlayers.length,
          avgSessionLength: Math.round(stats.avgDuration),
          totalPlayTime: stats.totalDuration,
          avgScore: stats.avgScore ? stats.avgScore.toFixed(2) : 0,
          completionRate: sessionsInPeriod > 0
            ? ((stats.completedSessions / sessionsInPeriod) * 100).toFixed(2)
            : 0,
          averageRating: game.averageRating,
          totalRatings: game.totalRatings
        };
      })
    );

    res.status(200).json({
      timeRange: days,
      games: gamesWithAnalytics
    });

  } catch (err) {
    console.error("GET DEVELOPER GAMES ANALYTICS ERROR:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};

// Get detailed analytics for a specific game
export const getGameDetailedAnalytics = async (req, res) => {
  try {
    const { gameId } = req.params;
    const { timeRange = 7 } = req.query; // 7 or 30 days
    const developerId = req.user.userId;

    // Verify game belongs to developer
    const game = await Game.findOne({ _id: gameId, developerId });
    if (!game) {
      return res.status(404).json({
        message: "Game not found or you don't have access"
      });
    }

    const days = parseInt(timeRange);
    const fromDate = new Date(Date.now() - (days * 24 * 60 * 60 * 1000));

    // ===== DAILY USAGE STATISTICS =====
    const dailyStats = await GameSession.aggregate([
      {
        $match: {
          gameId: game._id,
          createdAt: { $gte: fromDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          totalPlays: { $sum: 1 },
          uniquePlayers: { $addToSet: '$userId' },
          totalDuration: { $sum: '$duration' },
          avgDuration: { $avg: '$duration' },
          completedSessions: {
            $sum: { $cond: ['$completed', 1, 0] }
          }
        }
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          date: '$_id',
          totalPlays: 1,
          dailyActiveUsers: { $size: '$uniquePlayers' },
          totalDuration: 1,
          avgSessionLength: { $round: ['$avgDuration', 0] },
          completionRate: {
            $multiply: [
              { $divide: ['$completedSessions', '$totalPlays'] },
              100
            ]
          }
        }
      }
    ]);

    // ===== OVERALL STATISTICS FOR PERIOD =====
    const overallStats = await GameSession.aggregate([
      {
        $match: {
          gameId: game._id,
          createdAt: { $gte: fromDate }
        }
      },
      {
        $group: {
          _id: null,
          totalSessions: { $sum: 1 },
          uniquePlayers: { $addToSet: '$userId' },
          totalDuration: { $sum: '$duration' },
          avgDuration: { $avg: '$duration' },
          maxDuration: { $max: '$duration' },
          minDuration: { $min: '$duration' },
          totalScore: { $sum: '$score' },
          avgScore: { $avg: '$score' },
          maxScore: { $max: '$score' },
          completedSessions: {
            $sum: { $cond: ['$completed', 1, 0] }
          }
        }
      }
    ]);

    const overall = overallStats.length > 0 ? overallStats[0] : {
      totalSessions: 0,
      uniquePlayers: [],
      totalDuration: 0,
      avgDuration: 0,
      maxDuration: 0,
      minDuration: 0,
      totalScore: 0,
      avgScore: 0,
      maxScore: 0,
      completedSessions: 0
    };

    // ===== DEVICE BREAKDOWN =====
    const deviceStats = await GameSession.aggregate([
      {
        $match: {
          gameId: game._id,
          createdAt: { $gte: fromDate }
        }
      },
      {
        $group: {
          _id: '$deviceType',
          count: { $sum: 1 },
          avgDuration: { $avg: '$duration' }
        }
      }
    ]);

    // ===== HOURLY DISTRIBUTION =====
    const hourlyDistribution = await GameSession.aggregate([
      {
        $match: {
          gameId: game._id,
          createdAt: { $gte: fromDate }
        }
      },
      {
        $project: {
          hour: { $hour: '$createdAt' }
        }
      },
      {
        $group: {
          _id: '$hour',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // ===== TOP PLAYERS =====
    const topPlayers = await GameSession.aggregate([
      {
        $match: {
          gameId: game._id,
          createdAt: { $gte: fromDate }
        }
      },
      {
        $group: {
          _id: '$userId',
          totalSessions: { $sum: 1 },
          totalScore: { $sum: '$score' },
          avgScore: { $avg: '$score' },
          totalPlayTime: { $sum: '$duration' }
        }
      },
      { $sort: { totalScore: -1 } },
      { $limit: 10 }
    ]);

    // Populate user details for top players
    const topPlayersWithDetails = await Promise.all(
      topPlayers.map(async (player) => {
        const user = await User.findById(player._id).select('name email avatar');
        return {
          user: user ? {
            id: user._id,
            name: user.name,
            avatar: user.avatar
          } : null,
          sessions: player.totalSessions,
          totalScore: player.totalScore,
          avgScore: player.avgScore ? player.avgScore.toFixed(2) : 0,
          totalPlayTime: player.totalPlayTime
        };
      })
    );

    // ===== RETENTION METRICS =====
    // Users who played more than once
    const returningPlayers = await GameSession.aggregate([
      {
        $match: {
          gameId: game._id,
          createdAt: { $gte: fromDate }
        }
      },
      {
        $group: {
          _id: '$userId',
          sessionCount: { $sum: 1 }
        }
      },
      {
        $match: {
          sessionCount: { $gt: 1 }
        }
      },
      {
        $count: 'returningPlayers'
      }
    ]);

    const retentionCount = returningPlayers.length > 0 ? returningPlayers[0].returningPlayers : 0;
    const retentionRate = overall.uniquePlayers.length > 0
      ? ((retentionCount / overall.uniquePlayers.length) * 100).toFixed(2)
      : 0;

    res.status(200).json({
      game: {
        id: game._id,
        title: game.title,
        description: game.description,
        category: game.category,
        difficulty: game.difficulty,
        isActive: game.isActive,
        totalPlaysAllTime: game.totalPlays,
        averageRating: game.averageRating
      },
      timeRange: {
        days,
        from: fromDate,
        to: new Date()
      },
      overall: {
        totalPlays: overall.totalSessions,
        dailyActiveUsers: Math.round(overall.uniquePlayers.length / days),
        uniquePlayers: overall.uniquePlayers.length,
        totalPlayTime: overall.totalDuration,
        totalPlayTimeHours: (overall.totalDuration / 3600).toFixed(2),
        avgSessionLength: Math.round(overall.avgDuration),
        maxSessionLength: overall.maxDuration,
        minSessionLength: overall.minDuration,
        avgScore: overall.avgScore ? overall.avgScore.toFixed(2) : 0,
        maxScore: overall.maxScore,
        completionRate: overall.totalSessions > 0
          ? ((overall.completedSessions / overall.totalSessions) * 100).toFixed(2)
          : 0,
        retentionRate: parseFloat(retentionRate)
      },
      dailyStats,
      deviceBreakdown: deviceStats.map(device => ({
        deviceType: device._id,
        sessions: device.count,
        avgDuration: Math.round(device.avgDuration),
        percentage: overall.totalSessions > 0
          ? ((device.count / overall.totalSessions) * 100).toFixed(2)
          : 0
      })),
      hourlyDistribution: hourlyDistribution.map(hour => ({
        hour: hour._id,
        sessions: hour.count
      })),
      topPlayers: topPlayersWithDetails.filter(p => p.user !== null)
    });

  } catch (err) {
    console.error("GET GAME DETAILED ANALYTICS ERROR:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};

// Get game performance trends
export const getGamePerformanceTrends = async (req, res) => {
  try {
    const { gameId } = req.params;
    const { timeRange = 30 } = req.query;
    const developerId = req.user.userId;

    // Verify game belongs to developer
    const game = await Game.findOne({ _id: gameId, developerId });
    if (!game) {
      return res.status(404).json({
        message: "Game not found or you don't have access"
      });
    }

    const days = parseInt(timeRange);
    const fromDate = new Date(Date.now() - (days * 24 * 60 * 60 * 1000));

    // Weekly trends
    const weeklyTrends = await GameSession.aggregate([
      {
        $match: {
          gameId: game._id,
          createdAt: { $gte: fromDate }
        }
      },
      {
        $group: {
          _id: {
            week: { $week: '$createdAt' },
            year: { $year: '$createdAt' }
          },
          sessions: { $sum: 1 },
          uniquePlayers: { $addToSet: '$userId' },
          avgDuration: { $avg: '$duration' },
          avgScore: { $avg: '$score' }
        }
      },
      { $sort: { '_id.year': 1, '_id.week': 1 } },
      {
        $project: {
          week: '$_id.week',
          year: '$_id.year',
          sessions: 1,
          uniquePlayers: { $size: '$uniquePlayers' },
          avgDuration: { $round: ['$avgDuration', 0] },
          avgScore: { $round: ['$avgScore', 2] }
        }
      }
    ]);

    // Score distribution
    const scoreDistribution = await GameSession.aggregate([
      {
        $match: {
          gameId: game._id,
          createdAt: { $gte: fromDate },
          score: { $ne: null }
        }
      },
      {
        $bucket: {
          groupBy: '$score',
          boundaries: [0, 100, 200, 300, 400, 500, 1000, 5000, 10000],
          default: 'Other',
          output: {
            count: { $sum: 1 }
          }
        }
      }
    ]);

    // Session length distribution
    const sessionLengthDistribution = await GameSession.aggregate([
      {
        $match: {
          gameId: game._id,
          createdAt: { $gte: fromDate }
        }
      },
      {
        $bucket: {
          groupBy: '$duration',
          boundaries: [0, 60, 120, 300, 600, 1800, 3600],
          default: 'Over 1 hour',
          output: {
            count: { $sum: 1 }
          }
        }
      }
    ]);

    res.status(200).json({
      trends: {
        weekly: weeklyTrends,
        scoreDistribution,
        sessionLengthDistribution: sessionLengthDistribution.map(bucket => ({
          range: bucket._id === 'Over 1 hour' ? '60+ min' : `${bucket._id / 60}-${bucket._id === 3600 ? '60' : (bucket._id + 60) / 60} min`,
          count: bucket.count
        }))
      }
    });

  } catch (err) {
    console.error("GET GAME PERFORMANCE TRENDS ERROR:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};

// Compare multiple games
export const compareGames = async (req, res) => {
  try {
    const { gameIds, timeRange = 7 } = req.query;
    const developerId = req.user.userId;

    if (!gameIds) {
      return res.status(400).json({
        message: "gameIds parameter is required (comma-separated)"
      });
    }

    const ids = gameIds.split(',').map(id => id.trim());
    const days = parseInt(timeRange);
    const fromDate = new Date(Date.now() - (days * 24 * 60 * 60 * 1000));

    // Verify all games belong to developer
    const games = await Game.find({
      _id: { $in: ids },
      developerId
    });

    if (games.length !== ids.length) {
      return res.status(403).json({
        message: "Some games not found or you don't have access"
      });
    }

    // Get comparison data for each game
    const comparison = await Promise.all(
      games.map(async (game) => {
        const stats = await GameSession.aggregate([
          {
            $match: {
              gameId: game._id,
              createdAt: { $gte: fromDate }
            }
          },
          {
            $group: {
              _id: null,
              totalSessions: { $sum: 1 },
              uniquePlayers: { $addToSet: '$userId' },
              avgDuration: { $avg: '$duration' },
              avgScore: { $avg: '$score' },
              completedSessions: {
                $sum: { $cond: ['$completed', 1, 0] }
              }
            }
          }
        ]);

        const data = stats.length > 0 ? stats[0] : {
          totalSessions: 0,
          uniquePlayers: [],
          avgDuration: 0,
          avgScore: 0,
          completedSessions: 0
        };

        return {
          gameId: game._id,
          title: game.title,
          category: game.category,
          totalSessions: data.totalSessions,
          uniquePlayers: data.uniquePlayers.length,
          avgSessionLength: Math.round(data.avgDuration),
          avgScore: data.avgScore ? data.avgScore.toFixed(2) : 0,
          completionRate: data.totalSessions > 0
            ? ((data.completedSessions / data.totalSessions) * 100).toFixed(2)
            : 0,
          rating: game.averageRating
        };
      })
    );

    res.status(200).json({
      timeRange: days,
      comparison
    });

  } catch (err) {
    console.error("COMPARE GAMES ERROR:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};
