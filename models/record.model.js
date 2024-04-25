import mongoose from "mongoose";

const recordSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    tagline: { required: true, type: String },
    title: { required: true, type: String },
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

recordSchema.statics.findAllRecordsByUser = async function (userId) {
  try {
    const records = await this.find({
      createdBy: userId,
    }).populate({
      select: "profile.firstName profile.lastName -_id",
      path: "createdBy",
    });
    return records;
  } catch (err) {
    throw new Error(`Error retrieving records: ${err.message}`);
  }
};

recordSchema.statics.createRecord = async function (recordData) {
  try {
    const record = new this(recordData);
    await record.save();
    return record;
  } catch (err) {
    throw new Error(`Error creating record: ${err.message}`);
  }
};

recordSchema.statics.findRecordById = async function (id) {
  try {
    const record = await this.findById(id);
    if (!record) {
      throw new Error("Record not found");
    }
    return record;
  } catch (err) {
    throw new Error(`Error finding record: ${err.message}`);
  }
};

recordSchema.statics.updateRecord = async function (id, updateData) {
  try {
    const record = await this.findByIdAndUpdate(id, updateData, {
      runValidators: true,
      new: true,
    });
    if (!record) {
      throw new Error("Record not found");
    }
    return record;
  } catch (err) {
    throw new Error(`Error updating record: ${err.message}`);
  }
};

recordSchema.statics.deleteRecord = async function (id) {
  try {
    const result = await this.findByIdAndDelete(id);
    if (!result) {
      throw new Error("Record not found");
    }
    return result;
  } catch (err) {
    throw new Error(`Error deleting record: ${err.message}`);
  }
};
const Record = mongoose.model("Record", recordSchema);
export default Record;
