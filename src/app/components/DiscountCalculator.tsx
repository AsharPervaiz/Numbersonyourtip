"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

/* ─────────────────────────────────────────
   Types
───────────────────────────────────────── */
interface DiscountResult {
  originalPrice: number;
  discountAmount: number;
  priceAfterDiscount: number;
  taxAmount: number;
  finalPrice: number;
  totalSavings: number;
  effectiveDiscountPct: number;
  symbol: string;
  discountLabel: string;
  taxRatePct: number;
}

/* ─────────────────────────────────────────
   Pure helper
───────────────────────────────────────── */
function needleDeg(pct: number): number {
  const clamped = Math.min(Math.max(pct, 0), 100);
  return -90 + (clamped / 100) * 180;
}

/* ─────────────────────────────────────────
   DiscountResultPanel
   Gauge + meter read the effective discount —
   savings as a share of the original price —
   which is the figure a shelf label hides when
   discounts are stacked or tax is added back.
───────────────────────────────────────── */
function DiscountResultPanel({ result }: { result: DiscountResult | null }) {
  if (!result) {
    return (
      <div className="cr-panel-placeholder">
        <div className="cr-ph-icon">
          <i className="fa-solid fa-tags" aria-hidden="true" />
        </div>
        Enter a price and a discount to see what you actually pay here.
      </div>
    );
  }

  const {
    originalPrice,
    discountAmount,
    priceAfterDiscount,
    taxAmount,
    finalPrice,
    totalSavings,
    effectiveDiscountPct,
    symbol,
    discountLabel,
    taxRatePct,
  } = result;

  const money = (n: number) =>
    symbol +
    n.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const pct = Math.min(Math.max(effectiveDiscountPct, 0), 100);
  const barPct = 2 + (pct / 100) * 96;

  const depthLabel =
    pct < 10 ? "Token" : pct < 25 ? "Modest" : pct < 50 ? "Strong" : "Deep";

  const depthBadge =
    pct < 10 ? "info" : pct < 25 ? "normal" : pct < 50 ? "good" : "good";

  return (
    <div className="cr-panel">
      {/* Gauge + headline figure */}
      <div className="cr-gauge-wrap">
        <svg
          className="cr-gauge-svg"
          width="100"
          height="60"
          viewBox="0 0 120 70"
          role="img"
          aria-label={`Effective discount gauge showing ${pct.toFixed(1)} percent off`}
        >
          <defs>
            <clipPath id="disc-half">
              <rect x="0" y="0" width="120" height="65" />
            </clipPath>
          </defs>
          <circle
            cx="60"
            cy="65"
            r="52"
            fill="none"
            stroke="#B5D4F4"
            strokeWidth="12"
            strokeDasharray="33 326"
            strokeDashoffset="-163"
            clipPath="url(#disc-half)"
          />
          <circle
            cx="60"
            cy="65"
            r="52"
            fill="none"
            stroke="#C0DD97"
            strokeWidth="12"
            strokeDasharray="49 326"
            strokeDashoffset="-196"
            clipPath="url(#disc-half)"
          />
          <circle
            cx="60"
            cy="65"
            r="52"
            fill="none"
            stroke="#97C459"
            strokeWidth="12"
            strokeDasharray="82 326"
            strokeDashoffset="-245"
            clipPath="url(#disc-half)"
          />
          <circle
            cx="60"
            cy="65"
            r="52"
            fill="none"
            stroke="#4E9A51"
            strokeWidth="12"
            strokeDasharray="163 326"
            strokeDashoffset="-327"
            clipPath="url(#disc-half)"
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
              transform: `rotate(${needleDeg(pct)}deg)`,
              transition: "transform 0.5s ease",
            }}
          />
          <circle cx="60" cy="65" r="5" fill="#111111" />
        </svg>

        <div className="cr-score-block">
          <div className="cr-score">{money(finalPrice)}</div>
          <div className="cr-score-label">Final price you pay</div>
          <span className={`cr-badge ${depthBadge}`}>
            {depthLabel} discount
          </span>
        </div>
      </div>

      <hr className="cr-divider" />

      {/* Effective discount meter */}
      <div>
        <div className="cr-bar-label">
          effective discount ({pct.toFixed(1)}% of the original price)
        </div>
        <div
          className="cr-bar-track"
          style={{
            background:
              "linear-gradient(to right, #B5D4F4 0%, #C0DD97 10%, #97C459 25%, #4E9A51 100%)",
          }}
        >
          <div className="cr-bar-thumb" style={{ left: `${barPct}%` }} />
        </div>
        <div className="cr-bar-ticks">
          <span>0%</span>
          <span>10%</span>
          <span>25%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>

      <hr className="cr-divider" />

      {/* Breakdown */}
      <div className="cr-metrics-grid">
        <div className="cr-metric-card">
          <div className="cr-m-label">Original price</div>
          <div className="cr-m-value">{money(originalPrice)}</div>
          <div className="cr-m-sub">before any reduction</div>
        </div>
        <div className="cr-metric-card">
          <div className="cr-m-label">Discount ({discountLabel})</div>
          <div className="cr-m-value">− {money(discountAmount)}</div>
          <div className="cr-m-sub">taken off the price</div>
        </div>
        <div className="cr-metric-card">
          <div className="cr-m-label">After discount</div>
          <div className="cr-m-value">{money(priceAfterDiscount)}</div>
          <div className="cr-m-sub">before tax</div>
        </div>
        {taxAmount > 0 && (
          <div className="cr-metric-card">
            <div className="cr-m-label">Tax ({taxRatePct}%)</div>
            <div className="cr-m-value">+ {money(taxAmount)}</div>
            <div className="cr-m-sub">added back on</div>
          </div>
        )}
        <div className="cr-metric-card">
          <div className="cr-m-label">You save</div>
          <div className="cr-m-value">{money(totalSavings)}</div>
          <div className="cr-m-sub">{pct.toFixed(1)}% off</div>
        </div>
      </div>

      <hr className="cr-divider" />

      {/* Working shown transparently */}
      <div>
        <div className="cr-bar-label">calculation</div>
        <div className="cr-world-note">
          {money(originalPrice)} − {money(discountAmount)}
          {taxAmount > 0 ? ` + ${money(taxAmount)} tax` : ""} ={" "}
          <strong>{money(finalPrice)}</strong>
        </div>
      </div>

      {taxAmount > 0 && (
        <>
          <hr className="cr-divider" />
          <div className="cr-world-note" style={{ fontStyle: "italic" }}>
            Tax is charged on the discounted price, not the original, so the
            saving shown above is measured after tax has been added back.
          </div>
        </>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   FAQ data (also used to build the FAQPage
   JSON-LD schema, so schema and on-page copy
   always match exactly)
───────────────────────────────────────── */
const FAQ_DATA: [string, string][] = [
  [
    "Is 30% off then an extra 20% off the same as 50% off?",
    "No, it is 44% off. The second discount applies to the already-reduced price rather than the original: 100 becomes 70, then 70 becomes 56. The shortcut is to multiply the multipliers — 0.70 × 0.80 = 0.56, so you pay 56% and save 44%. Stacked discounts always come to less than the sum of the parts, and the gap widens as the discounts grow.",
  ],
  [
    "Does the order of two discounts matter?",
    "No. Applying 30% then 20% gives exactly the same result as 20% then 30%, because multiplying the two multipliers is commutative. If a retailer suggests one order works out better for you, the arithmetic says otherwise — though the order can matter if one discount applies only to certain items rather than the whole basket.",
  ],
  [
    "How do I find the original price from a sale price?",
    "Divide by one minus the discount rate. An item at 63 after 30% off was 63 ÷ 0.70 = 90. Adding 30% back to 63 gives 81.90, which is wrong, because the discount was calculated on the larger original figure rather than on the reduced one. Reversing a percentage is always a division.",
  ],
  [
    "How do I work out what percentage off something is?",
    "Divide the saving by the original price and multiply by 100. An item reduced from 90 to 63 has saved 27, and 27 ÷ 90 gives 30%. The common slip is dividing by the sale price instead, which would give 43% — always divide by what the price started at.",
  ],
  [
    "Can two 50% discounts make something free?",
    "No, they make it 75% off. Each discount only removes half of what remains, so 100 becomes 50 and then 25. No sequence of percentage discounts below 100% can ever reach zero, which is a useful sanity check whenever stacked offers look too good.",
  ],
  [
    "Why is a 50% markup not reversed by a 50% discount?",
    "Because the two percentages are calculated on different bases. Marking 100 up by 50% gives 150, and taking 50% off 150 gives 75 — below where you started. Reversing a 50% markup actually needs a 33.3% discount. This is also why an item marked up 100% and then sold at half price is back exactly at its original price while appearing to be a bargain.",
  ],
  [
    "What is the quickest way to calculate a discount mentally?",
    "Think in multipliers rather than subtractions. Ten percent off is × 0.9, twenty percent is × 0.8, twenty-five percent is × 0.75 and thirty percent is × 0.7. One multiplication replaces working out the saving and then subtracting it, which removes an intermediate number you can mis-copy — and it makes stacked offers trivial.",
  ],
  [
    "How do I tell whether a discount is genuinely a good deal?",
    "Compare against what the same item costs elsewhere today rather than against the crossed-out reference price, which the seller sets. Work out the unit price by weight, volume or count, since a larger discounted pack is not automatically better value. And include delivery or the cost of a trip, which can absorb the whole saving.",
  ],
  [
    "Should I buy something because it is heavily discounted?",
    "Only if you were going to buy it anyway. A discount reduces what you spend on a planned purchase and increases what you spend on an unplanned one. Spending 60 to save 40 on something you did not need leaves you 60 poorer, not 40 richer, however large the percentage on the label.",
  ],
];

export default function DiscountCalculator() {
  /* ---- STATE ---- */
  const [originalPrice, setOriginalPrice] = useState("");
  const [discountValue, setDiscountValue] = useState("");
  const [taxRate, setTaxRate] = useState("");

  const [discountType, setDiscountType] = useState<"percent" | "flat">(
    "percent",
  );
  const [discountTypeOpen, setDiscountTypeOpen] = useState(false);

  const [currency, setCurrency] = useState("USD ($)");
  const [currencyOpen, setCurrencyOpen] = useState(false);

  const [result, setResult] = useState<DiscountResult | null>(null);

  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const toggleFAQ = (index: number) =>
    setOpenFAQ(openFAQ === index ? null : index);
  const handleFAQKey = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleFAQ(index);
    }
  };

  /* ---- COMMA HELPERS ---- */
  const addCommas = (val: string): string => {
    const cleaned = val.replace(/[^0-9.]/g, "");
    const parts = cleaned.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.length > 1 ? parts[0] + "." + parts[1] : parts[0];
  };

  const handleChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setter(addCommas(e.target.value));

  const toNum = (val: string) => {
    const s = val.replace(/,/g, "");
    return s === "" ? 0 : Number(s);
  };

  const currencySymbol = currency.includes("$")
    ? "$"
    : currency.includes("£")
      ? "£"
      : currency.includes("€")
        ? "€"
        : currency.includes("₹")
          ? "₹"
          : currency.includes("₨")
            ? "₨"
            : currency.includes("AED")
              ? "AED "
              : "$";

  const currencies = [
    "USD ($)",
    "GBP (£)",
    "EUR (€)",
    "INR (₹)",
    "PKR (₨)",
    "AED (AED)",
  ];

  /* ---- CALCULATE ---- */
  const compute = (): DiscountResult | null => {
    const price = toNum(originalPrice);
    const dVal = toNum(discountValue);
    const tax = toNum(taxRate);
    if (!price || price <= 0) return null;

    const discountAmount =
      discountType === "percent" ? (price * dVal) / 100 : dVal;

    const priceAfterDiscount = Math.max(0, price - discountAmount);
    const taxAmount = (priceAfterDiscount * tax) / 100;
    const finalPrice = priceAfterDiscount + taxAmount;
    const totalSavings = price - priceAfterDiscount;
    const effectiveDiscountPct = price > 0 ? (totalSavings / price) * 100 : 0;

    return {
      originalPrice: price,
      discountAmount,
      priceAfterDiscount,
      taxAmount,
      finalPrice,
      totalSavings,
      effectiveDiscountPct,
      symbol: currencySymbol,
      discountLabel:
        discountType === "percent" && discountValue
          ? `${discountValue}%`
          : "flat",
      taxRatePct: tax,
    };
  };

  /* The panel tracks the inputs live; the button re-runs the same
     calculation so the control still does what a user expects. */
  useEffect(() => {
    setResult(compute());
  }, [originalPrice, discountValue, taxRate, discountType, currency]);

  const calculate = () => setResult(compute());

  /* ---- CLEAR ---- */
  const handleClear = () => {
    setOriginalPrice("");
    setDiscountValue("");
    setTaxRate("");
    setDiscountType("percent");
    setCurrency("USD ($)");
    setDiscountTypeOpen(false);
    setCurrencyOpen(false);
    setResult(null);
  };

  return (
    <div className="page-layout">
      {/* FAQ JSON-LD schema for rich results */}
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
        <h1>Discount Calculator — Sale Price, Savings and Stacked Offers</h1>
        <p>
          Calculate Sale Price, Savings &amp; Final Price After Discount — Free
          &amp; Instant
        </p>

        <div className="calc-card single-calc">
          {/* Row 1 — Original Price + Discount Type */}
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
              placeholder="Original Price"
              value={originalPrice}
              onChange={handleChange(setOriginalPrice)}
              style={{ margin: 0 }}
            />

            {/* Discount Type Dropdown */}
            <div
              className="modern-dropdown"
              onClick={() => setDiscountTypeOpen(!discountTypeOpen)}
              style={{ margin: 0 }}
            >
              {discountType === "percent"
                ? "Percentage Discount (%)"
                : "Flat Amount Off"}
              <span className="dropdown-indicator">▼</span>
              {discountTypeOpen && (
                <ul className="dropdown-list">
                  <li
                    onClick={() => {
                      setDiscountType("percent");
                      setDiscountTypeOpen(false);
                    }}
                  >
                    Percentage Discount (%)
                  </li>
                  <li
                    onClick={() => {
                      setDiscountType("flat");
                      setDiscountTypeOpen(false);
                    }}
                  >
                    Flat Amount Off
                  </li>
                </ul>
              )}
            </div>
          </div>

          {/* Row 2 — Discount Value + Tax Rate */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "10px",
              marginTop: "10px",
            }}
          >
            <input
              className="calc-input"
              type="text"
              inputMode="decimal"
              placeholder={
                discountType === "percent"
                  ? "Discount Percentage (e.g. 20)"
                  : "Flat Discount Amount (e.g. 500)"
              }
              value={discountValue}
              onChange={handleChange(setDiscountValue)}
              style={{ margin: 0 }}
            />
            <input
              className="calc-input"
              type="text"
              inputMode="decimal"
              placeholder="Tax / GST / VAT Rate % — optional"
              value={taxRate}
              onChange={handleChange(setTaxRate)}
              style={{ margin: 0 }}
            />
          </div>

          {/* Row 3 — Currency */}
          <div style={{ marginTop: "10px" }}>
            <div
              className="modern-dropdown"
              onClick={() => setCurrencyOpen(!currencyOpen)}
              style={{ margin: 0 }}
            >
              {currency}
              <span className="dropdown-indicator">▼</span>
              {currencyOpen && (
                <ul className="dropdown-list">
                  {currencies.map((c) => (
                    <li
                      key={c}
                      onClick={() => {
                        setCurrency(c);
                        setCurrencyOpen(false);
                      }}
                    >
                      {c}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <button className="calc-button" onClick={calculate}>
              Calculate
            </button>
            <button className="calc-button calc-clear" onClick={handleClear}>
              Clear
            </button>
          </div>
        </div>

        {/* Mobile-only result panel */}
        <div className="cr-mobile-slot">
          <DiscountResultPanel result={result} />
        </div>

        {/* ---- SEO CONTENT ---- */}

        <h2>Two Ways to Get the Same Answer, and One Is Faster</h2>
        <p>
          A single discount can be worked out in two steps or one, and the
          one-step version is both quicker and less error-prone because it
          removes an intermediate figure you can mis-copy.
        </p>
        <pre>
          Two steps: saving = price × rate ÷ 100, then final = price − saving
          {"\n"}One step: final = price × (1 − rate ÷ 100)
        </pre>
        <p>
          A 40 item at 25% off is 40 × 0.75 = 30. The multiplier is worth
          learning as a reflex: 10% off is × 0.9, 20% off is × 0.8, 25% is ×
          0.75, and 30% is × 0.7. Once you think in multipliers rather than
          subtractions, stacked offers become straightforward too.
        </p>

        <h2>Stacked Discounts Do Not Add Up</h2>
        <p>
          This is the one piece of discount arithmetic that genuinely costs
          people money, because the intuitive answer is always too generous.
        </p>
        <p>
          &quot;30% off, then an extra 20% off at the till&quot; is not 50% off.
          The second discount applies to the already-reduced price, not to the
          original.
        </p>
        <pre>
          100 × 0.70 = 70{"\n"}70 × 0.80 = 56{"\n"}
          {"\n"}Total reduction: 44%, not 50%
        </pre>
        <p>
          The shortcut is to multiply the multipliers: 0.70 × 0.80 = 0.56, so
          you pay 56% of the original and save 44%. Stacking always produces
          less than the sum of the parts, and the gap widens as the discounts
          get larger.
        </p>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Stacked offer</th>
                <th>Sounds like</th>
                <th>Actually is</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>10% then 10%</td>
                <td>20% off</td>
                <td>19% off</td>
              </tr>
              <tr>
                <td>20% then 20%</td>
                <td>40% off</td>
                <td>36% off</td>
              </tr>
              <tr>
                <td>30% then 20%</td>
                <td>50% off</td>
                <td>44% off</td>
              </tr>
              <tr>
                <td>50% then 50%</td>
                <td>100% off</td>
                <td>75% off</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          The last row makes the principle unmistakable. Two halvings can never
          reach free, because each one only removes half of what remains.
        </p>
        <p>
          A useful corollary: the order does not matter. Applying 30% then 20%
          gives exactly the same result as 20% then 30%, because multiplication
          is commutative. If a shop insists one order is better for you, the
          arithmetic disagrees.
        </p>

        <h2>Working Back to the Original Price</h2>
        <p>
          Knowing the sale price and the discount, the original is a division —
          never the discount added back on.
        </p>
        <pre>Original = Sale price ÷ (1 − rate ÷ 100)</pre>
        <p>
          An item at 63 after 30% off was 63 ÷ 0.70 = 90. Adding 30% to 63 gives
          81.90, which is wrong because the 30% was calculated on the larger
          original figure rather than on the reduced one.
        </p>
        <p>
          The same division answers the other common question — what percentage
          off is this? Divide the saving by the original price: an item reduced
          from 90 to 63 has saved 27, and 27 ÷ 90 = 30%.
        </p>

        <h2>Discount and Markup Are Not Symmetrical</h2>
        <p>
          Adding a percentage and then removing the same percentage does not
          return you to where you started, because the two percentages are
          calculated on different bases.
        </p>
        <pre>
          100 marked up 50% → 150{"\n"}150 discounted 50% → 75{"\n"}
          {"\n"}To reverse a 50% markup you need a 33.3% discount
        </pre>
        <p>
          This is worth knowing when a price is inflated before a sale. An item
          marked up 50% and then advertised at &quot;50% off&quot; ends up below
          its original price, but an item marked up 100% and then sold at 50%
          off is back exactly where it started while appearing to be half price.
        </p>

        <h2>Is It Actually a Good Deal?</h2>
        <p>
          The percentage tells you how the price changed, not whether the price
          is good. Three checks separate the two.
        </p>
        <ul className="custom-list">
          <li>
            <strong>
              Compare against the price elsewhere, not the reference price.
            </strong>{" "}
            The crossed-out figure on the label is set by the seller. The only
            meaningful comparison is what the same item costs somewhere else
            today.
          </li>
          <li>
            <strong>Work out the unit price.</strong> A larger pack at a
            discount is not automatically better value. Divide by weight, volume
            or count and compare the per-unit figures — this reverses the
            ranking more often than people expect.
          </li>
          <li>
            <strong>Include the cost of getting it.</strong> Delivery, a trip
            across town, or a minimum spend that pushes you into buying
            something else can absorb the whole saving.
          </li>
        </ul>
        <p>
          The framing that helps most is that a discount is a reduction in what
          you spend only if you were going to buy the thing anyway. Spending 60
          to save 40 on something you did not need leaves you 60 down, not 40
          up.
        </p>
        <p>
          For percentage arithmetic in other contexts — increases, reverse
          percentages, and the difference between percent and percentage points
          — see the{" "}
          <Link href="/percentage-calculator/" className="my-link">
            percentage calculator
          </Link>
          . If the price includes sales tax that you need to separate out, the{" "}
          <Link href="/vat-calculator/" className="my-link">
            VAT calculator
          </Link>{" "}
          handles that.
        </p>
        <h2>Discount Questions</h2>

        {FAQ_DATA.map(([q, a], i) => {
          const isOpen = openFAQ === i;
          return (
            <div className="faq-item" key={i}>
              <h3
                onClick={() => toggleFAQ(i)}
                onKeyDown={(e) => handleFAQKey(e, i)}
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
          <DiscountResultPanel result={result} />
        </div>

        <div className="sidebar-box">
          <p style={{ fontSize: "20px", fontWeight: 600 }}>
            Related Calculators
          </p>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li>
              <Link href="/salary-hike-calculator/">
                <span style={{ textDecoration: "none" }} className="hover-item">
                  Salary Hike Calculator
                </span>
              </Link>
            </li>
            <li>
              <Link href="/bill-split-calculator/">
                <span style={{ textDecoration: "none" }} className="hover-item">
                  Bill Split Calculator
                </span>
              </Link>
            </li>
            <li>
              <Link href="/net-worth-calculator/">
                <span style={{ textDecoration: "none" }} className="hover-item">
                  Net Worth Calculator
                </span>
              </Link>
            </li>
            <li>
              <Link href="/freelancer-tax-calculator/">
                <span style={{ textDecoration: "none" }} className="hover-item">
                  Freelancer Tax Calculator
                </span>
              </Link>
            </li>
            <li>
              <Link href="/emi-calculator/">
                <span style={{ textDecoration: "none" }} className="hover-item">
                  EMI Calculator
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
