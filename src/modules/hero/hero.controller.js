import Hero from "./hero.model.js";
import catchAsync from "../../utils/catchAsync.js";
import ApiError from "../../utils/ApiError.js";
import cloudinary from "../../config/cloudinary.js";
import { uploadFilesToCloudinary } from "../product/product.service.js";

export const uploadHeroImage = catchAsync(async (req, res) => {
  const files = req.files;

  if (!files || files.length === 0) {
    throw new ApiError(400, "Please upload at least one image");
  }

  const uploadedMedia = await uploadFilesToCloudinary(files);
  
  // Get the current max order
  const highestOrderHero = await Hero.findOne().sort("-order");
  let startOrder = highestOrderHero ? highestOrderHero.order + 1 : 0;

  const heroDocs = uploadedMedia.map((media) => ({
    url: media.url,
    public_id: media.public_id,
    order: startOrder++
  }));

  const createdHeroes = await Hero.insertMany(heroDocs);

  res.status(201).json({
    success: true,
    message: "Hero images uploaded successfully",
    data: createdHeroes
  });
});

export const getHeroImages = catchAsync(async (req, res) => {
  const { isActive } = req.query;
  const query = {};
  
  if (isActive !== undefined) {
    query.isActive = isActive === "true";
  }

  const heroes = await Hero.find(query).sort({ order: 1 });

  res.json({
    success: true,
    count: heroes.length,
    data: heroes
  });
});

export const deleteHeroImage = catchAsync(async (req, res) => {
  const hero = await Hero.findById(req.params.id);

  if (!hero) {
    throw new ApiError(404, "Hero image not found");
  }

  // Delete from cloudinary
  await cloudinary.uploader.destroy(hero.public_id);

  await hero.deleteOne();

  res.json({
    success: true,
    message: "Hero image deleted"
  });
});

export const updateHeroOrder = catchAsync(async (req, res) => {
  const { orderedIds } = req.body; // Array of IDs in the new order

  if (!orderedIds || !Array.isArray(orderedIds)) {
    throw new ApiError(400, "Please provide an array of ordered IDs");
  }

  // Bulk update the order
  const bulkOps = orderedIds.map((id, index) => ({
    updateOne: {
      filter: { _id: id },
      update: { $set: { order: index } }
    }
  }));

  await Hero.bulkWrite(bulkOps);

  res.json({
    success: true,
    message: "Order updated successfully"
  });
});

export const toggleHeroStatus = catchAsync(async (req, res) => {
  const hero = await Hero.findById(req.params.id);

  if (!hero) {
    throw new ApiError(404, "Hero image not found");
  }

  hero.isActive = !hero.isActive;
  await hero.save();

  res.json({
    success: true,
    message: "Hero status toggled",
    data: hero
  });
});
