import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/StudentDetails.css";

const emptyMark = (subject) => ({ subjectId: subject.id, subjectName: subject.name, articleReview: "", bookReview: "", assignment: "", finalGrade: "" });

function StudentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [marksheet, setMarksheet] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  const load = () => {
    const students = JSON.parse(localStorage.getItem("students") || "[]");
    const found = students.find((item) => String(item.id) === String(id));
    const savedSubjects = JSON.parse(localStorage.getItem("subjects") || "[]");
    setStudent(found || null);
    setSubjects(savedSubjects);
    if (found) setMarksheet(found.marksheet || []);
  };

  useEffect(() => { load(); }, [id]);

  const availableSubjects = useMemo(() => subjects.filter((s) => !marksheet.some((m) => String(m.subjectId) === String(s.id))), [subjects, marksheet]);

  if (!student) return <div className="details-page"><div className="detail-card"><h2>Student Not Found</h2><button className="primary-btn" onClick={() => navigate("/students")}>← Back to Students</button></div></div>;

  const updateMark = (index, field, value) => {
    const clean = value === "" ? "" : Math.max(0, Math.min(100, Number(value)));
    setMarksheet((current) => current.map((row, i) => i === index ? { ...row, [field]: clean } : row));
  };

  const saveMarksheet = () => {
    const students = JSON.parse(localStorage.getItem("students") || "[]");
    const updated = students.map((s) => String(s.id) === String(id) ? { ...s, marksheet } : s);
    localStorage.setItem("students", JSON.stringify(updated));
    setStudent(updated.find((s) => String(s.id) === String(id)));
    setMessage("Marksheet saved successfully.");
    setTimeout(() => setMessage(""), 2500);
  };

  const addSubject = () => {
    if (!selectedSubject) return;
    const subject = subjects.find((s) => String(s.id) === String(selectedSubject));
    if (!subject) return;
    setMarksheet((current) => [...current, emptyMark(subject)]);
    setSelectedSubject("");
  };

  const removeSubject = (subjectId) => {
    if (!window.confirm("Remove this subject from the student's marksheet?")) return;
    setMarksheet((current) => current.filter((row) => String(row.subjectId) !== String(subjectId)));
  };

  const totals = marksheet.reduce((acc, row) => {
    ["articleReview", "bookReview", "assignment", "finalGrade"].forEach((field) => {
      if (row[field] !== "" && row[field] != null) { acc[field] += Number(row[field]); acc.count[field] += 1; }
    });
    return acc;
  }, { articleReview: 0, bookReview: 0, assignment: 0, finalGrade: 0, count: { articleReview: 0, bookReview: 0, assignment: 0, finalGrade: 0 } });

  const avg = (field) => totals.count[field] ? (totals[field] / totals.count[field]).toFixed(1) : "-";

  return (
    <div className="details-page">
      <div className="details-header"><div><button className="back-link" onClick={() => navigate("/students")}>← Back to Students</button><h1>Student Marksheet</h1><p>Enter and save academic marks for each subject.</p></div><button className="primary-btn" onClick={saveMarksheet}>💾 Save Marksheet</button></div>

      {message && <div className="success-message">✓ {message}</div>}

      <div className="student-summary"><div className="big-avatar">{student.name.charAt(0).toUpperCase()}</div><div><h2>{student.name}</h2><div className="summary-grid"><span><b>Roll No:</b> {student.rollNo}</span><span><b>Course:</b> {student.course || "-"}</span><span><b>Email:</b> {student.email || "-"}</span><span><b>Phone:</b> {student.phone || "-"}</span></div></div></div>

      <div className="marksheet-card">
        <div className="marksheet-header"><div><h2>Academic Marksheet</h2><p>Marks are out of 100. Leave a field blank if not entered yet.</p></div><div className="subject-adder"><select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}><option value="">Add subject...</option>{availableSubjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select><button className="secondary-btn" onClick={addSubject} disabled={!selectedSubject}>+ Add</button></div></div>

        {marksheet.length === 0 ? <div className="empty-marksheet"><div>📄</div><h3>No subjects in this marksheet</h3><p>Add subjects from the Subjects page, then select them above.</p></div> : (
          <div className="marksheet-table-wrap"><table className="marksheet-table"><thead><tr><th>Subject</th><th>Article Review</th><th>Book Review</th><th>Assignment</th><th>Final Grades</th><th></th></tr></thead><tbody>{marksheet.map((row, index) => <tr key={`${row.subjectId}-${index}`}><td className="subject-name">{row.subjectName}</td>{["articleReview", "bookReview", "assignment", "finalGrade"].map((field) => <td key={field}><input className="mark-input" type="number" min="0" max="100" value={row[field]} placeholder="—" onChange={(e) => updateMark(index, field, e.target.value)} /></td>)}<td><button className="remove-subject" onClick={() => removeSubject(row.subjectId)} title="Remove subject">×</button></td></tr>)}</tbody><tfoot><tr><th>Average</th><th>{avg("articleReview")}</th><th>{avg("bookReview")}</th><th>{avg("assignment")}</th><th>{avg("finalGrade")}</th><th></th></tr></tfoot></table></div>
        )}
      </div>

      <div className="marks-summary"><div><span>Subjects</span><strong>{marksheet.length}</strong></div><div><span>Article Review Avg.</span><strong>{avg("articleReview")}</strong></div><div><span>Book Review Avg.</span><strong>{avg("bookReview")}</strong></div><div><span>Assignment Avg.</span><strong>{avg("assignment")}</strong></div><div><span>Final Grade Avg.</span><strong>{avg("finalGrade")}</strong></div></div>

      <div className="bottom-actions"><button className="cancel-btn" onClick={() => navigate("/students")}>← Back</button><button className="primary-btn" onClick={saveMarksheet}>💾 Save Marksheet</button></div>
    </div>
  );
}

export default StudentDetails;
