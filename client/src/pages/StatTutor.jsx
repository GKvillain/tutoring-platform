import "./StatTutor.css";
import "../App.css";
import { useState, useEffect } from "react";
import { useMemo } from "react";
import Navigation from "../components/Navigation";

export function StatTutor() {
  const [classSessions, setClassSession] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log(
      "Selected Month:",
      selectedMonth,
      "Selected Year:",
      selectedYear,
    );

    // Don't fetch if both month and year are empty
    if (!selectedMonth && !selectedYear) {
      console.log("No month or year selected");
      return;
    }

    async function fetchClassSession() {
      try {
        setLoading(true);
        console.log("Fetching data for:", {
          month: selectedMonth,
          year: selectedYear,
        });

        // Build URL based on selections
        let url = "http://localhost:3000/api/classsession";
        const params = [];

        // Handle "all" option - you might want to not send the parameter at all
        // or handle it differently based on your backend
        if (selectedMonth && selectedMonth !== "all" && selectedMonth !== "") {
          params.push(`month=${selectedMonth}`);
        }

        if (selectedYear && selectedYear !== "all" && selectedYear !== "") {
          params.push(`year=${selectedYear}`);
        }

        // If we have parameters, add them to URL
        if (params.length > 0) {
          url += "?" + params.join("&");
        }

        console.log("Fetching from URL:", url);

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("DATA FROM BACKEND:", data);

        // Make sure we're setting an array
        setClassSession(Array.isArray(data) ? data : []);
      } catch (error) {
        console.log("Error fetching data:", error);
        setClassSession([]); // Clear data on error
      } finally {
        setLoading(false);
      }
    }

    fetchClassSession();
  }, [selectedMonth, selectedYear]); // This should trigger when either changes

  const statistics = useMemo(() => {
    console.log("Recalculating statistics with:", classSessions);

    const safeSessions = Array.isArray(classSessions) ? classSessions : [];

    function calculateHours(startTime, endTime) {
      if (!startTime || !endTime) return 0;

      const [sh, sm] = startTime.split(":").map(Number);
      const [eh, em] = endTime.split(":").map(Number);

      let startMinutes = sh * 60 + sm;
      let endMinutes = eh * 60 + em;

      if (endMinutes < startMinutes) {
        endMinutes += 24 * 60;
      }

      return (endMinutes - startMinutes) / 60;
    }

    const totalHours = safeSessions.reduce((sum, session) => {
      const hours = calculateHours(session.start_time, session.end_time);
      return sum + hours;
    }, 0);

    const totalIncome = safeSessions.reduce(
      (sum, session) => sum + (session.price || 0),
      0,
    );

    const totalClasses = safeSessions.length;

    const uniqueStudents = new Set(
      safeSessions.map((session) => session.student_Id).filter((id) => id), // Filter out null/undefined
    );

    return {
      totalHours: totalHours.toFixed(2),
      totalIncome: totalIncome,
      totalClasses,
      totalStudents: uniqueStudents.size,
    };
  }, [classSessions]);

  // Handle month change
  const handleMonthChange = (e) => {
    const newMonth = e.target.value;
    console.log("Month changed to:", newMonth);
    setSelectedMonth(newMonth);
  };

  // Handle year change
  const handleYearChange = (e) => {
    const newYear = e.target.value;
    console.log("Year changed to:", newYear);
    setSelectedYear(newYear);
  };

  // Clear filters
  const handleClearFilters = () => {
    setSelectedMonth("");
    setSelectedYear("");
  };

  return (
    <>
      <Navigation />

      <article className="container">
        <h1 className="topic">รายงานสถิติการสอน</h1>
        <div className="d-flex align-items-center gap-3">
          <h3>รายงานสถิติการสอนทั้งหมด</h3>
          <select
            value={selectedMonth}
            onChange={handleMonthChange}
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
            onChange={handleYearChange}
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

          {(selectedMonth || selectedYear) && (
            <button onClick={handleClearFilters} className="btn-clear">
              ล้างตัวกรอง
            </button>
          )}
        </div>

        {loading && <p>กำลังโหลด...</p>}

        {!loading && classSessions.length === 0 && (
          <p>ไม่มีข้อมูลการสอนในช่วงเวลาที่เลือก</p>
        )}

        <div className="d-flex gap-3">
          <div className="block-stat">
            <h4>จำนวนชั่วโมงที่สอน</h4>
            <p>{statistics.totalHours}</p>
          </div>
          <div className="block-stat">
            <h4>จำนวนนักเรียน</h4>
            <p>{statistics.totalStudents}</p>
          </div>
          <div className="block-stat">
            <h4>จำนวนคลาสที่สอน</h4>
            <p>{statistics.totalClasses}</p>
          </div>
          <div className="block-stat">
            <h4>รายรับทั้งหมด</h4>
            <p>{statistics.totalIncome}</p>
          </div>
        </div>

        <div>
          <h3>รายงานสถิติการสอนต่อคอร์ส</h3>
          <div>
            {classSessions.map((session) => {
              // Calculate hours for display
              const hours = (() => {
                if (!session.start_time || !session.end_time) return 0;
                const [sh, sm] = session.start_time.split(":").map(Number);
                const [eh, em] = session.end_time.split(":").map(Number);
                let startMinutes = sh * 60 + sm;
                let endMinutes = eh * 60 + em;
                if (endMinutes < startMinutes) endMinutes += 24 * 60;
                return ((endMinutes - startMinutes) / 60).toFixed(1);
              })();

              return (
                <div key={session.session_id}>
                  {session.courseName || "ไม่มีชื่อคอร์ส"} - {hours} ชม.
                  {session.price ? ` (ราคา: ${session.price} บาท)` : ""}
                </div>
              );
            })}
          </div>
        </div>
      </article>
    </>
  );
}
