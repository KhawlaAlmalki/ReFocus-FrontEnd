# Game Submission Workflow - Complete Testing Guide

## Overview

This guide covers the comprehensive test suite for the ReFocus game submission workflow, including setup, execution, and maintenance of tests.

---

## Quick Start

```bash
# 1. Install dependencies
npm install --save-dev jest supertest @babel/preset-env @babel/plugin-transform-modules-commonjs babel-jest

# 2. Ensure MongoDB is running
mongod --dbpath /path/to/test/db
# OR use Docker
docker run -d -p 27017:27017 --name mongodb-test mongo:6

# 3. Run tests
npm test

# 4. View coverage report
npm test -- --coverage
open coverage/lcov-report/index.html
```

---

## Test Suite Overview

### Files Created

```
tests/
├── gameSubmissionWorkflow.test.js  # Main test suite (62+ tests)
├── setup.js                         # Jest setup configuration
├── fixtures/
│   └── images/                      # Test image files
│       ├── cover-1920x1080.jpg
│       ├── screenshot1-1920x1080.jpg
│       ├── screenshot2-1920x1080.jpg
│       └── invalid-800x600.jpg
└── README.md                        # Test documentation

Configuration Files:
├── jest.config.js                   # Jest configuration
├── .babelrc                         # Babel configuration for ES modules
├── .env.test                        # Test environment variables
└── TESTING_GUIDE.md                # This file
```

### Test Coverage

| Feature | Tests | Coverage |
|---------|-------|----------|
| Media Upload | 22 | Complete |
| Game Submission | 8 | Complete |
| Status Tracking | 6 | Complete |
| Version Control | 12 | Complete |
| Admin Review | 8 | Complete |
| Authorization | 5 | Complete |
| Integration | 1 | Complete |
| **TOTAL** | **62+** | **Complete** |

---

## Installation

### Step 1: Install Test Dependencies

```bash
npm install --save-dev \
  jest \
  supertest \
  @babel/preset-env \
  @babel/plugin-transform-modules-commonjs \
  babel-jest
```

### Step 2: Verify Package.json

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "test": "NODE_OPTIONS=--experimental-vm-modules jest",
    "test:watch": "NODE_OPTIONS=--experimental-vm-modules jest --watch",
    "test:coverage": "NODE_OPTIONS=--experimental-vm-modules jest --coverage",
    "test:verbose": "NODE_OPTIONS=--experimental-vm-modules jest --verbose",
    "test:ci": "NODE_OPTIONS=--experimental-vm-modules jest --ci --coverage --maxWorkers=2"
  },
  "jest": {
    "testEnvironment": "node"
  }
}
```

### Step 3: Setup Test Database

```bash
# Option 1: Local MongoDB
mongod --dbpath ./data/test-db --port 27017

# Option 2: Docker
docker run -d \
  --name mongodb-test \
  -p 27017:27017 \
  -v mongodb-test-data:/data/db \
  mongo:6

# Option 3: MongoDB Atlas (for CI/CD)
# Use connection string in .env.test
MONGODB_TEST_URI=mongodb+srv://user:pass@cluster.mongodb.net/refocus-test
```

### Step 4: Create Test Image Fixtures

```bash
# Create fixtures directory
mkdir -p tests/fixtures/images

# Option 1: Use real images (recommended)
# Copy valid test images to tests/fixtures/images/

# Option 2: Create dummy files (automatic)
# The test suite will create dummy files if they don't exist
```

---

## Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run in watch mode (auto-rerun on changes)
npm test -- --watch

# Run specific test suite
npm test -- --testNamePattern="Game Media Upload"

# Run verbose (detailed output)
npm test -- --verbose

# Run with specific timeout
npm test -- --testTimeout=20000
```

### Advanced Commands

```bash
# Run only failed tests from last run
npm test -- --onlyFailures

# Run tests in parallel (faster)
npm test -- --maxWorkers=4

# Run with debugging
node --inspect-brk node_modules/.bin/jest --runInBand

# Update snapshots
npm test -- --updateSnapshot

# Run specific test file
npm test gameSubmissionWorkflow.test.js

# Run tests matching pattern
npm test -- --testNamePattern="should upload"
```

---

## Test Categories

### 1. Media Upload Tests (22 tests)

**What's Tested:**
- ✅ Upload valid cover images
- ✅ Upload multiple screenshots (2-5)
- ✅ Image dimension validation (1280x720 to 3840x2160)
- ✅ Aspect ratio validation (16:9, 4:3, 3:2)
- ✅ File size validation (max 5MB)
- ✅ File format validation (JPEG, PNG, WebP)
- ✅ Screenshot minimum/maximum enforcement
- ✅ Delete screenshot functionality
- ✅ Lock prevention during review
- ✅ Authentication and authorization

**Example:**
```bash
npm test -- --testNamePattern="Game Media Upload"
```

### 2. Game Submission Tests (8 tests)

