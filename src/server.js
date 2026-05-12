import dotenv from "dotenv";
import path from "path";
const result = dotenv.config();

if (result.error) {
  console.error("❌ ENV Error:", result.error);
} else {
  console.log("✅ ENV loaded successfully");
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