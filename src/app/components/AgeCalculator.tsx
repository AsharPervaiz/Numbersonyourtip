"use client";
import { useState } from "react";

export default function AgeCalculator() {
  const [dob, setDob] = useState("");
  const [age, setAge] = useState<string | null>(null);

  const calculateAge = () => {
    if (!dob) return;

    const birthDate = new Date(dob);
    const today = new Date();

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
      months -= 1;
      days += new Date(
        today.getFullYear(),
        today.getMonth(),
        0
      ).getDate();
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    setAge(`${years} years, ${months} months, ${days} days`);
  };

  /* ✅ Clear function */
  const handleClear = () => {
    setDob("");
    setAge(null);
  };

  return (
    <div className="calc-card">
      <h2 className="calc-title">Age Calculator</h2>

      <input
        className="calc-input"
        type="date"
        value={dob}
        onChange={(e) => setDob(e.target.value)}
      />

      {/* Buttons */}
      <div style={{ display: "flex", gap: "10px" }}>
        <button className="calc-button" onClick={calculateAge}>
          Calculate
        </button>
        <button className="calc-button calc-clear" onClick={handleClear}>
          Clear
        </button>
      </div>

      {age && (
        <div className="calc-result">
          <strong>Your Age:</strong> {age}
        </div>
      )}
    </div>
  );
}
