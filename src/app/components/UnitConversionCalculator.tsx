"use client";
import { useState } from "react";

type Category = "Length" | "Mass" | "Temperature" | "Volume" | "Area" | "Time";

export default function UnitConversionCalculator() {
  const [category, setCategory] = useState<Category>("Length");
  const [fromUnit, setFromUnit] = useState("");
  const [toUnit, setToUnit] = useState("");
  const [value, setValue] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const categories: Record<Category, string[]> = {
    Length: ["Meter", "Kilometer", "Centimeter", "Millimeter", "Inch", "Foot", "Yard", "Mile"],
    Mass: ["Gram", "Kilogram", "Milligram", "Pound", "Ounce"],
    Temperature: ["Celsius", "Fahrenheit", "Kelvin"],
    Volume: ["Liter", "Milliliter", "Cubic Meter", "Cubic Centimeter", "Gallon", "Pint"],
    Area: ["Square Meter", "Square Kilometer", "Square Foot", "Square Yard", "Acre", "Hectare"],
    Time: ["Second", "Minute", "Hour", "Day", "Week"],
  };

  const convertValue = () => {
    if (!value || !fromUnit || !toUnit) return;

    const v = Number(value);
    let res: number = v;

    switch (category) {
      case "Length":
        // Convert everything to meters first
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
    <div className="calc-card">
      <h2 className="calc-title">Unit Conversion</h2>

      {/* Category Switcher */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
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
              flex: 1,
              padding: "10px",
              textAlign: "center",
              borderRadius: "2px",
              border: category === c ? "2px solid #c5c5c5" : "1px solid #e0e0e0",
              background: "#f5f7fb",
              cursor: "pointer",
              fontWeight: category === c ? 600 : 400,
            }}
          >
            {c}
          </div>
        ))}
      </div>

      {/* Inputs */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <input
          className="calc-input"
          placeholder={`Value in ${fromUnit || "unit"}`}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          type="number"
        />
        <select
          className="calc-input"
          value={fromUnit}
          onChange={(e) => setFromUnit(e.target.value)}
        >
          <option value="">From</option>
          {categories[category].map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>

        <select
          className="calc-input"
          value={toUnit}
          onChange={(e) => setToUnit(e.target.value)}
        >
          <option value="">To</option>
          {categories[category].map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
      </div>

      {/* Buttons */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <button className="calc-button" onClick={convertValue} style={{ flex: 1 }}>
          Convert
        </button>
        <button className="calc-button" onClick={clearAll} style={{ flex: 1 }}>
          Clear
        </button>
      </div>

      {/* Result */}
      {result && <div className="calc-result">Result: {result}</div>}
    </div>
  );
}
