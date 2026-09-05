"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import ReviewedBy from "./ReviewedBy";

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

  /* ── FAQ data (also used for JSON-LD schema) ── */
  const faqs: [string, string][] = [
    [
      "Can I calculate body fat percentage from height and weight alone?",
      "Not meaningfully. Height and weight tell you how heavy you are for your size but nothing about what that mass consists of, so any estimate built from them alone is BMI with a population average layered on top. It will give a lean, muscular person and a sedentary person of the same height and weight an identical result. Adding a waist and neck measurement is what lets the calculation tell them apart.",
    ],
    [
      "How accurate is a tape measure method compared with a DEXA scan?",
      "For most adults measuring carefully, a circumference method lands within a few percentage points of a laboratory measurement. That is accurate enough to distinguish an athletic body composition from an average one, and not accurate enough to justify caring about a single percentage point. DEXA is more precise, but scanners at different sites are not perfectly interchangeable either.",
    ],
    [
      "Why does the waist get measured in a different place for men and women?",
      "The male and female equations were derived against different anatomical landmarks — the navel for men, the narrowest point of the torso for women. It is not an inconsistency to be corrected. Using the other sex's landmark shifts the result by several percentage points, so follow the one that matches the formula being applied.",
    ],
    [
      "Why does the calculation subtract my neck measurement?",
      "Waist circumference grows with fat; neck circumference is governed mostly by skeletal structure and muscle and changes comparatively little. The gap between them therefore carries a signal about fat mass that neither measurement provides alone. This is also the method's main limitation: a neck that is unusually thick or slight for the frame will bias the result low or high.",
    ],
    [
      "Why does my bathroom scale give a different body fat number?",
      "Impedance scales infer composition from how easily a small current passes through the body, and that depends heavily on hydration. Drinking a glass of water, exercising, or measuring at a different time of day can move the reading without anything about your body having changed. A tape measurement has no such sensitivity, which is why it holds up well against more expensive equipment.",
    ],
    [
      "What is a healthy body fat percentage?",
      "Broadly, 14 to 24% for men and 21 to 31% for women covers the fitness and acceptable bands, with athletic ranges below that and elevated metabolic risk above. Women carry more essential fat as a matter of physiology, so the two scales are not comparable. Ranges also drift upward with age, and a figure that reads high at twenty can be unremarkable at sixty.",
    ],
    [
      "Does a body fat percentage tell me about visceral fat?",
      "No. The total says nothing about where fat is stored, and visceral fat around the organs carries more metabolic risk than the subcutaneous fat under the skin. No tape method separates them. A useful companion check is waist divided by height, using measurements you have already taken, with under half your height as a common rule of thumb.",
    ],
    [
      "How often should I measure?",
      "Every two to four weeks. Real composition change is slower than measurement noise, so daily readings mostly record tape placement and hydration. Measure at the same time of day with the same tape, take each circumference twice and average, and record the raw measurements as well as the percentage so you can see which one actually moved.",
    ],
    [
      "The result seems too high for how lean I look. Why?",
      "The most likely explanation is a heavier neck relative to your frame, which partly cancels the fat signal the formula relies on — common with developed trapezius and neck musculature. Tape placement is the other candidate: measuring the waist at the narrowest point when the formula expects the navel, or vice versa, moves the answer noticeably. Re-measure carefully before concluding the number is real.",
    ],
  ];

  return (
    <div className="page-layout">
      {/* FAQ JSON-LD schema for rich results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map(([q, a]) => ({
              "@type": "Question",
              name: q,
              acceptedAnswer: { "@type": "Answer", text: a },
            })),
          }),
        }}
      />

      <div className="single-page-padding">
        <h1>Body Fat Percentage Calculator — Tape Measure Method</h1>

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
          <h2>Why This Needs a Tape Measure and Not Just Height and Weight</h2>
          <p>
            A large share of people looking for a body fat calculator want one
            that works from height and weight alone, because that is what they
            already know. It is worth being straight about what such a
            calculator can and cannot do.
          </p>
          <p>
            Height and weight describe how heavy you are for your size. They
            contain no information about where that mass sits or what it is made
            of. Any estimate built from those two numbers alone is a
            re-expression of{" "}
            <Link href="/bmi-calculator/" className="my-link">
              BMI
            </Link>{" "}
            with a population average applied on top — it will place a lean
            sprinter and a sedentary person of identical height and weight in
            exactly the same bracket, because to the formula they are identical.
          </p>
          <p>
            A tape adds the missing dimension: shape. Two people at 80 kg and
            180 cm can have waist measurements 20 cm apart, and that difference
            is almost entirely fat. This is why the method used here asks for
            circumferences rather than working from the scale, and why it can
            distinguish between the two people that a height-and-weight estimate
            cannot.
          </p>
          <p>
            A soft fabric or fibreglass tailor tape is all that is required. A
            steel builder tape will not follow the body contour and a piece of
            string measured afterwards against a ruler introduces more error
            than the method can absorb.
          </p>
        </section>

        <section>
          <h2>Where the Tape Goes</h2>
          <p>
            The circumference method is only as good as the placement. Most of
            the variation people see between attempts comes from measuring in
            slightly different places rather than from any real change in body
            composition.
          </p>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Measurement</th>
                  <th>Where exactly</th>
                  <th>Most common mistake</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Neck</td>
                  <td>
                    Just below the larynx, tape sloping slightly downward at the
                    front
                  </td>
                  <td>
                    Measuring over the widest part of the throat, or pulling
                    tight enough to compress
                  </td>
                </tr>
                <tr>
                  <td>Waist (men)</td>
                  <td>At the navel, tape horizontal all the way round</td>
                  <td>
                    Measuring at the narrowest point instead, which is usually
                    higher
                  </td>
                </tr>
                <tr>
                  <td>Waist (women)</td>
                  <td>At the narrowest point of the torso</td>
                  <td>
                    Using the navel line, which is the men&apos;s landmark and
                    reads differently
                  </td>
                </tr>
                <tr>
                  <td>Hips (women)</td>
                  <td>At the widest point of the buttocks</td>
                  <td>Measuring at the hip bones, which sit higher and narrower</td>
                </tr>
                <tr>
                  <td>Height</td>
                  <td>Without shoes, heels together, looking straight ahead</td>
                  <td>Using a remembered figure from a driving licence</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            The waist landmark genuinely differs between the male and female
            formulas, which surprises people who assume it is an oversight. It
            is not — the two equations were derived against different landmarks
            and swapping them shifts the result by several percentage points.
          </p>
          <p>
            Breathe out normally and measure at the end of the exhale, without
            forcing the stomach in. Keep the tape snug enough to stay in place
            but not tight enough to indent the skin. If you can see the tape
            biting, it is too tight and the result will read low.
          </p>
        </section>

        <section>
          <h2>Why Subtracting the Neck Works</h2>
          <p>
            The equation is essentially a comparison between a circumference
            that grows with fat and one that does not. Waist circumference
            responds strongly to fat gain. Neck circumference is dominated by
            skeletal structure and muscle and moves comparatively little. The
            difference between them therefore carries a signal about fat mass
            that either measurement alone does not.
          </p>
          <p>
            Height enters as a scaling term, because the same waist-minus-neck
            difference means something different on a person of 155 cm than on
            one of 195 cm.
          </p>
          <p>
            Understanding that structure explains the method&apos;s main
            weakness. Anyone whose neck is unusually thick for reasons unrelated
            to fat — heavy trap and neck development from training, or simply
            individual build — will have the fat signal partly cancelled and get
            a reading that is too low. Anyone with a slight neck relative to
            their frame gets the opposite.
          </p>
        </section>

        <section>
          <h2>How Accurate Is This Number, Honestly</h2>
          <p>
            Every body fat method is an estimate, including the expensive ones.
            The practical question is not which is perfect but which is accurate
            enough for the decision you are making.
          </p>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Method</th>
                  <th>What it costs you</th>
                  <th>Main source of error</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Tape circumference (this tool)</td>
                  <td>A tape measure and two minutes</td>
                  <td>Tape placement; unusual neck-to-frame proportions</td>
                </tr>
                <tr>
                  <td>Skinfold calipers</td>
                  <td>Cheap tool, considerable practice</td>
                  <td>
                    Operator technique; results vary between two people
                    measuring the same person
                  </td>
                </tr>
                <tr>
                  <td>Bioelectrical impedance scale</td>
                  <td>A bathroom scale</td>
                  <td>
                    Hydration status, recent food, recent exercise, time of day
                  </td>
                </tr>
                <tr>
                  <td>DEXA scan</td>
                  <td>A clinic appointment and a fee</td>
                  <td>
                    Small, but scanners are not perfectly interchangeable
                    between sites
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            For most adults measured carefully, the tape method lands within a
            few percentage points of a laboratory measurement — close enough to
            tell an athletic body composition from an average one, and nowhere
            near precise enough to justify caring about a single point of
            difference.
          </p>
          <p>
            The comparison people find most surprising is with impedance scales.
            A scale infers composition from how easily a small current passes
            through the body, which depends heavily on how hydrated you are.
            Weigh yourself before and after a glass of water and the reported
            body fat will change, though nothing about your body has. A tape has
            no such sensitivity, which is one reason it holds up well against
            equipment costing a great deal more.
          </p>
        </section>

        <section>
          <h2>Reading the Result</h2>
          <p>
            Body fat is not a score to be minimised. Some fat is structural — it
            cushions organs, insulates nerves, and in women supports hormonal and
            reproductive function. Below that floor, health deteriorates rather
            than improves.
          </p>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Band</th>
                  <th>Men</th>
                  <th>Women</th>
                  <th>What it generally reflects</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Essential</td>
                  <td>2–5%</td>
                  <td>10–13%</td>
                  <td>
                    The structural minimum; not a target and not sustainable
                  </td>
                </tr>
                <tr>
                  <td>Athletic</td>
                  <td>6–13%</td>
                  <td>14–20%</td>
                  <td>Consistent training and deliberate nutrition</td>
                </tr>
                <tr>
                  <td>Fitness</td>
                  <td>14–17%</td>
                  <td>21–24%</td>
                  <td>Regular activity, visible definition</td>
                </tr>
                <tr>
                  <td>Acceptable</td>
                  <td>18–24%</td>
                  <td>25–31%</td>
                  <td>Typical healthy adult range</td>
                </tr>
                <tr>
                  <td>High</td>
                  <td>25% and above</td>
                  <td>32% and above</td>
                  <td>Associated with elevated metabolic risk</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            The gap between the male and female columns is not a scoring
            adjustment. Women carry more essential fat as a matter of
            physiology, and a woman at 12% is in a materially different
            situation from a man at 12%.
          </p>
          <p>
            These bands also shift with age. A percentage that reads as high for
            a twenty-year-old is unremarkable at sixty, since fat mass tends to
            rise and muscle mass to fall across adulthood even when weight on the
            scale does not move. Our guide to{" "}
            <Link
              href="/blog/healthy-bodyfat-percentage-by-age-and-gender/"
              className="my-link"
            >
              healthy body fat percentage by age and gender
            </Link>{" "}
            sets out the age-adjusted ranges.
          </p>
        </section>

        <section>
          <h2>What a Percentage Cannot Tell You</h2>
          <p>
            Two people can share a body fat percentage and carry very different
            risk, because the total says nothing about location. Subcutaneous fat
            sits under the skin. Visceral fat sits around the organs inside the
            abdominal wall, and it is the fraction most strongly linked to
            metabolic and cardiovascular problems.
          </p>
          <p>
            No tape-based method separates the two. What the tape does capture,
            almost incidentally, is the measurement most closely associated with
            visceral fat — waist circumference. A simple companion check is waist
            divided by height, where staying under roughly half your height is a
            widely used rule of thumb. It takes no extra measuring, since you
            already have both numbers.
          </p>
        </section>

        <section>
          <h2>Measure for the Trend, Not the Verdict</h2>
          <p>
            A single reading is a noisy snapshot. A series of readings taken the
            same way is a useful signal, and the difference between the two is
            entirely down to protocol.
          </p>
          <ul className="custom-list">
            <li>
              Measure at the same time of day, ideally in the morning before
              eating or drinking.
            </li>
            <li>
              Use the same tape every time. Tapes stretch with age and no two are
              identical.
            </li>
            <li>
              Take each circumference twice and average them. If the two differ
              by more than about half a centimetre, take a third.
            </li>
            <li>
              Measure every two to four weeks rather than daily. Real
              composition change is slower than measurement noise.
            </li>
            <li>
              Record the raw circumferences alongside the percentage, so you can
              see which measurement moved when the number changes.
            </li>
          </ul>
          <p>
            The last point matters more than it looks. If your calculated body
            fat drops and the waist measurement is what fell, that is a real
            change. If it drops because the neck measurement grew, the tape
            placement probably moved.
          </p>
          <p>
            Body composition changes follow energy balance over time, so a
            realistic calorie target is the practical next step — the{" "}
            <Link href="/calorie-calculator/" className="my-link">
              calorie calculator
            </Link>{" "}
            estimates daily needs, and our guide on{" "}
            <Link
              href="/blog/how-many-calories-to-lose-weight/"
              className="my-link"
            >
              calories to lose weight
            </Link>{" "}
            covers setting a deficit that preserves muscle.
          </p>
        </section>
        <section>
          <h2>Body Fat Measurement Questions</h2>

          {faqs.map(([q, a], i) => {
            const isOpen = openFAQ === i;
            return (
              <div className="faq-item" key={i}>
                <h3
                  onClick={() => toggleFAQ(i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${i}`}
                  role="button"
                  tabIndex={0}
                >
                  {q}
                  <i
                    className={`fa-solid fa-chevron-down ${isOpen ? "rotate" : ""}`}
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
        </section>

        <ReviewedBy medical />
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
