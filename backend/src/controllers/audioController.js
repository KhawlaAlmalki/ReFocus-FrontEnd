// src/controllers/audioController.js
import AudioFile from "../models/AudioFile.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ============================================
// FILE UPLOAD CONFIGURATION
// ============================================

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/audio';
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    // Sanitize filename
    const sanitizedName = nameWithoutExt.replace(/[^a-zA-Z0-9-_]/g, '-');
    cb(null, `audio-${sanitizedName}-${uniqueSuffix}${ext}`);
  }
});

// File filter for audio files only
const audioFileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'audio/mpeg',        // mp3
    'audio/mp3',
    'audio/wav',         // wav
    'audio/wave',
    'audio/x-wav',
    'audio/ogg',         // ogg
    'audio/mp4',         // m4a
    'audio/x-m4a',
    'audio/aac',         // aac
    'audio/flac',        // flac
    'audio/webm'         // webm
  ];

  const allowedExtensions = /\.(mp3|wav|ogg|m4a|aac|flac|webm)$/i;

  if (allowedMimeTypes.includes(file.mimetype) || allowedExtensions.test(file.originalname)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only audio files (MP3, WAV, OGG, M4A, AAC, FLAC, WEBM) are allowed.'), false);
  }
};

// Multer upload instance
export const uploadAudio = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB max file size
  },
  fileFilter: audioFileFilter
});

// ============================================
// ADMIN: Audio File Management
// ============================================

