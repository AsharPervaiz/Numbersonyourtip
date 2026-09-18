"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

/* ─────────────────────────────────────────
   Conversions — all exact by definition.
───────────────────────────────────────── */
const M_PER_FT = 0.3048; // exact
const FT3_PER_YD3 = 27;
const FT3_PER_M3 = 1 / (M_PER_FT * M_PER_FT * M_PER_FT); // ≈ 35.3147
const M2_PER_FT2 = M_PER_FT * M_PER_FT;

/* ─────────────────────────────────────────
   Types
───────────────────────────────────────── */
interface Bed {
  id: number;
  length: string;
  width: string;
}

interface MulchResult {
  areaFt2: number;
  areaM2: number;
  depthInches: number;
  volumeFt3: number;
  volumeYd3: number;
  volumeM3: number;
  bags: number;
  bagSizeFt3: number;
  bedCount: number;
  extraPct: number;
  baseFt3: number;
  totalCost: number | null;
  price: number | null;
  priceBasis: string;
  metric: boolean;
}

/* ─────────────────────────────────────────
   Pure helper — the gauge reads depth on a
   0–8 inch scale, because with mulch the
   failure mode at the top of the range is as
   real as the one at the bottom.
───────────────────────────────────────── */
function needleDeg(inches: number): number {
  const clamped = Math.min(Math.max(inches, 0), 8);
  return -90 + (clamped / 8) * 180;
}

function num(n: number, dp = 2): string {
  if (!isFinite(n)) return "—";
  return n.toLocaleString("en-US", {
    minimumFractionDigits: dp,
    maximumFractionDigits: dp,
  });
}

