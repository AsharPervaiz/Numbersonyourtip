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
const FAQ_DATA: [string, string][] = [
  [
    "How do I compare two loan offers properly?",
    "Compare the cost of credit: total repaid minus the cash you actually receive. On two 300,000 loans over four years, one at 9.5% with a 3% fee taken from the advance costs about 70,773, while one at 10.5% with no fee costs about 68,689. The first wins on rate, on monthly payment and on total repaid, and still costs more — because 9,000 never reached you.",
  ],
  [
    "Does a lower interest rate always mean a cheaper loan?",
    "No. The rate ignores fees, and fees can easily outweigh a one-point difference on a medium-term loan. An arrangement fee deducted from the advance means you pay interest on money you never received; one added to the principal means the fee itself accrues interest for the whole term. Only the cost-of-credit figure captures both.",
  ],
  [
    "What is APR and can I trust it?",
    "APR expresses interest plus compulsory fees as one annualised rate, so differently structured offers can be compared on a single number. It is more reliable than the headline rate, with three caveats: optional add-ons can fall outside it, advertised rates are often 'representative' so the rate you are offered may be higher, and it assumes the loan runs full term so it says nothing about early settlement.",
  ],
  [
    "What debt-to-income ratio do lenders want?",
    "Total monthly debt payments divided by gross monthly income. Someone earning 5,000 with 1,000 of commitments is at 20%, and adding a 750 instalment takes them to 35%. Lenders commonly become uncomfortable in the high thirties to low forties, though it varies by lender and product. Note it uses gross income, so it overstates what you can comfortably service from take-home pay.",
  ],
  [
    "Should I take a longer term to lower my payment?",
    "It works, and it is not a better deal — it is the same deal spread thinner. Reducing the rate lowers both the monthly payment and the total; extending the term lowers the payment and raises the total, often substantially. A longer term can be the right call when cash flow is genuinely tight, but it should be a deliberate trade rather than the lever you reach for first.",
  ],
  [
    "What fees should I ask about before signing?",
    "Arrangement or processing fees and whether they come off the advance or are added to the principal, early settlement penalties, late payment charges, any insurance bundled into the agreement, and charges for administrative changes such as moving the payment date. Ask for the total repayable and the amount you will actually receive, which forces all of it into the open.",
  ],
  [
    "What is the fastest way to pay off a loan early?",
    "Rounding the instalment up sends the surplus to principal automatically every month. Applying irregular income such as a bonus is more powerful, and worth far more early in the term than late, because it cancels all the future interest that principal would have carried. With several debts, directing everything spare at the highest rate minimises total interest.",
  ],
  [
    "Will overpaying always save me money?",
    "Usually, but check two things first. Some agreements charge an early settlement penalty that can outweigh the interest saved on a loan already well advanced. And confirm the lender applies overpayments to the principal immediately rather than holding them against future instalments — if they do the latter, the balance does not fall and no interest is saved.",
  ],
  [
    "I was approved for more than I expected. Should I take it?",
    "An approval reflects the lender's appetite for risk, not your household budget, and it is assessed against gross income rather than what reaches your account. The more useful test is what remains after the new instalment and every other commitment, and whether that residual still absorbs an unexpected cost without new borrowing.",
  ],
];

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
          Loan Calculator — Compare Offers by True Cost of Credit
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

        <h2>The Advertised Rate Is Not the Price of the Loan</h2>
        <p>
          Loans are marketed on the interest rate because it is one number and
          it is easy to compare. It is also not what the loan costs you. The
          figure that matters is the total cost of credit: everything you hand
          back, minus everything you actually received.
        </p>
        <pre>
          Cost of credit = (Instalment × Number of payments) − Cash actually
          received
        </pre>
        <p>
          That second term is where offers diverge. A loan advertised as
          300,000 does not necessarily put 300,000 in your account, and a loan
          with a lower rate can easily cost more than one with a higher rate.
        </p>

        <h2>A Worked Comparison Where the Lower Rate Loses</h2>
        <p>
          Two offers, both 300,000 over four years.
        </p>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Offer A</th>
                <th>Offer B</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Advertised rate</td>
                <td>9.5%</td>
                <td>10.5%</td>
              </tr>
              <tr>
                <td>Arrangement fee</td>
                <td>3%, deducted from the advance</td>
                <td>None</td>
              </tr>
              <tr>
                <td>Cash you receive</td>
                <td>291,000</td>
                <td>300,000</td>
              </tr>
              <tr>
                <td>Monthly instalment</td>
                <td>about 7,537</td>
                <td>about 7,681</td>
              </tr>
              <tr>
                <td>Total repaid</td>
                <td>about 361,773</td>
                <td>about 368,689</td>
              </tr>
              <tr>
                <td>
                  <strong>Cost of credit</strong>
                </td>
                <td>
                  <strong>about 70,773</strong>
                </td>
                <td>
                  <strong>about 68,689</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          Offer A wins on the rate, wins on the monthly payment, wins on total
          repaid — and still costs more, because 9,000 was taken out before the
          money arrived. It also leaves you 9,000 short of what you needed to
          borrow.
        </p>
        <p>
          Any of the first three lines read alone points at the wrong offer.
          Only the last line answers the question.
        </p>

        <h2>Where Fees Hide</h2>
        <p>
          Fees do the same damage in two different ways, and the second is
          easier to miss.
        </p>
        <p>
          <strong>Deducted from the advance.</strong> You borrow 300,000, receive
          291,000, and repay interest on the full 300,000. You are paying
          interest on money you never had.
        </p>
        <p>
          <strong>Added to the principal.</strong> You need 300,000, so the
          lender writes the loan for 309,000 and you receive the amount you
          asked for. The instalment is higher and the fee itself accrues
          interest for the whole term.
        </p>
        <p>
          Either way the cost-of-credit calculation catches it, which is the
          argument for using that figure rather than any of the headline
          numbers. Other charges worth asking about explicitly: early
          settlement penalties, late payment fees, mandatory insurance bundled
          into the agreement, and any charge for a payment date change.
        </p>

        <h2>What APR Does and Does Not Tell You</h2>
        <p>
          An annual percentage rate exists precisely to solve the problem above.
          It expresses the interest and the compulsory fees as a single
          annualised rate, so that two offers can be compared on one number even
          when they are structured differently. Where regulation requires it to
          be quoted, comparing APRs is more reliable than comparing headline
          rates.
        </p>
        <p>
          Its limits are worth knowing. What counts as a compulsory charge is
          defined by regulation, so optional add-ons can sit outside the figure.
          Advertised APRs are often described as representative, meaning only a
          proportion of successful applicants need to receive it — the rate you
          are actually offered after a credit assessment can be higher. And the
          calculation assumes the loan runs its full term, so it does not
          describe the cost if you settle early.
        </p>
        <p>
          Use APR to shortlist, and the cost of credit on the actual offer you
          are given to decide.
        </p>

        <h2>Term Versus Rate</h2>
        <p>
          Two levers change the instalment and they behave very differently.
          Negotiating the rate down reduces both the monthly payment and the
          total. Extending the term reduces the monthly payment and increases
          the total, often substantially.
        </p>
        <p>
          Borrowers under pressure tend to reach for the term, because it is the
          lever a lender will always agree to. It is worth being clear that
          those two conversations are not equivalent: a longer term is not a
          better deal, it is the same deal spread thinner. Our{" "}
          <Link href="/emi-calculator/" className="my-link">
            EMI calculator
          </Link>{" "}
          shows the interest cost of each additional year directly.
        </p>

        <h2>How Much You Can Borrow Versus How Much You Should</h2>
        <p>
          Lenders assess affordability with a debt-to-income ratio — the share of
          gross monthly income consumed by debt repayments.
        </p>
        <pre>
          Debt-to-income = Total monthly debt payments ÷ Gross monthly income ×
          100
        </pre>
        <p>
          Someone earning 5,000 a month with 1,000 of existing commitments is at
          20%. Adding a 750 instalment takes them to 35%. Lenders commonly get
          uncomfortable somewhere in the high thirties to low forties, though
          the threshold varies by lender and by product.
        </p>
        <p>
          Two cautions about that number. It uses gross income, so it overstates
          what you can comfortably service — the payments come out of take-home
          pay, not gross. And an approval reflects the lender&apos;s appetite for
          risk, not your household budget. The more useful personal test is what
          remains after the new instalment and all your other commitments, and
          whether that still absorbs an unexpected cost.
        </p>

        <h2>Paying It Off Sooner</h2>
        <p>
          Three approaches work, in ascending order of effect.
        </p>
        <ul className="custom-list">
          <li>
            <strong>Round the payment up.</strong> Paying 8,000 against a 7,681
            instalment sends the surplus straight to principal every month. It
            is small, automatic, and requires no decision after the first one.
          </li>
          <li>
            <strong>Apply irregular income.</strong> A bonus or a tax refund put
            against the balance removes all the future interest that principal
            would have carried, which is why the same amount is worth far more
            early in the term than late.
          </li>
          <li>
            <strong>Clear the most expensive debt first.</strong> With several
            debts, paying minimums on all and directing everything spare at the
            highest rate minimises total interest. Clearing the smallest balance
            first is easier to sustain psychologically and costs more; either is
            defensible provided the choice is deliberate.
          </li>
        </ul>
        <p>
          Before overpaying, confirm there is no early settlement penalty and
          check whether the lender applies overpayments to the principal
          immediately or holds them. Both details determine whether the strategy
          works at all.
        </p>
        <p>
          For property borrowing, where the term is far longer and the interest
          front-loading much more pronounced, use the{" "}
          <Link href="/home-mortgage-calculator/" className="my-link">
            mortgage calculator
          </Link>
          . To see how a loan balance sits against everything else you own, the{" "}
          <Link href="/net-worth-calculator/" className="my-link">
            net worth calculator
          </Link>{" "}
          puts it in context.
        </p>
        <h2>Loan Comparison Questions</h2>

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
