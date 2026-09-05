"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

/* ─────────────────────────────────────────
   Types
───────────────────────────────────────── */
interface FuelResult {
  totalDistance: number;
  fuelNeeded: number;
  fuelCost: number;
  tollAmt: number;
  grandTotal: number;
  costPerKm: number;
  costPerPassenger: number;
  distUnitLabel: string;
  effUnitLabel: string;
  passengers: number;
}

/* ─────────────────────────────────────────
   Pure helper
───────────────────────────────────────── */
function needleDeg(ratio: number): number {
  const clamped = Math.min(Math.max(ratio, 0), 1);
  return -90 + clamped * 180;
}

/* ─────────────────────────────────────────
   FuelResultPanel
───────────────────────────────────────── */
function FuelResultPanel({ result }: { result: FuelResult | null }) {
  if (!result) {
    return (
      <div className="cr-panel-placeholder">
        <div className="cr-ph-icon">
          <i className="fa-solid fa-gas-pump" aria-hidden="true" />
        </div>
        Enter your trip details to see the fuel cost breakdown here.
      </div>
    );
  }
  const {
    totalDistance,
    fuelNeeded,
    fuelCost,
    tollAmt,
    grandTotal,
    costPerKm,
    costPerPassenger,
    distUnitLabel,
    passengers,
  } = result;
  const fmt = (n: number) =>
    n.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  const scaleMax = 20;
  const ratio = Math.min(costPerKm / scaleMax, 1);
  const barPct = 2 + ratio * 96;
  const effLabel =
    costPerKm < 3
      ? "Very cheap"
      : costPerKm < 7
        ? "Economical"
        : costPerKm < 12
          ? "Moderate"
          : costPerKm < 16
            ? "Expensive"
            : "Very expensive";
  const effBadge =
    costPerKm < 3
      ? "good"
      : costPerKm < 7
        ? "normal"
        : costPerKm < 12
          ? "warning"
          : "danger";

  return (
    <div className="cr-panel">
      <div className="cr-gauge-wrap">
        <svg
          className="cr-gauge-svg"
          width="100"
          height="60"
          viewBox="0 0 120 70"
          role="img"
          aria-label={`Fuel cost gauge: ${fmt(costPerKm)} per km`}
        >
          <defs>
            <clipPath id="fuel-half">
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
            clipPath="url(#fuel-half)"
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
            clipPath="url(#fuel-half)"
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
            clipPath="url(#fuel-half)"
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
            clipPath="url(#fuel-half)"
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
          <div className="cr-score">{fmt(grandTotal)}</div>
          <div className="cr-score-label">total trip cost</div>
          <span className={`cr-badge ${effBadge}`}>{effLabel}</span>
        </div>
      </div>
      <hr className="cr-divider" />
      <div>
        <div className="cr-bar-label">cost per km — {fmt(costPerKm)} / km</div>
        <div
          className="cr-bar-track"
          style={{
            background:
              "linear-gradient(to right, #97C459 0%, #C0DD97 25%, #FAC775 60%, #F09595 100%)",
          }}
        >
          <div className="cr-bar-thumb" style={{ left: `${barPct}%` }} />
        </div>
        <div className="cr-bar-ticks">
          <span>0</span>
          <span>5</span>
          <span>10</span>
          <span>15</span>
          <span>20+</span>
        </div>
      </div>
      <hr className="cr-divider" />
      <div className="cr-metrics-grid">
        <div className="cr-metric-card">
          <div className="cr-m-label">Total distance</div>
          <div className="cr-m-value">
            {totalDistance.toLocaleString()} {distUnitLabel}
          </div>
          <div className="cr-m-sub">this trip</div>
        </div>
        <div className="cr-metric-card">
          <div className="cr-m-label">Fuel needed</div>
          <div className="cr-m-value">{fmt(fuelNeeded)} L</div>
          <div className="cr-m-sub">litres</div>
        </div>
        <div className="cr-metric-card">
          <div className="cr-m-label">Fuel cost</div>
          <div className="cr-m-value">{fmt(fuelCost)}</div>
          <div className="cr-m-sub">before tolls</div>
        </div>
        <div className="cr-metric-card">
          <div className="cr-m-label">Cost per km</div>
          <div className="cr-m-value">{fmt(costPerKm)}</div>
          <div className="cr-m-sub">inc. tolls</div>
        </div>
      </div>
      <hr className="cr-divider" />
      <div>
        <div className="cr-world-title">trip cost breakdown</div>
        <div className="cr-world-bar-row">
          <span className="cr-w-label">Fuel</span>
          <div className="cr-world-track">
            <div
              className="cr-world-fill"
              style={{
                width: `${Math.round((fuelCost / Math.max(grandTotal, 1)) * 100)}%`,
                background: "#378ADD",
              }}
            />
          </div>
          <span
            className="cr-w-pct"
            style={{ width: "60px", fontSize: "10px" }}
          >
            {fmt(fuelCost)}
          </span>
        </div>
        {tollAmt > 0 && (
          <div className="cr-world-bar-row">
            <span className="cr-w-label">Tolls</span>
            <div className="cr-world-track">
              <div
                className="cr-world-fill"
                style={{
                  width: `${Math.round((tollAmt / Math.max(grandTotal, 1)) * 100)}%`,
                  background: "#FAC775",
                }}
              />
            </div>
            <span
              className="cr-w-pct"
              style={{ width: "60px", fontSize: "10px" }}
            >
              {fmt(tollAmt)}
            </span>
          </div>
        )}
        {passengers > 1 && (
          <>
            <hr className="cr-divider" style={{ margin: "8px 0" }} />
            <div className="cr-metric-card" style={{ marginTop: "4px" }}>
              <div className="cr-m-label">Cost per passenger</div>
              <div className="cr-m-value" style={{ color: "#3B6D11" }}>
                {fmt(costPerPassenger)}
              </div>
              <div className="cr-m-sub">split {passengers} ways</div>
            </div>
          </>
        )}
        <p className="cr-world-note" style={{ marginTop: "8px" }}>
          Total trip cost: <strong>{fmt(grandTotal)}</strong>
          {tollAmt > 0 ? ` (incl. ${fmt(tollAmt)} tolls)` : ""}
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Main Calculator Page
───────────────────────────────────────── */
const FAQ_DATA: [string, string][] = [
  [
    "How do I convert miles per gallon to litres per 100 km?",
    "Divide 235.2 by the figure if it is US MPG, or 282.5 if it is imperial MPG. A car rated 30 MPG in the US is 235.2 ÷ 30 = 7.8 L/100 km. The two constants differ because a US gallon is about 3.785 litres and an imperial gallon about 4.546, so the same car scores roughly 20% higher on the British scale without being any more efficient.",
  ],
  [
    "Why is a lower L/100 km number better but a higher MPG number better?",
    "Because they measure opposite things. MPG asks how far you get from a fixed amount of fuel, so more is better. L/100 km asks how much fuel a fixed distance takes, so less is better. A car at 5 L/100 km is thriftier than one at 9. Reading the two scales the same way is the most common mistake when comparing European and American specifications.",
  ],
  [
    "How do I calculate the fuel cost of a trip?",
    "Work out the fuel needed, then multiply by the price. In metric, that is distance in km × L/100 km ÷ 100 × price per litre. A 450 km drive at 7.5 L/100 km with fuel at 1.60 needs 33.75 litres and costs 54. Keep distance and efficiency in the same family — miles with MPG, kilometres with L/100 km — since converting only one of them produces an answer out by about a factor of 1.6.",
  ],
  [
    "How do I work out my cost per mile or per kilometre?",
    "Cost per mile is the price per gallon divided by MPG. Cost per kilometre is the L/100 km figure divided by 100, multiplied by the price per litre. At 7.5 L/100 km and 1.60 a litre that is 0.12 per km. Holding that one figure turns any journey into a single multiplication, which makes decisions like a detour to a cheaper shop concrete rather than a guess.",
  ],
  [
    "How much gas money should I give someone for a ride?",
    "Divide the total fuel cost for the journey by the number of people, so a 54 trip with four aboard is 13.50 each. Whether the driver takes a share is worth agreeing beforehand — they are also absorbing tyres, servicing and depreciation, so some groups split the fuel between passengers only. For one-way trips, cost each leg separately rather than halving the total.",
  ],
  [
    "Why does my car never match its advertised fuel economy?",
    "Manufacturer figures come from standardised test cycles designed to compare cars on equal terms, not to predict your driving. Higher speeds cost disproportionately more because air resistance climbs steeply, short trips consume more per kilometre while the engine is cold, and stop-start traffic loses energy to the brakes at every halt. Roof racks and low tyre pressure add to it.",
  ],
  [
    "How do I measure my real fuel consumption?",
    "Fill the tank completely, note the odometer, drive normally, then fill completely again and record the litres or gallons it took. Divide the fuel by the distance covered to get your actual figure. Two or three tanks measured this way gives a number worth budgeting from, and it is usually meaningfully worse than the brochure.",
  ],
  [
    "How far do I need to drive for a more efficient car to pay for itself?",
    "Work out the saving per 100 km — the difference in consumption multiplied by the fuel price — then divide the extra purchase cost by it. Going from 8 to 6 L/100 km at 1.60 a litre saves 3.20 every 100 km, so a 3,000 price difference breaks even at about 94,000 km. At 20,000 km a year that is nearly five years; at 40,000 it is under two and a half.",
  ],
  [
    "What does a commute actually cost over a year?",
    "Multiply the round-trip distance by working days per month, then by your cost per unit distance. A 24 km round trip over 21 days at 0.12 per km is about 60 a month, or roughly 726 a year in fuel alone. That figure excludes insurance, tax, servicing, tyres and depreciation, which are also real costs of the same journey.",
  ],
];

export default function FuelCostCalculator() {
  const [distance, setDistance] = useState("");
  const [fuelPrice, setFuelPrice] = useState("");
  const [efficiency, setEfficiency] = useState("");
  const [passengers, setPassengers] = useState("");
  const [tollCost, setTollCost] = useState("");
  const [tripType, setTripType] = useState<"one-way" | "round-trip">("one-way");
  const [tripTypeOpen, setTripTypeOpen] = useState(false);
  const [distUnit, setDistUnit] = useState<"km" | "miles">("km");
  const [distUnitOpen, setDistUnitOpen] = useState(false);
  const [effUnit, setEffUnit] = useState<"L/100km" | "km/L" | "MPG">("L/100km");
  const [effUnitOpen, setEffUnitOpen] = useState(false);
  const [fuelType, setFuelType] = useState("Petrol");
  const [fuelTypeOpen, setFuelTypeOpen] = useState(false);
  const [panelResult, setPanelResult] = useState<FuelResult | null>(null);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const toggleFAQ = (i: number) => setOpenFAQ(openFAQ === i ? null : i);

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

  const compute = (
    _distance = distance,
    _fuelPrice = fuelPrice,
    _efficiency = efficiency,
    _passengers = passengers,
    _tollCost = tollCost,
    _tripType = tripType,
    _distUnit = distUnit,
    _effUnit = effUnit,
  ): FuelResult | null => {
    const dist = toNum(_distance);
    const price = toNum(_fuelPrice);
    const eff = toNum(_efficiency);
    const pax = Math.max(1, toNum(_passengers) || 1);
    const toll = toNum(_tollCost);
    if (!dist || !price || !eff) return null;
    const totalDistance = _tripType === "round-trip" ? dist * 2 : dist;
    let distInKm =
      _distUnit === "miles" ? totalDistance * 1.60934 : totalDistance;
    let litresNeeded = 0;
    if (_effUnit === "L/100km") {
      litresNeeded = (distInKm * eff) / 100;
    } else if (_effUnit === "km/L") {
      litresNeeded = distInKm / eff;
    } else {
      const distInMiles =
        _distUnit === "miles" ? totalDistance : totalDistance / 1.60934;
      litresNeeded = (distInMiles / eff) * 3.78541;
    }
    const fuelCost = litresNeeded * price;
    const tollAmt = _tripType === "round-trip" ? toll * 2 : toll;
    const grandTotal = fuelCost + tollAmt;
    const costPerKm = grandTotal / distInKm;
    const costPerPassenger = grandTotal / pax;
    return {
      totalDistance,
      fuelNeeded: litresNeeded,
      fuelCost,
      tollAmt,
      grandTotal,
      costPerKm,
      costPerPassenger,
      distUnitLabel: _distUnit,
      effUnitLabel: _effUnit,
      passengers: pax,
    };
  };

  useEffect(() => {
    setPanelResult(compute());
  }, [
    distance,
    fuelPrice,
    efficiency,
    passengers,
    tollCost,
    tripType,
    distUnit,
    effUnit,
  ]);
  const calculate = () => setPanelResult(compute());
  const handleClear = () => {
    setDistance("");
    setFuelPrice("");
    setEfficiency("");
    setPassengers("");
    setTollCost("");
    setTripType("one-way");
    setDistUnit("km");
    setEffUnit("L/100km");
    setFuelType("Petrol");
    setTripTypeOpen(false);
    setDistUnitOpen(false);
    setEffUnitOpen(false);
    setFuelTypeOpen(false);
    setPanelResult(null);
  };
  const fuelTypes = ["Petrol", "Diesel", "CNG", "Electric", "LPG", "Hybrid"];

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
        <h1>
          Fuel Cost Calculator — MPG, L/100km, Trip Cost and Splits
        </h1>
        <p>
          Calculate exactly how much gas you will need for your trip, the total
          fuel cost, cost per kilometre or mile, toll charges, and per-passenger
          split.
        </p>

        <div className="calc-card single-calc">
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
              placeholder={`Distance (${distUnit})`}
              value={distance}
              onChange={handleChange(setDistance)}
              style={{ margin: 0 }}
            />
            <div
              className="modern-dropdown"
              onClick={() => setDistUnitOpen(!distUnitOpen)}
              style={{ margin: 0 }}
            >
              {distUnit === "km" ? "Kilometres (km)" : "Miles (mi)"}
              <span className="dropdown-indicator">▼</span>
              {distUnitOpen && (
                <ul className="dropdown-list">
                  <li
                    onClick={() => {
                      setDistUnit("km");
                      setDistUnitOpen(false);
                    }}
                  >
                    Kilometres (km)
                  </li>
                  <li
                    onClick={() => {
                      setDistUnit("miles");
                      setDistUnitOpen(false);
                    }}
                  >
                    Miles (mi)
                  </li>
                </ul>
              )}
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
              marginTop: "10px",
            }}
          >
            <input
              className="calc-input"
              type="text"
              inputMode="decimal"
              placeholder={
                effUnit === "MPG" ? "Price per Gallon" : "Price per Litre"
              }
              value={fuelPrice}
              onChange={handleChange(setFuelPrice)}
              style={{ margin: 0 }}
            />
            <div
              className="modern-dropdown"
              onClick={() => setTripTypeOpen(!tripTypeOpen)}
              style={{ margin: 0 }}
            >
              {tripType === "one-way" ? "One Way" : "Round Trip"}
              <span className="dropdown-indicator">▼</span>
              {tripTypeOpen && (
                <ul className="dropdown-list">
                  <li
                    onClick={() => {
                      setTripType("one-way");
                      setTripTypeOpen(false);
                    }}
                  >
                    One Way
                  </li>
                  <li
                    onClick={() => {
                      setTripType("round-trip");
                      setTripTypeOpen(false);
                    }}
                  >
                    Round Trip
                  </li>
                </ul>
              )}
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
              marginTop: "10px",
            }}
          >
            <input
              className="calc-input"
              type="text"
              inputMode="decimal"
              placeholder={`Fuel Efficiency (${effUnit})`}
              value={efficiency}
              onChange={handleChange(setEfficiency)}
              style={{ margin: 0 }}
            />
            <div
              className="modern-dropdown"
              onClick={() => setEffUnitOpen(!effUnitOpen)}
              style={{ margin: 0 }}
            >
              {effUnit}
              <span className="dropdown-indicator">▼</span>
              {effUnitOpen && (
                <ul className="dropdown-list">
                  <li
                    onClick={() => {
                      setEffUnit("L/100km");
                      setEffUnitOpen(false);
                    }}
                  >
                    L/100km
                  </li>
                  <li
                    onClick={() => {
                      setEffUnit("km/L");
                      setEffUnitOpen(false);
                    }}
                  >
                    km/L
                  </li>
                  <li
                    onClick={() => {
                      setEffUnit("MPG");
                      setEffUnitOpen(false);
                    }}
                  >
                    MPG (miles per gallon)
                  </li>
                </ul>
              )}
            </div>
          </div>
          <div style={{ marginTop: "10px" }}>
            <div
              className="modern-dropdown"
              onClick={() => setFuelTypeOpen(!fuelTypeOpen)}
              style={{ margin: 0 }}
            >
              {fuelType}
              <span className="dropdown-indicator">▼</span>
              {fuelTypeOpen && (
                <ul className="dropdown-list">
                  {fuelTypes.map((f) => (
                    <li
                      key={f}
                      onClick={() => {
                        setFuelType(f);
                        setFuelTypeOpen(false);
                      }}
                    >
                      {f}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
              marginTop: "10px",
            }}
          >
            <input
              className="calc-input"
              type="text"
              inputMode="decimal"
              placeholder="Toll / Road Charges (optional)"
              value={tollCost}
              onChange={handleChange(setTollCost)}
              style={{ margin: 0 }}
            />
            <input
              className="calc-input"
              type="text"
              inputMode="numeric"
              placeholder="No. of Passengers (optional)"
              value={passengers}
              onChange={handleChange(setPassengers)}
              style={{ margin: 0 }}
            />
          </div>
          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <button className="calc-button" onClick={calculate}>
              Calculate
            </button>
            <button className="calc-button calc-clear" onClick={handleClear}>
              Clear
            </button>
          </div>
        </div>

        <div className="cr-mobile-slot">
          <FuelResultPanel result={panelResult} />
        </div>

        {/* ---- SEO CONTENT ---- */}

        <h2>Your Car&apos;s Efficiency Is Quoted in One of Four Units</h2>
        <p>
          Fuel cost arithmetic is simple. Getting the units straight is not, and
          that is where almost every wrong answer comes from. Four systems are
          in common use, two of them share a name, and they are not
          interchangeable.
        </p>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Unit</th>
                <th>Reads as</th>
                <th>Used mainly in</th>
                <th>Higher number means</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>MPG (US)</td>
                <td>Miles per US gallon</td>
                <td>United States</td>
                <td>Better efficiency</td>
              </tr>
              <tr>
                <td>MPG (imperial)</td>
                <td>Miles per imperial gallon</td>
                <td>United Kingdom</td>
                <td>Better efficiency</td>
              </tr>
              <tr>
                <td>L/100 km</td>
                <td>Litres to cover 100 km</td>
                <td>Europe, much of Asia</td>
                <td>
                  <em>Worse</em> efficiency
                </td>
              </tr>
              <tr>
                <td>km/L</td>
                <td>Kilometres per litre</td>
                <td>India, Japan, parts of Africa</td>
                <td>Better efficiency</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          Two traps follow from that table. The first is that L/100 km runs
          backwards relative to every other unit — a car at 5 L/100 km is
          thriftier than one at 9, which catches people comparing a European
          spec sheet against an American one.
        </p>
        <p>
          The second is the gallon. A US gallon is about 3.785 litres and an
          imperial gallon about 4.546, so the same car is quoted at roughly 20%
          higher MPG in Britain than in America without being any more
          efficient. A car rated 30 MPG in the US is about 36 MPG in the UK.
          Comparing a US figure against a UK figure as though they were the same
          unit makes the British car look substantially better when it may be
          the identical model.
        </p>

        <h3>Converting Between Them</h3>
        <pre>
          L/100 km = 235.2 ÷ MPG (US){"\n"}L/100 km = 282.5 ÷ MPG (imperial)
          {"\n"}km/L = 100 ÷ L/100 km{"\n"}MPG (imperial) = MPG (US) × 1.201
        </pre>
        <p>
          A car rated 30 MPG (US) is 235.2 ÷ 30 = 7.8 L/100 km, which is 100 ÷
          7.8 = 12.8 km/L. All four describe the same car.
        </p>

        <h2>Trip Cost, Whichever Unit You Have</h2>
        <p>
          The structure is the same in every system: work out how much fuel the
          distance needs, then multiply by what fuel costs. Only the middle step
          changes.
        </p>
        <pre>
          From L/100 km: Fuel = Distance in km × L/100 km ÷ 100{"\n"}From km/L:
          Fuel = Distance in km ÷ km/L{"\n"}From MPG: Fuel = Distance in miles ÷
          MPG{"\n"}Then: Cost = Fuel × Price per litre or gallon
        </pre>
        <p>
          A 450 km drive in a car returning 7.5 L/100 km, with fuel at 1.60 a
          litre: 450 × 7.5 ÷ 100 = 33.75 litres, and 33.75 × 1.60 = 54.00.
        </p>
        <p>
          The one rule that prevents most errors is to keep distance and
          efficiency in the same family. Miles go with MPG, kilometres go with
          L/100 km or km/L. Converting the distance and the efficiency in
          opposite directions produces an answer that is out by roughly a factor
          of 1.6 and still looks plausible.
        </p>

        <h2>Cost Per Mile Is the Number Worth Knowing</h2>
        <p>
          Trip cost answers one journey. Cost per unit distance answers every
          journey, and it takes one division:
        </p>
        <pre>
          Cost per km = (L/100 km ÷ 100) × Price per litre{"\n"}Cost per mile =
          Price per gallon ÷ MPG
        </pre>
        <p>
          At 7.5 L/100 km and 1.60 a litre, that is 0.075 × 1.60 = 0.12 per
          kilometre. Once you hold that single figure, any journey is a
          multiplication you can do in your head: a 40 km round trip is 4.80,
          and a 300 km weekend drive is 36.
        </p>
        <p>
          It also reframes decisions that are otherwise argued about vaguely.
          A twenty-kilometre detour to a cheaper supermarket costs about 2.40 in
          fuel before anything else is counted, which is a concrete number to
          weigh against the saving rather than a feeling.
        </p>

        <h2>What a Commute Costs Over a Year</h2>
        <p>
          Commuting cost surprises people because the per-trip figure is small
          and the repetition is not.
        </p>
        <pre>
          Monthly = Round trip distance × Working days per month × Cost per unit
          distance
        </pre>
        <p>
          A 24 km round trip, 21 working days a month, at 0.12 per kilometre
          comes to 504 km and about 60 a month — roughly 726 a year in fuel
          alone. That figure is the honest input to any decision about moving
          closer, changing car, or negotiating a day at home. Note that it
          excludes insurance, tax, servicing, tyres and depreciation, all of
          which are real costs of the same journey.
        </p>

        <h2>Splitting Fuel Money Fairly</h2>
        <p>
          Shared journeys tend to be settled by guesswork or by whoever
          remembers. The fair figure is easy to establish.
        </p>
        <pre>Each person pays = Total fuel cost ÷ Number of people</pre>
        <p>
          A 54 trip cost with four people aboard is 13.50 each. Whether the
          driver pays a share is the part worth agreeing in advance: they are
          also absorbing wear, tyres and depreciation, so many groups split
          fuel among the passengers only. Neither convention is more correct,
          but deciding it before the journey avoids the conversation at the end
          of it.
        </p>
        <p>
          For one-way trips where only some people travel both legs, work out
          the cost of each leg separately rather than halving the total. Our{" "}
          <Link href="/bill-split-calculator/" className="my-link">
            bill split calculator
          </Link>{" "}
          handles uneven shares for the rest of a trip.
        </p>

        <h2>Why the Real Figure Is Always Worse Than the Sticker</h2>
        <p>
          Manufacturer economy figures come from standardised test cycles, which
          exist so that different cars can be compared on equal terms. They are
          not predictions of what you will get, and the gap is systematic rather
          than random.
        </p>
        <ul className="custom-list">
          <li>
            <strong>Speed.</strong> Air resistance rises sharply with velocity,
            so motorway cruising at higher speeds costs disproportionately more
            fuel than the same distance driven more slowly.
          </li>
          <li>
            <strong>Short journeys.</strong> A cold engine runs richer until it
            warms. A run of two-kilometre trips can consume far more per
            kilometre than one long drive covering the same total.
          </li>
          <li>
            <strong>Stop-start traffic.</strong> Energy spent accelerating a
            mass is lost to the brakes every time you stop, which is why urban
            figures trail motorway ones in conventional cars.
          </li>
          <li>
            <strong>Load and roof racks.</strong> Weight matters, but an empty
            roof rack is worse than its mass suggests because it spoils the
            airflow across the whole car.
          </li>
          <li>
            <strong>Tyre pressure.</strong> Under-inflated tyres increase
            rolling resistance measurably, and it is the one item on this list
            that costs nothing to fix.
          </li>
        </ul>
        <p>
          The practical response is to calculate with your own observed
          consumption rather than the brochure figure. Fill the tank, note the
          odometer, drive normally, then fill again and divide. Two or three
          tanks of that gives a number worth budgeting from.
        </p>

        <h2>Does a More Efficient Car Pay for Itself?</h2>
        <p>
          The comparison people skip is how far you have to drive to recover a
          higher purchase price. The answer is a division.
        </p>
        <pre>
          Saving per 100 km = (Old L/100 km − New L/100 km) × Price per litre
          {"\n"}Break-even distance = Extra purchase cost ÷ Saving per 100 km ×
          100
        </pre>
        <p>
          Replacing a car using 8 L/100 km with one using 6, at 1.60 a litre,
          saves 2 litres or 3.20 every 100 km. If the more efficient car costs
          3,000 more, the break-even is 3,000 ÷ 3.20 × 100, which is about
          94,000 km.
        </p>
        <p>
          Whether that is a good trade depends entirely on your annual mileage.
          At 20,000 km a year it takes nearly five years to break even on fuel
          alone; at 40,000 it takes under two and a half. The efficiency
          difference is only half the calculation, and the half people quote is
          usually not the deciding one.
        </p>
        <h2>Fuel Cost Questions</h2>

        {FAQ_DATA.map(([q, a], i) => {
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

      {/* ── SIDEBAR ── */}
      <aside className="sidebar">
        <div className="cr-desktop-slot">
          <FuelResultPanel result={panelResult} />
        </div>
        <div className="sidebar-box">
          <p style={{ fontSize: "20px", fontWeight: 600 }}>
            Related Calculators
          </p>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {[
              ["/discount-calculator/", "Discount Calculator"],
              ["/salary-hike-calculator/", "Salary Hike Calculator"],
              ["/emi-calculator/", "EMI Calculator"],
              ["/net-worth-calculator/", "Net Worth Calculator"],
              ["/loan-calculator/", "Loan Calculator"],
              ["/income-tax-calculator/", "Income Tax Calculator"],
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
