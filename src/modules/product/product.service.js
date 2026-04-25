import cloudinary from "../../config/cloudinary.js";
import ApiError from "../../utils/ApiError.js";

export const uploadFilesToCloudinary = async (files) => {
  if (!files || files.length === 0) {
    throw new ApiError(400, "At least 1 file is required");
  }

  if (files.length > 5) {
    throw new ApiError(400, "Maximum 5 files allowed");
  }

  const uploadedFiles = [];

  for (const file of files) {
    const base64 = file.buffer.toString("base64");

    const dataURI = `data:${file.mimetype};base64,${base64}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      resource_type: "auto"
    });

    uploadedFiles.push({
      url: result.secure_url,
      public_id: result.public_id,
      type: result.resource_type === "video" ? "video" : "image"
    });
  }

  return uploadedFiles;
};