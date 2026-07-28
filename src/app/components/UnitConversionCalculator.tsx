"use client";
import { useState } from "react";
import Link from "next/link";

type Category = "Length" | "Mass" | "Temperature" | "Volume" | "Area" | "Time";

export default function UnitConversionCalculator() {
  const [category, setCategory] = useState<Category>("Length");
  const [fromUnit, setFromUnit] = useState("");
  const [toUnit, setToUnit] = useState("");
  const [value, setValue] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);
  const categories: Record<Category, string[]> = {
    Length: [
      "Meter",
      "Kilometer",
      "Centimeter",
      "Millimeter",
      "Inch",
      "Foot",
      "Yard",
      "Mile",
    ],
    Mass: ["Gram", "Kilogram", "Milligram", "Pound", "Ounce"],
    Temperature: ["Celsius", "Fahrenheit", "Kelvin"],
    Volume: [
      "Liter",
      "Milliliter",
      "Cubic Meter",
      "Cubic Centimeter",
      "Gallon",
      "Pint",
    ],
    Area: [
      "Square Meter",
      "Square Kilometer",
      "Square Foot",
      "Square Yard",
      "Acre",
      "Hectare",
    ],
    Time: ["Second", "Minute", "Hour", "Day", "Week"],
  };
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };
  const convertValue = () => {
    if (!value || !fromUnit || !toUnit) return;

    const v = Number(value);
    let res: number = v;

    switch (category) {
      case "Length":
        const lengthInMeters: Record<string, number> = {
          Meter: 1,
          Kilometer: 1000,
          Centimeter: 0.01,
          Millimeter: 0.001,
          Inch: 0.0254,
          Foot: 0.3048,
          Yard: 0.9144,
          Mile: 1609.34,
        };
        res = (v * lengthInMeters[fromUnit]) / lengthInMeters[toUnit];
        break;

      case "Mass":
        const massInKg: Record<string, number> = {
          Gram: 0.001,
          Kilogram: 1,
          Milligram: 0.000001,
          Pound: 0.453592,
          Ounce: 0.0283495,
        };
        res = (v * massInKg[fromUnit]) / massInKg[toUnit];
        break;

      case "Temperature":
        if (fromUnit === "Celsius") {
          res = toUnit === "Fahrenheit" ? v * 1.8 + 32 : v + 273.15;
        } else if (fromUnit === "Fahrenheit") {
          res = toUnit === "Celsius" ? (v - 32) / 1.8 : (v - 32) / 1.8 + 273.15;
        } else if (fromUnit === "Kelvin") {
          res = toUnit === "Celsius" ? v - 273.15 : (v - 273.15) * 1.8 + 32;
        }
        break;

      case "Volume":
        const volumeInLiters: Record<string, number> = {
          Liter: 1,
          Milliliter: 0.001,
          "Cubic Meter": 1000,
          "Cubic Centimeter": 0.001,
          Gallon: 3.78541,
          Pint: 0.473176,
        };
        res = (v * volumeInLiters[fromUnit]) / volumeInLiters[toUnit];
        break;

      case "Area":
        const areaInSqMeter: Record<string, number> = {
          "Square Meter": 1,
          "Square Kilometer": 1e6,
          "Square Foot": 0.092903,
          "Square Yard": 0.836127,
          Acre: 4046.86,
          Hectare: 10000,
        };
        res = (v * areaInSqMeter[fromUnit]) / areaInSqMeter[toUnit];
        break;

      case "Time":
        const timeInSeconds: Record<string, number> = {
          Second: 1,
          Minute: 60,
          Hour: 3600,
          Day: 86400,
          Week: 604800,
        };
        res = (v * timeInSeconds[fromUnit]) / timeInSeconds[toUnit];
        break;

      default:
        break;
    }

    setResult(`${res.toFixed(4)} ${toUnit}`);
  };

  const clearAll = () => {
    setValue("");
    setFromUnit("");
    setToUnit("");
    setResult(null);
  };

  return (
    <>
      {/* ---- PAGE LAYOUT WRAPPER ---- */}
      <div className="page-layout single-page-padding">
        {/* ---- MAIN CONTENT ---- */}
        <div className="single-page-padding">
          <h1>Unit Conversion Calculator</h1>

          <p>
            Select a category, enter your value, and convert any unit instantly.
          </p>

          <div className="calc-card single-calc">
            {/* Category Switcher - wrap into 2 lines */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                marginBottom: "15px",
              }}
            >
              {Object.keys(categories).map((c) => (
                <div
                  key={c}
                  onClick={() => {
                    setCategory(c as Category);
                    setFromUnit("");
                    setToUnit("");
                    setResult(null);
                    setValue("");
                  }}
                  style={{
                    flex: "1 1 45%",
                    padding: "10px",
                    textAlign: "center",
                    borderRadius: "2px",
                    border:
                      category === c
                        ? "2px solid #dededea1"
                        : "1px solid #ececec6b",
                    background: "#1f9fb8",
                    cursor: "pointer",
                    fontWeight: category === c ? 600 : 400,
                  }}
                >
                  {c}
                </div>
              ))}
            </div>
            {/* Inputs - each in 1 line */}
            <input
              className="calc-input"
              placeholder={`Value in ${fromUnit || "unit"}`}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              type="number"
              style={{ marginBottom: "10px" }}
            />

            <div style={{ position: "relative", marginBottom: "10px" }}>
              <div
                className="modern-dropdown"
                onClick={() => setFromOpen(!fromOpen)}
              >
                {fromUnit || "From"}
                <span className="dropdown-indicator">▼</span>

                {fromOpen && (
                  <ul className="dropdown-list">
                    {categories[category].map((u) => (
                      <li
                        key={u}
                        onClick={() => {
                          setFromUnit(u);
                          setFromOpen(false);
                        }}
                      >
                        {u}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div style={{ position: "relative", marginBottom: "10px" }}>
              <div
                className="modern-dropdown"
                onClick={() => setToOpen(!toOpen)}
              >
                {toUnit || "To"}
                <span className="dropdown-indicator">▼</span>

                {toOpen && (
                  <ul className="dropdown-list">
                    {categories[category].map((u) => (
                      <li
                        key={u}
                        onClick={() => {
                          setToUnit(u);
                          setToOpen(false);
                        }}
                      >
                        {u}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            {/* Buttons */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
              <button
                className="calc-button"
                onClick={convertValue}
                style={{ flex: 1 }}
              >
                Convert
              </button>
              <button
                className="calc-button calc-clear"
                onClick={clearAll}
                style={{ flex: 1 }}
              >
                Clear
              </button>
            </div>
            {/* Result */}
            {result && <div className="calc-result">Result: {result}</div>}
          </div>

          <h2>What Is a Unit Conversion Calculator?</h2>
          <p>
            A <strong>unit conversion calculator</strong> is an online tool that
            instantly converts a measurement from one unit to another within the
            same category — such as <strong>meters to feet</strong>,{" "}
            <strong>Celsius to Fahrenheit</strong>, or{" "}
            <strong>kilograms to pounds</strong>. Our free converter supports
            six major measurement systems: Length, Mass, Temperature, Volume,
            Area, and Time — covering both the{" "}
            <strong>metric (SI) system</strong> and the{" "}
            <strong>imperial system</strong> used in the U.S. and UK.
          </p>

          <h2>Unit Conversion Categories — What You Can Convert</h2>

          <h3>1. Length Conversion (Meters, Feet, Miles & More)</h3>
          <p>
            Convert between <strong>kilometers to miles</strong>,{" "}
            <strong>meters to feet</strong>, centimeters to inches, yards to
            meters, and more. <strong>Length unit conversion</strong> is
            critical for construction, travel, navigation, sports, and
            scientific research. Common conversions: 1 mile = 1.60934 km, 1 foot
            = 0.3048 meters, 1 inch = 2.54 cm.
          </p>

          <h3>2. Mass Conversion (kg to lbs, Grams to Ounces & More)</h3>
          <p>
            Easily convert <strong>kilograms to pounds</strong>, grams to
            ounces, milligrams to grams, and more.{" "}
            <strong>Weight and mass conversion</strong> is widely used in
            cooking, fitness, medicine, and shipping. Common conversions: 1 kg =
            2.20462 lbs, 1 pound = 453.59 grams, 1 ounce = 28.35 grams.
          </p>

          <h3>3. Temperature Conversion (Celsius, Fahrenheit & Kelvin)</h3>
          <p>
            Convert <strong>Celsius to Fahrenheit</strong>, Fahrenheit to
            Celsius, and both to Kelvin for scientific use. Temperature
            conversion is essential for weather interpretation, cooking, lab
            work, and international travel. Key formulas: °F = (°C × 1.8) + 32;
            K = °C + 273.15.
          </p>

          <h3>4. Volume Conversion (Liters, Gallons, mL & More)</h3>
          <p>
            Convert <strong>liters to gallons</strong>, milliliters to cups,
            cubic meters to liters, and more. Volume conversion is used daily in
            cooking, chemistry, fuel measurement, and industrial processes.
            Common conversions: 1 gallon = 3.78541 liters, 1 liter = 1000 mL.
          </p>

          <h3>5. Area Conversion (sq ft to sq m, Acres, Hectares & More)</h3>
          <p>
            Convert <strong>square feet to square meters</strong>, acres to
            hectares, square kilometers to square miles, and more. Area
            conversion is essential in real estate, agriculture, architecture,
            and land surveying. Common conversions: 1 acre = 4046.86 sq meters,
            1 hectare = 10,000 sq meters.
          </p>

          <h3>6. Time Conversion (Seconds, Minutes, Hours, Days & Weeks)</h3>
          <p>
            Convert <strong>hours to minutes</strong>, seconds to hours, days to
            weeks, and more. Time conversion is used in project management,
            programming, scientific calculations, and everyday scheduling.
            Common conversions: 1 hour = 3600 seconds, 1 day = 86,400 seconds, 1
            week = 604,800 seconds.
          </p>

          <h2>How Unit Conversion Works — The Formula</h2>
          <p>
            Every <strong>unit conversion</strong> is based on a fixed
            mathematical ratio called a conversion factor. To convert a value,
            multiply it by the conversion factor of the source unit and divide
            by the conversion factor of the target unit:
          </p>
          <pre>
            Converted Value = (Input × Factor of From Unit) ÷ Factor of To Unit
          </pre>
          <p>
            Temperature conversions use dedicated formulas rather than simple
            ratios, since Celsius, Fahrenheit, and Kelvin scales have different
            zero points. Our calculator applies all standard conversion factors
            automatically, giving you precise results to four decimal places.
          </p>

          <h2>Metric vs. Imperial System — Key Differences</h2>
          <p>
            The <strong>metric system (SI)</strong> is the international
            standard used in science and by most countries worldwide. It is
            based on powers of 10, making conversions between units
            straightforward (e.g., 1 km = 1,000 m). The{" "}
            <strong>imperial system</strong> is used primarily in the United
            States and includes units like miles, pounds, gallons, and
            Fahrenheit. Converting between metric and imperial units —such as{" "}
            <strong>miles to kilometers</strong> or{" "}
            <strong>pounds to kilograms</strong> — is one of the most common
            real-world uses of a unit converter.
          </p>

          <h2>Common Unit Conversions Quick Reference</h2>
          <ul className="custom-list">
            <li>
              <strong>1 kilometer</strong> = 0.621371 miles
            </li>
            <li>
              <strong>1 mile</strong> = 1.60934 kilometers
            </li>
            <li>
              <strong>1 kilogram</strong> = 2.20462 pounds
            </li>
            <li>
              <strong>1 pound</strong> = 0.453592 kilograms
            </li>
            <li>
              <strong>0°C (Celsius)</strong> = 32°F (Fahrenheit) = 273.15 K
            </li>
            <li>
              <strong>1 liter</strong> = 0.264172 gallons
            </li>
            <li>
              <strong>1 acre</strong> = 0.404686 hectares
            </li>
            <li>
              <strong>1 foot</strong> = 0.3048 meters
            </li>
            <li>
              <strong>1 inch</strong> = 2.54 centimeters
            </li>
            <li>
              <strong>1 hour</strong> = 3,600 seconds
            </li>
          </ul>

          <h2>Who Uses a Unit Conversion Calculator?</h2>
          <ul className="custom-list">
            <li>
              <strong>Students & teachers</strong> — for physics, chemistry,
              math, and engineering homework
            </li>
            <li>
              <strong>Travelers</strong> — converting miles to km, °F to °C, or
              local currency units
            </li>
            <li>
              <strong>Cooks & bakers</strong> — switching between cups, liters,
              grams, and ounces in recipes
            </li>
            <li>
              <strong>Engineers & architects</strong> — converting area, length,
              and volume across systems
            </li>
            <li>
              <strong>Fitness enthusiasts</strong> — converting kg to lbs for
              bodyweight or equipment
            </li>
            <li>
              <strong>Real estate professionals</strong> — converting square
              feet to square meters or acres to hectares
            </li>
          </ul>

          <h2>Frequently Asked Questions About Unit Conversion</h2>

          <div className="faq-item">
            <h3 onClick={() => toggleFAQ(0)}>
              How do I convert kilometers to miles?
              <i
                className={`fa-solid fa-chevron-down ${openFAQ === 0 ? "rotate" : ""}`}
              ></i>
            </h3>
            {openFAQ === 0 && (
              <p>
                To convert kilometers to miles, multiply the number of
                kilometers by 0.621371. For example, 10 km × 0.621371 ={" "}
                <strong>6.21 miles</strong>. To go the other way, multiply miles
                by 1.60934 to get kilometers. Use the Length category in our
                calculator above for instant results.
              </p>
            )}
          </div>

          <div className="faq-item">
            <h3 onClick={() => toggleFAQ(1)}>
              How do I convert Celsius to Fahrenheit?
              <i
                className={`fa-solid fa-chevron-down ${openFAQ === 1 ? "rotate" : ""}`}
              ></i>
            </h3>
            {openFAQ === 1 && (
              <p>
                The formula to convert Celsius to Fahrenheit is: °F = (°C × 1.8)
                + 32. For example, 25°C = (25 × 1.8) + 32 ={" "}
                <strong>77°F</strong>. To convert Fahrenheit back to Celsius: °C
                = (°F − 32) ÷ 1.8. Select Temperature in the calculator above
                for any conversion instantly.
              </p>
            )}
          </div>

          <div className="faq-item">
            <h3 onClick={() => toggleFAQ(2)}>
              How many grams are in a pound?
              <i
                className={`fa-solid fa-chevron-down ${openFAQ === 2 ? "rotate" : ""}`}
              ></i>
            </h3>
            {openFAQ === 2 && (
              <p>
                There are <strong>453.592 grams</strong> in one pound. To
                convert pounds to grams, multiply the pound value by 453.592. To
                convert grams to pounds, divide by 453.592. Use the Mass
                category in our unit converter for quick, accurate results.
              </p>
            )}
          </div>

          <div className="faq-item">
            <h3 onClick={() => toggleFAQ(3)}>
              Does this calculator support both metric and imperial units?
              <i
                className={`fa-solid fa-chevron-down ${openFAQ === 3 ? "rotate" : ""}`}
              ></i>
            </h3>
            {openFAQ === 3 && (
              <p>
                Yes. Our unit conversion calculator fully supports both the
                metric (SI) system — meters, kilograms, liters, Celsius — and
                the imperial system — miles, pounds, gallons, Fahrenheit. All
                six categories allow cross-system conversions in a single click.
              </p>
            )}
          </div>

          <div className="faq-item">
            <h3 onClick={() => toggleFAQ(4)}>
              How many liters are in a gallon?
              <i
                className={`fa-solid fa-chevron-down ${openFAQ === 4 ? "rotate" : ""}`}
              ></i>
            </h3>
            {openFAQ === 4 && (
              <p>
                One US gallon equals <strong>3.78541 liters</strong>. To convert
                gallons to liters, multiply by 3.78541. To convert liters to
                gallons, divide by 3.78541. Note: the UK (imperial) gallon is
                larger at 4.54609 liters. Use the Volume category in our
                calculator for instant conversions.
              </p>
            )}
          </div>

          <div className="faq-item">
            <h3 onClick={() => toggleFAQ(5)}>
              How do I convert square feet to square meters?
              <i
                className={`fa-solid fa-chevron-down ${openFAQ === 5 ? "rotate" : ""}`}
              ></i>
            </h3>
            {openFAQ === 5 && (
              <p>
                To convert square feet to square meters, multiply by 0.092903.
                For example, 500 sq ft × 0.092903 ={" "}
                <strong>46.45 square meters</strong>. To convert square meters
                back to square feet, multiply by 10.7639. Use the Area category
                above for real estate and construction conversions.
              </p>
            )}
          </div>

          <div className="faq-item">
            <h3 onClick={() => toggleFAQ(6)}>
              Is this unit converter free to use?
              <i
                className={`fa-solid fa-chevron-down ${openFAQ === 6 ? "rotate" : ""}`}
              ></i>
            </h3>
            {openFAQ === 6 && (
              <p>
                Yes — completely free with no sign-up, no downloads, and no
                limits. Our online unit conversion calculator works on any
                device including mobile phones, tablets, and desktops. Results
                are displayed instantly to four decimal places using
                internationally standardized conversion factors.
              </p>
            )}
          </div>
        </div>
        {/* ---- SIDEBAR ---- */}
        <aside className="sidebar">
          <div className="sidebar-box">
            <p style={{ fontSize: "20px", fontWeight: 600 }}>
              Related Calculators
            </p>
            <ul style={{ listStyle: "none", padding: 0 }}>
              <li>
                <Link href="/gpa-calculator/">
                  <span
                    style={{ textDecoration: "none" }}
                    className="hover-item"
                  >
                    GPA Calculator
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/gpa-percentage/">
                  <span
                    style={{ textDecoration: "none" }}
                    className="hover-item"
                  >
                    GPA Percentage Calculator
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/time-calculator/">
                  <span
                    style={{ textDecoration: "none" }}
                    className="hover-item"
                  >
                    Time Calculator
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/days-between-calculator/">
                  <span
                    style={{ textDecoration: "none" }}
                    className="hover-item"
                  >
                    Days Between Calculator
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/age-calculator/">
                  <span
                    style={{ textDecoration: "none" }}
                    className="hover-item"
                  >
                    Age Calculator
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/percentage-calculator/">
                  <span
                    style={{ textDecoration: "none" }}
                    className="hover-item"
                  >
                    Percentage Calculator
                  </span>
                </Link>
              </li>

              <style jsx>{`
                .hover-item:hover {
                  text-decoration: underline;
                }
              `}</style>
            </ul>
          </div>
        </aside>
      </div>
    </>
  );
}
