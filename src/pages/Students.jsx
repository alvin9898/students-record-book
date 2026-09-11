import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "../styles/Students.css";

const emptyForm = { name: "", rollNo: "", email: "", phone: "", course: "" };

function Students() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(searchParams.get("add") === "true");
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    setStudents(JSON.parse(localStorage.getItem("students") || "[]"));
    setShowForm(searchParams.get("add") === "true");
  }, [searchParams]);

  const saveStudents = (data) => {
    setStudents(data);
    localStorage.setItem("students", JSON.stringify(data));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const subjects = JSON.parse(localStorage.getItem("subjects") || "[]");
    const newStudent = {
      id: Date.now(),
      ...form,
      marksheet: subjects.map((subject) => ({ subjectId: subject.id, subjectName: subject.name, articleReview: "", bookReview: "", assignment: "", finalGrade: "" }))
    };
    saveStudents([...students, newStudent]);
    setForm(emptyForm);
    setShowForm(false);
    navigate(`/students/${newStudent.id}`);
  };

  const deleteStudent = (id) => {
    if (!window.confirm("Delete this student and their marksheet?")) return;
    saveStudents(students.filter((student) => student.id !== id));
  };

  const filteredStudents = students.filter((student) => `${student.name} ${student.rollNo} ${student.email} ${student.course}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="students-page">
      <div className="students-header">
        <div><h1>Students</h1><p>Manage student records and academic information.</p></div>
        <button className="primary-btn" onClick={() => { setShowForm(true); navigate("/students?add=true"); }}>+ Add Student</button>
      </div>

      {showForm && (
        <div className="student-form-card">
          <div className="form-header"><div><h2>Add New Student</h2><p>Enter the student's information below.</p></div><button className="close-form" onClick={() => { setShowForm(false); navigate("/students"); }}>×</button></div>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group"><label>Student Name *</label><input name="name" placeholder="Enter full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
              <div className="form-group"><label>Roll Number *</label><input name="rollNo" placeholder="e.g. 001" value={form.rollNo} onChange={(e) => setForm({ ...form, rollNo: e.target.value })} required /></div>
              <div className="form-group"><label>Email</label><input type="email" name="email" placeholder="student@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
              <div className="form-group"><label>Phone Number</label><input name="phone" placeholder="Enter phone number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
              <div className="form-group full-width"><label>Course</label><input name="course" placeholder="e.g. B.Th" value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })} /></div>
            </div>
            <div className="form-actions"><button type="button" className="cancel-btn" onClick={() => { setShowForm(false); navigate("/students"); }}>Cancel</button><button type="submit" className="primary-btn">Save Student</button></div>
          </form>
        </div>
      )}

      <div className="students-toolbar"><input className="search-input" placeholder="🔍 Search by name, roll number, email or course..." value={search} onChange={(e) => setSearch(e.target.value)} /><span className="student-count">{filteredStudents.length} of {students.length} student{students.length !== 1 ? "s" : ""}</span></div>

      <div className="students-card">
        {filteredStudents.length === 0 ? (
          <div className="empty-students"><div className="empty-icon">🎓</div><h2>{students.length ? "No Students Found" : "No Students Yet"}</h2><p>{students.length ? "Try a different search." : "Add your first student to create their marksheet."}</p>{!students.length && <button className="primary-btn" onClick={() => { setShowForm(true); navigate("/students?add=true"); }}>+ Add Student</button>}</div>
        ) : (
          <div className="table-wrapper"><table><thead><tr><th>Student</th><th>Roll Number</th><th>Email</th><th>Course</th><th>Marksheet</th><th>Actions</th></tr></thead><tbody>{filteredStudents.map((student) => <tr key={student.id}><td><div className="student-cell"><div className="student-table-avatar">{student.name?.charAt(0).toUpperCase()}</div><strong>{student.name}</strong></div></td><td>{student.rollNo}</td><td>{student.email || "-"}</td><td>{student.course || "-"}</td><td><button className="view-btn" onClick={() => navigate(`/students/${student.id}`)}>📄 Open Marksheet</button></td><td><div className="actions"><button className="view-btn" onClick={() => navigate(`/students/${student.id}`)}>View</button><button className="delete-btn" onClick={() => deleteStudent(student.id)}>Delete</button></div></td></tr>)}</tbody></table></div>
        )}
      </div>
    </div>
  );
}

export default Students;
