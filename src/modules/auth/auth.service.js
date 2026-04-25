import bcrypt from "bcryptjs";
import User from "../user/user.model.js";
import ApiError from "../../utils/ApiError.js";
import generateToken from "../../utils/generateToken.js";

export const loginUser = async (userId, password) => {
  const user = await User.findOne({ userId }).select("+password");

  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  const token = generateToken({
    id: user._id,
    role: user.role
  });

  return {
    token,
    user: {
      id: user._id,
      userId: user.userId,
      role: user.role
    }
  };
};