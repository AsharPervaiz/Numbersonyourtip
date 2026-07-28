"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

/* ─────────────────────────────────────────
   Types
───────────────────────────────────────── */
interface MortgageResult {
  loanAmount: number;
  monthlyEMI: number;
  totalInterest: number;
  totalPayment: number;
  downPercent: number;
  interestBurdenPct: number; // totalInterest / loanAmount * 100
  loanToValuePct: number; // loanAmount / homePrice * 100
  homePrice: number;
}

/* ─────────────────────────────────────────
   Pure helper
───────────────────────────────────────── */
function needleDeg(ratio: number): number {
  const clamped = Math.min(Math.max(ratio, 0), 1);
  return -90 + clamped * 180;
}

/* ─────────────────────────────────────────
   MortgageResultPanel
   Gauge = interest burden % (0 → 200%+)
   Meter bar = same
───────────────────────────────────────── */
function MortgageResultPanel({ result }: { result: MortgageResult | null }) {
  if (!result) {
    return (
      <div className="cr-panel-placeholder">
        <div className="cr-ph-icon">
          <i className="fa-solid fa-house-chimney" aria-hidden="true" />
        </div>
        Enter your mortgage details to see your full payment breakdown here.
      </div>
    );
  }

  const {
    loanAmount,
    monthlyEMI,
    totalInterest,
    totalPayment,
    downPercent,
    interestBurdenPct,
    loanToValuePct,
    homePrice,
  } = result;

  const fmt = (n: number) =>
    n.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  // Gauge: interest burden % — scale 0–200% (0–50 low, 50–100 moderate, 100–150 high, 150+ very high)
  const scaleMax = 200;
  const ratio = Math.min(interestBurdenPct / scaleMax, 1);
  const barPct = 2 + ratio * 96;

  const burdenLabel =
    interestBurdenPct < 40
      ? "Low burden"
      : interestBurdenPct < 80
        ? "Moderate"
        : interestBurdenPct < 130
          ? "High burden"
          : "Very high burden";

  const burdenBadge =
    interestBurdenPct < 40
      ? "good"
      : interestBurdenPct < 80
        ? "normal"
        : interestBurdenPct < 130
          ? "warning"
          : "danger";

  // Bar proportions for breakdown
  const principalPct = Math.round((loanAmount / totalPayment) * 100);
  const interestPct = 100 - principalPct;

  return (
    <div className="cr-panel">
      {/* Gauge + monthly EMI as headline */}
      <div className="cr-gauge-wrap">
        <svg
          className="cr-gauge-svg"
          width="100"
          height="60"
          viewBox="0 0 120 70"
          role="img"
          aria-label={`Mortgage interest burden: ${interestBurdenPct.toFixed(0)}% of loan`}
        >
          <defs>
            <clipPath id="mort-half">
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
            clipPath="url(#mort-half)"
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
            clipPath="url(#mort-half)"
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
            clipPath="url(#mort-half)"
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
            clipPath="url(#mort-half)"
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
          <div className="cr-score" style={{ fontSize: "24px" }}>
            {fmt(monthlyEMI)}
          </div>
          <div className="cr-score-label">monthly payment</div>
          <span className={`cr-badge ${burdenBadge}`}>{burdenLabel}</span>
        </div>
      </div>

      <hr className="cr-divider" />

      {/* Interest burden meter bar */}
      <div>
        <div className="cr-bar-label">
          interest burden — {interestBurdenPct.toFixed(1)}% of loan amount
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
          <span>50%</span>
          <span>100%</span>
          <span>150%</span>
          <span>200%</span>
        </div>
      </div>

      <hr className="cr-divider" />

      {/* Metric cards */}
      <div className="cr-metrics-grid">
        <div className="cr-metric-card">
          <div className="cr-m-label">Loan amount</div>
          <div className="cr-m-value" style={{ fontSize: "13px" }}>
            {fmt(loanAmount)}
          </div>
          <div className="cr-m-sub">{downPercent.toFixed(1)}% down</div>
        </div>
        <div className="cr-metric-card">
          <div className="cr-m-label">Monthly payment</div>
          <div className="cr-m-value" style={{ fontSize: "13px" }}>
            {fmt(monthlyEMI)}
          </div>
          <div className="cr-m-sub">principal + interest</div>
        </div>
        <div className="cr-metric-card">
          <div className="cr-m-label">Total interest</div>
          <div className="cr-m-value" style={{ fontSize: "13px" }}>
            {fmt(totalInterest)}
          </div>
          <div className="cr-m-sub">over full term</div>
        </div>
        <div className="cr-metric-card">
          <div className="cr-m-label">Total repayment</div>
          <div className="cr-m-value" style={{ fontSize: "13px" }}>
            {fmt(totalPayment)}
          </div>
          <div className="cr-m-sub">principal + interest</div>
        </div>
      </div>

      <hr className="cr-divider" />

      {/* Principal vs interest breakdown bars */}
      <div>
        <div className="cr-world-title">where your money goes</div>
        <div className="cr-world-bar-row">
          <span className="cr-w-label">Principal</span>
          <div className="cr-world-track">
            <div
              className="cr-world-fill"
              style={{ width: `${principalPct}%`, background: "#97C459" }}
            />
          </div>
          <span className="cr-w-pct" style={{ width: "32px" }}>
            {principalPct}%
          </span>
        </div>
        <div className="cr-world-bar-row">
          <span className="cr-w-label">Interest</span>
          <div className="cr-world-track">
            <div
              className="cr-world-fill"
              style={{ width: `${interestPct}%`, background: "#F09595" }}
            />
          </div>
          <span className="cr-w-pct" style={{ width: "32px" }}>
            {interestPct}%
          </span>
        </div>
        <div className="cr-world-bar-row">
          <span className="cr-w-label">LTV ratio</span>
          <div className="cr-world-track">
            <div
              className="cr-world-fill"
              style={{
                width: `${Math.min(loanToValuePct, 100)}%`,
                background: "#378ADD",
              }}
            />
          </div>
          <span className="cr-w-pct" style={{ width: "32px" }}>
            {loanToValuePct.toFixed(0)}%
          </span>
        </div>
        <p className="cr-world-note">
          For every {fmt(loanAmount)} borrowed, you pay{" "}
          <strong>{fmt(totalInterest)}</strong> in interest — that is{" "}
          {interestBurdenPct.toFixed(1)}% of the loan on top of the principal.
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Main Calculator Page — UNCHANGED content & field styles
───────────────────────────────────────── */
export default function HomeMortgageCalculator() {
  const [homePrice, setHomePrice] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [loanTerm, setLoanTerm] = useState("");

  const [panelResult, setPanelResult] = useState<MortgageResult | null>(null);

  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const toggleFAQ = (index: number) =>
    setOpenFAQ(openFAQ === index ? null : index);

  const formatNumber = (num: number): string =>
    num.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const handleCommaInput = (value: string, setter: (v: string) => void) => {
    const raw = value.replace(/,/g, "");
    if (raw === "" || /^\d*\.?\d*$/.test(raw)) {
      const parts = raw.split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      setter(parts.join("."));
    }
  };

  const stripCommas = (v: string) => Number(v.replace(/,/g, ""));

  /* ---- Core compute logic ---- */
  const compute = (): MortgageResult | null => {
    if (!homePrice || !downPayment || !interestRate || !loanTerm) return null;

    const price = stripCommas(homePrice);
    const down = stripCommas(downPayment);
    const principal = price - down;
    const r = Number(interestRate) / 12 / 100;
    const n = Number(loanTerm) * 12;

    if (principal <= 0 || Number(interestRate) <= 0 || n <= 0) return null;

    const emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPay = emi * n;
    const totalInt = totalPay - principal;
    const downPct = (down / price) * 100;

    return {
      loanAmount: principal,
      monthlyEMI: emi,
      totalInterest: totalInt,
      totalPayment: totalPay,
      downPercent: downPct,
      interestBurdenPct: (totalInt / principal) * 100,
      loanToValuePct: (principal / price) * 100,
      homePrice: price,
    };
  };

  /* ---- Auto-calculate for panel ---- */
  useEffect(() => {
    setPanelResult(compute());
  }, [homePrice, downPayment, interestRate, loanTerm]);

  /* ---- Calculate button ---- */
  const calculateMortgage = () => setPanelResult(compute());

  const handleClear = () => {
    setHomePrice("");
    setDownPayment("");
    setInterestRate("");
    setLoanTerm("");
    setPanelResult(null);
  };

  return (
    <div className="page-layout">
      <div className="single-page-padding">
        <h1>Home Mortgage Calculator</h1>

        <p>
          Estimate your monthly house payment, total interest cost, and full
          repayment amount before you commit to a home loan. Adjust the home
          price, down payment, interest rate, and loan term to compare different
          scenarios side by side.
        </p>

        <div className="calc-card single-calc">
          <input
            className="calc-input"
            type="text"
            inputMode="decimal"
            placeholder="Home Price (e.g. 5,000,000)"
            value={homePrice}
            onChange={(e) => handleCommaInput(e.target.value, setHomePrice)}
          />
          <input
            className="calc-input"
            type="text"
            inputMode="decimal"
            placeholder="Down Payment (e.g. 1,000,000)"
            value={downPayment}
            onChange={(e) => handleCommaInput(e.target.value, setDownPayment)}
          />
          <input
            className="calc-input"
            type="number"
            step="0.01"
            placeholder="Annual Interest Rate (%)"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
          />
          <input
            className="calc-input"
            type="number"
            placeholder="Loan Term (Years)"
            value={loanTerm}
            onChange={(e) => setLoanTerm(e.target.value)}
          />

          <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
            <button className="calc-button" onClick={calculateMortgage}>
              Calculate
            </button>
            <button className="calc-button calc-clear" onClick={handleClear}>
              Clear
            </button>
          </div>
        </div>

        {/* Mobile-only result panel */}
        <div className="cr-mobile-slot">
          <MortgageResultPanel result={panelResult} />
        </div>

        {/* ---- SEO CONTENT — UNTOUCHED ---- */}

        <h2>What Is a Home Mortgage?</h2>
        <p>
          A home mortgage is a secured loan used to purchase residential
          property. The house itself acts as collateral, meaning the lender can
          claim it if you default on payments. You repay the borrowed amount in
          fixed monthly installments — each one covering a slice of the
          principal plus the interest charged for that month.
        </p>
        <p>
          Mortgages make homeownership accessible because they let you spread a
          large purchase over 10, 15, 20, or even 30 years instead of paying the
          entire price at once. The trade-off is interest: over long terms, the
          interest you pay can rival or even exceed the original loan amount.
          That is exactly why running the numbers through a mortgage calculator
          before signing anything is so important.
        </p>

        <h2>How Does a Mortgage Payment Work?</h2>
        <p>
          Every monthly mortgage payment is split between principal and
          interest, but the ratio shifts over time. In the early years, most of
          your payment goes toward interest because the outstanding balance is
          still large. As you chip away at the principal, the interest portion
          shrinks and more of each payment reduces your balance. This process is
          called amortization.
        </p>
        <p>
          Beyond principal and interest, your actual housing cost may also
          include property taxes, homeowner's insurance, and — if your down
          payment is below a certain threshold — private mortgage insurance
          (PMI). Lenders often bundle these into a single monthly payment
          referred to as PITI: Principal, Interest, Taxes, and Insurance. This
          calculator focuses on the principal and interest portion, which is the
          core number you need to start planning.
        </p>

        <h2>Mortgage Payment Formula</h2>
        <p>
          Monthly mortgage payments follow the same EMI formula used by banks
          worldwide. If you have used our{" "}
          <Link href="/emi-calculator/" className="my-link">
            EMI calculator
          </Link>
          , you will recognize it:
        </p>
        <pre>
          M = P × [ r(1 + r)<sup>n</sup> / (1 + r)<sup>n</sup> – 1 ]
        </pre>
        <ul>
          <li>
            <strong>M</strong> = Monthly mortgage payment
          </li>
          <li>
            <strong>P</strong> = Loan principal (home price minus down payment)
          </li>
          <li>
            <strong>r</strong> = Monthly interest rate (annual rate ÷ 12 ÷ 100)
          </li>
          <li>
            <strong>n</strong> = Total number of monthly payments (years × 12)
          </li>
        </ul>
        <p>
          You do not need to calculate this by hand. Enter your numbers above
          and the calculator does the rest instantly.
        </p>

        <h2>Step-by-Step Mortgage Calculation Example</h2>
        <p>
          Let's work through a realistic example so you can see how each input
          changes the output.
        </p>

        <h3>Scenario: Buying a Home Worth 10,000,000</h3>
        <ul>
          <li>
            <strong>Home Price:</strong> 10,000,000
          </li>
          <li>
            <strong>Down Payment:</strong> 2,000,000 (20%)
          </li>
          <li>
            <strong>Loan Amount:</strong> 8,000,000
          </li>
          <li>
            <strong>Annual Interest Rate:</strong> 9%
          </li>
          <li>
            <strong>Loan Term:</strong> 20 years (240 months)
          </li>
        </ul>
        <p>
          <strong>Monthly Payment ≈ 71,976</strong>
        </p>
        <p>
          Over 20 years, the total repayment comes to approximately 17,274,240 —
          meaning you pay about 9,274,240 in interest alone. That is more than
          the original loan amount.
        </p>
        <p>
          Now let's see what happens if you change just the term to 15 years
          instead. The monthly payment rises to about 81,132, but total interest
          drops to roughly 6,603,760 — saving you nearly 2,670,000 compared to
          the 20-year option. That is the power of a shorter term: higher
          monthly cost, but dramatically less interest overall.
        </p>

        <h2>How to Use This Mortgage Calculator</h2>
        <ul className="custom-list">
          <li>
            Enter the <strong>home price</strong> — the full listing or purchase
            price of the property.
          </li>
          <li>
            Enter your <strong>down payment</strong> — the amount you plan to
            pay upfront. The calculator will show the percentage automatically.
          </li>
          <li>
            Enter the <strong>annual interest rate</strong> quoted by your
            lender.
          </li>
          <li>
            Enter the <strong>loan term in years</strong> — for example, 15, 20,
            or 30.
          </li>
          <li>
            Click <strong>Calculate</strong> to see your monthly payment, total
            interest, and total repayment amount.
          </li>
        </ul>
        <p>
          Run the calculator multiple times with different values. Adjust the
          down payment or term to see how each change affects your monthly
          budget and long-term cost.
        </p>

        <h2>Key Factors That Determine Your Mortgage Payment</h2>

        <h3>Home Price</h3>
        <p>
          This is your starting point. A higher home price means a larger loan
          (unless you offset it with a bigger down payment), which directly
          increases monthly payments and total interest.
        </p>

        <h3>Down Payment</h3>
        <p>
          The more you pay upfront, the less you borrow — and the less interest
          you pay over the life of the loan. A 20% down payment is the most
          commonly cited benchmark because it often eliminates the need for
          private mortgage insurance, but many buyers start with 10% or even 5%
          if their lender allows it. Use the calculator to see exactly how
          different down payment amounts change your monthly obligation.
        </p>

        <h3>Interest Rate</h3>
        <p>
          Even a half-percent difference in your mortgage rate has an outsized
          impact over a long term. On an 8,000,000 loan over 20 years, the
          difference between 8.5% and 9% adds roughly 2,300 per month. Over 240
          months, that is more than 550,000 in extra interest. Always compare
          rates from multiple lenders before committing.
        </p>

        <h3>Loan Term</h3>
        <p>
          Common terms are 15, 20, and 30 years. Shorter terms come with higher
          monthly payments but save you a significant amount of interest. Longer
          terms ease monthly cash flow but cost substantially more over the full
          duration. The comparison table below makes this trade-off concrete.
        </p>

        <h2>15-Year vs. 20-Year vs. 30-Year Mortgage: A Comparison</h2>
        <p>
          The following table shows how the same 8,000,000 loan at 9% interest
          behaves across three common mortgage terms.
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
                  Loan Term
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Monthly Payment
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Total Interest
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Total Repayment
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                ["15 years", "81,132", "6,603,760", "14,603,760"],
                ["20 years", "71,976", "9,274,240", "17,274,240"],
                ["30 years", "64,372", "15,173,920", "23,173,920"],
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
        <p>
          The 30-year term saves you about 16,760 per month compared to the
          15-year option. But look at total interest: you pay 15,173,920 vs.
          6,603,760 — that is 8,570,160 more for the convenience of lower
          monthly payments. This is why financial advisors often recommend
          choosing the shortest term your budget can handle.
        </p>

        <h2>Fixed-Rate vs. Adjustable-Rate Mortgages</h2>

        <h3>Fixed-Rate Mortgage</h3>
        <p>
          Your interest rate stays the same for the entire loan term. This means
          your monthly payment never changes, which makes budgeting
          straightforward. Fixed rates are ideal when current rates are low and
          you want to lock them in, or when you prefer certainty in your monthly
          housing costs.
        </p>

        <h3>Adjustable-Rate Mortgage (ARM)</h3>
        <p>
          The interest rate adjusts periodically based on a benchmark index.
          ARMs often start with a lower introductory rate (sometimes called a
          "teaser rate") for the first few years, then adjust annually. This
          means your monthly payment can rise or fall depending on market
          conditions. ARMs can save money if rates stay flat or drop, but they
          carry the risk of significant payment increases.
        </p>
        <p>
          This calculator assumes a fixed rate. If your lender offers an
          adjustable rate, use the initial rate to get a baseline estimate, but
          keep in mind that your actual payments may change after the
          introductory period ends.
        </p>

        <h2>How Much Down Payment Should You Make?</h2>
        <p>
          The down payment is one of the most impactful numbers in your mortgage
          equation. Here is how different down payment percentages affect a
          10,000,000 home at 9% over 20 years:
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
                  Down Payment
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Loan Amount
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Monthly Payment
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Total Interest
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                ["5% (500,000)", "9,500,000", "85,472", "11,013,280"],
                ["10% (1,000,000)", "9,000,000", "80,973", "10,433,520"],
                ["20% (2,000,000)", "8,000,000", "71,976", "9,274,240"],
                ["30% (3,000,000)", "7,000,000", "62,979", "8,114,960"],
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
        <p>
          Going from 5% down to 20% down saves about 13,496 per month and nearly
          1,739,040 in total interest. If you can save aggressively before
          purchasing, the larger down payment pays for itself many times over.
        </p>

        <h2>Practical Tips to Lower Your Mortgage Cost</h2>
        <ul className="custom-list">
          <li>
            <strong>Save for a larger down payment.</strong> Every additional
            percent you put down reduces your loan principal, monthly payment,
            and total interest.
          </li>
          <li>
            <strong>Shop multiple lenders.</strong> Do not accept the first rate
            you are offered. Even a 0.25% reduction in rate saves thousands over
            a 20-year mortgage. Get quotes from at least three to four lenders.
          </li>
          <li>
            <strong>Choose the shortest term you can afford.</strong> Use the
            calculator to find the sweet spot where monthly payments are
            challenging but manageable. The interest savings are dramatic.
          </li>
          <li>
            <strong>Improve your credit score first.</strong> Lenders offer
            better rates to borrowers with higher credit scores. Paying off
            existing debts and correcting errors on your credit report before
            applying can make a real difference.
          </li>
          <li>
            <strong>Make extra principal payments.</strong> Even small
            additional payments toward the principal each month shorten your
            loan term and reduce total interest. Check with your lender that
            there are no prepayment penalties.
          </li>
          <li>
            <strong>Consider refinancing.</strong> If rates drop after you have
            taken a mortgage, refinancing at the new rate can lower your monthly
            payment and total cost. Use our{" "}
            <Link href="/loan-calculator/" className="my-link">
              loan calculator
            </Link>{" "}
            to estimate what the new terms would look like.
          </li>
        </ul>

        <h2>Renting vs. Buying: When Does a Mortgage Make Sense?</h2>
        <p>
          This is one of the most common questions homebuyers face. Renting
          offers flexibility and no maintenance responsibility, but your monthly
          rent builds zero equity. A mortgage payment, on the other hand,
          gradually makes you the owner of an appreciating asset.
        </p>
        <p>
          The breakeven point depends on how long you plan to stay. If you are
          staying less than 3 to 5 years, renting often makes more financial
          sense because closing costs and early-year interest outweigh equity
          gained. If you plan to stay longer, owning typically wins — especially
          in markets with rising property values.
        </p>
        <p>
          Compare your current rent against a potential mortgage payment using
          our{" "}
          <Link href="/rent-calculator/" className="my-link">
            rent calculator
          </Link>{" "}
          alongside this mortgage tool to see where the numbers land for your
          situation.
        </p>

        <h2>Understanding Amortization: Where Your Money Goes Each Month</h2>
        <p>
          When you make your first mortgage payment, a surprisingly large
          portion goes toward interest rather than reducing your balance. This
          shifts gradually over the life of the loan. For example, on an
          8,000,000 loan at 9% over 20 years:
        </p>
        <ul className="custom-list">
          <li>
            <strong>Month 1:</strong> About 60,000 of your 71,976 payment goes
            to interest. Only about 11,976 reduces your principal.
          </li>
          <li>
            <strong>Month 120 (Year 10):</strong> Roughly 38,000 goes to
            interest and 33,976 goes toward principal — the balance is shifting.
          </li>
          <li>
            <strong>Month 240 (Final year):</strong> Almost the entire payment
            goes to principal, with very little interest remaining.
          </li>
        </ul>
        <p>
          This is why prepayments in the early years of a mortgage are so
          powerful. Every extra payment applied to principal skips the interest
          that would have accrued on that amount for the remaining years.
        </p>

        <h2>Common Mortgage Mistakes to Avoid</h2>
        <ul className="custom-list">
          <li>
            <strong>
              Ignoring total cost and focusing only on monthly payment.
            </strong>{" "}
            A 30-year term looks affordable each month, but the total interest
            can be staggering. Always look at both numbers.
          </li>
          <li>
            <strong>Skipping rate comparison.</strong> Many buyers take the rate
            their bank offers without negotiating or checking competitors. This
            can cost hundreds of thousands over the term.
          </li>
          <li>
            <strong>Forgetting about additional costs.</strong> Property taxes,
            homeowner's insurance, maintenance, and association fees are real
            monthly expenses beyond your mortgage payment. Budget for them.
          </li>
          <li>
            <strong>Stretching beyond your comfort zone.</strong> Financial
            advisors generally suggest your total housing costs should not
            exceed 28% to 35% of your gross monthly income. Use our{" "}
            <Link href="/income-tax-calculator/" className="my-link">
              income tax calculator
            </Link>{" "}
            to determine your after-tax income and set a realistic mortgage
            ceiling.
          </li>
          <li>
            <strong>Not planning for rate changes on ARMs.</strong> If you have
            an adjustable-rate mortgage, model what happens when the rate
            increases by 1–2% after the introductory period. Make sure you can
            still afford the payment.
          </li>
        </ul>

        <h2>Frequently Asked Questions</h2>

        {[
          [
            "How much down payment do I need for a house?",
            "It depends on the lender and the type of loan. A 20% down payment is the traditional benchmark and usually gets you the best terms, but many lenders accept 10% or even 5%. A smaller down payment means a larger loan, higher monthly payments, and more total interest — plus you may need to pay private mortgage insurance.",
          ],
          [
            "Is a 15-year or 30-year mortgage better?",
            "A 15-year mortgage has higher monthly payments but saves you a massive amount of interest over the life of the loan. A 30-year mortgage is easier on your monthly budget but costs far more in total. The best choice depends on your income stability and financial goals. Use the calculator above to compare both scenarios with your actual numbers.",
          ],
          [
            "What is the difference between fixed and adjustable-rate mortgages?",
            "A fixed-rate mortgage keeps the same interest rate for the entire term, so your payment never changes. An adjustable-rate mortgage (ARM) starts with a lower rate that adjusts periodically based on market conditions. Fixed rates offer predictability; ARMs can save money initially but carry the risk of higher payments later.",
          ],
          [
            "Can I use this calculator for mortgage refinancing?",
            "Yes. To estimate refinancing, enter your current outstanding loan balance as the home price, set the down payment to zero, and enter the new interest rate and term being offered. The result will show your new monthly payment and total cost under the refinanced terms.",
          ],
          [
            "Does making extra payments reduce my mortgage term?",
            "Yes. Extra payments applied directly to the principal reduce your outstanding balance faster. This shortens the loan term and decreases the total interest you pay. Even adding a small extra amount each month — or making one additional payment per year — can shave years off your mortgage and save a significant sum.",
          ],
          [
            "What percentage of my income should go to a mortgage?",
            "A widely followed guideline is that your total housing costs — including the mortgage payment, taxes, and insurance — should not exceed 28% to 35% of your gross monthly income. Going beyond this range can strain your finances and make it difficult to cover other expenses or save for emergencies.",
          ],
          [
            "What is private mortgage insurance (PMI)?",
            "PMI is an insurance policy that protects the lender if you default on the loan. It is typically required when your down payment is less than 20% of the home price. PMI adds to your monthly housing cost but can usually be removed once you have built enough equity in the home — usually when your loan-to-value ratio drops below 80%.",
          ],
          [
            "Does this calculator include property taxes and insurance?",
            "No. This calculator focuses on the principal and interest portion of your mortgage payment. Property taxes, homeowner's insurance, and PMI vary by location and policy, so you should estimate those separately and add them to your monthly budget.",
          ],
          [
            "How do I know if I can afford a particular home?",
            "Start by calculating your monthly take-home pay after taxes. Then subtract existing obligations like car payments, student loans, and living expenses. The amount remaining is what you can realistically put toward a mortgage. Use this calculator to find a home price and loan term where the monthly payment falls comfortably within that budget, leaving room for unexpected expenses.",
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
          A home mortgage is likely the largest financial commitment you will
          ever make. Running the numbers before you commit is not optional — it
          is essential. Use this mortgage calculator to compare terms, test
          different down payment amounts, and understand exactly what your
          monthly payment and total cost look like under each scenario.
        </p>
        <p>
          Pair it with our{" "}
          <Link href="/emi-calculator/" className="my-link">
            EMI calculator
          </Link>{" "}
          for non-housing loans or the{" "}
          <Link href="/net-worth-calculator/" className="my-link">
            net worth calculator
          </Link>{" "}
          to see how your new property fits into your overall financial picture.
          The more clearly you see the numbers, the more confidently you can
          buy.
        </p>
      </div>

      {/* ---- SIDEBAR ---- */}
      <aside className="sidebar">
        <div className="cr-desktop-slot">
          <MortgageResultPanel result={panelResult} />
        </div>

        <div className="sidebar-box">
          <p style={{ fontSize: "20px", fontWeight: 600 }}>
            Related Calculators
          </p>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {[
              ["/emi-calculator/", "EMI Calculator"],
              ["/rent-calculator/", "Rent Calculator"],
              ["/loan-calculator/", "Loan Calculator"],
              ["/income-tax-calculator/", "Income Tax Calculator"],
              ["/net-worth-calculator/", "Net Worth Calculator"],
              ["/salary-hike-calculator/", "Salary Hike Calculator"],
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
