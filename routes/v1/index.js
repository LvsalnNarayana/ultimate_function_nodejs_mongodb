import express from "express";

import { authCheck } from "../../middleware/authCheckMiddleware.js";
import recordRouter from "./record.router.js";
import authRouter from "./auth.router.js";
import userRouter from "./user.router.js";
const router = express.Router();

router.use("/auth", authRouter);
router.use("/user", authCheck, userRouter);
router.use("/crud", recordRouter);
export default router;
