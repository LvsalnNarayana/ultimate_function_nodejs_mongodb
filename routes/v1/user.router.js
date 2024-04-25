/* eslint-disable multiline-ternary */
import express from "express";

import {
  updateNewsLetterPreferences,
  toggleNotifications,
  editUserProfile,
  getUserById,
  createUser,
} from "../../controllers/user.controller.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    res.status(200).json({ message: "user route checked" });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});
router.post("/create", createUser);
router.patch("/edit/notifications/:userId", toggleNotifications);
router.put("/edit/profile/:userId", editUserProfile);
router.patch(
  "/edit/newsletter-preference/:userId",
  updateNewsLetterPreferences,
);
router.get("/:userId", getUserById);

export default router;
