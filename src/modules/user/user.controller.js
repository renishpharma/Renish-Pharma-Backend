import catchAsync from "../../utils/catchAsync.js";
import * as userService from "./user.service.js";

export const getUsers = catchAsync(async (req, res) => {
  const users = await userService.getAllUsers(req.query);
  res.status(200).json({
    success: true,
    data: users
  });
});

export const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(201).json({
    success: true,
    message: "User created successfully",
    data: user
  });
});

export const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUser(req.params.id, req.body);
  res.status(200).json({
    success: true,
    message: "User updated successfully",
    data: user
  });
});

export const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUser(req.params.id);
  res.status(200).json({
    success: true,
    message: "User deleted successfully"
  });
});
