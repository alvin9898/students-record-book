import { useEffect, useState } from "react";
import "../styles/Subjects.css";

const DEFAULT_SUBJECTS = [
  "Homiletics",
  "Mission & Church Growth",
  "OT Prophets",
  "Theology of Missions",
  "Old Testament Theology",
  "Pauline Thoughts",
];

function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [name, setName] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("subjects") || "[]");
    if (saved.length) setSubjects(saved);
    else {
      const defaults = DEFAULT_SUBJECTS.map((subjectName, i) => ({ id: Date.now() + i, name: subjectName }));
      setSubjects(defaults);
      localStorage.setItem("subjects", JSON.stringify(defaults));
    }
  }, []);

  const addSubject = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || subjects.some((s) => s.name.toLowerCase() === trimmed.toLowerCase())) return;
    const updated = [...subjects, { id: Date.now(), name: trimmed }];
    setSubjects(updated);
    localStorage.setItem("subjects", JSON.stringify(updated));
    setName("");
  };

  const deleteSubject = (id) => {
    if (!window.confirm("Delete this subject from the subject list? Existing marksheets are not automatically changed.")) return;
    const updated = subjects.filter((s) => s.id !== id);
    setSubjects(updated);
    localStorage.setItem("subjects", JSON.stringify(updated));
  };

  return <div className="subjects-page">
    <div className="subjects-header"><div><h1>Subjects</h1><p>Manage the subjects available for student marksheets.</p></div></div>
    <div className="subject-add-card"><div><h2>Add Subject</h2><p>Add another subject whenever you need it.</p></div><form onSubmit={addSubject}><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter subject name" /><button className="primary-btn">+ Add Subject</button></form></div>
    <div className="subjects-card"><div className="subjects-card-header"><h2>Subjects ({subjects.length})</h2><span>These can be added to any student's marksheet.</span></div>{subjects.map((subject, index) => <div className="subject-row" key={subject.id}><div><span className="subject-number">{index + 1}</span><strong>{subject.name}</strong></div><button className="delete-btn" onClick={() => deleteSubject(subject.id)}>Delete</button></div>)}</div>
  </div>;
}

export default Subjects;
