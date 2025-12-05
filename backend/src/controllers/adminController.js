// src/controllers/adminController.js
import User from "../models/User.js";
import CoachRequest from "../models/CoachRequest.js";
import CoachProfile from "../models/CoachProfile.js";
import AdminAction from "../models/AdminAction.js";
import bcrypt from "bcryptjs";
import { sendPasswordResetNotification } from "../utils/emailService.js";

export const getAllUsers = async (req, res) => {
  try {
    const {
      role,
      roles, // Support multiple roles: ?roles=user,coach
      isActive,
      isBanned,
      isEmailVerified,
      isPendingCoach,
      isApprovedCoach,
      search,
      dateFrom, // Filter by join date
      dateTo,   // Filter by join date
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const filter = {};

    // Role filtering - support single or multiple roles
    if (roles) {
      const roleArray = roles.split(',').map(r => r.trim());
      filter.role = { $in: roleArray };
    } else if (role) {
      filter.role = role;
    }

    // Account status filters
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    if (isBanned !== undefined) {
      filter.isBanned = isBanned === 'true';
    }

    if (isEmailVerified !== undefined) {
      filter.isEmailVerified = isEmailVerified === 'true';
    }

    // Coach status filters
    if (isPendingCoach !== undefined) {
      filter.isPendingCoach = isPendingCoach === 'true';
    }

    if (isApprovedCoach !== undefined) {
      filter.isApprovedCoach = isApprovedCoach === 'true';
    }

    // Date range filter for join date
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) {
        filter.createdAt.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        filter.createdAt.$lte = new Date(dateTo);
      }
    }

    // Search by name, email, or phone
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Validate sortBy field to prevent injection
    const allowedSortFields = ['createdAt', 'updatedAt', 'name', 'email', 'lastLogin', 'loginCount', 'role'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const sort = { [sortField]: sortOrder === 'desc' ? -1 : 1 };

    const users = await User.find(filter)
      .select('-password -verificationToken -verificationTokenExpires')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('coachProfileId', 'rating totalMentees')
      .populate('statusChangedBy', 'name email');

    const totalUsers = await User.countDocuments(filter);

    // Get quick stats for the current filter
    const stats = await User.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalActive: { $sum: { $cond: ['$isActive', 1, 0] } },
          totalInactive: { $sum: { $cond: ['$isActive', 0, 1] } },
          totalBanned: { $sum: { $cond: ['$isBanned', 1, 0] } },
          totalVerified: { $sum: { $cond: ['$isEmailVerified', 1, 0] } },
          totalUnverified: { $sum: { $cond: ['$isEmailVerified', 0, 1] } }
        }
      }
    ]);

    const filterStats = stats.length > 0 ? stats[0] : {
      totalActive: 0,
      totalInactive: 0,
      totalBanned: 0,
      totalVerified: 0,
      totalUnverified: 0
    };

    res.status(200).json({
      users: users.map(user => ({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
        phone: user.phone,
        isActive: user.isActive,
        isBanned: user.isBanned,
        isEmailVerified: user.isEmailVerified,
        isPendingCoach: user.isPendingCoach,
        isApprovedCoach: user.isApprovedCoach,
        lastLogin: user.lastLogin,
        loginCount: user.loginCount,
        statusChangedAt: user.statusChangedAt,
        statusChangedBy: user.statusChangedBy ? {
          id: user.statusChangedBy._id,
          name: user.statusChangedBy.name,
          email: user.statusChangedBy.email
        } : null,
        statusChangeReason: user.statusChangeReason,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        coachProfile: user.coachProfileId || null
      })),
      filterStats: {
        active: filterStats.totalActive,
        inactive: filterStats.totalInactive,
        banned: filterStats.totalBanned,
        verified: filterStats.totalVerified,
        unverified: filterStats.totalUnverified
      },
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalUsers / parseInt(limit)),
        totalUsers,
        limit: parseInt(limit)
      }
    });

  } catch (err) {
    console.error("GET ALL USERS ERROR:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};

export const getUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId)
      .select('-password')
      .populate('coachRequestId')
      .populate('coachProfileId');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
        phone: user.phone,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        preferences: user.preferences,
        isActive: user.isActive,
        isBanned: user.isBanned,
        isEmailVerified: user.isEmailVerified,
        isPendingCoach: user.isPendingCoach,
        isApprovedCoach: user.isApprovedCoach,
        coachRequest: user.coachRequestId || null,
        coachProfile: user.coachProfileId || null,
        lastLogin: user.lastLogin,
        loginCount: user.loginCount,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });

  } catch (err) {
    console.error("GET USER DETAILS ERROR:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;

    const allowedUpdates = [
      'name',
      'email',
      'role',
      'avatar',
      'bio',
      'phone',
      'dateOfBirth',
      'gender',
      'isActive',
      'isBanned',
      'isEmailVerified',
      'preferences'
    ];

    const filteredUpdates = {};
    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        filteredUpdates[key] = updates[key];
      }
    });

    if (filteredUpdates.role) {
      const validRoles = ['user', 'coach', 'admin', 'developer'];
      if (!validRoles.includes(filteredUpdates.role)) {
        return res.status(400).json({
          message: "Invalid role. Must be: user, coach, admin, or developer"
        });
      }
    }

    if (filteredUpdates.email) {
      const existingUser = await User.findOne({
        email: filteredUpdates.email,
        _id: { $ne: userId }
      });

      if (existingUser) {
        return res.status(409).json({ message: "Email already in use" });
      }
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: filteredUpdates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
        phone: user.phone,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        isActive: user.isActive,
        isBanned: user.isBanned,
        isEmailVerified: user.isEmailVerified,
        preferences: user.preferences,
        updatedAt: user.updatedAt
      }
    });

  } catch (err) {
    console.error("UPDATE USER ERROR:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};

export const resetUserPassword = async (req, res) => {
  try {
    const { userId } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ message: "New password is required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters"
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    // Send password reset notification email
    try {
      await sendPasswordResetNotification(user.email, user.name, newPassword);
    } catch (emailError) {
      console.error('Failed to send password reset notification:', emailError);
      // Continue even if email fails - don't block the password reset
    }

    res.status(200).json({
      message: "Password reset successfully. User has been notified via email.",
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });

  } catch (err) {
    console.error("RESET USER PASSWORD ERROR:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};

export const deactivateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;

    if (!reason || reason.trim() === '') {
      return res.status(400).json({
        message: "Reason for deactivation is required"
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isActive) {
      return res.status(400).json({ message: "User is already deactivated" });
    }

    user.isActive = false;
    user.statusChangedAt = new Date();
    user.statusChangedBy = req.user.userId;
    user.statusChangeReason = reason.trim();
    await user.save();

    // Log admin action
    await AdminAction.create({
      actionType: 'deactivate',
      reason: reason.trim(),
      targetUserId: user._id,
      targetUserEmail: user.email,
      targetUserName: user.name,
      adminId: req.user.userId,
      adminEmail: req.user.email || 'unknown',
      adminName: req.user.name || 'Admin',
      ipAddress: req.ip || req.connection.remoteAddress
    });

    res.status(200).json({
      message: "User deactivated successfully",
      reason: reason.trim(),
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        isActive: user.isActive
      }
    });

  } catch (err) {
    console.error("DEACTIVATE USER ERROR:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};

export const activateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isActive) {
      return res.status(400).json({ message: "User is already active" });
    }

    const activationReason = reason?.trim() || 'Account reactivated by administrator';
    user.isActive = true;
    user.statusChangedAt = new Date();
    user.statusChangedBy = req.user.userId;
    user.statusChangeReason = activationReason;
    await user.save();

    // Log admin action
    await AdminAction.create({
      actionType: 'activate',
      reason: reason?.trim() || 'Account reactivated by administrator',
      targetUserId: user._id,
      targetUserEmail: user.email,
      targetUserName: user.name,
      adminId: req.user.userId,
      adminEmail: req.user.email || 'unknown',
      adminName: req.user.name || 'Admin',
      ipAddress: req.ip || req.connection.remoteAddress
    });

    res.status(200).json({
      message: "User activated successfully",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        isActive: user.isActive
      }
    });

  } catch (err) {
    console.error("ACTIVATE USER ERROR:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};

export const banUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;

    if (!reason || reason.trim() === '') {
      return res.status(400).json({ message: "Ban reason is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isBanned) {
      return res.status(400).json({ message: "User is already banned" });
    }

    user.isBanned = true;
    user.isActive = false;
    user.statusChangedAt = new Date();
    user.statusChangedBy = req.user.userId;
    user.statusChangeReason = reason.trim();
    await user.save();

    // Log admin action
    await AdminAction.create({
      actionType: 'ban',
      reason: reason.trim(),
      targetUserId: user._id,
      targetUserEmail: user.email,
      targetUserName: user.name,
      adminId: req.user.userId,
      adminEmail: req.user.email || 'unknown',
      adminName: req.user.name || 'Admin',
      ipAddress: req.ip || req.connection.remoteAddress
    });

    res.status(200).json({
      message: "User banned successfully",
      reason: reason.trim(),
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        isBanned: user.isBanned,
        isActive: user.isActive
      }
    });

  } catch (err) {
    console.error("BAN USER ERROR:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};

export const unbanUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isBanned) {
      return res.status(400).json({ message: "User is not banned" });
    }

    const unbanReason = reason?.trim() || 'User unbanned by administrator';
    user.isBanned = false;
    user.isActive = true;
    user.statusChangedAt = new Date();
    user.statusChangedBy = req.user.userId;
    user.statusChangeReason = unbanReason;
    await user.save();

    // Log admin action
    await AdminAction.create({
      actionType: 'unban',
      reason: reason?.trim() || 'User unbanned by administrator',
      targetUserId: user._id,
      targetUserEmail: user.email,
      targetUserName: user.name,
      adminId: req.user.userId,
      adminEmail: req.user.email || 'unknown',
      adminName: req.user.name || 'Admin',
      ipAddress: req.ip || req.connection.remoteAddress
    });

    res.status(200).json({
      message: "User unbanned successfully",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        isBanned: user.isBanned,
        isActive: user.isActive
      }
    });

  } catch (err) {
    console.error("UNBAN USER ERROR:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { confirmEmail, reason } = req.body;

    if (!reason || reason.trim() === '') {
      return res.status(400).json({
        message: "Reason for deletion is required"
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (confirmEmail !== user.email) {
      return res.status(400).json({
        message: "Email confirmation does not match. Cannot delete user."
      });
    }

    // Store user info before deletion for logging
    const deletedUserInfo = {
      id: user._id,
      email: user.email,
      name: user.name
    };

    // Log admin action BEFORE deleting the user
    await AdminAction.create({
      actionType: 'delete',
      reason: reason.trim(),
      targetUserId: user._id,
      targetUserEmail: user.email,
      targetUserName: user.name,
      adminId: req.user.userId,
      adminEmail: req.user.email || 'unknown',
      adminName: req.user.name || 'Admin',
      ipAddress: req.ip || req.connection.remoteAddress,
      metadata: {
        deletedCoachRequest: !!user.coachRequestId,
        deletedCoachProfile: !!user.coachProfileId
      }
    });

    // Delete associated data
    if (user.coachRequestId) {
      await CoachRequest.findByIdAndDelete(user.coachRequestId);
    }

    if (user.coachProfileId) {
      await CoachProfile.findByIdAndDelete(user.coachProfileId);
    }

    // Delete user
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      message: "User and associated data deleted permanently",
      reason: reason.trim(),
      deletedUser: deletedUserInfo
    });

  } catch (err) {
    console.error("DELETE USER ERROR:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};

export const getSystemStats = async (req, res) => {
  try {
    // Basic counts
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const inactiveUsers = await User.countDocuments({ isActive: false });
    const bannedUsers = await User.countDocuments({ isBanned: true });
    const verifiedUsers = await User.countDocuments({ isEmailVerified: true });
    const unverifiedUsers = await User.countDocuments({ isEmailVerified: false });

    // Coach statistics
    const totalCoaches = await User.countDocuments({ isApprovedCoach: true });
    const pendingCoaches = await User.countDocuments({ isPendingCoach: true });
    const pendingCoachApplications = await CoachRequest.countDocuments({ status: 'pending' });

    // Users by role breakdown
    const usersByRole = await User.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } }
    ]);

    // Recent registrations (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newUsersLast30Days = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    // Recent registrations (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const newUsersLast7Days = await User.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    // Active users (logged in last 30 days)
    const activeInLast30Days = await User.countDocuments({
      lastLogin: { $gte: thirtyDaysAgo }
    });

    // Recent admin actions (last 30 days)
    const recentAdminActions = await AdminAction.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    // Admin actions breakdown
    const actionsByType = await AdminAction.aggregate([
      { $group: { _id: "$actionType", count: { $sum: 1 } } }
    ]);

    // Daily registration trend (last 7 days)
    const dailyRegistrations = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo }
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

    res.status(200).json({
      stats: {
        // Overview
        overview: {
          totalUsers,
          activeUsers,
          inactiveUsers,
          bannedUsers,
          verifiedUsers,
          unverifiedUsers,
          activePercentage: totalUsers > 0 ? ((activeUsers / totalUsers) * 100).toFixed(2) : 0,
          verifiedPercentage: totalUsers > 0 ? ((verifiedUsers / totalUsers) * 100).toFixed(2) : 0
        },

        // Coaches
        coaches: {
          totalCoaches,
          pendingCoaches,
          pendingApplications: pendingCoachApplications,
          approvalRate: (pendingCoaches + totalCoaches) > 0
            ? ((totalCoaches / (pendingCoaches + totalCoaches)) * 100).toFixed(2)
            : 0
        },

        // Users by role
        usersByRole: usersByRole.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),

        // Growth metrics
        growth: {
          newUsersLast7Days,
          newUsersLast30Days,
          activeInLast30Days,
          dailyRegistrations: dailyRegistrations.map(day => ({
            date: day._id,
            count: day.count
          }))
        },

        // Admin activity
        adminActivity: {
          recentActions: recentAdminActions,
          actionsByType: actionsByType.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
          }, {})
        }
      }
    });

  } catch (err) {
    console.error("GET SYSTEM STATS ERROR:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};

export const getAdminActions = async (req, res) => {
  try {
    const {
      userId,
      adminId,
      actionType,
      page = 1,
      limit = 50,
      sortOrder = 'desc'
    } = req.query;

    const filter = {};

    if (userId) {
      filter.targetUserId = userId;
    }

    if (adminId) {
      filter.adminId = adminId;
    }

    if (actionType) {
      filter.actionType = actionType;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = { createdAt: sortOrder === 'desc' ? -1 : 1 };

    const actions = await AdminAction.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('targetUserId', 'name email avatar role')
      .populate('adminId', 'name email avatar');

    const totalActions = await AdminAction.countDocuments(filter);

    res.status(200).json({
      actions: actions.map(action => ({
        id: action._id,
        actionType: action.actionType,
        reason: action.reason,
        targetUser: {
          id: action.targetUserId?._id || action.targetUserId,
          name: action.targetUserName,
          email: action.targetUserEmail,
          avatar: action.targetUserId?.avatar || null,
          role: action.targetUserId?.role || null
        },
        admin: {
          id: action.adminId?._id || action.adminId,
          name: action.adminName,
          email: action.adminEmail,
          avatar: action.adminId?.avatar || null
        },
        metadata: action.metadata,
        ipAddress: action.ipAddress,
        createdAt: action.createdAt
      })),
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalActions / parseInt(limit)),
        totalActions,
        limit: parseInt(limit)
      }
    });

  } catch (err) {
    console.error("GET ADMIN ACTIONS ERROR:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};

export const getUserAdminActions = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const actions = await AdminAction.find({ targetUserId: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('adminId', 'name email');

    const totalActions = await AdminAction.countDocuments({ targetUserId: userId });

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      },
      actions: actions.map(action => ({
        id: action._id,
        actionType: action.actionType,
        reason: action.reason,
        admin: {
          id: action.adminId?._id || action.adminId,
          name: action.adminName,
          email: action.adminEmail
        },
        createdAt: action.createdAt
      })),
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalActions / parseInt(limit)),
        totalActions,
        limit: parseInt(limit)
      }
    });

  } catch (err) {
    console.error("GET USER ADMIN ACTIONS ERROR:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};

export const exportUsers = async (req, res) => {
  try {
    const {
      role,
      roles,
      isActive,
      isBanned,
      isEmailVerified,
      search,
      dateFrom,
      dateTo,
      format = 'csv'
    } = req.query;

    const filter = {};

    // Apply same filters as getAllUsers
    if (roles) {
      const roleArray = roles.split(',').map(r => r.trim());
      filter.role = { $in: roleArray };
    } else if (role) {
      filter.role = role;
    }

    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    if (isBanned !== undefined) {
      filter.isBanned = isBanned === 'true';
    }

    if (isEmailVerified !== undefined) {
      filter.isEmailVerified = isEmailVerified === 'true';
    }

    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) {
        filter.createdAt.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        filter.createdAt.$lte = new Date(dateTo);
      }
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    // Get all users matching filter (limit to 10000 for safety)
    const users = await User.find(filter)
      .select('-password -verificationToken -verificationTokenExpires')
      .limit(10000)
      .sort({ createdAt: -1 })
      .lean();

    if (format === 'csv') {
      // Generate CSV content
      const headers = [
        'ID',
        'Name',
        'Email',
        'Role',
        'Phone',
        'Active',
        'Banned',
        'Email Verified',
        'Is Coach',
        'Last Login',
        'Login Count',
        'Join Date'
      ];

      const csvRows = [
        headers.join(','),
        ...users.map(user => [
          user._id,
          `"${user.name || ''}"`,
          user.email,
          user.role,
          `"${user.phone || ''}"`,
          user.isActive,
          user.isBanned,
          user.isEmailVerified,
          user.isApprovedCoach,
          user.lastLogin ? new Date(user.lastLogin).toISOString() : '',
          user.loginCount || 0,
          new Date(user.createdAt).toISOString()
        ].join(','))
      ];

      const csv = csvRows.join('\n');

      // Set headers for file download
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="users-export-${Date.now()}.csv"`);

      return res.send(csv);
    } else if (format === 'json') {
      // Return JSON format
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="users-export-${Date.now()}.json"`);

      return res.json({
        exportDate: new Date().toISOString(),
        totalUsers: users.length,
        filters: filter,
        users: users.map(user => ({
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          isActive: user.isActive,
          isBanned: user.isBanned,
          isEmailVerified: user.isEmailVerified,
          isApprovedCoach: user.isApprovedCoach,
          isPendingCoach: user.isPendingCoach,
          lastLogin: user.lastLogin,
          loginCount: user.loginCount,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }))
      });
    } else {
      return res.status(400).json({
        message: "Invalid format. Supported formats: csv, json"
      });
    }

  } catch (err) {
    console.error("EXPORT USERS ERROR:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};