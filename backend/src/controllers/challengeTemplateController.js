// src/controllers/challengeTemplateController.js
import ChallengeTemplate from "../models/ChallengeTemplate.js";
import Challenge from "../models/Challenge.js";

// ============================================
// ADMIN: Challenge Template Management
// ============================================

// Get all challenge templates (with filters)
export const getAllChallengeTemplates = async (req, res) => {
  try {
    const {
      category,
      difficulty,
      isPublic,
      isActive,
      isFeatured,
      search,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const filter = {};

    // Apply filters
    if (category) {
      filter.category = category;
    }

    if (difficulty) {
      filter.difficulty = difficulty;
    }

    if (isPublic !== undefined) {
      filter.isPublic = isPublic === 'true';
    }

    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    if (isFeatured !== undefined) {
      filter.isFeatured = isFeatured === 'true';
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
    const allowedSortFields = ['createdAt', 'updatedAt', 'title', 'category', 'difficulty', 'totalParticipants', 'averageRating'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const sort = { [sortField]: sortOrder === 'desc' ? -1 : 1 };

    const templates = await ChallengeTemplate.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('createdBy', 'name email')
      .populate('lastModifiedBy', 'name email');

    const totalTemplates = await ChallengeTemplate.countDocuments(filter);

    // Get statistics for filtered templates
    const stats = await ChallengeTemplate.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalActive: { $sum: { $cond: ['$isActive', 1, 0] } },
          totalPublic: { $sum: { $cond: ['$isPublic', 1, 0] } },
          totalFeatured: { $sum: { $cond: ['$isFeatured', 1, 0] } },
          totalParticipants: { $sum: '$totalParticipants' },
          totalCompletions: { $sum: '$totalCompletions' }
        }
      }
    ]);

    const filterStats = stats.length > 0 ? stats[0] : {
      totalActive: 0,
      totalPublic: 0,
      totalFeatured: 0,
      totalParticipants: 0,
      totalCompletions: 0
    };

    res.status(200).json({
      templates: templates.map(template => ({
        id: template._id,
        title: template.title,
        description: template.description,
        shortDescription: template.shortDescription,
        category: template.category,
        difficulty: template.difficulty,
        duration: template.duration,
        isPublic: template.isPublic,
        isActive: template.isActive,
        isFeatured: template.isFeatured,
        pointsReward: template.pointsReward,
        badgeName: template.badgeName,
        imageUrl: template.imageUrl,
        iconUrl: template.iconUrl,
        totalParticipants: template.totalParticipants,
        totalCompletions: template.totalCompletions,
        completionRate: template.calculateCompletionRate(),
        averageRating: template.averageRating,
        totalRatings: template.totalRatings,
        tags: template.tags,
        createdBy: template.createdBy,
        lastModifiedBy: template.lastModifiedBy,
        createdAt: template.createdAt,
        updatedAt: template.updatedAt
      })),
      filterStats,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalTemplates / parseInt(limit)),
        totalTemplates,
        limit: parseInt(limit)
      }
    });

  } catch (err) {
    console.error("GET ALL CHALLENGE TEMPLATES ERROR:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};

// Get single challenge template by ID
export const getChallengeTemplateById = async (req, res) => {
  try {
    const { templateId } = req.params;

    const template = await ChallengeTemplate.findById(templateId)
      .populate('createdBy', 'name email avatar')
      .populate('lastModifiedBy', 'name email avatar');

    if (!template) {
      return res.status(404).json({
        message: "Challenge template not found"
      });
    }

    // Get active participants count
    const activeParticipants = await Challenge.countDocuments({
      templateId: template._id,
      status: { $in: ['not_started', 'in_progress'] }
    });

    res.status(200).json({
      template: {
        id: template._id,
        title: template.title,
        description: template.description,
        shortDescription: template.shortDescription,
        category: template.category,
        difficulty: template.difficulty,
        duration: template.duration,
        targetMetric: template.targetMetric,
        targetValue: template.targetValue,
        targetUnit: template.targetUnit,
        pointsReward: template.pointsReward,
        badgeIcon: template.badgeIcon,
        badgeName: template.badgeName,
        isPublic: template.isPublic,
        isActive: template.isActive,
        isFeatured: template.isFeatured,
        instructions: template.instructions,
        tips: template.tips,
        resources: template.resources,
        imageUrl: template.imageUrl,
        iconUrl: template.iconUrl,
        totalParticipants: template.totalParticipants,
        totalCompletions: template.totalCompletions,
        activeParticipants,
        completionRate: template.calculateCompletionRate(),
        averageRating: template.averageRating,
        totalRatings: template.totalRatings,
        tags: template.tags,
        prerequisites: template.prerequisites,
        ageRestriction: template.ageRestriction,
        createdBy: template.createdBy,
        lastModifiedBy: template.lastModifiedBy,
        createdAt: template.createdAt,
        updatedAt: template.updatedAt
      }
    });

  } catch (err) {
    console.error("GET CHALLENGE TEMPLATE ERROR:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};

// Create new challenge template
export const createChallengeTemplate = async (req, res) => {
  try {
    const {
      title,
      description,
      shortDescription,
      category,
      difficulty,
      duration,
      targetMetric,
      targetValue,
      targetUnit,
      pointsReward,
      badgeIcon,
      badgeName,
      isPublic,
      isActive,
      isFeatured,
      instructions,
      tips,
      resources,
      imageUrl,
      iconUrl,
      tags,
      prerequisites,
      ageRestriction
    } = req.body;

    // Validation
    const errors = [];

    if (!title || title.trim() === '') {
      errors.push("Title is required");
    }

    if (!description || description.trim() === '') {
      errors.push("Description is required");
    }

    if (!duration || !duration.value || duration.value < 1) {
      errors.push("Valid duration is required");
    }

    if (title && title.length > 200) {
      errors.push("Title must not exceed 200 characters");
    }

    if (description && description.length > 2000) {
      errors.push("Description must not exceed 2000 characters");
    }

    if (errors.length > 0) {
      return res.status(400).json({
        message: "Validation error",
        errors
      });
    }

    // Create template
    const template = await ChallengeTemplate.create({
      title: title.trim(),
      description: description.trim(),
      shortDescription: shortDescription?.trim(),
      category: category || 'focus',
      difficulty: difficulty || 'medium',
      duration: {
        value: duration.value,
        unit: duration.unit || 'days'
      },
      targetMetric,
      targetValue,
      targetUnit,
      pointsReward: pointsReward || 0,
      badgeIcon,
      badgeName,
      isPublic: isPublic !== undefined ? isPublic : true,
      isActive: isActive !== undefined ? isActive : true,
      isFeatured: isFeatured !== undefined ? isFeatured : false,
      instructions: instructions || [],
      tips: tips || [],
      resources: resources || [],
      imageUrl,
      iconUrl,
      tags: tags || [],
      prerequisites,
      ageRestriction: ageRestriction || 0,
      createdBy: req.user.userId
    });

    res.status(201).json({
      message: "Challenge template created successfully",
      template: {
        id: template._id,
        title: template.title,
        description: template.description,
        category: template.category,
        difficulty: template.difficulty,
        duration: template.duration,
        isPublic: template.isPublic,
        isActive: template.isActive,
        createdAt: template.createdAt
      }
    });

  } catch (err) {
    console.error("CREATE CHALLENGE TEMPLATE ERROR:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};

// Update challenge template
export const updateChallengeTemplate = async (req, res) => {
  try {
    const { templateId } = req.params;
    const updates = req.body;

    const template = await ChallengeTemplate.findById(templateId);
    if (!template) {
      return res.status(404).json({
        message: "Challenge template not found"
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

    if (updates.title && updates.title.length > 200) {
      errors.push("Title must not exceed 200 characters");
    }

    if (updates.description && updates.description.length > 2000) {
      errors.push("Description must not exceed 2000 characters");
    }

    if (errors.length > 0) {
      return res.status(400).json({
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
      'duration',
      'targetMetric',
      'targetValue',
      'targetUnit',
      'pointsReward',
      'badgeIcon',
      'badgeName',
      'isPublic',
      'isActive',
      'isFeatured',
      'instructions',
      'tips',
      'resources',
      'imageUrl',
      'iconUrl',
      'tags',
      'prerequisites',
      'ageRestriction'
    ];

    // Apply updates
    allowedUpdates.forEach(field => {
      if (updates[field] !== undefined) {
        template[field] = updates[field];
      }
    });

    // Track who modified
    template.lastModifiedBy = req.user.userId;

    await template.save();

    res.status(200).json({
      message: "Challenge template updated successfully",
      template: {
        id: template._id,
        title: template.title,
        description: template.description,
        category: template.category,
        difficulty: template.difficulty,
        isPublic: template.isPublic,
        isActive: template.isActive,
        isFeatured: template.isFeatured,
        updatedAt: template.updatedAt
      }
    });

  } catch (err) {
    console.error("UPDATE CHALLENGE TEMPLATE ERROR:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};

// Delete challenge template
export const deleteChallengeTemplate = async (req, res) => {
  try {
    const { templateId } = req.params;
    const { confirmTitle } = req.body;

    const template = await ChallengeTemplate.findById(templateId);
    if (!template) {
      return res.status(404).json({
        message: "Challenge template not found"
      });
    }

    // Confirmation check
    if (confirmTitle !== template.title) {
      return res.status(400).json({
        message: "Title confirmation does not match. Cannot delete challenge."
      });
    }

    // Check for active participants
    const activeParticipants = await Challenge.countDocuments({
      templateId: template._id,
      status: { $in: ['not_started', 'in_progress'] }
    });

    if (activeParticipants > 0) {
      return res.status(400).json({
        message: `Cannot delete challenge. ${activeParticipants} user(s) are currently participating.`,
        activeParticipants
      });
    }

    // Store template info before deletion
    const deletedInfo = {
      id: template._id,
      title: template.title,
      category: template.category,
      totalParticipants: template.totalParticipants
    };

    await ChallengeTemplate.findByIdAndDelete(templateId);

    res.status(200).json({
      message: "Challenge template deleted successfully",
      deletedTemplate: deletedInfo
    });

  } catch (err) {
    console.error("DELETE CHALLENGE TEMPLATE ERROR:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};

// Get challenge statistics
export const getChallengeStatistics = async (req, res) => {
  try {
    const totalTemplates = await ChallengeTemplate.countDocuments();
    const activeTemplates = await ChallengeTemplate.countDocuments({ isActive: true });
    const publicTemplates = await ChallengeTemplate.countDocuments({ isPublic: true });
    const featuredTemplates = await ChallengeTemplate.countDocuments({ isFeatured: true });

    // Total challenges (user instances)
    const totalChallenges = await Challenge.countDocuments();
    const activeChallenges = await Challenge.countDocuments({
      status: { $in: ['not_started', 'in_progress'] }
    });
    const completedChallenges = await Challenge.countDocuments({ status: 'completed' });

    // By category
    const templatesByCategory = await ChallengeTemplate.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);

    // By difficulty
    const templatesByDifficulty = await ChallengeTemplate.aggregate([
      { $group: { _id: "$difficulty", count: { $sum: 1 } } }
    ]);

    // Top performing challenges
    const topChallenges = await ChallengeTemplate.find({ isActive: true })
      .sort({ totalCompletions: -1, averageRating: -1 })
      .limit(5)
      .select('title totalParticipants totalCompletions averageRating');

    res.status(200).json({
      stats: {
        templates: {
          total: totalTemplates,
          active: activeTemplates,
          public: publicTemplates,
          featured: featuredTemplates
        },
        challenges: {
          total: totalChallenges,
          active: activeChallenges,
          completed: completedChallenges,
          completionRate: totalChallenges > 0
            ? ((completedChallenges / totalChallenges) * 100).toFixed(2)
            : 0
        },
        byCategory: templatesByCategory.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        byDifficulty: templatesByDifficulty.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        topPerformers: topChallenges.map(c => ({
          id: c._id,
          title: c.title,
          participants: c.totalParticipants,
          completions: c.totalCompletions,
          rating: c.averageRating,
          completionRate: c.calculateCompletionRate()
        }))
      }
    });

  } catch (err) {
    console.error("GET CHALLENGE STATISTICS ERROR:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};
