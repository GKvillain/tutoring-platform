import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";

function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  async function fetchStudents() {
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
    setLoading(false);
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>📚 Tutoring Platform</h1>
      <h2>Students</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          {students.map((student) => (
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
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
