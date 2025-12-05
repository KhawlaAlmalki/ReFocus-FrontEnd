// src/controllers/gameMediaController.js
import Game from "../models/Game.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import sharp from "sharp"; // For image processing and validation
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ============================================
// IMAGE VALIDATION REQUIREMENTS
// ============================================

const IMAGE_REQUIREMENTS = {
  coverImage: {
    minWidth: 1280,
    minHeight: 720,
    maxWidth: 3840,
    maxHeight: 2160,
    aspectRatios: ['16:9', '4:3', '3:2'], // Acceptable aspect ratios
    maxFileSize: 5 * 1024 * 1024 // 5MB
  },
  screenshot: {
    minWidth: 1024,
    minHeight: 576,
    maxWidth: 3840,
    maxHeight: 2160,
    aspectRatios: ['16:9', '4:3', '3:2'],
    maxFileSize: 5 * 1024 * 1024 // 5MB
  },
  thumbnail: {
    minWidth: 256,
    minHeight: 256,
    maxWidth: 1024,
    maxHeight: 1024,
    aspectRatios: ['1:1', '16:9', '4:3'],
    maxFileSize: 2 * 1024 * 1024 // 2MB
  }
};

// ============================================
// FILE UPLOAD CONFIGURATION
// ============================================

const mediaStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/game-media';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    const sanitizedName = nameWithoutExt.replace(/[^a-zA-Z0-9-_]/g, '-');
    cb(null, `media-${sanitizedName}-${uniqueSuffix}${ext}`);
  }
});

const mediaFileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp'
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, PNG, and WebP images are allowed.'), false);
  }
};

export const uploadMediaFile = multer({
  storage: mediaStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max
  },
  fileFilter: mediaFileFilter
});

// ============================================
// HELPER FUNCTIONS
// ============================================

// Calculate aspect ratio from dimensions
function calculateAspectRatio(width, height) {
  const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(width, height);
  return `${width / divisor}:${height / divisor}`;
}

// Check if aspect ratio is acceptable
function isAspectRatioValid(width, height, acceptableRatios) {
  const ratio = calculateAspectRatio(width, height);

  // Check if exact match
  if (acceptableRatios.includes(ratio)) {
    return { valid: true, ratio };
  }

  // Check if close enough (within 5% tolerance)
  const [w, h] = ratio.split(':').map(Number);
  const actualRatio = w / h;

  for (const acceptableRatio of acceptableRatios) {
    const [aw, ah] = acceptableRatio.split(':').map(Number);
    const targetRatio = aw / ah;
    const difference = Math.abs(actualRatio - targetRatio) / targetRatio;

    if (difference <= 0.05) { // 5% tolerance
      return { valid: true, ratio: acceptableRatio, actual: ratio };
    }
  }

  return { valid: false, ratio, expected: acceptableRatios };
}

// Validate image against requirements
async function validateImage(filePath, requirements) {
  try {
    const metadata = await sharp(filePath).metadata();
    const { width, height, format, size } = metadata;

    const errors = [];

    // Check dimensions
    if (width < requirements.minWidth || height < requirements.minHeight) {
      errors.push(`Image is too small. Minimum dimensions: ${requirements.minWidth}x${requirements.minHeight}px`);
    }

    if (width > requirements.maxWidth || height > requirements.maxHeight) {
      errors.push(`Image is too large. Maximum dimensions: ${requirements.maxWidth}x${requirements.maxHeight}px`);
    }

    // Check aspect ratio
    const aspectRatioCheck = isAspectRatioValid(width, height, requirements.aspectRatios);
    if (!aspectRatioCheck.valid) {
      errors.push(`Invalid aspect ratio ${aspectRatioCheck.ratio}. Acceptable ratios: ${aspectRatioCheck.expected.join(', ')}`);
    }

    // Check file size
    if (size > requirements.maxFileSize) {
      errors.push(`File is too large. Maximum size: ${formatFileSize(requirements.maxFileSize)}`);
    }

    return {
      valid: errors.length === 0,
      errors,
      metadata: {
        width,
        height,
        format,
        size,
        aspectRatio: aspectRatioCheck.ratio
      }
    };

  } catch (err) {
    return {
      valid: false,
      errors: ['Invalid or corrupted image file'],
      metadata: null
    };
  }
}

// Format file size
function formatFileSize(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}

// ============================================
// MEDIA UPLOAD HANDLERS
// ============================================

