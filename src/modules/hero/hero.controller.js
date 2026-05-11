import Hero from "./hero.model.js";
import catchAsync from "../../utils/catchAsync.js";
import ApiError from "../../utils/ApiError.js";
import cloudinary from "../../config/cloudinary.js";
import { uploadFilesToCloudinary } from "../product/product.service.js";

export const uploadHeroImage = catchAsync(async (req, res) => {
  const files = req.files;

  if (!files || !files.desktop) {
    throw new ApiError(400, "Please upload at least a desktop version of the image");
  }

  // Helper to upload a single field
  const uploadToCloudinary = async (field) => {
    if (!files[field] || files[field].length === 0) return null;
    const result = await uploadFilesToCloudinary(files[field]);
    return result[0]; // uploadFilesToCloudinary returns an array
  };

  const desktopMedia = await uploadToCloudinary("desktop");
  const tabletMedia = await uploadToCloudinary("tablet");
  const mobileMedia = await uploadToCloudinary("mobile");
  
  // Get the current max order
  const highestOrderHero = await Hero.findOne().sort("-order");
  let startOrder = highestOrderHero ? highestOrderHero.order + 1 : 0;

  const heroData = {
    desktop: { url: desktopMedia.url, public_id: desktopMedia.public_id },
    order: startOrder
  };

  if (tabletMedia) {
    heroData.tablet = { url: tabletMedia.url, public_id: tabletMedia.public_id };
  }
  if (mobileMedia) {
    heroData.mobile = { url: mobileMedia.url, public_id: mobileMedia.public_id };
  }

  const createdHero = await Hero.create(heroData);

  res.status(201).json({
    success: true,
    message: "Hero slide created successfully",
    data: createdHero
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
  const deletePromises = [];
  if (hero.desktop?.public_id) deletePromises.push(cloudinary.uploader.destroy(hero.desktop.public_id));
  if (hero.tablet?.public_id) deletePromises.push(cloudinary.uploader.destroy(hero.tablet.public_id));
  if (hero.mobile?.public_id) deletePromises.push(cloudinary.uploader.destroy(hero.mobile.public_id));
  
  await Promise.all(deletePromises);

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

  const updatedHero = await Hero.findByIdAndUpdate(
    req.params.id,
    { isActive: !hero.isActive },
    { new: true, runValidators: false }
  );

  res.json({
    success: true,
    message: "Hero status toggled",
    data: updatedHero
  });
});
