"use client";
import { useState } from "react";

export default function GPAToPercentageCalculator() {
  const [gpa, setGpa] = useState("");
  const [scale, setScale] = useState("4");
  const [percentage, setPercentage] = useState<number | null>(null);

  const calculatePercentage = () => {
    const g = Number(gpa);
    const s = Number(scale);

    if (!g || !s) return;

    const result = (g / s) * 100;
    setPercentage(Number(result.toFixed(2)));
  };

  const clearAll = () => {
    setGpa("");
    setScale("4");
    setPercentage(null);
  };

  return (
    <div className="calc-card">
      <h2 className="calc-title">GPA to Percentage Calculator</h2>

      <input
        className="calc-input"
        type="number"
        step="0.01"
        placeholder="Enter GPA"
        value={gpa}
        onChange={(e) => setGpa(e.target.value)}
      />

      <select
        className="calc-input"
        value={scale}
        onChange={(e) => setScale(e.target.value)}
      >
        <option value="4">4.0 Scale</option>
        <option value="5">5.0 Scale</option>
        <option value="10">10.0 Scale</option>
      </select>

      <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
        <button className="calc-button" onClick={calculatePercentage}>
          Calculate
        </button>

        <button className="calc-button calc-clear" onClick={clearAll}>
          Clear
        </button>
      </div>

      {percentage !== null && (
        <div className="calc-result">
          Percentage: {percentage}%
        </div>
      )}
    </div>
  );
}
