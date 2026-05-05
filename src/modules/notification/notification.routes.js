import express from "express";
import * as notificationController from "./notification.controller.js";
import { protect, restrictTo } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);
router.use(restrictTo("admin"));

router.get("/", notificationController.getNotifications);
router.patch("/mark-all-read", notificationController.markAllAsRead);
router.patch("/:id/read", notificationController.markAsRead);
router.delete("/:id", notificationController.deleteNotification);

export default router;
