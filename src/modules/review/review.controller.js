import Review from "./review.model.js";
import Notification from "../notification/notification.model.js";
import catchAsync from "../../utils/catchAsync.js";
import ApiError from "../../utils/ApiError.js";

export const submitReview = catchAsync(async (req, res) => {
  const review = await Review.create(req.body);

  // Trigger Notification
  await Notification.create({
    title: "New Review Submitted",
    message: `${review.name} (${review.designation}) has submitted a ${review.rating}-star review.`,
    type: "system",
    link: "/reviews"
  });

  res.status(201).json({
    status: "success",
    data: review
  });
});

export const getApprovedReviews = catchAsync(async (req, res) => {
  const reviews = await Review.find({ status: "approved" }).sort("-createdAt");
  res.status(200).json({
    status: "success",
    results: reviews.length,
    data: reviews
  });
});

export const getAllReviews = catchAsync(async (req, res) => {
  const { status } = req.query;
  const filter = status ? { status } : {};
  const reviews = await Review.find(filter).sort("-createdAt");
  res.status(200).json({
    status: "success",
    results: reviews.length,
    data: reviews
  });
});

export const updateReviewStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["approved", "rejected", "pending"].includes(status)) {
    throw new ApiError(400, "Invalid status");
  }

  const review = await Review.findByIdAndUpdate(id, { status }, { new: true });
  if (!review) throw new ApiError(404, "Review not found");

  res.status(200).json({
    status: "success",
    data: review
  });
});

export const deleteReview = catchAsync(async (req, res) => {
  const review = await Review.findByIdAndDelete(req.params.id);
  if (!review) throw new ApiError(404, "Review not found");
  res.status(204).json({
    status: "success",
    data: null
  });
});
