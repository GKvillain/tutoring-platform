// client/src/components/Navbar.jsx
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "null"),
  );
  const [role, setRole] = useState(localStorage.getItem("role") || "");

  return (
    <nav id="navbar" className="navigation">
      <ul style={styles.navList}>
        {/* Logo - links to home */}
        <li style={styles.logoItem}>
          <Link to="/" style={styles.logoLink}>
            LOGO
          </Link>
        </li>

        {/* Teaching & Classes Dropdown */}
        <li>
          <div className="dropdown">
            <button
              className="btn dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              data-bs-target="dropdown"
            >
              การสอนและคาบเรียน
            </button>

            <ul className="dropdown-menu">
              <li>
                <Link to="/teaching/record" className="dropdown-item">
                  บันทึกการสอน
                </Link>
              </li>
              <li>
                <Link to="/teaching/stats" className="dropdown-item">
                  สถิติการสอน
                </Link>
              </li>
              <li>
                <Link to="/teaching/sessions" className="dropdown-item">
                  จัดการคาบเรียน
                </Link>
              </li>
            </ul>
          </div>
        </li>

        {/* Students Dropdown */}
        <li>
          <div className="dropdown">
            <button
              className="btn dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
            >
              นักเรียน
            </button>

            <ul className="dropdown-menu">
              <li>
                <Link to="/students/register" className="dropdown-item">
                  ลงทะเบียนนักเรียนใหม่
                </Link>
              </li>
              <li>
                <Link to="/students/enroll" className="dropdown-item">
                  ลงทะเบียนเรียนคอร์สใหม่
                </Link>
              </li>
            </ul>
          </div>
        </li>

        {/* Finance Dropdown */}
        <li>
          <div className="dropdown">
            <button
              className="btn dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
            >
              การเงิน
            </button>

            <ul className="dropdown-menu">
              <li>
                <Link to="/finance/payment-status" className="dropdown-item">
                  อัปเดตสถานะการชำระเงิน
                </Link>
              </li>
              <li>
                <Link to="/finance/reports" className="dropdown-item">
                  รายงานการเงิน
                </Link>
              </li>
            </ul>
          </div>
        </li>

        {/* Conditional Login/Logout based on user state */}
        <li style={styles.authItem}>
          {user ? (
            <button
              onClick={() => {
                localStorage.clear();
                setUser(null);
                window.location.href = "/";
              }}
              style={styles.logoutBtn}
            >
              Logout ({user.name})
            </button>
          ) : (
            <Link to="/login" style={styles.loginLink}>
              Login
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
}

// Optional inline styles for basic layout
const styles = {
  navList: {
    display: "flex",
    listStyle: "none",
    margin: 0,
    padding: "10px 20px",
    backgroundColor: "#f8f9fa",
    alignItems: "center",
    gap: "20px",
  },
  logoItem: {
    marginRight: "auto",
  },
  logoLink: {
    fontSize: "20px",
    fontWeight: "bold",
    textDecoration: "none",
    color: "#333",
  },
  authItem: {
    marginLeft: "auto",
  },
  loginLink: {
    textDecoration: "none",
    color: "#007bff",
    padding: "8px 16px",
    borderRadius: "4px",
    border: "1px solid #007bff",
  },
  logoutBtn: {
    padding: "8px 16px",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};
