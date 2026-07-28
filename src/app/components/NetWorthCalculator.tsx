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
      <div className="single-page-padding">
        <h1>Free Net Worth Calculator Online - Assets Minus Liabilities</h1>
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

        <h2>What Is Net Worth?</h2>
        <p>
          Net worth is the total value of everything you own minus everything
          you owe. It is the single most important number in personal finance
          because it captures your complete financial picture in one figure —
          not just how much you earn, but how much you have actually accumulated
          after debts. A positive net worth means your assets exceed your
          liabilities, while a negative net worth means you currently owe more
          than you own.
        </p>
        <p>
          This free net worth calculator with assets and liabilities does the
          math instantly. Enter what you own (cash, investments, property,
          vehicles, retirement savings) and what you owe (mortgage, car loan,
          student loan, credit card debt, personal loans), and the calculator
          shows your total net worth, debt-to-asset ratio, and a visual
          breakdown of where you stand.
        </p>

        <h2>How to Calculate Net Worth — The Formula</h2>
        <p>
          The net worth formula is one of the simplest and most powerful
          equations in personal finance:
        </p>
        <pre>Net Worth = Total Assets − Total Liabilities</pre>
        <p>
          That is it — assets minus liabilities. Every asset adds to your net
          worth, every liability subtracts from it. This calculator functions as
          an assets minus liabilities calculator that handles the arithmetic,
          comma formatting, and visual breakdown for you. Just fill in the
          fields and click Calculate.
        </p>
        <p>
          If you have active loans, knowing exactly what you owe each month
          matters. Our{" "}
          <Link href="/emi-calculator/" className="my-link">
            EMI calculator
          </Link>{" "}
          shows your monthly installment for any loan, and our{" "}
          <Link href="/loan-calculator/" className="my-link">
            loan calculator
          </Link>{" "}
          breaks down total interest over the full term — both directly affect
          the liability side of your net worth.
        </p>

        <h2>What Counts as an Asset?</h2>
        <p>
          An asset is anything with monetary value that belongs to you. This
          calculator covers the six most common categories:
        </p>
        <ul className="custom-list">
          <li>
            <strong>Cash and savings</strong> — bank account balances, fixed
            deposits, emergency fund, cash on hand.
          </li>
          <li>
            <strong>Investments</strong> — stocks, mutual funds, ETFs, bonds,
            cryptocurrency, gold holdings.
          </li>
          <li>
            <strong>Real estate</strong> — current market value of any property
            you own (your home, rental properties, land). Use our{" "}
            <Link href="/home-mortgage-calculator/" className="my-link">
              home mortgage calculator
            </Link>{" "}
            to see how your mortgage payments are building equity in this asset
            over time.
          </li>
          <li>
            <strong>Vehicles</strong> — current resale value of cars,
            motorcycles, boats. Remember vehicles depreciate — enter what they
            are worth today, not what you paid.
          </li>
          <li>
            <strong>Retirement savings</strong> — pension funds, provident fund,
            401(k), IRA, or any retirement-designated accounts.
          </li>
          <li>
            <strong>Other assets</strong> — jewelry, art, collectibles, business
            ownership value, intellectual property, or any other items with
            significant resale value.
          </li>
        </ul>

        <h2>What Counts as a Liability?</h2>
        <p>
          A liability is any debt or financial obligation you are responsible
          for paying. Common liabilities include:
        </p>
        <ul className="custom-list">
          <li>
            <strong>Mortgage balance</strong> — the remaining amount owed on
            your home loan. This is typically the largest single liability for
            homeowners.
          </li>
          <li>
            <strong>Car loan</strong> — outstanding balance on vehicle
            financing.
          </li>
          <li>
            <strong>Student / education loans</strong> — remaining balance on
            any education-related borrowing.
          </li>
          <li>
            <strong>Credit card debt</strong> — total outstanding balances
            across all credit cards. This is often the highest-interest debt and
            should be prioritized for payoff.
          </li>
          <li>
            <strong>Personal loans</strong> — any unsecured loans from banks or
            lenders.
          </li>
          <li>
            <strong>Other debts</strong> — medical bills, tax liabilities, money
            owed to individuals, or any other financial obligations.
          </li>
        </ul>
        <p>
          Understanding how much each debt costs you monthly helps you plan
          payoff strategies. Our{" "}
          <Link href="/emi-calculator/" className="my-link">
            EMI calculator
          </Link>{" "}
          computes the exact monthly payment for any loan amount and interest
          rate, and our{" "}
          <Link href="/income-tax-calculator/" className="my-link">
            income tax calculator
          </Link>{" "}
          shows how much of your salary actually reaches your bank account after
          tax deductions — important context for how quickly you can pay down
          liabilities.
        </p>

        <h2>Total Net Worth vs. Liquid Net Worth</h2>
        <p>
          Your total net worth includes everything — illiquid assets like real
          estate and retirement accounts that you cannot convert to cash
          overnight. Your liquid net worth includes only assets you can access
          quickly: cash, savings, and easily sellable investments.
        </p>
        <p>
          To estimate your liquid net worth using this calculator, simply leave
          the real estate, vehicles, retirement, and other illiquid asset fields
          empty — enter only your cash, savings, and liquid investments. The
          result is your liquid net worth, which tells you how much financial
          flexibility you have right now without selling property or touching
          retirement accounts. This is essentially a liquid net worth calculator
          when used this way.
        </p>

        <h2>What Should My Net Worth Be at My Age?</h2>
        <p>
          One of the most searched financial questions is "what should my net
          worth be at 30?" or "am I rich for my age?" While there is no single
          correct answer — it depends on your income, cost of living, and
          financial goals — widely cited benchmarks can serve as rough
          guideposts:
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
                  Age
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Net Worth Target
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  What It Means
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                [
                  "25",
                  "0.5× annual salary",
                  "Building foundations — student loans may keep this low",
                ],
                [
                  "30",
                  "1× annual salary",
                  "First major milestone — savings and investments growing",
                ],
                [
                  "35",
                  "2× annual salary",
                  "Compounding kicks in — home equity may contribute",
                ],
                [
                  "40",
                  "3× annual salary",
                  "Mid-career accumulation — retirement savings maturing",
                ],
                [
                  "45",
                  "4× annual salary",
                  "Strong position — investments driving growth",
                ],
                [
                  "50",
                  "6× annual salary",
                  "Pre-retirement buildup — debt should be declining",
                ],
                [
                  "55",
                  "7× annual salary",
                  "Approaching retirement — focus shifts to preservation",
                ],
                [
                  "60",
                  "8–10× annual salary",
                  "Retirement-ready — assets should fund decades of living",
                ],
              ].map(([age, target, meaning], i) => (
                <tr key={i}>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {age}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {target}
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
          These benchmarks are guidelines, not rules. A 30-year-old doctor with
          significant student debt may have a negative net worth despite a high
          income — and that is perfectly normal given the career trajectory.
          What matters most is that your net worth trends upward consistently
          year over year. Use this calculator as a net worth percentile by age
          reference point, but focus on your own trajectory rather than
          comparing to averages.
        </p>

        <h2>Net Worth Calculator for Couples</h2>
        <p>
          If you are calculating net worth as a couple, add both partners'
          assets and liabilities into the same calculation. Include jointly held
          assets (shared savings, co-owned property) as well as individually
          held ones (personal investments, individual retirement accounts). On
          the liability side, include all debts regardless of whose name they
          are in — a couple's combined net worth reflects the household's true
          financial position.
        </p>
        <p>
          For couples weighing the rent-vs-buy decision, our{" "}
          <Link href="/rent-calculator/" className="my-link">
            rent calculator
          </Link>{" "}
          shows how much of your combined income should go to housing, and our{" "}
          <Link href="/home-mortgage-calculator/" className="my-link">
            home mortgage calculator
          </Link>{" "}
          reveals what a mortgage payment would look like — both directly inform
          whether buying a home (adding a real estate asset and a mortgage
          liability) improves your combined net worth over time.
        </p>

        <h2>Key Factors That Affect Your Net Worth</h2>

        <h3>Savings Rate</h3>
        <p>
          The more you save each month, the faster your cash and investments
          grow. Even saving a small percentage of your income consistently can
          make a significant difference over years. Knowing your after-tax
          income is the starting point — our{" "}
          <Link href="/income-tax-calculator/" className="my-link">
            income tax calculator
          </Link>{" "}
          shows exactly how much reaches your bank account after deductions.
        </p>

        <h3>Investment Growth</h3>
        <p>
          Money invested in stocks, mutual funds, real estate, or retirement
          accounts grows through returns and compounding. Investment portfolios
          are often the biggest driver of net worth growth for long-term savers.
          The difference between saving in a bank account (2–4% interest) and
          investing in a diversified portfolio (7–10% historical average)
          compounds dramatically over decades.
        </p>

        <h3>Debt Management</h3>
        <p>
          High-interest debts like credit cards reduce your net worth quickly.
          Paying off debts aggressively — especially high-interest ones first —
          directly increases your net worth dollar for dollar. Use our{" "}
          <Link href="/loan-calculator/" className="my-link">
            loan calculator
          </Link>{" "}
          to see the total interest cost of each debt and prioritize
          accordingly.
        </p>

        <h3>Real Estate Equity</h3>
        <p>
          Property appreciates over time in most markets. Owning a home or
          investment property is a common way people build significant net
          worth, especially when the mortgage balance is being paid down
          simultaneously. Every mortgage payment that reduces principal is
          effectively converting a liability into equity — an asset.
        </p>

        <h2>Tips to Increase Your Net Worth</h2>
        <ul className="custom-list">
          <li>
            <strong>Pay off high-interest credit card debt first</strong> —
            credit card interest rates of 18–30% destroy net worth faster than
            almost any investment can build it.
          </li>
          <li>
            <strong>Increase your savings rate</strong> — even 1–2% more of your
            income per month compounds significantly over years.
          </li>
          <li>
            <strong>Invest consistently</strong> — regular contributions to
            diversified investments (index funds, retirement accounts) benefit
            from compounding and dollar-cost averaging.
          </li>
          <li>
            <strong>Avoid financing depreciating assets</strong> — taking a loan
            for a car or electronics means paying interest on something that
            loses value. Use our{" "}
            <Link href="/emi-calculator/" className="my-link">
              EMI calculator
            </Link>{" "}
            to see the real cost before borrowing.
          </li>
          <li>
            <strong>Build an emergency fund</strong> — 3 to 6 months of expenses
            in liquid savings prevents you from going deeper into debt during
            setbacks.
          </li>
          <li>
            <strong>Renegotiate loan interest rates</strong> — refinancing a
            mortgage or consolidating high-interest debt at a lower rate saves
            money that goes directly to net worth growth.
          </li>
          <li>
            <strong>Invest in your income</strong> — skills, certifications, and
            career moves that increase your earning power accelerate every other
            strategy on this list.
          </li>
          <li>
            <strong>Track quarterly</strong> — recalculate your net worth every
            3 months using this calculator to see if the trend is moving in the
            right direction.
          </li>
        </ul>

        <h2>How to Use This Net Worth Calculator</h2>
        <ul className="custom-list">
          <li>
            <strong>Step 1:</strong> Enter the current value of each asset
            category — cash, investments, real estate, vehicles, retirement
            savings, and anything else of value.
          </li>
          <li>
            <strong>Step 2:</strong> Enter the outstanding balance of each
            liability — mortgage, car loan, student loan, credit card debt,
            personal loans, and any other debts.
          </li>
          <li>
            <strong>Step 3:</strong> Click Calculate to see your total assets,
            total liabilities, net worth, and debt-to-asset ratio with a visual
            gauge and comparison bars.
          </li>
          <li>
            <strong>Step 4:</strong> Experiment — try zeroing out a specific
            debt to see how paying it off would change your net worth and debt
            ratio.
          </li>
        </ul>

        <h2>Why You Should Track Your Net Worth Regularly</h2>
        <p>
          Calculating your net worth once a year — or even quarterly — gives you
          a clear picture of your financial health that income alone cannot
          provide. Two people earning the same salary can have wildly different
          net worths depending on their saving, investing, and borrowing habits.
          Tracking net worth helps you spot where money is being lost to debt,
          identify which assets are growing, and make better decisions about
          spending, saving, and investing. Many people who start tracking their
          net worth report it motivates them to save more and pay down debt
          faster because the number makes progress tangible.
        </p>

        <h2>Frequently Asked Questions</h2>

        {[
          [
            "What is the net worth formula?",
            "Net Worth = Total Assets − Total Liabilities. Add up the value of everything you own, subtract everything you owe, and the result is your net worth. This calculator handles the math automatically — just enter your values and click Calculate.",
          ],
          [
            "Is it bad to have a negative net worth?",
            "A negative net worth means your debts currently exceed your assets. This is common early in life, especially after taking student loans or a mortgage. What matters most is that your net worth improves over time. If it is trending upward quarter over quarter, you are on the right track regardless of the current number.",
          ],
          [
            "Should I include my home in my net worth?",
            "Yes. Your home's current market value counts as an asset, and the remaining mortgage balance counts as a liability. The difference between the two — your home equity — contributes positively to your net worth. This is often the single largest asset for homeowners.",
          ],
          [
            "What should my net worth be at 30?",
            "A widely cited guideline suggests your net worth should roughly equal your annual salary by age 30. If you earn 60,000 per year, a net worth of 60,000 at 30 would put you on track. However, this varies greatly by profession, location, and debt load — a doctor or lawyer with large student loans may be negative at 30 despite high earning potential.",
          ],
          [
            "What is the difference between net worth and liquid net worth?",
            "Total net worth includes all assets — including illiquid ones like real estate, vehicles, and retirement accounts you cannot access immediately. Liquid net worth includes only cash, savings, and easily sellable investments. To calculate liquid net worth with this tool, leave the real estate, vehicles, retirement, and other illiquid fields empty.",
          ],
          [
            "How do I calculate net worth as a couple?",
            "Enter both partners' assets and liabilities into the same calculation. Include jointly held assets (shared bank accounts, co-owned property) and individually held ones (personal investments, retirement accounts). Include all debts from both partners to get the household's true combined net worth.",
          ],
          [
            "How often should I calculate my net worth?",
            "At minimum once a year. Quarterly tracking gives better insight and helps you make timely adjustments. Avoid checking monthly — net worth moves slowly and monthly fluctuations (especially in investment values) can be misleading.",
          ],
          [
            "Do retirement savings count toward net worth?",
            "Yes. Retirement accounts like pension funds, provident fund balances, 401(k), IRA, and any other retirement-designated investments all count as assets in your net worth calculation, even though you cannot access them without penalties before retirement age.",
          ],
          [
            "Am I rich? How do I know if my net worth is good for my age?",
            "Compare your net worth to the age-based benchmarks in the table above. Generally, having a net worth equal to 1× your annual salary at 30, 3× at 40, and 6× at 50 puts you in a strong position. But 'rich' is relative — focus on consistent growth and financial security rather than hitting an arbitrary number.",
          ],
          [
            "Is this net worth calculator free to use?",
            "Yes — completely free with no sign-up, no download, and no usage limits. Enter your assets and liabilities, click Calculate, and see your complete net worth breakdown instantly. Works on mobile and desktop.",
          ],
        ].map(([q, a], i) => (
          <div className="faq-item" key={i}>
            <h3 onClick={() => toggleFAQ(i)}>
              {q}
              <i
                className={`fa-solid fa-chevron-down ${openFAQ === i ? "rotate" : ""}`}
              ></i>
            </h3>
            {openFAQ === i && <p>{a}</p>}
          </div>
        ))}

        <h2>Final Thoughts</h2>
        <p>
          Your net worth is the truest measure of your financial progress — not
          your salary, not your job title, not your lifestyle. Two people
          earning the same income can have a 10× difference in net worth
          depending on how they save, invest, and manage debt. Use this free net
          worth calculator to see exactly where you stand today, then come back
          quarterly to track how the number moves.
        </p>
        <p>
          To manage the liabilities side, our{" "}
          <Link href="/emi-calculator/" className="my-link">
            EMI calculator
          </Link>{" "}
          and{" "}
          <Link href="/loan-calculator/" className="my-link">
            loan calculator
          </Link>{" "}
          show what your debts actually cost. For the income side, our{" "}
          <Link href="/income-tax-calculator/" className="my-link">
            income tax calculator
          </Link>{" "}
          reveals your real take-home pay. And for housing decisions that affect
          both sides of the equation, our{" "}
          <Link href="/home-mortgage-calculator/" className="my-link">
            home mortgage calculator
          </Link>{" "}
          and{" "}
          <Link href="/rent-calculator/" className="my-link">
            rent calculator
          </Link>{" "}
          help you make the choice that builds the most wealth over time.
        </p>
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
