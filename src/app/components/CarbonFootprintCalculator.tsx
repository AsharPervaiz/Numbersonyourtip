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
    q: "Why do different carbon calculators give me different answers?",
    a: "Because each makes its own choices about three things that are not standardised: which activities count as yours at all, what emission factor to apply to a unit of electricity or fuel, and how to divide shared emissions such as a household or a flight. Results can differ by a factor of two without either being wrong. Compare your result against your own previous one rather than across calculators.",
  },
  {
    q: "Why is my personal footprint lower than my country's average per person?",
    a: "Because they count different things. Most consumer calculators cover personal consumption and exclude your share of public services, infrastructure and government activity, while a national average per head includes everything divided by the population. Comparing the two directly makes a personal footprint look better than the comparison actually supports.",
  },
  {
    q: "Does the same electricity use produce the same emissions everywhere?",
    a: "No, and this is the largest source of variation between countries. A grid running mainly on hydro or nuclear generation produces a small fraction of the emissions of one running on coal, for exactly the same kilowatt-hour at exactly the same appliance. Two identical households in different countries genuinely have different footprints.",
  },
  {
    q: "Do electric cars and heat pumps always reduce emissions?",
    a: "They shift energy use from fuel burned locally to electricity from the grid, so the size of the benefit depends on what that grid runs on. Where generation is clean the improvement is large; where it is coal-heavy it is smaller, though usually still present — and it grows automatically as the grid decarbonises, which a fuel-burning alternative does not.",
  },
  {
    q: "What actually makes the biggest difference to a footprint?",
    a: "For most households in wealthy countries, four categories dominate: air travel, home heating, car distance and diet. A single long-haul return flight can outweigh months of everything else. Appliances, packaging and recycling are real but small enough that they cannot substitute — recycling is good practice rather than a carbon strategy.",
  },
  {
    q: "Is buying local food better than changing what I eat?",
    a: "Usually much less effective. For most foods, transport is a small share of total emissions compared with how the food was produced, so the gap between food types is considerably larger than the gap between local and imported versions of the same food. Both are worth considering; only one of them moves the number much.",
  },
  {
    q: "Should I trust a footprint figure quoted to two decimal places?",
    a: "No. Every input is approximate — estimated mileage, heating inferred from a bill, emission factors that are national averages rather than your specific circumstances. Treat the result as a range and an ordering. Knowing your footprint is roughly eight tonnes and that flights dominate is actionable; the difference between 8.34 and 8.29 is well inside the uncertainty.",
  },
  {
    q: "Does carbon offsetting actually work?",
    a: "It depends on conditions that are hard to verify from outside. The reduction must be additional rather than something that would have happened anyway, it must be permanent — a real problem for tree planting, where fire or land-use change releases the carbon again — and it must not displace the activity elsewhere. Independent assessments have found some projects substantially overstated.",
  },
  {
    q: "Should I offset instead of reducing?",
    a: "Reduce first, then consider offsetting what genuinely remains. Offsetting as a substitute for reduction relies on the weakest link in a chain you cannot inspect, while offsetting as a supplement to reduction is a reasonable use of money. The ordering is the part that matters, not the choice between them.",
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

        {/* ── SEO CONTENT ── */}

        <h2>Why Two Carbon Calculators Give You Different Answers</h2>
        <p>
          Run the same lifestyle through several footprint calculators and the
          results can differ by a factor of two or more. That is not because
          some are wrong. It is because they made different choices about three
          things, and none of those choices is standardised.
        </p>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Choice</th>
                <th>What varies</th>
                <th>Effect on the total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Boundary</td>
                <td>
                  Which activities count as yours at all — public services,
                  infrastructure, imported goods
                </td>
                <td>Large</td>
              </tr>
              <tr>
                <td>Emission factors</td>
                <td>
                  How much carbon a unit of electricity, fuel or food is assumed
                  to carry
                </td>
                <td>Large, and highly country-specific</td>
              </tr>
              <tr>
                <td>Allocation</td>
                <td>
                  How shared emissions are divided — a household, a flight, a
                  shared car
                </td>
                <td>Moderate</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          The useful consequence is that a footprint figure is only meaningful
          against itself. Comparing your result here with a number from a
          different calculator tells you about the two methodologies. Comparing
          this year&apos;s result with last year&apos;s, using the same
          calculator, tells you about you.
        </p>

        <h2>Where the Boundary Sits</h2>
        <p>
          A personal footprint has no natural edge, so every calculator draws one
          somewhere.
        </p>
        <p>
          Direct emissions are uncontroversial — fuel you burn in your car or
          boiler. Emissions from the electricity you use are usually included
          too, even though they physically occur at a power station. Beyond that
          it becomes a judgement: the manufacture of the goods you buy, the
          construction of the roads you drive on, your share of the hospitals and
          schools your taxes support.
        </p>
        <p>
          Most consumer calculators include personal consumption and exclude the
          public share, which is why a personal result is usually lower than a
          national average per head. Neither figure is wrong; they are counting
          different things, and comparing them directly makes your footprint look
          better than the comparison implies.
        </p>

        <h2>Electricity Is Not the Same Everywhere</h2>
        <p>
          The single largest source of variation between countries is the carbon
          intensity of the electricity grid — how much carbon dioxide is emitted
          per unit of electricity generated.
        </p>
        <p>
          A grid dominated by hydro or nuclear generation produces a small
          fraction of the emissions of one running mainly on coal, for exactly
          the same kilowatt-hour used at exactly the same appliance. This means
          two households with identical consumption in different countries have
          genuinely different footprints, and it also means the same advice does
          not apply everywhere.
        </p>
        <p>
          It has a practical implication for electric vehicles and heat pumps.
          Both shift energy use from fuel burned locally to electricity drawn
          from the grid, so how much they reduce emissions depends on what that
          grid runs on. Where the grid is clean the improvement is large; where
          it is coal-heavy the improvement is smaller, though it usually still
          exists and grows as grids decarbonise.
        </p>

        <h2>Where the Large Numbers Actually Are</h2>
        <p>
          Footprint reduction advice tends to give equal billing to actions of
          very unequal size, which is how people end up carefully rinsing
          recycling while taking four flights a year.
        </p>
        <p>
          For most households in wealthy countries, a small number of categories
          dominate the total:
        </p>
        <ul className="custom-list">
          <li>
            <strong>Air travel</strong>, where a single long-haul return trip can
            outweigh months of everything else combined. It is also the most
            unequally distributed — a minority of people take most of the
            flights.
          </li>
          <li>
            <strong>Home heating</strong>, particularly where it burns fuel
            directly and the building is poorly insulated.
          </li>
          <li>
            <strong>Car travel</strong>, driven by distance far more than by
            vehicle choice.
          </li>
          <li>
            <strong>Diet</strong>, where the gap between food types is much
            larger than the gap between local and imported versions of the same
            food.
          </li>
        </ul>
        <p>
          Everything else — appliances, packaging, water use, recycling — is
          real, worth doing, and small enough that it cannot substitute for the
          four above. The honest framing is that recycling is good practice
          rather than a carbon strategy.
        </p>

        <h2>The Precision Trap</h2>
        <p>
          A calculator that reports 8.34 tonnes is presenting an estimate as a
          measurement. Every input is approximate — you estimated your mileage,
          your heating use is inferred from a bill, and the emission factors
          behind each are national averages that do not describe your specific
          circumstances.
        </p>
        <p>
          Treat the result as a range and an ordering rather than a figure.
          Knowing that your footprint is roughly eight tonnes and that flights
          are the largest component is actionable. Knowing it is 8.34 rather than
          8.29 is not, and the difference is well inside the uncertainty of the
          inputs.
        </p>
        <p>
          The one number worth taking seriously is the change over time, measured
          the same way each year. Consistency of method matters far more than
          precision of any single result.
        </p>

        <h2>What Offsetting Does and Does Not Do</h2>
        <p>
          Offsetting pays for a reduction elsewhere to counterbalance emissions
          you produced. Whether that works depends on conditions that are
          difficult to verify from outside.
        </p>
        <p>
          The reduction has to be additional — it would not have happened
          anyway. It has to be permanent, which is a genuine problem for
          tree-planting where a fire or a change of land use releases the carbon
          again. And it must not simply displace the activity elsewhere. Projects
          vary enormously in how well they meet these, and independent
          assessments have found some to be substantially overstated.
        </p>
        <p>
          The defensible position is the ordering: reduce what you can first,
          then consider offsetting what genuinely remains. Offsetting as a
          substitute for reduction relies on the weakest link in a chain you
          cannot inspect. Offsetting as a supplement to reduction is a reasonable
          use of money.
        </p>

        <h2>Reading Your Own Result</h2>
        <ul className="custom-list">
          <li>
            Look at the breakdown before the total. The ranking of your
            categories is more reliable than the headline number and tells you
            where effort pays.
          </li>
          <li>
            Compare against your own previous result, not against someone
            else&apos;s calculator or a national average that counts different
            things.
          </li>
          <li>
            Re-run it after a change to see the size of the effect, rather than
            assuming a change was significant because it felt effortful.
          </li>
          <li>
            Expect the biggest categories to be the boring ones. Heating and
            travel usually outrank anything you can buy your way out of.
          </li>
        </ul>
        <p>
          For the fuel component specifically, the{" "}
          <Link href="/fuel-cost-calculator/" className="my-link">
            fuel cost calculator
          </Link>{" "}
          works out consumption per journey and per year, which feeds directly
          into the travel section of any footprint estimate.
        </p>
        <section>
          <h2>Carbon Footprint Questions</h2>
          {FAQs.map((f, i) => {
            const isOpen = openFAQ === i;
            return (
              <div className="faq-item" key={i}>
                <h3
                  onClick={() => setOpenFAQ(isOpen ? null : i)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setOpenFAQ(isOpen ? null : i);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${i}`}
                >
                  {f.q}
                  <i
                    className={`fa-solid fa-chevron-down${isOpen ? " rotate" : ""}`}
                    aria-hidden="true"
                  />
                </h3>
                <div
                  id={`faq-answer-${i}`}
                  className={`faq-answer-wrap ${isOpen ? "open" : ""}`}
                  aria-hidden={!isOpen}
                >
                  <div className="faq-answer-inner">
                    <p>{f.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </section>

      </div>
    </>
  );
}
