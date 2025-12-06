# 🌱 ReFocus

**Digital Wellness & Focus Coaching Platform**

A modern web application designed to help students and professionals reduce distractions, stay focused, and build healthier screen habits through structured focus sessions, goal tracking, and personalized insights.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [User Roles](#-user-roles)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Usage Guide](#-usage-guide)
- [Design Resources](#-design-resources)
- [Team](#-team)

---

## 🎯 Overview

### The Challenge

Many students and knowledge workers struggle with:
- Constant digital distractions
- Lack of structure when studying or working
- No visibility into how they actually spend focused time

### Our Solution

ReFocus transforms focus time into visible progress, helping users stay accountable while giving coaches and admins better tools for monitoring and support.

### Who It's For

- 🎓 **Students** — Structure study and revision sessions
- 💼 **Professionals** — Protect deep work time
- 🧠 **Coaches/Mentors** — Monitor and support focus habits
- 🛠 **Admins/Developers** — Manage content and configuration

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| **Focus Sessions** | Clean, distraction-free timer interface for structured work blocks |
| **Custom Modes** | Different modes (Study, Deep Work, Reading) to match task types |
| **Goal Tracking** | Set and update focus goals with backend persistence |
| **Surveys & Reflections** | Lightweight habit surveys for digital wellness insights |
| **Session Analytics** | View history, duration, and trends to maintain consistency |
| **Mini Games** | Optional games for attention improvement and controlled breaks |
| **Role-Based Access** | Distinct layouts for Users, Coaches, Admins, and Developers |
| **Modern UI** | Responsive, accessible interface built with React and Tailwind |

---

## 👥 User Roles

### 🧑‍💻 Regular Users (Learners/Individuals)

- Start focus sessions using different modes
- Set and update personal goals
- Complete habit surveys
- Review session history and progress
- Access optional focus-supporting mini games

### 🎓 Coaches/Mentors

- View summarized session data for assigned users
- Track consistency and progress trends
- Help users interpret patterns and adjust habits

### 🛡 Admins

- Manage user accounts (view, verify, deactivate)
- Access admin dashboards at `/pages/admin`
- Oversee global settings and data integrity

### 🧪 Developers

- Use internal dev tools at `/pages/dev`
- Test new features and API integrations
- Run verification endpoints for system health

---

## 💻 Tech Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| **React + TypeScript** | Core UI framework |
| **Vite** | Development server and bundler |
| **Tailwind CSS** | Utility-first styling |
| **lucide-react** | Icon library |
| **sonner** | Toast notifications |
| **tailwind-merge** | Class merging utility |
| **cva** | Component variants |

### Backend

| Technology | Purpose |
|------------|---------|
| **Node.js + Express** | Server framework |
| **MongoDB** | Database |
| **JWT** | Authentication |
| **Mongoose** | ODM for MongoDB |

---

## **🧱 Project Structure**
### Front End
The frontend is built with **React + TypeScript + Vite** using a modular structure:

```
refocus-frontend/
├─ src/
│  ├─ components/
│  ├─ contexts/
│  ├─ hooks/
│  ├─ lib/
│  ├─ pages/
│  │  ├─ admin/
│  │  ├─ app/
│  │  ├─ coach/
│  │  ├─ dev/
│  │  ├─ About.tsx
│  │  ├─ Index.tsx
│  │  ├─ Landing.tsx
│  │  ├─ Login.tsx
│  │  ├─ NotFound.tsx
│  │  ├─ Privacy.tsx
│  │  └─ Signup.tsx
│  ├─ utils/
│  ├─ App.tsx
│  ├─ global.css
│  └─ vite-env.d.ts
├─ .env.example
├─ .gitignore
├─ index.html
├─ package.json
├─ tailwind.config.ts
└─ vite.config.ts
```

### 🗄️ Back End
The backend is built with Node.js, Express, and MongoDB:

```bash
backend/
├─ server.js                # Main Express app entry
├─ package.json
├─ package-lock.json
├─ .env                     # Environment variables (not committed)
├─ test-auth.http           # VS Code REST client samples (auth)
├─ test-coach-profile.http  # VS Code REST client samples (coach)
├─ test-coach-verification.http
├─ node_modules/
└─ src/
   ├─ config/               # Configuration helpers (DB, etc.)
   │  └─ ...               
   ├─ controllers/          # Route handler logic (business logic)
   │  ├─ authController.js
   │  ├─ goalsController.js
   │  ├─ sessionsController.js
   │  ├─ surveyController.js
   │  ├─ gamesController.js
   │  └─ ...                # other controllers (admin, coach, etc.)
   ├─ middleware/           # Reusable middleware
   │  ├─ rateLimit.js       # Request rate limiting
   │  ├─ roleCheck.js       # Role / permission checks
   │  ├─ upload.js          # File upload handling
   │  └─ validation.js      # Validation helpers
   ├─ models/               # Mongoose models
   │  ├─ User.js
   │  ├─ Goal.js
   │  ├─ Session.js
   │  ├─ Survey.js
   │  ├─ Game.js
   │  └─ ...                # other domain models
   ├─ routes/               # API route definitions (mounted in server.js)
   │  ├─ admin.js
   │  ├─ audio.js
   │  ├─ auth.js
   │  ├─ badges.js
   │  ├─ challenge-templates.js
   │  ├─ challenges.js
   │  ├─ coach.js
   │  ├─ community.js
   │  ├─ dev.js
   │  ├─ game-submissions.js
   │  ├─ games.js
   │  ├─ goals.js
   │  ├─ licenses.js
   │  ├─ mentees.js
   │  ├─ messages.js
   │  ├─ moderation.js
   │  ├─ progress.js
   │  ├─ sessions.js
   │  ├─ survey.js
   │  └─ users.js
   └─ utils/                # Shared utility functions/helpers
      └─ ...

```

---

## 🚀 Getting Started

Follow the steps below to install and run the ReFocus project locally. 🧑‍💻

This project is organized as a monorepo with:
- `frontend/` → React + Vite app  
- `backend/` → Node.js + Express + MongoDB API  

Make sure you run the commands in the correct folder.

---

### 1️⃣ Prerequisites

Make sure you have the following installed:
- **Node.js (LTS recommended)**
- **npm** (included with Node.js)
- (Optional but recommended) **pnpm** for faster installs
- A **MongoDB database** (e.g., MongoDB Atlas connection string)

---

### 2️⃣ Frontend Setup (ReFocus UI) 🌐

From the project root:

1. **Go to the frontend folder:**
```bash
cd frontend
```

2. **Install dependencies:**

#### Option A: Using pnpm (Recommended)
```bash
# Install pnpm globally
npm install -g pnpm

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

#### Option B: Using npm
```bash
# Install dependencies
npm install

# Install Vite (if needed)
npm install vite --save-dev

# Start development server
npm run dev
```

3. **Access the Application**

Open your browser and navigate to:
http://localhost:5173

---

### 3️⃣ Backend Setup (API Server) 🗄️

From the project root:

1. **Go to the backend folder:**
```bash
cd backend
```

2. **Install backend dependencies:**
```bash
npm install
```

3. **Create a `.env` file** inside the `backend/` folder with the following variables (adjust values as needed):
```env
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-super-secret-key
PORT=7000
```

**Environment Variables Explained:**
- `MONGO_URI` → your MongoDB Atlas or local MongoDB connection string  
- `JWT_SECRET` → any random secret string used to sign JWTs  
- `PORT` → the port your backend should run on (default: `7000`)

4. **Start the backend server:**

If you have a dev script in `package.json` (e.g., `"dev": "nodemon server.js"`), use:
```bash
npm run dev
```

Otherwise, run:
```bash
node server.js
```

The backend API will be available at:
http://localhost:5050

---

### 4️⃣ Verifying Everything is Running ✅

- **Frontend:** Open in your browser at `http://localhost:5173`

- **Backend:** Test with a tool like Postman or curl:
  - `POST http://localhost:7000/api/auth/register`  
  - `POST http://localhost:7000/api/auth/login`  

Use the returned JWT token as:
Authorization: Bearer <token>

Once both frontend and backend are running successfully, you can log in from the UI and start using ReFocus! 🎉

---

## 📡 API Documentation

### Base URL
http://localhost:5050/api

### 🔑 Authentication

#### Register New User

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "name": "user",
  "email": "user@example.com",
  "password": "Password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful. Please check your email to verify your account.",
  "user": {
    "id": "69347ffaf3cb519b4ef4705b",
    "name": "user",
    "email": "user@example.com",
    "isEmailVerified": false
  }
}
```

#### Login

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "Password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR...",
  "user": {
    "id": "665f...",
    "name": "Raghad",
    "email": "user@example.com"
  }
}
```

### Using the Token

Include the token in subsequent requests:
```bash
Authorization: Bearer <token>
```

---

## 📖 Usage Guide

1. **Open the app** at `http://localhost:5173`
2. **Navigate** to the landing page to explore focus options
3. **Create an account** or log in to access personalized features
4. **Select a focus mode** (Study, Deep Work, Reading, etc.)
5. **Start a focus session** using the built-in timer
6. **Review session history** to track progress over time

### Role-Specific Access

- **Coaches** — Visit coach pages to view user analytics
- **Admins** — Access admin pages to manage users and settings
- **Developers** — Use dev pages for testing and feature previews

---

## 🎨 Design Resources

### Figma Wireframes

View our complete UI design and wireframes:

**[ReFocus UI Design on Figma →](https://www.figma.com/design/7a8aJs0gj2oPBG6WoVBQzj/html.to.design)**

---

## 👥 Team

This project was developed collaboratively by a dedicated team of developers, each contributing their unique expertise:

| Team Member  | Focus Area |
|--------------|------------|
| **Aleen Alghamdi** | Page Development & UI Enhancements ✨ |
| **Khawla Al-Malki** |  Application Structure & Architecture 🏗️ |
| **Raghad Almaghrabi** |  State Management & Contexts 🧠 |
| **Shahad Alhassan** | Styling & User Experience 💅 |


---

## 📚 Helpful Resources

* **[React Documentation](https://react.dev/)** — Official React docs and guides
* **[TypeScript Handbook](https://www.typescriptlang.org/docs/)** — Learn TypeScript fundamentals
* **[Vite Guide](https://vitejs.dev/guide/)** — Fast build tool documentation
* **[Tailwind CSS](https://tailwindcss.com/docs)** — Utility-first CSS framework
* **[Node.js Guides](https://nodejs.org/en/docs/)** — Server-side JavaScript runtime
* **[Express.js Documentation](https://expressjs.com/)** — Web framework for Node.js
* **[MongoDB Manual](https://www.mongodb.com/docs/manual/)** — NoSQL database documentation
* **[Mongoose Docs](https://mongoosejs.com/docs/)** — MongoDB object modeling
* **[JWT Introduction](https://jwt.io/introduction)** — JSON Web Tokens explained
* **[GitHub Getting Started](https://docs.github.com/en/get-started)** — Version control basics


