import dotenv from "dotenv";
import path from "path";
const result = dotenv.config();

console.log("📂 Current Directory:", process.cwd());
if (result.error) {
  console.error("❌ Dotenv Error:", result.error);
} else {
  console.log("✅ Dotenv loaded successfully from:", path.resolve(".env"));
}

import app from "./app.js";
import connectDB from "./config/db.js";
import { initCloudinary } from "./config/cloudinary.js";

const PORT = process.env.PORT || 5000;

// Connect DB & Services
connectDB();
initCloudinary();

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});