"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

/* ─────────────────────────────────────────
   Types
───────────────────────────────────────── */
type Gender = "male" | "female";
type BFCategory = "essential" | "athlete" | "fitness" | "acceptable" | "obese";
type MeasureUnit = "cm" | "in";

interface BFResult {
  bf: number;
  category: BFCategory;
  gender: Gender;
  fatMassKg: number;
  leanMassKg: number;
  weightKg: number;
}

/* ─────────────────────────────────────────
   Constants
───────────────────────────────────────── */
const CATEGORY_LABELS: Record<BFCategory, string> = {
  essential: "Essential fat",
  athlete: "Athlete",
  fitness: "Fitness",
  acceptable: "Acceptable",
  obese: "Obese",
};
const CATEGORY_BADGE: Record<BFCategory, string> = {
  essential: "info",
  athlete: "good",
  fitness: "normal",
  acceptable: "warning",
  obese: "danger",
};
const HEALTHY_TARGET: Record<Gender, number> = { male: 15.5, female: 22.5 };

const WORLD_GROUPS_MALE = [
  { label: "Essential", pct: 4, color: "#B5D4F4", key: "essential" },
  { label: "Athlete", pct: 13, color: "#97C459", key: "athlete" },
  { label: "Fitness", pct: 18, color: "#C0DD97", key: "fitness" },
  { label: "Acceptable", pct: 38, color: "#FAC775", key: "acceptable" },
  { label: "Obese", pct: 27, color: "#F09595", key: "obese" },
];
const WORLD_GROUPS_FEMALE = [
  { label: "Essential", pct: 3, color: "#B5D4F4", key: "essential" },
  { label: "Athlete", pct: 10, color: "#97C459", key: "athlete" },
  { label: "Fitness", pct: 15, color: "#C0DD97", key: "fitness" },
  { label: "Acceptable", pct: 40, color: "#FAC775", key: "acceptable" },
  { label: "Obese", pct: 32, color: "#F09595", key: "obese" },
];

/* ─────────────────────────────────────────
   Pure helpers
───────────────────────────────────────── */
function getCategory(bf: number, gender: Gender): BFCategory {
  if (gender === "male") {
    if (bf < 6) return "essential";
    if (bf < 14) return "athlete";
    if (bf < 18) return "fitness";
    if (bf < 25) return "acceptable";
    return "obese";
  } else {
    if (bf < 14) return "essential";
    if (bf < 21) return "athlete";
    if (bf < 25) return "fitness";
    if (bf < 32) return "acceptable";
    return "obese";
  }
}
function needleDeg(bf: number): number {
  const clamped = Math.min(Math.max(bf, 0), 50);
  return -90 + (clamped / 50) * 180;
}
function barPct(bf: number): number {
  const clamped = Math.min(Math.max(bf, 0), 50);
  return 2 + (clamped / 50) * 96;
}
function toCm(val: number, unit: MeasureUnit): number {
  return unit === "in" ? val * 2.54 : val;
}
function toKg(val: number, unit: MeasureUnit): number {
  return unit === "in" ? val * 0.453592 : val;
}

