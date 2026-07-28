"use client";
import { useState } from "react";
import Link from "next/link";

type Person = {
  id: number;
  name: string;
  amount: string;
  includesTip: boolean;
};

export default function BillSplitCalculator() {
  /* ---- BILL STATE ---- */
  const [billTotal, setBillTotal] = useState("");
  const [tipPercent, setTipPercent] = useState("");
  const [numPeople, setNumPeople] = useState("2");

  /* ---- SPLIT MODE ---- */
  const [splitMode, setSplitMode] = useState<"equal" | "custom">("equal");
  const [splitModeOpen, setSplitModeOpen] = useState(false);

  /* ---- TIP MODE ---- */
  const [tipMode, setTipMode] = useState<"shared" | "individual">("shared");
  const [tipModeOpen, setTipModeOpen] = useState(false);

  /* ---- CUSTOM PEOPLE ---- */
  const [people, setPeople] = useState<Person[]>([
    { id: 1, name: "Person 1", amount: "", includesTip: true },
    { id: 2, name: "Person 2", amount: "", includesTip: true },
  ]);

  /* ---- RESULT ---- */
  const [result, setResult] = useState<{
    tipAmount: number;
    totalWithTip: number;
    perPersonBase: number;
    perPersonTip: number;
    perPersonTotal: number;
    customSplit: {
      name: string;
      subtotal: number;
      tip: number;
      total: number;
    }[];
    mode: "equal" | "custom";
  } | null>(null);

  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const toggleFAQ = (index: number) =>
    setOpenFAQ(openFAQ === index ? null : index);

  /* ---- HELPERS ---- */
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

  const fmt = (n: number) =>
    n.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  /* ---- SYNC PEOPLE COUNT with numPeople input ---- */
  const handleNumPeopleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    setNumPeople(val);
    const n = Math.max(1, Math.min(20, Number(val) || 2));
    setPeople((prev) => {
      if (n > prev.length) {
        const added = Array.from({ length: n - prev.length }, (_, i) => ({
          id: prev.length + i + 1,
          name: `Person ${prev.length + i + 1}`,
          amount: "",
          includesTip: true,
        }));
        return [...prev, ...added];
      }
      return prev.slice(0, n);
    });
  };

  const updatePerson = (
    id: number,
    field: keyof Person,
    value: string | boolean,
  ) => {
    setPeople((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              [field]: field === "amount" ? addCommas(String(value)) : value,
            }
          : p,
      ),
    );
  };

  /* ---- CALCULATE ---- */
  const calculate = () => {
    const bill = toNum(billTotal);
    const tip = toNum(tipPercent);
    if (!bill) return;

    const tipAmount = (bill * tip) / 100;
    const totalWithTip = bill + tipAmount;

    if (splitMode === "equal") {
      const n = Math.max(1, Number(numPeople) || 2);
      const perPersonBase = bill / n;
      const perPersonTip = tipAmount / n;
      const perPersonTotal = totalWithTip / n;
      setResult({
        tipAmount,
        totalWithTip,
        perPersonBase,
        perPersonTip,
        perPersonTotal,
        customSplit: [],
        mode: "equal",
      });
    } else {
      // Custom — each person pays their entered amount
      const customSplit = people.map((p) => {
        const subtotal = toNum(p.amount);
        const personTip =
          tipMode === "individual" && p.includesTip
            ? (subtotal / bill) * tipAmount
            : 0;
        return {
          name: p.name || `Person ${p.id}`,
          subtotal,
          tip: personTip,
          total: subtotal + personTip,
        };
      });

      // If shared tip mode, distribute tip equally among all
      const sharedTipPerPerson =
        tipMode === "shared" ? tipAmount / people.length : 0;
      const finalSplit =
        tipMode === "shared"
          ? customSplit.map((c) => ({
              ...c,
              tip: sharedTipPerPerson,
              total: c.subtotal + sharedTipPerPerson,
            }))
          : customSplit;

      setResult({
        tipAmount,
        totalWithTip,
        perPersonBase: 0,
        perPersonTip: 0,
        perPersonTotal: 0,
        customSplit: finalSplit,
        mode: "custom",
      });
    }
  };

  /* ---- CLEAR ---- */
  const handleClear = () => {
    setBillTotal("");
    setTipPercent("");
    setNumPeople("2");
    setSplitMode("equal");
    setTipMode("shared");
    setSplitModeOpen(false);
    setTipModeOpen(false);
    setPeople([
      { id: 1, name: "Person 1", amount: "", includesTip: true },
      { id: 2, name: "Person 2", amount: "", includesTip: true },
    ]);
    setResult(null);
  };

  return (
    <>
      <div className="page-layout single-page-padding">
        <div className="single-page-padding">
          <h1>Bill Split Calculator with Tip</h1>
          <p>Split Any Bill Equally or Unevenly — With Tip — Instantly Free</p>

          <div className="calc-card single-calc">
            {/* Row 1 — Bill Total + Tip % */}
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
                placeholder="Total Bill Amount"
                value={billTotal}
                onChange={handleChange(setBillTotal)}
                style={{ margin: 0 }}
              />
              <input
                className="calc-input"
                type="text"
                inputMode="decimal"
                placeholder="Tip Percentage (%) — optional"
                value={tipPercent}
                onChange={handleChange(setTipPercent)}
                style={{ margin: 0 }}
              />
            </div>

            {/* Row 2 — Split Mode + Tip Mode */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px",
                marginTop: "10px",
              }}
            >
              <div
                className="modern-dropdown"
                onClick={() => setSplitModeOpen(!splitModeOpen)}
                style={{ margin: 0 }}
              >
                {splitMode === "equal"
                  ? "Split Equally"
                  : "Split Unevenly (Custom)"}
                <span className="dropdown-indicator">▼</span>
                {splitModeOpen && (
                  <ul className="dropdown-list">
                    <li
                      onClick={() => {
                        setSplitMode("equal");
                        setSplitModeOpen(false);
                      }}
                    >
                      Split Equally
                    </li>
                    <li
                      onClick={() => {
                        setSplitMode("custom");
                        setSplitModeOpen(false);
                      }}
                    >
                      Split Unevenly (Custom)
                    </li>
                  </ul>
                )}
              </div>

              <div
                className="modern-dropdown"
                onClick={() => setTipModeOpen(!tipModeOpen)}
                style={{ margin: 0 }}
              >
                {tipMode === "shared"
                  ? "Tip Split Equally"
                  : "Tip by What You Ordered"}
                <span className="dropdown-indicator">▼</span>
                {tipModeOpen && (
                  <ul className="dropdown-list">
                    <li
                      onClick={() => {
                        setTipMode("shared");
                        setTipModeOpen(false);
                      }}
                    >
                      Tip Split Equally
                    </li>
                    <li
                      onClick={() => {
                        setTipMode("individual");
                        setTipModeOpen(false);
                      }}
                    >
                      Tip by What You Ordered
                    </li>
                  </ul>
                )}
              </div>
            </div>

            {/* Equal split — number of people */}
            {splitMode === "equal" && (
              <div style={{ marginTop: "10px" }}>
                <input
                  className="calc-input"
                  type="text"
                  inputMode="numeric"
                  placeholder="Number of People"
                  value={numPeople}
                  onChange={handleNumPeopleChange}
                  style={{ margin: 0, width: "100%" }}
                />
              </div>
            )}

            {/* Custom split — per person rows */}
            {splitMode === "custom" && (
              <div style={{ marginTop: "10px" }}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "10px",
                    marginBottom: "8px",
                  }}
                >
                  <input
                    className="calc-input"
                    type="text"
                    inputMode="numeric"
                    placeholder="Number of People"
                    value={numPeople}
                    onChange={handleNumPeopleChange}
                    style={{ margin: 0 }}
                  />
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      fontSize: "13px",
                      color: "#ffffff",
                    }}
                  >
                    Enter each person's order amount below
                  </div>
                </div>

                {people.map((p) => (
                  <div
                    key={p.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "10px",
                      marginBottom: "8px",
                    }}
                  >
                    <input
                      className="calc-input"
                      type="text"
                      placeholder={`Name (e.g. ${p.name})`}
                      value={p.name}
                      onChange={(e) =>
                        updatePerson(p.id, "name", e.target.value)
                      }
                      style={{ margin: 0 }}
                    />
                    <input
                      className="calc-input"
                      type="text"
                      inputMode="decimal"
                      placeholder="Their order amount"
                      value={p.amount}
                      onChange={(e) =>
                        updatePerson(p.id, "amount", e.target.value)
                      }
                      style={{ margin: 0 }}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Buttons */}
            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <button className="calc-button" onClick={calculate}>
                Calculate
              </button>
              <button className="calc-button calc-clear" onClick={handleClear}>
                Clear
              </button>
            </div>

            {/* Result */}
            {result && (
              <div className="calc-result" style={{ lineHeight: "2" }}>
                {/* Summary row always shown */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "6px 20px",
                    marginBottom: "8px",
                  }}
                >
                  <div>Total Bill:</div>
                  <div>
                    <strong>{fmt(toNum(billTotal))}</strong>
                  </div>

                  {result.tipAmount > 0 && (
                    <>
                      <div>Tip ({tipPercent}%):</div>
                      <div>
                        <strong style={{ color: "green" }}>
                          + {fmt(result.tipAmount)}
                        </strong>
                      </div>
                    </>
                  )}

                  <div style={{ fontWeight: 600 }}>Total with Tip:</div>
                  <div>
                    <strong>{fmt(result.totalWithTip)}</strong>
                  </div>
                </div>

                {/* Equal split breakdown */}
                {result.mode === "equal" && (
                  <>
                    <div
                      style={{
                        borderTop: "1px solid #e5e7eb",
                        paddingTop: "8px",
                      }}
                    >
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "6px 20px",
                        }}
                      >
                        <div>Each Person Pays (Bill):</div>
                        <div>
                          <strong>{fmt(result.perPersonBase)}</strong>
                        </div>

                        {result.perPersonTip > 0 && (
                          <>
                            <div>Each Person's Tip:</div>
                            <div>
                              <strong style={{ color: "green" }}>
                                + {fmt(result.perPersonTip)}
                              </strong>
                            </div>
                          </>
                        )}

                        <div style={{ fontWeight: 700 }}>
                          Each Person's Total:
                        </div>
                        <div>
                          <strong style={{ fontSize: "1.1em" }}>
                            {fmt(result.perPersonTotal)}
                          </strong>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Custom split breakdown */}
                {result.mode === "custom" && result.customSplit.length > 0 && (
                  <div
                    style={{
                      borderTop: "1px solid #e5e7eb",
                      paddingTop: "8px",
                    }}
                  >
                    <div style={{ fontWeight: 600, marginBottom: "6px" }}>
                      Per Person Breakdown:
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 1fr 1fr",
                        gap: "4px 12px",
                        fontSize: "0.9em",
                      }}
                    >
                      <div style={{ fontWeight: 600 }}>Name</div>
                      <div style={{ fontWeight: 600, textAlign: "right" }}>
                        Order
                      </div>
                      <div style={{ fontWeight: 600, textAlign: "right" }}>
                        Tip
                      </div>
                      <div style={{ fontWeight: 600, textAlign: "right" }}>
                        Total
                      </div>
                      {result.customSplit.map((c, i) => (
                        <>
                          <div key={`name-${i}`}>{c.name}</div>
                          <div key={`sub-${i}`} style={{ textAlign: "right" }}>
                            {fmt(c.subtotal)}
                          </div>
                          <div
                            key={`tip-${i}`}
                            style={{ textAlign: "right", color: "green" }}
                          >
                            + {fmt(c.tip)}
                          </div>
                          <div
                            key={`tot-${i}`}
                            style={{ textAlign: "right", fontWeight: 700 }}
                          >
                            {fmt(c.total)}
                          </div>
                        </>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ---- SEO CONTENT ---- */}
          <h2>What is a Bill Split Calculator?</h2>
          <p>
            A bill split calculator helps you divide a restaurant bill, dinner
            tab, or any shared expense fairly among a group of people. Whether
            you are splitting equally with friends or dividing unevenly because
            different people ordered different things, this tool does the math
            instantly — including tip. No more awkward mental arithmetic at the
            table or arguments about who owes what.
          </p>

          <h2>How to Split a Bill with Tip</h2>
          <p>
            Splitting a bill with tip involves two steps: first calculating the
            tip amount on top of the original bill, then dividing the total
            among the people sharing it. Our calculator handles both steps at
            once. You can also choose whether everyone splits the tip equally or
            whether each person's tip is proportional to what they ordered —
            which is the fairest method when orders vary widely.
          </p>

          <h2>Equal Split vs Uneven Split — Which Should You Use?</h2>

          <h3>Equal Split</h3>
          <p>
            Equal split is the simplest approach — the total bill (including
            tip) is divided by the number of people present. It works well when
            everyone ordered roughly the same amount, or when the group just
            wants to keep things simple and fast. Enter the total bill, tip
            percentage, and number of people and you get an instant answer.
          </p>

          <h3>Uneven (Custom) Split</h3>
          <p>
            Custom split is the fair approach when people ordered very different
            things — one person had a steak and cocktails, another just had a
            salad and water. Enter each person's name and the amount they
            ordered, and the calculator shows exactly what each person owes,
            including their share of the tip. This avoids the common situation
            where light eaters end up subsidising heavy spenders.
          </p>

          <h2>How is Tip Calculated?</h2>
          <p>
            Tip is calculated as a percentage of the pre-tax bill total.
            Standard tip percentages vary by country and culture. Our calculator
            lets you enter any percentage, but here are common benchmarks as a
            reference:
          </p>
          <ul className="custom-list">
            <li>
              <strong>10%</strong> — minimum tip for basic service in most
              countries
            </li>
            <li>
              <strong>15%</strong> — standard tip for good service in the US and
              Canada
            </li>
            <li>
              <strong>18%–20%</strong> — standard tip for great service in the
              US
            </li>
            <li>
              <strong>25%+</strong> — exceptional service or special occasions
            </li>
            <li>
              <strong>0%</strong> — tipping is not customary in Japan, South
              Korea, and some European countries
            </li>
          </ul>

          <h2>
            How to Split a Bill When People Drank Alcohol and Others Didn't
          </h2>
          <p>
            This is one of the most common and uncomfortable bill-splitting
            situations. The fairest solution is to use the uneven (custom) split
            option. Assign each person or subgroup what they actually consumed,
            then split the tip proportionally or equally. This way, non-drinkers
            or light eaters are not forced to cover the cost of someone else's
            alcohol or expensive dishes.
          </p>

          <h2>Bill Split Formula</h2>
          <pre>
            Tip Amount = (Bill Total × Tip%) ÷ 100{"\n"}
            Total with Tip = Bill Total + Tip Amount{"\n\n"}
            Equal Split:{"\n"}
            Each Person Pays = Total with Tip ÷ Number of People{"\n\n"}
            Custom Split:{"\n"}
            Person's Tip = (Person's Order ÷ Bill Total) × Tip Amount{"\n"}
            Person's Total = Person's Order + Person's Tip
          </pre>

          <h2>Tips for Splitting Bills Fairly in a Group</h2>
          <ul className="custom-list">
            <li>
              Always agree on the splitting method before ordering — saves
              arguments later
            </li>
            <li>
              Use custom split mode when orders vary significantly in price
            </li>
            <li>
              Split the tip equally even in custom mode unless someone is a
              known over-tipper
            </li>
            <li>
              Apps like Splitwise are great for tracking bills over multiple
              outings with the same group
            </li>
            <li>
              When in doubt, round up your contribution slightly — no one likes
              being short-changed on a group bill
            </li>
            <li>
              Tax is sometimes added automatically — check if your bill total
              already includes it before entering
            </li>
          </ul>

          <h2>Benefits of Using Our Bill Split Calculator</h2>
          <ul className="custom-list">
            <li>Handles both equal and uneven custom splits</li>
            <li>Tip can be split equally or proportionally by order amount</li>
            <li>Supports up to 20 people in a single calculation</li>
            <li>
              Shows a clear per-person breakdown with name, order, tip, and
              total
            </li>
            <li>Free, instant, no login required</li>
            <li>Works perfectly on mobile at the restaurant table</li>
          </ul>

          <h2>Frequently Asked Questions</h2>

          <div className="faq-item">
            <h3 onClick={() => toggleFAQ(0)}>
              How do I split a restaurant bill equally?
              <i
                className={`fa-solid fa-chevron-down ${openFAQ === 0 ? "rotate" : ""}`}
              ></i>
            </h3>
            {openFAQ === 0 && (
              <p>
                Enter the total bill amount and tip percentage, select "Split
                Equally", enter the number of people, and click Calculate. The
                result shows exactly how much each person pays including their
                share of the tip.
              </p>
            )}
          </div>

          <div className="faq-item">
            <h3 onClick={() => toggleFAQ(1)}>
              How do I split a bill unevenly when people ordered different
              things?
              <i
                className={`fa-solid fa-chevron-down ${openFAQ === 1 ? "rotate" : ""}`}
              ></i>
            </h3>
            {openFAQ === 1 && (
              <p>
                Select "Split Unevenly (Custom)", enter the number of people,
                then add each person's name and the amount they ordered. The
                calculator will work out each person's share including their
                proportional or equal tip automatically.
              </p>
            )}
          </div>

          <div className="faq-item">
            <h3 onClick={() => toggleFAQ(2)}>
              What is a fair tip percentage to add?
              <i
                className={`fa-solid fa-chevron-down ${openFAQ === 2 ? "rotate" : ""}`}
              ></i>
            </h3>
            {openFAQ === 2 && (
              <p>
                In the US and Canada, 15% is considered the standard minimum for
                decent service, and 18%–20% is standard for good service. In the
                UK, 10%–15% is common. In many Asian countries, tipping is not
                customary at all. You can enter any percentage in this
                calculator, including 0 if you prefer not to tip.
              </p>
            )}
          </div>

          <div className="faq-item">
            <h3 onClick={() => toggleFAQ(3)}>
              Should tip be split equally or by what each person ordered?
              <i
                className={`fa-solid fa-chevron-down ${openFAQ === 3 ? "rotate" : ""}`}
              ></i>
            </h3>
            {openFAQ === 3 && (
              <p>
                Either method is acceptable. Splitting tip equally is simpler
                and works well when orders are similar. Splitting tip
                proportionally by order amount is fairer when there is a big
                difference — someone who ordered a 5 dish meal should tip more
                than someone who had just a drink. Our calculator supports both
                options.
              </p>
            )}
          </div>

          <div className="faq-item">
            <h3 onClick={() => toggleFAQ(4)}>
              Does this calculator work for splitting other expenses too?
              <i
                className={`fa-solid fa-chevron-down ${openFAQ === 4 ? "rotate" : ""}`}
              ></i>
            </h3>
            {openFAQ === 4 && (
              <p>
                Yes. While designed for restaurant bills, this calculator works
                for splitting any shared cost — hotel rooms, taxi fares, group
                groceries, event tickets, or any other expense where multiple
                people need to divide a total fairly.
              </p>
            )}
          </div>

          <div className="faq-item">
            <h3 onClick={() => toggleFAQ(5)}>
              How many people can I split a bill between?
              <i
                className={`fa-solid fa-chevron-down ${openFAQ === 5 ? "rotate" : ""}`}
              ></i>
            </h3>
            {openFAQ === 5 && (
              <p>
                Our calculator supports splitting between up to 20 people in a
                single calculation. This covers most group dinners, parties, and
                shared expenses comfortably. For ongoing group expense tracking
                across multiple events, you may also want to use a dedicated app
                like Splitwise.
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
                <Link href="/freelancer-tax-calculator/">
                  <span
                    style={{ textDecoration: "none" }}
                    className="hover-item"
                  >
                    Freelancer Tax Calculator
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/salary-hike-calculator/">
                  <span
                    style={{ textDecoration: "none" }}
                    className="hover-item"
                  >
                    Salary Hike Calculator
                  </span>
                </Link>
              </li>
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
