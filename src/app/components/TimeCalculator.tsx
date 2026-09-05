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
    q: "Why is my time answer showing more than 60 minutes?",
    a: "The addition worked but the carry did not. Time runs in base 60, so any minute figure of 60 or above needs converting into hours: 3 hours 75 minutes is 4 hours 15 minutes. Do the minutes column first, subtract 60 and add an hour whenever it overflows, then finish the hours.",
  },
  {
    q: "Is 7.5 hours the same as 7 hours 50 minutes?",
    a: "No — it is 7 hours 30 minutes. The decimal part is a fraction of an hour, so you multiply it by 60 rather than reading it as minutes. Half an hour is 0.5 and thirty minutes. This is the most expensive confusion in timesheets, because decimal payroll systems and human minutes look identical on the page.",
  },
  {
    q: "How do I convert minutes into decimal hours?",
    a: "Divide the minutes by 60. Ten minutes is 0.17 of an hour, fifteen is 0.25, and forty-five is 0.75. Entering 8 hours 10 minutes into a decimal timesheet as 8.10 rather than 8.17 understates the shift by four minutes, which compounds into most of an hour over a month.",
  },
  {
    q: "How do I calculate hours for a shift that crosses midnight?",
    a: "Add 24 hours to the finish time before subtracting. A shift from 22:00 to 06:00 gives a nonsensical negative if you subtract directly, but 30:00 minus 22:00 gives the correct 8 hours. A negative time result is nearly always a missing day boundary rather than an arithmetic mistake.",
  },
  {
    q: "Is 12:00 AM midnight or midday?",
    a: "Midnight, and it is the start of the day rather than the end. Midday is 12:00 PM, which reads oddly since AM means before noon. Because people genuinely read these both ways, a deadline of midnight on the 15th is ambiguous. Writing 23:59 on the 15th, or using 24-hour notation throughout, removes the problem.",
  },
  {
    q: "How do I add up a whole week of shifts without errors?",
    a: "Convert every entry to minutes, add them all in minutes, then convert once at the end. A week of 7h45, 8h15, 6h30, 8h00 and 7h20 becomes 2,270 minutes, which is 37 hours 50 minutes. Doing one conversion at the end replaces four separate chances to carry incorrectly.",
  },
  {
    q: "Why does my employer round my clock-in times?",
    a: "Rounding to a fixed interval, often six or fifteen minutes, simplifies payroll. It is neutral only when it rounds in both directions — within seven minutes of a quarter hour rounds down, beyond that rounds up, and over many shifts the differences cancel. Rounding that always moves the same way is a systematic deduction rather than rounding.",
  },
  {
    q: "Why do professional timesheets use six-minute blocks?",
    a: "Because six minutes is exactly a tenth of an hour, which makes decimal billing trivial. Twelve minutes is 0.2, eighteen is 0.3, thirty is 0.5. Any interval that divides cleanly into 60 avoids the recurring decimals that make other rounding units awkward to total.",
  },
  {
    q: "Why did subtracting one time from another give a negative number?",
    a: "Either the span crosses midnight, in which case add 24 hours to the end time, or the times were entered in the wrong order. In the second case the magnitude is correct and only the sign is wrong, so reversing the inputs gives the answer you wanted.",
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
        <h1>Time Calculator — Add, Subtract and Convert Hours</h1>
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

        {/* ---- SEO CONTENT ---- */}

        <h2>Time Arithmetic Is Base 60, and That Is the Whole Problem</h2>
        <p>
          Everything else you add and subtract runs in tens. Time does not.
          Sixty minutes make an hour, sixty seconds make a minute, and the
          carrying and borrowing rules change accordingly. Almost every mistake
          people make with time comes from applying decimal habits to a
          sexagesimal system.
        </p>
        <p>
          The clearest symptom is an answer containing a number of minutes above
          59. If a result reads 3 hours 75 minutes, the addition was done but the
          carry was not: 75 minutes is 1 hour 15 minutes, so the answer is 4
          hours 15 minutes.
        </p>

        <h2>Adding and Subtracting: the Carry and the Borrow</h2>
        <p>
          Work the minutes first, then resolve any overflow into the hours
          column.
        </p>
        <pre>
          2h 45m + 1h 40m{"\n"}Minutes: 45 + 40 = 85{"\n"}85 ≥ 60, so carry: 85 −
          60 = 25 minutes, and hours gain 1{"\n"}Hours: 2 + 1 + 1 = 4{"\n"}Result:
          4h 25m
        </pre>
        <p>Subtraction borrows in the opposite direction.</p>
        <pre>
          5h 10m − 2h 35m{"\n"}Minutes: 10 − 35 is negative, so borrow an hour
          {"\n"}Minutes: 70 − 35 = 35{"\n"}Hours: 4 − 2 = 2{"\n"}Result: 2h 35m
        </pre>
        <p>
          Borrowing an hour adds 60 to the minutes, not 100. Writing 110 instead
          of 70 is the single most common slip in manual time subtraction, and
          it inflates the answer by forty minutes.
        </p>

        <h2>Decimal Hours Are Not Hours and Minutes</h2>
        <p>
          This is where real money is lost, because payroll systems and
          timesheets often work in decimal hours while people think in minutes.
        </p>
        <p>
          A shift of 7.5 hours is 7 hours 30 minutes, because 0.5 of an hour is
          half of 60. It is not 7 hours 50 minutes. The decimal part is a
          fraction of an hour, so it must be multiplied by 60 rather than read as
          minutes.
        </p>
        <pre>
          Decimal → minutes: multiply the fraction by 60{"\n"}Minutes → decimal:
          divide the minutes by 60
        </pre>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Decimal hours</th>
                <th>Hours and minutes</th>
                <th>Commonly misread as</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>7.25</td>
                <td>7h 15m</td>
                <td>7h 25m</td>
              </tr>
              <tr>
                <td>7.50</td>
                <td>7h 30m</td>
                <td>7h 50m</td>
              </tr>
              <tr>
                <td>7.75</td>
                <td>7h 45m</td>
                <td>7h 75m</td>
              </tr>
              <tr>
                <td>8.10</td>
                <td>8h 6m</td>
                <td>8h 10m</td>
              </tr>
              <tr>
                <td>8.33</td>
                <td>8h 20m</td>
                <td>8h 33m</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          The 8.10 row is the one that costs people. Entering 8 hours 10 minutes
          into a decimal timesheet as 8.10 overstates the shift by four minutes,
          because 8 hours 10 minutes is 8.17 in decimal. Repeated daily, that is
          most of an hour a month in the wrong direction.
        </p>

        <h2>Crossing Midnight</h2>
        <p>
          A shift from 22:00 to 06:00 produces a negative result if you subtract
          directly, because the end time is numerically smaller than the start.
          The fix is to recognise that the span crosses into the next day and add
          24 hours to the end time.
        </p>
        <pre>
          06:00 − 22:00 = −16 hours (wrong){"\n"}(06:00 + 24h) − 22:00 = 30:00 −
          22:00 = 8 hours (correct)
        </pre>
        <p>
          A negative time result is therefore usually not an error in the
          arithmetic but a missing day boundary. The exception is when you
          genuinely subtracted a later time from an earlier one, in which case
          the magnitude is right and the sign tells you the order was reversed.
        </p>

        <h2>12-Hour and 24-Hour Notation</h2>
        <p>
          The 24-hour clock exists because the 12-hour one is ambiguous at
          exactly the two points people most often need to be precise about.
        </p>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>12-hour</th>
                <th>24-hour</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>12:00 AM</td>
                <td>00:00</td>
                <td>Midnight — the start of the day, not the end</td>
              </tr>
              <tr>
                <td>12:00 PM</td>
                <td>12:00</td>
                <td>Midday — despite AM meaning before noon</td>
              </tr>
              <tr>
                <td>1:00 PM</td>
                <td>13:00</td>
                <td>Add 12 to any PM hour except 12 itself</td>
              </tr>
              <tr>
                <td>11:59 PM</td>
                <td>23:59</td>
                <td>The last minute of the day</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          A deadline of &quot;midnight on the 15th&quot; is genuinely ambiguous —
          it can mean the moment the 15th begins or the moment it ends, and
          people read it both ways. Writing 23:59 on the 15th removes the
          ambiguity entirely, which is why contracts and systems use it.
        </p>

        <h2>Timesheets and Rounding</h2>
        <p>
          Many workplaces round clock entries to a fixed interval, commonly to
          the nearest six or fifteen minutes. The mechanism is neutral only if
          it rounds in both directions.
        </p>
        <p>
          Rounding to the nearest quarter hour means anything within seven
          minutes rounds down and anything beyond rounds up, so over many shifts
          the gains and losses cancel. Rounding that only ever moves against the
          worker — always down on arrival, always up on departure — is not
          rounding but systematic deduction, and it is worth checking which
          version your timesheet applies.
        </p>
        <p>
          Six-minute intervals are common in professional billing because each
          one is exactly 0.1 of an hour, which makes the decimal conversion
          trivial. Twelve minutes is 0.2, eighteen is 0.3, and so on.
        </p>

        <h2>Adding Time Across Many Entries</h2>
        <p>
          Summing a week of shifts by hand invites carry errors at every step.
          The reliable method is to convert everything to a single unit first,
          add in that unit, then convert once at the end.
        </p>
        <pre>
          Convert each entry to minutes{"\n"}Add all the minutes{"\n"}Divide the
          total by 60 for hours; the remainder is the minutes
        </pre>
        <p>
          A week of 7h 45m, 8h 15m, 6h 30m, 8h 00m and 7h 20m becomes 465 + 495 +
          390 + 480 + 440 = 2,270 minutes. Dividing by 60 gives 37 with a
          remainder of 50, so 37 hours 50 minutes. One conversion at the end
          replaces four opportunities to carry incorrectly.
        </p>
        <p>
          For spans measured in days rather than hours, the{" "}
          <Link href="/days-between-calculator/" className="my-link">
            days between dates calculator
          </Link>{" "}
          handles calendar arithmetic, and the{" "}
          <Link href="/time-zone-converter/" className="my-link">
            time zone converter
          </Link>{" "}
          covers times in different places.
        </p>
        <h2>Time Calculation Questions</h2>

        {FAQS.map((item, i) => {
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
                {item.q}
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
                  <p>{item.a}</p>
                </div>
              </div>
            </div>
          );
        })}

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
              ["/days-between-calculator/", "Days Between Dates"],
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