/* ─────────────────────────────────────────
   MulchResultPanel
───────────────────────────────────────── */
function MulchResultPanel({ result }: { result: MulchResult | null }) {
  if (!result) {
    return (
      <div className="cr-panel-placeholder">
        <div className="cr-ph-icon">
          <i className="fa-solid fa-seedling" aria-hidden="true" />
        </div>
        Enter your bed size and depth to see how much mulch you need here.
      </div>
    );
  }

  const {
    areaFt2,
    areaM2,
    depthInches,
    volumeFt3,
    volumeYd3,
    volumeM3,
    bags,
    bagSizeFt3,
    bedCount,
    extraPct,
    baseFt3,
    totalCost,
    price,
    priceBasis,
    metric,
  } = result;

  // Depth bands. Unlike stone, mulch has a ceiling as well as a floor: too
  // thin and weeds come through, too deep and water and air stop reaching
  // the roots the mulch is meant to protect.
  const depthLabel =
    depthInches < 1
      ? "Too thin to suppress weeds"
      : depthInches < 2
        ? "Light dressing"
        : depthInches <= 4
          ? "Recommended range"
          : depthInches <= 6
            ? "Deeper than needed"
            : "Risks smothering roots";

  const depthBadge =
    depthInches < 1
      ? "danger"
      : depthInches < 2
        ? "warning"
        : depthInches <= 4
          ? "good"
          : depthInches <= 6
            ? "warning"
            : "danger";

  const bagsPerYd3 = bagSizeFt3 > 0 ? FT3_PER_YD3 / bagSizeFt3 : 0;
  const orderPct = 2 + (Math.min(volumeYd3, 10) / 10) * 96;
  const coveragePerBag = depthInches > 0 ? bagSizeFt3 / (depthInches / 12) : 0;

  return (
    <div className="cr-panel">
      <div className="cr-gauge-wrap">
        <svg
          className="cr-gauge-svg"
          width="100"
          height="60"
          viewBox="0 0 120 70"
          role="img"
          aria-label={`Mulch depth gauge showing ${depthInches.toFixed(1)} inches`}
        >
          <defs>
            <clipPath id="mulch-half">
              <rect x="0" y="0" width="120" height="65" />
            </clipPath>
          </defs>
          <circle
            cx="60"
            cy="65"
            r="52"
            fill="none"
            stroke="#F09595"
            strokeWidth="12"
            strokeDasharray="20 326"
            strokeDashoffset="-163"
            clipPath="url(#mulch-half)"
          />
          <circle
            cx="60"
            cy="65"
            r="52"
            fill="none"
            stroke="#FAC775"
            strokeWidth="12"
            strokeDasharray="21 326"
            strokeDashoffset="-183"
            clipPath="url(#mulch-half)"
          />
          <circle
            cx="60"
            cy="65"
            r="52"
            fill="none"
            stroke="#97C459"
            strokeWidth="12"
            strokeDasharray="82 326"
            strokeDashoffset="-204"
            clipPath="url(#mulch-half)"
          />
          <circle
            cx="60"
            cy="65"
            r="52"
            fill="none"
            stroke="#FAC775"
            strokeWidth="12"
            strokeDasharray="41 326"
            strokeDashoffset="-286"
            clipPath="url(#mulch-half)"
          />
          <circle
            cx="60"
            cy="65"
            r="52"
            fill="none"
            stroke="#F09595"
            strokeWidth="12"
            strokeDasharray="163 326"
            strokeDashoffset="-327"
            clipPath="url(#mulch-half)"
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
              transform: `rotate(${needleDeg(depthInches)}deg)`,
              transition: "transform 0.5s ease",
            }}
          />
          <circle cx="60" cy="65" r="5" fill="#111111" />
        </svg>

        <div className="cr-score-block">
          <div className="cr-score">{Math.ceil(bags)}</div>
          <div className="cr-score-label">bags of {num(bagSizeFt3, 1)} ft³</div>
          <span className={`cr-badge ${depthBadge}`}>{depthLabel}</span>
        </div>
      </div>

      <hr className="cr-divider" />

      <div>
        <div className="cr-bar-label">
          depth ({num(depthInches, 1)} in) — two to four is the usual range
        </div>
        <div
          className="cr-bar-track"
          style={{
            background:
              "linear-gradient(to right, #F09595 0%, #FAC775 12%, #97C459 25%, #97C459 50%, #FAC775 75%, #F09595 100%)",
          }}
        >
          <div
            className="cr-bar-thumb"
            style={{ left: `${2 + (Math.min(depthInches, 8) / 8) * 96}%` }}
          />
        </div>
        <div className="cr-bar-ticks">
          <span>0&quot;</span>
          <span>2&quot;</span>
          <span>4&quot;</span>
          <span>6&quot;</span>
          <span>8&quot;</span>
        </div>
      </div>

      <hr className="cr-divider" />

      <div className="cr-metrics-grid">
        <div className="cr-metric-card">
          <div className="cr-m-label">Total area</div>
          <div className="cr-m-value">
            {metric ? num(areaM2) : num(areaFt2, 0)}
          </div>
          <div className="cr-m-sub">
            {metric ? "m²" : "sq ft"}
            {bedCount > 1 ? ` across ${bedCount} beds` : ""}
          </div>
        </div>
        <div className="cr-metric-card">
          <div className="cr-m-label">Cubic feet</div>
          <div className="cr-m-value">{num(volumeFt3)}</div>
          <div className="cr-m-sub">ft³</div>
        </div>
        <div className="cr-metric-card">
          <div className="cr-m-label">Cubic yards</div>
          <div className="cr-m-value">{num(volumeYd3)}</div>
          <div className="cr-m-sub">yd³ — how bulk is sold</div>
        </div>
        <div className="cr-metric-card">
          <div className="cr-m-label">Cubic metres</div>
          <div className="cr-m-value">{num(volumeM3)}</div>
          <div className="cr-m-sub">m³</div>
        </div>
      </div>

      <hr className="cr-divider" />

      <div>
        <div className="cr-bar-label">
          order size ({num(volumeYd3)} yd³ — {num(bagsPerYd3, 1)} bags to a
          cubic yard)
        </div>
        <div
          className="cr-bar-track"
          style={{
            background:
              "linear-gradient(to right, #C0DD97 0%, #FAC775 20%, #B5D4F4 60%)",
          }}
        >
          <div className="cr-bar-thumb" style={{ left: `${orderPct}%` }} />
        </div>
        <div className="cr-bar-ticks">
          <span>0</span>
          <span>1 yd³</span>
          <span>3</span>
          <span>6</span>
          <span>10+</span>
        </div>
        <div className="cr-world-note" style={{ marginTop: "10px" }}>
          One bag covers about <strong>{num(coveragePerBag, 1)} sq ft</strong>{" "}
          at this depth.
        </div>
      </div>

      {totalCost !== null && price !== null && (
        <>
          <hr className="cr-divider" />
          <div className="cr-metrics-grid">
            <div className="cr-metric-card">
              <div className="cr-m-label">Price</div>
              <div className="cr-m-value">{num(price)}</div>
              <div className="cr-m-sub">
                {priceBasis === "bag" ? "per bag" : "per cubic yard"}
              </div>
            </div>
            <div className="cr-metric-card">
              <div className="cr-m-label">Estimated cost</div>
              <div className="cr-m-value">{num(totalCost)}</div>
              <div className="cr-m-sub">material only</div>
            </div>
          </div>
        </>
      )}

      <hr className="cr-divider" />

      <div>
        <div className="cr-bar-label">calculation</div>
        <div className="cr-world-note">
          {num(areaFt2, 0)} sq ft × {num(depthInches, 1)} in ÷ 12 ={" "}
          <strong>{num(baseFt3)} ft³</strong>
          {extraPct > 0 && (
            <>
              <br />
              plus {extraPct}% for settling and spillage ={" "}
              <strong>{num(volumeFt3)} ft³</strong>
            </>
          )}
          <br />
          {num(volumeFt3)} ft³ ÷ {num(bagSizeFt3, 1)} ={" "}
          <strong>{Math.ceil(bags)} bags</strong>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   FAQ data (also builds the FAQPage JSON-LD)
