import mongoose from "mongoose";

const marksheetSchema = new mongoose.Schema(
  {
    subjectId: {
      type: String,
      required: true,
    },
    subjectName: {
      type: String,
      required: true,
    },
    articleReview: {
      type: mongoose.Schema.Types.Mixed,
      default: "",
    },
    bookReview: {
      type: mongoose.Schema.Types.Mixed,
      default: "",
    },
    assignment: {
      type: mongoose.Schema.Types.Mixed,
      default: "",
    },
    finalGrade: {
      type: mongoose.Schema.Types.Mixed,
      default: "",
    },
  },
  { _id: false }
);

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    rollNo: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    course: {
      type: String,
      trim: true,
      default: "",
    },

    marksheet: {
      type: [marksheetSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Student", studentSchema);