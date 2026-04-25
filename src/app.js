import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import errorHandler from "./middleware/error.middleware.js";
import authRoutes from "./modules/auth/auth.routes.js";
import productRoutes from "./modules/product/product.routes.js";
import enquiryRoutes from "./modules/enquiry/enquiry.routes.js";
import contactRoutes from "./modules/contact/contact.routes.js";

const app = express();

// 🔐 Rate Limiter (define BEFORE use)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 mins
    max: 100
});

// Middlewares
app.use(express.json({ limit: "10kb" }));
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// ✅ Apply limiter ONLY to login route
app.use("/api/v1/auth/login", limiter);

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/enquiries", enquiryRoutes);
app.use("/api/v1/contacts", contactRoutes);

// Health check
app.get("/", (req, res) => {
    res.send("✅ API is running...");
});

// Global Error Handler (ALWAYS LAST)
app.use(errorHandler);

export default app;