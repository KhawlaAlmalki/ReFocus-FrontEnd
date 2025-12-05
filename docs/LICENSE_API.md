# License and Ownership API Documentation

## Overview

The License and Ownership API allows game developers to submit, manage, and validate license information for their games on the ReFocus platform. This system ensures compliance with intellectual property rights, tracks engine and asset licenses, and maintains proper documentation.

---

## Table of Contents

1. [Authentication](#authentication)
2. [License Requirements](#license-requirements)
3. [API Endpoints](#api-endpoints)
4. [Validation Process](#validation-process)
5. [Error Handling](#error-handling)
6. [Example Requests](#example-requests)

---

## Authentication

All license endpoints require:
- **Authentication**: Valid JWT token in Authorization header
- **Role**: Developer role (isDeveloper middleware)

```
Authorization: Bearer <jwt_token>
```

---

## License Requirements

### Required Information

#### 1. Game Engine Information
- **Engine Name**: Unity, Unreal Engine, Godot, Phaser, etc.
- **Engine License Type**: Free/Open Source, Personal, Commercial, etc.
- **License Details**: Optional additional information

#### 2. Asset Licenses
Document all third-party assets:
- Images/Graphics
- Audio/Music
- Fonts
- 3D Models
- Animations
- Code/Scripts
- UI Elements

For each asset:
- Asset type and name
- Source (Original, Licensed Stock, Free/CC, etc.)
- License type (CC0, CC BY, MIT, Commercial, etc.)
- Attribution (if required)
- Source and license URLs

#### 3. Intellectual Property Documentation
- **Ownership Status**: Sole Owner, Co-Owner, Licensed, Work for Hire, Open Source
- **Copyright Holder**: Full name or company name
- **Copyright Year**: Year of creation/registration
- **Trademarks** (optional): Name, registration number, status
- **Patents** (optional): Title, patent number, status
- **Third-Party IP**: Disclosure if using third-party intellectual property

#### 4. Legal Declarations
All developers must accept:
- **Ownership Confirmation**: You own or have rights to all content
- **No Infringement**: Game does not infringe on third-party rights
- **Accurate Information**: All provided information is accurate
- **Agreement Acceptance**: Accept platform license agreement

### Recommended Documentation

Upload supporting files:
- Engine license certificates
- Asset purchase receipts
- Copyright certificates
- Permission letters
- Contracts/Agreements
- IP documentation

**Supported Formats**: PDF, JPG, PNG, DOC, DOCX, TXT, ZIP
**Max File Size**: 50MB per file
**Max Files**: 10 files per upload request

---

## API Endpoints

### 1. Get License Requirements

Get detailed information about license requirements and guidelines.

**Endpoint:** `GET /api/dev/licenses/requirements`

**Response:**
```json
{
  "success": true,
  "requirements": {
    "engineInformation": {
      "required": true,
      "fields": [
        {
          "name": "engine.name",
          "type": "enum",
          "required": true,
          "options": ["Unity", "Unreal Engine", "Godot", "Phaser", "PixiJS", "Three.js", "Babylon.js", "Custom/Vanilla JS", "HTML5 Canvas", "WebGL", "Other"]
        },
        {
          "name": "engine.licenseType",
          "type": "enum",
          "required": true,
          "options": ["Free/Open Source", "Personal License", "Commercial License", "Educational License", "Indie License", "Enterprise License", "Not Applicable"]
        }
      ]
    },
    "assetLicenses": {
      "required": false,
      "recommended": true,
      "description": "Document all third-party assets used in your game"
    },
    "intellectualProperty": {
      "required": true,
      "fields": ["ownershipStatus", "copyrightHolder", "copyrightYear"]
    },
    "fileUploads": {
      "required": false,
      "recommended": true,
      "formats": ["PDF", "JPG", "PNG", "DOC", "DOCX", "TXT", "ZIP"],
      "maxSize": "50MB per file"
    },
    "declarations": {
      "required": true,
      "mustAccept": [
        "ownershipConfirmed",
        "noInfringement",
        "accurateInformation",
        "agreementAccepted"
      ]
    }
  },
  "guidelines": {
    "engineLicense": "Ensure you have the appropriate license for your game engine",
    "assetLicenses": "Document all third-party assets with proper attribution",
    "intellectualProperty": "Be clear about ownership and provide documentation",
    "fileAuthenticity": "Upload authentic documents only"
  }
}
```

---

### 2. Get All Developer's Licenses

Get a list of all license submissions for the authenticated developer.

**Endpoint:** `GET /api/dev/licenses`

**Response:**
```json
{
  "success": true,
  "count": 3,
  "licenses": [
    {
      "id": "507f1f77bcf86cd799439011",
      "game": {
        "id": "507f191e810c19729de860ea",
        "title": "Memory Challenge",
        "gameUrl": "/uploads/games/memory-challenge/index.html",
        "thumbnailUrl": "/uploads/games/thumbnail.jpg"
      },
      "completionPercentage": 100,
      "isComplete": true,
      "validation": {
        "status": "Approved",
        "completionPercentage": 100,
        "checksCompleted": 5,
        "totalChecks": 5,
        "filesUploaded": 3,
        "assetsDocumented": 5
      },
      "submittedAt": "2025-12-04T10:30:00.000Z",
      "updatedAt": "2025-12-04T11:00:00.000Z"
    }
  ]
}
```

---

### 3. Get License for Specific Game

Get detailed license information for a specific game.

**Endpoint:** `GET /api/dev/games/:gameId/license`

**URL Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| gameId | String | Game ID |

**Success Response (200):**
```json
{
  "success": true,
  "license": {
    "id": "507f1f77bcf86cd799439011",
    "gameId": "507f191e810c19729de860ea",
    "engine": {
      "name": "Phaser",
      "version": "3.55.2",
      "licenseType": "Free/Open Source",
      "licenseDetails": "MIT License"
    },
    "assets": [
      {
        "assetType": "Images/Graphics",
        "assetName": "Background Sprites",
        "source": "Free/CC Licensed",
        "licenseType": "CC0 (Public Domain)",
        "sourceUrl": "https://opengameart.org/content/backgrounds",
        "attribution": null
      },
      {
        "assetType": "Audio/Music",
        "assetName": "Game Music",
        "source": "Licensed Stock",
        "licenseType": "Royalty-Free",
        "attribution": "Music by Composer Name",
        "sourceUrl": "https://audiojungle.net"
      }
    ],
    "intellectualProperty": {
      "ownershipStatus": "Sole Owner",
      "ownershipDetails": "Original game concept and implementation",
      "copyrightHolder": "John Developer",
      "copyrightYear": 2025,
      "trademarks": [],
      "patents": [],
      "thirdPartyIP": {
        "hasThirdPartyIP": false,
        "details": null,
        "permissionsObtained": false
      }
    },
    "uploadedFiles": [
      {
        "id": "507f1f77bcf86cd799439012",
        "fileType": "Engine License",
        "fileName": "phaser-mit-license.pdf",
        "fileSize": "125.5 KB",
        "uploadedAt": "2025-12-04T10:00:00.000Z",
        "description": "MIT License for Phaser framework"
      },
      {
        "id": "507f1f77bcf86cd799439013",
        "fileType": "Asset License",
        "fileName": "music-license.pdf",
        "fileSize": "450 KB",
        "uploadedAt": "2025-12-04T10:05:00.000Z",
        "description": "Royalty-free music license"
      }
    ],
    "validation": {
      "status": "Approved",
      "completionPercentage": 100,
      "isComplete": true,
      "checksCompleted": 5,
      "totalChecks": 5,
      "filesUploaded": 2,
      "assetsDocumented": 2
    },
    "declarations": {
      "ownershipConfirmed": true,
      "noInfringement": true,
      "accurateInformation": true,
      "agreementAccepted": true,
      "declaredAt": "2025-12-04T10:30:00.000Z",
      "ipAddress": "192.168.1.1"
    },
    "completionPercentage": 100,
    "isComplete": true,
    "submittedAt": "2025-12-04T10:30:00.000Z",
    "createdAt": "2025-12-04T09:00:00.000Z",
    "updatedAt": "2025-12-04T11:00:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "License information not found for this game"
}
```

---

### 4. Submit License Information

Create or update license information for a game.

**Endpoint:** `POST /api/dev/games/:gameId/license` (Create)
**Endpoint:** `PUT /api/dev/games/:gameId/license` (Update)

**Content-Type:** `application/json`

**URL Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| gameId | String | Game ID |

**Request Body:**
```json
{
  "engine": {
    "name": "Phaser",
    "version": "3.55.2",
    "licenseType": "Free/Open Source",
    "licenseDetails": "MIT License"
  },
  "assets": [
    {
      "assetType": "Images/Graphics",
      "assetName": "Background Sprites",
      "source": "Free/CC Licensed",
      "licenseType": "CC0 (Public Domain)",
      "sourceUrl": "https://opengameart.org/content/backgrounds"
    },
    {
      "assetType": "Audio/Music",
      "assetName": "Game Music",
      "source": "Licensed Stock",
      "licenseType": "Royalty-Free",
      "attribution": "Music by Composer Name",
      "sourceUrl": "https://audiojungle.net",
      "licenseUrl": "https://audiojungle.net/licenses/terms/audio_regular"
    }
  ],
  "intellectualProperty": {
    "ownershipStatus": "Sole Owner",
    "ownershipDetails": "Original game concept and implementation",
    "copyrightHolder": "John Developer",
    "copyrightYear": 2025,
    "trademarks": [],
    "patents": [],
    "thirdPartyIP": {
      "hasThirdPartyIP": false,
      "details": null,
      "permissionsObtained": false
    }
  },
  "declarations": {
    "ownershipConfirmed": true,
    "noInfringement": true,
    "accurateInformation": true,
    "agreementAccepted": true
  },
  "additionalNotes": "All assets are properly licensed and documented."
}
```

**Success Response (201 for Create, 200 for Update):**
```json
{
  "success": true,
  "message": "License information submitted successfully",
  "license": {
    "id": "507f1f77bcf86cd799439011",
    "completionPercentage": 85,
    "isComplete": false,
    "validation": {
      "status": "Pending",
      "completionPercentage": 85,
      "isComplete": false,
      "checksCompleted": 4,
      "totalChecks": 5,
      "filesUploaded": 0,
      "assetsDocumented": 2
    }
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    "Engine name is required",
    "You must confirm ownership"
  ]
}
```

---

### 5. Upload License Files

Upload supporting documentation files for a license.

**Endpoint:** `POST /api/dev/games/:gameId/license/files`

**Content-Type:** `multipart/form-data`

**URL Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| gameId | String | Game ID |

**Form Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| licenseFiles | File[] | Yes | Array of license files (max 10) |
| fileType | String | No | Type of files ('Engine License', 'Asset License', etc.) |
| description | String | No | Description of the files |

**Success Response (200):**
```json
{
  "success": true,
  "message": "3 license file(s) uploaded successfully",
  "uploadedFiles": [
    {
      "fileName": "phaser-license.pdf",
      "fileType": "Engine License",
      "fileSize": "125.5 KB",
      "filePath": "/uploads/licenses/license-phaser-license-1234567890.pdf",
      "uploadedAt": "2025-12-04T10:00:00.000Z"
    },
    {
      "fileName": "music-license.pdf",
      "fileType": "Asset License",
      "fileSize": "450 KB",
      "filePath": "/uploads/licenses/license-music-license-1234567891.pdf",
      "uploadedAt": "2025-12-04T10:00:00.000Z"
    }
  ],
  "licenseStatus": {
    "completionPercentage": 100,
    "totalFiles": 3
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "No license files uploaded"
}
```

---

### 6. Delete License File

Delete a specific license file.

**Endpoint:** `DELETE /api/dev/games/:gameId/license/files/:fileId`

**URL Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| gameId | String | Game ID |
| fileId | String | File ID to delete |

**Success Response (200):**
```json
{
  "success": true,
  "message": "License file deleted successfully",
  "remainingFiles": 2
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "File not found"
}
```

---

### 7. Submit License for Review

Submit completed license information for admin review and approval.

**Endpoint:** `POST /api/dev/games/:gameId/license/submit`

**URL Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| gameId | String | Game ID |

**Success Response (200):**
```json
{
  "success": true,
  "message": "License information submitted for review successfully. You will be notified once the review is complete.",
  "validation": {
    "status": "In Review",
    "submittedAt": "2025-12-04T10:30:00.000Z",
    "complianceChecks": {
      "engineLicenseValid": true,
      "assetsDocumented": true,
      "ipOwnershipClear": true,
      "filesAuthentic": true,
      "attributionsComplete": true
    },
    "completionPercentage": 100
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "License information is incomplete",
  "completionPercentage": 71,
  "missingItems": [
    "Engine license type",
    "One or more required declarations"
  ]
}
```

---

## Validation Process

### Automatic Validation Checks

When a license is submitted for review, the system performs these automatic checks:

1. **Engine License Valid**
   - Checks if engine name and license type are provided
   - Validates against allowed engine types

2. **Assets Documented**
   - Verifies all assets have complete information
   - Checks for required attribution where needed

3. **IP Ownership Clear**
   - Confirms ownership status is declared
   - Verifies copyright holder and year are provided

4. **Files Authentic**
   - Checks if at least one supporting document is uploaded
   - Validates file formats and sizes

5. **Attributions Complete**
   - For assets requiring attribution (CC BY, CC BY-SA, CC BY-NC)
   - Verifies attribution text is provided

### Validation Statuses

| Status | Description |
|--------|-------------|
| Pending | License created but not yet submitted for review |
| In Review | Submitted and awaiting admin review |
| Approved | License approved by admin |
| Rejected | License rejected, see rejection reason |
| Needs Revision | Previously approved but needs updates after changes |

### Completion Percentage

The system calculates completion based on:
- Engine information (2 points)
- Assets documented (1 point)
- IP information (2 points)
- Files uploaded (1 point)
- Declarations accepted (1 point)

**Total**: 7 points = 100% complete

---

## Error Handling

### Common Error Codes

| Status Code | Description |
|-------------|-------------|
| 400 | Bad Request - Validation error or missing required data |
| 401 | Unauthorized - Missing or invalid JWT token |
| 403 | Forbidden - User doesn't have developer role |
| 404 | Not Found - Game or license not found, or access denied |
| 500 | Server Error - File processing or database error |

### Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message",
  "errors": ["Validation error 1", "Validation error 2"],
  "completionPercentage": 71,
  "missingItems": ["Item 1", "Item 2"]
}
```

---

## Example Requests

### Example 1: Submit Complete License Information (cURL)

```bash
curl -X POST http://localhost:3000/api/dev/games/507f191e810c19729de860ea/license \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "engine": {
      "name": "Phaser",
      "version": "3.55.2",
      "licenseType": "Free/Open Source",
      "licenseDetails": "MIT License"
    },
    "assets": [
      {
        "assetType": "Images/Graphics",
        "assetName": "Background Sprites",
        "source": "Free/CC Licensed",
        "licenseType": "CC0 (Public Domain)",
        "sourceUrl": "https://opengameart.org/content/backgrounds"
      }
    ],
    "intellectualProperty": {
      "ownershipStatus": "Sole Owner",
      "copyrightHolder": "John Developer",
      "copyrightYear": 2025
    },
    "declarations": {
      "ownershipConfirmed": true,
      "noInfringement": true,
      "accurateInformation": true,
      "agreementAccepted": true
    }
  }'
```

### Example 2: Upload License Files (JavaScript/Fetch)

```javascript
const uploadLicenseDocuments = async (gameId, files, fileType) => {
  const formData = new FormData();

  // Add multiple files
  files.forEach(file => {
    formData.append('licenseFiles', file);
  });

  formData.append('fileType', fileType);
  formData.append('description', 'Supporting license documentation');

  const response = await fetch(`http://localhost:3000/api/dev/games/${gameId}/license/files`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  return await response.json();
};

// Usage
const files = document.getElementById('licenseFiles').files;
const result = await uploadLicenseDocuments(
  '507f191e810c19729de860ea',
  Array.from(files),
  'Engine License'
);
console.log('Uploaded:', result.uploadedFiles.length, 'files');
```

### Example 3: Submit for Review (JavaScript/Fetch)

```javascript
const submitLicenseForReview = async (gameId) => {
  const response = await fetch(`http://localhost:3000/api/dev/games/${gameId}/license/submit`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const result = await response.json();

  if (result.success) {
    console.log('Submitted for review:', result.validation.status);
    console.log('Compliance checks:', result.validation.complianceChecks);
  } else {
    console.error('Submission failed:', result.message);
    console.log('Missing items:', result.missingItems);
  }

  return result;
};

// Usage
await submitLicenseForReview('507f191e810c19729de860ea');
```

### Example 4: Get License Status (JavaScript/Fetch)

```javascript
const checkLicenseStatus = async (gameId) => {
  const response = await fetch(`http://localhost:3000/api/dev/games/${gameId}/license`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const result = await response.json();

  if (result.success) {
    const { license } = result;
    console.log('Completion:', license.completionPercentage + '%');
    console.log('Status:', license.validation.status);
    console.log('Is Complete:', license.isComplete);
    console.log('Files Uploaded:', license.uploadedFiles.length);
    console.log('Assets Documented:', license.assets.length);
  }

  return result;
};

// Usage
const status = await checkLicenseStatus('507f191e810c19729de860ea');
```

### Example 5: Complete License Submission Flow (JavaScript)

```javascript
const completeLicenseSubmission = async (gameId, licenseData, files) => {
  try {
    // Step 1: Submit license information
    console.log('Step 1: Submitting license information...');
    const licenseResponse = await fetch(`http://localhost:3000/api/dev/games/${gameId}/license`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(licenseData)
    });
    const licenseResult = await licenseResponse.json();
    console.log('License submitted:', licenseResult.license.completionPercentage + '% complete');

    // Step 2: Upload supporting files
    if (files && files.length > 0) {
      console.log('Step 2: Uploading supporting documents...');
      const formData = new FormData();
      files.forEach(file => formData.append('licenseFiles', file));
      formData.append('fileType', 'IP Documentation');

      const filesResponse = await fetch(`http://localhost:3000/api/dev/games/${gameId}/license/files`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      const filesResult = await filesResponse.json();
      console.log('Files uploaded:', filesResult.uploadedFiles.length);
    }

    // Step 3: Submit for review
    console.log('Step 3: Submitting for review...');
    const reviewResponse = await fetch(`http://localhost:3000/api/dev/games/${gameId}/license/submit`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const reviewResult = await reviewResponse.json();

    if (reviewResult.success) {
      console.log('Success! License submitted for review.');
      console.log('Status:', reviewResult.validation.status);
      return reviewResult;
    } else {
      console.error('Submission incomplete:', reviewResult.missingItems);
      return reviewResult;
    }

  } catch (error) {
    console.error('Error during license submission:', error);
    throw error;
  }
};

// Usage
const licenseData = {
  engine: {
    name: 'Phaser',
    licenseType: 'Free/Open Source'
  },
  intellectualProperty: {
    ownershipStatus: 'Sole Owner',
    copyrightHolder: 'John Developer',
    copyrightYear: 2025
  },
  declarations: {
    ownershipConfirmed: true,
    noInfringement: true,
    accurateInformation: true,
    agreementAccepted: true
  }
};

const files = document.getElementById('licenseFiles').files;
await completeLicenseSubmission('507f191e810c19729de860ea', licenseData, Array.from(files));
```

---

## Best Practices

### 1. Documentation

- **Be Thorough**: Document all third-party assets, even small ones
- **Keep Records**: Maintain copies of all license documents offline
- **Update Regularly**: Update license info when game content changes
- **Clear Attribution**: Provide proper attribution where required

### 2. File Management

- **Organize Files**: Use descriptive filenames for uploads
- **File Types**: Use PDF for official documents, images for screenshots
- **File Size**: Compress large files before uploading
- **Backup**: Keep backup copies of all uploaded documents

### 3. Compliance

- **Review Requirements**: Check license requirements before starting
- **Verify Licenses**: Ensure you have valid licenses for all tools/assets
- **Third-Party Permissions**: Obtain written permission for third-party IP
- **Legal Review**: Consider legal review for commercial games

### 4. Validation

- **Complete First**: Fill in all information before submitting for review
- **Upload Documents**: Always upload supporting documentation
- **Check Status**: Monitor validation status regularly
- **Address Feedback**: Respond promptly to rejection feedback

### 5. Security

- **Authentic Documents**: Only upload authentic, unmodified documents
- **Sensitive Information**: Redact sensitive info (payment details, personal data)
- **Permissions**: Ensure you have permission to share documents
- **Confidentiality**: Don't upload confidential proprietary information

---

## Troubleshooting

### Issue: "License information is incomplete"

**Solution**: Check the `missingItems` in the error response and complete all required fields. Minimum requirements are engine info, IP ownership, and declarations.

### Issue: "You must confirm ownership"

**Solution**: All four declarations must be set to `true`: ownershipConfirmed, noInfringement, accurateInformation, and agreementAccepted.

### Issue: "Game not found or you don't have access"

**Solution**: Verify you're using the correct game ID and that you're the developer who created the game.

### Issue: "Invalid file type"

**Solution**: Only PDF, images (JPG, PNG), DOC/DOCX, TXT, and ZIP files are accepted. Check file extension and MIME type.

### Issue: "File too large"

**Solution**: License files must be under 50MB each. Compress files or split into multiple uploads.

### Issue: Low completion percentage

**Solution**: To reach 100% completion:
- Provide engine name and license type
- Document at least one asset (if applicable)
- Fill in all IP information
- Upload at least one supporting document
- Accept all declarations

---

## Support

For additional help:
- Review validation status and completion percentage
- Check error messages for specific issues
- Ensure all required fields are completed
- Upload supporting documentation
- Contact support if review takes longer than 5 business days

---

**Last Updated**: 2025-12-04
**API Version**: 1.0.0
