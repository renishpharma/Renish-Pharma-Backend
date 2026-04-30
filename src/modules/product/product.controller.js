import Product from "./product.model.js";
import catchAsync from "../../utils/catchAsync.js";
import ApiError from "../../utils/ApiError.js";
import { uploadFilesToCloudinary } from "./product.service.js";
import cloudinary from "../../config/cloudinary.js";

export const createProduct = catchAsync(async (req, res) => {
  const files = req.files;

  const media = await uploadFilesToCloudinary(files);

  const product = await Product.create({
    ...req.body,
    media,
    createdBy: req.user._id
  });

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    data: product
  });
});

export const getProducts = catchAsync(async (req, res) => {
  const { search, category, status } = req.query;
  const query = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } }
    ];
  }
  if (category) query.category = category;
  if (status) query.status = status;
  if (req.query.featured !== undefined) query.featured = req.query.featured === 'true';

  const products = await Product.find(query).sort({ createdAt: -1 });

  res.json({
    success: true,
    count: products.length,
    data: products
  });
});

export const updateProduct = catchAsync(async (req, res) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const updateData = { ...req.body };

  // Handle new media if uploaded
  if (req.files && req.files.length > 0) {
    const newMedia = await uploadFilesToCloudinary(req.files);
    updateData.media = [...product.media, ...newMedia];
  }

  product = await Product.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true
  });

  res.json({
    success: true,
    message: "Product updated successfully",
    data: product
  });
});

export const getProductById = catchAsync(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  res.json({
    success: true,
    data: product
  });
});

export const removeProductMedia = catchAsync(async (req, res) => {
  const { id, publicId } = req.params;

  const product = await Product.findById(id);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const mediaItem = product.media.find(m => m.public_id === publicId);
  if (!mediaItem) {
    throw new ApiError(404, "Media not found");
  }

  // Delete from Cloudinary
  await cloudinary.uploader.destroy(mediaItem.public_id, {
    resource_type: mediaItem.type === "video" ? "video" : "image"
  });

  // Remove from product
  product.media = product.media.filter(m => m.public_id !== publicId);
  await product.save();

  res.json({
    success: true,
    message: "Media removed successfully",
    data: product
  });
});

export const deleteProduct = catchAsync(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // delete from cloudinary
  if (product.media && product.media.length > 0) {
    for (const file of product.media) {
      await cloudinary.uploader.destroy(file.public_id, {
        resource_type: file.type === "video" ? "video" : "image"
      });
    }
  }

  await product.deleteOne();

  res.json({
    success: true,
    message: "Product deleted"
  });
});