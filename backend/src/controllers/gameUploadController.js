// src/controllers/gameUploadController.js
import Game from "../models/Game.js";
import User from "../models/User.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import AdmZip from 'adm-zip';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ============================================
// FILE UPLOAD CONFIGURATION
// ============================================

// Configure storage for game files
const gameStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/games';
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
    cb(null, `game-${sanitizedName}-${uniqueSuffix}${ext}`);
  }
});

// File filter for game files
const gameFileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'application/zip',
    'application/x-zip-compressed',
    'application/x-zip',
    'application/octet-stream',
    'text/html',
    'application/javascript'
  ];

  const allowedExtensions = /\.(zip|html|js)$/i;

  if (allowedMimeTypes.includes(file.mimetype) || allowedExtensions.test(file.originalname)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only ZIP, HTML, and JS files are allowed for games.'), false);
  }
};

// Multer upload instance for game files
export const uploadGameFile = multer({
  storage: gameStorage,
  limits: {
    fileSize: 200 * 1024 * 1024 // 200MB max file size
  },
  fileFilter: gameFileFilter
});

// ============================================
// GAME FILE UPLOAD HANDLERS
// ============================================

// Upload game with files
export const uploadGameWithFiles = async (req, res) => {
  try {
    const developerId = req.user.userId;

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No game file uploaded"
      });
    }

    const {
      title,
      description,
      shortDescription,
      category,
      difficulty,
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

    if (title && title.length > 200) {
      errors.push("Title must not exceed 200 characters");
    }

    if (description && description.length > 2000) {
      errors.push("Description must not exceed 2000 characters");
    }

    if (errors.length > 0) {
      // Delete uploaded file if validation fails
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors
      });
    }

    // Get developer name
    const developer = await User.findById(developerId).select('name');
    if (!developer) {
      fs.unlinkSync(req.file.path);
      return res.status(404).json({
        success: false,
        message: "Developer not found"
      });
    }

    // Process uploaded file
    const fileExt = path.extname(req.file.filename).toLowerCase();
    let gameUrl = `/uploads/games/${req.file.filename}`;
    let gameDirectory = null;

    // If it's a ZIP file, extract it
    if (fileExt === '.zip') {
      try {
        const extractDir = path.join('uploads/games', path.basename(req.file.filename, '.zip'));

        // Create extraction directory
        if (!fs.existsSync(extractDir)) {
          fs.mkdirSync(extractDir, { recursive: true });
        }

        // Extract ZIP
        const zip = new AdmZip(req.file.path);
        zip.extractAllTo(extractDir, true);

        // Look for index.html in extracted files
        const extractedFiles = fs.readdirSync(extractDir);
        const indexFile = extractedFiles.find(f => f.toLowerCase() === 'index.html');

        if (indexFile) {
          gameUrl = `/uploads/games/${path.basename(req.file.filename, '.zip')}/${indexFile}`;
          gameDirectory = extractDir;
        } else {
          // Use the first HTML file found
          const htmlFile = extractedFiles.find(f => f.toLowerCase().endsWith('.html'));
          if (htmlFile) {
            gameUrl = `/uploads/games/${path.basename(req.file.filename, '.zip')}/${htmlFile}`;
            gameDirectory = extractDir;
          } else {
            throw new Error('No HTML entry point found in ZIP file');
          }
        }

      } catch (extractError) {
        // Cleanup on extraction error
        fs.unlinkSync(req.file.path);
        return res.status(400).json({
          success: false,
          message: "Failed to extract game files",
          error: extractError.message
        });
      }
    }

    // Create game record
    const game = await Game.create({
      title: title.trim(),
      description: description.trim(),
      shortDescription: shortDescription?.trim(),
      category: category || 'focus',
      difficulty: difficulty || 'medium',
      gameUrl: gameUrl,
      thumbnailUrl,
      coverImageUrl,
      isPublic: isPublic !== undefined ? isPublic === 'true' : true,
      isActive: isActive !== undefined ? isActive === 'true' : true,
      isFeatured: isFeatured !== undefined ? isFeatured === 'true' : false,
      isPremium: isPremium !== undefined ? isPremium === 'true' : false,
      developerId,
      developerName: developer.name,
      minPlayTime: minPlayTime ? parseInt(minPlayTime) : 60,
      maxPlayTime: maxPlayTime ? parseInt(maxPlayTime) : 600,
      avgPlayTime: avgPlayTime ? parseInt(avgPlayTime) : 180,
      tags: tags ? (Array.isArray(tags) ? tags : JSON.parse(tags)) : [],
      version: version || '1.0.0'
    });

    res.status(201).json({
      success: true,
      message: "Game uploaded and added successfully",
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
      },
      uploadDetails: {
        fileName: req.file.filename,
        fileSize: req.file.size,
        fileSizeFormatted: formatFileSize(req.file.size),
        fileType: fileExt,
        extractedDirectory: gameDirectory,
        uploadedAt: new Date().toISOString()
      }
    });

  } catch (err) {
    // Cleanup uploaded file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    console.error("UPLOAD GAME WITH FILES ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error while uploading game",
      error: err.message
    });
  }
};

