import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";

function AddStudent() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [email, setEmail] = useState("");
  const [course, setCourse] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const students = JSON.parse(
      localStorage.getItem("students_record_students") || "[]"
    );

    const newStudent = {
      id: Date.now(),
      name,
      studentId,
      email,
      course,
    };

    students.push(newStudent);

    localStorage.setItem(
      "students_record_students",
      JSON.stringify(students)
    );

    alert("Student added successfully!");

    navigate("/students");
  };

  return (
    <DashboardLayout>
      <div style={{ maxWidth: "700px" }}>
        <h1>Add Student</h1>

        <p>
          Add a new student to the records.
        </p>

        <form onSubmit={handleSubmit}>

          <div style={{ marginBottom: "20px" }}>
            <label>Student Name</label>

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="Enter student name"
              required
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label>Student ID</label>

            <input
              type="text"
              value={studentId}
              onChange={(e) =>
                setStudentId(e.target.value)
              }
              placeholder="Enter student ID"
              required
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label>Email</label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="Enter email address"
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label>Course</label>

            <input
              type="text"
              value={course}
              onChange={(e) =>
                setCourse(e.target.value)
              }
              placeholder="Enter course"
              required
            />
          </div>

          <button type="submit">
            Add Student
          </button>

          <button
            type="button"
            onClick={() => navigate("/students")}
            style={{ marginLeft: "10px" }}
          >
            Cancel
          </button>

        </form>
      </div>
    </DashboardLayout>
  );
}

export default AddStudent;