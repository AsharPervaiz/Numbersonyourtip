"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface TaxResult {
  grossIncome: number;
  taxableIncome: number;
  taxAmount: number;
  netIncome: number;
  effectiveRate: number;
  deductions: number;
  country: string;
}
function needleDeg(ratio: number): number {
  const clamped = Math.min(Math.max(ratio, 0), 1);
  return -90 + clamped * 180;
}

function IncomeTaxResultPanel({ result }: { result: TaxResult | null }) {
  if (!result) {
    return (
      <div className="cr-panel-placeholder">
        <div className="cr-ph-icon">
          <i className="fa-solid fa-landmark" aria-hidden="true" />
        </div>
        Enter your income details to see your tax breakdown here.
      </div>
    );
  }
  const {
    grossIncome,
    taxableIncome,
    taxAmount,
    netIncome,
    effectiveRate,
    deductions,
    country,
  } = result;
  const fmt = (n: number) =>
    n.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  const scaleMax = 50;
  const ratio = Math.min(effectiveRate / scaleMax, 1);
  const barPct = 2 + ratio * 96;
  const rateLabel =
    effectiveRate === 0
      ? "Tax-free"
      : effectiveRate < 10
        ? "Very low tax"
        : effectiveRate < 20
          ? "Low tax"
          : effectiveRate < 30
            ? "Moderate tax"
            : effectiveRate < 40
              ? "High tax"
              : "Very high tax";
  const rateBadge =
    effectiveRate === 0
      ? "good"
      : effectiveRate < 10
        ? "good"
        : effectiveRate < 20
          ? "normal"
          : effectiveRate < 30
            ? "warning"
            : "danger";
  const netPct =
    grossIncome > 0 ? Math.round((netIncome / grossIncome) * 100) : 0;
  const taxPct =
    grossIncome > 0 ? Math.round((taxAmount / grossIncome) * 100) : 0;
  const deductionPct =
    grossIncome > 0 ? Math.round((deductions / grossIncome) * 100) : 0;
  return (
    <div className="cr-panel">
      <div className="cr-gauge-wrap">
        <svg
          className="cr-gauge-svg"
          width="100"
          height="60"
          viewBox="0 0 120 70"
          role="img"
          aria-label={`Effective tax rate: ${effectiveRate.toFixed(1)}%`}
        >
          <defs>
            <clipPath id="itax-half">
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
            clipPath="url(#itax-half)"
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
            clipPath="url(#itax-half)"
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
            clipPath="url(#itax-half)"
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
            clipPath="url(#itax-half)"
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
          <div className="cr-score-small">{fmt(netIncome)}</div>
          <div className="cr-score-label">net income after tax</div>
          <span className={`cr-badge ${rateBadge}`}>{rateLabel}</span>
        </div>
      </div>
      <hr className="cr-divider" />
      <div>
        <div className="cr-bar-label">
          effective tax rate — {effectiveRate.toFixed(1)}% of gross income
        </div>
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
          <span>0%</span>
          <span>10%</span>
          <span>25%</span>
          <span>35%</span>
          <span>50%</span>
        </div>
      </div>
      <hr className="cr-divider" />
      <div className="cr-metrics-grid">
        <div className="cr-metric-card">
          <div className="cr-m-label">Gross income</div>
          <div className="cr-m-value" style={{ fontSize: "13px" }}>
            {fmt(grossIncome)}
          </div>
          <div className="cr-m-sub">before tax</div>
        </div>
        <div className="cr-metric-card">
          <div className="cr-m-label">Taxable income</div>
          <div className="cr-m-value" style={{ fontSize: "13px" }}>
            {fmt(taxableIncome)}
          </div>
          <div className="cr-m-sub">after deductions</div>
        </div>
        <div className="cr-metric-card">
          <div className="cr-m-label">Tax amount</div>
          <div
            className="cr-m-value"
            style={{ fontSize: "13px", color: "#A32D2D" }}
          >
            {fmt(taxAmount)}
          </div>
          <div className="cr-m-sub">
            {effectiveRate.toFixed(1)}% effective rate
          </div>
        </div>
        <div className="cr-metric-card">
          <div className="cr-m-label">Net income</div>
          <div
            className="cr-m-value"
            style={{ fontSize: "13px", color: "#3B6D11" }}
          >
            {fmt(netIncome)}
          </div>
          <div className="cr-m-sub">{netPct}% of gross</div>
        </div>
      </div>
      <hr className="cr-divider" />
      <div>
        <div className="cr-world-title">where your income goes</div>
        <div className="cr-world-bar-row">
          <span className="cr-w-label">Net income</span>
          <div className="cr-world-track">
            <div
              className="cr-world-fill"
              style={{ width: `${netPct}%`, background: "#97C459" }}
            />
          </div>
          <span className="cr-w-pct" style={{ width: "32px" }}>
            {netPct}%
          </span>
        </div>
        <div className="cr-world-bar-row">
          <span className="cr-w-label">Tax</span>
          <div className="cr-world-track">
            <div
              className="cr-world-fill"
              style={{ width: `${taxPct}%`, background: "#F09595" }}
            />
          </div>
          <span className="cr-w-pct" style={{ width: "32px" }}>
            {taxPct}%
          </span>
        </div>
        {deductionPct > 0 && (
          <div className="cr-world-bar-row">
            <span className="cr-w-label">Deductions</span>
            <div className="cr-world-track">
              <div
                className="cr-world-fill"
                style={{ width: `${deductionPct}%`, background: "#B5D4F4" }}
              />
            </div>
            <span className="cr-w-pct" style={{ width: "32px" }}>
              {deductionPct}%
            </span>
          </div>
        )}
        <p className="cr-world-note">
          You keep <strong>{fmt(netIncome)}</strong> from every{" "}
          {fmt(grossIncome)} earned — {netPct}% of gross income
          {country ? ` (${country})` : ""}.
        </p>
      </div>
    </div>
  );
}

