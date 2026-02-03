"use client";
import { useState } from "react";

export default function IncomeTaxCalculator() {
  const [income, setIncome] = useState("");
  const [filingStatus, setFilingStatus] = useState("single"); // can add married, etc. later
  const [deductions, setDeductions] = useState("");
  const [taxOwed, setTaxOwed] = useState<string | null>(null);

  // 2026 U.S. Federal Tax Brackets for Single Filers
  const taxBracketsSingle = [
    { rate: 0.10, max: 11850 },
    { rate: 0.12, max: 47750 },
    { rate: 0.22, max: 104425 },
    { rate: 0.24, max: 182100 },
    { rate: 0.32, max: 231250 },
    { rate: 0.35, max: 578125 },
    { rate: 0.37, max: Infinity },
  ];

  const calculateTax = () => {
    if (!income) return;

    let taxableIncome = Number(income) - (Number(deductions) || 0);
    taxableIncome = Math.max(0, taxableIncome);

    let tax = 0;
    let previousMax = 0;

    for (const bracket of taxBracketsSingle) {
      if (taxableIncome > bracket.max) {
        tax += (bracket.max - previousMax) * bracket.rate;
        previousMax = bracket.max;
      } else {
        tax += (taxableIncome - previousMax) * bracket.rate;
        break;
      }
    }

    setTaxOwed(tax.toFixed(2));
  };

  const handleClear = () => {
    setIncome("");
    setDeductions("");
    setTaxOwed(null);
  };

  return (
    <div className="calc-card">
      <h2 className="calc-title">Income Tax Calculator (U.S. 2026)</h2>
      <p>
        Estimate your federal income tax owed based on 2026 tax brackets. This is
        for single filers. Deductions are optional.
      </p>

      <input
        className="calc-input"
        type="number"
        placeholder="Annual Income"
        value={income}
        onChange={(e) => setIncome(e.target.value)}
      />

      <input
        className="calc-input"
        type="number"
        placeholder="Deductions (optional)"
        value={deductions}
        onChange={(e) => setDeductions(e.target.value)}
      />

      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <button className="calc-button" onClick={calculateTax}>
          Calculate
        </button>
        <button className="calc-button calc-clear" onClick={handleClear}>
          Clear
        </button>
      </div>

      {taxOwed && (
        <div className="calc-result">
          <strong>Estimated Federal Tax Owed:</strong> {taxOwed}
          <p style={{ fontSize: "0.85rem", color: "#555", marginTop: "5px" }}>
            Based on 2026 single filer tax brackets. For more precise estimates,
            consider state taxes and other credits.
          </p>
        </div>
      )}
    </div>
  );
}
