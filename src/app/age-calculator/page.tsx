"use client";
import { useState } from "react";

export default function AgeCalculator() {
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  const [age, setAge] = useState<string | null>(null);

  const monthsList = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  const yearsList = Array.from(
    { length: new Date().getFullYear() - 1899 },
    (_, i) => `${1900 + i}`
  );

  const daysList = Array.from({ length: 31 }, (_, i) => `${i + 1}`);

  const calculateAge = () => {
    if (!day || !month || !year) return;

    const monthIndex = monthsList.indexOf(month) + 1;
    const dobString = `${year}-${monthIndex}-${day}`;
    const birthDate = new Date(dobString);

    if (isNaN(birthDate.getTime())) {
      setAge("Invalid date");
      return;
    }

    const today = new Date();

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
      months -= 1;
      days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    setAge(`${years} years, ${months} months, ${days} days`);
  };

  const handleClear = () => {
    setDay("");
    setMonth("");
    setYear("");
    setAge(null);
  };

  return (
    <div className="single-page-padding">
      <div className="calc-card single-calc">
        <h2 className="calc-title">Age Calculator</h2>

        {/* Dropdown Fields */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
          {/* Day */}
          <select
            className="calc-input"
            value={day}
            onChange={(e) => setDay(e.target.value)}
          >
            <option value="">Day</option>
            {daysList.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          {/* Month */}
          <select
            className="calc-input"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          >
            <option value="">Month</option>
            {monthsList.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>

          {/* Year */}
          <select
            className="calc-input"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            <option value="">Year</option>
            {yearsList
              .slice()
              .reverse()
              .map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
          </select>
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: "10px" }}>
          <button className="calc-button" onClick={calculateAge}>
            Calculate
          </button>

          <button className="calc-button calc-clear" onClick={handleClear}>
            Clear
          </button>
        </div>

        {/* Result */}
        {age && (
          <div className="calc-result">
            <strong>Your Age:</strong> {age}
          </div>
        )}
      </div>
    </div>
  );
}
