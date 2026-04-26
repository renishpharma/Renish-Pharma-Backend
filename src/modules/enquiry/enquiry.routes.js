import express from "express";
import * as enquiryController from "./enquiry.controller.js";
import { protect, restrictTo } from "../../middleware/auth.middleware.js";

const router = express.Router();

// Public route for lead capture
router.post("/submit", enquiryController.createEnquiry);

// Admin routes
router.use(protect);
router.use(restrictTo("admin"));

router.get("/", enquiryController.getAllEnquiries);
router.patch("/:id/status", enquiryController.updateEnquiryStatus);
router.delete("/:id", enquiryController.deleteEnquiry);

export default router;