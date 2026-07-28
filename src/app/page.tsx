"use client";
import { useState, useEffect } from "react";
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
import CalculatorSearch from "./components/CalculatorsSearch";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { IconCircle, Icons } from "./components/MenuIcons";
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

export const categories = [
  {
    id: "health",
    icon: "🩺",
    title: "Health & Fitness",
    count: "08",
    tools: [
      { label: "BMI Calculator", href: "/bmi-calculator/" },
      { label: "Body Fat Calculator", href: "/body-fat-calculator/" },
      { label: "Calorie Calculator", href: "/calorie-calculator/" },
      { label: "Dose Calculator", href: "/dose-calculator" },
      { label: "Dose Stock Calculator", href: "dose-stock-calculator/" },
      { label: "IV Calculator", href: "/iv-calculator/" },
      { label: "Pharmacokinetics", href: "/pharmacokinetics-calculator/" },
      { label: "Pharmacodynamics", href: "/pharmacodynamics-calculator/" },
    ],
  },
  {
    id: "finance",
    icon: "📊",
    title: "Finance",
    count: "10",
    tools: [
      { label: "EMI Calculator", href: "/emi-calculator/" },
      { label: "Mortgage Calculator", href: "/home-mortgage-calculator/" },
      { label: "Net Worth Calculator", href: "/net-worth-calculator/" },
      { label: "Rent Calculator", href: "/rent-calculator/" },
      { label: "Loan Calculator", href: "/loan-calculator/" },
      { label: "Income Tax Calculator", href: "/income-tax-calculator/" },
      { label: "VAT Calculator", href: "/vat-calculator/" },
      {
        label: "Freelancer Tax Calculator",
        href: "/freelancer-tax-calculator/",
      },
      { label: "Salary Hike Calculator", href: "/salary-hike-calculator/" },
      { label: "Fuel Cost Calculator", href: "/fuel-cost-calculator/" },
    ],
  },
  {
    id: "daily",
    icon: "📅",
    title: "Daily Use",
    count: "11",
    tools: [
      { label: "Days Between Dates", href: "/days-between-calculator/" },
      { label: "Time Calculator", href: "/time-calculator/" },
      { label: "Age Calculator", href: "/age-calculator/" },
      { label: "GPA Calculator", href: "/gpa-calculator/" },
      { label: "GPA Percentage", href: "/gpa-percentage/" },
      { label: "Percentage Calculator", href: "/percentage-calculator/" },
      { label: "Unit Conversion", href: "/unit-conversion-calculator/" },
      { label: "Discount Calculator", href: "/discount-calculator/" },
      { label: "Bill Split Calculator", href: "/bill-split-calculator/" },
      { label: "Matrix Calculator", href: "/matrix-calculator/" },
      {
        label: "Mean Median mode Calculator",
        href: "/mean-median-mode-calculator/",
      },
    ],
  },
  {
    id: "tools",
    icon: "🧰",
    title: "Tools & Utilities",
    count: "16",
    tools: [
      { label: "Currency Converter", href: "/currency-converter/" },
      { label: "Image Converter", href: "/image-converter/" },
      { label: "Image Compressor", href: "image-compressor/" },
      { label: "Image Resizer", href: "/image-resizer/" },
      { label: "Password Generator", href: "/password-generator/" },
      { label: "Lorem Ipsum", href: "/lorem-ipsum-generator/" },
      { label: "Text Generator", href: "/text-generator/" },
      { label: "Color Picker", href: "color-picker/" },
      { label: "Text Case Converter", href: "/text-converter/" },
      { label: "Words Counter", href: "/word-char-counter/" },
      {
        label: "Carbon Footprint Calculator",
        href: "/carbon-footprint-calculator/",
      },
      {
        label: "IP Detector",
        href: "/ip-detector/",
      },
      {
        label: "DNS Lookup",
        href: "/dns-lookup/",
      },
      {
        label: "Email Validator",
        href: "/email-validator/",
      },
      {
        label: "Domain Name Checker",
        href: "/domain-name-checker/",
      },
      {
        label: "Time Zone Converter & World Clock",
        href: "/time-zone-converter/",
      },
    ],
  },
];