───────────────────────────────────────── */
const FAQ_DATA: [string, string][] = [
  [
    "How much mulch do I need for a garden bed?",
    "Multiply the length by the width for the area, multiply that by the depth in feet, and you have the volume in cubic feet. A bed 20 feet by 4 feet is 80 square feet; at three inches, that is 80 × 0.25 = 20 cubic feet, which is ten standard two-cubic-foot bags or about three quarters of a cubic yard. The arithmetic is the same for any material — what changes for mulch is the depth you should be aiming at.",
  ],
  [
    "How many bags of mulch are in a cubic yard?",
    "Thirteen and a half, if the bags hold two cubic feet, because a cubic yard is 27 cubic feet. That half bag is why bulk and bagged prices are awkward to compare directly: a cubic yard almost never divides into a whole number of bags, and you will usually end up buying fourteen and having some left over.",
  ],
  [
    "How deep should mulch be?",
    "Two to three inches suits most beds, and four is about the ceiling. Below two inches there is not enough material to block light, so weeds come through and the mulch stops doing the main job you bought it for. Above four, water and air struggle to reach the soil, and a thick wet layer can hold moisture against stems rather than in the ground where roots can use it.",
  ],
  [
    "Can you put down too much mulch?",
    "Yes, and it is a more common mistake than putting down too little, because more feels safer. A deep layer sheds light rain before it reaches the soil, stays soggy underneath, and encourages roots to grow up into the mulch where they dry out. Piling it against a trunk or stem is worse still: bark kept permanently damp is bark that rots, and the damage is usually well advanced before anything shows above ground.",
  ],
  [
    "Should I add extra when ordering?",
    "Between 5 and 10 per cent covers the ordinary losses — mulch settles as it takes rain, some blows or washes off edges and paths, and a bed measured as a neat rectangle is rarely quite one. This calculator leaves the allowance at zero so you can see the plain arithmetic first, then add your own figure knowing exactly what it is doing.",
  ],
  [
    "Do I need to remove old mulch before adding more?",
    "Usually not, but you do need to measure what is already there. Mulch is meant to break down, and a bed topped up every year without checking gradually climbs past the useful depth. Rake back what remains, see how deep it is, and add only the difference — the calculation you want is for the shortfall, not for the full depth all over again.",
  ],
  [
    "How often does mulch need replacing?",
    "Once a year is a reasonable rhythm for bark and wood chip, though it depends on the material and the weather rather than the calendar. The layer thins because it is decomposing into the soil, which is a benefit rather than a fault — you are paying for soil improvement as well as weed suppression. Finer materials break down faster and need topping up sooner than coarse chip.",
  ],
  [
    "Is bulk mulch cheaper than bags?",
    "Per cubic foot it usually is, and the gap widens with volume, but the comparison has to include getting it home and moving it. Bagged mulch is carried, stacked and opened where you want it; a bulk load is tipped in one place and barrowed from there. Below about a cubic yard the handling rarely justifies a delivery, and past two or three it usually does.",
  ],
];

