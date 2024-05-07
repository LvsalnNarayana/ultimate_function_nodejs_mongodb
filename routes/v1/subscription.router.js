import express from "express";

import {
  getSubscriptionStatus,
  purchaseSubscription,
  getSubscribedContent,
  cancelSubscription,
  // eslint-disable-next-line import/namespace
} from "../../controllers/subscription.controller.js";
import { subscriptionCheck } from "../../middleware/subscriptionCheckMiddleware.js";
import { authCheck } from "../../middleware/authCheckMiddleware.js";

const router = express.Router();

router.get("/subscription-status", getSubscriptionStatus);
router.post("/purchase-subscription", purchaseSubscription);
router.get(
  "/subscribed-content",
  authCheck,
  subscriptionCheck,
  getSubscribedContent,
);
router.post("/cancel-subscription", cancelSubscription);

export default router;
