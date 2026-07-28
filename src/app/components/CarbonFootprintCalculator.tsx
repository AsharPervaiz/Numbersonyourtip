"use client";
import React, { useState, useEffect } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Link from "next/link";

/* ─── emission factors (kg CO₂e / year) ─── */
const calcEmissions = (v: typeof DEFAULTS) => {
  const transport =
    v.carMiles *
      ({
        petrol: 0.171,
        diesel: 0.168,
        hybrid: 0.102,
        electric: 0.054,
        none: 0,
      }[v.carType] ?? 0) +
    v.flights *
      ({ short: 255, long: 1620, business: 4860 }[v.flightType] ?? 0) +
    v.publicTransport * 12 * 0.089;

  const home =
    (v.electricity * 0.233 + v.gas * 0.203) *
    ({ small: 0.8, medium: 1.0, large: 1.35 }[v.homeSize] ?? 1);

  const food =
    ({
      vegan: 1060,
      vegetarian: 1390,
      pescatarian: 1520,
      omnivore: 2050,
      heavymeat: 3300,
    }[v.diet] ?? 2050) * ({ none: 0.85, some: 1.0, lots: 1.18 }[v.waste] ?? 1);

  const shopping = v.clothing * 0.0273 + v.electronics * 0.055;

  return {
    transport: Math.round(transport),
    home: Math.round(home),
    food: Math.round(food),
    shopping: Math.round(shopping),
    total: Math.round(transport + home + food + shopping),
  };
};

const DEFAULTS = {
  carMiles: 8000,
  carType: "petrol",
  flights: 2,
  flightType: "short",
  publicTransport: 60,
  electricity: 600,
  gas: 400,
  homeSize: "medium",
  diet: "omnivore",
  waste: "some",
  clothing: 800,
  electronics: 400,
};

type Vals = typeof DEFAULTS;

const PILL_OPTS = {
  carType: [
    ["none", "None"],
    ["electric", "EV"],
    ["hybrid", "Hybrid"],
    ["petrol", "Petrol"],
    ["diesel", "Diesel"],
  ],
  flightType: [
    ["short", "Short-haul"],
    ["long", "Long-haul"],
    ["business", "Business"],
  ],
  homeSize: [
    ["small", "Small"],
    ["medium", "Medium"],
    ["large", "Large"],
  ],
  diet: [
    ["vegan", "Vegan"],
    ["vegetarian", "Veggie"],
    ["pescatarian", "Pescatarian"],
    ["omnivore", "Omnivore"],
    ["heavymeat", "Meat-heavy"],
  ],
  waste: [
    ["none", "Little"],
    ["some", "Some"],
    ["lots", "A lot"],
  ],
};

const SECTIONS = [
  {
    id: "transport",
    label: "Transport",
    icon: "fa-car",
    color: "#60a5fa",
    sliders: [
      {
        key: "carMiles",
        label: "Car miles / year",
        min: 0,
        max: 30000,
        step: 500,
        unit: "mi",
        pill: null,
      },
      {
        key: "carType",
        label: "Car type",
        min: null,
        max: null,
        step: null,
        unit: null,
        pill: "carType",
      },
      {
        key: "flights",
        label: "Return flights / year",
        min: 0,
        max: 20,
        step: 1,
        unit: "trips",
        pill: null,
      },
      {
        key: "flightType",
        label: "Typical flight",
        min: null,
        max: null,
        step: null,
        unit: null,
        pill: "flightType",
      },
      {
        key: "publicTransport",
        label: "Public transport / month",
        min: 0,
        max: 500,
        step: 10,
        unit: "mi",
        pill: null,
      },
    ],
  },
  {
    id: "home",
    label: "Home",
    icon: "fa-house",
    color: "#fbbf24",
    sliders: [
      {
        key: "electricity",
        label: "Electricity / month",
        min: 0,
        max: 2000,
        step: 50,
        unit: "kWh",
        pill: null,
      },
      {
        key: "gas",
        label: "Gas / month",
        min: 0,
        max: 2000,
        step: 50,
        unit: "kWh",
        pill: null,
      },
      {
        key: "homeSize",
        label: "Home size",
        min: null,
        max: null,
        step: null,
        unit: null,
        pill: "homeSize",
      },
    ],
  },
  {
    id: "food",
    label: "Food",
    icon: "fa-utensils",
    color: "#34d399",
    sliders: [
      {
        key: "diet",
        label: "Your diet",
        min: null,
        max: null,
        step: null,
        unit: null,
        pill: "diet",
      },
      {
        key: "waste",
        label: "Food waste",
        min: null,
        max: null,
        step: null,
        unit: null,
        pill: "waste",
      },
    ],
  },
  {
    id: "shopping",
    label: "Shopping",
    icon: "fa-bag-shopping",
    color: "#c084fc",
    sliders: [
      {
        key: "clothing",
        label: "Clothing spend / year",
        min: 0,
        max: 5000,
        step: 100,
        unit: "",
        pill: null,
      },
      {
        key: "electronics",
        label: "Electronics spend / year",
        min: 0,
        max: 5000,
        step: 100,
        unit: "",
        pill: null,
      },
    ],
  },
];

