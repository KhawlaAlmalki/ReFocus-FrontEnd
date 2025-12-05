// src/controllers/licenseController.js
import License from "../models/License.js";
import Game from "../models/Game.js";
import User from "../models/User.js";
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

// Configure storage for license files
const licenseStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/licenses';
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
    cb(null, `license-${sanitizedName}-${uniqueSuffix}${ext}`);
  }
});

// File filter for license documents
const licenseFileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'application/zip',
    'application/x-zip-compressed'
  ];

  const allowedExtensions = /\.(pdf|jpg|jpeg|png|doc|docx|txt|zip)$/i;

  if (allowedMimeTypes.includes(file.mimetype) || allowedExtensions.test(file.originalname)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, images, DOC, DOCX, TXT, and ZIP files are allowed.'), false);
  }
};

// Multer upload instance for license files
export const uploadLicenseFile = multer({
  storage: licenseStorage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB max file size
  },
  fileFilter: licenseFileFilter
});

// ============================================
// LICENSE INFORMATION HANDLERS
// ============================================

// Get license information for a game
export const getLicenseByGameId = async (req, res) => {
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

    // Get license information
    const license = await License.findOne({ gameId })
      .populate('developerId', 'name email')
      .populate('validation.reviewedBy', 'name email');

    if (!license) {
      return res.status(404).json({
        success: false,
        message: "License information not found for this game"
      });
    }

    res.status(200).json({
      success: true,
      license: {
        id: license._id,
        gameId: license.gameId,
        engine: license.engine,
        assets: license.assets,
        intellectualProperty: license.intellectualProperty,
        uploadedFiles: license.uploadedFiles.map(file => ({
          id: file._id,
          fileType: file.fileType,
          fileName: file.fileName,
          fileSize: license.formatFileSize(file.fileSize),
          uploadedAt: file.uploadedAt,
          description: file.description
        })),
        validation: license.getValidationSummary(),
        declarations: license.declarations,
        completionPercentage: license.getCompletionPercentage(),
        isComplete: license.isComplete(),
        submittedAt: license.submittedAt,
        createdAt: license.createdAt,
        updatedAt: license.updatedAt
      }
    });

  } catch (err) {
    console.error("GET LICENSE BY GAME ID ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error while retrieving license information",
      error: err.message
    });
  }
};

// Create or update license information
export const submitLicenseInformation = async (req, res) => {
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

    const {
      engine,
      assets,
      intellectualProperty,
      declarations,
      additionalNotes
    } = req.body;

    // Validation
    const errors = [];

    // Engine validation
    if (!engine || !engine.name) {
      errors.push("Engine name is required");
    }
    if (!engine || !engine.licenseType) {
      errors.push("Engine license type is required");
    }

    // IP validation
    if (!intellectualProperty || !intellectualProperty.ownershipStatus) {
      errors.push("Ownership status is required");
    }
    if (!intellectualProperty || !intellectualProperty.copyrightHolder) {
      errors.push("Copyright holder is required");
    }
    if (!intellectualProperty || !intellectualProperty.copyrightYear) {
      errors.push("Copyright year is required");
    }

    // Declarations validation
    if (!declarations || !declarations.ownershipConfirmed) {
      errors.push("You must confirm ownership");
    }
    if (!declarations || !declarations.noInfringement) {
      errors.push("You must declare no infringement");
    }
    if (!declarations || !declarations.accurateInformation) {
      errors.push("You must confirm information accuracy");
    }
    if (!declarations || !declarations.agreementAccepted) {
      errors.push("You must accept the agreement");
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors
      });
    }

    // Get client IP
    const ipAddress = req.headers['x-forwarded-for'] ||
                      req.connection.remoteAddress ||
                      req.ip;

    // Check if license already exists
    let license = await License.findOne({ gameId });

    if (license) {
      // Update existing license
      license.engine = engine;
      license.assets = assets || [];
      license.intellectualProperty = intellectualProperty;
      license.declarations = {
        ...declarations,
        declaredAt: new Date(),
        ipAddress: ipAddress
      };
      license.additionalNotes = additionalNotes;
      license.lastModifiedBy = developerId;
      license.version += 1;

      // Reset validation if content changed significantly
      if (license.validation.status === 'Approved') {
        license.validation.status = 'Needs Revision';
      }

      await license.save();

      res.status(200).json({
        success: true,
        message: "License information updated successfully",
        license: {
          id: license._id,
          completionPercentage: license.getCompletionPercentage(),
          isComplete: license.isComplete(),
          validation: license.getValidationSummary()
        }
      });

    } else {
      // Create new license
      license = await License.create({
        gameId,
        developerId,
        engine,
        assets: assets || [],
        intellectualProperty,
        declarations: {
          ...declarations,
          declaredAt: new Date(),
          ipAddress: ipAddress
        },
        additionalNotes,
        lastModifiedBy: developerId
      });

      res.status(201).json({
        success: true,
        message: "License information submitted successfully",
        license: {
          id: license._id,
          completionPercentage: license.getCompletionPercentage(),
          isComplete: license.isComplete(),
          validation: license.getValidationSummary()
        }
      });
    }

  } catch (err) {
    console.error("SUBMIT LICENSE INFORMATION ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error while submitting license information",
      error: err.message
    });
  }
};

