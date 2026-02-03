"use client";
import { useState } from "react";

export default function RentCalculator() {
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [monthlyDebts, setMonthlyDebts] = useState("");
  const [affordableRent, setAffordableRent] = useState<{
    low: string;
    medium: string;
    high: string;
  } | null>(null);

  const calculateRent = () => {
    if (!monthlyIncome) return;

    const income = Number(monthlyIncome);
    const debts = Number(monthlyDebts) || 0;

    const availableIncome = income - debts;

    const low = availableIncome * 0.25;
    const medium = availableIncome * 0.3;
    const high = availableIncome * 0.35;

    setAffordableRent({
      low: low.toFixed(2),
      medium: medium.toFixed(2),
      high: high.toFixed(2),
    });
  };

  const handleClear = () => {
    setMonthlyIncome("");
    setMonthlyDebts("");
    setAffordableRent(null);
  };

  return (
    <div className="single-page-padding">
    <div className="calc-card single-calc">
      <h2 className="calc-title">Rent Calculator</h2>
      <p>
        Estimate how much rent you can afford based on your income and debts. This
        calculator provides a range of affordable rent.
      </p>

      <input
        className="calc-input"
        type="number"
        placeholder="Monthly Income"
        value={monthlyIncome}
        onChange={(e) => setMonthlyIncome(e.target.value)}
      />

      <input
        className="calc-input"
        type="number"
        placeholder="Monthly Debts (optional)"
        value={monthlyDebts}
        onChange={(e) => setMonthlyDebts(e.target.value)}
      />

      {/* Buttons */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <button className="calc-button" onClick={calculateRent}>
          Calculate
        </button>
        <button className="calc-button calc-clear" onClick={handleClear}>
          Clear
        </button>
      </div>

      {/* Result */}
      {affordableRent && (
        <div className="calc-result">
          <strong>Affordable Rent Range:</strong>
          <ul style={{ marginTop: "5px" }}>
            <li>Low (25% of income after debts): {affordableRent.low} per month</li>
            <li>Medium (30% of income after debts): {affordableRent.medium} per month</li>
            <li>High (35% of income after debts): {affordableRent.high} per month</li>
          </ul>
          <p style={{ fontSize: "0.85rem", color: "#555", marginTop: "8px" }}>
            The percentages represent general guidelines for affordable rent:
            <br />
            • 25% = conservative, low financial risk  
            • 30% = typical recommendation  
            • 35% = upper limit for affordability
          </p>
        </div>
      )}
    </div>
    </div>
  );
}
