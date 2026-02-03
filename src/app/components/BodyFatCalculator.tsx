"use client";
import { useState } from "react";

export default function BodyFatCalculator() {
  const [weight, setWeight] = useState("");
  const [neck, setNeck] = useState("");
  const [waist, setWaist] = useState("");
  const [hip, setHip] = useState(""); // for females
  const [heightCm, setHeightCm] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [heightUnit, setHeightUnit] = useState("cm");
  const [gender, setGender] = useState("male");
  const [age, setAge] = useState("");
  const [bodyFat, setBodyFat] = useState<number | null>(null);

  const calculateBodyFat = () => {
    if (!weight || !neck || !waist || !age) return;
    if (gender === "female" && !hip) return;

    // Convert height to cm
    let height = 0;
    if (heightUnit === "cm") {
      if (!heightCm) return;
      height = Number(heightCm);
    } else {
      if (!heightFt || !heightIn) return;
      height = Number(heightFt) * 30.48 + Number(heightIn) * 2.54;
    }

    const w = Number(weight);
    const n = Number(neck);
    const waistNum = Number(waist);
    const h = height;

    let bf = 0;

    if (gender === "male") {
      bf =
        495 /
          (1.0324 -
            0.19077 * Math.log10(waistNum - n) +
            0.15456 * Math.log10(h)) -
        450;
    } else {
      const hipNum = Number(hip);
      bf =
        495 /
          (1.29579 -
            0.35004 * Math.log10(waistNum + hipNum - n) +
            0.221 * Math.log10(h)) -
        450;
    }

    setBodyFat(parseFloat(bf.toFixed(2)));
  };

  /* ✅ Clear function */
  const handleClear = () => {
    setWeight("");
    setNeck("");
    setWaist("");
    setHip("");
    setHeightCm("");
    setHeightFt("");
    setHeightIn("");
    setHeightUnit("cm");
    setGender("male");
    setAge("");
    setBodyFat(null);
  };

  return (
    <div className="calc-card">
      <h2 className="calc-title">Body Fat Calculator</h2>

      <input
        className="calc-input"
        type="number"
        placeholder="Weight (kg)"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
      />

      <input
        className="calc-input"
        type="number"
        placeholder="Neck (cm)"
        value={neck}
        onChange={(e) => setNeck(e.target.value)}
      />

      <input
        className="calc-input"
        type="number"
        placeholder="Waist (cm)"
        value={waist}
        onChange={(e) => setWaist(e.target.value)}
      />

      {gender === "female" && (
        <input
          className="calc-input"
          type="number"
          placeholder="Hip (cm)"
          value={hip}
          onChange={(e) => setHip(e.target.value)}
        />
      )}

      <input
        className="calc-input"
        type="number"
        placeholder="Age (years)"
        value={age}
        onChange={(e) => setAge(e.target.value)}
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

      <select
        className="calc-input"
        value={gender}
        onChange={(e) => setGender(e.target.value)}
      >
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>

      {/* Buttons */}
      <div style={{ display: "flex", gap: "10px" }}>
        <button className="calc-button" onClick={calculateBodyFat}>
          Calculate
        </button>
        <button className="calc-button calc-clear" onClick={handleClear}>
          Clear
        </button>
      </div>

      {bodyFat !== null && (
        <div className="calc-result">Body Fat: {bodyFat} %</div>
      )}
    </div>
  );
}
