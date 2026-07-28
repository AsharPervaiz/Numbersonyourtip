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
      "How do I calculate a percentage?",
      "Divide the part by the whole, then multiply by 100. Formula: Percentage = (Part ÷ Whole) × 100. For example, 20 out of 80 = (20 ÷ 80) × 100 = 25%.",
    ],
    [
      "What is X% of Y?",
      "To find X% of Y, multiply Y by X and divide by 100. Formula: (Y × X) ÷ 100. Example: 15% of 200 = (200 × 15) ÷ 100 = 30. Our calculator does this automatically the moment you type both values.",
    ],
    [
      "How to calculate percentage of marks?",
      "Add up all the marks you scored, divide by the total possible marks, then multiply by 100. Example: 425 obtained ÷ 500 total × 100 = 85%. This is the standard method used for school and university exam results.",
    ],
    [
      "How do I calculate percentage increase or decrease?",
      "Percentage change = ((New value − Old value) ÷ Old value) × 100. A positive result is an increase, a negative result is a decrease. Example: going from 80 to 100 is a ((100 − 80) ÷ 80) × 100 = 25% increase.",
    ],
    [
      "What is a reverse percentage calculation?",
      "A reverse percentage finds the original value before a percentage was applied. Formula: Original = Final ÷ (1 + rate) for an increase, or Final ÷ (1 − rate) for a decrease. Example: if a discounted price is $80 after 20% off, original = 80 ÷ 0.8 = $100.",
    ],
    [
      "How do I convert a decimal to a percentage?",
      "Multiply the decimal by 100 and add a percent sign. Example: 0.75 → 75%. To convert a percentage back to a decimal, divide by 100: 45% → 0.45.",
    ],
    [
      "What is the difference between percentage and percentile?",
      "Percentage is a portion of 100 (your score out of the total). Percentile is your rank compared to others. Scoring 80% means you got 80 out of 100 marks. Being in the 80th percentile means you scored higher than 80% of test-takers.",
    ],
    [
      "How do I find what percent one number is of another?",
      "Divide the smaller number by the larger number, then multiply by 100. Example: what percent is 15 of 60? (15 ÷ 60) × 100 = 25%. Enter both values in our calculator for an instant answer.",
    ],
    [
      "Is this percentage calculator free?",
      "Yes — 100% free, no signup, no ads on the tool, works on any device. Enter your value and percentage to get instant results with a live breakdown chart.",
    ],
    [
      "Can I use this for discount and tax calculations?",
      "Yes. Enter the original price as the base value and the discount or tax rate as the percentage. The result shows the discount/tax amount and the remainder shows the final price.",
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

        <h1>Percentage Calculator</h1>

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

        {/* ── SEO CONTENT — REWRITTEN ── */}

        <h2>What Is a Percentage?</h2>
        <p>
          A <strong>percentage</strong> is a number expressed as a fraction of
          100. The word literally comes from Latin — <em>per centum</em>, "out
          of a hundred". A score of 85% means 85 out of every 100. It's the most
          universal way to express proportions, comparisons, discounts, growth
          rates, and test results because it works across any scale.
        </p>
        <p>
          This <strong>free percentage calculator online</strong> handles the
          most common calculations — finding what X% of Y is, calculating
          percentage increase or decrease, working out what percent one number
          is of another, and reverse percentages. No manual math, no formula
          hunting.
        </p>

        <h2>How to Calculate Percentage — The Core Formulas</h2>
        <p>
          There are four percentage calculations you'll actually use in real
          life. Here's each one with the formula and a worked example:
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
                What You Want to Find
              </th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                Formula
              </th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                Example
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                X% of Y
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                (Y × X) ÷ 100
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                20% of 150 = (150 × 20) ÷ 100 = <strong>30</strong>
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                What % is A of B
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                (A ÷ B) × 100
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                15 of 60 = (15 ÷ 60) × 100 = <strong>25%</strong>
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Percentage increase
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                ((New − Old) ÷ Old) × 100
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                80 → 100 = ((100 − 80) ÷ 80) × 100 ={" "}
                <strong>25% increase</strong>
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Percentage decrease
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                ((Old − New) ÷ Old) × 100
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                100 → 80 = ((100 − 80) ÷ 100) × 100 ={" "}
                <strong>20% decrease</strong>
              </td>
            </tr>
          </tbody>
        </table>
        <p>
          Notice something important: 80 → 100 is a{" "}
          <strong>25% increase</strong>, but 100 → 80 is only a{" "}
          <strong>20% decrease</strong>. Percentage changes are always relative
          to the starting value.
        </p>

        <h2>How to Use This Percentage Calculator</h2>
        <ol className="custom-list">
          <li>
            Enter your <strong>base value</strong> in the first field (the
            total, the original number, or the "whole").
          </li>
          <li>
            Enter the <strong>percentage</strong> you want to apply in the
            second field.
          </li>
          <li>
            Click <strong>Calculate</strong> — or watch the result panel update
            automatically.
          </li>
        </ol>
        <p>
          The result panel shows the calculated amount, the remainder (base
          value minus the result), and a live breakdown chart so you can see the
          proportion at a glance.
        </p>

        <h2>What Is X% of Y? — Quick Reference Chart</h2>
        <p>
          The most common everyday percentage question. Here are the most
          searched X% of Y calculations pre-worked:
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
                Calculation
              </th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                Result
              </th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                Common Use
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                5% of 100
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>5</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Sales tax
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                10% of 100
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>10</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Standard tip
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                15% of 100
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>15</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Restaurant tip
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                20% of 100
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>20</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Discount, tip
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                25% of 200
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>50</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Quarter off sale
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                30% of 500
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>150</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Clearance discount
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                50% of 80
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>40</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Half-off deal
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                75% of 200
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>150</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Progress tracking
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                90% of 1000
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>900</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Exam target
              </td>
            </tr>
          </tbody>
        </table>

        <h2>How to Calculate Percentage of Marks</h2>
        <p>
          One of the most searched percentage calculations, especially for
          school and university students. The formula is straightforward:
        </p>
        <p>
          <strong>
            Percentage of marks = (Marks obtained ÷ Total marks) × 100
          </strong>
        </p>
        <p>
          <strong>Worked examples:</strong>
        </p>
        <ul className="custom-list">
          <li>
            Scored 450 out of 500 → (450 ÷ 500) × 100 = <strong>90%</strong>
          </li>
          <li>
            Scored 68 out of 80 → (68 ÷ 80) × 100 = <strong>85%</strong>
          </li>
          <li>
            Scored 340 out of 400 → (340 ÷ 400) × 100 = <strong>85%</strong>
          </li>
        </ul>
        <p>
          For calculating multi-subject percentages, add all the marks obtained
          across every subject, divide by the sum of all total marks, then
          multiply by 100. If you're working with GPA instead of marks, use our{" "}
          <Link className="my-link" href="/gpa-percentage/">
            <span className="hover-item">GPA to percentage calculator</span>
          </Link>{" "}
          for direct conversion.
        </p>

        <h2>Percentage Increase From One Number to Another</h2>
        <p>
          Used in salaries, prices, populations, and any "what's the growth
          rate" question. Formula:
        </p>
        <p>
          <strong>Percentage increase = ((New − Old) ÷ Old) × 100</strong>
        </p>
        <p>
          <strong>Examples:</strong>
        </p>
        <ul className="custom-list">
          <li>
            Salary rose from $50,000 to $55,000 → ((55,000 − 50,000) ÷ 50,000) ×
            100 = <strong>10% increase</strong>
          </li>
          <li>
            Price went from $80 to $92 → ((92 − 80) ÷ 80) × 100 ={" "}
            <strong>15% increase</strong>
          </li>
          <li>
            Followers grew from 1,200 to 1,500 → ((1,500 − 1,200) ÷ 1,200) × 100
            = <strong>25% increase</strong>
          </li>
        </ul>

        <h2>Percentage Decrease Calculator</h2>
        <p>
          The mirror of percentage increase — used for sales, weight loss,
          expense cuts, and stock drops. Formula:
        </p>
        <p>
          <strong>Percentage decrease = ((Old − New) ÷ Old) × 100</strong>
        </p>
        <p>
          <strong>Examples:</strong>
        </p>
        <ul className="custom-list">
          <li>
            Weight dropped from 90 kg to 81 kg → ((90 − 81) ÷ 90) × 100 ={" "}
            <strong>10% decrease</strong>
          </li>
          <li>
            Price fell from $200 to $150 → ((200 − 150) ÷ 200) × 100 ={" "}
            <strong>25% decrease</strong>
          </li>
          <li>
            Traffic went from 10,000 to 7,500 visits →{" "}
            <strong>25% decrease</strong>
          </li>
        </ul>

        <h2>Reverse Percentage Calculator (Finding the Original Value)</h2>
        <p>
          The trickiest percentage question — and the most misunderstood.{" "}
          <strong>Reverse percentage</strong> works out the original value when
          you only know the final value and the percentage that was applied.
        </p>
        <p>
          <strong>Formulas:</strong>
        </p>
        <ul className="custom-list">
          <li>
            <strong>After an increase:</strong> Original = Final ÷ (1 + rate ÷
            100)
          </li>
          <li>
            <strong>After a decrease:</strong> Original = Final ÷ (1 − rate ÷
            100)
          </li>
        </ul>
        <p>
          <strong>Worked examples:</strong>
        </p>
        <ul className="custom-list">
          <li>
            A shirt costs $80 after a 20% discount. Original price = 80 ÷ (1 −
            0.20) = 80 ÷ 0.80 = <strong>$100</strong>
          </li>
          <li>
            Bill total is $110 with 10% VAT. Pre-tax = 110 ÷ 1.10 ={" "}
            <strong>$100</strong>
          </li>
          <li>
            Salary is $63,000 after a 5% raise. Old salary = 63,000 ÷ 1.05 ={" "}
            <strong>$60,000</strong>
          </li>
        </ul>
        <p>
          Common mistake: don't just subtract 20% from the discounted price to
          get the original. You have to divide, not subtract.
        </p>

        <h2>Decimal to Percentage Converter</h2>
        <p>
          Converting between decimals and percentages is simple once you learn
          the trick:
        </p>
        <ul className="custom-list">
          <li>
            <strong>Decimal to percentage:</strong> multiply by 100 (0.45 → 45%)
          </li>
          <li>
            <strong>Percentage to decimal:</strong> divide by 100 (75% → 0.75)
          </li>
          <li>
            <strong>Fraction to percentage:</strong> divide numerator by
            denominator, then × 100 (3/4 → 0.75 → 75%)
          </li>
        </ul>
        <p>
          <strong>Quick reference chart:</strong>
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
                Decimal
              </th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                Percentage
              </th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                Fraction
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                0.01
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>1%</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                1/100
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                0.05
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>5%</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                1/20
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                0.10
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>10%</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                1/10
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                0.25
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>25%</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>1/4</td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                0.33
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                33.33%
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>1/3</td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                0.50
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>50%</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>1/2</td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                0.66
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                66.67%
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>2/3</td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                0.75
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>75%</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>3/4</td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                0.80
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>80%</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>4/5</td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                1.00
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                100%
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>1/1</td>
            </tr>
          </tbody>
        </table>

        <h2>Percentage vs Percentile — What's the Difference?</h2>
        <p>
          These get mixed up constantly, especially around test scores. They
          mean very different things:
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
                Concept
              </th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                What It Measures
              </th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                Example
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                <strong>Percentage</strong>
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Your score as a fraction of 100
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                85% = you got 85 out of 100 marks
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                <strong>Percentile</strong>
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Your rank relative to others
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                85th percentile = you scored higher than 85% of test-takers
              </td>
            </tr>
          </tbody>
        </table>
        <p>
          Someone can score 60% on a hard exam and still be in the 95th
          percentile if most people scored lower. Standardized tests like the
          GRE, SAT, and GMAT report percentiles because they compare you to the
          test-taker pool, not to a fixed 100-point scale.
        </p>

        <h2>Real-World Uses of Percentage Calculations</h2>
        <ul className="custom-list">
          <li>
            <strong>Shopping</strong> — discounts, "buy one get one 50% off",
            sales tax, VAT
          </li>
          <li>
            <strong>Finance</strong> — interest rates, loan APR, investment
            returns, inflation
          </li>
          <li>
            <strong>Salary &amp; work</strong> — raises, bonuses, tax
            deductions, tips
          </li>
          <li>
            <strong>School &amp; exams</strong> — marks percentages, grade
            thresholds, grade curves
          </li>
          <li>
            <strong>Health &amp; fitness</strong> — body fat %, weight change %,
            calorie targets
          </li>
          <li>
            <strong>Business</strong> — profit margin, growth rate, conversion
            rate, market share
          </li>
          <li>
            <strong>Analytics</strong> — bounce rate, CTR, engagement rate
          </li>
          <li>
            <strong>Cooking &amp; recipes</strong> — scaling ingredients, baking
            ratios (baker's percentage)
          </li>
        </ul>

        <h2>Common Percentage Calculation Mistakes to Avoid</h2>
        <ul className="custom-list">
          <li>
            <strong>
              Adding then subtracting the same percentage doesn't return the
              original.
            </strong>{" "}
            $100 → +10% = $110 → −10% = $99, not $100.
          </li>
          <li>
            <strong>Percentage increase and decrease aren't symmetric.</strong>{" "}
            Going from 100 to 150 is a 50% increase, but 150 to 100 is only a
            33.33% decrease.
          </li>
          <li>
            <strong>Don't confuse percentage with percentage points.</strong>{" "}
            Interest rising from 5% to 7% is a 2 percentage point increase, but
            a 40% relative increase.
          </li>
          <li>
            <strong>Reverse percentages need division, not subtraction.</strong>{" "}
            $80 after 20% off is not $80 + $20 = $100; it's $80 ÷ 0.80 = $100.
          </li>
        </ul>

        <h2>Why Use This Free Percentage Calculator</h2>
        <ul className="custom-list">
          <li>
            ✅ <strong>100% free</strong> — no signup, no ads on the tool
          </li>
          <li>
            ✅ <strong>Instant, live results</strong> as you type
          </li>
          <li>
            ✅ Handles{" "}
            <strong>
              X% of Y, percentage increase, decrease, and reverse percentage
            </strong>
          </li>
          <li>
            ✅ <strong>Visual breakdown</strong> — see result vs remainder
            proportion at a glance
          </li>
          <li>
            ✅ Works for{" "}
            <strong>discounts, tax, tips, marks, growth rates</strong> —
            anything percentage-based
          </li>
          <li>
            ✅ <strong>Mobile-friendly</strong> — phone, tablet, laptop, desktop
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
          Percentages are one of the most useful pieces of math you'll ever
          learn — whether you're checking a discount, tracking your exam scores,
          or calculating a raise. Bookmark this{" "}
          <strong>percentage calculator</strong> for the next time you need any
          of these calculations, and use the reference tables above when you
          don't have the calculator open.
        </p>
        <p>
          For related calculations, try our{" "}
          <Link className="my-link" href="/gpa-percentage/">
            <span className="hover-item">GPA to percentage converter</span>
          </Link>{" "}
          if you're working with academic grades, or the{" "}
          <Link className="my-link" href="/gpa-calculator/">
            <span className="hover-item">GPA calculator</span>
          </Link>{" "}
          to compute GPA from credit hours and letter grades.
        </p>
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
