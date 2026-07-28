"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

/* ─────────────────────────────────────────
   SEO NOTE (remove before shipping):
   This file is a client component ("use client"),
   so it cannot export Next.js `metadata` directly.
   Set these on the parent server component / layout
   that renders this page:

   SEO Title (58 chars):
   Time Calculator – Add, Subtract & Find Time Duration

   Meta Description (155 chars):
   Free online time calculator to add, subtract, or find
   the duration between two times or dates. Instant HH:MM:SS
   results with no sign-up required.
───────────────────────────────────────── */

/* ─────────────────────────────────────────
   Types
───────────────────────────────────────── */
type TimeMode = "add" | "subtract" | "duration" | "between-dates";

interface TimeResult {
  mode: TimeMode;
  totalMinutes: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalHours: number;
  totalSeconds: number;
  label: string;
}

/* ─────────────────────────────────────────
   Pure helpers
───────────────────────────────────────── */
function needleDeg(ratio: number): number {
  const clamped = Math.min(Math.max(ratio, 0), 1);
  return -90 + clamped * 180;
}

function fieldsToSeconds(h: string, m: string, s: string): number | null {
  if (h === "" && m === "" && s === "") return null;
  const hh = h === "" ? 0 : Number(h);
  const mm = m === "" ? 0 : Number(m);
  const ss = s === "" ? 0 : Number(s);
  if (isNaN(hh) || isNaN(mm) || isNaN(ss)) return null;
  return hh * 3600 + mm * 60 + ss;
}

