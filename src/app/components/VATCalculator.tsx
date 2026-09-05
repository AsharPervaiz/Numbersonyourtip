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
    q: "How do I remove VAT from a price?",
    a: "Divide the gross price by 1 plus the rate — at 20% that means dividing by 1.20, so 600 gross is 500 net. Do not subtract the percentage: taking 20% off 600 gives 480, which is wrong by 20. The error happens because VAT is a percentage of the net price, not of the gross, so subtracting takes a fifth of the wrong number.",
  },
  {
    q: "Why is subtracting 20% from the total not the same as removing VAT?",
    a: "Because the two percentages are applied to different bases. VAT of 20% is calculated on the net figure, so on a net 100 the VAT is 20 and the gross is 120. Working backwards, the 20 of VAT is one sixth of 120, not one fifth. Subtracting a fifth of the gross removes too much, and the size of the error grows with the rate — trivial at 5%, substantial at 25%.",
  },
  {
    q: "How do I work out just the VAT amount in a total?",
    a: "Multiply the gross by the rate divided by 100 plus the rate. That produces a simple fraction at common rates: one sixth at 20%, one fifth at 25%, one eleventh at 10% and one twenty-first at 5%. A gross of 120 at 20% therefore contains 20 of VAT, since 120 divided by 6 is 20. These fractions make it possible to check almost any receipt mentally.",
  },
  {
    q: "How do I add VAT to a price?",
    a: "Multiply the net price by 1 plus the rate — 1.20 for 20%, 1.05 for 5%, 1.25 for 25%. A net 500 at 20% becomes 600. Calculating the VAT separately and adding it gives the same result, but the single multiplication avoids an intermediate rounding step, which matters when you are totalling a column of invoice lines.",
  },
  {
    q: "Why does my invoice total differ by a penny from my accounting software?",
    a: "Almost always rounding order rather than an arithmetic error. Rounding the VAT on each line and then adding produces a slightly different total from calculating VAT on the summed net. Three lines of 12.49 at 20% give 7.50 the first way and 7.49 the second. Pick one convention and apply it consistently, since the difference compounds across a ledger instead of cancelling out.",
  },
  {
    q: "What is the difference between zero-rated and exempt?",
    a: "Both show no VAT on the customer's invoice and they behave in opposite ways behind it. A zero-rated supply is still a taxable supply, so the business charges nothing but can still reclaim the VAT it paid on its own costs. An exempt supply falls outside the VAT charge entirely, so no input VAT can be reclaimed and that VAT becomes a real cost to the business.",
  },
  {
    q: "How much VAT does a registered business actually pay over?",
    a: "The difference between output VAT charged on sales and input VAT paid on purchases. A business charging 12,000 and paying 8,000 in a quarter remits 4,000. When input exceeds output — common during heavy investment, or for a business making zero-rated supplies — the period ends in a reclaim rather than a payment.",
  },
  {
    q: "Is VAT the same as sales tax or GST?",
    a: "Not quite. VAT is charged at every stage of the supply chain with businesses reclaiming what they paid, so the tax accumulates only on the value added at each step. Sales tax is typically charged once, at the final retail sale. GST is structurally very close to VAT and the terms are often used interchangeably, though the rate bands and registration rules differ by country.",
  },
  {
    q: "Which VAT rate should I use?",
    a: "The one set by law for that product or service in the country of supply, which is not a matter of choice. Most systems run a standard rate, one or more reduced rates for specified categories, and zero-rated or exempt treatments for others. Rates and category rules also change over time, so confirm the current figure with the relevant tax authority before filing.",
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

        <h1>VAT Calculator — Add VAT or Reverse It Out of a Total</h1>
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

        <h2>Two Directions, and Only One of Them Is Obvious</h2>
        <p>
          Every VAT calculation goes one of two ways. You either have a price
          without VAT and need the total, or you have a total that already
          includes VAT and need to work backwards. The first is a multiplication
          most people get right. The second is where nearly all VAT errors
          happen, because the instinctive move — subtract the percentage — is
          wrong.
        </p>
        <p>
          Take a gross figure of 120 at a 20% rate. Subtracting 20% gives 96.
          The correct answer is 100. The gap is not a rounding artefact; it is a
          structural error that recurs on every invoice processed that way.
        </p>
        <p>
          The reason is what the percentage is applied to. VAT is 20%{" "}
          <em>of the net price</em>, not 20% of the gross. When you subtract 20%
          from the gross you are taking a fifth of the wrong number — a fifth of
          120 rather than a fifth of 100. Getting this one distinction right
          removes the majority of VAT mistakes.
        </p>

        <h2>Adding VAT to a Price</h2>
        <p>
          Going upward is straightforward. Convert the rate into a multiplier
          and multiply once:
        </p>
        <pre>Gross = Net × (1 + rate)</pre>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Rate</th>
                <th>Multiply the net price by</th>
                <th>Net 500 becomes</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>5%</td>
                <td>1.05</td>
                <td>525</td>
              </tr>
              <tr>
                <td>10%</td>
                <td>1.10</td>
                <td>550</td>
              </tr>
              <tr>
                <td>15%</td>
                <td>1.15</td>
                <td>575</td>
              </tr>
              <tr>
                <td>20%</td>
                <td>1.20</td>
                <td>600</td>
              </tr>
              <tr>
                <td>21%</td>
                <td>1.21</td>
                <td>605</td>
              </tr>
              <tr>
                <td>25%</td>
                <td>1.25</td>
                <td>625</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          Calculating the VAT separately and then adding it gives the same
          answer, but the single multiplication is worth the habit — it removes
          an intermediate rounding step, which matters once you are adding up a
          column of invoice lines.
        </p>

        <h2>Removing VAT: the Reverse Calculation</h2>
        <p>
          Going downward is a division by the same multiplier, never a
          subtraction:
        </p>
        <pre>Net = Gross ÷ (1 + rate)</pre>
        <p>A gross price of 600 at 20% is 600 ÷ 1.20 = 500.</p>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Rate</th>
                <th>Divide the gross price by</th>
                <th>Gross 600 becomes</th>
                <th>Wrong answer from subtracting</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>5%</td>
                <td>1.05</td>
                <td>571.43</td>
                <td>570.00</td>
              </tr>
              <tr>
                <td>15%</td>
                <td>1.15</td>
                <td>521.74</td>
                <td>510.00</td>
              </tr>
              <tr>
                <td>20%</td>
                <td>1.20</td>
                <td>500.00</td>
                <td>480.00</td>
              </tr>
              <tr>
                <td>25%</td>
                <td>1.25</td>
                <td>480.00</td>
                <td>450.00</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          Notice that the error grows with the rate. At 5% the shortcut is out
          by under two units and might survive unnoticed; at 25% it is out by
          thirty. Anyone reconciling accounts in a high-rate jurisdiction finds
          this quickly. Anyone in a low-rate one may not, which is the more
          dangerous position.
        </p>

        <h2>Pulling Out Just the VAT Element</h2>
        <p>
          Often you do not want the net figure at all — you want to know how
          much of a gross amount is tax, to record it or reclaim it. Two routes
          give the same answer.
        </p>
        <pre>
          VAT = Gross − (Gross ÷ (1 + rate)){"\n"}or, in one step: VAT = Gross ×
          rate ÷ (100 + rate)
        </pre>
        <p>
          The second form produces a set of fractions worth committing to
          memory, because they turn the calculation into arithmetic you can do
          without a calculator at all.
        </p>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Rate</th>
                <th>VAT fraction of the gross</th>
                <th>In practice</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>20%</td>
                <td>1/6</td>
                <td>Divide the gross by 6</td>
              </tr>
              <tr>
                <td>25%</td>
                <td>1/5</td>
                <td>Divide the gross by 5</td>
              </tr>
              <tr>
                <td>10%</td>
                <td>1/11</td>
                <td>Divide the gross by 11</td>
              </tr>
              <tr>
                <td>5%</td>
                <td>1/21</td>
                <td>Divide the gross by 21</td>
              </tr>
              <tr>
                <td>15%</td>
                <td>3/23</td>
                <td>No clean shortcut — use the formula</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          A receipt for 120 at a 20% rate contains 20 of VAT, because 120 ÷ 6 =
          20. That single fact makes it possible to sanity-check almost any
          gross figure in your head, which is the fastest way to catch an
          invoice that has been calculated the wrong way round.
        </p>

        <h2>Where a Penny Goes Missing</h2>
        <p>
          Two people can calculate the same invoice correctly and disagree by a
          small amount, and the reason is rounding order rather than arithmetic.
        </p>
        <p>
          Consider three lines at 12.49 each, VAT at 20%. Rounding the VAT on
          each line gives 2.50 three times, totalling 7.50. Calculating VAT on
          the summed net of 37.47 gives 7.494, which rounds to 7.49. Both
          methods are defensible and they differ by a penny.
        </p>
        <p>
          The practical rule is to pick one convention and apply it
          consistently, since the discrepancy compounds across a ledger rather
          than cancelling out. Where a tax authority specifies which method to
          use on invoices, that instruction overrides preference. Keeping
          unrounded values through intermediate steps and rounding only at the
          final total is the approach that produces the fewest reconciliation
          problems.
        </p>

        <h2>Which Rate Applies, and the Zero-Rated Trap</h2>
        <p>
          Most systems run more than one rate. A standard rate covers most
          goods and services, a reduced rate applies to specified categories,
          and some items carry no VAT at all. The distinction that catches
          businesses out is between two things that both show 0 on an invoice
          and are not the same.
        </p>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Treatment</th>
                <th>VAT charged to the customer</th>
                <th>Can the business reclaim its input VAT?</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Standard rated</td>
                <td>At the standard rate</td>
                <td>Yes</td>
              </tr>
              <tr>
                <td>Reduced rated</td>
                <td>At the lower rate</td>
                <td>Yes</td>
              </tr>
              <tr>
                <td>Zero rated</td>
                <td>None — but it is still a taxable supply</td>
                <td>Yes</td>
              </tr>
              <tr>
                <td>Exempt</td>
                <td>None — the supply is outside the VAT charge</td>
                <td>No</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          Zero-rated and exempt look identical on a customer receipt and behave
          in opposite ways behind it. A business making zero-rated supplies
          charges nothing but still recovers the VAT it paid on its own costs,
          often ending each period in a refund position. A business making
          exempt supplies recovers nothing, so the VAT on its purchases becomes
          a real cost absorbed into its margins. Which category a product falls
          into is set by law and is not a choice.
        </p>

        <h2>What Registered Businesses Actually Pay</h2>
        <p>
          For a VAT-registered business, VAT is not a cost — it is a flow
          passing through. What gets paid over is the difference between two
          totals:
        </p>
        <pre>
          Payable = Output VAT (charged on sales) − Input VAT (paid on
          purchases)
        </pre>
        <p>
          A business charging 12,000 of output VAT in a quarter while paying
          8,000 of input VAT remits 4,000. If the figures reverse — common for
          a business in a period of heavy investment, or one making zero-rated
          supplies — the result is a reclaim rather than a payment.
        </p>
        <p>
          This is why the direction of a calculation matters so much in
          bookkeeping. Recording a gross amount where a net one belongs, or the
          reverse, does not just misstate one line; it misstates the reclaim
          position for the whole period. It is also why the reverse calculation
          gets used far more often than people expect — supplier receipts
          usually show a gross total, and the input VAT has to be extracted from
          it before anything can be reclaimed.
        </p>
        <p>
          Rates and category rules differ by country and change over time, so
          confirm the current rate with your own tax authority before filing
          anything. For the background on how VAT works as a system, see our
          guide to{" "}
          <Link href="/blog/what-is-vat/" className="my-link">
            what VAT is and how it is charged
          </Link>
          . For working out what you owe on income rather than sales, the{" "}
          <Link href="/income-tax-calculator/" className="my-link">
            income tax calculator
          </Link>{" "}
          and the{" "}
          <Link href="/freelancer-tax-calculator/" className="my-link">
            freelancer tax calculator
          </Link>{" "}
          handle those separately.
        </p>
        <h2>VAT Questions, Answered</h2>

        {FAQ_DATA.map(({ q, a }, i) => {
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
