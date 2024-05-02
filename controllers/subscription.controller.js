import asyncHandler from "express-async-handler";

import Subscription from "../models/subscription.model.js";

export const getSubscriptionStatus = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  try {
    const subscription = await Subscription.findOne({ user: userId }).populate({
      select: "username firstName lastName email",
      path: "user",
    });

    if (!subscription) {
      return res
        .status(404)
        .json({ message: "No subscription found for this user." });
    }
    res.status(200).json(subscription);
  } catch (error) {
    next(error);
  }
});

export const purchaseSubscription = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { endDate } = req.body;

  try {
    const subscription = await Subscription.purchaseSubscription(
      userId,
      new Date(endDate),
    );
    req.session.user.subscriptionId = subscription.id;
    res.status(201).json({
      message: "Subscription purchased successfully",
      subscription,
    });
  } catch (error) {
    next(error);
  }
});
