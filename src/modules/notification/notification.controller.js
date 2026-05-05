import Notification from "./notification.model.js";
import catchAsync from "../../utils/catchAsync.js";
import ApiError from "../../utils/ApiError.js";

export const getNotifications = catchAsync(async (req, res) => {
  const { limit = 20, unreadOnly = false } = req.query;
  const filter = unreadOnly === "true" ? { read: false } : {};

  const notifications = await Notification.find(filter)
    .sort("-createdAt")
    .limit(parseInt(limit));

  const unreadCount = await Notification.countDocuments({ read: false });

  res.status(200).json({
    status: "success",
    unreadCount,
    data: notifications
  });
});

export const markAsRead = catchAsync(async (req, res) => {
  const { id } = req.params;
  const notification = await Notification.findByIdAndUpdate(id, { read: true }, { new: true });
  
  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }

  res.status(200).json({
    status: "success",
    data: notification
  });
});

export const markAllAsRead = catchAsync(async (req, res) => {
  await Notification.updateMany({ read: false }, { read: true });

  res.status(200).json({
    status: "success",
    message: "All notifications marked as read"
  });
});

export const deleteNotification = catchAsync(async (req, res) => {
  const notification = await Notification.findByIdAndDelete(req.params.id);
  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }
  res.status(204).json({
    status: "success",
    data: null
  });
});
