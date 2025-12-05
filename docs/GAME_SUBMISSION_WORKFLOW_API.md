# Game Submission Workflow API Documentation

## Overview

This comprehensive API documentation covers the complete game submission workflow on the ReFocus platform, including media upload, submission management, review tracking, and version control.

---

## Table of Contents

1. [Upload Game Media](#upload-game-media)
2. [Submit Game for Review](#submit-game-for-review)
3. [Track Submission Status](#track-submission-status)
4. [Version Control & Revert](#version-control--revert)
5. [Admin Review Management](#admin-review-management)
6. [Example Workflows](#example-workflows)

---

## Upload Game Media

### Requirements

**Cover Image:**
- **Dimensions**: 1280x720px (min) to 3840x2160px (max)
- **Aspect Ratios**: 16:9, 4:3, or 3:2
- **File Size**: Max 5MB
- **Formats**: JPEG, PNG, WebP
- **Quantity**: 1 required

**Screenshots:**
- **Dimensions**: 1024x576px (min) to 3840x2160px (max)
- **Aspect Ratios**: 16:9, 4:3, or 3:2
- **File Size**: Max 5MB per screenshot
- **Formats**: JPEG, PNG, WebP
- **Quantity**: 2-5 required

### Endpoints

#### 1. Get Media Requirements

```
GET /api/dev/media/requirements
```

**Response:**
```json
{
  "success": true,
  "requirements": {
    "coverImage": {
      "description": "Main cover image for the game",
      "minDimensions": "1280x720px",
      "maxDimensions": "3840x2160px",
      "acceptableAspectRatios": ["16:9", "4:3", "3:2"],
      "maxFileSize": "5 MB",
      "formats": ["JPEG", "PNG", "WebP"],
      "quantity": 1
    },
    "screenshots": {
      "description": "In-game screenshots showing gameplay",
      "minDimensions": "1024x576px",
      "maxDimensions": "3840x2160px",
      "acceptableAspectRatios": ["16:9", "4:3", "3:2"],
      "maxFileSize": "5 MB",
      "formats": ["JPEG", "PNG", "WebP"],
      "quantity": "2-5 images required"
    }
  }
}
```

#### 2. Upload Cover Image

```
POST /api/dev/games/:gameId/media/cover
Content-Type: multipart/form-data
```

**Form Data:**
- `coverImage` (file): Cover image file

**Success Response (200):**
```json
{
  "success": true,
  "message": "Cover image uploaded successfully",
  "coverImage": {
    "url": "/uploads/game-media/media-cover-1234567890.jpg",
    "dimensions": "1920x1080",
    "aspectRatio": "16:9",
    "fileSize": "2.45 MB",
    "format": "jpeg"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Cover image validation failed",
  "errors": [
    "Image is too small. Minimum dimensions: 1280x720px",
    "Invalid aspect ratio 1:1. Acceptable ratios: 16:9, 4:3, 3:2"
  ]
}
```

#### 3. Upload Screenshots

```
POST /api/dev/games/:gameId/media/screenshots
Content-Type: multipart/form-data
```

**Form Data:**
- `screenshots` (files): 1-5 screenshot files

**Success Response (200):**
```json
{
  "success": true,
  "message": "3 screenshot(s) uploaded successfully",
  "screenshots": [
    {
      "fileName": "gameplay1.png",
      "dimensions": "1920x1080",
      "aspectRatio": "16:9",
      "fileSize": "3.2 MB"
    },
    {
      "fileName": "gameplay2.png",
      "dimensions": "1920x1080",
      "aspectRatio": "16:9",
      "fileSize": "2.8 MB"
    },
    {
      "fileName": "gameplay3.png",
      "dimensions": "1920x1080",
      "aspectRatio": "16:9",
      "fileSize": "3.1 MB"
    }
  ],
  "totalScreenshots": 3
}
```

#### 4. Delete Screenshot

```
DELETE /api/dev/games/:gameId/media/screenshots/:screenshotId
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Screenshot deleted successfully",
  "remainingScreenshots": 2
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Cannot delete screenshot. Game must have at least 2 screenshots."
}
```

#### 5. Get Game Media

```
GET /api/dev/games/:gameId/media
```

**Success Response (200):**
```json
{
  "success": true,
  "media": {
    "coverImage": {
      "url": "/uploads/game-media/cover.jpg"
    },
    "thumbnail": {
      "url": "/uploads/game-media/thumb.jpg"
    },
    "screenshots": [
      {
        "id": "507f1f77bcf86cd799439011",
        "url": "/uploads/game-media/screenshot1.png",
        "fileName": "gameplay1.png",
        "dimensions": "1920x1080",
        "aspectRatio": "16:9",
        "fileSize": "3.2 MB",
        "uploadedAt": "2025-12-04T10:00:00.000Z",
        "order": 0
      }
    ],
    "isComplete": true,
    "screenshotCount": 3
  }
}
```

---

## Submit Game for Review

### Submission Requirements

Before submitting, ensure:
- Title and description are complete
- Game file is uploaded
- Cover image is uploaded
- At least 2 screenshots are uploaded
- License information is complete

### Endpoints

#### 1. Submit Game for Review

```
POST /api/dev/games/:gameId/submit
Content-Type: application/json
```

**Request Body:**
```json
{
  "changeLog": "Initial release with core features",
  "changes": [
    {
      "type": "Feature",
      "description": "Added memory training mode"
    },
    {
      "type": "Feature",
      "description": "Implemented scoring system"
    }
  ]
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Game submitted for review successfully. Your game is now locked and cannot be edited during the review process.",
  "submission": {
    "gameId": "507f191e810c19729de860ea",
    "versionId": "507f1f77bcf86cd799439011",
    "status": "In Review",
    "submittedAt": "2025-12-04T10:30:00.000Z",
    "isLocked": true,
    "estimatedReviewTime": "2-5 business days"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Game cannot be submitted. Please complete all required fields.",
  "errors": [
    "Cover image is required",
    "At least 2 screenshots are required",
    "Complete license information is required"
  ]
}
```

#### 2. Resubmit After Changes

```
POST /api/dev/games/:gameId/resubmit
Content-Type: application/json
```

**Request Body:**
```json
{
  "changeLog": "Fixed all requested issues and improved performance"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Game resubmitted for review successfully",
  "submission": {
    "gameId": "507f191e810c19729de860ea",
    "versionId": "507f1f77bcf86cd799439012",
    "versionNumber": "1.0.1",
    "status": "In Review",
    "submittedAt": "2025-12-05T14:00:00.000Z",
    "isLocked": true
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "All critical changes must be resolved before resubmission",
  "unresolvedChanges": [
    "Fix game crash on level 3",
    "Remove inappropriate content"
  ]
}
```

---

## Track Submission Status

### Status Flow

**Draft** → **In Review** → **Changes Requested** / **Rejected** / **Approved** → **Published**

### Endpoints

#### 1. Get Submission Status

```
GET /api/dev/games/:gameId/submission
```

**Success Response (200):**
```json
{
  "success": true,
  "submission": {
    "gameId": "507f191e810c19729de860ea",
    "title": "Memory Challenge",
    "currentStatus": "Changes Requested",
    "isLocked": false,
    "timeline": [
      {
        "status": "Draft",
        "date": "2025-12-01T08:00:00.000Z",
        "completed": true
      },
      {
        "status": "In Review",
        "date": "2025-12-04T10:30:00.000Z",
        "completed": true
      },
      {
        "status": "Changes Requested",
        "date": "2025-12-05T16:00:00.000Z",
        "completed": true,
        "changes": [
          {
            "id": "507f1f77bcf86cd799439013",
            "change": "Fix game crash on level 3",
            "priority": "Critical",
            "category": "Functionality",
            "resolved": false,
            "resolvedAt": null
          },
          {
            "id": "507f1f77bcf86cd799439014",
            "change": "Improve loading performance",
            "priority": "Medium",
            "category": "Performance",
            "resolved": true,
            "resolvedAt": "2025-12-06T10:00:00.000Z"
          }
        ]
      }
    ],
    "submittedAt": "2025-12-04T10:30:00.000Z",
    "lastReviewedAt": "2025-12-05T16:00:00.000Z",
    "approvedAt": null,
    "publishedAt": null,
    "reviewerComments": "Great game overall! Please address the critical bug and consider the performance improvements.",
    "requestedChanges": [
      {
        "id": "507f1f77bcf86cd799439013",
        "change": "Fix game crash on level 3",
        "priority": "Critical",
        "category": "Functionality",
        "resolved": false,
        "resolvedAt": null
      },
      {
        "id": "507f1f77bcf86cd799439014",
        "change": "Improve loading performance",
        "priority": "Medium",
        "category": "Performance",
        "resolved": true,
        "resolvedAt": "2025-12-06T10:00:00.000Z"
      }
    ],
    "latestReview": {
      "id": "507f1f77bcf86cd799439015",
      "reviewType": "Initial Submission",
      "status": "Changes Requested",
      "allTestsPassed": false,
      "requestedChangesCount": 2,
      "criticalChangesCount": 1,
      "completedAt": "2025-12-05T16:00:00.000Z",
      "reviewDuration": 330
    }
  }
}
```

#### 2. Mark Change as Resolved

```
PUT /api/dev/games/:gameId/changes/:changeId/resolve
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Change marked as resolved",
  "allChangesResolved": false,
  "remainingChanges": 1
}
```

#### 3. Get All Developer Submissions

```
GET /api/dev/submissions?status=In Review
```

**Query Parameters:**
- `status` (optional): Filter by status

**Success Response (200):**
```json
{
  "success": true,
  "count": 3,
  "submissions": [
    {
      "id": "507f191e810c19729de860ea",
      "title": "Memory Challenge",
      "status": "In Review",
      "isLocked": true,
      "submittedAt": "2025-12-04T10:30:00.000Z",
      "lastReviewedAt": null,
      "approvedAt": null,
      "publishedAt": null,
      "pendingChanges": 0,
      "totalChanges": 0
    },
    {
      "id": "507f191e810c19729de860eb",
      "title": "Focus Flow",
      "status": "Changes Requested",
      "isLocked": false,
      "submittedAt": "2025-12-03T14:00:00.000Z",
      "lastReviewedAt": "2025-12-04T10:00:00.000Z",
      "approvedAt": null,
      "publishedAt": null,
      "pendingChanges": 2,
      "totalChanges": 3
    }
  ]
}
```

---

## Version Control & Revert

### Endpoints

#### 1. Get All Versions

```
GET /api/dev/games/:gameId/versions
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 5,
  "currentVersion": "1.0.2",
  "versions": [
    {
      "id": "507f1f77bcf86cd799439011",
      "versionNumber": "1.0.2",
      "versionTag": "stable",
      "status": "Approved",
      "isApproved": true,
      "isCurrentVersion": true,
      "isRevert": false,
      "createdAt": "2025-12-06T10:00:00.000Z",
      "createdBy": {
        "name": "John Developer",
        "email": "john@example.com"
      },
      "approvedAt": "2025-12-07T14:00:00.000Z",
      "approvedBy": {
        "name": "Admin User",
        "email": "admin@refocus.com"
      },
      "publishedAt": null,
      "changeLog": "Bug fixes and performance improvements",
      "changes": [
        {
          "type": "Bugfix",
          "description": "Fixed crash on level 3"
        },
        {
          "type": "Enhancement",
          "description": "Improved loading performance"
        }
      ],
      "canRevertTo": true,
      "totalSize": "15.2 MB"
    },
    {
      "id": "507f1f77bcf86cd799439010",
      "versionNumber": "1.0.1",
      "versionTag": "stable",
      "status": "Approved",
      "isApproved": true,
      "isCurrentVersion": false,
      "isRevert": false,
      "createdAt": "2025-12-05T10:00:00.000Z",
      "createdBy": {
        "name": "John Developer",
        "email": "john@example.com"
      },
      "approvedAt": "2025-12-05T18:00:00.000Z",
      "approvedBy": {
        "name": "Admin User",
        "email": "admin@refocus.com"
      },
      "publishedAt": "2025-12-05T19:00:00.000Z",
      "changeLog": "Initial release",
      "changes": [],
      "canRevertTo": true,
      "totalSize": "14.8 MB"
    }
  ]
}
```

#### 2. Get Version Details

```
GET /api/dev/games/:gameId/versions/:versionId
```

**Success Response (200):**
```json
{
  "success": true,
  "version": {
    "id": "507f1f77bcf86cd799439011",
    "versionNumber": "1.0.1",
    "versionTag": "stable",
    "status": "Approved",
    "isApproved": true,
    "isCurrentVersion": false,
    "isRevert": false,
    "snapshot": {
      "title": "Memory Challenge",
      "description": "Test your memory with this engaging game",
      "category": "memory",
      "difficulty": "medium",
      "gameUrl": "/uploads/games/memory-challenge-1234567890/index.html",
      "coverImageUrl": "/uploads/game-media/cover.jpg",
      "screenshots": [
        {
          "url": "/uploads/game-media/screenshot1.png",
          "fileName": "gameplay1.png",
          "dimensions": {
            "width": 1920,
            "height": 1080
          },
          "aspectRatio": "16:9"
        }
      ],
      "minPlayTime": 120,
      "maxPlayTime": 600,
      "avgPlayTime": 300,
      "tags": ["memory", "puzzle", "brain-training"]
    },
    "changeLog": "Initial release with core features",
    "changes": [
      {
        "type": "Feature",
        "description": "Added memory training mode"
      }
    ],
    "createdAt": "2025-12-05T10:00:00.000Z",
    "createdBy": {
      "name": "John Developer",
      "email": "john@example.com"
    },
    "approvedAt": "2025-12-05T18:00:00.000Z",
    "approvedBy": {
      "name": "Admin User",
      "email": "admin@refocus.com"
    },
    "canRevertTo": true,
    "totalSize": "14.8 MB"
  }
}
```

#### 3. Revert to Previous Version

```
POST /api/dev/games/:gameId/versions/:versionId/revert
Content-Type: application/json
```

**Request Body:**
```json
{
  "confirmation": "Memory Challenge"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Successfully reverted to version 1.0.1. Your game has been restored to its previous stable state.",
  "revert": {
    "newVersionNumber": "1.0.3",
    "revertedToVersion": "1.0.1",
    "revertedAt": "2025-12-07T10:00:00.000Z",
    "newStatus": "Draft",
    "isLocked": false,
    "snapshot": {
      "title": "Memory Challenge",
      "description": "Test your memory with this engaging game",
      "gameUrl": "/uploads/games/memory-challenge-1234567890/index.html",
      "screenshotCount": 3
    }
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Please confirm the revert by providing the exact game title",
  "required": "Set confirmation field to the exact game title"
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "Cannot revert version while game is locked during review"
}
```

#### 4. Compare Versions

```
GET /api/dev/games/:gameId/versions/compare?versionId1=507f1&versionId2=507f2
```

**Query Parameters:**
- `versionId1`: First version ID
- `versionId2`: Second version ID

**Success Response (200):**
```json
{
  "success": true,
  "comparison": {
    "version1": {
      "id": "507f1f77bcf86cd799439011",
      "versionNumber": "1.0.1",
      "createdAt": "2025-12-05T10:00:00.000Z",
      "status": "Approved"
    },
    "version2": {
      "id": "507f1f77bcf86cd799439012",
      "versionNumber": "1.0.2",
      "createdAt": "2025-12-06T10:00:00.000Z",
      "status": "Approved"
    },
    "differences": [
      {
        "field": "description",
        "oldValue": "Test your memory with this engaging game",
        "newValue": "Test your memory with this improved engaging game",
        "type": "modified"
      },
      {
        "field": "screenshots",
        "oldValue": "3 screenshots",
        "newValue": "4 screenshots",
        "type": "count_changed"
      },
      {
        "field": "screenshots",
        "type": "added",
        "value": ["/uploads/game-media/screenshot4.png"]
      }
    ],
    "hasChanges": true
  }
}
```

#### 5. Get Approval History

```
GET /api/dev/games/:gameId/versions/approval-history
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 2,
  "approvalHistory": [
    {
      "versionNumber": "1.0.2",
      "status": "Approved",
      "approvedAt": "2025-12-07T14:00:00.000Z",
      "approvedBy": {
        "name": "Admin User",
        "email": "admin@refocus.com"
      },
      "publishedAt": null,
      "changeLog": "Bug fixes and performance improvements",
      "isPublished": false
    },
    {
      "versionNumber": "1.0.1",
      "status": "Published",
      "approvedAt": "2025-12-05T18:00:00.000Z",
      "approvedBy": {
        "name": "Admin User",
        "email": "admin@refocus.com"
      },
      "publishedAt": "2025-12-05T19:00:00.000Z",
      "changeLog": "Initial release",
      "isPublished": true
    }
  ]
}
```

---

## Admin Review Management

### Endpoints

#### 1. Get Pending Reviews

```
GET /api/admin/reviews/pending
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 3,
  "games": [
    {
      "id": "507f191e810c19729de860ea",
      "title": "Memory Challenge",
      "developer": {
        "id": "507f191e810c19729de860ec",
        "name": "John Developer",
        "email": "john@example.com"
      },
      "submittedAt": "2025-12-04T10:30:00.000Z",
      "version": "1.0.0",
      "category": "memory"
    }
  ]
}
```

#### 2. Start Game Review

```
POST /api/admin/reviews/games/:gameId/start
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Review started successfully",
  "review": {
    "id": "507f1f77bcf86cd799439015",
    "gameId": "507f191e810c19729de860ea",
    "gameTitle": "Memory Challenge",
    "reviewType": "Initial Submission",
    "startedAt": "2025-12-05T10:00:00.000Z"
  }
}
```

#### 3. Submit Review Decision

```
POST /api/admin/reviews/games/:gameId/decision
Content-Type: application/json
```

**Request Body (Approve):**
```json
{
  "status": "Approved",
  "overallComments": "Excellent game! Well designed and no issues found.",
  "functionalityTest": {
    "passed": true,
    "comments": "All features work as expected"
  },
  "policyCompliance": {
    "passed": true,
    "comments": "Fully compliant with platform policies"
  },
  "contentReview": {
    "appropriate": true,
    "comments": "Content is appropriate for all ages"
  },
  "performanceTest": {
    "passed": true,
    "comments": "Great performance",
    "metrics": {
      "loadTime": 1200,
      "fps": 60,
      "memory": 45
    }
  },
  "uiuxEvaluation": {
    "passed": true,
    "comments": "Intuitive and user-friendly interface"
  }
}
```

**Request Body (Changes Requested):**
```json
{
  "status": "Changes Requested",
  "overallComments": "Good game but needs some improvements before approval.",
  "functionalityTest": {
    "passed": false,
    "comments": "Found a critical bug",
    "issues": [
      {
        "description": "Game crashes on level 3",
        "severity": "Critical"
      }
    ]
  },
  "policyCompliance": {
    "passed": true
  },
  "contentReview": {
    "appropriate": true
  },
  "performanceTest": {
    "passed": false,
    "comments": "Loading time is too long",
    "metrics": {
      "loadTime": 8500,
      "fps": 58,
      "memory": 120
    }
  },
  "requestedChanges": [
    {
      "change": "Fix game crash on level 3",
      "priority": "Critical",
      "category": "Functionality",
      "mustFix": true
    },
    {
      "change": "Optimize loading time to under 3 seconds",
      "priority": "High",
      "category": "Performance",
      "mustFix": true
    },
    {
      "change": "Add sound effects to improve engagement",
      "priority": "Low",
      "category": "UI/UX",
      "mustFix": false
    }
  ]
}
```

**Request Body (Rejected):**
```json
{
  "status": "Rejected",
  "overallComments": "Game does not meet platform standards.",
  "rejectionReason": "Game contains inappropriate content that violates platform policies. Additionally, multiple critical bugs make the game unplayable.",
  "policyCompliance": {
    "passed": false,
    "comments": "Violates content policy",
    "violations": [
      {
        "policy": "Content Guidelines",
        "description": "Contains violent imagery",
        "severity": "Critical"
      }
    ]
  }
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Game approved successfully",
  "review": {
    "id": "507f1f77bcf86cd799439015",
    "status": "Approved",
    "completedAt": "2025-12-05T16:00:00.000Z",
    "reviewDuration": 360
  },
  "game": {
    "id": "507f191e810c19729de860ea",
    "submissionStatus": "Approved",
    "isLocked": false
  }
}
```

---

## Example Workflows

### Complete Submission Workflow

```javascript
// Step 1: Upload cover image
const coverFormData = new FormData();
coverFormData.append('coverImage', coverImageFile);

await fetch(`/api/dev/games/${gameId}/media/cover`, {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: coverFormData
});

// Step 2: Upload screenshots
const screenshotsFormData = new FormData();
screenshotFiles.forEach(file => {
  screenshotsFormData.append('screenshots', file);
});

await fetch(`/api/dev/games/${gameId}/media/screenshots`, {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: screenshotsFormData
});

// Step 3: Submit game for review
const submissionResponse = await fetch(`/api/dev/games/${gameId}/submit`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    changeLog: "Initial release with core features",
    changes: [
      { type: "Feature", description: "Memory training mode" },
      { type: "Feature", description: "Scoring system" }
    ]
  })
});

// Step 4: Check submission status
const statusResponse = await fetch(`/api/dev/games/${gameId}/submission`, {
  method: 'GET',
  headers: { 'Authorization': `Bearer ${token}` }
});

const status = await statusResponse.json();
console.log('Current status:', status.submission.currentStatus);
```

### Handle Changes Requested

```javascript
// Step 1: Get submission status and review comments
const statusResponse = await fetch(`/api/dev/games/${gameId}/submission`, {
  method: 'GET',
  headers: { 'Authorization': `Bearer ${token}` }
});

const status = await statusResponse.json();
const requestedChanges = status.submission.requestedChanges;

// Step 2: Make required changes to the game (developer fixes issues)

// Step 3: Mark changes as resolved
for (const change of requestedChanges) {
  await fetch(`/api/dev/games/${gameId}/changes/${change.id}/resolve`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}` }
  });
}

// Step 4: Resubmit the game
await fetch(`/api/dev/games/${gameId}/resubmit`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    changeLog: "Fixed all requested issues: resolved crash bug, improved performance, added sound effects"
  })
});
```

### Revert to Previous Version

```javascript
// Step 1: Get all versions
const versionsResponse = await fetch(`/api/dev/games/${gameId}/versions`, {
  method: 'GET',
  headers: { 'Authorization': `Bearer ${token}` }
});

