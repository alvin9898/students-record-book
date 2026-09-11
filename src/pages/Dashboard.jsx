import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/Dashboard.css";

function Dashboard() {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const load = () => {
    setStudents(JSON.parse(localStorage.getItem("students") || "[]"));
    setSubjects(JSON.parse(localStorage.getItem("subjects") || "[]"));
  };

  useEffect(() => { load(); }, []);

  const assignmentCount = students.reduce((total, s) => total + (s.marksheet || []).filter((m) => m.assignment !== "" && m.assignment != null).length, 0);
  const finalGradeCount = students.reduce((total, s) => total + (s.marksheet || []).filter((m) => m.finalGrade !== "" && m.finalGrade != null).length, 0);

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div><h1>Students Record</h1><p>Manage and view student academic records.</p></div>
        <Link to="/students?add=true" className="dashboard-add-btn">+ Add Student</Link>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card"><div className="stat-icon">🎓</div><div><p>Total Students</p><h2>{students.length}</h2></div></div>
        <div className="stat-card"><div className="stat-icon">📚</div><div><p>Total Subjects</p><h2>{subjects.length}</h2></div></div>
        {/* <div className="stat-card"><div className="stat-icon">📝</div><div><p>Assignments Entered</p><h2>{assignmentCount}</h2></div></div>
        <div className="stat-card"><div className="stat-icon">🎓</div><div><p>Final Grades Entered</p><h2>{finalGradeCount}</h2></div></div> */}
      </div>

      <h2 className="section-title">Quick Actions</h2>
      <div className="quick-actions">
        <Link to="/students" className="quick-card"><div className="quick-icon">🎓</div><div><h3>View Students</h3><p>View and manage student records</p></div><span>→</span></Link>
        <Link to="/students?add=true" className="quick-card"><div className="quick-icon">➕</div><div><h3>Add Student</h3><p>Create a new student record</p></div><span>→</span></Link>
        <Link to="/subjects" className="quick-card"><div className="quick-icon">📚</div><div><h3>View Subjects</h3><p>Manage subjects and academic work</p></div><span>→</span></Link>
      </div>

      <div className="recent-card">
        <div className="recent-header"><div><h2>Recent Students</h2><p>Recently added student records</p></div><Link to="/students">View All</Link></div>
        {students.length === 0 ? (
          <div className="empty-dashboard"><div className="empty-dashboard-icon">🎓</div><h3>No Students Yet</h3><p>Add your first student to start managing records.</p><Link to="/students?add=true" className="dashboard-add-btn">+ Add Student</Link></div>
        ) : (
          <div className="recent-list">{students.slice(-5).reverse().map((student) => <Link className="recent-student" to={`/students/${student.id}`} key={student.id}><div className="student-avatar">{student.name?.charAt(0).toUpperCase()}</div><div><strong>{student.name}</strong><p>Roll No: {student.rollNo} · {student.course || "Course not set"}</p></div><span>→</span></Link>)}</div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
