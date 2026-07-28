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
      <div className="single-page-padding">
        <h1>
          Fuel Cost Calculator — Trip Fuel Cost, Gas Split &amp; Cost Per KM
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

        {/* ── SEO CONTENT ── */}

        <h2>What Is a Fuel Cost Calculator?</h2>
        <p>
          A fuel cost calculator tells you exactly how much money you will spend
          on petrol, diesel, CNG, or electricity for any trip — whether it is
          your daily office commute, a weekend road trip, or a cross-country
          drive. Instead of guessing at the pump, you enter your trip distance,
          current fuel price, and your vehicle's fuel efficiency to get an
          instant, accurate cost breakdown including total fuel needed, total
          cost, cost per kilometre, toll charges, and a per-passenger gas cost
          split.
        </p>
        <p>
          This tool works as a fuel cost calculator for trip planning, a monthly
          fuel cost calculator for commute budgeting, a cost per mile calculator
          for gas expenses, and a gas cost split calculator when carpooling —
          all in one. It is the most complete free fuel cost tool available
          online. If you are managing broader personal finances alongside fuel
          expenses, our{" "}
          <Link href="/net-worth-calculator/" className="my-link">
            net worth calculator
          </Link>{" "}
          shows how transportation costs fit into your overall financial
          picture.
        </p>

        <h2>How to Calculate Fuel Cost for a Trip</h2>
        <p>
          Wondering how to calculate fuel cost for a trip? It involves three
          pieces of information: the distance you will travel, the price of fuel
          per litre (or gallon), and your vehicle's fuel efficiency. The
          formulas are straightforward:
        </p>
        <pre>
          Fuel Needed (litres) = Distance (km) × Consumption (L/100km) ÷ 100
          {"\n"}
          Fuel Cost = Fuel Needed × Price per Litre{"\n"}
          Total Trip Cost = Fuel Cost + Toll Charges
        </pre>
        <p>
          For example, if you are driving 300 km in a car that uses 7 litres per
          100 km and fuel costs ₹100 per litre:
        </p>
        <pre>
          Fuel Needed = 300 × 7 ÷ 100 = 21 litres{"\n"}
          Fuel Cost = 21 × 100 = ₹2,100{"\n"}
          Round Trip Cost = ₹2,100 × 2 = ₹4,200
        </pre>
        <p>
          This answers the common question "how much gas will I need for my
          trip" — enter your distance and vehicle efficiency above and the
          calculator handles the math instantly.
        </p>

        <h2>Cost Per Mile Calculator — Gas Expense Per KM or Mile</h2>
        <p>
          Cost per kilometre (or cost per mile) is one of the most useful
          numbers for comparing vehicles, planning a commute budget, or figuring
          out how much gas money to give someone for a ride. The formula:
        </p>
        <pre>
          Cost Per KM = (Fuel Price per Litre × Consumption L/100km) ÷ 100
        </pre>
        <p>
          Example: Fuel at ₹105/litre with a car consuming 8 L/100km gives a
          cost of (105 × 8) ÷ 100 = ₹8.40 per kilometre. For miles, the
          calculator converts automatically — just select the miles unit. The
          result panel shows your cost per km or mile for every calculation.
        </p>

        <h2>Monthly Fuel Cost Calculator — Commute Budgeting</h2>
        <p>
          To use this as a commute gas cost calculator for monthly budgeting,
          multiply your daily round-trip commute distance by your working days
          per month, then enter that total distance above. For example, if your
          office is 25 km away and you work 22 days a month, your monthly
          commute distance is 25 × 2 × 22 = 1,100 km. At 8 L/100km and
          ₹105/litre, that is 88 litres × ₹105 = ₹9,240 per month in fuel alone.
        </p>
        <p>
          Knowing your monthly fuel cost helps you budget alongside other
          recurring expenses. Our{" "}
          <Link href="/salary-hike-calculator/" className="my-link">
            salary hike calculator
          </Link>{" "}
          can show you what percentage raise you would need to offset rising
          fuel costs, and our{" "}
          <Link href="/emi-calculator/" className="my-link">
            EMI calculator
          </Link>{" "}
          reveals how a car loan payment adds to your monthly transportation
          cost on top of fuel.
        </p>

        <h2>
          Gas Cost Split Calculator — How Much Gas Money Should I Give Someone?
        </h2>
        <p>
          One of the most common fuel questions is "how much gas money should I
          give someone?" when getting a ride. The answer is simple: calculate
          the total fuel cost for the distance travelled, then divide by the
          number of passengers. This calculator does exactly that — enter the
          number of passengers in the optional field, and the per-passenger cost
          appears automatically in the results.
        </p>
        <p>
          For example, a 200 km trip costing ₹1,680 in fuel split 4 ways is ₹420
          per person. If there are tolls, those are split equally too. This gas
          cost split feature makes it easy to fairly divide expenses for road
          trips, daily carpools, or any shared ride. For splitting non-fuel
          expenses like restaurant bills, our{" "}
          <Link href="/discount-calculator/" className="my-link">
            discount calculator
          </Link>{" "}
          can help with tip and discount calculations.
        </p>

        <h2>Fuel Cost Formula for MPG (Miles Per Gallon)</h2>
        <p>
          If your vehicle measures efficiency in miles per gallon — common in
          the US and UK — the formula adjusts:
        </p>
        <pre>
          Gallons Needed = Distance (miles) ÷ MPG{"\n"}
          Fuel Cost = Gallons Needed × Price per Gallon
        </pre>
        <p>
          Example: A 400-mile road trip in a car that gets 32 MPG at $3.50 per
          gallon: 400 ÷ 32 = 12.5 gallons × $3.50 = $43.75 total fuel cost. Cost
          per mile = $0.11. This is what makes this a cost per mile calculator
          for gas — select MPG from the dropdown and enter miles as your
          distance unit.
        </p>

        <h2>Understanding Fuel Efficiency — L/100km vs km/L vs MPG</h2>
        <p>Our calculator supports all three formats used worldwide:</p>
        <ul className="custom-list">
          <li>
            <strong>L/100km (litres per 100 kilometres)</strong> — used in
            Europe, Australia, India, Pakistan, and most of Asia. Lower is
            better. Typical car: 6–10 L/100km.
          </li>
          <li>
            <strong>km/L (kilometres per litre)</strong> — common in India and
            South Asia. Higher is better. Bikes: 40–70 km/L; cars: 10–20 km/L.
          </li>
          <li>
            <strong>MPG (miles per gallon)</strong> — standard in the US and UK.
            Higher is better. Most US cars: 25–40 MPG; trucks/SUVs: 15–25 MPG.
          </li>
        </ul>

        <h2>Typical Fuel Efficiency by Vehicle Type</h2>
        <p>
          Not sure what efficiency to enter? Use these real-world averages as a
          starting point:
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
                  Vehicle Type
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  km/L
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  L/100km
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  MPG (approx)
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Motorcycle / Bike", "30–70", "1.4–3.3", "70–165"],
                ["Small Hatchback (Petrol)", "14–20", "5–7", "33–47"],
                ["Sedan / Mid-size Car", "10–16", "6–10", "24–38"],
                ["SUV / Crossover", "8–13", "8–12", "19–31"],
                ["Diesel Car", "14–22", "4.5–7", "33–52"],
                ["Pickup Truck / Large SUV", "6–10", "10–16", "14–24"],
                ["Hybrid Car", "18–28", "3.5–5.5", "42–66"],
                [
                  "Electric Vehicle",
                  "5–7 km/kWh",
                  "14–20 kWh/100km",
                  "100+ MPGe",
                ],
              ].map(([type, kmL, lkm, mpg], i) => (
                <tr key={i}>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {type}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {kmL}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {lkm}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {mpg}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>Fuel Cost Comparison — Comparing Two Cars</h2>
        <p>
          Thinking about buying a new car and want to use this as a fuel cost
          comparison calculator for two cars? Run the calculator twice — once
          for each vehicle — using the same trip distance and fuel price but
          each car's actual efficiency. The difference in total cost per month
          or per year reveals whether the more efficient (but possibly more
          expensive) car saves enough in fuel to justify the price difference.
        </p>
        <p>
          For example, compare a sedan at 12 km/L versus an SUV at 8 km/L over a
          1,000 km monthly commute at ₹105/litre: the sedan uses 83 litres
          (₹8,750) while the SUV uses 125 litres (₹13,125) — a difference of
          ₹4,375 per month or ₹52,500 per year. Over a 5-year ownership period,
          the sedan saves ₹262,500 in fuel alone. If the more efficient car is
          financing through a loan, check the actual monthly payment with our{" "}
          <Link href="/emi-calculator/" className="my-link">
            EMI calculator
          </Link>{" "}
          to see whether the fuel savings offset the higher EMI.
        </p>

        <h2>Is It Cheaper to Drive or Fly?</h2>
        <p>
          The "cost to drive vs fly" question depends on distance, number of
          passengers, and current prices. Here is a general framework:
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
                  Scenario
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Driving Usually Wins
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Flying Usually Wins
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Solo traveller", "Under 300 km", "Over 500 km"],
                ["Couple", "Under 500 km", "Over 800 km"],
                [
                  "Family of 4",
                  "Under 800 km (1 fuel cost vs 4 tickets)",
                  "Over 1,200 km",
                ],
                [
                  "Time-sensitive",
                  "Very short distances only",
                  "Almost always — time value matters",
                ],
                [
                  "With heavy luggage",
                  "Almost always — no baggage fees",
                  "Only if baggage is light",
                ],
              ].map(([scenario, drive, fly], i) => (
                <tr key={i}>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {scenario}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {drive}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {fly}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Use this calculator to find your actual driving cost (including
          tolls), then compare it to flight ticket prices for your route. For
          families, driving often wins because you split one fuel bill across
          everyone while each person pays a separate flight ticket.
        </p>

        <h2>How to Reduce Your Fuel Cost</h2>
        <ul className="custom-list">
          <li>
            <strong>Drive at a steady speed</strong> — fuel consumption
            increases sharply above 90–100 km/h. Every 10 km/h over 100 adds
            roughly 8–10% to your fuel bill.
          </li>
          <li>
            <strong>Keep tyres properly inflated</strong> — underinflated tyres
            increase rolling resistance and can cost 3–5% in extra fuel per
            trip.
          </li>
          <li>
            <strong>Avoid aggressive acceleration and hard braking</strong> —
            smooth driving improves efficiency by up to 15% in city traffic.
          </li>
          <li>
            <strong>Remove unnecessary weight</strong> — an extra 50 kg reduces
            efficiency by roughly 1–2%.
          </li>
          <li>
            <strong>Use air conditioning wisely</strong> — AC increases
            consumption by 5–15% depending on the vehicle and temperature.
          </li>
          <li>
            <strong>Service your vehicle regularly</strong> — a dirty air filter
            or old spark plugs can reduce mileage by up to 10%.
          </li>
          <li>
            <strong>Carpool and split costs</strong> — use the passenger split
            feature above to see how much everyone saves by sharing a ride.
          </li>
        </ul>

        <h2>Petrol vs Diesel vs CNG vs Electric — Cost Per KM Comparison</h2>
        <p>
          The cheapest fuel per kilometre depends on your vehicle's efficiency
          and current prices. As a general guide: CNG offers the lowest cost per
          km (often 40–60% cheaper than petrol) but requires a CNG-compatible
          vehicle. Diesel is typically 20–30% cheaper per km than petrol for
          high-mileage drivers. Electric vehicles have the lowest energy cost
          per km but higher upfront prices. Use this calculator as a gas vs
          electric car cost comparison tool by running both scenarios and
          comparing the monthly totals — then factor in the car payment using
          our{" "}
          <Link href="/emi-calculator/" className="my-link">
            EMI calculator
          </Link>{" "}
          to see the complete ownership cost.
        </p>

        <h2>Road Trip Fuel Budgeting Tips</h2>
        <ul className="custom-list">
          <li>Always calculate both one-way and return costs before leaving</li>
          <li>Add 10–15% buffer for unexpected detours and traffic</li>
          <li>
            Check fuel prices along your route — prices vary by city and station
          </li>
          <li>
            Fill up before entering expressways where stations may charge more
          </li>
          <li>
            Highway driving is 15–20% more fuel-efficient than city driving
          </li>
          <li>
            Split tolls and fuel evenly using the per-passenger feature above
          </li>
        </ul>

        <h2>Frequently Asked Questions</h2>

        {[
          [
            "How do I calculate fuel cost for a road trip?",
            "Enter your trip distance, select one-way or round trip, enter the current fuel price per litre, and your vehicle's consumption in L/100km or km/L. The calculator instantly shows total fuel needed, fuel cost, cost per km, and total trip expense including tolls. This is the fastest way to answer 'how much gas will I need for my trip.'",
          ],
          [
            "How do I calculate fuel cost per kilometre?",
            "Use this formula: Cost Per KM = (Fuel Price × Consumption L/100km) ÷ 100. At ₹105/litre with 8 L/100km, cost per km = ₹8.40. For cost per mile, select miles as the distance unit and MPG as the efficiency unit — the calculator converts automatically.",
          ],
          [
            "How much gas money should I give someone for a ride?",
            "Calculate the total fuel cost for the distance they drove, then divide by the number of people in the car (including the driver). Enter the distance and passengers above and the per-person cost appears automatically. For a 100 km ride at ₹8/km cost, each of 3 passengers would pay roughly ₹267.",
          ],
          [
            "What is a good fuel efficiency for a car?",
            "A fuel-efficient petrol car achieves 14–20 km/L (5–7 L/100km). Diesel cars generally get 14–22 km/L. SUVs use more at 8–12 L/100km. Anything under 6 L/100km is excellent for petrol. Hybrids achieve 18–28 km/L, and EVs are even more efficient.",
          ],
          [
            "How do I calculate monthly fuel cost for commuting?",
            "Multiply your one-way commute by 2 (return), then by working days per month (typically 22). Enter that total distance in this calculator. For example, 20 km each way × 2 × 22 = 880 km/month. At 7 L/100km and ₹105/litre, monthly fuel cost = ₹6,468.",
          ],
          [
            "How do I convert MPG to L/100km?",
            "Divide 235.214 by your US MPG value. For example, 30 MPG = 235.214 ÷ 30 = 7.84 L/100km. For UK MPG (imperial gallons), divide 282.48 by your MPG. This calculator handles all three units automatically — select from the dropdown.",
          ],
          [
            "Is it cheaper to drive or fly?",
            "For a solo traveller, flying is often cheaper over 500 km. For a family of 4, driving frequently wins because you split one fuel cost across everyone while each person pays a separate flight ticket. Use this calculator to find your driving cost, then compare to flight prices for your route.",
          ],
          [
            "How do I compare fuel costs between two cars?",
            "Run the calculator twice — same distance and fuel price, but enter each car's efficiency. The difference in total cost shows you the monthly or yearly savings of the more efficient vehicle. This makes it a fuel cost comparison calculator for any two vehicles you are considering.",
          ],
          [
            "How much does the average person spend on fuel per month?",
            "It varies widely. In the US, average monthly gas spending is $150–$250. In India, a typical car commuter in a metro city spends ₹4,000–₹10,000 per month. Use this calculator with your actual commute distance and fuel price for a personal estimate.",
          ],
          [
            "Is this fuel cost calculator free to use?",
            "Yes — completely free, no sign-up, no limits. Calculate fuel costs for any trip, any vehicle type, any fuel unit. Results include total cost, fuel needed, cost per km/mile, toll charges, and per-passenger split.",
          ],
        ].map(([q, a], i) => (
          <div className="faq-item" key={i}>
            <h3 onClick={() => toggleFAQ(i)}>
              {q}
              <i
                className={`fa-solid fa-chevron-down ${openFAQ === i ? "rotate" : ""}`}
              ></i>
            </h3>
            {openFAQ === i && <p>{a}</p>}
          </div>
        ))}

        <h2>Final Thoughts</h2>
        <p>
          Whether you are planning a one-time road trip, budgeting your daily
          commute, figuring out how much gas money to give a friend, or
          comparing two vehicles side by side, this fuel cost calculator gives
          you the exact numbers in seconds. Enter your trip details above and
          stop guessing at the pump.
        </p>
        <p>
          For related financial planning, our{" "}
          <Link href="/emi-calculator/" className="my-link">
            EMI calculator
          </Link>{" "}
          shows your car loan payment, our{" "}
          <Link href="/salary-hike-calculator/" className="my-link">
            salary hike calculator
          </Link>{" "}
          helps you evaluate whether a raise covers rising commute costs, and
          our{" "}
          <Link href="/net-worth-calculator/" className="my-link">
            net worth calculator
          </Link>{" "}
          puts your vehicle and transportation expenses in the context of your
          complete financial picture.
        </p>
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