const UK_AVG = 4800;
const PARIS = 2000;

const getRating = (t: number) => {
  if (t < PARIS) return { label: "Climate leader", color: "#34d399" };
  if (t < 3000) return { label: "Below average", color: "#6ee7b7" };
  if (t < UK_AVG) return { label: "Near average", color: "#fbbf24" };
  if (t < 7000) return { label: "Above average", color: "#fb923c" };
  return { label: "High impact", color: "#f87171" };
};

const FAQs = [
  {
    q: "What is a carbon footprint and why does it matter?",
    a: "Your carbon footprint is the total greenhouse gases generated by your lifestyle, measured in kilograms of CO₂ equivalent (kg CO₂e). It matters because household consumption drives around 60% of global greenhouse gas emissions — and it's the single most concrete way to link your daily choices to climate change.",
  },
  {
    q: "How do I calculate my personal carbon footprint?",
    a: "Add up the CO₂e from four categories: transport (car mileage, flights, public transport), home energy (electricity and gas), food (diet type and waste), and shopping (clothing and electronics). Multiply each by its official emission factor (DEFRA or IPCC values) and sum the totals. Our free calculator does this instantly using DEFRA 2024 factors.",
  },
  {
    q: "What is the average carbon footprint per person?",
    a: "The global average is about 4,700 kg CO₂e per person per year. The UK average is around 4,800 kg. The US sits at 14,000–16,000 kg. India averages just 1,900 kg. The Paris Agreement target is 2,000 kg per person by 2050.",
  },
  {
    q: "How accurate is this carbon footprint calculator?",
    a: "It uses DEFRA 2024 emission factors and IPCC lifecycle data. Results are estimates — treat them as directional rather than exact. Real emissions vary by specific vehicle model, energy supplier, and country grid mix.",
  },
  {
    q: "How much CO2 does a car produce per km?",
    a: "A typical petrol car emits about 171 g CO₂e per mile (roughly 106 g/km). Diesel is similar at 168 g/mile (104 g/km). Hybrid cars emit around 63 g/km, and electric vehicles on the UK grid emit about 34 g/km.",
  },
  {
    q: "How much CO2 does a flight produce?",
    a: "A short-haul return flight emits ~255 kg CO₂e per economy passenger. Long-haul (e.g. London to New York) emits ~1,620 kg. Business class roughly triples economy figures because each seat occupies more cabin space. Including contrails and non-CO₂ effects, real climate impact may be 2–4× higher.",
  },
  {
    q: "What is the Paris Agreement carbon target?",
    a: "Around 2,000 kg CO₂e per person per year by 2050 — the level needed to limit warming to 1.5°C above pre-industrial levels. Most people in wealthy countries need to cut their footprint by 50–70% to reach it.",
  },
  {
    q: "What are the biggest contributors to a personal carbon footprint?",
    a: "Flying, driving petrol or diesel cars, heating with natural gas, and eating meat-heavy diets. These four categories account for the majority of most personal footprints in wealthy countries.",
  },
  {
    q: "What is the fastest way to reduce my carbon footprint?",
    a: "Skip one long-haul flight (saves ~1,620 kg), reduce meat intake (up to 2,000 kg/yr), switch to an EV or go car-free, and move to a 100% renewable electricity tariff. These four changes alone can cut a typical footprint in half.",
  },
  {
    q: "Does the calculator store my data?",
    a: "No. All calculations happen entirely in your browser. Nothing is sent to a server, stored, or shared. Refresh the page and your inputs reset.",
  },
  {
    q: "What does CO₂e mean?",
    a: "CO₂ equivalent — a unified unit expressing the warming impact of all greenhouse gases (carbon dioxide, methane, nitrous oxide, etc.) as if they were all CO₂. It lets us compare gases with very different warming potentials on one scale.",
  },
  {
    q: "Should I buy carbon offsets?",
    a: "Offsets should supplement direct reductions, never replace them. If you offset, use verified high-quality projects certified by Gold Standard or Verra rather than cheap tree-planting schemes — a 2023 Guardian investigation found most rainforest offsets were likely worthless.",
  },
];

