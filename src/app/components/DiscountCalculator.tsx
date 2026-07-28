"use client";
import { useState } from "react";
import Link from "next/link";

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

  const [result, setResult] = useState<{
    originalPrice: number;
    discountAmount: number;
    priceAfterDiscount: number;
    taxAmount: number;
    finalPrice: number;
    totalSavings: number;
    effectiveDiscountPct: number;
  } | null>(null);

  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const toggleFAQ = (index: number) =>
    setOpenFAQ(openFAQ === index ? null : index);

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

  const fmt = (n: number) =>
    n.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

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
  const calculate = () => {
    const price = toNum(originalPrice);
    const dVal = toNum(discountValue);
    const tax = toNum(taxRate);
    if (!price) return;

    const discountAmount =
      discountType === "percent" ? (price * dVal) / 100 : dVal;

    const priceAfterDiscount = Math.max(0, price - discountAmount);
    const taxAmount = (priceAfterDiscount * tax) / 100;
    const finalPrice = priceAfterDiscount + taxAmount;
    const totalSavings = price - priceAfterDiscount;
    const effectiveDiscountPct = price > 0 ? (totalSavings / price) * 100 : 0;

    setResult({
      originalPrice: price,
      discountAmount,
      priceAfterDiscount,
      taxAmount,
      finalPrice,
      totalSavings,
      effectiveDiscountPct,
    });
  };

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
    <>
      <div className="page-layout single-page-padding">
        <div className="single-page-padding">
          <h1>Discount Calculator</h1>
          <p>
            Calculate Sale Price, Savings &amp; Final Price After Discount —
            Free &amp; Instant
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

            {/* Result */}
            {result && (
              <div className="calc-result" style={{ lineHeight: "2" }}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr",
                    gap: "6px 20px",
                  }}
                >
                  <div>Original Price:</div>
                  <div>
                    <strong>
                      {currencySymbol}
                      {fmt(result.originalPrice)}
                    </strong>
                  </div>

                  <div>
                    Discount (
                    {discountType === "percent" ? `${discountValue}%` : "Flat"}
                    ):
                  </div>
                  <div>
                    <strong style={{ color: "red" }}>
                      − {currencySymbol}
                      {fmt(result.discountAmount)}
                    </strong>
                  </div>

                  <div>Price After Discount:</div>
                  <div>
                    <strong>
                      {currencySymbol}
                      {fmt(result.priceAfterDiscount)}
                    </strong>
                  </div>

                  {result.taxAmount > 0 && (
                    <>
                      <div>Tax / GST / VAT ({taxRate}%):</div>
                      <div>
                        <strong style={{ color: "#b45309" }}>
                          + {currencySymbol}
                          {fmt(result.taxAmount)}
                        </strong>
                      </div>
                    </>
                  )}

                  <div
                    style={{
                      borderTop: "1px solid #e5e7eb",
                      paddingTop: "6px",
                      fontWeight: 600,
                    }}
                  >
                    Final Price You Pay:
                  </div>
                  <div
                    style={{
                      borderTop: "1px solid #e5e7eb",
                      paddingTop: "6px",
                    }}
                  >
                    <strong style={{ fontSize: "1.15em" }}>
                      {currencySymbol}
                      {fmt(result.finalPrice)}
                    </strong>
                  </div>

                  <div style={{ color: "green", fontWeight: 600 }}>
                    You Save:
                  </div>
                  <div>
                    <strong style={{ color: "green", fontSize: "1.05em" }}>
                      {currencySymbol}
                      {fmt(result.totalSavings)} (
                      {result.effectiveDiscountPct.toFixed(1)}% off)
                    </strong>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ---- SEO CONTENT ---- */}
          <h2>What is a Discount Calculator?</h2>
          <p>
            A discount calculator helps you instantly find out how much you save
            and what the final price is after a percentage or flat amount
            discount is applied. Whether you are shopping during a sale,
            negotiating a deal, or running a business promotion, this tool
            removes all the mental math and gives you an accurate answer in
            seconds. You can also add a tax rate to see the true final amount
            you will pay including GST, VAT, or any local tax.
          </p>

          <h2>How to Calculate a Discount</h2>
          <p>
            Calculating a discount is straightforward once you understand the
            formula. There are two types of discounts — a percentage discount
            (like 20% off) and a flat amount discount (like $50 off). Both are
            handled by this calculator. Here is how each works:
          </p>

          <h2>Discount Formulas Explained</h2>

          <h3>Percentage Discount Formula</h3>
          <pre>
            Discount Amount = (Original Price × Discount%) ÷ 100{"\n"}
            Sale Price = Original Price − Discount Amount
          </pre>
          <p>
            Example: A jacket originally costs $120 and is on 25% sale. Discount
            Amount = (120 × 25) ÷ 100 = $30. Sale Price = 120 − 30 = $90. You
            save $30.
          </p>

          <h3>Flat Amount Discount Formula</h3>
          <pre>
            Sale Price = Original Price − Flat Discount Amount{"\n"}
            Savings % = (Flat Amount ÷ Original Price) × 100
          </pre>
          <p>
            Example: A product costs $350 and has a $50 flat discount. Sale
            Price = 350 − 50 = $300. You save $50, which is a 14.3% effective
            discount.
          </p>

          <h3>Discount with Tax (GST / VAT)</h3>
          <pre>
            Price After Discount = Original Price − Discount Amount{"\n"}
            Tax Amount = (Price After Discount × Tax%) ÷ 100{"\n"}
            Final Price = Price After Discount + Tax Amount
          </pre>
          <p>
            In many countries, tax is applied after the discount is deducted,
            not on the original price. This calculator follows that correct
            method so the final price you see is as accurate as possible.
          </p>

          <h2>What is a Good Discount Percentage?</h2>
          <p>
            Discount percentages vary widely depending on the product, season,
            and industry. Here is a general guide to what different discount
            levels typically signal:
          </p>
          <ul className="custom-list">
            <li>
              <strong>5% – 10%</strong> — small loyalty or early-bird discount,
              common in subscriptions and B2B deals
            </li>
            <li>
              <strong>15% – 20%</strong> — standard promotional sale, common
              during weekends and seasonal events
            </li>
            <li>
              <strong>25% – 30%</strong> — strong sale discount, typical during
              holiday seasons and clearance events
            </li>
            <li>
              <strong>40% – 50%</strong> — major sale, end-of-season clearance,
              or product discontinuation
            </li>
            <li>
              <strong>60% – 70%+</strong> — extreme clearance, liquidation, or
              flash sales to clear stock quickly
            </li>
          </ul>

          <h2>How to Find the Original Price from a Sale Price</h2>
          <p>
            Sometimes you see a sale price and want to know the original price
            before the discount. Use this reverse discount formula:
          </p>
          <pre>Original Price = Sale Price ÷ (1 − Discount% ÷ 100)</pre>
          <p>
            Example: An item is on sale for $75 after a 25% discount. Original
            Price = 75 ÷ (1 − 0.25) = 75 ÷ 0.75 = $100. The item was originally
            $100.
          </p>

          <h2>How to Calculate What Percentage Off Something Is</h2>
          <p>
            If you know the original price and the sale price and want to find
            the discount percentage, use this formula:
          </p>
          <pre>
            Discount % = [(Original Price − Sale Price) ÷ Original Price] × 100
          </pre>
          <p>
            Example: A phone was $800 and is now $600. Discount % = [(800 − 600)
            ÷ 800] × 100 = (200 ÷ 800) × 100 = 25% off.
          </p>

          <h2>Common Discount Scenarios This Calculator Handles</h2>
          <ul className="custom-list">
            <li>What is 10% off $50? → $45 (save $5)</li>
            <li>What is 20% off $120? → $96 (save $24)</li>
            <li>What is 30% off $200? → $140 (save $60)</li>
            <li>What is 50% off $999? → $499.50 (save $499.50)</li>
            <li>$500 item with $75 flat discount → $425 (save 15%)</li>
            <li>25% off + 8% tax on $160 → $129.60 final price</li>
          </ul>

          <h2>Discount Calculator for Shopping, Business & Finance</h2>
          <p>
            This calculator is useful in many real-world situations beyond
            simple shopping. Businesses use it to calculate trade discounts on
            bulk orders. Freelancers use it to work out client discounts on
            service packages. Students use it to understand percentage
            calculations in maths. Finance professionals use it to work out bond
            discounts and present value adjustments. No matter the context, the
            underlying calculation is the same — and this tool handles it all
            instantly.
          </p>

          <h2>Black Friday, Eid, and Seasonal Sale Tips</h2>
          <p>
            During major sale events like Black Friday, Eid sales, Diwali
            offers, Christmas sales, or Amazon Prime Day, retailers often
            advertise discounts that look bigger than they are. The original
            price may have been inflated before the sale, making a 40% discount
            look impressive when the actual saving is much less. Always use a
            discount calculator to verify the real saving amount before making a
            purchase decision. Compare the final price across multiple stores to
            make sure you are genuinely getting the best deal.
          </p>

          <h2>Benefits of Using Our Discount Calculator</h2>
          <ul className="custom-list">
            <li>
              Handles both percentage and flat amount discounts in one tool
            </li>
            <li>
              Optional tax field for accurate final price including GST or VAT
            </li>
            <li>
              Shows discount amount, final price, and total savings clearly
            </li>
            <li>Supports multiple currencies — USD, GBP, EUR, INR, PKR, AED</li>
            <li>Instant results — no page reload, no signup required</li>
            <li>Works on mobile while shopping in-store or online</li>
          </ul>

          <h2>Frequently Asked Questions</h2>

          <div className="faq-item">
            <h3 onClick={() => toggleFAQ(0)}>
              How do I calculate a percentage discount?
              <i
                className={`fa-solid fa-chevron-down ${
                  openFAQ === 0 ? "rotate" : ""
                }`}
              ></i>
            </h3>
            {openFAQ === 0 && (
              <p>
                Multiply the original price by the discount percentage, then
                divide by 100 to get the discount amount. Subtract that from the
                original price to get the sale price. For example, 20% off $150
                means discount = (150 × 20) ÷ 100 = $30, so the sale price is
                $150 − $30 = $120.
              </p>
            )}
          </div>

          <div className="faq-item">
            <h3 onClick={() => toggleFAQ(1)}>
              What is 30% off $100?
              <i
                className={`fa-solid fa-chevron-down ${
                  openFAQ === 1 ? "rotate" : ""
                }`}
              ></i>
            </h3>
            {openFAQ === 1 && (
              <p>
                30% off $100 is a saving of $30, making the sale price $70. You
                can verify this instantly using the calculator above — enter 100
                as the original price and 30 as the discount percentage.
              </p>
            )}
          </div>

          <div className="faq-item">
            <h3 onClick={() => toggleFAQ(2)}>
              How do I calculate the original price before a discount?
              <i
                className={`fa-solid fa-chevron-down ${
                  openFAQ === 2 ? "rotate" : ""
                }`}
              ></i>
            </h3>
            {openFAQ === 2 && (
              <p>
                Divide the sale price by (1 minus the discount rate as a
                decimal). For example, if something costs $80 after a 20%
                discount, the original price was 80 ÷ (1 − 0.20) = 80 ÷ 0.80 =
                $100.
              </p>
            )}
          </div>

          <div className="faq-item">
            <h3 onClick={() => toggleFAQ(3)}>
              Does tax apply before or after the discount?
              <i
                className={`fa-solid fa-chevron-down ${
                  openFAQ === 3 ? "rotate" : ""
                }`}
              ></i>
            </h3>
            {openFAQ === 3 && (
              <p>
                In most countries and standard retail practice, tax is applied
                after the discount is deducted. So the tax is calculated on the
                discounted price, not the original price. Our calculator follows
                this correct method — discount is applied first, then tax is
                added to the reduced price.
              </p>
            )}
          </div>

          <div className="faq-item">
            <h3 onClick={() => toggleFAQ(4)}>
              What is the difference between a percentage discount and a flat
              discount?
              <i
                className={`fa-solid fa-chevron-down ${
                  openFAQ === 4 ? "rotate" : ""
                }`}
              ></i>
            </h3>
            {openFAQ === 4 && (
              <p>
                A percentage discount gives you a saving proportional to the
                price — 20% off a $500 item saves $100, while 20% off a $50 item
                saves only $10. A flat discount gives a fixed saving regardless
                of price — $50 off always means $50 saved, no matter what the
                item costs. Flat discounts are more valuable on cheaper items,
                while percentage discounts are more valuable on expensive items.
              </p>
            )}
          </div>

          <div className="faq-item">
            <h3 onClick={() => toggleFAQ(5)}>
              How do I calculate the discount percentage between two prices?
              <i
                className={`fa-solid fa-chevron-down ${
                  openFAQ === 5 ? "rotate" : ""
                }`}
              ></i>
            </h3>
            {openFAQ === 5 && (
              <p>
                Subtract the sale price from the original price to get the
                discount amount, then divide by the original price and multiply
                by 100. For example, original price $250, sale price $175 —
                discount amount = $75, discount percentage = (75 ÷ 250) × 100 =
                30% off.
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
                <Link href="/bill-split-calculator/">
                  <span
                    style={{ textDecoration: "none" }}
                    className="hover-item"
                  >
                    Bill Split Calculator
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
                <Link href="/emi-calculator/">
                  <span
                    style={{ textDecoration: "none" }}
                    className="hover-item"
                  >
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
    </>
  );
}
