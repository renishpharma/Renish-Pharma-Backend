import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import User from "../modules/user/user.model.js";

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new ApiError(401, "Not authorized"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select("-password");

    next();
  } catch (error) {
    next(new ApiError(401, "Invalid token"));
  }
};

export default protect;