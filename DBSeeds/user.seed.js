/* eslint-disable no-console */
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import User from "../models/user.model.js"; // Adjust the import path according to your project structure
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected...");
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const seedUsers = async () => {
  try {
    // Optional: Clear the user collection before seeding to avoid duplicates
    await User.deleteMany();

    // Password hashing
    const password = await bcrypt.hash("password123", 10);

    const users = [
      new User({
        profile: {
          firstName: "John",
          lastName: "Doe",
          gender: "male",
        },
        preferences: {
          newsletters: ["marketing", "tech_updates"],
        },
        email: "john.doe@example.com",
        username: "john_doe",
        roles: ["user"],
        password,
      }),
      new User({
        profile: {
          firstName: "Jane",
          gender: "female",
          lastName: "Doe",
        },
        preferences: {
          newsletters: ["marketing"],
        },
        email: "jane.doe@example.com",
        username: "jane_doe",
        roles: ["user"],
        password,
      }),
    ];

    for (const user of users) {
      await user.save();
    }

    console.log("Users seeded...");
  } catch (err) {
    console.error("Failed to seed users:", err);
  } finally {
    mongoose.connection.close();
  }
};

// Connect to DB and seed users
connectDB().then(() => {
  seedUsers();
});
