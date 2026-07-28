"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

/* ─────────────────────────────────────────
   Types
───────────────────────────────────────── */
interface RentResult {
  low: string;
  medium: string;
  high: string;
  available: string;
  // numeric values for panel
  availableNum: number;
  lowNum: number;
  mediumNum: number;
  highNum: number;
  incomeNum: number;
}

/* ─────────────────────────────────────────
   Pure helper — same pattern as other calculators
───────────────────────────────────────── */
function needleDeg(ratio: number): number {
  const clamped = Math.min(Math.max(ratio, 0), 1);
  return -90 + clamped * 180;
}

/* ─────────────────────────────────────────
   RentResultPanel
   Gauge + meter show the recommended (30%) rent
   as a % of gross income — a "rent burden" indicator.
   Uses same cr-* CSS classes for visual consistency.
───────────────────────────────────────── */
function RentResultPanel({ result }: { result: RentResult | null }) {
  if (!result) {
    return (
      <div className="cr-panel-placeholder">
        <div className="cr-ph-icon">
          <i className="fa-solid fa-house" aria-hidden="true" />
        </div>
        Enter your income to see your affordable rent range here.
      </div>
    );
  }

  const {
    availableNum,
    lowNum,
    mediumNum,
    highNum,
    incomeNum,
    low,
    medium,
    high,
    available,
  } = result;

  // Gauge / meter: recommended (30%) rent as % of gross income
  // Scale: 0–50% of gross income (>40% is severe housing stress)
  const burdenPct = incomeNum > 0 ? (mediumNum / incomeNum) * 100 : 0;
  const scaleMax = 50;
  const ratio = Math.min(burdenPct / scaleMax, 1);
  const barPct = 2 + ratio * 96;

  const burdenLabel =
    burdenPct <= 25
      ? "Low burden"
      : burdenPct <= 30
        ? "Recommended"
        : burdenPct <= 35
          ? "Moderate burden"
          : "High burden";

  const burdenBadge =
    burdenPct <= 25
      ? "good"
      : burdenPct <= 30
        ? "normal"
        : burdenPct <= 35
          ? "warning"
          : "danger";

  return (
    <div className="cr-panel">
      {/* Gauge + primary result */}
      <div className="cr-gauge-wrap">
        <svg
          className="cr-gauge-svg"
          width="100"
          height="60"
          viewBox="0 0 120 70"
          role="img"
          aria-label={`Rent burden gauge: ${burdenPct.toFixed(1)}% of income`}
        >
          <defs>
            <clipPath id="rent-half">
              <rect x="0" y="0" width="120" height="65" />
            </clipPath>
          </defs>
          {/* Green → Yellow → Orange → Red arc */}
          <circle
            cx="60"
            cy="65"
            r="52"
            fill="none"
            stroke="#97C459"
            strokeWidth="12"
            strokeDasharray="82 326"
            strokeDashoffset="-163"
            clipPath="url(#rent-half)"
          />
          <circle
            cx="60"
            cy="65"
            r="52"
            fill="none"
            stroke="#C0DD97"
            strokeWidth="12"
            strokeDasharray="49 326"
            strokeDashoffset="-245"
            clipPath="url(#rent-half)"
          />
          <circle
            cx="60"
            cy="65"
            r="52"
            fill="none"
            stroke="#FAC775"
            strokeWidth="12"
            strokeDasharray="49 326"
            strokeDashoffset="-294"
            clipPath="url(#rent-half)"
          />
          <circle
            cx="60"
            cy="65"
            r="52"
            fill="none"
            stroke="#F09595"
            strokeWidth="12"
            strokeDasharray="146 326"
            strokeDashoffset="-343"
            clipPath="url(#rent-half)"
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
          <div className="cr-score">{burdenPct.toFixed(1)}%</div>
          <div className="cr-score-label">of gross income on rent</div>
          <span className={`cr-badge ${burdenBadge}`}>{burdenLabel}</span>
        </div>
      </div>

      <hr className="cr-divider" />

      {/* Meter bar — rent burden % vs scale */}
      <div>
        <div className="cr-bar-label">rent burden vs. financial guidelines</div>
        <div
          className="cr-bar-track"
          style={{
            background:
              "linear-gradient(to right, #97C459 0%, #C0DD97 40%, #FAC775 65%, #F09595 100%)",
          }}
        >
          <div className="cr-bar-thumb" style={{ left: `${barPct}%` }} />
        </div>
        <div className="cr-bar-ticks">
          <span>0%</span>
          <span>25%</span>
          <span>30%</span>
          <span>35%</span>
          <span>50%</span>
        </div>
      </div>

      <hr className="cr-divider" />

      {/* Metric cards — all 3 tiers + available income */}
      <div className="cr-metrics-grid">
        <div className="cr-metric-card">
          <div className="cr-m-label">Conservative (25%)</div>
          <div className="cr-m-value">{low}</div>
          <div className="cr-m-sub">low financial risk</div>
        </div>
        <div className="cr-metric-card">
          <div className="cr-m-label">Recommended (30%)</div>
          <div className="cr-m-value">{medium}</div>
          <div className="cr-m-sub">standard guideline</div>
        </div>
        <div className="cr-metric-card">
          <div className="cr-m-label">Upper limit (35%)</div>
          <div className="cr-m-value">{high}</div>
          <div className="cr-m-sub">tight budget</div>
        </div>
        <div className="cr-metric-card">
          <div className="cr-m-label">Income after debts</div>
          <div className="cr-m-value">{available}</div>
          <div className="cr-m-sub">used for calculation</div>
        </div>
      </div>

      <hr className="cr-divider" />

      {/* Tier comparison bars */}
      <div>
        <div className="cr-world-title">affordable rent tiers</div>
        <div className="cr-world-bar-row">
          <span className="cr-w-label">25%</span>
          <div className="cr-world-track">
            <div
              className="cr-world-fill"
              style={{
                width: `${Math.round((lowNum / highNum) * 100)}%`,
                background: "#97C459",
              }}
            />
          </div>
          <span
            className="cr-w-pct"
            style={{ width: "60px", fontSize: "11px" }}
          >
            {low}
          </span>
        </div>
        <div className="cr-world-bar-row">
          <span className="cr-w-label">30%</span>
          <div className="cr-world-track">
            <div
              className="cr-world-fill"
              style={{
                width: `${Math.round((mediumNum / highNum) * 100)}%`,
                background: "#FAC775",
              }}
            />
          </div>
          <span
            className="cr-w-pct"
            style={{ width: "60px", fontSize: "11px" }}
          >
            {medium}
          </span>
        </div>
        <div className="cr-world-bar-row">
          <span className="cr-w-label">35%</span>
          <div className="cr-world-track">
            <div
              className="cr-world-fill"
              style={{ width: "100%", background: "#F09595" }}
            />
          </div>
          <span
            className="cr-w-pct"
            style={{ width: "60px", fontSize: "11px" }}
          >
            {high}
          </span>
        </div>
        <p className="cr-world-note">
          Needle shows recommended (30%) as % of gross income — aim to stay in
          the green zone.
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Main Calculator Page — UNCHANGED content & field styles
───────────────────────────────────────── */
export default function RentCalculator() {
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [monthlyDebts, setMonthlyDebts] = useState("");
  const [affordableRent, setAffordableRent] = useState<{
    low: string;
    medium: string;
    high: string;
    available: string;
  } | null>(null);

  // Structured result for the side panel
  const [panelResult, setPanelResult] = useState<RentResult | null>(null);

  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const formatNumber = (num: number): string => {
    return num.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleCommaInput = (value: string, setter: (v: string) => void) => {
    const raw = value.replace(/,/g, "");
    if (raw === "" || /^\d*\.?\d*$/.test(raw)) {
      const parts = raw.split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      setter(parts.join("."));
    }
  };

  const stripCommas = (v: string) => Number(v.replace(/,/g, ""));

  const calculateRent = () => {
    if (!monthlyIncome) return;

    const income = stripCommas(monthlyIncome);
    const debts = monthlyDebts ? stripCommas(monthlyDebts) : 0;

    if (income <= 0) return;

    const availableIncome = income - debts;
    if (availableIncome <= 0) return;

    const low = availableIncome * 0.25;
    const medium = availableIncome * 0.3;
    const high = availableIncome * 0.35;

    setAffordableRent({
      low: formatNumber(low),
      medium: formatNumber(medium),
      high: formatNumber(high),
      available: formatNumber(availableIncome),
    });
  };

  /* ── Auto-calculate for the side panel only ── */
  useEffect(() => {
    const income = monthlyIncome ? stripCommas(monthlyIncome) : 0;
    const debts = monthlyDebts ? stripCommas(monthlyDebts) : 0;

    if (!income || income <= 0) {
      setPanelResult(null);
      return;
    }

    const availableIncome = income - debts;
    if (availableIncome <= 0) {
      setPanelResult(null);
      return;
    }

    const lowNum = availableIncome * 0.25;
    const mediumNum = availableIncome * 0.3;
    const highNum = availableIncome * 0.35;

    setPanelResult({
      low: formatNumber(lowNum),
      medium: formatNumber(mediumNum),
      high: formatNumber(highNum),
      available: formatNumber(availableIncome),
      availableNum: availableIncome,
      lowNum,
      mediumNum,
      highNum,
      incomeNum: income,
    });
  }, [monthlyIncome, monthlyDebts]);

  const handleClear = () => {
    setMonthlyIncome("");
    setMonthlyDebts("");
    setAffordableRent(null);
    setPanelResult(null);
  };

  return (
    <div className="page-layout">
      <div className="single-page-padding">
        <h1>Rent Calculator</h1>

        <p>
          Find out how much rent you can realistically afford based on your
          monthly income and existing debt obligations. This calculator gives
          you a personalized affordable rent range — conservative, moderate, and
          upper limit — so you can apartment-hunt with confidence.
        </p>

        <div className="calc-card single-calc">
          <input
            className="calc-input"
            type="text"
            inputMode="decimal"
            placeholder="Monthly Income (e.g. 80,000)"
            value={monthlyIncome}
            onChange={(e) => handleCommaInput(e.target.value, setMonthlyIncome)}
          />

          <input
            className="calc-input"
            type="text"
            inputMode="decimal"
            placeholder="Monthly Debts — optional (e.g. 15,000)"
            value={monthlyDebts}
            onChange={(e) => handleCommaInput(e.target.value, setMonthlyDebts)}
          />

          <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
            <button className="calc-button" onClick={calculateRent}>
              Calculate
            </button>
            <button className="calc-button calc-clear" onClick={handleClear}>
              Clear
            </button>
          </div>

          {affordableRent && (
            <div className="calc-result">
              <p>
                <strong>Income After Debts:</strong> {affordableRent.available}
                /month
              </p>
              <p style={{ marginTop: "10px" }}>
                <strong>Affordable Rent Range:</strong>
              </p>
              <ul style={{ marginTop: "5px" }}>
                <li>
                  Conservative (25%): <strong>{affordableRent.low}</strong>{" "}
                  /month
                </li>
                <li>
                  Recommended (30%): <strong>{affordableRent.medium}</strong>{" "}
                  /month
                </li>
                <li>
                  Upper Limit (35%): <strong>{affordableRent.high}</strong>{" "}
                  /month
                </li>
              </ul>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "#555",
                  marginTop: "8px",
                }}
              >
                25% = low financial risk • 30% = widely recommended guideline •
                35% = maximum before housing becomes a financial strain
              </p>
            </div>
          )}
        </div>

        {/* Mobile-only result panel */}
        <div className="cr-mobile-slot">
          <RentResultPanel result={panelResult} />
        </div>

        {/* ---- SEO CONTENT — UNTOUCHED ---- */}

        <h2>What Is a Rent Calculator?</h2>
        <p>
          A rent calculator is a budgeting tool that tells you how much of your
          monthly income should go toward rent. Instead of guessing whether an
          apartment listing is within your budget, you enter your income and
          existing debts, and the calculator gives you a clear range — from a
          conservative figure that leaves plenty of room for savings, up to the
          maximum you can spend without putting yourself under financial
          pressure.
        </p>
        <p>
          This is useful whether you are searching for your first apartment,
          relocating to a new city, renegotiating your lease, or simply trying
          to figure out if your current rent is too high relative to what you
          earn.
        </p>

        <h2>The 30% Rule: Where It Comes From and When to Adjust It</h2>
        <p>
          The most widely cited guideline in personal finance is the "30% rule"
          — spend no more than 30% of your gross monthly income on rent. This
          benchmark originated from U.S. housing policy in the 1980s and has
          since become a standard reference point worldwide.
        </p>
        <p>
          However, the 30% rule is a starting point, not a universal truth. It
          works well for mid-range incomes, but it has limitations:
        </p>
        <ul className="custom-list">
          <li>
            <strong>Lower incomes:</strong> If your monthly income is relatively
            low, 30% may not leave enough for food, transportation, and other
            essentials. In this case, aiming for 25% or even 20% is more
            realistic.
          </li>
          <li>
            <strong>Higher incomes:</strong> If you earn well above average,
            spending 30% on rent may mean paying for far more space than you
            need. You might choose to spend 20% and direct the rest toward
            savings, investments, or paying off an{" "}
            <Link href="/emi-calculator/" className="my-link">
              EMI on an existing loan
            </Link>
            .
          </li>
          <li>
            <strong>High-debt situations:</strong> If a significant chunk of
            your income already goes to loan repayments, applying the 30% rule
            to your gross income (rather than income after debts) will overstate
            what you can afford. This calculator accounts for that by
            subtracting debts first.
          </li>
          <li>
            <strong>Expensive cities:</strong> In high-cost markets, staying
            under 30% may simply not be possible without roommates or a long
            commute. Knowing where you stand relative to the guideline still
            helps you make an informed trade-off.
          </li>
        </ul>

        <h2>How This Rent Calculator Works</h2>
        <p>The calculator uses a straightforward approach:</p>
        <ul className="custom-list">
          <li>
            <strong>Step 1:</strong> Enter your total monthly income — this can
            be your salary, freelance earnings, or any regular income after
            taxes.
          </li>
          <li>
            <strong>Step 2:</strong> Optionally enter your monthly debts. This
            includes loan EMIs, credit card minimum payments, car payments, or
            any recurring financial obligations.
          </li>
          <li>
            <strong>Step 3:</strong> Click Calculate. The tool subtracts your
            debts from your income, then applies three percentage tiers to your
            available income:
          </li>
        </ul>

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
                  Tier
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  % of Income After Debts
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  What It Means
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Conservative
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  25%
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Maximum savings room, low financial risk
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Recommended
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  30%
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Balanced — standard financial advice
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Upper Limit
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  35%
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Tight budget — limited room for unexpected expenses
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>Rent Affordability Examples at Different Income Levels</h2>
        <p>
          The table below shows what each tier looks like at various monthly
          income levels, assuming no existing debts. If you have debts, subtract
          them from your income first and use the adjusted figure.
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
                  Monthly Income
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  25% (Conservative)
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  30% (Recommended)
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  35% (Upper Limit)
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                ["40,000", "10,000", "12,000", "14,000"],
                ["60,000", "15,000", "18,000", "21,000"],
                ["80,000", "20,000", "24,000", "28,000"],
                ["100,000", "25,000", "30,000", "35,000"],
                ["150,000", "37,500", "45,000", "52,500"],
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

        <h3>Example With Debts</h3>
        <p>
          Suppose you earn 80,000 per month but pay 15,000 in loan EMIs. Your
          available income is 65,000. The calculator would recommend:
        </p>
        <ul className="custom-list">
          <li>Conservative (25%): 16,250/month</li>
          <li>Recommended (30%): 19,500/month</li>
          <li>Upper Limit (35%): 22,750/month</li>
        </ul>
        <p>
          Without accounting for debts, the 30% figure would have been 24,000 —
          a number that looks affordable on paper but leaves you stretched thin
          in practice. This is why including debts in the calculation matters.
        </p>

        <h2>How Existing Debts Change Your Rent Budget</h2>
        <p>
          Many renters overlook how much their existing financial obligations
          eat into their housing budget. Loan EMIs, credit card payments, car
          financing, and even subscription commitments all reduce the income
          available for rent.
        </p>
        <p>
          If you are currently paying off a personal or car loan, run the
          numbers through our{" "}
          <Link href="/loan-calculator/" className="my-link">
            loan calculator
          </Link>{" "}
          to see exactly what your monthly obligation is. Then enter that figure
          in the debts field above. The difference between planning with and
          without debts can easily be 5,000 to 10,000 per month — enough to
          determine whether you qualify for the apartment you are eyeing.
        </p>

        <h2>Renting vs. Buying: Which Makes More Financial Sense?</h2>
        <p>
          This is one of the biggest financial questions people face. The answer
          depends on your situation, but here are the key trade-offs:
        </p>
        <ul className="custom-list">
          <li>
            <strong>Renting</strong> gives you flexibility — you can move
            easily, avoid maintenance costs, and skip the large down payment
            required for a home. But rent builds no equity. Every payment goes
            to your landlord and does not contribute to ownership.
          </li>
          <li>
            <strong>Buying</strong> builds equity over time and can be a strong
            investment if property values rise. But it ties up a large chunk of
            your savings in a down payment, locks you into a location, and adds
            costs like property taxes, maintenance, and insurance.
          </li>
        </ul>
        <p>
          As a general rule, buying tends to be more cost-effective if you plan
          to stay in the same location for at least 5 to 7 years. If your
          timeline is shorter, renting usually wins because the upfront costs of
          buying (closing fees, down payment opportunity cost, early
          interest-heavy mortgage payments) take several years to recoup.
        </p>
        <p>
          If you are considering the transition from renting to buying, use our{" "}
          <Link href="/home-mortgage-calculator/" className="my-link">
            home mortgage calculator
          </Link>{" "}
          to see what your monthly payment would look like as a homeowner, and
          compare it directly with your current rent.
        </p>

        <h2>Budgeting Tips for Renters</h2>
        <ul className="custom-list">
          <li>
            <strong>Use the 50/30/20 rule as a starting framework.</strong>{" "}
            Allocate 50% of your after-tax income to needs (rent, utilities,
            groceries), 30% to wants (dining out, entertainment), and 20% to
            savings and debt repayment. Rent should fit comfortably within the
            "needs" half.
          </li>
          <li>
            <strong>Factor in utilities and hidden costs.</strong> Rent is not
            your only housing expense. Electricity, water, internet, parking
            fees, and renter's insurance all add up. Budget an additional 10% to
            15% on top of your base rent for these.
          </li>
          <li>
            <strong>Build an emergency fund before upgrading.</strong> Before
            moving to a more expensive apartment, make sure you have at least 3
            months of living expenses saved. This protects you from unexpected
            job loss or income disruption.
          </li>
          <li>
            <strong>Negotiate your lease.</strong> Landlords — especially in
            slower markets or during off-peak seasons — may lower rent if you
            commit to a longer lease, pay several months upfront, or offer to
            handle minor maintenance yourself.
          </li>
          <li>
            <strong>Reassess annually.</strong> Run this calculator every time
            your income or debt situation changes. A raise, a paid-off loan, or
            a new financial obligation should all trigger a recalculation of
            what rent you can comfortably handle.
          </li>
        </ul>

        <h2>When Is It OK to Spend More Than 30% on Rent?</h2>
        <p>
          There are situations where going above the 30% guideline makes
          practical sense — as long as you do it deliberately:
        </p>
        <ul className="custom-list">
          <li>
            <strong>You have zero or minimal debt.</strong> If no income goes to
            loan payments, your disposable income is higher, and spending 32% or
            even 35% may still leave a healthy buffer.
          </li>
          <li>
            <strong>Living closer saves transportation costs.</strong> Paying
            slightly more for an apartment near your workplace can save
            thousands annually on commuting — fuel, tolls, public transit
            passes, or vehicle wear. The net effect on your budget may be
            neutral or even positive.
          </li>
          <li>
            <strong>You are in a temporary high-cost phase.</strong> If you are
            a student or early-career professional in an expensive city with
            strong income growth prospects, a higher rent-to-income ratio now
            may be a reasonable trade-off for career opportunity.
          </li>
        </ul>
        <p>
          The key is awareness. Going above 30% without knowing you are doing it
          is a problem. Going above 30% as a calculated decision with a plan is
          fine.
        </p>

        <h2>How Income Tax Affects Your Rent Budget</h2>
        <p>
          The 30% rule works best when applied to your take-home pay — not your
          gross salary. If your employer quotes a monthly salary of 100,000 but
          taxes and deductions bring your take-home down to 78,000, your
          affordable rent at 30% is 23,400, not 30,000. That is a significant
          difference.
        </p>
        <p>
          Use our{" "}
          <Link href="/income-tax-calculator/" className="my-link">
            income tax calculator
          </Link>{" "}
          to figure out your actual after-tax income, then plug that number into
          this rent calculator for a truly accurate result.
        </p>

        <h2>Splitting Rent With Roommates</h2>
        <p>
          If you plan to share an apartment, the math shifts in your favor. Two
          people earning 60,000 each, with a combined budget of 36,000 at the
          30% level, can afford a much better apartment than either could alone
          at 18,000.
        </p>
        <p>
          When splitting rent, agree in advance on how to divide costs — equal
          split, proportional to income, or by room size. Run the calculator
          individually first so each person knows their personal ceiling, then
          find a place that works for everyone.
        </p>

        <h2>Frequently Asked Questions</h2>

        <div className="faq-item">
          <h3 onClick={() => toggleFAQ(0)}>
            How much of my income should I spend on rent?
            <i
              className={`fa-solid fa-chevron-down ${openFAQ === 0 ? "rotate" : ""}`}
            ></i>
          </h3>
          {openFAQ === 0 && (
            <p>
              The widely accepted guideline is 30% of your monthly income.
              However, this should be applied to your take-home pay after taxes
              and debt payments, not your gross salary. If your debts are high,
              aiming for 25% is safer. If you have minimal debts and stable
              income, going up to 35% may still be manageable.
            </p>
          )}
        </div>

        <div className="faq-item">
          <h3 onClick={() => toggleFAQ(1)}>
            Should I use gross or net income for the rent calculation?
            <i
              className={`fa-solid fa-chevron-down ${openFAQ === 1 ? "rotate" : ""}`}
            ></i>
          </h3>
          {openFAQ === 1 && (
            <p>
              Use your net (take-home) income for the most accurate result. Your
              gross salary includes tax and other deductions that never reach
              your bank account. Basing rent decisions on gross income can lead
              to overspending.
            </p>
          )}
        </div>

        <div className="faq-item">
          <h3 onClick={() => toggleFAQ(2)}>
            How do debts affect how much rent I can afford?
            <i
              className={`fa-solid fa-chevron-down ${openFAQ === 2 ? "rotate" : ""}`}
            ></i>
          </h3>
          {openFAQ === 2 && (
            <p>
              Debts reduce your disposable income. This calculator subtracts
              your monthly debt payments from your income before applying the
              percentage tiers. For example, if you earn 80,000 and pay 15,000
              in loan EMIs, your affordable rent is based on 65,000 — not
              80,000. Ignoring debts leads to budget overcommitment.
            </p>
          )}
        </div>

        <div className="faq-item">
          <h3 onClick={() => toggleFAQ(3)}>
            Is the 30% rule still relevant today?
            <i
              className={`fa-solid fa-chevron-down ${openFAQ === 3 ? "rotate" : ""}`}
            ></i>
          </h3>
          {openFAQ === 3 && (
            <p>
              It remains a useful benchmark, but it is not a rigid rule. Housing
              costs have outpaced income growth in many cities, making 30%
              difficult to achieve. The rule is best treated as a target rather
              than a strict ceiling. If you must go above it, compensate by
              reducing spending in other discretionary categories.
            </p>
          )}
        </div>

        <div className="faq-item">
          <h3 onClick={() => toggleFAQ(4)}>
            Should I rent or buy a home?
            <i
              className={`fa-solid fa-chevron-down ${openFAQ === 4 ? "rotate" : ""}`}
            ></i>
          </h3>
          {openFAQ === 4 && (
            <p>
              It depends on your financial situation and how long you plan to
              stay. Renting offers flexibility and lower upfront costs. Buying
              builds equity but requires a down payment and long-term
              commitment. As a general rule, buying becomes more cost-effective
              if you stay in the same home for at least 5 to 7 years. Compare
              both options using this rent calculator and our home mortgage
              calculator.
            </p>
          )}
        </div>

        <div className="faq-item">
          <h3 onClick={() => toggleFAQ(5)}>
            How do I calculate rent when splitting with roommates?
            <i
              className={`fa-solid fa-chevron-down ${openFAQ === 5 ? "rotate" : ""}`}
            ></i>
          </h3>
          {openFAQ === 5 && (
            <p>
              Each person should run the calculator individually to find their
              personal ceiling. Then look for apartments where each person's
              share falls within their range. Common split methods include equal
              division, proportional to income, or by room size.
            </p>
          )}
        </div>

        <div className="faq-item">
          <h3 onClick={() => toggleFAQ(6)}>
            What costs should I include besides rent?
            <i
              className={`fa-solid fa-chevron-down ${openFAQ === 6 ? "rotate" : ""}`}
            ></i>
          </h3>
          {openFAQ === 6 && (
            <p>
              Beyond base rent, budget for utilities (electricity, gas, water),
              internet, renter's insurance, parking fees, and any building
              maintenance or association charges. These can add 10% to 15% on
              top of your base rent. Factor them in when determining whether an
              apartment truly fits your budget.
            </p>
          )}
        </div>

        <div className="faq-item">
          <h3 onClick={() => toggleFAQ(7)}>
            Can I negotiate my rent?
            <i
              className={`fa-solid fa-chevron-down ${openFAQ === 7 ? "rotate" : ""}`}
            ></i>
          </h3>
          {openFAQ === 7 && (
            <p>
              Yes. Landlords are often open to negotiation, especially during
              off-peak seasons, when a unit has been vacant for a while, or if
              you offer a longer lease commitment or upfront payment. Research
              comparable rents in the area so you can make a data-backed case.
            </p>
          )}
        </div>

        <div className="faq-item">
          <h3 onClick={() => toggleFAQ(8)}>
            What if the calculator says I cannot afford any apartment in my
            city?
            <i
              className={`fa-solid fa-chevron-down ${openFAQ === 8 ? "rotate" : ""}`}
            ></i>
          </h3>
          {openFAQ === 8 && (
            <p>
              Consider options like sharing an apartment with roommates, looking
              in nearby neighborhoods with lower rents, negotiating with
              landlords, or increasing your income before moving. You might also
              reduce your debts first — paying off a loan frees up monthly cash
              flow, which directly increases how much rent you can afford.
            </p>
          )}
        </div>

        <h2>Final Thoughts</h2>
        <p>
          Rent is likely your biggest monthly expense, and getting it wrong can
          strain every other part of your budget. Use this calculator to set a
          clear boundary before you start searching, not after you have already
          fallen in love with an apartment you cannot afford.
        </p>
        <p>
          If you are weighing rent against a potential mortgage, compare the
          numbers with our{" "}
          <Link href="/home-mortgage-calculator/" className="my-link">
            home mortgage calculator
          </Link>
          . And if you want a complete view of your financial health, check out
          the{" "}
          <Link href="/net-worth-calculator/" className="my-link">
            net worth calculator
          </Link>{" "}
          to see where you stand overall.
        </p>
      </div>

      {/* ---- SIDEBAR ---- */}
      <aside className="sidebar">
        {/* Result panel — desktop only; mobile version is above in main column */}
        <div className="cr-desktop-slot">
          <RentResultPanel result={panelResult} />
        </div>

        <div className="sidebar-box">
          <p style={{ fontSize: "20px", fontWeight: 600 }}>
            Related Calculators
          </p>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li>
              <Link href="/home-mortgage-calculator/" className="my-link">
                Home Mortgage Calculator
              </Link>
            </li>
            <li>
              <Link href="/emi-calculator/" className="my-link">
                EMI Calculator
              </Link>
            </li>
            <li>
              <Link href="/loan-calculator/" className="my-link">
                Loan Calculator
              </Link>
            </li>
            <li>
              <Link href="/income-tax-calculator/" className="my-link">
                Income Tax Calculator
              </Link>
            </li>
            <li>
              <Link href="/net-worth-calculator/" className="my-link">
                Net Worth Calculator
              </Link>
            </li>
            <li>
              <Link href="/bill-split-calculator/" className="my-link">
                Bill Split Calculator
              </Link>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
