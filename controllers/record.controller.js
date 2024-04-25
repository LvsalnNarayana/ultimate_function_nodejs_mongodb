import asyncHandler from "express-async-handler";

import Record from "../models/record.model.js";

export const createRecord = asyncHandler(async (req, res) => {
  const { tagline, title } = req.body;

  try {
    const record = new Record({
      createdBy: req?.session?.user?.id,
      tagline,
      title,
    });
    const createdRecord = await record.save();
    res.status(201).json(createdRecord);
  } catch (error) {
    console.error("Error creating the record:", error);
    res.status(500).send({ message: "Failed to create the record" });
  }
});

export const getRecordsByUser = asyncHandler(async (req, res) => {
  try {
    const records = await Record.findAllRecordsByUser(req?.session?.user?.id);
    res.json(records);
  } catch (error) {
    console.error("Error retrieving records by user:", error);
    res.status(500).send({ message: "Failed to retrieve records" });
  }
});

export const updateRecord = asyncHandler(async (req, res) => {
  const { recordId } = req.params;
  const { tagline, title } = req.body;

  try {
    const record = await Record.findByIdAndUpdate(
      recordId,
      { tagline, title },
      { runValidators: true, new: true },
    );

    if (!record) {
      res.status(404).send({ message: "Record not found" });
    } else {
      res.json(record);
    }
  } catch (error) {
    console.error("Error updating the record:", error);
    res.status(500).send({ message: "Failed to update the record" });
  }
});

export const deleteRecord = asyncHandler(async (req, res) => {
  const { recordId } = req.params;

  try {
    const record = await Record.findByIdAndDelete(recordId);

    if (!record) {
      res.status(404).send({ message: "Record not found" });
    } else {
      res.status(204).send({ message: "Record deleted" });
    }
  } catch (error) {
    console.error("Error deleting the record:", error);
    res.status(500).send({ message: "Failed to delete the record" });
  }
});

export const getRecordById = asyncHandler(async (req, res) => {
  const { recordId } = req.params;

  try {
    const record = await Record.findRecordById(recordId);

    if (record) {
      res.json(record);
    } else {
      res.status(404).send({ message: "Record not found" });
    }
  } catch (error) {
    // Log the error internally
    console.error("Failed to retrieve record:", error);

    // Respond with a 500 internal server error status code
    res.status(500).send({ message: "Error retrieving record" });
  }
});
