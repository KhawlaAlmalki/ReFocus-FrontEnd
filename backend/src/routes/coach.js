// src/routes/coach.js
import express from "express";
import {
  applyToBeCoach,
  getMyApplication,
  getAllApplications,
  approveApplication,
  rejectApplication,
  getAllCoachProfiles,
  getCoachProfile,
  getMyCoachProfile,
  updateMyCoachProfile
} from "../controllers/coachController.js";
import auth from "../middleware/auth.js";
import { isAdmin } from "../middleware/roleCheck.js";

const router = express.Router();

// ===== PUBLIC ROUTES =====
// Get all public coach profiles
router.get("/profiles", getAllCoachProfiles);

// Get specific coach profile
router.get("/profile/:coachId", getCoachProfile);

// ===== USER ROUTES (Authenticated) =====
// Apply to become a coach
router.post("/apply", auth, applyToBeCoach);

// Get my coach application status
router.get("/my-application", auth, getMyApplication);

// Get my coach profile (coach only)
router.get("/my-profile", auth, getMyCoachProfile);

// Update my coach profile (coach only)
router.put("/my-profile", auth, updateMyCoachProfile);

// ===== ADMIN ROUTES =====
// Get all applications (admin only)
router.get("/applications", auth, isAdmin, getAllApplications);

// Approve application (admin only)
router.put("/applications/:applicationId/approve", auth, isAdmin, approveApplication);

// Reject application (admin only)
router.put("/applications/:applicationId/reject", auth, isAdmin, rejectApplication);

export default router;