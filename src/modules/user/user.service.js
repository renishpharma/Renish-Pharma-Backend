import User from "./user.model.js";
import ApiError from "../../utils/ApiError.js";
import bcrypt from "bcryptjs";

export const getAllUsers = async (filters) => {
  const query = {};
  if (filters.search) {
    query.$or = [
      { name: { $regex: filters.search, $options: "i" } },
      { userId: { $regex: filters.search, $options: "i" } }
    ];
  }
  if (filters.role) {
    query.role = filters.role;
  }

  return await User.find(query).sort({ createdAt: -1 });
};

export const createUser = async (userData) => {
  const existingUser = await User.findOne({ userId: userData.userId });
  if (existingUser) {
    throw new ApiError(400, "User ID already exists");
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10);
  return await User.create({
    ...userData,
    password: hashedPassword
  });
};

export const updateUser = async (id, updateData) => {
  if (updateData.password) {
    updateData.password = await bcrypt.hash(updateData.password, 10);
  }
  
  const user = await User.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
};

export const deleteUser = async (id) => {
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return user;
};