// Upload cover image
export const uploadCoverImage = async (req, res) => {
  try {
    const { gameId } = req.params;
    const developerId = req.user.userId;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No cover image uploaded"
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

    // Check if game is locked
    if (game.isLocked) {
      fs.unlinkSync(req.file.path);
      return res.status(403).json({
        success: false,
        message: "Game is locked during review. Cannot modify media."
      });
    }

    // Validate image
    const validation = await validateImage(req.file.path, IMAGE_REQUIREMENTS.coverImage);
    if (!validation.valid) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        message: "Cover image validation failed",
        errors: validation.errors
      });
    }

    // Delete old cover image if exists
    if (game.coverImageUrl && game.coverImageUrl.startsWith('/uploads/')) {
      const oldPath = game.coverImageUrl.replace(/^\//, '');
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    // Update game with new cover image
    game.coverImageUrl = `/uploads/game-media/${req.file.filename}`;
    game.lastModifiedBy = developerId;
    await game.save();

    res.status(200).json({
      success: true,
      message: "Cover image uploaded successfully",
      coverImage: {
        url: game.coverImageUrl,
        dimensions: `${validation.metadata.width}x${validation.metadata.height}`,
        aspectRatio: validation.metadata.aspectRatio,
        fileSize: formatFileSize(validation.metadata.size),
        format: validation.metadata.format
      }
    });

  } catch (err) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    console.error("UPLOAD COVER IMAGE ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error while uploading cover image",
      error: err.message
    });
  }
};

// Upload screenshots (2-5 images)
export const uploadScreenshots = async (req, res) => {
  try {
    const { gameId } = req.params;
    const developerId = req.user.userId;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No screenshots uploaded"
      });
    }

    // Verify game ownership
    const game = await Game.findOne({ _id: gameId, developerId });
    if (!game) {
      // Delete uploaded files
      req.files.forEach(file => fs.unlinkSync(file.path));
      return res.status(404).json({
        success: false,
        message: "Game not found or you don't have access"
      });
    }

    // Check if game is locked
    if (game.isLocked) {
      req.files.forEach(file => fs.unlinkSync(file.path));
      return res.status(403).json({
        success: false,
        message: "Game is locked during review. Cannot modify media."
      });
    }

    // Check screenshot count limits
    const currentCount = game.screenshots.length;
    const newCount = req.files.length;
    const totalCount = currentCount + newCount;

    if (totalCount > 5) {
      req.files.forEach(file => fs.unlinkSync(file.path));
      return res.status(400).json({
        success: false,
        message: `Cannot add ${newCount} screenshots. Maximum is 5 total (currently have ${currentCount}).`
      });
    }

    if (totalCount < 2) {
      req.files.forEach(file => fs.unlinkSync(file.path));
      return res.status(400).json({
        success: false,
        message: "Must upload at least 2 screenshots total for the game."
      });
    }

    // Validate all screenshots
    const validationResults = [];
    const validatedScreenshots = [];

    for (const file of req.files) {
      const validation = await validateImage(file.path, IMAGE_REQUIREMENTS.screenshot);

      if (!validation.valid) {
        // Delete all uploaded files on validation failure
        req.files.forEach(f => {
          if (fs.existsSync(f.path)) fs.unlinkSync(f.path);
        });

        return res.status(400).json({
          success: false,
          message: `Screenshot validation failed for ${file.originalname}`,
          errors: validation.errors
        });
      }

      validatedScreenshots.push({
        url: `/uploads/game-media/${file.filename}`,
        fileName: file.originalname,
        fileSize: validation.metadata.size,
        dimensions: {
          width: validation.metadata.width,
          height: validation.metadata.height
        },
        aspectRatio: validation.metadata.aspectRatio,
        uploadedAt: new Date(),
        order: currentCount + validatedScreenshots.length
      });

      validationResults.push({
        fileName: file.originalname,
        dimensions: `${validation.metadata.width}x${validation.metadata.height}`,
        aspectRatio: validation.metadata.aspectRatio,
        fileSize: formatFileSize(validation.metadata.size)
      });
    }

    // Add screenshots to game
    game.screenshots.push(...validatedScreenshots);
    game.lastModifiedBy = developerId;
    await game.save();

    res.status(200).json({
      success: true,
      message: `${validatedScreenshots.length} screenshot(s) uploaded successfully`,
      screenshots: validationResults,
      totalScreenshots: game.screenshots.length
    });

  } catch (err) {
    // Cleanup uploaded files on error
    if (req.files) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }

    console.error("UPLOAD SCREENSHOTS ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error while uploading screenshots",
      error: err.message
    });
  }
};