export default function Home() {
  const [visibleCount, setVisibleCount] = useState(6);

  return (
    <>
      {/* =======================
    SECTION 2 – TWO COLUMN
=========================== */}
      <div className="section-two">
        <div className="section-two-inner">
          {/* Left Content */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div className="badge-wrapper">
              <div className="badge-pill">
                <span className="badge-dot"></span>
                <span className="badge-text">
                  FREE CALCULATORS, ZERO SIGN-UP
                </span>
              </div>
            </div>
            <h1 className="main-first-heading">
              Every number you need ,{" "}
              <span className="gradient-text">right at your fingertips</span>.
            </h1>

            <p>
              <strong>Numbers On Your Tip</strong> is your all-in-one
              destination for free online calculators and smart digital tools
              built to make everyday math and decisions effortless.
            </p>

            <div className="calc-hero-search">
              <CalculatorSearch />
            </div>
            <div className="stats-wrapper">
              <div className="stat-item">
                <span className="stat-number">43</span>
                <span className="stat-label">Calculators & tools</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number">100%</span>
                <span className="stat-label">Free, no account</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number">0</span>
                <span className="stat-label">Data ever stored</span>
              </div>
            </div>
          </div>

          {/* Right Calculator */}
          <div style={{ width: "100%" }}>
            <SimpleCalculator />
          </div>
        </div>
      </div>

      {/* =======================
    SECTION 3 – ICON BOXES
=========================== */}
      <h2 className="more-tools">Free Online Calculators</h2>
      <p style={{ marginLeft: "10px", marginRight: "10px" }}>
        Browse the complete library, grouped by category, and find the right
        tool for any task.
      </p>
      <div
        className="icon-grid"
        style={{
          display: "grid",
          //gridTemplateColumns: "repeat(4, 1fr)",
          gap: "15px",
          marginBottom: "50px",
        }}
      >
        {[
          {
            name: (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px", // space between icon & text
                }}
              >
                <IconCircle color="purple">
                  <Icons.Age />
                </IconCircle>

                <h4>Age Calculator</h4>
              </div>
            ),
            href: "/age-calculator/",
          },
          {
            name: (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px", // space between icon & text
                }}
              >
                <IconCircle color="blue">
                  <Icons.Bmi />
                </IconCircle>{" "}
                <h4> BMI Calculator </h4>
              </div>
            ),
            href: "/bmi-calculator/",
          },
          {
            name: (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px", // space between icon & text
                }}
              >
                <IconCircle color="teal">
                  <Icons.BodyFat />
                </IconCircle>{" "}
                <h4>Body Fat Calculator</h4>
              </div>
            ),
            href: "/body-fat-calculator/",
          },
          {
            name: (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px", // space between icon & text
                }}
              >
                <IconCircle color="coral">
                  <Icons.Calorie />
                </IconCircle>{" "}
                <h4>Calorie Calculator</h4>
              </div>
            ),
            href: "/calorie-calculator/",
          },
          {
            name: (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px", // space between icon & text
                }}
              >
                <IconCircle color="amber">
                  <Icons.Percentage />
                </IconCircle>{" "}
                <h4>Percentage Calculator</h4>
              </div>
            ),
            href: "/percentage-calculator/",
          },
          {
            name: (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px", // space between icon & text
                }}
              >
                <IconCircle color="green">
                  <Icons.Calendar />
                </IconCircle>{" "}
                <h4>Days Between Dates</h4>
              </div>
            ),
            href: "/days-between-calculator/",
          },
          {
            name: (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px", // space between icon & text
                }}
              >
                <IconCircle color="pink">
                  <Icons.EMI />
                </IconCircle>{" "}
                <h4>EMI Calculator</h4>
              </div>
            ),
            href: "/emi-calculator/",
          },
          {
            name: (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px", // space between icon & text
                }}
              >
                <IconCircle color="purple">
                  <Icons.GPA />
                </IconCircle>{" "}
                <h4>GPA Calculator</h4>
              </div>
            ),
            href: "/gpa-calculator/",
          },
          {
            name: (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px", // space between icon & text
                }}
              >
                <IconCircle color="blue">
                  <Icons.PercentageGPA />
                </IconCircle>{" "}
                <h4>GPA to Percentage</h4>
              </div>
            ),
            href: "/gpa-percentage/",
          },
          {
            name: (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px", // space between icon & text
                }}
              >
                <IconCircle color="teal">
                  <Icons.Mortgage />
                </IconCircle>{" "}
                <h4>Mortgage Calculator</h4>
              </div>
            ),
            href: "/home-mortgage-calculator/",
          },
          {
            name: (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px", // space between icon & text
                }}
              >
                <IconCircle color="coral">
                  <Icons.IncomeTax />
                </IconCircle>{" "}
                <h4>Income Tax Calculator</h4>
              </div>
            ),
            href: "/income-tax-calculator/",
          },
          {
            name: (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px", // space between icon & text
                }}
              >
                <IconCircle color="amber">
                  <Icons.Loan />
                </IconCircle>{" "}
                <h4>Loan Calculator</h4>
              </div>
            ),
            href: "/loan-calculator/",
          },
          {
            name: (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px", // space between icon & text
                }}
              >
                <IconCircle color="green">
                  <Icons.Dose />
                </IconCircle>{" "}
                <h4>Dose Calculator</h4>
              </div>
            ),
            href: "/dose-calculator/",
          },
          {
            name: (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px", // space between icon & text
                }}
              >
                <IconCircle color="pink">
                  <Icons.DoseStock />
                </IconCircle>{" "}
                <h4>Dose Stock Calculator</h4>
              </div>
            ),
            href: "/dose-stock-calculator/",
          },
          {
            name: (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px", // space between icon & text
                }}
              >
                <IconCircle color="purple">
                  <Icons.IV />
                </IconCircle>{" "}
                <h4>IV Drip Calculator</h4>
              </div>
            ),
            href: "/iv-calculator/",
          },
          {
            name: (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px", // space between icon & text
                }}
              >
                <IconCircle color="blue">
                  <Icons.Rent />
                </IconCircle>{" "}
                <h4>Rent Calculator</h4>
              </div>
            ),
            href: "/rent-calculator/",
          },
          {
            name: (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px", // space between icon & text
                }}
              >
                <IconCircle color="teal">
                  <Icons.Clock />
                </IconCircle>{" "}
                <h4>Time Calculator</h4>
              </div>
            ),
            href: "/time-calculator/",
          },
          {
            name: (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px", // space between icon & text
                }}
              >
                <IconCircle color="coral">
                  <Icons.Convert />
                </IconCircle>{" "}
                <h4>Unit Converter</h4>
              </div>
            ),
            href: "/unit-conversion-calculator/",
          },
          {
            name: (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px", // space between icon & text
                }}
              >
                <IconCircle color="amber">
                  <Icons.VAT />
                </IconCircle>{" "}
                <h4>VAT Calculator</h4>
              </div>
            ),
            href: "/vat-calculator/",
          },
          {
            name: (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px", // space between icon & text
                }}
              >
                <IconCircle color="purple">
                  <Icons.Pharmaco />
                </IconCircle>{" "}
                <h4>Pharmaco kinetics Calculator</h4>
              </div>
            ),
            href: "/pharmacokinetics-calculator/",
          },
          {
            name: (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px", // space between icon & text
                }}
              >
                <IconCircle color="green">
                  <Icons.Dynamics />
                </IconCircle>{" "}
                <h4>Pharmaco dynamics Calculator</h4>
              </div>
            ),
            href: "/pharmacodynamics-calculator/",
          },
          {
            name: (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px", // space between icon & text
                }}
              >
                <IconCircle color="amber">
                  <Icons.NetWorth />
                </IconCircle>{" "}
                <h4>Net Worth Calculator</h4>
              </div>
            ),
            href: "/net-worth-calculator/",
          },
          {
            name: (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px", // space between icon & text
                }}
              >
                <IconCircle color="green">
                  <Icons.Discount />
                </IconCircle>{" "}
                <h4>Discount Calculator</h4>
              </div>
            ),
            href: "/discount-calculator/",
          },
          {
            name: (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px", // space between icon & text
                }}
              >
                <IconCircle color="coral">
                  <Icons.Salary />
                </IconCircle>{" "}
                <h4>Salary Hike Calculator</h4>
              </div>
            ),
            href: "/salary-hike-calculator/",
          },
          {
            name: (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px", // space between icon & text
                }}
              >
                <IconCircle color="pink">
                  <Icons.Freelancer />
                </IconCircle>{" "}
                <h4>Freelancer Tax Calculator</h4>
              </div>
            ),
            href: "/freelancer-tax-calculator/",
          },
          {
            name: (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px", // space between icon & text
                }}
              >
                <IconCircle color="blue">
                  <Icons.Split />
                </IconCircle>{" "}
                <h4>Bill Split Calculator</h4>
              </div>
            ),
            href: "/bill-split-calculator/",
          },
          {
            name: (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px", // space between icon & text
                }}
              >
                <IconCircle color="teal">
                  <Icons.Fuel />
                </IconCircle>{" "}
                <h4>Fuel Cost Calculator</h4>
              </div>
            ),
            href: "/fuel-cost-calculator/",
          },
          {
            name: (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px", // space between icon & text
                }}
              >
                <IconCircle color="green">
                  <Icons.MeanMode />
                </IconCircle>{" "}
                <h4>Mean Median Mode Calculator</h4>
              </div>
            ),
            href: "/mean-median-mode-calculator/",
          },
          {
            name: (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px", // space between icon & text
                }}
              >
                <IconCircle color="coral">
                  <Icons.Matrix />
                </IconCircle>{" "}
                <h4>Matrix Calculator</h4>
              </div>
            ),
            href: "/matrix-calculator/",
          },

          // ... add more as needed
        ].map((item, index) => (
          <Link key={index} href={item.href} style={{ textDecoration: "none" }}>
            <div
              className="calc-card bullet"
              style={{
                textAlign: "start",
                padding: "12px 18px",
                border: "1px solid #e4e6ee",

                color: "black",
                background: "white",
                borderRadius: "12px",

                transition: "0.2s ease",
                cursor: "pointer",
              }}
            >
              <p
                className="card-title"
                style={{ fontWeight: 600, fontSize: "14px", margin: 0 }}
              >
                {item.name}
              </p>
            </div>
          </Link>
        ))}
      </div>
      <div style={{ margin: "0 10px", textAlign: "center" }}>
        {/* <Link href="#">
          <button className="calc-button btn-full-mobile">
            Visit More Calculators
          </button>
        </Link> */}
      </div>

      <h2 className="more-tools">Free Online Tools</h2>
      <p style={{ marginLeft: "10px", marginRight: "10px" }}>
        Productivity utilities to streamline your digital workflow.
      </p>
      <div
        className="icon-grid"
        style={{
          display: "grid",
          //gridTemplateColumns: "repeat(4, 1fr)",
          gap: "15px",
          marginBottom: "50px",
        }}
      >
        {[
          {
            name: (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px", // space between icon & text
                }}
              >
                <IconCircle color="pink">
                  <Icons.Image />
                </IconCircle>{" "}
                <h4>Image Converter</h4>
              </div>
            ),
            href: "/image-converter/",
          },
          {
            name: (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px", // space between icon & text
                }}
              >
                <IconCircle color="green">
                  <Icons.Compress />
                </IconCircle>{" "}
                <h4>Image Compressor</h4>
              </div>
            ),
            href: "/image-compressor/",
          },
          {
            name: (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px", // space between icon & text
                }}
              >
                <IconCircle color="purple">
                  <Icons.Resize />
                </IconCircle>{" "}
                <h4>Image Resizer</h4>
              </div>
            ),
            href: "/image-resizer/",
          },
          {
            name: (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px", // space between icon & text
                }}
              >
                <IconCircle color="blue">
                  <Icons.Currency />
                </IconCircle>{" "}
                <h4>Currency Converter</h4>
              </div>
            ),
            href: "/currency-converter/",
          },
          {
            name: (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px", // space between icon & text
                }}
              >
                <IconCircle color="teal">
                  <Icons.Password />
                </IconCircle>{" "}
                <h4>Password Generator</h4>
              </div>
            ),
            href: "/password-generator/",
          },
          {
            name: (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px", // space between icon & text
                }}
              >
                <IconCircle color="coral">
                  <Icons.Lorem />
                </IconCircle>{" "}
                <h4>Lorem Ipsum Generator</h4>
              </div>
            ),
            href: "/lorem-ipsum-generator/",
          },
          {
            name: (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px", // space between icon & text
                }}
              >
                <IconCircle color="coral">
                  <Icons.TextEdit />
                </IconCircle>{" "}
                <h4>Random Text Generator</h4>
              </div>
            ),
            href: "/text-generator/",
          },
          {
            name: (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px", // space between icon & text
                }}
              >
                <IconCircle color="amber">
                  <Icons.TextType />
                </IconCircle>{" "}
                <h4>Text Case Converter</h4>
              </div>
            ),
            href: "/text-converter/",
          },
          {
            name: (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px", // space between icon & text
                }}
              >
                <IconCircle color="green">
                  <Icons.WordCount />
                </IconCircle>{" "}
                <h4>Word Counter</h4>
              </div>
            ),
            href: "/word-char-counter/",
          },
          {
            name: (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px", // space between icon & text
                }}
              >
                <IconCircle color="pink">
                  <Icons.ColorPicker />
                </IconCircle>{" "}
                <h4>Color Picker & Palletes</h4>
              </div>
            ),
            href: "/color-picker/",
          },
          {
            name: (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px", // space between icon & text
                }}
              >
                <IconCircle color="teal">
                  <Icons.Carbon />
                </IconCircle>{" "}
                <h4>Carbon Footprint Calculator</h4>
              </div>
            ),
            href: "/carbon-footprint-calculator/",
          },
          {
            name: (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px", // space between icon & text
                }}
              >
                <IconCircle color="blue">
                  <Icons.DNS />
                </IconCircle>{" "}
                <h4>DNS Lookup</h4>
              </div>
            ),
            href: "/dns-lookup/",
          },
          {
            name: (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px", // space between icon & text
                }}
              >
                <IconCircle color="purple">
                  <Icons.IP />
                </IconCircle>{" "}
                <h4>IP Detector</h4>
              </div>
            ),
            href: "/ip-detector/",
          },
          {
            name: (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px", // space between icon & text
                }}
              >
                <IconCircle color="coral">
                  <Icons.Email />
                </IconCircle>{" "}
                <h4>Email Validator</h4>
              </div>
            ),
            href: "/email-validator/",
          },
          {
            name: (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px", // space between icon & text
                }}
              >
                <IconCircle color="purple">
                  <Icons.Domainname />
                </IconCircle>{" "}
                <h4>Domain Name Checker</h4>
              </div>
            ),
            href: "/domain-name-checker/",
          },
          {
            name: (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px", // space between icon & text
                }}
              >
                <IconCircle color="green">
                  <Icons.Timezone />
                </IconCircle>{" "}
                <h4>Time Zones & World Clock</h4>
              </div>
            ),
            href: "/time-zone-converter/",
          },

          // ... add more as needed
        ].map((item, index) => (
          <Link key={index} href={item.href} style={{ textDecoration: "none" }}>
            <div
              className="calc-card bullet"
              style={{
                textAlign: "start",
                padding: "12px 18px",
                border: "1px solid #e4e6ee",
                borderRadius: "12px",
                color: "black",
                background: "white",

                transition: "0.2s ease",
                cursor: "pointer",
              }}
            >
              <p
                className="card-title"
                style={{ fontWeight: 600, fontSize: "14px", margin: 0 }}
              >
                {item.name}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <section className="section-new">
        <div className="header-new">
          <h2 className="title-new">All free online calculators</h2>
          <p className="subtitle-new">
            Browse the complete library, grouped by category, and find the right
            tool for any task.
          </p>
        </div>

        <div className="grid-new">
          {categories.map((category) => (
            <div key={category.id} className="card">
              <div className="cardHeader">
                <div className="cardTitleGroup">
                  <div className="iconWrapper">{category.icon}</div>
                  <h2 className="cardTitle">{category.title}</h2>
                </div>
                <span className="badge">{category.count}</span>
              </div>

              <div className="tags">
                {category.tools.map((tool) => (
                  <Link key={tool.label} href={tool.href} className="tag">
                    {tool.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="trustBanner">
          <div className="trustIconWrapper">🛡️</div>
          <div className="trustText">
            <h3>Trusted &amp; private by design</h3>
            <p>
              All calculators are accuracy-verified and fully private. Every
              calculation runs in your browser, so your inputs are never stored
              or shared.
            </p>
          </div>
        </div>
      </section>

      <div className="last-sec">
        <p className="con-para">
          Explore a comprehensive collection of free online calculators and
          tools designed to handle real-life needs with precision and ease. In
          the health and fitness category, monitor and understand your body
          using tools like the{" "}
          <Link href="/bmi-calculator/" className="my-link">
            BMI Calculator
          </Link>
          ,{" "}
          <Link href="/body-fat-calculator/" className="my-link">
            Body Fat Calculator
          </Link>
          , and{" "}
          <Link href="/calorie-calculator/" className="my-link">
            Calorie Calculator
          </Link>
          , while specialized medical utilities such as the{" "}
          <Link href="/dose-calculator/" className="my-link">
            Dose Calculator
          </Link>
          ,{" "}
          <Link href="/dose-stock-calculator/" className="my-link">
            Dose Stock Calculator
          </Link>
          , and{" "}
          <Link href="/iv-calculator/" className="my-link">
            IV Drip Calculator
          </Link>{" "}
          deliver accurate results for clinical and nursing calculations. For
          financial planning and money management, our finance tools include the{" "}
          <Link href="/emi-calculator/" className="my-link">
            EMI Calculator
          </Link>
          ,{" "}
          <Link href="/home-mortgage-calculator/" className="my-link">
            Home Mortgage Calculator
          </Link>
          ,{" "}
          <Link href="/rent-calculator/" className="my-link">
            Rent Calculator
          </Link>
          ,{" "}
          <Link href="/loan-calculator/" className="my-link">
            Loan Calculator
          </Link>
          ,{" "}
          <Link href="/income-tax-calculator/" className="my-link">
            Income Tax Calculator
          </Link>
          , and{" "}
          <Link href="/vat-calculator/" className="my-link">
            VAT Calculator
          </Link>
          , helping you make confident, informed financial decisions. For
          everyday tasks, save time with practical utilities like the{" "}
          <Link href="/days-between-calculator/" className="my-link">
            Days Between Dates Calculator
          </Link>
          ,{" "}
          <Link href="/time-calculator/" className="my-link">
            Time Calculator
          </Link>
          ,{" "}
          <Link href="/age-calculator/" className="my-link">
            Age Calculator
          </Link>
          ,{" "}
          <Link href="/gpa-calculator/" className="my-link">
            GPA Calculator
          </Link>
          ,{" "}
          <Link href="/gpa-percentage/" className="my-link">
            GPA to Percentage Calculator
          </Link>
          ,{" "}
          <Link href="/percentage-calculator/" className="my-link">
            Percentage Calculator
          </Link>
          , and{" "}
          <Link href="/unit-conversion-calculator/" className="my-link">
            Unit Converter
          </Link>
          , all built for quick, reliable answers. Beyond calculators, our
          platform includes powerful productivity tools to streamline your
          digital workflow, including the{" "}
          <Link href="/currency-converter/" className="my-link">
            Currency Converter
          </Link>
          ,{" "}
          <Link href="/image-converter/" className="my-link">
            Image Converter
          </Link>
          ,{" "}
          <Link href="/image-compressor/" className="my-link">
            Image Compressor
          </Link>
          ,{" "}
          <Link href="/image-resizer/" className="my-link">
            Image Resizer
          </Link>
          ,{" "}
          <Link href="/password-generator/" className="my-link">
            Password Generator
          </Link>
          ,{" "}
          <Link href="/text-generator/" className="my-link">
            Lorem Ipsum Generator
          </Link>
          ,{" "}
          <Link href="/color-picker/" className="my-link">
            Color Picker
          </Link>
          ,{" "}
          <Link href="/text-converter/" className="my-link">
            Text Case Converter
          </Link>
          , and{" "}
          <Link href="/word-char-counter/" className="my-link">
            Word Counter
          </Link>
          . Every tool is built to be fast, mobile-friendly, and simple to use —
          whether you need a quick answer or a detailed calculation, it's all in
          one free, reliable platform.
        </p>
      </div>
    </>
  );
}
