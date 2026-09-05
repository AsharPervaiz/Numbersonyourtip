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
const FAQ_DATA: [string, string][] = [
  [
    "How much rent can I afford on my salary?",
    "Start from take-home pay rather than gross, subtract existing monthly commitments, and check what is left after the rent you are considering. A common starting point is around 30% of net income, but the residual matters more than the ratio — if what remains does not cover food, transport, utilities and some saving, the percentage is academic regardless of what it says.",
  ],
  [
    "Should I use gross or net income to work out rent?",
    "Net, for your own budgeting. Gross income includes money that goes to tax and never reaches you. The difference is substantial: 30% of a 60,000 gross salary is 1,500 a month, while 30% of a roughly 45,000 take-home is 1,125. Landlords use gross because it is the figure on a payslip, so expect their assessment to be more generous than your own.",
  ],
  [
    "What income do landlords require?",
    "Most apply an income multiple rather than a percentage, commonly 30 to 40 times the monthly rent in annual gross income, or 2.5 to 3 times the monthly rent in gross monthly income. A 1,200 rent under a 40x rule needs 48,000 a year. Multiples vary by agent and are usually not negotiable, though a guarantor, a larger deposit or rent paid in advance can sometimes substitute.",
  ],
  [
    "Where does the 30% rule actually come from?",
    "American public-housing policy, where a percentage of income was used administratively to set subsidised rents. It was a formula for deciding what to charge a household, not a research finding about what households can afford. It became general advice mostly because it is easy to remember, which is also why it fits low incomes poorly — food and transport do not scale down with earnings.",
  ],
  [
    "What percentage of my income should rent be?",
    "There is no single right figure, because the same percentage leaves very different amounts behind at different income levels. Thirty percent of a 6,000 monthly take-home leaves 4,200 for everything else; the same proportion of 1,800 leaves 1,260. Judge the amount remaining after rent and fixed commitments rather than the ratio itself.",
  ],
  [
    "What costs should I add to the rent when budgeting?",
    "Utilities where they are not included, any local taxes or service charges payable by the tenant, contents insurance, and commuting. Travel is the most commonly overlooked, and it frequently reverses a comparison — a cheaper flat further out can cost more in total. Separately, budget the upfront lump sum of deposit, first month and any agency fees, which decides whether you can move at all.",
  ],
  [
    "How should housemates split the rent fairly?",
    "Either by room size or by income. For room size, total the floor area of the private rooms and give each person that share of the rent, leaving shared space out since everyone uses it — in a 1,500 flat with rooms of 20, 15 and 10 square metres the shares are 667, 500 and 333. Splitting by income works for couples and long-term shares but requires disclosing salaries. Agree the method in writing before anyone moves in.",
  ],
  [
    "Is it ever sensible to spend more than 30% on rent?",
    "Yes, when the extra buys something measurable — utilities included in the rent, a location that removes a commute or a car, no debt to service, or a deliberately short arrangement. What makes these reasonable is that each is a trade. The warning sign is not a high percentage but a high percentage with nothing bought in exchange and nothing left at month end.",
  ],
  [
    "I was approved for a rent I am not sure I can afford. What now?",
    "Approval and affordability are separate tests using different inputs. The landlord checked a multiple of your gross income; you should be checking what remains from your take-home after rent and commitments. If that residual does not comfortably cover everything else, the sensible response is to look lower rather than to treat the approval as confirmation.",
  ],
];

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
        <h1>Rent Affordability Calculator — What You Can Actually Pay</h1>

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

        {/* ---- SEO CONTENT ---- */}

        <h2>Three Different Questions Get Called &quot;Rent Calculator&quot;</h2>
        <p>
          People arrive here wanting one of three things, and the answers are
          not the same number.
        </p>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>What you are asking</th>
                <th>What decides it</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>What is the most I can comfortably pay?</td>
                <td>Your income after tax, minus existing commitments</td>
              </tr>
              <tr>
                <td>Is the rent I already pay reasonable?</td>
                <td>Rent as a percentage of income, and of what is left over</td>
              </tr>
              <tr>
                <td>Will a landlord accept my application?</td>
                <td>
                  Their income multiple rule, applied to gross income, not yours
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          The third routinely produces a higher figure than the first, which is
          why people get approved for flats they cannot comfortably afford.
          Being accepted is not the same as it being sensible, and the two
          calculations use different inputs on purpose.
        </p>

        <h2>Gross or Net? This Changes the Answer More Than Anything Else</h2>
        <p>
          Almost every rent guideline is quoted as a percentage of income
          without saying which income, and the gap between the two is large
          enough to swallow the entire rule.
        </p>
        <p>
          Someone earning 60,000 gross might take home in the region of 45,000
          after tax and deductions. Thirty percent of the gross figure is 1,500
          a month. Thirty percent of the take-home is 1,125. That is a 375
          monthly difference — around 4,500 a year — produced entirely by which
          number the percentage was applied to.
        </p>
        <p>
          Landlords and letting agents almost always use gross, because it is
          the figure on a payslip or contract and it is the same for everyone
          regardless of tax code. For your own budgeting, gross income is close
          to meaningless: you cannot pay rent with money that goes to tax. Use
          take-home pay when deciding what you can afford, and expect the
          landlord to be working from a more generous number.
        </p>

        <h2>Where the 30% Rule Came From</h2>
        <p>
          The familiar guideline did not originate as advice to private
          tenants. It comes from American public-housing policy, where a
          percentage of income was used to set subsidised rents administratively
          — a formula for calculating what a household should be charged, not a
          finding about what households can afford. It was adopted as general
          guidance later, largely because it is easy to remember.
        </p>
        <p>
          That history explains why it fits some situations badly. A single
          percentage takes no account of income level, and the same percentage
          leaves very different amounts behind:
        </p>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Monthly take-home</th>
                <th>30% on rent</th>
                <th>Left for everything else</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1,800</td>
                <td>540</td>
                <td>1,260</td>
              </tr>
              <tr>
                <td>3,000</td>
                <td>900</td>
                <td>2,100</td>
              </tr>
              <tr>
                <td>6,000</td>
                <td>1,800</td>
                <td>4,200</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          At the top of that table, 30% is comfortable and arguably
          conservative. At the bottom, the same percentage can be a struggle,
          because food, transport and utilities do not scale down with income.
          The residual amount matters more than the ratio, and it is the number
          the rule hides.
        </p>
        <p>
          A more useful test is to work out what is left after rent and fixed
          commitments, then ask whether that covers everything else with
          something spare. If it does not, the percentage is academic.
        </p>

        <h2>What a Landlord Checks, and Why It Differs</h2>
        <p>
          Letting agents apply income multiples rather than percentages, and the
          two common conventions are the same rule expressed differently.
        </p>
        <pre>
          Annual gross income must be at least 30 to 40 times the monthly rent
          {"\n"}or: monthly gross income must be at least 2.5 to 3 times the
          monthly rent
        </pre>
        <p>
          A 1,200 monthly rent under a 40-times rule needs 48,000 of annual
          gross income. Under a 3-times monthly rule it needs 3,600 gross a
          month, or 43,200 a year. Different agents use different multiples, and
          the multiple is usually not negotiable even when your finances plainly
          support the rent.
        </p>
        <p>
          Falling short does not always end the application. A guarantor, a
          larger deposit paid up front, several months paid in advance, or
          documented savings can all substitute for the multiple, depending on
          the landlord. Where the income is from self-employment, expect to
          supply accounts or tax returns rather than payslips — our{" "}
          <Link href="/freelancer-tax-calculator/" className="my-link">
            freelancer tax calculator
          </Link>{" "}
          helps establish what your post-tax figure actually is.
        </p>

        <h2>Rent Is Not the Cost of Renting</h2>
        <p>
          The advertised rent is the largest line but rarely the whole one, and
          budgeting on it alone is how people end up short in month two.
        </p>
        <ul className="custom-list">
          <li>
            <strong>Utilities</strong> — sometimes bundled, usually not. Check
            whether heating, water, and internet are included before comparing
            two places on rent alone; a lower rent with everything excluded can
            cost more.
          </li>
          <li>
            <strong>Local taxes and service charges</strong> — payable by the
            tenant in many places and easy to overlook on a listing.
          </li>
          <li>
            <strong>Contents insurance</strong> — the landlord insures the
            building, not your belongings.
          </li>
          <li>
            <strong>Upfront cost</strong> — deposit plus first month, and often
            agency fees. This is a lump sum, not a monthly one, and it decides
            whether you can move at all.
          </li>
          <li>
            <strong>Commuting</strong> — the most underrated line. A cheaper
            flat further out can cost more once travel is included, and it also
            costs time.
          </li>
        </ul>
        <p>
          Comparing two places properly means comparing total monthly outgoings
          including travel, not the headline rents. That comparison frequently
          reverses the ranking.
        </p>

        <h2>Splitting Rent Without an Argument</h2>
        <p>
          Shared households usually default to dividing equally, which is fine
          when the rooms are similar and quietly resented when they are not.
          Two alternatives work better.
        </p>
        <p>
          <strong>By room size.</strong> Add up the floor area of the private
          rooms, work out each room&apos;s share of that total, and apply it to
          the rent. Shared space is used by everyone so it stays out of the
          calculation. In a 1,500 flat where the three bedrooms are 20, 15 and
          10 square metres, the shares come to 667, 500 and 333.
        </p>
        <p>
          <strong>By income.</strong> Each person pays the same percentage of
          their take-home pay rather than the same amount. This suits couples
          and long-term shares with unequal earnings, and is a poor fit for
          flatmates who would rather not disclose their salaries.
        </p>
        <p>
          Whichever method is used, agree it in writing before anyone moves in.
          Adjusting a split that already feels unfair is much harder than
          setting it at the start. Our{" "}
          <Link href="/bill-split-calculator/" className="my-link">
            bill split calculator
          </Link>{" "}
          handles the shared costs that follow.
        </p>

        <h2>When Paying More Is the Right Call</h2>
        <p>
          Guidelines describe an average situation, and plenty of situations are
          not average. Spending above the usual proportion can be entirely
          rational when the extra buys something measurable.
        </p>
        <ul className="custom-list">
          <li>
            The rent includes utilities that would otherwise be a separate few
            hundred a month.
          </li>
          <li>
            The location removes a commuting cost, or replaces a car outright.
          </li>
          <li>
            You have no debt, so the money that would service loans is available
            for housing.
          </li>
          <li>
            The arrangement is short and deliberate — a fixed contract, a course,
            a year in a specific city.
          </li>
        </ul>
        <p>
          What makes these reasonable is that each is a trade rather than an
          overreach. The warning sign is not a high percentage; it is a high
          percentage with nothing bought in exchange and no savings left at the
          end of the month.
        </p>
        <p>
          If you are weighing renting against buying, the monthly comparison is
          only part of the picture — our{" "}
          <Link href="/home-mortgage-calculator/" className="my-link">
            mortgage calculator
          </Link>{" "}
          and the guide to{" "}
          <Link href="/blog/renting-vs-buying-a-home/" className="my-link">
            renting versus buying
          </Link>{" "}
          set out the costs that sit on each side.
        </p>
        <h2>Rent Affordability Questions</h2>

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