/* ─────────────────────────────────────────
   Component
───────────────────────────────────────── */
export default function MulchCalculator() {
  const [metric, setMetric] = useState(false);
  const [unitOpen, setUnitOpen] = useState(false);

  const [beds, setBeds] = useState<Bed[]>([{ id: 1, length: "", width: "" }]);
  const [depth, setDepth] = useState("");

  const [bagSize, setBagSize] = useState("2");
  const [extra, setExtra] = useState("");

  const [price, setPrice] = useState("");
  const [priceBasis, setPriceBasis] = useState("bag");
  const [priceBasisOpen, setPriceBasisOpen] = useState(false);

  const [result, setResult] = useState<MulchResult | null>(null);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const toggleFAQ = (i: number) => setOpenFAQ(openFAQ === i ? null : i);
  const handleFAQKey = (e: React.KeyboardEvent, i: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleFAQ(i);
    }
  };

  const toNum = (v: string) => {
    const s = v.replace(/,/g, "").trim();
    return s === "" ? 0 : Number(s);
  };

  const compute = (): MulchResult | null => {
    // Imperial: length/width in feet, depth in inches.
    // Metric: length/width in metres, depth in centimetres.
    const sideToFt = metric ? 1 / M_PER_FT : 1;
    const depthToFt = metric ? 0.01 / M_PER_FT : 1 / 12;

    const areaFt2 = beds.reduce(
      (sum, b) =>
        sum + toNum(b.length) * sideToFt * (toNum(b.width) * sideToFt),
      0,
    );
    const depthFt = toNum(depth) * depthToFt;
    if (!areaFt2 || areaFt2 <= 0 || !depthFt || depthFt <= 0) return null;

    const baseFt3 = areaFt2 * depthFt;
    const extraPct = Math.max(0, toNum(extra));
    const volumeFt3 = baseFt3 * (1 + extraPct / 100);
    if (!isFinite(volumeFt3) || volumeFt3 <= 0) return null;

    const bagSizeFt3 = toNum(bagSize) || 2;
    const volumeYd3 = volumeFt3 / FT3_PER_YD3;

    const p = toNum(price);
    let totalCost: number | null = null;
    if (p > 0) {
      totalCost =
        priceBasis === "bag"
          ? Math.ceil(volumeFt3 / bagSizeFt3) * p
          : volumeYd3 * p;
    }

    return {
      areaFt2,
      areaM2: areaFt2 * M2_PER_FT2,
      depthInches: depthFt * 12,
      volumeFt3,
      volumeYd3,
      volumeM3: volumeFt3 / FT3_PER_M3,
      bags: volumeFt3 / bagSizeFt3,
      bagSizeFt3,
      bedCount: beds.length,
      extraPct,
      baseFt3,
      totalCost,
      price: p > 0 ? p : null,
      priceBasis,
      metric,
    };
  };

  /* The panel follows the inputs live; the button re-runs the same
     calculation so the control still behaves as expected. */
  useEffect(() => {
    setResult(compute());
  }, [beds, depth, bagSize, extra, price, priceBasis, metric]);

  const calculate = () => setResult(compute());

  const handleClear = () => {
    setBeds([{ id: 1, length: "", width: "" }]);
    setDepth("");
    setBagSize("2");
    setExtra("");
    setPrice("");
    setPriceBasis("bag");
    setResult(null);
  };

  const sideUnit = metric ? "m" : "ft";
  const depthUnit = metric ? "cm" : "in";
  const labelStyle = {
    marginBottom: "5px",
    fontWeight: 600,
    color: "white",
    marginTop: "14px",
  } as const;

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
        <h1>Mulch Calculator — Bags, Cubic Yards and Cost</h1>
        <p>
          Work out how much mulch a garden bed or landscaped area needs, in
          bags, cubic feet, cubic yards or cubic metres — for one bed or several
          at once, in feet and inches or metres and centimetres.
        </p>

        <div className="calc-card single-calc">
          {/* Units */}
          <p style={{ ...labelStyle, marginTop: 0 }}>Measurements in</p>
          <div
            className="modern-dropdown"
            onClick={() => setUnitOpen(!unitOpen)}
            style={{ margin: 0 }}
          >
            {metric ? "Metres and centimetres" : "Feet and inches"}
            <span className="dropdown-indicator">▼</span>
            {unitOpen && (
              <ul className="dropdown-list">
                <li
                  onClick={() => {
                    setMetric(false);
                    setUnitOpen(false);
                  }}
                >
                  Feet and inches
                </li>
                <li
                  onClick={() => {
                    setMetric(true);
                    setUnitOpen(false);
                  }}
                >
                  Metres and centimetres
                </li>
              </ul>
            )}
          </div>

          {/* Beds */}
          <p style={labelStyle}>
            {beds.length > 1 ? "Beds" : "Bed size"} ({sideUnit})
          </p>
          {beds.map((b, i) => (
            <div
              key={b.id}
              style={{
                display: "grid",
                gridTemplateColumns:
                  beds.length > 1 ? "1fr 1fr auto" : "1fr 1fr",
                gap: "10px",
                marginBottom: "8px",
                alignItems: "center",
              }}
            >
              <input
                className="calc-input"
                type="text"
                inputMode="decimal"
                placeholder={
                  beds.length > 1
                    ? `Bed ${i + 1} length`
                    : `Length (${sideUnit})`
                }
                value={b.length}
                onChange={(e) =>
                  setBeds(
                    beds.map((x) =>
                      x.id === b.id ? { ...x, length: e.target.value } : x,
                    ),
                  )
                }
                style={{ margin: 0 }}
              />
              <input
                className="calc-input"
                type="text"
                inputMode="decimal"
                placeholder={
                  beds.length > 1 ? `Bed ${i + 1} width` : `Width (${sideUnit})`
                }
                value={b.width}
                onChange={(e) =>
                  setBeds(
                    beds.map((x) =>
                      x.id === b.id ? { ...x, width: e.target.value } : x,
                    ),
                  )
                }
                style={{ margin: 0 }}
              />
              {beds.length > 1 && (
                <button
                  type="button"
                  className="calc-button calc-clear"
                  onClick={() => setBeds(beds.filter((x) => x.id !== b.id))}
                  style={{ padding: "8px 12px", margin: 0 }}
                  aria-label={`Remove bed ${i + 1}`}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            className="calc-button calc-clear"
            onClick={() =>
              setBeds([
                ...beds,
                {
                  id: Math.max(0, ...beds.map((x) => x.id)) + 1,
                  length: "",
                  width: "",
                },
              ])
            }
            style={{ marginTop: "2px" }}
          >
            + Add another bed
          </button>

          {/* Depth + bag size */}
          <p style={labelStyle}>Mulch depth ({depthUnit})</p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
            }}
          >
            <input
              className="calc-input"
              type="text"
              inputMode="decimal"
              placeholder={`Depth (${depthUnit})`}
              value={depth}
              onChange={(e) => setDepth(e.target.value)}
              style={{ margin: 0 }}
            />
            <input
              className="calc-input"
              type="text"
              inputMode="decimal"
              placeholder="Bag size (ft³)"
              value={bagSize}
              onChange={(e) => setBagSize(e.target.value)}
              style={{ margin: 0 }}
            />
          </div>

          {/* Price */}
          <p style={labelStyle}>Price (optional)</p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
            }}
          >
            <input
              className="calc-input"
              type="text"
              inputMode="decimal"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              style={{ margin: 0 }}
            />
            <div
              className="modern-dropdown"
              onClick={() => setPriceBasisOpen(!priceBasisOpen)}
              style={{ margin: 0 }}
            >
              {priceBasis === "bag" ? "per bag" : "per cubic yard"}
              <span className="dropdown-indicator">▼</span>
              {priceBasisOpen && (
                <ul className="dropdown-list">
                  <li
                    onClick={() => {
                      setPriceBasis("bag");
                      setPriceBasisOpen(false);
                    }}
                  >
                    per bag
                  </li>
                  <li
                    onClick={() => {
                      setPriceBasis("yd3");
                      setPriceBasisOpen(false);
                    }}
                  >
                    per cubic yard
                  </li>
                </ul>
              )}
            </div>
          </div>

          {/* Extra allowance */}
          <p style={labelStyle}>Extra for settling (%)</p>
          <input
            className="calc-input"
            type="text"
            inputMode="decimal"
            placeholder="Suggested 5 to 10"
            value={extra}
            onChange={(e) => setExtra(e.target.value)}
            style={{ margin: 0 }}
          />

          <div style={{ display: "flex", gap: "10px", marginTop: "14px" }}>
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
          <MulchResultPanel result={result} />
        </div>

        {/* ---- SEO CONTENT ---- */}

        <h2>How Much Mulch for a Garden Bed?</h2>
        <p>
          Three measurements settle it: how long the bed is, how wide, and how
          deep you intend to spread. Length times width gives the area, and area
          times depth gives the volume — with the one wrinkle that depth is
          quoted in inches while the bed is measured in feet, so the depth has
          to be divided by twelve before the three numbers can be multiplied
          together.
        </p>
        <pre>
          Area (sq ft) = length × width{"\n"}Volume (cu ft) = area × (depth in
          inches ÷ 12){"\n"}Bags = volume ÷ bag size{"\n"}Cubic yards = volume ÷
          27
        </pre>
        <p>
          A border 20 feet long and 4 feet deep is 80 square feet. At three
          inches the depth in feet is 0.25, so the volume is 80 × 0.25 ={" "}
          <strong>20 cubic feet</strong>. In standard two-cubic-foot bags that
          is <strong>ten bags</strong>, and in bulk terms it is 20 ÷ 27, or{" "}
          <strong>0.74 of a cubic yard</strong>.
        </p>
        <p>
          That last figure is the awkward one, and it is worth noticing early.
          Bulk mulch is sold by the cubic yard, and most domestic beds need an
          unhelpful fraction of one.
        </p>

        <h2>What One Bag Actually Covers</h2>
        <p>
          Because mulch is usually bought in bags, the useful coverage figure is
          per bag rather than per cubic yard. A two-cubic-foot bag spread at a
          given depth covers an area you can work out by dividing the bag volume
          by the depth in feet — and because that depth sits underneath, the
          coverage halves every time the depth doubles.
        </p>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Depth</th>
                <th>Square feet covered by one 2 ft³ bag</th>
                <th>Bags for a 100 sq ft bed</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1 inch</td>
                <td>24</td>
                <td>5</td>
              </tr>
              <tr>
                <td>2 inches</td>
                <td>12</td>
                <td>9</td>
              </tr>
              <tr>
                <td>3 inches</td>
                <td>8</td>
                <td>13</td>
              </tr>
              <tr>
                <td>4 inches</td>
                <td>6</td>
                <td>17</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          The third column is the one that changes minds at the checkout. The
          same hundred square feet takes nine bags at two inches and seventeen
          at four — the depth you pick is very nearly the whole cost of the job,
          and it is the input people give least thought to.
        </p>

        <h2>Two to Three Inches, and Why More Is Worse</h2>
        <p>
          With stone, deeper generally means sturdier. Mulch is the opposite: it
          has a ceiling as well as a floor, and overshooting causes problems
          that under-mulching does not.
        </p>
        <p>
          Below about two inches there is simply not enough material to block
          light, so weed seeds germinate through it and the main job goes
          undone. Above about four, the layer starts working against the bed it
          is meant to help. Light rain is absorbed by the mulch and evaporates
          before reaching soil. The ground underneath stays cold and airless.
          Roots, finding moisture in the mulch rather than below it, grow upward
          into a layer that dries out hard in the first warm spell.
        </p>
        <p>
          The worst version is mulch heaped against a trunk or stem. Bark that
          is kept permanently damp rots, and because the damage happens at
          ground level under a mound, it is usually well advanced before
          anything visible goes wrong higher up. Whatever depth you choose
          across the bed, pull it back to leave the base clear.
        </p>

        <p>
          A spade or a rake marked in fractions gives you a depth like two and a
          half inches rather than 2.5, and the box above wants the decimal. The{" "}
          <Link href="/mixed-number-calculator/" className="my-link">
            mixed number calculator
          </Link>{" "}
          will turn any fraction into one.
        </p>

        <h2>Bags or Bulk, and Where Mulch Differs From Stone</h2>
        <p>
          A cubic yard is 27 cubic feet, so at two cubic feet a bag it is{" "}
          <strong>13.5 bags</strong> — a half-bag remainder that makes bulk and
          bagged prices annoying to compare. The practical version is that you
          will buy fourteen and have some over.
        </p>
        <p>
          The crossover sits lower than it does for aggregates, though, and for
          a reason worth knowing. Mulch is light, so a volume that would be
          punishing to move as stone is manageable as bark. Bags stay reasonable
          further up the scale, and the decision is usually about whether you
          have somewhere to tip a bulk load rather than whether you can carry
          it. Below roughly a cubic yard, bags nearly always win; past two or
          three, a delivery does.
        </p>
        <p>
          If you are pricing bagged against bulk, the{" "}
          <Link href="/unit-conversion-calculator/" className="my-link">
            unit conversion calculator
          </Link>{" "}
          will put both on the same footing, and the{" "}
          <Link href="/percentage-calculator/" className="my-link">
            percentage calculator
          </Link>{" "}
          will turn the gap into a figure worth acting on.
        </p>

        <h2>Mulch Disappears, and That Is the Point</h2>
        <p>
          Unlike gravel, mulch is consumable. It breaks down into the soil,
          which is half of what you are paying for — the weed suppression is
          this season's benefit, the soil improvement is next season's. A bed
          that looked three inches deep in spring may be nearer an inch and a
          half by the following one.
        </p>
        <p>
          This changes how you should measure for a top-up. Rake back what is
          left, find out how deep it actually is, and calculate for the
          shortfall rather than for the full depth again. Beds topped up
          annually without that check climb steadily past the useful range, and
          arrive at the smothering problem by accident rather than by decision.
        </p>
        <p>
          Finer materials break down faster than coarse chip, so the rhythm is
          set by what you spread rather than by the calendar.
        </p>

        <h2>Several Beds, and Beds That Are Not Rectangles</h2>
        <p>
          Most gardens are a handful of beds rather than one, and the calculator
          adds them for you — measure each as its own rectangle and let the
          totals combine. This beats measuring the whole garden and guessing a
          proportion, because the error in a guess applies to every square foot
          at once.
        </p>
        <p>
          Curved borders are best squared off generously: take the longest
          length and the widest width, accept that you are over-measuring a
          little, and treat that as part of the allowance rather than as a
          mistake. Mulch left over has uses. Mulch three bags short on a
          Saturday afternoon does not.
        </p>

        <h2>Why Add Five to Ten Per Cent</h2>
        <p>
          Three ordinary losses sit between the volume you calculate and the
          volume that ends up on the bed. Fresh mulch settles once it takes
          rain. Some is lost over edges, onto paths and into the barrow. And a
          bed measured as a clean rectangle almost never is one.
        </p>
        <p>
          Five to ten per cent covers all three for most jobs, at the lower end
          for a tidy bed with hard edges and the upper for anything awkward or
          exposed. The allowance here starts at zero deliberately, so the plain
          arithmetic is visible first and whatever you add on top is a decision
          you made rather than a margin somebody buried in the formula.
        </p>

        {/* ---- FAQ ---- */}
        <h2>Mulch Quantity Questions</h2>
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
          <MulchResultPanel result={result} />
        </div>

        <div className="sidebar-box">
          <p style={{ fontSize: "20px", fontWeight: 600 }}>
            Related Calculators
          </p>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li>
              <Link href="/gravel-calculator/">
                <span style={{ textDecoration: "none" }}>
                  Gravel Calculator
                </span>
              </Link>
            </li>
            <li>
              <Link href="/unit-conversion-calculator/">
                <span style={{ textDecoration: "none" }}>
                  Unit Conversion Calculator
                </span>
              </Link>
            </li>
            <li>
              <Link href="/percentage-calculator/">
                <span style={{ textDecoration: "none" }}>
                  Percentage Calculator
                </span>
              </Link>
            </li>
            <li>
              <Link href="/carbon-footprint-calculator/">
                <span style={{ textDecoration: "none" }}>
                  Carbon Footprint Calculator
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
