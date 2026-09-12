import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const correctEmail = "admin@studentsrecord.com";
    const correctPassword = "admin123";

    if (
      email.trim().toLowerCase() === correctEmail &&
      password === correctPassword
    ) {
      localStorage.setItem("students_record_admin", "true");

      // Force the application to re-read the login state
      window.location.href = "/";
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-logo">
          Students <span>Record</span>
        </div>

        <p className="login-subtitle">
          Admin Portal
        </p>

        <div className="login-icon">
          🔐
        </div>

        <h1>Welcome Back</h1>

        <p className="login-description">
          Sign in to manage student records.
        </p>

        {error && (
          <div className="login-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Email Address</label>

            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              placeholder="Enter admin email"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              placeholder="Enter password"
              required
            />
          </div>

          <button
            type="submit"
            className="login-btn"
          >
            Sign In as Admin
          </button>

        </form>

        <div className="login-footer">
          🔒 Admin access only
        </div>

      </div>
    </div>
  );
}

export default Login;