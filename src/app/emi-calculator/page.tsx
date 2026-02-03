"use client";
import { useState } from "react";

export default function EMICalculator() {
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("");
  const [months, setMonths] = useState("");
  const [emi, setEmi] = useState<string | null>(null);

  const calculateEMI = () => {
    if (!amount || !rate || !months) return;

    const p = Number(amount);
    const r = Number(rate) / 12 / 100;
    const n = Number(months);

    const result = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

    setEmi(result.toFixed(2));
  };

  /* ✅ Clear function */
  const handleClear = () => {
    setAmount("");
    setRate("");
    setMonths("");
    setEmi(null);
  };

  return (
    <div className="single-page-padding">
    <div className="calc-card single-calc">
      <h2 className="calc-title">EMI Calculator</h2>

      <input
        className="calc-input"
        type="number"
        placeholder="Loan Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <input
        className="calc-input"
        type="number"
        placeholder="Interest Rate (%)"
        value={rate}
        onChange={(e) => setRate(e.target.value)}
      />

      <input
        className="calc-input"
        type="number"
        placeholder="Tenure (months)"
        value={months}
        onChange={(e) => setMonths(e.target.value)}
      />

      {/* Buttons */}
      <div style={{ display: "flex", gap: "10px" }}>
        <button className="calc-button" onClick={calculateEMI}>
          Calculate
        </button>
        <button className="calc-button calc-clear" onClick={handleClear}>
          Clear
        </button>
      </div>

      {emi && (
        <div className="calc-result">
          Monthly EMI: {emi}
        </div>
      )}
    </div>
    </div>
  );
}
