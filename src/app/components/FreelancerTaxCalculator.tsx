"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

/* ─────────────────────────────────────────
   Types
───────────────────────────────────────── */
interface TaxResult {
  periodLabel: string;
  grossIncome: number;
  platformFeeAmt: number;
  incomeAfterFee: number;
  expensesAmt: number;
  taxableIncome: number;
  taxAmt: number;
  netTakeHome: number;
  effectiveRate: number;
  currencySymbol: string;
}

/* ─────────────────────────────────────────
   Pure helper
───────────────────────────────────────── */
function needleDeg(ratio: number): number {
  const clamped = Math.min(Math.max(ratio, 0), 1);
  return -90 + clamped * 180;
}

/* ─────────────────────────────────────────
   FreelancerTaxResultPanel
───────────────────────────────────────── */
function FreelancerTaxResultPanel({ result }: { result: TaxResult | null }) {
  if (!result) {
    return (
      <div className="cr-panel-placeholder">
        <div className="cr-ph-icon">
          <i className="fa-solid fa-receipt" aria-hidden="true" />
        </div>
        Enter your income and tax details to see your take-home breakdown here.
      </div>
    );
  }
  const {
    grossIncome,
    platformFeeAmt,
    expensesAmt,
    taxableIncome,
    taxAmt,
    netTakeHome,
    effectiveRate,
    currencySymbol,
    periodLabel,
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
    effectiveRate < 10
      ? "Very low tax"
      : effectiveRate < 20
        ? "Low tax"
        : effectiveRate < 30
          ? "Moderate tax"
          : effectiveRate < 40
            ? "High tax"
            : "Very high tax";
  const rateBadge =
    effectiveRate < 10
      ? "good"
      : effectiveRate < 20
        ? "normal"
        : effectiveRate < 30
          ? "warning"
          : "danger";
  const takeHomePct =
    grossIncome > 0 ? Math.round((netTakeHome / grossIncome) * 100) : 0;
  const taxPct = grossIncome > 0 ? Math.round((taxAmt / grossIncome) * 100) : 0;
  const feePct =
    grossIncome > 0 ? Math.round((platformFeeAmt / grossIncome) * 100) : 0;
  const expPct =
    grossIncome > 0 ? Math.round((expensesAmt / grossIncome) * 100) : 0;

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
            <clipPath id="tax-half">
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
            clipPath="url(#tax-half)"
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
            clipPath="url(#tax-half)"
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
            clipPath="url(#tax-half)"
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
            clipPath="url(#tax-half)"
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
          <div className="cr-score" style={{ fontSize: "22px" }}>
            {currencySymbol}
            {fmt(netTakeHome)}
          </div>
          <div className="cr-score-label">
            net take-home ({periodLabel.toLowerCase()})
          </div>
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
            {currencySymbol}
            {fmt(grossIncome)}
          </div>
          <div className="cr-m-sub">before deductions</div>
        </div>
        <div className="cr-metric-card">
          <div className="cr-m-label">Taxable income</div>
          <div className="cr-m-value" style={{ fontSize: "13px" }}>
            {currencySymbol}
            {fmt(taxableIncome)}
          </div>
          <div className="cr-m-sub">after fees & expenses</div>
        </div>
        <div className="cr-metric-card">
          <div className="cr-m-label">Tax amount</div>
          <div
            className="cr-m-value"
            style={{ fontSize: "13px", color: "#A32D2D" }}
          >
            {currencySymbol}
            {fmt(taxAmt)}
          </div>
          <div className="cr-m-sub">
            {effectiveRate.toFixed(1)}% effective rate
          </div>
        </div>
        <div className="cr-metric-card">
          <div className="cr-m-label">Net take-home</div>
          <div
            className="cr-m-value"
            style={{ fontSize: "13px", color: "#3B6D11" }}
          >
            {currencySymbol}
            {fmt(netTakeHome)}
          </div>
          <div className="cr-m-sub">{takeHomePct}% of gross</div>
        </div>
      </div>
      <hr className="cr-divider" />
      <div>
        <div className="cr-world-title">where your gross income goes</div>
        <div className="cr-world-bar-row">
          <span className="cr-w-label">Take-home</span>
          <div className="cr-world-track">
            <div
              className="cr-world-fill"
              style={{ width: `${takeHomePct}%`, background: "#97C459" }}
            />
          </div>
          <span className="cr-w-pct" style={{ width: "32px" }}>
            {takeHomePct}%
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
        {feePct > 0 && (
          <div className="cr-world-bar-row">
            <span className="cr-w-label">Platform</span>
            <div className="cr-world-track">
              <div
                className="cr-world-fill"
                style={{ width: `${feePct}%`, background: "#FAC775" }}
              />
            </div>
            <span className="cr-w-pct" style={{ width: "32px" }}>
              {feePct}%
            </span>
          </div>
        )}
        {expPct > 0 && (
          <div className="cr-world-bar-row">
            <span className="cr-w-label">Expenses</span>
            <div className="cr-world-track">
              <div
                className="cr-world-fill"
                style={{ width: `${expPct}%`, background: "#B5D4F4" }}
              />
            </div>
            <span className="cr-w-pct" style={{ width: "32px" }}>
              {expPct}%
            </span>
          </div>
        )}
        <p className="cr-world-note">
          You keep{" "}
          <strong>
            {currencySymbol}
            {fmt(netTakeHome)}
          </strong>{" "}
          from every {currencySymbol}
          {fmt(grossIncome)} earned — {takeHomePct}% of gross income.
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Main Calculator Page
───────────────────────────────────────── */
export default function FreelancerTaxCalculator() {
  const [income, setIncome] = useState("");
  const [platformFee, setPlatformFee] = useState("");
  const [expenses, setExpenses] = useState("");
  const [taxRate, setTaxRate] = useState("");
  const [currency, setCurrency] = useState("USD ($)");
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [period, setPeriod] = useState<"monthly" | "quarterly" | "annual">(
    "monthly",
  );
  const [periodOpen, setPeriodOpen] = useState(false);
  const [panelResult, setPanelResult] = useState<TaxResult | null>(null);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const toggleFAQ = (index: number) =>
    setOpenFAQ(openFAQ === index ? null : index);

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
    const stripped = val.replace(/,/g, "");
    return stripped === "" ? 0 : Number(stripped);
  };

  const getCurrencySymbol = (cur: string) =>
    cur.includes("$")
      ? "$"
      : cur.includes("£")
        ? "£"
        : cur.includes("€")
          ? "€"
          : cur.includes("₹")
            ? "₹"
            : cur.includes("₨")
              ? "Rs "
              : cur.includes("AED")
                ? "AED "
                : "$";

  const currencies = [
    "USD ($)",
    "GBP (£)",
    "EUR (€)",
    "INR (₹)",
    "PKR (₨)",
    "AED (AED)",
  ];

  const compute = (): TaxResult | null => {
    const grossIncome = toNum(income);
    const pfPct = toNum(platformFee);
    const expensesAmt = toNum(expenses);
    const tRate = toNum(taxRate);
    if (!grossIncome || !tRate) return null;
    const platformFeeAmt = (grossIncome * pfPct) / 100;
    const incomeAfterFee = grossIncome - platformFeeAmt;
    const taxableIncome = Math.max(0, incomeAfterFee - expensesAmt);
    const taxAmt = (taxableIncome * tRate) / 100;
    const netTakeHome = taxableIncome - taxAmt;
    const effectiveRate = grossIncome > 0 ? (taxAmt / grossIncome) * 100 : 0;
    const periodLabel =
      period === "monthly"
        ? "Monthly"
        : period === "quarterly"
          ? "Quarterly"
          : "Annual";
    return {
      periodLabel,
      grossIncome,
      platformFeeAmt,
      incomeAfterFee,
      expensesAmt,
      taxableIncome,
      taxAmt,
      netTakeHome,
      effectiveRate,
      currencySymbol: getCurrencySymbol(currency),
    };
  };

  useEffect(() => {
    setPanelResult(compute());
  }, [income, platformFee, expenses, taxRate, currency, period]);
  const calculate = () => setPanelResult(compute());
  const handleClear = () => {
    setIncome("");
    setPlatformFee("");
    setExpenses("");
    setTaxRate("");
    setCurrency("USD ($)");
    setPeriod("monthly");
    setPeriodOpen(false);
    setCurrencyOpen(false);
    setPanelResult(null);
  };

  return (
    <div className="page-layout">
      <div className="single-page-padding">
        <h1>
          Free Freelance Tax Calculator — Self-Employment Tax With Deductions
        </h1>
        <p>
          Estimate your freelance take-home pay after platform fees, business
          expense deductions, and taxes. This free self-employment tax
          calculator with deductions works for monthly, quarterly, or annual
          income in six currencies — perfect for Upwork, Fiverr, and independent
          contractors worldwide.
        </p>

        <div className="calc-card single-calc">
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr", gap: "10px" }}
          >
            <input
              className="calc-input"
              type="text"
              inputMode="decimal"
              placeholder={
                period === "monthly"
                  ? "Gross Monthly Income"
                  : period === "quarterly"
                    ? "Gross Quarterly Income"
                    : "Gross Annual Income"
              }
              value={income}
              onChange={handleChange(setIncome)}
              style={{ margin: 0 }}
            />
            <div
              className="modern-dropdown"
              onClick={() => setPeriodOpen(!periodOpen)}
              style={{ margin: 0 }}
            >
              {period === "monthly"
                ? "Monthly"
                : period === "quarterly"
                  ? "Quarterly"
                  : "Annual"}
              <span className="dropdown-indicator">▼</span>
              {periodOpen && (
                <ul className="dropdown-list">
                  <li
                    onClick={() => {
                      setPeriod("monthly");
                      setPeriodOpen(false);
                    }}
                  >
                    Monthly
                  </li>
                  <li
                    onClick={() => {
                      setPeriod("quarterly");
                      setPeriodOpen(false);
                    }}
                  >
                    Quarterly
                  </li>
                  <li
                    onClick={() => {
                      setPeriod("annual");
                      setPeriodOpen(false);
                    }}
                  >
                    Annual
                  </li>
                </ul>
              )}
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "10px",
              marginTop: "10px",
            }}
          >
            <input
              className="calc-input"
              type="text"
              inputMode="decimal"
              placeholder="Platform Fee % (Upwork, Fiverr…)"
              value={platformFee}
              onChange={handleChange(setPlatformFee)}
              style={{ margin: 0 }}
            />
            <input
              className="calc-input"
              type="text"
              inputMode="decimal"
              placeholder="Business Expenses (Tools, Internet…)"
              value={expenses}
              onChange={handleChange(setExpenses)}
              style={{ margin: 0 }}
            />
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "10px",
              marginTop: "10px",
            }}
          >
            <input
              className="calc-input"
              type="text"
              inputMode="decimal"
              placeholder="Your Tax Rate (%)"
              value={taxRate}
              onChange={handleChange(setTaxRate)}
              style={{ margin: 0 }}
            />
            <div
              className="modern-dropdown"
              onClick={() => setCurrencyOpen(!currencyOpen)}
              style={{ margin: 0 }}
            >
              {currency}
              <span className="dropdown-indicator">▼</span>
              {currencyOpen && (
                <ul className="dropdown-list">
                  {currencies.map((c) => (
                    <li
                      key={c}
                      onClick={() => {
                        setCurrency(c);
                        setCurrencyOpen(false);
                      }}
                    >
                      {c}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <button
              className="calc-button"
              onClick={calculate}
              style={{ flex: "7" }}
            >
              Calculate
            </button>
            <button
              className="calc-button calc-clear"
              onClick={handleClear}
              style={{ flex: "3" }}
            >
              Clear
            </button>
          </div>
        </div>

        <div className="cr-mobile-slot">
          <FreelancerTaxResultPanel result={panelResult} />
        </div>

        {/* ---- SEO CONTENT ---- */}

        <h2>What Is a Freelance Tax Calculator?</h2>
        <p>
          A freelance tax calculator helps independent workers, remote
          professionals, side hustlers, and self-employed individuals figure out
          exactly how much money they actually take home after paying platform
          fees, deducting business expenses, and setting aside taxes. Unlike
          salaried employees whose taxes are withheld automatically, freelancers
          are responsible for calculating and paying their own taxes — which
          makes a dedicated freelance income tax estimator like this essential
          for financial planning.
        </p>
        <p>
          This tool functions as a self-employment tax calculator with
          deductions, a side hustle tax calculator for part-time freelancers,
          and a freelancer quarterly tax calculator for those who need to
          estimate quarterly payments — all in one. It also doubles as a
          freelancer effective tax rate calculator, showing the actual
          percentage of your gross income that goes to tax after all deductions
          are applied. If you earn a regular salary alongside freelance work and
          want to see how your employer-side income is taxed, our{" "}
          <Link href="/income-tax-calculator/" className="my-link">
            income tax calculator
          </Link>{" "}
          handles salaried tax computations.
        </p>

        <h2>How Freelancer Tax Is Calculated</h2>
        <p>
          Freelancer tax calculation works in a clear sequence. First, your
          gross income is reduced by any platform commission (Upwork, Fiverr,
          etc.). Then legitimate business expenses are deducted to arrive at
          your taxable income. Your tax rate is applied to that taxable income
          to find the tax amount. What remains is your actual take-home pay —
          the real money you keep. Here is the formula:
        </p>
        <pre>
          Income After Platform Fee = Gross Income − Platform Fee{"\n"}
          Taxable Income = Income After Fee − Business Expenses{"\n"}
          Tax Amount = Taxable Income × Tax Rate ÷ 100{"\n"}
          Net Take-Home = Taxable Income − Tax Amount
        </pre>

        <h2>
          Worked Example — How Much of Your Freelance Income Goes to Taxes
        </h2>
        <p>
          A freelance web developer earns $5,000 per month on Upwork with a 10%
          platform fee, $400 in monthly business expenses (software, internet,
          coworking), and a combined federal + self-employment tax rate of 30%:
        </p>
        <ul className="custom-list">
          <li>
            <strong>Gross income:</strong> $5,000
          </li>
          <li>
            <strong>Platform fee (10%):</strong> −$500
          </li>
          <li>
            <strong>Income after fee:</strong> $4,500
          </li>
          <li>
            <strong>Business expenses:</strong> −$400
          </li>
          <li>
            <strong>Taxable income:</strong> $4,100
          </li>
          <li>
            <strong>Tax (30%):</strong> −$1,230
          </li>
          <li>
            <strong>Net take-home:</strong> <strong>$2,870</strong> (57.4% of
            gross)
          </li>
          <li>
            <strong>Effective tax rate:</strong> 24.6% of gross income
          </li>
        </ul>
        <p>
          This means $2,130 of every $5,000 earned goes to platform fees,
          expenses, and taxes — which is why knowing the exact breakdown
          matters. Without tracking deductions, this freelancer would owe tax on
          $4,500 instead of $4,100, paying $120 more in tax every single month.
          Over a year, that is $1,440 in unnecessary tax. To track how your
          freelance savings are building over time, our{" "}
          <Link href="/net-worth-calculator/" className="my-link">
            net worth calculator
          </Link>{" "}
          shows your complete financial picture.
        </p>

        <h2>What Is the Self-Employment Tax Rate?</h2>
        <p>
          The self-employment tax rate varies by country. In many countries,
          freelancers pay both income tax and an additional self-employment or
          social security contribution. Here is a reference table for the most
          common countries:
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
                  Country
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Self-Employment / Social Tax
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Income Tax Range
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Combined Rate to Enter
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                [
                  "United States",
                  "15.3% (Social Security + Medicare)",
                  "10%–37%",
                  "25%–45%",
                ],
                ["United Kingdom", "Class 4 NI: 6%–2%", "20%–45%", "26%–47%"],
                [
                  "Canada",
                  "CPP: ~11.9% (self-employed portion)",
                  "15%–33%",
                  "27%–45%",
                ],
                ["India", "None (no SE tax)", "0%–30% (slab-based)", "0%–30%"],
                [
                  "Pakistan (PSEB)",
                  "Potentially exempt on IT exports",
                  "0%–35%",
                  "0% if exempt, else 15%–35%",
                ],
                ["UAE / Dubai", "None", "0%", "0%"],
                ["Germany", "~20% social contributions", "14%–45%", "34%–65%"],
                ["Australia", "Medicare levy: 2%", "0%–45%", "2%–47%"],
              ].map(([country, se, income, combined], i) => (
                <tr key={i}>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {country}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {se}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {income}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {combined}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Enter the "Combined Rate" column value in the Tax Rate field above for
          a realistic estimate. Always consult a local tax advisor for your
          specific situation, as rates change and individual circumstances vary.
        </p>

        <h2>Platform Fees — What Each Platform Takes</h2>
        <ul className="custom-list">
          <li>
            <strong>Upwork</strong> — 10% flat rate on all earnings
          </li>
          <li>
            <strong>Fiverr</strong> — 20% on every order
          </li>
          <li>
            <strong>Freelancer.com</strong> — 10% or a flat fee, whichever is
            higher
          </li>
          <li>
            <strong>Toptal</strong> — fee built into client billing, varies by
            contract
          </li>
          <li>
            <strong>PeoplePerHour</strong> — up to 20% depending on earnings
            tier
          </li>
          <li>
            <strong>Direct clients (no platform)</strong> — 0% — enter 0 in the
            platform fee field
          </li>
        </ul>

        <h2>What Business Expenses Can Freelancers Deduct?</h2>
        <p>
          One of the biggest advantages of self-employment is the ability to
          deduct legitimate business expenses before tax is calculated. This
          directly lowers your taxable income and reduces how much tax you owe.
          Common deductible expenses include:
        </p>
        <ul className="custom-list">
          <li>Internet and phone bills used for work</li>
          <li>
            Software subscriptions (Adobe, Notion, Figma, Slack, GitHub, etc.)
          </li>
          <li>Laptop, computer, monitor, or equipment purchases</li>
          <li>Home office space (a portion of rent or utilities)</li>
          <li>Professional courses, certifications, books, and training</li>
          <li>Accounting and bookkeeping software or accountant fees</li>
          <li>Travel costs for client meetings or conferences</li>
          <li>Marketing, advertising, and portfolio website hosting</li>
          <li>Health insurance premiums (in some countries)</li>
          <li>Retirement contributions (often tax-deductible)</li>
        </ul>
        <p>
          Track every expense throughout the year — even small ones add up. A
          freelancer spending $400/month on deductible tools and services saves
          $1,440/year in tax at a 30% rate. That is money you keep simply by
          recording what you already spend. If you want to see what percentage
          of your income goes to various expenses, our{" "}
          <Link href="/bill-split-calculator/" className="my-link">
            bill split calculator
          </Link>{" "}
          can help divide shared costs like coworking or team tools.
        </p>

        <h2>How Much to Set Aside for Taxes as a Freelancer</h2>
        <p>
          The most common mistake new freelancers make is spending all their
          income and then facing a large tax bill they cannot pay. The solution
          is to set aside a percentage of every payment into a separate tax
          savings account. Here is a practical framework:
        </p>
        <ul className="custom-list">
          <li>
            <strong>Low tax bracket (under 20% effective rate):</strong> Set
            aside 20% to 25% of gross income.
          </li>
          <li>
            <strong>Moderate tax bracket (20%–30% effective rate):</strong> Set
            aside 25% to 30%.
          </li>
          <li>
            <strong>High tax bracket (above 30% effective rate):</strong> Set
            aside 30% to 35%.
          </li>
          <li>
            <strong>If unsure:</strong> 30% is the safest default in most
            countries. It is better to save too much and get a refund than to
            save too little and owe a large bill.
          </li>
        </ul>
        <p>
          Use this calculator to find your actual effective tax rate — the gauge
          in the results panel shows it instantly. Once you know your effective
          rate, adjust your set-aside percentage accordingly. If you have a
          salary hike from a side employer alongside freelance work, our{" "}
          <Link href="/salary-hike-calculator/" className="my-link">
            salary hike calculator
          </Link>{" "}
          can show how the raise affects your overall tax bracket.
        </p>

        <h2>Freelancer Quarterly Tax Payments</h2>
        <p>
          In the United States, United Kingdom, Canada, Australia, and many
          other countries, freelancers are required to make quarterly estimated
          tax payments rather than waiting until year-end. Missing quarterly
          deadlines can result in penalties and interest charges even if you
          eventually pay the full amount. This calculator works as a freelancer
          quarterly tax calculator — select "Quarterly" from the period
          dropdown, enter your quarterly gross income, and see exactly how much
          to pay each quarter.
        </p>
        <p>Typical quarterly payment deadlines (US):</p>
        <ul className="custom-list">
          <li>
            <strong>Q1 (Jan–Mar):</strong> Due April 15
          </li>
          <li>
            <strong>Q2 (Apr–Jun):</strong> Due June 15
          </li>
          <li>
            <strong>Q3 (Jul–Sep):</strong> Due September 15
          </li>
          <li>
            <strong>Q4 (Oct–Dec):</strong> Due January 15 (following year)
          </li>
        </ul>

        <h2>Side Hustle Tax — Do I Pay Tax on Part-Time Freelance Income?</h2>
        <p>
          Yes. If you have a regular job and earn freelance income on the side,
          that side hustle income is taxable in virtually every country. Even a
          few hundred dollars per month from Fiverr gigs, tutoring, or weekend
          consulting counts as self-employment income. The advantage of using
          this calculator as a side hustle tax calculator is that you can
          estimate the tax on just your freelance portion — enter only the side
          income, deductions, and your marginal tax rate to see what you owe on
          top of your regular salary taxes. Our{" "}
          <Link href="/income-tax-calculator/" className="my-link">
            income tax calculator
          </Link>{" "}
          handles the salaried portion separately.
        </p>

        <h2>Why Freelancers Must Plan Taxes in Advance</h2>
        <p>
          Unlike employees, freelancers do not have an employer withholding
          taxes from each payment. If you spend everything you earn, you face a
          large unexpected tax bill at year-end. Setting aside money from every
          payment into a dedicated tax account — ideally automatically via a
          recurring transfer — means the money is already waiting when tax time
          arrives. This simple habit eliminates the most common financial stress
          freelancers face.
        </p>

        <h2>Tips to Reduce Your Freelancer Tax Bill Legally</h2>
        <ul className="custom-list">
          <li>
            <strong>Register as a business entity</strong> — LLCs, sole traders,
            or S-corps often have tax advantages over reporting as personal
            income.
          </li>
          <li>
            <strong>Track every business expense</strong> — no matter how small.
            Use accounting software like QuickBooks, Wave, or FreshBooks to
            automate it.
          </li>
          <li>
            <strong>Make quarterly estimated payments</strong> — to avoid
            penalties and spread the burden evenly throughout the year.
          </li>
          <li>
            <strong>Contribute to a retirement account</strong> — contributions
            to SEP IRAs, Solo 401(k)s, or pension funds are often
            tax-deductible, reducing your taxable income.
          </li>
          <li>
            <strong>Hire a freelancer-specialist accountant</strong> — the fee
            is itself deductible, and a good accountant typically saves you more
            than they cost.
          </li>
          <li>
            <strong>Invoice strategically</strong> — in some countries,
            deferring an invoice to the next tax year can lower your current
            year's tax bracket.
          </li>
          <li>
            <strong>Claim the home office deduction</strong> — if you work from
            home, a portion of your rent, electricity, and internet is
            deductible.
          </li>
        </ul>
        <p>
          Every deduction you claim reduces how much of your freelance income
          goes to taxes. Even $200/month in additional tracked deductions saves
          $720/year at a 30% rate. If you are managing loans alongside freelance
          work, our{" "}
          <Link href="/emi-calculator/" className="my-link">
            EMI calculator
          </Link>{" "}
          shows your monthly debt payments so you can plan cash flow around both
          tax and loan obligations.
        </p>

        <h2>Frequently Asked Questions</h2>

        {[
          [
            "How do I calculate tax as a freelancer?",
            "Start with your gross freelance income, subtract platform fees and deductible business expenses to get your taxable income, then multiply by your combined tax rate (income tax + self-employment tax). The result is your tax amount. Subtract that from taxable income to get your net take-home pay. This calculator handles all of this automatically.",
          ],
          [
            "How much should I set aside for taxes as a freelancer?",
            "A safe rule is 25% to 30% of every payment you receive. This covers income tax and self-employment contributions in most countries. Use this calculator to find your actual effective tax rate, then adjust your set-aside accordingly. If your effective rate is 22%, saving 25% gives you a comfortable buffer.",
          ],
          [
            "How much tax do freelancers pay?",
            "It depends on your country and income level. In the US, freelancers pay 15.3% self-employment tax plus federal income tax (10%–37%), for a combined rate of roughly 25%–45%. In the UK, it is income tax (20%–45%) plus National Insurance. In the UAE, there is no personal income tax. The comparison table above shows rates for eight countries.",
          ],
          [
            "What is the self-employment tax rate?",
            "In the United States, the self-employment tax rate is 15.3% — that covers 12.4% for Social Security and 2.9% for Medicare. This is in addition to federal and state income tax. Most other countries have similar social contribution requirements under different names.",
          ],
          [
            "Do I need to pay tax on Upwork or Fiverr earnings?",
            "Yes. Income earned through any freelancing platform is taxable in virtually every country. The platform does not withhold or pay your taxes — that is your responsibility. The platform fee they charge is a business expense you can typically deduct from your taxable income.",
          ],
          [
            "Can I deduct my laptop and software?",
            "In most countries, yes. If you use your laptop, software subscriptions, internet, or other tools primarily for freelance work, these are legitimate deductible business expenses. Keep receipts and records to support your deductions.",
          ],
          [
            "What is the effective tax rate?",
            "The effective tax rate is the actual percentage of your total gross income that goes to tax after all deductions are applied. It is almost always lower than your stated tax bracket because deductions reduce your taxable income. This calculator shows your effective rate automatically in the results gauge.",
          ],
          [
            "Do I need to make quarterly tax payments?",
            "In the US, UK, Canada, Australia, and many other countries, yes — freelancers must make quarterly estimated payments. Missing deadlines results in penalties. Select 'Quarterly' in this calculator to estimate each quarterly payment amount.",
          ],
          [
            "Are freelancers in Pakistan or UAE exempt from tax?",
            "In the UAE, there is currently no personal income tax. In Pakistan, freelancers registered with the Pakistan Software Export Board (PSEB) may qualify for tax exemptions on IT export remittances. Tax laws change regularly — always verify with a local tax advisor or the FBR website.",
          ],
          [
            "Is this freelance tax calculator free?",
            "Yes — completely free with no sign-up, no data stored, and no limits. Calculate for any income amount, any platform fee, any deduction, and any tax rate. Works for monthly, quarterly, or annual periods in USD, GBP, EUR, INR, PKR, and AED.",
          ],
        ].map(([q, a], i) => (
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
          Freelancing gives you freedom, but that freedom comes with the
          responsibility of managing your own taxes. Knowing how much of your
          freelance income goes to taxes — and planning for it — is the
          difference between financial stress and financial control. Use this
          calculator before every quarter to estimate your payments, track your
          deductions, and see your real take-home pay.
        </p>
        <p>
          For related tools, our{" "}
          <Link href="/income-tax-calculator/" className="my-link">
            income tax calculator
          </Link>{" "}
          handles salaried tax computations, our{" "}
          <Link href="/salary-hike-calculator/" className="my-link">
            salary hike calculator
          </Link>{" "}
          shows how a raise changes your take-home, our{" "}
          <Link href="/net-worth-calculator/" className="my-link">
            net worth calculator
          </Link>{" "}
          tracks your overall financial progress, and our{" "}
          <Link href="/emi-calculator/" className="my-link">
            EMI calculator
          </Link>{" "}
          helps plan loan payments alongside your tax obligations.
        </p>
      </div>

      {/* ---- SIDEBAR ---- */}
      <aside className="sidebar">
        <div className="cr-desktop-slot">
          <FreelancerTaxResultPanel result={panelResult} />
        </div>
        <div className="sidebar-box">
          <p style={{ fontSize: "20px", fontWeight: 600 }}>
            Related Calculators
          </p>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {[
              ["/income-tax-calculator/", "Income Tax Calculator"],
              ["/salary-hike-calculator/", "Salary Hike Calculator"],
              ["/net-worth-calculator/", "Net Worth Calculator"],
              ["/emi-calculator/", "EMI Calculator"],
              ["/bill-split-calculator/", "Bill Split Calculator"],
              ["/discount-calculator/", "Discount Calculator"],
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
