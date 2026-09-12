import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "../styles/Students.css";

import {
  getStudents,
  createStudent,
  deleteStudent as deleteStudentAPI,
} from "../api";

const emptyForm = {
  name: "",
  rollNo: "",
  email: "",
  phone: "",
  course: "",
};

function Students() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(
    searchParams.get("add") === "true"
  );
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);

  // =========================
  // LOAD STUDENTS
  // =========================

  const loadStudents = async () => {
    try {
      setLoading(true);

      const data = await getStudents();

      setStudents(data.students || []);
    } catch (error) {
      console.error("Failed to load students:", error);

      if (
        error.message === "Authentication required" ||
        error.message === "Invalid or expired token"
      ) {
        localStorage.removeItem("students_record_token");
        localStorage.removeItem("students_record_user");
        localStorage.removeItem("students_record_admin");

        navigate("/login");
        return;
      }

      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();

    setShowForm(
      searchParams.get("add") === "true"
    );
  }, [searchParams]);

  // =========================
  // ADD STUDENT
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await createStudent(form);

      const newStudent = data.student;

      setStudents((current) => [
        newStudent,
        ...current,
      ]);

      setForm(emptyForm);
      setShowForm(false);

      navigate(`/students/${newStudent._id}`);
    } catch (error) {
      console.error(
        "Add student error:",
        error
      );

      alert(error.message);
    }
  };

  // =========================
  // DELETE STUDENT
  // =========================

  const handleDeleteStudent = async (id) => {
    if (
      !window.confirm(
        "Delete this student and their marksheet?"
      )
    ) {
      return;
    }

    try {
      await deleteStudentAPI(id);

      setStudents((current) =>
        current.filter(
          (student) =>
            student._id !== id
        )
      );
    } catch (error) {
      console.error(
        "Delete student error:",
        error
      );

      alert(error.message);
    }
  };

  // =========================
  // SEARCH
  // =========================

  const filteredStudents = students.filter(
    (student) =>
      `${student.name || ""} ${
        student.rollNo || ""
      } ${student.email || ""} ${
        student.course || ""
      }`
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div className="students-page">

      {/* HEADER */}

      <div className="students-header">

        <div>
          <h1>Students</h1>

          <p>
            Manage student records and academic
            information.
          </p>
        </div>

        <button
          className="primary-btn"
          onClick={() => {
            setShowForm(true);
            navigate("/students?add=true");
          }}
        >
          + Add Student
        </button>

      </div>

      {/* ADD FORM */}

      {showForm && (
        <div className="student-form-card">

          <div className="form-header">

            <div>
              <h2>Add New Student</h2>

              <p>
                Enter the student's information below.
              </p>
            </div>

            <button
              className="close-form"
              onClick={() => {
                setShowForm(false);
                navigate("/students");
              }}
            >
              ×
            </button>

          </div>

          <form onSubmit={handleSubmit}>

            <div className="form-grid">

              <div className="form-group">

                <label>
                  Student Name *
                </label>

                <input
                  name="name"
                  placeholder="Enter full name"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  required
                />

              </div>

              <div className="form-group">

                <label>
                  Roll Number *
                </label>

                <input
                  name="rollNo"
                  placeholder="e.g. 001"
                  value={form.rollNo}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      rollNo: e.target.value,
                    })
                  }
                  required
                />

              </div>

              <div className="form-group">

                <label>
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  placeholder="student@email.com"
                  value={form.email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email: e.target.value,
                    })
                  }
                />

              </div>

              <div className="form-group">

                <label>
                  Phone Number
                </label>

                <input
                  name="phone"
                  placeholder="Enter phone number"
                  value={form.phone}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      phone: e.target.value,
                    })
                  }
                />

              </div>

              <div className="form-group full-width">

                <label>
                  Course
                </label>

                <input
                  name="course"
                  placeholder="e.g. B.Th"
                  value={form.course}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      course: e.target.value,
                    })
                  }
                />

              </div>

            </div>

            <div className="form-actions">

              <button
                type="button"
                className="cancel-btn"
                onClick={() => {
                  setShowForm(false);
                  navigate("/students");
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-btn"
              >
                Save Student
              </button>

            </div>

          </form>

        </div>
      )}

      {/* TOOLBAR */}

      <div className="students-toolbar">

        <input
          className="search-input"
          placeholder="🔍 Search by name, roll number, email or course..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <span className="student-count">

          {filteredStudents.length} of{" "}
          {students.length} student
          {students.length !== 1 ? "s" : ""}

        </span>

      </div>

      {/* STUDENT TABLE */}

      <div className="students-card">

        {loading ? (

          <div className="empty-students">

            <div className="empty-icon">
              ⏳
            </div>

            <h2>
              Loading Students...
            </h2>

            <p>
              Please wait while we load the
              student records.
            </p>

          </div>

        ) : filteredStudents.length === 0 ? (

          <div className="empty-students">

            <div className="empty-icon">
              🎓
            </div>

            <h2>
              {students.length
                ? "No Students Found"
                : "No Students Yet"}
            </h2>

            <p>
              {students.length
                ? "Try a different search."
                : "Add your first student to create their marksheet."}
            </p>

            {!students.length && (
              <button
                className="primary-btn"
                onClick={() => {
                  setShowForm(true);
                  navigate(
                    "/students?add=true"
                  );
                }}
              >
                + Add Student
              </button>
            )}

          </div>

        ) : (

          <div className="table-wrapper">

            <table>

              <thead>

                <tr>
                  <th>Student</th>
                  <th>Roll Number</th>
                  <th>Email</th>
                  <th>Course</th>
                  <th>Marksheet</th>
                  <th>Actions</th>
                </tr>

              </thead>

              <tbody>

                {filteredStudents.map(
                  (student) => (

                    <tr
                      key={student._id}
                    >

                      <td>

                        <div className="student-cell">

                          <div className="student-table-avatar">

                            {student.name
                              ?.charAt(0)
                              .toUpperCase()}

                          </div>

                          <strong>
                            {student.name}
                          </strong>

                        </div>

                      </td>

                      <td>
                        {student.rollNo}
                      </td>

                      <td>
                        {student.email || "-"}
                      </td>

                      <td>
                        {student.course || "-"}
                      </td>

                      <td>

                        <button
                          className="view-btn"
                          onClick={() =>
                            navigate(
                              `/students/${student._id}`
                            )
                          }
                        >
                          📄 Open Marksheet
                        </button>

                      </td>

                      <td>

                        <div className="actions">

                          <button
                            className="view-btn"
                            onClick={() =>
                              navigate(
                                `/students/${student._id}`
                              )
                            }
                          >
                            View
                          </button>

                          <button
                            className="delete-btn"
                            onClick={() =>
                              handleDeleteStudent(
                                student._id
                              )
                            }
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}

export default Students;