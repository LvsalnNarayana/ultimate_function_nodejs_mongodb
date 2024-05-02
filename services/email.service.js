import nodemailer from "nodemailer";

import { config } from "../config/config.js";

const transporter = nodemailer.createTransport({
  auth: {
    pass: config.emailPass,
    user: config.emailUser,
  },
  host: "smtp.gmail.com",
  secure: false,
  port: 587,
});
export default transporter;
