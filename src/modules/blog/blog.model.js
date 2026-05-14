import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      default: "Renish Pharmaceutical",
    },
    coverImage: {
      url: { type: String },
      public_id: { type: String },
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
