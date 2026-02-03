"use client";
import { useState } from "react";

export default function CalorieCalculator() {
  const [weight, setWeight] = useState(""); // in kg
  const [heightCm, setHeightCm] = useState(""); // in cm
  const [heightFt, setHeightFt] = useState(""); // feet part
  const [heightIn, setHeightIn] = useState(""); // inch part
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [activity, setActivity] = useState("1.2"); // sedentary
  const [calories, setCalories] = useState<number | null>(null);
  const [heightUnit, setHeightUnit] = useState("cm"); // default cm

  const calculateCalories = () => {
    if (!weight || !age) return;

    let height = 0;

    if (heightUnit === "cm") {
      if (!heightCm) return;
      height = Number(heightCm);
    } else {
      if (!heightFt || !heightIn) return;
      height = Number(heightFt) * 30.48 + Number(heightIn) * 2.54; // convert ft/in to cm
    }

    const w = Number(weight);
    const a = Number(age);

    let bmr = 0;
    if (gender === "male") {
      bmr = 10 * w + 6.25 * height - 5 * a + 5;
    } else {
      bmr = 10 * w + 6.25 * height - 5 * a - 161;
    }

    const totalCalories = Math.round(bmr * Number(activity));
    setCalories(totalCalories);
  };

  /* ✅ Clear function */
  const handleClear = () => {
    setWeight("");
    setHeightCm("");
    setHeightFt("");
    setHeightIn("");
    setAge("");
    setGender("male");
    setActivity("1.2");
    setCalories(null);
    setHeightUnit("cm");
  };

  return (
    <div className="calc-card">
      <h2 className="calc-title">Calorie Calculator</h2>

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
        <option value="ftin">Height in ft/in</option>
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

      <input
        className="calc-input"
        type="number"
        placeholder="Age (years)"
        value={age}
        onChange={(e) => setAge(e.target.value)}
      />

      <select
        className="calc-input"
        value={gender}
        onChange={(e) => setGender(e.target.value)}
      >
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>

      <select
        className="calc-input"
        value={activity}
        onChange={(e) => setActivity(e.target.value)}
      >
        <option value="1.2">Sedentary (little or no exercise)</option>
        <option value="1.375">Lightly active (1-3 days/week)</option>
        <option value="1.55">Moderately active (3-5 days/week)</option>
        <option value="1.725">Very active (6-7 days/week)</option>
        <option value="1.9">Extra active (hard exercise & physical job)</option>
      </select>

      {/* Buttons */}
      <div style={{ display: "flex", gap: "10px" }}>
        <button className="calc-button" onClick={calculateCalories}>
          Calculate
        </button>
        <button className="calc-button calc-clear" onClick={handleClear}>
          Clear
        </button>
      </div>

      {calories !== null && (
        <div className="calc-result">
          Daily Calorie Needs: ≈ {calories} kcal
        </div>
      )}
    </div>
  );
}
