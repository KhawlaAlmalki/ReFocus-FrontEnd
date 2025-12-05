// src/models/License.js
import mongoose from "mongoose";

const licenseSchema = new mongoose.Schema({
  // Game Reference
  gameId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    required: true,
    unique: true // One license record per game
  },

  // Developer Reference
  developerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // ============================================
  // Game Engine Information
  // ============================================

  engine: {
    name: {
      type: String,
      enum: [
        'Unity',
        'Unreal Engine',
        'Godot',
        'Phaser',
        'PixiJS',
        'Three.js',
        'Babylon.js',
        'Custom/Vanilla JS',
        'HTML5 Canvas',
        'WebGL',
        'Other'
      ],
      required: true
    },
    version: {
      type: String,
      default: null
    },
    licenseType: {
      type: String,
      enum: [
        'Free/Open Source',
        'Personal License',
        'Commercial License',
        'Educational License',
        'Indie License',
        'Enterprise License',
        'Not Applicable'
      ],
      required: true
    },
    licenseDetails: {
      type: String,
      maxlength: 1000,
      default: null
    }
  },

  // ============================================
  // Asset Licenses
  // ============================================

  assets: [{
    assetType: {
      type: String,
      enum: [
        'Images/Graphics',
        'Audio/Music',
        'Fonts',
        '3D Models',
        'Animations',
        'Code/Scripts',
        'UI Elements',
        'Icons',
        'Other'
      ],
      required: true
    },
    assetName: {
      type: String,
      required: true,
      maxlength: 200
    },
    source: {
      type: String,
      enum: [
        'Original Creation',
        'Licensed Stock',
        'Free/CC Licensed',
        'Open Source',
        'Purchased',
        'Third-Party Library',
        'Other'
      ],
      required: true
    },
    licenseType: {
      type: String,
      enum: [
        'CC0 (Public Domain)',
        'CC BY (Attribution)',
        'CC BY-SA (Share Alike)',
        'CC BY-NC (Non-Commercial)',
        'MIT License',
        'Apache License',
        'GPL',
        'Commercial License',
        'Royalty-Free',
        'Custom License',
        'All Rights Reserved'
      ],
      required: true
    },
    attribution: {
      type: String,
      maxlength: 500,
      default: null
    },
    sourceUrl: {
      type: String,
      maxlength: 500,
      default: null
    },
    licenseUrl: {
      type: String,
      maxlength: 500,
      default: null
    },
    notes: {
      type: String,
      maxlength: 1000,
      default: null
    }
  }],

  // ============================================
  // Intellectual Property Documentation
  // ============================================

  intellectualProperty: {
    ownershipStatus: {
      type: String,
      enum: [
        'Sole Owner',
        'Co-Owner',
        'Licensed',
        'Work for Hire',
        'Open Source'
      ],
      required: true
    },
    ownershipDetails: {
      type: String,
      maxlength: 2000,
      default: null
    },
    copyrightHolder: {
      type: String,
      required: true,
      maxlength: 200
    },
    copyrightYear: {
      type: Number,
      required: true,
      min: 1900,
      max: 2100
    },
    trademarks: [{
      name: String,
      registrationNumber: String,
      status: {
        type: String,
        enum: ['Registered', 'Pending', 'Not Registered']
      }
    }],
    patents: [{
      title: String,
      patentNumber: String,
      status: {
        type: String,
        enum: ['Granted', 'Pending', 'Not Applicable']
      }
    }],
    thirdPartyIP: {
      hasThirdPartyIP: {
        type: Boolean,
        default: false
      },
      details: {
        type: String,
        maxlength: 1000,
        default: null
      },
      permissionsObtained: {
        type: Boolean,
        default: false
      }
    }
  },

  // ============================================
  // Uploaded License Files
  // ============================================

  uploadedFiles: [{
    fileType: {
      type: String,
      enum: [
        'Engine License',
        'Asset License',
        'IP Documentation',
        'Copyright Certificate',
        'Permission Letter',
        'Trademark Certificate',
        'Patent Document',
        'Contract/Agreement',
        'Other'
      ],
      required: true
    },
    fileName: {
      type: String,
      required: true
    },
    filePath: {
      type: String,
      required: true
    },
    fileSize: {
      type: Number,
      required: true
    },
    mimeType: {
      type: String,
      required: true
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    description: {
      type: String,
      maxlength: 500,
      default: null
    }
  }],

  // ============================================
  // Validation & Compliance
  // ============================================

  validation: {
    status: {
      type: String,
      enum: ['Pending', 'In Review', 'Approved', 'Rejected', 'Needs Revision'],
      default: 'Pending'
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    reviewedAt: {
      type: Date,
      default: null
    },
    rejectionReason: {
      type: String,
      maxlength: 2000,
      default: null
    },
    notes: {
      type: String,
      maxlength: 2000,
      default: null
    },
    complianceChecks: {
      engineLicenseValid: { type: Boolean, default: null },
      assetsDocumented: { type: Boolean, default: null },
      ipOwnershipClear: { type: Boolean, default: null },
      filesAuthentic: { type: Boolean, default: null },
      attributionsComplete: { type: Boolean, default: null }
    }
  },

  // ============================================
  // Declarations & Agreements
  // ============================================

  declarations: {
    ownershipConfirmed: {
      type: Boolean,
      required: true,
      default: false
    },
    noInfringement: {
      type: Boolean,
      required: true,
      default: false
    },
    accurateInformation: {
      type: Boolean,
      required: true,
      default: false
    },
    agreementAccepted: {
      type: Boolean,
      required: true,
      default: false
    },
    declaredAt: {
      type: Date,
      default: Date.now
    },
    ipAddress: {
      type: String,
      default: null
    }
  },

  // ============================================
  // Additional Information
  // ============================================

  additionalNotes: {
    type: String,
    maxlength: 5000,
    default: null
  },

  // Modification tracking
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },

  submittedAt: {
    type: Date,
    default: null
  },

  // Version tracking for updates
  version: {
    type: Number,
    default: 1
  }

}, {
  timestamps: true
});

