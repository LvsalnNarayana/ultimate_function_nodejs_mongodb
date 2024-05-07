import asyncHandler from "express-async-handler";
import moment from "moment";

import Subscription from "../models/subscription.model.js";
import User from "../models/user.model.js";

export const getSubscriptionStatus = asyncHandler(async (req, res, next) => {
  const userId = req.session.user.id;
  try {
    const subscription = await Subscription.findSubscriptionDetails(userId);
    if (!subscription) {
      return res
        .status(200)
        .json({ message: "No Active Subscription found", subscription: null });
    }
    res.status(200).json(subscription);
  } catch (error) {
    res.status(400);
    next(error);
  }
});

export const purchaseSubscription = asyncHandler(async (req, res, next) => {
  const userId = req.session.user.id;
  const { endDate } = req.body;
  try {
    const subscription = await Subscription.purchaseSubscription(
      userId,
      endDate,
    );
    req.session.user.subscriptionId = subscription.id;
    res.status(201).json({
      message: "Subscription purchased successfully",
      subscription,
    });
  } catch (error) {
    res.status(400);
    next(error);
  }
});

export const cancelSubscription = asyncHandler(async (req, res, next) => {
  const userId = req.session.user.id;
  try {
    const subscription = await Subscription.cancelSubscription(userId);
    await User.findOneAndUpdate(
      { id: req.session.user.id },
      { $set: { subscriptionId: null } },
    );
    req.session.user.subscriptionId = null;
    req.session.save();
    res.status(200).json({
      message: "Subscription cancelled successfully",
      subscription,
    });
  } catch (error) {
    res.status(400);
    next(error);
  }
});

export const getSubscribedContent = asyncHandler(async (req, res, next) => {
  try {
    const subscription = await Subscription.findSubscriptionDetails(
      req.session.user.id,
    );
    res.status(200).json({
      message: `Congratulations ${req.session.user.username}!!🎉🎉 \n\n You have subscribed to PRO Content. your subscription ends on ${moment(subscription?.endDate).format("DD MMM, YYYY")} `,
    });
  } catch (error) {
    res.status(400);
    next(error);
  }
});
