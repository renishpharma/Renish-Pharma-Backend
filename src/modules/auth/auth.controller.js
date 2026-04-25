import catchAsync from "../../utils/catchAsync.js";
import { loginUser } from "./auth.service.js";

export const login = catchAsync(async (req, res) => {
  const { userId, password } = req.body;

  const data = await loginUser(userId, password);

  res.status(200).json({
    success: true,
    message: "Login successful",
    data
  });
});