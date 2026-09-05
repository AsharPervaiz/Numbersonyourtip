"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

/* ─────────────────────────────────────────
   Types
───────────────────────────────────────── */
interface PctResult {
  value: number;
  percentage: number;
  result: number;
  resultAsPctOfValue: number;
}

/* ─────────────────────────────────────────
   Pure helper
───────────────────────────────────────── */
function needleDeg(ratio: number): number {
  const clamped = Math.min(Math.max(ratio, 0), 1);
  return -90 + clamped * 180;
}

/* ─────────────────────────────────────────
   PercentageResultPanel — UNCHANGED
───────────────────────────────────────── */
function PercentageResultPanel({ result }: { result: PctResult | null }) {
  if (!result) {
    return (
      <div className="cr-panel-placeholder">
        <div className="cr-ph-icon">
          <i className="fa-solid fa-percent" aria-hidden="true" />
        </div>
        Enter a value and percentage to see the result here.
      </div>
    );
  }

  const { value, percentage, result: res } = result;

  const fmt = (n: number) =>
    n.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const ratio = Math.min(percentage / 100, 1);
  const barPct = 2 + ratio * 96;

  const pctLabel =
    percentage < 10
      ? "Tiny fraction"
      : percentage < 25
        ? "Small portion"
        : percentage < 50
          ? "Moderate"
          : percentage < 75
            ? "Majority"
            : percentage < 100
              ? "Large portion"
              : "Whole";

  const pctBadge =
    percentage < 25
      ? "info"
      : percentage < 50
        ? "normal"
        : percentage < 75
          ? "warning"
          : "danger";

  const resultPct = Math.round((res / value) * 100);
  const remainderPct = 100 - resultPct;
  const remainder = value - res;

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
            <clipPath id="pct-half">
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
            clipPath="url(#pct-half)"
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
            clipPath="url(#pct-half)"
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
            clipPath="url(#pct-half)"
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
            clipPath="url(#pct-half)"
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
          <div className="cr-score">{fmt(res)}</div>
          <div className="cr-score-label">
            {percentage}% of {fmt(value)}
          </div>
          <span className={`cr-badge ${pctBadge}`}>{pctLabel}</span>
        </div>
      </div>

      <hr className="cr-divider" />

      <div>
        <div className="cr-bar-label">percentage applied — {percentage}%</div>
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
          <div className="cr-m-label">Base value</div>
          <div className="cr-m-value" style={{ fontSize: "13px" }}>
            {fmt(value)}
          </div>
          <div className="cr-m-sub">input value</div>
        </div>
        <div className="cr-metric-card">
          <div className="cr-m-label">Percentage</div>
          <div className="cr-m-value">{percentage}%</div>
          <div className="cr-m-sub">applied rate</div>
        </div>
        <div className="cr-metric-card">
          <div className="cr-m-label">Result</div>
          <div
            className="cr-m-value"
            style={{ fontSize: "13px", color: "#3B6D11" }}
          >
            {fmt(res)}
          </div>
          <div className="cr-m-sub">{percentage}% of value</div>
        </div>
        <div className="cr-metric-card">
          <div className="cr-m-label">Remainder</div>
          <div className="cr-m-value" style={{ fontSize: "13px" }}>
            {fmt(remainder)}
          </div>
          <div className="cr-m-sub">value minus result</div>
        </div>
      </div>

      <hr className="cr-divider" />

      <div>
        <div className="cr-world-title">value breakdown</div>
        <div className="cr-world-bar-row">
          <span className="cr-w-label">Result</span>
          <div className="cr-world-track">
            <div
              className="cr-world-fill"
              style={{ width: `${resultPct}%`, background: "#378ADD" }}
            />
          </div>
          <span
            className="cr-w-pct"
            style={{ width: "55px", fontSize: "10px" }}
          >
            {fmt(res)}
          </span>
        </div>
        <div className="cr-world-bar-row">
          <span className="cr-w-label">Remainder</span>
          <div className="cr-world-track">
            <div
              className="cr-world-fill"
              style={{ width: `${remainderPct}%`, background: "#C0DD97" }}
            />
          </div>
          <span
            className="cr-w-pct"
            style={{ width: "55px", fontSize: "10px" }}
          >
            {fmt(remainder)}
          </span>
        </div>
        <p className="cr-world-note">
          {percentage}% of <strong>{fmt(value)}</strong> ={" "}
          <strong>{fmt(res)}</strong> — leaving a remainder of {fmt(remainder)}.
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Main Calculator Page
───────────────────────────────────────── */
export default function PercentageCalculator() {
  const [value, setValue] = useState("");
  const [percentage, setPercentage] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [panelResult, setPanelResult] = useState<PctResult | null>(null);

  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const toggleFAQ = (index: number) =>
    setOpenFAQ(openFAQ === index ? null : index);

  const handlePercentageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace("%", "");
    if (!/^\d*\.?\d*$/.test(val)) return;
    setPercentage(val ? `${val}%` : "");
  };

  const compute = (): PctResult | null => {
    const v = Number(value);
    const p = Number(percentage.replace("%", ""));
    if (!v || !p || v <= 0 || p <= 0) return null;
    const res = (v * p) / 100;
    return { value: v, percentage: p, result: res, resultAsPctOfValue: p };
  };

  useEffect(() => {
    setPanelResult(compute());
  }, [value, percentage]);

  const calculate = () => {
    if (!value || !percentage) return;
    const v = Number(value);
    const p = Number(percentage.replace("%", ""));
    const res = (v * p) / 100;
    setResult(res.toFixed(2));
  };

  const clearAll = () => {
    setValue("");
    setPercentage("");
    setResult(null);
    setPanelResult(null);
  };

  /* ── FAQ data (also used for JSON-LD schema) ── */
  const faqs: [string, string][] = [
    [
      "What is the difference between percent and percentage points?",
      "When the underlying quantity is itself a percentage, the gap between two values is measured in percentage points and the relative change between them in percent. A rate moving from 4% to 6% has risen 2 percentage points, which is a 50% increase. Saying rates rose 2% would mean a move to 4.08%, so the two are not interchangeable.",
    ],
    [
      "Why is a 2 point rise sometimes 50% and sometimes 5%?",
      "Because percent change always depends on the starting value. Going from 4% to 6% is 2 points and a 50% increase; going from 40% to 42% is also 2 points but only a 5% increase. The same absolute movement means very different things at different points on the scale, which is why the base matters more than the change.",
    ],
    [
      "How do I find the original price before a discount?",
      "Divide rather than adding the percentage back. A price of 90 after a 25% reduction was 90 ÷ 0.75 = 120. Adding 25% to 90 gives 112.50, which is wrong because the original discount was calculated on the larger number. Reversing any percentage is always a division: divide by 1 minus the decrease, or by 1 plus the increase.",
    ],
    [
      "How do I calculate a percentage increase between two numbers?",
      "Subtract the old value from the new one, divide by the old value, and multiply by 100. From 240 to 300 that is 60 ÷ 240 × 100 = 25%. The divisor is always the original figure — not the new one, and not the average of the two. Change is measured relative to where you started.",
    ],
    [
      "How do I work out a percentage of marks?",
      "Divide the marks obtained by the marks available and multiply by 100, so 68 out of 80 is 85%. Across several assessments of different sizes, add the raw marks first and divide once at the end. Averaging the percentages only works when every assessment carried equal weight.",
    ],
    [
      "Can I average two percentages together?",
      "Only when they represent equally sized groups. A student scoring 90% on a 20-mark paper and 60% on an 80-mark paper has 66% overall, not 75% — the raw totals are 66 out of 100. Averaging the two percentages ignores the weights and here overstates the result by nine points, enough to change a grade.",
    ],
    [
      "Is a percentage over 100 possible?",
      "For growth, yes — tripling something is a 200% increase, and there is no upper limit on how much a quantity can grow. For a share of a whole, no. If a proportion comes out above 100% the denominator is wrong, usually because the total was understated or something was counted twice.",
    ],
    [
      "Why is a 300% increase not always impressive?",
      "Because a percentage with no base attached carries almost no information. Going from two incidents to eight is a 300% rise and also a change of six incidents. Small starting numbers produce dramatic-looking percentages, which is why any percentage change is worth reading alongside the absolute figures it came from.",
    ],
    [
      "How do I calculate what percentage one number is of another?",
      "Divide the part by the whole and multiply by 100. So 36 out of 240 is 36 ÷ 240 × 100 = 15%. The most common mistake is dividing the wrong way round, which gives 666% here — a result far above 100 is usually a sign the two numbers were swapped.",
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

        <h1>Percentage Calculator — Of, Change, and Reverse</h1>

        <p>
          Free <strong>percentage calculator online</strong> — find what X% of Y
          is, percentage increase or decrease, and reverse percentages
          instantly. No signup, works on any device.
        </p>

        <div className="single-page-padding">
          <div className="calc-card single-calc">
            <input
              className="calc-input"
              type="number"
              placeholder="Enter Value"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />

            <input
              className="calc-input"
              type="text"
              placeholder="Percentage"
              value={percentage}
              onChange={handlePercentageChange}
              onFocus={(e) => {
                const len = e.target.value.length;
                e.target.setSelectionRange(len - 1, len - 1);
              }}
            />

            <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
              <button className="calc-button" onClick={calculate}>
                Calculate
              </button>
              <button className="calc-button calc-clear" onClick={clearAll}>
                Clear
              </button>
            </div>
          </div>
        </div>

        <div className="cr-mobile-slot">
          <PercentageResultPanel result={panelResult} />
        </div>

        {/* ---- SEO CONTENT ---- */}

        <h2>Four Questions, Four Different Formulas</h2>
        <p>
          Nearly every percentage problem is one of four, and picking the wrong
          one is far more common than getting the arithmetic wrong. Identify the
          question first and the calculation is trivial.
        </p>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>The question</th>
                <th>Formula</th>
                <th>Example</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>What is X% of Y?</td>
                <td>Y × X ÷ 100</td>
                <td>15% of 240 = 36</td>
              </tr>
              <tr>
                <td>X is what percent of Y?</td>
                <td>X ÷ Y × 100</td>
                <td>36 out of 240 = 15%</td>
              </tr>
              <tr>
                <td>What is the change from X to Y?</td>
                <td>(Y − X) ÷ X × 100</td>
                <td>240 to 300 = 25% increase</td>
              </tr>
              <tr>
                <td>Y is X% of what number?</td>
                <td>Y ÷ (X ÷ 100)</td>
                <td>36 is 15% of 240</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          The third row hides the detail that causes most errors: the divisor is
          always the <em>original</em> value, not the new one and not the
          average of the two. Change is always measured relative to where you
          started.
        </p>

        <h2>Percent and Percentage Points Are Different Units</h2>
        <p>
          This is the distinction that turns correct numbers into wrong
          statements, and it appears constantly in news reports, interest rates
          and survey results.
        </p>
        <p>
          Suppose an interest rate moves from 4% to 6%. Two true statements:
        </p>
        <pre>
          The rise is 2 percentage points (6 − 4){"\n"}The rise is 50 percent
          ((6 − 4) ÷ 4 × 100)
        </pre>
        <p>
          Both describe the same event and they are wildly different numbers.
          Saying &quot;rates rose 2%&quot; when they moved from 4% to 6% is
          simply wrong — that would mean a rise to 4.08%.
        </p>
        <p>
          The rule is straightforward once stated. When the underlying quantity
          is itself a percentage, the difference between two values is measured
          in <strong>percentage points</strong>. The relative change between them
          is measured in <strong>percent</strong>. Any time you see a percentage
          change applied to a percentage, check which one is meant, because the
          difference is often a factor of ten or more.
        </p>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>From</th>
                <th>To</th>
                <th>Percentage points</th>
                <th>Percent change</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2%</td>
                <td>3%</td>
                <td>1 point</td>
                <td>50%</td>
              </tr>
              <tr>
                <td>4%</td>
                <td>6%</td>
                <td>2 points</td>
                <td>50%</td>
              </tr>
              <tr>
                <td>40%</td>
                <td>42%</td>
                <td>2 points</td>
                <td>5%</td>
              </tr>
              <tr>
                <td>50%</td>
                <td>25%</td>
                <td>−25 points</td>
                <td>−50%</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          Rows two and three make the point sharply. The same two-point movement
          is a 50% change at the bottom of the scale and a 5% change nearer the
          middle, because percent change depends entirely on the starting value.
        </p>

        <h2>Working Backwards to the Original Number</h2>
        <p>
          Reverse percentage problems come up whenever you know a figure that
          already includes something and need the amount before it.
        </p>
        <pre>
          Original = Final ÷ (1 + increase ÷ 100){"\n"}Original = Final ÷ (1 −
          decrease ÷ 100)
        </pre>
        <p>
          A price of 90 after a 25% reduction was 90 ÷ 0.75 = 120. A total of 480
          after a 20% increase started at 480 ÷ 1.2 = 400.
        </p>
        <p>
          The error to avoid is applying the percentage to the final figure
          instead of dividing. Adding 25% back to 90 gives 112.50, not 120,
          because the 25% was calculated on the larger original number rather
          than on the reduced one. Reversing a percentage is always a division,
          never the opposite operation applied to the result.
        </p>

        <h2>Percentage of Marks, and Weighted Scores</h2>
        <p>
          Converting marks to a percentage is the first formula in the table:
          marks obtained divided by marks available, multiplied by 100. So 68 out
          of 80 is 85%.
        </p>
        <p>
          Where it gets misapplied is across several assessments of different
          sizes. Averaging the percentages only works when every assessment
          carried the same weight. A student scoring 90% on a paper worth 20
          marks and 60% on one worth 80 marks has not averaged 75%.
        </p>
        <pre>
          Total obtained = 18 + 48 = 66{"\n"}Total available = 20 + 80 = 100
          {"\n"}Overall = 66%
        </pre>
        <p>
          Add the raw marks and divide once at the end. Averaging the two
          percentages gives 75%, which is nine points too generous and would
          change a grade.
        </p>

        <h2>Where Percentages Mislead</h2>
        <ul className="custom-list">
          <li>
            <strong>A percentage with no base is meaningless.</strong> &quot;Up
            300%&quot; from two incidents to eight is true and unremarkable.
            Always ask what the starting number was.
          </li>
          <li>
            <strong>Percentages of small samples are unstable.</strong> One
            person changing their mind in a group of eight moves the result by
            12.5 points. Report the count alongside the percentage.
          </li>
          <li>
            <strong>Averaging percentages hides the weights.</strong> This is the
            same trap as the marks example, and it appears in survey results,
            regional figures and departmental performance.
          </li>
          <li>
            <strong>Percentages above 100 are legitimate for growth</strong> —
            tripling something is a 200% increase — but impossible for a share of
            a whole. A figure above 100% in a proportion is a signal that the
            denominator is wrong.
          </li>
        </ul>
        <p>
          For percentage-off shopping calculations including stacked offers, the{" "}
          <Link href="/discount-calculator/" className="my-link">
            discount calculator
          </Link>{" "}
          covers those specifically. For converting a grade point average into a
          percentage, use the{" "}
          <Link href="/gpa-percentage/" className="my-link">
            GPA to percentage converter
          </Link>
          , which depends on the scale rather than on plain percentage
          arithmetic.
        </p>
        <h2>Percentage Questions</h2>

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

      {/* ── SIDEBAR — FIXED broken link ── */}
      <aside className="sidebar">
        <div className="cr-desktop-slot">
          <PercentageResultPanel result={panelResult} />
        </div>
        <div className="sidebar-box">
          <p style={{ fontSize: "20px", fontWeight: 600 }}>
            Related Calculators
          </p>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {[
              ["/time-calculator/", "Time Calculator"],
              ["/age-calculator/", "Age Calculator"],
              [
                "/days-between-calculator/",
                "Days Between Dates",
              ] /* ← fixed URL */,
              ["/gpa-calculator/", "GPA Calculator"],
              ["/gpa-percentage/", "GPA To Percentage Calculator"],
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
