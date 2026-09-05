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
      "How is GPA calculated?",
      "Multiply each course's grade points by its credits to get quality points, add those up, and divide by the total credits. A semester of A (4 credits), B (3), B+ (3) and C (1) gives 36.9 quality points over 11 credits, so a GPA of 3.35. Averaging the four grade points directly gives 3.08, which is wrong because it ignores the credit weighting the system is built on.",
    ],
    [
      "Why does averaging my grades give a different answer?",
      "Because courses carry different credit weights. A plain average lets a one-credit elective count as much as a four-credit science course, when the formula intends it to count a quarter as much. Whether the naive average is too high or too low depends on where your strong grades sit — heavy courses done well pull the true GPA above it.",
    ],
    [
      "How do pass or fail courses affect my GPA?",
      "Usually not at all. They typically carry credits toward graduation without contributing quality points, so they are excluded from both the numerator and the denominator. Entering a pass as 0.0 grade points is a real and damaging data-entry error, since it treats a successful course as a failure.",
    ],
    [
      "Why is my cumulative GPA so hard to move?",
      "Because each new semester is averaged against everything before it. A student with 30 credits at 2.80 who takes 15 credits at 4.00 reaches 3.20 — a 0.40 rise. The same perfect semester with 90 credits already behind them yields only 2.97, a rise of 0.17. The base grows every term, so early grades affect the final figure more than later ones.",
    ],
    [
      "What GPA do I need next semester to reach my target?",
      "Multiply your target by your total credits after the semester, subtract the quality points you already hold, and divide by the upcoming credits. Someone with 60 credits at 3.10 wanting 3.30 after 15 more needs 61.5 quality points from those credits — a semester GPA of 4.10. Above the maximum, which means the target is not reachable in one term rather than that it needs more effort.",
    ],
    [
      "What is the difference between weighted and unweighted GPA?",
      "A weighted GPA awards extra grade points for advanced, honours or college-level courses, so an A might count as 5.0 rather than 4.0 and averages can exceed 4.0. Unweighted treats every course identically. Weighted figures are not comparable between schools, since each decides which courses are weighted and by how much, which is why many universities recalculate an unweighted GPA from the transcript.",
    ],
    [
      "Does an A+ count as more than an A?",
      "It depends on the institution. Some award 4.3 for an A+ while others cap at 4.0, which changes the maximum attainable GPA and therefore what a given figure means. Check your own handbook rather than assuming, since the same transcript can produce different GPAs under different mappings.",
    ],
    [
      "How do I calculate GPA across several semesters?",
      "Use the same formula over every course you have ever taken — all quality points divided by all credits. Averaging your semester GPAs together only gives the right answer when each semester carried identical credits, which is rarely true once part-time terms, summer courses or dropped modules are involved.",
    ],
    [
      "Can I recover from a bad first year?",
      "Yes, but it takes more credits of strong work than most people expect, because the early grades sit in the denominator of everything that follows. Running the target calculation above turns that from anxiety into a number — it will tell you either how many strong semesters are required, or that a particular target is not attainable, which is useful either way.",
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

        {/* ---- SEO CONTENT ---- */}

        <h2>A Plain Average of Your Grades Is the Wrong Answer</h2>
        <p>
          The single thing that makes GPA calculation non-obvious is that
          courses are not equal. A four-credit course counts twice as much as a
          two-credit one, so averaging the grade points directly ignores the
          weighting that the whole system is built on.
        </p>
        <pre>
          GPA = Total quality points ÷ Total credits{"\n"}where quality points
          for a course = grade points × credits
        </pre>
        <p>Worked on a semester of four courses:</p>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Course</th>
                <th>Grade</th>
                <th>Grade points</th>
                <th>Credits</th>
                <th>Quality points</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Biology</td>
                <td>A</td>
                <td>4.0</td>
                <td>4</td>
                <td>16.0</td>
              </tr>
              <tr>
                <td>Statistics</td>
                <td>B</td>
                <td>3.0</td>
                <td>3</td>
                <td>9.0</td>
              </tr>
              <tr>
                <td>History</td>
                <td>B+</td>
                <td>3.3</td>
                <td>3</td>
                <td>9.9</td>
              </tr>
              <tr>
                <td>Studio elective</td>
                <td>C</td>
                <td>2.0</td>
                <td>1</td>
                <td>2.0</td>
              </tr>
              <tr>
                <td>
                  <strong>Total</strong>
                </td>
                <td></td>
                <td></td>
                <td>
                  <strong>11</strong>
                </td>
                <td>
                  <strong>36.9</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          The GPA is 36.9 ÷ 11 = 3.35. Averaging the four grade points instead
          gives (4.0 + 3.0 + 3.3 + 2.0) ÷ 4 = 3.08 — noticeably lower, because
          the unweighted average lets a one-credit elective drag as hard as a
          four-credit science course.
        </p>
        <p>
          That gap is the entire reason credits appear in the formula. The
          direction of the error depends on where your strong grades sit: heavy
          courses done well pull the true GPA above the naive average, and heavy
          courses done poorly pull it below.
        </p>

        <h2>Letter Grades to Grade Points</h2>
        <p>
          The mapping is set by your institution, and the values below are the
          most widely used version of the 4.0 scale. Check your own handbook
          before relying on any table, since the treatment of plus and minus
          grades varies.
        </p>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Letter</th>
                <th>Points</th>
                <th>Letter</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>A</td>
                <td>4.0</td>
                <td>C</td>
                <td>2.0</td>
              </tr>
              <tr>
                <td>A−</td>
                <td>3.7</td>
                <td>C−</td>
                <td>1.7</td>
              </tr>
              <tr>
                <td>B+</td>
                <td>3.3</td>
                <td>D+</td>
                <td>1.3</td>
              </tr>
              <tr>
                <td>B</td>
                <td>3.0</td>
                <td>D</td>
                <td>1.0</td>
              </tr>
              <tr>
                <td>B−</td>
                <td>2.7</td>
                <td>F</td>
                <td>0.0</td>
              </tr>
              <tr>
                <td>C+</td>
                <td>2.3</td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          Two institutional variations matter. Some award 4.3 for an A+ and
          others cap at 4.0, which changes the maximum attainable. And courses
          graded pass or fail usually carry credits without contributing quality
          points, so they are excluded from both totals rather than counted as
          zero — counting a pass as 0.0 would be catastrophic and is a real data
          entry error.
        </p>

        <h2>Cumulative GPA Has Inertia</h2>
        <p>
          A cumulative GPA is the same formula applied to every course you have
          taken, which means each new semester is diluted by everything that came
          before it.
        </p>
        <pre>
          Cumulative GPA = All quality points ever ÷ All credits ever
        </pre>
        <p>
          The consequence is that a cumulative GPA becomes progressively harder
          to move. A student with 30 credits at 2.80 who takes 15 credits at 4.00
          reaches (84 + 60) ÷ 45 = 3.20 — a strong semester lifting them by 0.40.
          The same perfect semester for a student with 90 credits behind them at
          2.80 gives (252 + 60) ÷ 105 = 2.97, a rise of just 0.17.
        </p>
        <p>
          This is worth understanding early rather than late. The first year
          affects the final number more than any other, because everything after
          it is averaged against a growing base. A weak start is recoverable; it
          just takes more credits of strong work than most people expect.
        </p>

        <h2>Working Backwards to a Target</h2>
        <p>
          The more useful question is usually what you need next semester rather
          than what you have now.
        </p>
        <pre>
          Required quality points = (Target GPA × Total credits after) − Current
          quality points{"\n"}Required GPA = Required quality points ÷ Upcoming
          credits
        </pre>
        <p>
          A student with 60 credits at 3.10 has 186 quality points. To reach 3.30
          after a further 15 credits, they need 3.30 × 75 = 247.5 points, so 61.5
          over those 15 credits, which is a semester GPA of 4.10. That is above
          the maximum on an unweighted scale, and the honest conclusion is that
          the target is not reachable in one semester rather than that it needs
          working harder for.
        </p>
        <p>
          Running this calculation before setting a goal saves a great deal of
          frustration. It also identifies the opposite case, where a target is
          comfortably within reach and the anxiety is unnecessary.
        </p>

        <h2>Weighted and Unweighted Are Different Measures</h2>
        <p>
          Some schools award extra grade points for advanced, honours or
          college-level courses, so an A in one of those might count as 5.0
          rather than 4.0. That produces averages above 4.0 and is meant to
          reward taking harder courses rather than protecting an average with
          easy ones.
        </p>
        <p>
          Two cautions follow. Weighted averages are not comparable between
          schools, because each institution decides which courses are weighted
          and by how much — which is why many universities recalculate an
          unweighted GPA from the transcript. And a weighted figure cannot be
          converted to a percentage using the usual multiplier, since the scale
          maximum is no longer 4.0. Our{" "}
          <Link href="/gpa-percentage/" className="my-link">
            GPA to percentage converter
          </Link>{" "}
          covers that conversion and the scales it depends on.
        </p>
        <p>
          For general weighted-average arithmetic outside an academic context,
          the{" "}
          <Link href="/percentage-calculator/" className="my-link">
            percentage calculator
          </Link>{" "}
          handles the same principle applied to marks and proportions.
        </p>
        <h2>GPA Calculation Questions</h2>

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
