import asyncHandler from "express-async-handler";

export const authCheck = asyncHandler(async (req, res, next) => {
  if (req.session && req.session.user) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized: No active session found" });
  }
});