// Upload license files
export const uploadLicenseFiles = async (req, res) => {
  try {
    const { gameId } = req.params;
    const developerId = req.user.userId;
    const { fileType, description } = req.body;

    // Check if files were uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No license files uploaded"
      });
    }

    // Verify game ownership
    const game = await Game.findOne({ _id: gameId, developerId });
    if (!game) {
      // Delete uploaded files
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });

      return res.status(404).json({
        success: false,
        message: "Game not found or you don't have access"
      });
    }

    // Get or create license record
    let license = await License.findOne({ gameId });

    if (!license) {
      // Create minimal license record if doesn't exist
      license = await License.create({
        gameId,
        developerId,
        engine: { name: 'Other', licenseType: 'Not Applicable' },
        intellectualProperty: {
          ownershipStatus: 'Sole Owner',
          copyrightHolder: 'Pending',
          copyrightYear: new Date().getFullYear()
        },
        declarations: {
          ownershipConfirmed: false,
          noInfringement: false,
          accurateInformation: false,
          agreementAccepted: false
        }
      });
    }

    // Add uploaded files to license record
    const uploadedFileRecords = req.files.map(file => ({
      fileType: fileType || 'Other',
      fileName: file.originalname,
      filePath: `/uploads/licenses/${file.filename}`,
      fileSize: file.size,
      mimeType: file.mimetype,
      uploadedAt: new Date(),
      description: description || null
    }));

    license.uploadedFiles.push(...uploadedFileRecords);
    license.lastModifiedBy = developerId;
    await license.save();

    res.status(200).json({
      success: true,
      message: `${req.files.length} license file(s) uploaded successfully`,
      uploadedFiles: uploadedFileRecords.map((record, index) => ({
        fileName: record.fileName,
        fileType: record.fileType,
        fileSize: license.formatFileSize(record.fileSize),
        filePath: record.filePath,
        uploadedAt: record.uploadedAt
      })),
      licenseStatus: {
        completionPercentage: license.getCompletionPercentage(),
        totalFiles: license.uploadedFiles.length
      }
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

    console.error("UPLOAD LICENSE FILES ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error while uploading license files",
      error: err.message
    });
  }
};

// Delete a license file
export const deleteLicenseFile = async (req, res) => {
  try {
    const { gameId, fileId } = req.params;
    const developerId = req.user.userId;

    // Verify game ownership
    const game = await Game.findOne({ _id: gameId, developerId });
    if (!game) {
      return res.status(404).json({
        success: false,
        message: "Game not found or you don't have access"
      });
    }

    // Get license
    const license = await License.findOne({ gameId });
    if (!license) {
      return res.status(404).json({
        success: false,
        message: "License not found"
      });
    }

    // Find the file
    const fileIndex = license.uploadedFiles.findIndex(f => f._id.toString() === fileId);
    if (fileIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "File not found"
      });
    }

    const file = license.uploadedFiles[fileIndex];

    // Delete physical file
    const filePath = file.filePath.replace(/^\//, '');
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Remove from database
    license.uploadedFiles.splice(fileIndex, 1);
    license.lastModifiedBy = developerId;
    await license.save();

    res.status(200).json({
      success: true,
      message: "License file deleted successfully",
      remainingFiles: license.uploadedFiles.length
    });

  } catch (err) {
    console.error("DELETE LICENSE FILE ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error while deleting license file",
      error: err.message
    });
  }
};