function calcTax(
  grossIncome: number,
  deductions: number,
  country: string,
  customRate: number,
): { taxAmount: number; taxableIncome: number } {
  const taxable = Math.max(0, grossIncome - deductions);
  if (country === "Custom") {
    return { taxAmount: (taxable * customRate) / 100, taxableIncome: taxable };
  }
  const slab = (income: number, slabs: [number, number, number][]) => {
    let tax = 0;
    for (const [from, to, rate] of slabs) {
      if (income <= from) break;
      tax += (Math.min(income, to) - from) * (rate / 100);
    }
    return tax;
  };
  if (country === "India") {
    return {
      taxAmount: slab(taxable, [
        [0, 300000, 0],
        [300000, 700000, 5],
        [700000, 1000000, 10],
        [1000000, 1200000, 15],
        [1200000, 1500000, 20],
        [1500000, Infinity, 30],
      ]),
      taxableIncome: taxable,
    };
  }
  if (country === "USA") {
    return {
      taxAmount: slab(taxable, [
        [0, 11600, 10],
        [11600, 47150, 12],
        [47150, 100525, 22],
        [100525, 191950, 24],
        [191950, 243725, 32],
        [243725, 609350, 35],
        [609350, Infinity, 37],
      ]),
      taxableIncome: taxable,
    };
  }
  if (country === "UK") {
    const personalAllowance = 12570;
    const adj = Math.max(0, taxable - personalAllowance);
    return {
      taxAmount: slab(adj, [
        [0, 37700, 20],
        [37700, 125140, 40],
        [125140, Infinity, 45],
      ]),
      taxableIncome: taxable,
    };
  }
  if (country === "Canada") {
    return {
      taxAmount: slab(taxable, [
        [0, 55867, 15],
        [55867, 111733, 20.5],
        [111733, 154906, 26],
        [154906, 220000, 29],
        [220000, Infinity, 33],
      ]),
      taxableIncome: taxable,
    };
  }
  if (country === "Australia") {
    return {
      taxAmount: slab(taxable, [
        [0, 18200, 0],
        [18200, 45000, 19],
        [45000, 120000, 32.5],
        [120000, 180000, 37],
        [180000, Infinity, 45],
      ]),
      taxableIncome: taxable,
    };
  }
  if (country === "Pakistan") {
    return {
      taxAmount: slab(taxable, [
        [0, 600000, 0],
        [600000, 1200000, 5],
        [1200000, 2200000, 15],
        [2200000, 3200000, 25],
        [3200000, 4100000, 30],
        [4100000, Infinity, 35],
      ]),
      taxableIncome: taxable,
    };
  }
  return { taxAmount: (taxable * customRate) / 100, taxableIncome: taxable };
}

