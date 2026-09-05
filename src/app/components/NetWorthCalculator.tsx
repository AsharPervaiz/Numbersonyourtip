"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

/* ─────────────────────────────────────────
   Types
───────────────────────────────────────── */
interface NWResult {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
}

/* ─────────────────────────────────────────
   Pure helper
───────────────────────────────────────── */
function needleDeg(ratio: number): number {
  const clamped = Math.min(Math.max(ratio, 0), 1);
  return -90 + clamped * 180;
}

/* ─────────────────────────────────────────
   NetWorthResultPanel
───────────────────────────────────────── */
function NetWorthResultPanel({ result }: { result: NWResult | null }) {
  if (!result) {
    return (
      <div className="cr-panel-placeholder">
        <div className="cr-ph-icon">
          <i className="fa-solid fa-scale-balanced" aria-hidden="true" />
        </div>
        Enter your assets and liabilities to see your net worth here.
      </div>
    );
  }
  const { totalAssets, totalLiabilities, netWorth } = result;
  const fmt = (n: number) =>
    n.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  const debtRatioPct =
    totalAssets > 0
      ? (totalLiabilities / totalAssets) * 100
      : totalLiabilities > 0
        ? 150
        : 0;
  const scaleMax = 150;
  const ratio = Math.min(debtRatioPct / scaleMax, 1);
  const barPct = 2 + ratio * 96;
  const healthLabel =
    debtRatioPct === 0
      ? "Debt-free"
      : debtRatioPct <= 30
        ? "Healthy"
        : debtRatioPct <= 60
          ? "Moderate debt"
          : debtRatioPct <= 100
            ? "High debt"
            : "Negative NW";
  const healthBadge =
    debtRatioPct === 0
      ? "good"
      : debtRatioPct <= 30
        ? "good"
        : debtRatioPct <= 60
          ? "normal"
          : debtRatioPct <= 100
            ? "warning"
            : "danger";
  const assetBarMax = Math.max(totalAssets, totalLiabilities, 1);

  return (
    <div className="cr-panel">
      <div className="cr-gauge-wrap">
        <svg
          className="cr-gauge-svg"
          width="100"
          height="60"
          viewBox="0 0 120 70"
          role="img"
          aria-label={`Net worth gauge: debt ratio ${debtRatioPct.toFixed(0)}%`}
        >
          <defs>
            <clipPath id="nw-half">
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
            clipPath="url(#nw-half)"
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
            clipPath="url(#nw-half)"
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
            clipPath="url(#nw-half)"
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
            clipPath="url(#nw-half)"
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
          <div
            className="cr-score"
            style={{ fontSize: netWorth < 0 ? "28px" : "22px" }}
          >
            {netWorth < 0 ? "-" : ""}
            {fmt(Math.abs(netWorth))}
          </div>
          <div className="cr-score-label">net worth</div>
          <span className={`cr-badge ${healthBadge}`}>{healthLabel}</span>
        </div>
      </div>
      <hr className="cr-divider" />
      <div>
        <div className="cr-bar-label">
          debt-to-asset ratio — {debtRatioPct.toFixed(1)}%
          {debtRatioPct <= 100
            ? " (lower is healthier)"
            : " (liabilities exceed assets)"}
        </div>
        <div
          className="cr-bar-track"
          style={{
            background:
              "linear-gradient(to right, #97C459 0%, #C0DD97 20%, #FAC775 55%, #F09595 100%)",
          }}
        >
          <div className="cr-bar-thumb" style={{ left: `${barPct}%` }} />
        </div>
        <div className="cr-bar-ticks">
          <span>0%</span>
          <span>30%</span>
          <span>60%</span>
          <span>100%</span>
          <span>150%</span>
        </div>
      </div>
      <hr className="cr-divider" />
      <div className="cr-metrics-grid">
        <div className="cr-metric-card">
          <div className="cr-m-label">Total assets</div>
          <div className="cr-m-value" style={{ fontSize: "14px" }}>
            {fmt(totalAssets)}
          </div>
          <div className="cr-m-sub">everything you own</div>
        </div>
        <div className="cr-metric-card">
          <div className="cr-m-label">Total liabilities</div>
          <div className="cr-m-value" style={{ fontSize: "14px" }}>
            {fmt(totalLiabilities)}
          </div>
          <div className="cr-m-sub">everything you owe</div>
        </div>
        <div className="cr-metric-card">
          <div className="cr-m-label">Debt ratio</div>
          <div className="cr-m-value">{debtRatioPct.toFixed(1)}%</div>
          <div className="cr-m-sub">liabilities ÷ assets</div>
        </div>
        <div className="cr-metric-card">
          <div className="cr-m-label">Net worth</div>
          <div
            className="cr-m-value"
            style={{
              fontSize: "14px",
              color: netWorth >= 0 ? "#3B6D11" : "#A32D2D",
            }}
          >
            {netWorth < 0 ? "-" : ""}
            {fmt(Math.abs(netWorth))}
          </div>
          <div className="cr-m-sub">assets minus liabilities</div>
        </div>
      </div>
      <hr className="cr-divider" />
      <div>
        <div className="cr-world-title">assets vs. liabilities</div>
        <div className="cr-world-bar-row">
          <span className="cr-w-label">Assets</span>
          <div className="cr-world-track">
            <div
              className="cr-world-fill"
              style={{
                width: `${Math.min((totalAssets / assetBarMax) * 100, 100)}%`,
                background: "#97C459",
              }}
            />
          </div>
          <span
            className="cr-w-pct"
            style={{ width: "55px", fontSize: "10px" }}
          >
            {fmt(totalAssets)}
          </span>
        </div>
        <div className="cr-world-bar-row">
          <span className="cr-w-label">Liabilities</span>
          <div className="cr-world-track">
            <div
              className="cr-world-fill"
              style={{
                width: `${Math.min((totalLiabilities / assetBarMax) * 100, 100)}%`,
                background: "#F09595",
              }}
            />
          </div>
          <span
            className="cr-w-pct"
            style={{ width: "55px", fontSize: "10px" }}
          >
            {fmt(totalLiabilities)}
          </span>
        </div>
        <p className="cr-world-note">
          {netWorth >= 0
            ? `Your assets exceed your liabilities by ${fmt(netWorth)}.`
            : `Your liabilities exceed your assets by ${fmt(Math.abs(netWorth))}.`}
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Main Calculator Page
───────────────────────────────────────── */
const FAQ_DATA: [string, string][] = [
  [
    "How do I calculate my net worth?",
    "Add up everything you own at what it would realistically sell for today, add up everything you owe in full, and subtract the second from the first. The subtraction is the easy part — what decides whether the figure means anything is which items you include, what value you assign them, and whether the liability list is complete rather than selective.",
  ],
  [
    "Should I include my house in my net worth?",
    "Yes, at a realistic sale value, with the outstanding mortgage listed as a liability against it. The common objection is that you have to live somewhere so the equity is not spendable, which is fair — but the answer to that is to also track net worth excluding your home, not to leave the largest asset most people own out of the calculation entirely.",
  ],
  [
    "Does my pension count towards net worth?",
    "Yes. It is money you own, and excluding it makes years of long-term saving invisible in the one measure designed to capture exactly that. Being unable to access it for years is a liquidity question rather than an ownership one, which is what the separate liquid net worth figure is for.",
  ],
  [
    "What value should I use for my car?",
    "What it would sell for now, re-checked each time you update the figure. A vehicle carried at its purchase price is the single most common cause of an inflated net worth, because it depreciates every month while the spreadsheet stays where it was. The same principle applies to investments: current market value, never what you paid.",
  ],
  [
    "Which debts do people forget to include?",
    "Tax reserved but not yet paid, credit card balances they intend to clear this month, buy-now-pay-later and instalment plans, and money owed informally to family. Also common is listing the monthly mortgage payment instead of the outstanding balance — the payment is a cash flow, the balance is the liability.",
  ],
  [
    "Should I count my furniture and belongings?",
    "Generally no. Ordinary possessions would fetch very little in an actual sale, and valuing them at replacement cost inflates the total with money you could never realise. Include only items you would genuinely list and sell — a second vehicle, valuable equipment, or a collection with an established market.",
  ],
  [
    "What is liquid net worth and why track it separately?",
    "It counts only what could become cash quickly without a forced sale, minus short-term debts. Someone with 400,000 of net worth held almost entirely in a house and a pension may have very little liquid net worth. The total tells you whether you are building wealth; the liquid figure tells you whether you could absorb a job loss or a large bill without dismantling it.",
  ],
  [
    "How often should I calculate it?",
    "Quarterly or twice a year for most people, and annually if your position is stable. Monthly tracking mostly records market movement and rounding in your own valuation guesses, which is noise rather than information. Whatever interval you choose, keep the valuation method identical between periods — changing how you value the house produces a change that reflects nothing you did.",
  ],
  [
    "Does paying off debt increase net worth as much as saving?",
    "Exactly as much. Using 1,000 to reduce a debt lowers your liabilities by 1,000; putting 1,000 into savings raises your assets by the same. Both move net worth by the identical amount, which is why net worth is a better measure of financial progress than income or savings alone — it is the only single number that captures saving, investing and debt repayment together.",
  ],
];

export default function NetWorthCalculator() {
  const [cashSavings, setCashSavings] = useState("");
  const [investments, setInvestments] = useState("");
  const [realEstate, setRealEstate] = useState("");
  const [vehicles, setVehicles] = useState("");
  const [retirement, setRetirement] = useState("");
  const [otherAssets, setOtherAssets] = useState("");
  const [mortgage, setMortgage] = useState("");
  const [carLoan, setCarLoan] = useState("");
  const [studentLoan, setStudentLoan] = useState("");
  const [creditCard, setCreditCard] = useState("");
  const [personalLoan, setPersonalLoan] = useState("");
  const [otherDebts, setOtherDebts] = useState("");
  const [result, setResult] = useState<{
    totalAssets: number;
    totalLiabilities: number;
    netWorth: number;
  } | null>(null);
  const [panelResult, setPanelResult] = useState<NWResult | null>(null);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const addCommas = (val: string): string => {
    const cleaned = val.replace(/[^0-9.]/g, "");
    const parts = cleaned.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.length > 1 ? parts[0] + "." + parts[1] : parts[0];
  };
  const handleChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(addCommas(e.target.value));
    };
  const toNum = (val: string) => {
    const stripped = val.replace(/,/g, "");
    return stripped === "" ? 0 : Number(stripped);
  };

  const calculateNetWorth = () => {
    const totalAssets =
      toNum(cashSavings) +
      toNum(investments) +
      toNum(realEstate) +
      toNum(vehicles) +
      toNum(retirement) +
      toNum(otherAssets);
    const totalLiabilities =
      toNum(mortgage) +
      toNum(carLoan) +
      toNum(studentLoan) +
      toNum(creditCard) +
      toNum(personalLoan) +
      toNum(otherDebts);
    setResult({
      totalAssets,
      totalLiabilities,
      netWorth: totalAssets - totalLiabilities,
    });
  };

  useEffect(() => {
    const totalAssets =
      toNum(cashSavings) +
      toNum(investments) +
      toNum(realEstate) +
      toNum(vehicles) +
      toNum(retirement) +
      toNum(otherAssets);
    const totalLiabilities =
      toNum(mortgage) +
      toNum(carLoan) +
      toNum(studentLoan) +
      toNum(creditCard) +
      toNum(personalLoan) +
      toNum(otherDebts);
    if (totalAssets === 0 && totalLiabilities === 0) {
      setPanelResult(null);
      return;
    }
    setPanelResult({
      totalAssets,
      totalLiabilities,
      netWorth: totalAssets - totalLiabilities,
    });
  }, [
    cashSavings,
    investments,
    realEstate,
    vehicles,
    retirement,
    otherAssets,
    mortgage,
    carLoan,
    studentLoan,
    creditCard,
    personalLoan,
    otherDebts,
  ]);

  const handleClear = () => {
    setCashSavings("");
    setInvestments("");
    setRealEstate("");
    setVehicles("");
    setRetirement("");
    setOtherAssets("");
    setMortgage("");
    setCarLoan("");
    setStudentLoan("");
    setCreditCard("");
    setPersonalLoan("");
    setOtherDebts("");
    setResult(null);
    setPanelResult(null);
  };
  const fmt = (n: number) =>
    n.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

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
        <h1>Net Worth Calculator — What to Count and What to Leave Out</h1>
        <p>
          Calculate your total net worth instantly by entering your assets and
          liabilities below.
        </p>

        <div className="calc-card single-calc">
          <h3 style={{ marginBottom: "8px", marginTop: "4px", color: "white" }}>
            Assets
          </h3>
          <input
            className="calc-input"
            type="text"
            inputMode="decimal"
            placeholder="Cash & Savings"
            value={cashSavings}
            onChange={handleChange(setCashSavings)}
          />
          <input
            className="calc-input"
            type="text"
            inputMode="decimal"
            placeholder="Investments (Stocks, Mutual Funds, Crypto)"
            value={investments}
            onChange={handleChange(setInvestments)}
          />
          <input
            className="calc-input"
            type="text"
            inputMode="decimal"
            placeholder="Real Estate Value"
            value={realEstate}
            onChange={handleChange(setRealEstate)}
          />
          <input
            className="calc-input"
            type="text"
            inputMode="decimal"
            placeholder="Vehicles (Car, Bike, etc.)"
            value={vehicles}
            onChange={handleChange(setVehicles)}
          />
          <input
            className="calc-input"
            type="text"
            inputMode="decimal"
            placeholder="Retirement / Pension Savings"
            value={retirement}
            onChange={handleChange(setRetirement)}
          />
          <input
            className="calc-input"
            type="text"
            inputMode="decimal"
            placeholder="Other Assets (Jewelry, Business, etc.)"
            value={otherAssets}
            onChange={handleChange(setOtherAssets)}
          />
          <h3
            style={{ marginBottom: "8px", marginTop: "16px", color: "white" }}
          >
            Liabilities
          </h3>
          <input
            className="calc-input"
            type="text"
            inputMode="decimal"
            placeholder="Mortgage / Home Loan Balance"
            value={mortgage}
            onChange={handleChange(setMortgage)}
          />
          <input
            className="calc-input"
            type="text"
            inputMode="decimal"
            placeholder="Car Loan Balance"
            value={carLoan}
            onChange={handleChange(setCarLoan)}
          />
          <input
            className="calc-input"
            type="text"
            inputMode="decimal"
            placeholder="Student / Education Loan Balance"
            value={studentLoan}
            onChange={handleChange(setStudentLoan)}
          />
          <input
            className="calc-input"
            type="text"
            inputMode="decimal"
            placeholder="Credit Card Debt"
            value={creditCard}
            onChange={handleChange(setCreditCard)}
          />
          <input
            className="calc-input"
            type="text"
            inputMode="decimal"
            placeholder="Personal Loan Balance"
            value={personalLoan}
            onChange={handleChange(setPersonalLoan)}
          />
          <input
            className="calc-input"
            type="text"
            inputMode="decimal"
            placeholder="Other Debts / Liabilities"
            value={otherDebts}
            onChange={handleChange(setOtherDebts)}
          />
          <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
            <button className="calc-button" onClick={calculateNetWorth}>
              Calculate
            </button>
            <button className="calc-button calc-clear" onClick={handleClear}>
              Clear
            </button>
          </div>
        </div>

        <div className="cr-mobile-slot">
          <NetWorthResultPanel result={panelResult} />
        </div>

        {/* ---- SEO CONTENT ---- */}

        <h2>The Formula Is Trivial. The Inputs Are the Whole Problem.</h2>
        <pre>Net worth = Everything you own − Everything you owe</pre>
        <p>
          Nobody gets that subtraction wrong. What makes one person&apos;s net
          worth figure useful and another&apos;s meaningless is the decisions
          made before the subtraction: which items to include, what value to put
          on them, and which debts get quietly left off the list.
        </p>
        <p>
          The whole of this page is about those decisions, because they are what
          the calculation actually consists of.
        </p>

        <h2>What Value Do You Put on Things You Own?</h2>
        <p>
          The rule that keeps the figure honest is to value everything at what
          you could realistically sell it for today, not what you paid and not
          what you feel it is worth.
        </p>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Asset</th>
                <th>Value it at</th>
                <th>The mistake to avoid</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Cash and savings</td>
                <td>The balance</td>
                <td>None — this is the only unambiguous line</td>
              </tr>
              <tr>
                <td>Investments</td>
                <td>Current market value</td>
                <td>Using the price you bought at</td>
              </tr>
              <tr>
                <td>Property</td>
                <td>A realistic sale price today</td>
                <td>
                  Using an optimistic listing price, or the purchase price from
                  years ago
                </td>
              </tr>
              <tr>
                <td>Vehicles</td>
                <td>Trade or private sale value now</td>
                <td>
                  Carrying it at purchase price while it depreciates every month
                </td>
              </tr>
              <tr>
                <td>Pensions</td>
                <td>Current fund value on the statement</td>
                <td>Omitting it because it is not accessible yet</td>
              </tr>
              <tr>
                <td>Possessions</td>
                <td>
                  Usually nothing, unless individually valuable and genuinely
                  saleable
                </td>
                <td>
                  Adding up furniture and clothes to inflate the total
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          The last row is where people most often flatter themselves. A house
          full of belongings might fetch very little in a hurried sale, and
          counting it at replacement cost produces a number that cannot survive
          contact with reality. Leave ordinary possessions out entirely and
          include only items you would genuinely list and sell — a second
          vehicle, valuable equipment, a collection with an established market.
        </p>

        <h2>The Debts People Forget</h2>
        <p>
          Assets get counted enthusiastically and liabilities get counted
          selectively. A complete list includes several things that do not feel
          like debt.
        </p>
        <ul className="custom-list">
          <li>
            <strong>The full mortgage balance</strong>, not the monthly payment.
            The payment is a cash flow; the balance is the liability.
          </li>
          <li>
            <strong>Tax owed but not yet paid.</strong> Self-employed people
            holding a reserve for a future bill are holding someone else&apos;s
            money in their own account. It is an asset and a liability
            simultaneously, and netting to zero is the correct treatment.
          </li>
          <li>
            <strong>Credit card balances in full</strong>, including amounts you
            intend to clear this month. Money already spent is owed regardless
            of when the statement arrives.
          </li>
          <li>
            <strong>Student loans</strong>, on whatever terms they carry. Where
            repayment is income-contingent and the balance may eventually be
            written off, some people exclude it — that is defensible, but the
            treatment should be recorded and kept consistent between periods.
          </li>
          <li>
            <strong>Buy-now-pay-later and instalment plans.</strong> Small
            individually and frequently invisible in aggregate.
          </li>
          <li>
            <strong>Money owed to family.</strong> Informal, undocumented, and
            still owed.
          </li>
        </ul>

        <h2>The Four Items People Argue About</h2>
        <p>
          Most disagreements about net worth come down to the same handful of
          items. There is a defensible answer to each.
        </p>
        <p>
          <strong>Your home.</strong> Count it, at a realistic sale value, with
          the mortgage as a liability against it. The objection — that you have
          to live somewhere, so you cannot spend it — is fair, and it is an
          argument for also tracking net worth excluding the home rather than
          for pretending the asset does not exist.
        </p>
        <p>
          <strong>Your pension.</strong> Count it. It is money you own, and
          leaving it out makes long-term saving invisible in the one measure
          designed to capture it. That it is inaccessible for years is a
          liquidity question, not an ownership one.
        </p>
        <p>
          <strong>Your car.</strong> Count it, and re-value it honestly each
          time. A vehicle carried at purchase price is the most common single
          source of an inflated net worth figure, since it declines every month
          while the spreadsheet does not.
        </p>
        <p>
          <strong>Volatile holdings.</strong> Count them at today&apos;s market
          value, accepting that this makes the total move with the market.
          Choosing a favourable historic price instead means the figure is no
          longer measuring anything.
        </p>

        <h2>Liquid Net Worth Is the More Revealing Number</h2>
        <p>
          The headline figure counts everything you own. Liquid net worth counts
          only what could become cash quickly without a forced sale.
        </p>
        <pre>
          Liquid net worth = Cash, savings and readily sellable investments −
          Short-term debts
        </pre>
        <p>
          Someone with 400,000 of net worth held almost entirely in a house and
          a pension may have very little liquid net worth. That is not a problem
          in itself, but it describes a specific vulnerability: a job loss or a
          large unexpected cost has to be met from a small pool, and the only
          alternatives are borrowing or selling something slowly.
        </p>
        <p>
          Tracking both numbers tells you two different things. The total says
          whether you are building wealth. The liquid figure says whether you
          could absorb a shock without dismantling what you have built.
        </p>

        <h2>What the Number Is Actually For</h2>
        <p>
          A single net worth figure in isolation says almost nothing. Compared
          against your own previous figures it becomes the clearest measure of
          financial progress available, because it is the only one that captures
          saving, investing, and debt repayment in a single number.
        </p>
        <p>
          Income does not do this — a high earner spending everything shows no
          progress at all. Savings alone do not either, since money moved into a
          savings account while a credit card balance grows is not progress.
          Paying down debt increases net worth exactly as much as saving the
          same amount, which is why it belongs in the same measure.
        </p>
        <p>
          One caveat about frequency. Calculating monthly mostly records market
          movement and rounds in valuation guesses, which is noise rather than
          information. Quarterly or twice a year is often enough to show the
          trend, and once a year is enough if your position is stable. Whatever
          interval you pick, keep the valuation method the same each time —
          changing how you value the house between periods produces a change in
          net worth that reflects nothing you did.
        </p>

        <h2>Couples and Joint Finances</h2>
        <p>
          For a household, the practical approach is to keep three columns:
          each person&apos;s individual position and the joint one. Joint assets
          and joint debts sit in the middle column, and the household total is
          the sum.
        </p>
        <p>
          Keeping individual figures visible rather than merging everything is
          worth the small extra effort. It shows who is carrying which debts,
          makes an imbalance in pension savings obvious while there is still
          time to address it, and means neither person loses sight of their own
          position. Merging into one number is simpler and hides all three
          things.
        </p>
        <p>
          For the components that feed this calculation, our{" "}
          <Link href="/loan-calculator/" className="my-link">
            loan calculator
          </Link>{" "}
          and{" "}
          <Link href="/home-mortgage-calculator/" className="my-link">
            mortgage calculator
          </Link>{" "}
          project outstanding balances forward, and the guide on{" "}
          <Link href="/blog/how-do-i-calculate-my-net-worth/" className="my-link">
            calculating your net worth
          </Link>{" "}
          works through a full example line by line.
        </p>
        <h2>Net Worth Questions</h2>

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
          <NetWorthResultPanel result={panelResult} />
        </div>
        <div className="sidebar-box">
          <p style={{ fontSize: "20px", fontWeight: 600 }}>
            Related Calculators
          </p>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {[
              ["/emi-calculator/", "EMI Calculator"],
              ["/loan-calculator/", "Loan Calculator"],
              ["/home-mortgage-calculator/", "Home Mortgage Calculator"],
              ["/income-tax-calculator/", "Income Tax Calculator"],
              ["/rent-calculator/", "Rent Calculator"],
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
