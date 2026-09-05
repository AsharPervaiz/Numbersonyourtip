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
      "How is exact age calculated in years, months and days?",
      "Subtract each component separately, starting with days, and borrow upward when a result is negative. Someone born on 18 August 1994, on 5 March 2026, is 31 years 6 months and 15 days: the days borrow 28 from February 2026, the months then borrow 12 from the years. The key detail is that you borrow the length of the month before today, not a flat 30.",
    ],
    [
      "Why do two age calculators give me different answers?",
      "Because parts of the calculation have no universally agreed convention. Tools differ on which month's length to borrow, whether to subtract days first or count forward from whole years, and how to treat a birthday on the 31st in a shorter month. The differences are usually a day or two and only in the days component — the years figure is stable across every convention.",
    ],
    [
      "How old am I if I was born on 29 February?",
      "Your age in whole years is unaffected — someone born on 29 February 2000 turned 26 during 2026. What varies is which day counts as the anniversary in ordinary years. Common practice treats 28 February as the birthday, while some systems use 1 March on the basis that the full year completes a day later. Where an age threshold has legal effect, local law decides rather than convention.",
    ],
    [
      "Does age increase on the birthday itself or the day after?",
      "Most systems increment on the day, so you are 30 on your thirtieth birthday. Some legal frameworks historically treated the age as attained the day before, and a few calculators follow the day-after reading. It only matters when a birthday falls exactly on a cut-off date for eligibility, which is precisely when it is worth checking the applicable rule rather than a calculator.",
    ],
    [
      "Why is my age in months not just my age in years times twelve?",
      "It is, for the whole-year part, but the remainder does not divide evenly because months have different lengths. Multiplying years by twelve and adding an estimate for the leftover days introduces error, particularly across February. Counting the completed months directly avoids it, which matters for infants where growth charts are read in months and weeks.",
    ],
    [
      "Why does an older record show a different age than I calculate?",
      "It may be using a different reckoning system. Under traditional East Asian counting, a person is one year old at birth and everyone advances at the new year rather than on their own birthday, which can make someone appear one or two years older. South Korea used this alongside other systems before standardising on the international method for official purposes in June 2023.",
    ],
    [
      "What is the most reliable way to state someone's age?",
      "Give the date of birth rather than the age wherever a record will be read later. An age is only true on the day it was written, while a date of birth stays correct indefinitely and lets anyone compute the age for whatever date they need. This is why forms ask for a birth date rather than an age.",
    ],
    [
      "How do I work out age at a past or future date?",
      "The same borrowing method works for any reference date, not just today — subtract the birth date from the target date rather than from the present. This is how eligibility on a future cut-off is checked, such as whether a child will have reached school age by a given start date.",
    ],
    [
      "Does this calculator handle time zones?",
      "Age is computed from calendar dates rather than exact moments, so time zones only matter if a birth date and a reference date were recorded in different ones — which can shift either by a day. For anything where a single day changes the outcome, confirm which zone each date was recorded in before relying on the result.",
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

        {/* ---- SEO CONTENT ---- */}

        <h2>Age in Years Is Easy. Years, Months and Days Is Not.</h2>
        <p>
          Working out how old someone is in whole years takes a moment: subtract
          the birth year from the current year, then take one off if the birthday
          has not happened yet. Nobody struggles with that.
        </p>
        <p>
          The difficulty starts when you want the remainder. Because months
          contain different numbers of days, the arithmetic requires borrowing
          across units of unequal size — and unlike time, where you always borrow
          60, here what you borrow changes depending on which month you are
          borrowing from.
        </p>

        <h2>The Borrowing Rule, Worked Through</h2>
        <p>
          Subtract each component separately, starting with days, and borrow
          upward whenever a result is negative.
        </p>
        <pre>
          Born: 18 August 1994{"\n"}Today: 5 March 2026{"\n"}
          {"\n"}Days: 5 − 18 = −13, so borrow a month{"\n"}The month before March
          is February 2026, which has 28 days{"\n"}Days: 5 + 28 − 18 = 15{"\n"}
          {"\n"}Months: 3 − 1 − 8 = −6, so borrow a year{"\n"}Months: 3 − 1 − 8 +
          12 = 6{"\n"}
          {"\n"}Years: 2026 − 1 − 1994 = 31{"\n"}
          {"\n"}Result: 31 years, 6 months, 15 days
        </pre>
        <p>
          The critical line is the third. You borrow the length of the month{" "}
          <em>preceding</em> the current one, not thirty days and not the length
          of the birth month. Borrowing a flat 30 here would give 17 days instead
          of 15.
        </p>
        <p>
          That single choice is the reason two calculators can disagree about
          your age, and it is a genuine ambiguity rather than a bug in one of
          them.
        </p>

        <h2>Why Two Age Calculators Give Different Answers</h2>
        <p>
          Ask several tools for an age in years, months and days and you can get
          several answers. Each is internally consistent; they differ on
          conventions that have no universally agreed answer.
        </p>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Decision</th>
                <th>One approach</th>
                <th>The alternative</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Which month length to borrow</td>
                <td>The month before the current date</td>
                <td>The month of the birth date, or a flat 30</td>
              </tr>
              <tr>
                <td>Order of subtraction</td>
                <td>Days first, then months, then years</td>
                <td>Years first, then count forward</td>
              </tr>
              <tr>
                <td>Birthday on the 31st in a 30-day month</td>
                <td>Treat the last day of the month as the anniversary</td>
                <td>Roll into the first of the next month</td>
              </tr>
              <tr>
                <td>The birthday itself</td>
                <td>Age increments on the day</td>
                <td>Age increments the day after</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          Differences are usually a day or two and only in the days component.
          The years figure is stable across every convention, which is why it is
          the one used for anything official.
        </p>

        <h2>Birthdays on 29 February</h2>
        <p>
          A person born on 29 February has a true anniversary only once every
          four years, so three years in four require a decision about which day
          stands in.
        </p>
        <p>
          Common practice is to treat 28 February as the anniversary in ordinary
          years, on the basis that the person has completed a full year by the
          end of February. Some jurisdictions and systems use 1 March instead,
          reasoning that the full year is not complete until the day after 28
          February would have been.
        </p>
        <p>
          For casual purposes it does not matter. Where it does matter — reaching
          an age of legal significance — the applicable rule is set by local law
          rather than by convention, and the two readings can differ by a day at
          exactly the moment the day counts.
        </p>
        <p>
          Age in whole years is unaffected either way. Someone born on 29
          February 2000 turned 26 during 2026 regardless of which day the
          birthday is observed on.
        </p>

        <h2>Not Every Culture Counts Age the Same Way</h2>
        <p>
          The system used across most of the world — starting at zero and
          incrementing on the anniversary — is not the only one that has been in
          use.
        </p>
        <p>
          Under the traditional East Asian reckoning, a person is one year old at
          birth, and everyone advances a year together at the new year rather
          than on individual birthdays. A baby born in late December could be
          counted as two years old within weeks. South Korea used this alongside
          two other systems for years, and in June 2023 standardised on the
          international method for official and legal purposes, which changed the
          stated age of most of the population overnight without anyone getting
          younger.
        </p>
        <p>
          It is worth knowing if you are comparing an age given in a family
          record or an older document against a calculated one. A discrepancy of
          one or two years is more likely to be a difference of system than an
          error.
        </p>

        <h2>Where the Exact Number Actually Matters</h2>
        <ul className="custom-list">
          <li>
            <strong>Paediatric assessment.</strong> Growth charts and
            developmental milestones for infants are read against age in months
            and weeks, where a few weeks changes which percentile band applies.
          </li>
          <li>
            <strong>Medication dosing in children.</strong> Some references use
            age bands alongside weight, so being just over or under a threshold
            changes the recommendation — our{" "}
            <Link href="/dose-calculator/" className="my-link">
              dosage calculator
            </Link>{" "}
            covers the weight-based side.
          </li>
          <li>
            <strong>Eligibility thresholds.</strong> School entry, licences,
            pensions and insurance bands are decided on a specific date rather
            than a rounded year.
          </li>
          <li>
            <strong>Length-of-service calculations.</strong> Notice periods and
            entitlements often depend on completed years and months rather than
            elapsed years.
          </li>
        </ul>
        <p>
          For a plain count of days between two dates rather than a structured
          age, use the{" "}
          <Link href="/days-between-calculator/" className="my-link">
            days between dates calculator
          </Link>
          . Our{" "}
          <Link href="/blog/how-to-calculate-exact-age/" className="my-link">
            guide to calculating exact age
          </Link>{" "}
          works through further examples of the borrowing rule.
        </p>
        <h2>Age Calculation Questions</h2>

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
