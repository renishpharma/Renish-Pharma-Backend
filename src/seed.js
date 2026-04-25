import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./modules/user/user.model.js";
import connectDB from "./config/db.js";

dotenv.config();

const seedUsers = async () => {
  try {
    await connectDB();

    await User.deleteMany();

    const users = [
      {
        userId: "admin001",
        password: await bcrypt.hash("admin@123", 10),
        role: "admin"
      },
      {
        userId: "manager001",
        password: await bcrypt.hash("manager@123", 10),
        role: "manager"
      }
    ];

    await User.insertMany(users);

    console.log("Users seeded successfully");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedUsers();