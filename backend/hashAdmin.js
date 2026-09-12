import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/User.js";

dotenv.config();

const hashAdminPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected");

    const admin = await User.findOne({
      email: "admin@studentsrecord.com",
    });

    if (!admin) {
      console.log("Admin user not found.");
      process.exit(1);
    }

    const hashedPassword = await bcrypt.hash(
      "admin123",
      10
    );

    admin.password = hashedPassword;

    await admin.save();

    console.log("Admin password hashed successfully!");

    process.exit(0);
  } catch (error) {
    console.error(
      "Error hashing password:",
      error.message
    );

    process.exit(1);
  }
};

hashAdminPassword();