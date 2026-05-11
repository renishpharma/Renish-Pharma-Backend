import express from "express";
import { protect, restrictTo } from "../../middleware/auth.middleware.js";
import upload from "../product/product.upload.js";
import {
  uploadHeroImage,
  getHeroImages,
  deleteHeroImage,
  updateHeroOrder,
  toggleHeroStatus
} from "./hero.controller.js";

const router = express.Router();

// Public route
router.get("/", getHeroImages);

// Protected Admin Routes
router.use(protect);
router.use(restrictTo("admin", "manager"));

router.post("/", upload.fields([
  { name: "desktop", maxCount: 1 },
  { name: "tablet", maxCount: 1 },
  { name: "mobile", maxCount: 1 }
]), uploadHeroImage);
router.patch("/reorder", updateHeroOrder);
router.patch("/:id/status", toggleHeroStatus);
router.delete("/:id", deleteHeroImage);

export default router;
