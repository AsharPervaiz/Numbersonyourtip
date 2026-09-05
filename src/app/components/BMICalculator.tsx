"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import ReviewedBy from "./ReviewedBy";

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

  /* ── FAQ data (also used for JSON-LD schema) ── */
  const faqs: [string, string][] = [
    [
      "How do I calculate BMI in kg and feet and inches?",
      "Convert the height to inches first, multiply by 2.54 to get centimetres, then divide by 100 for metres. Someone 5 feet 7 inches is 67 inches, which is 170.2 cm or 1.702 m. Square that to get 2.897, then divide the weight in kilograms by it — 70 kg gives a BMI of 24.2. Mixing systems without converting is what produces impossible results like 3 or 300.",
    ],
    [
      "Is there a separate BMI formula for women?",
      "No. Adult BMI takes height and weight only, so a woman and a man of the same height and weight get the same number. Calculators marketed for women run identical arithmetic. What differs is the body behind the figure: women carry more essential fat as a matter of physiology, so at the same BMI a woman typically has a higher body fat percentage. A body fat estimate is more informative than BMI for that comparison.",
    ],
    [
      "Does age change the BMI calculation?",
      "Not for adults — age does not enter the formula at any point. It does change what the result means, because muscle mass tends to fall and fat mass to rise from middle age onward, often with no movement on the scale. Height loss in later life also inflates BMI without any change in body mass. For anyone under 18 the calculation is different: children are assessed on BMI-for-age percentiles against reference data for their exact age and sex.",
    ],
    [
      "Why is the imperial formula multiplied by 703?",
      "It is a unit conversion folded into a constant. Pounds per square inch and kilograms per square metre are different scales, and 703 is the factor that reconciles them so you can work in imperial units without converting height and weight separately. It carries no biological meaning.",
    ],
    [
      "Is BMI accurate for someone who lifts weights?",
      "Poorly. Muscle is denser than fat, so a well-trained person can land in the overweight or obese category while carrying very little fat. The less-discussed mirror image is just as misleading: someone with low muscle and high fat can sit comfortably in the normal band. In both cases a body fat estimate describes the situation and BMI does not.",
    ],
    [
      "Why do some countries use lower BMI cut-offs?",
      "Because the relationship between BMI and metabolic risk is not identical across populations. Health authorities in several Asian countries apply lower thresholds, since elevated risk tends to appear at a lower BMI than the general cut-offs imply. Someone reading as normal weight under the standard thresholds may fall into an elevated band under the adjusted ones, so use the cut-offs your own health service publishes.",
    ],
    [
      "Is a BMI of 24.9 meaningfully different from 25.1?",
      "No. Those two figures describe practically identical bodies and fall either side of a line drawn across a continuous scale for convenience. The categories are population thresholds derived from group-level health outcomes, not diagnostic boundaries for individuals. Read your result as a position on a gradient rather than as membership of a category.",
    ],
    [
      "What should I measure alongside BMI?",
      "Waist circumference, which takes about thirty seconds and captures something BMI cannot see — fat stored around the abdomen carries more metabolic risk than fat elsewhere. Waist divided by height, kept under about half, is an easily remembered check that works at any height without a lookup table.",
    ],
    [
      "Can BMI be used during pregnancy?",
      "No. Weight gain in pregnancy is expected and is monitored against pregnancy-specific guidance rather than the standard BMI categories, which would classify normal, healthy gain as a problem. Pre-pregnancy BMI is sometimes used by clinicians as a starting reference, but that is a different question from calculating BMI while pregnant.",
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
        <h1>BMI Calculator — kg/cm, Feet and Inches, or Pounds</h1>

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

        <h2>Working It Out in Whatever Units You Have</h2>
        <p>
          Most people know their height in one system and their weight in
          another — centimetres and kilograms, or feet and inches with a weight
          in kilos, or pounds and inches. The formula only accepts one
          combination at a time, so the arithmetic starts with a conversion more
          often than not.
        </p>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>What you know</th>
                <th>What to do first</th>
                <th>Then apply</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>kg and cm</td>
                <td>Divide height by 100 to get metres</td>
                <td>kg ÷ m²</td>
              </tr>
              <tr>
                <td>kg and feet/inches</td>
                <td>
                  Convert height to inches, multiply by 2.54, divide by 100
                </td>
                <td>kg ÷ m²</td>
              </tr>
              <tr>
                <td>lbs and inches</td>
                <td>Nothing — use the imperial form</td>
                <td>(lbs ÷ inches²) × 703</td>
              </tr>
              <tr>
                <td>lbs and cm</td>
                <td>Divide pounds by 2.205 to get kilograms</td>
                <td>kg ÷ m²</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          Someone who is 5 feet 7 inches and weighs 70 kg converts as 67 inches
          × 2.54 = 170.2 cm = 1.702 m. Squaring gives 2.897, and 70 ÷ 2.897 =
          24.2.
        </p>
        <p>
          The 703 in the imperial version is not a mysterious constant. It is
          simply the conversion factor that turns pounds per square inch into
          kilograms per square metre, folded into one number so the formula can
          be applied without leaving imperial units. Using the imperial formula
          with a metric height, or the metric formula with pounds, produces
          answers so far out that they are usually obvious — a BMI of 3 or of
          300 means the units were mixed, not that anything is wrong with you.
        </p>
        <p>
          Squaring the height is what makes small height errors matter. A
          two-centimetre difference in a recorded height shifts BMI by roughly
          half a point, which is enough to move somebody across a category
          boundary if they were already sitting on one. Measure without shoes
          rather than using a figure from memory.
        </p>

        <h2>Does Age or Sex Change the Calculation?</h2>
        <p>
          For adults, no. There is one adult BMI formula and it takes height and
          weight only. A woman and a man of identical height and weight have
          identical BMI, and so do a thirty-year-old and a seventy-year-old.
          Calculators advertised as being for women, for men, or for a
          particular age are running the same arithmetic as every other one.
        </p>
        <p>
          What genuinely changes is what the number is worth once you have it.
        </p>

        <h3>Body Composition Differs by Sex</h3>
        <p>
          Women carry more essential fat than men as a matter of physiology, so
          at the same BMI a woman typically has a higher body fat percentage
          than a man. The category label does not adjust for this. A BMI of 23
          describes a different body composition in the two cases even though the
          number is identical, which is why a body fat estimate carries more
          information than BMI for anyone comparing themselves against a
          partner or a sibling.
        </p>

        <h3>Age Changes the Body Behind the Number</h3>
        <p>
          Muscle mass tends to decline from middle age onward while fat mass
          rises, often with no movement on the scale at all. A man of 55 at the
          same BMI he held at 25 is very likely carrying more fat and less
          muscle. The figure has not moved; the body underneath it has. This is
          why a stable BMI across decades should not be read as a stable body
          composition, and why waist measurement becomes a more useful companion
          metric with age.
        </p>

        <h3>Children Are a Different Calculation Entirely</h3>
        <p>
          For anyone under 18, a raw BMI number is not interpretable against
          adult categories. Children are assessed on BMI-for-age percentiles,
          which compare a child against reference data for their exact age and
          sex, because normal body composition changes substantially through
          growth. A BMI of 17 can be entirely healthy at one age and a concern
          at another. Paediatric assessment belongs with a clinician using growth
          charts, not with an adult calculator.
        </p>

        <h2>Where the Categories Come From, and What They Assume</h2>
        <p>
          The familiar cut-offs — 18.5, 25, 30 — are population thresholds drawn
          from studies of health outcomes across large groups. They were never
          intended as individual diagnoses, and they carry an assumption that is
          easy to miss: that the relationship between BMI and body fat is
          consistent across populations.
        </p>
        <p>
          It is not. Health authorities in several Asian countries apply lower
          thresholds, because metabolic risk in those populations tends to appear
          at a lower BMI than the standard cut-offs suggest. Someone classified
          as normal weight by the general thresholds may already be in an
          elevated-risk band under the adjusted ones. If your own health service
          publishes population-specific cut-offs, those are the ones that apply
          to you.
        </p>
        <p>
          Category boundaries are also hard lines drawn across a continuous
          scale. A BMI of 24.9 and one of 25.1 sit in different named categories
          and describe practically identical bodies. Treating the boundary as a
          cliff rather than a marker on a gradient reads more into the number
          than it can support.
        </p>

        <h2>The Four Situations Where BMI Misleads</h2>
        <ul className="custom-list">
          <li>
            <strong>Substantial muscle mass.</strong> Muscle is denser than fat,
            so a well-trained person can register as overweight or obese while
            carrying very little fat. This is the best-known failure and the
            reason BMI is a poor screening tool in athletic populations.
          </li>
          <li>
            <strong>Low muscle with normal weight.</strong> The mirror image
            attracts far less attention and is more common: someone whose BMI
            sits comfortably in the normal band while carrying a high proportion
            of fat and very little muscle. The category reads as reassuring and
            the composition is not.
          </li>
          <li>
            <strong>Older adults.</strong> Height loss with age inflates BMI
            without any change in body mass, since the denominator shrinks.
            Muscle loss compounds the effect in the opposite direction on
            composition.
          </li>
          <li>
            <strong>Pregnancy.</strong> BMI is not applicable during pregnancy.
            Weight gain is expected and monitored against pregnancy-specific
            guidance rather than against the standard categories.
          </li>
        </ul>

        <h2>What to Measure Alongside It</h2>
        <p>
          BMI earns its place by being fast, free, and requiring nothing but a
          scale and a tape. It stops being useful the moment it is asked to
          stand alone.
        </p>
        <p>
          Waist circumference is the most valuable companion and takes about
          thirty seconds. Fat stored around the abdomen carries more metabolic
          risk than fat elsewhere, and BMI cannot see the difference. Waist
          divided by height, kept under about half, is a widely used and easily
          remembered check that works across heights without needing a table.
        </p>
        <p>
          For an estimate of composition rather than mass, the{" "}
          <Link href="/body-fat-calculator/" className="my-link">
            body fat calculator
          </Link>{" "}
          uses neck, waist and hip measurements to distinguish fat from lean
          mass — the exact distinction BMI cannot make. If the goal is changing
          the number rather than interpreting it, the{" "}
          <Link href="/calorie-calculator/" className="my-link">
            calorie calculator
          </Link>{" "}
          estimates daily energy needs as a starting point.
        </p>

        <h2>Using It Sensibly</h2>
        <ul className="custom-list">
          <li>
            Treat it as a screening figure, not a diagnosis. It flags that a
            conversation might be worth having, and nothing more.
          </li>
          <li>
            Measure height properly rather than recalling it, since the
            denominator is squared.
          </li>
          <li>
            Read your result as a position on a gradient, not as membership of a
            category.
          </li>
          <li>
            Pair it with a waist measurement before drawing any conclusion.
          </li>
          <li>
            If you train seriously, or are over about sixty, or are pregnant,
            expect BMI to describe you poorly and use something else.
          </li>
        </ul>
        <section>
          <h2>BMI Questions People Ask</h2>

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
