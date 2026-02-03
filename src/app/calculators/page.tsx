"use client";

import { useState } from "react";

import BMICalculator from "../components/BMICalculator";
import EMICalculator from "../components/EMICalculator";
import AgeCalculator from "../components/AgeCalculator";
import CalorieCalculator from "../components/CalorieCalculator";
import BodyFatCalculator from "../components/BodyFatCalculator";
import DaysBetweenCalculator from "../components/DaysBetweenCalculator";
import GPACalculator from "../components/GPACalculator";
import TimeCalculator from "../components/TimeCalculator";
import CurrencyConverter from "../components/CurrencyConverter";
import SimpleCalculator from "../components/SimpleCalculator";


// Existing calculators
const calculators = [
  <BMICalculator />,
  <EMICalculator />,
  <CurrencyConverter />,
  <CalorieCalculator />,
  <TimeCalculator />,
  <BodyFatCalculator />,
  <AgeCalculator />,
  <GPACalculator />,
  <DaysBetweenCalculator />,
];

export default function Home() {
  const [visibleCount, setVisibleCount] = useState(6);

  return (
    <>
      
{/* =======================
    SECTION 3 – ICON BOXES
=========================== */}
<div
  className="icon-grid"
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "20px",
    marginBottom: "50px",
  }}
>
  {[
    "BMI Calculator",
    "EMI Calculator",
    "Age Calculator",
    "Currency Converter",
  ].map((name, index) => (
    <div
      key={index}
      className="calc-card"
      style={{
        textAlign: "center",
        padding: "25px 10px",
        cursor: "pointer",
        borderRadius: "14px",
        background: "white",
        boxShadow: "0 0 12px rgba(0,0,0,0.08)",
        transition: "0.2s ease",
      }}
    >
      <div
        style={{
          width: "55px",
          height: "55px",
          borderRadius: "50%",
          background: "#f5f5f5",
          margin: "0 auto 15px auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "24px",
        }}
      >
        🔢
      </div>
      <p style={{ fontWeight: 600 }}>{name}</p>
    </div>
  ))}
</div>

      {/* =======================
          SECTION 4 – YOUR OLD GRID
      ========================== */}

      <h1
        style={{ fontSize: "28px", marginBottom: "20px", marginLeft: "10px" }}
      >
        Free Online Calculators
      </h1>

      <div className="calculators-grid">
        {calculators.slice(0, visibleCount).map((Calc, index) => (
          <div key={index}>{Calc}</div>
        ))}
      </div>

      {visibleCount < calculators.length && (
        <div style={{ textAlign: "center", marginTop: "30px" }}>
          <button
            className="calc-button"
            style={{ maxWidth: "300px" }}
            onClick={() => setVisibleCount((prev) => prev + 6)}
          >
            Show More Calculators
          </button>
        </div>
      )}
    </>
  );
}
