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

const FAQ_DATA: [string, string][] = [
  [
    "How much should a freelancer set aside for taxes?",
    "Apply your combined tax and contribution rate to profit, not to invoices. Someone whose costs run around 20% of revenue facing a combined rate near 30% needs roughly 24% of each payment. Taking a flat percentage of gross over-reserves rather than under-reserves, which is the safer error. Set the reserve high in year one and adjust down once you have a completed return to work from.",
  ],
  [
    "Is freelance tax charged on my invoices or my profit?",
    "On profit. Revenue minus platform fees minus allowable business expenses gives the figure that is taxed. This is why the invoiced total is the least useful number despite being the one people quote — 60,000 invoiced can be 46,000 taxable once fees and costs come out, and the tax follows the smaller figure.",
  ],
  [
    "Why do freelancers pay more tax than employees on the same income?",
    "Mostly because of social contributions. In employment those are typically split, with the employee paying a visible portion and the employer paying a further portion that never appears on the payslip. Self-employed, you generally stand in both positions and pay both parts. Nothing has been added — a cost that was previously invisible has become yours.",
  ],
  [
    "How much should I charge as a freelancer compared with a salary?",
    "More than the daily equivalent, and by a wider margin than most people assume. Alongside the doubled social contributions there is no paid leave, no sick pay, no employer pension contribution and no notice period, plus unbillable time spent finding work and doing admin. Comparing a day rate against a salary without pricing those in flatters the freelance side considerably.",
  ],
  [
    "What can I claim as a freelance business expense?",
    "Costs incurred for the business rather than for private benefit. Software, professional insurance, business equipment and platform fees are usually straightforward. Phone, internet, home workspace and vehicles need apportioning between business and personal use. Ordinary clothing and commuting to a regular workplace are typically not allowable, and nothing is claimable without a record of what it was for.",
  ],
  [
    "How do I claim something I use for both work and personal life?",
    "Claim a defensible proportion rather than all or nothing. A phone used roughly two-thirds for work supports claiming two-thirds of the bill, as long as you can explain how you reached that fraction. What fails scrutiny is not an aggressive percentage but an undocumented one, so record the basis at the time rather than reconstructing it later.",
  ],
  [
    "Do platform fees reduce my tax?",
    "Yes, in the sense that they are business costs and normally deductible, so they reduce taxable profit as well as reducing what lands in your account. Watch for currency conversion in particular, which is charged as a margin on the exchange rate rather than as a visible fee — comparing the rate you received against the mid-market rate for that day is the only way to see what it cost.",
  ],
  [
    "Why is my first tax bill so much larger than expected?",
    "Because many systems ask for the balance of your first year and an advance instalment toward the second at close to the same time, which can mean paying well over one year's tax within a few months. It is a timing effect rather than an extra charge, but it is a real cash demand, and a reserve sized against a single year's liability will not cover it.",
  ],
  [
    "Do I need to charge VAT or GST on my freelance work?",
    "Only above your jurisdiction's registration threshold, or if you register voluntarily. Below it you generally invoice without adding consumption tax. The threshold, the rate and the rules on cross-border services all vary by country and change over time, so confirm the current position with your own tax authority rather than assuming another country's rules apply.",
  ],
];

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQ_DATA.map(([q, a]) => ({
              "@type": "Question",
              name: q,
              acceptedAnswer: { "@type": "Answer", text: a },
            })),
          }),
        }}
      />
      <div className="single-page-padding">
        <h1>
          Freelance Tax Calculator — From Invoice to Take-Home
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

        <h2>Four Numbers, and Only the Last One Is Yours</h2>
        <p>
          The figure on your invoice and the figure you can spend are separated
          by three deductions, and freelancers who plan against the first number
          rather than the last are the ones who get caught out in their first
          tax year.
        </p>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Stage</th>
                <th>What comes off</th>
                <th>Example on 60,000 invoiced</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Invoiced</td>
                <td>Nothing yet</td>
                <td>60,000</td>
              </tr>
              <tr>
                <td>Received</td>
                <td>Platform and payment fees</td>
                <td>54,000</td>
              </tr>
              <tr>
                <td>Taxable profit</td>
                <td>Allowable business expenses</td>
                <td>46,000</td>
              </tr>
              <tr>
                <td>Take-home</td>
                <td>Income tax and social contributions</td>
                <td>What is genuinely yours</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          Two things about that table are worth pausing on. Expenses reduce the
          amount you are taxed on but they are still money you spent — a
          deduction is a discount on tax, never a refund of the cost. And tax is
          charged on profit, not on turnover, which is why the invoiced figure
          is the least useful number in the sequence despite being the one
          people quote.
        </p>

        <h2>How Much to Set Aside, and From What</h2>
        <p>
          The single most useful habit in freelancing is moving a fixed
          proportion of every payment into a separate account the moment it
          arrives. What trips people up is applying that percentage to the wrong
          base.
        </p>
        <pre>
          Set aside = (Payment received − expenses attributable to it) × your
          combined tax and contribution rate
        </pre>
        <p>
          Taking a flat percentage of gross invoices over-reserves if your
          expenses are substantial, and under-reserves nothing — so as a
          starting position it errs safely. The more precise approach is to work
          from your expected profit margin. A freelancer whose costs run at
          around 20% of revenue and who faces a combined rate near 30% needs
          roughly 24% of each payment, not 30%.
        </p>
        <p>
          Set the reserve high in your first year and adjust downward once you
          have a completed return to work from. The failure mode is not
          reserving too much; it is discovering in month eleven that the reserve
          is short.
        </p>

        <h2>Platform Fees Come Off First</h2>
        <p>
          Marketplace and payment fees are deducted before the money reaches
          you, which makes them easy to forget when quoting.
        </p>
        <p>
          Two mechanics matter. A percentage commission scales with the invoice,
          so a large project loses proportionally the same as a small one. A
          fixed per-transaction fee does the opposite — it is negligible on a
          5,000 invoice and material on a 50 one, which is a reason to bill
          monthly rather than per small task where the client allows it.
        </p>
        <p>
          Currency conversion is the fee freelancers most often miss, because it
          is charged as an exchange-rate margin rather than as a line item. Paid
          in a foreign currency into a local account, you can lose a few percent
          without ever seeing a fee on the statement. Comparing the rate you
          received against the mid-market rate for that day is the only way to
          see it.
        </p>
        <p>
          Fees charged to you are business costs and are normally deductible, so
          they reduce taxable profit as well as reducing what you receive.
        </p>

        <h2>What Actually Counts as an Expense</h2>
        <p>
          The governing principle in most systems is the same even where the
          detail differs: a cost is deductible if it was incurred for the
          purposes of the business and not for private benefit. Clear-cut cases
          are easy.
        </p>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Usually straightforward</th>
                <th>Needs apportioning</th>
                <th>Usually not allowed</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Software subscriptions used for work</td>
                <td>Phone and internet used for both</td>
                <td>Ordinary clothing, even if worn to meetings</td>
              </tr>
              <tr>
                <td>Professional insurance and fees</td>
                <td>A room at home used partly for work</td>
                <td>Commuting to a regular place of work</td>
              </tr>
              <tr>
                <td>Equipment bought solely for the business</td>
                <td>A vehicle used for business and personal trips</td>
                <td>Entertaining clients, in many jurisdictions</td>
              </tr>
              <tr>
                <td>Platform and payment processing fees</td>
                <td>Training that partly renews existing skills</td>
                <td>Anything without a record of what it was for</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          The middle column is where most disputes arise, and the answer is
          almost always a defensible split rather than all or nothing. A phone
          used roughly two-thirds for work supports claiming two-thirds of the
          bill, provided you can explain how you arrived at the fraction. What
          fails is not an aggressive proportion but an undocumented one.
        </p>
        <p>
          Larger equipment is often treated differently from consumables, spread
          across several years rather than deducted in full immediately. If you
          have bought something substantial, check how your system treats
          capital items before assuming the whole cost lands in this year.
        </p>

        <h2>The Tax Employees Do Not See</h2>
        <p>
          Freelancers frequently compare their rate against a salaried
          equivalent and conclude they are being taxed unusually heavily. Often
          they are, and the reason is structural rather than punitive.
        </p>
        <p>
          In employment, social contributions are typically split — the employee
          pays a portion visible on the payslip, and the employer pays a further
          portion that never appears there at all. Working for yourself, you
          generally stand in both positions and pay both parts. Nothing has been
          added; a cost that was previously invisible has become yours.
        </p>
        <p>
          This is the main reason a freelance day rate has to exceed the daily
          equivalent of a salary to leave you level. Alongside the doubled
          contributions there is no paid leave, no sick pay, no employer pension
          contribution and no notice period. Comparing a freelance rate against
          a salary without pricing those in flatters the freelance side
          considerably.
        </p>

        <h2>Paying Through the Year</h2>
        <p>
          Most systems expect tax on self-employment income during the year
          rather than in one payment afterwards, usually as instalments based on
          the previous year&apos;s liability or on your own estimate.
        </p>
        <p>
          The first year is the difficult one and it catches almost everyone.
          You may face the balance for your first year and an advance instalment
          toward the second at close to the same time, which can mean paying
          substantially more than one year&apos;s tax within a few months. This
          is a timing effect rather than an extra charge, but it is a real cash
          demand, and the reserve that felt generous against a single year&apos;s
          liability can prove inadequate against it.
        </p>
        <p>
          Where income is uneven, base instalments on a realistic projection
          rather than annualising a strong quarter. Overpaying ties up cash you
          could be using; underpaying can attract interest or penalties.
        </p>

        <h2>Rates Differ, the Method Does Not</h2>
        <p>
          Thresholds, contribution rules, registration limits and allowances
          vary substantially between countries and change from year to year. The
          sequence does not: revenue, minus fees, minus allowable expenses, gives
          profit; profit drives income tax and social contributions; what remains
          is yours.
        </p>
        <p>
          Two features worth checking for in your own system, because both
          change the arithmetic materially. Some jurisdictions offer a
          presumptive or simplified scheme for smaller professional incomes,
          where tax is computed on a deemed percentage of turnover instead of
          actual profit — simpler to administer, and better or worse depending
          on your real cost base. And most have a registration threshold for
          consumption taxes such as VAT or GST, above which you must charge it
          on your invoices; our{" "}
          <Link href="/vat-calculator/" className="my-link">
            VAT calculator
          </Link>{" "}
          handles that side.
        </p>
        <p>
          Use this calculator to model the shape of your position and to set a
          reserve, then confirm the specifics against your own tax authority or
          an accountant before filing. For salaried income the{" "}
          <Link href="/income-tax-calculator/" className="my-link">
            income tax calculator
          </Link>{" "}
          applies instead, and our guide to{" "}
          <Link
            href="/blog/marginal-vs-effective-tax-rate/"
            className="my-link"
          >
            marginal versus effective tax rates
          </Link>{" "}
          explains why your headline band is not the rate you actually pay.
        </p>
        <h2>Freelance Tax Questions</h2>

        {FAQ_DATA.map(([q, a], i) => {
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
