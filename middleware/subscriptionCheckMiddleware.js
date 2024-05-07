import asyncHandler from "express-async-handler";

export const subscriptionCheck = asyncHandler(async (req, res, next) => {
  if (
    req?.session?.user?.subscriptionId !== null &&
    req?.session?.user?.subscriptionId !== undefined
  ) {
    next();
  } else {
    res.status(404).json({ message: "No Active Subscription" });
  }
});
