import express from "express";
import * as reviewController from "./review.controller.js";
import { protect, restrictTo } from "../../middleware/auth.middleware.js";

const router = express.Router();

// Public routes
router.post("/submit", reviewController.submitReview);
router.get("/approved", reviewController.getApprovedReviews);

// Admin routes
router.use(protect);
router.use(restrictTo("admin"));

router.get("/", reviewController.getAllReviews);
router.patch("/:id/status", reviewController.updateReviewStatus);
router.delete("/:id", reviewController.deleteReview);

export default router;