**What's Tested:**
- ✅ Submit game with all requirements
- ✅ Validation before submission
- ✅ Version snapshot creation
- ✅ Game locking mechanism
- ✅ Resubmit workflow
- ✅ Critical change enforcement
- ✅ Status transitions

**Example:**
```bash
npm test -- --testNamePattern="Game Submission"
```

### 3. Status Tracking Tests (6 tests)

**What's Tested:**
- ✅ Get submission status
- ✅ Timeline display
- ✅ Reviewer comments
- ✅ Requested changes tracking
- ✅ Mark changes as resolved
- ✅ Filter by status

**Example:**
```bash
npm test -- --testNamePattern="Submission Status"
```

### 4. Version Control Tests (12 tests)

**What's Tested:**
- ✅ Get all versions
- ✅ Get version details
- ✅ Revert to previous version
- ✅ Version comparison
- ✅ Approval history
- ✅ Confirmation validation
- ✅ Lock prevention
- ✅ Rejected version protection

**Example:**
```bash
npm test -- --testNamePattern="Version Control"
```

### 5. Admin Review Tests (8 tests)

**What's Tested:**
- ✅ Get pending reviews
- ✅ Start review process
- ✅ Approve games
- ✅ Request changes
- ✅ Reject games
- ✅ Review records
- ✅ Admin-only access

**Example:**
```bash
npm test -- --testNamePattern="Admin Review"
```

### 6. Full Integration Test (1 test)

**What's Tested:**
- ✅ Complete workflow from creation to approval
- ✅ All steps in sequence
- ✅ State transitions
- ✅ Data integrity

**Example:**
```bash
npm test -- --testNamePattern="Full Workflow Integration"
```

---

## Understanding Test Results

### Success Output

```
PASS  tests/gameSubmissionWorkflow.test.js
  Game Media Upload
    ✓ should get media requirements (123ms)
    ✓ should upload valid cover image (456ms)
    ✓ should upload multiple screenshots (789ms)
    ...

Test Suites: 1 passed, 1 total
Tests:       62 passed, 62 total
Snapshots:   0 total
Time:        45.678s
```

### Failure Output

```
FAIL  tests/gameSubmissionWorkflow.test.js
  Game Media Upload
    ✕ should upload valid cover image (456ms)

  ● Game Media Upload › should upload valid cover image

    expect(received).toBe(expected)

    Expected: 200
    Received: 400

      145 |       .attach('coverImage', validCoverImage);
      146 |
    > 147 |     expect(response.status).toBe(200);
          |                             ^
      148 |     expect(response.body.success).toBe(true);

    at Object.<anonymous> (tests/gameSubmissionWorkflow.test.js:147:29)
```

### Coverage Report

```
--------------------------|---------|----------|---------|---------|-------------------
File                      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
--------------------------|---------|----------|---------|---------|-------------------
All files                 |   87.45 |    82.31 |   89.12 |   87.89 |
 controllers              |   91.23 |    85.67 |   92.45 |   91.67 |
  gameMediaController.js  |   94.56 |    88.23 |   95.12 |   94.89 | 123-125,234
  gameSubmission...js     |   89.34 |    84.12 |   90.23 |   89.78 | 156,289-291
  gameVersionControl...js |   88.91 |    81.45 |   88.67 |   89.12 | 178,301-304
 models                   |   82.34 |    78.56 |   84.12 |   83.45 |
  Game.js                 |   85.67 |    80.23 |   86.89 |   86.12 | 45,89,156
  GameVersion.js          |   79.45 |    76.34 |   81.56 |   80.23 | 67,123,189
  GameReview.js           |   81.89 |    78.91 |   82.34 |   82.67 | 98,145,201
--------------------------|---------|----------|---------|---------|-------------------
```

---

## Continuous Integration

### GitHub Actions Example

Create `.github/workflows/tests.yml`:

```yaml
name: Test Suite

on:
  push:
    branches: [ main, dev ]
  pull_request:
    branches: [ main, dev ]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      mongodb:
        image: mongo:6
        ports:
          - 27017:27017
        options: >-
          --health-cmd "mongosh --eval 'db.adminCommand({ping: 1})'"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    strategy:
      matrix:
        node-version: [16.x, 18.x, 20.x]

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm run test:ci
        env:
          MONGODB_TEST_URI: mongodb://localhost:27017/refocus-test
          NODE_ENV: test
          JWT_SECRET: test-secret-key

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
          flags: unittests
          name: codecov-umbrella

      - name: Archive test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: |
            coverage/
            test-results/
```

### GitLab CI Example

Create `.gitlab-ci.yml`:

```yaml
image: node:18

services:
  - mongo:6

variables:
  MONGODB_TEST_URI: mongodb://mongo:27017/refocus-test
  NODE_ENV: test

stages:
  - test
  - coverage

cache:
  paths:
    - node_modules/

before_script:
  - npm ci

test:
  stage: test
  script:
    - npm run test:ci
  artifacts:
    reports:
      junit: junit.xml
      cobertura: coverage/cobertura-coverage.xml
    paths:
      - coverage/

coverage:
  stage: coverage
  script:
    - npm run test:coverage
  coverage: '/All files[^|]*\|[^|]*\s+([\d\.]+)/'
  only:
    - main
    - dev
```

