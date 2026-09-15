import { useEffect, useState } from "react";
import "../styles/Subjects.css";

const API_URL = "https://students-record-book.onrender.com/api";

function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  // =========================
  // LOAD SUBJECTS FROM MONGODB
  // =========================

  const loadSubjects = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/subjects`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load subjects"
        );
      }

      setSubjects(data.subjects || []);
    } catch (error) {
      console.error(
        "Failed to load subjects:",
        error
      );

      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubjects();
  }, []);

  // =========================
  // ADD SUBJECT
  // =========================

  const addSubject = async (e) => {
    e.preventDefault();

    const trimmed = name.trim();

    if (!trimmed) {
      return;
    }

    const alreadyExists = subjects.some(
      (subject) =>
        subject.name.toLowerCase() ===
        trimmed.toLowerCase()
    );

    if (alreadyExists) {
      alert("This subject already exists.");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/subjects`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: trimmed,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to add subject"
        );
      }

      setSubjects((current) => [
        ...current,
        data.subject,
      ]);

      setName("");
    } catch (error) {
      console.error(
        "Add subject error:",
        error
      );

      alert(error.message);
    }
  };

  // =========================
  // DELETE SUBJECT
  // =========================

  const deleteSubject = async (id) => {
    if (
      !window.confirm(
        "Delete this subject from the subject list? Existing marksheets are not automatically changed."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/subjects/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete subject"
        );
      }

      setSubjects((current) =>
        current.filter(
          (subject) => subject._id !== id
        )
      );
    } catch (error) {
      console.error(
        "Delete subject error:",
        error
      );

      alert(error.message);
    }
  };

  return (
    <div className="subjects-page">

      {/* HEADER */}

      <div className="subjects-header">
        <div>
          <h1>Subjects</h1>

          <p>
            Manage the subjects available for
            student marksheets.
          </p>
        </div>
      </div>

      {/* ADD SUBJECT */}

      <div className="subject-add-card">

        <div>
          <h2>Add Subject</h2>

          <p>
            Add another subject whenever you
            need it.
          </p>
        </div>

        <form onSubmit={addSubject}>

          <input
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            placeholder="Enter subject name"
          />

          <button
            type="submit"
            className="primary-btn"
          >
            + Add Subject
          </button>

        </form>

      </div>

      {/* SUBJECT LIST */}

      <div className="subjects-card">

        <div className="subjects-card-header">

          <h2>
            Subjects ({subjects.length})
          </h2>

          <span>
            These can be added to any
            student's marksheet.
          </span>

        </div>

        {loading ? (

          <div className="empty-subjects">
            <p>
              Loading subjects...
            </p>
          </div>

        ) : subjects.length === 0 ? (

          <div className="empty-subjects">
            <p>
              No subjects available.
            </p>
          </div>

        ) : (

          subjects.map((subject, index) => (

            <div
              className="subject-row"
              key={subject._id}
            >

              <div>
                <span className="subject-number">
                  {index + 1}
                </span>

                <strong>
                  {subject.name}
                </strong>
              </div>

              <button
                className="delete-btn"
                onClick={() =>
                  deleteSubject(
                    subject._id
                  )
                }
              >
                Delete
              </button>

            </div>

          ))

        )}

      </div>

    </div>
  );
}

export default Subjects;