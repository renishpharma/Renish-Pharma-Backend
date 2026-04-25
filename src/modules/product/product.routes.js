import express from "express";
import protect from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/role.middleware.js";
import upload from "./product.upload.js";
import validate from "../../middleware/validate.middleware.js";

import {
    createProduct,
    getProducts,
    getProductById,
    deleteProduct
} from "./product.controller.js";

import { createProductSchema } from "./product.validation.js";

const router = express.Router();

// Create product
router.post(
    "/",
    protect,
    authorize("admin", "manager"),
    upload.array("media", 5),
    validate(createProductSchema),
    createProduct
);

// Get all
router.get("/", getProducts);

// Get one
router.get("/:id", getProductById);

// Delete
router.delete("/:id", protect, authorize("admin"), deleteProduct);

export default router;