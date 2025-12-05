# Game Upload API Documentation

## Overview

The Game Upload API allows developers to upload, manage, and replace game files on the ReFocus platform. This system supports ZIP archives, HTML files, and JavaScript files with automatic extraction and processing.

---

## Table of Contents

1. [Authentication](#authentication)
2. [Upload Requirements](#upload-requirements)
3. [API Endpoints](#api-endpoints)
4. [File Processing](#file-processing)
5. [Error Handling](#error-handling)
6. [Example Requests](#example-requests)

---

## Authentication

All upload endpoints require:
- **Authentication**: Valid JWT token in Authorization header
- **Role**: Developer role (isDeveloper middleware)

```
Authorization: Bearer <jwt_token>
```

---

## Upload Requirements

### Supported File Formats

#### Game Files
- **ZIP**: Compressed game archives (auto-extracted)
- **HTML**: Single HTML game files
- **JS**: JavaScript game files

#### Asset Files
- **Images**: JPG, JPEG, PNG, GIF
- **Usage**: Thumbnails and cover images

### File Size Limits

- **Game Files**: 200 MB maximum
- **Asset Files**: 5 MB maximum

### ZIP Structure Requirements

When uploading a ZIP file, it must contain:
- An `index.html` file (primary entry point), OR
- Any `.html` file that will serve as the game entry point

**Recommended ZIP Structure:**
```
my-game.zip/
├── index.html          # Main game file (required)
├── assets/             # Game assets folder
│   ├── images/
│   │   ├── background.jpg
│   │   └── sprites.png
│   ├── sounds/
│   │   └── music.mp3
│   └── fonts/
├── js/                 # JavaScript files
│   ├── game.js
│   └── utils.js
└── css/                # Stylesheets
    └── style.css
```

### Validation Rules

#### Required Fields
- **title**: String, 1-200 characters
- **description**: String, 1-2000 characters

#### Optional Fields
- **shortDescription**: String, up to 500 characters
- **category**: Enum (focus, memory, puzzle, relaxation, creativity, strategy, reflex, other)
- **difficulty**: Enum (easy, medium, hard)
- **thumbnailUrl**: String (URL or uploaded file)
- **coverImageUrl**: String (URL or uploaded file)
- **isPublic**: Boolean (default: true)
- **isActive**: Boolean (default: true)
- **isFeatured**: Boolean (default: false)
- **isPremium**: Boolean (default: false)
- **minPlayTime**: Number (seconds, default: 60)
- **maxPlayTime**: Number (seconds, default: 600)
- **avgPlayTime**: Number (seconds, default: 180)
- **tags**: Array of strings
- **version**: String (default: '1.0.0')

---

## API Endpoints

### 1. Get Upload Requirements

Get detailed information about upload requirements, file formats, and validation rules.

**Endpoint:** `GET /api/dev/games/upload-requirements`

**Response:**
```json
{
  "success": true,
  "requirements": {
    "fileFormats": {
      "gameFiles": ["ZIP", "HTML", "JS"],
      "images": ["JPG", "JPEG", "PNG", "GIF"]
    },
    "maxFileSizes": {
      "gameFiles": "200MB",
      "images": "5MB"
    },
    "zipStructure": {
      "required": "Must contain index.html or any .html file as entry point",
      "recommended": [
        "index.html - Main game file",
        "assets/ - Folder for images, sounds, etc.",
        "js/ - JavaScript files",
        "css/ - Stylesheets"
      ]
    },
    "validationRules": {
      "title": "Required, max 200 characters",
      "description": "Required, max 2000 characters",
      "category": "Must be one of: focus, memory, puzzle, relaxation, creativity, strategy, reflex, other",
      "difficulty": "Must be one of: easy, medium, hard"
    }
  }
}
```

---

### 2. Upload New Game with Files

Upload a new game to the platform with game files.

**Endpoint:** `POST /api/dev/games/upload`

**Content-Type:** `multipart/form-data`

**Form Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| gameFile | File | Yes | ZIP, HTML, or JS game file |
| title | String | Yes | Game title (max 200 chars) |
| description | String | Yes | Game description (max 2000 chars) |
| shortDescription | String | No | Brief description (max 500 chars) |
| category | String | No | Game category (default: 'focus') |
| difficulty | String | No | Difficulty level (default: 'medium') |
| thumbnailUrl | String | No | Thumbnail image URL |
| coverImageUrl | String | No | Cover image URL |
| isPublic | String | No | 'true' or 'false' (default: 'true') |
| isActive | String | No | 'true' or 'false' (default: 'true') |
| isFeatured | String | No | 'true' or 'false' (default: 'false') |
| isPremium | String | No | 'true' or 'false' (default: 'false') |
| minPlayTime | Number | No | Min play time in seconds (default: 60) |
| maxPlayTime | Number | No | Max play time in seconds (default: 600) |
| avgPlayTime | Number | No | Average play time in seconds (default: 180) |
| tags | String/Array | No | JSON array or comma-separated tags |
| version | String | No | Game version (default: '1.0.0') |

**Success Response (201):**
```json
{
  "success": true,
  "message": "Game uploaded and added successfully",
  "game": {
    "id": "507f1f77bcf86cd799439011",
    "title": "Memory Challenge",
    "description": "Test your memory with this engaging game",
    "category": "memory",
    "difficulty": "medium",
    "gameUrl": "/uploads/games/game-memory-challenge-1234567890/index.html",
    "isPublic": true,
    "isActive": true,
    "version": "1.0.0",
    "createdAt": "2025-12-04T10:30:00.000Z"
  },
  "uploadDetails": {
    "fileName": "game-memory-challenge-1234567890.zip",
    "fileSize": 5242880,
    "fileSizeFormatted": "5 MB",
    "fileType": ".zip",
    "extractedDirectory": "uploads/games/game-memory-challenge-1234567890",
    "uploadedAt": "2025-12-04T10:30:00.000Z"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    "Title is required",
    "Description must not exceed 2000 characters"
  ]
}
```

---

### 3. Replace Game Files

Replace the files of an existing game with new files.

**Endpoint:** `PUT /api/dev/games/:gameId/files`

**Content-Type:** `multipart/form-data`

**URL Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| gameId | String | Game ID to update |

**Form Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| gameFile | File | Yes | New ZIP, HTML, or JS game file |
| version | String | No | New version number |

**Success Response (200):**
```json
{
  "success": true,
  "message": "Game files replaced successfully",
  "game": {
    "id": "507f1f77bcf86cd799439011",
    "title": "Memory Challenge",
    "gameUrl": "/uploads/games/game-memory-challenge-9876543210/index.html",
    "version": "1.1.0",
    "updatedAt": "2025-12-04T11:00:00.000Z"
  },
  "uploadDetails": {
    "fileName": "game-memory-challenge-9876543210.zip",
    "fileSize": 5500000,
    "fileSizeFormatted": "5.25 MB",
    "fileType": ".zip",
    "extractedDirectory": "uploads/games/game-memory-challenge-9876543210",
    "uploadedAt": "2025-12-04T11:00:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Game not found or you don't have access"
}
```

---

### 4. Upload Game Assets

Upload or replace game assets (thumbnail or cover image).

**Endpoint:** `POST /api/dev/games/:gameId/assets`

**Content-Type:** `multipart/form-data`

**URL Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| gameId | String | Game ID to update |

**Form Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| assetFile | File | Yes | Image file (JPG, PNG, GIF) |
| assetType | String | Yes | 'thumbnail' or 'cover' |

**Success Response (200):**
```json
{
  "success": true,
  "message": "Game thumbnail uploaded successfully",
  "assetUrl": "/uploads/games/game-thumbnail-1234567890.jpg",
  "game": {
    "id": "507f1f77bcf86cd799439011",
    "thumbnailUrl": "/uploads/games/game-thumbnail-1234567890.jpg",
    "coverImageUrl": "/uploads/games/game-cover-9876543210.png"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Invalid asset type. Must be 'thumbnail' or 'cover'"
}
```

---

## File Processing

### ZIP File Extraction

When a ZIP file is uploaded:

1. **Validation**: File is checked against allowed MIME types and extensions
2. **Storage**: File is saved to `uploads/games/` with a unique filename
3. **Extraction**: ZIP contents are extracted to a subdirectory
4. **Entry Point Detection**: System searches for:
   - `index.html` (preferred)
   - Any `.html` file (fallback)
5. **Database Update**: Game record is created with the path to the entry point
6. **Cleanup**: Original ZIP file is retained for backup

### Direct HTML/JS Upload

For direct HTML or JS file uploads:

1. **Validation**: File is checked for allowed types
2. **Storage**: File is saved directly to `uploads/games/`
3. **Database Update**: Game record points directly to the file

### Asset Upload

For thumbnail and cover uploads:

1. **Old Asset Cleanup**: Previous asset file is deleted if it exists
2. **New Asset Storage**: New file is saved with unique name
3. **Database Update**: Game record is updated with new asset URL

---

## Error Handling

### Common Error Codes

| Status Code | Description |
|-------------|-------------|
| 400 | Bad Request - Validation error, missing file, or invalid data |
| 401 | Unauthorized - Missing or invalid JWT token |
| 403 | Forbidden - User doesn't have developer role |
| 404 | Not Found - Game doesn't exist or user doesn't own it |
| 500 | Server Error - File processing error or database issue |

### Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message",
  "errors": ["Validation error 1", "Validation error 2"]
}
```

### File Cleanup

On any error during upload:
- Uploaded files are automatically deleted
- No partial records are created in the database
- User receives clear error message

---

## Example Requests

### Example 1: Upload ZIP Game (cURL)

```bash
curl -X POST http://localhost:3000/api/dev/games/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "gameFile=@path/to/game.zip" \
  -F "title=Memory Challenge" \
  -F "description=Test your memory with this engaging puzzle game" \
  -F "category=memory" \
  -F "difficulty=medium" \
  -F "tags=[\"puzzle\", \"memory\", \"brain-training\"]" \
  -F "minPlayTime=120" \
  -F "maxPlayTime=600" \
  -F "avgPlayTime=300"
```

### Example 2: Upload HTML Game (JavaScript/Fetch)

```javascript
const uploadGame = async (gameFile, metadata) => {
  const formData = new FormData();
  formData.append('gameFile', gameFile);
  formData.append('title', metadata.title);
  formData.append('description', metadata.description);
  formData.append('category', metadata.category);
  formData.append('difficulty', metadata.difficulty);
  formData.append('tags', JSON.stringify(metadata.tags));

  const response = await fetch('http://localhost:3000/api/dev/games/upload', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  const result = await response.json();
  return result;
};

// Usage
const file = document.getElementById('gameFile').files[0];
const result = await uploadGame(file, {
  title: 'Focus Flow',
  description: 'A relaxing game to improve focus and concentration',
  category: 'focus',
  difficulty: 'easy',
  tags: ['relaxation', 'focus', 'mindfulness']
});
```

### Example 3: Replace Game Files (cURL)

```bash
curl -X PUT http://localhost:3000/api/dev/games/507f1f77bcf86cd799439011/files \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "gameFile=@path/to/updated-game.zip" \
  -F "version=1.1.0"
```

### Example 4: Upload Thumbnail (JavaScript/Fetch)

```javascript
const uploadThumbnail = async (gameId, thumbnailFile) => {
  const formData = new FormData();
  formData.append('assetFile', thumbnailFile);
  formData.append('assetType', 'thumbnail');

  const response = await fetch(`http://localhost:3000/api/dev/games/${gameId}/assets`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  return await response.json();
};

// Usage
const thumbnail = document.getElementById('thumbnail').files[0];
await uploadThumbnail('507f1f77bcf86cd799439011', thumbnail);
```

### Example 5: Get Upload Requirements (JavaScript/Fetch)

```javascript
const getRequirements = async () => {
  const response = await fetch('http://localhost:3000/api/dev/games/upload-requirements', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  return await response.json();
};

// Usage
const requirements = await getRequirements();
console.log('Max game file size:', requirements.requirements.maxFileSizes.gameFiles);
console.log('Supported formats:', requirements.requirements.fileFormats.gameFiles);
```

---

## Best Practices

### 1. File Preparation

- **Optimize Assets**: Compress images and audio before packaging
- **Test Locally**: Ensure game works with relative paths
- **Clean Structure**: Use organized folder structure for assets
- **Entry Point**: Always include an `index.html` file in ZIP archives

### 2. Metadata

- **Descriptive Titles**: Use clear, searchable game titles
- **Detailed Descriptions**: Provide comprehensive game descriptions
- **Accurate Tags**: Use relevant tags for better discoverability
- **Realistic Times**: Set accurate play time estimates

### 3. Version Management

- **Semantic Versioning**: Use semver format (1.0.0, 1.1.0, 2.0.0)
- **Increment on Updates**: Bump version when replacing files
- **Document Changes**: Keep track of what changed between versions

### 4. Error Handling

- **Validate Client-Side**: Check file size and type before upload
- **Handle Errors**: Display clear error messages to users
- **Retry Logic**: Implement retry for network failures
- **Progress Tracking**: Show upload progress for large files

### 5. Security

- **Token Management**: Store JWT tokens securely
- **File Validation**: Validate files on both client and server
- **User Permissions**: Verify user has developer role
- **Rate Limiting**: Implement rate limits to prevent abuse

---

## Troubleshooting

### Issue: "No HTML entry point found in ZIP file"

**Solution**: Ensure your ZIP contains at least one `.html` file, preferably named `index.html`.

### Issue: "File too large"

**Solution**: Game files must be under 200MB. Compress assets or split into multiple parts.

### Issue: "Game not found or you don't have access"

**Solution**: Verify you're using the correct game ID and that you're the game's developer.

### Issue: "Invalid file type"

**Solution**: Only ZIP, HTML, and JS files are accepted for game uploads. Check file extension and MIME type.

### Issue: "Validation error"

**Solution**: Check that title and description are provided and within character limits.

---

## Support

For additional help or to report issues:
- Review the API responses for detailed error messages
- Check file formats and sizes against requirements
- Verify authentication token is valid and user has developer role
- Consult the system logs for server-side errors

---

**Last Updated**: 2025-12-04
**API Version**: 1.0.0
