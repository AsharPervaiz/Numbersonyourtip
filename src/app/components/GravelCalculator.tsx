"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

/* ─────────────────────────────────────────
   Units and conversions.
   Every factor here is exact by definition,
   so nothing in the output depends on a
   rounded constant.
───────────────────────────────────────── */
const M_PER_FT = 0.3048; // exact, by international agreement
const FT3_PER_YD3 = 27; // 3 × 3 × 3
const FT3_PER_M3 = 1 / (M_PER_FT * M_PER_FT * M_PER_FT); // ≈ 35.3147
const KG_PER_LB = 0.45359237; // exact
const LB_PER_US_TON = 2000;

type Shape = "rectangle" | "circle" | "triangle" | "multiple";

const LENGTH_UNITS: Record<string, { label: string; feet: number }> = {
  feet: { label: "Feet", feet: 1 },
  yards: { label: "Yards", feet: 3 },
  metres: { label: "Metres", feet: 1 / M_PER_FT },
};

const DEPTH_UNITS: Record<string, { label: string; feet: number }> = {
  inches: { label: "Inches", feet: 1 / 12 },
  cm: { label: "Centimetres", feet: 0.01 / M_PER_FT },
  feet: { label: "Feet", feet: 1 },
};

/* Typical loose dry densities in pounds per cubic foot. These are starting
   points, not constants: screened size, stone shape and how wet the pile is
   all move the figure, which is why the field stays editable and why the
   panel always shows which density produced the weight. */
const MATERIALS: { name: string; density: number }[] = [
  { name: "Crushed stone", density: 100 },
  { name: "Pea gravel", density: 96 },
  { name: "River rock", density: 99 },
  { name: "Crushed limestone", density: 100 },
  { name: "Decorative gravel", density: 95 },
  { name: "Lava rock", density: 50 },
  { name: "Custom density", density: 100 },
];

const PRICE_BASIS: Record<string, string> = {
  ton: "per US ton",
  yd3: "per cubic yard",
  m3: "per cubic metre",
};

/* ─────────────────────────────────────────
   Types
───────────────────────────────────────── */
interface GravelResult {
  areaFt2: number;
  depthFt: number;
  depthInches: number;
  volumeFt3: number;
  volumeYd3: number;
  volumeM3: number;
  weightLb: number;
  weightTons: number;
  weightKg: number;
  weightTonnes: number;
  density: number;
  materialName: string;
  bags: number | null;
  bagSizeFt3: number;
  totalCost: number | null;
  priceBasis: string;
  price: number | null;
  allowancePct: number;
  shape: Shape;
}

/* ─────────────────────────────────────────
   Pure helpers
───────────────────────────────────────── */
// The gauge reads depth, because depth is the input that most often turns a
// correct sum into the wrong amount of gravel. Scale runs 0–12 inches.
function needleDeg(inches: number): number {
  const clamped = Math.min(Math.max(inches, 0), 12);
  return -90 + (clamped / 12) * 180;
}

function num(n: number, dp = 2): string {
  if (!isFinite(n)) return "—";
  return n.toLocaleString("en-US", {
    minimumFractionDigits: dp,
    maximumFractionDigits: dp,
  });
}

