"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface DaysResult {
  totalDays: number;
  weeks: number;
  remainingDays: number;
  months: number;
  years: number;
  hours: number;
  minutes: number;
  startDate: string;
  endDate: string;
  isPast: boolean;
}
function needleDeg(ratio: number): number {
  const clamped = Math.min(Math.max(ratio, 0), 1);
  return -90 + clamped * 180;
}

function DaysResultPanel({ result }: { result: DaysResult | null }) {
  if (!result) {
    return (
      <div className="cr-panel-placeholder">
        <div className="cr-ph-icon">
          <i className="fa-solid fa-calendar-days" aria-hidden="true" />
        </div>
        Select two dates to see the duration breakdown here.
      </div>
    );
  }
  const {
    totalDays,
    weeks,
    remainingDays,
    months,
    years,
    hours,
    minutes,
    isPast,
  } = result;
  const fmt = (n: number) => n.toLocaleString("en-US");
  const scaleMax = 1825;
  const ratio = Math.min(totalDays / scaleMax, 1);
  const barPct = 2 + ratio * 96;
  const spanLabel =
    totalDays === 0
      ? "Same day"
      : totalDays < 7
        ? "Days apart"
        : totalDays < 31
          ? "Weeks apart"
          : totalDays < 365
            ? "Months apart"
            : totalDays < 730
              ? "About a year"
              : totalDays < 1825
                ? "Multiple years"
                : "5+ years";
  const spanBadge =
    totalDays === 0
      ? "info"
      : totalDays < 31
        ? "good"
        : totalDays < 365
          ? "normal"
          : totalDays < 730
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
          aria-label={`Duration gauge: ${totalDays} days`}
        >
          <defs>
            <clipPath id="days-half">
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
            clipPath="url(#days-half)"
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
            clipPath="url(#days-half)"
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
            clipPath="url(#days-half)"
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
            clipPath="url(#days-half)"
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
          <div className="cr-score">{fmt(totalDays)}</div>
          <div className="cr-score-label">
            days {isPast ? "since" : "until / between"}
          </div>
          <span className={`cr-badge ${spanBadge}`}>{spanLabel}</span>
        </div>
      </div>
      <hr className="cr-divider" />
      <div>
        <div className="cr-bar-label">
          duration — {fmt(totalDays)} days on a 5-year scale
        </div>
        <div
          className="cr-bar-track"
          style={{
            background:
              "linear-gradient(to right, #97C459 0%, #C0DD97 20%, #FAC775 55%, #F09595 100%)",
          }}
        >
          <div className="cr-bar-thumb" style={{ left: `${barPct}%` }} />
        </div>
        <div className="cr-bar-ticks">
          <span>0</span>
          <span>6mo</span>
          <span>1yr</span>
          <span>3yr</span>
          <span>5yr+</span>
        </div>
      </div>
      <hr className="cr-divider" />
      <div className="cr-metrics-grid">
        <div className="cr-metric-card">
          <div className="cr-m-label">Total days</div>
          <div className="cr-m-value">{fmt(totalDays)}</div>
          <div className="cr-m-sub">exact count</div>
        </div>
        <div className="cr-metric-card">
          <div className="cr-m-label">Weeks</div>
          <div className="cr-m-value">
            {fmt(weeks)}{" "}
            <span style={{ fontSize: "12px", fontWeight: 400 }}>
              + {remainingDays}d
            </span>
          </div>
          <div className="cr-m-sub">weeks and days</div>
        </div>
        <div className="cr-metric-card">
          <div className="cr-m-label">Months</div>
          <div className="cr-m-value">~{fmt(months)}</div>
          <div className="cr-m-sub">approximate</div>
        </div>
        <div className="cr-metric-card">
          <div className="cr-m-label">Years</div>
          <div className="cr-m-value">~{years.toFixed(2)}</div>
          <div className="cr-m-sub">approximate</div>
        </div>
      </div>
      <hr className="cr-divider" />
      <div>
        <div className="cr-world-title">duration in different units</div>
        <div className="cr-world-bar-row">
          <span className="cr-w-label">Days</span>
          <div className="cr-world-track">
            <div
              className="cr-world-fill"
              style={{ width: "100%", background: "#97C459" }}
            />
          </div>
          <span
            className="cr-w-pct"
            style={{ width: "60px", fontSize: "10px" }}
          >
            {fmt(totalDays)}
          </span>
        </div>
        <div className="cr-world-bar-row">
          <span className="cr-w-label">Hours</span>
          <div className="cr-world-track">
            <div
              className="cr-world-fill"
              style={{ width: "100%", background: "#B5D4F4" }}
            />
          </div>
          <span
            className="cr-w-pct"
            style={{ width: "60px", fontSize: "10px" }}
          >
            {fmt(hours)}
          </span>
        </div>
        <div className="cr-world-bar-row">
          <span className="cr-w-label">Minutes</span>
          <div className="cr-world-track">
            <div
              className="cr-world-fill"
              style={{ width: "100%", background: "#FAC775" }}
            />
          </div>
          <span
            className="cr-w-pct"
            style={{ width: "60px", fontSize: "10px" }}
          >
            {fmt(minutes)}
          </span>
        </div>
        <p className="cr-world-note">
          {totalDays === 0
            ? "Both dates are the same day."
            : `${fmt(totalDays)} days = ${fmt(weeks)} weeks ${remainingDays > 0 ? `& ${remainingDays} days` : ""} = ~${fmt(months)} months = ~${years.toFixed(2)} years.`}
        </p>
      </div>
    </div>
  );
}

