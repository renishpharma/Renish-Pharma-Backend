import express from "express";
import { protect, restrictTo } from "../../middleware/auth.middleware.js";
import upload from "../product/product.upload.js";
import validate from "../../middleware/validate.middleware.js";
import { createBlogSchema, updateBlogSchema } from "./blog.validation.js";
import {
  createBlog,
  getBlogs,
  getBlogBySlug,
  updateBlog,
  deleteBlog,
} from "./blog.controller.js";

const router = express.Router();

// Public routes
router.get("/", getBlogs);
router.get("/:slug", getBlogBySlug);

// Protected Admin Routes
router.use(protect);
router.use(restrictTo("admin", "manager"));

router.post("/", upload.single("coverImage"), validate(createBlogSchema), createBlog);
router.patch("/:id", upload.single("coverImage"), validate(updateBlogSchema), updateBlog);
router.delete("/:id", deleteBlog);

export default router;
