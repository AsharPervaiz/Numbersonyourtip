"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

type VATMode = "add" | "remove";
interface VATResult {
  mode: VATMode;
  preVAT: number;
  vatAmount: number;
  postVAT: number;
  vatRate: number;
  vatBurdenPct: number;
}
function needleDeg(ratio: number): number {
  const clamped = Math.min(Math.max(ratio, 0), 1);
  return -90 + clamped * 180;
}

function VATResultPanel({ result }: { result: VATResult | null }) {
  if (!result) {
    return (
      <div className="cr-panel-placeholder">
        <div className="cr-ph-icon">
          <i className="fa-solid fa-percent" aria-hidden="true" />
        </div>
        Enter a price and VAT rate to see the breakdown here.
      </div>
    );
  }
  const { mode, preVAT, vatAmount, postVAT, vatRate, vatBurdenPct } = result;
  const fmt = (n: number) =>
    n.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  const scaleMax = 50;
  const ratio = Math.min(vatBurdenPct / scaleMax, 1);
  const barPct = 2 + ratio * 96;
  const rateLabel =
    vatRate < 5
      ? "Very low VAT"
      : vatRate < 12
        ? "Low VAT"
        : vatRate < 20
          ? "Standard VAT"
          : vatRate < 28
            ? "High VAT"
            : "Very high VAT";
  const rateBadge =
    vatRate < 5
      ? "good"
      : vatRate < 12
        ? "normal"
        : vatRate < 20
          ? "normal"
          : vatRate < 28
            ? "warning"
            : "danger";
  const preVATPct = Math.round((preVAT / postVAT) * 100);
  const vatPct = 100 - preVATPct;
  return (
    <div className="cr-panel">
      <div className="cr-gauge-wrap">
        <svg
          className="cr-gauge-svg"
          width="100"
          height="60"
          viewBox="0 0 120 70"
          role="img"
          aria-label={`VAT rate gauge: ${vatRate}%`}
        >
          <defs>
            <clipPath id="vat-half">
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
            clipPath="url(#vat-half)"
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
            clipPath="url(#vat-half)"
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
            clipPath="url(#vat-half)"
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
            clipPath="url(#vat-half)"
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
          <div className="cr-score">{fmt(vatAmount)}</div>
          <div className="cr-score-label">VAT amount</div>
          <span className={`cr-badge ${rateBadge}`}>{rateLabel}</span>
        </div>
      </div>
      <hr className="cr-divider" />
      <div>
        <div className="cr-bar-label">
          VAT rate — {vatRate}% on pre-VAT price
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
          <span>10%</span>
          <span>20%</span>
          <span>30%</span>
          <span>50%</span>
        </div>
      </div>
      <hr className="cr-divider" />
      <div className="cr-metrics-grid">
        <div className="cr-metric-card">
          <div className="cr-m-label">Pre-VAT price</div>
          <div className="cr-m-value" style={{ fontSize: "13px" }}>
            {fmt(preVAT)}
          </div>
          <div className="cr-m-sub">net price</div>
        </div>
        <div className="cr-metric-card">
          <div className="cr-m-label">VAT amount</div>
          <div
            className="cr-m-value"
            style={{ fontSize: "13px", color: "#A32D2D" }}
          >
            {fmt(vatAmount)}
          </div>
          <div className="cr-m-sub">at {vatRate}%</div>
        </div>
        <div className="cr-metric-card">
          <div className="cr-m-label">Post-VAT price</div>
          <div
            className="cr-m-value"
            style={{ fontSize: "13px", color: "#3B6D11" }}
          >
            {fmt(postVAT)}
          </div>
          <div className="cr-m-sub">total payable</div>
        </div>
        <div className="cr-metric-card">
          <div className="cr-m-label">VAT burden</div>
          <div className="cr-m-value">{vatBurdenPct.toFixed(1)}%</div>
          <div className="cr-m-sub">of pre-VAT price</div>
        </div>
      </div>
      <hr className="cr-divider" />
      <div>
        <div className="cr-world-title">
          {mode === "add"
            ? "price breakdown (inc. VAT)"
            : "VAT extraction breakdown"}
        </div>
        <div className="cr-world-bar-row">
          <span className="cr-w-label">Net price</span>
          <div className="cr-world-track">
            <div
              className="cr-world-fill"
              style={{ width: `${preVATPct}%`, background: "#97C459" }}
            />
          </div>
          <span
            className="cr-w-pct"
            style={{ width: "55px", fontSize: "10px" }}
          >
            {fmt(preVAT)}
          </span>
        </div>
        <div className="cr-world-bar-row">
          <span className="cr-w-label">VAT</span>
          <div className="cr-world-track">
            <div
              className="cr-world-fill"
              style={{ width: `${vatPct}%`, background: "#F09595" }}
            />
          </div>
          <span
            className="cr-w-pct"
            style={{ width: "55px", fontSize: "10px" }}
          >
            {fmt(vatAmount)}
          </span>
        </div>
        <div className="cr-world-bar-row">
          <span className="cr-w-label">Total</span>
          <div className="cr-world-track">
            <div
              className="cr-world-fill"
              style={{
                width: "100%",
                background:
                  "linear-gradient(to right, #97C459 0%, #F09595 100%)",
              }}
            />
          </div>
          <span
            className="cr-w-pct"
            style={{ width: "55px", fontSize: "10px" }}
          >
            {fmt(postVAT)}
          </span>
        </div>
        <p className="cr-world-note">
          {mode === "add"
            ? `Every ${fmt(preVAT)} net price becomes ${fmt(postVAT)} after adding ${vatRate}% VAT.`
            : `The ${fmt(postVAT)} price includes ${fmt(vatAmount)} VAT at ${vatRate}% — net price is ${fmt(preVAT)}.`}
        </p>
      </div>
    </div>
  );
}