/* ─── Dynamic "days from today" helper for SEO table ─── */
function addDaysToDate(d: Date, n: number): string {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

const FAQ_DATA = [
  {
    q: "How do I calculate the number of days between two dates?",
    a: "Enter the start date and end date above. The calculator subtracts the earlier from the later and shows the exact number of calendar days between them, along with weeks, months, years, hours, and minutes. It correctly accounts for different month lengths and leap years.",
  },
  {
    q: "Can I find out how many days since a specific date?",
    a: "Yes. Enter the past date as the start date and today's date as the end date. The result shows exactly how many days have passed since that date — useful for tracking anniversaries, milestones, or elapsed time.",
  },
  {
    q: "How do I calculate how many days until my birthday?",
    a: "Enter today's date as the start date and your next birthday as the end date. The calculator shows the exact countdown in days, weeks, and months.",
  },
  {
    q: "What is 30 / 60 / 90 / 180 days from today?",
    a: "The 'Quick Reference — Days From Today' table on this page shows the exact calendar date for 30, 60, 90, 120, 180, and 365 days from today. These update dynamically so they are always current.",
  },
  {
    q: "Does this count the start date or the end date?",
    a: "This calculator counts the span between the two dates without double-counting either day. From January 1 to January 3 is 2 days — the distance between them.",
  },
  {
    q: "How do I count business days between two dates?",
    a: "This calculator counts all calendar days including weekends. To estimate business days, subtract approximately 2 out of every 7 days (weekends). For a 90-day span, roughly 64 are business days. For exact business day counts, you would also need to exclude your country's public holidays.",
  },
  {
    q: "How many days are in a year?",
    a: "A common year has 365 days. A leap year has 366. For fractional year calculations, this tool uses 365.25 — the average that accounts for the leap year cycle.",
  },
  {
    q: "Can I calculate days between past and future dates?",
    a: "Yes. This calculator works for any two dates — both in the past, both in the future, or one of each. The result is always the absolute number of days between them.",
  },
  {
    q: "Is this days between dates calculator free?",
    a: "Yes — completely free with no sign-up and no limits. Calculate the days between any two dates, any number of times. Results include days, weeks, months, years, hours, and minutes.",
  },
];

export default function DaysBetweenDatesCalculator() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [panelResult, setPanelResult] = useState<DaysResult | null>(null);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const toggleFAQ = (i: number) => setOpenFAQ(openFAQ === i ? null : i);

  const compute = (): DaysResult | null => {
    if (!startDate || !endDate) return null;
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;
    const diffMs = Math.abs(end.getTime() - start.getTime());
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(totalDays / 7);
    const remainingDays = totalDays % 7;
    const months = Math.floor(totalDays / 30.4375);
    const years = totalDays / 365.25;
    const hours = totalDays * 24;
    const minutes = hours * 60;
    const isPast = end < new Date();
    return {
      totalDays,
      weeks,
      remainingDays,
      months,
      years,
      hours,
      minutes,
      startDate,
      endDate,
      isPast,
    };
  };

  useEffect(() => {
    setPanelResult(compute());
  }, [startDate, endDate]);
  const calculate = () => setPanelResult(compute());
  const handleClear = () => {
    setStartDate("");
    setEndDate("");
    setPanelResult(null);
  };

  const today = new Date();
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_DATA.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  return (
    <div className="page-layout">
      <div className="single-page-padding">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />

        <h1>Days Between Dates Calculator</h1>
        <p>
          Calculate the exact number of days, weeks, months, and years between
          any two dates — instantly and for free. Use it to find how many days
          since a date, how many days until your birthday or Christmas, or what
          date falls 30, 60, 90, or 180 days from today.
        </p>

        <div className="calc-card single-calc">
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <div>
              <label
                style={{
                  color: "white",
                  display: "block",
                  marginBottom: "5px",
                  fontWeight: 600,
                }}
              >
                Start Date
              </label>
              <input
                className="calc-input"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{ width: "100%", boxSizing: "border-box" }}
              />
            </div>
            <div>
              <label
                style={{
                  color: "white",
                  display: "block",
                  marginBottom: "5px",
                  fontWeight: 600,
                }}
              >
                End Date
              </label>
              <input
                className="calc-input"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{ width: "100%", boxSizing: "border-box" }}
              />
            </div>
          </div>
          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <button className="calc-button" onClick={calculate}>
              Calculate
            </button>
            <button className="calc-button calc-clear" onClick={handleClear}>
              Clear
            </button>
          </div>
        </div>

        <div className="cr-mobile-slot">
          <DaysResultPanel result={panelResult} />
        </div>

        {/* ── SEO CONTENT ── */}

        <h2>What Is a Days Between Dates Calculator?</h2>
        <p>
          A days between dates calculator tells you the exact number of calendar
          days that separate two dates. It is one of the most versatile everyday
          tools — useful for calculating age in days, tracking project
          timelines, figuring out how many days until an event, measuring how
          many days since something happened, or planning deadlines and
          countdowns.
        </p>
        <p>
          Unlike a simple calendar count, this calculator also converts the
          total days into weeks, months, years, hours, and minutes — giving you
          every unit you might need. For time-based arithmetic (adding hours and
          minutes together), our{" "}
          <Link href="/time-calculator/" className="my-link">
            time calculator
          </Link>{" "}
          handles that separately. And for finding your exact age in years,
          months, and days, our{" "}
          <Link href="/age-calculator/" className="my-link">
            age calculator
          </Link>{" "}
          is purpose-built for that.
        </p>

        <h2>Quick Reference — 30, 60, 90, and 180 Days From Today</h2>
        <p>
          One of the most commonly searched date questions is "what is 90 days
          from today?" or "what date is 30 days from now?" or "14 days from
          today" or "2 weeks from today" The table below updates dynamically so
          the answers are always current:
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
                  Days From Today
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Date
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Weeks
                </th>
              </tr>
            </thead>
            <tbody>
              {[30, 60, 90, 120, 180, 365].map((n) => (
                <tr key={n}>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    <strong>{n} days</strong>
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {addDaysToDate(today, n)}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {Math.floor(n / 7)} weeks{" "}
                    {n % 7 > 0 ? `& ${n % 7} days` : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          For any other number of days, enter today as the start date and the
          target date above to get the exact count.
        </p>

        <h2>How to Calculate Days Between Two Dates</h2>
        <p>The formula is straightforward:</p>
        <pre>Days Between = End Date − Start Date</pre>
        <p>
          In practice, this involves accounting for varying month lengths (28,
          29, 30, or 31 days), leap years, and exact calendar positions — which
          is why a calculator is more reliable than manual counting. For
          example, the days between 15 March 2023 and 28 September 2024:
        </p>
        <ul className="custom-list">
          <li>
            Total: <strong>563 days</strong>
          </li>
          <li>Weeks: 80 weeks and 3 days</li>
          <li>Months: approximately 18.5</li>
          <li>Years: approximately 1.54</li>
          <li>Hours: 13,512</li>
        </ul>

        <h2>Common Uses</h2>

        <h3>How Many Days Until My Birthday or Christmas?</h3>
        <p>
          Enter today as the start date and your next birthday (or December 25)
          as the end date for an instant countdown in days, weeks, and months.
          This is the fastest way to answer "how many days until Christmas" or
          "how many days until my birthday" without counting on a calendar.
        </p>

        <h3>How Many Days Since a Date?</h3>
        <p>
          Enter any past date as the start date and today as the end date to
          find exactly how many days have elapsed. Use this to track how many
          days since a wedding, a job start date, a significant life event, or
          any milestone. Reaching 1,000 days or 10,000 days is a popular
          celebration milestone. To convert that elapsed time into your exact
          age, use our{" "}
          <Link href="/age-calculator/" className="my-link">
            age calculator
          </Link>
          .
        </p>

        <h3>Project and Contract Deadlines</h3>
        <p>
          Professionals managing contracts, projects, or legal timelines
          frequently need to count exact days between signing dates, milestone
          dates, and delivery deadlines. A days calculator removes ambiguity and
          eliminates counting errors. If you need to track the financial side of
          those deadlines — EMI payments, loan terms — our{" "}
          <Link href="/loan-calculator/" className="my-link">
            loan calculator
          </Link>{" "}
          and{" "}
          <Link href="/emi-calculator/" className="my-link">
            EMI calculator
          </Link>{" "}
          work in months and can complement your day-count planning.
        </p>

        <h3>Health and Pregnancy Tracking</h3>
        <p>
          Count days from a last menstrual period, conception date, or symptom
          onset. Days-based tracking is standard in medicine for gestational
          age, treatment cycles, and dosage scheduling. For body-related
          calculations, our{" "}
          <Link href="/bmi-calculator/" className="my-link">
            BMI calculator
          </Link>{" "}
          can help with weight classification alongside your health timeline.
        </p>

        <h2>Business Days vs. Calendar Days</h2>
        <p>
          This calculator counts all calendar days between two dates, including
          weekends and public holidays. Many people search for a "business days
          between two dates calculator" or a "working days calculator" — here is
          how to estimate business days from the calendar day count:
        </p>
        <ul className="custom-list">
          <li>
            Out of every 7 calendar days, approximately 5 are business days
            (Monday through Friday).
          </li>
          <li>
            <strong>30 calendar days</strong> ≈ 21–22 business days
          </li>
          <li>
            <strong>60 calendar days</strong> ≈ 42–44 business days
          </li>
          <li>
            <strong>90 calendar days</strong> ≈ 64–65 business days
          </li>
          <li>
            <strong>180 calendar days</strong> ≈ 128–130 business days
          </li>
          <li>
            <strong>365 calendar days</strong> ≈ 260–262 business days
          </li>
        </ul>
        <p>
          These are approximations — exact working day counts depend on your
          country's public holidays, which vary by year and jurisdiction. For
          most purposes (age, event countdowns, contract durations, milestone
          tracking), total calendar days is the correct measure.
        </p>

        <h2>How Days Are Converted to Other Units</h2>
        <ul className="custom-list">
          <li>
            <strong>Weeks:</strong> Total days ÷ 7. The remainder shows extra
            days beyond complete weeks.
          </li>
          <li>
            <strong>Months:</strong> Total days ÷ 30.4375 (average days per
            Gregorian month, accounting for leap years). More accurate than
            dividing by 30.
          </li>
          <li>
            <strong>Years:</strong> Total days ÷ 365.25 (accounting for the leap
            year cycle). Gives a decimal year representation.
          </li>
          <li>
            <strong>Hours:</strong> Total days × 24.
          </li>
          <li>
            <strong>Minutes:</strong> Total hours × 60.
          </li>
        </ul>

        <h2>Leap Years and Why They Matter</h2>
        <p>
          A leap year has 366 days instead of 365, with February having 29 days.
          Leap years occur every 4 years — except for century years not
          divisible by 400. This calculator handles leap years correctly by
          counting exact calendar days rather than multiplying by a fixed
          number, so the result is always precise regardless of how many leap
          years fall within your date range.
        </p>

        <h2>Frequently Asked Questions</h2>

        {FAQ_DATA.map(({ q, a }, i) => (
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
          Whether you are counting down to a wedding, tracking how many days
          since a milestone, figuring out what date falls 90 days from today, 6
          months from today or verifying a contract deadline, this calculator
          gives you the exact answer in seconds with every unit you might need.
        </p>
        <p>
          For related tools, our{" "}
          <Link href="/age-calculator/" className="my-link">
            age calculator
          </Link>{" "}
          gives your exact age in years, months, and days, our{" "}
          <Link href="/time-calculator/" className="my-link">
            time calculator
          </Link>{" "}
          handles hours and minutes arithmetic, and our{" "}
          <Link href="/loan-calculator/" className="my-link">
            loan calculator
          </Link>{" "}
          shows how time affects financial commitments like EMIs and total
          interest.
        </p>
      </div>

      {/* ── SIDEBAR ── */}
      <aside className="sidebar">
        <div className="cr-desktop-slot">
          <DaysResultPanel result={panelResult} />
        </div>
        <div className="sidebar-box">
          <p style={{ fontSize: "20px", fontWeight: 600 }}>
            Related Calculators
          </p>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {[
              ["/age-calculator/", "Age Calculator"],
              ["/time-calculator/", "Time Calculator"],
              ["/loan-calculator/", "Loan Calculator"],
              ["/emi-calculator/", "EMI Calculator"],
              ["/bmi-calculator/", "BMI Calculator"],
              ["/bill-split-calculator/", "Bill Split Calculator"],
            ].map(([href, label]) => (
              <li key={href}>
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