// Validate and submit for review
export const submitForReview = async (req, res) => {
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

    // Get license
    const license = await License.findOne({ gameId });
    if (!license) {
      return res.status(404).json({
        success: false,
        message: "License information not found. Please submit license information first."
      });
    }

    // Check if license is complete
    if (!license.isComplete()) {
      return res.status(400).json({
        success: false,
        message: "License information is incomplete",
        completionPercentage: license.getCompletionPercentage(),
        missingItems: getMissingItems(license)
      });
    }

    // Perform automatic validation checks
    const validationChecks = performAutomaticValidation(license);

    // Update validation status
    license.validation.status = 'In Review';
    license.validation.complianceChecks = validationChecks;
    license.submittedAt = new Date();
    license.lastModifiedBy = developerId;

    await license.save();

    res.status(200).json({
      success: true,
      message: "License information submitted for review successfully. You will be notified once the review is complete.",
      validation: {
        status: license.validation.status,
        submittedAt: license.submittedAt,
        complianceChecks: validationChecks,
        completionPercentage: license.getCompletionPercentage()
      }
    });

  } catch (err) {
    console.error("SUBMIT FOR REVIEW ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error while submitting for review",
      error: err.message
    });
  }
};

// Get license requirements and guidelines
export const getLicenseRequirements = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      requirements: {
        engineInformation: {
          required: true,
          fields: [
            {
              name: 'engine.name',
              type: 'enum',
              required: true,
              options: ['Unity', 'Unreal Engine', 'Godot', 'Phaser', 'PixiJS', 'Three.js', 'Babylon.js', 'Custom/Vanilla JS', 'HTML5 Canvas', 'WebGL', 'Other']
            },
            {
              name: 'engine.licenseType',
              type: 'enum',
              required: true,
              options: ['Free/Open Source', 'Personal License', 'Commercial License', 'Educational License', 'Indie License', 'Enterprise License', 'Not Applicable']
            }
          ]
        },
        assetLicenses: {
          required: false,
          recommended: true,
          description: 'Document all third-party assets used in your game',
          fields: [
            'assetType', 'assetName', 'source', 'licenseType', 'attribution (if required)'
          ]
        },
        intellectualProperty: {
          required: true,
          fields: [
            {
              name: 'ownershipStatus',
              type: 'enum',
              required: true,
              options: ['Sole Owner', 'Co-Owner', 'Licensed', 'Work for Hire', 'Open Source']
            },
            {
              name: 'copyrightHolder',
              type: 'string',
              required: true,
              description: 'Name of the copyright holder'
            },
            {
              name: 'copyrightYear',
              type: 'number',
              required: true,
              description: 'Year of copyright'
            }
          ]
        },
        fileUploads: {
          required: false,
          recommended: true,
          formats: ['PDF', 'JPG', 'PNG', 'DOC', 'DOCX', 'TXT', 'ZIP'],
          maxSize: '50MB per file',
          types: [
            'Engine License',
            'Asset License',
            'IP Documentation',
            'Copyright Certificate',
            'Permission Letter',
            'Trademark Certificate',
            'Patent Document',
            'Contract/Agreement'
          ]
        },
        declarations: {
          required: true,
          mustAccept: [
            'ownershipConfirmed - Confirm you own or have rights to use all content',
            'noInfringement - Declare the game does not infringe on third-party rights',
            'accurateInformation - Confirm all provided information is accurate',
            'agreementAccepted - Accept the platform license agreement'
          ]
        }
      },
      guidelines: {
        engineLicense: 'Ensure you have the appropriate license for your game engine based on your revenue and usage.',
        assetLicenses: 'Document all third-party assets including images, sounds, fonts, and code libraries. Provide attribution where required.',
        intellectualProperty: 'Be clear about ownership. If you share ownership or use licensed IP, provide documentation.',
        fileAuthenticity: 'Upload authentic license documents. Falsified documents will result in account suspension.',
        thirdPartyIP: 'If using third-party intellectual property, ensure you have proper permissions and documentation.'
      },
      complianceProcess: {
        steps: [
          '1. Complete all required fields in the license form',
          '2. Upload supporting documentation (recommended)',
          '3. Review and accept all declarations',
          '4. Submit for review',
          '5. Wait for admin approval (typically 2-5 business days)'
        ]
      }
    });

  } catch (err) {
    console.error("GET LICENSE REQUIREMENTS ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message
    });
  }
};

