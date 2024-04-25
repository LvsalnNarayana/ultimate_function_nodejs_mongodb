import asyncHandler from "express-async-handler";

import User from "../models/user.model.js";

export const loginController = asyncHandler(async (req, res, next) => {
  try {
    const { password, email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401);
      throw new Error("User not found");
    }
    const isMatch = await user.isValidPassword(password);
    if (!isMatch) {
      res.status(401);
      throw new Error("Invalid Credentials");
    }
    req.session.user = { username: user.username, id: user._id };
    req.session.save();
    res.json({
      data: req.session.user.username,
      message: "Login successful",
    });
  } catch (error) {
    next(error);
  }
});
export const registerController = asyncHandler(async (req, res, next) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      res.status(409);
      throw new Error("Email already in use");
    }
    const user = await User.create(req.body);
    res.status(201).json({
      message: "User registered successfully",
      username: user.username,
      userId: user._id,
    });
  } catch (error) {
    next(error);
  }
});
export const logoutController = asyncHandler(async (req, res, next) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        throw err;
      }

      res.clearCookie("ultimateToken");
      res.status(200).json({ message: "Logout successful" });
    });
  } catch (error) {
    next(error);
  }
});
export const checkUsername = asyncHandler(async (req, res) => {
  try {
    const isAvailable = await User.isUsernameAvailable(req.params.username);
    res.status(200).send({ isAvailable });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});
export const getSession = asyncHandler(async (req, res) => {
  if (!req.session || !req.session.user) {
    res.status(404).send({ message: "No active session or user found" });
  } else {
    res.status(200).send({ user: req.session.user });
  }
});
