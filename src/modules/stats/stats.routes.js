import express from "express";
import { getDashboardStats } from "./stats.controller.js";
import { protect, restrictTo } from "../../middleware/auth.middleware.js";

const router = express.Router();

// Only admins can see dashboard stats
router.get("/", protect, restrictTo("admin"), getDashboardStats);

export default router;
