"use client";

import { useState } from "react";

/* Format number with commas */
const formatNumber = (value: string) => {
  if (!value) return "";
  const num = Number(value.replace(/,/g, ""));
  if (isNaN(num)) return "";
  return num.toLocaleString();
};

export default function LoanCalculator() {
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("");
  const [years, setYears] = useState("");
  const [months, setMonths] = useState("");
  const [fee, setFee] = useState("");

  const [emi, setEmi] = useState<number | null>(null);
  const [totalInterest, setTotalInterest] = useState<number | null>(null);
  const [totalPayment, setTotalPayment] = useState<number | null>(null);
  const [payableAmount, setPayableAmount] = useState<number | null>(null);

  /* Clear all fields */
  const handleClear = () => {
    setAmount("");
    setRate("");
    setYears("");
    setMonths("");
    setFee("");
    setEmi(null);
    setTotalInterest(null);
    setTotalPayment(null);
    setPayableAmount(null);
  };

  /* Calculate Loan */
  const calculateLoan = () => {
    if (!amount || !rate) return;

    const principal = Number(amount);
    const monthlyRate = Number(rate) / 100 / 12;
    const totalMonths = Number(years || 0) * 12 + Number(months || 0);

    if (totalMonths <= 0) return;

    const emiValue =
      (principal *
        monthlyRate *
        Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);

    const totalPay = emiValue * totalMonths;
    const interest = totalPay - principal;
    const processingFee = fee ? (principal * Number(fee)) / 100 : 0;

    setEmi(emiValue);
    setTotalInterest(interest);
    setTotalPayment(totalPay);
    setPayableAmount(totalPay + processingFee);
  };

  return (
    <div className="single-page-padding">
    <div className="calc-card single-calc">
      <h2 className="calc-title">Loan Calculator</h2>

      {/* Loan Amount */}
      <input
        className="calc-input"
        type="text"
        placeholder="Loan Amount"
        value={formatNumber(amount)}
        onChange={(e) =>
          setAmount(e.target.value.replace(/,/g, ""))
        }
      />

      {/* Interest Rate */}
      <input
        className="calc-input"
        type="number"
        placeholder="Interest Rate (%)"
        value={rate}
        onChange={(e) => setRate(e.target.value)}
      />

      {/* Loan Term */}
      <div style={{ display: "flex", gap: "10px" }}>
        <input
          className="calc-input"
          type="number"
          placeholder="Years"
          value={years}
          onChange={(e) => setYears(e.target.value)}
          style={{ flex: 1 }}
        />
        <input
          className="calc-input"
          type="number"
          placeholder="Months"
          value={months}
          onChange={(e) => setMonths(e.target.value)}
          style={{ flex: 1 }}
        />
      </div>

      {/* Processing Fee */}
      <input
        className="calc-input"
        type="number"
        placeholder="Processing Fee (%) (optional)"
        value={fee}
        onChange={(e) => setFee(e.target.value)}
      />

      {/* Buttons */}
      <div style={{ display: "flex", gap: "10px" }}>
        <button className="calc-button" onClick={calculateLoan}>
          Calculate
        </button>
        <button className="calc-button calc-clear" onClick={handleClear}>
          Clear
        </button>
      </div>

      {/* Results */}
      {emi && (
        <div className="calc-result">
          <div>Monthly EMI: {emi.toFixed(2)}</div>
          <div>Total Interest: {totalInterest?.toFixed(2)}</div>
          <div>Total Loan Payback: {totalPayment?.toFixed(2)}</div>
          {fee && (
            <div>
              Total Payable (incl. fees):{" "}
              {payableAmount?.toFixed(2)}
            </div>
          )}
        </div>
      )}
    </div>
    </div>
  );
}