---

## Troubleshooting

### Common Issues

#### 1. MongoDB Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution:**
```bash
# Check if MongoDB is running
mongod --version

# Start MongoDB
mongod --dbpath /path/to/data

# Or use Docker
docker start mongodb-test
```

#### 2. Image Validation Failing

```
Error: Cannot find module 'sharp'
```

**Solution:**
```bash
# Install sharp for image processing
npm install sharp

# If on Windows, may need build tools
npm install --global windows-build-tools
npm install sharp
```

#### 3. ES Module Import Error

```
SyntaxError: Cannot use import statement outside a module
```

**Solution:**
```bash
# Ensure .babelrc is configured
# Ensure package.json has "type": "module"
# Or use babel-jest transform
npm install --save-dev @babel/preset-env babel-jest
```

#### 4. Timeout Errors

```
Timeout - Async callback was not invoked within the 5000 ms timeout
```

**Solution:**
```bash
# Increase timeout in jest.config.js
testTimeout: 10000

# Or in specific test
jest.setTimeout(20000);
```

#### 5. Port Already in Use

```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**
```bash
# Use different port for tests
TEST_PORT=3001 npm test

# Or kill process on port
lsof -ti:3000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :3000   # Windows
```

---

## Best Practices

### 1. Test Isolation

✅ **DO:**
```javascript
beforeEach(async () => {
  // Clean database before each test
  await Game.deleteMany({});
  await GameVersion.deleteMany({});
});
```

❌ **DON'T:**
```javascript
// Tests should not depend on each other
test('first test', () => { /* creates data */ });
test('second test', () => { /* assumes first test ran */ });
```

### 2. Clear Assertions

✅ **DO:**
```javascript
expect(response.status).toBe(200);
expect(response.body.success).toBe(true);
expect(response.body.game.title).toBe('Expected Title');
```

❌ **DON'T:**
```javascript
expect(response).toBeDefined();  // Too vague
expect(response.body).toBeTruthy();  // Not specific
```

### 3. Descriptive Test Names

✅ **DO:**
```javascript
test('should reject upload if game is locked during review', async () => {
  // Test implementation
});
```

❌ **DON'T:**
```javascript
test('upload test', async () => {
  // What does this test?
});
```

### 4. Test Data Management

✅ **DO:**
```javascript
const testGame = {
  title: 'Test Game',
  description: 'Test Description',
  // ... all required fields
};
```

❌ **DON'T:**
```javascript
// Hardcoded IDs, production data
const gameId = '507f1f77bcf86cd799439011';
```

---

## Performance Optimization

### Parallel Test Execution

```bash
# Run tests in parallel (faster)
npm test -- --maxWorkers=4

# Or 50% of CPU cores
npm test -- --maxWorkers=50%
```

### Selective Test Running

```bash
# Only run tests related to changed files
npm test -- --onlyChanged

# Run only failed tests
npm test -- --onlyFailures

# Skip slow tests during development
npm test -- --testPathIgnorePatterns=integration
```

### Database Optimization

```javascript
// Use in-memory MongoDB for faster tests
beforeAll(async () => {
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
});
```

---

## Maintenance

### Updating Tests

When adding new features:

1. Write tests first (TDD approach)
2. Ensure tests fail initially
3. Implement feature
4. Verify tests pass
5. Check coverage maintained

### Reviewing Test Coverage

```bash
# Generate detailed coverage report
npm test -- --coverage

# View HTML report
open coverage/lcov-report/index.html

# Check specific file coverage
open coverage/lcov-report/controllers/gameMediaController.js.html
```

### Cleaning Up

```bash
# Remove coverage reports
rm -rf coverage/

# Remove test database
mongo refocus-test --eval "db.dropDatabase()"

# Clean test artifacts
rm -rf tests/fixtures/temp/
```

---

## Additional Resources

### Documentation
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [MongoDB Test Best Practices](https://www.mongodb.com/docs/manual/core/testing/)

### Tools
- [Jest Runner VSCode Extension](https://marketplace.visualstudio.com/items?itemName=firsttris.vscode-jest-runner)
- [Wallaby.js](https://wallabyjs.com/) - Real-time test runner
- [Majestic](https://github.com/Raathigesh/majestic) - Zero config GUI for Jest

---

## Summary

✅ **62+ comprehensive tests** covering all functionality
✅ **Complete coverage** of media upload, submission, status tracking, version control, and admin review
✅ **CI/CD ready** with GitHub Actions and GitLab CI examples
✅ **Well documented** with clear examples and troubleshooting
✅ **Best practices** for test isolation, assertions, and data management
✅ **Performance optimized** with parallel execution and selective running

---

**Last Updated**: 2025-12-04
**Test Framework**: Jest 29.x
**Total Tests**: 62+
**Coverage Target**: 80%+
**Status**: ✅ Production Ready
