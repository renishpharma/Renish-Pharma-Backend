import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, "User ID is required"],
      unique: true,
      trim: true
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false // 🔥 important for security
    },

    role: {
      type: String,
      enum: ["admin", "manager"],
      required: true
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;