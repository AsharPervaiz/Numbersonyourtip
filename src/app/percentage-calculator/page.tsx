"use client";
import { useState } from "react";

export default function PercentageCalculator() {
  const [value, setValue] = useState("");
  const [percentage, setPercentage] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const handlePercentageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace("%", "");
    if (!/^\d*\.?\d*$/.test(val)) return;
    setPercentage(val ? `${val}%` : "");
  };

  const calculate = () => {
    if (!value || !percentage) return;
    const v = Number(value);
    const p = Number(percentage.replace("%", ""));
    const res = (v * p) / 100;
    setResult(res.toFixed(2));
  };

  const clearAll = () => {
    setValue("");
    setPercentage("");
    setResult(null);
  };

  return (
    <div className="single-page-padding">
    <div className="calc-card single-calc">
      <h2 className="calc-title">Percentage Calculator</h2>

      <input
        className="calc-input"
        type="number"
        placeholder="Enter Value"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      <input
        className="calc-input"
        type="text"
        placeholder="Percentage"
        value={percentage}
        onChange={handlePercentageChange}
        onFocus={(e) => {
          const len = e.target.value.length;
          e.target.setSelectionRange(len - 1, len - 1);
        }}
      />

      {/* Buttons */}
      <div style={{ display: "flex", gap: "10px" }}>
        <button className="calc-button" onClick={calculate}>
          Calculate
        </button>
        <button className="calc-button calc-clear" onClick={clearAll}>
          Clear
        </button>
      </div>

      {/* Result Box with fixed height to prevent layout shift */}
      <div
        className="calc-result"
        style={{ minHeight: "2em" }} // reserve space
      >
        {result && (
          <>
            <strong>Result:</strong> {result}
          </>
        )}
      </div>
    </div>
    </div>
  );
}
