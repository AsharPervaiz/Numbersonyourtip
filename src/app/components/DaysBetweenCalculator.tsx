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
    q: "How many days between two dates — do I count both ends?",
    a: "It depends what you are counting, and both answers are defensible. From 1 March to 8 March the difference is seven days, while the number of dates in that range counting both ends is eight. This calculator reports the difference, so 1 January to 3 January is 2. Hotel nights and notice periods usually use the difference; leave and absence usually count both ends.",
  },
  {
    q: "What date is 90 days from today?",
    a: "The Quick Reference table on this page shows it, along with 30, 60, 120, 180 and 365 days, recalculated against the current date each time the page loads. Counting forward manually is error-prone because months have unequal lengths — 90 days from a date in August lands in November, and getting there mentally means tracking which months have 30 days and which have 31.",
  },
  {
    q: "How do I count how many days since a past date?",
    a: "Enter the past date as the start and today as the end. The result is the elapsed number of days, which is the same calculation as any other span — the calculator does not care whether the dates are in the past, the future, or one of each. It always returns the distance between them.",
  },
  {
    q: "Why is five working days not the same as five days?",
    a: "Because weekends fall inside the span, and how many depends on which day you start. Five working days from a Monday is the following Monday, seven calendar days later. Five working days from a Thursday is the Thursday after next, eleven calendar days later. Public holidays extend it further and differ by country and region, so a general tool cannot count them for you.",
  },
  {
    q: "Is 30 days the same as one month?",
    a: "No, and the difference shows up in contracts. Thirty days from 31 January is 2 March in an ordinary year, while one month from the same date is 28 February. Months vary between 28 and 31 days, so any conversion from days to months is an approximation. Weeks are the only larger unit that is exact, at precisely seven days.",
  },
  {
    q: "What happens when you add a month to 31 January?",
    a: "There is no exact answer, because 31 February does not exist. Different systems resolve it differently — some clamp to the last day of the target month, giving 28 or 29 February, and others roll forward into March. If a payment schedule or renewal date depends on month ends, state which rule applies rather than assuming both parties use the same one.",
  },
  {
    q: "What is the actual leap year rule?",
    a: "A year divisible by 4 is a leap year, unless it is divisible by 100, unless it is also divisible by 400. So 1900 was not a leap year and 2000 was — the exception that caught a great deal of software. The next century year to break the pattern is 2100. Any span crossing 29 February contains one extra day, which counting handles automatically and estimating by multiplying years by 365 does not.",
  },
  {
    q: "Why do two people get different answers for the same dates?",
    a: "Usually date format or time zone. 03/04/2026 is 3 April in most of the world and 4 March in the United States, so the same written date produces different spans. A deadline at midnight is also a different moment in different places, and a date recorded in one zone can shift by a day when read in another. Write the month as a word when a date crosses borders.",
  },
  {
    q: "How do I convert a day count into weeks, months or years?",
    a: "Weeks are exact — divide by seven. Months and years are approximations, because months run from 28 to 31 days and years from 365 to 366. This calculator uses 365.25 for fractional years, which is the average across the leap cycle. For anything where the exact date matters, such as a contractual deadline, work in days or name the end date outright.",
  },
];

