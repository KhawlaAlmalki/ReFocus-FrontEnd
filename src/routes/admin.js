// src/routes/admin.js
import express from "express";
import {
  getAllUsers,
  getUserDetails,
  updateUser,
  resetUserPassword,
  deactivateUser,
  activateUser,
  banUser,
  unbanUser,
  deleteUser,
  getSystemStats
} from "../controllers/adminController.js";
import auth from "../middleware/auth.js";
import { isAdmin } from "../middleware/roleCheck.js";

const router = express.Router();

// All admin routes require authentication and admin role
router.use(auth, isAdmin);

// System statistics
router.get("/stats", getSystemStats);

// User management
router.get("/users", getAllUsers);
router.get("/users/:userId", getUserDetails);
router.put("/users/:userId", updateUser);

// Password management
router.put("/users/:userId/reset-password", resetUserPassword);

// Account status management
router.put("/users/:userId/deactivate", deactivateUser);
router.put("/users/:userId/activate", activateUser);
router.put("/users/:userId/ban", banUser);
router.put("/users/:userId/unban", unbanUser);

// Permanent deletion
router.delete("/users/:userId", deleteUser);

export default router;