// ============================================
// INDEXES
// ============================================

licenseSchema.index({ gameId: 1 });
licenseSchema.index({ developerId: 1 });
licenseSchema.index({ 'validation.status': 1 });
licenseSchema.index({ createdAt: -1 });

// ============================================
// METHODS
// ============================================

// Check if all required declarations are confirmed
licenseSchema.methods.areDeclarationsComplete = function() {
  return this.declarations.ownershipConfirmed &&
         this.declarations.noInfringement &&
         this.declarations.accurateInformation &&
         this.declarations.agreementAccepted;
};

// Check if license is complete
licenseSchema.methods.isComplete = function() {
  const hasEngine = this.engine && this.engine.name && this.engine.licenseType;
  const hasIP = this.intellectualProperty &&
                this.intellectualProperty.ownershipStatus &&
                this.intellectualProperty.copyrightHolder;
  const hasDeclarations = this.areDeclarationsComplete();

  return hasEngine && hasIP && hasDeclarations;
};

// Calculate completion percentage
licenseSchema.methods.getCompletionPercentage = function() {
  let completed = 0;
  let total = 7;

  // Engine information (2 points)
  if (this.engine && this.engine.name) completed++;
  if (this.engine && this.engine.licenseType) completed++;

  // Assets documented (1 point)
  if (this.assets && this.assets.length > 0) completed++;

  // IP information (2 points)
  if (this.intellectualProperty && this.intellectualProperty.ownershipStatus) completed++;
  if (this.intellectualProperty && this.intellectualProperty.copyrightHolder) completed++;

  // Files uploaded (1 point)
  if (this.uploadedFiles && this.uploadedFiles.length > 0) completed++;

  // Declarations (1 point)
  if (this.areDeclarationsComplete()) completed++;

  return Math.round((completed / total) * 100);
};

// Get validation summary
licenseSchema.methods.getValidationSummary = function() {
  return {
    status: this.validation.status,
    completionPercentage: this.getCompletionPercentage(),
    isComplete: this.isComplete(),
    checksCompleted: Object.values(this.validation.complianceChecks).filter(v => v === true).length,
    totalChecks: Object.keys(this.validation.complianceChecks).length,
    filesUploaded: this.uploadedFiles.length,
    assetsDocumented: this.assets.length
  };
};

// Format file size
licenseSchema.methods.formatFileSize = function(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
};

const License = mongoose.model("License", licenseSchema);

export default License;