export default function DaysBetweenDatesCalculator() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [panelResult, setPanelResult] = useState<DaysResult | null>(null);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const toggleFAQ = (i: number) => setOpenFAQ(openFAQ === i ? null : i);
  const handleFAQKey = (e: React.KeyboardEvent, i: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleFAQ(i);
    }
  };

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

        <h1>Days Between Dates — Count Days Since, Until or From a Date</h1>
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

        {/* ---- SEO CONTENT ---- */}

        <h2>Three Different Questions, One Calculator</h2>
        <p>
          People arrive at a date calculator wanting one of three things, and
          although they all involve counting days, they are not the same
          calculation.
        </p>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>You want to know</th>
                <th>You supply</th>
                <th>Typical phrasing</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>How much time has passed</td>
                <td>A past date</td>
                <td>How many days since I started, since we met, since launch</td>
              </tr>
              <tr>
                <td>How much time is left</td>
                <td>A future date</td>
                <td>How many days until the exam, the wedding, the deadline</td>
              </tr>
              <tr>
                <td>What date falls N days out</td>
                <td>A start date and a number of days</td>
                <td>90 days from today, 30 days after invoice, 14 days notice</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          The third is the one people most often work out by hand and get wrong,
          because it requires stepping across month boundaries of unequal length.
          Counting forward 90 days from a date in August lands in November, and
          getting there mentally means knowing whether each intervening month has
          30 or 31 days.
        </p>

        <h3>What Date Falls 30, 60, 90 or 180 Days From Today?</h3>
        <p>
          These are the counts that appear most often in notice periods, refund
          windows and probation terms. The table recalculates against the current
          date every time the page loads, so the answers below are for today
          rather than for whenever this was written.
        </p>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Days from today</th>
                <th>Date</th>
                <th>Equivalent in weeks</th>
              </tr>
            </thead>
            <tbody>
              {[30, 60, 90, 120, 180, 365].map((n) => (
                <tr key={n}>
                  <td>
                    <strong>{n} days</strong>
                  </td>
                  <td>{addDaysToDate(today, n)}</td>
                  <td>
                    {Math.floor(n / 7)} weeks{" "}
                    {n % 7 > 0 ? `& ${n % 7} days` : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p>
          For any other interval, enter today as the start date above and the
          target date as the end date.
        </p>


        <h2>The Off-by-One Problem</h2>
        <p>
          Ask how many days there are between 1 March and 8 March and you can
          justify two answers. The difference is seven days. The number of dates
          in the range, counting both ends, is eight. Neither is wrong; they
          answer different questions.
        </p>
        <pre>
          Difference between the dates = 7{"\n"}Days in the range including both
          ends = 8{"\n"}Days in the range including one end = 7
        </pre>
        <p>
          This matters far more than it sounds, because the convention differs by
          context and money often depends on it.
        </p>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Context</th>
                <th>Usual convention</th>
                <th>Consequence</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Hotel nights</td>
                <td>Exclusive — count nights, not dates</td>
                <td>
                  Checking in on the 1st and out on the 8th is seven nights
                </td>
              </tr>
              <tr>
                <td>Contract notice periods</td>
                <td>Often exclusive of the day of service</td>
                <td>The clock usually starts the following day</td>
              </tr>
              <tr>
                <td>Leave and absence</td>
                <td>Inclusive of both first and last day</td>
                <td>
                  Monday to Friday off is five days, not four
                </td>
              </tr>
              <tr>
                <td>Age and anniversaries</td>
                <td>Exclusive — elapsed time, not dates touched</td>
                <td>You are not one day old on the day you are born</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          When a deadline matters, the safest habit is to state the end date
          explicitly rather than the number of days. &quot;Due by 30
          September&quot; cannot be misread; &quot;due in 30 days&quot; depends
          on whether today counts.
        </p>

        <h2>Calendar Days Are Not Working Days</h2>
        <p>
          A great many delivery promises, refund windows and legal deadlines are
          quoted in working days, which do not map onto calendar days at any
          fixed ratio.
        </p>
        <p>
          Five working days from a Monday is the following Monday — seven
          calendar days. Five working days from a Thursday is the Thursday after
          next — eleven calendar days, because two weekends fall inside it. The
          same promise means different things depending on the day it was made,
          which is why a refund quoted as five working days can arrive anywhere
          from a week to a fortnight later.
        </p>
        <p>
          Public holidays extend it further and are not consistent between
          countries or even between regions of one country. Any working-day
          calculation that crosses a holiday period needs the specific calendar
          for the specific place, which no general tool can supply.
        </p>

        <h2>Days Are Exact. Months and Years Are Not.</h2>
        <p>
          A day is a fixed unit, so a count of days between two dates is an exact
          answer. Convert that to months or years and it stops being exact,
          because those units vary in length.
        </p>
        <ul className="custom-list">
          <li>
            Months run from 28 to 31 days. There is no fixed number of days in a
            month, so &quot;three months&quot; and &quot;90 days&quot; are
            different periods that happen to be close.
          </li>
          <li>
            Years run to 365 or 366 days, so any conversion using 365 drifts by a
            day every four years.
          </li>
          <li>
            Weeks are the only larger unit that is exact, at precisely seven
            days, which is why week counts never disagree.
          </li>
        </ul>
        <p>
          The practical consequence appears in contracts. A payment term of 30
          days from 31 January falls on 2 March in a normal year. A term of one
          month from the same date falls on 28 February. Those are different
          dates from what looks like the same instruction, and which applies
          depends on the wording.
        </p>
        <p>
          Month-end arithmetic has a second trap. Adding one month to 31 January
          has no exact answer, because 31 February does not exist. Different
          systems resolve it differently — some clamp to the last day of the
          target month, others roll into March. If a schedule depends on
          month-end dates, spell out which rule applies rather than assuming.
        </p>

        <h2>Leap Years, and the Rule Most People Half-Know</h2>
        <p>
          The familiar version is that every fourth year has an extra day. The
          full rule has two exceptions, and it exists because a solar year is
          slightly less than 365.25 days.
        </p>
        <pre>
          Divisible by 4 → leap year{"\n"}unless divisible by 100 → not a leap
          year{"\n"}unless also divisible by 400 → leap year after all
        </pre>
        <p>
          So 1900 was not a leap year and 2000 was, which is the case that
          catches people and caught a great deal of software. The next century
          year to break the pattern is 2100, which will not be a leap year
          despite being divisible by four.
        </p>
        <p>
          For everyday spans this matters in one specific way: any period
          crossing 29 February contains one more day than the same span in an
          ordinary year. Counting days between two dates handles this
          automatically. Estimating by multiplying years by 365 does not.
        </p>

        <h2>Where Date Arithmetic Quietly Goes Wrong</h2>
        <ul className="custom-list">
          <li>
            <strong>Ambiguous formats.</strong> 03/04/2026 is 3 April in most of
            the world and 4 March in the United States. When a date crosses
            borders, write the month as a word or use the year-month-day order.
          </li>
          <li>
            <strong>Time zones.</strong> A deadline at midnight is a different
            moment in different places, and a date recorded in one zone can shift
            by a day when read in another. Deadlines that matter should name a
            time zone.
          </li>
          <li>
            <strong>Daylight saving.</strong> Two days a year are not 24 hours
            long. This does not affect whole-day counts, and it does affect
            anything measured in hours across the changeover.
          </li>
          <li>
            <strong>Two-digit years.</strong> Still common in handwritten and
            legacy records, and still ambiguous about the century.
          </li>
          <li>
            <strong>Estimating rather than counting.</strong> Multiplying years
            by 365 to get a day count ignores leap days, so the error grows by
            one day roughly every four years.
          </li>
        </ul>
        <p>
          For an exact age in years, months and days rather than a raw day count,
          use the{" "}
          <Link href="/age-calculator/" className="my-link">
            age calculator
          </Link>
          . For durations measured in hours and minutes instead of dates, the{" "}
          <Link href="/time-calculator/" className="my-link">
            time calculator
          </Link>{" "}
          handles that arithmetic, and our{" "}
          <Link href="/blog/how-to-calculate-exact-age/" className="my-link">
            guide to calculating exact age
          </Link>{" "}
          works through the borrowing rules step by step.
        </p>
        <h2>Date Counting Questions</h2>

        {FAQ_DATA.map(({ q, a }, i) => {
          const isOpen = openFAQ === i;
          return (
            <div className="faq-item" key={i}>
              <h3
                onClick={() => toggleFAQ(i)}
                onKeyDown={(e) => handleFAQKey(e, i)}
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
