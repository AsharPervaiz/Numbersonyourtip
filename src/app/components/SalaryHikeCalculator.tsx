"use client";
import { useState } from "react";
import Link from "next/link";

const FAQ_DATA: [string, string][] = [
  [
    "How do I calculate a salary hike percentage?",
    "Subtract the old salary from the new one, divide by the old salary, and multiply by 100. Going from 60,000 to 66,000 is 6,000 ÷ 60,000 × 100 = 10%. To go the other way, multiply the old salary by 1 plus the percentage divided by 100. The arithmetic is never the difficult part — agreeing which pair of numbers goes into it is.",
  ],
  [
    "Should I calculate the hike on my package or my basic salary?",
    "Whichever you use, use the same basis on both sides. A total package includes employer contributions, allowances and sometimes a notional bonus, so a raise applied only to the fixed component produces a smaller percentage on basic salary than on the headline figure. Employers tend to quote the largest available base, so establish which one is being used before agreeing a number.",
  ],
  [
    "Why is my take-home increase smaller than my raise percentage?",
    "Because tax is applied in bands. If part of the increase falls into a higher band, that portion is taxed at the higher rate, so the proportional rise in what reaches your account is smaller than the proportional rise in gross pay. Deductions that scale with salary, such as pension contributions, have the same effect on the visible amount.",
  ],
  [
    "Is a raise below inflation actually a pay cut?",
    "Yes, in real terms. A 3% raise against 5% inflation is a real decrease of about 1.9% — the contract says you earn more and the money buys less. The precise calculation divides one plus the nominal rate by one plus inflation, since the two compound rather than subtract, though subtracting is a close enough shortcut that always slightly overstates the gain.",
  ],
  [
    "Does a 20% pay cut reverse with a 20% raise?",
    "No. A 20% cut on 60,000 leaves 48,000, and a 20% rise on 48,000 gives 57,600 — a permanent 4% gap, because the cut came off a larger base than the rise went back onto. Restoring 48,000 to 60,000 needs a 25% increase. The same asymmetry applies to any pair of equal percentage moves in opposite directions.",
  ],
  [
    "How much difference do a couple of percentage points make?",
    "More than most people expect, because each raise is applied to the salary the last one produced. Starting from 50,000, ten years at 3% reaches about 67,196 while ten years at 5% reaches about 81,445 — over 14,000 apart in annual salary, and considerably more in cumulative earnings. It is also why a low starting salary is expensive in a way that is invisible at the time.",
  ],
  [
    "Is a bigger percentage from a new job always better?",
    "Not necessarily. Compare pension and benefit contributions in cash terms, any unvested equity or bonus you would forfeit, the change in commuting cost and time, and how long until the new role is secure. A 25% offer that removes a strong pension contribution and adds an hour of daily travel can be worth less than a 10% internal raise.",
  ],
  [
    "What counts as a good salary hike?",
    "There is no universal figure, because it depends on inflation, your market, and whether the role has changed. A more useful test than any benchmark is the real-terms calculation: does the increase beat inflation, and does it move you closer to what the role pays elsewhere? An increase that does neither is a hold rather than a raise, whatever the percentage says.",
  ],
  [
    "What should I ask for if the salary budget will not move?",
    "Ask what will. The timing of the next review, a title change, a training or conference budget, additional pension contribution, or flexible working are often funded from different budget lines and are genuinely available when base pay is not. Also get the effective date in writing — a raise agreed in March and applied in July is materially smaller that year than it appears.",
  ],
];

