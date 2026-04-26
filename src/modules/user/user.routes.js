import express from "express";
import { getUsers, createUser, updateUser, deleteUser } from "./user.controller.js";
import { protect } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/role.middleware.js";
import validate from "../../middleware/validate.middleware.js";
import { createUserSchema, updateUserSchema } from "./user.validation.js";

const router = express.Router();

router.use(protect);

router.get("/", authorize("admin", "manager"), getUsers);
router.post("/", authorize("admin"), validate(createUserSchema), createUser);
router.patch("/:id", authorize("admin"), validate(updateUserSchema), updateUser);
router.delete("/:id", authorize("admin"), deleteUser);

export default router;