const FAQ_DATA = [
  {
    q: "How is income tax calculated in Pakistan for salaried persons?",
    a: "Pakistan taxes salaried individuals using progressive slabs under FBR rules. Income up to PKR 600,000 is tax-free. Above that, rates range from 5% to 35% across six slabs. Subtract eligible deductions from your gross salary, then apply the slabs to the taxable amount. This calculator implements the FBR slab structure for FY 2024-25.",
  },
  {
    q: "How is income tax calculated in India?",
    a: "Under the new regime for FY 2024-25, income up to ₹3 lakh is tax-free, then rates increase from 5% to 30%. A rebate under Section 87A makes income up to ₹7 lakh effectively tax-free. Subtract deductions from gross income, apply the slab rates to what remains.",
  },
  {
    q: "What is the difference between gross income and taxable income?",
    a: "Gross income is your total earnings before any deductions. Taxable income is what remains after subtracting eligible deductions and allowances. Tax is calculated on taxable income, not gross — which is why maximising deductions reduces your tax bill.",
  },
  {
    q: "What is the difference between marginal and effective tax rate?",
    a: "The marginal rate is the rate on your last dollar or rupee of income — your highest tax bracket. The effective rate is the actual percentage of total gross income paid as tax. Due to progressive slabs, effective rate is always lower than marginal. If you pay 120,000 tax on 600,000 income, your effective rate is 20% even if your marginal rate is 30%.",
  },
  {
    q: "How much tax will I pay on 50,000, 75,000, or 100,000?",
    a: "It depends on your country and deductions. In the USA: $50,000 income = ~$5,826 tax (11.7% effective); $75,000 = ~$11,556 (15.4%); $100,000 = ~$17,056 (17.1%). In the UK: £50,000 = ~£7,486 (15%); £75,000 = ~£17,486 (23.3%); £100,000 = ~£27,486 (27.5%). Enter your exact income above for precise figures.",
  },
  {
    q: "Can I use this for freelance or self-employed income?",
    a: "Yes. Enter your total annual income and deductible business expenses. The same tax slabs apply. For a more detailed freelance calculation that includes platform fees (Upwork, Fiverr) and effective rate breakdowns, use our freelancer tax calculator.",
  },
  {
    q: "What deductions should I enter?",
    a: "Enter the total of all eligible deductions — standard deduction, retirement contributions (EPF, PPF, NPS, 401k, RRSP), home loan interest, health insurance premiums, education expenses, and any other allowable deductions. If unsure, enter 0 to see tax on full gross income, then adjust.",
  },
  {
    q: "What is the standard deduction?",
    a: "The standard deduction is a fixed amount you can subtract from gross income without itemizing. In India it is ₹50,000 for salaried employees (new regime FY 2024-25). In the USA it is $14,600 for single filers (2024). Pakistan does not have a standard deduction in the same format — deductions are claimed individually.",
  },
  {
    q: "Is the income tax the same as total tax I owe?",
    a: "Not always. Depending on your country, you may also owe social security contributions, National Insurance (UK), self-employment tax (USA), or surcharge and cess (India). This calculator covers income tax only. Consult a tax professional for the complete picture.",
  },
  {
    q: "Is this income tax calculator free?",
    a: "Yes — completely free with no sign-up and no limits. Calculate income tax for Pakistan, India, USA, UK, Canada, Australia, or any custom rate. Shows tax slabs, effective rate, deduction impact, and net take-home instantly.",
  },
];