export default function CarbonFootprintCalculator() {
  const [vals, setVals] = useState<Vals>(DEFAULTS);
  const [result, setResult] = useState(calcEmissions(DEFAULTS));
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  useEffect(() => {
    setResult(calcEmissions(vals));
  }, [vals]);

  const set = (k: keyof Vals, v: string | number) =>
    setVals((p) => ({ ...p, [k]: v }));

  const rating = getRating(result.total);

  const BREAKDOWNS = [
    {
      label: "Transport",
      val: result.transport,
      color: "#60a5fa",
      icon: "fa-car",
    },
    { label: "Home", val: result.home, color: "#fbbf24", icon: "fa-house" },
    { label: "Food", val: result.food, color: "#34d399", icon: "fa-utensils" },
    {
      label: "Shopping",
      val: result.shopping,
      color: "#c084fc",
      icon: "fa-bag-shopping",
    },
  ];

  const maxBreakdown = Math.max(...BREAKDOWNS.map((b) => b.val), 1);

  return (
    <>
      <style>{`
        .cf-wrap {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
          align-items: start;
        }
        @media (max-width: 680px) {
          .cf-wrap { grid-template-columns: 1fr; }
        }
        .cf-left { padding: 20px 18px 20px 20px; border-right: 1px solid rgba(255,255,255,0.08); }
        .cf-right { padding: 20px 20px 20px 18px; }
        .cf-section-head {
          display: flex; align-items: center; gap: 8px;
          font-size: 20px; font-weight: 600; letter-spacing: 0.06em;
          text-transform: uppercase; color: rgb(255, 255, 255);
          margin: 40px 0 10px 0;
        }
        .cf-section-head:first-child { margin-top: 0; }
        .cf-section-head i { font-size: 13px; }
        .cf-row { margin-bottom: 14px; }
        .cf-row-top { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 5px; }
        .cf-row-label { font-size: 13px; color: rgba(255,255,255,0.75); font-weight: 400; }
        .cf-row-val   { font-size: 13px; font-weight: 600; color: #fff; }
        .cf-range {
          -webkit-appearance: none; appearance: none;
          width: 100%; height: 4px; border-radius: 2px;
          outline: none; cursor: pointer; border: none; background: transparent;
        }
        .cf-range::-webkit-slider-runnable-track { height: 4px; border-radius: 2px; background: rgba(255,255,255,0.15); }
        .cf-range::-webkit-slider-thumb {
          -webkit-appearance: none; width: 16px; height: 16px;
          border-radius: 50%; background: #fff; margin-top: -6px;
          cursor: pointer; transition: transform 0.1s;
        }
        .cf-range::-webkit-slider-thumb:hover { transform: scale(1.2); }
        .cf-range::-moz-range-track { height: 4px; border-radius: 2px; background: rgba(255,255,255,0.15); }
        .cf-range::-moz-range-thumb { width: 16px; height: 16px; border-radius: 50%; background: #fff; border: none; cursor: pointer; }
        .cf-pills { display: flex; flex-wrap: wrap; gap: 5px; }
        .cf-pill {
          padding: 4px 10px; border-radius: 20px; font-size: 12px;
          font-weight: 500; cursor: pointer; transition: all 0.12s;
          border: 1px solid rgba(255,255,255,0.2);
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.65);
        }
        .cf-pill:hover { background: rgba(255,255,255,0.12); color: #fff; }
        .cf-pill.active { background: #fff; color: #111; border-color: #fff; }
        .cf-total-num { font-size: 42px; font-weight: 700; color: #fff; line-height: 1; margin-bottom: 2px; }
        .cf-total-unit { font-size: 16px; font-weight: 400; color: rgba(255,255,255,0.5); }
        .cf-rating {
          display: inline-block; margin-top: 6px;
          padding: 3px 10px; border-radius: 20px;
          font-size: 12px; font-weight: 600;
          background: rgba(255,255,255,0.08);
        }
        .cf-bar-row { margin-bottom: 12px; }
        .cf-bar-top { display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px; }
        .cf-bar-lbl { color: rgba(255,255,255,0.65); display: flex; align-items: center; gap: 5px; }
        .cf-bar-lbl i { font-size: 11px; }
        .cf-bar-num { color: #fff; font-weight: 600; }
        .cf-bar-track { height: 6px; border-radius: 3px; background: rgba(255,255,255,0.1); overflow: hidden; }
        .cf-bar-fill { height: 100%; border-radius: 3px; transition: width 0.5s ease; }
        .cf-compare-row {
          display: flex; align-items: center; gap: 8px;
          margin-bottom: 8px; font-size: 12px;
          color: rgba(255,255,255,0.65);
        }
        .cf-compare-label { width: 100px; flex-shrink: 0; }
        .cf-compare-track { flex: 1; height: 5px; border-radius: 3px; background: rgba(255,255,255,0.1); overflow: hidden; }
        .cf-compare-fill { height: 100%; border-radius: 3px; }
        .cf-compare-num { width: 52px; text-align: right; color: #fff; font-weight: 600; font-size: 11px; }
        .cf-divider { border: none; border-top: 1px solid rgba(255,255,255,0.08); margin: 16px 0; }
        .cf-section-title {
          font-size: 11px; font-weight: 600; letter-spacing: 0.05em;
          text-transform: uppercase; color: rgba(255,255,255,0.35);
          margin-bottom: 10px;
        }
      `}</style>

      <div className="single-page-padding">
        {/* FAQ JSON-LD schema for rich results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: FAQs.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            }),
          }}
        />

        <div>
          <h1>
            Free Personal Carbon Footprint Calculator — See Your CO₂ Impact
            Instantly
          </h1>
          <p>
            The most accurate{" "}
            <strong>personal carbon footprint calculator</strong> for
            individuals. Adjust the sliders to match your lifestyle — your{" "}
            transport, home, food, and shopping CO₂ updates in real time using
            DEFRA 2024 emission factors. No submit button, no signup, no data
            leaves your browser.
          </p>
        </div>

        <div className="calc-card">
          <div className="cf-wrap">
            {/* ── LEFT: Inputs ── */}
            <div className="cf-left">
              {SECTIONS.map((sec) => (
                <div key={sec.id}>
                  <div className="cf-section-head">
                    <i
                      className={`fa-solid ${sec.icon}`}
                      style={{ color: sec.color }}
                    />
                    {sec.label}
                  </div>

                  {sec.sliders.map((s) => {
                    const k = s.key as keyof Vals;
                    if (s.pill) {
                      const opts = PILL_OPTS[s.pill as keyof typeof PILL_OPTS];
                      return (
                        <div className="cf-row" key={k}>
                          <div className="cf-row-top">
                            <span className="cf-row-label">{s.label}</span>
                          </div>
                          <div className="cf-pills">
                            {opts.map(([val, lbl]) => (
                              <button
                                key={val}
                                className={`cf-pill${vals[k] === val ? " active" : ""}`}
                                onClick={() => set(k, val)}
                              >
                                {lbl}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    }
                    const numVal = vals[k] as number;
                    return (
                      <div className="cf-row" key={k}>
                        <div className="cf-row-top">
                          <span className="cf-row-label">{s.label}</span>
                          <span className="cf-row-val">
                            {numVal.toLocaleString()} {s.unit}
                          </span>
                        </div>
                        <input
                          type="range"
                          className="cf-range"
                          min={s.min!}
                          max={s.max!}
                          step={s.step!}
                          value={numVal}
                          onChange={(e) => set(k, +e.target.value)}
                          style={{
                            background: `linear-gradient(to right, ${sec.color} 0%, ${sec.color} ${Math.round(((numVal - s.min!) / (s.max! - s.min!)) * 100)}%, rgba(255,255,255,0.15) ${Math.round(((numVal - s.min!) / (s.max! - s.min!)) * 100)}%, rgba(255,255,255,0.15) 100%)`,
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* ── RIGHT: Live result ── */}
            <div className="cf-right">
              <div style={{ marginBottom: 4 }}>
                <div
                  style={{
                    fontSize: 12,
                    color: "rgba(255,255,255,0.45)",
                    marginBottom: 4,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    fontWeight: 600,
                  }}
                >
                  Your annual footprint
                </div>
                <div className="cf-total-num">
                  {result.total.toLocaleString()}
                  <span className="cf-total-unit"> kg CO₂e</span>
                </div>
                <div className="cf-rating" style={{ color: rating.color }}>
                  {rating.label}
                </div>
              </div>

              <hr className="cf-divider" />

              <div className="cf-section-title">Breakdown</div>
              {BREAKDOWNS.map((b) => (
                <div className="cf-bar-row" key={b.label}>
                  <div className="cf-bar-top">
                    <span className="cf-bar-lbl">
                      <i
                        className={`fa-solid ${b.icon}`}
                        style={{ color: b.color }}
                      />
                      {b.label}
                    </span>
                    <span className="cf-bar-num">
                      {b.val.toLocaleString()} kg
                    </span>
                  </div>
                  <div className="cf-bar-track">
                    <div
                      className="cf-bar-fill"
                      style={{
                        width: `${Math.round((b.val / maxBreakdown) * 100)}%`,
                        background: b.color,
                      }}
                    />
                  </div>
                </div>
              ))}

              <hr className="cf-divider" />

              <div className="cf-section-title">Compared to</div>
              {(
                [
                  ["You", result.total, rating.color],
                  ["UK average", UK_AVG, "rgba(255,255,255,0.35)"],
                  ["World average", 4700, "rgba(255,255,255,0.25)"],
                  ["Paris target", PARIS, "#34d399"],
                ] as [string, number, string][]
              ).map(([lbl, val, col]) => (
                <div className="cf-compare-row" key={lbl}>
                  <span className="cf-compare-label">{lbl}</span>
                  <div className="cf-compare-track">
                    <div
                      className="cf-compare-fill"
                      style={{
                        width: `${Math.round((val / 8000) * 100)}%`,
                        background: col,
                      }}
                    />
                  </div>
                  <span className="cf-compare-num">{val.toLocaleString()}</span>
                </div>
              ))}

              <hr className="cf-divider" />

              <div className="cf-section-title">Biggest opportunity</div>
              {(() => {
                const top = [...BREAKDOWNS].sort((a, b) => b.val - a.val)[0];
                const tips: Record<string, string> = {
                  Transport:
                    vals.flights > 0
                      ? `Skipping one ${vals.flightType}-haul flight saves ${Math.round(vals.flights > 0 ? ({ short: 255, long: 1620, business: 4860 }[vals.flightType] ?? 0) : 0).toLocaleString()} kg in one trip.`
                      : `Going car-free or switching to an EV could save ~${Math.round(vals.carMiles * 0.12).toLocaleString()} kg/yr.`,
                  Home: `Switching to a renewable electricity tariff can cut home emissions by up to 90% with zero lifestyle change.`,
                  Food: `Moving from ${vals.diet} to vegetarian saves roughly ${Math.round({ vegan: 0, vegetarian: 0, pescatarian: 330, omnivore: 660, heavymeat: 1910 }[vals.diet] ?? 0).toLocaleString()} kg CO₂e per year.`,
                  Shopping: `Buying secondhand clothing and keeping devices 2+ years longer can halve your shopping footprint.`,
                };
                return (
                  <div
                    style={{
                      fontSize: 13,
                      color: "rgba(255,255,255,0.7)",
                      lineHeight: 1.6,
                      padding: "10px 12px",
                      borderRadius: 8,
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <span style={{ color: top.color, fontWeight: 600 }}>
                      <i
                        className={`fa-solid ${top.icon}`}
                        style={{ marginRight: 5 }}
                      />
                      {top.label}
                    </span>
                    {" — "}
                    {tips[top.label]}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>

        {/* ── SEO CONTENT — REWRITTEN ── */}

        <section>
          <h2>What Is a Carbon Footprint and Why Does It Matter?</h2>
          <p>
            A <strong>carbon footprint</strong> is the total greenhouse gases —
            primarily carbon dioxide (CO₂) and methane — released by your
            activities over a year, measured in kilograms of{" "}
            <strong>CO₂ equivalent (kg CO₂e)</strong>. It covers everything from
            petrol burned in your car, to the gas heating your home, to the
            emissions embedded in food production and the products you buy.
          </p>
          <p>
            Why it matters: household consumption drives roughly 60% of global
            greenhouse gas emissions. Understanding your personal footprint is
            the first concrete step to reducing it. Our{" "}
            <strong>carbon footprint calculator for individuals</strong> breaks
            your total into four categories — transport, home energy, food, and
            shopping — so you can immediately see which slice is biggest and
            where a small change would have the largest impact.
          </p>
        </section>

        <section>
          <h2>How to Calculate Your Carbon Footprint</h2>
          <p>
            The basic method for calculating a personal carbon footprint has
            four steps:
          </p>
          <ol className="custom-list">
            <li>
              <strong>Log your activity data</strong> — miles driven, flights
              taken, kWh of electricity and gas used, diet type, and annual
              spending on clothing and electronics.
            </li>
            <li>
              <strong>Multiply by emission factors</strong> — the official kg
              CO₂e per unit of each activity, published by DEFRA (UK
              government), the IPCC, or the EPA (US).
            </li>
            <li>
              <strong>Sum by category</strong> — transport, home, food,
              shopping.
            </li>
            <li>
              <strong>Compare to benchmarks</strong> — Paris target (2,000 kg),
              UK average (4,800 kg), world average (4,700 kg).
            </li>
          </ol>
          <p>
            This calculator automates every step. Just drag the sliders and your
            total, breakdown, and benchmark comparisons update live.
          </p>
        </section>

        <section>
          <h2>How This Calculator Works (DEFRA Emission Factors)</h2>
          <p>
            Every time you adjust a value, the result panel recalculates
            instantly using published emission factors from the UK Government's
            DEFRA greenhouse gas reporting guidelines and IPCC lifecycle data.
            The emission factors used:
          </p>
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
                  backgroundColor: "var(--card-bg, #0D2A5C)",
                  color: "#fff",
                  textAlign: "left",
                }}
              >
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Category
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Activity
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Emission Factor
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Transport
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Petrol car
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  171 g CO₂e / mile
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Transport
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Diesel car
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  168 g CO₂e / mile
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Transport
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Hybrid car
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  102 g CO₂e / mile
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Transport
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Electric car (UK grid)
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  54 g CO₂e / mile
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Transport
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Short-haul return flight
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  ~255 kg CO₂e / passenger
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Transport
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Long-haul return flight
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  ~1,620 kg CO₂e / passenger
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Transport
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Business class long-haul
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  ~4,860 kg CO₂e / passenger
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Home
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  UK grid electricity
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  233 g CO₂e / kWh
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Home
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Natural gas heating
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  203 g CO₂e / kWh
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Food
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Omnivore diet
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  ~2,050 kg CO₂e / year
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Food
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Vegan diet
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  ~1,060 kg CO₂e / year
                </td>
              </tr>
            </tbody>
          </table>
          <p>
            All calculations happen inside your browser. Nothing is ever sent to
            a server, stored, or shared.
          </p>
        </section>

        <section>
          <h2>What Is the Average Carbon Footprint Per Person?</h2>
          <p>
            Context turns a raw number into something actionable. The Paris
            Agreement requires the global average footprint to fall to around
            2,000 kg CO₂e per person per year by 2050. Here's how current
            averages compare:
          </p>
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
                  backgroundColor: "var(--card-bg, #0D2A5C)",
                  color: "#fff",
                  textAlign: "left",
                }}
              >
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Region
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Average kg CO₂e / Person / Year
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Paris target (2050)
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  2,000
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Global goal
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  India
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  ~1,900
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Already near target
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  China
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  ~7,600
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Above average
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  World average (2024)
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  ~4,700
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  2.3× the target
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  UK average
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  ~4,800
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  2.4× the target
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Germany
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  ~8,100
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  4× the target
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Australia
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  ~15,000
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  7.5× the target
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  United States
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  ~14,000–16,000
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Highest globally
                </td>
              </tr>
            </tbody>
          </table>
          <p>
            Most people in wealthy countries need to cut their footprint by
            roughly 50–70% to meet climate targets. That sounds daunting, but a
            small number of high-impact changes account for the majority of
            achievable reductions.
          </p>
        </section>

        <section>
          <h2>
            Flight Carbon Footprint Calculator — How Much CO₂ Does a Flight
            Produce?
          </h2>
          <p>
            For regular fliers, aviation alone can represent 30–50% of a
            personal carbon footprint. A single long-haul return flight emits
            more CO₂ than heating a medium home for an entire year. Here's how
            common routes compare:
          </p>
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
                  backgroundColor: "var(--card-bg, #0D2A5C)",
                  color: "#fff",
                  textAlign: "left",
                }}
              >
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Route (Return, Economy)
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Approx CO₂e
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Alternative
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  London → Edinburgh
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  ~125 kg
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Train: ~15 kg (88% less)
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  London → Paris
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  ~180 kg
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Eurostar: ~15 kg
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  London → Barcelona
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  ~260 kg
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Train: ~40 kg
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  London → New York
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  ~1,620 kg
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  No practical alternative
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  London → Dubai
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  ~2,200 kg
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>—</td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  London → Sydney
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  ~5,200 kg
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>—</td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Business class multiplier
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  ~3× economy
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Fly economy
                </td>
              </tr>
            </tbody>
          </table>
          <p>
            Aviation emissions also cause additional warming through contrails
            and high-altitude non-CO₂ effects, estimated to multiply the real
            climate impact by a factor of 2–4 compared to ground-level CO₂
            alone. This isn't included in most calculators — real aviation
            impact may be higher than shown.
          </p>
        </section>

        <section>
          <h2>
            Car Carbon Footprint — How Much CO₂ Does a Car Produce Per KM?
          </h2>
          <p>
            Driving is the second-largest transport contributor for most
            individuals. Fuel type makes a dramatic difference:
          </p>
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
                  backgroundColor: "var(--card-bg, #0D2A5C)",
                  color: "#fff",
                  textAlign: "left",
                }}
              >
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Car Type
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  gCO₂ per km
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  gCO₂ per mile
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Annual CO₂ @ 12,000 mi/yr
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Petrol (average)
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  106
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  171
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  ~2,050 kg
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Diesel (average)
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  104
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  168
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  ~2,020 kg
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Hybrid
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  63
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  102
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  ~1,220 kg
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Plug-in hybrid
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  ~50
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  ~80
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  ~960 kg
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Electric (UK grid)
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  34
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  54
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  ~650 kg
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Electric (renewable tariff)
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  ~5–10
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  ~8–16
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  ~100–190 kg
                </td>
              </tr>
            </tbody>
          </table>
          <p>
            At 12,000 miles per year (close to the UK average), a petrol car
            produces around 2,050 kg CO₂e — more than a typical omnivore's
            annual food footprint. Switching to an EV charged on renewable
            electricity reduces this by 70–90%.
          </p>
        </section>

        <section>
          <h2>Household &amp; Electricity Carbon Footprint</h2>
          <p>
            Gas central heating is the largest single contributor to most UK
            households' home energy footprint. Natural gas emits 203 g CO₂e per
            kWh, and the average UK home uses around 12,000 kWh of gas per year
            — that's roughly 2,400 kg CO₂e just from heating before you add
            electricity.
          </p>
          <p>
            <strong>The three highest-impact home energy changes:</strong>
          </p>
          <ul className="custom-list">
            <li>
              <strong>Switch to a renewable electricity tariff</strong> — the
              lowest-effort, highest-reward change. Can cut electricity
              emissions by up to 90% with no lifestyle adjustment.
            </li>
            <li>
              <strong>Install a heat pump</strong> — replaces gas heating with
              electric heat that's 3–4× more efficient. Combined with renewable
              electricity, can cut home heating emissions by 70%.
            </li>
            <li>
              <strong>Improve insulation</strong> — reducing heating demand
              directly cuts gas use. Loft and cavity wall insulation typically
              pay for themselves in 2–5 years while saving hundreds of kg CO₂e
              annually.
            </li>
          </ul>
          <p>
            Electricity emissions vary massively by country grid mix. The UK
            averages 233 g CO₂e/kWh, Germany around 380 g/kWh, and coal-heavy
            Poland exceeds 700 g/kWh. Renewable-heavy Norway is below 30 g/kWh.
          </p>
        </section>

        <section>
          <h2>Food Carbon Footprint by Diet — The Numbers</h2>
          <p>
            Food system emissions account for around 25–30% of global greenhouse
            gas emissions. At a personal level, diet type is the biggest
            variable. Beef and dairy are particularly emissions- intensive
            because of methane from cattle digestion and land use.
          </p>
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
                  backgroundColor: "var(--card-bg, #0D2A5C)",
                  color: "#fff",
                  textAlign: "left",
                }}
              >
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Diet Type
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Annual kg CO₂e
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  vs. Omnivore
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Vegan
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  1,060
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  −48%
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Vegetarian
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  1,390
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  −32%
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Pescatarian
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  1,520
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  −26%
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Omnivore (average)
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  2,050
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Baseline
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Meat-heavy
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  3,300
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  +61%
                </td>
              </tr>
            </tbody>
          </table>
          <p>
            The 2,240 kg gap between a meat-heavy and a vegan diet exceeds the
            entire annual carbon footprint of the average person in many
            lower-income countries. No other single lifestyle choice available
            to most people in wealthy countries comes close.
          </p>
          <p>
            <strong>Food waste</strong> compounds the problem: roughly one-third
            of all food produced globally is never eaten. Cutting waste
            significantly reduces your food footprint without changing what you
            eat.
          </p>
        </section>

        <section>
          <h2>Shopping — The Hidden Footprint of What You Buy</h2>
          <p>
            Every product carries embedded carbon from manufacturing, raw
            materials, transport, and eventual disposal. New clothing is more
            carbon-intensive than most people realise: producing a single cotton
            t-shirt emits roughly 5–6 kg CO₂e. The fashion industry is
            responsible for around 10% of global carbon emissions annually.
          </p>
          <p>
            Electronics have a high carbon cost per unit. A new smartphone emits
            approximately 70 kg CO₂e to manufacture. Keeping devices for an
            extra two years halves the annualised manufacturing footprint, and
            buying secondhand clothing reduces per-item footprint by 60–80%.
          </p>
        </section>

        <section>
          <h2>How to Reduce Your Carbon Footprint: Highest-Impact Changes</h2>
          <p>
            Research by Wynes and Nicholas (2017) in{" "}
            <i>Environmental Research Letters</i> ranked individual climate
            actions by actual impact. The evidence consistently points to the
            same short list:
          </p>
          <ul className="custom-list">
            <li>
              <strong>Fly less.</strong> Eliminating one long-haul return flight
              saves ~1,620 kg CO₂e. Taking the train within Europe cuts
              per-journey emissions by up to 90%.
            </li>
            <li>
              <strong>Shift to plant-based eating.</strong> Omnivore →
              vegetarian saves ~660 kg/yr. Omnivore → vegan saves ~990 kg. Even
              cutting beef to once per week produces measurable reductions.
            </li>
            <li>
              <strong>Switch to an electric vehicle.</strong> An EV on a
              renewable tariff reduces driving emissions by 70–90% versus a
              petrol car — the biggest single change for high-mileage drivers.
            </li>
            <li>
              <strong>Move to a renewable electricity tariff.</strong> The
              lowest-effort, highest-reward home energy change. Just a supplier
              switch. Cuts electricity emissions by up to 90%.
            </li>
            <li>
              <strong>Improve home insulation.</strong> Combined with a heat
              pump, reduces home heating emissions by 50–70%.
            </li>
            <li>
              <strong>Buy less, buy secondhand.</strong> Extending device life
              and buying secondhand clothing makes a real dent with minimal
              inconvenience.
            </li>
          </ul>
          <p>
            For the full scientific ranking, see the{" "}
            <a
              href="https://www.sciencedirect.com/science/article/pii/S0959378017306660"
              target="_blank"
              rel="noopener noreferrer"
              className="my-link"
            >
              Wynes and Nicholas (2017) paper
            </a>{" "}
            directly.
          </p>
        </section>

        <section>
          <h2>Carbon Offsetting: What the Evidence Says</h2>
          <p>
            Carbon offsetting — paying for projects elsewhere to absorb or avoid
            emissions equivalent to your own — is appealing in theory. In
            practice, the market has significant quality problems. A{" "}
            <a
              href="https://www.theguardian.com/environment/2023/jan/18/revealed-forest-carbon-offsets-biggest-provider-worthless-verra-aoe"
              target="_blank"
              rel="noopener noreferrer"
              className="my-link"
            >
              2023 investigation
            </a>{" "}
            found the majority of rainforest carbon offset credits certified by
            the world's largest certifier were likely worthless, with projects
            dramatically overstating their climate benefit.
          </p>
          <p>
            The scientific consensus is clear: offsets should supplement direct
            emission reductions, never replace them. If you offset, prioritise
            permanent, verifiable solutions — such as direct air capture,
            enhanced rock weathering, or biochar — over tree planting. Use
            independent standards such as{" "}
            <a
              href="https://www.goldstandard.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="my-link"
            >
              Gold Standard
            </a>{" "}
            or{" "}
            <a
              href="https://verra.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="my-link"
            >
              Verra's Verified Carbon Standard
            </a>
            .
          </p>
        </section>

        <section>
          <h2>Beyond Personal Action: Systemic Change</h2>
          <p>
            The term "carbon footprint" was popularised in a 2004 BP advertising
            campaign — a deliberate effort to shift attention from corporate
            emissions to individual behaviour. Individual consumption choices
            are shaped by the infrastructure and systems built by corporations
            and governments: whether renewable energy is available, whether
            public transport exists, whether plant-based food is affordable and
            accessible.
          </p>
          <p>
            Individual and systemic action are not in opposition — they're
            complementary. Mass changes in individual behaviour aggregate into
            market signals, reduced demand for fossil fuels, and stronger
            political pressure for policy change. Using this{" "}
            <Link href="/" className="my-link">
              calculator
            </Link>{" "}
            to understand your footprint, making the changes available to you,
            and supporting policies that make low-carbon choices the default are
            all part of the same response.
          </p>
          <p>
            To reduce the digital side of your footprint too, tools like our{" "}
            <Link href="/image-compressor/" className="my-link">
              image compressor
            </Link>{" "}
            help reduce the data weight of websites, which contributes to lower
            energy use in data centres worldwide.
          </p>
        </section>

        {/* FAQ */}
        <section>
          <h2>Frequently Asked Questions</h2>
          {FAQs.map((f, i) => (
            <div className="faq-item" key={i}>
              <h3 onClick={() => setOpenFAQ(openFAQ === i ? null : i)}>
                {f.q}
                <i
                  className={`fa-solid fa-chevron-down${openFAQ === i ? " rotate" : ""}`}
                />
              </h3>
              {openFAQ === i && <p>{f.a}</p>}
            </div>
          ))}
        </section>

        <section>
          <h2>Start Calculating Now</h2>
          <p>
            Scroll back to the calculator at the top of the page and drag the
            sliders to match your lifestyle. Your result updates instantly as
            you go — no submit button, no account, no data ever leaving your
            device. Focus on whichever category shows the tallest bar in your
            breakdown, and check the personalised tip for the single
            highest-impact change available to you right now.
          </p>
        </section>
      </div>
    </>
  );
}
