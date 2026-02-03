"use client";
import { useState } from "react";

export default function TimeCalculator() {
  const [days1, setDays1] = useState("");
  const [hours1, setHours1] = useState("");
  const [minutes1, setMinutes1] = useState("");
  const [seconds1, setSeconds1] = useState("");

  const [days2, setDays2] = useState("");
  const [hours2, setHours2] = useState("");
  const [minutes2, setMinutes2] = useState("");
  const [seconds2, setSeconds2] = useState("");

  const [mode, setMode] = useState<"add" | "sub">("add");
  const [result, setResult] = useState<string | null>(null);

  const parseTime = (d: string, h: string, m: string, s: string) => {
    return (Number(d) || 0) * 86400 +
           (Number(h) || 0) * 3600 +
           (Number(m) || 0) * 60 +
           (Number(s) || 0);
  };

  const formatTime = (totalSeconds: number) => {
    const rd = Math.floor(totalSeconds / 86400);
    const rh = Math.floor((totalSeconds % 86400) / 3600);
    const rm = Math.floor((totalSeconds % 3600) / 60);
    const rs = totalSeconds % 60;
    return `${rd} days ${rh} hrs ${rm} min ${rs} sec`;
  };

  const calculateTime = () => {
    const time1 = parseTime(days1, hours1, minutes1, seconds1);
    const time2 = parseTime(days2, hours2, minutes2, seconds2);

    let totalSeconds = mode === "add" ? time1 + time2 : Math.max(0, time1 - time2);

    setResult(formatTime(totalSeconds));
  };

  const handleClear = () => {
    setDays1(""); setHours1(""); setMinutes1(""); setSeconds1("");
    setDays2(""); setHours2(""); setMinutes2(""); setSeconds2("");
    setMode("add");
    setResult(null);
  };

  return (
    <div className="single-page-padding">
      <div className="calc-card single-calc">
        <h2 className="calc-title">Time Calculator</h2>

        <h4>Time 1</h4>
        <input className="calc-input" type="number" placeholder="Days" value={days1} onChange={(e) => setDays1(e.target.value)} />
        <input className="calc-input" type="number" placeholder="Hours" value={hours1} onChange={(e) => setHours1(e.target.value)} />
        <input className="calc-input" type="number" placeholder="Minutes" value={minutes1} onChange={(e) => setMinutes1(e.target.value)} />
        <input className="calc-input" type="number" placeholder="Seconds" value={seconds1} onChange={(e) => setSeconds1(e.target.value)} />

        <h4>Time 2</h4>
        <input className="calc-input" type="number" placeholder="Days" value={days2} onChange={(e) => setDays2(e.target.value)} />
        <input className="calc-input" type="number" placeholder="Hours" value={hours2} onChange={(e) => setHours2(e.target.value)} />
        <input className="calc-input" type="number" placeholder="Minutes" value={minutes2} onChange={(e) => setMinutes2(e.target.value)} />
        <input className="calc-input" type="number" placeholder="Seconds" value={seconds2} onChange={(e) => setSeconds2(e.target.value)} />

        {/* Add / Subtract Toggle */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <div
            onClick={() => setMode("add")}
            style={{
              flex: 1,
              padding: "12px",
              textAlign: "center",
              borderRadius: "2px",
              border: mode === "add" ? "2px solid #c5c5c5" : "1px solid #e0e0e0",
              background: "#c8e9e9",
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

        {/* Buttons */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <button className="calc-button" onClick={calculateTime}>Calculate</button>
          <button className="calc-button calc-clear" onClick={handleClear}>Clear</button>
        </div>

        {result && <div className="calc-result">Result: {result}</div>}
      </div>
    </div>
  );
}
