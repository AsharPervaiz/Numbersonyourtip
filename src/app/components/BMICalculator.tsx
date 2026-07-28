"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

/* ─────────────────────────────────────────
   Types
───────────────────────────────────────── */
type Category = "underweight" | "normal" | "overweight" | "obese";

interface BMIResult {
  bmi: number;
  category: Category;
  heightM: number;
  weightKg: number;
}

/* ─────────────────────────────────────────
   Constants
───────────────────────────────────────── */
const CATEGORY_LABELS: Record<Category, string> = {
  underweight: "Underweight",
  normal: "Normal weight",
  overweight: "Overweight",
  obese: "Obese",
};

const WORLD_GROUPS: {
  label: string;
  pct: number;
  color: string;
  key: Category;
}[] = [
  { label: "Underweight", pct: 9, color: "#B5D4F4", key: "underweight" },
  { label: "Normal", pct: 42, color: "#97C459", key: "normal" },
  { label: "Overweight", pct: 31, color: "#FAC775", key: "overweight" },
  { label: "Obese", pct: 18, color: "#F09595", key: "obese" },
];

/* ─────────────────────────────────────────
   Pure helpers
───────────────────────────────────────── */
function getCategory(bmi: number): Category {
  if (bmi < 18.5) return "underweight";
  if (bmi <= 24.9) return "normal";
  if (bmi <= 29.9) return "overweight";
  return "obese";
}

function needleDeg(bmi: number): number {
  const clamped = Math.min(Math.max(bmi, 15), 40);
  return -90 + ((clamped - 15) / 25) * 180;
}

function barPct(bmi: number): number {
  const clamped = Math.min(Math.max(bmi, 15), 40);
  return 2 + ((clamped - 15) / 25) * 96;
}

function globalPercentile(bmi: number): string {
  if (bmi < 18.5) return Math.round((bmi / 18.5) * 9) + "th";
  if (bmi <= 24.9) return Math.round(9 + ((bmi - 18.5) / 6.4) * 42) + "th";
  if (bmi <= 29.9) return Math.round(51 + ((bmi - 25) / 4.9) * 31) + "th";
  return Math.round(82 + Math.min((bmi - 30) / 10, 1) * 18) + "th";
}

