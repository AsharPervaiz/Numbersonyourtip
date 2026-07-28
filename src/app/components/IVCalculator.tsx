"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

/* ─────────────────────────────────────────
   Types
───────────────────────────────────────── */
type Mode =
  | "Body Weight Dose"
  | "Infusion Rate"
  | "Drip Rate"
  | "Dose from Vial";

interface IVResult {
  mode: Mode;
  value: number;
  unit: string;
  ratio: number;
  scaleMax: number;
  scaleLabel: string;
}

/* ─────────────────────────────────────────
   Pure helper
───────────────────────────────────────── */
function needleDeg(ratio: number): number {
  const clamped = Math.min(Math.max(ratio, 0), 1);
  return -90 + clamped * 180;
}

/* ─────────────────────────────────────────
   IVResultPanel
───────────────────────────────────────── */
function IVResultPanel({ result }: { result: IVResult | null }) {
  if (!result) {
    return (
      <div className="cr-panel-placeholder">
        <div className="cr-ph-icon">
          <i className="fa-solid fa-droplet" aria-hidden="true" />
        </div>
        Enter your values to see the IV calculation result here.
      </div>
    );
  }

  const { mode, value, unit, ratio, scaleMax, scaleLabel } = result;
  const clamped = Math.min(Math.max(ratio, 0), 1);
  const barPct = 2 + clamped * 96;

  const intensityLabel =
    clamped < 0.25
      ? "Low"
      : clamped < 0.6
        ? "Standard"
        : clamped < 0.85
          ? "High"
          : "Very high";
  const intensityBadge =
    clamped < 0.25
      ? "info"
      : clamped < 0.6
        ? "good"
        : clamped < 0.85
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
          aria-label={`${mode} gauge showing ${value.toFixed(2)} ${unit}`}
        >
          <defs>
            <clipPath id="iv-half">
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
            strokeDasharray="82 326"
            strokeDashoffset="-163"
            clipPath="url(#iv-half)"
          />
          <circle
            cx="60"
            cy="65"
            r="52"
            fill="none"
            stroke="#97C459"
            strokeWidth="12"
            strokeDasharray="98 326"
            strokeDashoffset="-245"
            clipPath="url(#iv-half)"
          />
          <circle
            cx="60"
            cy="65"
            r="52"
            fill="none"
            stroke="#FAC775"
            strokeWidth="12"
            strokeDasharray="81 326"
            strokeDashoffset="-343"
            clipPath="url(#iv-half)"
          />
          <circle
            cx="60"
            cy="65"
            r="52"
            fill="none"
            stroke="#F09595"
            strokeWidth="12"
            strokeDasharray="65 326"
            strokeDashoffset="-424"
            clipPath="url(#iv-half)"
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
              transform: `rotate(${needleDeg(clamped)}deg)`,
              transition: "transform 0.5s ease",
            }}
          />
          <circle cx="60" cy="65" r="5" fill="#111111" />
        </svg>
        <div className="cr-score-block">
          <div className="cr-score">{value.toFixed(2)}</div>
          <div className="cr-score-label">{unit}</div>
          <span className={`cr-badge ${intensityBadge}`}>{intensityLabel}</span>
        </div>
      </div>
      <hr className="cr-divider" />
      <div>
        <div className="cr-bar-label">{scaleLabel}</div>
        <div
          className="cr-bar-track"
          style={{
            background:
              "linear-gradient(to right, #B5D4F4 0%, #97C459 25%, #FAC775 60%, #F09595 100%)",
          }}
        >
          <div className="cr-bar-thumb" style={{ left: `${barPct}%` }} />
        </div>
        <div className="cr-bar-ticks">
          <span>0</span>
          <span>{(scaleMax * 0.25).toFixed(0)}</span>
          <span>{(scaleMax * 0.5).toFixed(0)}</span>
          <span>{(scaleMax * 0.75).toFixed(0)}</span>
          <span>{scaleMax.toFixed(0)}+</span>
        </div>
      </div>
      <hr className="cr-divider" />
      <div className="cr-world-note" style={{ fontStyle: "italic" }}>
        <i
          className="fa-solid fa-triangle-exclamation"
          style={{ marginRight: "6px" }}
        />
        This meter is a general reference, not drug-specific. Always verify
        against the prescribing physician's instructions and your institution's
        protocols before administration.
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Main Calculator Page
───────────────────────────────────────── */
export default function IVCalculator() {
  const types = [
    "Body Weight Dose",
    "Infusion Rate",
    "Drip Rate",
    "Dose from Vial",
  ] as const;
  const [mode, setMode] = useState<(typeof types)[number]>("Body Weight Dose");

  const [weight, setWeight] = useState("");
  const [prescribedDose, setPrescribedDose] = useState("");
  const [doseUnit, setDoseUnit] = useState("mg/kg");
  const [unitOpen, setUnitOpen] = useState(false);
  const [totalVolume, setTotalVolume] = useState("");
  const [totalTime, setTotalTime] = useState("");
  const [dropFactor, setDropFactor] = useState("");
  const [timeMinutes, setTimeMinutes] = useState("");
  const [requiredDose, setRequiredDose] = useState("");
  const [availableDose, setAvailableDose] = useState("");
  const [vialVolume, setVialVolume] = useState("");
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };
  const [result, setResult] = useState<string | null>(null);
  const [panelResult, setPanelResult] = useState<IVResult | null>(null);

  const handleClear = () => {
    setWeight("");
    setPrescribedDose("");
    setDoseUnit("mg/kg");
    setUnitOpen(false);
    setTotalVolume("");
    setTotalTime("");
    setDropFactor("");
    setTimeMinutes("");
    setRequiredDose("");
    setAvailableDose("");
    setVialVolume("");
    setResult(null);
    setPanelResult(null);
  };

  const calculate = () => {
    try {
      let res: string | number = "";
      switch (mode) {
        case "Body Weight Dose":
          let w = Number(weight);
          const pd = Number(prescribedDose);
          if (!w || !pd) return setResult("Enter valid numbers");
          if (doseUnit === "mg/lb") w = w * 0.45359237;
          res = w * pd;
          setResult(`${res.toFixed(2)} mg IV`);
          break;
        case "Infusion Rate":
          const vol = Number(totalVolume);
          const time = Number(totalTime);
          if (!vol || !time) return setResult("Enter valid numbers");
          res = vol / time;
          setResult(`${res.toFixed(2)} mL/hour`);
          break;
        case "Drip Rate":
          const vol2 = Number(totalVolume);
          const df = Number(dropFactor);
          const timeMin = Number(timeMinutes);
          if (!vol2 || !df || !timeMin) return setResult("Enter valid numbers");
          res = (vol2 * df) / timeMin;
          setResult(`${res.toFixed(2)} drops/min`);
          break;
        case "Dose from Vial":
          const req = Number(requiredDose);
          const avail = Number(availableDose);
          const vial = Number(vialVolume);
          if (!req || !avail || !vial) return setResult("Enter valid numbers");
          res = (req / avail) * vial;
          setResult(`${res.toFixed(2)} mL`);
          break;
        default:
          setResult("Select a valid calculation type");
      }
    } catch {
      setResult("Error in calculation");
    }
  };

  useEffect(() => {
    if (mode === "Body Weight Dose") {
      let w = Number(weight);
      const pd = Number(prescribedDose);
      if (!w || w <= 0 || !pd || pd <= 0) {
        setPanelResult(null);
        return;
      }
      if (doseUnit === "mg/lb") w = w * 0.45359237;
      const dose = w * pd;
      if (!isFinite(dose) || dose <= 0) {
        setPanelResult(null);
        return;
      }
      const scaleMax = 2000;
      const ratio = Math.min(dose / scaleMax, 1);
      setPanelResult({
        mode,
        value: dose,
        unit: "mg IV",
        ratio,
        scaleMax,
        scaleLabel: "calculated IV dose vs. typical range (mg)",
      });
    } else if (mode === "Infusion Rate") {
      const vol = Number(totalVolume);
      const time = Number(totalTime);
      if (!vol || vol <= 0 || !time || time <= 0) {
        setPanelResult(null);
        return;
      }
      const rate = vol / time;
      if (!isFinite(rate) || rate <= 0) {
        setPanelResult(null);
        return;
      }
      const scaleMax = 500;
      const ratio = Math.min(rate / scaleMax, 1);
      setPanelResult({
        mode,
        value: rate,
        unit: "mL/hour",
        ratio,
        scaleMax,
        scaleLabel: "infusion rate vs. typical pump range (mL/hr)",
      });
    } else if (mode === "Drip Rate") {
      const vol2 = Number(totalVolume);
      const df = Number(dropFactor);
      const timeMin = Number(timeMinutes);
      if (!vol2 || vol2 <= 0 || !df || df <= 0 || !timeMin || timeMin <= 0) {
        setPanelResult(null);
        return;
      }
      const drip = (vol2 * df) / timeMin;
      if (!isFinite(drip) || drip <= 0) {
        setPanelResult(null);
        return;
      }
      const scaleMax = 100;
      const ratio = Math.min(drip / scaleMax, 1);
      setPanelResult({
        mode,
        value: drip,
        unit: "drops/min",
        ratio,
        scaleMax,
        scaleLabel: "drip rate vs. typical gravity-set range (drops/min)",
      });
    } else if (mode === "Dose from Vial") {
      const req = Number(requiredDose);
      const avail = Number(availableDose);
      const vial = Number(vialVolume);
      if (!req || req <= 0 || !avail || avail <= 0 || !vial || vial <= 0) {
        setPanelResult(null);
        return;
      }
      const volNeeded = (req / avail) * vial;
      if (!isFinite(volNeeded) || volNeeded <= 0) {
        setPanelResult(null);
        return;
      }
      const scaleMax = vial * 2;
      const ratio = Math.min(volNeeded / scaleMax, 1);
      setPanelResult({
        mode,
        value: volNeeded,
        unit: "mL to draw",
        ratio,
        scaleMax,
        scaleLabel: `volume to draw vs. vial size (${vial} mL vial)`,
      });
    }
  }, [
    mode,
    weight,
    prescribedDose,
    doseUnit,
    totalVolume,
    totalTime,
    dropFactor,
    timeMinutes,
    requiredDose,
    availableDose,
    vialVolume,
  ]);

  return (
    <div className="page-layout">
      <div className="single-page-padding">
        <h1>IV Calculator — Infusion Rate, Drip Rate & IV Dosage</h1>

        <p>
          Calculate IV infusion rate in mL/hr, drip rate in drops/min,
          weight-based IV dosing in mg, or the volume to draw from a medication
          vial. Select the mode that matches your clinical scenario, enter your
          values, and get an accurate result instantly.
        </p>

        <div className="calc-card single-calc">
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              marginBottom: "15px",
            }}
          >
            {types.map((t) => (
              <div
                key={t}
                onClick={() => setMode(t)}
                style={{
                  flex: "1 1 45%",
                  minWidth: "130px",
                  textAlign: "center",
                  padding: "12px",
                  borderRadius: "2px",
                  border:
                    mode === t ? "2px solid #dededea1" : "1px solid #ececec6b",
                  background: "#1F9FB8",
                  cursor: "pointer",
                  fontWeight: mode === t ? 600 : 400,
                }}
              >
                {t}
              </div>
            ))}
          </div>

          {mode === "Body Weight Dose" && (
            <>
              <input
                className="calc-input white-bg"
                type="number"
                placeholder="Patient Weight"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
              <p
                style={{
                  marginTop: "10px",
                  marginBottom: "5px",
                  fontWeight: 600,
                  color: "white",
                }}
              >
                Select Dose Unit
              </p>
              <div
                className="modern-dropdown"
                onClick={() => setUnitOpen(!unitOpen)}
                style={{ width: "100%" }}
              >
                {doseUnit}
                <span className="dropdown-indicator">▼</span>
                {unitOpen && (
                  <ul className="dropdown-list">
                    <li
                      onClick={() => {
                        setDoseUnit("mg/kg");
                        setUnitOpen(false);
                      }}
                    >
                      mg/kg
                    </li>
                    <li
                      onClick={() => {
                        setDoseUnit("mg/lb");
                        setUnitOpen(false);
                      }}
                    >
                      mg/lb
                    </li>
                  </ul>
                )}
              </div>
              <input
                className="calc-input white-bg"
                type="number"
                placeholder="Prescribed Dose"
                value={prescribedDose}
                onChange={(e) => setPrescribedDose(e.target.value)}
                style={{ marginTop: "10px" }}
              />
            </>
          )}

          {mode === "Infusion Rate" && (
            <>
              <input
                className="calc-input white-bg"
                type="number"
                placeholder="Total Volume (mL)"
                value={totalVolume}
                onChange={(e) => setTotalVolume(e.target.value)}
              />
              <input
                className="calc-input white-bg"
                type="number"
                placeholder="Total Time (hours)"
                value={totalTime}
                onChange={(e) => setTotalTime(e.target.value)}
              />
            </>
          )}

          {mode === "Drip Rate" && (
            <>
              <input
                className="calc-input white-bg"
                type="number"
                placeholder="Total Volume (mL)"
                value={totalVolume}
                onChange={(e) => setTotalVolume(e.target.value)}
              />
              <input
                className="calc-input white-bg"
                type="number"
                placeholder="Drop Factor (drops/mL)"
                value={dropFactor}
                onChange={(e) => setDropFactor(e.target.value)}
              />
              <input
                className="calc-input white-bg"
                type="number"
                placeholder="Time (minutes)"
                value={timeMinutes}
                onChange={(e) => setTimeMinutes(e.target.value)}
              />
            </>
          )}

          {mode === "Dose from Vial" && (
            <>
              <input
                className="calc-input white-bg"
                type="number"
                placeholder="Required Dose (mg)"
                value={requiredDose}
                onChange={(e) => setRequiredDose(e.target.value)}
              />
              <input
                className="calc-input white-bg"
                type="number"
                placeholder="Available Dose (mg)"
                value={availableDose}
                onChange={(e) => setAvailableDose(e.target.value)}
              />
              <input
                className="calc-input white-bg"
                type="number"
                placeholder="Volume of Vial (mL)"
                value={vialVolume}
                onChange={(e) => setVialVolume(e.target.value)}
              />
            </>
          )}

          <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
            <button className="calc-button" onClick={calculate}>
              Calculate
            </button>
            <button className="calc-button calc-clear" onClick={handleClear}>
              Clear
            </button>
          </div>
          {result && <div className="calc-result">Result: {result}</div>}
        </div>

        <div className="cr-mobile-slot">
          <IVResultPanel result={panelResult} />
        </div>

        {/* ---- SEO CONTENT ---- */}

        <h2>What Is an IV Calculator?</h2>
        <p>
          An IV calculator is a clinical tool that computes the key parameters
          of intravenous therapy — infusion rate, drip rate, weight-based
          dosing, and vial draw volume. Nurses, pharmacists, paramedics, and
          physicians rely on these calculations daily to ensure patients receive
          the right amount of fluid or medication at the right speed.
        </p>
        <p>
          Getting IV calculations wrong carries serious consequences. Too much
          fluid too quickly can cause pulmonary edema. Too slow, and a
          time-critical antibiotic or vasopressor may never reach therapeutic
          levels. An IV infusion calculator removes the manual arithmetic from
          this process and gives you a verifiable result in seconds.
        </p>
        <p>
          This tool covers all four core IV calculation types used in hospitals,
          field medicine, and nursing education. For the weight-based dose that
          often precedes IV preparation, start with our{" "}
          <Link href="/dose-calculator/" className="my-link">
            dose calculator
          </Link>{" "}
          to determine the total mg dose first.
        </p>

        <h2>What Is Intravenous (IV) Therapy?</h2>
        <p>
          Intravenous therapy delivers fluids, medications, nutrients, or blood
          products directly into the bloodstream through a vein. Because IV
          drugs bypass the gastrointestinal tract, they reach circulation
          immediately with 100% bioavailability — making IV the fastest and most
          reliable drug delivery route. Common applications include hydration,
          antibiotic infusions, chemotherapy, electrolyte replacement, pain
          management, and total parenteral nutrition.
        </p>
        <p>
          Every IV treatment requires at least one calculation before
          administration — whether that is the infusion rate for a pump, the
          drip rate for a gravity set, or the volume to draw from a vial. This
          calculator handles all three.
        </p>

        <h2>IV Calculation Formulas — All Four Modes Explained</h2>

        <h3>1. Body Weight Dose — IV Dosing by Patient Weight</h3>
        <p>
          Many IV medications — antibiotics, sedatives, chemotherapy agents,
          vasopressors — are prescribed as a dose per kilogram or per pound of
          body weight. This ensures the patient receives a therapeutically
          effective amount scaled to their size.
        </p>
        <pre>
          IV Dose (mg) = Patient Weight (kg or lb) × Prescribed Dose (mg/kg or
          mg/lb)
        </pre>

        <h4>Worked Example</h4>
        <p>A 70 kg patient is prescribed gentamicin at 5 mg/kg IV.</p>
        <ul className="custom-list">
          <li>
            70 kg × 5 mg/kg = <strong>350 mg IV</strong>
          </li>
        </ul>
        <p>
          This 350 mg is the total dose to prepare. Next, use the Dose from Vial
          mode to determine how much to draw from the available vial, or use our{" "}
          <Link href="/dose-stock-calculator/" className="my-link">
            dose stock calculator
          </Link>{" "}
          for the same conversion step.
        </p>

        <h3>2. Infusion Rate — How to Calculate mL per Hour</h3>
        <p>
          The infusion rate tells an electronic IV pump how many milliliters to
          deliver each hour. This is the most frequently performed IV
          calculation in hospital nursing.
        </p>
        <pre>
          Infusion Rate (mL/hr) = Total Volume (mL) ÷ Total Time (hours)
        </pre>

        <h4>Worked Example</h4>
        <p>
          A physician orders 1,000 mL of normal saline to infuse over 8 hours.
        </p>
        <ul className="custom-list">
          <li>
            1,000 mL ÷ 8 hours = <strong>125 mL/hr</strong>
          </li>
        </ul>
        <p>
          Set the infusion pump to 125 mL/hr. The bag will be empty in 8 hours.
        </p>

        <h3>3. Drip Rate — Drops per Minute for Gravity IV Sets</h3>
        <p>
          When an electronic pump is unavailable — in the field, in rural
          clinics, or during emergency transport — nurses and paramedics
          calculate drip rate manually by counting drops in the drip chamber.
          The drop factor depends on the IV tubing set used.
        </p>
        <pre>
          Drip Rate (drops/min) = (Total Volume × Drop Factor) ÷ Time (minutes)
        </pre>

        <h4>Worked Example</h4>
        <p>
          500 mL of Ringer's lactate to infuse over 4 hours using a macrodrip
          set (15 drops/mL).
        </p>
        <ul className="custom-list">
          <li>Time in minutes: 4 × 60 = 240 minutes</li>
          <li>
            Drip Rate = (500 × 15) ÷ 240 = <strong>31.25 drops/min</strong>
          </li>
        </ul>
        <p>
          Count approximately 31 drops per minute in the drip chamber. Adjust
          the roller clamp until the count matches.
        </p>

        <h3>4. Dose from Vial — How Much to Draw</h3>
        <p>
          Medications in vials have a known concentration. Once the total mg
          dose is established, this calculation tells you exactly how many
          milliliters to draw with a syringe.
        </p>
        <pre>
          Volume to Draw (mL) = (Required Dose ÷ Available Dose) × Vial Volume
        </pre>

        <h4>Worked Example</h4>
        <p>
          A patient needs 80 mg of furosemide IV. The vial contains 100 mg in 10
          mL.
        </p>
        <ul className="custom-list">
          <li>
            Volume = (80 ÷ 100) × 10 = <strong>8 mL</strong>
          </li>
        </ul>
        <p>
          Draw 8 mL from the vial. For more complex stock calculations involving
          tablets or oral liquids, our{" "}
          <Link href="/dose-stock-calculator/" className="my-link">
            dose stock calculator
          </Link>{" "}
          covers those scenarios.
        </p>

        <h2>IV Drop Factor Reference Table</h2>
        <p>
          The drop factor is printed on the IV tubing packaging, but knowing the
          standard values saves time during clinical calculations. Here is a
          quick reference:
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
                  Set Type
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Drop Factor
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Typical Use
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Macrodrip
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  10 drops/mL
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Large-volume fluid replacement, rapid infusion
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Macrodrip
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  15 drops/mL
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Standard adult IV fluid administration
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Macrodrip
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  20 drops/mL
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Standard adult IV, some regions/manufacturers
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Microdrip
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  60 drops/mL
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Pediatric, neonatal, precise slow infusions
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Always confirm the drop factor from the tubing package before
          calculating. Using 15 drops/mL when the actual set is 20 drops/mL
          gives a 33% error in drip rate — enough to cause clinical harm.
        </p>

        <h2>Common Infusion Rates — Quick Reference</h2>
        <p>
          The table below shows infusion rates for standard fluid orders. These
          are the calculations most frequently performed on hospital wards:
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
                  Order
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Volume
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Time
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Rate (mL/hr)
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  NS over 4 hours
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  1,000 mL
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  4 hrs
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  250
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  NS over 8 hours
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  1,000 mL
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  8 hrs
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  125
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  D5W over 6 hours
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  500 mL
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  6 hrs
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  83
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Antibiotic piggyback
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  100 mL
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  0.5 hrs
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  200
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  KVO / keep-vein-open
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>—</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>—</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  10–30
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>How This IV Calculator Fits With Other Dosing Tools</h2>
        <p>
          In clinical practice, three tools are used in sequence before any IV
          medication is administered:
        </p>
        <ul className="custom-list">
          <li>
            <strong>
              <Link href="/dose-calculator/" className="my-link">
                Dose Calculator
              </Link>
            </strong>{" "}
            — determines the total drug dose in mg based on the patient's body
            weight and the prescribed mg/kg rate. This is always the first step.
          </li>
          <li>
            <strong>
              <Link href="/dose-stock-calculator/" className="my-link">
                Dose Stock Calculator
              </Link>
            </strong>{" "}
            — converts the mg dose into the volume of stock solution to draw up,
            using the drug's concentration. Equivalent to the "Dose from Vial"
            mode in this IV calculator.
          </li>
          <li>
            <strong>IV Calculator (this tool)</strong> — once the volume is
            prepared, calculates the infusion rate or drip rate for safe, timed
            delivery.
          </li>
        </ul>
        <p>
          For more advanced drug modeling — including half-life, clearance, and
          volume of distribution — see our{" "}
          <Link href="/pharmacokinetics-calculator/" className="my-link">
            pharmacokinetics calculator
          </Link>
          .
        </p>

        <h2>Who Uses an IV Infusion Calculator?</h2>
        <ul className="custom-list">
          <li>
            <strong>Nurses and nursing students</strong> — for daily IV pump
            programming, manual drip rate calculation, and NCLEX exam
            preparation
          </li>
          <li>
            <strong>Paramedics and EMTs</strong> — for field IV fluid
            administration where gravity drip is the only option
          </li>
          <li>
            <strong>Pharmacists</strong> — for verifying IV admixture orders and
            confirming infusion rates before dispensing
          </li>
          <li>
            <strong>Physicians and intensivists</strong> — for weight-based IV
            dosing in ICU and critical care settings
          </li>
          <li>
            <strong>Veterinarians</strong> — for computing IV fluid rates and
            drug doses in animals. Our{" "}
            <Link href="/dose-calculator/" className="my-link">
              dose calculator
            </Link>{" "}
            handles the weight-based step for any species
          </li>
          <li>
            <strong>Medical and pharmacy students</strong> — for learning IV
            calculation formulas for exams and clinical rotations
          </li>
        </ul>

        <h2>Common IV Calculation Errors and How to Avoid Them</h2>
        <ul className="custom-list">
          <li>
            <strong>Using the wrong drop factor.</strong> Plugging in 15
            drops/mL when the tubing set is 20 drops/mL creates a 33% error.
            Always read the number from the tubing packaging, not from memory.
          </li>
          <li>
            <strong>Confusing hours and minutes.</strong> The infusion rate
            formula uses hours; the drip rate formula uses minutes. Entering 240
            minutes into the infusion rate field instead of 4 hours gives a
            result that is 60 times too low. Choose the correct calculator mode
            for each scenario.
          </li>
          <li>
            <strong>Not converting mg/lb to mg/kg.</strong> A dose rate of 5
            mg/kg is very different from 5 mg/lb — the lb rate produces roughly
            half the dose. Confirm which unit the prescriber intended before
            calculating.
          </li>
          <li>
            <strong>
              Forgetting to account for displacement in reconstitution.
            </strong>{" "}
            When reconstituting a powdered drug with diluent, the resulting
            volume may be slightly more than the diluent alone due to the volume
            occupied by the powder (displacement volume). This affects the final
            concentration and therefore the volume to draw. Check the drug
            monograph for displacement values.
          </li>
          <li>
            <strong>
              Programming the pump in mL/hr when the order is in mcg/kg/min.
            </strong>{" "}
            Some IV drug orders — dopamine, dobutamine, nitroglycerin — are
            written as micrograms per kilogram per minute, not mL/hr. These
            require an additional conversion step before programming the pump.
            Always confirm units.
          </li>
        </ul>

        <h2>Why Accurate IV Calculations Are Critical</h2>
        <p>
          IV medication errors are among the most dangerous in clinical
          medicine. High-alert IV drugs — potassium chloride, insulin, heparin,
          opioids, and concentrated electrolytes — have a narrow therapeutic
          window where even small calculation mistakes can cause serious patient
          harm. Using a reliable IV infusion rate calculator, verifying the dose
          with a{" "}
          <Link href="/dose-calculator/" className="my-link">
            dose calculator
          </Link>
          , and cross-checking the stock volume with a{" "}
          <Link href="/dose-stock-calculator/" className="my-link">
            dose stock calculator
          </Link>{" "}
          before preparation reduces error risk at every step of the IV
          medication process.
        </p>

        <h2>Important Safety Notes</h2>
        <ul className="custom-list">
          <li>
            This IV calculator provides a mathematical result based on the
            values entered. It is designed to support — not replace —
            professional clinical judgment.
          </li>
          <li>
            Always verify results against the prescribing physician's orders,
            current drug references, and your institution's protocols before
            administration.
          </li>
          <li>
            For high-alert drugs, perform an independent double-check with a
            second clinician before programming the pump or adjusting the drip
            rate.
          </li>
          <li>
            Monitor the patient continuously during IV infusions, especially
            during the first 15 minutes of a new medication or rate change.
          </li>
        </ul>

        <h2>Frequently Asked Questions About IV Calculations</h2>

        <div className="faq-item">
          <h3 onClick={() => toggleFAQ(0)}>
            How do you calculate IV infusion rate in mL per hour?
            <i
              className={`fa-solid fa-chevron-down ${openFAQ === 0 ? "rotate" : ""}`}
            ></i>
          </h3>
          {openFAQ === 0 && (
            <p>
              Divide the total volume to be infused (mL) by the total time in
              hours. For example, 500 mL over 4 hours = 500 ÷ 4 = 125 mL/hr.
              Enter these values into the Infusion Rate mode above. This is the
              standard formula used when programming electronic infusion pumps.
            </p>
          )}
        </div>

        <div className="faq-item">
          <h3 onClick={() => toggleFAQ(1)}>
            What is the difference between infusion rate and drip rate?
            <i
              className={`fa-solid fa-chevron-down ${openFAQ === 1 ? "rotate" : ""}`}
            ></i>
          </h3>
          {openFAQ === 1 && (
            <p>
              Infusion rate (mL/hr) is used when programming an electronic pump
              — it measures how many milliliters the pump delivers per hour.
              Drip rate (drops/min) is used with gravity IV sets where you count
              drops manually in the drip chamber. Both control fluid delivery
              speed, but through different mechanisms. Use the Infusion Rate
              mode for pumps and the Drip Rate mode for manual setups.
            </p>
          )}
        </div>

        <div className="faq-item">
          <h3 onClick={() => toggleFAQ(2)}>
            How do I calculate how much to draw from a medication vial?
            <i
              className={`fa-solid fa-chevron-down ${openFAQ === 2 ? "rotate" : ""}`}
            ></i>
          </h3>
          {openFAQ === 2 && (
            <p>
              Use the formula: Volume = (Required Dose ÷ Available Dose) × Vial
              Volume. For example, if you need 75 mg and the vial contains 100
              mg in 2 mL, then (75 ÷ 100) × 2 = 1.5 mL. The Dose from Vial mode
              above does this instantly. For non-IV stock calculations (tablets,
              oral liquids), our{" "}
              <Link href="/dose-stock-calculator/" className="my-link">
                dose stock calculator
              </Link>{" "}
              handles the same logic.
            </p>
          )}
        </div>

        <div className="faq-item">
          <h3 onClick={() => toggleFAQ(3)}>
            What drop factor should I use?
            <i
              className={`fa-solid fa-chevron-down ${openFAQ === 3 ? "rotate" : ""}`}
            ></i>
          </h3>
          {openFAQ === 3 && (
            <p>
              Check the IV tubing packaging. Standard macrodrip sets deliver 10,
              15, or 20 drops/mL depending on the manufacturer. Microdrip sets
              deliver 60 drops/mL and are used for precise, slow infusions —
              particularly in pediatric and neonatal care. Never assume the drop
              factor from memory; always verify from the package.
            </p>
          )}
        </div>

        <div className="faq-item">
          <h3 onClick={() => toggleFAQ(4)}>
            Can nursing students use this for NCLEX preparation?
            <i
              className={`fa-solid fa-chevron-down ${openFAQ === 4 ? "rotate" : ""}`}
            ></i>
          </h3>
          {openFAQ === 4 && (
            <p>
              Yes. All four calculation modes — body weight dose, infusion rate,
              drip rate, and dose from vial — are standard competencies tested
              on the NCLEX and other nursing licensing exams. Use this tool to
              practice calculations and verify your manual work. Understanding
              the underlying formulas is just as important as getting the right
              answer.
            </p>
          )}
        </div>

        <div className="faq-item">
          <h3 onClick={() => toggleFAQ(5)}>
            How is an IV dose different from an oral dose?
            <i
              className={`fa-solid fa-chevron-down ${openFAQ === 5 ? "rotate" : ""}`}
            ></i>
          </h3>
          {openFAQ === 5 && (
            <p>
              An IV dose is delivered directly into the bloodstream, so 100% of
              the drug reaches systemic circulation (100% bioavailability). Oral
              doses pass through the gastrointestinal tract and liver first
              (first-pass metabolism), which reduces the amount that reaches
              circulation. Because of this, IV doses are often lower than
              equivalent oral doses. Use our{" "}
              <Link href="/dose-calculator/" className="my-link">
                dose calculator
              </Link>{" "}
              for standard weight-based oral or injectable dosing.
            </p>
          )}
        </div>

        <div className="faq-item">
          <h3 onClick={() => toggleFAQ(6)}>
            What does "KVO" or "keep vein open" mean?
            <i
              className={`fa-solid fa-chevron-down ${openFAQ === 6 ? "rotate" : ""}`}
            ></i>
          </h3>
          {openFAQ === 6 && (
            <p>
              KVO (keep vein open) is a very slow IV infusion rate — usually 10
              to 30 mL/hr — used to maintain venous access without delivering a
              significant fluid volume. It keeps the IV line patent and ready
              for medication administration when needed. KVO is commonly ordered
              between scheduled IV medications or when the primary infusion has
              completed but IV access must be preserved.
            </p>
          )}
        </div>

        <div className="faq-item">
          <h3 onClick={() => toggleFAQ(7)}>
            How do I convert mcg/kg/min to mL/hr for an IV pump?
            <i
              className={`fa-solid fa-chevron-down ${openFAQ === 7 ? "rotate" : ""}`}
            ></i>
          </h3>
          {openFAQ === 7 && (
            <p>
              This requires a multi-step conversion. First, calculate the total
              dose per minute: patient weight (kg) × dose rate (mcg/kg/min).
              Then convert to mg/min by dividing by 1,000. Then convert to mg/hr
              by multiplying by 60. Finally, divide by the drug concentration
              (mg/mL) to get mL/hr. For example, a 70 kg patient on dopamine at
              5 mcg/kg/min with a concentration of 1.6 mg/mL: (70 × 5) = 350
              mcg/min → 0.35 mg/min → 21 mg/hr → 21 ÷ 1.6 = 13.1 mL/hr.
            </p>
          )}
        </div>

        <div className="faq-item">
          <h3 onClick={() => toggleFAQ(8)}>
            Can this IV calculator be used for veterinary patients?
            <i
              className={`fa-solid fa-chevron-down ${openFAQ === 8 ? "rotate" : ""}`}
            ></i>
          </h3>
          {openFAQ === 8 && (
            <p>
              Yes. The formulas for IV infusion rate, drip rate, and
              weight-based dosing are identical for animals and humans. The Body
              Weight Dose mode supports both mg/kg and mg/lb. Always use
              species-specific drug references to confirm dose rates, as these
              can differ significantly from human protocols.
            </p>
          )}
        </div>
      </div>

      {/* ---- SIDEBAR ---- */}
      <aside className="sidebar">
        <div className="cr-desktop-slot">
          <IVResultPanel result={panelResult} />
        </div>

        <div className="sidebar-box">
          <p style={{ fontSize: "20px", fontWeight: 600 }}>
            Related Calculators
          </p>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li>
              <Link href="/dose-calculator/" className="my-link">
                Dose Calculator
              </Link>
            </li>
            <li>
              <Link href="/dose-stock-calculator/" className="my-link">
                Dose Stock Calculator
              </Link>
            </li>
            <li>
              <Link href="/pharmacokinetics-calculator/" className="my-link">
                Pharmacokinetics Calculator
              </Link>
            </li>
            <li>
              <Link href="/bmi-calculator/" className="my-link">
                BMI Calculator
              </Link>
            </li>
            <li>
              <Link href="/calorie-calculator/" className="my-link">
                Calorie Calculator
              </Link>
            </li>
            <li>
              <Link href="/body-fat-calculator/" className="my-link">
                Body Fat Calculator
              </Link>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
