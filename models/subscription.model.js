/* eslint-disable no-invalid-this */
import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    status: {
      enum: ["ACTIVE", "INACTIVE", "EXPIRED"],
      default: "ACTIVE",
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
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
      throw new Error("No active subscription found for this user.");
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
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const subscription = await this.create(
      [
        {
          endDate: endDate,
          user: userId,
        },
      ],
      { session: session },
    );

    await mongoose.model("User").findByIdAndUpdate(
      userId,
      {
        $set: { subscriptionId: subscription[0]._id },
      },
      { session: session },
    );

    await session.commitTransaction();
    session.endSession();
    return subscription[0];
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};
const Subscription = mongoose.model("Subscription", subscriptionSchema);
export default Subscription;
