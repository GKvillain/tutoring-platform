import "./StatTutor.css";
import "../App.css";
import { useState, useEffect } from "react";
import Navigation from "../components/Navigation";

export function StatTutor() {
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchStatistics() {
      if (!selectedMonth || !selectedYear) return;

      setLoading(true);

      try {
        const yearParam =
          selectedYear === "all"
            ? "all"
            : (parseInt(selectedYear) - 543).toString();

        const res = await fetch(
          `http://localhost:3000/api/statistics?month=${selectedMonth}&year=${yearParam}`,
        );

        const data = await res.json();
        console.log(data);
        setStatistics(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchStatistics();
  }, [selectedMonth, selectedYear]);

  return (
    <>
      <Navigation />
      <article className="container">
        <h1 className="topic">รายงานสถิติการสอน</h1>

        {/* SELECT FILTER */}
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
            <option value="2568">2568</option>
            <option value="2569">2569</option>
          </select>
        </div>

        {loading && <p>กำลังโหลดข้อมูล...</p>}
        {!loading && statistics && <p>โหลดข้อมูลสำเร็จ</p>}

        <div className="d-flex gap-3 mt-4">
          <div className="block-stat">
            <h4>จำนวนชั่วโมงที่สอน</h4>
            <p>{statistics?.total_hours?.toFixed(2) || 0} ชม.</p>
          </div>

          <div className="block-stat">
            <h4>จำนวนนักเรียน</h4>
            <p>{statistics?.total_students || 0} คน</p>
          </div>

          <div className="block-stat">
            <h4>จำนวนคลาสที่สอน</h4>
            <p>{statistics?.total_classes || 0} คลาส</p>
          </div>

          <div className="block-stat">
            <h4>รายรับทั้งหมด</h4>
            <p>{Number(statistics?.total_income || 0).toLocaleString()} บาท</p>
          </div>
        </div>

        {loading ? (
          <p>กำลังโหลดข้อมูล...</p>
        ) : (
          <div>
            <h2>รายงานสถิติการสอนต่อคอร์ส</h2>
            <div className="layout-course">
              <h4>จำนวนชั่วโมงที่สอน</h4>
              <h4>จำนวนนักเรียน</h4>
              <h4>จำนวนคลาสที่สอน</h4>
              <h4>รายรับต่อคอร์ส</h4>
            </div>
          </div>
        )}
      </article>
    </>
  );
}