export default function IncomeTaxCalculator() {
  const [income, setIncome] = useState("");
  const [deductions, setDeductions] = useState("");
  const [customRate, setCustomRate] = useState("");
  const [country, setCountry] = useState("India");
  const [countryOpen, setCountryOpen] = useState(false);
  const [panelResult, setPanelResult] = useState<TaxResult | null>(null);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const toggleFAQ = (index: number) =>
    setOpenFAQ(openFAQ === index ? null : index);
  const countries = [
    "India",
    "USA",
    "UK",
    "Canada",
    "Australia",
    "Pakistan",
    "Custom",
  ];

  const addCommas = (val: string): string => {
    const cleaned = val.replace(/[^0-9.]/g, "");
    const parts = cleaned.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.length > 1 ? parts[0] + "." + parts[1] : parts[0];
  };
  const handleChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setter(addCommas(e.target.value));
  const toNum = (val: string) => {
    const s = val.replace(/,/g, "");
    return s === "" ? 0 : Number(s);
  };

  const compute = (): TaxResult | null => {
    const grossIncome = toNum(income);
    const deductAmt = toNum(deductions);
    const cRate = toNum(customRate);
    if (!grossIncome || grossIncome <= 0) return null;
    if (country === "Custom" && !cRate) return null;
    const { taxAmount, taxableIncome } = calcTax(
      grossIncome,
      deductAmt,
      country,
      cRate,
    );
    const netIncome = Math.max(0, taxableIncome - taxAmount);
    const effectiveRate = grossIncome > 0 ? (taxAmount / grossIncome) * 100 : 0;
    return {
      grossIncome,
      taxableIncome,
      taxAmount,
      netIncome,
      effectiveRate,
      deductions: deductAmt,
      country,
    };
  };

  useEffect(() => {
    setPanelResult(compute());
  }, [income, deductions, customRate, country]);
  const calculate = () => setPanelResult(compute());
  const handleClear = () => {
    setIncome("");
    setDeductions("");
    setCustomRate("");
    setCountry("India");
    setCountryOpen(false);
    setPanelResult(null);
  };

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

        <h1>Free Income Tax Calculator With Deductions</h1>
        <p>
          Calculate your income tax, taxable income, effective tax rate, and net
          take-home pay instantly. This free income tax calculator with
          deductions works for salaried persons in Pakistan (FBR 2026 slabs),
          India, USA, UK, Canada, Australia, or any custom tax rate — enter your
          salary, subtract deductions, and see the exact breakdown.
        </p>

        <div className="calc-card single-calc">
          <div
            className="modern-dropdown"
            onClick={() => setCountryOpen(!countryOpen)}
          >
            {country}
            <span className="dropdown-indicator">▼</span>
            {countryOpen && (
              <ul className="dropdown-list">
                {countries.map((c) => (
                  <li
                    key={c}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCountry(c);
                      setCountryOpen(false);
                    }}
                  >
                    {c}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <input
            className="calc-input"
            type="text"
            inputMode="decimal"
            placeholder="Annual Gross Income"
            value={income}
            onChange={handleChange(setIncome)}
          />
          <input
            className="calc-input"
            type="text"
            inputMode="decimal"
            placeholder="Total Deductions (optional)"
            value={deductions}
            onChange={handleChange(setDeductions)}
          />
          {country === "Custom" && (
            <input
              className="calc-input"
              type="number"
              step="0.01"
              placeholder="Custom Tax Rate (%)"
              value={customRate}
              onChange={(e) => setCustomRate(e.target.value)}
            />
          )}
          <div style={{ display: "flex", gap: "10px" }}>
            <button className="calc-button" onClick={calculate}>
              Calculate
            </button>
            <button className="calc-button calc-clear" onClick={handleClear}>
              Clear
            </button>
          </div>
        </div>

        <div className="cr-mobile-slot">
          <IncomeTaxResultPanel result={panelResult} />
        </div>

        {/* ---- SEO CONTENT ---- */}

        <h2>What Is Income Tax?</h2>
        <p>
          Income tax is a direct tax levied by governments on the earnings of
          individuals and businesses. It is one of the primary sources of
          government revenue, funding public services including healthcare,
          education, infrastructure, and defence. For most salaried persons,
          income tax is calculated on annual earnings above a tax-free
          threshold, with rates that increase progressively as income rises.
          Understanding how your income tax is calculated — and how deductions
          reduce your taxable income — helps you plan finances, maximise
          legitimate savings, and avoid surprises at tax time.
        </p>
        <p>
          This tax calculator for salaried persons covers six countries with
          built-in progressive slab structures plus a custom rate option for any
          other jurisdiction. It doubles as an effective tax rate calculator —
          showing the actual percentage of your gross income that goes to tax,
          not just the marginal bracket. For freelance and self-employed income
          with platform fees, our{" "}
          <Link href="/freelancer-tax-calculator/" className="my-link">
            freelancer tax calculator
          </Link>{" "}
          provides a more specialized breakdown.
        </p>

        <h2>How Income Tax Is Calculated</h2>
        <ul className="custom-list">
          <li>
            <strong>Step 1 — Determine gross income:</strong> Add up all sources
            of earnings — salary, bonuses, rental income, capital gains, and
            other taxable receipts.
          </li>
          <li>
            <strong>Step 2 — Subtract deductions:</strong> Deduct eligible
            allowances (standard deduction, retirement contributions, home loan
            interest, health insurance premiums) to arrive at your taxable
            income.
          </li>
          <li>
            <strong>Step 3 — Apply tax slabs:</strong> Apply your country's
            progressive slab rates to the taxable income.
          </li>
          <li>
            <strong>Step 4 — Apply rebates and credits:</strong> Subtract any
            applicable rebates or credits to arrive at final tax payable.
          </li>
        </ul>
        <pre>
          Taxable Income = Gross Income − Deductions{"\n"}Tax Amount = Tax on
          Taxable Income (per slab rates){"\n"}Net Take-Home = Taxable Income −
          Tax Amount
        </pre>

        <h2>How Much Tax Will I Pay? — Quick Reference by Income Level</h2>
        <p>
          One of the most searched tax questions is "how much tax will I pay on
          50,000 / 75,000 / 100,000?" The answer depends on your country and
          deductions. Here is a reference table for common income levels across
          four countries (no deductions applied, using current slab rates):
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
                  Income
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  USA (Federal)
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  UK
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  India (₹)
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Pakistan (PKR)
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                [
                  "50,000",
                  "$5,826 (11.7%)",
                  "£7,486 (15.0%)",
                  "₹10,000 (2.0%)*",
                  "PKR 0 (0%)†",
                ],
                [
                  "75,000",
                  "$11,556 (15.4%)",
                  "£12,486 (16.6%)",
                  "₹27,500 (3.7%)*",
                  "PKR 0 (0%)†",
                ],
                [
                  "100,000",
                  "$17,056 (17.1%)",
                  "£17,486 (17.5%)",
                  "₹ exempt (0%)*",
                  "PKR 0 (0%)†",
                ],
                [
                  "500,000",
                  "$108,388 (21.7%)",
                  "£177,486 (35.5%)",
                  "₹25,000 (5.0%)",
                  "PKR 0 (0%)†",
                ],
                ["1,000,000", "—", "—", "₹70,000 (7.0%)", "PKR 90,000 (9.0%)"],
                [
                  "2,500,000",
                  "—",
                  "—",
                  "₹4,12,500 (16.5%)",
                  "PKR 3,45,000 (13.8%)",
                ],
              ].map(([inc, usa, uk, india, pak], i) => (
                <tr key={i}>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {inc}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {usa}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {uk}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {india}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {pak}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ fontSize: "13px", color: "#666" }}>
          *India: Income up to ₹7 lakh is effectively tax-free under Section 87A
          rebate (new regime). †Pakistan: Income up to PKR 600,000 is tax-free
          under FBR slabs. Enter your exact figures in the calculator above for
          a precise result with deductions.
        </p>

        <h2>Income Tax Slabs — Pakistan (FBR Salaried, FY 2024-25)</h2>
        <p>
          This Pakistan salary tax calculator implements the FBR income tax
          slabs for salaried persons. Select "Pakistan" from the dropdown above
          to use these rates automatically:
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
                  Income (PKR)
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Tax Rate
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Up to 6,00,000", "Nil"],
                ["6,00,001 – 12,00,000", "5%"],
                ["12,00,001 – 22,00,000", "15%"],
                ["22,00,001 – 32,00,000", "25%"],
                ["32,00,001 – 41,00,000", "30%"],
                ["Above 41,00,000", "35%"],
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

        <h2>Income Tax Slabs — India (New Regime FY 2024-25)</h2>
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
                  Income (₹)
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Tax Rate
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Up to 3,00,000", "Nil"],
                ["3,00,001 – 7,00,000", "5%"],
                ["7,00,001 – 10,00,000", "10%"],
                ["10,00,001 – 12,00,000", "15%"],
                ["12,00,001 – 15,00,000", "20%"],
                ["Above 15,00,000", "30%"],
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

        <h2>Income Tax Brackets — USA (2024, Single Filer)</h2>
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
                  Income ($)
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Tax Rate
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                ["$0 – $11,600", "10%"],
                ["$11,601 – $47,150", "12%"],
                ["$47,151 – $100,525", "22%"],
                ["$100,526 – $191,950", "24%"],
                ["$191,951 – $243,725", "32%"],
                ["$243,726 – $609,350", "35%"],
                ["Above $609,350", "37%"],
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

        <h2>Income Tax Bands — UK (2024-25)</h2>
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
                  Income (£)
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Tax Rate
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Up to £12,570", "Personal Allowance (0%)"],
                ["£12,571 – £50,270", "Basic Rate (20%)"],
                ["£50,271 – £125,140", "Higher Rate (40%)"],
                ["Above £125,140", "Additional Rate (45%)"],
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

        <h2>What Are Tax Deductions?</h2>
        <p>
          Tax deductions are amounts subtracted from your gross income before
          tax is applied, reducing your taxable income and therefore your tax
          bill. Using the deductions field in this income tax calculator with
          deductions shows you exactly how much each deduction saves. Common
          deductions include:
        </p>
        <ul className="custom-list">
          <li>
            Standard deduction (₹50,000 in India for salaried; $14,600 in USA
            for single filers 2024)
          </li>
          <li>Retirement contributions (EPF, PPF, NPS, 401k, RRSP, pension)</li>
          <li>
            Home loan interest payments — our{" "}
            <Link href="/home-mortgage-calculator/" className="my-link">
              home mortgage calculator
            </Link>{" "}
            shows how much interest you pay annually
          </li>
          <li>Medical and health insurance premiums</li>
          <li>Charitable donations</li>
          <li>
            Business and professional expenses (especially for self-employed —
            see our{" "}
            <Link href="/freelancer-tax-calculator/" className="my-link">
              freelancer tax calculator
            </Link>
            )
          </li>
          <li>Education loan interest</li>
          <li>House rent allowance (HRA) in India</li>
        </ul>

        <h2>Marginal vs. Effective Tax Rate — What Is the Difference?</h2>
        <p>
          These two terms are frequently confused but represent very different
          things:
        </p>
        <ul className="custom-list">
          <li>
            <strong>Marginal tax rate</strong> — the rate applied to the last
            rupee or dollar you earn. This is the highest slab your income
            reaches. If you are in the 30% bracket, your marginal rate is 30% —
            but you do not pay 30% on your entire income.
          </li>
          <li>
            <strong>Effective tax rate</strong> — the actual percentage of your
            total gross income that goes to tax, after applying progressive
            slabs. This is always lower than the marginal rate because lower
            portions of your income are taxed at lower rates. This calculator
            displays both your tax amount and your effective rate.
          </li>
        </ul>
        <p>
          For example, if your total tax is ₹1,20,000 on an income of ₹6,00,000,
          your effective rate is 20% — even though your marginal rate might be
          30%. To see how a salary increase changes both rates, use our{" "}
          <Link href="/salary-hike-calculator/" className="my-link">
            salary hike calculator
          </Link>{" "}
          to model the before-and-after numbers.
        </p>

        <h2>How to Reduce Taxable Income Legally</h2>
        <ul className="custom-list">
          <li>
            <strong>Maximise retirement contributions</strong> — EPF, PPF, NPS,
            401(k), RRSP contributions reduce taxable income directly and grow
            tax-free or tax-deferred.
          </li>
          <li>
            <strong>Claim all eligible deductions</strong> — many people miss
            home loan interest, health insurance premiums, and education
            expenses. Model different amounts using the deductions field above.
          </li>
          <li>
            <strong>Invest in tax-saving instruments</strong> — India's Section
            80C allows up to ₹1.5 lakh through ELSS, PPF, life insurance.
            Similar tax-advantaged instruments exist in other countries.
          </li>
          <li>
            <strong>Use the correct tax regime</strong> — in India, compare old
            vs new regime to find which saves more. In the USA, compare standard
            vs itemized deductions.
          </li>
          <li>
            <strong>Time your income and deductions</strong> — deferring income
            to a lower-earning year or accelerating deductions can optimise your
            effective rate.
          </li>
          <li>
            <strong>Consult a professional</strong> — a tax advisor can identify
            country-specific credits and structures a general calculator cannot
            capture.
          </li>
        </ul>
        <p>
          Every deduction you claim reduces your taxable income, which reduces
          your tax. To see how your after-tax income compares to your housing
          costs, our{" "}
          <Link href="/rent-calculator/" className="my-link">
            rent calculator
          </Link>{" "}
          shows what percentage of take-home should go to rent, and our{" "}
          <Link href="/net-worth-calculator/" className="my-link">
            net worth calculator
          </Link>{" "}
          tracks how tax savings contribute to your overall financial growth.
        </p>

        <h2>How to Use This Income Tax Calculator</h2>
        <ul className="custom-list">
          <li>
            <strong>Step 1:</strong> Select your country from the dropdown —
            Pakistan, India, USA, UK, Canada, Australia, or Custom for any other
            jurisdiction.
          </li>
          <li>
            <strong>Step 2:</strong> Enter your annual gross income (salary +
            other taxable income).
          </li>
          <li>
            <strong>Step 3:</strong> Enter total deductions (optional). Leave
            blank or 0 to see tax on full gross income.
          </li>
          <li>
            <strong>Step 4:</strong> Click Calculate. The panel shows your tax
            amount, effective rate, net take-home, and a visual breakdown of
            where your income goes.
          </li>
        </ul>

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
          Understanding your income tax is the starting point for every
          financial decision — from how much you can afford to save, to whether
          a salary hike actually improves your take-home, to how much you can
          comfortably borrow. Use this calculator to see the exact numbers for
          your country and income level.
        </p>
        <p>
          For related tools, our{" "}
          <Link href="/salary-hike-calculator/" className="my-link">
            salary hike calculator
          </Link>{" "}
          shows how a raise changes your take-home after tax, our{" "}
          <Link href="/freelancer-tax-calculator/" className="my-link">
            freelancer tax calculator
          </Link>{" "}
          handles self-employment tax with platform fees, our{" "}
          <Link href="/emi-calculator/" className="my-link">
            EMI calculator
          </Link>{" "}
          shows your loan payments relative to net income, and our{" "}
          <Link href="/net-worth-calculator/" className="my-link">
            net worth calculator
          </Link>{" "}
          puts it all in the context of your complete financial picture.
        </p>
      </div>

      {/* ---- SIDEBAR ---- */}
      <aside className="sidebar">
        <div className="cr-desktop-slot">
          <IncomeTaxResultPanel result={panelResult} />
        </div>
        <div className="sidebar-box">
          <p style={{ fontSize: "20px", fontWeight: 600 }}>
            Related Calculators
          </p>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {[
              ["/salary-hike-calculator/", "Salary Hike Calculator"],
              ["/freelancer-tax-calculator/", "Freelancer Tax Calculator"],
              ["/net-worth-calculator/", "Net Worth Calculator"],
              ["/emi-calculator/", "EMI Calculator"],
              ["/rent-calculator/", "Rent Calculator"],
              ["/home-mortgage-calculator/", "Home Mortgage Calculator"],
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
