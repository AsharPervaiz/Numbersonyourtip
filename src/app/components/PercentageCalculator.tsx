"use client";
import { useState } from "react";

export default function PercentageCalculator() {
  const [value, setValue] = useState("");
  const [percentage, setPercentage] = useState("");
  const [result, setResult] = useState<number | null>(null);

  const calculatePercentage = () => {
    const v = Number(value);
    const p = Number(percentage);

    if (!v || !p) return;

    setResult((v * p) / 100);
  };

  const clearAll = () => {
    setValue("");
    setPercentage("");
    setResult(null);
  };

  return (
    <div className="calc-card">
      <h2 className="calc-title">Percentage Calculator</h2>

      <input
        className="calc-input"
        type="number"
        placeholder="Enter Value"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      {/* Percentage input with fixed % */}
      <div style={{ position: "relative" }}>
        <input
          className="calc-input"
          type="number"
          placeholder="Percentage"
          value={percentage}
          onChange={(e) => setPercentage(e.target.value)}
          style={{ paddingRight: "40px" }}
        />
        <span
          style={{
            position: "absolute",
            right: "14px",
            top: "50%",
            transform: "translateY(-50%)",
            fontWeight: 600,
            opacity: 0.6,
            pointerEvents: "none",
          }}
        >
          %
        </span>
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <button className="calc-button" onClick={calculatePercentage}>
          Calculate
        </button>

        <button className="calc-button" onClick={clearAll}>
          Clear
        </button>
      </div>

      {result !== null && (
        <div className="calc-result">
          Result: {result}
        </div>
      )}
    </div>
  );
}
