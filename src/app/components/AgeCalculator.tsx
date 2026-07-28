"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

/* ─────────────────────────────────────────
   Types
───────────────────────────────────────── */
interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalMonths: number;
  nextBirthdayDays: number;
  lifeStageLabel: string;
  lifeStagePct: number; // 0–100 for gauge
}

/* ─────────────────────────────────────────
   Pure helper
───────────────────────────────────────── */
function needleDeg(ratio: number): number {
  const clamped = Math.min(Math.max(ratio, 0), 1);
  return -90 + clamped * 180;
}

/* ─────────────────────────────────────────
   AgeResultPanel — UNCHANGED
───────────────────────────────────────── */
function AgeResultPanel({ result }: { result: AgeResult | null }) {
  if (!result) {
    return (
      <div className="cr-panel-placeholder">
        <div className="cr-ph-icon">
          <i className="fa-solid fa-cake-candles" aria-hidden="true" />
        </div>
        Select your date of birth to see your age breakdown here.
      </div>
    );
  }

  const {
    years,
    months,
    days,
    totalDays,
    totalMonths,
    nextBirthdayDays,
    lifeStageLabel,
    lifeStagePct,
  } = result;

  const ratio = Math.min(lifeStagePct / 100, 1);
  const barPct = 2 + ratio * 96;

  const ageBadge =
    years < 13
      ? "good"
      : years < 18
        ? "good"
        : years < 40
          ? "normal"
          : years < 65
            ? "warning"
            : "danger";

  return (
    <div className="cr-panel">
      <div className="cr-gauge-wrap">
        <svg
          className="cr-gauge-svg"
          width="100"
          height="60"
          viewBox="0 0 120 70"
          role="img"
          aria-label={`Age gauge: ${years} years`}
        >
          <defs>
            <clipPath id="age-half">
              <rect x="0" y="0" width="120" height="65" />
            </clipPath>
          </defs>
          <circle
            cx="60"
            cy="65"
            r="52"
            fill="none"
            stroke="#97C459"
            strokeWidth="12"
            strokeDasharray="65 326"
            strokeDashoffset="-163"
            clipPath="url(#age-half)"
          />
          <circle
            cx="60"
            cy="65"
            r="52"
            fill="none"
            stroke="#C0DD97"
            strokeWidth="12"
            strokeDasharray="65 326"
            strokeDashoffset="-228"
            clipPath="url(#age-half)"
          />
          <circle
            cx="60"
            cy="65"
            r="52"
            fill="none"
            stroke="#FAC775"
            strokeWidth="12"
            strokeDasharray="65 326"
            strokeDashoffset="-293"
            clipPath="url(#age-half)"
          />
          <circle
            cx="60"
            cy="65"
            r="52"
            fill="none"
            stroke="#F09595"
            strokeWidth="12"
            strokeDasharray="82 326"
            strokeDashoffset="-358"
            clipPath="url(#age-half)"
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
          <div className="cr-score">{years}</div>
          <div className="cr-score-label">years old</div>
          <span className={`cr-badge ${ageBadge}`}>{lifeStageLabel}</span>
        </div>
      </div>

      <hr className="cr-divider" />

      <div>
        <div className="cr-bar-label">age vs. human lifespan (0–100 years)</div>
        <div
          className="cr-bar-track"
          style={{
            background:
              "linear-gradient(to right, #97C459 0%, #C0DD97 25%, #FAC775 55%, #F09595 100%)",
          }}
        >
          <div className="cr-bar-thumb" style={{ left: `${barPct}%` }} />
        </div>
        <div className="cr-bar-ticks">
          <span>0</span>
          <span>25</span>
          <span>50</span>
          <span>75</span>
          <span>100</span>
        </div>
      </div>

      <hr className="cr-divider" />

      <div className="cr-metrics-grid">
        <div className="cr-metric-card">
          <div className="cr-m-label">Exact age</div>
          <div className="cr-m-value" style={{ fontSize: "13px" }}>
            {years}y {months}m {days}d
          </div>
          <div className="cr-m-sub">years, months, days</div>
        </div>
        <div className="cr-metric-card">
          <div className="cr-m-label">Total months</div>
          <div className="cr-m-value">{totalMonths.toLocaleString()}</div>
          <div className="cr-m-sub">since birth</div>
        </div>
        <div className="cr-metric-card">
          <div className="cr-m-label">Total days</div>
          <div className="cr-m-value">{totalDays.toLocaleString()}</div>
          <div className="cr-m-sub">days lived</div>
        </div>
        <div className="cr-metric-card">
          <div className="cr-m-label">Next birthday</div>
          <div className="cr-m-value">{nextBirthdayDays}</div>
          <div className="cr-m-sub">days away</div>
        </div>
      </div>

      <hr className="cr-divider" />

      <div>
        <div className="cr-world-title">life stage progress</div>
        {[
          { label: "Childhood", start: 0, end: 12, color: "#97C459" },
          { label: "Teens", start: 13, end: 17, color: "#C0DD97" },
          { label: "Young adult", start: 18, end: 39, color: "#378ADD" },
          { label: "Middle age", start: 40, end: 64, color: "#FAC775" },
          { label: "Senior", start: 65, end: 100, color: "#F09595" },
        ].map(({ label, start, end, color }) => {
          const stageWidth = end - start + 1;
          const filled = Math.min(Math.max(years - start, 0), stageWidth);
          const pct = Math.round((filled / stageWidth) * 100);
          return (
            <div className="cr-world-bar-row" key={label}>
              <span className="cr-w-label" style={{ width: "80px" }}>
                {label}
              </span>
              <div className="cr-world-track">
                <div
                  className="cr-world-fill"
                  style={{ width: `${pct}%`, background: color }}
                />
              </div>
              <span className="cr-w-pct" style={{ width: "36px" }}>
                {pct}%
              </span>
            </div>
          );
        })}
        <p className="cr-world-note">
          {nextBirthdayDays === 0
            ? "🎂 Happy Birthday!"
            : `Next birthday in ${nextBirthdayDays} day${nextBirthdayDays === 1 ? "" : "s"}.`}{" "}
          You have lived <strong>{totalDays.toLocaleString()}</strong> days so
          far.
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Main Calculator Page
───────────────────────────────────────── */
export default function AgeCalculator() {
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [dayOpen, setDayOpen] = useState(false);
  const [monthOpen, setMonthOpen] = useState(false);
  const [yearOpen, setYearOpen] = useState(false);

  const [age, setAge] = useState<string | null>(null);
  const [panelResult, setPanelResult] = useState<AgeResult | null>(null);

  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const toggleFAQ = (index: number) =>
    setOpenFAQ(openFAQ === index ? null : index);

  const monthsList = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const yearsList = Array.from(
    { length: new Date().getFullYear() - 1899 },
    (_, i) => `${1900 + i}`,
  );

  const daysList = Array.from({ length: 31 }, (_, i) => `${i + 1}`);

  const compute = (): AgeResult | null => {
    if (!day || !month || !year) return null;
    const monthIndex = monthsList.indexOf(month) + 1;
    const birthDate = new Date(`${year}-${monthIndex}-${day}`);
    if (isNaN(birthDate.getTime())) return null;

    const today = new Date();
    if (birthDate > today) return null;

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
      months -= 1;
      days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const totalDays = Math.floor(
      (today.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    const totalMonths = years * 12 + months;

    const nextBday = new Date(
      today.getFullYear(),
      birthDate.getMonth(),
      birthDate.getDate(),
    );
    if (nextBday < today) nextBday.setFullYear(today.getFullYear() + 1);
    const nextBirthdayDays = Math.round(
      (nextBday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );

    const lifeStageLabel =
      years < 13
        ? "Child"
        : years < 18
          ? "Teenager"
          : years < 40
            ? "Young adult"
            : years < 65
              ? "Middle aged"
              : "Senior";

    return {
      years,
      months,
      days,
      totalDays,
      totalMonths,
      nextBirthdayDays,
      lifeStageLabel,
      lifeStagePct: years,
    };
  };

  useEffect(() => {
    setPanelResult(compute());
  }, [day, month, year]);

  const calculateAge = () => {
    if (!day || !month || !year) return;
    const monthIndex = monthsList.indexOf(month) + 1;
    const birthDate = new Date(`${year}-${monthIndex}-${day}`);
    if (isNaN(birthDate.getTime())) {
      setAge("Invalid date");
      return;
    }

    const today = new Date();
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
      months -= 1;
      days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    setAge(`${years} years, ${months} months, ${days} days`);
  };

  const handleClear = () => {
    setDay("");
    setMonth("");
    setYear("");
    setAge(null);
    setPanelResult(null);
  };

  /* ── FAQ data (also used for JSON-LD schema) ── */
  const faqs: [string, string][] = [
    [
      "How old am I if I was born in 1990?",
      "If you were born in 1990, you are 35 or 36 years old in 2026, depending on whether your birthday has already passed this year. Enter your exact date of birth above to get your age in years, months, and days.",
    ],
    [
      "How do you calculate age from date of birth?",
      "Age is calculated by subtracting your date of birth from today's date. First subtract the birth year from the current year, then adjust for whether the birth month and day have occurred yet this year. Our free age calculator does this automatically and accounts for leap years.",
    ],
    [
      "How old will I be in 2030?",
      "Your age in 2030 equals 2030 minus your birth year, minus one if your birthday hasn't happened yet in 2030. Someone born in 1995 will turn 35 in 2030. You can also enter a future date in our calculator to check.",
    ],
    [
      "What is a half birthday and how do I calculate it?",
      "A half birthday falls exactly 6 months after your actual birthday. If you were born on March 15, your half birthday is September 15. It's popular for people born near holidays who want a separate celebration.",
    ],
    [
      "How does Korean age work in 2026?",
      "As of June 2023, South Korea officially switched to the international age system, so Korean age now matches your Western age. Traditionally, Korean age added 1 year at birth and another every Lunar New Year, making people 1–2 years older than their international age.",
    ],
    [
      "How old is my dog in human years?",
      'The old "multiply by 7" rule is inaccurate. A more realistic formula from AVMA guidelines: a dog\'s first year equals about 15 human years, the second year adds about 9, and each year after adds roughly 4–5 human years, depending on the breed size.',
    ],
    [
      "How many days old am I?",
      "To find your age in days, multiply your age in years by 365.25 (to account for leap years), then add days since your last birthday. Our calculator shows this instantly in the results panel.",
    ],
    [
      "Can I calculate a baby's age in months?",
      "Yes. For infants and toddlers, age is usually expressed in months up to 24 months, then in years and months. Our age in months calculator shows total months lived, which is useful for pediatric checkups and vaccination schedules.",
    ],
    [
      "What if I was born on February 29 in a leap year?",
      "Leaplings usually celebrate on February 28 or March 1 in non-leap years. Legally, most countries consider you a year older on March 1. Our calculator handles leap years automatically for accurate day counts.",
    ],
    [
      "Is this age calculator free to use?",
      "Yes, our age calculator is 100% free, works on any device, and doesn't require signup. Enter your date of birth to get instant results in years, months, days, hours, and minutes.",
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
        <h1>Age Calculator — How Old Am I?</h1>

        <p>
          Free age calculator by date of birth. Find your exact age in years,
          months, days, hours, and minutes — instantly.
        </p>

        <div className="calc-card single-calc">
          {/* Dropdown Fields — UNTOUCHED */}
          <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
            {/* Day */}
            <div
              className="modern-dropdown"
              onClick={() => setDayOpen(!dayOpen)}
              style={{ width: "100%" }}
            >
              {day || "Day"}
              <span className="dropdown-indicator">▼</span>
              {dayOpen && (
                <ul className="dropdown-list">
                  <li
                    onClick={() => {
                      setDay("");
                      setDayOpen(false);
                    }}
                  >
                    Day
                  </li>
                  {daysList.map((d) => (
                    <li
                      key={d}
                      onClick={() => {
                        setDay(d);
                        setDayOpen(false);
                      }}
                    >
                      {d}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Month */}
            <div
              className="modern-dropdown"
              onClick={() => setMonthOpen(!monthOpen)}
              style={{ width: "100%" }}
            >
              {month || "Month"}
              <span className="dropdown-indicator">▼</span>
              {monthOpen && (
                <ul className="dropdown-list">
                  <li
                    onClick={() => {
                      setMonth("");
                      setMonthOpen(false);
                    }}
                  >
                    Month
                  </li>
                  {monthsList.map((m) => (
                    <li
                      key={m}
                      onClick={() => {
                        setMonth(m);
                        setMonthOpen(false);
                      }}
                    >
                      {m}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Year */}
            <div
              className="modern-dropdown"
              onClick={() => setYearOpen(!yearOpen)}
              style={{ width: "100%" }}
            >
              {year || "Year"}
              <span className="dropdown-indicator">▼</span>
              {yearOpen && (
                <ul className="dropdown-list">
                  <li
                    onClick={() => {
                      setYear("");
                      setYearOpen(false);
                    }}
                  >
                    Year
                  </li>
                  {yearsList
                    .slice()
                    .reverse()
                    .map((y) => (
                      <li
                        key={y}
                        onClick={() => {
                          setYear(y);
                          setYearOpen(false);
                        }}
                      >
                        {y}
                      </li>
                    ))}
                </ul>
              )}
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button className="calc-button" onClick={calculateAge}>
              Calculate
            </button>
            <button className="calc-button calc-clear" onClick={handleClear}>
              Clear
            </button>
          </div>
        </div>

        {/* Mobile-only result panel */}
        <div className="cr-mobile-slot">
          <AgeResultPanel result={panelResult} />
        </div>

        {/* ── SEO CONTENT — REWRITTEN ── */}

        <h2>How Old Am I? A Free Age Calculator by Date of Birth</h2>
        <p>
          Wondering <strong>how old am I today</strong> down to the exact day?
          This free age calculator online works out your chronological age from
          your date of birth in seconds — no signup, no ads on the tool, no math
          in your head. Just pick your day, month, and year of birth, and the
          calculator returns your age in years, months, days, total months,
          total days, and how many days remain until your next birthday.
        </p>
        <p>
          It handles leap years automatically, works for babies (age in months),
          adults, and seniors, and even lets you calculate your age on a future
          date. Whether you're filling out a government form, planning a
          retirement date, or just curious how many days you've been alive, this
          is the fastest way to know.
        </p>

        <h2>How to Use This Free Age Calculator Online</h2>
        <p>Using the calculator takes about five seconds:</p>
        <ol className="custom-list">
          <li>
            <strong>Select the day</strong> of your birth from the first
            dropdown.
          </li>
          <li>
            <strong>Select the month</strong> you were born in.
          </li>
          <li>
            <strong>Select your birth year</strong> — the list goes back to
            1900.
          </li>
          <li>
            Click <strong>Calculate</strong>, or watch the result panel update
            automatically.
          </li>
        </ol>
        <p>
          The result panel shows your exact age, life-stage progress, and a
          countdown to your next birthday. Hit <strong>Clear</strong> to start
          over for another person.
        </p>

        <h2>How Age Is Calculated (The Simple Formula)</h2>
        <p>
          Age calculation is basic date subtraction, but with a catch — you have
          to check whether your birthday has already happened this year.
        </p>
        <p>
          <strong>The formula:</strong>
        </p>
        <ul className="custom-list">
          <li>
            <strong>Age in years</strong> = Current year − Birth year
          </li>
          <li>
            If the current month/day is <em>before</em> your birth month/day,
            subtract 1 year.
          </li>
        </ul>
        <p>
          <strong>Example:</strong> If you were born on 12 August 1995 and today
          is 25 July 2026, your birth month (August) hasn't arrived yet — so
          your age is 2026 − 1995 − 1 = <strong>30 years old</strong>. You'll
          turn 31 on 12 August 2026.
        </p>
        <p>
          For precise results, our tool also computes the number of months and
          days since your last birthday, so you get answers like{" "}
          <em>"30 years, 11 months, 13 days"</em> — the kind of exact age some
          medical, legal, and immigration forms ask for.
        </p>

        <h2>Age in Years, Months, Days, Hours & Minutes</h2>
        <p>
          Depending on why you need the number, "age" can be expressed several
          ways:
        </p>
        <ul className="custom-list">
          <li>
            <strong>Years</strong> — the standard measure for adults, IDs, and
            legal documents.
          </li>
          <li>
            <strong>Months</strong> — commonly used for babies and toddlers (up
            to about 24 months), and for tracking pregnancy milestones.
          </li>
          <li>
            <strong>Weeks</strong> — used for newborns and gestational age.
          </li>
          <li>
            <strong>Days</strong> — precise counts for anniversaries, sobriety
            milestones, or record-keeping.
          </li>
          <li>
            <strong>Hours &amp; minutes</strong> — mostly for fun and curiosity
            ("I've been alive over 260,000 hours!").
          </li>
        </ul>
        <p>
          If you need to find the exact days between two custom dates instead of
          today, try our{" "}
          <Link className="my-link" href="/days-between-calculator/">
            <span className="hover-item">days between dates calculator</span>
          </Link>
          . For deeper date and duration math, the{" "}
          <Link className="my-link" href="/time-calculator/">
            <span className="hover-item">time calculator</span>
          </Link>{" "}
          handles hours, minutes, and time arithmetic.
        </p>

        <h2>Born in [Year] — How Old Am I in 2026?</h2>
        <p>
          Not sure how old you are this year? Use this quick reference chart to
          find your age in 2026 based on your birth year. Ages assume your
          birthday has already passed in 2026 — if it hasn't yet, subtract 1.
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
                Birth Year
              </th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                Age in 2026
              </th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                Life Stage
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                2020
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>6</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Child
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                2015
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>11</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Child
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                2010
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>16</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Teenager
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                2005
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>21</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Young adult
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                2000
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>26</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Young adult
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                1995
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>31</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Young adult
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                1990
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>36</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Young adult
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                1985
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>41</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Middle aged
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                1980
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>46</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Middle aged
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                1975
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>51</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Middle aged
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                1970
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>56</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Middle aged
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                1965
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>61</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Middle aged
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                1960
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>66</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Senior
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                1955
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>71</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Senior
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                1950
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>76</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Senior
              </td>
            </tr>
          </tbody>
        </table>

        <h2>Age in Months Calculator — For Babies &amp; Toddlers</h2>
        <p>
          For infants and toddlers, doctors and parents usually track age in
          months rather than years. Pediatric growth charts, vaccination
          schedules, and developmental milestones (rolling over, crawling,
          walking, first words) are all mapped to age in months up to about 24
          months, and sometimes up to 36.
        </p>
        <p>
          To use this page as an <strong>age in months calculator</strong>, just
          enter your child's date of birth — the result panel shows{" "}
          <strong>Total months</strong> since birth, along with the exact
          breakdown in years, months, and days.
        </p>
        <p>
          <strong>Quick reference:</strong> a 6-month-old baby is halfway
          through their first year; 12 months = 1 year; 18 months is a common
          milestone checkup age; 24 months is the point most pediatricians
          switch to reporting age in years.
        </p>

        <h2>Half Birthday Calculator — When Is My Half Birthday?</h2>
        <p>
          A <strong>half birthday</strong> falls exactly six months after your
          actual birthday. It's popular with people born close to major holidays
          (Christmas, New Year, Eid), kids who want a mid-year celebration, and
          schools that group students by half-year age brackets.
        </p>
        <p>
          <strong>How to calculate your half birthday:</strong>
        </p>
        <ul className="custom-list">
          <li>Add 6 months to your birth date.</li>
          <li>
            If your birthday is in January–June, your half birthday is in
            July–December of the same year.
          </li>
          <li>
            If your birthday is in July–December, your half birthday is in
            January–June of the next year.
          </li>
        </ul>
        <p>
          <strong>Examples:</strong>
        </p>
        <ul className="custom-list">
          <li>
            Birthday: <strong>15 March</strong> → Half birthday:{" "}
            <strong>15 September</strong>
          </li>
          <li>
            Birthday: <strong>22 October</strong> → Half birthday:{" "}
            <strong>22 April</strong>
          </li>
          <li>
            Birthday: <strong>25 December</strong> → Half birthday:{" "}
            <strong>25 June</strong>
          </li>
        </ul>

        <h2>Korean Age Calculator 2026 (What Changed in 2023)</h2>
        <p>
          Traditional Korean age worked differently from international age. In
          the old system:
        </p>
        <ul className="custom-list">
          <li>
            You were considered <strong>1 year old at birth</strong> (counting
            time in the womb).
          </li>
          <li>
            You gained <strong>+1 year every Lunar New Year</strong>, not on
            your actual birthday.
          </li>
        </ul>
        <p>
          That meant Koreans were typically 1–2 years older in Korean age than
          in international age. A baby born on 31 December would turn 2 years
          old on 1 January the next day.
        </p>
        <p>
          <strong>The big change:</strong> as of <strong>28 June 2023</strong>,
          South Korea officially adopted the international age system for all
          legal, administrative, and medical purposes. So in 2026, your{" "}
          <strong>Korean age = your international age</strong> for anything
          official — your bank, doctor, school, and government forms all use the
          same age you'd calculate with this tool.
        </p>
        <p>
          Traditional Korean age is still used casually in daily conversation
          and for cultural events, but you no longer need a separate calculator
          for legal purposes.
        </p>

        <h2>How Old Is a Dog in Human Years?</h2>
        <p>
          The old "multiply by 7" rule is a myth. Dogs mature much faster in
          their first two years, then slow down. Modern veterinary guidelines
          (including research from the American Veterinary Medical Association)
          use this approximation:
        </p>
        <ul className="custom-list">
          <li>
            Year 1 of a dog's life ≈ <strong>15 human years</strong>
          </li>
          <li>
            Year 2 adds ≈ <strong>9 more human years</strong> (so 2 dog years ≈
            24 human years)
          </li>
          <li>
            Each year after adds ≈ <strong>4–5 human years</strong>, depending
            on breed size
          </li>
        </ul>
        <p>
          <strong>Dog age vs human age quick chart:</strong>
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
                Dog Age
              </th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                Small Breed
              </th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                Medium Breed
              </th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                Large Breed
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>1</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>15</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>15</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>15</td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>2</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>24</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>24</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>24</td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>5</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>36</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>37</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>40</td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>10</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>56</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>60</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>66</td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>15</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>76</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>83</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>93</td>
            </tr>
          </tbody>
        </table>
        <p>
          Larger breeds age faster and typically have shorter lifespans than
          small breeds — a 10-year-old Great Dane is closer to human age 79,
          while a 10-year-old Chihuahua is closer to 56.
        </p>

        <h2>Why Knowing Your Exact Age Matters</h2>
        <p>
          Age isn't just a number on a birthday cake — dozens of real-world
          decisions depend on knowing it precisely:
        </p>
        <ul className="custom-list">
          <li>
            <strong>Legal milestones</strong> — voting age, driving, marriage,
            drinking, and the age of majority
          </li>
          <li>
            <strong>School &amp; admissions</strong> — kindergarten cutoffs,
            university eligibility, entrance exams
          </li>
          <li>
            <strong>Employment</strong> — minimum working age, apprenticeships,
            and mandatory retirement
          </li>
          <li>
            <strong>Healthcare</strong> — vaccination schedules, pediatric vs
            adult dosing, screening age (mammograms, colonoscopies)
          </li>
          <li>
            <strong>Financial planning</strong> — retirement contributions,
            pension eligibility, insurance premiums, tax brackets
          </li>
          <li>
            <strong>Travel</strong> — passport renewal, child/adult airfare,
            unaccompanied minor rules
          </li>
          <li>
            <strong>Sports</strong> — age-group divisions in youth leagues and
            masters categories
          </li>
        </ul>
        <p>
          <strong>Common legal age references (varies by country):</strong>
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
                backgroundColor: "var(--card-bg, #f5f5f5)",
                textAlign: "left",
              }}
            >
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                Milestone
              </th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                Typical Age
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Start school
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>5–6</td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Driving learner's permit
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                15–16
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Voting age
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>18</td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Legal adult / age of majority
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                18 (21 in a few countries)
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Retirement age
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                60–67
              </td>
            </tr>
          </tbody>
        </table>

        <h2>Chronological Age vs Biological Age</h2>
        <p>
          <strong>Chronological age</strong> is what this calculator gives you —
          the exact time elapsed since birth. <strong>Biological age</strong> is
          a health estimate based on your body's actual condition: fitness,
          cellular health, chronic disease markers, and lifestyle. Two people
          the same chronological age can have very different biological ages.
        </p>
        <p>
          This tool measures chronological age only. If you're interested in
          health-related metrics, you might also find our{" "}
          <Link className="my-link" href="/percentage-calculator/">
            <span className="hover-item">percentage calculator</span>
          </Link>{" "}
          useful for tracking fitness progress and body-composition changes.
        </p>

        <h2>Benefits of Using Our Free Age Calculator</h2>
        <ul className="custom-list">
          <li>
            ✅ <strong>100% free</strong> — no login, no paywall, no download
          </li>
          <li>
            ✅ <strong>Instant results</strong> in years, months, days, plus
            total days and months lived
          </li>
          <li>
            ✅ <strong>Leap-year accurate</strong> — automatically handles
            February 29 and month-length differences
          </li>
          <li>
            ✅ <strong>Works on any device</strong> — phone, tablet, laptop,
            desktop
          </li>
          <li>
            ✅ <strong>Next-birthday countdown</strong> included in every result
          </li>
          <li>
            ✅ <strong>Life-stage progress</strong> visual so you can see where
            you are on the human lifespan
          </li>
          <li>✅ Suitable for babies (age in months), adults, and seniors</li>
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
          Whether you typed "how old am I" into Google out of curiosity, need
          your exact age for a form, or want to know when your dog crosses into
          "senior" territory, this <strong>free age calculator online</strong>{" "}
          gives you the answer in seconds. Pick your date of birth, glance at
          the result panel, and you're done — years, months, days, total days
          lived, and a countdown to your next birthday, all in one place.
        </p>
        <p>
          Bookmark it for the next time you need to work out an age quickly —
          and check out our{" "}
          <Link className="my-link" href="/days-between-calculator/">
            <span className="hover-item">days between dates</span>
          </Link>{" "}
          and{" "}
          <Link className="my-link" href="/time-calculator/">
            <span className="hover-item">time calculator</span>
          </Link>{" "}
          for related date math.
        </p>
      </div>

      {/* ── SIDEBAR — UNCHANGED ── */}
      <aside className="sidebar">
        <div className="cr-desktop-slot">
          <AgeResultPanel result={panelResult} />
        </div>
        <div className="sidebar-box">
          <p style={{ fontSize: "20px", fontWeight: 600 }}>
            Related Calculators
          </p>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {[
              ["/time-calculator/", "Time Calculator"],
              ["/days-between-calculator/", "Days Between Dates"],
              ["/gpa-calculator/", "GPA Calculator"],
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
