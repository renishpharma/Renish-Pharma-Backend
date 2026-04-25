import express from "express";
import validate from "../../middleware/validate.middleware.js";
import protect from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/role.middleware.js";

import {
  createContact,
  getContacts
} from "./contact.controller.js";

import { createContactSchema } from "./contact.validation.js";

const router = express.Router();

// Public
router.post("/", validate(createContactSchema), createContact);

// Admin/Manager
router.get("/", protect, authorize("admin", "manager"), getContacts);

export default router;