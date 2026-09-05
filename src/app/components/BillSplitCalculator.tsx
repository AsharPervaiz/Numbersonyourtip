"use client";
import React, { useState } from "react";
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

  /* ── FAQ data (also used for JSON-LD schema) ── */
  const faqs: [string, string][] = [
    [
      "Should I tip on the pre-tax or post-tax total?",
      "Pre-tax is the more common convention, since the tax is not part of the service. On a 200 subtotal with 10% tax, a 20% tip comes to 40 pre-tax and 44 post-tax, giving totals of 260 or 264. The difference is small enough not to argue about and large enough to explain why two people using different apps get different answers from the same receipt.",
    ],
    [
      "How do I split a bill when everyone ordered different amounts?",
      "Assign each person their own items, divide any shared dishes among the people who actually ate them, then apply tax and tip to each person in proportion to their own subtotal. The step people skip is that last one — itemising the food and then splitting the tip equally quietly moves money from the light eaters to the heavy ones, which defeats the purpose.",
    ],
    [
      "How should we handle drinks when someone is not drinking?",
      "Split the drinks separately among the people who had them, then split the food however the group prefers. Alcohol is usually the single largest distortion on a restaurant bill, and this is the one adjustment almost everyone accepts without needing a discussion.",
    ],
    [
      "Who pays the extra cent when the split does not divide evenly?",
      "Someone has to. Three people splitting 100 each owe 33.333, so either everyone rounds up to 33.34 and the payer keeps the two-cent surplus, or one person covers the remainder while the others pay 33.33. For a group that eats together often, rotating who absorbs it is simpler than recalculating every time.",
    ],
    [
      "How do I work out a tip in my head?",
      "Move the decimal point one place left for ten percent, double it for twenty, and add half of the ten percent figure for fifteen. On a 68 bill that gives 6.80, 13.60 and 10.20. For the split itself, round the total up to something divisible by your group size first — a 137 bill among four is awkward, while treating it as 140 gives 35 each with a small surplus toward the tip.",
    ],
    [
      "Someone arrived late. How should we charge them?",
      "For what they actually had, rather than prorating by how long they were there. Time-based apportionment sounds fairer than it is: it is fiddly to work out, easy to argue about, and rarely matches what anyone consumed. Itemising the latecomer's order and splitting the rest is faster and less contentious.",
    ],
    [
      "Is an equal split ever unfair?",
      "It is fine when orders are comparable, and it becomes unfair when one person had three courses and wine while another had soup. The argument that it averages out over time only holds for a group that eats together regularly — for a one-off gathering there is no future meal to balance it against.",
    ],
    [
      "Do I still tip if a service charge is on the bill?",
      "An additional tip is discretionary once a service charge has been added, and the charge is easy to miss on a long receipt. Check the itemised lines before calculating anything, since tipping on top of an included service charge is a common and entirely avoidable overpayment.",
    ],
    [
      "How do we split when one person is paying for a child?",
      "Count them as two people rather than one. Splitting by heads present at the table rather than by people fed is a common slip when children are eating, and it quietly shifts the cost of the extra meal onto everyone else.",
    ],
  ];

  return (
    <>
      {/* FAQ JSON-LD schema for rich results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map(([q, a]) => ({
              "@type": "Question",
              name: q,
              acceptedAnswer: { "@type": "Answer", text: a },
            })),
          }),
        }}
      />

      <div className="page-layout single-page-padding">
        <div className="single-page-padding">
          <h1>
            Bill Split Calculator — Equal, Itemised or Proportional
          </h1>
          <p>
            Split any restaurant bill equally or by exact orders, add the tip,
            and see what each person owes — instantly, with no signup and no
            math in your head. Works for groups of 2 to 20 people, any currency,
            any tip rate.
          </p>

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
                    Enter each person&apos;s order amount below
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

                {result.mode === "equal" && (
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
                          <div>Each Person&apos;s Tip:</div>
                          <div>
                            <strong style={{ color: "green" }}>
                              + {fmt(result.perPersonTip)}
                            </strong>
                          </div>
                        </>
                      )}

                      <div style={{ fontWeight: 700 }}>
                        Each Person&apos;s Total:
                      </div>
                      <div>
                        <strong style={{ fontSize: "1.1em" }}>
                          {fmt(result.perPersonTotal)}
                        </strong>
                      </div>
                    </div>
                  </div>
                )}

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
                        <React.Fragment key={i}>
                          <div>{c.name}</div>
                          <div style={{ textAlign: "right" }}>
                            {fmt(c.subtotal)}
                          </div>
                          <div style={{ textAlign: "right", color: "green" }}>
                            + {fmt(c.tip)}
                          </div>
                          <div style={{ textAlign: "right", fontWeight: 700 }}>
                            {fmt(c.total)}
                          </div>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

        {/* ---- SEO CONTENT ---- */}

        <h2>Equal Is Simple. Fair Is Sometimes Different.</h2>
        <p>
          Splitting a bill equally is the default because it is fast and because
          proposing anything else feels awkward. It is the right answer when
          everyone ordered roughly comparably. It stops being the right answer
          the moment one person had a starter, three courses and half the wine
          while another had soup and tap water.
        </p>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Method</th>
                <th>Works well when</th>
                <th>Breaks down when</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Equal split</td>
                <td>Orders are similar, or the group eats together often</td>
                <td>One or two people ordered far more or far less</td>
              </tr>
              <tr>
                <td>Itemised split</td>
                <td>Orders differ substantially, or someone is on a budget</td>
                <td>
                  Many shared dishes, which have to be divided separately anyway
                </td>
              </tr>
              <tr>
                <td>Proportional split</td>
                <td>
                  Mostly shared food, but with clearly unequal participation
                </td>
                <td>
                  Nobody wants to work out percentages at the end of a meal
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          The argument for equal splitting over many meals is that it averages
          out — you overpay one week and underpay the next. That works for a
          regular group and not at all for a one-off gathering of people who will
          not eat together again.
        </p>

        <h2>Tip and Tax: What Gets Charged on What</h2>
        <p>
          The order of operations changes the total, and this is where the
          arithmetic genuinely matters.
        </p>
        <pre>
          Subtotal → the food and drink{"\n"}+ Tax, calculated on the subtotal
          {"\n"}+ Tip, calculated on the subtotal or on the taxed total{"\n"}=
          What the group pays
        </pre>
        <p>
          On a 200 subtotal with 10% tax and a 20% tip, tipping on the pre-tax
          figure gives 200 + 20 + 40 = 260. Tipping on the post-tax figure gives
          200 + 20 + 44 = 264. Four units on a 200 meal is not worth an argument,
          but it explains why two people using different apps get different
          totals from the same receipt.
        </p>
        <p>
          The convention worth knowing is that tipping on the pre-tax subtotal is
          the more common practice, since the tax is not part of the service.
          Where a service charge has already been added to the bill, an
          additional tip is discretionary rather than expected — and the charge
          being on the bill is easy to miss.
        </p>

        <h2>Itemising Properly, Including Shared Dishes</h2>
        <p>
          The mistake in itemised splitting is handling shared items badly.
          Assign what each person ordered, divide shared dishes among the people
          who actually ate them, then apply tax and tip to each person in
          proportion to their own subtotal rather than equally.
        </p>
        <pre>
          Each person&apos;s share ={"\n"}  (their items + their portion of
          shared items){"\n"}  × (1 + tax rate){"\n"}  × (1 + tip rate)
        </pre>
        <p>
          Applying tip and tax proportionally is the step people skip. Splitting
          the food itemised and then dividing the tip equally quietly transfers
          money from the light eaters to the heavy ones, which defeats the point
          of itemising in the first place.
        </p>
        <p>
          A worked example. Three people: A orders 20, B orders 45, C orders 35,
          and they share a 30 platter equally. Subtotals become 30, 55 and 45,
          totalling 130. With 8% tax and an 18% tip on the pre-tax amount, the
          multiplier is 1.08 plus 0.18 of the subtotal — so A pays 30 × 1.26 =
          37.80, B pays 69.30, and C pays 56.70.
        </p>

        <h2>The Rounding Problem</h2>
        <p>
          Three people splitting 100 each owe 33.333… and no arrangement of
          coins produces that. Somebody has to absorb the difference.
        </p>
        <ul className="custom-list">
          <li>
            <strong>Round everyone up and let the payer keep the excess.</strong>{" "}
            Three payments of 33.34 total 100.02. Simple, and the payer is
            marginally ahead.
          </li>
          <li>
            <strong>Round down and have one person cover the remainder.</strong>{" "}
            Two pay 33.33 and one pays 33.34. Exact, and requires someone to
            volunteer.
          </li>
          <li>
            <strong>Let the person paying the bill absorb it.</strong> They are
            already carrying the transaction and often the loyalty points.
          </li>
        </ul>
        <p>
          For a group that eats together regularly, rotating who absorbs the
          rounding is neater than recalculating it each time. Over a year the
          amounts are trivial; the friction of deciding each time is not.
        </p>

        <h2>The Awkward Situations, Solved</h2>
        <p>
          <strong>Someone did not drink.</strong> Alcohol is usually the largest
          single distortion on a restaurant bill. Split the drinks separately
          among the people who had them, then split the food however the group
          prefers. This is the one adjustment almost everyone accepts without
          discussion.
        </p>
        <p>
          <strong>Someone arrived late or left early.</strong> Charge them for
          what they had rather than trying to prorate by time. Time-based
          apportionment sounds fair and is fiddly, contentious, and rarely
          matches what anyone consumed.
        </p>
        <p>
          <strong>One person is paying for two.</strong> Count them as two
          people, not one. Splitting a bill by heads present rather than by
          people fed is a common and expensive slip when children are at the
          table.
        </p>
        <p>
          <strong>A birthday meal.</strong> Divide the guest of honour&apos;s
          share among everyone else before splitting, rather than after — the
          arithmetic is the same but the conversation is easier when it is
          settled up front.
        </p>

        <h2>Doing It at the Table</h2>
        <p>
          Two shortcuts cover almost every situation without a phone.
        </p>
        <p>
          <strong>For a tip:</strong> ten percent is the decimal point moved one
          place left. Twenty percent is that doubled. Fifteen percent is ten
          percent plus half of it again. On a 68 bill: 6.80, then 13.60 for
          twenty percent, or 10.20 for fifteen.
        </p>
        <p>
          <strong>For the split:</strong> round the total up to something
          divisible by the group size before dividing. A 137 bill among four is
          awkward; treating it as 140 gives 35 each and leaves a small surplus
          toward the tip, which is usually the intention anyway.
        </p>
        <p>
          For splitting shared household costs rather than a single bill, the{" "}
          <Link href="/rent-calculator/" className="my-link">
            rent calculator
          </Link>{" "}
          covers dividing rent by room size or income, and the{" "}
          <Link href="/percentage-calculator/" className="my-link">
            percentage calculator
          </Link>{" "}
          handles any proportional share you need to work out separately.
        </p>
        <h2>Bill Splitting Questions</h2>

          {faqs.map(([q, a], i) => {
            const isOpen = openFAQ === i;
            return (
              <div className="faq-item" key={i}>
                <h3
                  onClick={() => toggleFAQ(i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${i}`}
                  role="button"
                  tabIndex={0}
                >
                  {q}
                  <i
                    className={`fa-solid fa-chevron-down ${isOpen ? "rotate" : ""}`}
                  ></i>
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
                <Link href="/discount-calculator/">
                  <span
                    style={{ textDecoration: "none" }}
                    className="hover-item"
                  >
                    Discount Calculator
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/vat-calculator/">
                  <span
                    style={{ textDecoration: "none" }}
                    className="hover-item"
                  >
                    VAT Calculator
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/percentage-calculator/">
                  <span
                    style={{ textDecoration: "none" }}
                    className="hover-item"
                  >
                    Percentage Calculator
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/currency-converter/">
                  <span
                    style={{ textDecoration: "none" }}
                    className="hover-item"
                  >
                    Currency Converter
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/fuel-cost-calculator/">
                  <span
                    style={{ textDecoration: "none" }}
                    className="hover-item"
                  >
                    Fuel Cost Calculator
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