const FAQ_DATA = [
  {
    q: "How do I add VAT to a price?",
    a: "Multiply the net (pre-VAT) price by the VAT rate divided by 100, then add the result. For example, to add 20% VAT to 500: VAT = 500 × 0.20 = 100, Total = 500 + 100 = 600. Select 'Add VAT to price' in the calculator and enter the net price and rate for instant results.",
  },
  {
    q: "How do I remove VAT from a price?",
    a: "Divide the gross (VAT-inclusive) price by (1 + VAT rate ÷ 100). For 20% VAT on 600: Net = 600 ÷ 1.20 = 500, VAT = 600 − 500 = 100. Select 'Remove VAT from price' mode to reverse-calculate any VAT-inclusive amount.",
  },
  {
    q: "How do I calculate VAT from a gross amount?",
    a: "Use the reverse VAT formula: divide the gross price by (1 + rate/100) to get the net, then subtract net from gross to find the VAT component. This calculator handles it automatically in 'Remove VAT' mode — enter the gross amount and the rate.",
  },
  {
    q: "What is the VAT rate in the UK?",
    a: "The standard UK VAT rate is 20%. A reduced rate of 5% applies to domestic fuel, home energy-saving materials, and children's car seats. Some items are zero-rated (0%) including most food, children's clothing, and books.",
  },
  {
    q: "What is the difference between zero-rated and VAT-exempt?",
    a: "Zero-rated means VAT is charged at 0% — the supply is within the VAT system, so the seller can reclaim input VAT. Exempt means the supply is outside the VAT system entirely — no VAT is charged and input VAT on related purchases generally cannot be reclaimed.",
  },
  {
    q: "What is the difference between VAT and sales tax?",
    a: "VAT is collected at every stage of the supply chain, with each business reclaiming the VAT it paid on inputs and remitting only the difference. Sales tax is collected once at the final point of sale. VAT is used in most of the world; sales tax is primarily used in the United States.",
  },
  {
    q: "What is the difference between VAT and GST?",
    a: "They are functionally the same — both are consumption taxes collected at each stage of the supply chain with input tax credit mechanisms. GST is the term used in India, Australia, Canada, New Zealand, and Singapore. VAT is used in Europe, the Middle East, and most of Africa and Asia. The mechanics are nearly identical; only the names and specific rate structures differ.",
  },
  {
    q: "Do I charge VAT on exports?",
    a: "In most countries, exports are zero-rated — you do not charge VAT to foreign customers, but you can still reclaim input VAT on business costs related to making that export. Rules vary by country and service type, so verify with your local tax authority.",
  },
  {
    q: "Can I reclaim VAT as a business?",
    a: "Yes. VAT-registered businesses offset input VAT (paid on purchases) against output VAT (collected on sales). If input exceeds output — common for exporters or businesses making large capital purchases — you can claim a refund from the tax authority.",
  },
  {
    q: "Is this VAT calculator free?",
    a: "Yes — completely free with no sign-up. Add or remove VAT from any price at any rate. The visual breakdown shows pre-VAT price, VAT amount, post-VAT total, and a gauge for the VAT burden.",
  },
];