// Get all audio files (with filters)
export const getAllAudioFiles = async (req, res) => {
  try {
    const {
      category,
      isPublic,
      isActive,
      isFeatured,
      isPremium,
      search,
      language,
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

    if (isPublic !== undefined) {
      filter.isPublic = isPublic === 'true';
    }

    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    if (isFeatured !== undefined) {
      filter.isFeatured = isFeatured === 'true';
    }

    if (isPremium !== undefined) {
      filter.isPremium = isPremium === 'true';
    }

    if (language) {
      filter.language = language;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { artist: { $regex: search, $options: 'i' } },
        { narrator: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Validate sortBy field
    const allowedSortFields = ['createdAt', 'updatedAt', 'title', 'category', 'duration', 'playCount', 'averageRating'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const sort = { [sortField]: sortOrder === 'desc' ? -1 : 1 };

    const audioFiles = await AudioFile.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('uploadedBy', 'name email')
      .populate('lastModifiedBy', 'name email');

    const totalFiles = await AudioFile.countDocuments(filter);

    // Get statistics for filtered files
    const stats = await AudioFile.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalActive: { $sum: { $cond: ['$isActive', 1, 0] } },
          totalPublic: { $sum: { $cond: ['$isPublic', 1, 0] } },
          totalFeatured: { $sum: { $cond: ['$isFeatured', 1, 0] } },
          totalPremium: { $sum: { $cond: ['$isPremium', 1, 0] } },
          totalPlays: { $sum: '$playCount' },
          totalDownloads: { $sum: '$downloadCount' },
          totalSize: { $sum: '$fileSize' },
          totalDuration: { $sum: '$duration' }
        }
      }
    ]);

    const filterStats = stats.length > 0 ? stats[0] : {
      totalActive: 0,
      totalPublic: 0,
      totalFeatured: 0,
      totalPremium: 0,
      totalPlays: 0,
      totalDownloads: 0,
      totalSize: 0,
      totalDuration: 0
    };

    res.status(200).json({
      audioFiles: audioFiles.map(audio => ({
        id: audio._id,
        title: audio.title,
        description: audio.description,
        fileName: audio.fileName,
        fileUrl: audio.fileUrl,
        fileSize: audio.fileSize,
        fileSizeFormatted: audio.formatFileSize(),
        mimeType: audio.mimeType,
        duration: audio.duration,
        durationFormatted: audio.formatDuration(),
        format: audio.format,
        category: audio.category,
        tags: audio.tags,
        isPublic: audio.isPublic,
        isActive: audio.isActive,
        isFeatured: audio.isFeatured,
        isPremium: audio.isPremium,
        artist: audio.artist,
        narrator: audio.narrator,
        language: audio.language,
        thumbnailUrl: audio.thumbnailUrl,
        playCount: audio.playCount,
        downloadCount: audio.downloadCount,
        favoriteCount: audio.favoriteCount,
        averageRating: audio.averageRating,
        totalRatings: audio.totalRatings,
        version: audio.version,
        uploadedBy: audio.uploadedBy,
        lastModifiedBy: audio.lastModifiedBy,
        createdAt: audio.createdAt,
        updatedAt: audio.updatedAt
      })),
      filterStats,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalFiles / parseInt(limit)),
        totalFiles,
        limit: parseInt(limit)
      }
    });

  } catch (err) {
    console.error("GET ALL AUDIO FILES ERROR:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};

// Get single audio file by ID
export const getAudioFileById = async (req, res) => {
  try {
    const { audioId } = req.params;

    const audioFile = await AudioFile.findById(audioId)
      .populate('uploadedBy', 'name email avatar')
      .populate('lastModifiedBy', 'name email avatar')
      .populate('replacedFileId', 'title version');

    if (!audioFile) {
      return res.status(404).json({
        message: "Audio file not found"
      });
    }

    res.status(200).json({
      audioFile: {
        id: audioFile._id,
        title: audioFile.title,
        description: audioFile.description,
        fileName: audioFile.fileName,
        filePath: audioFile.filePath,
        fileUrl: audioFile.fileUrl,
        fileSize: audioFile.fileSize,
        fileSizeFormatted: audioFile.formatFileSize(),
        mimeType: audioFile.mimeType,
        duration: audioFile.duration,
        durationFormatted: audioFile.formatDuration(),
        format: audioFile.format,
        bitrate: audioFile.bitrate,
        sampleRate: audioFile.sampleRate,
        category: audioFile.category,
        tags: audioFile.tags,
        isPublic: audioFile.isPublic,
        isActive: audioFile.isActive,
        isFeatured: audioFile.isFeatured,
        isPremium: audioFile.isPremium,
        artist: audioFile.artist,
        narrator: audioFile.narrator,
        language: audioFile.language,
        thumbnailUrl: audioFile.thumbnailUrl,
        coverImageUrl: audioFile.coverImageUrl,
        playCount: audioFile.playCount,
        downloadCount: audioFile.downloadCount,
        favoriteCount: audioFile.favoriteCount,
        averageRating: audioFile.averageRating,
        totalRatings: audioFile.totalRatings,
        version: audioFile.version,
        replacedFile: audioFile.replacedFileId,
        uploadedBy: audioFile.uploadedBy,
        lastModifiedBy: audioFile.lastModifiedBy,
        transcription: audioFile.transcription,
        notes: audioFile.notes,
        createdAt: audioFile.createdAt,
        updatedAt: audioFile.updatedAt
      }
    });

  } catch (err) {
    console.error("GET AUDIO FILE ERROR:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};

// Upload new audio file
export const uploadNewAudioFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No audio file uploaded"
      });
    }

    const {
      title,
      description,
      category,
      tags,
      isPublic,
      isActive,
      isFeatured,
      isPremium,
      artist,
      narrator,
      language,
      duration,
      bitrate,
      sampleRate,
      thumbnailUrl,
      coverImageUrl,
      transcription,
      notes
    } = req.body;

    // Validation
    if (!title || title.trim() === '') {
      // Delete uploaded file if validation fails
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        message: "Title is required"
      });
    }

    const fileUrl = `/uploads/audio/${req.file.filename}`;
    const format = path.extname(req.file.originalname).substring(1).toLowerCase();

    // Create audio file record
    const audioFile = await AudioFile.create({
      title: title.trim(),
      description: description?.trim(),
      fileName: req.file.filename,
      filePath: req.file.path,
      fileUrl: fileUrl,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      format: format,
      duration: duration ? parseFloat(duration) : 0,
      bitrate: bitrate ? parseInt(bitrate) : null,
      sampleRate: sampleRate ? parseInt(sampleRate) : null,
      category: category || 'meditation',
      tags: tags ? (Array.isArray(tags) ? tags : JSON.parse(tags)) : [],
      isPublic: isPublic !== undefined ? isPublic === 'true' : true,
      isActive: isActive !== undefined ? isActive === 'true' : true,
      isFeatured: isFeatured !== undefined ? isFeatured === 'true' : false,
      isPremium: isPremium !== undefined ? isPremium === 'true' : false,
      artist,
      narrator,
      language: language || 'en',
      thumbnailUrl,
      coverImageUrl,
      transcription,
      notes,
      uploadedBy: req.user.userId
    });

    res.status(201).json({
      message: "Audio file uploaded successfully",
      audioFile: {
        id: audioFile._id,
        title: audioFile.title,
        fileName: audioFile.fileName,
        fileUrl: audioFile.fileUrl,
        fileSize: audioFile.fileSize,
        fileSizeFormatted: audioFile.formatFileSize(),
        duration: audioFile.duration,
        durationFormatted: audioFile.formatDuration(),
        format: audioFile.format,
        category: audioFile.category,
        isPublic: audioFile.isPublic,
        isActive: audioFile.isActive,
        createdAt: audioFile.createdAt
      }
    });

  } catch (err) {
    // Delete uploaded file if error occurs
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    console.error("UPLOAD AUDIO FILE ERROR:", err);
    res.status(500).json({
      message: "Server error while uploading audio file",
      error: err.message
    });
  }
};

