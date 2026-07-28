"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

/* ─────────────────────────────────────────
   Types
───────────────────────────────────────── */
interface LoanResult {
  emi: number;
  totalInterest: number;
  totalPayment: number;
  payableAmount: number;
  principal: number;
  interestBurdenPct: number;
  hasFee: boolean;
  feeAmount: number;
  totalMonths: number;
}

/* ─────────────────────────────────────────
   Pure helper
───────────────────────────────────────── */
function needleDeg(ratio: number): number {
  const clamped = Math.min(Math.max(ratio, 0), 1);
  return -90 + clamped * 180;
}

/* ─────────────────────────────────────────
   LoanResultPanel
───────────────────────────────────────── */
function LoanResultPanel({ result }: { result: LoanResult | null }) {
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
    payableAmount,
    principal,
    interestBurdenPct,
    hasFee,
    feeAmount,
    totalMonths,
  } = result;
  const fmt = (n: number) =>
    n.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
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
      <div className="cr-gauge-wrap">
        <svg
          className="cr-gauge-svg"
          width="100"
          height="60"
          viewBox="0 0 120 70"
          role="img"
          aria-label={`Loan interest burden: ${interestBurdenPct.toFixed(0)}%`}
        >
          <defs>
            <clipPath id="loan-half">
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
            clipPath="url(#loan-half)"
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
            clipPath="url(#loan-half)"
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
            clipPath="url(#loan-half)"
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
            clipPath="url(#loan-half)"
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
          <div className="cr-score">{fmt(emi)}</div>
          <div className="cr-score-label">monthly EMI</div>
          <span className={`cr-badge ${burdenBadge}`}>{burdenLabel}</span>
        </div>
      </div>
      <hr className="cr-divider" />
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
      <div className="cr-metrics-grid">
        <div className="cr-metric-card">
          <div className="cr-m-label">Monthly EMI</div>
          <div className="cr-m-value" style={{ fontSize: "13px" }}>
            {fmt(emi)}
          </div>
          <div className="cr-m-sub">for {totalMonths} months</div>
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
        {hasFee ? (
          <div className="cr-metric-card">
            <div className="cr-m-label">Total payable</div>
            <div className="cr-m-value" style={{ fontSize: "13px" }}>
              {fmt(payableAmount)}
            </div>
            <div className="cr-m-sub">incl. {fmt(feeAmount)} fee</div>
          </div>
        ) : (
          <div className="cr-metric-card">
            <div className="cr-m-label">Principal</div>
            <div className="cr-m-value" style={{ fontSize: "13px" }}>
              {fmt(principal)}
            </div>
            <div className="cr-m-sub">loan amount</div>
          </div>
        )}
      </div>
      <hr className="cr-divider" />
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

const formatNumber = (value: string) => {
  if (!value) return "";
  const num = Number(value.replace(/,/g, ""));
  if (isNaN(num)) return "";
  return num.toLocaleString();
};

