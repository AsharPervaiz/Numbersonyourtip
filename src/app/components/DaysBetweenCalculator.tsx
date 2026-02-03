"use client";
import { useState } from "react";

export default function DaysBetweenCalculator() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [days, setDays] = useState<number | null>(null);

  const calculateDays = () => {
    if (!startDate || !endDate) return;

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Calculate difference in milliseconds
    const diffTime = end.getTime() - start.getTime();

    // Convert to days
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    setDays(diffDays);
  };

  /* ✅ Clear function */
  const handleClear = () => {
    setStartDate("");
    setEndDate("");
    setDays(null);
  };

  return (
    <div className="calc-card">
      <h2 className="calc-title">Days Between Dates</h2>

      <input
        className="calc-input"
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        placeholder="Start Date"
      />

      <input
        className="calc-input"
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        placeholder="End Date"
      />

      {/* Buttons */}
      <div style={{ display: "flex", gap: "10px" }}>
        <button className="calc-button" onClick={calculateDays}>
          Calculate
        </button>
        <button className="calc-button calc-clear" onClick={handleClear}>
          Clear
        </button>
      </div>

      {days !== null && (
        <div className="calc-result">
          Number of Days: {days}
        </div>
      )}
    </div>
  );
}
