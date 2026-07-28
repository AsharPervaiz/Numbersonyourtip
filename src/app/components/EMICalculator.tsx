"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

/* ─────────────────────────────────────────
   Types
───────────────────────────────────────── */
interface EMIResult {
  emi: number;
  totalInterest: number;
  totalPayment: number;
  principal: number;
  interestBurdenPct: number; // totalInterest / principal * 100
  months: number;
}

/* ─────────────────────────────────────────
   Pure helper
───────────────────────────────────────── */
function needleDeg(ratio: number): number {
  const clamped = Math.min(Math.max(ratio, 0), 1);
  return -90 + clamped * 180;
}

/* ─────────────────────────────────────────
   EMIResultPanel
   Gauge = interest burden % (0–200%)
   Meter bar = same scale
───────────────────────────────────────── */
function EMIResultPanel({ result }: { result: EMIResult | null }) {
  if (!result) {
    return (
      <div className="cr-panel-placeholder">
        <div className="cr-ph-icon">
          <i className="fa-solid fa-hand-holding-dollar" aria-hidden="true" />
        </div>
        Enter your loan details to see the EMI breakdown here.
      </div>
    );
  }

  const {
    emi,
    totalInterest,
    totalPayment,
    principal,
    interestBurdenPct,
    months,
  } = result;

  const fmt = (n: number) =>
    n.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  // Gauge: interest burden 0–200%
  const scaleMax = 200;
  const ratio = Math.min(interestBurdenPct / scaleMax, 1);
  const barPct = 2 + ratio * 96;

  const burdenLabel =
    interestBurdenPct < 20
      ? "Low burden"
      : interestBurdenPct < 60
        ? "Moderate"
        : interestBurdenPct < 110
          ? "High burden"
          : "Very high burden";

  const burdenBadge =
    interestBurdenPct < 20
      ? "good"
      : interestBurdenPct < 60
        ? "normal"
        : interestBurdenPct < 110
          ? "warning"
          : "danger";

  const principalPct = Math.round((principal / totalPayment) * 100);
  const interestPct = 100 - principalPct;

  return (
    <div className="cr-panel">
      {/* Gauge + monthly EMI headline */}
      <div className="cr-gauge-wrap">
        <svg
          className="cr-gauge-svg"
          width="100"
          height="60"
          viewBox="0 0 120 70"
          role="img"
          aria-label={`EMI interest burden: ${interestBurdenPct.toFixed(0)}% of loan`}
        >
          <defs>
            <clipPath id="emi-half">
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
            clipPath="url(#emi-half)"
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
            clipPath="url(#emi-half)"
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
            clipPath="url(#emi-half)"
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
            clipPath="url(#emi-half)"
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
            {fmt(emi)}
          </div>
          <div className="cr-score-label">monthly EMI</div>
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
          <div className="cr-m-label">Monthly EMI</div>
          <div className="cr-m-value" style={{ fontSize: "13px" }}>
            {fmt(emi)}
          </div>
          <div className="cr-m-sub">for {months} months</div>
        </div>
        <div className="cr-metric-card">
          <div className="cr-m-label">Total interest</div>
          <div className="cr-m-value" style={{ fontSize: "13px" }}>
            {fmt(totalInterest)}
          </div>
          <div className="cr-m-sub">over full term</div>
        </div>
        <div className="cr-metric-card">
          <div className="cr-m-label">Principal</div>
          <div className="cr-m-value" style={{ fontSize: "13px" }}>
            {fmt(principal)}
          </div>
          <div className="cr-m-sub">loan amount</div>
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

      {/* Principal vs interest breakdown */}
      <div>
        <div className="cr-world-title">where your payments go</div>
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
        <p className="cr-world-note">
          For every {fmt(principal)} borrowed, you pay{" "}
          <strong>{fmt(totalInterest)}</strong> in interest —{" "}
          {interestBurdenPct.toFixed(1)}% extra on top of the principal.
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Main Calculator Page — UNCHANGED content & field styles
───────────────────────────────────────── */
export default function EMICalculator() {
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("");
  const [months, setMonths] = useState("");

  const [panelResult, setPanelResult] = useState<EMIResult | null>(null);

  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const toggleFAQ = (index: number) =>
    setOpenFAQ(openFAQ === index ? null : index);

  const formatNumber = (num: number): string =>
    num.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  /* Comma-formatted input handler */
  const handleAmountChange = (value: string) => {
    const raw = value.replace(/,/g, "");
    if (raw === "" || /^\d*\.?\d*$/.test(raw)) {
      const parts = raw.split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      setAmount(parts.join("."));
    }
  };

  /* ---- Core compute logic ---- */
  const compute = (): EMIResult | null => {
    if (!amount || !rate || !months) return null;
    const p = Number(amount.replace(/,/g, ""));
    const r = Number(rate) / 12 / 100;
    const n = Number(months);
    if (p <= 0 || Number(rate) <= 0 || n <= 0) return null;

    const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - p;

    return {
      emi,
      totalInterest,
      totalPayment,
      principal: p,
      interestBurdenPct: (totalInterest / p) * 100,
      months: n,
    };
  };

  /* ---- Auto-calculate for panel ---- */
  useEffect(() => {
    setPanelResult(compute());
  }, [amount, rate, months]);

  /* ---- Calculate button ---- */
  const calculateEMI = () => setPanelResult(compute());

  const handleClear = () => {
    setAmount("");
    setRate("");
    setMonths("");
    setPanelResult(null);
  };

  return (
    <div className="page-layout">
      <div className="single-page-padding">
        <h1>EMI Calculator</h1>

        <p>
          Quickly calculate your monthly loan installment, total interest, and
          full repayment amount. Whether you are planning a home loan, car loan,
          or personal loan, this free EMI calculator gives you a clear repayment
          picture before you commit.
        </p>

        <div className="calc-card single-calc">
          <input
            className="calc-input"
            type="text"
            inputMode="decimal"
            placeholder="Loan Amount (e.g. 500,000)"
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
          />
          <input
            className="calc-input"
            type="number"
            step="0.01"
            placeholder="Annual Interest Rate (%)"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
          />
          <input
            className="calc-input"
            type="number"
            placeholder="Loan Tenure (months)"
            value={months}
            onChange={(e) => setMonths(e.target.value)}
          />

          <div style={{ display: "flex", gap: "10px" }}>
            <button className="calc-button" onClick={calculateEMI}>
              Calculate
            </button>
            <button className="calc-button calc-clear" onClick={handleClear}>
              Clear
            </button>
          </div>
        </div>

        {/* Mobile-only result panel */}
        <div className="cr-mobile-slot">
          <EMIResultPanel result={panelResult} />
        </div>

        {/* ---- SEO CONTENT — UNTOUCHED ---- */}

        <h2>What Is EMI and Why Does It Matter?</h2>
        <p>
          EMI stands for Equated Monthly Installment. It is the fixed amount you
          pay to a bank or lender every month until your loan is fully repaid.
          Each EMI payment covers two parts: a portion of the original loan
          amount (principal) and the interest charged on the outstanding
          balance.
        </p>
        <p>
          Understanding your EMI before signing a loan agreement is one of the
          smartest financial moves you can make. It lets you know exactly how
          much leaves your account every month, helps you set realistic budgets,
          and prevents you from borrowing more than you can comfortably repay.
          If you are comparing offers from multiple lenders, an{" "}
          <Link href="/loan-calculator/" className="my-link">
            <span className="hover-item">loan calculator</span>
          </Link>{" "}
          or EMI calculator is the fastest way to see which deal actually costs
          less over the full term.
        </p>

        <h2>How Is EMI Calculated? The Formula Explained</h2>
        <p>
          Banks and financial institutions use a standard mathematical formula
          to arrive at your EMI figure. Here is the formula:
        </p>
        <pre>
          EMI = [P × R × (1 + R)<sup>N</sup>] / [(1 + R)<sup>N</sup> – 1]
        </pre>
        <p>Where:</p>
        <ul>
          <li>
            <strong>P</strong> = Principal loan amount — the total money you
            borrow.
          </li>
          <li>
            <strong>R</strong> = Monthly interest rate — your annual rate
            divided by 12 and then by 100. For example, a 12% annual rate
            becomes 0.01 per month.
          </li>
          <li>
            <strong>N</strong> = Loan tenure in months — the total number of
            monthly payments.
          </li>
        </ul>
        <p>
          You do not need to memorize this formula. Simply enter your loan
          amount, interest rate, and tenure in the calculator above, and it
          handles the math instantly.
        </p>

        <h2>Step-by-Step EMI Calculation Example</h2>
        <p>
          Let's walk through a real example so you can see exactly how the
          numbers work.
        </p>

        <h3>Scenario: Personal Loan of 500,000 at 14% for 3 Years</h3>
        <ul>
          <li>
            <strong>Loan Amount (P):</strong> 500,000
          </li>
          <li>
            <strong>Annual Interest Rate:</strong> 14%
          </li>
          <li>
            <strong>Monthly Rate (R):</strong> 14 / 12 / 100 = 0.01167
          </li>
          <li>
            <strong>Tenure (N):</strong> 36 months
          </li>
        </ul>
        <p>Plugging these into the formula:</p>
        <pre>
          EMI = [500,000 × 0.01167 × (1.01167)<sup>36</sup>] / [(1.01167)
          <sup>36</sup> – 1]
        </pre>
        <p>
          <strong>Monthly EMI ≈ 17,087</strong>
        </p>
        <p>
          Over 36 months, you would pay a total of approximately 615,132 —
          meaning the total interest cost is about 115,132.
        </p>
        <p>
          Now suppose you extend the tenure to 5 years (60 months). The monthly
          EMI drops to roughly 11,634, but the total interest jumps to about
          198,040. That is the classic trade-off between lower monthly payments
          and higher overall cost.
        </p>

        <h2>How to Use This EMI Calculator</h2>
        <p>Using this tool takes less than 30 seconds:</p>
        <ul className="custom-list">
          <li>
            Enter your <strong>loan amount</strong> — the total sum you plan to
            borrow.
          </li>
          <li>
            Enter the <strong>annual interest rate</strong> — the percentage
            your lender has quoted.
          </li>
          <li>
            Enter the <strong>loan tenure in months</strong> — for example,
            enter 60 for a 5-year loan.
          </li>
          <li>
            Click <strong>Calculate</strong> to see your monthly EMI, total
            interest payable, and total repayment amount.
          </li>
        </ul>
        <p>
          Try different combinations. Change the tenure or rate to see how each
          variable affects your monthly payment and total cost.
        </p>

        <h2>Key Factors That Affect Your EMI</h2>

        <h3>Loan Amount (Principal)</h3>
        <p>
          This is straightforward — the more you borrow, the higher your EMI. If
          you can manage a larger down payment on a home or vehicle purchase,
          the remaining loan amount shrinks and your monthly burden drops. Use
          our{" "}
          <Link href="/home-mortgage-calculator/" className="my-link">
            home mortgage calculator
          </Link>{" "}
          to see how different down payment amounts change your monthly mortgage
          payment.
        </p>

        <h3>Interest Rate</h3>
        <p>
          Even a small difference in interest rate creates a noticeable change
          in EMI over long tenures. For instance, on a 3,000,000 home loan over
          20 years, the difference between 9% and 10% annual interest adds
          roughly 1,800 per month to your EMI. Always compare rates across
          lenders before locking in.
        </p>

        <h3>Loan Tenure</h3>
        <p>
          Longer tenure means smaller monthly EMI but significantly more
          interest paid over the life of the loan. Shorter tenure means higher
          monthly payments but less total interest. The sweet spot depends on
          your monthly income and expenses — this is why running numbers through
          a calculator before committing is so valuable.
        </p>

        <h3>Type of Interest Rate: Fixed vs. Floating</h3>
        <p>
          With a <strong>fixed rate</strong>, your EMI stays the same throughout
          the loan term. With a <strong>floating rate</strong>, the EMI changes
          whenever the lender adjusts its benchmark rate. Fixed rates give you
          predictability. Floating rates can save money when rates drop, but
          they carry the risk of increases. Most home loans in many countries
          use floating rates, while personal loans and car loans often come with
          fixed rates.
        </p>

        <h2>EMI Comparison: How Tenure and Rate Change Your Cost</h2>
        <p>
          The table below shows how the same 1,000,000 loan amount behaves under
          different interest rates and tenures.
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
                  Interest Rate
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Tenure
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Monthly EMI
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Total Interest
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Total Payment
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                ["8%", "12 months", "86,988", "43,856", "1,043,856"],
                ["8%", "36 months", "31,334", "128,024", "1,128,024"],
                ["10%", "36 months", "32,267", "161,612", "1,161,612"],
                ["10%", "60 months", "21,247", "274,820", "1,274,820"],
                ["12%", "60 months", "22,244", "334,640", "1,334,640"],
                ["14%", "60 months", "23,268", "396,080", "1,396,080"],
              ].map((row) => (
                <tr key={row[0] + row[1]}>
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
          Notice how a 2-year loan at 10% costs 161,612 in interest, while the
          same rate stretched to 5 years costs 274,820. That extra 113,000+ is
          the real price of lower monthly payments.
        </p>

        <h2>Types of Loans You Can Calculate EMI For</h2>
        <p>
          This calculator works for any loan that uses a fixed EMI repayment
          structure. Here are the most common ones:
        </p>

        <h3>Home Loan / Mortgage EMI</h3>
        <p>
          Home loans typically run 15 to 30 years with the largest principal
          amounts. Even a 0.25% rate difference can save or cost you hundreds of
          thousands over the full term. Calculate your mortgage EMI here, or use
          the dedicated{" "}
          <Link href="/home-mortgage-calculator/" className="my-link">
            home mortgage calculator
          </Link>{" "}
          for a detailed breakdown including down payment and property tax
          estimates.
        </p>

        <h3>Car Loan EMI</h3>
        <p>
          Car loans usually range from 3 to 7 years. Since vehicles depreciate
          quickly, keeping the tenure short saves you interest and avoids owing
          more than the car is worth.
        </p>

        <h3>Personal Loan EMI</h3>
        <p>
          Personal loans carry higher interest rates (often 10% to 24%) because
          they are unsecured. Calculate EMI before borrowing to make sure the
          monthly payment fits your budget without straining other expenses.
        </p>

        <h3>Education Loan EMI</h3>
        <p>
          Education loans often include a moratorium period where you only pay
          interest (or nothing at all) while studying. EMI repayment kicks in
          after the course ends. Factor in this grace period when planning your
          finances.
        </p>

        <h3>Business and Gold Loans</h3>
        <p>
          Business loans fund expansion, equipment, or working capital. Gold
          loans use your gold as collateral and usually offer lower rates. Both
          follow EMI structures that this calculator handles.
        </p>

        <h2>Practical Tips to Reduce Your EMI Burden</h2>
        <p>
          If your calculated EMI feels too high, here are concrete steps to
          bring it down:
        </p>
        <ul className="custom-list">
          <li>
            <strong>Increase your down payment.</strong> A larger upfront
            payment on a home or car reduces the loan principal, which directly
            lowers every monthly installment.
          </li>
          <li>
            <strong>Negotiate the interest rate.</strong> If you have a strong
            credit score or an existing relationship with the bank, ask for a
            rate reduction. Even 0.5% less makes a real difference over years.
          </li>
          <li>
            <strong>Choose a longer tenure (with caution).</strong> Extending
            tenure reduces EMI but increases total interest. Use the calculator
            to find the balance point where the EMI is manageable without the
            interest spiraling.
          </li>
          <li>
            <strong>Make prepayments when possible.</strong> Many loans allow
            partial prepayments without penalty. Paying an extra lump sum toward
            the principal reduces the outstanding balance, which can lower
            future EMIs or shorten the tenure.
          </li>
          <li>
            <strong>Refinance if rates drop.</strong> If market interest rates
            fall significantly after you have taken a loan, consider refinancing
            with a new lender at the lower rate.
          </li>
        </ul>
        <p>
          Planning your monthly expenses alongside your EMI is essential. Our{" "}
          <Link href="/rent-calculator/" className="my-link">
            rent calculator
          </Link>{" "}
          can help if you are weighing rent payments against a mortgage, and the{" "}
          <Link href="/income-tax-calculator/" className="my-link">
            income tax calculator
          </Link>{" "}
          shows how much of your salary actually reaches your bank account after
          deductions.
        </p>

        <h2>What Happens If You Miss an EMI Payment?</h2>
        <p>
          Missing EMI payments has real consequences. Late payment fees are
          usually charged immediately, and the missed amount plus penalty gets
          added to your outstanding balance. Repeated misses damage your credit
          score, making future borrowing more expensive. In severe cases with
          secured loans (home or car), the lender can seize the collateral.
        </p>
        <p>
          If you anticipate difficulty paying, contact your lender early. Many
          banks offer restructuring options, moratorium periods, or tenure
          extensions to reduce the monthly burden before things escalate.
        </p>

        <h2>EMI vs. Flat Rate vs. Reducing Balance: What Is the Difference?</h2>
        <p>
          Not all loan interest calculations work the same way. The EMI formula
          used in this calculator is based on the{" "}
          <strong>reducing balance method</strong>, which is the most common and
          borrower-friendly approach. Here is how the three methods compare:
        </p>
        <ul className="custom-list">
          <li>
            <strong>Reducing Balance (used here):</strong> Interest is charged
            on the remaining principal after each payment. As you pay down the
            loan, the interest portion decreases and the principal portion
            increases. This is what banks use for most home, car, and personal
            loans.
          </li>
          <li>
            <strong>Flat Rate:</strong> Interest is calculated on the original
            loan amount for the entire tenure, regardless of how much you have
            already repaid. This results in a higher effective interest rate and
            more total interest paid. Some short-term or small-ticket loans use
            this method.
          </li>
          <li>
            <strong>Rule of 78:</strong> An older method that front-loads
            interest payments. You pay proportionally more interest in the early
            months and less later. It penalizes early repayment and is less
            common today.
          </li>
        </ul>
        <p>
          Always confirm which method your lender uses. A "10% flat rate" loan
          can cost significantly more than a "10% reducing balance" loan over
          the same tenure.
        </p>

        <h2>Benefits of Calculating EMI Before Taking a Loan</h2>
        <ul className="custom-list">
          <li>
            <strong>Budget clarity:</strong> You know exactly how much to set
            aside each month, so no surprises after the loan starts.
          </li>
          <li>
            <strong>Compare lenders objectively:</strong> Two banks quoting
            different rates and tenures are hard to compare without running the
            numbers. An EMI calculator makes the comparison instant.
          </li>
          <li>
            <strong>Avoid over-borrowing:</strong> Seeing the monthly payment
            and total interest cost helps you decide whether the loan amount is
            realistic for your income.
          </li>
          <li>
            <strong>Plan prepayments:</strong> By seeing the total interest
            cost, you can decide whether making early prepayments saves enough
            to be worth the effort.
          </li>
          <li>
            <strong>Negotiate better terms:</strong> Walking into a bank with
            pre-calculated numbers puts you in a stronger position to push for
            better rates or conditions.
          </li>
        </ul>

        <h2>Frequently Asked Questions</h2>

        {[
          [
            "What is EMI in simple terms?",
            "EMI is a fixed monthly payment you make to repay a loan. Each payment includes a portion of the borrowed amount (principal) and the interest charged by the lender. The amount stays the same every month until the loan is fully paid off.",
          ],
          [
            "How does loan tenure affect my EMI and total interest?",
            "A longer tenure lowers your monthly EMI because the same loan amount is spread over more months. However, since interest accrues for a longer period, the total interest you pay over the life of the loan increases. A shorter tenure means higher monthly payments but less total interest. The right balance depends on what your monthly budget can handle.",
          ],
          [
            "Can I reduce my EMI after taking a loan?",
            "Yes, there are a few ways. You can make a partial prepayment to reduce the outstanding principal, which lowers the EMI or shortens the tenure. You can also refinance the loan with another lender at a lower interest rate. Some lenders allow tenure extension, which brings down the EMI but increases total interest.",
          ],
          [
            "What is the difference between flat rate and reducing balance EMI?",
            "In the flat rate method, interest is charged on the full original loan amount for the entire tenure. In the reducing balance method (used by this calculator and most banks), interest is charged only on the remaining principal after each payment. The reducing balance method results in lower total interest and is more common for home, car, and personal loans.",
          ],
          [
            "Does prepaying a loan save money on interest?",
            "Yes. When you prepay, the outstanding principal decreases. Since interest is calculated on the remaining balance each month, a lower balance means less interest going forward. The earlier you prepay in the loan term, the more interest you save. Check with your lender about any prepayment penalties before doing so.",
          ],
          [
            "What happens if I miss an EMI payment?",
            "Missing an EMI payment typically results in a late fee and can negatively affect your credit score. The missed amount plus the penalty is added to your outstanding balance. Repeated misses can lead to loan default proceedings. If you foresee difficulty, contact your lender early to explore restructuring options.",
          ],
          [
            "Is this EMI calculator accurate for all loan types?",
            "This calculator uses the standard reducing balance EMI formula, which applies to most home loans, car loans, personal loans, education loans, business loans, and gold loans. It assumes a fixed interest rate. For floating-rate loans, the actual EMI may change over time as the rate adjusts.",
          ],
          [
            "How do I convert loan tenure from years to months?",
            "Multiply the number of years by 12. For example, a 5-year loan is 60 months, a 10-year loan is 120 months, a 15-year loan is 180 months, and a 20-year loan is 240 months. Enter the month value in the tenure field above.",
          ],
          [
            "Should I choose the longest possible tenure to keep EMI low?",
            "Not necessarily. While a longer tenure reduces your monthly EMI, it significantly increases the total interest paid over the life of the loan. The best approach is to choose the shortest tenure where the monthly EMI is still comfortable within your budget. Use this calculator to try different tenure lengths and compare total costs.",
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
          An EMI calculator is not just a convenience — it is a planning tool
          that puts you in control of your borrowing decisions. Whether you are
          taking out your first personal loan or refinancing a home mortgage,
          knowing your exact monthly payment, total interest, and full repayment
          cost lets you choose the loan structure that fits your financial life.
        </p>
        <p>
          Plug your numbers into the calculator above, experiment with different
          rates and tenures, and walk into your next loan conversation with
          clarity instead of guesswork.
        </p>
      </div>

      {/* ---- SIDEBAR ---- */}
      <aside className="sidebar">
        <div className="cr-desktop-slot">
          <EMIResultPanel result={panelResult} />
        </div>

        <div className="sidebar-box">
          <p style={{ fontSize: "20px", fontWeight: 600 }}>
            Related Calculators
          </p>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {[
              ["/home-mortgage-calculator/", "Home Mortgage Calculator"],
              ["/rent-calculator/", "Rent Calculator"],
              ["/loan-calculator/", "Loan Calculator"],
              ["/income-tax-calculator/", "Income Tax Calculator"],
              ["/salary-hike-calculator/", "Salary Hike Calculator"],
              ["/net-worth-calculator/", "Net Worth Calculator"],
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
