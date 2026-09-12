import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/Dashboard.css";
import { getStudents, getSubjects } from "../api";

// const API_URL = "http://localhost:5000/api";

function Dashboard() {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

 const load = async () => {
  try {
    setLoading(true);

    const [studentsData, subjectsData] =
      await Promise.all([
        getStudents(),
        getSubjects(),
      ]);

    setStudents(studentsData.students || []);
    setSubjects(subjectsData.subjects || []);
  } catch (error) {
    console.error("Dashboard loading error:", error);
    alert(error.message);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    load();
  }, []);

  // =========================
  // MARKSHEET COUNTS
  // =========================

  const assignmentCount = students.reduce(
    (total, student) =>
      total +
      (student.marksheet || []).filter(
        (mark) =>
          mark.assignment !== "" &&
          mark.assignment != null
      ).length,
    0
  );

  const finalGradeCount = students.reduce(
    (total, student) =>
      total +
      (student.marksheet || []).filter(
        (mark) =>
          mark.finalGrade !== "" &&
          mark.finalGrade != null
      ).length,
    0
  );

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="recent-card">
          <div className="empty-dashboard">
            <div className="empty-dashboard-icon">
              🎓
            </div>

            <h3>
              Loading Dashboard...
            </h3>

            <p>
              Loading students and subjects
              from the database.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">

      {/* =========================
          HEADER
      ========================= */}

      <div className="dashboard-header">

        <div>
          <h1>
            Students Record
          </h1>

          <p>
            Manage and view student academic
            records.
          </p>
        </div>

        <Link
          to="/students?add=true"
          className="dashboard-add-btn"
        >
          + Add Student
        </Link>

      </div>

      {/* =========================
          STAT CARDS
      ========================= */}

      <div className="dashboard-stats">

        <div className="stat-card">

          <div className="stat-icon">
            🎓
          </div>

          <div>
            <p>
              Total Students
            </p>

            <h2>
              {students.length}
            </h2>
          </div>

        </div>

        <div className="stat-card">

          <div className="stat-icon">
            📚
          </div>

          <div>
            <p>
              Total Subjects
            </p>

            <h2>
              {subjects.length}
            </h2>
          </div>

        </div>

        {/* You can enable these later */}

        {/*
        <div className="stat-card">

          <div className="stat-icon">
            📝
          </div>

          <div>
            <p>
              Assignments Entered
            </p>

            <h2>
              {assignmentCount}
            </h2>
          </div>

        </div>

        <div className="stat-card">

          <div className="stat-icon">
            🎓
          </div>

          <div>
            <p>
              Final Grades Entered
            </p>

            <h2>
              {finalGradeCount}
            </h2>
          </div>

        </div>
        */}

      </div>

      {/* =========================
          QUICK ACTIONS
      ========================= */}

      <h2 className="section-title">
        Quick Actions
      </h2>

      <div className="quick-actions">

        <Link
          to="/students"
          className="quick-card"
        >

          <div className="quick-icon">
            🎓
          </div>

          <div>
            <h3>
              View Students
            </h3>

            <p>
              View and manage student records
            </p>
          </div>

          <span>
            →
          </span>

        </Link>

        <Link
          to="/students?add=true"
          className="quick-card"
        >

          <div className="quick-icon">
            ➕
          </div>

          <div>
            <h3>
              Add Student
            </h3>

            <p>
              Create a new student record
            </p>
          </div>

          <span>
            →
          </span>

        </Link>

        <Link
          to="/subjects"
          className="quick-card"
        >

          <div className="quick-icon">
            📚
          </div>

          <div>
            <h3>
              View Subjects
            </h3>

            <p>
              Manage subjects and academic work
            </p>
          </div>

          <span>
            →
          </span>

        </Link>

      </div>

      {/* =========================
          RECENT STUDENTS
      ========================= */}

      <div className="recent-card">

        <div className="recent-header">

          <div>
            <h2>
              Recent Students
            </h2>

            <p>
              Recently added student records
            </p>
          </div>

          <Link to="/students">
            View All
          </Link>

        </div>

        {students.length === 0 ? (

          <div className="empty-dashboard">

            <div className="empty-dashboard-icon">
              🎓
            </div>

            <h3>
              No Students Yet
            </h3>

            <p>
              Add your first student to start
              managing records.
            </p>

            <Link
              to="/students?add=true"
              className="dashboard-add-btn"
            >
              + Add Student
            </Link>

          </div>

        ) : (

          <div className="recent-list">

            {students
              .slice(-5)
              .reverse()
              .map((student) => (

                <Link
                  className="recent-student"
                  to={`/students/${student._id}`}
                  key={student._id}
                >

                  <div className="student-avatar">
                    {student.name
                      ?.charAt(0)
                      .toUpperCase()}
                  </div>

                  <div>

                    <strong>
                      {student.name}
                    </strong>

                    <p>
                      Roll No:{" "}
                      {student.rollNo}
                      {" · "}
                      {student.course ||
                        "Course not set"}
                    </p>

                  </div>

                  <span>
                    →
                  </span>

                </Link>

              ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default Dashboard;