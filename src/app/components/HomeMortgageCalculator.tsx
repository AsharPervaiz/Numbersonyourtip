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
const FAQ_DATA: [string, string][] = [
  [
    "What costs are missing from the calculated mortgage payment?",
    "The calculation covers principal and interest only. Property taxes, buildings insurance, mortgage insurance where required, any service or ground charges, and maintenance all sit outside it. Maintenance is the one most often forgotten because it does not arrive monthly — it arrives as a boiler or a roof — so setting a fixed amount aside each month is the only way to treat it as the recurring cost it is.",
  ],
  [
    "Why is so little of my early payment reducing the balance?",
    "Because interest is charged on what you still owe, and at the start you owe the full amount. On 250,000 at 6% over thirty years, the first payment of about 1,499 is 1,250 interest and 249 principal. After ten years of payments totalling nearly 180,000, under 41,000 of the debt has been cleared. This is also why overpaying early is far more effective than overpaying late.",
  ],
  [
    "How much interest will I pay over a full mortgage?",
    "Often more than the property cost. Borrowing 250,000 at 6% over thirty years repays about 539,595 in total, of which roughly 289,595 is interest. The figure is highly sensitive to both rate and term, which is why comparing total repayable rather than monthly payment changes how offers rank.",
  ],
  [
    "Is a 15-year mortgage better than a 30-year one?",
    "It costs far less and commits you to more. On 250,000 at 6%, fifteen years costs about 2,110 a month against 1,499, and saves roughly 159,860 in interest. The shorter term locks in the higher payment with no option to drop back. Many borrowers take the longer term and overpay voluntarily instead, keeping the flexibility while capturing most of the saving — provided they actually make the overpayments.",
  ],
  [
    "Should I choose a fixed or variable rate?",
    "Frame it as what a rate rise would do to you rather than as a forecast. If a payment increase of a few hundred a month would be an annoyance you absorb, a variable rate is a reasonable risk. If it would break your budget, a fixed rate is buying certainty, which is worth a small premium regardless of where rates go. On a fixed deal, arrange the next one before it expires to avoid reverting to a higher standard rate.",
  ],
  [
    "How much deposit should I put down?",
    "Enough to cross a loan-to-value band if you are close to one, since lenders price by band and the rate improvement can be worth more than the reduction in borrowing. A larger deposit also avoids mortgage insurance where it applies and protects you against negative equity. Against that, emptying your savings entirely is its own risk — the month after completion is the worst time to have no accessible cash.",
  ],
  [
    "What should I stress-test before committing?",
    "Model the payment at a rate two or three points above today's. If that version is unaffordable, the current payment is only affordable for now, which is a different thing. Also total every ownership cost rather than the mortgage payment alone, and budget purchase costs — legal fees, surveys, taxes and moving — separately, since they are a lump sum rather than a monthly commitment.",
  ],
  [
    "Why did I get so little equity back when I sold early?",
    "Because early payments are mostly interest. Five years into a thirty-year mortgage on 250,000 at 6%, about 89,933 has been paid and roughly 17,364 of the balance cleared. Add selling costs and any fall in value, and an early sale can return less than the deposit that went in. It is the main financial argument against buying for a short stay.",
  ],
  [
    "Does overpaying a mortgage always help?",
    "Usually substantially, because it removes all the future interest that principal would have carried, and the effect is largest in the early years. Check the early repayment terms before you sign rather than when you first want to overpay — some deals cap annual overpayments or charge a penalty, and whether the lender applies the money to the balance immediately determines whether you save anything at all.",
  ],
];

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
        <h1>Mortgage Calculator — Payment, Total Interest and True Cost</h1>

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

        {/* ---- SEO CONTENT ---- */}

        <h2>The Mortgage Payment Is Not the Cost of the House</h2>
        <p>
          The number a mortgage calculator returns covers principal and
          interest. It is the largest part of what you pay to own a home and it
          is nowhere near all of it, which is why buyers who budget against it
          alone find their first year uncomfortable.
        </p>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Cost</th>
                <th>In the calculated payment?</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Principal and interest</td>
                <td>Yes</td>
                <td>The figure this calculator produces</td>
              </tr>
              <tr>
                <td>Property tax or council charges</td>
                <td>No</td>
                <td>
                  Often collected alongside the mortgage, and it rises over time
                </td>
              </tr>
              <tr>
                <td>Buildings insurance</td>
                <td>No</td>
                <td>Usually a lender requirement, not optional</td>
              </tr>
              <tr>
                <td>Mortgage insurance</td>
                <td>No</td>
                <td>
                  Commonly required below a certain deposit, and may fall away
                  later
                </td>
              </tr>
              <tr>
                <td>Service or ground charges</td>
                <td>No</td>
                <td>Applies to flats and managed developments</td>
              </tr>
              <tr>
                <td>Maintenance and repairs</td>
                <td>No</td>
                <td>
                  Irregular and unavoidable — the line renters never had to pay
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          Maintenance is the one people leave out entirely, because it does not
          arrive as a monthly bill. It arrives as a boiler, a roof, or a
          rewiring, and setting aside a fixed amount each month is the only way
          to make it behave like the recurring cost it actually is.
        </p>
        <p>
          When comparing owning against renting, the honest comparison is rent
          against every row of that table, not against the mortgage payment
          alone. Our guide on{" "}
          <Link href="/blog/renting-vs-buying-a-home/" className="my-link">
            renting versus buying
          </Link>{" "}
          works through both sides.
        </p>

        <h2>Five Years In, You Have Barely Started</h2>
        <p>
          Long mortgages are dominated by interest at the beginning, and the
          scale of it surprises almost everyone.
        </p>
        <p>
          Take 250,000 borrowed at 6% over thirty years. The monthly payment is
          about 1,499. Of the very first payment, 1,250 is interest and 249
          reduces the balance — roughly 83% of it is the cost of the money
          rather than repayment of it.
        </p>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>After</th>
                <th>Total paid</th>
                <th>Balance reduced by</th>
                <th>Still owed</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>5 years</td>
                <td>about 89,933</td>
                <td>about 17,364</td>
                <td>about 232,636</td>
              </tr>
              <tr>
                <td>10 years</td>
                <td>about 179,866</td>
                <td>about 40,786</td>
                <td>about 209,214</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          A decade of payments totalling nearly 180,000 has cleared under 41,000
          of debt. Nothing is wrong: interest is charged on the outstanding
          balance, and the balance starts at its maximum. But it explains why
          selling in the early years often returns less equity than owners
          expect, and why overpaying early is so much more effective than
          overpaying late.
        </p>
        <p>
          Over the full thirty years this borrower repays about 539,595 against
          250,000 borrowed — roughly 289,595 in interest, more than the house
          cost.
        </p>

        <h2>The Term Decision Is the Expensive One</h2>
        <p>
          Term affects total cost far more than most borrowers realise, because
          it changes both the payment and the number of times you make it.
        </p>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Term on 250,000 at 6%</th>
                <th>Monthly payment</th>
                <th>Total interest</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>30 years</td>
                <td>about 1,499</td>
                <td>about 289,595</td>
              </tr>
              <tr>
                <td>15 years</td>
                <td>about 2,110</td>
                <td>about 129,736</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          An extra 611 a month saves about 159,860 in interest. That is a
          genuine trade rather than an obvious win: the shorter term commits you
          to the higher payment permanently, with no option to drop back if
          circumstances change.
        </p>
        <p>
          A middle path that many borrowers prefer is to take the longer term
          for the flexibility and overpay voluntarily when you can. You keep the
          right to pay the lower amount in a difficult year, and in good years
          you capture most of the interest saving. It requires the discipline to
          actually make the overpayments, which is the part that decides whether
          it works.
        </p>

        <h2>Fixed and Variable Are a Bet on Different Things</h2>
        <p>
          A fixed rate holds your payment steady for an agreed period. A
          variable rate moves with the market, up as well as down.
        </p>
        <p>
          The choice is usually framed as predicting rates, which almost nobody
          does reliably. A more useful frame is what a rise would do to you. If
          a payment increase of a few hundred a month would be absorbed with
          mild annoyance, a variable rate is a reasonable risk. If it would
          break the budget, the fixed rate is buying certainty rather than
          chasing a forecast, and that is worth paying a small premium for
          regardless of what rates then do.
        </p>
        <p>
          On a fixed deal, note when it ends. Reverting to a lender&apos;s
          standard rate at the end of a fixed period is a common cause of a
          sudden payment jump, and it is entirely avoidable by arranging the next
          deal before the current one expires.
        </p>

        <h2>How the Deposit Changes More Than the Loan Size</h2>
        <p>
          A larger deposit reduces the amount borrowed, which is the obvious
          effect. Three less obvious ones usually matter more.
        </p>
        <ul className="custom-list">
          <li>
            Lenders price by loan-to-value band, so crossing a threshold can
            move you into a materially better interest rate — sometimes worth
            more than the reduction in borrowing itself.
          </li>
          <li>
            Mortgage insurance is commonly required below a certain deposit and
            is a pure cost that buys the lender protection, not you.
          </li>
          <li>
            More initial equity means a fall in property values is less likely
            to leave you owing more than the property is worth, which is what
            constrains your ability to move or remortgage.
          </li>
        </ul>
        <p>
          Against that, a deposit that empties your savings entirely is its own
          risk. Buying a house is immediately followed by needing money for it,
          and the worst time to have no accessible cash is the month after
          completion.
        </p>

        <h2>Before You Commit</h2>
        <ul className="custom-list">
          <li>
            Add up every row of the first table, not just the calculated
            payment, and check that total against your take-home pay.
          </li>
          <li>
            Model the payment at a rate two or three points higher than today.
            If that version is unaffordable, the current one is only affordable
            for now.
          </li>
          <li>
            Budget the purchase costs separately — legal fees, surveys, taxes on
            purchase, moving. They are a lump sum, not a monthly one.
          </li>
          <li>
            Keep an accessible reserve after the deposit rather than putting
            every last amount into it.
          </li>
          <li>
            Check the early repayment terms before you sign, not when you first
            want to overpay.
          </li>
        </ul>
        <p>
          To work out an honest purchase budget before looking at properties,
          our guide on{" "}
          <Link href="/blog/how-much-house-can-i-afford/" className="my-link">
            how much house you can afford
          </Link>{" "}
          starts from income rather than from listings, and the{" "}
          <Link href="/loan-calculator/" className="my-link">
            loan calculator
          </Link>{" "}
          covers comparing offers where fees differ.
        </p>
        <h2>Mortgage Questions</h2>

        {FAQ_DATA.map(([q, a], i) => (
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
              aria-expanded={openFAQ === i}
              aria-controls={`faq-answer-${i}`}
            >
              {q}
              <i
                className={`fa-solid fa-chevron-down ${openFAQ === i ? "rotate" : ""}`}
                aria-hidden="true"
              />
            </h3>
            <div
              id={`faq-answer-${i}`}
              className={`faq-answer-wrap ${openFAQ === i ? "open" : ""}`}
              aria-hidden={openFAQ !== i}
            >
              <div className="faq-answer-inner">
                <p>{a}</p>
              </div>
            </div>
          </div>
        ))}

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
