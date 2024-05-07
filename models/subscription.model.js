/* eslint-disable no-invalid-this */
import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
      ref: "User",
    },
    status: {
      enum: ["ACTIVE", "INACTIVE", "EXPIRED"],
      default: "ACTIVE",
      type: String,
    },
    title: {
      enum: ["PRO", "ULTIMATE"],
      default: "PRO",
      type: String,
    },
    startDate: {
      default: Date.now,
      type: Date,
    },
    endDate: {
      required: true,
      type: Date,
    },
  },
  {
    toObject: {
      transform: function (doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
      virtuals: true,
      getters: true,
    },
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
      virtuals: true,
      getters: true,
    },
    timestamps: true,
  },
);
subscriptionSchema.virtual("duration").get(function () {
  const duration =
    (this.endDate.getTime() - this.startDate.getTime()) / (1000 * 3600 * 24);
  return duration;
});

subscriptionSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

subscriptionSchema.virtual("remainingDays").get(function () {
  const today = new Date();
  const remaining =
    (this.endDate.getTime() - today.getTime()) / (1000 * 3600 * 24);
  return Math.max(0, remaining);
});

subscriptionSchema.statics.findSubscriptionDetails = async function (userId) {
  try {
    const subscription = await this.findOne({ user: userId })
      .populate("user", "email username")
      .exec();
    if (!subscription) {
      return null;
    }
    const details = {
      remainingDays: subscription.remainingDays,
      username: subscription.user.username,
      startDate: subscription.startDate,
      email: subscription.user.email,
      endDate: subscription.endDate,
      status: subscription.status,
      title: subscription.title,
    };
    return details;
  } catch (err) {
    throw new Error(`Error retrieving subscription details: ${err.message}`);
  }
};
subscriptionSchema.statics.purchaseSubscription = async function (
  userId,
  endDate,
) {
  try {
    const currentDate = new Date();
    const NewEndDate = new Date(currentDate);
    switch (endDate) {
      case "1m":
        NewEndDate.setMonth(currentDate.getMonth() + 1);
        break;
      case "4m":
        NewEndDate.setMonth(currentDate.getMonth() + 4);
        break;
      default:
        throw new Error("Invalid end date option");
    }
    const subscription = await this.create({
      endDate: NewEndDate,
      user: userId,
    });
    await mongoose.model("User").findByIdAndUpdate(userId, {
      $set: { subscriptionId: subscription.id },
    });
    return subscription;
  } catch (error) {
    if (error.code === 11000) {
      throw new Error("Subscription already exists for this user.");
    } else {
      throw new Error(error.message);
    }
  }
};
const Subscription = mongoose.model("Subscription", subscriptionSchema);
export default Subscription;
