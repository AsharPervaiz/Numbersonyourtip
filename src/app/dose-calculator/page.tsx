"use client";
import { useState } from "react";

export default function DoseCalculator() {
  const [weight, setWeight] = useState("");
  const [dosePerKg, setDosePerKg] = useState("");
  const [result, setResult] = useState<number | null>(null);

  const calculateDose = () => {
    const w = Number(weight) || 0;
    const doseKg = Number(dosePerKg) || 0;

    const singleDose = w * doseKg;
    setResult(singleDose);
  };

  const handleClear = () => {
    setWeight("");
    setDosePerKg("");
    setResult(null);
  };

  return (
    <div className="calc-card single-calc">
      <h2 className="calc-title">Dose Calculator</h2>

      <input
        className="calc-input"
        type="number"
        placeholder="Patient Weight (kg)"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
      />

      <input
        className="calc-input"
        type="number"
        placeholder="Dose per kg (mg/kg)"
        value={dosePerKg}
        onChange={(e) => setDosePerKg(e.target.value)}
      />

      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <button className="calc-button" onClick={calculateDose}>
          Calculate
        </button>
        <button className="calc-button calc-clear" onClick={handleClear}>
          Clear
        </button>
      </div>

      {result !== null && (
        <div className="calc-result">
          <p>Single Dose: {result.toFixed(2)} mg</p>
        </div>
      )}
    </div>
  );
}
