"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

/* ─────────────────────────────────────────
   Types
───────────────────────────────────────── */
type Gender = "male" | "female";
type Activity = "1.2" | "1.375" | "1.55" | "1.725" | "1.9";

interface CalResult {
  tdee: number;
  bmr: number;
  fatLoss: number;
  maintain: number;
  gain: number;
  gender: Gender;
  activity: Activity;
}

/* ─────────────────────────────────────────
   Constants
───────────────────────────────────────── */
const ACTIVITY_LABELS: Record<Activity, string> = {
  "1.2": "Sedentary (little or no exercise)",
  "1.375": "Lightly active (1–3 days/week)",
  "1.55": "Moderately active (3–5 days/week)",
  "1.725": "Very active (6–7 days/week)",
  "1.9": "Extra active (hard exercise & physical job)",
};

const WORLD_GROUPS = [
  { label: "Fat loss", pct: 35, color: "#97C459", key: "fatLoss" },
  { label: "Maintain", pct: 40, color: "#FAC775", key: "maintain" },
  { label: "Muscle gain", pct: 25, color: "#F09595", key: "gain" },
];

/* ─────────────────────────────────────────
   Pure helpers
───────────────────────────────────────── */
function needleDeg(tdee: number): number {
  const clamped = Math.min(Math.max(tdee, 1200), 4000);
  return -90 + ((clamped - 1200) / 2800) * 180;
}

function barPct(tdee: number): number {
  const clamped = Math.min(Math.max(tdee, 1200), 4000);
  return 2 + ((clamped - 1200) / 2800) * 96;
}

