"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

/* ─────────────────────────────────────────
   Types
───────────────────────────────────────── */
interface GPAPctResult {
  percentage: number;
  gpa: number;
  scale: number;
}

/* ─────────────────────────────────────────
   Pure helper
───────────────────────────────────────── */
function needleDeg(ratio: number): number {
  const clamped = Math.min(Math.max(ratio, 0), 1);
  return -90 + clamped * 180;
}

/* ─────────────────────────────────────────
   GPAPctResultPanel — UNCHANGED
───────────────────────────────────────── */
function GPAPctResultPanel({ result }: { result: GPAPctResult | null }) {
  if (!result) {
    return (
      <div className="cr-panel-placeholder">
        <div className="cr-ph-icon">
          <i className="fa-solid fa-percent" aria-hidden="true" />
        </div>
        Enter your GPA and scale to see the percentage equivalent here.
      </div>
    );
  }

  const { percentage, gpa, scale } = result;

  const ratio = Math.min(percentage / 100, 1);
  const barPct = 2 + ratio * 96;

  const pctLabel =
    percentage < 40
      ? "Failing"
      : percentage < 50
        ? "Below average"
        : percentage < 60
          ? "Satisfactory"
          : percentage < 70
            ? "Average"
            : percentage < 80
              ? "Good"
              : percentage < 90
                ? "Very good"
                : percentage < 95
                  ? "Excellent"
                  : "Outstanding";

  const pctBadge =
    percentage < 50
      ? "danger"
      : percentage < 60
        ? "warning"
        : percentage < 70
          ? "normal"
          : percentage < 80
            ? "normal"
            : "good";

  const tiers4 = [
    { label: "F (< 50%)", min: 0, max: 50, color: "#F09595" },
    { label: "D (50–62%)", min: 50, max: 62, color: "#FAC775" },
    { label: "C (62–75%)", min: 62, max: 75, color: "#C0DD97" },
    { label: "B (75–87%)", min: 75, max: 87, color: "#97C459" },
    { label: "A (87–100%)", min: 87, max: 100, color: "#5BA825" },
  ];

  return (
    <div className="cr-panel">
      <div className="cr-gauge-wrap">
        <svg
          className="cr-gauge-svg"
          width="100"
          height="60"
          viewBox="0 0 120 70"
          role="img"
          aria-label={`Percentage gauge: ${percentage}%`}
        >
          <defs>
            <clipPath id="gpapct-half">
              <rect x="0" y="0" width="120" height="65" />
            </clipPath>
          </defs>
          <circle
            cx="60"
            cy="65"
            r="52"
            fill="none"
            stroke="#F09595"
            strokeWidth="12"
            strokeDasharray="65 326"
            strokeDashoffset="-163"
            clipPath="url(#gpapct-half)"
          />
          <circle
            cx="60"
            cy="65"
            r="52"
            fill="none"
            stroke="#FAC775"
            strokeWidth="12"
            strokeDasharray="65 326"
            strokeDashoffset="-228"
            clipPath="url(#gpapct-half)"
          />
          <circle
            cx="60"
            cy="65"
            r="52"
            fill="none"
            stroke="#C0DD97"
            strokeWidth="12"
            strokeDasharray="65 326"
            strokeDashoffset="-293"
            clipPath="url(#gpapct-half)"
          />
          <circle
            cx="60"
            cy="65"
            r="52"
            fill="none"
            stroke="#97C459"
            strokeWidth="12"
            strokeDasharray="82 326"
            strokeDashoffset="-358"
            clipPath="url(#gpapct-half)"
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
              transform: `rotate(${needleDeg(ratio)}deg)`,
              transition: "transform 0.5s ease",
            }}
          />
          <circle cx="60" cy="65" r="5" fill="#111111" />
        </svg>

        <div className="cr-score-block">
          <div className="cr-score">{percentage.toFixed(2)}%</div>
          <div className="cr-score-label">percentage equivalent</div>
          <span className={`cr-badge ${pctBadge}`}>{pctLabel}</span>
        </div>
      </div>

      <hr className="cr-divider" />

      <div>
        <div className="cr-bar-label">percentage score (0–100%)</div>
        <div
          className="cr-bar-track"
          style={{
            background:
              "linear-gradient(to right, #F09595 0%, #FAC775 25%, #C0DD97 55%, #97C459 100%)",
          }}
        >
          <div className="cr-bar-thumb" style={{ left: `${barPct}%` }} />
        </div>
        <div className="cr-bar-ticks">
          <span>0%</span>
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span>100%</span>
        </div>
      </div>

      <hr className="cr-divider" />

      <div className="cr-metrics-grid">
        <div className="cr-metric-card">
          <div className="cr-m-label">GPA entered</div>
          <div className="cr-m-value">{gpa}</div>
          <div className="cr-m-sub">on {scale}.0 scale</div>
        </div>
        <div className="cr-metric-card">
          <div className="cr-m-label">Scale max</div>
          <div className="cr-m-value">{scale}.0</div>
          <div className="cr-m-sub">selected scale</div>
        </div>
        <div className="cr-metric-card">
          <div className="cr-m-label">Percentage</div>
          <div className="cr-m-value">{percentage.toFixed(2)}%</div>
          <div className="cr-m-sub">result</div>
        </div>
        <div className="cr-metric-card">
          <div className="cr-m-label">Grade class</div>
          <div className="cr-m-value" style={{ fontSize: "14px" }}>
            {pctLabel}
          </div>
          <div className="cr-m-sub">classification</div>
        </div>
      </div>

      <hr className="cr-divider" />

      <div>
        <div className="cr-world-title">percentage grade reference</div>
        {tiers4.map(({ label, min, max, color }) => {
          const range = max - min;
          const filled = Math.min(Math.max(percentage - min, 0), range);
          const pct = Math.round((filled / range) * 100);
          return (
            <div className="cr-world-bar-row" key={label}>
              <span
                className="cr-w-label"
                style={{ width: "90px", fontSize: "11px" }}
              >
                {label}
              </span>
              <div className="cr-world-track">
                <div
                  className="cr-world-fill"
                  style={{ width: `${pct}%`, background: color }}
                />
              </div>
              <span className="cr-w-pct" style={{ width: "32px" }}>
                {pct}%
              </span>
            </div>
          );
        })}
        <p className="cr-world-note">
          {scale === 10
            ? `Formula used: GPA × 9.5 = ${gpa} × 9.5 = ${percentage.toFixed(2)}%`
            : `Formula used: (GPA ÷ ${scale}.0) × 100 = (${gpa} ÷ ${scale}) × 100 = ${percentage.toFixed(2)}%`}
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Main Calculator Page
───────────────────────────────────────── */
export default function GPAToPercentageCalculator() {
  const [gpa, setGpa] = useState("");
  const [scale, setScale] = useState("4");
  const [percentage, setPercentage] = useState<number | null>(null);
  const [scaleOpen, setScaleOpen] = useState(false);

  const [panelResult, setPanelResult] = useState<GPAPctResult | null>(null);

  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const toggleFAQ = (index: number) =>
    setOpenFAQ(openFAQ === index ? null : index);

  const compute = (): GPAPctResult | null => {
    const g = Number(gpa);
    const s = Number(scale);
    if (!g || !s || g <= 0) return null;

    const result = s === 10 ? g * 9.5 : (g / s) * 100;
    if (!isFinite(result) || result < 0) return null;

    return {
      percentage: Number(result.toFixed(2)),
      gpa: g,
      scale: s,
    };
  };

  useEffect(() => {
    setPanelResult(compute());
  }, [gpa, scale]);

  const calculatePercentage = () => {
    const g = Number(gpa);
    const s = Number(scale);
    if (!g || !s) return;
    const result = (g / s) * 100;
    setPercentage(Number(result.toFixed(2)));
  };

  const clearAll = () => {
    setGpa("");
    setScale("4");
    setPercentage(null);
    setPanelResult(null);
  };

  /* ── FAQ data (also used for JSON-LD schema) ── */
  const faqs: [string, string][] = [
    [
      "How do I convert GPA to percentage?",
      "Divide your GPA by the maximum GPA of your scale, then multiply by 100. For a 4.0 scale: (GPA ÷ 4.0) × 100. For a 5.0 scale: (GPA ÷ 5.0) × 100. For a 10-point CGPA scale, use the standard UGC formula: CGPA × 9.5.",
    ],
    [
      "What is 3.5 GPA in percentage?",
      "A 3.5 GPA on a 4.0 scale equals 87.5%, calculated as (3.5 ÷ 4.0) × 100. On a 5.0 scale, 3.5 GPA equals 70%. Always specify your scale when reporting the percentage.",
    ],
    [
      "Is 3.5 GPA good?",
      "Yes — a 3.5 GPA is very good. It's above the average of 3.0 at most U.S. colleges, typically qualifies for Dean's List, and is competitive for graduate school admissions. In percentage terms, it equals about 87–89%.",
    ],
    [
      "What is 3.0 GPA in percentage?",
      "A 3.0 GPA on a 4.0 scale = 75%. On a 5.0 scale, 3.0 GPA = 60%. On a 10-point scale, a 3.0 CGPA = 28.5% (using CGPA × 9.5) — which is why scale matters so much for accurate reporting.",
    ],
    [
      "What is 7.5 CGPA in percentage on a 10-point scale?",
      "Using the standard UGC formula: 7.5 × 9.5 = 71.25%. This is one of the most searched CGPA conversions for Indian engineering and university students.",
    ],
    [
      "What's the difference between GPA, CGPA, and SGPA?",
      "SGPA (Semester GPA) is calculated for one semester. CGPA (Cumulative GPA) is the weighted average of all semesters completed. GPA is a general term that can refer to either — used mostly in the US. SGPA and CGPA are the standard terms in India and other South Asian countries.",
    ],
    [
      "Do all universities use the same GPA to percentage formula?",
      "No. The US typically uses (GPA ÷ 4.0) × 100. Indian universities under UGC guidelines use CGPA × 9.5. European institutions often use their own conversion tables. Always check your target institution's official policy before submitting documents.",
    ],
    [
      "Can I use this to convert CGPA to percentage?",
      "Yes. CGPA and GPA use the same conversion math. Enter your CGPA value and pick the matching scale — the calculator handles 4.0, 5.0, and 10-point CGPA systems.",
    ],
    [
      "Is a percentage or GPA more useful for study abroad applications?",
      "It depends on the country. Universities in the US and Canada typically prefer GPA. UK, Australian, Indian, and Middle Eastern universities usually require percentages. Providing both on your application removes any ambiguity.",
    ],
    [
      "Is this GPA to percentage calculator free?",
      "Yes, it's 100% free, requires no login or signup, works on any device, and supports 4.0, 5.0, and 10-point scales. Enter your GPA to get an instant percentage equivalent.",
    ],
  ];

  return (
    <div className="page-layout">
      <div className="single-page-padding">
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

        <h1>GPA to Percentage Calculator</h1>

        <p>
          Free <strong>GPA to percentage calculator</strong> — convert your GPA
          or CGPA to percentage on the 4.0, 5.0, or 10-point scale instantly. No
          login, no signup.
        </p>

        <div className="calc-card single-calc">
          <input
            className="calc-input"
            type="number"
            step="0.01"
            placeholder="Enter GPA"
            value={gpa}
            onChange={(e) => setGpa(e.target.value)}
          />

          <div style={{ position: "relative", width: "100%" }}>
            <div
              className="modern-dropdown"
              style={{ width: "100%" }}
              onClick={() => setScaleOpen(!scaleOpen)}
            >
              {scale}.0 Scale
              <span className="dropdown-indicator">▼</span>
              {scaleOpen && (
                <ul className="dropdown-list">
                  {["4", "5", "10"].map((value) => (
                    <li
                      key={value}
                      onClick={(e) => {
                        e.stopPropagation();
                        setScale(value);
                        setScaleOpen(false);
                      }}
                    >
                      {value}.0 Scale
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
            <button className="calc-button" onClick={calculatePercentage}>
              Calculate
            </button>
            <button className="calc-button calc-clear" onClick={clearAll}>
              Clear
            </button>
          </div>
        </div>

        <div className="cr-mobile-slot">
          <GPAPctResultPanel result={panelResult} />
        </div>

        {/* ── SEO CONTENT — REWRITTEN ── */}

        <h2>What Is GPA to Percentage Conversion?</h2>
        <p>
          Different countries measure academic performance differently. The US
          and Canada report grades as a <strong>GPA on a 4.0 scale</strong>.
          India, Pakistan, and much of South Asia use a{" "}
          <strong>10-point CGPA</strong>. Universities in the UK, Australia, and
          the Middle East report grades as a straight{" "}
          <strong>percentage</strong>. Applying across borders means converting
          between them.
        </p>
        <p>
          This <strong>GPA to percentage converter</strong> handles all three
          major systems — 4.0, 5.0, and 10-point — using the standard formulas
          accepted by most universities and credential evaluators. Enter your
          GPA above and pick the matching scale to get your percentage
          instantly.
        </p>

        <h2>How to Convert GPA to Percentage (The Formula)</h2>
        <p>
          The <strong>GPA to percentage formula</strong> depends on your grading
          scale. There are three standard conversion methods, each used by
          different regions:
        </p>
        <ul className="custom-list">
          <li>
            <strong>4.0 Scale</strong> (US, Canada, most international
            universities): <code>Percentage = (GPA ÷ 4.0) × 100</code>
          </li>
          <li>
            <strong>5.0 Scale</strong> (weighted / honors / some high schools):{" "}
            <code>Percentage = (GPA ÷ 5.0) × 100</code>
          </li>
          <li>
            <strong>10-Point CGPA Scale</strong> (India, Pakistan, UGC
            institutions): <code>Percentage = CGPA × 9.5</code>
          </li>
        </ul>
        <p>
          <strong>Worked examples:</strong>
        </p>
        <ul className="custom-list">
          <li>
            3.5 GPA on 4.0 scale → (3.5 ÷ 4.0) × 100 = <strong>87.5%</strong>
          </li>
          <li>
            4.2 GPA on 5.0 scale → (4.2 ÷ 5.0) × 100 = <strong>84%</strong>
          </li>
          <li>
            8.0 CGPA on 10-point scale → 8.0 × 9.5 = <strong>76%</strong>
          </li>
        </ul>

        <h2>GPA to Percentage Chart — 4.0 Scale (US Standard)</h2>
        <p>
          Use this reference chart if your GPA is on the standard 4.0 scale used
          by most American, Canadian, and international universities:
        </p>
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
                backgroundColor: "var(--card-bg, #0D2A5C)",
                color: "#fff",
                textAlign: "left",
              }}
            >
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>GPA</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                Percentage
              </th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                Letter Grade
              </th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                Classification
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>4.0</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                100%
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>A+</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Outstanding
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>3.7</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                92.5%
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>A−</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Excellent
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>3.5</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                87.5%
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>B+</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Very good
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>3.3</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                82.5%
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>B+</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Very good
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>3.0</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>75%</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>B</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Good
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>2.7</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                67.5%
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>C+</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Above average
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>2.5</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                62.5%
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>C</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Average
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>2.0</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>50%</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>C−</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Satisfactory
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>1.5</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                37.5%
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>D</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Below average
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>1.0</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>25%</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>D−</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Passing
              </td>
            </tr>
          </tbody>
        </table>

        <h2>CGPA to Percentage Chart — 10-Point Scale (India / UGC)</h2>
        <p>
          The <strong>UGC-approved formula</strong> for converting 10-point CGPA
          to percentage is <code>Percentage = CGPA × 9.5</code>. This is the
          standard used by most Indian universities, engineering colleges
          (including IITs, NITs, and state universities), and CBSE for higher
          secondary results.
        </p>
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
                backgroundColor: "var(--card-bg, #0D2A5C)",
                color: "#fff",
                textAlign: "left",
              }}
            >
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                CGPA
              </th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                Percentage
              </th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                Classification
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                10.0
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>95%</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Outstanding
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>9.5</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                90.25%
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Excellent
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>9.0</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                85.5%
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Excellent
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>8.5</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                80.75%
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                First Class with Distinction
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>8.0</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>76%</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                First Class with Distinction
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>7.5</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                71.25%
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                First Class
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>7.0</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                66.5%
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                First Class
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>6.5</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                61.75%
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Second Class
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>6.0</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>57%</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Second Class
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>5.0</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                47.5%
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Pass
              </td>
            </tr>
          </tbody>
        </table>

        <h2>GPA to Percentage Chart — 5.0 Scale (Weighted / Honors)</h2>
        <p>
          The <strong>5.0 scale</strong> is used by some high schools and honors
          programs where AP, IB, or advanced courses can push GPA above 4.0.
          Conversion formula: <code>Percentage = (GPA ÷ 5.0) × 100</code>.
        </p>
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
                backgroundColor: "var(--card-bg, #0D2A5C)",
                color: "#fff",
                textAlign: "left",
              }}
            >
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                GPA (5.0 scale)
              </th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                Percentage
              </th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                Meaning
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>5.0</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                100%
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Perfect (all AP/honors A's)
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>4.5</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>90%</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Excellent
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>4.0</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>80%</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Very good
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>3.5</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>70%</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Good
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>3.0</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>60%</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Above average
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>2.5</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>50%</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Passing
              </td>
            </tr>
          </tbody>
        </table>

        <h2>3.5 GPA to Percentage — And Every Other Common GPA</h2>
        <p>
          These are the most searched individual GPA-to-percentage conversions.
          Bookmark this section as a quick reference:
        </p>
        <ul className="custom-list">
          <li>
            <strong>4.0 GPA to percentage</strong> = 100% (4.0 scale)
          </li>
          <li>
            <strong>3.9 GPA to percentage</strong> = 97.5%
          </li>
          <li>
            <strong>3.8 GPA to percentage</strong> = 95%
          </li>
          <li>
            <strong>3.7 GPA to percentage</strong> = 92.5%
          </li>
          <li>
            <strong>3.6 GPA to percentage</strong> = 90%
          </li>
          <li>
            <strong>3.5 GPA to percentage</strong> = 87.5%
          </li>
          <li>
            <strong>3.4 GPA to percentage</strong> = 85%
          </li>
          <li>
            <strong>3.3 GPA to percentage</strong> = 82.5%
          </li>
          <li>
            <strong>3.2 GPA to percentage</strong> = 80%
          </li>
          <li>
            <strong>3.0 GPA to percentage</strong> = 75%
          </li>
          <li>
            <strong>2.7 GPA to percentage</strong> = 67.5%
          </li>
          <li>
            <strong>2.5 GPA to percentage</strong> = 62.5%
          </li>
          <li>
            <strong>2.0 GPA to percentage</strong> = 50%
          </li>
        </ul>
        <p>
          All values assume a 4.0 scale. If your GPA is on a different scale,
          use the calculator at the top and switch to the correct dropdown
          option.
        </p>

        <h2>Difference Between GPA, CGPA, and SGPA</h2>
        <p>
          These three terms cause a lot of confusion — especially for students
          moving between education systems. Here's the clean breakdown:
        </p>
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
                backgroundColor: "var(--card-bg, #0D2A5C)",
                color: "#fff",
                textAlign: "left",
              }}
            >
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                Term
              </th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                Full Form
              </th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                What It Measures
              </th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                Where It's Used
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                <strong>SGPA</strong>
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Semester Grade Point Average
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Performance in one semester only
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                India, Pakistan, Bangladesh
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                <strong>CGPA</strong>
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Cumulative Grade Point Average
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Weighted average of all semesters
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                India, South Asia, Middle East
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                <strong>GPA</strong>
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Grade Point Average
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Can be semester or cumulative
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                US, Canada, most global schools
              </td>
            </tr>
          </tbody>
        </table>
        <p>
          To calculate SGPA and CGPA from your subject grades, use our{" "}
          <Link className="my-link" href="/gpa-calculator/">
            <span className="hover-item">
              semester GPA calculator with credit hours
            </span>
          </Link>{" "}
          — then convert the result to percentage here.
        </p>

        <h2>Is 3.5 GPA Good? (And Other GPA Reality Checks)</h2>
        <p>
          A quick guide to what different GPA values actually mean in real
          admissions and job screening:
        </p>
        <ul className="custom-list">
          <li>
            <strong>3.9–4.0 GPA (≈ 97–100%)</strong> — Top of the class. Ivy
            League and top-20 competitive.
          </li>
          <li>
            <strong>3.5–3.8 GPA (≈ 87–95%)</strong> — Very strong. Dean's List,
            competitive for grad school and top employers.{" "}
            <strong>Yes, 3.5 GPA is good.</strong>
          </li>
          <li>
            <strong>3.0–3.4 GPA (≈ 75–85%)</strong> — Above average. Meets most
            grad school minimums and job-screening cutoffs.
          </li>
          <li>
            <strong>2.5–2.9 GPA (≈ 62–72%)</strong> — Average. Still passes most
            programs but limits scholarship access.
          </li>
          <li>
            <strong>2.0–2.4 GPA (≈ 50–60%)</strong> — Minimum passing. Often
            triggers academic probation review.
          </li>
          <li>
            <strong>Below 2.0 (below 50%)</strong> — At risk of dismissal at
            most universities.
          </li>
        </ul>

        <h2>Why You Need to Convert GPA to Percentage</h2>
        <ul className="custom-list">
          <li>
            <strong>Study abroad applications</strong> — UK, Australia, and
            European universities usually ask for percentages, not GPA
          </li>
          <li>
            <strong>Scholarships</strong> — many scholarship applications set
            percentage cutoffs (e.g., "80%+ required")
          </li>
          <li>
            <strong>Job applications</strong> — employers in India, Pakistan,
            and the Middle East expect percentage on your CV
          </li>
          <li>
            <strong>Credential evaluation</strong> — agencies like WES and ECE
            use standard conversions to validate foreign transcripts
          </li>
          <li>
            <strong>Graduate school</strong> — some GRE/GMAT and Master's
            applications ask for both GPA and percentage
          </li>
        </ul>

        <h2>Country-by-Country: Which System Do They Use?</h2>
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
                backgroundColor: "var(--card-bg, #0D2A5C)",
                color: "#fff",
                textAlign: "left",
              }}
            >
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                Country / Region
              </th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                Primary System
              </th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                Preferred on Applications
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                United States
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                4.0 GPA
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>GPA</td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Canada
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                4.0 GPA (some use 4.3)
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>GPA</td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                United Kingdom
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Percentage / Classification
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Percentage
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Australia
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                7-point GPA or Percentage
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Both
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                India
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                10-point CGPA
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Both (percentage often required)
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Pakistan
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                4.0 GPA or Percentage
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Both
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                UAE / Middle East
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Percentage
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Percentage
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Germany
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                1.0–5.0 (reversed scale)
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Local conversion
              </td>
            </tr>
          </tbody>
        </table>

        <h2>Common Mistakes When Converting GPA to Percentage</h2>
        <ul className="custom-list">
          <li>
            <strong>Using the wrong scale</strong> — a 3.5 on a 4.0 scale
            (87.5%) is very different from a 3.5 on a 5.0 scale (70%). Always
            confirm your scale.
          </li>
          <li>
            <strong>Applying the ×9.5 formula to a 4.0 GPA</strong> — this only
            works for 10-point CGPA, not for 4.0 GPA.
          </li>
          <li>
            <strong>Ignoring your institution's official conversion</strong> —
            some universities publish their own official chart. Use theirs when
            applying for admissions or transcripts.
          </li>
          <li>
            <strong>Rounding too aggressively</strong> — 3.47 GPA becomes
            86.75%, not 87% — small differences matter for scholarship cutoffs.
          </li>
        </ul>

        <h2>Why Use This Free GPA to Percentage Calculator</h2>
        <ul className="custom-list">
          <li>
            ✅ <strong>100% free</strong> — no login, no signup, no ads on the
            tool
          </li>
          <li>
            ✅ <strong>All three scales</strong> — 4.0, 5.0, and 10-point in one
            tool
          </li>
          <li>
            ✅ <strong>UGC-standard formula</strong> for CGPA (×9.5)
          </li>
          <li>
            ✅ <strong>Instant, live results</strong> as you type
          </li>
          <li>
            ✅ <strong>Works for GPA, CGPA, and SGPA</strong>
          </li>
          <li>
            ✅ <strong>Mobile-friendly</strong> — phone, tablet, laptop, all
            fine
          </li>
          <li>
            ✅ <strong>Grade classification</strong> included (Distinction,
            First Class, etc.)
          </li>
        </ul>

        <h2>Frequently Asked Questions</h2>

        {faqs.map(([q, a], i) => (
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

        <h2>Final Thoughts</h2>
        <p>
          Converting GPA to percentage isn't complicated once you know your
          scale — but the difference between 4.0, 5.0, and 10-point can
          completely change your number. Use this{" "}
          <strong>GPA to percentage calculator</strong> whenever you're filling
          out a study abroad application, scholarship form, or CV, and always
          double-check with the specific institution's official conversion
          policy.
        </p>
        <p>
          Need related tools? Try our{" "}
          <Link className="my-link" href="/gpa-calculator/">
            <span className="hover-item">semester GPA calculator</span>
          </Link>{" "}
          to compute your GPA from credits and grades, or the{" "}
          <Link className="my-link" href="/percentage-calculator/">
            <span className="hover-item">percentage calculator</span>
          </Link>{" "}
          for general percentage math.
        </p>
      </div>

      {/* ── SIDEBAR — UNCHANGED ── */}
      <aside className="sidebar">
        <div className="cr-desktop-slot">
          <GPAPctResultPanel result={panelResult} />
        </div>
        <div className="sidebar-box">
          <p style={{ fontSize: "20px", fontWeight: 600 }}>
            Related Calculators
          </p>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {[
              ["/time-calculator/", "Time Calculator"],
              ["/age-calculator/", "Age Calculator"],
              ["/days-between-calculator/", "Days Between Days"],
              ["/gpa-calculator/", "GPA Calculator"],
              ["/percentage-calculator/", "Percentage Calculator"],
              ["/unit-conversion-calculator/", "Unit Conversion"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href}>
                  <span
                    style={{ textDecoration: "none" }}
                    className="hover-item"
                  >
                    {label}
                  </span>
                </Link>
              </li>
            ))}
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
