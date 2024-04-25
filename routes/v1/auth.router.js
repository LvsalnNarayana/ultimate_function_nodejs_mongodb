import express from "express";

import {
  registerController,
  logoutController,
  loginController,
  checkUsername,
  getSession,
} from "../../controllers/auth.controller.js";

const router = express.Router();

router.post("/login", loginController);
router.post("/register", registerController);
router.post("/logout", logoutController);
router.get("/get-session", getSession);
router.get("/check-username/:username", checkUsername);

export default router;
