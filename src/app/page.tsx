"use client";

import { useState } from "react";
import Link from "next/link";
import BMICalculator from "./components/BMICalculator";
import EMICalculator from "./components/EMICalculator";
import AgeCalculator from "./components/AgeCalculator";
import CalorieCalculator from "./components/CalorieCalculator";
import BodyFatCalculator from "./components/BodyFatCalculator";
import DaysBetweenCalculator from "./components/DaysBetweenCalculator";
import GPACalculator from "./components/GPACalculator";
import TimeCalculator from "./components/TimeCalculator";
import CurrencyConverter from "./components/CurrencyConverter";
import SimpleCalculator from "./components/SimpleCalculator";


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
          SECTION 1 – HERO BANNER
      ========================== */}
      <div className="banner">
  <h1
  style={{
    fontSize: "36px",
    fontWeight: 800,
    color: "#1B3066",
    textAlign: "center",     // center text
    margin: 0,               // remove default top margin causing vertical shift
    padding: "0 20px",       // keep spacing on mobile
    lineHeight: 1.3,         // better readability + stable centering
  }}
>
  Free Online Calculators for Everyday Use
</h1>
</div>

      {/* =======================
    SECTION 2 – TWO COLUMN
=========================== */}
<div
  className="section-two"
  style={{
    display: "grid",
    gridTemplateColumns: "50% 50%",
    gap: "30px",
    marginBottom: "50px",
  }}
>
  {/* Left: Simple Calculator */}
  <SimpleCalculator />

  {/* Right: Heading + Text */}
  <div
  style={{
    padding: "0px",
    borderRadius: "14px",
    background: "white",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",   // vertical center
    height: "100%",             // required for vertical centering
  }}
>
  <h2 style={{ fontSize: "26px", marginBottom: "10px" }}>
    All Your Daily Calculations, In One Place
  </h2>

  <p style={{ lineHeight: "1.7", opacity: 0.9 }}>
    From finance to fitness, health to education, we provide accurate,
    fast, and user-friendly calculators. Whether you're planning your
    budget, checking your BMI, converting currencies, or calculating
    your GPA—everything is available instantly and free forever.
  </p>

  
</div>

</div>

{/* =======================
    SECTION 3 – ICON BOXES
=========================== */}
<h2 style={{ fontSize: "26px", marginBottom: "20px", marginRight: "10px", marginLeft: "10px"}}>
    Free Calculators and Converters
  </h2>
<div
  className="icon-grid"
  style={{
    display: "grid",
    //gridTemplateColumns: "repeat(4, 1fr)",
    gap: "20px",
    marginBottom: "50px",
  }}
>
  {[
    { name: "Age Calculator", href: "/age-calculator" },
    { name: "BMI Calculator", href: "/bmi-calculator" },
    { name: "Body Fat Calculator", href: "/body-fat-calculator" },
    { name: "Calories Calculator", href: "/calorie-calculator" },
    { name: "Currency Converter", href: "/currency-converter" },
    { name: "Days Calculator", href: "/days-between-calculator" },
    { name: "EMI Calculator", href: "/emi-calculator" },
    { name: "GPA Calculator", href: "/gpa-calculator" },
    { name: "GPA Percentage", href: "/gpa-percentage" },
    { name: "Mortgage Calculator", href: "/home-mortgage-calculator" },
    { name: "Income Tax Calculator", href: "/income-tax-calculator" },
    { name: "Loan Calculator", href: "/loan-calculator" },
    { name: "Percentage Calculator", href: "/percentage-calculator" },
    { name: "Rent Calculator", href: "/rent-calculator" },
    { name: "Time Calculator", href: "/time-calculator" },
    { name: "Unit Calculator", href: "/unit-conversion-calculator" },
    { name: "Dose Calculator", href: "/dose-calculator" },
    
    // ... add more as needed
  ].map((item, index) => (
    <Link key={index} href={item.href} style={{ textDecoration: "none" }}>
      <div
        className="calc-card"
        style={{
          textAlign: "center",
          padding: "30px 25px",
          borderRadius: "10px",
          color: "black",
          background: "white",
          boxShadow: "0 0 12px rgba(0,0,0,0.08)",
          transition: "0.2s ease",
          cursor: "pointer",
        }}
      >
        <p style={{ fontWeight: 600, fontSize: "16px", margin: 0 }}>
          {item.name}
        </p>
      </div>
    </Link>
  ))}
</div>
<div style={{ margin: "0 10px", textAlign: "center" }}>
  <Link href="#">
    <button className="calc-button btn-full-mobile">
      Visit More Calculators
    </button>
  </Link>
</div>

    </>
  );
}