// Get all licenses for a developer (admin view of their submissions)
export const getDeveloperLicenses = async (req, res) => {
  try {
    const developerId = req.user.userId;

    const licenses = await License.find({ developerId })
      .populate('gameId', 'title gameUrl thumbnailUrl')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: licenses.length,
      licenses: licenses.map(license => ({
        id: license._id,
        game: {
          id: license.gameId._id,
          title: license.gameId.title,
          gameUrl: license.gameId.gameUrl,
          thumbnailUrl: license.gameId.thumbnailUrl
        },
        completionPercentage: license.getCompletionPercentage(),
        isComplete: license.isComplete(),
        validation: license.getValidationSummary(),
        submittedAt: license.submittedAt,
        updatedAt: license.updatedAt
      }))
    });

  } catch (err) {
    console.error("GET DEVELOPER LICENSES ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error while retrieving licenses",
      error: err.message
    });
  }
};

// ============================================
// HELPER FUNCTIONS
// ============================================

// Get missing items for incomplete license
function getMissingItems(license) {
  const missing = [];

  if (!license.engine || !license.engine.name) {
    missing.push('Engine name');
  }
  if (!license.engine || !license.engine.licenseType) {
    missing.push('Engine license type');
  }
  if (!license.intellectualProperty || !license.intellectualProperty.ownershipStatus) {
    missing.push('Ownership status');
  }
  if (!license.intellectualProperty || !license.intellectualProperty.copyrightHolder) {
    missing.push('Copyright holder');
  }
  if (!license.areDeclarationsComplete()) {
    missing.push('One or more required declarations');
  }

  return missing;
}

// Perform automatic validation checks
function performAutomaticValidation(license) {
  const checks = {
    engineLicenseValid: null,
    assetsDocumented: null,
    ipOwnershipClear: null,
    filesAuthentic: null,
    attributionsComplete: null
  };

  // Engine license check
  checks.engineLicenseValid = !!(license.engine && license.engine.name && license.engine.licenseType);

  // Assets documented check
  if (license.assets && license.assets.length > 0) {
    checks.assetsDocumented = license.assets.every(asset =>
      asset.assetType && asset.assetName && asset.source && asset.licenseType
    );
  } else {
    checks.assetsDocumented = true; // No assets is acceptable
  }

  // IP ownership clear
  checks.ipOwnershipClear = !!(
    license.intellectualProperty &&
    license.intellectualProperty.ownershipStatus &&
    license.intellectualProperty.copyrightHolder &&
    license.intellectualProperty.copyrightYear
  );

  // Files uploaded (at least one recommended)
  checks.filesAuthentic = license.uploadedFiles && license.uploadedFiles.length > 0;

  // Attributions complete
  const assetsRequiringAttribution = license.assets.filter(asset =>
    ['CC BY (Attribution)', 'CC BY-SA (Share Alike)', 'CC BY-NC (Non-Commercial)'].includes(asset.licenseType)
  );

  if (assetsRequiringAttribution.length > 0) {
    checks.attributionsComplete = assetsRequiringAttribution.every(asset => asset.attribution && asset.attribution.trim() !== '');
  } else {
    checks.attributionsComplete = true;
  }

  return checks;
}