const versions = await versionsResponse.json();

// Step 2: Find the last approved version
const lastApproved = versions.versions.find(v =>
  v.isApproved && v.canRevertTo && !v.isCurrentVersion
);

// Step 3: Confirm revert
const revertResponse = await fetch(`/api/dev/games/${gameId}/versions/${lastApproved.id}/revert`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    confirmation: "Memory Challenge" // Exact game title for safety
  })
});

const result = await revertResponse.json();
console.log('Reverted to version:', result.revert.revertedToVersion);
console.log('New version number:', result.revert.newVersionNumber);
```

---

## Best Practices

### Media Upload
- Use high-quality images that showcase actual gameplay
- Ensure screenshots are clear and not blurry
- Cover image should be eye-catching and representative
- Follow aspect ratio guidelines for best compatibility

### Submission
- Complete all required fields before submitting
- Ensure license information is thorough and accurate
- Write clear, descriptive change logs
- Test the game thoroughly before submission

### Review Process
- Respond to reviewer comments promptly
- Mark changes as resolved only after fixing them
- Communicate with reviewers if clarification needed
- Keep track of critical vs optional changes

### Version Control
- Only revert to approved versions
- Always provide game title confirmation for safety
- Keep detailed change logs for each version
- Use version control for major updates or rollbacks

---

**Last Updated**: 2025-12-04
**API Version**: 1.0.0
