"use client";
import { useState } from "react";

export default function BMICalculator() {
  const [weight, setWeight] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [heightUnit, setHeightUnit] = useState("cm");
  const [bmi, setBmi] = useState<string | null>(null);
  const [bmiCategory, setBmiCategory] = useState("");

  const calculateBMI = () => {
    if (!weight) return;

    let height = 0;
    if (heightUnit === "cm") {
      if (!heightCm) return;
      height = Number(heightCm);
    } else {
      if (!heightFt || !heightIn) return;
      height = Number(heightFt) * 30.48 + Number(heightIn) * 2.54;
    }

    const h = height / 100;
    const result = Number(weight) / (h * h);
    const roundedResult = result.toFixed(2);
    setBmi(roundedResult);

    let category = "";
    if (result < 18.5) {
      category = "Underweight";
    } else if (result <= 24.9) {
      category = "Normal / Healthy weight";
    } else if (result <= 29.9) {
      category = "Overweight";
    } else {
      category = "Obese";
    }
    setBmiCategory(category);
  };

  /* ✅ Clear function */
  const handleClear = () => {
    setWeight("");
    setHeightCm("");
    setHeightFt("");
    setHeightIn("");
    setHeightUnit("cm");
    setBmi(null);
    setBmiCategory("");
  };

  return (
    <div className="single-page-padding">
    <div className="calc-card single-calc">
      <h2 className="calc-title">BMI Calculator</h2>

      <input
        className="calc-input"
        type="number"
        placeholder="Weight (kg)"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
      />

      {/* Height Unit Selector */}
      <select
        className="calc-input"
        value={heightUnit}
        onChange={(e) => setHeightUnit(e.target.value)}
      >
        <option value="cm">Height in cm</option>
        <option value="ftin">Height in ft / in</option>
      </select>

      {heightUnit === "cm" ? (
        <input
          className="calc-input"
          type="number"
          placeholder="Height (cm)"
          value={heightCm}
          onChange={(e) => setHeightCm(e.target.value)}
        />
      ) : (
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            className="calc-input"
            type="number"
            placeholder="Feet"
            value={heightFt}
            onChange={(e) => setHeightFt(e.target.value)}
          />
          <input
            className="calc-input"
            type="number"
            placeholder="Inches"
            value={heightIn}
            onChange={(e) => setHeightIn(e.target.value)}
          />
        </div>
      )}

      {/* Buttons */}
      <div style={{ display: "flex", gap: "10px" }}>
        <button className="calc-button" onClick={calculateBMI}>
          Calculate
        </button>
        <button className="calc-button calc-clear" onClick={handleClear}>
          Clear
        </button>
      </div>

      {bmi && (
        <div className="calc-result">
          <strong>Your BMI:</strong> {bmi} <br />
          <strong>Category:</strong> {bmiCategory}
        </div>
      )}
    </div>
    </div>
  );
}
