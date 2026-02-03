"use client";
import { useState } from "react";

export default function DaysBetweenCalculator() {
  const [startDay, setStartDay] = useState("");
  const [startMonth, setStartMonth] = useState("");
  const [startYear, setStartYear] = useState("");

  const [endDay, setEndDay] = useState("");
  const [endMonth, setEndMonth] = useState("");
  const [endYear, setEndYear] = useState("");

  const [days, setDays] = useState<number | null>(null);

  const monthsList = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  const currentYear = new Date().getFullYear();
  const yearsList = Array.from(
    { length: currentYear - 1899 },
    (_, i) => `${1900 + i}`
  );

  const daysList = Array.from({ length: 31 }, (_, i) => `${i + 1}`);

  const calculateDays = () => {
    if (!startDay || !startMonth || !startYear) return;
    if (!endDay || !endMonth || !endYear) return;

    const sMonthIndex = monthsList.indexOf(startMonth) + 1;
    const eMonthIndex = monthsList.indexOf(endMonth) + 1;

    const start = new Date(`${startYear}-${sMonthIndex}-${startDay}`);
    const end = new Date(`${endYear}-${eMonthIndex}-${endDay}`);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      setDays(null);
      return;
    }

    const diff = end.getTime() - start.getTime();
    const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));

    setDays(diffDays);
  };

  const handleClear = () => {
    setStartDay("");
    setStartMonth("");
    setStartYear("");
    setEndDay("");
    setEndMonth("");
    setEndYear("");
    setDays(null);
  };

  return (
    <div className="single-page-padding">
      <div className="calc-card single-calc">
        <h2 className="calc-title">Days Between Dates</h2>

        {/* Start Date */}
        <div style={{ marginBottom: "10px", fontWeight: 700 }}>
  Start Date
</div>
        <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
          <select className="calc-input" value={startDay} onChange={(e) => setStartDay(e.target.value)}>
            <option value="">Day</option>
            {daysList.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>

          <select className="calc-input" value={startMonth} onChange={(e) => setStartMonth(e.target.value)}>
            <option value="">Month</option>
            {monthsList.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>

          <select className="calc-input" value={startYear} onChange={(e) => setStartYear(e.target.value)}>
            <option value="">Year</option>
            {yearsList.slice().reverse().map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        {/* End Date */}
        <div style={{ marginBottom: "10px", fontWeight: 700 }}>
  End Date
</div>
        <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
          <select className="calc-input" value={endDay} onChange={(e) => setEndDay(e.target.value)}>
            <option value="">Day</option>
            {daysList.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>

          <select className="calc-input" value={endMonth} onChange={(e) => setEndMonth(e.target.value)}>
            <option value="">Month</option>
            {monthsList.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>

          <select className="calc-input" value={endYear} onChange={(e) => setEndYear(e.target.value)}>
            <option value="">Year</option>
            {yearsList.slice().reverse().map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        {/* Buttons — unchanged */}
        <div style={{ display: "flex", gap: "10px" }}>
          <button className="calc-button" onClick={calculateDays}>Calculate</button>
          <button className="calc-button calc-clear" onClick={handleClear}>Clear</button>
        </div>

        {days !== null && (
          <div className="calc-result">Number of Days: {days}</div>
        )}
      </div>
    </div>
  );
}
