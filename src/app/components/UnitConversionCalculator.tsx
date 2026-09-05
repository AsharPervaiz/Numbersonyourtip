"use client";
import { useState } from "react";
import Link from "next/link";

type Category = "Length" | "Mass" | "Temperature" | "Volume" | "Area" | "Time";

const FAQ_DATA: [string, string][] = [
  [
    "Why can I not convert temperature by multiplying?",
    "Because Celsius and Fahrenheit do not share a zero point, so the conversion needs an offset as well as a scale factor: °F = (°C × 9 ÷ 5) + 32. Every other conversion is a pure scaling, since zero kilograms is zero pounds. Temperature is the one case where the shortcut that works everywhere else gives a wrong answer.",
  ],
  [
    "Is a 10 degree rise in Celsius an 18 or a 50 degree rise in Fahrenheit?",
    "Eighteen. A difference in temperature converts using only the ratio, because the offset of 32 cancels when you subtract two converted values. The full formula with the offset applies to an absolute temperature — 10 °C is 50 °F. Confusing a reading with a change is the classic temperature conversion error.",
  ],
  [
    "Are conversion factors exact or approximate?",
    "The common ones are exact by definition. An inch is defined as precisely 2.54 centimetres, a pound as 0.45359237 kilograms and a foot as 0.3048 metres by international agreement, so the factors carry no error at all. Any imprecision in a converted figure comes from your original measurement or your rounding, never from the factor.",
  ],
  [
    "How many decimal places should I keep?",
    "Roughly as many significant figures as your input had, rounding only at the end. Measuring a room as 12 feet and converting gives 3.6576 metres, which claims precision to a tenth of a millimetre from a measurement good to about 15 centimetres. The honest answer is 3.7 metres. Rounding at each intermediate step compounds error, so keep full precision until the last operation.",
  ],
  [
    "Why do US and UK gallons give different answers?",
    "They are genuinely different units. A US gallon is about 3.785 litres and an imperial gallon about 4.546 — roughly 20% apart. This is why fuel economy in miles per gallon is not comparable between the two systems, and why the same car is quoted at a higher MPG in Britain without being any more efficient.",
  ],
  [
    "Are fluid ounces the same as ounces?",
    "No. A fluid ounce measures volume and an ounce measures weight, so they are only interchangeable for a substance whose density happens to make them equal. A cup of flour and a cup of water occupy the same volume and weigh very different amounts, which is why recipes measured by weight are more reliable than those measured by cup.",
  ],
  [
    "Which ton is a ton?",
    "It depends where you are. A metric tonne is 1,000 kilograms, a short ton is 2,000 pounds and a long ton is 2,240 pounds — spread across roughly a 10% range. Any figure in tons that matters should say which one, since none of them is a safe default.",
  ],
  [
    "Should I convert through an intermediate unit?",
    "Only if no direct factor exists. Each conversion step introduces rounding, so chaining through an intermediate unit accumulates error that a direct conversion avoids. Where you do have to chain, keep full precision throughout and round once at the end rather than after each step.",
  ],
  [
    "How do I check a conversion is the right way round?",
    "Ask whether the answer should be bigger or smaller before looking at the digits. Converting to a smaller unit always produces a larger number and vice versa — a metre is 100 centimetres but only 0.001 kilometres. Checking direction first catches inverted factors immediately, which is the most common conversion mistake.",
  ],
];

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
    <div className="page-layout">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQ_DATA.map(([q, a]) => ({
              "@type": "Question",
              name: q,
              acceptedAnswer: { "@type": "Answer", text: a },
            })),
          }),
        }}
      />
      {/* ---- MAIN CONTENT ---- */}
      <div className="single-page-padding">
        <h1>Unit Conversion Calculator — Length, Weight, Temperature</h1>

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

          <h2>Almost Every Conversion Is One Multiplication</h2>
          <p>
            Length, mass, volume, area, speed and energy all work the same way.
            Each unit has a fixed ratio to every other unit measuring the same
            quantity, so converting means multiplying by that ratio once.
          </p>
          <pre>Value in new unit = Value in old unit × Conversion factor</pre>
          <p>
            The only decision is which way round to apply it. Going to a smaller
            unit produces a bigger number, and going to a larger unit produces a
            smaller one. If a metre becomes 0.001 kilometres, the answer must be
            smaller; if it becomes 100 centimetres, it must be bigger. Checking the
            direction before reading the digits catches most errors immediately.
          </p>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>From</th>
                  <th>To</th>
                  <th>Multiply by</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Inches</td>
                  <td>Centimetres</td>
                  <td>2.54 (exact)</td>
                </tr>
                <tr>
                  <td>Miles</td>
                  <td>Kilometres</td>
                  <td>1.609344 (exact)</td>
                </tr>
                <tr>
                  <td>Pounds</td>
                  <td>Kilograms</td>
                  <td>0.45359237 (exact)</td>
                </tr>
                <tr>
                  <td>US gallons</td>
                  <td>Litres</td>
                  <td>3.785411784 (exact)</td>
                </tr>
                <tr>
                  <td>Imperial gallons</td>
                  <td>Litres</td>
                  <td>4.54609 (exact)</td>
                </tr>
                <tr>
                  <td>Feet</td>
                  <td>Metres</td>
                  <td>0.3048 (exact)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            These factors are exact by definition rather than measured
            approximations — the inch was defined as precisely 2.54 centimetres by
            international agreement, so the conversion carries no error at all. Any
            imprecision in your answer comes from your input or your rounding, not
            from the factor.
          </p>

          <h2>Temperature Is the Exception</h2>
          <p>
            Every other conversion is a pure scaling, because zero means the same
            thing in both units — zero kilograms is zero pounds. Temperature scales
            do not share a zero point, so they need an offset as well as a scale
            factor.
          </p>
          <pre>
            °F = (°C × 9 ÷ 5) + 32{"\n"}°C = (°F − 32) × 5 ÷ 9{"\n"}K = °C + 273.15
          </pre>
          <p>
            The offset is why you cannot convert a temperature by multiplying
            alone, and why the shortcut that works everywhere else fails here. It
            also produces a genuinely useful consequence: a{" "}
            <em>difference</em> in temperature converts without the offset. A rise
            of 10 °C is a rise of 18 °F, not 50 °F, because the 32 cancels when you
            subtract two converted values.
          </p>
          <p>
            Mixing those two up is the classic temperature error. Converting a
            thermostat setting uses the full formula; converting how much the
            temperature changed uses only the ratio.
          </p>
          <p>
            Kelvin behaves differently again, having a true zero, so it scales
            proportionally with Celsius and needs only the offset of 273.15.
          </p>

          <h2>Do Not Report More Precision Than You Had</h2>
          <p>
            A conversion cannot add accuracy that the original measurement did not
            contain, and calculators encourage exactly that by returning many
            decimal places.
          </p>
          <p>
            Measuring a room as 12 feet — to the nearest foot — and converting gives
            3.6576 metres. Reporting that figure claims precision to a tenth of a
            millimetre from a measurement good to about 15 centimetres. The honest
            answer is 3.7 metres, or 3.66 at most.
          </p>
          <p>
            The working rule is to keep roughly as many significant figures as your
            input had, and to round only at the very end. Rounding at each
            intermediate step compounds the error, particularly in a chain of two
            or three conversions.
          </p>

          <h2>Where Unit Errors Do Real Damage</h2>
          <ul className="custom-list">
            <li>
              <strong>Two different gallons.</strong> A US gallon is about 3.785
              litres and an imperial gallon about 4.546 — a difference of roughly
              20%. Fuel economy figures quoted in miles per gallon are not
              comparable between the two systems without saying which is meant.
            </li>
            <li>
              <strong>Weight and mass in recipes.</strong> Fluid ounces measure
              volume and ounces measure weight, and they are not interchangeable.
              A cup of flour and a cup of water weigh very different amounts.
            </li>
            <li>
              <strong>Ambiguous tons.</strong> Metric tonnes, short tons and long
              tons all exist and differ by up to about 10%.
            </li>
            <li>
              <strong>Converting twice.</strong> Chaining conversions through an
              intermediate unit accumulates rounding at each step. Convert directly
              where a factor exists.
            </li>
            <li>
              <strong>Assuming a system from a country.</strong> Several countries
              use metric officially and imperial conversationally, so a figure
              given without units cannot be inferred from where it came from.
            </li>
          </ul>
          <p>
            For fuel economy specifically, where the two gallons and the reversed
            L/100 km scale all collide, our{" "}
            <Link href="/fuel-cost-calculator/" className="my-link">
              fuel cost calculator
            </Link>{" "}
            handles the conversions directly. For currency, which is a rate rather
            than a fixed factor, use the{" "}
            <Link href="/currency-converter/" className="my-link">
              currency converter
            </Link>
            .
          </p>
          <h2>Unit Conversion Questions</h2>

          {FAQ_DATA.map(([q, a], i) => {
            const isOpen = openFAQ === i;
            return (
          <div className="faq-item" key={i}>
            <h3
              onClick={() => toggleFAQ(i)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggleFAQ(i);
                }
              }}
              role="button"
              tabIndex={0}
              aria-expanded={isOpen}
              aria-controls={`faq-answer-${i}`}
            >
              {q}
              <i
                className={`fa-solid fa-chevron-down ${isOpen ? "rotate" : ""}`}
                aria-hidden="true"
              />
            </h3>
            <div
              id={`faq-answer-${i}`}
              className={`faq-answer-wrap ${isOpen ? "open" : ""}`}
              aria-hidden={!isOpen}
            >
              <div className="faq-answer-inner">
                <p>{a}</p>
              </div>
            </div>
          </div>
            );
          })}
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
  );
}