// Update audio file metadata (not the file itself)
export const updateAudioFileMetadata = async (req, res) => {
  try {
    const { audioId } = req.params;
    const updates = req.body;

    const audioFile = await AudioFile.findById(audioId);
    if (!audioFile) {
      return res.status(404).json({
        message: "Audio file not found"
      });
    }

    // Allowed fields for update
    const allowedUpdates = [
      'title',
      'description',
      'category',
      'tags',
      'isPublic',
      'isActive',
      'isFeatured',
      'isPremium',
      'artist',
      'narrator',
      'language',
      'duration',
      'bitrate',
      'sampleRate',
      'thumbnailUrl',
      'coverImageUrl',
      'transcription',
      'notes'
    ];

    // Apply updates
    allowedUpdates.forEach(field => {
      if (updates[field] !== undefined) {
        audioFile[field] = updates[field];
      }
    });

    // Track who modified
    audioFile.lastModifiedBy = req.user.userId;

    await audioFile.save();

    res.status(200).json({
      message: "Audio file metadata updated successfully",
      audioFile: {
        id: audioFile._id,
        title: audioFile.title,
        description: audioFile.description,
        category: audioFile.category,
        isPublic: audioFile.isPublic,
        isActive: audioFile.isActive,
        isFeatured: audioFile.isFeatured,
        updatedAt: audioFile.updatedAt
      }
    });

  } catch (err) {
    console.error("UPDATE AUDIO FILE METADATA ERROR:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};

// Replace audio file (upload new version)
export const replaceAudioFile = async (req, res) => {
  try {
    const { audioId } = req.params;

    if (!req.file) {
      return res.status(400).json({
        message: "No audio file uploaded"
      });
    }

    const audioFile = await AudioFile.findById(audioId);
    if (!audioFile) {
      // Delete uploaded file if audio record not found
      fs.unlinkSync(req.file.path);
      return res.status(404).json({
        message: "Audio file not found"
      });
    }

    // Delete old audio file from disk
    if (fs.existsSync(audioFile.filePath)) {
      try {
        fs.unlinkSync(audioFile.filePath);
      } catch (fileErr) {
        console.error("Error deleting old file:", fileErr);
      }
    }

    // Update file information
    const fileUrl = `/uploads/audio/${req.file.filename}`;
    const format = path.extname(req.file.originalname).substring(1).toLowerCase();

    audioFile.fileName = req.file.filename;
    audioFile.filePath = req.file.path;
    audioFile.fileUrl = fileUrl;
    audioFile.fileSize = req.file.size;
    audioFile.mimeType = req.file.mimetype;
    audioFile.format = format;
    audioFile.version += 1;
    audioFile.lastModifiedBy = req.user.userId;

    // Update duration if provided
    if (req.body.duration) {
      audioFile.duration = parseFloat(req.body.duration);
    }

    // Update bitrate if provided
    if (req.body.bitrate) {
      audioFile.bitrate = parseInt(req.body.bitrate);
    }

    // Update sampleRate if provided
    if (req.body.sampleRate) {
      audioFile.sampleRate = parseInt(req.body.sampleRate);
    }

    await audioFile.save();

    res.status(200).json({
      message: "Audio file replaced successfully",
      audioFile: {
        id: audioFile._id,
        title: audioFile.title,
        fileName: audioFile.fileName,
        fileUrl: audioFile.fileUrl,
        fileSize: audioFile.fileSize,
        fileSizeFormatted: audioFile.formatFileSize(),
        duration: audioFile.duration,
        durationFormatted: audioFile.formatDuration(),
        format: audioFile.format,
        version: audioFile.version,
        updatedAt: audioFile.updatedAt
      }
    });

  } catch (err) {
    // Delete uploaded file if error occurs
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    console.error("REPLACE AUDIO FILE ERROR:", err);
    res.status(500).json({
      message: "Server error while replacing audio file",
      error: err.message
    });
  }
};

// Delete audio file
export const deleteAudioFile = async (req, res) => {
  try {
    const { audioId } = req.params;
    const { confirmTitle } = req.body;

    const audioFile = await AudioFile.findById(audioId);
    if (!audioFile) {
      return res.status(404).json({
        message: "Audio file not found"
      });
    }

    // Confirmation check
    if (confirmTitle !== audioFile.title) {
      return res.status(400).json({
        message: "Title confirmation does not match. Cannot delete audio file."
      });
    }

    // Store info before deletion
    const deletedInfo = {
      id: audioFile._id,
      title: audioFile.title,
      fileName: audioFile.fileName,
      category: audioFile.category,
      playCount: audioFile.playCount
    };

    // Delete file from disk
    if (fs.existsSync(audioFile.filePath)) {
      try {
        fs.unlinkSync(audioFile.filePath);
      } catch (fileErr) {
        console.error("Error deleting file from disk:", fileErr);
      }
    }

    // Delete from database
    await AudioFile.findByIdAndDelete(audioId);

    res.status(200).json({
      message: "Audio file deleted successfully",
      deletedAudioFile: deletedInfo
    });

  } catch (err) {
    console.error("DELETE AUDIO FILE ERROR:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};

// Get audio library statistics
export const getAudioStatistics = async (req, res) => {
  try {
    const totalFiles = await AudioFile.countDocuments();
    const activeFiles = await AudioFile.countDocuments({ isActive: true });
    const publicFiles = await AudioFile.countDocuments({ isPublic: true });
    const featuredFiles = await AudioFile.countDocuments({ isFeatured: true });
    const premiumFiles = await AudioFile.countDocuments({ isPremium: true });

    // By category
    const filesByCategory = await AudioFile.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);

    // Total plays and downloads
    const usageStats = await AudioFile.aggregate([
      {
        $group: {
          _id: null,
          totalPlays: { $sum: '$playCount' },
          totalDownloads: { $sum: '$downloadCount' },
          totalSize: { $sum: '$fileSize' },
          totalDuration: { $sum: '$duration' },
          avgRating: { $avg: '$averageRating' }
        }
      }
    ]);

    // Top played audio files
    const topPlayed = await AudioFile.find({ isActive: true })
      .sort({ playCount: -1 })
      .limit(10)
      .select('title category playCount downloadCount averageRating');

    // Most recent uploads
    const recentUploads = await AudioFile.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title category uploadedBy createdAt')
      .populate('uploadedBy', 'name');

    const usage = usageStats.length > 0 ? usageStats[0] : {
      totalPlays: 0,
      totalDownloads: 0,
      totalSize: 0,
      totalDuration: 0,
      avgRating: 0
    };

    res.status(200).json({
      stats: {
        overview: {
          total: totalFiles,
          active: activeFiles,
          public: publicFiles,
          featured: featuredFiles,
          premium: premiumFiles
        },
        usage: {
          totalPlays: usage.totalPlays,
          totalDownloads: usage.totalDownloads,
          totalSize: usage.totalSize,
          totalSizeGB: (usage.totalSize / (1024 * 1024 * 1024)).toFixed(2),
          totalDurationHours: (usage.totalDuration / 3600).toFixed(2),
          averageRating: usage.avgRating ? usage.avgRating.toFixed(2) : 0
        },
        byCategory: filesByCategory.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        topPlayed: topPlayed.map(audio => ({
          id: audio._id,
          title: audio.title,
          category: audio.category,
          playCount: audio.playCount,
          downloadCount: audio.downloadCount,
          rating: audio.averageRating
        })),
        recentUploads: recentUploads.map(audio => ({
          id: audio._id,
          title: audio.title,
          category: audio.category,
          uploadedBy: audio.uploadedBy,
          createdAt: audio.createdAt
        }))
      }
    });

  } catch (err) {
    console.error("GET AUDIO STATISTICS ERROR:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};
