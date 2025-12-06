# 🌱 ReFocus – Digital Wellness & Focus Coaching Platform

**ReFocus** is a modern digital wellness web application designed to help students and professionals reduce distractions, stay focused, and build healthier screen habits.

With one account, users can:

- Run structured **focus sessions**
- Set **goals** and track **progress**
- Reflect on their habits via **surveys**
- (Optionally) Play **focus-supporting mini games**
- View insights about their productivity trends over time

Different roles (User, Coach, Admin, Developer) share the same platform while seeing tools tailored to their responsibilities.

---

## 🚀 Project Motivation

Many students and knowledge workers struggle with:

- Constant digital distractions  
- Lack of structure when studying or working  
- No visibility into how they actually spend focused time  

**ReFocus** aims to:

- Turn focus time into **visible progress**
- Help users **stay accountable** to their goals
- Give coaches and admins better tools for **monitoring** and **support**

It primarily serves:

- 🎓 **Students** who need a structured way to study and revise  
- 💼 **Professionals** who want to protect their deep work time  
- 🧠 **Coaches / Mentors** who monitor and support others’ focus habits  
- 🛠 **Developers / Admins** who manage content, tools, and configuration  

---

## 👥 Users & Roles

### 🧑‍💻 Regular Users (Learners / Individuals)
- Start **focus sessions** using different modes (Study, Deep Work, Reading, etc.)
- Set and update **personal goals**
- Complete **habit surveys** to reflect on their digital wellness
- Review **session history** and progress over time
- (Optional) Access **mini games** that support focus and cognitive breaks

### 🎓 Coaches / Mentors
- View summarized **session data** for their assigned users (future or current feature)
- Track consistency and progress trends
- Help students/users interpret their patterns and adjust their habits

### 🛡 Admins
- Manage **user accounts** (view, verify, or deactivate when needed)
- Access **admin dashboards** (via `/pages/admin`)
- Oversee global settings, content, and data integrity

### 🧪 Developers (Internal)
- Use internal **dev tools/pages** under `/pages/dev`
- Test new features, game integrations, and APIs
- Run verification endpoints for API and data sync health

---

## ✨ Key Features

- **Focused Work Sessions**  
  Clean, distraction-free timer interface to run structured focus blocks.

- **Custom Focus Modes**  
  Different modes (e.g., *Study*, *Deep Work*, *Reading*) to match the task type.

- **Goal Tracking**  
  Users can set and update focus goals that are stored and retrieved via the backend.

- **Surveys & Reflections**  
  Lightweight surveys help users reflect on their digital habits and mood.

- **Session History & Analytics**  
  Users see past sessions, duration, and trends to maintain consistency.

- **Mini Games (Focus Support)**  
  Optional games to improve attention and provide intentional, controlled breaks.

- **Role-Based Pages**  
  Distinct layouts and functionality for *User*, *Coach*, *Admin*, and *Dev*.

- **Responsive & Accessible UI**  
  Built with React, TypeScript, and Tailwind CSS for a smooth, modern experience.

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

## **Usage Instructions**

Once the application is running, users can begin interacting with the system through a simple and intuitive flow:

1. **Open the app** in the browser at the development URL (usually `http://localhost:5173`).
2. **Navigate to the Landing Page** to explore available focus options.
3. **Create an account or log in** to access personalized features.
4. **Select a focus mode** from the available options (e.g., Study, Deep Work).
5. **Start a focus session** using the built-in timer interface.
6. **Review session history** to track progress and maintain consistency over time.
7. **If you have access:**
      Visit Coach pages to view analytics for users.
      Visit Admin pages to manage users and configuration.
      Visit Dev pages for internal testing and feature previews.

---

## **⚙️ Setup & Installation**

Follow the steps below to install and run the ReFocus frontend successfully.

### **1. Prerequisites**
Make sure you have the following installed:
- **Node.js (LTS recommended)**  
- **npm** (included with Node.js)

This project was originally created using **pnpm**, but it can run with both **npm** and **pnpm**.  
Instructions for both package managers are provided below.

