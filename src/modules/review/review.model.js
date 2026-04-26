import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true
    },
    designation: {
      type: String,
      required: [true, "Designation is required"],
      trim: true
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: 1,
      max: 5,
      default: 5
    },
    comment: {
      type: String,
      required: [true, "Comment is required"]
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    }
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);
export default Review;
