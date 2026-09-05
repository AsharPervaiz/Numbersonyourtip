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
      "What is 4.2 GPA in percentage?",
      "Not 105%, which is what the usual multiplier of 25 produces and is the giveaway that the wrong scale has been used. A GPA above 4.0 comes from a weighted scale, normally out of 5.0, so 4.2 ÷ 5.0 × 100 = 84%. A percentage above 100 always means the scale maximum was wrong, not that the result is exceptional.",
    ],
    [
      "What is 3.4 GPA in percentage?",
      "On an unweighted 4.0 scale, 3.4 × 25 = 85%, which is roughly a B+. On a 5.0 weighted scale the same 3.4 is 68%. Both are arithmetically correct and only one matches your transcript, so identify the scale maximum before converting anything.",
    ],
    [
      "What is 3.9 GPA in percentage?",
      "97.5% on a 4.0 scale, since 3.9 × 25 = 97.5. That sits at the top of the A band. On a 5.0 weighted scale the same figure would be 78%, which is a good illustration of why the scale matters more than the number.",
    ],
    [
      "What is 2.5 GPA in percentage?",
      "62.5% on a 4.0 scale, which is around a B− or C+ depending on the institution's letter bands. On a 5.0 scale it converts to 50%. If you are checking against an entry requirement, use whichever scale your transcript is issued on.",
    ],
    [
      "Is there one formula for converting GPA to percentage?",
      "There is one general method — divide your GPA by the scale maximum and multiply by 100 — but no single universal multiplier, because scales differ. Multiplying by 25 is that formula with a maximum of 4.0 already substituted in, which is why it breaks on any other scale. Where an institution publishes its own conversion, that published rule overrides the arithmetic.",
    ],
    [
      "Why is CGPA multiplied by 9.5 instead of 10?",
      "Because the 10-point scale used by Indian school boards was calibrated against an observed relationship between grade points and marks rather than as a straight proportion, and 9.5 is the multiplier published for it. A CGPA of 8.0 therefore converts to 76%, not 80%. Some universities publish different rules again, so check whether yours specifies a method before using the general one.",
    ],
    [
      "What is the difference between GPA, CGPA and SGPA?",
      "SGPA covers a single semester and moves considerably term to term. CGPA covers everything completed so far, weighted by credit hours, so it moves slowly. GPA is used for either meaning depending on the country, which is why an application asking for your GPA is worth clarifying. Averaging semester figures only gives a correct cumulative result when every semester carried identical credits.",
    ],
    [
      "Should I put a converted percentage on a university application?",
      "Usually not. Submit the transcript as issued and let the institution apply its own conversion policy, since a self-converted figure that disagrees with theirs creates a discrepancy on your file. For study abroad, many institutions require an official credential evaluation that applies country-specific equivalences rather than arithmetic, and that assessment supersedes any calculator.",
    ],
    [
      "Can two students with the same weighted GPA have different records?",
      "Yes, and it is common. Each school decides which courses carry extra weight and by how much, so a 4.2 from one school and a 4.2 from another are not directly comparable. This is why many universities recalculate an unweighted GPA from the transcript rather than using the reported number.",
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

        <h1>GPA to Percentage Calculator — 4.0, 5.0 and 10-Point Scales</h1>

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

        {/* ── SEO CONTENT ── */}

        <h2>There Is No Single GPA-to-Percentage Formula</h2>
        <p>
          This is the part most conversion pages skip, and it decides whether
          your answer is usable. A grade point average is a position on a scale,
          and converting it to a percentage requires knowing which scale it came
          from. The same number means different things on different systems.
        </p>
        <p>
          A GPA of 3.4 is 85% on an unweighted 4.0 scale and 68% on a 5.0
          weighted scale. Both conversions are arithmetically correct. Only one
          of them describes your transcript.
        </p>
        <pre>Percentage = (Your GPA ÷ Scale maximum) × 100</pre>
        <p>
          Everything else on this page follows from that single expression. The
          familiar shortcut of multiplying by 25 is just this formula with a
          maximum of 4.0 substituted in, which is why it produces nonsense the
          moment your scale is anything else.
        </p>

        <h2>First, Identify Your Scale</h2>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Scale</th>
                <th>Maximum</th>
                <th>Multiply your GPA by</th>
                <th>Where you will meet it</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Unweighted 4.0</td>
                <td>4.0</td>
                <td>25</td>
                <td>Most United States institutions</td>
              </tr>
              <tr>
                <td>Extended 4.3</td>
                <td>4.3</td>
                <td>23.26</td>
                <td>Systems awarding an A+ above 4.0</td>
              </tr>
              <tr>
                <td>Weighted 5.0</td>
                <td>5.0</td>
                <td>20</td>
                <td>High schools weighting honours and advanced courses</td>
              </tr>
              <tr>
                <td>10-point CGPA</td>
                <td>10.0</td>
                <td>9.5 by convention</td>
                <td>Indian school boards and many universities</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          The last row is the exception to the general formula. A strict
          proportional conversion would multiply by 10, but the widely used
          convention multiplies by 9.5 instead, because the scale was designed
          against an observed relationship between grade points and marks rather
          than as a straight proportion. Where an institution specifies 9.5, use
          9.5 — the formula does not override a published rule.
        </p>

        <h2>GPA to Percentage Table — 4.0 Scale</h2>
        <p>
          Every tenth of a point from 1.0 to 4.0, using the standard
          multiplier of 25. Find your GPA in the first column.
        </p>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>GPA</th>
                <th>Percentage</th>
                <th>Typical letter</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 31 }, (_, i) => {
                const gpa = 4.0 - i * 0.1;
                const g = Math.round(gpa * 10) / 10;
                const pct = Math.round(g * 25 * 10) / 10;
                const letter =
                  g >= 3.85
                    ? "A"
                    : g >= 3.5
                      ? "A−"
                      : g >= 3.15
                        ? "B+"
                        : g >= 2.85
                          ? "B"
                          : g >= 2.5
                            ? "B−"
                            : g >= 2.15
                              ? "C+"
                              : g >= 1.85
                                ? "C"
                                : g >= 1.5
                                  ? "C−"
                                  : g >= 1.15
                                    ? "D+"
                                    : "D";
                return (
                  <tr key={g}>
                    <td>
                      <strong>{g.toFixed(1)}</strong>
                    </td>
                    <td>{pct}%</td>
                    <td>{letter}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p>
          Values between rows convert the same way — a 3.47 GPA is 3.47 × 25 =
          86.75%, which rounds to roughly 87%.
        </p>

        <h2>What a GPA Above 4.0 Actually Means</h2>
        <p>
          A reported GPA of 4.2 or 4.5 is one of the most common sources of a
          wrong conversion, because applying the usual multiplier of 25 gives
          105% or 112.5%. A percentage above 100 is a signal that the wrong
          scale maximum has been used, not a remarkable achievement.
        </p>
        <p>
          Averages above 4.0 come from weighted scales, where advanced,
          honours or college-level courses are worth extra grade points. The
          maximum is typically 5.0, and occasionally higher.
        </p>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Reported GPA</th>
                <th>On a 5.0 weighted scale</th>
                <th>If wrongly treated as 4.0 scale</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>4.1</td>
                <td>82%</td>
                <td>102.5% — impossible</td>
              </tr>
              <tr>
                <td>4.2</td>
                <td>84%</td>
                <td>105% — impossible</td>
              </tr>
              <tr>
                <td>4.3</td>
                <td>86%</td>
                <td>107.5% — impossible</td>
              </tr>
              <tr>
                <td>4.5</td>
                <td>90%</td>
                <td>112.5% — impossible</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          Weighted averages are also not comparable between schools, because
          each institution decides which courses are weighted and by how much. A
          4.2 from one school and a 4.2 from another can represent noticeably
          different records, which is why many universities recalculate an
          unweighted GPA from the transcript rather than accepting the reported
          figure.
        </p>

        <h2>CGPA to Percentage — 10-Point Scale</h2>
        <p>
          Using the 9.5 multiplier applied by Indian school boards and adopted
          widely by universities.
        </p>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>CGPA</th>
                <th>Percentage (× 9.5)</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 11 }, (_, i) => {
                const c = Math.round((10 - i * 0.5) * 10) / 10;
                return (
                  <tr key={c}>
                    <td>
                      <strong>{c.toFixed(1)}</strong>
                    </td>
                    <td>{Math.round(c * 9.5 * 10) / 10}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p>
          Some universities publish their own conversion instead, occasionally
          subtracting a fixed amount from the CGPA before multiplying, or using
          a stepped table rather than a formula. Where a rule is published, that
          rule is the correct answer regardless of what any general calculator
          produces.
        </p>

        <h2>GPA, CGPA and SGPA Are Not Interchangeable</h2>
        <ul className="custom-list">
          <li>
            <strong>SGPA</strong> covers a single semester. It moves
            considerably from term to term and describes a snapshot.
          </li>
          <li>
            <strong>CGPA</strong> covers everything completed so far, weighted
            by credit hours. It moves slowly, because each new semester is a
            small share of the total.
          </li>
          <li>
            <strong>GPA</strong> is used for both meanings depending on the
            country, which is why an application asking for &quot;your GPA&quot;
            is worth clarifying.
          </li>
        </ul>
        <p>
          Averaging your semester figures to obtain a cumulative one is only
          correct when every semester carried identical credits. Otherwise the
          cumulative average must be weighted by credit hours — our{" "}
          <Link href="/gpa-calculator/" className="my-link">
            GPA calculator
          </Link>{" "}
          does that weighting for you.
        </p>

        <h2>When an Application Asks for a Percentage</h2>
        <p>
          A converted figure is an estimate, and how much that matters depends
          entirely on who is reading it.
        </p>
        <ul className="custom-list">
          <li>
            <strong>For a rough self-assessment</strong> — checking whether you
            are near an entry threshold — a conversion is fine and this page
            answers it.
          </li>
          <li>
            <strong>For a formal application</strong>, submit the transcript as
            issued and let the institution convert. Most have their own policy,
            and a self-converted number that disagrees with theirs creates a
            discrepancy on your file.
          </li>
          <li>
            <strong>For study or work abroad</strong>, many institutions require
            an official credential evaluation, which applies country-specific
            equivalences rather than arithmetic. That assessment supersedes any
            calculator.
          </li>
          <li>
            <strong>If a form insists on a number</strong>, use the conversion
            your own institution publishes, and say which method you used. A
            stated method is defensible; an unexplained figure is not.
          </li>
        </ul>
        <p>
          To work out a GPA from individual course grades in the first place,
          the{" "}
          <Link href="/gpa-calculator/" className="my-link">
            GPA calculator
          </Link>{" "}
          handles credit weighting, and the{" "}
          <Link href="/percentage-calculator/" className="my-link">
            percentage calculator
          </Link>{" "}
          covers general percentage arithmetic.
        </p>
        <h2>GPA Conversion Questions</h2>

        {faqs.map(([q, a], i) => {
          const isOpen = openFAQ === i;
          return (
            <div className="faq-item" key={i}>
              <h3
                onClick={() => toggleFAQ(i)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleFAQ(i);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${i}`}
              >
                {q}
                <i
                  className={`fa-solid fa-chevron-down ${isOpen ? "rotate" : ""}`}
                  aria-hidden="true"
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
