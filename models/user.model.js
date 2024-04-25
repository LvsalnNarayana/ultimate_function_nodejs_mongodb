/* eslint-disable multiline-ternary */
/* eslint-disable no-invalid-this */

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    preferences: {
      newsletters: {
        enum: ["marketing", "tech_updates"],
        type: [String],
        default: [],
      },
      notifications: {
        default: true,
        type: Boolean,
      },
    },
    profile: {
      gender: {
        enum: ["male", "female", "other"],
        type: String,
      },
      firstName: String,
      lastName: String,
      birthDate: Date,
    },
    email: {
      lowercase: true,
      required: true,
      type: String,
      unique: true,
      trim: true,
    },
    subscriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
    },
    roles: {
      enum: ["user", "admin"],
      default: ["user"],
      type: [String],
    },
    username: {
      required: true,
      type: String,
      unique: true,
    },
    isVerified: {
      default: false,
      type: Boolean,
    },
    password: {
      required: true,
      type: String,
    },
    lastLogin: Date,
    updatedAt: Date,
  },
  {
    toObject: {
      transform: function (doc, ret) {
        ret.id = ret?._id?.toString();
        delete ret?._id;
        delete ret?.__v;
        return ret;
      },
      virtuals: true,
      getters: true,
    },
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret?._id?.toString();
        delete ret?._id;
        delete ret?.__v;
        return ret;
      },
      virtuals: true,
      getters: true,
    },
    timestamps: true,
  },
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

userSchema.methods.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
userSchema.statics.findUser = async function (userId) {
  try {
    const user = await this.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (err) {
    if (err.kind === "ObjectId") {
      throw new Error("Invalid user ID");
    }
    throw new Error(`Error finding user: ${err.message}`);
  }
};
userSchema.statics.createUser = async function (userData) {
  try {
    const user = await this.create(userData);
    return user;
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      const message =
        field === "email"
          ? "Email already exists"
          : `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
      throw new Error(message);
    }

    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((el) => el.message);
      const message = `Validation error: ${errors.join(". ")}`;
      throw new Error(message);
    }

    throw new Error(`Error creating user: ${err.message}`);
  }
};
userSchema.statics.editProfile = async function (userId, profileUpdates) {
  try {
    const updatedUser = await this.findByIdAndUpdate(
      userId,
      {
        $set: {
          "profile.birthDate": profileUpdates.birthDate,
          "profile.firstName": profileUpdates.firstName,
          "profile.lastName": profileUpdates.lastName,
          "profile.gender": profileUpdates.gender,
        },
      },
      { runValidators: true, new: true },
    );
    return updatedUser;
  } catch (err) {
    throw new Error(`Error updating user profile: ${err.message}`);
  }
};
userSchema.statics.updatePreferences = async function (userId, preferences) {
  try {
    return await this.findByIdAndUpdate(
      userId,
      { $set: { "preferences.newsletters": preferences } },
      { runValidators: true, new: true },
    );
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.keys(err.errors).map((key) => {
        return err.errors[key].message;
      });
      throw new Error(`Validation error: ${messages.join(", ")}`);
    } else if (err.code === 11000) {
      throw new Error("Duplicate value");
    } else {
      throw new Error(`Error updating preferences: ${err.message}`);
    }
  }
};
userSchema.statics.isUsernameAvailable = async function (username) {
  const count = await this.countDocuments({ username: username });
  return count === 0;
};
userSchema.statics.enableNotifications = async function (userId) {
  const updatedUser = await this.findByIdAndUpdate(
    userId,
    {
      $set: { "preferences.notifications": true },
    },
    { runValidators: true, new: true },
  );
  return updatedUser;
};
userSchema.statics.disableNotifications = async function (userId) {
  const updatedUser = await this.findByIdAndUpdate(
    userId,
    {
      $set: { "preferences.notifications": false },
    },
    { runValidators: true, new: true },
  );
  return updatedUser;
};

const User = mongoose.model("User", userSchema);
export default User;
