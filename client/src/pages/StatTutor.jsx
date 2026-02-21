import "./StatTutor.css";
import "../App.css";
import { useState, useEffect, useMemo } from "react";
import Navigation from "../components/Navigation";

export function StatTutor() {
  const [classSessions, setClassSession] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [loading, setLoading] = useState(false); // Re-enabled loading

  useEffect(() => {
    async function fetchClassSession() {
      // Don't fetch if no selection has been made yet (optional)
      if (!selectedMonth || !selectedYear) return;

      setLoading(true);
      try {
        const yearParam =
          selectedYear === "all" ? "all" : parseInt(selectedYear) - 543;
        const response = await fetch(
          `http://localhost:3000/api/classsession?month=${selectedMonth}&year=${yearParam}`,
        );
        const data = await response.json();
        setClassSession(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch sessions:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchClassSession();
  }, [selectedMonth, selectedYear]);

  // Combined logic for calculations
  const statistics = useMemo(() => {
    const safeSessions = Array.isArray(classSessions) ? classSessions : [];

    function calculateHours(startTime, endTime) {
      if (!startTime || !endTime) return 0;
      const [sh, sm] = startTime.split(":").map(Number);
      const [eh, em] = endTime.split(":").map(Number);

      let startMinutes = sh * 60 + sm;
      let endMinutes = eh * 60 + em;

      if (endMinutes < startMinutes) {
        endMinutes += 24 * 60; // Over-night session handling
      }
      return (endMinutes - startMinutes) / 60;
    }

    const totalHours = safeSessions.reduce((sum, session) => {
      return sum + calculateHours(session.start_time, session.end_time);
    }, 0);

    const totalIncome = safeSessions.reduce(
      (sum, session) => sum + (session.price || 0),
      0,
    );

    return {
      totalHours: totalHours.toFixed(2),
      totalIncome: totalIncome.toLocaleString(),
      totalClasses: safeSessions.length,
      // You might need a unique count for students depending on your data structure
      totalStudents: [...new Set(safeSessions.map((s) => s.student_id))].length,
    };
  }, [classSessions]);

  return (
    <>
      <Navigation />
      <article className="container">
        <h1 className="topic">รายงานสถิติการสอน</h1>
        <div className="d-flex align-items-center gap-3">
          <h3>รายงานสถิติการสอนทั้งหมด</h3>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="selectStat"
          >
            <option value="" disabled hidden>
              เดือน
            </option>
            <option value="all">ทั้งหมด</option>
            <option value="01">มกราคม</option>
            <option value="02">กุมภาพันธ์</option>
            <option value="03">มีนาคม</option>
            <option value="04">เมษายน</option>
            <option value="05">พฤษภาคม</option>
            <option value="06">มิถุนายน</option>
            <option value="07">กรกฎาคม</option>
            <option value="08">สิงหาคม</option>
            <option value="09">กันยายน</option>
            <option value="10">ตุลาคม</option>
            <option value="11">พฤศจิกายน</option>
            <option value="12">ธันวาคม</option>
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="selectStat"
          >
            <option value="" disabled hidden>
              ปี
            </option>
            <option value="all">ทั้งหมด</option>
            <option value="2568" className="yearNum">
              2568
            </option>
            <option value="2569" className="yearNum">
              2569
            </option>
          </select>
        </div>

        {loading ? (
          <p>กำลังโหลดข้อมูล...</p>
        ) : (
          <>
            <div className="d-flex gap-3 mt-4">
              <div className="block-stat">
                <h4>จำนวนชั่วโมงที่สอน</h4>
                <p>{statistics.totalHours} ชม.</p>
              </div>
              <div className="block-stat">
                <h4>จำนวนนักเรียน</h4>
                <p>{statistics.totalStudents} คน</p>
              </div>
              <div className="block-stat">
                <h4>จำนวนคลาสที่สอน</h4>
                <p>{statistics.totalClasses} คลาส</p>
              </div>
              <div className="block-stat">
                <h4>รายรับทั้งหมด</h4>
                <p>{statistics.totalIncome} บาท</p>
              </div>
            </div>

            <div className="mt-5">
              <h3>รายละเอียดรายคลาส</h3>
              <div className="session-list">
                {classSessions.map((session, index) => (
                  <div
                    key={session.session_id || index}
                    className="session-item"
                  >
                    {session.course_name || "ไม่มีชื่อคอร์ส"} -{" "}
                    {session.start_time} ถึง {session.end_time}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </article>
    </>
  );
}