/* ─────────────────────────────────────────
   Main Calculator Page
───────────────────────────────────────── */
export default function LoanCalculator() {
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("");
  const [years, setYears] = useState("");
  const [months, setMonths] = useState("");
  const [fee, setFee] = useState("");
  const [panelResult, setPanelResult] = useState<LoanResult | null>(null);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const toggleFAQ = (index: number) =>
    setOpenFAQ(openFAQ === index ? null : index);

  const compute = (): LoanResult | null => {
    if (!amount || !rate) return null;
    const principal = Number(amount.replace(/,/g, ""));
    const monthlyRate = Number(rate) / 100 / 12;
    const totalMonths = Number(years || 0) * 12 + Number(months || 0);
    if (totalMonths <= 0 || principal <= 0 || Number(rate) <= 0) return null;
    const emi =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);
    const totalPayment = emi * totalMonths;
    const totalInterest = totalPayment - principal;
    const feeAmount = fee ? (principal * Number(fee)) / 100 : 0;
    const payableAmount = totalPayment + feeAmount;
    return {
      emi,
      totalInterest,
      totalPayment,
      payableAmount,
      principal,
      interestBurdenPct: (totalInterest / principal) * 100,
      hasFee: !!fee && Number(fee) > 0,
      feeAmount,
      totalMonths,
    };
  };

  useEffect(() => {
    setPanelResult(compute());
  }, [amount, rate, years, months, fee]);
  const calculateLoan = () => setPanelResult(compute());
  const handleClear = () => {
    setAmount("");
    setRate("");
    setYears("");
    setMonths("");
    setFee("");
    setPanelResult(null);
  };

  return (
    <div className="page-layout">
      <div className="single-page-padding">
        <h1>
          Free Loan Calculator Online — Monthly Payment, Interest &amp; Fees
        </h1>
        <p>
          Calculate your monthly loan payment, total interest paid, processing
          fees, and full repayment cost for any loan type.
        </p>

        <div className="calc-card single-calc">
          <input
            className="calc-input"
            type="text"
            placeholder="Loan Amount"
            value={formatNumber(amount)}
            onChange={(e) => setAmount(e.target.value.replace(/,/g, ""))}
          />
          <input
            className="calc-input"
            type="number"
            placeholder="Interest Rate (%)"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
          />
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              className="calc-input"
              type="number"
              placeholder="Years"
              value={years}
              onChange={(e) => setYears(e.target.value)}
              style={{ flex: 1 }}
            />
            <input
              className="calc-input"
              type="number"
              placeholder="Months"
              value={months}
              onChange={(e) => setMonths(e.target.value)}
              style={{ flex: 1 }}
            />
          </div>
          <input
            className="calc-input"
            type="number"
            placeholder="Processing Fee (%) (optional)"
            value={fee}
            onChange={(e) => setFee(e.target.value)}
          />
          <div style={{ display: "flex", gap: "10px" }}>
            <button className="calc-button" onClick={calculateLoan}>
              Calculate
            </button>
            <button className="calc-button calc-clear" onClick={handleClear}>
              Clear
            </button>
          </div>
        </div>

        <div className="cr-mobile-slot">
          <LoanResultPanel result={panelResult} />
        </div>

        {/* ---- SEO CONTENT ---- */}

        <h2>What Is a Loan Calculator?</h2>
        <p>
          A loan calculator computes your monthly payment (EMI), total interest
          paid, and full repayment cost for any loan based on the amount
          borrowed, interest rate, and loan term. Whether you are considering a
          personal loan, home loan, car loan, education loan, or business loan,
          this free loan calculator online gives you the exact numbers before
          you sign anything — so you can compare offers, plan your budget, and
          avoid borrowing more than you can comfortably repay.
        </p>
        <p>
          This tool also functions as a loan calculator with fees — enter the
          optional processing fee percentage and see the total payable amount
          including the upfront charge. The result panel shows an interest
          burden gauge, a principal vs. interest breakdown, and the exact cost
          of borrowing down to the last decimal. For EMI-focused calculations
          without the fee field, our dedicated{" "}
          <Link href="/emi-calculator/" className="my-link">
            EMI calculator
          </Link>{" "}
          provides the same core computation with a streamlined interface.
        </p>

        <h2>How Is Loan Interest Calculated?</h2>
        <p>
          Most loans use the reducing balance method, where interest is charged
          on the outstanding principal after each payment — not on the original
          borrowed amount. This means you pay more interest in the early months
          (when the balance is large) and progressively less as you pay down the
          principal. The standard EMI formula that implements this is:
        </p>
        <pre>
          EMI = [P × R × (1 + R)<sup>N</sup>] / [(1 + R)<sup>N</sup> – 1]
        </pre>
        <ul>
          <li>
            <strong>P</strong> = Loan principal (amount borrowed)
          </li>
          <li>
            <strong>R</strong> = Monthly interest rate (annual rate ÷ 12 ÷ 100)
          </li>
          <li>
            <strong>N</strong> = Total number of monthly payments
          </li>
        </ul>
        <p>
          This is the formula banks use worldwide. Enter your values above and
          the calculator applies it instantly — no manual math needed.
        </p>

        <h2>
          Loan Cost Comparison — How Rate and Term Change Your Total Interest
        </h2>
        <p>
          The table below shows what a 1,000,000 loan looks like at different
          interest rates and terms. Use it to see how much the total interest
          paid changes with each variable — this is essentially a total interest
          paid on loan calculator in table form:
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
                  Rate
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Term
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Monthly EMI
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
                ["8%", "3 years", "31,334", "128,024", "1,128,024"],
                ["8%", "5 years", "20,276", "216,560", "1,216,560"],
                ["12%", "3 years", "33,214", "195,704", "1,195,704"],
                ["12%", "5 years", "22,244", "334,640", "1,334,640"],
                ["15%", "3 years", "34,665", "247,940", "1,247,940"],
                ["15%", "5 years", "23,790", "427,400", "1,427,400"],
                ["18%", "5 years", "25,393", "523,580", "1,523,580"],
              ].map(([r, t, emi, interest, total], i) => (
                <tr key={i}>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {r}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {t}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {emi}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {interest}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Notice how extending a 12% loan from 3 years to 5 years drops the
          monthly EMI by about 10,970 but adds 138,936 in total interest. That
          is the fundamental trade-off — lower monthly payments cost more over
          the full term.
        </p>

        <h2>Step-by-Step Loan Calculation Example</h2>
        <p>
          A personal loan of 500,000 at 14% annual interest for 3 years with a
          2% processing fee:
        </p>
        <ul className="custom-list">
          <li>
            <strong>Principal:</strong> 500,000
          </li>
          <li>
            <strong>Monthly rate:</strong> 14 ÷ 12 ÷ 100 = 0.01167
          </li>
          <li>
            <strong>Term:</strong> 36 months
          </li>
          <li>
            <strong>Monthly EMI ≈ 17,087</strong>
          </li>
          <li>
            <strong>Total repayment:</strong> 17,087 × 36 = 615,132
          </li>
          <li>
            <strong>Total interest paid:</strong> 615,132 − 500,000 = 115,132
          </li>
          <li>
            <strong>Processing fee:</strong> 500,000 × 2% = 10,000
          </li>
          <li>
            <strong>Total payable (with fee):</strong> 615,132 + 10,000 ={" "}
            <strong>625,132</strong>
          </li>
        </ul>
        <p>
          The processing fee adds 10,000 to the true cost that does not show up
          in the EMI — which is why this loan calculator with fees matters for
          comparing offers from different lenders.
        </p>

        <h2>How Much Loan Can I Afford on My Salary?</h2>
        <p>
          A practical way to determine how much loan you can afford is to use
          the debt-to-income (DTI) ratio. Financial advisors generally recommend
          that your total monthly debt payments — including the new loan EMI —
          should not exceed 35% to 40% of your gross monthly income.
        </p>
        <p>
          For example, if your monthly salary is 80,000, your maximum total EMI
          burden should be roughly 28,000 to 32,000. If you already pay 10,000
          per month on an existing car loan, the maximum EMI for a new loan
          would be 18,000 to 22,000. Enter different loan amounts into the
          calculator above until the EMI falls within this range.
        </p>
        <p>
          To know your exact take-home salary after taxes — which determines
          what you can actually afford — use our{" "}
          <Link href="/income-tax-calculator/" className="my-link">
            income tax calculator
          </Link>
          . And to see how a specific home loan fits your budget, our{" "}
          <Link href="/home-mortgage-calculator/" className="my-link">
            home mortgage calculator
          </Link>{" "}
          includes down payment and property cost inputs.
        </p>

        <h2>What Is a Good Debt-to-Income Ratio?</h2>
        <p>
          Your debt-to-income (DTI) ratio is the percentage of your gross
          monthly income that goes toward debt payments. Lenders use it to
          assess your borrowing capacity:
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
                  DTI Range
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Assessment
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  What It Means
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                [
                  "Under 20%",
                  "Excellent",
                  "Strong borrowing capacity, comfortable repayment",
                ],
                [
                  "20–35%",
                  "Good",
                  "Manageable debt load, most lenders approve",
                ],
                [
                  "35–43%",
                  "Stretched",
                  "Approval possible but limited room for new borrowing",
                ],
                [
                  "Above 43%",
                  "Risky",
                  "Most lenders will decline; existing debts need reduction",
                ],
              ].map(([range, assess, meaning], i) => (
                <tr key={i}>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {range}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {assess}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {meaning}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Calculate your DTI by dividing your total monthly debt payments by
          your gross monthly income, then multiplying by 100. If the result is
          above 35%, consider paying off existing debts before taking a new
          loan. Our{" "}
          <Link href="/rent-calculator/" className="my-link">
            rent calculator
          </Link>{" "}
          can help you assess whether housing costs are consuming too much of
          your income relative to the 28% to 35% housing guideline.
        </p>

        <h2>How to Pay Off a Loan Faster</h2>
        <p>
          Paying off a loan ahead of schedule saves you interest and frees up
          cash flow. Here are the most effective strategies:
        </p>
        <ul className="custom-list">
          <li>
            <strong>Make extra payments toward principal.</strong> Even small
            additional amounts applied directly to the principal reduce the
            balance faster, which means less interest accrues in subsequent
            months. Some borrowers add one extra EMI per year — effectively
            turning a 5-year loan into a roughly 4-year loan.
          </li>
          <li>
            <strong>Round up your EMI.</strong> If your EMI is 17,087, pay
            18,000 instead. The extra 913 per month goes straight to principal
            and shortens the term without a noticeable budget impact.
          </li>
          <li>
            <strong>Use windfalls for lump-sum prepayments.</strong> Bonuses,
            tax refunds, or unexpected income can significantly reduce your
            outstanding balance when applied as prepayments.
          </li>
          <li>
            <strong>Refinance at a lower rate.</strong> If interest rates have
            dropped since you took the loan, refinancing can lower your EMI and
            total interest. Use this calculator to compare the new terms before
            committing.
          </li>
          <li>
            <strong>Choose a shorter term when possible.</strong> If you can
            handle a higher EMI, switching from a 5-year to a 3-year term can
            save 30% to 50% in total interest — the comparison table above shows
            exactly how much.
          </li>
        </ul>
        <p>
          While this calculator shows the standard repayment schedule, the extra
          payment strategy is easy to model: reduce the principal by your
          planned extra payments, then recalculate with the remaining balance
          and remaining term to see the new EMI. Our{" "}
          <Link href="/emi-calculator/" className="my-link">
            EMI calculator
          </Link>{" "}
          is a quick way to run these what-if scenarios.
        </p>

        <h2>Types of Loans You Can Calculate</h2>
        <p>This calculator works for any loan that uses fixed EMI repayment:</p>
        <ul className="custom-list">
          <li>
            <strong>Personal loans</strong> — unsecured loans for any purpose,
            typically 10% to 24% interest, 1 to 5 year terms.
          </li>
          <li>
            <strong>Home loans / mortgages</strong> — secured against property,
            lower rates (7% to 12%), 10 to 30 year terms. For a more detailed
            home-specific calculation with down payment, use our{" "}
            <Link href="/home-mortgage-calculator/" className="my-link">
              home mortgage calculator
            </Link>
            .
          </li>
          <li>
            <strong>Car loans</strong> — secured against the vehicle, moderate
            rates, 3 to 7 year terms.
          </li>
          <li>
            <strong>Education loans</strong> — often include a moratorium period
            before EMI starts.
          </li>
          <li>
            <strong>Business loans</strong> — rates and terms vary widely by
            lender and business profile.
          </li>
          <li>
            <strong>Gold loans, two-wheeler loans, property loans</strong> — all
            follow the same EMI formula and work with this calculator.
          </li>
        </ul>

        <h2>Understanding Processing Fees and Their Impact</h2>
        <p>
          Many lenders charge a one-time processing fee — typically 1% to 3% of
          the loan amount — for handling your application. This fee does not
          change your monthly EMI, but it increases the true cost of borrowing.
          For a 1,000,000 loan with a 2% processing fee, you pay 20,000 upfront
          on top of the interest — money that never reduces your principal.
        </p>
        <p>
          When comparing two loan offers, always compare the total payable
          amount (EMI payments + processing fee), not just the interest rate. A
          loan at 11% with a 2.5% fee may cost more in total than a loan at
          11.5% with a 0.5% fee. This calculator shows both figures so you can
          make an informed comparison.
        </p>

        <h2>Key Factors That Affect Your Loan EMI</h2>
        <ul className="custom-list">
          <li>
            <strong>Interest rate</strong> — the single biggest cost factor.
            Even 0.5% less can save thousands over a multi-year term. Always
            negotiate.
          </li>
          <li>
            <strong>Loan amount</strong> — borrowing more means higher EMIs.
            Calculate the minimum you actually need rather than the maximum you
            qualify for.
          </li>
          <li>
            <strong>Loan term</strong> — longer terms reduce EMI but increase
            total interest dramatically. The comparison table above makes this
            trade-off concrete.
          </li>
          <li>
            <strong>Credit score</strong> — higher scores qualify for lower
            rates, directly reducing your EMI and total cost. Improving your
            score before applying is one of the most effective ways to save
            money on a loan.
          </li>
          <li>
            <strong>Loan type</strong> — secured loans (backed by collateral
            like property or a vehicle) almost always offer lower rates than
            unsecured personal loans.
          </li>
        </ul>

        <h2>Tips to Get a Better Loan Deal</h2>
        <ul className="custom-list">
          <li>
            <strong>Compare at least 3 to 4 lenders</strong> — rates and fees
            vary significantly. Use this calculator to run each offer and
            compare total payable amounts side by side.
          </li>
          <li>
            <strong>Improve your credit score first</strong> — paying off credit
            card balances and correcting report errors before applying can
            unlock meaningfully better rates.
          </li>
          <li>
            <strong>Negotiate the processing fee</strong> — many lenders will
            reduce or waive it for strong applicants or during promotional
            periods.
          </li>
          <li>
            <strong>Choose the shortest term you can afford</strong> — use the
            calculator to find the sweet spot where the EMI is challenging but
            manageable.
          </li>
          <li>
            <strong>Read the prepayment terms</strong> — some loans charge a
            penalty for early repayment. Avoid these if you plan to pay off the
            loan faster.
          </li>
          <li>
            <strong>Check your affordability</strong> — make sure the EMI does
            not push your debt-to-income ratio above 35%. Our{" "}
            <Link href="/income-tax-calculator/" className="my-link">
              income tax calculator
            </Link>{" "}
            shows your after-tax income for a realistic affordability check.
          </li>
        </ul>

        <h2>Frequently Asked Questions</h2>

        {[
          [
            "How is loan interest calculated?",
            "Most loans use the reducing balance method. Interest is charged on the outstanding principal each month — not on the original amount. As you pay down the principal through EMIs, the interest portion decreases and the principal portion increases. The EMI formula (shown above) implements this automatically.",
          ],
          [
            "How much loan can I afford on my salary?",
            "A safe guideline is to keep your total monthly debt payments (including the new loan EMI) below 35% to 40% of your gross monthly income. If you earn 80,000 per month and already pay 10,000 on existing debts, your new loan EMI should stay under 18,000 to 22,000. Enter different amounts in the calculator until the EMI fits.",
          ],
          [
            "What is a good debt-to-income ratio?",
            "Under 20% is excellent, 20% to 35% is good, 35% to 43% is stretched, and above 43% is risky — most lenders will decline applications at this level. Calculate yours by dividing total monthly debt payments by gross monthly income.",
          ],
          [
            "How do I pay off a loan faster?",
            "Make extra payments toward principal whenever possible, round up your EMI amount, apply windfalls (bonuses, tax refunds) as lump-sum prepayments, and consider refinancing if rates have dropped. Even one extra EMI payment per year can shorten a 5-year loan by nearly a year.",
          ],
          [
            "Does the processing fee affect my EMI?",
            "No — the processing fee is a one-time upfront charge and does not change your monthly EMI. However, it increases the total cost of the loan. This calculator shows both the EMI-based total repayment and the grand total including the fee so you can see the complete picture.",
          ],
          [
            "Can I use this for a home loan?",
            "Yes. Enter the loan amount (home price minus down payment), interest rate, and term. For a more detailed mortgage-specific calculation that includes down payment percentage and property cost, use our home mortgage calculator.",
          ],
          [
            "What happens if I miss an EMI payment?",
            "Late payment fees are charged immediately, the missed amount plus penalty is added to your balance, and your credit score takes a hit. Repeated misses can lead to loan default proceedings. If you foresee difficulty, contact your lender early to discuss restructuring options.",
          ],
          [
            "Is a shorter or longer loan term better?",
            "Shorter terms cost less in total interest but require higher monthly payments. Longer terms are easier on your monthly budget but cost significantly more over the full duration. The best choice depends on what EMI you can comfortably afford without straining your finances.",
          ],
          [
            "Is this loan calculator free to use?",
            "Yes — completely free with no sign-up, no limits, and no hidden charges. Calculate any loan amount, rate, and term combination as many times as you need. Results include EMI, total interest, total repayment, processing fee impact, and an interest burden gauge.",
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
          A loan is one of the biggest financial commitments you can make.
          Running the numbers through this calculator before you borrow — not
          after — puts you in control of the decision. Compare rates, test
          different terms, factor in processing fees, and check your
          debt-to-income ratio before committing. The more clearly you see the
          numbers, the better your borrowing decision will be.
        </p>
        <p>
          For related financial planning, our{" "}
          <Link href="/emi-calculator/" className="my-link">
            EMI calculator
          </Link>{" "}
          provides a streamlined monthly payment computation, our{" "}
          <Link href="/home-mortgage-calculator/" className="my-link">
            home mortgage calculator
          </Link>{" "}
          adds down payment and property cost context for home buyers, and our{" "}
          <Link href="/net-worth-calculator/" className="my-link">
            net worth calculator
          </Link>{" "}
          shows how your loan fits into your complete financial picture —
          because every liability on one side of the balance sheet affects the
          other.
        </p>
      </div>

      {/* ---- SIDEBAR ---- */}
      <aside className="sidebar">
        <div className="cr-desktop-slot">
          <LoanResultPanel result={panelResult} />
        </div>
        <div className="sidebar-box">
          <p style={{ fontSize: "20px", fontWeight: 600 }}>
            Related Calculators
          </p>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {[
              ["/emi-calculator/", "EMI Calculator"],
              ["/home-mortgage-calculator/", "Home Mortgage Calculator"],
              ["/rent-calculator/", "Rent Calculator"],
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
