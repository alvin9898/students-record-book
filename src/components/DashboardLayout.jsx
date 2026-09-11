import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/DashboardLayout.css";

function DashboardLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("students_record_admin");
    navigate("/login");
  };

  const menuItems = [
    { name: "Dashboard", path: "/", icon: "📊" },
    { name: "Students", path: "/students", icon: "👨‍🎓" },
    { name: "Subjects", path: "/subjects", icon: "📚" },
  ];

  const activePath = location.pathname.startsWith("/students/") ? "/students" : location.pathname;
  const getPageTitle = () => {
    if (activePath === "/") return "Dashboard";
    if (activePath === "/students") return "Students";
    if (activePath === "/subjects") return "Subjects";
    return "Students Record";
  };

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="logo"><span>Students</span> Record</div>
        <div className="admin-info">
          <div className="admin-avatar">A</div>
          <div className="admin-text"><strong>Administrator</strong><small>Admin</small></div>
        </div>
        <div className="menu-title"></div>
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link key={item.path} to={item.path} className={activePath === item.path ? "nav-item active" : "nav-item"}>
              <span className="nav-icon">{item.icon}</span><span>{item.name}</span>
            </Link>
          ))}
        </nav>
        <button className="logout-btn" onClick={handleLogout}>🚪 <span>Logout</span></button>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div><h2>{getPageTitle()}</h2><p>Manage your student records</p></div>
          <div className="admin-menu">
            <button className="admin-profile" onClick={() => setShowMenu((v) => !v)}>
              <div className="profile-avatar">A</div>
              <div className="profile-info"><strong>Administrator</strong><small>Admin</small></div>
              <span className="arrow">⌄</span>
            </button>
            {showMenu && <div className="profile-dropdown"><button onClick={handleLogout}>🚪 Logout</button></div>}
          </div>
        </header>
        <section className="page-content">{children}</section>
      </main>
    </div>
  );
}

export default DashboardLayout;
