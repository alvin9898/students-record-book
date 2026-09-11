import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import StudentDetails from "./pages/StudentDetails";
import Subjects from "./pages/Subjects";
import DashboardLayout from "./components/DashboardLayout";

const DEFAULT_SUBJECTS = [
  "Homiletics",
  "Mission & Church Growth",
  "OT Prophets",
  "Theology of Missions",
  "Old Testament Theology",
  "Pauline Thoughts",
];

function App() {
  const savedSubjects = JSON.parse(localStorage.getItem("subjects") || "[]");
  if (savedSubjects.length === 0) {
    const defaults = DEFAULT_SUBJECTS.map((name, index) => ({ id: Date.now() + index, name }));
    localStorage.setItem("subjects", JSON.stringify(defaults));
  }

  const isLoggedIn = localStorage.getItem("students_record_admin") === "true";

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/*"
        element={
          isLoggedIn ? (
            <DashboardLayout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/students" element={<Students />} />
                <Route path="/students/:id" element={<StudentDetails />} />
                <Route path="/subjects" element={<Subjects />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </DashboardLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
}

export default App;