export default function VATCalculator() {
  const [price, setPrice] = useState("");
  const [vatRate, setVatRate] = useState("");
  const [mode, setMode] = useState<VATMode>("add");
  const [modeOpen, setModeOpen] = useState(false);
  const [panelResult, setPanelResult] = useState<VATResult | null>(null);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const toggleFAQ = (index: number) =>
    setOpenFAQ(openFAQ === index ? null : index);

  const addCommas = (val: string): string => {
    const cleaned = val.replace(/[^0-9.]/g, "");
    const parts = cleaned.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.length > 1 ? parts[0] + "." + parts[1] : parts[0];
  };
  const toNum = (val: string) => {
    const s = val.replace(/,/g, "");
    return s === "" ? 0 : Number(s);
  };

  const compute = (): VATResult | null => {
    const p = toNum(price);
    const r = toNum(vatRate);
    if (!p || p <= 0 || !r || r <= 0) return null;
    if (mode === "add") {
      const vatAmount = (p * r) / 100;
      const postVAT = p + vatAmount;
      return {
        mode,
        preVAT: p,
        vatAmount,
        postVAT,
        vatRate: r,
        vatBurdenPct: r,
      };
    } else {
      const preVAT = p / (1 + r / 100);
      const vatAmount = p - preVAT;
      return {
        mode,
        preVAT,
        vatAmount,
        postVAT: p,
        vatRate: r,
        vatBurdenPct: (vatAmount / preVAT) * 100,
      };
    }
  };

  useEffect(() => {
    setPanelResult(compute());
  }, [price, vatRate, mode]);
  const calculate = () => setPanelResult(compute());
  const handleClear = () => {
    setPrice("");
    setVatRate("");
    setMode("add");
    setModeOpen(false);
    setPanelResult(null);
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_DATA.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  return (
    <div className="page-layout">
      <div className="single-page-padding">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />

        <h1>Free VAT Calculator Online — Add or Remove VAT From Any Price</h1>
        <p>
          Add VAT to a net price or use the reverse VAT calculator to extract
          VAT from a gross amount — at any rate (5%, 15%, 18%, 20%, 25%, or
          custom). This free VAT calculator online shows the full breakdown
          instantly: pre-VAT price, VAT amount, post-VAT total, and a visual VAT
          burden gauge.
        </p>

        <div className="calc-card single-calc">
          <input
            className="calc-input"
            type="text"
            inputMode="decimal"
            placeholder="Enter Price"
            value={addCommas(price)}
            onChange={(e) => setPrice(e.target.value.replace(/,/g, ""))}
          />
          <input
            className="calc-input"
            type="number"
            step="0.01"
            placeholder="VAT Rate (%)"
            value={vatRate}
            onChange={(e) => setVatRate(e.target.value)}
          />
          <div
            className="modern-dropdown"
            onClick={() => setModeOpen(!modeOpen)}
          >
            {mode === "add" ? "Add VAT to price" : "Remove VAT from price"}
            <span className="dropdown-indicator">▼</span>
            {modeOpen && (
              <ul className="dropdown-list">
                <li
                  onClick={(e) => {
                    e.stopPropagation();
                    setMode("add");
                    setModeOpen(false);
                  }}
                >
                  Add VAT to price
                </li>
                <li
                  onClick={(e) => {
                    e.stopPropagation();
                    setMode("remove");
                    setModeOpen(false);
                  }}
                >
                  Remove VAT from price
                </li>
              </ul>
            )}
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button className="calc-button" onClick={calculate}>
              Calculate
            </button>
            <button className="calc-button calc-clear" onClick={handleClear}>
              Clear
            </button>
          </div>
        </div>

        <div className="cr-mobile-slot">
          <VATResultPanel result={panelResult} />
        </div>

        {/* ---- SEO CONTENT ---- */}

        <h2>What Is VAT and How Does It Work?</h2>
        <p>
          VAT (Value Added Tax) is an indirect consumption tax levied on goods
          and services at each stage of production and sale. It is one of the
          most common forms of taxation worldwide, used in over 160 countries.
          Unlike a sales tax that is applied only at the final point of sale,
          VAT is collected at every stage of the supply chain — from
          manufacturers to wholesalers to retailers — with each business
          reclaiming the VAT it paid on inputs and remitting only the difference
          to the government.
        </p>
        <p>
          For consumers, VAT appears as an addition to the final price of a
          product or service. For businesses, it is a tax they collect on behalf
          of the government and must accurately account for in their records.
          This calculator handles both sides: adding VAT to a net price for
          invoicing, and reverse-calculating VAT from a gross amount for
          accounting and reclaim purposes. If you are managing broader business
          finances alongside VAT, our{" "}
          <Link href="/income-tax-calculator/" className="my-link">
            income tax calculator
          </Link>{" "}
          handles annual income tax for salaried and self-employed individuals.
        </p>

        <h2>How to Add VAT to a Price</h2>
        <p>
          Use this when you have the net price (before tax) and need to find the
          total price the customer pays. Select "Add VAT to price" in the
          dropdown above.
        </p>
        <pre>
          VAT Amount = Net Price × (VAT Rate ÷ 100){"\n"}Gross Price = Net Price
          + VAT Amount
        </pre>
        <p>
          <strong>Example — Add 20% VAT:</strong> A product costs 500 (ex-VAT)
          and the VAT rate is 20%. VAT = 500 × 0.20 = 100. Gross price = 500 +
          100 = <strong>600</strong>. This is what an add 20% VAT calculator
          does — enter 500 and 20% above to see the same result with a full
          breakdown.
        </p>

        <h2>How to Remove VAT From a Price — Reverse VAT Calculator</h2>
        <p>
          Use this when you have a price that already includes VAT and need to
          extract the original pre-VAT amount and the tax component. This is the
          reverse VAT calculation — essential for businesses reclaiming input
          tax and for accountants splitting gross amounts. Select "Remove VAT
          from price" in the dropdown.
        </p>
        <pre>
          Net Price = Gross Price ÷ (1 + VAT Rate ÷ 100){"\n"}VAT Amount = Gross
          Price − Net Price
        </pre>
        <p>
          <strong>Example — Remove 20% VAT from 600:</strong> Net = 600 ÷ 1.20 =
          500. VAT = 600 − 500 = <strong>100</strong>. This answers the common
          question of how to calculate VAT from a gross amount — the formula
          divides by 1.20 (for 20%), not by 0.20, which is a frequent mistake.
        </p>

        <h2>VAT Rates by Country</h2>
        <p>
          VAT rates vary significantly across countries. Here is a reference
          table for the most common rates — enter any of these in the calculator
          above:
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
                  Country
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Standard Rate
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Reduced Rates
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                ["United Kingdom", "20%", "5%, 0%"],
                ["Germany", "19%", "7%"],
                ["France", "20%", "10%, 5.5%, 2.1%"],
                ["UAE", "5%", "0%"],
                ["India (GST)", "18%", "12%, 5%, 0%"],
                ["Pakistan", "18%", "Varies by category"],
                ["Australia (GST)", "10%", "0%"],
                ["Canada (GST/HST)", "5–15%", "By province"],
                ["Saudi Arabia", "15%", "0%"],
                ["Hungary", "27%", "18%, 5%"],
                ["Denmark", "25%", "0%"],
                ["South Africa", "15%", "0%"],
                ["New Zealand (GST)", "15%", "0%"],
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
        <p>
          Many countries have multiple rates. The standard rate applies to most
          goods and services, while reduced rates cover essentials like food,
          medicine, and children's items. Zero-rated goods are within the VAT
          system but charged at 0%. Exempt goods are outside the VAT system
          entirely.
        </p>

        <h2>VAT vs. Sales Tax — What Is the Difference?</h2>
        <p>
          This is one of the most commonly confused distinctions in taxation.
          The difference between VAT and sales tax comes down to where in the
          supply chain the tax is collected:
        </p>
        <ul className="custom-list">
          <li>
            <strong>VAT (Value Added Tax)</strong> — collected at every stage of
            the supply chain. Each business charges VAT on sales (output tax),
            reclaims VAT on purchases (input tax), and remits the difference.
            The tax burden ultimately falls on the final consumer, but the
            collection happens throughout the chain. Used across Europe, the
            Middle East, and most of Asia and Africa.
          </li>
          <li>
            <strong>Sales Tax</strong> — charged only once at the final point of
            sale to the end consumer. Simpler to administer but does not provide
            the input reclaim mechanism that VAT offers. Used primarily in the
            United States, where rates vary by state and city.
          </li>
        </ul>
        <p>
          For consumers, the practical effect is similar — both add tax to the
          price you pay. For businesses, VAT involves more accounting complexity
          but avoids the tax-on-tax cascade that can occur with single-stage
          sales taxes.
        </p>

        <h2>VAT vs. GST — What Is the Difference?</h2>
        <p>
          The difference between VAT and GST is primarily one of naming, not
          mechanics. Both are multi-stage consumption taxes with input tax
          credit systems. GST (Goods and Services Tax) is the term used in
          India, Australia, Canada, New Zealand, and Singapore. VAT is the term
          used in Europe, the Middle East, and most of Africa. The underlying
          structure — businesses collect tax on sales, reclaim tax on purchases,
          and remit the net difference — is functionally identical. The main
          differences are in the specific rate structures and exemption
          categories, which vary by country regardless of what the tax is
          called.
        </p>

        <h2>Common Uses of a VAT Calculator</h2>
        <ul className="custom-list">
          <li>
            <strong>Business invoicing</strong> — quickly add the correct VAT to
            a net price when issuing invoices. Our{" "}
            <Link href="/freelancer-tax-calculator/" className="my-link">
              freelancer tax calculator
            </Link>{" "}
            also handles platform fees and income tax for self-employed
            professionals.
          </li>
          <li>
            <strong>VAT reclaim (input tax)</strong> — extract the exact VAT
            component from a gross receipt to claim it back. Use the "Remove
            VAT" mode.
          </li>
          <li>
            <strong>Consumer price comparison</strong> — compare suppliers who
            quote ex-VAT versus inc-VAT by converting both to the same basis.
          </li>
          <li>
            <strong>Financial reporting</strong> — split gross amounts into net
            and VAT for accurate bookkeeping.
          </li>
          <li>
            <strong>Import duties</strong> — calculate VAT on imported goods
            where it is charged on customs value plus duty.
          </li>
          <li>
            <strong>Property transactions</strong> — VAT applies to commercial
            property sales and construction in many countries.
          </li>
          <li>
            <strong>Discount calculations</strong> — when applying a discount to
            a VAT-inclusive price, use our{" "}
            <Link href="/discount-calculator/" className="my-link">
              discount calculator
            </Link>{" "}
            first, then recalculate VAT on the discounted amount.
          </li>
        </ul>

        <h2>How Businesses Account for VAT</h2>
        <p>
          VAT-registered businesses collect output tax on sales and pay input
          tax on purchases. At regular intervals — monthly or quarterly — they
          submit a VAT return reporting the difference:
        </p>
        <pre>
          VAT Payable = Output Tax (collected on sales) − Input Tax (paid on
          purchases)
        </pre>
        <p>
          If output exceeds input, the business remits the difference. If input
          exceeds output — common for exporters or businesses with high capital
          expenditure — the business receives a refund. Accurate VAT calculation
          at every transaction is essential for correct returns. If you are
          tracking your overall business finances, our{" "}
          <Link href="/net-worth-calculator/" className="my-link">
            net worth calculator
          </Link>{" "}
          shows how business assets and liabilities add up, and our{" "}
          <Link href="/bill-split-calculator/" className="my-link">
            bill split calculator
          </Link>{" "}
          handles splitting shared business expenses.
        </p>

        <h2>Tips for Businesses Managing VAT</h2>
        <ul className="custom-list">
          <li>
            <strong>Register at the right time</strong> — most countries have a
            threshold below which registration is optional. Registering early
            lets you reclaim input VAT but also requires you to charge and
            account for VAT on all sales.
          </li>
          <li>
            <strong>Keep accurate VAT invoices</strong> — for both sales
            (output) and purchases (input). Poor record-keeping is the most
            common reason for VAT penalties.
          </li>
          <li>
            <strong>Understand zero-rating vs exemption</strong> — zero-rated
            supplies let you reclaim input VAT; exempt supplies do not. The
            distinction directly affects your VAT return.
          </li>
          <li>
            <strong>File returns on time</strong> — late filing and late payment
            attract penalties and interest in virtually every jurisdiction.
          </li>
          <li>
            <strong>Use accounting software</strong> — QuickBooks, Xero, Zoho
            Books, and similar tools automate VAT tracking and return
            preparation, reducing errors.
          </li>
          <li>
            <strong>Monitor your effective tax burden</strong> — use our{" "}
            <Link href="/salary-hike-calculator/" className="my-link">
              salary hike calculator
            </Link>{" "}
            to see how VAT on business expenses interacts with your take-home
            pay as a business owner.
          </li>
        </ul>

        <h2>How to Use This VAT Calculator</h2>
        <ul className="custom-list">
          <li>
            <strong>Step 1:</strong> Enter the price — either the net price
            (before VAT) or the gross price (including VAT), depending on which
            mode you select.
          </li>
          <li>
            <strong>Step 2:</strong> Enter the VAT rate percentage (e.g. 20 for
            UK standard, 18 for Pakistan/India GST, 5 for UAE).
          </li>
          <li>
            <strong>Step 3:</strong> Choose "Add VAT to price" (net → gross) or
            "Remove VAT from price" (gross → net).
          </li>
          <li>
            <strong>Step 4:</strong> Click Calculate. The panel shows pre-VAT
            price, VAT amount, post-VAT total, VAT burden gauge, and a visual
            breakdown bar.
          </li>
        </ul>

        <h2>Frequently Asked Questions</h2>

        {FAQ_DATA.map(({ q, a }, i) => (
          <div className="faq-item" key={i}>
            <h3 onClick={() => toggleFAQ(i)}>
              {q}
              <i
                className={`fa-solid fa-chevron-down ${openFAQ === i ? "rotate" : ""}`}
              />
            </h3>
            {openFAQ === i && <p>{a}</p>}
          </div>
        ))}

        <h2>Final Thoughts</h2>
        <p>
          Whether you are adding VAT to an invoice, extracting VAT from a
          receipt for reclaim, or comparing prices across suppliers and
          countries, this calculator gives you the exact breakdown in seconds.
          Enter any price at any rate and see the net, VAT, and gross amounts
          with a clear visual split.
        </p>
        <p>
          For related tools, our{" "}
          <Link href="/income-tax-calculator/" className="my-link">
            income tax calculator
          </Link>{" "}
          handles annual income tax across six countries, our{" "}
          <Link href="/freelancer-tax-calculator/" className="my-link">
            freelancer tax calculator
          </Link>{" "}
          covers self-employment tax with platform fees, our{" "}
          <Link href="/discount-calculator/" className="my-link">
            discount calculator
          </Link>{" "}
          handles percentage-off calculations, and our{" "}
          <Link href="/net-worth-calculator/" className="my-link">
            net worth calculator
          </Link>{" "}
          tracks your complete financial picture.
        </p>
      </div>

      {/* ---- SIDEBAR ---- */}
      <aside className="sidebar">
        <div className="cr-desktop-slot">
          <VATResultPanel result={panelResult} />
        </div>
        <div className="sidebar-box">
          <p style={{ fontSize: "20px", fontWeight: 600 }}>
            Related Calculators
          </p>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {[
              ["/income-tax-calculator/", "Income Tax Calculator"],
              ["/freelancer-tax-calculator/", "Freelancer Tax Calculator"],
              ["/discount-calculator/", "Discount Calculator"],
              ["/net-worth-calculator/", "Net Worth Calculator"],
              ["/bill-split-calculator/", "Bill Split Calculator"],
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
