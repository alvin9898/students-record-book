import express from "express";
import Subject from "../models/Subject.js";

const router = express.Router();

// Get all subjects
router.get("/", async (req, res) => {
  try {
    const subjects = await Subject.find().sort({ createdAt: -1 });

    res.json({ subjects });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch subjects",
    });
  }
});

// Add subject
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Subject name is required",
      });
    }

    const existing = await Subject.findOne({
      name: name.trim(),
    });

    if (existing) {
      return res.status(400).json({
        message: "Subject already exists",
      });
    }

    const subject = await Subject.create({
      name: name.trim(),
    });

    res.status(201).json({ subject });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to add subject",
    });
  }
});

// Update subject
router.put("/:id", async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Subject name is required",
      });
    }

    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      { name: name.trim() },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!subject) {
      return res.status(404).json({
        message: "Subject not found",
      });
    }

    res.json({ subject });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update subject",
    });
  }
});

// Delete subject
router.delete("/:id", async (req, res) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);

    if (!subject) {
      return res.status(404).json({
        message: "Subject not found",
      });
    }

    res.json({
      message: "Subject deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete subject",
    });
  }
});

export default router;