/* ─────────────────────────────────────────
   CalorieResultPanel
───────────────────────────────────────── */
function CalorieResultPanel({ result }: { result: CalResult | null }) {
  if (!result) {
    return (
      <div className="cr-panel-placeholder">
        <div className="cr-ph-icon">
          <i className="fa-solid fa-fire-flame-curved" aria-hidden="true" />
        </div>
        Enter your details to see your daily calorie needs here.
      </div>
    );
  }

  const { tdee, bmr, fatLoss, maintain, gain } = result;

  return (
    <div className="cr-panel">
      {/* Gauge + score */}
      <div className="cr-gauge-wrap">
        <svg
          className="cr-gauge-svg"
          width="100"
          height="60"
          viewBox="0 0 120 70"
          role="img"
          aria-label={`Calorie gauge showing ${tdee} kcal`}
        >
          <defs>
            <clipPath id="cal-half">
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
            strokeDasharray="82 326"
            strokeDashoffset="-163"
            clipPath="url(#cal-half)"
          />
          <circle
            cx="60"
            cy="65"
            r="52"
            fill="none"
            stroke="#97C459"
            strokeWidth="12"
            strokeDasharray="82 326"
            strokeDashoffset="-245"
            clipPath="url(#cal-half)"
          />
          <circle
            cx="60"
            cy="65"
            r="52"
            fill="none"
            stroke="#FAC775"
            strokeWidth="12"
            strokeDasharray="82 326"
            strokeDashoffset="-327"
            clipPath="url(#cal-half)"
          />
          <circle
            cx="60"
            cy="65"
            r="52"
            fill="none"
            stroke="#F09595"
            strokeWidth="12"
            strokeDasharray="80 326"
            strokeDashoffset="-409"
            clipPath="url(#cal-half)"
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
              transform: `rotate(${needleDeg(tdee)}deg)`,
              transition: "transform 0.5s ease",
            }}
          />
          <circle cx="60" cy="65" r="5" fill="#111111" />
        </svg>

        <div className="cr-score-block">
          <div className="cr-score">{tdee.toLocaleString()}</div>
          <div className="cr-score-label">kcal / day (TDEE)</div>
          <span className="cr-badge normal">Maintenance</span>
        </div>
      </div>

      <hr className="cr-divider" />

      {/* Position bar */}
      <div>
        <div className="cr-bar-label">
          your daily calorie need vs. population range
        </div>
        <div
          className="cr-bar-track"
          style={{
            background:
              "linear-gradient(to right, #B5D4F4 0%, #97C459 30%, #FAC775 65%, #F09595 100%)",
          }}
        >
          <div className="cr-bar-thumb" style={{ left: `${barPct(tdee)}%` }} />
        </div>
        <div className="cr-bar-ticks">
          <span>1200</span>
          <span>2000</span>
          <span>2800</span>
          <span>3500</span>
          <span>4000+</span>
        </div>
      </div>

      <hr className="cr-divider" />

      {/* Goal breakdown — 4 cards */}
      <div className="cr-metrics-grid">
        <div className="cr-metric-card">
          <div className="cr-m-label">BMR</div>
          <div className="cr-m-value">{bmr.toLocaleString()} kcal</div>
          <div className="cr-m-sub">at complete rest</div>
        </div>
        <div className="cr-metric-card">
          <div className="cr-m-label">Fat loss</div>
          <div className="cr-m-value">{fatLoss.toLocaleString()} kcal</div>
          <div className="cr-m-sub">TDEE − 400 kcal</div>
        </div>
        <div className="cr-metric-card">
          <div className="cr-m-label">Maintain</div>
          <div className="cr-m-value">{maintain.toLocaleString()} kcal</div>
          <div className="cr-m-sub">current weight</div>
        </div>
        <div className="cr-metric-card">
          <div className="cr-m-label">Muscle gain</div>
          <div className="cr-m-value">{gain.toLocaleString()} kcal</div>
          <div className="cr-m-sub">TDEE + 250 kcal</div>
        </div>
      </div>

      <hr className="cr-divider" />

      {/* Goal comparison bars */}
      <div>
        <div className="cr-world-title">calorie targets by goal</div>

        <div className="cr-world-bar-row">
          <span className="cr-w-label">Fat loss</span>
          <div className="cr-world-track">
            <div
              className="cr-world-fill"
              style={{
                width: `${Math.round((fatLoss / (gain + 100)) * 100)}%`,
                background: "#97C459",
              }}
            />
          </div>
          <span className="cr-w-pct">{fatLoss.toLocaleString()}</span>
        </div>
        <div className="cr-world-bar-row">
          <span className="cr-w-label">Maintain</span>
          <div className="cr-world-track">
            <div
              className="cr-world-fill"
              style={{
                width: `${Math.round((maintain / (gain + 100)) * 100)}%`,
                background: "#FAC775",
              }}
            />
          </div>
          <span className="cr-w-pct">{maintain.toLocaleString()}</span>
        </div>
        <div className="cr-world-bar-row">
          <span className="cr-w-label">Muscle gain</span>
          <div className="cr-world-track">
            <div
              className="cr-world-fill"
              style={{
                width: `${Math.round((gain / (gain + 100)) * 100)}%`,
                background: "#F09595",
              }}
            />
          </div>
          <span className="cr-w-pct">{gain.toLocaleString()}</span>
        </div>

        <p className="cr-world-note">
          All values in kcal/day. Adjust based on 2–3 weeks of real results.
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Main Calculator Page
───────────────────────────────────────── */
export default function CalorieCalculator() {
  const [weight, setWeight] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<Gender>("male");
  const [activity, setActivity] = useState<Activity>("1.2");
  const [heightUnit, setHeightUnit] = useState<"cm" | "ftin">("cm");
  const [heightOpen, setHeightOpen] = useState(false);
  const [genderOpen, setGenderOpen] = useState(false);
  const [activityOpen, setActivityOpen] = useState(false);
  const [result, setResult] = useState<CalResult | null>(null);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const toggleFAQ = (i: number) => setOpenFAQ(openFAQ === i ? null : i);

  /* ── Auto-calculate ── */
  useEffect(() => {
    const w = Number(weight);
    const a = Number(age);
    if (!w || w <= 0) {
      setResult(null);
      return;
    }
    if (!a || a <= 0) {
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

    let bmr = 0;
    if (gender === "male") {
      bmr = 10 * w + 6.25 * hCm - 5 * a + 5;
    } else {
      bmr = 10 * w + 6.25 * hCm - 5 * a - 161;
    }

    const tdee = Math.round(bmr * Number(activity));
    const bmrR = Math.round(bmr);
    const fatLoss = tdee - 400;
    const maintain = tdee;
    const gain = tdee + 250;

    if (!isFinite(tdee) || tdee <= 0) {
      setResult(null);
      return;
    }
    setResult({ tdee, bmr: bmrR, fatLoss, maintain, gain, gender, activity });
  }, [weight, heightCm, heightFt, heightIn, heightUnit, age, gender, activity]);

  /* ── Manual calculate ── */
  const handleCalculate = () => {
    const w = Number(weight);
    const a = Number(age);
    if (!w || w <= 0) return;
    if (!a || a <= 0) return;

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

    let bmr = 0;
    if (gender === "male") {
      bmr = 10 * w + 6.25 * hCm - 5 * a + 5;
    } else {
      bmr = 10 * w + 6.25 * hCm - 5 * a - 161;
    }

    const tdee = Math.round(bmr * Number(activity));
    const bmrR = Math.round(bmr);
    const fatLoss = tdee - 400;
    const maintain = tdee;
    const gain = tdee + 250;

    if (!isFinite(tdee) || tdee <= 0) return;
    setResult({ tdee, bmr: bmrR, fatLoss, maintain, gain, gender, activity });
  };

  const handleClear = () => {
    setWeight("");
    setHeightCm("");
    setHeightFt("");
    setHeightIn("");
    setAge("");
    setGender("male");
    setActivity("1.2");
    setHeightUnit("cm");
    setResult(null);
  };

  return (
    <div className="page-layout">
      {/* ════ LEFT ════ */}
      <div className="single-page-padding">
        <h1>Calorie Calculator</h1>
        <p>
          Find out exactly how many calories your body needs each day to
          maintain your current weight, lose fat, or build muscle. Enter your
          weight, height, age, gender, and activity level below, and the
          calculator will estimate your BMR, TDEE, and goal-specific calorie
          targets instantly.
        </p>

        <div className="calc-card single-calc">
          {/* Row 1: Weight + Age */}
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              className="calc-input"
              type="number"
              placeholder="Weight (kg)"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              style={{ flex: 1 }}
            />
            <input
              className="calc-input"
              type="number"
              placeholder="Age (years)"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              style={{ flex: 1 }}
            />
          </div>

          {/* Row 2: Gender + Activity */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              className="modern-dropdown"
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
            <div
              className="modern-dropdown"
              onClick={() => setActivityOpen(!activityOpen)}
            >
              {ACTIVITY_LABELS[activity]}
              <span className="dropdown-indicator">▼</span>
              {activityOpen && (
                <ul className="dropdown-list">
                  {(
                    Object.entries(ACTIVITY_LABELS) as [Activity, string][]
                  ).map(([val, label]) => (
                    <li
                      key={val}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActivity(val);
                        setActivityOpen(false);
                      }}
                    >
                      {label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Height unit dropdown */}
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

          {/* Height inputs */}
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

          {/* Buttons */}
          <div style={{ display: "flex", gap: "10px" }}>
            <button className="calc-button" onClick={handleCalculate}>
              Calculate
            </button>
            <button className="calc-button calc-clear" onClick={handleClear}>
              Clear
            </button>
          </div>
        </div>

        {/* Mobile result panel */}
        <div className="cr-mobile-slot">
          <CalorieResultPanel result={result} />
        </div>

        {/* ---- SEO CONTENT ---- */}

        <section>
          <h2>What Is a Calorie Calculator and How Does It Work?</h2>
          <p>
            A calorie calculator estimates how many calories your body burns in
            a day based on your physical stats and how active you are. It works
            in two steps. First, it calculates your{" "}
            <strong>Basal Metabolic Rate (BMR)</strong> — the energy your body
            needs at complete rest just to keep your heart beating, lungs
            breathing, and organs functioning. Then it multiplies your BMR by an
            activity factor to produce your{" "}
            <strong>Total Daily Energy Expenditure (TDEE)</strong>, the number
            of calories you actually burn in a typical day including movement,
            exercise, and daily tasks.
          </p>
          <p>
            This calculator uses the <strong>Mifflin-St Jeor Equation</strong>,
            which is the most widely validated BMR formula in modern nutrition
            science. The Academy of Nutrition and Dietetics recommends it as the
            preferred method for estimating calorie needs in healthy adults. It
            replaced the older Harris-Benedict equation because it produces more
            accurate results across a wider range of body types.
          </p>
          <p>
            For a complete picture of your health metrics, pair this tool with
            our{" "}
            <Link href="/bmi-calculator/" className="my-link">
              BMI calculator
            </Link>{" "}
            to check your weight category and our{" "}
            <Link href="/body-fat-calculator/" className="my-link">
              body fat calculator
            </Link>{" "}
            to understand your muscle-to-fat ratio. Together, these three
            numbers — TDEE, BMI, and body fat percentage — give you a practical
            foundation for any fitness or weight management plan.
          </p>
        </section>

        <section>
          <h2>BMR vs. TDEE — Understanding the Two Core Numbers</h2>

          <h3>Basal Metabolic Rate (BMR)</h3>
          <p>
            Your BMR represents the calories your body burns every single day
            even if you stayed in bed and did nothing. For most people, BMR
            accounts for roughly 60% to 75% of total daily calorie burn. It is
            driven primarily by how much lean mass you carry, your height, your
            age, and your biological sex.
          </p>
          <p>
            Think of BMR as your body's operating cost — the energy it takes
            just to stay alive. Everything from your brain processing thoughts
            to your liver filtering blood costs calories, and BMR is the sum of
            all of it.
          </p>

          <h3>Total Daily Energy Expenditure (TDEE)</h3>
          <p>
            TDEE takes your BMR and adds the calories you burn through physical
            activity — walking to work, hitting the gym, playing with your kids,
            even fidgeting at your desk. Your TDEE is the number that actually
            matters for diet planning because it reflects your real-world
            calorie burn, not just the resting number.
          </p>
          <p>
            Eat exactly at your TDEE and your weight stays the same. Eat below
            it and you lose weight. Eat above it and you gain. Every weight
            management strategy ultimately comes down to your relationship with
            this single number.
          </p>
        </section>

        <section>
          <h2>
            The Mifflin-St Jeor Formula — How Your Calories Are Calculated
          </h2>

          <h3>For Men</h3>
          <pre>
            BMR = (10 × weight in kg) + (6.25 × height in cm) − (5 × age in
            years) + 5
          </pre>

          <h3>For Women</h3>
          <pre>
            BMR = (10 × weight in kg) + (6.25 × height in cm) − (5 × age in
            years) − 161
          </pre>

          <h3>Then Multiply by Your Activity Factor</h3>
          <pre>TDEE = BMR × Activity Multiplier</pre>

          <h3>Worked Example</h3>
          <p>
            Let's say you are a 30-year-old man who weighs 80 kg, stands 180 cm
            tall, and exercises moderately 4 days a week.
          </p>
          <ul>
            <li>BMR = (10 × 80) + (6.25 × 180) − (5 × 30) + 5 = 1,780 kcal</li>
            <li>Activity multiplier for moderate exercise = 1.55</li>
            <li>
              TDEE = 1,780 × 1.55 = <strong>2,759 kcal/day</strong>
            </li>
          </ul>
          <p>
            That means this person needs roughly 2,759 calories per day to
            maintain his current weight. To lose fat at a steady rate, he would
            eat around 2,359 kcal (a 400 calorie deficit). To build muscle
            gradually, he would eat about 3,009 kcal (a 250 calorie surplus).
          </p>

          <p>
            Now consider a 25-year-old woman, 60 kg, 165 cm, lightly active:
          </p>
          <ul>
            <li>
              BMR = (10 × 60) + (6.25 × 165) − (5 × 25) − 161 = 1,370 kcal
            </li>
            <li>Activity multiplier = 1.375</li>
            <li>
              TDEE = 1,370 × 1.375 = <strong>1,884 kcal/day</strong>
            </li>
          </ul>
          <p>
            Her fat loss target would be around 1,484 kcal/day, and her muscle
            gain target about 2,134 kcal/day.
          </p>
        </section>

        <section>
          <h2>Activity Level Guide — How to Choose the Right Multiplier</h2>
          <p>
            Picking the right activity level is the single biggest source of
            error in calorie calculations. Most people overestimate how active
            they are. Here is what each level actually means:
          </p>
          <ul className="custom-list">
            <li>
              <strong>Sedentary (×1.2):</strong> Desk job, no structured
              exercise, and most leisure time spent sitting. If you drive to
              work, sit at a computer all day, and watch TV in the evening, this
              is you — even if you walk around the office occasionally.
            </li>
            <li>
              <strong>Lightly Active (×1.375):</strong> You exercise lightly 1
              to 3 days per week — things like casual walking, light yoga, or a
              short gym session. Or you have a job that keeps you on your feet
              part of the day.
            </li>
            <li>
              <strong>Moderately Active (×1.55):</strong> Structured exercise 3
              to 5 days per week at genuine intensity — running, swimming,
              weight training, cycling. This is the level most regular gym-
              goers actually fall into.
            </li>
            <li>
              <strong>Very Active (×1.725):</strong> Hard training 6 to 7 days
              per week, or a moderately physical job (construction, warehouse
              work) combined with regular exercise sessions.
            </li>
            <li>
              <strong>Extra Active (×1.9):</strong> Professional athletes in
              season, people with very physically demanding jobs who also train
              daily, or anyone doing two-a-day workouts consistently.
            </li>
          </ul>
          <p>
            If you are genuinely unsure, pick one level lower than you think you
            are. You can always adjust upward after tracking your results for 2
            to 3 weeks. Overestimating activity is one of the most common
            reasons calorie calculators seem "wrong" — the formula is fine, the
            input was off.
          </p>
        </section>

        <section>
          <h2>Daily Calorie Needs by Age, Weight, and Activity Level</h2>
          <p>
            The table below shows estimated TDEE (maintenance calories) for
            different profiles. These numbers assume average heights (175 cm for
            men, 163 cm for women) and use the Mifflin-St Jeor formula.
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
                    Profile
                  </th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                    Sedentary
                  </th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                    Moderately Active
                  </th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                    Very Active
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    Male, 25 yrs, 70 kg
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    ~2,020
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    ~2,610
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    ~2,910
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    Male, 35 yrs, 85 kg
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    ~2,160
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    ~2,790
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    ~3,100
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    Male, 45 yrs, 80 kg
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    ~2,020
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    ~2,610
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    ~2,910
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    Female, 25 yrs, 55 kg
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    ~1,560
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    ~2,020
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    ~2,250
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    Female, 35 yrs, 65 kg
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    ~1,620
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    ~2,100
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    ~2,340
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    Female, 45 yrs, 70 kg
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    ~1,620
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    ~2,100
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    ~2,340
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            These are estimates. Your actual needs depend on your exact height,
            body composition, genetics, and hormonal status. Use the calculator
            above with your real measurements for a personalized figure.
          </p>
        </section>

        <section>
          <h2>
            How to Use Your Calorie Result — Fat Loss, Maintenance, and Muscle
            Gain
          </h2>

          <h3>For Fat Loss</h3>
          <p>
            Subtract 300 to 500 calories from your TDEE. This creates a moderate
            deficit that promotes roughly 0.3 to 0.5 kg of fat loss per week
            without excessive hunger or muscle loss. For example, if your TDEE
            is 2,500 kcal, aim for 2,000 to 2,200 kcal daily. Track your weight
            weekly — not daily — since water fluctuations can mask real
            progress. Pair calorie tracking with regular check-ins on our{" "}
            <Link href="/bmi-calculator/" className="my-link">
              BMI calculator
            </Link>{" "}
            to watch your weight category shift over time.
          </p>

          <h3>For Maintenance and Body Recomposition</h3>
          <p>
            Eat at or very close to your TDEE. If you are strength training
            while eating at maintenance, your body can simultaneously lose small
            amounts of fat and gain small amounts of muscle — a process known as
            body recomposition. This works best for beginners and people
            returning to training after a break.
          </p>

          <h3>For Muscle Gain</h3>
          <p>
            Add 200 to 300 calories above your TDEE. This provides the energy
            surplus needed for muscle growth without excessive fat gain. Make
            sure protein intake is at least 1.6 to 2.2 grams per kilogram of
            body weight per day — the surplus alone is not enough; the building
            material (protein) matters just as much. Monitor your progress
            monthly with our{" "}
            <Link href="/body-fat-calculator/" className="my-link">
              body fat calculator
            </Link>{" "}
            to ensure your surplus is producing muscle rather than just fat.
          </p>
        </section>

        <section>
          <h2>What Factors Influence Your Daily Calorie Needs?</h2>
          <ul className="custom-list">
            <li>
              <strong>Body weight and composition:</strong> A person carrying
              more lean muscle burns more calories at rest than someone of the
              same weight with a higher fat percentage. Two people at 80 kg can
              have meaningfully different BMRs depending on their body
              composition.
            </li>
            <li>
              <strong>Age:</strong> Metabolic rate declines roughly 1 to 2
              percent per decade after 30, primarily because of gradual muscle
              loss. Strength training slows this decline significantly.
            </li>
            <li>
              <strong>Biological sex:</strong> Men generally have higher BMRs
              than women of the same weight and height, largely because of
              higher average lean mass.
            </li>
            <li>
              <strong>Height:</strong> Taller people have more tissue to
              maintain, which slightly raises calorie needs even at the same
              weight.
            </li>
            <li>
              <strong>Activity level:</strong> This is the single biggest
              variable you can control. The gap between a sedentary lifestyle
              and a very active one can be 700 to 1,000+ calories per day.
            </li>
            <li>
              <strong>Hormonal health:</strong> Conditions like hypothyroidism
              can reduce metabolic rate noticeably. If your real-world results
              consistently differ from calculated estimates, a medical
              evaluation is worth considering.
            </li>
            <li>
              <strong>Non-Exercise Activity Thermogenesis (NEAT):</strong>{" "}
              Fidgeting, pacing, taking the stairs, standing while working —
              these small movements throughout the day can account for 200 to
              800 calories of burn that formal exercise does not capture.
            </li>
          </ul>
        </section>

        <section>
          <h2>Calorie Targets by Goal — Quick Reference</h2>
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
                    Goal
                  </th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                    Daily Calories
                  </th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                    Expected Weekly Change
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    Aggressive fat loss
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    TDEE − 500 kcal
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    ~0.5 kg loss/week
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    Moderate fat loss
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    TDEE − 300 kcal
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    ~0.3 kg loss/week
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    Maintenance
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    At TDEE
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    No change
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    Lean muscle gain
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    TDEE + 200–300 kcal
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    ~0.1–0.2 kg gain/week
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    Aggressive muscle gain
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    TDEE + 500 kcal
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    ~0.3–0.5 kg gain/week (some fat)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2>Common Calorie Counting Mistakes to Avoid</h2>
          <ul className="custom-list">
            <li>
              <strong>Overestimating your activity level.</strong> This is the
              most common error. Walking around the office does not make you
              "moderately active." Be honest, and default to a lower level if
              you are unsure.
            </li>
            <li>
              <strong>Ignoring liquid calories.</strong> Sugary drinks, fruit
              juices, milk-based coffees, and alcohol can easily add 300 to 500+
              untracked calories per day.
            </li>
            <li>
              <strong>Not recalculating as your weight changes.</strong> If you
              have lost 5 to 10 kg, your BMR has dropped too. The calorie target
              that created your initial deficit may now be at or near
              maintenance. Recalculate every 4 to 6 weeks.
            </li>
            <li>
              <strong>Cutting calories too aggressively.</strong> Deficits
              larger than 700 to 800 calories below TDEE increase the risk of
              muscle loss, nutrient deficiencies, hormonal disruption, and
              rebound overeating. Sustainable progress beats fast progress every
              time.
            </li>
            <li>
              <strong>Only counting exercise and ignoring NEAT.</strong> Daily
              non-exercise movement — walking, standing, cleaning, cooking — can
              burn more calories than a formal workout. If you are highly active
              outside the gym, your calorie needs are higher than "sedentary"
              even without structured exercise.
            </li>
            <li>
              <strong>Treating the calculator as exact.</strong> Any formula is
              an estimate. Use the calculated number as a starting point, then
              adjust based on what actually happens to your weight over 2 to 3
              weeks. Your body is the final judge, not the formula.
            </li>
          </ul>
        </section>

        <section>
          <h2>Frequently Asked Questions About Calorie Needs</h2>

          {[
            [
              "How many calories do I need per day to lose weight?",
              "To lose weight, you need to eat fewer calories than your body burns — this is called a calorie deficit. A deficit of 300 to 500 calories below your TDEE is the most sustainable range, producing approximately 0.3 to 0.5 kg of fat loss per week. Use the calculator above to find your TDEE, then subtract accordingly. Avoid deficits larger than 700 to 800 calories, which increase the risk of muscle loss and metabolic slowdown.",
            ],
            [
              "How accurate is the Mifflin-St Jeor calorie formula?",
              "The Mifflin-St Jeor Equation is the most accurate widely available BMR formula for healthy adults. In validation studies, it typically predicts actual BMR within plus or minus 10%. The main source of error is usually the activity multiplier, not the formula itself. Treat your calculated TDEE as a starting point and adjust based on real-world results over 2 to 3 weeks.",
            ],
            [
              "What is the difference between BMR and TDEE?",
              "BMR (Basal Metabolic Rate) is the calories your body burns at complete rest — the minimum energy to keep you alive with zero movement. TDEE (Total Daily Energy Expenditure) is your BMR multiplied by an activity factor, giving you the total calories you actually burn in a day including all movement and exercise. TDEE is the number you use for diet planning.",
            ],
            [
              "Does muscle mass affect how many calories I need?",
              "Yes, significantly. Lean muscle tissue burns roughly three times more calories at rest than fat tissue does. Two people who weigh the same can have very different calorie needs if their body compositions differ. This is why strength training is valuable for long-term weight management — it builds the tissue that raises your metabolic rate.",
            ],
            [
              "How many calories should I eat to build muscle?",
              "Eat 200 to 300 calories above your TDEE for lean muscle gain. Larger surpluses tend to add more fat than muscle in most people. Equally important is protein intake — aim for 1.6 to 2.2 grams per kilogram of body weight daily to give your muscles the raw material they need to grow.",
            ],
            [
              "How does my BMI relate to my calorie needs?",
              "BMI tells you whether your current weight is in a healthy range relative to your height. TDEE tells you how many calories you need to maintain, lose, or gain weight. Check your BMI to understand where you stand, then use your TDEE to set a calorie target that moves you toward a healthy BMI range of 18.5 to 24.9.",
            ],
            [
              "Should I recalculate my calories as I lose weight?",
              "Yes. As your weight drops, your BMR and TDEE both decrease because there is less body mass to maintain. If you started at 90 kg and have lost 10 kg, the calorie intake that originally created a deficit may now be close to your new maintenance level. Recalculate every 4 to 6 weeks or whenever you have lost 3 to 5 kg.",
            ],
            [
              "Why am I not losing weight even though I am eating at a deficit?",
              "The most common reasons are underestimating calorie intake (not tracking cooking oils, sauces, snacks, or liquid calories accurately), overestimating activity level, or water retention masking fat loss on the scale. Track everything for a full week — including weekends — and weigh yourself at the same time each morning. If weight truly has not changed after 3 weeks of accurate tracking, reduce your target by another 100 to 200 calories.",
            ],
            [
              "Is 1,200 calories a day enough?",
              "For most adults, 1,200 calories is below the threshold for meeting basic nutritional needs. It may be appropriate for very small, sedentary individuals under medical supervision, but for most people it leads to nutrient deficiencies, muscle loss, and hormonal disruption. A moderate deficit from your calculated TDEE is almost always more effective and sustainable than defaulting to an arbitrary low number.",
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
            Knowing your daily calorie needs is the single most useful piece of
            information for any weight management or fitness goal. It turns
            guesswork into a plan. Use the calculator above to find your
            personal BMR and TDEE, pick a goal-specific target, and then track
            your progress over time — adjusting as your body changes.
          </p>
          <p>
            Pair this with our{" "}
            <Link href="/bmi-calculator/" className="my-link">
              BMI calculator
            </Link>{" "}
            to monitor your weight category and our{" "}
            <Link href="/body-fat-calculator/" className="my-link">
              body fat calculator
            </Link>{" "}
            to track body composition changes. The more data points you have,
            the smarter your decisions become.
          </p>
        </section>
      </div>

      {/* ════ RIGHT — sticky sidebar ════ */}
      <aside className="sidebar">
        <div className="cr-desktop-slot">
          <CalorieResultPanel result={result} />
        </div>
        <div className="sidebar-box">
          <p style={{ fontSize: "18px", fontWeight: 600, margin: "0 0 12px" }}>
            Related Calculators
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {[
              ["/bmi-calculator/", "BMI Calculator"],
              ["/body-fat-calculator/", "Body Fat Calculator"],

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
