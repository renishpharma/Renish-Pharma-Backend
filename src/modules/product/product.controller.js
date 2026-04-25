import Product from "./product.model.js";
import catchAsync from "../../utils/catchAsync.js";
import ApiError from "../../utils/ApiError.js";
import { uploadFilesToCloudinary } from "./product.service.js";

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
  const products = await Product.find();

  res.json({
    success: true,
    count: products.length,
    data: products
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

export const deleteProduct = catchAsync(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // delete from cloudinary
  for (const file of product.media) {
    await cloudinary.uploader.destroy(file.public_id, {
      resource_type: file.type === "video" ? "video" : "image"
    });
  }

  await product.deleteOne();

  res.json({
    success: true,
    message: "Product deleted"
  });
});