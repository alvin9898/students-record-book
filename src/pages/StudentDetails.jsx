import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/StudentDetails.css";

const API_URL = "http://localhost:5000/api";

const emptyMark = (subject) => ({
  subjectId: subject._id,
  subjectName: subject.name,
  articleReview: "",
  bookReview: "",
  assignment: "",
  finalGrade: "",
});

function StudentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [marksheet, setMarksheet] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [loading, setLoading] = useState(true);

  // =========================
  // LOAD STUDENT + SUBJECTS
  // =========================

  const load = async () => {
    try {
      setLoading(true);

      const [studentResponse, subjectsResponse] =
        await Promise.all([
          fetch(`${API_URL}/students/${id}`),
          fetch(`${API_URL}/subjects`),
        ]);

      const studentData =
        await studentResponse.json();

      const subjectsData =
        await subjectsResponse.json();

      if (!studentResponse.ok) {
        throw new Error(
          studentData.message ||
            "Failed to load student"
        );
      }

      if (!subjectsResponse.ok) {
        throw new Error(
          subjectsData.message ||
            "Failed to load subjects"
        );
      }

      const foundStudent =
        studentData.student;

      setStudent(foundStudent);
      setSubjects(subjectsData.subjects || []);
      setMarksheet(
        foundStudent.marksheet || []
      );
    } catch (error) {
      console.error(
        "Failed to load student details:",
        error
      );

      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  // =========================
  // AVAILABLE SUBJECTS
  // =========================

  const availableSubjects = useMemo(
    () =>
      subjects.filter(
        (subject) =>
          !marksheet.some(
            (mark) =>
              String(mark.subjectId) ===
              String(subject._id)
          )
      ),
    [subjects, marksheet]
  );

  // =========================
  // UPDATE MARK
  // =========================

  const updateMark = (
    index,
    field,
    value
  ) => {
    const clean =
      value === ""
        ? ""
        : Math.max(
            0,
            Math.min(100, Number(value))
          );

    setMarksheet((current) =>
      current.map((row, i) =>
        i === index
          ? {
              ...row,
              [field]: clean,
            }
          : row
      )
    );
  };

  // =========================
  // SAVE MARKSHEET
  // =========================

  const saveMarksheet = async () => {
    try {
      const response = await fetch(
        `${API_URL}/students/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            marksheet,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to save marksheet"
        );
      }

      setStudent(data.student);
      setMarksheet(
        data.student.marksheet || []
      );

      setMessage(
        "Marksheet saved successfully."
      );

      setTimeout(() => {
        setMessage("");
      }, 2500);
    } catch (error) {
      console.error(
        "Save marksheet error:",
        error
      );

      alert(error.message);
    }
  };

  // =========================
  // ADD SUBJECT
  // =========================

  const addSubject = () => {
    if (!selectedSubject) return;

    const subject = subjects.find(
      (s) =>
        String(s._id) ===
        String(selectedSubject)
    );

    if (!subject) return;

    setMarksheet((current) => [
      ...current,
      emptyMark(subject),
    ]);

    setSelectedSubject("");
  };

  // =========================
  // REMOVE SUBJECT
  // =========================

  const removeSubject = (subjectId) => {
    if (
      !window.confirm(
        "Remove this subject from the student's marksheet?"
      )
    ) {
      return;
    }

    setMarksheet((current) =>
      current.filter(
        (row) =>
          String(row.subjectId) !==
          String(subjectId)
      )
    );
  };

  // =========================
  // TOTALS
  // =========================

  const totals = marksheet.reduce(
    (acc, row) => {
      [
        "articleReview",
        "bookReview",
        "assignment",
        "finalGrade",
      ].forEach((field) => {
        if (
          row[field] !== "" &&
          row[field] != null
        ) {
          acc[field] += Number(
            row[field]
          );

          acc.count[field] += 1;
        }
      });

      return acc;
    },
    {
      articleReview: 0,
      bookReview: 0,
      assignment: 0,
      finalGrade: 0,

      count: {
        articleReview: 0,
        bookReview: 0,
        assignment: 0,
        finalGrade: 0,
      },
    }
  );

  const avg = (field) =>
    totals.count[field]
      ? (
          totals[field] /
          totals.count[field]
        ).toFixed(1)
      : "-";

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="details-page">
        <div className="detail-card">
          <h2>Loading Student...</h2>
          <p>
            Please wait while the student
            record is loaded.
          </p>
        </div>
      </div>
    );
  }

  // =========================
  // NOT FOUND
  // =========================

  if (!student) {
    return (
      <div className="details-page">
        <div className="detail-card">

          <h2>
            Student Not Found
          </h2>

          <button
            className="primary-btn"
            onClick={() =>
              navigate("/students")
            }
          >
            ← Back to Students
          </button>

        </div>
      </div>
    );
  }

  return (
    <div className="details-page">

      {/* HEADER */}

      <div className="details-header">

        <div>

          <button
            className="back-link"
            onClick={() =>
              navigate("/students")
            }
          >
            ← Back to Students
          </button>

          <h1>
            Student Marksheet
          </h1>

          <p>
            Enter and save academic marks
            for each subject.
          </p>

        </div>

        <button
          className="primary-btn"
          onClick={saveMarksheet}
        >
          💾 Save Marksheet
        </button>

      </div>

      {/* SUCCESS MESSAGE */}

      {message && (
        <div className="success-message">
          ✓ {message}
        </div>
      )}

      {/* STUDENT SUMMARY */}

      <div className="student-summary">

        <div className="big-avatar">
          {student.name
            ?.charAt(0)
            .toUpperCase()}
        </div>

        <div>

          <h2>
            {student.name}
          </h2>

          <div className="summary-grid">

            <span>
              <b>Roll No:</b>{" "}
              {student.rollNo}
            </span>

            <span>
              <b>Course:</b>{" "}
              {student.course || "-"}
            </span>

            <span>
              <b>Email:</b>{" "}
              {student.email || "-"}
            </span>

            <span>
              <b>Phone:</b>{" "}
              {student.phone || "-"}
            </span>

          </div>

        </div>

      </div>

      {/* MARKSHEET */}

      <div className="marksheet-card">

        <div className="marksheet-header">

          <div>

            <h2>
              Academic Marksheet
            </h2>

            <p>
              Marks are out of 100. Leave a
              field blank if not entered yet.
            </p>

          </div>

          <div className="subject-adder">

            <select
              value={selectedSubject}
              onChange={(e) =>
                setSelectedSubject(
                  e.target.value
                )
              }
            >

              <option value="">
                Add subject...
              </option>

              {availableSubjects.map(
                (subject) => (
                  <option
                    key={subject._id}
                    value={subject._id}
                  >
                    {subject.name}
                  </option>
                )
              )}

            </select>

            <button
              className="secondary-btn"
              onClick={addSubject}
              disabled={!selectedSubject}
            >
              + Add
            </button>

          </div>

        </div>

        {marksheet.length === 0 ? (

          <div className="empty-marksheet">

            <div>📄</div>

            <h3>
              No subjects in this
              marksheet
            </h3>

            <p>
              Add subjects from the
              Subjects page, then select
              them above.
            </p>

          </div>

        ) : (

          <div className="marksheet-table-wrap">

            <table className="marksheet-table">

              <thead>

                <tr>
                  <th>Subject</th>
                  <th>Article Review</th>
                  <th>Book Review</th>
                  <th>Assignment</th>
                  <th>Final Grades</th>
                  <th></th>
                </tr>

              </thead>

              <tbody>

                {marksheet.map(
                  (row, index) => (

                    <tr
                      key={`${row.subjectId}-${index}`}
                    >

                      <td className="subject-name">
                        {row.subjectName}
                      </td>

                      {[
                        "articleReview",
                        "bookReview",
                        "assignment",
                        "finalGrade",
                      ].map((field) => (

                        <td key={field}>

                          <input
                            className="mark-input"
                            type="number"
                            min="0"
                            max="100"
                            value={
                              row[field]
                            }
                            placeholder="—"
                            onChange={(e) =>
                              updateMark(
                                index,
                                field,
                                e.target
                                  .value
                              )
                            }
                          />

                        </td>

                      ))}

                      <td>

                        <button
                          className="remove-subject"
                          onClick={() =>
                            removeSubject(
                              row.subjectId
                            )
                          }
                          title="Remove subject"
                        >
                          ×
                        </button>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

              <tfoot>

                <tr>

                  <th>
                    Average
                  </th>

                  <th>
                    {avg(
                      "articleReview"
                    )}
                  </th>

                  <th>
                    {avg(
                      "bookReview"
                    )}
                  </th>

                  <th>
                    {avg(
                      "assignment"
                    )}
                  </th>

                  <th>
                    {avg(
                      "finalGrade"
                    )}
                  </th>

                  <th></th>

                </tr>

              </tfoot>

            </table>

          </div>

        )}

      </div>

      {/* MARK SUMMARY */}

      <div className="marks-summary">

        <div>
          <span>Subjects</span>
          <strong>
            {marksheet.length}
          </strong>
        </div>

        <div>
          <span>
            Article Review Avg.
          </span>

          <strong>
            {avg("articleReview")}
          </strong>
        </div>

        <div>
          <span>
            Book Review Avg.
          </span>

          <strong>
            {avg("bookReview")}
          </strong>
        </div>

        <div>
          <span>
            Assignment Avg.
          </span>

          <strong>
            {avg("assignment")}
          </strong>
        </div>

        <div>
          <span>
            Final Grade Avg.
          </span>

          <strong>
            {avg("finalGrade")}
          </strong>
        </div>

      </div>

      {/* BOTTOM ACTIONS */}

      <div className="bottom-actions">

        <button
          className="cancel-btn"
          onClick={() =>
            navigate("/students")
          }
        >
          ← Back
        </button>

        <button
          className="primary-btn"
          onClick={saveMarksheet}
        >
          💾 Save Marksheet
        </button>

      </div>

    </div>
  );
}

export default StudentDetails;