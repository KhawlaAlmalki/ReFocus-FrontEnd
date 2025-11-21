# **ReFocus – Digital Wellness Web Application**

**ReFocus** is a streamlined and user-focused digital wellness application designed to help individuals reduce distractions, maintain concentration, and develop healthier screen habits.  
The platform offers structured focus modes, intuitive timers, and clear progress indicators that encourage consistency and support long-term productivity.  
Built with simplicity and clarity in mind, ReFocus enables users to stay on task with minimal friction and a clean, distraction-free interface.

## **Key Features**

- **Focused Work Sessions**  
  Clean, minimal timer interface designed to help users stay fully engaged during study or work periods.

- **Customizable Focus Modes**  
  Users can switch between different modes (e.g., study, deep work, reading) depending on their task.

- **Distraction Awareness**  
  Simple logging mechanism that helps users identify patterns in their distractions over time.

- **Session History Overview**  
  Users can view past sessions and track improvements in consistency and productivity.

- **Responsive & Accessible Interface**  
  Designed to work smoothly across devices with a clear, user-friendly layout.

## **Project Structure**

The project follows a clean and modular folder structure to keep components, pages, and logic organized and easy to maintain.
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
## **Usage Instructions**

Once the application is running, users can begin interacting with the system through a simple and intuitive flow:

1. **Open the app** in the browser at the development URL (usually `http://localhost:5173`).
2. **Navigate to the Landing Page** to explore available focus options.
3. **Create an account or log in** to access personalized features.
4. **Select a focus mode** from the available options (e.g., Study, Deep Work).
5. **Start a focus session** using the built-in timer interface.
6. **Review session history** to track progress and maintain consistency over time.

## **Team Members & Roles**

This project was developed collaboratively by the following team members. Each member contributed to specific areas of the application's design, development, and documentation.

- **Aleen Alghamdi** — Page Development, UI Enhancements
- **Khawla Al-Malki** — Frontend Development, Application Structure
- **Raghad Almaghrabi** — State Management, Contexts & Hooks
- **Shahad Alhassan** — Styling, User Experience Flow

## **Setup & Installation**

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

## **Tech Stack & Dependencies**

ReFocus is built using a modern React-based frontend stack to ensure fast performance and a clean developer experience.

### **Frameworks & Core Tools**
- **React + TypeScript** — Core framework for building the user interface.
- **Vite** — Development server and bundler used to run and build the project.
- **Tailwind CSS** — Utility-first CSS framework used for styling and layout.

### **Additional Dependencies**
- **lucide-react** — Icon library used throughout the UI.
- **sonner** — Lightweight toast notification system.
- **tailwind-merge** — Utility for merging Tailwind classes.
- **class-variance-authority (cva)** — For building reusable UI component variants.
- **localStorage (native)** — Used through `AuthContext` to manage session data on the frontend.

These libraries collectively support a clean workflow, reusable components, and a responsive user interface.

