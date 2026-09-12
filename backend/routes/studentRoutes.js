import express from "express";
import Student from "../models/Student.js";

const router = express.Router();

// Get all students
router.get("/", async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json({ students });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch students",
    });
  }
});

// Get one student
router.get("/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.json({ student });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch student",
    });
  }
});

// Add student
router.post("/", async (req, res) => {
  try {
    const { name, rollNo, email, phone, course } = req.body;

    if (!name || !rollNo) {
      return res.status(400).json({
        message: "Name and roll number are required",
      });
    }

    const existing = await Student.findOne({ rollNo });

    if (existing) {
      return res.status(400).json({
        message: "A student with this roll number already exists",
      });
    }

    const student = await Student.create({
      name,
      rollNo,
      email: email || "",
      phone: phone || "",
      course: course || "",
      marksheet: [],
    });

    res.status(201).json({ student });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to add student",
    });
  }
});

// Delete student
router.delete("/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.json({
      message: "Student deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete student",
    });
  }
});

// Update student / marksheet
router.put("/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.json({ student });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update student",
    });
  }
});

export default router;