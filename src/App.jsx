import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import StudentDetails from "./pages/StudentDetails";
import Subjects from "./pages/Subjects";
import DashboardLayout from "./components/DashboardLayout";

function App() {
  const isLoggedIn =
    localStorage.getItem("students_record_admin") === "true";

  return (
    <Routes>

      <Route
        path="/login"
        element={
          isLoggedIn ? (
            <Navigate to="/" replace />
          ) : (
            <Login />
          )
        }
      />

      <Route
        path="/"
        element={
          isLoggedIn ? (
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/students"
        element={
          isLoggedIn ? (
            <DashboardLayout>
              <Students />
            </DashboardLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/students/:id"
        element={
          isLoggedIn ? (
            <DashboardLayout>
              <StudentDetails />
            </DashboardLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/subjects"
        element={
          isLoggedIn ? (
            <DashboardLayout>
              <Subjects />
            </DashboardLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>
  );
}

export default App;