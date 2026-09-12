import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import studentRoutes from "./routes/studentRoutes.js";
import subjectRoutes from "./routes/subjectRoutes.js";


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/students", studentRoutes);
app.use("/api/subjects", subjectRoutes);


const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Student Management API running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });

app.get("/", (req, res) => {
  res.json({
    message: "Student Management System API is running",
  });
});