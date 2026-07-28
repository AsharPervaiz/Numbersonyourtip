"use client";
import { useState } from "react";
import Link from "next/link";

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
    <>
      {/* ---- PAGE LAYOUT WRAPPER ---- */}
      <div className="page-layout single-page-padding">
        <div className="single-page-padding">
          <h1>Salary Hike Calculator</h1>
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
          <h2>What is a Salary Hike?</h2>
          <p>
            A salary hike is the percentage increase in your salary, usually
            offered during an annual appraisal, performance review, or when
            switching jobs. It is one of the most talked-about topics during
            appraisal season — and for good reason. Even a 5% difference in hike
            percentage can mean a significant change in your take-home pay over
            a year. This calculator helps you find out exactly how much you will
            earn after your hike, both annually and monthly.
          </p>

          <h2>How to Calculate Salary Hike</h2>
          <p>
            Calculating a salary hike is straightforward once you know the
            formula. Enter your current salary and the hike percentage you
            received or are expecting. The calculator will instantly show you
            the hike amount, your new annual salary, and how your monthly salary
            changes — all in one place.
          </p>

          <h2>Salary Hike Formula</h2>
          <p>Here are the two key formulas used in this calculator:</p>

          <pre>
            Hike Amount = (Current Salary × Hike%) ÷ 100{"\n"}
            New Salary = Current Salary + Hike Amount
          </pre>

          <p>
            For example, if your current annual salary is 600,000 and you
            receive a 15% hike:
          </p>
          <pre>
            Hike Amount = (600,000 × 15) ÷ 100 = 90,000{"\n"}
            New Salary = 600,000 + 90,000 = 690,000
          </pre>

          <h2>How to Calculate Hike Percentage from Two Salaries</h2>
          <p>
            If you already know your old and new salary and want to find the
            hike percentage, use this formula:
          </p>
          <pre>Hike % = [(New Salary − Old Salary) ÷ Old Salary] × 100</pre>
          <p>
            For example, if your salary went from 500,000 to 575,000, your hike
            percentage is (75,000 ÷ 500,000) × 100 = 15%.
          </p>

          <h2>What is Considered a Good Salary Hike?</h2>
          <p>
            A good salary hike depends on your industry, experience level, and
            the economy. In general, anything above 10% is considered a solid
            hike in most industries. A hike between 15% and 25% is excellent and
            typically seen when switching companies or after a strong
            performance year. Annual increments below 8% often just keep up with
            inflation rather than genuinely increasing your purchasing power. If
            you are switching jobs, a hike of 20% to 40% over your current
            salary is common and acceptable to negotiate for.
          </p>

          <h2>Salary Hike vs Job Switch — Which Pays More?</h2>
          <p>
            In most cases, switching jobs gives you a significantly higher hike
            than staying at the same company. Internal appraisal hikes typically
            range from 8% to 15%, while job switches can get you anywhere from
            20% to 50% depending on your skills and market demand. Many
            professionals use this calculator to compare what they would earn if
            they stayed versus if they switched, helping them make a more
            informed career decision.
          </p>

          <h2>Key Factors That Influence Your Salary Hike</h2>

          <h3>1. Performance Rating</h3>
          <p>
            Most companies tie salary hikes directly to performance ratings. A
            top performer typically gets 2x to 3x the hike of an average
            performer. Knowing your rating before appraisal season helps you
            estimate your expected increment.
          </p>

          <h3>2. Industry and Company Budget</h3>
          <p>
            The IT, finance, and consulting sectors tend to offer higher hikes
            than manufacturing or government sectors. Company profitability also
            plays a big role — a company that had a strong year is more likely
            to give generous increments.
          </p>

          <h3>3. Years of Experience</h3>
          <p>
            Early-career professionals often see larger percentage hikes as they
            grow quickly. Senior professionals may get smaller percentages but
            on a higher base, which still translates to significant absolute
            increases.
          </p>

          <h3>4. Market Salary Benchmarks</h3>
          <p>
            If your current salary is below the market rate for your role, you
            have stronger grounds to negotiate a higher hike or a counter-offer
            when switching. Researching industry benchmarks before appraisal
            discussions is always a good idea.
          </p>

          <h2>Tips to Negotiate a Higher Salary Hike</h2>
          <ul className="custom-list">
            <li>
              Document your achievements and contributions throughout the year
              before appraisal
            </li>
            <li>
              Research market salary data for your role, experience, and
              location
            </li>
            <li>
              Ask for a specific number rather than leaving it open — it shows
              confidence
            </li>
            <li>
              Time your negotiation right — after a project success or positive
              review
            </li>
            <li>
              Consider the full package — bonuses, remote work, and benefits
              have monetary value too
            </li>
            <li>
              Be ready to walk away — having another offer in hand gives you
              real leverage
            </li>
            <li>
              Practice the conversation beforehand so you are comfortable and
              clear
            </li>
          </ul>

          <h2>Benefits of Using Our Salary Hike Calculator</h2>
          <ul className="custom-list">
            <li>Instantly shows annual and monthly salary after hike</li>
            <li>Shows exact hike amount in rupees or any currency</li>
            <li>Helps compare multiple hike scenarios side by side</li>
            <li>Free, online, no login or registration needed</li>
            <li>Works for any currency and any salary range</li>
            <li>Clear breakdown of monthly and annual changes</li>
          </ul>

          <h2>Frequently Asked Questions</h2>

          <div className="faq-item">
            <h3 onClick={() => toggleFAQ(0)}>
              How do I calculate my salary after a hike?
              <i
                className={`fa-solid fa-chevron-down ${openFAQ === 0 ? "rotate" : ""}`}
              ></i>
            </h3>
            {openFAQ === 0 && (
              <p>
                Multiply your current salary by the hike percentage, divide by
                100 to get the hike amount, then add it to your current salary.
                For example, a 20% hike on 500,000 gives a hike of 100,000,
                making the new salary 600,000. Or simply use our calculator
                above for instant results.
              </p>
            )}
          </div>

          <div className="faq-item">
            <h3 onClick={() => toggleFAQ(1)}>
              What is a good salary hike percentage?
              <i
                className={`fa-solid fa-chevron-down ${openFAQ === 1 ? "rotate" : ""}`}
              ></i>
            </h3>
            {openFAQ === 1 && (
              <p>
                A hike of 10% or above is generally considered good for an
                internal appraisal. Anything above 15% is excellent within the
                same company. When switching jobs, a 25% to 40% hike is common
                and reasonable to expect based on your skills and market demand.
              </p>
            )}
          </div>

          <div className="faq-item">
            <h3 onClick={() => toggleFAQ(2)}>
              How do I calculate hike percentage between two salaries?
              <i
                className={`fa-solid fa-chevron-down ${openFAQ === 2 ? "rotate" : ""}`}
              ></i>
            </h3>
            {openFAQ === 2 && (
              <p>
                Use this formula: Hike % = [(New Salary − Old Salary) ÷ Old
                Salary] × 100. For example, going from 400,000 to 480,000 means
                a hike of (80,000 ÷ 400,000) × 100 = 20%.
              </p>
            )}
          </div>

          <div className="faq-item">
            <h3 onClick={() => toggleFAQ(3)}>
              Should I switch jobs for a higher salary hike?
              <i
                className={`fa-solid fa-chevron-down ${openFAQ === 3 ? "rotate" : ""}`}
              ></i>
            </h3>
            {openFAQ === 3 && (
              <p>
                Switching jobs is one of the fastest ways to get a significant
                salary increase. Many professionals get 30% to 50% more by
                switching compared to the 10% to 12% internal hike. However,
                also consider job stability, growth opportunities, culture, and
                benefits before making a decision purely based on salary.
              </p>
            )}
          </div>

          <div className="faq-item">
            <h3 onClick={() => toggleFAQ(4)}>
              Is a 10% salary hike good in 2025?
              <i
                className={`fa-solid fa-chevron-down ${openFAQ === 4 ? "rotate" : ""}`}
              ></i>
            </h3>
            {openFAQ === 4 && (
              <p>
                In 2025, with inflation rates in many countries hovering between
                4% and 7%, a 10% hike gives you a real increase in purchasing
                power of about 3% to 6%. It is a decent hike but not
                exceptional. High performers in competitive industries should
                aim for 15% or more to stay ahead of inflation and growing
                market salaries.
              </p>
            )}
          </div>

          <div className="faq-item">
            <h3 onClick={() => toggleFAQ(5)}>
              How much salary hike should I ask for when switching jobs?
              <i
                className={`fa-solid fa-chevron-down ${openFAQ === 5 ? "rotate" : ""}`}
              ></i>
            </h3>
            {openFAQ === 5 && (
              <p>
                When switching jobs, asking for 25% to 40% above your current
                salary is common and widely accepted in most industries. If you
                have a rare skill set or multiple competing offers, you can
                negotiate even higher. Always research the market rate for your
                role first, and never disclose your current salary unless
                required.
              </p>
            )}
          </div>
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
    </>
  );
}
