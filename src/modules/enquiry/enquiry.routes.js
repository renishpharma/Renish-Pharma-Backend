import express from "express";
import validate from "../../middleware/validate.middleware.js";
import protect from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/role.middleware.js";

import {
    createEnquiry,
    getEnquiries
} from "./enquiry.controller.js";

import { createEnquirySchema } from "./enquiry.validation.js";

const router = express.Router();

// Public (client side form)
router.post("/", validate(createEnquirySchema), createEnquiry);

// Admin/Manager
router.get("/", protect, authorize("admin", "manager"), getEnquiries);

export default router;