/* ─────────────────────────────────────────
   GravelResultPanel
───────────────────────────────────────── */
function GravelResultPanel({ result }: { result: GravelResult | null }) {
  if (!result) {
    return (
      <div className="cr-panel-placeholder">
        <div className="cr-ph-icon">
          <i className="fa-solid fa-mountain" aria-hidden="true" />
        </div>
        Enter your area and depth to see volume, weight and cost here.
      </div>
    );
  }

  const {
    areaFt2,
    depthInches,
    volumeFt3,
    volumeYd3,
    volumeM3,
    weightLb,
    weightTons,
    weightKg,
    weightTonnes,
    density,
    materialName,
    bags,
    bagSizeFt3,
    totalCost,
    priceBasis,
    price,
    allowancePct,
  } = result;

  // Depth bands. These describe what a given depth is normally used for
  // rather than prescribing one — the right depth depends on the ground
  // underneath and what will drive over it.
  const depthLabel =
    depthInches < 1
      ? "Very thin"
      : depthInches < 2
        ? "Light top-up"
        : depthInches < 4
          ? "Top dressing"
          : depthInches < 6
            ? "Driveway or path layer"
            : "Deep base layer";

  const depthBadge =
    depthInches < 2
      ? "warning"
      : depthInches < 4
        ? "normal"
        : depthInches < 8
          ? "good"
          : "info";

  // Where the order sits between "carry bags home" and "book a delivery".
  // The crossover is arithmetic, not opinion: one cubic yard is 27 cubic
  // feet, so it is 54 half-cubic-foot bags.
  const orderPct = 2 + (Math.min(volumeYd3, 20) / 20) * 96;
  const bagsPerYd3 = bagSizeFt3 > 0 ? FT3_PER_YD3 / bagSizeFt3 : 0;

  // Tons per cubic yard is the figure that reconciles a calculator's answer
  // with a supplier's quote, so it is worth stating outright.
  const tonsPerYd3 = (density * FT3_PER_YD3) / LB_PER_US_TON;

  return (
    <div className="cr-panel">
      <div className="cr-gauge-wrap">
        <svg
          className="cr-gauge-svg"
          width="100"
          height="60"
          viewBox="0 0 120 70"
          role="img"
          aria-label={`Depth gauge showing ${depthInches.toFixed(1)} inches`}
        >
          <defs>
            <clipPath id="gravel-half">
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
            strokeDasharray="27 326"
            strokeDashoffset="-163"
            clipPath="url(#gravel-half)"
          />
          <circle
            cx="60"
            cy="65"
            r="52"
            fill="none"
            stroke="#FAC775"
            strokeWidth="12"
            strokeDasharray="27 326"
            strokeDashoffset="-190"
            clipPath="url(#gravel-half)"
          />
          <circle
            cx="60"
            cy="65"
            r="52"
            fill="none"
            stroke="#97C459"
            strokeWidth="12"
            strokeDasharray="55 326"
            strokeDashoffset="-217"
            clipPath="url(#gravel-half)"
          />
          <circle
            cx="60"
            cy="65"
            r="52"
            fill="none"
            stroke="#B5D4F4"
            strokeWidth="12"
            strokeDasharray="163 326"
            strokeDashoffset="-272"
            clipPath="url(#gravel-half)"
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
          <div className="cr-score">{num(volumeYd3)}</div>
          <div className="cr-score-label">cubic yards of gravel</div>
          <span className={`cr-badge ${depthBadge}`}>{depthLabel}</span>
        </div>
      </div>

      <hr className="cr-divider" />

      {/* Depth meter — the gauge reading, spelled out against its scale */}
      <div>
        <div className="cr-bar-label">
          depth ({num(depthInches, 1)} in over {num(areaFt2, 0)} sq ft)
        </div>
        <div
          className="cr-bar-track"
          style={{
            background:
              "linear-gradient(to right, #F09595 0%, #FAC775 17%, #97C459 33%, #B5D4F4 67%)",
          }}
        >
          <div
            className="cr-bar-thumb"
            style={{ left: `${2 + (Math.min(depthInches, 12) / 12) * 96}%` }}
          />
        </div>
        <div className="cr-bar-ticks">
          <span>0&quot;</span>
          <span>2&quot;</span>
          <span>4&quot;</span>
          <span>8&quot;</span>
          <span>12&quot;</span>
        </div>
      </div>

      <hr className="cr-divider" />

      {/* Volume in all three units */}
      <div className="cr-metrics-grid">
        <div className="cr-metric-card">
          <div className="cr-m-label">Cubic feet</div>
          <div className="cr-m-value">{num(volumeFt3)}</div>
          <div className="cr-m-sub">ft³</div>
        </div>
        <div className="cr-metric-card">
          <div className="cr-m-label">Cubic yards</div>
          <div className="cr-m-value">{num(volumeYd3)}</div>
          <div className="cr-m-sub">yd³ — how bulk is ordered</div>
        </div>
        <div className="cr-metric-card">
          <div className="cr-m-label">Cubic metres</div>
          <div className="cr-m-value">{num(volumeM3)}</div>
          <div className="cr-m-sub">m³</div>
        </div>
        <div className="cr-metric-card">
          <div className="cr-m-label">Area covered</div>
          <div className="cr-m-value">{num(areaFt2, 0)}</div>
          <div className="cr-m-sub">sq ft</div>
        </div>
      </div>

      <hr className="cr-divider" />

      {/* Weight */}
      <div className="cr-metrics-grid">
        <div className="cr-metric-card">
          <div className="cr-m-label">US tons</div>
          <div className="cr-m-value">{num(weightTons)}</div>
          <div className="cr-m-sub">at {num(tonsPerYd3)} tons per yd³</div>
        </div>
        <div className="cr-metric-card">
          <div className="cr-m-label">Pounds</div>
          <div className="cr-m-value">{num(weightLb, 0)}</div>
          <div className="cr-m-sub">lb</div>
        </div>
        <div className="cr-metric-card">
          <div className="cr-m-label">Kilograms</div>
          <div className="cr-m-value">{num(weightKg, 0)}</div>
          <div className="cr-m-sub">kg</div>
        </div>
        <div className="cr-metric-card">
          <div className="cr-m-label">Tonnes</div>
          <div className="cr-m-value">{num(weightTonnes)}</div>
          <div className="cr-m-sub">metric</div>
        </div>
      </div>

      <hr className="cr-divider" />

      {/* Bags versus bulk */}
      <div>
        <div className="cr-bar-label">
          order size ({num(volumeYd3)} yd³ of {materialName.toLowerCase()})
        </div>
        <div
          className="cr-bar-track"
          style={{
            background:
              "linear-gradient(to right, #C0DD97 0%, #FAC775 15%, #B5D4F4 50%)",
          }}
        >
          <div className="cr-bar-thumb" style={{ left: `${orderPct}%` }} />
        </div>
        <div className="cr-bar-ticks">
          <span>0</span>
          <span>1 yd³</span>
          <span>3</span>
          <span>10</span>
          <span>20+</span>
        </div>
        {bags !== null && (
          <div className="cr-world-note" style={{ marginTop: "10px" }}>
            That is <strong>{Math.ceil(bags).toLocaleString()} bags</strong> at{" "}
            {num(bagSizeFt3, 2)} ft³ each — {Math.round(bagsPerYd3)} bags to a
            cubic yard.
          </div>
        )}
      </div>

      {totalCost !== null && price !== null && (
        <>
          <hr className="cr-divider" />
          <div className="cr-metrics-grid">
            <div className="cr-metric-card">
              <div className="cr-m-label">Price</div>
              <div className="cr-m-value">{num(price)}</div>
              <div className="cr-m-sub">{PRICE_BASIS[priceBasis]}</div>
            </div>
            <div className="cr-metric-card">
              <div className="cr-m-label">Total cost</div>
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
          <strong>{num(volumeFt3)} ft³</strong>
          <br />
          {num(volumeFt3)} ft³ ÷ 27 = <strong>{num(volumeYd3)} yd³</strong>
          <br />
          {num(volumeFt3)} ft³ × {density} lb/ft³ ÷ 2,000 ={" "}
          <strong>{num(weightTons)} tons</strong>
          {allowancePct > 0 && (
            <>
              <br />
              Includes {allowancePct}% added for settling.
            </>
          )}
        </div>
      </div>

      <hr className="cr-divider" />

      <div className="cr-world-note" style={{ fontStyle: "italic" }}>
        Weight assumes {density} lb per cubic foot. Density shifts with stone
        size and how wet the pile is, so a supplier&apos;s own figure beats this
        one — the volume above does not change either way.
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   FAQ data (also builds the FAQPage JSON-LD,
   so schema and on-page copy always match)
───────────────────────────────────────── */
const FAQ_DATA: [string, string][] = [
  [
    "How much gravel do I need for a driveway?",
    "Multiply the length by the width to get the area, multiply that by the depth in feet, then divide by 27 to reach cubic yards. A driveway 40 feet long and 12 feet wide is 480 square feet; at four inches deep that is 480 × 0.333 = 160 cubic feet, or 5.93 cubic yards. At around 100 pounds per cubic foot that comes to roughly eight US tons. The arithmetic is the easy half — deciding the depth is the part worth thinking about.",
  ],
  [
    "How many tons is a cubic yard of gravel?",
    "A little over one and a third, for most stone. A cubic yard is 27 cubic feet, so at 100 pounds per cubic foot it weighs 2,700 pounds, and a US ton is 2,000 pounds — giving 1.35 tons per cubic yard. Lighter material shifts this: pea gravel near 96 pounds per cubic foot works out at about 1.30 tons per yard, while lava rock at roughly half that density is nearer 0.68.",
  ],
  [
    "How deep should gravel be?",
    "Deep enough that the stones lock together rather than scatter, which in practice means the layer should be several times the size of the stone. A common working figure for a driveway surface is four inches, with a separate and usually deeper base beneath it. Two to three inches is a top dressing — fine for refreshing an existing surface, not for carrying a car on bare soil. Your groundworker or supplier will specify for your soil and traffic, and that specification should win over any general figure.",
  ],
  [
    "How many bags of gravel are in a cubic yard?",
    "Fifty-four, if the bags hold half a cubic foot each, because a cubic yard is 27 cubic feet. That is the number that usually settles the bags-or-bulk question: even a small project runs into dozens of bags, and anything past a cubic yard turns into a load to carry, stack and dispose of packaging for. Bag sizes vary, so divide 27 by whatever volume your bag actually states rather than assuming.",
  ],
  [
    "Why does my supplier quote tons when the calculator gives yards?",
    "Because bulk stone is weighed on a weighbridge, not measured in a box. Volume is what your project needs and weight is what the lorry can verify, so the two systems meet through density. Converting between them is one multiplication, but it depends on a figure that varies by material and moisture — which is why a quote in tons and a calculation in yards can disagree slightly even when both are right.",
  ],
  [
    "Should I order extra for compaction?",
    "Usually a little, though how much depends on what is underneath. Loose stone settles as it is driven on, and some of it works down into soft ground, so the finished depth ends up below the depth you spread. Adding a percentage on top covers that, and this calculator leaves the allowance at zero so you can see the raw arithmetic first and add your own figure knowingly rather than inheriting someone else's fudge factor.",
  ],
  [
    "Does the calculator work for a circular or triangular area?",
    "Yes — the shape only changes how the area is worked out, and everything after that is identical. A circle is π times the radius squared, so a 10-foot-wide circular firepit area is π × 5² = 78.5 square feet. A triangle is half the base times the perpendicular height. Once you have square feet, the depth, volume, weight and cost all follow the same way regardless of the outline.",
  ],
  [
    "How do I handle a drive that is not one simple shape?",
    "Break it into rectangles and add them. Almost any awkward outline — an L-shaped drive, a path that widens at the gate, a parking area with a turning spur — is a handful of rectangles that each measure easily, and the multiple-areas option adds them for you. It is far more reliable than trying to average an irregular width, because an average that is out by a foot is out across the whole length.",
  ],
  [
    "Is the cost figure the full cost of the job?",
    "No, it is the material only. Delivery is often charged separately and can depend on distance, load size and whether a tipper can reach the spot. Groundwork, edging, membrane, hire of a plate compactor and disposal of what you dig out are all outside this calculation. The number here is the one to take to a supplier for a material quote, not a budget for the whole project.",
  ],
];

/* ─────────────────────────────────────────
   Component
───────────────────────────────────────── */
export default function GravelCalculator() {
  const [shape, setShape] = useState<Shape>("rectangle");
  const [shapeOpen, setShapeOpen] = useState(false);

  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [diameter, setDiameter] = useState("");
  const [base, setBase] = useState("");
  const [height, setHeight] = useState("");

  const [areas, setAreas] = useState<
    { id: number; length: string; width: string }[]
  >([
    { id: 1, length: "", width: "" },
    { id: 2, length: "", width: "" },
  ]);

  const [lengthUnit, setLengthUnit] = useState("feet");
  const [lengthUnitOpen, setLengthUnitOpen] = useState(false);

  const [depth, setDepth] = useState("");
  const [depthUnit, setDepthUnit] = useState("inches");
  const [depthUnitOpen, setDepthUnitOpen] = useState(false);

  const [material, setMaterial] = useState("Crushed stone");
  const [materialOpen, setMaterialOpen] = useState(false);
  const [density, setDensity] = useState("100");

  const [price, setPrice] = useState("");
  const [priceBasis, setPriceBasis] = useState("ton");
  const [priceBasisOpen, setPriceBasisOpen] = useState(false);

  const [bagSize, setBagSize] = useState("0.5");
  const [allowance, setAllowance] = useState("");

  const [result, setResult] = useState<GravelResult | null>(null);
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

  const compute = (): GravelResult | null => {
    const uf = LENGTH_UNITS[lengthUnit].feet;
    let areaFt2 = 0;

    if (shape === "rectangle") {
      areaFt2 = toNum(length) * uf * (toNum(width) * uf);
    } else if (shape === "circle") {
      const r = (toNum(diameter) * uf) / 2;
      areaFt2 = Math.PI * r * r;
    } else if (shape === "triangle") {
      areaFt2 = 0.5 * (toNum(base) * uf) * (toNum(height) * uf);
    } else {
      areaFt2 = areas.reduce(
        (sum, a) => sum + toNum(a.length) * uf * (toNum(a.width) * uf),
        0,
      );
    }

    const depthFt = toNum(depth) * DEPTH_UNITS[depthUnit].feet;
    if (!areaFt2 || areaFt2 <= 0 || !depthFt || depthFt <= 0) return null;

    const allowancePct = Math.max(0, toNum(allowance));
    const rawFt3 = areaFt2 * depthFt;
    const volumeFt3 = rawFt3 * (1 + allowancePct / 100);
    if (!isFinite(volumeFt3) || volumeFt3 <= 0) return null;

    const d = toNum(density) || 100;
    const weightLb = volumeFt3 * d;
    const volumeYd3 = volumeFt3 / FT3_PER_YD3;
    const volumeM3 = volumeFt3 / FT3_PER_M3;

    const bagSizeFt3 = toNum(bagSize);
    const bags = bagSizeFt3 > 0 ? volumeFt3 / bagSizeFt3 : null;

    const p = toNum(price);
    let totalCost: number | null = null;
    if (p > 0) {
      const qty =
        priceBasis === "ton"
          ? weightLb / LB_PER_US_TON
          : priceBasis === "yd3"
            ? volumeYd3
            : volumeM3;
      totalCost = qty * p;
    }

    return {
      areaFt2,
      depthFt,
      depthInches: depthFt * 12,
      volumeFt3,
      volumeYd3,
      volumeM3,
      weightLb,
      weightTons: weightLb / LB_PER_US_TON,
      weightKg: weightLb * KG_PER_LB,
      weightTonnes: (weightLb * KG_PER_LB) / 1000,
      density: d,
      materialName: material,
      bags,
      bagSizeFt3,
      totalCost,
      priceBasis,
      price: p > 0 ? p : null,
      allowancePct,
      shape,
    };
  };

  /* The panel follows the inputs live; the button re-runs the same
     calculation so the control still behaves as expected. */
  useEffect(() => {
    setResult(compute());
  }, [
    shape,
    length,
    width,
    diameter,
    base,
    height,
    areas,
    lengthUnit,
    depth,
    depthUnit,
    density,
    material,
    price,
    priceBasis,
    bagSize,
    allowance,
  ]);

  const calculate = () => setResult(compute());

  const handleClear = () => {
    setLength("");
    setWidth("");
    setDiameter("");
    setBase("");
    setHeight("");
    setAreas([
      { id: 1, length: "", width: "" },
      { id: 2, length: "", width: "" },
    ]);
    setDepth("");
    setPrice("");
    setAllowance("");
    setBagSize("0.5");
    setMaterial("Crushed stone");
    setDensity("100");
    setShape("rectangle");
    setLengthUnit("feet");
    setDepthUnit("inches");
    setPriceBasis("ton");
    setResult(null);
  };

  const unitLabel = LENGTH_UNITS[lengthUnit].label.toLowerCase();

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
        <h1>Gravel Calculator — Cubic Yards, Tons and Cost</h1>
        <p>
          Work out how much gravel a driveway, path or landscaping project needs
          — in cubic yards, tons or cubic metres, how many bags that is, and
          what the material will cost. Handles rectangles, circles, triangles
          and several areas at once, for pea gravel, crushed stone, river rock
          and limestone.
        </p>

        <div className="calc-card single-calc">
          {/* Shape */}
          <p style={{ marginBottom: "5px", fontWeight: 600, color: "white" }}>
            Project shape
          </p>
          <div
            className="modern-dropdown"
            onClick={() => setShapeOpen(!shapeOpen)}
            style={{ margin: 0 }}
          >
            {shape === "rectangle"
              ? "Rectangle"
              : shape === "circle"
                ? "Circle"
                : shape === "triangle"
                  ? "Triangle"
                  : "Multiple areas"}
            <span className="dropdown-indicator">▼</span>
            {shapeOpen && (
              <ul className="dropdown-list">
                {(
                  [
                    ["rectangle", "Rectangle"],
                    ["circle", "Circle"],
                    ["triangle", "Triangle"],
                    ["multiple", "Multiple areas"],
                  ] as [Shape, string][]
                ).map(([v, l]) => (
                  <li
                    key={v}
                    onClick={() => {
                      setShape(v);
                      setShapeOpen(false);
                    }}
                  >
                    {l}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Measurement unit */}
          <p
            style={{
              marginBottom: "5px",
              fontWeight: 600,
              color: "white",
              marginTop: "14px",
            }}
          >
            Measured in
          </p>
          <div
            className="modern-dropdown"
            onClick={() => setLengthUnitOpen(!lengthUnitOpen)}
            style={{ margin: 0 }}
          >
            {LENGTH_UNITS[lengthUnit].label}
            <span className="dropdown-indicator">▼</span>
            {lengthUnitOpen && (
              <ul className="dropdown-list">
                {Object.entries(LENGTH_UNITS).map(([k, v]) => (
                  <li
                    key={k}
                    onClick={() => {
                      setLengthUnit(k);
                      setLengthUnitOpen(false);
                    }}
                  >
                    {v.label}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Dimensions per shape */}
          {shape === "rectangle" && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px",
                marginTop: "12px",
              }}
            >
              <input
                className="calc-input"
                type="text"
                inputMode="decimal"
                placeholder={`Length (${unitLabel})`}
                value={length}
                onChange={(e) => setLength(e.target.value)}
                style={{ margin: 0 }}
              />
              <input
                className="calc-input"
                type="text"
                inputMode="decimal"
                placeholder={`Width (${unitLabel})`}
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                style={{ margin: 0 }}
              />
            </div>
          )}

          {shape === "circle" && (
            <input
              className="calc-input"
              type="text"
              inputMode="decimal"
              placeholder={`Diameter (${unitLabel})`}
              value={diameter}
              onChange={(e) => setDiameter(e.target.value)}
              style={{ marginTop: "12px" }}
            />
          )}

          {shape === "triangle" && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px",
                marginTop: "12px",
              }}
            >
              <input
                className="calc-input"
                type="text"
                inputMode="decimal"
                placeholder={`Base (${unitLabel})`}
                value={base}
                onChange={(e) => setBase(e.target.value)}
                style={{ margin: 0 }}
              />
              <input
                className="calc-input"
                type="text"
                inputMode="decimal"
                placeholder={`Height (${unitLabel})`}
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                style={{ margin: 0 }}
              />
            </div>
          )}

          {shape === "multiple" && (
            <div style={{ marginTop: "12px" }}>
              {areas.map((a, i) => (
                <div
                  key={a.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr auto",
                    gap: "10px",
                    marginBottom: "8px",
                    alignItems: "center",
                  }}
                >
                  <input
                    className="calc-input"
                    type="text"
                    inputMode="decimal"
                    placeholder={`Area ${i + 1} length`}
                    value={a.length}
                    onChange={(e) =>
                      setAreas(
                        areas.map((x) =>
                          x.id === a.id ? { ...x, length: e.target.value } : x,
                        ),
                      )
                    }
                    style={{ margin: 0 }}
                  />
                  <input
                    className="calc-input"
                    type="text"
                    inputMode="decimal"
                    placeholder={`Area ${i + 1} width`}
                    value={a.width}
                    onChange={(e) =>
                      setAreas(
                        areas.map((x) =>
                          x.id === a.id ? { ...x, width: e.target.value } : x,
                        ),
                      )
                    }
                    style={{ margin: 0 }}
                  />
                  <button
                    type="button"
                    className="calc-button calc-clear"
                    onClick={() =>
                      setAreas(
                        areas.length > 1
                          ? areas.filter((x) => x.id !== a.id)
                          : areas,
                      )
                    }
                    style={{ padding: "8px 12px", margin: 0 }}
                    aria-label={`Remove area ${i + 1}`}
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="calc-button calc-clear"
                onClick={() =>
                  setAreas([
                    ...areas,
                    {
                      id: Math.max(0, ...areas.map((x) => x.id)) + 1,
                      length: "",
                      width: "",
                    },
                  ])
                }
                style={{ marginTop: "4px" }}
              >
                + Add another area
              </button>
            </div>
          )}

          {/* Depth */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
              marginTop: "12px",
            }}
          >
            <input
              className="calc-input"
              type="text"
              inputMode="decimal"
              placeholder="Depth"
              value={depth}
              onChange={(e) => setDepth(e.target.value)}
              style={{ margin: 0 }}
            />
            <div
              className="modern-dropdown"
              onClick={() => setDepthUnitOpen(!depthUnitOpen)}
              style={{ margin: 0 }}
            >
              {DEPTH_UNITS[depthUnit].label}
              <span className="dropdown-indicator">▼</span>
              {depthUnitOpen && (
                <ul className="dropdown-list">
                  {Object.entries(DEPTH_UNITS).map(([k, v]) => (
                    <li
                      key={k}
                      onClick={() => {
                        setDepthUnit(k);
                        setDepthUnitOpen(false);
                      }}
                    >
                      {v.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Material + density */}
          <p
            style={{
              marginBottom: "5px",
              fontWeight: 600,
              color: "white",
              marginTop: "14px",
            }}
          >
            Material
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
            }}
          >
            <div
              className="modern-dropdown"
              onClick={() => setMaterialOpen(!materialOpen)}
              style={{ margin: 0 }}
            >
              {material}
              <span className="dropdown-indicator">▼</span>
              {materialOpen && (
                <ul className="dropdown-list">
                  {MATERIALS.map((m) => (
                    <li
                      key={m.name}
                      onClick={() => {
                        setMaterial(m.name);
                        setDensity(String(m.density));
                        setMaterialOpen(false);
                      }}
                    >
                      {m.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <input
              className="calc-input"
              type="text"
              inputMode="decimal"
              placeholder="Density (lb/ft³)"
              value={density}
              onChange={(e) => {
                setDensity(e.target.value);
                setMaterial("Custom density");
              }}
              style={{ margin: 0 }}
            />
          </div>

          {/* Price */}
          <p
            style={{
              marginBottom: "5px",
              fontWeight: 600,
              color: "white",
              marginTop: "14px",
            }}
          >
            Price (optional)
          </p>
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
              {PRICE_BASIS[priceBasis]}
              <span className="dropdown-indicator">▼</span>
              {priceBasisOpen && (
                <ul className="dropdown-list">
                  {Object.entries(PRICE_BASIS).map(([k, v]) => (
                    <li
                      key={k}
                      onClick={() => {
                        setPriceBasis(k);
                        setPriceBasisOpen(false);
                      }}
                    >
                      {v}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Bag size + settling allowance */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
              marginTop: "12px",
            }}
          >
            <input
              className="calc-input"
              type="text"
              inputMode="decimal"
              placeholder="Bag size (ft³)"
              value={bagSize}
              onChange={(e) => setBagSize(e.target.value)}
              style={{ margin: 0 }}
            />
            <input
              className="calc-input"
              type="text"
              inputMode="decimal"
              placeholder="Extra for settling (%)"
              value={allowance}
              onChange={(e) => setAllowance(e.target.value)}
              style={{ margin: 0 }}
            />
          </div>

          {/* Buttons */}
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
          <GravelResultPanel result={result} />
        </div>

        {/* ---- SEO CONTENT ---- */}

        <h2>How Much Gravel Do I Need for a Driveway?</h2>
        <p>
          Three numbers decide it: how long the drive is, how wide, and how deep
          you want the stone. Length times width gives the area, and area times
          depth gives a volume — the only trick is that depth is usually quoted
          in inches while the other two are in feet, so one of them has to be
          converted before they can be multiplied together.
        </p>
        <pre>
          Area (sq ft) = length × width{"\n"}Volume (cu ft) = area × (depth in
          inches ÷ 12){"\n"}Cubic yards = cubic feet ÷ 27{"\n"}Tons = cubic feet
          × density (lb/cu ft) ÷ 2,000
        </pre>
        <p>
          Take a drive 40 feet long and 12 feet wide. That is 480 square feet.
          At four inches, the depth in feet is 4 ÷ 12, or 0.333, so the volume
          is 480 × 0.333 = 160 cubic feet. Dividing by 27 gives{" "}
          <strong>5.93 cubic yards</strong>. At a density around 100 pounds per
          cubic foot, 160 × 100 = 16,000 pounds, which is{" "}
          <strong>eight US tons</strong>.
        </p>
        <p>
          Every part of that is arithmetic you can check. The judgement is in
          the four inches, not in the multiplication.
        </p>
        <p>
          Most drives are one of a handful of sizes, so the arithmetic above
          only has to be done once. Every row here is four inches deep, and the
          tonnage assumes 100 pounds per cubic foot.
        </p>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Driveway</th>
                <th>Area</th>
                <th>Cubic yards</th>
                <th>US tons</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>10 × 20 ft (one car)</td>
                <td>200 sq ft</td>
                <td>2.47</td>
                <td>3.33</td>
              </tr>
              <tr>
                <td>10 × 40 ft</td>
                <td>400 sq ft</td>
                <td>4.94</td>
                <td>6.67</td>
              </tr>
              <tr>
                <td>12 × 40 ft</td>
                <td>480 sq ft</td>
                <td>5.93</td>
                <td>8.00</td>
              </tr>
              <tr>
                <td>12 × 50 ft</td>
                <td>600 sq ft</td>
                <td>7.41</td>
                <td>10.00</td>
              </tr>
              <tr>
                <td>16 × 40 ft</td>
                <td>640 sq ft</td>
                <td>7.90</td>
                <td>10.67</td>
              </tr>
              <tr>
                <td>20 × 40 ft (two cars)</td>
                <td>800 sq ft</td>
                <td>9.88</td>
                <td>13.33</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Halve the depth and every figure halves with it. The same table works
          for a landscaping bed, a shed base or a parking pad — the calculator
          does not care what the rectangle is for.
        </p>

        <h2>One Cubic Yard Covers Less Than People Expect</h2>
        <p>
          A cubic yard sounds substantial, and at a shallow depth it is. Spread
          thicker, it disappears quickly — and because the relationship is
          inverse, doubling the depth halves the coverage exactly.
        </p>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Depth</th>
                <th>Depth in feet</th>
                <th>Square feet covered by 1 cubic yard</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1 inch</td>
                <td>0.083</td>
                <td>324</td>
              </tr>
              <tr>
                <td>2 inches</td>
                <td>0.167</td>
                <td>162</td>
              </tr>
              <tr>
                <td>3 inches</td>
                <td>0.250</td>
                <td>108</td>
              </tr>
              <tr>
                <td>4 inches</td>
                <td>0.333</td>
                <td>81</td>
              </tr>
              <tr>
                <td>6 inches</td>
                <td>0.500</td>
                <td>54</td>
              </tr>
              <tr>
                <td>12 inches</td>
                <td>1.000</td>
                <td>27</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Each figure is 27 divided by the depth in feet, nothing more. It is
          worth keeping the four-inch row in mind: a single cubic yard covers
          about the footprint of a small bedroom at driveway depth, which is why
          drives are ordered by the load rather than the bag.
        </p>
        <p>
          Suppliers sell by weight, so the same question is worth answering in
          tons. At 100 pounds per cubic foot a ton is 20 cubic feet, and
          coverage follows the same inverse rule.
        </p>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Depth</th>
                <th>Square feet covered by 1 US ton</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1 inch</td>
                <td>240</td>
              </tr>
              <tr>
                <td>2 inches</td>
                <td>120</td>
              </tr>
              <tr>
                <td>3 inches</td>
                <td>80</td>
              </tr>
              <tr>
                <td>4 inches</td>
                <td>60</td>
              </tr>
              <tr>
                <td>6 inches</td>
                <td>40</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          A ton covering sixty square feet at driveway depth is the figure worth
          remembering, because it turns a quote in tons back into something you
          can picture.
        </p>

        <h2>Depth Is Where the Money Goes</h2>
        <p>
          Area is fixed by your plot. Depth is the one input you choose, and it
          scales the cost in a straight line — going from three inches to four
          is a third more stone, a third more weight and a third more to pay, on
          exactly the same footprint.
        </p>
        <p>
          That makes it worth being deliberate rather than generous. Too thin
          and the stones sit as loose individuals: they scatter under tyres,
          migrate to the edges and show the surface beneath within a season. Too
          deep and the surface stays soft to walk and drive on, because there is
          no longer anything solid close under the stone. The useful rule is
          that a layer needs to be a few times the size of the stone in it for
          the pieces to interlock at all, which is why a nominal two-inch stone
          cannot make a sensible two-inch layer.
        </p>
        <p>
          Depths get quoted in fractions on site — two and a half inches, three
          and three quarters — while this calculator wants a decimal. The{" "}
          <Link href="/mixed-number-calculator/" className="my-link">
            mixed number calculator
          </Link>{" "}
          converts one into the other, which is quicker than reasoning about
          eighths at the tape.
        </p>

        <h2>Yards, Tons and the Number That Connects Them</h2>
        <p>
          A calculator gives volume because volume is what fills a space. A
          supplier quotes weight because a lorry crosses a weighbridge. Neither
          is being awkward — they are simply measuring different things, and
          density is the bridge between them.
        </p>
        <p>
          The conversion falls out of the definitions. A cubic yard is 27 cubic
          feet. At 100 pounds per cubic foot that is 2,700 pounds, and since a
          US ton is 2,000 pounds, one cubic yard is <strong>1.35 tons</strong>.
          Lighter material shifts the ratio proportionally, so pea gravel near
          96 pounds per cubic foot gives 1.30 tons per yard, and a lightweight
          decorative stone at half the density gives half the tonnage for the
          same hole.
        </p>
        <p>
          This is also why two correct answers can disagree. If your calculation
          assumes 100 pounds per cubic foot and the quarry works to 105, the
          tonnage differs by five per cent while the volume you actually need
          has not moved at all. When they disagree, trust the volume and let the
          supplier convert it with their own figure.
        </p>

        <h2>
          Pea Gravel, River Rock and Crushed Limestone Do Not Weigh the Same
        </h2>
        <p>
          Volume is set by the hole you are filling. Weight is set by what you
          put in it, and the spread between landscaping stones is wide enough to
          change a delivery. These are typical loose dry densities — the figures
          this calculator starts from, and ones you should overwrite the moment
          a supplier gives you theirs.
        </p>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Material</th>
                <th>Pounds per cubic foot</th>
                <th>US tons per cubic yard</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Crushed stone</td>
                <td>100</td>
                <td>1.35</td>
              </tr>
              <tr>
                <td>Crushed limestone</td>
                <td>100</td>
                <td>1.35</td>
              </tr>
              <tr>
                <td>River rock</td>
                <td>99</td>
                <td>1.34</td>
              </tr>
              <tr>
                <td>Pea gravel</td>
                <td>96</td>
                <td>1.30</td>
              </tr>
              <tr>
                <td>Decorative gravel</td>
                <td>95</td>
                <td>1.28</td>
              </tr>
              <tr>
                <td>Lava rock</td>
                <td>50</td>
                <td>0.68</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Two things are worth taking from that table. Most stone clusters
          within a few per cent of each other, so swapping pea gravel for
          crushed limestone changes the tonnage a little and the volume not at
          all. Lava rock is the exception that proves the point — at roughly
          half the density it fills the same space for half the weight, which is
          exactly why it turns up on roofs and in raised beds.
        </p>
        <p>
          The figures also move with condition rather than just material. The
          same stone measured loose, compacted and soaking wet can differ by a
          quarter or more, which is why published densities disagree with each
          other and why no single number deserves to be treated as fixed. Use
          the volume as the firm output and let weight follow from whichever
          density applies on the day.
        </p>

        <h2>Bags or a Bulk Load</h2>
        <p>
          The crossover is not a matter of taste, it is division. A cubic yard
          is 27 cubic feet, so at half a cubic foot per bag it is{" "}
          <strong>54 bags</strong>. At around 50 pounds each that is well over a
          ton to lift twice — once into the car and once out of it — plus 54
          empty sacks to deal with.
        </p>
        <p>
          Bags earn their place for small, precise, awkward jobs: a border, a
          pot, a patch, somewhere a tipper cannot reach. Past roughly a cubic
          yard the handling dominates, and a delivered load is usually cheaper
          per unit as well as very much easier. The meter in the results panel
          shows where your project sits on that line.
        </p>

        <h2>Circles, Triangles and Drives That Are Neither</h2>
        <p>
          Only the area step changes with shape. A circular area is π times the
          radius squared, so a firepit surround ten feet across has a radius of
          five and an area of π × 25 = 78.5 square feet. A triangle is half the
          base times the perpendicular height — the height measured square to
          the base, not along a sloping side, which is the usual slip.
        </p>
        <p>
          Anything genuinely irregular is best broken into rectangles and added.
          An L-shaped drive is two. A path that widens at the gate is two. A
          parking area with a turning spur is two or three. This beats averaging
          an awkward width, because an average that is a foot out is a foot out
          along the entire length — on a 40-foot drive that single foot is 40
          square feet of stone you either lack or have paid for.
        </p>
        <p>
          For measurements that arrive in mixed units, the{" "}
          <Link href="/unit-conversion-calculator/" className="my-link">
            unit conversion calculator
          </Link>{" "}
          will square them up first, and the{" "}
          <Link href="/percentage-calculator/" className="my-link">
            percentage calculator
          </Link>{" "}
          will handle a settling allowance if you would rather work it out
          separately.
        </p>

        <h2>Why the Finished Depth Is Less Than the Depth You Spread</h2>
        <p>
          Loose stone does not stay where it lands. Traffic pushes the pieces
          into each other until they lock, and on anything soft a proportion
          presses down into the ground and is simply gone from the surface. Both
          effects reduce the depth you end up with relative to the depth you
          bought.
        </p>
        <p>
          How much to add depends entirely on what is underneath — a
          well-prepared compacted base takes very little, while stone tipped
          onto soft soil can lose a noticeable fraction before it stops moving.
          That is why the settling allowance on this calculator starts at zero.
          You see the plain arithmetic first, then add your own figure knowing
          exactly what it is doing, rather than inheriting a hidden margin
          someone else chose.
        </p>

        <h2>What This Number Does Not Cover</h2>
        <p>
          The cost shown is material only. Delivery is commonly billed
          separately and varies with distance, load size and access. Excavation,
          edging to stop the stone migrating, a separating membrane, compaction
          plant hire and disposal of whatever you dig out are all real costs on
          a real driveway and none of them appear here.
        </p>
        <p>
          Treat the output as the figure to hand a supplier when asking for a
          material quote — accurate for what it measures, and deliberately
          silent about what it does not.
        </p>

        {/* ---- FAQ ---- */}
        <h2>Questions About Gravel Quantities</h2>
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
          <GravelResultPanel result={result} />
        </div>

        <div className="sidebar-box">
          <p style={{ fontSize: "20px", fontWeight: 600 }}>
            Related Calculators
          </p>
          <ul style={{ listStyle: "none", padding: 0 }}>
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
              <Link href="/discount-calculator/">
                <span style={{ textDecoration: "none" }}>
                  Discount Calculator
                </span>
              </Link>
            </li>
            <li>
              <Link href="/fuel-cost-calculator/">
                <span style={{ textDecoration: "none" }}>
                  Fuel Cost Calculator
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
