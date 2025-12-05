// src/controllers/analyticsController.js
import User from "../models/User.js";
import Challenge from "../models/Challenge.js";
import ChallengeTemplate from "../models/ChallengeTemplate.js";
import AudioFile from "../models/AudioFile.js";
import Game from "../models/Game.js";
import GameSession from "../models/GameSession.js";
import Session from "../models/Session.js";
import AdminAction from "../models/AdminAction.js";
import CoachRequest from "../models/CoachRequest.js";

// ============================================
// ADMIN: Platform Analytics Dashboard
// ============================================

// Get comprehensive platform analytics
export const getPlatformAnalytics = async (req, res) => {
  try {
    const {
      timeFrame = '30', // days
      category,
      startDate,
      endDate
    } = req.query;

    // Calculate date range
    const now = new Date();
    const daysAgo = parseInt(timeFrame);
    const fromDate = startDate ? new Date(startDate) : new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
    const toDate = endDate ? new Date(endDate) : now;

    // ===== USER ANALYTICS =====
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const verifiedUsers = await User.countDocuments({ isEmailVerified: true });

    // New sign-ups in period
    const newSignups = await User.countDocuments({
      createdAt: { $gte: fromDate, $lte: toDate }
    });

    // Daily sign-ups trend
    const dailySignups = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: fromDate, $lte: toDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Users by role
    const usersByRole = await User.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } }
    ]);

    // Active users in period (logged in)
    const activeInPeriod = await User.countDocuments({
      lastLogin: { $gte: fromDate, $lte: toDate }
    });

    // ===== CHALLENGE ANALYTICS =====
    const totalChallenges = await ChallengeTemplate.countDocuments();
    const activeChallenges = await ChallengeTemplate.countDocuments({ isActive: true });

    // Active participants
    const activeParticipants = await Challenge.countDocuments({
      status: { $in: ['not_started', 'in_progress'] },
      createdAt: { $gte: fromDate, $lte: toDate }
    });

    // Completed challenges in period
    const completedChallenges = await Challenge.countDocuments({
      status: 'completed',
      completedDate: { $gte: fromDate, $lte: toDate }
    });

    // Challenge participation trend
    const dailyChallengeStarts = await Challenge.aggregate([
      {
        $match: {
          startDate: { $gte: fromDate, $lte: toDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$startDate" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Popular challenges
    const popularChallenges = await ChallengeTemplate.find({ isActive: true })
      .sort({ totalParticipants: -1 })
      .limit(5)
      .select('title totalParticipants totalCompletions category');

    // ===== AUDIO LIBRARY ANALYTICS =====
    const totalAudioFiles = await AudioFile.countDocuments({ isActive: true });

    const audioPlays = await AudioFile.aggregate([
      {
        $match: {
          updatedAt: { $gte: fromDate, $lte: toDate }
        }
      },
      {
        $group: {
          _id: null,
          totalPlays: { $sum: '$playCount' },
          totalDownloads: { $sum: '$downloadCount' }
        }
      }
    ]);

    const audioStats = audioPlays.length > 0 ? audioPlays[0] : { totalPlays: 0, totalDownloads: 0 };

    // ===== GAME ANALYTICS =====
    const totalGames = await Game.countDocuments({ isActive: true });

    const gameSessionsInPeriod = await GameSession.countDocuments({
      createdAt: { $gte: fromDate, $lte: toDate }
    });

    const gameStats = await GameSession.aggregate([
      {
        $match: {
          createdAt: { $gte: fromDate, $lte: toDate }
        }
      },
      {
        $group: {
          _id: null,
          totalSessions: { $sum: 1 },
          totalPlayTime: { $sum: '$duration' },
          avgSessionLength: { $avg: '$duration' }
        }
      }
    ]);

    const gameMetrics = gameStats.length > 0 ? gameStats[0] : {
      totalSessions: 0,
      totalPlayTime: 0,
      avgSessionLength: 0
    };

    // ===== MEDITATION SESSIONS =====
    const meditationSessions = await Session.countDocuments({
      startedAt: { $gte: fromDate, $lte: toDate }
    });

    const meditationStats = await Session.aggregate([
      {
        $match: {
          startedAt: { $gte: fromDate, $lte: toDate }
        }
      },
      {
        $group: {
          _id: null,
          totalDuration: { $sum: '$duration' },
          avgDuration: { $avg: '$duration' },
          completedSessions: {
            $sum: { $cond: ['$completed', 1, 0] }
          }
        }
      }
    ]);

    const meditation = meditationStats.length > 0 ? meditationStats[0] : {
      totalDuration: 0,
      avgDuration: 0,
      completedSessions: 0
    };

    // ===== COACH ANALYTICS =====
    const totalCoaches = await User.countDocuments({ isApprovedCoach: true });
    const pendingCoaches = await CoachRequest.countDocuments({ status: 'pending' });

    // ===== ADMIN ACTIVITY =====
    const adminActions = await AdminAction.countDocuments({
      createdAt: { $gte: fromDate, $lte: toDate }
    });

    const actionsByType = await AdminAction.aggregate([
      {
        $match: {
          createdAt: { $gte: fromDate, $lte: toDate }
        }
      },
      { $group: { _id: "$actionType", count: { $sum: 1 } } }
    ]);

    // ===== ENGAGEMENT METRICS =====
    const engagementRate = totalUsers > 0 ? ((activeInPeriod / totalUsers) * 100).toFixed(2) : 0;
    const challengeCompletionRate = activeParticipants > 0
      ? ((completedChallenges / activeParticipants) * 100).toFixed(2)
      : 0;

    res.status(200).json({
      analytics: {
        timeFrame: {
          days: daysAgo,
          from: fromDate,
          to: toDate
        },
        users: {
          total: totalUsers,
          active: activeUsers,
          verified: verifiedUsers,
          newSignups,
          activeInPeriod,
          engagementRate: parseFloat(engagementRate),
          byRole: usersByRole.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
          }, {}),
          dailySignups: dailySignups.map(day => ({
            date: day._id,
            count: day.count
          }))
        },
        challenges: {
          totalTemplates: totalChallenges,
          activeTemplates: activeChallenges,
          activeParticipants,
          completedInPeriod: completedChallenges,
          completionRate: parseFloat(challengeCompletionRate),
          popular: popularChallenges.map(c => ({
            id: c._id,
            title: c.title,
            category: c.category,
            participants: c.totalParticipants,
            completions: c.totalCompletions
          })),
          dailyStarts: dailyChallengeStarts.map(day => ({
            date: day._id,
            count: day.count
          }))
        },
        audio: {
          totalFiles: totalAudioFiles,
          totalPlays: audioStats.totalPlays,
          totalDownloads: audioStats.totalDownloads
        },
        games: {
          totalGames,
          sessionsInPeriod: gameSessionsInPeriod,
          totalPlayTime: gameMetrics.totalPlayTime,
          avgSessionLength: Math.round(gameMetrics.avgSessionLength),
          totalPlayTimeHours: (gameMetrics.totalPlayTime / 3600).toFixed(2)
        },
        meditation: {
          totalSessions: meditationSessions,
          completedSessions: meditation.completedSessions,
          totalDurationMinutes: meditation.totalDuration,
          avgDurationMinutes: Math.round(meditation.avgDuration)
        },
        coaches: {
          total: totalCoaches,
          pending: pendingCoaches
        },
        adminActivity: {
          totalActions: adminActions,
          byType: actionsByType.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
          }, {})
        }
      }
    });

  } catch (err) {
    console.error("GET PLATFORM ANALYTICS ERROR:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};

// Get user growth analytics
export const getUserGrowthAnalytics = async (req, res) => {
  try {
    const { days = 30 } = req.query;

    const fromDate = new Date(Date.now() - (parseInt(days) * 24 * 60 * 60 * 1000));

    // Daily user registration
    const dailyRegistrations = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: fromDate }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            role: "$role"
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.date": 1 } }
    ]);

    // Cumulative users over time
    const cumulativeUsers = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: fromDate }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Calculate cumulative
    let cumulative = 0;
    const cumulativeData = cumulativeUsers.map(day => {
      cumulative += day.count;
      return {
        date: day._id,
        total: cumulative
      };
    });

    res.status(200).json({
      growth: {
        dailyRegistrations,
        cumulativeUsers: cumulativeData
      }
    });

  } catch (err) {
    console.error("GET USER GROWTH ANALYTICS ERROR:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};

// Get engagement analytics
export const getEngagementAnalytics = async (req, res) => {
  try {
    const { days = 30 } = req.query;

    const fromDate = new Date(Date.now() - (parseInt(days) * 24 * 60 * 60 * 1000));

    // Daily active users
    const dailyActiveUsers = await User.aggregate([
      {
        $match: {
          lastLogin: { $gte: fromDate }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$lastLogin" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Session distribution
    const sessionsByCategory = await Session.aggregate([
      {
        $match: {
          startedAt: { $gte: fromDate }
        }
      },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          totalDuration: { $sum: '$duration' }
        }
      }
    ]);

    // Game sessions by day
    const dailyGameSessions = await GameSession.aggregate([
      {
        $match: {
          createdAt: { $gte: fromDate }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
          totalDuration: { $sum: '$duration' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      engagement: {
        dailyActiveUsers: dailyActiveUsers.map(day => ({
          date: day._id,
          users: day.count
        })),
        sessionsByCategory,
        dailyGameSessions: dailyGameSessions.map(day => ({
          date: day._id,
          sessions: day.count,
          totalDuration: day.totalDuration
        }))
      }
    });

  } catch (err) {
    console.error("GET ENGAGEMENT ANALYTICS ERROR:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};
