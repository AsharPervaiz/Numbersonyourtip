"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

/* ─────────────────────────────────────────
   Grade points — UNTOUCHED
───────────────────────────────────────── */
const gradePoints: Record<string, number> = {
  A: 4,
  "A-": 3.7,
  "B+": 3.3,
  B: 3,
  C: 2,
  D: 1,
  F: 0,
};

/* ─────────────────────────────────────────
   Types
───────────────────────────────────────── */
interface GPAResult {
  gpa: number;
  totalCredits: number;
  totalPoints: number;
  subjectCount: number;
}

/* ─────────────────────────────────────────
   Pure helper
───────────────────────────────────────── */
function needleDeg(ratio: number): number {
  const clamped = Math.min(Math.max(ratio, 0), 1);
  return -90 + clamped * 180;
}

/* ─────────────────────────────────────────
   GPAResultPanel — UNCHANGED
───────────────────────────────────────── */
function GPAResultPanel({ result }: { result: GPAResult | null }) {
  if (!result) {
    return (
      <div className="cr-panel-placeholder">
        <div className="cr-ph-icon">
          <i className="fa-solid fa-graduation-cap" aria-hidden="true" />
        </div>
        Enter your subjects, credits and grades to see your GPA here.
      </div>
    );
  }

  const { gpa, totalCredits, totalPoints, subjectCount } = result;

  const ratio = Math.min(gpa / 4.0, 1);
  const barPct = 2 + ratio * 96;

  const gpaLabel =
    gpa === 0
      ? "No grade"
      : gpa < 1.0
        ? "Failing"
        : gpa < 2.0
          ? "Below average"
          : gpa < 2.5
            ? "Satisfactory"
            : gpa < 3.0
              ? "Average"
              : gpa < 3.5
                ? "Good"
                : gpa < 3.7
                  ? "Very good"
                  : gpa < 4.0
                    ? "Dean's List"
                    : "Perfect 4.0";

  const gpaBadge =
    gpa < 2.0
      ? "danger"
      : gpa < 2.5
        ? "warning"
        : gpa < 3.0
          ? "normal"
          : gpa < 3.5
            ? "normal"
            : "good";

  const tiers = [
    { label: "F (< 1.0)", threshold: 1.0, color: "#F09595" },
    { label: "D (1.0–1.9)", threshold: 2.0, color: "#FAC775" },
    { label: "C (2.0–2.9)", threshold: 3.0, color: "#C0DD97" },
    { label: "B (3.0–3.4)", threshold: 3.5, color: "#97C459" },
    { label: "A (3.5–4.0)", threshold: 4.0, color: "#5BA825" },
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
          aria-label={`GPA gauge: ${gpa.toFixed(2)} out of 4.0`}
        >
          <defs>
            <clipPath id="gpa-half">
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
            clipPath="url(#gpa-half)"
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
            clipPath="url(#gpa-half)"
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
            clipPath="url(#gpa-half)"
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
            clipPath="url(#gpa-half)"
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
          <div className="cr-score">{gpa.toFixed(2)}</div>
          <div className="cr-score-label">out of 4.0</div>
          <span className={`cr-badge ${gpaBadge}`}>{gpaLabel}</span>
        </div>
      </div>

      <hr className="cr-divider" />

      <div>
        <div className="cr-bar-label">GPA on 4.0 scale</div>
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
          <span>0.0</span>
          <span>1.0</span>
          <span>2.0</span>
          <span>3.0</span>
          <span>4.0</span>
        </div>
      </div>

      <hr className="cr-divider" />

      <div className="cr-metrics-grid">
        <div className="cr-metric-card">
          <div className="cr-m-label">Semester GPA</div>
          <div className="cr-m-value">{gpa.toFixed(2)}</div>
          <div className="cr-m-sub">out of 4.0</div>
        </div>
        <div className="cr-metric-card">
          <div className="cr-m-label">Total credits</div>
          <div className="cr-m-value">{totalCredits}</div>
          <div className="cr-m-sub">credit hours</div>
        </div>
        <div className="cr-metric-card">
          <div className="cr-m-label">Quality points</div>
          <div className="cr-m-value">{totalPoints.toFixed(1)}</div>
          <div className="cr-m-sub">weighted total</div>
        </div>
        <div className="cr-metric-card">
          <div className="cr-m-label">Subjects</div>
          <div className="cr-m-value">{subjectCount}</div>
          <div className="cr-m-sub">courses entered</div>
        </div>
      </div>

      <hr className="cr-divider" />

      <div>
        <div className="cr-world-title">GPA tier reference</div>
        {tiers.map(({ label, threshold, color }, idx) => {
          const low = idx === 0 ? 0 : tiers[idx - 1].threshold;
          const range = threshold - low;
          const filled = Math.min(Math.max(gpa - low, 0), range);
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
          {gpa >= 3.5
            ? `GPA of ${gpa.toFixed(2)} qualifies for Dean's List at most institutions.`
            : gpa >= 3.0
              ? `GPA of ${gpa.toFixed(2)} is above average — on track for most grad school requirements.`
              : gpa >= 2.0
                ? `GPA of ${gpa.toFixed(2)} meets minimum passing — aim for 3.0+ to stay competitive.`
                : `GPA of ${gpa.toFixed(2)} — academic standing at risk. Focus on high-credit courses.`}
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Main Calculator Page
───────────────────────────────────────── */
export default function GPACalculator() {
  const [subjects, setSubjects] = useState([{ credit: "", grade: "A" }]);
  const [gpa, setGpa] = useState<number | null>(null);
  const [gradeOpen, setGradeOpen] = useState(subjects.map(() => false));
  const [panelResult, setPanelResult] = useState<GPAResult | null>(null);

  useEffect(() => {
    setGradeOpen(subjects.map(() => false));
  }, [subjects.length]);

  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const toggleFAQ = (index: number) =>
    setOpenFAQ(openFAQ === index ? null : index);

  const addSubject = () => {
    setSubjects([...subjects, { credit: "", grade: "A" }]);
  };

  const compute = (subs: typeof subjects): GPAResult | null => {
    let totalCredits = 0;
    let totalPoints = 0;
    let subjectCount = 0;

    subs.forEach((s) => {
      const credit = Number(s.credit);
      if (!credit) return;
      totalCredits += credit;
      totalPoints += credit * gradePoints[s.grade];
      subjectCount++;
    });

    if (totalCredits === 0) return null;
    return {
      gpa: Number((totalPoints / totalCredits).toFixed(2)),
      totalCredits,
      totalPoints,
      subjectCount,
    };
  };

  useEffect(() => {
    setPanelResult(compute(subjects));
  }, [subjects]);

  const calculateGPA = () => {
    let totalCredits = 0;
    let totalPoints = 0;

    subjects.forEach((s) => {
      const credit = Number(s.credit);
      if (!credit) return;
      totalCredits += credit;
      totalPoints += credit * gradePoints[s.grade];
    });

    if (totalCredits === 0) return;
    setGpa(Number((totalPoints / totalCredits).toFixed(2)));
  };

  const handleClear = () => {
    setSubjects([{ credit: "", grade: "A" }]);
    setGpa(null);
    setPanelResult(null);
  };

  /* ── FAQ data (also used for JSON-LD schema) ── */
  const faqs: [string, string][] = [
    [
      "How do I calculate my semester GPA?",
      "Multiply each course's grade points by its credit hours, add all the results together, then divide by the total credit hours attempted that semester. Example: an A (4.0) in a 3-credit course and a B (3.0) in a 3-credit course = (4.0×3 + 3.0×3) ÷ 6 = 3.5 GPA.",
    ],
    [
      "What is the difference between semester GPA and cumulative GPA?",
      "Semester GPA covers grades from one term only. Cumulative GPA is the weighted average of all semesters combined. Cumulative GPA = (Total quality points from all semesters) ÷ (Total credit hours from all semesters).",
    ],
    [
      "How many A's do I need to raise my GPA?",
      "Use this shortcut: Required GPA next semester = ((Target GPA × total credits after next semester) − (current GPA × current credits)) ÷ credits next semester. Our target GPA formula section above walks through the exact numbers.",
    ],
    [
      "What is a good GPA in college?",
      "A GPA of 3.0 or higher (B average) is considered good. A GPA of 3.5+ typically qualifies for Dean's List and is competitive for grad school. Below 2.0 usually triggers academic probation.",
    ],
    [
      "What's the difference between weighted and unweighted GPA?",
      "Unweighted GPA uses a straight 4.0 scale regardless of course difficulty. Weighted GPA gives extra points (typically +0.5 or +1.0) for honors, AP, or IB courses, so a weighted GPA can go above 4.0 — often up to 5.0.",
    ],
    [
      "Does this GPA calculator support credit hours?",
      "Yes, it's a fully weighted GPA calculator with credit hours. Each course's credit value is factored into the final result, just like on your official transcript.",
    ],
    [
      "Can I use this to calculate high school GPA?",
      "Yes. Enter your courses and use the number of credits your high school assigns (usually 1 credit per full-year course, 0.5 per semester course). For weighted GPA with honors or AP, add 1.0 to the grade point value before entering.",
    ],
    [
      "What is CGPA and how is it different from GPA?",
      "CGPA (Cumulative Grade Point Average) is the same concept as cumulative GPA — the weighted average of all semesters. The term CGPA is widely used in India, Pakistan, Bangladesh, and other South Asian countries; GPA is the standard term in the US.",
    ],
    [
      "What is a 3.5 GPA in percentage?",
      "A 3.5 GPA on a 4.0 scale typically converts to roughly 87–89% (B+/A− range). Exact conversion depends on your school's scale — use our GPA to percentage calculator for the accurate number.",
    ],
    [
      "How many subjects can I add to this calculator?",
      "There's no limit. Click '+ Add Subject' as many times as you need. The calculator handles any number of courses and credit combinations accurately.",
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

        <h1>GPA Calculator — Semester &amp; College GPA with Credit Hours</h1>

        <p>
          Free <strong>college GPA calculator</strong> with credit hours and
          letter grades. Instantly calculate your <strong>semester GPA</strong>{" "}
          on the 4.0 scale — perfect for college students, high schoolers, and
          anyone tracking academic progress.
        </p>

        <div className="calc-card single-calc">
          {subjects.map((s, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: "10px",
                marginBottom: "10px",
                width: "100%",
              }}
            >
              <input
                className="calc-input"
                type="number"
                placeholder="Credits"
                value={s.credit}
                onChange={(e) => {
                  const updated = [...subjects];
                  updated[i].credit = e.target.value;
                  setSubjects(updated);
                }}
                style={{ flex: "1 1 50%" }}
              />

              <div style={{ flex: "1 1 50%", position: "relative" }}>
                <div
                  className="modern-dropdown"
                  style={{ width: "100%" }}
                  onClick={() => {
                    const newOpen = [...gradeOpen];
                    newOpen[i] = !newOpen[i];
                    setGradeOpen(newOpen);
                  }}
                >
                  {s.grade.toUpperCase()}
                  <span className="dropdown-indicator">▼</span>

                  {gradeOpen[i] && (
                    <ul className="dropdown-list">
                      {Object.keys(gradePoints).map((g) => (
                        <li
                          key={g}
                          onClick={(e) => {
                            e.stopPropagation();
                            const updated = [...subjects];
                            updated[i].grade = g;
                            setSubjects(updated);
                            const newOpen = [...gradeOpen];
                            newOpen[i] = false;
                            setGradeOpen(newOpen);
                          }}
                        >
                          {g.toUpperCase()}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          ))}

          <div style={{ marginBottom: "10px" }}>
            <button
              className="calc-button"
              onClick={addSubject}
              style={{
                width: "100%",
                color: "#202020",
                backgroundColor: "#1f9fb8",
                fontWeight: "400",
                border: "1px solid #e2e2e2ba",
                borderRadius: "2px",
              }}
            >
              + Add Subject
            </button>
          </div>

          <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
            <button className="calc-button" onClick={calculateGPA}>
              Calculate GPA
            </button>
            <button className="calc-button calc-clear" onClick={handleClear}>
              Clear
            </button>
          </div>
        </div>

        <div className="cr-mobile-slot">
          <GPAResultPanel result={panelResult} />
        </div>

        {/* ── SEO CONTENT — REWRITTEN ── */}

        <h2>What Is GPA and Why Does It Matter?</h2>
        <p>
          Your <strong>GPA (Grade Point Average)</strong> is the single number
          that summarises your academic performance. Universities read it on
          transcripts. Scholarship committees screen with it. Employers ask for
          it. Whether you're aiming for Dean's List, a graduate program, or just
          trying to stay off academic probation, knowing your GPA — and how to
          move it — is one of the most useful things you can do as a student.
        </p>
        <p>
          This <strong>semester GPA calculator</strong> works on the standard
          4.0 scale, factors in credit hours, handles as many subjects as you
          throw at it, and shows results the moment you type. Below we break
          down exactly how the math works, how to raise your GPA, and how it
          compares across systems (CGPA, weighted, unweighted).
        </p>

        <h2>How to Calculate GPA — The Formula (With Example)</h2>
        <p>The standard GPA formula on the 4.0 scale is:</p>
        <div>
          GPA = Σ (Grade Points × Credit Hours) ÷ Σ (Total Credit Hours)
        </div>
        <p>
          <strong>Step-by-step:</strong>
        </p>
        <ol className="custom-list">
          <li>
            Convert each letter grade to grade points (A = 4.0, B = 3.0, etc.).
          </li>
          <li>
            Multiply grade points by the course's credit hours — this gives you{" "}
            <strong>quality points</strong>.
          </li>
          <li>Add up all the quality points from every course.</li>
          <li>Divide the total quality points by the total credit hours.</li>
        </ol>

        <p>
          <strong>Worked example — 5 courses, one semester:</strong>
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
                Course
              </th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                Grade
              </th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                Grade Points
              </th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                Credit Hours
              </th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                Quality Points
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                English 101
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>A</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>4.0</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>3</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                12.0
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Calculus I
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>B+</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>3.3</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>4</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                13.2
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Chemistry
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>B</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>3.0</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>4</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                12.0
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                History
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>A−</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>3.7</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>3</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                11.1
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Elective
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>C</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>2.0</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>2</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>4.0</td>
            </tr>
            <tr>
              <td
                colSpan={3}
                style={{ padding: "10px", border: "1px solid #ddd" }}
              >
                <strong>Totals</strong>
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                <strong>16</strong>
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                <strong>52.3</strong>
              </td>
            </tr>
          </tbody>
        </table>
        <p>
          <strong>Semester GPA = 52.3 ÷ 16 = 3.27</strong> on the 4.0 scale — a
          solid "Good" range. Our <strong>free semester GPA calculator</strong>{" "}
          does this same math instantly the moment you enter your credits and
          grades above.
        </p>

        <h2>Letter Grade to GPA — 4.0 Scale Conversion Chart</h2>
        <p>
          Most U.S. colleges and universities use this standard letter grade to
          GPA conversion. Some schools include B−, C+, and C− for more
          granularity — check your registrar's official policy.
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
                Letter Grade
              </th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                Percentage
              </th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                Grade Points (4.0 scale)
              </th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                Meaning
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>A</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                93–100%
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>4.0</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Excellent
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>A−</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                90–92%
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>3.7</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Excellent
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>B+</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                87–89%
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>3.3</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Very good
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>B</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                83–86%
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>3.0</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Good
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>B−</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                80–82%
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>2.7</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Above average
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>C+</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                77–79%
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>2.3</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Average
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>C</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                73–76%
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>2.0</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Satisfactory
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>D</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                65–69%
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>1.0</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Passing
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>F</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Below 65%
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>0.0</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Failing
              </td>
            </tr>
          </tbody>
        </table>
        <p>
          Need the reverse conversion? Try our{" "}
          <Link className="my-link" href="/gpa-percentage/">
            <span className="hover-item">GPA to percentage calculator</span>
          </Link>{" "}
          for exact percentage equivalents.
        </p>

        <h2>How to Use This College GPA Calculator</h2>
        <ol className="custom-list">
          <li>
            Enter the <strong>credit hours</strong> for your first course
            (usually 1–5).
          </li>
          <li>
            Pick the <strong>letter grade</strong> you earned (or expect) from
            the dropdown.
          </li>
          <li>
            Click <strong>+ Add Subject</strong> for each additional course.
          </li>
          <li>
            Hit <strong>Calculate GPA</strong> — or watch the result panel
            update automatically.
          </li>
        </ol>
        <p>
          The result shows your GPA on the 4.0 scale, total credits, total
          quality points, and where you land on the GPA tier reference (F → A).
        </p>

        <h2>Cumulative GPA Calculator — Across Multiple Semesters</h2>
        <p>
          Your <strong>cumulative GPA (CGPA)</strong> is the weighted average of
          every semester you've completed. It's not just the average of your
          semester GPAs — heavier semesters (more credit hours) pull harder.
        </p>
        <p>
          <strong>Formula:</strong>
        </p>
        <div>
          Cumulative GPA = Total quality points across all semesters ÷ Total
          credit hours across all semesters
        </div>
        <p>
          <strong>Example — three semesters:</strong>
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
                Semester
              </th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>GPA</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                Credits
              </th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                Quality Points
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Fall Year 1
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                3.20
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>15</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                48.0
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Spring Year 1
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                3.50
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>16</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                56.0
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Fall Year 2
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                3.70
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>15</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                55.5
              </td>
            </tr>
            <tr>
              <td
                colSpan={2}
                style={{ padding: "10px", border: "1px solid #ddd" }}
              >
                <strong>Totals</strong>
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                <strong>46</strong>
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                <strong>159.5</strong>
              </td>
            </tr>
          </tbody>
        </table>
        <p>
          <strong>Cumulative GPA = 159.5 ÷ 46 = 3.47.</strong> To calculate CGPA
          in this tool, enter every course from every semester at once — the
          math is identical.
        </p>

        <h2>Weighted vs Unweighted GPA (High School GPA Explained)</h2>
        <p>
          High school GPAs come in two flavours, and they're not
          interchangeable:
        </p>
        <ul className="custom-list">
          <li>
            <strong>Unweighted GPA</strong> — uses the straight 4.0 scale for
            every class. An A is 4.0 whether it's regular English or AP Physics.
            Max = 4.0.
          </li>
          <li>
            <strong>Weighted GPA</strong> — adds bonus points for harder
            courses. Honors classes typically add +0.5, AP and IB classes add
            +1.0. Max = usually 5.0, sometimes higher.
          </li>
        </ul>
        <p>
          <strong>Quick weighted example:</strong> an A in AP Calculus counts as
          5.0 (4.0 + 1.0 AP bonus), while an A in regular Calculus counts as
          4.0. This is why weighted GPAs can exceed 4.0 and why colleges
          recalculate them using their own formula during admissions.
        </p>
        <p>
          To use this as a <strong>GPA calculator for high school</strong>:
          enter each class's credit value (usually 1.0 for a full-year course or
          0.5 for a semester course), and for weighted GPA, mentally bump the
          grade up one step for honors classes and two for AP/IB.
        </p>

        <h2>How Many A's Do I Need to Raise My GPA?</h2>

        <div>
          Required GPA next term = (Target GPA × (current credits + next-term
          credits)) − (Current GPA × current credits) ÷ next-term credits
        </div>
        <p>
          <strong>Example:</strong>
        </p>
        <ul className="custom-list">
          <li>
            Current GPA: <strong>2.8</strong>
          </li>
          <li>
            Current credits earned: <strong>60</strong>
          </li>
          <li>
            Target cumulative GPA: <strong>3.0</strong>
          </li>
          <li>
            Next semester: <strong>15 credits</strong>
          </li>
        </ul>
        <p>
          Required GPA next semester = ((3.0 × 75) − (2.8 × 60)) ÷ 15 = (225 −
          168) ÷ 15 = <strong>3.80</strong>.
        </p>
        <p>
          Translation: to move from a 2.8 to a 3.0 cumulative in one semester,
          you'd need to earn a 3.80 GPA next term. If you can't hit that in one
          semester, spread the improvement over two — the same formula works for
          a wider window.
        </p>

        <h2>Target GPA Calculator — Working Backwards From Your Goal</h2>
        <p>
          You can also flip the question. If you know the GPA you're targeting
          for grad school or a scholarship, use this tool to test course-load
          scenarios:
        </p>
        <ol className="custom-list">
          <li>
            Enter every course you've already completed (with real credits and
            real grades).
          </li>
          <li>
            Then add hypothetical future courses with the grades you{" "}
            <em>plan</em> to earn.
          </li>
          <li>
            Watch the panel update — if the projected GPA hits your target, your
            plan is realistic. If it doesn't, adjust upward.
          </li>
        </ol>
        <p>
          For percentage-based goals (some scholarships list requirements as %,
          not GPA), pair this with our{" "}
          <Link className="my-link" href="/percentage-calculator/">
            <span className="hover-item">percentage calculator</span>
          </Link>{" "}
          to translate quickly.
        </p>

        <h2>GPA vs CGPA — What's the Difference?</h2>
        <p>
          <strong>GPA</strong> and <strong>CGPA</strong> refer to the same
          concept but come from different systems:
        </p>
        <ul className="custom-list">
          <li>
            <strong>GPA</strong> — Grade Point Average. Used mostly in the US.
            Can refer to semester or cumulative.
          </li>
          <li>
            <strong>CGPA</strong> — Cumulative Grade Point Average. Standard
            term in India, Pakistan, Bangladesh, and much of South Asia. Some
            CBSE schools in India use a 10-point CGPA scale instead of 4.0.
          </li>
        </ul>
        <p>
          If you're on a 10-point CGPA scale, a rough conversion is:{" "}
          <em>GPA (4.0) ≈ CGPA (10) × 0.4</em>. So a 9.0 CGPA ≈ 3.6 GPA. Always
          verify with your institution — official conversions vary.
        </p>

        <h2>What Is a Good GPA in College? (Latin Honors Reference)</h2>
        <p>
          "Good" depends on your goal, but here's the general framework used at
          most U.S. institutions:
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
                GPA Range
              </th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                Standing
              </th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                Typical Recognition
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                3.90 – 4.00
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Outstanding
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Summa Cum Laude
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                3.70 – 3.89
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Excellent
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Magna Cum Laude / Dean's List
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                3.50 – 3.69
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Very good
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Cum Laude / Dean's List
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                3.00 – 3.49
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Above average
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Good standing
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                2.00 – 2.99
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Satisfactory
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Good standing (minimum)
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Below 2.00
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                At risk
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Academic probation
              </td>
            </tr>
          </tbody>
        </table>
        <p>
          For grad school, most competitive programs expect{" "}
          <strong>3.5+</strong>. Medical school and top law schools typically
          want <strong>3.7+</strong>. Employers who screen by GPA usually set
          the floor at 3.0.
        </p>

        <h2>Practical Tips to Raise Your Semester GPA</h2>
        <ul className="custom-list">
          <li>
            <strong>Target high-credit courses first</strong> — a jump from B to
            A in a 4-credit class moves your GPA far more than the same jump in
            a 1-credit elective.
          </li>
          <li>
            <strong>Ask for help before midterms, not after</strong> — office
            hours, tutoring, and study groups have the highest ROI in the first
            4–6 weeks of a semester.
          </li>
          <li>
            <strong>Read the grading rubric on day one</strong> — knowing
            whether a class is 40% exams or 40% papers changes how you budget
            your study time.
          </li>
          <li>
            <strong>Don't stack all your hard courses in one term</strong> —
            spread STEM, writing-heavy, and lab-heavy courses across semesters.
          </li>
          <li>
            <strong>Consider retaking a failing grade</strong> — many schools
            replace F grades with the retake, which can lift your GPA
            significantly.
          </li>
          <li>
            <strong>Use this calculator as a mid-semester check</strong> — enter
            your current grades and see the projected GPA before it's too late
            to adjust.
          </li>
          <li>
            <strong>Track deadlines with a schedule tool</strong> — you can use
            our{" "}
            <Link className="my-link" href="/time-calculator/">
              <span className="hover-item">time calculator</span>
            </Link>{" "}
            or{" "}
            <Link className="my-link" href="/days-between-calculator/">
              <span className="hover-item">days between dates</span>
            </Link>{" "}
            to plan study blocks around exam windows.
          </li>
        </ul>

        <h2>Why Use This Free GPA Calculator</h2>
        <ul className="custom-list">
          <li>
            ✅ <strong>100% free</strong> — no signup, no ads on the tool, no
            download
          </li>
          <li>
            ✅ <strong>Credit-hour weighted</strong> — exactly how your
            transcript is calculated
          </li>
          <li>
            ✅ <strong>Unlimited courses</strong> — add as many subjects as your
            semester needs
          </li>
          <li>
            ✅ <strong>Standard 4.0 scale</strong> used by U.S. colleges and
            universities
          </li>
          <li>
            ✅ <strong>Works for high school, college, and CGPA</strong> — the
            math is the same
          </li>
          <li>
            ✅ <strong>Live results</strong> — the panel updates as you type, no
            button-clicking required
          </li>
          <li>
            ✅ <strong>Mobile-friendly</strong> — works cleanly on phone,
            tablet, and desktop
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
          Your GPA is a number you can absolutely move — but only if you know
          exactly where you stand and what it will take to get where you want.
          Use this{" "}
          <strong>
            free college GPA calculator with credit hours and letter grades
          </strong>{" "}
          at the start of every semester to set a target, again mid-semester to
          check your trajectory, and once more at the end to lock in your
          cumulative GPA.
        </p>
        <p>
          Once you have your GPA, convert it to a percentage with our{" "}
          <Link className="my-link" href="/gpa-percentage/">
            <span className="hover-item">GPA to percentage calculator</span>
          </Link>
          , or explore related tools like our{" "}
          <Link className="my-link" href="/percentage-calculator/">
            <span className="hover-item">percentage calculator</span>
          </Link>{" "}
          and{" "}
          <Link className="my-link" href="/age-calculator/">
            <span className="hover-item">age calculator</span>
          </Link>
          .
        </p>
      </div>

      {/* ── SIDEBAR — UNCHANGED ── */}
      <aside className="sidebar">
        <div className="cr-desktop-slot">
          <GPAResultPanel result={panelResult} />
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
              ["/gpa-percentage/", "GPA Percentage"],
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