// Replace game files
export const replaceGameFiles = async (req, res) => {
  try {
    const { gameId } = req.params;
    const developerId = req.user.userId;

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No game file uploaded"
      });
    }

    // Verify game ownership
    const game = await Game.findOne({ _id: gameId, developerId });
    if (!game) {
      fs.unlinkSync(req.file.path);
      return res.status(404).json({
        success: false,
        message: "Game not found or you don't have access"
      });
    }

    // Delete old game files
    const oldGamePath = game.gameUrl.replace(/^\//, '');
    if (fs.existsSync(oldGamePath)) {
      try {
        // If it's a directory (extracted ZIP), remove the entire directory
        const oldDir = path.dirname(oldGamePath);
        if (oldDir.includes('uploads/games/game-')) {
          fs.rmSync(oldDir, { recursive: true, force: true });
        } else {
          fs.unlinkSync(oldGamePath);
        }
      } catch (deleteError) {
        console.error("Error deleting old game files:", deleteError);
      }
    }

    // Process new uploaded file
    const fileExt = path.extname(req.file.filename).toLowerCase();
    let gameUrl = `/uploads/games/${req.file.filename}`;
    let gameDirectory = null;

    // If it's a ZIP file, extract it
    if (fileExt === '.zip') {
      try {
        const extractDir = path.join('uploads/games', path.basename(req.file.filename, '.zip'));

        if (!fs.existsSync(extractDir)) {
          fs.mkdirSync(extractDir, { recursive: true });
        }

        const zip = new AdmZip(req.file.path);
        zip.extractAllTo(extractDir, true);

        const extractedFiles = fs.readdirSync(extractDir);
        const indexFile = extractedFiles.find(f => f.toLowerCase() === 'index.html');

        if (indexFile) {
          gameUrl = `/uploads/games/${path.basename(req.file.filename, '.zip')}/${indexFile}`;
          gameDirectory = extractDir;
        } else {
          const htmlFile = extractedFiles.find(f => f.toLowerCase().endsWith('.html'));
          if (htmlFile) {
            gameUrl = `/uploads/games/${path.basename(req.file.filename, '.zip')}/${htmlFile}`;
            gameDirectory = extractDir;
          }
        }

      } catch (extractError) {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({
          success: false,
          message: "Failed to extract game files",
          error: extractError.message
        });
      }
    }

    // Update game record
    game.gameUrl = gameUrl;
    game.lastModifiedBy = developerId;

    // Update version if provided
    if (req.body.version) {
      game.version = req.body.version;
    }

    await game.save();

    res.status(200).json({
      success: true,
      message: "Game files replaced successfully",
      game: {
        id: game._id,
        title: game.title,
        gameUrl: game.gameUrl,
        version: game.version,
        updatedAt: game.updatedAt
      },
      uploadDetails: {
        fileName: req.file.filename,
        fileSize: req.file.size,
        fileSizeFormatted: formatFileSize(req.file.size),
        fileType: fileExt,
        extractedDirectory: gameDirectory,
        uploadedAt: new Date().toISOString()
      }
    });

  } catch (err) {
    // Cleanup uploaded file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    console.error("REPLACE GAME FILES ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error while replacing game files",
      error: err.message
    });
  }
};

// Upload game assets (thumbnails, covers)
export const uploadGameAssets = async (req, res) => {
  try {
    const { gameId } = req.params;
    const developerId = req.user.userId;
    const { assetType } = req.body; // 'thumbnail' or 'cover'

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No asset file uploaded"
      });
    }

    // Verify game ownership
    const game = await Game.findOne({ _id: gameId, developerId });
    if (!game) {
      fs.unlinkSync(req.file.path);
      return res.status(404).json({
        success: false,
        message: "Game not found or you don't have access"
      });
    }

    const assetUrl = `/uploads/games/${req.file.filename}`;

    // Update game with new asset URL
    if (assetType === 'thumbnail') {
      // Delete old thumbnail if exists
      if (game.thumbnailUrl && game.thumbnailUrl.startsWith('/uploads/')) {
        const oldPath = game.thumbnailUrl.replace(/^\//, '');
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      game.thumbnailUrl = assetUrl;
    } else if (assetType === 'cover') {
      // Delete old cover if exists
      if (game.coverImageUrl && game.coverImageUrl.startsWith('/uploads/')) {
        const oldPath = game.coverImageUrl.replace(/^\//, '');
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      game.coverImageUrl = assetUrl;
    } else {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        message: "Invalid asset type. Must be 'thumbnail' or 'cover'"
      });
    }

    game.lastModifiedBy = developerId;
    await game.save();

    res.status(200).json({
      success: true,
      message: `Game ${assetType} uploaded successfully`,
      assetUrl,
      game: {
        id: game._id,
        thumbnailUrl: game.thumbnailUrl,
        coverImageUrl: game.coverImageUrl
      }
    });

  } catch (err) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    console.error("UPLOAD GAME ASSETS ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error while uploading asset",
      error: err.message
    });
  }
};

// Get upload requirements
export const getUploadRequirements = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      requirements: {
        fileFormats: {
          gameFiles: ['ZIP', 'HTML', 'JS'],
          images: ['JPG', 'JPEG', 'PNG', 'GIF']
        },
        maxFileSizes: {
          gameFiles: '200MB',
          images: '5MB'
        },
        zipStructure: {
          required: 'Must contain index.html or any .html file as entry point',
          recommended: [
            'index.html - Main game file',
            'assets/ - Folder for images, sounds, etc.',
            'js/ - JavaScript files',
            'css/ - Stylesheets'
          ]
        },
        validationRules: {
          title: 'Required, max 200 characters',
          description: 'Required, max 2000 characters',
          category: 'Must be one of: focus, memory, puzzle, relaxation, creativity, strategy, reflex, other',
          difficulty: 'Must be one of: easy, medium, hard'
        }
      },
      examples: {
        zipStructure: {
          correct: [
            'my-game.zip/',
            '  index.html',
            '  assets/',
            '    background.jpg',
            '    sound.mp3',
            '  js/',
            '    game.js',
            '  css/',
            '    style.css'
          ]
        }
      }
    });

  } catch (err) {
    console.error("GET UPLOAD REQUIREMENTS ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message
    });
  }
};

// Helper function to format file size
function formatFileSize(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}
