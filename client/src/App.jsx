import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import Navigation from "./components/Navbar"; // Import the navbar
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  async function fetchStudents() {
    try {
      const response = await fetch("http://localhost:3000/api/students", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log("Response status:", response.status); // Debug

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Received data:", data); // Debug
      setStudents(data);
      setError(null);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="App">
      {/* Navbar at the top */}
      <Navigation />

      {/* Main content area */}
      <main style={{ padding: "20px", minHeight: "calc(100vh - 200px)" }}>
        <h1>📚 Tutoring Platform</h1>
        <h2>Students</h2>

        {loading && <p>Loading...</p>}

        {error && (
          <div
            style={{
              padding: "15px",
              backgroundColor: "#f8d7da",
              color: "#721c24",
              borderRadius: "5px",
              marginBottom: "20px",
            }}
          >
            Error: {error}
            <button
              onClick={fetchStudents}
              style={{
                marginLeft: "15px",
                padding: "5px 10px",
                backgroundColor: "#721c24",
                color: "white",
                border: "none",
                borderRadius: "3px",
                cursor: "pointer",
              }}
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "20px",
            }}
          >
            {students.length === 0 ? (
              <p>No students found.</p>
            ) : (
              students.map((student) => (
                <div
                  key={student.student_id}
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    padding: "15px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
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
              ))
            )}
          </div>
        )}
      </main>

      {/* Optional Footer */}
      <footer
        style={{
          backgroundColor: "#f8f9fa",
          padding: "20px",
          textAlign: "center",
          marginTop: "40px",
          borderTop: "1px solid #ddd",
        }}
      >
        <p>© 2026 Tutoring Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
