"use client";
import { useState } from "react";

export default function HomeMortgageCalculator() {
  const [homePrice, setHomePrice] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [loanTerm, setLoanTerm] = useState(""); // in years
  const [monthlyEMI, setMonthlyEMI] = useState<string | null>(null);
  const [totalPayment, setTotalPayment] = useState<string | null>(null);
  const [loanAmount, setLoanAmount] = useState<number | null>(null);

  const calculateMortgage = () => {
    if (!homePrice || !downPayment || !interestRate || !loanTerm) return;

    const principal = Number(homePrice) - Number(downPayment);
    const r = Number(interestRate) / 12 / 100; // monthly interest
    const n = Number(loanTerm) * 12; // total months

    if (principal <= 0) return;

    const emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    setMonthlyEMI(emi.toFixed(2));
    setTotalPayment((emi * n).toFixed(2));
    setLoanAmount(principal);
  };

  const handleClear = () => {
    setHomePrice("");
    setDownPayment("");
    setInterestRate("");
    setLoanTerm("");
    setMonthlyEMI(null);
    setTotalPayment(null);
    setLoanAmount(null);
  };

  return (
    <div className="calc-card">
      <h2 className="calc-title">Home Mortgage Calculator</h2>

      <input
        className="calc-input"
        type="number"
        placeholder="Home Price"
        value={homePrice}
        onChange={(e) => setHomePrice(e.target.value)}
      />

      <input
        className="calc-input"
        type="number"
        placeholder="Down Payment"
        value={downPayment}
        onChange={(e) => setDownPayment(e.target.value)}
      />

      <input
        className="calc-input"
        type="number"
        placeholder="Interest Rate (%)"
        value={interestRate}
        onChange={(e) => setInterestRate(e.target.value)}
      />

      <input
        className="calc-input"
        type="number"
        placeholder="Loan Term (Years)"
        value={loanTerm}
        onChange={(e) => setLoanTerm(e.target.value)}
      />

      {/* Buttons: Calculate & Clear */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <button className="calc-button" onClick={calculateMortgage}>
          Calculate
        </button>
        <button className="calc-button calc-clear" onClick={handleClear}>
          Clear
        </button>
      </div>

      {/* Results */}
      {monthlyEMI && (
        <div className="calc-result">
          <strong>Loan Amount:</strong> {loanAmount} <br />
          <strong>Monthly EMI:</strong> {monthlyEMI} <br />
          <strong>Total Payment:</strong> {totalPayment}
        </div>
      )}
    </div>
  );
}
