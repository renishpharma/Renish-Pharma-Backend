import multer from "multer";
import ApiError from "../../utils/ApiError.js";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "video/mp4"
  ];

  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new ApiError(400, "Invalid file type"), false);
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    files: 5,
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

export default upload;