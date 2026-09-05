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
const FAQ_DATA: [string, string][] = [
  [
    "Why is most of my early EMI going to interest?",
    "Because interest is charged on what you still owe, and at the start you owe almost everything. The instalment first covers the month's interest and only the remainder reduces the balance. As the balance falls the interest portion shrinks and the principal portion grows, so the split shifts every month even though the payment never changes. The effect is mild over five years and severe over twenty-five.",
  ],
  [
    "What is the EMI formula?",
    "EMI = P × r × (1 + r)ⁿ ÷ ((1 + r)ⁿ − 1), where P is the amount borrowed, n is the number of monthly payments, and r is the monthly rate. The usual error is r: a 12% annual rate is 0.01 per month, not 12 and not 0.12. Getting that conversion wrong is the most common reason a hand calculation disagrees with the lender's figure.",
  ],
  [
    "Is a longer loan term cheaper?",
    "Cheaper each month and considerably more expensive overall. On 500,000 at 12%, three years costs about 16,607 monthly and roughly 97,900 in interest, while seven years costs about 8,826 monthly and roughly 241,400 in interest. Halving the instalment nearly triples the interest. A longer term can still be the right choice, but it should be chosen knowing what the breathing room costs.",
  ],
  [
    "Is it better to prepay early or later in the loan?",
    "Early, by a wide margin. A prepayment removes all the future interest that the repaid principal would have generated, so a lump sum in year one of a five-year loan cancels four years of interest on that amount while the same sum in year four cancels only months. Check for prepayment penalties first, since on a loan already well advanced a penalty can outweigh the saving.",
  ],
  [
    "After a prepayment, should I reduce the term or the instalment?",
    "Reducing the term saves markedly more interest; reducing the instalment improves monthly cash flow. Both are legitimate and they suit different situations, but lenders frequently apply one by default without asking. Tell them explicitly which you want at the time of the prepayment rather than discovering the choice was made for you.",
  ],
  [
    "What is the difference between a flat rate and a reducing balance rate?",
    "A reducing balance rate charges interest on what you still owe, which falls each month. A flat rate charges interest on the original amount for the whole term regardless of repayments. On 500,000 over five years, a 10% flat rate produces 250,000 of interest and an instalment of 12,500 — matching that instalment on a reducing balance basis would need a rate close to 17%.",
  ],
  [
    "How do I compare two loan offers quoted differently?",
    "Ignore the advertised rate unless you know which basis it uses, and compare the monthly instalment and the total repayable instead. Those two figures are directly comparable whatever the quoting convention, and they also absorb any fees rolled into the loan. A lower headline rate quoted flat can easily cost more than a higher one quoted on reducing balance.",
  ],
  [
    "Does doubling the interest rate double my EMI?",
    "No. The relationship is not proportional, because the instalment is derived from a compounding calculation rather than a simple multiplication. A rate change moves the payment by less than the change itself in percentage terms, and the size of the effect grows with the length of the loan — the same rate rise matters far more on a twenty-year loan than a three-year one.",
  ],
  [
    "What happens if I miss an EMI payment?",
    "Three separate things. A late fee applies, usually modest. Interest keeps accruing on the balance that was not reduced, so the loan gets more expensive. And the missed payment is typically reported to credit reference agencies, which affects your borrowing terms for years and is normally the costliest of the three. Contacting the lender before a payment is missed usually produces a better outcome than afterwards.",
  ],
];

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
        <h1>EMI Calculator — Instalment, Interest Split and Prepayment</h1>

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

        {/* ---- SEO CONTENT ---- */}

        <h2>Every EMI Is Two Payments Wearing One Number</h2>
        <p>
          An equated monthly instalment stays the same every month, which makes
          it easy to budget and easy to misunderstand. The total is fixed; what
          it consists of changes with every payment.
        </p>
        <p>
          Each instalment covers the interest that accrued on the outstanding
          balance since the last one, and whatever is left over reduces the
          balance. Because the balance falls each month, the interest portion
          falls too, and the principal portion grows to fill the gap.
        </p>
        <pre>
          Interest this month = Outstanding balance × Monthly rate{"\n"}Principal
          this month = EMI − Interest this month{"\n"}New balance = Outstanding
          balance − Principal this month
        </pre>
        <p>
          Take a 500,000 loan at 12% a year over five years. The monthly rate is
          1%, and the instalment works out at about 11,122.
        </p>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Payment</th>
                <th>Goes to interest</th>
                <th>Goes to principal</th>
                <th>Balance after</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>First</td>
                <td>5,000</td>
                <td>6,122</td>
                <td>493,878</td>
              </tr>
              <tr>
                <td>Second</td>
                <td>4,939</td>
                <td>6,183</td>
                <td>487,695</td>
              </tr>
              <tr>
                <td>Third</td>
                <td>4,877</td>
                <td>6,245</td>
                <td>481,450</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          The instalment never moves. The split shifts a little every month, and
          it accelerates: by the final year almost the whole payment is
          principal. Across the full sixty months this borrower pays about
          667,000 in total, of which roughly 167,000 is interest.
        </p>
        <p>
          The front-loading is mild over five years and severe over twenty-five,
          because the effect compounds with term. On a long mortgage the early
          years barely touch the balance at all — the{" "}
          <Link href="/home-mortgage-calculator/" className="my-link">
            mortgage calculator
          </Link>{" "}
          shows how extreme that becomes.
        </p>

        <h2>The Formula, and Why It Looks Like That</h2>
        <pre>EMI = P × r × (1 + r)ⁿ ÷ ((1 + r)ⁿ − 1)</pre>
        <p>
          P is the amount borrowed, n is the number of monthly payments, and r
          is the monthly rate — the annual rate divided by twelve and by a
          hundred. A 12% annual rate is 0.01 as a monthly r, not 12 and not
          0.12, and getting this conversion wrong is the most common reason a
          hand calculation disagrees with a lender&apos;s figure.
        </p>
        <p>
          The shape of the equation follows from a single requirement: find the
          fixed payment whose present value, discounted at the loan rate, equals
          the amount borrowed. Everything else is algebra. It also explains why
          the relationship between rate and instalment is not proportional —
          doubling the rate does not double the payment, and the effect of a
          rate change grows with the term.
        </p>

        <h2>Term and Rate Pull in Different Directions</h2>
        <p>
          Borrowers usually optimise for the monthly figure, which is the wrong
          variable to fixate on if total cost matters. Lengthening the term
          lowers the instalment and raises the total substantially.
        </p>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Term on 500,000 at 12%</th>
                <th>Monthly instalment</th>
                <th>Total interest paid</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>3 years</td>
                <td>about 16,607</td>
                <td>about 97,900</td>
              </tr>
              <tr>
                <td>5 years</td>
                <td>about 11,122</td>
                <td>about 167,300</td>
              </tr>
              <tr>
                <td>7 years</td>
                <td>about 8,826</td>
                <td>about 241,400</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          Moving from three years to seven cuts the monthly commitment by
          roughly half and nearly triples the interest. Neither choice is wrong
          — a lower instalment can be the difference between affordable and not
          — but it should be made knowing what the extra breathing room costs.
        </p>

        <h2>Prepayment: Why Timing Matters More Than Amount</h2>
        <p>
          A lump sum paid against a loan comes off the principal, which removes
          all the future interest that principal would have generated. Because
          interest accrues on the balance, the earlier the payment lands, the
          more interest it cancels.
        </p>
        <p>
          The same 50,000 has a very different effect in year one than in year
          four of a five-year loan. Early, it removes four years of interest on
          that amount. Late, it removes months. This is why prepaying at the
          start of a loan is disproportionately effective and why doing it near
          the end achieves comparatively little.
        </p>
        <p>
          Two things to check before prepaying:
        </p>
        <ul className="custom-list">
          <li>
            <strong>Whether a penalty applies.</strong> Some agreements charge a
            percentage of the amount prepaid, which can outweigh the interest
            saved on a loan already well advanced.
          </li>
          <li>
            <strong>Which variable the lender reduces.</strong> After a
            prepayment they can either shorten the term and keep the instalment,
            or keep the term and lower the instalment. The first saves markedly
            more interest; the second improves monthly cash flow. Lenders often
            default to one without asking, so state which you want.
          </li>
        </ul>

        <h2>Flat Rate and Reducing Balance Are Not Comparable</h2>
        <p>
          Two loans can advertise very different rates and cost almost the same,
          because they are quoted on different bases.
        </p>
        <p>
          A <strong>reducing balance</strong> rate charges interest on what you
          still owe, which falls every month. This is what the EMI formula
          above assumes and what most mortgages and bank loans use.
        </p>
        <p>
          A <strong>flat rate</strong> charges interest on the original amount
          for the whole term, regardless of how much you have repaid. On a
          500,000 loan at 10% flat over five years, the interest is 250,000 —
          ten percent of the full amount, five times over — giving a total of
          750,000 and an instalment of 12,500.
        </p>
        <p>
          That headline 10% is not comparable to a 10% reducing-balance rate. To
          produce the same 12,500 instalment on a reducing-balance basis, the
          rate would need to be close to 17%. The flat quote sounds like a
          better deal and is considerably worse.
        </p>
        <p>
          When comparing offers, ignore the advertised rate unless you know
          which basis it uses, and compare the instalment and the total repayable
          instead. Those two figures are directly comparable whatever the
          quoting convention. Our{" "}
          <Link href="/loan-calculator/" className="my-link">
            loan calculator
          </Link>{" "}
          sets out how to compare competing offers including fees.
        </p>

        <h2>What Happens If a Payment Is Missed</h2>
        <p>
          Missing an instalment has three separate consequences, and only the
          first is obvious.
        </p>
        <p>
          There is usually a late fee, which is a fixed and generally modest
          cost. Interest continues accruing on the unreduced balance, so the
          loan quietly gets more expensive. And the missed payment is typically
          reported to credit reference agencies, which affects borrowing terms
          for years — normally the most expensive of the three by a wide margin.
        </p>
        <p>
          Where a payment is going to be missed, contacting the lender before it
          happens is materially better than after. Restructuring, a payment
          holiday, or a term extension are all easier to arrange in advance, and
          an arrangement made ahead of time is usually recorded differently from
          a default.
        </p>
        <h2>EMI Questions</h2>

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