function secondsToResult(totalSec: number, mode: TimeMode): TimeResult {
  const sign = totalSec < 0 ? -1 : 1;
  const absSec = Math.abs(totalSec);
  const h = Math.floor(absSec / 3600);
  const mn = Math.floor((absSec % 3600) / 60);
  const s = absSec % 60;
  const label = `${h.toString().padStart(2, "0")}:${mn.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  return {
    mode,
    totalMinutes: sign * Math.floor(absSec / 60),
    hours: sign * h,
    minutes: sign * mn,
    seconds: sign * s,
    totalHours: (sign * absSec) / 3600,
    totalSeconds: sign * absSec,
    label,
  };
}

/* ─────────────────────────────────────────
   FAQ data — reused for both the visible
   accordion and the FAQPage JSON-LD schema
───────────────────────────────────────── */
const FAQS: { q: string; a: string }[] = [
  {
    q: "How do I add hours and minutes?",
    a: "Enter the hours, minutes, and seconds in the separate fields for each time, select Add Times mode, and click Calculate. The calculator carries over minutes into hours and seconds into minutes automatically, so you never have to do the base-60 math by hand.",
  },
  {
    q: "Can I subtract a larger time from a smaller time?",
    a: "Yes. If the result would be negative — for example 1:00 minus 3:00 — the calculator shows a negative result with a minus sign. This is useful when you need to know how far behind or over a time target you are, such as tracking a budget overrun on a task.",
  },
  {
    q: "What is the difference between Add Times and Duration?",
    a: "Add Times combines two time values arithmetically, which is useful for totaling hours worked or adding task lengths together. Duration finds the absolute gap between two clock times, which is useful for measuring how long something actually took from a start to an end point.",
  },
  {
    q: "Can I enter hours greater than 24?",
    a: "Yes. This calculator isn't restricted to a 24-hour clock, so you can enter values like 36:00 to represent time spans that stretch across multiple days — handy for multi-day project totals or long-haul travel time.",
  },
  {
    q: "How do I convert minutes to hours and minutes?",
    a: "Divide the total minutes by 60. The whole number is the hours and the remainder is the minutes — for example, 145 minutes divided by 60 is 2 remainder 25, so that's 2 hours 25 minutes. The calculator does this conversion automatically in the results panel.",
  },
  {
    q: "How do I convert decimal hours to hours and minutes?",
    a: "Multiply the decimal portion by 60. For 7.5 hours, the 0.5 becomes 0.5 × 60 = 30 minutes, so 7.5 hours equals 7 hours 30 minutes. This is the conversion payroll systems use when timesheets are recorded in decimal format instead of HH:MM.",
  },
  {
    q: "How many hours are between two times?",
    a: "Switch to Duration mode, enter the start time as your first time and the end time as your second time, and the calculator returns the absolute gap between them in hours, minutes, and seconds — no need to work out AM/PM crossovers yourself.",
  },
  {
    q: "Does this calculator work across two different dates?",
    a: "For time-of-day math within a single day, use Add, Subtract, or Duration mode. If your two points span different calendar dates — say, a shift that starts one evening and ends the next morning — use Between Dates mode, which accounts for the full day boundary.",
  },
  {
    q: "What format should I use for seconds?",
    a: "Use the dedicated Seconds field and enter the number directly. Leave it empty or at 0 if you only need to work with hours and minutes.",
  },
];

/* ─────────────────────────────────────────
   TimeResultPanel
───────────────────────────────────────── */
function TimeResultPanel({ result }: { result: TimeResult | null }) {
  if (!result) {
    return (
      <div className="cr-panel-placeholder">
        <div className="cr-ph-icon">
          <i className="fa-solid fa-clock" aria-hidden="true" />
        </div>
        Enter your time values to see the result here.
      </div>
    );
  }

  const {
    mode,
    totalMinutes,
    hours,
    minutes,
    seconds,
    totalHours,
    totalSeconds,
    label,
  } = result;
  const absMinutes = Math.abs(totalMinutes);
  const absHours = Math.abs(totalHours);
  const isNegative = totalMinutes < 0;

  const scaleMax = 24;
  const ratio = Math.min(absHours / scaleMax, 1);
  const barPct = 2 + ratio * 96;

  const durationLabel =
    absMinutes === 0
      ? "No duration"
      : absMinutes < 60
        ? "Under an hour"
        : absMinutes < 180
          ? "A few hours"
          : absMinutes < 480
            ? "Half a day"
            : absMinutes < 1440
              ? "Most of a day"
              : "Over a day";

  const durationBadge =
    absMinutes === 0
      ? "info"
      : absMinutes < 60
        ? "info"
        : absMinutes < 480
          ? "normal"
          : absMinutes < 1440
            ? "warning"
            : "danger";

  const modeLabel =
    mode === "add"
      ? "sum"
      : mode === "subtract"
        ? "difference"
        : mode === "between-dates"
          ? "between dates"
          : "duration";

  return (
    <div className="cr-panel">
      <div className="cr-gauge-wrap">
        <svg
          className="cr-gauge-svg"
          width="100"
          height="60"
          viewBox="0 0 120 70"
          role="img"
          aria-label={`Time gauge: ${absHours.toFixed(1)} hours`}
        >
          <defs>
            <clipPath id="time-half">
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
            strokeDasharray="65 326"
            strokeDashoffset="-163"
            clipPath="url(#time-half)"
          />
          <circle
            cx="60"
            cy="65"
            r="52"
            fill="none"
            stroke="#97C459"
            strokeWidth="12"
            strokeDasharray="65 326"
            strokeDashoffset="-228"
            clipPath="url(#time-half)"
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
            clipPath="url(#time-half)"
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
            clipPath="url(#time-half)"
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
          <div className="cr-score" style={{ fontSize: "28px" }}>
            {isNegative ? "−" : ""}
            {label}
          </div>
          <div className="cr-score-label">{modeLabel}</div>
          <span className={`cr-badge ${durationBadge}`}>{durationLabel}</span>
        </div>
      </div>

      <hr className="cr-divider" />

      <div>
        <div className="cr-bar-label">
          duration — {absHours.toFixed(2)} hours (0–24h scale)
        </div>
        <div
          className="cr-bar-track"
          style={{
            background:
              "linear-gradient(to right, #B5D4F4 0%, #97C459 25%, #FAC775 60%, #F09595 100%)",
          }}
        >
          <div className="cr-bar-thumb" style={{ left: `${barPct}%` }} />
        </div>
        <div className="cr-bar-ticks">
          <span>0</span>
          <span>6h</span>
          <span>12h</span>
          <span>18h</span>
          <span>24h</span>
        </div>
      </div>

      <hr className="cr-divider" />

      <div className="cr-metrics-grid">
        <div className="cr-metric-card">
          <div className="cr-m-label">Hours</div>
          <div className="cr-m-value">{Math.abs(hours)}</div>
          <div className="cr-m-sub">h component</div>
        </div>
        <div className="cr-metric-card">
          <div className="cr-m-label">Minutes</div>
          <div className="cr-m-value">{Math.abs(minutes)}</div>
          <div className="cr-m-sub">min component</div>
        </div>
        <div className="cr-metric-card">
          <div className="cr-m-label">Total minutes</div>
          <div className="cr-m-value">
            {Math.abs(totalMinutes).toLocaleString()}
          </div>
          <div className="cr-m-sub">all in minutes</div>
        </div>
        <div className="cr-metric-card">
          <div className="cr-m-label">Total seconds</div>
          <div className="cr-m-value">
            {Math.abs(totalSeconds).toLocaleString()}
          </div>
          <div className="cr-m-sub">all in seconds</div>
        </div>
      </div>

      <hr className="cr-divider" />

      <div>
        <div className="cr-world-title">duration breakdown</div>
        <div className="cr-world-bar-row">
          <span className="cr-w-label">Hours</span>
          <div className="cr-world-track">
            <div
              className="cr-world-fill"
              style={{
                width: `${absMinutes > 0 ? Math.round(((Math.abs(hours) * 60) / absMinutes) * 100) : 0}%`,
                background: "#378ADD",
              }}
            />
          </div>
          <span className="cr-w-pct" style={{ width: "40px" }}>
            {Math.abs(hours)}h
          </span>
        </div>
        <div className="cr-world-bar-row">
          <span className="cr-w-label">Minutes</span>
          <div className="cr-world-track">
            <div
              className="cr-world-fill"
              style={{
                width: `${absMinutes > 0 ? Math.round((Math.abs(minutes) / absMinutes) * 100) : 0}%`,
                background: "#97C459",
              }}
            />
          </div>
          <span className="cr-w-pct" style={{ width: "40px" }}>
            {Math.abs(minutes)}m
          </span>
        </div>
        <p className="cr-world-note">
          {isNegative ? "Negative result — " : ""}
          Result:{" "}
          <strong>
            {isNegative ? "−" : ""}
            {label}
          </strong>{" "}
          = {Math.abs(totalMinutes).toLocaleString()} minutes ={" "}
          {Math.abs(totalSeconds).toLocaleString()} seconds
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Main Calculator Page
───────────────────────────────────────── */
export default function TimeCalculator() {
  const [mode, setMode] = useState<TimeMode>("add");

  /* H / M / S — set 1 */
  const [h1, setH1] = useState("");
  const [m1, setM1] = useState("");
  const [s1, setS1] = useState("");

  /* H / M / S — set 2 */
  const [h2, setH2] = useState("");
  const [m2, setM2] = useState("");
  const [s2, setS2] = useState("");

  /* Between-dates mode */
  const [date1, setDate1] = useState("");
  const [date2, setDate2] = useState("");

  const [panelResult, setPanelResult] = useState<TimeResult | null>(null);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const toggleFAQ = (i: number) => setOpenFAQ(openFAQ === i ? null : i);

  /* ── Compute ── */
  const compute = (): TimeResult | null => {
    if (mode === "between-dates") {
      if (!date1 || !date2) return null;
      const d1 = new Date(date1);
      const d2 = new Date(date2);
      if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return null;
      const diffSec = Math.round((d2.getTime() - d1.getTime()) / 1000);
      return secondsToResult(Math.abs(diffSec), "between-dates");
    }
    const sec1 = fieldsToSeconds(h1, m1, s1);
    const sec2 = fieldsToSeconds(h2, m2, s2);
    if (sec1 === null || sec2 === null) return null;
    if (mode === "add") return secondsToResult(sec1 + sec2, "add");
    if (mode === "subtract") return secondsToResult(sec1 - sec2, "subtract");
    return secondsToResult(Math.abs(sec1 - sec2), "duration");
  };

  useEffect(() => {
    setPanelResult(compute());
  }, [h1, m1, s1, h2, m2, s2, date1, date2, mode]);

  const calculate = () => setPanelResult(compute());
  const handleClear = () => {
    setH1("");
    setM1("");
    setS1("");
    setH2("");
    setM2("");
    setS2("");
    setDate1("");
    setDate2("");
    setPanelResult(null);
  };

  const switcherStyle = (m: TimeMode): React.CSSProperties => ({
    flex: "0 0 calc(50% - 5px)", // 2 items per row
    textAlign: "center",
    padding: "12px",
    borderRadius: "2px",
    border: mode === m ? "2px solid #dededea1" : "1px solid #ececec6b",
    background: "#1f9fb8",
    cursor: "pointer",
    fontWeight: mode === m ? 600 : 400,
    color: "white",
    transition: "0.2s",
    fontSize: "14px",
    boxSizing: "border-box",
  });

  /* ── H/M/S row using calc-input class ── */
  const TimeRow = ({
    rowLabel,
    hVal,
    mVal,
    sVal,
    onH,
    onM,
    onS,
  }: {
    rowLabel: string;
    hVal: string;
    mVal: string;
    sVal: string;
    onH: (v: string) => void;
    onM: (v: string) => void;
    onS: (v: string) => void;
  }) => (
    <div>
      <p
        style={{
          color: "white",
          fontWeight: 600,
          marginBottom: "5px",
          marginTop: "0",
        }}
      >
        {rowLabel}
      </p>
      <div style={{ display: "flex", gap: "10px" }}>
        <div style={{ flex: 1 }}>
          <input
            className="calc-input"
            type="number"
            min="0"
            placeholder="Hours"
            value={hVal}
            onChange={(e) => onH(e.target.value)}
            style={{ margin: 0 }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <input
            className="calc-input"
            type="number"
            min="0"
            max="59"
            placeholder="Mins"
            value={mVal}
            onChange={(e) => onM(e.target.value)}
            style={{ margin: 0 }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <input
            className="calc-input"
            type="number"
            min="0"
            max="59"
            placeholder="Secs"
            value={sVal}
            onChange={(e) => onS(e.target.value)}
            style={{ margin: 0 }}
          />
        </div>
      </div>
    </div>
  );

  /* FAQPage JSON-LD, generated once from the FAQS array above */
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };

  return (
    <div className="page-layout">
      {/* FAQ structured data for rich results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="single-page-padding">
        <h1>Time Calculator</h1>
        <p>
          This free online time calculator adds, subtracts, and finds the
          duration between two times or dates in seconds. Whether you need a
          quick time difference calculator for a work shift or an hours and
          minutes calculator for a school project, just enter your values in
          HH:MM or HH:MM:SS format below and get an instant, accurate result.
        </p>

        <div className="calc-card single-calc">
          {/* ── 4 switchers: 2 per row ── */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              marginBottom: "15px",
            }}
          >
            {/* Row 1 */}
            <div
              style={switcherStyle("add")}
              onClick={() => {
                setMode("add");
                setPanelResult(null);
              }}
            >
              Add Times
            </div>
            <div
              style={switcherStyle("subtract")}
              onClick={() => {
                setMode("subtract");
                setPanelResult(null);
              }}
            >
              Subtract Times
            </div>
            {/* Row 2 */}
            <div
              style={switcherStyle("duration")}
              onClick={() => {
                setMode("duration");
                setPanelResult(null);
              }}
            >
              Time Duration
            </div>
            <div
              style={switcherStyle("between-dates")}
              onClick={() => {
                setMode("between-dates");
                setPanelResult(null);
              }}
            >
              Between Dates
            </div>
          </div>

          {/* ── Time modes: H / M / S separate fields ── */}
          {mode !== "between-dates" && (
            <>
              <TimeRow
                rowLabel={mode === "duration" ? "Start Time" : "First Time"}
                hVal={h1}
                mVal={m1}
                sVal={s1}
                onH={setH1}
                onM={setM1}
                onS={setS1}
              />
              <TimeRow
                rowLabel={mode === "duration" ? "End Time" : "Second Time"}
                hVal={h2}
                mVal={m2}
                sVal={s2}
                onH={setH2}
                onM={setM2}
                onS={setS2}
              />
            </>
          )}

          {/* ── Between dates mode ── */}
          {mode === "between-dates" && (
            <>
              <p
                style={{
                  color: "white",
                  fontWeight: 600,
                  marginBottom: "5px",
                  marginTop: "0px",
                }}
              >
                Start Date &amp; Time
              </p>
              <input
                className="calc-input"
                type="datetime-local"
                value={date1}
                onChange={(e) => setDate1(e.target.value)}
              />
              <p
                style={{
                  color: "white",
                  fontWeight: 600,
                  marginBottom: "5px",
                  marginTop: "10px",
                }}
              >
                End Date &amp; Time
              </p>
              <input
                className="calc-input"
                type="datetime-local"
                value={date2}
                onChange={(e) => setDate2(e.target.value)}
              />
            </>
          )}

          {/* Buttons */}
          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <button className="calc-button" onClick={calculate}>
              Calculate
            </button>
            <button className="calc-button calc-clear" onClick={handleClear}>
              Clear
            </button>
          </div>
        </div>

        {/* Mobile result panel */}
        <div className="cr-mobile-slot">
          <TimeResultPanel result={panelResult} />
        </div>

        {/* ── SEO CONTENT ── */}

        <h2>What Is a Time Calculator?</h2>
        <p>
          A time calculator is a tool that performs arithmetic on time values —
          adding, subtracting, or finding the duration between two specific
          times or dates. Unlike a standard calculator that works in base 10, a
          time calculator has to handle the base-60 nature of minutes and
          seconds and the base-24 nature of hours, so you get an accurate
          HH:MM:SS result without doing the carrying and borrowing by hand.
        </p>
        <p>
          People use time calculators for scheduling, payroll, project planning,
          sports timing, cooking, travel planning, video editing, and any
          situation where hours, minutes, and seconds need to be combined or
          compared.
        </p>

        <h2>How to Add Times</h2>
        <p>
          Adding two time values means combining their hours, minutes, and
          seconds. The rule to remember: carry a minute over to the hours column
          once minutes reach 60, and carry a second over to the minutes column
          once seconds reach 60.
        </p>
        <pre>
          2:45:30{"\n"}+ 1:30:45{"\n"}
          ─────────{"\n"}
          4:16:15
        </pre>
        <p>
          Step by step: 30 + 45 = 75 seconds, which is 1 minute 15 seconds. 45 +
          30 + the 1 carried minute = 76 minutes, which is 1 hour 16 minutes. 2
          + 1 + the 1 carried hour = 4 hours. Result: <strong>4:16:15</strong>.
        </p>

        <h2>How to Subtract Times</h2>
        <p>
          Subtracting times works the same way in reverse, with borrowing
          whenever the top value is smaller than the bottom one:
        </p>
        <pre>
          5:10:00{"\n"}− 2:45:30{"\n"}
          ─────────{"\n"}
          2:24:30
        </pre>
        <p>
          Step by step: 0 − 30 seconds needs a borrow, so it becomes 60 − 30 =
          30 seconds (and the minutes column drops by 1). 10 − 1 − 45 minutes
          also needs a borrow: 69 − 45 = 24 minutes (and the hours column drops
          by 1). 5 − 1 − 2 = 2 hours. Result: <strong>2:24:30</strong>. If the
          second time is larger than the first, the calculator above will return
          a negative result rather than an error — see the FAQ on negative
          results below.
        </p>

        <h2>How to Find Duration Between Two Times</h2>
        <p>
          Duration is the absolute difference between a start time and an end
          time, regardless of which one is larger. It answers "how long did this
          actually take":
        </p>
        <pre>
          Start Time: 09:30:00{"\n"}
          End Time: 17:45:00{"\n"}
          Duration: 8:15:00 (8 hours 15 minutes)
        </pre>

        <h2>Calculating Duration Between Two Dates</h2>
        <p>
          Sometimes the two points you're comparing don't fall on the same
          calendar day — an overnight shift, a multi-day event, or a flight that
          crosses midnight. For those, switch to Between Dates mode instead of
          Duration mode. It takes a full start date-and-time and end
          date-and-time, so the day boundary is handled automatically instead of
          producing a confusing negative number. If you only need the number of
          calendar days rather than an exact elapsed time, the{" "}
          <Link className="my-link" href="/days-between-calculator/">
            Days Between Dates Calculator
          </Link>{" "}
          is the more direct tool for that specific question.
        </p>

        <h2>Military Time vs. 12-Hour Time</h2>
        <p>
          The 24-hour clock, often called military time, numbers the hours from
          00 to 23 instead of splitting the day into two 12-hour AM/PM blocks.
          13:00 is 1:00 PM, 18:30 is 6:30 PM, and midnight is written as 00:00.
          This calculator accepts hour values above 23 as well, which isn't
          standard 24-hour time — it's a running total, useful for expressing
          durations that stretch across more than one day, such as "the project
          took 36 hours" instead of "1 day 12 hours."
        </p>

        <h2>Converting Decimal Hours to Hours and Minutes</h2>
        <p>
          Payroll software and spreadsheets often store time as a decimal — 7.5
          hours instead of 7:30. To convert, multiply the decimal part by 60.
          The table below covers the conversions people look up most often:
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
                  Decimal Hours
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Hours &amp; Minutes
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                ["0.25 hr", "15 min"],
                ["0.50 hr", "30 min"],
                ["0.75 hr", "45 min"],
                ["1.5 hr", "1 hr 30 min"],
                ["2.25 hr", "2 hr 15 min"],
                ["7.5 hr", "7 hr 30 min"],
              ].map((row) => (
                <tr key={row[0]}>
                  {row.map((cell, i) => (
                    <td
                      key={i}
                      style={{ padding: "10px", border: "1px solid #ddd" }}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>Time Format Guide</h2>
        <p>This calculator accepts times in two standard formats:</p>
        <ul className="custom-list">
          <li>
            <strong>HH:MM</strong> — hours and minutes only. Example:{" "}
            <code>3:45</code> means 3 hours and 45 minutes.
          </li>
          <li>
            <strong>HH:MM:SS</strong> — hours, minutes, and seconds. Example:{" "}
            <code>1:30:20</code> means 1 hour, 30 minutes, and 20 seconds.
          </li>
        </ul>
        <p>
          Hours can exceed 23 — this calculator is not limited to a 24-hour
          clock. You can enter values like <code>36:00</code> to represent 36
          hours.
        </p>

        <h2>How to Calculate Work Hours for Payroll</h2>
        <p>
          A common use of this time duration calculator is turning a clock-in
          and clock-out time into billable or payable hours. Say an employee
          clocks in at 8:52 AM and clocks out at 5:07 PM. Enter 8:52 as the
          start time and 17:07 as the end time in Duration mode, and the
          calculator returns 8 hours 15 minutes. Many payroll policies then
          round that figure to the nearest quarter hour — 8:15 in this case
          needs no rounding, but 8:07 would typically round down to 8:00 and
          8:23 would round up to 8:30, depending on your company's rounding
          rules. Once you have hours per shift, the{" "}
          <Link className="my-link" href="/salary-hike-calculator/">
            Salary Hike Calculator
          </Link>{" "}
          can help you work out what a change in hourly rate does to total pay.
        </p>

        <h2>Understanding a Negative Time Result</h2>
        <p>
          In Subtract mode, if the second time you enter is later than the
          first, the result will be negative — shown with a leading minus sign,
          like <strong>−1:15:00</strong>. This isn't an error; it simply means
          the second value was larger than the first, which is useful for
          flagging when a task ran over its allotted time or when a countdown
          has passed zero. If you always want a positive, "how much time passed"
          answer regardless of order, use Duration mode instead — it always
          returns the absolute difference.
        </p>

        <h2>Common Uses of a Time Calculator</h2>
        <ul className="custom-list">
          <li>
            <strong>Payroll and work hours:</strong> Add up daily work hours
            across the week to calculate total hours worked for salary or
            billing purposes.
          </li>
          <li>
            <strong>Project and task management:</strong> Estimate total time
            required by adding individual task durations.
          </li>
          <li>
            <strong>Sports and fitness timing:</strong> Calculate lap times,
            race durations, training session lengths, or workout intervals.
          </li>
          <li>
            <strong>Video and audio editing:</strong> Add clip durations, find
            the total runtime of a project, or calculate the time remaining in a
            sequence.
          </li>
          <li>
            <strong>Cooking and baking:</strong> Add cooking, resting, and prep
            times to find when a meal will be ready.
          </li>
          <li>
            <strong>Travel planning:</strong> Add flight duration, layover time,
            and transfer time to calculate total travel time.
          </li>
          <li>
            <strong>Meeting and schedule planning:</strong> Add meeting
            durations to find when a series of back-to-back meetings ends.
          </li>
          <li>
            <strong>Scientific and academic research:</strong> Precisely
            calculate experiment durations and observation windows.
          </li>
          <li>
            <strong>Time Units Conversion:</strong> Like how many hours in a
            month or etc.
          </li>
        </ul>

        <h2>Time Conversion Reference</h2>
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
                  Unit
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Equals
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                ["1 minute", "60 seconds"],
                ["1 hour", "60 minutes = 3,600 seconds"],
                ["1 day", "24 hours = 1,440 minutes = 86,400 seconds"],
                ["1 week", "7 days = 168 hours = 10,080 minutes"],
                ["1 month", "≈ 30.44 days = ≈ 730.5 hours"],
                ["1 year", "365 days (366 in leap year) = 8,760 hours"],
              ].map((row) => (
                <tr key={row[0]}>
                  {row.map((cell, i) => (
                    <td
                      key={i}
                      style={{ padding: "10px", border: "1px solid #ddd" }}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>Frequently Asked Questions</h2>

        {FAQS.map((item, i) => (
          <div className="faq-item" key={i}>
            <h3 onClick={() => toggleFAQ(i)}>
              {item.q}
              <i
                className={`fa-solid fa-chevron-down ${openFAQ === i ? "rotate" : ""}`}
              />
            </h3>
            {openFAQ === i && <p>{item.a}</p>}
          </div>
        ))}

        <h2>Final Thoughts</h2>
        <p>
          Whether you're adding up a timesheet, subtracting a break from a
          shift, or working out the duration between two dates, this time
          calculator handles the HH:MM:SS math instantly so you don't have to
          carry and borrow by hand. Bookmark it for payroll, project planning,
          or any time you need a fast, accurate time difference calculator.
        </p>
      </div>

      {/* ── SIDEBAR ── */}
      <aside className="sidebar">
        <div className="cr-desktop-slot">
          <TimeResultPanel result={panelResult} />
        </div>
        <div className="sidebar-box">
          <p style={{ fontSize: "20px", fontWeight: 600 }}>
            Related Calculators
          </p>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {[
              ["/days-between-dates-calculator/", "Days Between Dates"],
              ["/age-calculator/", "Age Calculator"],
              ["/bmi-calculator/", "BMI Calculator"],
              ["/salary-hike-calculator/", "Salary Hike Calculator"],
              ["/emi-calculator/", "EMI Calculator"],
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
