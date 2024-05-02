import asyncHandler from "express-async-handler";

import emailService from "../services/email.service.js";
import { config } from "../config/config.js";

export const sendMail = asyncHandler(async (req, res, next) => {
  const { subject, email, html } = req.body;

  const mailOptions = {
    from: config.emailUser,
    to: email,
    subject,
    html,
  };

  try {
    await emailService.sendMail(mailOptions);
    res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    next(error);
  }
});
