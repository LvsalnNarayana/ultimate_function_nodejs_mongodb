import express from "express";

import {
  getRecordsByUser,
  getRecordById,
  createRecord,
  deleteRecord,
  updateRecord,
} from "../../controllers/record.controller.js";

const router = express.Router();

// Record routes
router.post("/", createRecord);
router.get("/", getRecordsByUser);
router.get("/:recordId", getRecordById);
router.patch("/:recordId", updateRecord);
router.delete("/:recordId", deleteRecord);

export default router;