// Delete a screenshot
export const deleteScreenshot = async (req, res) => {
  try {
    const { gameId, screenshotId } = req.params;
    const developerId = req.user.userId;

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
        message: "Game is locked during review. Cannot modify media."
      });
    }

    // Find screenshot
    const screenshotIndex = game.screenshots.findIndex(s => s._id.toString() === screenshotId);
    if (screenshotIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Screenshot not found"
      });
    }

    const screenshot = game.screenshots[screenshotIndex];

    // Check if deletion would result in less than 2 screenshots
    if (game.screenshots.length <= 2) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete screenshot. Game must have at least 2 screenshots."
      });
    }

    // Delete physical file
    const filePath = screenshot.url.replace(/^\//, '');
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Remove from database
    game.screenshots.splice(screenshotIndex, 1);

    // Reorder remaining screenshots
    game.screenshots.forEach((s, index) => {
      s.order = index;
    });

    game.lastModifiedBy = developerId;
    await game.save();

    res.status(200).json({
      success: true,
      message: "Screenshot deleted successfully",
      remainingScreenshots: game.screenshots.length
    });

  } catch (err) {
    console.error("DELETE SCREENSHOT ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error while deleting screenshot",
      error: err.message
    });
  }
};

// Get media requirements
export const getMediaRequirements = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      requirements: {
        coverImage: {
          description: "Main cover image for the game",
          minDimensions: `${IMAGE_REQUIREMENTS.coverImage.minWidth}x${IMAGE_REQUIREMENTS.coverImage.minHeight}px`,
          maxDimensions: `${IMAGE_REQUIREMENTS.coverImage.maxWidth}x${IMAGE_REQUIREMENTS.coverImage.maxHeight}px`,
          acceptableAspectRatios: IMAGE_REQUIREMENTS.coverImage.aspectRatios,
          maxFileSize: formatFileSize(IMAGE_REQUIREMENTS.coverImage.maxFileSize),
          formats: ['JPEG', 'PNG', 'WebP'],
          quantity: 1
        },
        screenshots: {
          description: "In-game screenshots showing gameplay",
          minDimensions: `${IMAGE_REQUIREMENTS.screenshot.minWidth}x${IMAGE_REQUIREMENTS.screenshot.minHeight}px`,
          maxDimensions: `${IMAGE_REQUIREMENTS.screenshot.maxWidth}x${IMAGE_REQUIREMENTS.screenshot.maxHeight}px`,
          acceptableAspectRatios: IMAGE_REQUIREMENTS.screenshot.aspectRatios,
          maxFileSize: formatFileSize(IMAGE_REQUIREMENTS.screenshot.maxFileSize),
          formats: ['JPEG', 'PNG', 'WebP'],
          quantity: '2-5 images required'
        },
        thumbnail: {
          description: "Small preview image for game listings",
          minDimensions: `${IMAGE_REQUIREMENTS.thumbnail.minWidth}x${IMAGE_REQUIREMENTS.thumbnail.minHeight}px`,
          maxDimensions: `${IMAGE_REQUIREMENTS.thumbnail.maxWidth}x${IMAGE_REQUIREMENTS.thumbnail.maxHeight}px`,
          acceptableAspectRatios: IMAGE_REQUIREMENTS.thumbnail.aspectRatios,
          maxFileSize: formatFileSize(IMAGE_REQUIREMENTS.thumbnail.maxFileSize),
          formats: ['JPEG', 'PNG', 'WebP'],
          quantity: 1
        }
      },
      tips: [
        'Use high-quality images that showcase your game effectively',
        'Ensure screenshots show actual gameplay, not just menus',
        'Cover image should be eye-catching and representative of the game',
        'All images should be clear and not blurry or pixelated',
        'Aspect ratio tolerance is 5% for better compatibility'
      ]
    });

  } catch (err) {
    console.error("GET MEDIA REQUIREMENTS ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message
    });
  }
};

// Get game media
export const getGameMedia = async (req, res) => {
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

    res.status(200).json({
      success: true,
      media: {
        coverImage: game.coverImageUrl ? {
          url: game.coverImageUrl
        } : null,
        thumbnail: game.thumbnailUrl ? {
          url: game.thumbnailUrl
        } : null,
        screenshots: game.screenshots.map(s => ({
          id: s._id,
          url: s.url,
          fileName: s.fileName,
          dimensions: `${s.dimensions.width}x${s.dimensions.height}`,
          aspectRatio: s.aspectRatio,
          fileSize: formatFileSize(s.fileSize),
          uploadedAt: s.uploadedAt,
          order: s.order
        })),
        isComplete: !!(game.coverImageUrl && game.screenshots.length >= 2),
        screenshotCount: game.screenshots.length
      }
    });

  } catch (err) {
    console.error("GET GAME MEDIA ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error while retrieving game media",
      error: err.message
    });
  }
};
