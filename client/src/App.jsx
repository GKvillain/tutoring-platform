// client/src/App.jsx
// import { useState, useEffect } from "react";
import Navbar from "./components/Navigation";
import { Route, Routes } from "react-router-dom";
import { StatTutor } from "./pages/StatTutor";

function App() {
  return (
    <Routes>
      <Route path="Statistics" element={<StatTutor />} />
    </Routes>
  );
}

export default App;
