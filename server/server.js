import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

// Test endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running!" });
});

// Get all students
app.get("/api/students", async (req, res) => {
  const { data, error } = await supabase.from("student").select("*");

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.get("/api/classsession", async (req, res) => {
  try {
    const { month, year } = req.query;

    let query = supabase.from("classsession").select("*");

    if (month !== "all" && year !== "all" && month && year) {
      const startDate = `${year}-${month}-01`;

      const nextMonth =
        parseInt(month) === 12
          ? `${parseInt(year) + 1}-01-01`
          : `${year}-${String(parseInt(month) + 1).padStart(2, "0")}-01`;

      query = query
        .gte("session_date", startDate)
        .lt("session_date", nextMonth);
    }

    const { data, error } = await query;

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error("Backend Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/StatTutor");

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
