"use client";
import { useState } from "react";

export default function TimeCalculator() {
  const [days, setDays] = useState("");
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [seconds, setSeconds] = useState("");
  const [mode, setMode] = useState<"add" | "sub">("add");
  const [result, setResult] = useState<string | null>(null);

  const calculateTime = () => {
    const d = Number(days) || 0;
    const h = Number(hours) || 0;
    const m = Number(minutes) || 0;
    const s = Number(seconds) || 0;

    let totalSeconds = d * 86400 + h * 3600 + m * 60 + s;

    if (mode === "sub") {
      totalSeconds = Math.max(0, -totalSeconds);
    }

    const rd = Math.floor(totalSeconds / 86400);
    const rh = Math.floor((totalSeconds % 86400) / 3600);
    const rm = Math.floor((totalSeconds % 3600) / 60);
    const rs = totalSeconds % 60;

    setResult(`${rd} days ${rh} hrs ${rm} min ${rs} sec`);
  };

  /* ✅ Clear function */
  const handleClear = () => {
    setDays("");
    setHours("");
    setMinutes("");
    setSeconds("");
    setMode("add");
    setResult(null);
  };

  return (
    <div className="calc-card">
      <h2 className="calc-title">Time Calculator</h2>

      <input
        className="calc-input"
        type="number"
        placeholder="Days"
        value={days}
        onChange={(e) => setDays(e.target.value)}
      />

      <input
        className="calc-input"
        type="number"
        placeholder="Hours"
        value={hours}
        onChange={(e) => setHours(e.target.value)}
      />

      <input
        className="calc-input"
        type="number"
        placeholder="Minutes"
        value={minutes}
        onChange={(e) => setMinutes(e.target.value)}
      />

      <input
        className="calc-input"
        type="number"
        placeholder="Seconds"
        value={seconds}
        onChange={(e) => setSeconds(e.target.value)}
      />

      {/* Add / Subtract Toggle */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <div
          onClick={() => setMode("add")}
          style={{
            flex: 1,
            padding: "12px 14px",
            textAlign: "center",
            borderRadius: "6px",
            border: mode === "add" ? "2px solid #c5c5c5" : "1px solid #e0e0e0",
            background: "#f5f7fb",
            cursor: "pointer",
            fontWeight: mode === "add" ? 600 : 400,
          }}
        >
          Add
        </div>

        <div
          onClick={() => setMode("sub")}
          style={{
            flex: 1,
            padding: "12px",
            textAlign: "center",
            borderRadius: "10px",
            border: mode === "sub" ? "2px solid #2563eb" : "1px solid #e0e0e0",
            background: "#f5f7fb",
            cursor: "pointer",
            fontWeight: mode === "sub" ? 600 : 400,
          }}
        >
          Subtract
        </div>
      </div>

      {/* Buttons: Calculate & Clear side by side */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <button className="calc-button" onClick={calculateTime}>
          Calculate
        </button>
        <button className="calc-button calc-clear" onClick={handleClear}>
          Clear
        </button>
      </div>

      {result && <div className="calc-result">Result: {result}</div>}
    </div>
  );
}