/* ─────────────────────────────────────────
   BMIResultPanel
───────────────────────────────────────── */
function BMIResultPanel({ result }: { result: BMIResult | null }) {
  if (!result) {
    return (
      <div className="cr-panel-placeholder">
        <div className="cr-ph-icon">
          <i className="fa-solid fa-weight-scale" aria-hidden="true" />
        </div>
        Enter your weight and height to see your BMI result here.
      </div>
    );
  }

  const { bmi, category, heightM, weightKg } = result;
  const minHealthy = 18.5 * heightM * heightM;
  const maxHealthy = 24.9 * heightM * heightM;
  const weightDiff =
    category === "overweight" || category === "obese"
      ? `${(weightKg - maxHealthy).toFixed(1)} kg to lose`
      : category === "underweight"
        ? `+${(minHealthy - weightKg).toFixed(1)} kg to gain`
        : "You're on track";

  return (
    <div className="cr-panel">
      <div className="cr-gauge-wrap">
        <svg
          className="cr-gauge-svg"
          width="100"
          height="60"
          viewBox="0 0 120 70"
          role="img"
          aria-label={`BMI gauge showing ${bmi.toFixed(1)}`}
        >
          <defs>
            <clipPath id="bmi-half">
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
            strokeDasharray="49 326"
            strokeDashoffset="-163"
            clipPath="url(#bmi-half)"
          />
          <circle
            cx="60"
            cy="65"
            r="52"
            fill="none"
            stroke="#97C459"
            strokeWidth="12"
            strokeDasharray="114 326"
            strokeDashoffset="-212"
            clipPath="url(#bmi-half)"
          />
          <circle
            cx="60"
            cy="65"
            r="52"
            fill="none"
            stroke="#FAC775"
            strokeWidth="12"
            strokeDasharray="82 326"
            strokeDashoffset="-244"
            clipPath="url(#bmi-half)"
          />
          <circle
            cx="60"
            cy="65"
            r="52"
            fill="none"
            stroke="#F09595"
            strokeWidth="12"
            strokeDasharray="81 326"
            strokeDashoffset="-326"
            clipPath="url(#bmi-half)"
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
              transform: `rotate(${needleDeg(bmi)}deg)`,
              transition: "transform 0.5s ease",
            }}
          />
          <circle cx="60" cy="65" r="5" fill="#111111" />
        </svg>
        <div className="cr-score-block">
          <div className="cr-score">{bmi.toFixed(1)}</div>
          <div className="cr-score-label">Body Mass Index</div>
          <span className={`cr-badge ${category}`}>
            {CATEGORY_LABELS[category]}
          </span>
        </div>
      </div>

      <hr className="cr-divider" />

      <div>
        <div className="cr-bar-label">where you land on the BMI scale</div>
        <div
          className="cr-bar-track"
          style={{
            background:
              "linear-gradient(to right, #B5D4F4 0%, #97C459 30%, #FAC775 60%, #F09595 100%)",
          }}
        >
          <div className="cr-bar-thumb" style={{ left: `${barPct(bmi)}%` }} />
        </div>
        <div className="cr-bar-ticks">
          <span>15</span>
          <span>18.5</span>
          <span>25</span>
          <span>30</span>
          <span>40</span>
        </div>
      </div>

      <hr className="cr-divider" />

      <div className="cr-metrics-grid">
        <div className="cr-metric-card">
          <div className="cr-m-label">Healthy range</div>
          <div className="cr-m-value">
            {minHealthy.toFixed(0)}–{maxHealthy.toFixed(0)} kg
          </div>
          <div className="cr-m-sub">for your height</div>
        </div>
        <div className="cr-metric-card">
          <div className="cr-m-label">Weight target</div>
          <div className="cr-m-value">{weightDiff}</div>
          <div className="cr-m-sub">to reach normal</div>
        </div>
        <div className="cr-metric-card">
          <div className="cr-m-label">Global percentile</div>
          <div className="cr-m-value">{globalPercentile(bmi)}</div>
          <div className="cr-m-sub">estimated rank</div>
        </div>
        <div className="cr-metric-card">
          <div className="cr-m-label">Category</div>
          <div className="cr-m-value">{CATEGORY_LABELS[category]}</div>
          <div className="cr-m-sub">WHO standard</div>
        </div>
      </div>

      <hr className="cr-divider" />

      <div>
        <div className="cr-world-title">World adult BMI distribution</div>
        {WORLD_GROUPS.map((g) => (
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
          {WORLD_GROUPS.find((g) => g.key === category)!.pct}% of world adults.
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Main Calculator Page
───────────────────────────────────────── */
export default function BMICalculator() {
  const [weight, setWeight] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [heightUnit, setHeightUnit] = useState<"cm" | "ftin">("cm");
  const [heightOpen, setHeightOpen] = useState(false);
  const [result, setResult] = useState<BMIResult | null>(null);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const toggleFAQ = (i: number) => setOpenFAQ(openFAQ === i ? null : i);

  useEffect(() => {
    const w = Number(weight);
    if (!w || w <= 0) {
      setResult(null);
      return;
    }
    let heightM = 0;
    if (heightUnit === "cm") {
      const h = Number(heightCm);
      if (!h || h <= 0) {
        setResult(null);
        return;
      }
      heightM = h / 100;
    } else {
      const ft = Number(heightFt);
      if (!ft || ft <= 0) {
        setResult(null);
        return;
      }
      heightM = (ft * 30.48 + (Number(heightIn) || 0) * 2.54) / 100;
    }
    const bmi = w / (heightM * heightM);
    if (!isFinite(bmi) || bmi <= 0) {
      setResult(null);
      return;
    }
    setResult({ bmi, category: getCategory(bmi), heightM, weightKg: w });
  }, [weight, heightCm, heightFt, heightIn, heightUnit]);

  const handleCalculate = () => {
    const w = Number(weight);
    if (!w || w <= 0) return;
    let heightM = 0;
    if (heightUnit === "cm") {
      const h = Number(heightCm);
      if (!h || h <= 0) return;
      heightM = h / 100;
    } else {
      const ft = Number(heightFt);
      if (!ft || ft <= 0) return;
      heightM = (ft * 30.48 + (Number(heightIn) || 0) * 2.54) / 100;
    }
    const bmi = w / (heightM * heightM);
    if (!isFinite(bmi) || bmi <= 0) return;
    setResult({ bmi, category: getCategory(bmi), heightM, weightKg: w });
  };

  const handleClear = () => {
    setWeight("");
    setHeightCm("");
    setHeightFt("");
    setHeightIn("");
    setHeightUnit("cm");
    setResult(null);
  };

  return (
    <div className="page-layout">
      <div className="single-page-padding">
        <h1>BMI Calculator — Check Your Body Mass Index Instantly</h1>
        <p>
          Enter your weight and height to calculate your BMI, see your WHO
          weight category, healthy weight range for your height, and where you
          stand compared to the global adult population — all in seconds.
        </p>

        <div className="calc-card single-calc">
          <input
            className="calc-input"
            type="number"
            placeholder="Weight (kg)"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
          <div
            className="modern-dropdown"
            onClick={() => setHeightOpen(!heightOpen)}
          >
            {heightUnit === "cm" ? "Height in cm" : "Height in ft / in"}
            <span className="dropdown-indicator">▼</span>
            {heightOpen && (
              <ul className="dropdown-list">
                <li
                  onClick={() => {
                    setHeightUnit("cm");
                    setHeightOpen(false);
                  }}
                >
                  Height in cm
                </li>
                <li
                  onClick={() => {
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
          <div style={{ display: "flex", gap: "10px" }}>
            <button className="calc-button" onClick={handleCalculate}>
              Calculate
            </button>
            <button className="calc-button calc-clear" onClick={handleClear}>
              Clear
            </button>
          </div>
        </div>

        <div className="cr-mobile-slot">
          <BMIResultPanel result={result} />
        </div>

        {/* ---- SEO CONTENT ---- */}

        <section>
          <h2>What Is BMI (Body Mass Index)?</h2>
          <p>
            BMI, or Body Mass Index, is a numerical value derived from your
            weight and height that serves as a widely used screening tool for
            assessing whether an adult is at a healthy weight. Developed by
            Belgian mathematician Adolphe Quetelet in the 1830s and later
            adopted by the World Health Organization as a global standard, BMI
            is used by doctors, public health agencies, insurance companies, and
            fitness professionals worldwide as a first-pass indicator of whether
            a person's weight may pose a health risk.
          </p>
          <p>
            BMI does not directly measure body fat — it is a weight-to-height
            ratio that correlates reasonably well with more precise fat
            measurement methods for most adults. For a direct estimate of how
            much of your body is actually fat tissue, pair your BMI result with
            our{" "}
            <Link href="/body-fat-calculator/" className="my-link">
              body fat calculator
            </Link>
            , which uses the validated U.S. Navy circumference method to
            estimate body fat percentage with just a measuring tape.
          </p>
        </section>

        <section>
          <h2>BMI Formula — How It Is Calculated</h2>
          <p>
            The BMI formula is the same worldwide and requires only two
            measurements:
          </p>

          <h3>Metric Formula (kg and cm)</h3>
          <pre>BMI = Weight (kg) ÷ Height (m²)</pre>
          <p>
            Example: A person weighing 70 kg at 175 cm (1.75 m) has a BMI of 70
            ÷ (1.75 × 1.75) = <strong>22.9</strong> — Normal weight.
          </p>

          <h3>Imperial Formula (lbs and inches)</h3>
          <pre>BMI = (Weight (lbs) × 703) ÷ Height (inches²)</pre>
          <p>
            Example: A person weighing 154 lbs at 5'9" (69 inches) has a BMI of
            (154 × 703) ÷ (69 × 69) = <strong>22.7</strong> — Normal weight.
          </p>
          <p>
            This calculator supports both metric and imperial inputs — no manual
            unit conversion needed.
          </p>
        </section>

        <section>
          <h2>BMI Categories — WHO Classification Explained</h2>
          <p>
            The WHO classifies BMI into four standard categories for adults aged
            18 and over. Here is what each range means for your health:
          </p>

          <h3>Underweight — BMI Below 18.5</h3>
          <p>
            A BMI under 18.5 suggests insufficient body weight relative to
            height. Underweight adults face elevated risks of malnutrition,
            weakened immune function, bone density loss, anemia, and hormonal
            disruption. It is not always a sign of illness — some people are
            naturally lean — but unintentional weight loss or BMI below 17
            warrants medical assessment. A{" "}
            <Link href="/calorie-calculator/" className="my-link">
              calorie calculator
            </Link>{" "}
            can help underweight individuals estimate how many additional
            calories they need to reach a healthy weight range.
          </p>

          <h3>Normal Weight — BMI 18.5 to 24.9</h3>
          <p>
            This range is associated with the lowest overall health risk for
            most adults. People within this BMI range generally have lower rates
            of cardiovascular disease, type 2 diabetes, sleep apnea, and certain
            cancers. Maintaining BMI here through balanced nutrition and regular
            activity is one of the best-evidenced strategies for long-term
            health.
          </p>

          <h3>Overweight — BMI 25 to 29.9</h3>
          <p>
            A BMI in the overweight range signals that body weight is above the
            optimal level. Health risks are real but moderate at this stage —
            rising blood pressure, early insulin resistance, increased LDL
            cholesterol, and greater joint stress. Research shows that losing
            just 5 to 10% of body weight at this stage meaningfully improves
            blood sugar, blood pressure, and cholesterol. Our{" "}
            <Link href="/calorie-calculator/" className="my-link">
              calorie calculator
            </Link>{" "}
            is the most practical starting point for setting a sustainable
            deficit.
          </p>

          <h3>Obese — BMI 30 and Above</h3>
          <p>
            Obesity is further divided into Class I (30–34.9), Class II
            (35–39.9), and Class III / severe obesity (40+). At these levels,
            the risk of serious chronic conditions rises substantially: type 2
            diabetes, coronary artery disease, stroke, sleep apnea, fatty liver
            disease, and several cancers are all significantly more common. For
            people in the obese range, tracking body composition alongside BMI
            is valuable — our{" "}
            <Link href="/body-fat-calculator/" className="my-link">
              body fat calculator
            </Link>{" "}
            helps monitor the fat-to-muscle ratio as you work toward a healthier
            weight.
          </p>
        </section>

        <section>
          <h2>BMI Chart for Adults — Full WHO Reference Table</h2>
          <p>
            Use this standard BMI chart to quickly identify your category and
            associated health risk level:
          </p>
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginBottom: "20px",
                border: "1px solid #1b3067",
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: "#1b3067",
                    color: "#ffffff",
                    textAlign: "left",
                  }}
                >
                  <th
                    style={{
                      padding: "15px",
                      borderBottom: "2px solid #ffffff",
                    }}
                  >
                    BMI Range
                  </th>
                  <th
                    style={{
                      padding: "15px",
                      borderBottom: "2px solid #ffffff",
                    }}
                  >
                    Weight Category
                  </th>
                  <th
                    style={{
                      padding: "15px",
                      borderBottom: "2px solid #ffffff",
                    }}
                  >
                    Health Risk Level
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ backgroundColor: "#fff" }}>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                    Below 18.5
                  </td>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                    Underweight
                  </td>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                    Moderate (malnutrition risk)
                  </td>
                </tr>
                <tr style={{ backgroundColor: "#f8f9fc" }}>
                  <td
                    style={{
                      padding: "12px",
                      border: "1px solid #ddd",
                      color: "#1b3067",
                      fontWeight: "bold",
                    }}
                  >
                    18.5 – 24.9
                  </td>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                    Normal weight
                  </td>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                    Lowest risk
                  </td>
                </tr>
                <tr style={{ backgroundColor: "#fff" }}>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                    25.0 – 29.9
                  </td>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                    Overweight
                  </td>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                    Increased risk
                  </td>
                </tr>
                <tr style={{ backgroundColor: "#f8f9fc" }}>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                    30.0 – 34.9
                  </td>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                    Obese — Class I
                  </td>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                    High risk
                  </td>
                </tr>
                <tr style={{ backgroundColor: "#fff" }}>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                    35.0 – 39.9
                  </td>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                    Obese — Class II
                  </td>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                    Very high risk
                  </td>
                </tr>
                <tr style={{ backgroundColor: "#f8f9fc" }}>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                    40.0 and above
                  </td>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                    Severe Obesity — Class III
                  </td>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                    Extremely high risk
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2>Healthy Weight Range by Height — Quick Lookup Table</h2>
          <p>
            The table below shows the healthy weight range (BMI 18.5–24.9) for
            common heights. Find your height and see how your current weight
            compares.
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
                    Height
                  </th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                    Min Weight (BMI 18.5)
                  </th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                    Max Weight (BMI 24.9)
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["155 cm / 5'1\"", "44.4 kg", "59.9 kg"],
                  ["160 cm / 5'3\"", "47.4 kg", "63.7 kg"],
                  ["165 cm / 5'5\"", "50.4 kg", "67.8 kg"],
                  ["170 cm / 5'7\"", "53.5 kg", "71.9 kg"],
                  ["175 cm / 5'9\"", "56.7 kg", "76.3 kg"],
                  ["180 cm / 5'11\"", "59.9 kg", "80.7 kg"],
                  ["185 cm / 6'1\"", "63.3 kg", "85.2 kg"],
                  ["190 cm / 6'3\"", "66.8 kg", "89.9 kg"],
                ].map(([h, min, max], i) => (
                  <tr key={i}>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                      {h}
                    </td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                      {min}
                    </td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                      {max}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            If your weight falls outside this range, the calculator above will
            tell you exactly how many kilograms you need to gain or lose to
            reach the normal BMI band for your specific height. For a more
            detailed target, our{" "}
            <Link href="/ideal-weight-calculator/" className="my-link">
              ideal weight calculator
            </Link>{" "}
            uses multiple formulas to suggest a personalized goal weight.
          </p>
        </section>

        <section>
          <h2>BMI Calculation Examples</h2>

          <h3>Example 1: Normal Weight</h3>
          <p>A 25-year-old woman weighs 62 kg and is 168 cm tall.</p>
          <ul className="custom-list">
            <li>Height in meters: 1.68</li>
            <li>
              BMI = 62 ÷ (1.68 × 1.68) = 62 ÷ 2.822 = <strong>22.0</strong>
            </li>
            <li>Category: Normal weight</li>
          </ul>
          <p>
            Her healthy weight range at 168 cm is approximately 52 to 70 kg. She
            is right in the middle — no action needed.
          </p>

          <h3>Example 2: Overweight</h3>
          <p>A 40-year-old man weighs 92 kg and is 178 cm tall.</p>
          <ul className="custom-list">
            <li>Height in meters: 1.78</li>
            <li>
              BMI = 92 ÷ (1.78 × 1.78) = 92 ÷ 3.168 = <strong>29.0</strong>
            </li>
            <li>Category: Overweight</li>
          </ul>
          <p>
            His healthy range tops out at about 79 kg. He would need to lose
            roughly 13 kg to reach the upper end of the normal range. Using our{" "}
            <Link href="/calorie-calculator/" className="my-link">
              calorie calculator
            </Link>{" "}
            to find his TDEE and creating a 400-calorie deficit would produce
            that loss over approximately 8 to 9 months.
          </p>

          <h3>Example 3: Underweight</h3>
          <p>A 19-year-old man weighs 54 kg and is 180 cm tall.</p>
          <ul className="custom-list">
            <li>Height in meters: 1.80</li>
            <li>
              BMI = 54 ÷ (1.80 × 1.80) = 54 ÷ 3.24 = <strong>16.7</strong>
            </li>
            <li>Category: Underweight</li>
          </ul>
          <p>
            The minimum healthy weight at 180 cm is about 60 kg. He would need
            to gain roughly 6 kg. A calorie surplus of 300 to 500 calories above
            his TDEE, combined with resistance training, would support healthy
            weight gain primarily through muscle rather than fat.
          </p>
        </section>

        <section>
          <h2>BMI vs. Body Fat Percentage — What Is the Difference?</h2>
          <p>
            BMI is a useful and fast screening tool, but it has one significant
            limitation: it cannot tell the difference between fat and muscle. A
            90 kg rugby player with 10% body fat and a 90 kg sedentary adult
            with 35% body fat will have the exact same BMI — yet their health
            profiles are entirely different.
          </p>
          <p>
            Body fat percentage directly measures what fraction of your body is
            fat tissue, making it a far more precise indicator of metabolic
            health, insulin sensitivity, and cardiovascular risk. For a complete
            health assessment, use our{" "}
            <Link href="/body-fat-calculator/" className="my-link">
              body fat calculator
            </Link>{" "}
            alongside this BMI tool. The combination of a normal BMI and a
            healthy body fat percentage is a much stronger health signal than
            either measurement alone.
          </p>
        </section>

        <section>
          <h2>Limitations of BMI — What It Cannot Tell You</h2>
          <ul className="custom-list">
            <li>
              <strong>It cannot distinguish muscle from fat.</strong> Athletes
              and heavily muscular individuals frequently register as
              "overweight" or "obese" despite having very low body fat and
              excellent cardiovascular fitness.
            </li>
            <li>
              <strong>It misses normal-weight obesity.</strong> People with a
              healthy BMI can carry dangerously high visceral fat — a condition
              sometimes called "skinny fat." BMI would not flag this.
            </li>
            <li>
              <strong>Age and sex affect accuracy.</strong> Older adults tend to
              carry more fat at the same BMI as younger adults. Women naturally
              carry more essential fat than men. BMI uses universal thresholds
              that do not account for these differences.
            </li>
            <li>
              <strong>Ethnicity matters.</strong> South Asian and East Asian
              populations face elevated health risks at lower BMI values. Some
              clinical guidelines recommend lower cut-offs for these groups —
              overweight starting at BMI 23 rather than 25.
            </li>
            <li>
              <strong>It does not apply to children.</strong> Pediatric BMI
              requires age- and sex-specific percentile charts. The adult
              categories in this calculator do not apply to anyone under 18.
            </li>
            <li>
              <strong>It ignores fat distribution.</strong> Where you carry fat
              matters as much as how much you carry. Visceral fat around the
              abdomen is far more metabolically dangerous than subcutaneous fat
              on the hips and thighs. Waist circumference and waist-to-hip ratio
              are better predictors of cardiovascular risk than BMI alone.
            </li>
          </ul>
        </section>

        <section>
          <h2>BMI for Different Ethnic Groups — Adjusted Cut-Offs</h2>
          <p>
            The standard WHO thresholds (overweight at 25, obese at 30) were
            developed primarily using data from European populations. Research
            over the past two decades has shown that metabolic risks —
            particularly type 2 diabetes and cardiovascular disease — appear at
            lower BMI values in South Asian, Southeast Asian, and East Asian
            populations. Several countries and medical bodies now recommend
            adjusted cut-offs:
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
                    Population
                  </th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                    Overweight Starts
                  </th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                    Obese Starts
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    WHO Standard (European)
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    25.0
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    30.0
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    South Asian / Southeast Asian
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    23.0
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    27.5
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    East Asian (Chinese, Japanese, Korean)
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    23.0–24.0
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    25.0–28.0
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            If you belong to one of these groups, a BMI of 24 — technically
            "normal" by standard WHO thresholds — may already carry meaningful
            metabolic risk. Pairing your BMI with a{" "}
            <Link href="/body-fat-calculator/" className="my-link">
              body fat percentage measurement
            </Link>{" "}
            gives a more accurate picture of your actual health status.
          </p>
        </section>

        <section>
          <h2>How to Lower Your BMI — Evidence-Based Strategies</h2>
          <p>
            If your BMI falls in the overweight or obese range, the most
            evidence-backed approach combines a moderate calorie deficit,
            increased protein, resistance training, and cardiovascular exercise:
          </p>
          <ul className="custom-list">
            <li>
              <strong>Find your maintenance calories first.</strong> Use our{" "}
              <Link href="/calorie-calculator/" className="my-link">
                calorie calculator
              </Link>{" "}
              to estimate your TDEE. Subtracting 300 to 500 calories creates a
              deficit that produces steady fat loss of roughly 0.3 to 0.5 kg per
              week — fast enough to see progress, slow enough to preserve
              muscle.
            </li>
            <li>
              <strong>Prioritize protein.</strong> Eating 1.6 to 2.2 g of
              protein per kg of body weight preserves lean muscle during fat
              loss and keeps your metabolism from slowing significantly.
            </li>
            <li>
              <strong>Lift weights.</strong> Resistance training prevents the
              muscle loss that accompanies calorie restriction. More muscle
              means a higher resting metabolic rate, which makes long-term
              weight management easier.
            </li>
            <li>
              <strong>Add cardio.</strong> Walking, cycling, swimming, and HIIT
              all accelerate the calorie deficit and deliver cardiovascular
              benefits independent of weight change.
            </li>
            <li>
              <strong>Protect your sleep.</strong> Chronic sleep deprivation
              elevates cortisol, increases appetite, and promotes fat storage.
              Consistently getting 7 to 9 hours is one of the most impactful but
              underrated factors in body composition.
            </li>
            <li>
              <strong>Track body composition, not just the scale.</strong> As
              you gain muscle and lose fat, weight may plateau — but your{" "}
              <Link href="/body-fat-calculator/" className="my-link">
                body fat percentage
              </Link>{" "}
              will fall and your health markers will improve. Use both tools
              monthly.
            </li>
          </ul>
        </section>

        <section>
          <h2>Frequently Asked Questions About BMI</h2>

          {[
            [
              "What is a healthy BMI for adults?",
              "According to WHO guidelines, a healthy BMI for adults is between 18.5 and 24.9. Below 18.5 is underweight; 25 to 29.9 is overweight; 30 and above is obese. These thresholds apply to adults aged 18 and over. Note that some clinical guidelines recommend lower cut-offs for South and East Asian populations, where metabolic risks appear at lower BMI values.",
            ],
            [
              "What BMI is considered obese?",
              "A BMI of 30 or higher is classified as obese by the WHO. It is further divided into Class I (30–34.9), Class II (35–39.9), and Class III or severe obesity (40+). At each level, risks of type 2 diabetes, cardiovascular disease, and certain cancers increase progressively.",
            ],
            [
              "Is BMI accurate for muscular people?",
              "No. BMI cannot distinguish fat mass from muscle mass. Because muscle is denser than fat, athletes and those who do heavy physical training often register as overweight or obese despite having very low body fat. For these individuals, measuring actual body fat percentage is a far more meaningful health metric.",
            ],
            [
              "Does BMI directly measure body fat percentage?",
              "No. BMI is a weight-to-height ratio and does not measure fat directly. Two people with identical BMIs can have very different body fat levels depending on muscle mass, bone density, and fat distribution. Use our body fat calculator alongside this tool for a more complete picture.",
            ],
            [
              "Can this BMI calculator be used for children?",
              "No. This calculator is designed for adults aged 18 and over. BMI interpretation for children requires age- and sex-specific percentile charts because healthy body fat levels change throughout childhood. Consult a pediatrician for child BMI assessment.",
            ],
            [
              "How can I lower my BMI?",
              "Lowering BMI requires reducing body fat through a consistent calorie deficit. A deficit of 300 to 500 calories per day typically produces sustainable fat loss of 0.3 to 0.5 kg per week. Use our calorie calculator to find your TDEE and set an accurate target. Combining this with resistance training preserves muscle while losing fat.",
            ],
            [
              "What is the difference between BMI and ideal weight?",
              "BMI tells you whether your current weight falls in a healthy range relative to your height. Ideal weight calculators use specific formulas (Devine, Robinson, Miller, Hamwi) to suggest a single target weight based on your height and frame. BMI gives you a range; ideal weight gives you a point estimate. Both are useful together.",
            ],
            [
              "Why do different ethnic groups have different BMI cut-offs?",
              "Research shows that South Asian and East Asian populations develop metabolic diseases like type 2 diabetes at lower BMI values than European populations. This is related to differences in body composition — at the same BMI, these groups tend to have higher body fat percentages and more visceral fat. Adjusted cut-offs (overweight at 23 instead of 25) reflect this evidence.",
            ],
            [
              "Is the BMI calculator free to use?",
              "Yes — completely free with no sign-up, no download, and no usage limits. Results appear instantly as you type, and the detailed result panel shows your BMI score, WHO category, healthy weight range, global percentile, and world BMI distribution comparison.",
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
            BMI is a fast, useful, and free screening tool — but it is just the
            starting point, not the final word on your health. Use this
            calculator to check where you stand, then combine it with our{" "}
            <Link href="/body-fat-calculator/" className="my-link">
              body fat calculator
            </Link>{" "}
            for a more precise picture of your body composition, our{" "}
            <Link href="/calorie-calculator/" className="my-link">
              calorie calculator
            </Link>{" "}
            to set an actionable daily target.
          </p>
        </section>
      </div>

      {/* ════════ RIGHT — sticky sidebar ════════ */}
      <aside className="sidebar">
        <div className="cr-desktop-slot">
          <BMIResultPanel result={result} />
        </div>

        <div className="sidebar-box">
          <p style={{ fontSize: "18px", fontWeight: 600, margin: "0 0 12px" }}>
            Related Calculators
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {[
              ["/body-fat-calculator/", "Body Fat Calculator"],
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
