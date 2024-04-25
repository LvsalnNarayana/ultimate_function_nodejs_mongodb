import asyncHandler from "express-async-handler";

import User from "../models/user.model.js";

export const getUserById = asyncHandler(async (req, res) => {
  try {
    const user = await User.findUser(req.params.userId);
    res.json(user);
  } catch (error) {
    const statusCode =
      error.message.includes("not found") ||
      error.message.includes("Invalid user ID")
        ? 404
        : 500;
    res.status(statusCode).json({ error: error.message });
  }
});

export const createUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.createUser(req.body);
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

export const editUserProfile = asyncHandler(async (req, res) => {
  try {
    const profileUpdates = {
      birthDate: req.body.birthDate,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      gender: req.body.gender,
    };

    Object.keys(profileUpdates).forEach(
      (key) => profileUpdates[key] === undefined && delete profileUpdates[key],
    );

    const user = await User.editProfile(req.params.userId, profileUpdates);

    res.status(200).send(user);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

export const updateNewsLetterPreferences = asyncHandler(async (req, res) => {
  try {
    const user = await User.updatePreferences(
      req.params.userId,
      req.body.preferences,
    );
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

export const toggleNotifications = asyncHandler(async (req, res) => {
  try {
    const { notificationsEnabled } = req.body;
    if (typeof notificationsEnabled !== "boolean") {
      throw new Error(
        "Invalid input: 'notificationsEnabled' must be true or false.",
      );
    }
    const user = notificationsEnabled
      ? await User?.enableNotifications(req?.params?.userId)
      : await User.disableNotifications(req.params.userId);

    res.send(user);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});