---

## **Option A — Using pnpm (Recommended)**

pnpm is the package manager used when generating the project.  
It guarantees full compatibility with the existing lockfile.

### **Install pnpm:**
```bash
npm install -g pnpm
pnpm install
pnpm dev
```
## **Option B — Using npm (If you prefer not to install pnpm)**

When using npm, some dev dependencies (like Vite) may not install automatically due to the project’s original pnpm configuration.
If you encounter the error:
```bash
sh: vite: command not found
```
follow the steps below:
1. Install dependencies:
```bash
npm install
```
2. Install Vite manually (required for npm users):
```bash
npm install vite --save-dev
```
4. Run the development server:
```bash
npm run dev
```
After running the dev server, the application will be available at:

http://localhost:5173/

---

# 📡 API Documentation (Backend – Examples)


## 🔐 POST `/api/auth/login` (Sign In)

Authenticates a user and returns a JWT token.

- **Method:** `POST`  
- **URL:** `http://localhost:7000/api/auth/register`

### Request Body

```json
{
  "name": "user",
  "email": "user@example.com",
  "password": "Password123"
}
```

### Success Response (example) 
```json
{  "success":true,
    "message":"Registration successful. Please check your email to verify your account.",
    "user":{"id":"69347ffaf3cb519b4ef4705b",
          "name":"user",
          "email":"user@example.com",
          "isEmailVerified":false}}
```

## 🔐 POST `/api/auth/login`

Authenticates a user and returns a JWT token.

- **Method:** `POST`  
- **URL:** `http://localhost:7000/api/auth/login`

### Request Body

```json
{
  "email": "user@example.com",
  "password": "Password123"
}
```

### Success Response (example)
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

Use this token in Postman or the frontend as:
```bash
Authorization: Bearer <token>
```


#**🎨 Design & Prototyping**
### Figma Wireframes / UI Design
**Figma Wireframes ➜** [ReFocus UI] (https://www.figma.com/design/7a8aJs0gj2oPBG6WoVBQzj/html.to.design-%E2%80%94-by-%E2%80%B9div%E2%80%BARIOTS-%E2%80%94-Import-websites-to-Figma-designs--web-html-css---Community-?node-id=0-1&t=O8KNmJMMLicLffNT-1)


## ReFocus Project: Tech Stack & Dependencies 💻

ReFocus is built using a modern React-based frontend stack to ensure fast performance and a clean developer experience.

### Frameworks & Core Tools 🛠️

- **React + TypeScript** ⚛️ — Core framework for building the user interface.  
- **Vite** ⚡ — Development server and bundler used to run and build the project.  
- **Tailwind CSS** 🌬️ — Utility-first CSS framework used for styling and layout.  

### Additional Dependencies ✨

- **lucide-react** 🖼️ — Icon library used throughout the UI.  
- **sonner** 🔔 — Lightweight toast notification system.  
- **tailwind-merge** 🧩 — Utility for merging Tailwind classes.  
- **class-variance-authority (cva)** 🎨 — For building reusable UI component variants.  
- **localStorage (native)** 🔒 — Used through `AuthContext` to manage session data on the frontend.  

These libraries collectively support a clean workflow, reusable components, and a responsive user interface. ✅

---

## Team Members & Roles 🧑‍💻👩‍💻

This project was developed collaboratively by the following team members. Each member contributed to specific areas of the application's design, development, and documentation.

| Team Member        | Core Contribution                               | Emoji Focus |
|--------------------|--------------------------------------------------|------------|
| **Aleen Alghamdi** | Page Development, UI Enhancements               | ✨         |
| **Khawla Al-Malki**| Frontend Development, Application Structure     | 🏗️        |
| **Raghad Almaghrabi** | State Management, Contexts & Hooks           | 🧠        |
| **Shahad Alhassan**| Styling, User Experience Flow                   | 💅         |

These libraries collectively support a clean workflow, reusable components, and a responsive user interface.

