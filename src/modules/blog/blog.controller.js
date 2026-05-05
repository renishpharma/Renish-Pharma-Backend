import Blog from "./blog.model.js";
import Notification from "../notification/notification.model.js";
import catchAsync from "../../utils/catchAsync.js";
import ApiError from "../../utils/ApiError.js";
import cloudinary from "../../config/cloudinary.js";

// Helper function to generate slug from title
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
};

export const createBlog = catchAsync(async (req, res) => {
  let { title, content, author, status, tags } = req.body;
  if (tags) {
    if (typeof tags === "string") {
      try {
        // Try to parse if it's a JSON stringified array
        tags = JSON.parse(tags);
      } catch (e) {
        // If not JSON, split by comma
        tags = tags.split(",").map(t => t.trim()).filter(Boolean);
      }
    }
    
    // If it's an array, ensure each element is a clean string (remove accidental brackets/quotes)
    if (Array.isArray(tags)) {
      tags = tags.flatMap(tag => {
        if (typeof tag === 'string' && (tag.startsWith('[') || tag.includes(','))) {
          try {
            const parsed = JSON.parse(tag);
            return Array.isArray(parsed) ? parsed : tag;
          } catch (e) {
            return tag.split(',').map(t => t.trim());
          }
        }
        return tag;
      }).map(t => typeof t === 'string' ? t.replace(/[\[\]"]/g, '').trim() : t).filter(Boolean);
    }
  }
  const file = req.file; // Assuming single file upload for cover image

  if (!title || !content) {
    throw new ApiError(400, "Title and content are required");
  }

  let slug = generateSlug(title);
  // Ensure slug uniqueness
  let existingBlog = await Blog.findOne({ slug });
  let counter = 1;
  while (existingBlog) {
    slug = `${generateSlug(title)}-${counter}`;
    existingBlog = await Blog.findOne({ slug });
    counter++;
  }

  let coverImage = {};

  if (file) {
    const base64 = file.buffer.toString("base64");
    const dataURI = `data:${file.mimetype};base64,${base64}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "renish_blogs",
      resource_type: "image",
    });

    coverImage = {
      url: result.secure_url,
      public_id: result.public_id,
    };
  }

  const blog = await Blog.create({
    title,
    slug,
    content,
    author: author || "Renish Pharmaceuticals",
    status,
    tags,
    ...(file && { coverImage }),
  });

  // Trigger Notification
  await Notification.create({
    title: "New Blog Post",
    message: `A new blog post "${blog.title}" has been published by ${blog.author}.`,
    type: "blog",
    link: "/blogs"
  });

  res.status(201).json({
    success: true,
    message: "Blog post created successfully",
    data: blog,
  });
});

export const getBlogs = catchAsync(async (req, res) => {
  const { status, limit = 10, page = 1 } = req.query;
  const query = {};

  if (status) query.status = status;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const blogs = await Blog.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Blog.countDocuments(query);

  res.json({
    success: true,
    count: blogs.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / parseInt(limit)),
    data: blogs,
  });
});

export const getBlogBySlug = catchAsync(async (req, res) => {
  const blog = await Blog.findOne({ slug: req.params.slug });

  if (!blog) {
    throw new ApiError(404, "Blog post not found");
  }

  res.json({
    success: true,
    data: blog,
  });
});

export const updateBlog = catchAsync(async (req, res) => {
  let { title, content, author, status, tags } = req.body;
  const file = req.file;

  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    throw new ApiError(404, "Blog post not found");
  }

  // Handle Tags
  if (tags !== undefined) {
    let processedTags = tags;
    if (typeof processedTags === "string") {
      try {
        processedTags = JSON.parse(processedTags);
      } catch (e) {
        processedTags = processedTags.split(",").map(t => t.trim()).filter(Boolean);
      }
    }

    if (Array.isArray(processedTags)) {
      processedTags = processedTags.flatMap(tag => {
        if (typeof tag === 'string' && (tag.startsWith('[') || tag.includes(','))) {
          try {
            const parsed = JSON.parse(tag);
            return Array.isArray(parsed) ? parsed : tag;
          } catch (e) {
            return tag.split(',').map(t => t.trim());
          }
        }
        return tag;
      }).map(t => typeof t === 'string' ? t.replace(/[\[\]"]/g, '').trim() : t).filter(Boolean);
    }
    blog.tags = processedTags;
  }

  // Update slug if title changes
  if (title && title !== blog.title) {
    let newSlug = generateSlug(title);
    let existingBlog = await Blog.findOne({ slug: newSlug, _id: { $ne: blog._id } });
    let counter = 1;
    while (existingBlog) {
      newSlug = `${generateSlug(title)}-${counter}`;
      existingBlog = await Blog.findOne({ slug: newSlug, _id: { $ne: blog._id } });
      counter++;
    }
    blog.slug = newSlug;
    blog.title = title;
  }

  if (content) blog.content = content;
  if (author !== undefined) blog.author = author || "Renish Pharmaceuticals";
  if (status) blog.status = status;

  if (file) {
    // Delete old cover image from cloudinary
    if (blog.coverImage?.public_id) {
      await cloudinary.uploader.destroy(blog.coverImage.public_id);
    }

    const base64 = file.buffer.toString("base64");
    const dataURI = `data:${file.mimetype};base64,${base64}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "renish_blogs",
      resource_type: "image",
    });

    blog.coverImage = {
      url: result.secure_url,
      public_id: result.public_id,
    };
  }

  await blog.save();

  res.json({
    success: true,
    message: "Blog post updated successfully",
    data: blog,
  });
});

export const deleteBlog = catchAsync(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    throw new ApiError(404, "Blog post not found");
  }

  // Delete from cloudinary
  if (blog.coverImage?.public_id) {
    await cloudinary.uploader.destroy(blog.coverImage.public_id);
  }

  await blog.deleteOne();

  res.json({
    success: true,
    message: "Blog post deleted successfully",
  });
});