/* ─────────────────────────────────────────
   BodyFatResultPanel
───────────────────────────────────────── */
function BodyFatResultPanel({ result }: { result: BFResult | null }) {
  if (!result) {
    return (
      <div className="cr-panel-placeholder">
        <div className="cr-ph-icon">
          <i className="fa-solid fa-person" aria-hidden="true" />
        </div>
        Enter your measurements to see your body fat result here.
      </div>
    );
  }

  const { bf, category, gender, fatMassKg, leanMassKg, weightKg } = result;
  const target = HEALTHY_TARGET[gender];
  const fatDiff =
    bf > target
      ? `${((bf / 100) * weightKg - (target / 100) * weightKg).toFixed(1)} kg to lose`
      : "You're on track";
  const worldGroups =
    gender === "male" ? WORLD_GROUPS_MALE : WORLD_GROUPS_FEMALE;
  const ticks =
    gender === "male"
      ? ["0%", "6%", "14%", "18%", "25%", "50%"]
      : ["0%", "14%", "21%", "25%", "32%", "50%"];

  return (
    <div className="cr-panel">
      <div className="cr-gauge-wrap">
        <svg
          className="cr-gauge-svg"
          width="100"
          height="60"
          viewBox="0 0 120 70"
          role="img"
          aria-label={`Body fat gauge showing ${bf.toFixed(1)}%`}
        >
          <defs>
            <clipPath id="bf-half">
              <rect x="0" y="0" width="120" height="65" />
            </clipPath>
          </defs>
          <circle
            cx="60"
            cy="65"
            r="52"
            fill="none"
            stroke="#B5D4F4"
            strokeWidth="12"
            strokeDasharray="33 326"
            strokeDashoffset="-163"
            clipPath="url(#bf-half)"
          />
          <circle
            cx="60"
            cy="65"
            r="52"
            fill="none"
            stroke="#97C459"
            strokeWidth="12"
            strokeDasharray="52 326"
            strokeDashoffset="-196"
            clipPath="url(#bf-half)"
          />
          <circle
            cx="60"
            cy="65"
            r="52"
            fill="none"
            stroke="#C0DD97"
            strokeWidth="12"
            strokeDasharray="26 326"
            strokeDashoffset="-248"
            clipPath="url(#bf-half)"
          />
          <circle
            cx="60"
            cy="65"
            r="52"
            fill="none"
            stroke="#FAC775"
            strokeWidth="12"
            strokeDasharray="46 326"
            strokeDashoffset="-274"
            clipPath="url(#bf-half)"
          />
          <circle
            cx="60"
            cy="65"
            r="52"
            fill="none"
            stroke="#F09595"
            strokeWidth="12"
            strokeDasharray="169 326"
            strokeDashoffset="-320"
            clipPath="url(#bf-half)"
          />
          <line
            x1="60"
            y1="65"
            x2="60"
            y2="20"
            stroke="#111111"
            strokeWidth="2.5"
            strokeLinecap="round"
            style={{
              transformOrigin: "60px 65px",
              transform: `rotate(${needleDeg(bf)}deg)`,
              transition: "transform 0.5s ease",
            }}
          />
          <circle cx="60" cy="65" r="5" fill="#111111" />
        </svg>
        <div className="cr-score-block">
          <div className="cr-score">{bf.toFixed(1)}%</div>
          <div className="cr-score-label">Body Fat</div>
          <span className={`cr-badge ${CATEGORY_BADGE[category]}`}>
            {CATEGORY_LABELS[category]}
          </span>
        </div>
      </div>
      <hr className="cr-divider" />
      <div>
        <div className="cr-bar-label">where you land on the body fat scale</div>
        <div
          className="cr-bar-track"
          style={{
            background:
              "linear-gradient(to right, #B5D4F4 0%, #97C459 15%, #C0DD97 32%, #FAC775 52%, #F09595 100%)",
          }}
        >
          <div className="cr-bar-thumb" style={{ left: `${barPct(bf)}%` }} />
        </div>
        <div className="cr-bar-ticks">
          {ticks.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
      </div>
      <hr className="cr-divider" />
      <div className="cr-metrics-grid">
        <div className="cr-metric-card">
          <div className="cr-m-label">Fat mass</div>
          <div className="cr-m-value">{fatMassKg.toFixed(1)} kg</div>
          <div className="cr-m-sub">of your body weight</div>
        </div>
        <div className="cr-metric-card">
          <div className="cr-m-label">Lean mass</div>
          <div className="cr-m-value">{leanMassKg.toFixed(1)} kg</div>
          <div className="cr-m-sub">muscle, bone &amp; water</div>
        </div>
        <div className="cr-metric-card">
          <div className="cr-m-label">Fitness target</div>
          <div className="cr-m-value">{target}%</div>
          <div className="cr-m-sub">healthy midpoint</div>
        </div>
        <div className="cr-metric-card">
          <div className="cr-m-label">Fat to lose</div>
          <div className="cr-m-value">{fatDiff}</div>
          <div className="cr-m-sub">to reach fitness range</div>
        </div>
      </div>
      <hr className="cr-divider" />
      <div>
        <div className="cr-world-title">
          Body fat distribution — {gender === "male" ? "men" : "women"}{" "}
          worldwide
        </div>
        {worldGroups.map((g) => (
          <div className="cr-world-bar-row" key={g.key}>
            <span className="cr-w-label">{g.label}</span>
            <div className="cr-world-track">
              <div
                className="cr-world-fill"
                style={{ width: `${g.pct}%`, background: g.color }}
              />
            </div>
            <span className="cr-w-pct">{g.pct}%</span>
          </div>
        ))}
        <p className="cr-world-note">
          You are in the <strong>{CATEGORY_LABELS[category]}</strong> group —{" "}
          {worldGroups.find((g) => g.key === category)!.pct}% of{" "}
          {gender === "male" ? "men" : "women"} worldwide.
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Main Calculator Page
───────────────────────────────────────── */
export default function BodyFatCalculator() {
  const [weight, setWeight] = useState("");
  const [neck, setNeck] = useState("");
  const [waist, setWaist] = useState("");
  const [hip, setHip] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [heightUnit, setHeightUnit] = useState<"cm" | "ftin">("cm");
  const [measureUnit, setMeasureUnit] = useState<MeasureUnit>("cm");
  const [weightUnit, setWeightUnit] = useState<MeasureUnit>("cm");
  const [gender, setGender] = useState<Gender>("male");
  const [age, setAge] = useState("");
  const [heightOpen, setHeightOpen] = useState(false);
  const [genderOpen, setGenderOpen] = useState(false);
  const [measureOpen, setMeasureOpen] = useState(false);
  const [weightOpen, setWeightOpen] = useState(false);
  const [result, setResult] = useState<BFResult | null>(null);
  const [error, setError] = useState("");
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const toggleFAQ = (i: number) => setOpenFAQ(openFAQ === i ? null : i);

  const allFilled = (): boolean => {
    if (!weight || !neck || !waist || !age) return false;
    if (gender === "female" && !hip) return false;
    if (heightUnit === "cm" && !heightCm) return false;
    if (heightUnit === "ftin" && !heightFt) return false;
    return true;
  };

  useEffect(() => {
    setError("");
    const w = Number(weight);
    const n = Number(neck);
    const wt = Number(waist);
    const a = Number(age);
    if (!w || w <= 0) {
      setResult(null);
      return;
    }
    if (!n || n <= 0) {
      setResult(null);
      return;
    }
    if (!wt || wt <= 0) {
      setResult(null);
      return;
    }
    if (!a || a <= 0) {
      setResult(null);
      return;
    }
    const nCm = toCm(n, measureUnit);
    const wtCm = toCm(wt, measureUnit);
    const wKg = toKg(w, weightUnit);
    if (wtCm <= nCm) {
      if (allFilled())
        setError("Waist must be greater than neck. Check your measurements.");
      setResult(null);
      return;
    }
    let hCm = 0;
    if (heightUnit === "cm") {
      hCm = Number(heightCm);
      if (!hCm || hCm <= 0) {
        setResult(null);
        return;
      }
    } else {
      const ft = Number(heightFt);
      if (!ft || ft <= 0) {
        setResult(null);
        return;
      }
      hCm = ft * 30.48 + (Number(heightIn) || 0) * 2.54;
    }
    if (!hCm || hCm <= 0) {
      setResult(null);
      return;
    }
    let bf = 0;
    if (gender === "male") {
      bf =
        495 /
          (1.0324 -
            0.19077 * Math.log10(wtCm - nCm) +
            0.15456 * Math.log10(hCm)) -
        450;
    } else {
      const hp = Number(hip);
      const hpCm = toCm(hp, measureUnit);
      if (!hp || hp <= 0) {
        setResult(null);
        return;
      }
      if (wtCm + hpCm <= nCm) {
        setResult(null);
        return;
      }
      bf =
        495 /
          (1.29579 -
            0.35004 * Math.log10(wtCm + hpCm - nCm) +
            0.221 * Math.log10(hCm)) -
        450;
    }
    if (!isFinite(bf) || bf <= 0 || bf > 70) {
      if (allFilled())
        setError(
          "Could not calculate — please check your measurements are realistic.",
        );
      setResult(null);
      return;
    }
    const bfR = parseFloat(bf.toFixed(2));
    const fatMassKg = parseFloat(((bfR / 100) * wKg).toFixed(2));
    const leanMassKg = parseFloat((wKg - fatMassKg).toFixed(2));
    setResult({
      bf: bfR,
      category: getCategory(bfR, gender),
      gender,
      fatMassKg,
      leanMassKg,
      weightKg: wKg,
    });
  }, [
    weight,
    neck,
    waist,
    hip,
    heightCm,
    heightFt,
    heightIn,
    heightUnit,
    measureUnit,
    weightUnit,
    gender,
    age,
  ]);

  const handleCalculate = () => {
    const w = Number(weight);
    const n = Number(neck);
    const wt = Number(waist);
    const a = Number(age);
    setError("");
    if (!w || !n || !wt || !a) return;
    if (gender === "female" && !hip) return;
    const nCm = toCm(n, measureUnit);
    const wtCm = toCm(wt, measureUnit);
    const wKg = toKg(w, weightUnit);
    if (wtCm <= nCm) {
      setError("Waist must be greater than neck. Check your measurements.");
      return;
    }
    let hCm = 0;
    if (heightUnit === "cm") {
      hCm = Number(heightCm);
      if (!hCm || hCm <= 0) return;
    } else {
      const ft = Number(heightFt);
      if (!ft || ft <= 0) return;
      hCm = ft * 30.48 + (Number(heightIn) || 0) * 2.54;
    }
    if (!hCm) return;
    let bf = 0;
    if (gender === "male") {
      bf =
        495 /
          (1.0324 -
            0.19077 * Math.log10(wtCm - nCm) +
            0.15456 * Math.log10(hCm)) -
        450;
    } else {
      const hp = Number(hip);
      const hpCm = toCm(hp, measureUnit);
      if (!hp) return;
      bf =
        495 /
          (1.29579 -
            0.35004 * Math.log10(wtCm + hpCm - nCm) +
            0.221 * Math.log10(hCm)) -
        450;
    }
    if (!isFinite(bf) || bf <= 0 || bf > 70) {
      setError(
        "Could not calculate — please check your measurements are realistic.",
      );
      return;
    }
    const bfR = parseFloat(bf.toFixed(2));
    const fatMassKg = parseFloat(((bfR / 100) * wKg).toFixed(2));
    const leanMassKg = parseFloat((wKg - fatMassKg).toFixed(2));
    setResult({
      bf: bfR,
      category: getCategory(bfR, gender),
      gender,
      fatMassKg,
      leanMassKg,
      weightKg: wKg,
    });
  };

  const handleClear = () => {
    setWeight("");
    setNeck("");
    setWaist("");
    setHip("");
    setHeightCm("");
    setHeightFt("");
    setHeightIn("");
    setHeightUnit("cm");
    setMeasureUnit("cm");
    setWeightUnit("cm");
    setGender("male");
    setAge("");
    setResult(null);
    setError("");
  };
  const weightLabel = weightUnit === "cm" ? "kg" : "lbs";
  const measureLabel = measureUnit === "cm" ? "cm" : "in";

  return (
    <div className="page-layout">
      <div className="single-page-padding">
        <h1>Body Fat Calculator — Estimate Your Body Fat Percentage</h1>
        <p>
          Enter your weight, neck, waist, and height measurements to calculate
          your body fat percentage using the validated U.S. Navy formula. See
          your category, fat mass, lean mass, and how you compare to global body
          fat distribution — all instantly.
        </p>

        <div className="calc-card single-calc">
          <div style={{ display: "flex", gap: "10px" }}>
            <div
              className="modern-dropdown"
              style={{ flex: 1 }}
              onClick={() => setWeightOpen(!weightOpen)}
            >
              Weight in {weightLabel}
              <span className="dropdown-indicator">▼</span>
              {weightOpen && (
                <ul className="dropdown-list">
                  <li
                    onClick={(e) => {
                      e.stopPropagation();
                      setWeightUnit("cm");
                      setWeightOpen(false);
                    }}
                  >
                    Weight in kg
                  </li>
                  <li
                    onClick={(e) => {
                      e.stopPropagation();
                      setWeightUnit("in");
                      setWeightOpen(false);
                    }}
                  >
                    Weight in lbs
                  </li>
                </ul>
              )}
            </div>
            <div
              className="modern-dropdown"
              style={{ flex: 1 }}
              onClick={() => setMeasureOpen(!measureOpen)}
            >
              Measurements in {measureLabel}
              <span className="dropdown-indicator">▼</span>
              {measureOpen && (
                <ul className="dropdown-list">
                  <li
                    onClick={(e) => {
                      e.stopPropagation();
                      setMeasureUnit("cm");
                      setMeasureOpen(false);
                    }}
                  >
                    Measurements in cm
                  </li>
                  <li
                    onClick={(e) => {
                      e.stopPropagation();
                      setMeasureUnit("in");
                      setMeasureOpen(false);
                    }}
                  >
                    Measurements in inches
                  </li>
                </ul>
              )}
            </div>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              className="calc-input"
              type="number"
              placeholder={`Weight (${weightLabel})`}
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              style={{ flex: 1 }}
            />
            <input
              className="calc-input"
              type="number"
              placeholder={`Neck (${measureLabel})`}
              value={neck}
              onChange={(e) => setNeck(e.target.value)}
              style={{ flex: 1 }}
            />
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              className="calc-input"
              type="number"
              placeholder={`Waist (${measureLabel})`}
              value={waist}
              onChange={(e) => setWaist(e.target.value)}
              style={{ flex: 1 }}
            />
            {gender === "female" ? (
              <input
                className="calc-input"
                type="number"
                placeholder={`Hip (${measureLabel})`}
                value={hip}
                onChange={(e) => setHip(e.target.value)}
                style={{ flex: 1 }}
              />
            ) : (
              <input
                className="calc-input"
                type="number"
                placeholder={`Hip — females only`}
                disabled
                style={{ flex: 1, opacity: 0.4, cursor: "not-allowed" }}
              />
            )}
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              className="calc-input"
              type="number"
              placeholder="Age (years)"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              style={{ flex: 1 }}
            />
            <div
              className="modern-dropdown"
              style={{ flex: 1 }}
              onClick={() => setGenderOpen(!genderOpen)}
            >
              {gender === "male" ? "Male" : "Female"}
              <span className="dropdown-indicator">▼</span>
              {genderOpen && (
                <ul className="dropdown-list">
                  <li
                    onClick={(e) => {
                      e.stopPropagation();
                      setGender("male");
                      setGenderOpen(false);
                    }}
                  >
                    Male
                  </li>
                  <li
                    onClick={(e) => {
                      e.stopPropagation();
                      setGender("female");
                      setGenderOpen(false);
                    }}
                  >
                    Female
                  </li>
                </ul>
              )}
            </div>
          </div>
          <div
            className="modern-dropdown"
            onClick={() => setHeightOpen(!heightOpen)}
          >
            {heightUnit === "cm" ? "Height in cm" : "Height in ft / in"}
            <span className="dropdown-indicator">▼</span>
            {heightOpen && (
              <ul className="dropdown-list">
                <li
                  onClick={(e) => {
                    e.stopPropagation();
                    setHeightUnit("cm");
                    setHeightOpen(false);
                  }}
                >
                  Height in cm
                </li>
                <li
                  onClick={(e) => {
                    e.stopPropagation();
                    setHeightUnit("ftin");
                    setHeightOpen(false);
                  }}
                >
                  Height in ft / in
                </li>
              </ul>
            )}
          </div>
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
                style={{ flex: 1 }}
              />
              <input
                className="calc-input"
                type="number"
                placeholder="Inches"
                value={heightIn}
                onChange={(e) => setHeightIn(e.target.value)}
                style={{ flex: 1 }}
              />
            </div>
          )}
          <div style={{ display: "flex", gap: "10px" }}>
            <button className="calc-button" onClick={handleCalculate}>
              Calculate
            </button>
            <button className="calc-button calc-clear" onClick={handleClear}>
              Clear
            </button>
          </div>
          {error && (
            <div
              style={{
                marginTop: "10px",
                padding: "10px 14px",
                background: "#fff3cd",
                border: "1px solid #ffc107",
                borderRadius: "8px",
                fontSize: "13px",
                color: "#856404",
              }}
            >
              <i
                className="fa-solid fa-triangle-exclamation"
                style={{ marginRight: "6px" }}
              />
              {error}
            </div>
          )}
        </div>

        <div className="cr-mobile-slot">
          <BodyFatResultPanel result={result} />
        </div>

        {/* ---- SEO CONTENT ---- */}

        <section>
          <h2>What Is Body Fat Percentage?</h2>
          <p>
            Body fat percentage is the proportion of your total body weight that
            is made up of fat tissue. Unlike the number on a bathroom scale —
            which lumps muscle, bone, water, and fat into a single figure — body
            fat percentage tells you something meaningful about your actual body
            composition and health risk.
          </p>
          <p>
            Body fat includes two types: essential fat, which your body needs
            for basic physiological functions like hormone production, organ
            insulation, and nerve protection, and storage fat, which accumulates
            from excess caloric intake and serves as an energy reserve. Tracking
            your body fat percentage alongside our{" "}
            <Link href="/bmi-calculator/" className="my-link">
              BMI calculator
            </Link>{" "}
            gives a far more complete health picture than either measurement
            alone, because BMI cannot distinguish between fat and muscle.
          </p>
        </section>

        <section>
          <h2>How the U.S. Navy Body Fat Formula Works</h2>
          <p>
            This calculator uses the U.S. Navy body fat formula, developed by
            researchers Hodgdon and Beckett in 1984. It estimates body fat
            percentage from simple circumference measurements — accurate to
            within 3 to 4% for most adults when measured correctly. The only
            equipment needed is a flexible measuring tape.
          </p>

          <h3>Formula for Men</h3>
          <pre>
            BF% = 495 ÷ (1.0324 − 0.19077 × log₁₀(waist − neck) + 0.15456 ×
            log₁₀(height)) − 450
          </pre>

          <h3>Formula for Women</h3>
          <pre>
            BF% = 495 ÷ (1.29579 − 0.35004 × log₁₀(waist + hip − neck) + 0.221 ×
            log₁₀(height)) − 450
          </pre>
          <p>
            The formula requires waist and neck measurements for men, and waist,
            hip, and neck for women. All measurements must be in centimeters for
            the formula — this calculator converts inches automatically if you
            select that unit.
          </p>
        </section>

        <section>
          <h2>How to Measure Correctly for Accurate Results</h2>
          <p>
            The accuracy of the Navy formula depends entirely on how precisely
            you take your measurements. Small errors —even 1 to 2 cm — can shift
            the result by a full percentage point. Follow these guidelines:
          </p>
          <ul className="custom-list">
            <li>
              <strong>Waist:</strong> Measure at the narrowest point of your
              midsection, typically just above the navel. Stand relaxed, measure
              at the end of a normal exhale. Do not suck in your stomach.
            </li>
            <li>
              <strong>Neck:</strong> Measure just below the larynx (Adam's
              apple), with the tape sloping slightly downward to the front. Do
              not flare your neck muscles.
            </li>
            <li>
              <strong>Hip (women only):</strong> Measure around the widest part
              of the hips and buttocks, keeping the tape parallel to the floor.
            </li>
            <li>
              <strong>Height:</strong> Without shoes, standing straight against
              a wall. Enter in cm or ft/in — the calculator converts
              automatically.
            </li>
            <li>
              <strong>Weight:</strong> Weigh yourself in the morning before
              eating, wearing minimal clothing, for the most consistent result.
            </li>
            <li>
              <strong>General tip:</strong> Take each measurement twice and use
              the average. This eliminates the single biggest source of error in
              tape-based body fat estimation.
            </li>
          </ul>
        </section>

        <section>
          <h2>Body Fat Percentage Chart — Healthy Ranges by Gender</h2>
          <p>
            The following table shows the standard body fat categories for adult
            men and women. These ranges are used by fitness professionals, the
            American Council on Exercise, and military fitness standards
            worldwide.
          </p>
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginBottom: "20px",
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: "var(--card-bg, #f5f5f5)",
                    textAlign: "left",
                  }}
                >
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                    Category
                  </th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                    Men
                  </th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                    Women
                  </th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                    What It Means
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    Essential Fat
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    2–5%
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    10–13%
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    Minimum for survival; dangerously low to maintain
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    Athlete
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    6–13%
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    14–20%
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    Competitive athletes and very lean individuals
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    Fitness
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    14–17%
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    21–24%
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    Visibly fit; sustainable for regular exercisers
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    Acceptable
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    18–24%
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    25–31%
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    Average; moderate health risk
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    Obese
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    25%+
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    32%+
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    Elevated risk of metabolic disease
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2>Body Fat Calculation Examples</h2>

          <h3>Example 1: Male — Fitness Range</h3>
          <p>
            A 30-year-old man: 80 kg, waist 84 cm, neck 38 cm, height 178 cm.
          </p>
          <ul className="custom-list">
            <li>waist − neck = 84 − 38 = 46 cm</li>
            <li>
              BF% = 495 ÷ (1.0324 − 0.19077 × log₁₀(46) + 0.15456 × log₁₀(178))
              − 450
            </li>
            <li>
              Result: approximately <strong>16.5%</strong> — Fitness range
            </li>
            <li>Fat mass: 80 × 0.165 = 13.2 kg</li>
            <li>Lean mass: 80 − 13.2 = 66.8 kg</li>
          </ul>

          <h3>Example 2: Female — Acceptable Range</h3>
          <p>
            A 28-year-old woman: 65 kg, waist 76 cm, hip 100 cm, neck 33 cm,
            height 165 cm.
          </p>
          <ul className="custom-list">
            <li>waist + hip − neck = 76 + 100 − 33 = 143 cm</li>
            <li>
              BF% = 495 ÷ (1.29579 − 0.35004 × log₁₀(143) + 0.221 × log₁₀(165))
              − 450
            </li>
            <li>
              Result: approximately <strong>28.5%</strong> — Acceptable range
            </li>
            <li>Fat mass: 65 × 0.285 = 18.5 kg</li>
            <li>Lean mass: 65 − 18.5 = 46.5 kg</li>
          </ul>
          <p>
            To bring her body fat into the fitness range (21–24%), she would
            need to lose roughly 3 to 5 kg of fat while preserving lean mass.
            Our{" "}
            <Link href="/calorie-calculator/" className="my-link">
              calorie calculator
            </Link>{" "}
            can help set a moderate deficit for this goal.
          </p>
        </section>

        <section>
          <h2>Body Fat Measurement Methods — How They Compare</h2>
          <p>
            The U.S. Navy tape method used by this calculator is one of several
            ways to estimate body fat. Here is how the most common methods
            compare:
          </p>
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginBottom: "20px",
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: "var(--card-bg, #f5f5f5)",
                    textAlign: "left",
                  }}
                >
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                    Method
                  </th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                    Accuracy
                  </th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                    Cost
                  </th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                    Equipment
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    DEXA Scan
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    ±1–2%
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    High
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    Clinical X-ray machine
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    Hydrostatic Weighing
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    ±2–3%
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    Moderate–High
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    Underwater tank
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    Skinfold Calipers
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    ±3–4%
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    Low
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    Calipers + trained tester
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    U.S. Navy Tape (this tool)
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    ±3–4%
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    Free
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    Measuring tape only
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    BIA Smart Scale
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    ±4–8%
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    Low–Moderate
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    Bioimpedance scale
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            The Navy tape method offers accuracy comparable to skinfold calipers
            and significantly better than most consumer BIA scales — at zero
            cost. For tracking progress over time, consistency of method matters
            more than absolute precision.
          </p>
        </section>

        <section>
          <h2>Body Fat Percentage vs. BMI — Why You Need Both</h2>
          <p>
            BMI only considers weight relative to height. It cannot tell whether
            your weight comes from muscle, fat, water, or bone. Body fat
            percentage directly measures the fat component, making it a far
            better indicator of metabolic health, cardiovascular risk, and
            fitness level.
          </p>
          <p>
            Consider two men who both weigh 90 kg at 180 cm. Their BMI is
            identical at 27.8 — technically "overweight." But if one has 12%
            body fat (lean and muscular) and the other has 30% (mostly fat),
            their health profiles are worlds apart. Only body fat percentage
            reveals the difference.
          </p>
          <p>
            Use our{" "}
            <Link href="/bmi-calculator/" className="my-link">
              BMI calculator
            </Link>{" "}
            alongside this tool. When both BMI and body fat percentage fall in
            healthy ranges, your confidence in your overall health status is
            much higher than relying on either one alone.
          </p>
        </section>

        <section>
          <h2>How to Reduce Body Fat — Evidence-Based Strategies</h2>
          <ul className="custom-list">
            <li>
              <strong>Create a moderate calorie deficit.</strong> Subtract 300
              to 500 calories from your TDEE for steady fat loss of about 0.3 to
              0.5 kg per week. Use our{" "}
              <Link href="/calorie-calculator/" className="my-link">
                calorie calculator
              </Link>{" "}
              to find your maintenance calories first.
            </li>
            <li>
              <strong>Prioritize protein intake.</strong> Aim for 1.6 to 2.2 g
              per kg of body weight daily. Protein preserves lean muscle during
              a deficit, maintains metabolic rate, and increases satiety.
            </li>
            <li>
              <strong>Resistance train consistently.</strong> Lifting weights or
              bodyweight training prevents the muscle loss that accompanies
              calorie restriction. More muscle means a higher resting metabolic
              rate and a lower body fat percentage even before you lose a single
              gram of fat.
            </li>
            <li>
              <strong>Add cardiovascular exercise.</strong> Both steady-state
              cardio (walking, cycling, swimming) and HIIT accelerate fat loss
              and deliver cardiovascular benefits independent of weight change.
            </li>
            <li>
              <strong>Protect your sleep.</strong> Chronic sleep deprivation
              elevates cortisol, increases appetite, and promotes visceral fat
              storage — the most metabolically dangerous type. Aim for 7 to 9
              hours consistently.
            </li>
            <li>
              <strong>Track monthly, not daily.</strong> Body fat changes slowly
              — typically 0.5 to 1 percentage point per month with consistent
              effort. Monthly measurements show real trends without the noise of
              daily fluctuations.
            </li>
          </ul>
        </section>

        <section>
          <h2>Frequently Asked Questions</h2>
          {[
            [
              "How accurate is the U.S. Navy body fat calculator?",
              "The U.S. Navy formula is accurate to within approximately 3 to 4% for most adults when measurements are taken correctly. It performs comparably to skinfold calipers and significantly better than most consumer BIA scales. DEXA scans remain the clinical gold standard, but the Navy method is highly reliable and requires nothing beyond a flexible measuring tape.",
            ],
            [
              "What is a healthy body fat percentage?",
              "For men, the generally accepted healthy range is 14 to 24%. For women, it is 21 to 31%. Athletes typically fall lower — 6 to 13% for men and 14 to 20% for women. Going below essential fat levels (under 5% for men, under 13% for women) is medically dangerous and unsustainable.",
            ],
            [
              "Why is body fat percentage a better measure than BMI?",
              "BMI cannot distinguish between fat mass and muscle mass. A muscular athlete may be classified as overweight by BMI despite having very low body fat. Body fat percentage directly measures the fat component, making it far more informative for assessing metabolic health, insulin sensitivity, and cardiovascular risk.",
            ],
            [
              "Why do men and women have different healthy body fat ranges?",
              "Women naturally require a higher percentage of essential body fat — typically 10 to 13% vs 2 to 5% for men — for hormonal regulation, reproductive health, and pregnancy. This means healthy ranges for women are 8 to 10 percentage points higher than for men at every fitness category.",
            ],
            [
              "How often should I calculate my body fat percentage?",
              "Once per month is ideal. Body fat changes slowly — typically 0.5 to 1% per month with consistent training and diet. Measuring more frequently often captures daily hydration fluctuations rather than real fat loss. Always measure at the same time of day, in the same conditions, for meaningful comparisons.",
            ],
            [
              "Can I lose body fat without losing weight on the scale?",
              "Yes — this is called body recomposition. It is most common in beginners and people eating at maintenance calories while doing resistance training. As you gain muscle and lose fat simultaneously, the scale may not change but your body fat percentage drops, your measurements change, and your composition improves measurably.",
            ],
            [
              "What is the difference between visceral fat and subcutaneous fat?",
              "Subcutaneous fat sits just under the skin — it is the fat you can pinch. Visceral fat surrounds internal organs deep in the abdomen. Visceral fat is far more metabolically dangerous: it increases insulin resistance, inflammation, and cardiovascular risk even when total body fat appears moderate. Waist circumference is the strongest tape-based indicator of visceral fat levels.",
            ],
            [
              "Does age affect body fat percentage?",
              "Yes. Body fat tends to increase gradually with age, even at stable weight, because muscle mass naturally declines after about age 30. This is partly why a 50-year-old and a 25-year-old at the same weight and height can have very different body fat percentages. Resistance training is the most effective way to slow age-related muscle loss and maintain a healthier body composition.",
            ],
            [
              "Can I use this calculator if I am very muscular?",
              "The Navy formula can slightly overestimate body fat in very muscular individuals because a large neck circumference (common in bodybuilders) affects the calculation. If your result seems inconsistent with your visible leanness, consider a DEXA scan or hydrostatic weighing for a more precise measurement. For most non-bodybuilder populations, the Navy formula is reliable.",
            ],
          ].map(([q, a], i) => (
            <div className="faq-item" key={i}>
              <h3 onClick={() => toggleFAQ(i)}>
                {q}
                <i
                  className={`fa-solid fa-chevron-down ${openFAQ === i ? "rotate" : ""}`}
                />
              </h3>
              {openFAQ === i && <p>{a}</p>}
            </div>
          ))}
        </section>

        <section>
          <h2>Final Thoughts</h2>
          <p>
            Body fat percentage is one of the most useful health metrics you can
            track — more informative than the scale, more specific than BMI, and
            actionable for anyone trying to lose fat, build muscle, or simply
            understand their body better. Use this calculator monthly to monitor
            your progress, pair it with our{" "}
            <Link href="/bmi-calculator/" className="my-link">
              BMI calculator
            </Link>{" "}
            for the weight-to-height perspective, and set your calorie targets
            with our{" "}
            <Link href="/calorie-calculator/" className="my-link">
              calorie calculator
            </Link>
            . Together, these three tools give you a practical, data-driven
            foundation for any fitness or health goal.
          </p>
        </section>
      </div>

      {/* ════ RIGHT — sticky sidebar ════ */}
      <aside className="sidebar">
        <div className="cr-desktop-slot">
          <BodyFatResultPanel result={result} />
        </div>
        <div className="sidebar-box">
          <p style={{ fontSize: "18px", fontWeight: 600, margin: "0 0 12px" }}>
            Related Calculators
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {[
              ["/bmi-calculator/", "BMI Calculator"],
              ["/calorie-calculator/", "Calorie Calculator"],

              ["/dose-calculator/", "Dose Calculator"],
              ["/iv-calculator/", "IV Calculator"],
            ].map(([href, label]) => (
              <li key={href} style={{ marginBottom: "6px" }}>
                <Link href={href} className="my-link">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
