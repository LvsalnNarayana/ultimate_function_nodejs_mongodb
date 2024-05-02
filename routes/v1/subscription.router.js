import express from "express";

import {
  getSubscriptionStatus,
  purchaseSubscription,
} from "../../controllers/subscription.controller.js";

const router = express.Router();

router.get("/subscription-status", getSubscriptionStatus);
router.post("/purchase-subscription", purchaseSubscription);

export default router;
