// client/src/App.jsx
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";

function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  async function fetchStudents() {
    try {
      // ✅ NO TOKEN REQUIRED - Public endpoint
      const response = await fetch("http://localhost:3000/api/students");

      console.log("Response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Received data:", data);
      setStudents(data);
      setError(null);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Styles
  const styles = {
    container: {
      minHeight: "100vh",
      backgroundColor: "#f5f5f5",
    },
    main: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "20px",
    },
    title: {
      color: "#333",
      marginBottom: "20px",
      fontSize: "2.5rem",
    },
    subtitle: {
      color: "#666",
      marginBottom: "30px",
      fontSize: "1.2rem",
    },
    studentGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
      gap: "20px",
    },
    studentCard: {
      border: "1px solid #ddd",
      borderRadius: "8px",
      padding: "15px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      backgroundColor: "white",
      transition: "transform 0.2s, box-shadow 0.2s",
      cursor: "pointer",
    },
    loadingContainer: {
      textAlign: "center",
      padding: "50px",
      fontSize: "1.2rem",
      color: "#666",
    },
    errorContainer: {
      textAlign: "center",
      padding: "50px",
      color: "red",
      backgroundColor: "#ffe6e6",
      borderRadius: "8px",
      margin: "20px 0",
    },
    retryButton: {
      padding: "10px 20px",
      backgroundColor: "#667eea",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      marginTop: "10px",
      fontSize: "1rem",
    },
    emptyState: {
      textAlign: "center",
      padding: "50px",
      color: "#666",
      backgroundColor: "white",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    },
    stats: {
      display: "flex",
      gap: "20px",
      marginBottom: "30px",
      padding: "20px",
      backgroundColor: "white",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    },
    statItem: {
      flex: 1,
      textAlign: "center",
    },
    statNumber: {
      fontSize: "2rem",
      fontWeight: "bold",
      color: "#667eea",
    },
    statLabel: {
      color: "#666",
      marginTop: "5px",
    },
  };

  // Calculate some stats
  const totalStudents = students.length;
  const averageAge = students.length
    ? Math.round(
        students.reduce((sum, s) => sum + (s.age || 0), 0) / students.length,
      )
    : 0;
  const grades = [
    ...new Set(students.map((s) => s.student_grade_level)),
  ].sort();

  return (
    <div style={styles.container}>
      <Navbar />

      <main style={styles.main}>
        <h1 style={styles.title}>📚 Tutoring Platform - Student Directory</h1>
        <p style={styles.subtitle}>
          This is a public reference page showing all students in the system
        </p>

        {/* Stats Section */}
        {!loading && !error && students.length > 0 && (
          <div style={styles.stats}>
            <div style={styles.statItem}>
              <div style={styles.statNumber}>{totalStudents}</div>
              <div style={styles.statLabel}>Total Students</div>
            </div>
            <div style={styles.statItem}>
              <div style={styles.statNumber}>{grades.length}</div>
              <div style={styles.statLabel}>Grade Levels</div>
            </div>
            <div style={styles.statItem}>
              <div style={styles.statNumber}>{averageAge}</div>
              <div style={styles.statLabel}>Average Age</div>
            </div>
          </div>
        )}

        {loading && (
          <div style={styles.loadingContainer}>
            <p>Loading students...</p>
          </div>
        )}

        {error && (
          <div style={styles.errorContainer}>
            <p>Error: {error}</p>
            <button onClick={fetchStudents} style={styles.retryButton}>
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            {students.length === 0 ? (
              <div style={styles.emptyState}>
                <p style={{ fontSize: "1.2rem", marginBottom: "10px" }}>
                  📭 No students found
                </p>
                <p style={{ color: "#999" }}>
                  The database might be empty. Add some students to see them
                  here.
                </p>
              </div>
            ) : (
              <>
                {/* Grade Filter (optional) */}
                <div style={{ marginBottom: "20px" }}>
                  <select
                    onChange={(e) => {
                      // You can add filter functionality here
                      console.log("Filter by grade:", e.target.value);
                    }}
                    style={{
                      padding: "8px",
                      borderRadius: "4px",
                      border: "1px solid #ddd",
                    }}
                  >
                    <option value="">All Grades</option>
                    {grades.map((grade) => (
                      <option key={grade} value={grade}>
                        {grade}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={styles.studentGrid}>
                  {students.map((student) => (
                    <div
                      key={student.student_id}
                      style={styles.studentCard}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-4px)";
                        e.currentTarget.style.boxShadow =
                          "0 4px 8px rgba(0,0,0,0.15)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow =
                          "0 2px 4px rgba(0,0,0,0.1)";
                      }}
                    >
                      <h3>
                        {student.student_Fname} {student.student_Lname}
                      </h3>
                      <p>
                        <strong>Nickname:</strong> {student.nickname || "—"}
                      </p>
                      <p>
                        <strong>Grade:</strong> {student.student_grade_level}
                      </p>
                      <p>
                        <strong>Age:</strong> {student.age || "—"}
                      </p>
                      <p>
                        <strong>School:</strong> {student.school || "—"}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </main>

      <footer
        style={{
          textAlign: "center",
          padding: "20px",
          backgroundColor: "#f8f9fa",
          borderTop: "1px solid #ddd",
          marginTop: "40px",
        }}
      >
        <p>© 2026 Tutoring Platform - Reference Implementation</p>
        <p style={{ color: "#999", fontSize: "0.9rem", marginTop: "5px" }}>
          This is a public demo page. No login required.
        </p>
      </footer>
    </div>
  );
}

export default App;