export default function SalaryHikeCalculator() {
  /* ---- STATE ---- */
  const [currentSalary, setCurrentSalary] = useState("");
  const [hikePercent, setHikePercent] = useState("");
  const [period, setPeriod] = useState<"monthly" | "quarterly" | "annual">(
    "annual",
  );

  const [result, setResult] = useState<{
    periodLabel: string;
    oldSalary: number;
    hikeAmount: number;
    newSalary: number;
  } | null>(null);

  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [periodOpen, setPeriodOpen] = useState(false);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  /* ---- COMMA FORMATTING HELPERS ---- */
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

  /* ---- CALCULATE ---- */
  const calculateHike = () => {
    const entered = toNum(currentSalary);
    const pct = toNum(hikePercent);
    if (!entered || !pct) return;

    const hikeAmount = (entered * pct) / 100;
    const newSalary = entered + hikeAmount;
    const periodLabel =
      period === "monthly"
        ? "Monthly"
        : period === "quarterly"
          ? "Quarterly"
          : "Annual";

    setResult({ periodLabel, oldSalary: entered, hikeAmount, newSalary });
  };

  /* ---- CLEAR ---- */
  const handleClear = () => {
    setCurrentSalary("");
    setHikePercent("");
    setPeriod("annual");
    setPeriodOpen(false);
    setResult(null);
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
        <h1>Salary Hike Calculator — Percentage, Real Terms and Offers</h1>
          <p>
            Calculate Your New Salary After Appraisal — Instantly &amp; Free
          </p>

          <div className="calc-card single-calc">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: "10px",
              }}
            >
              <input
                className="calc-input"
                type="text"
                inputMode="decimal"
                placeholder={
                  period === "monthly"
                    ? "Current Monthly Salary"
                    : period === "quarterly"
                      ? "Current Quarterly Salary"
                      : "Current Annual Salary"
                }
                value={currentSalary}
                onChange={handleChange(setCurrentSalary)}
                style={{ margin: 0 }}
              />
              <input
                className="calc-input"
                type="text"
                inputMode="decimal"
                placeholder="Hike Percentage (%)"
                value={hikePercent}
                onChange={handleChange(setHikePercent)}
                style={{ margin: 0 }}
              />
              <div
                className="modern-dropdown"
                onClick={() => setPeriodOpen(!periodOpen)}
                style={{ margin: 0 }}
              >
                {period === "monthly"
                  ? "Monthly"
                  : period === "quarterly"
                    ? "Quarterly"
                    : "Annual"}
                <span className="dropdown-indicator">▼</span>
                {periodOpen && (
                  <ul className="dropdown-list">
                    <li
                      onClick={() => {
                        setPeriod("annual");
                        setPeriodOpen(false);
                      }}
                    >
                      Annual
                    </li>
                    <li
                      onClick={() => {
                        setPeriod("monthly");
                        setPeriodOpen(false);
                      }}
                    >
                      Monthly
                    </li>
                    <li
                      onClick={() => {
                        setPeriod("quarterly");
                        setPeriodOpen(false);
                      }}
                    >
                      Quarterly
                    </li>
                  </ul>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <button
                className="calc-button"
                onClick={calculateHike}
                style={{ flex: "7" }}
              >
                Calculate
              </button>

              <button
                className="calc-button calc-clear"
                onClick={handleClear}
                style={{ flex: "3" }}
              >
                Clear
              </button>
            </div>

            {/* Result */}
            {result && (
              <div className="calc-result" style={{ lineHeight: "2" }}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "6px 20px",
                  }}
                >
                  <div>Current {result.periodLabel} Salary:</div>
                  <div>
                    <strong>{fmt(result.oldSalary)}</strong>
                  </div>

                  <div>Hike Amount ({result.periodLabel}):</div>
                  <div>
                    <strong style={{ color: "green" }}>
                      + {fmt(result.hikeAmount)}
                    </strong>
                  </div>

                  <div style={{ fontWeight: 600 }}>
                    New {result.periodLabel} Salary:
                  </div>
                  <div>
                    <strong style={{ fontSize: "1.1em" }}>
                      {fmt(result.newSalary)}
                    </strong>
                  </div>
                </div>
              </div>
            )}
          </div>

        {/* ---- SEO CONTENT ---- */}

        <h2>The Percentage Is Easy. The Base Is the Argument.</h2>
        <pre>
          Hike % = (New salary − Old salary) ÷ Old salary × 100{"\n"}New salary =
          Old salary × (1 + Hike % ÷ 100)
        </pre>
        <p>
          Going from 60,000 to 66,000 is (66,000 − 60,000) ÷ 60,000 × 100 = 10%.
          Nobody disputes that arithmetic. What people dispute is which pair of
          numbers goes into it, because a single raise can honestly be described
          as several different percentages depending on the base chosen.
        </p>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Base</th>
                <th>What it includes</th>
                <th>Who prefers quoting it</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Total package or CTC</td>
                <td>
                  Salary plus employer contributions, allowances, insurance,
                  sometimes a notional bonus
                </td>
                <td>The employer — it is the largest number</td>
              </tr>
              <tr>
                <td>Gross salary</td>
                <td>Contractual pay before tax and deductions</td>
                <td>Recruiters and most published benchmarks</td>
              </tr>
              <tr>
                <td>Take-home pay</td>
                <td>What actually reaches your account</td>
                <td>You, when budgeting</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          A raise applied only to the fixed component of a package produces a
          smaller percentage on gross salary than on the headline total. And a
          gross increase does not translate into the same percentage in your
          account: if the raise pushes part of your income into a higher tax
          band, the take-home increase is a smaller proportion than the gross
          one.
        </p>
        <p>
          The practical rule is to compare like with like. When someone quotes a
          percentage, establish the base before agreeing or being impressed by
          it. Our{" "}
          <Link href="/income-tax-calculator/" className="my-link">
            income tax calculator
          </Link>{" "}
          converts a gross increase into a take-home one.
        </p>

        <h2>A Raise Below Inflation Is a Pay Cut</h2>
        <p>
          A nominal increase says what happened to the number on your contract.
          A real increase says what happened to what it buys, and only the
          second is a raise in any sense that matters.
        </p>
        <pre>
          Real increase % = ((1 + nominal ÷ 100) ÷ (1 + inflation ÷ 100) − 1) ×
          100
        </pre>
        <p>
          An 8% raise in a year of 6% inflation is not a 2% real increase; it is
          about 1.9%, because the two percentages compound rather than subtract.
          Close enough that subtracting is a reasonable mental shortcut, and
          worth knowing that the shortcut always slightly overstates the gain.
        </p>
        <p>
          The uncomfortable version of the same arithmetic: a 3% raise against
          5% inflation is a real decrease of about 1.9%. The contract says you
          earn more and you can buy less. This is the calculation to run before
          deciding whether an offer is acceptable, and it is the one most people
          skip.
        </p>

        <h2>Percentages Do Not Reverse</h2>
        <p>
          A detail that catches people out in restructurings and in negotiations
          about deferred increases. A 20% cut followed by a 20% rise does not
          restore the original salary.
        </p>
        <pre>
          60,000 × 0.80 = 48,000{"\n"}48,000 × 1.20 = 57,600
        </pre>
        <p>
          The 20% came off a larger base than it went back on to, leaving a
          permanent 4% gap. Restoring 48,000 to 60,000 requires a 25% rise, not
          a 20% one. The same asymmetry applies to any pair of equal-sized
          percentage moves in opposite directions.
        </p>

        <h2>Small Differences Compound Into Large Ones</h2>
        <p>
          Each raise is calculated on the salary the previous one produced,
          which makes early increases disproportionately valuable.
        </p>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Starting at 50,000</th>
                <th>After 5 years</th>
                <th>After 10 years</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>3% annually</td>
                <td>about 57,964</td>
                <td>about 67,196</td>
              </tr>
              <tr>
                <td>5% annually</td>
                <td>about 63,814</td>
                <td>about 81,445</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          Two percentage points a year separates those two people by more than
          14,000 in annual salary after a decade, and by considerably more in
          total earnings across it. It is also why accepting a low starting
          salary is expensive in a way that is invisible at the time: every
          subsequent percentage is applied to a smaller number.
        </p>

        <h2>Comparing a Raise Against Changing Jobs</h2>
        <p>
          A external offer is usually quoted as a larger percentage than an
          internal raise, and comparing the two on the headline figure alone is
          how people end up worse off.
        </p>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Factor</th>
                <th>Question to answer before deciding</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Base versus package</td>
                <td>
                  Is the new figure on the same basis as your current one?
                </td>
              </tr>
              <tr>
                <td>Pension and benefits</td>
                <td>
                  Does the employer contribution differ, and by how much in cash
                  terms?
                </td>
              </tr>
              <tr>
                <td>Unvested equity or bonus</td>
                <td>
                  What are you forfeiting by leaving before it lands?
                </td>
              </tr>
              <tr>
                <td>Commute and location</td>
                <td>
                  What does the change cost in fare, fuel and hours per week?
                </td>
              </tr>
              <tr>
                <td>Notice and probation</td>
                <td>
                  How long until the new role is secure, and what happens if it
                  is not?
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          None of these argues against moving. They argue for pricing the whole
          package rather than one percentage, because a 25% offer that removes a
          strong pension contribution and adds an hour of daily commuting can be
          worth less than a 10% internal raise.
        </p>
        <p>
          For the travel line specifically, our{" "}
          <Link href="/fuel-cost-calculator/" className="my-link">
            fuel cost calculator
          </Link>{" "}
          turns a longer commute into an annual figure you can subtract from the
          offer.
        </p>

        <h2>Using the Number in a Conversation</h2>
        <p>
          Knowing the arithmetic changes how the discussion goes, mostly by
          making it specific.
        </p>
        <ul className="custom-list">
          <li>
            Ask for a figure rather than a percentage. Percentages invite
            ambiguity about the base; an amount does not.
          </li>
          <li>
            Bring the real-terms calculation. &quot;That is a 1.9% increase
            after inflation&quot; is a factual statement, not a complaint, and it
            reframes an offer that sounded reasonable.
          </li>
          <li>
            Where the budget genuinely will not move, ask what will — timing of
            the next review, title, a training budget, or additional pension
            contribution, which is often funded from a different line.
          </li>
          <li>
            Get the effective date in writing. A raise agreed in March and
            applied in July is materially smaller in that year than it appears.
          </li>
        </ul>
        <h2>Salary Increase Questions</h2>

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
          <div className="sidebar-box">
            <p style={{ fontSize: "20px", fontWeight: 600 }}>
              Related Calculators
            </p>
            <ul style={{ listStyle: "none", padding: 0 }}>
              <li>
                <Link href="/net-worth-calculator/">
                  <span
                    style={{ textDecoration: "none" }}
                    className="hover-item"
                  >
                    Net Worth Calculator
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/income-tax-calculator/">
                  <span
                    style={{ textDecoration: "none" }}
                    className="hover-item"
                  >
                    Income Tax Calculator
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/emi-calculator/">
                  <span
                    style={{ textDecoration: "none" }}
                    className="hover-item"
                  >
                    EMI Calculator
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/loan-calculator/">
                  <span
                    style={{ textDecoration: "none" }}
                    className="hover-item"
                  >
                    Loan Calculator
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/freelancer-tax-calculator/">
                  <span
                    style={{ textDecoration: "none" }}
                    className="hover-item"
                  >
                    Freelancer Tax Calculator
                  </span>
                </Link>
              </li>

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
