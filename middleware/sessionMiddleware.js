import MongoStore from "connect-mongo";
import session from "express-session";

import { config } from "../config/config.js";

export const sessionMiddleware = session({
  cookie: {
    secure: config?.environment === "production",
    maxAge: 1000 * 60 * 60,
    sameSite: "lax",
    httpOnly: true,
  },
  store: MongoStore.create({
    mongoUrl: config?.dbUrl,
  }),
  secret: config?.jwtSecret,
  saveUninitialized: false,
  name: "ultimateToken",
  resave: false,
});
