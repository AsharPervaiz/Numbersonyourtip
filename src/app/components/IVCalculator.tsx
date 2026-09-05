"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import ReviewedBy from "./ReviewedBy";

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
        against the prescribing physician&apos;s instructions and your institution&apos;s
        protocols before administration.
      </div>
    </div>
  );
}

const FAQ_DATA: [string, string][] = [
  [
    "How do you calculate an IVIG infusion rate in mL per hour?",
    "Immunoglobulin rates are ordered in mg/kg/min, so you need the patient weight and the product concentration to reach a pump rate: (mg/kg/min × weight in kg × 60) ÷ concentration in mg/mL. For a 70 kg patient on a 10% product (100 mg/mL) at 0.5 mg/kg/min, that is (0.5 × 70 × 60) ÷ 100 = 21 mL/hr. Repeat the same calculation at each step of the escalation, because IVIG is stepped up at intervals rather than run at one rate.",
  ],
  [
    "How long will an IVIG infusion take if the rate steps up?",
    "Work out the volume delivered during each held step, subtract that from the bag volume, then divide the remainder by the final rate. A 280 mL bag delivered at 21, 42 and 84 mL/hr for 30 minutes each has given 73.5 mL after 90 minutes; the remaining 206.5 mL at 168 mL/hr takes another 74 minutes, so the total is about 2 hours 45 minutes. Dividing the whole bag by the final rate alone would have estimated 100 minutes and under-booked the chair by more than an hour.",
  ],
  [
    "How do I convert mcg/kg/min to mL/hr for an infusion pump?",
    "Multiply the ordered dose by the weight and by 60, then divide by the concentration of the prepared bag in mcg/mL. Norepinephrine 4 mg in 250 mL is 16 mcg/mL, so an 80 kg patient at 0.1 mcg/kg/min needs (0.1 × 80 × 60) ÷ 16 = 30 mL/hr. The factor of 60 converts per-minute to per-hour and is the step most often left out.",
  ],
  [
    "What is the difference between infusion rate and drip rate?",
    "Infusion rate is millilitres per hour and is what you program into an electronic pump. Drip rate is drops per minute and applies to gravity sets, where the flow is set by a roller clamp and counted in the drip chamber. Converting between them needs the drop factor of the tubing, which is printed on the packet and varies between 10, 15, 20 and 60 gtt/mL.",
  ],
  [
    "Which drop factor should I use?",
    "Read it off the giving set rather than assuming it. Macrodrip sets are commonly 10, 15 or 20 gtt/mL and are used for adult fluids; microdrip sets are 60 gtt/mL and are used in paediatrics and for low-volume infusions. Sets from different manufacturers on the same trolley can differ, and calculating with 20 gtt/mL on a 15 gtt/mL set runs the infusion about a third too fast.",
  ],
  [
    "Why does a 10% solution mean 100 mg per mL?",
    "A percentage concentration means grams of solute per 100 mL of solution. Ten percent is therefore 10 g in 100 mL, which is 10,000 mg in 100 mL, or 100 mg/mL. Reading 10% as 10 mg/mL introduces a tenfold error into every calculation downstream, which is why immunoglobulin and albumin rates should always be converted to mg/mL before any rate arithmetic begins.",
  ],
  [
    "How much do I draw from a vial, and does reconstitution change it?",
    "For a ready-made solution, volume to draw = (required dose ÷ vial dose) × vial volume, so 750 mg from a 1 g in 10 mL vial is 7.5 mL. For powders, the dry drug displaces volume, so the label may specify adding 9.6 mL of diluent to produce 10 mL of solution. Adding a round 10 mL instead makes the resulting concentration lower than stated and every dose drawn from it slightly under-strength.",
  ],
  [
    "Can nursing students use this for dosage calculation practice?",
    "Yes — the four modes cover the calculation types that appear most often in nursing dosage exams: weight-based dose, mL/hr, gtt/min, and volume from a vial. The most useful way to practise is to work each problem on paper first and use the calculator only to check, because exams test whether you can select the right formula from the wording of the order, which is the step a calculator cannot do for you.",
  ],
  [
    "What does KVO or TKO mean on an order?",
    "Keep vein open, sometimes written as to keep open, means running fluid slowly enough to stop the cannula clotting without giving a clinically meaningful volume. It is a low fixed rate rather than a calculated one, and the exact figure comes from local policy rather than a formula. Because it is not weight-based or time-based, it is the one common IV order that needs no calculation at all.",
  ],
];

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
        <h1>IV Infusion Rate Calculator — Drip Rate, IVIG & Vial Dose</h1>


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

        <h2>Start With What the Order Says</h2>
        <p>
          Almost every IV calculation error starts in the same place: the
          clinician reaches for a formula before deciding which quantity the
          order is actually asking for. An order for 1 gram of vancomycin, an
          order for 125 mL/hr, and an order for 0.5 mg/kg/min are three
          different problems, and only one of them is solved by dividing volume
          by time.
        </p>
        <p>Use the wording of the order to pick the mode:</p>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>If the order is written as</th>
                <th>What is missing</th>
                <th>Mode to use</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>&quot;1 g in 250 mL over 90 minutes&quot;</td>
                <td>The pump rate</td>
                <td>Infusion Rate (mL/hr)</td>
              </tr>
              <tr>
                <td>&quot;1000 mL NS over 8 hours, gravity set&quot;</td>
                <td>Drops per minute</td>
                <td>Drip Rate (gtt/min)</td>
              </tr>
              <tr>
                <td>&quot;5 mg/kg IV&quot;</td>
                <td>The total dose in mg</td>
                <td>Body Weight Dose</td>
              </tr>
              <tr>
                <td>&quot;Give 750 mg from a 1 g/10 mL vial&quot;</td>
                <td>The volume to draw</td>
                <td>Dose from Vial</td>
              </tr>
              <tr>
                <td>&quot;0.1 mcg/kg/min&quot; or &quot;0.5 mg/kg/min&quot;</td>
                <td>Two conversions before a rate</td>
                <td>Weight dose, then Infusion Rate</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          The last row is the one that catches people out, and it is covered in
          detail below. A weight-and-time order is not a rate until you have
          folded in the concentration of the bag hanging on the pole.
        </p>

        <h2>The Pump Number: mL per Hour</h2>
        <p>
          An electronic pump wants one thing — millilitres per hour. If the
          order gives you a volume and a duration, that is a single division:
        </p>
        <pre>Rate (mL/hr) = Volume (mL) ÷ Time (hours)</pre>
        <p>
          A 250 mL piggyback over 90 minutes is 250 ÷ 1.5 = 166.7 mL/hr. Most
          pumps accept one decimal place, so this is programmed as 166.7 mL/hr
          rather than rounded to 167. The difference is trivial over 90 minutes
          and meaningless for an antibiotic, but the habit matters: on a
          72-hour heparin infusion, rounding at every rate change compounds.
        </p>

        <h3>When the Order Is in mcg/kg/min</h3>
        <p>
          Vasoactive drugs are ordered by weight and time, not by volume. To
          reach a pump rate you need the concentration of the prepared bag,
          which is rarely printed on the order.
        </p>
        <pre>
          Rate (mL/hr) = (Dose in mcg/kg/min × Weight in kg × 60) ÷
          Concentration in mcg/mL
        </pre>
        <p>
          Norepinephrine 4 mg in 250 mL gives 4000 mcg ÷ 250 mL = 16 mcg/mL. For
          an 80 kg patient ordered at 0.1 mcg/kg/min:
        </p>
        <pre>(0.1 × 80 × 60) ÷ 16 = 480 ÷ 16 = 30 mL/hr</pre>
        <p>
          The 60 in the numerator is the only reason this differs from a
          straight weight-based dose — it converts per-minute to per-hour.
          Leaving it out produces a rate 60 times too low, which reads as
          plausible on a pump screen and is the single most common vasopressor
          programming error.
        </p>

        <h2>Drops per Minute When There Is No Pump</h2>
        <p>
          Gravity sets are still standard in field medicine, in theatres, and
          anywhere a pump is unavailable. The drip chamber delivers a fixed
          number of drops per millilitre, printed on the tubing packet.
        </p>
        <pre>
          Drops per minute = (Volume in mL × Drop factor in gtt/mL) ÷ Time in
          minutes
        </pre>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Set type</th>
                <th>Drop factor</th>
                <th>Typical use</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Macrodrip</td>
                <td>10 gtt/mL</td>
                <td>Rapid volume replacement, trauma</td>
              </tr>
              <tr>
                <td>Macrodrip</td>
                <td>15 gtt/mL</td>
                <td>General adult maintenance fluids</td>
              </tr>
              <tr>
                <td>Macrodrip</td>
                <td>20 gtt/mL</td>
                <td>Adult maintenance, some blood sets</td>
              </tr>
              <tr>
                <td>Microdrip</td>
                <td>60 gtt/mL</td>
                <td>Paediatrics, precise low-volume infusions</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          For 1000 mL of normal saline over 8 hours through a 15 gtt/mL set:
          (1000 × 15) ÷ 480 minutes = 31.25, counted as 31 drops per minute.
        </p>
        <p>
          Two practical points that the formula does not capture. First, count
          for a full 60 seconds rather than counting 15 seconds and multiplying
          by four — a one-drop miscount in a 15-second window becomes a
          four-drop error per minute, roughly 13% off on this example. Second,
          gravity rates drift as the bag empties and the pressure head falls, so
          a set checked once at the start will run slower by the end. Recount at
          every round.
        </p>
        <p>
          With a microdrip set at 60 gtt/mL, the drop rate and the hourly rate
          are numerically identical: 50 mL/hr is 50 gtt/min. This is why 60
          gtt/mL sets are standard in paediatrics — it removes a conversion step
          from the population where errors are least forgiving.
        </p>

        <h2>IVIG and SCIg: When the Rate Changes Every Thirty Minutes</h2>
        <p>
          Immunoglobulin is the reason most people searching for an infusion
          rate calculator do not find what they need. IVIG is not administered
          at one rate. It is started low, held, and stepped up at intervals,
          because the adverse effects associated with it — headache, chills,
          flushing, rigors, and less commonly thrombotic or renal events — track
          with the rate of delivery rather than the total dose. A calculator that
          returns a single mL/hr figure cannot describe that order.
        </p>
        <p>
          There are three separate numbers to work out, in this sequence.
        </p>

        <h3>1. The Grams, From Body Weight</h3>
        <p>
          Immunoglobulin is dosed in grams per kilogram, not milligrams.
          Replacement dosing in primary immunodeficiency sits in a different
          range from immunomodulatory courses, which are prescribed as a larger
          total and usually divided across consecutive days. Take both the
          figure and the schedule from the prescription and the product label
          rather than from any general reference, including this one.
        </p>
        <pre>Total dose (g) = Weight (kg) × Prescribed dose (g/kg)</pre>
        <p>A 70 kg patient prescribed 0.4 g/kg needs 28 g.</p>

        <h3>2. The Volume, From Product Concentration</h3>
        <p>
          Immunoglobulin products are supplied at different strengths, and the
          strength decides the volume — which in turn decides how long the
          patient sits in the chair. A 10% product is 100 mg/mL; a 5% product is
          50 mg/mL and therefore double the volume for the same number of grams.
        </p>
        <pre>Volume (mL) = Total dose (g) × 1000 ÷ Concentration (mg/mL)</pre>
        <p>
          That 28 g dose is 28,000 mg. At 10% it is 280 mL. At 5% it would be
          560 mL — same drug, same dose, twice the fluid, which matters
          considerably in a patient with cardiac or renal impairment.
        </p>

        <h3>3. The Rate at Each Step</h3>
        <p>
          Immunoglobulin rates are written in mg/kg/min, so converting to a pump
          rate needs both the weight and the concentration:
        </p>
        <pre>
          Rate (mL/hr) = (mg/kg/min × Weight in kg × 60) ÷ Concentration in
          mg/mL
        </pre>
        <p>
          For the same 70 kg patient on a 10% product, each step of an
          escalating order converts as below. The mg/kg/min figures here are
          only to show the arithmetic — every product has its own licensed
          starting rate and its own ceiling, and those are the numbers that must
          be used at the bedside.
        </p>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Step</th>
                <th>Ordered rate</th>
                <th>Pump rate (70 kg, 10%)</th>
                <th>Volume in 30 min</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Initial 30 min</td>
                <td>0.5 mg/kg/min</td>
                <td>21 mL/hr</td>
                <td>10.5 mL</td>
              </tr>
              <tr>
                <td>Second 30 min</td>
                <td>1 mg/kg/min</td>
                <td>42 mL/hr</td>
                <td>21 mL</td>
              </tr>
              <tr>
                <td>Third 30 min</td>
                <td>2 mg/kg/min</td>
                <td>84 mL/hr</td>
                <td>42 mL</td>
              </tr>
              <tr>
                <td>Remainder</td>
                <td>4 mg/kg/min</td>
                <td>168 mL/hr</td>
                <td>Balance of the bag</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>Working Out the Chair Time</h3>
        <p>
          Infusion time for a stepped order is the sum of the held steps plus
          the time needed to clear whatever volume is left at the final rate.
          Using the table above against a 280 mL bag:
        </p>
        <pre>
          Delivered in first 90 min = 10.5 + 21 + 42 = 73.5 mL{"\n"}Remaining =
          280 − 73.5 = 206.5 mL{"\n"}At 168 mL/hr = 206.5 ÷ 168 = 1.23 hr = 74
          min{"\n"}Total = 90 + 74 = 164 min, about 2 hours 45 minutes
        </pre>
        <p>
          Estimating this from the final rate alone gives 280 ÷ 168 = 100
          minutes, which under-books the chair by more than an hour. In an
          outpatient day unit that is the difference between a schedule that
          holds and one that overruns every afternoon.
        </p>

        <h3>Where SCIg Differs</h3>
        <p>
          Subcutaneous immunoglobulin replaces one long venous infusion with
          smaller, more frequent doses delivered by syringe driver into
          subcutaneous tissue, often across two or more sites at once. The
          arithmetic changes in two ways. The dose per administration is a
          fraction of the equivalent intravenous dose because it is given far
          more often, and the rate ceiling is set per site by how much fluid the
          tissue will accept rather than by systemic tolerance. Splitting a dose
          across sites is a volume-per-site division, not a rate calculation,
          and how many sites to use is a clinical decision made with the
          patient.
        </p>

        <h2>Drawing From the Vial</h2>
        <p>
          Once the total dose in milligrams is settled, the volume to draw
          depends only on what is in the vial:
        </p>
        <pre>
          Volume to draw (mL) = (Required dose ÷ Vial dose) × Vial volume
        </pre>
        <p>
          Needing 750 mg from a 1 g in 10 mL vial: (750 ÷ 1000) × 10 = 7.5 mL.
        </p>
        <p>
          Powder for reconstitution introduces a trap that catches the
          arithmetic out. Dry drug occupies space, so adding 10 mL of diluent to
          a vial does not give 10 mL of solution — it gives 10 mL plus the
          displacement volume of the powder. Manufacturers account for this by
          specifying a diluent volume smaller than the final volume: a vial that
          yields 10 mL at 100 mg/mL may call for 9.6 mL of water for injection,
          the missing 0.4 mL being the powder itself. Adding a round 10 mL
          because it looks tidier makes every dose drawn from that vial roughly
          4% low. Use the reconstitution volume printed on the label, and
          calculate concentration from the stated final volume.
        </p>
        <p>
          The same displacement logic applies to oral powders and suspensions.
          Our{" "}
          <Link href="/dose-stock-calculator/" className="my-link">
            dose stock calculator
          </Link>{" "}
          handles tablets and syrups, where stock strength is expressed per
          tablet or per 5 mL.
        </p>

        <h2>Working Backwards From a Deadline</h2>
        <p>
          Sometimes the fixed point is the finish time, not the rate — a
          pre-operative antibiotic that has to be complete before incision, or a
          transfusion that must finish inside its hang limit.
        </p>
        <pre>Time (hours) = Volume (mL) ÷ Rate (mL/hr)</pre>
        <p>
          A 500 mL unit running at 125 mL/hr takes four hours exactly, which
          leaves no margin at all against a four-hour limit. Any interruption — a
          line flush, a positional occlusion alarm, a patient going to the
          bathroom — pushes it past. Whether to build in a margin is a clinical
          judgement, but making that judgement consciously requires knowing the
          finishing time before you start rather than discovering it at hour
          three.
        </p>

        <h2>Where These Calculations Actually Go Wrong</h2>
        <p>
          The failure modes worth memorising are specific rather than general.
        </p>
        <ul className="custom-list">
          <li>
            <strong>The missing 60.</strong> Any order in mcg/kg/min or
            mg/kg/min needs multiplying by 60 to become an hourly rate. Omit it
            and the rate is sixty-fold low; apply it twice and it is sixty-fold
            high. Both look like plausible pump entries.
          </li>
          <li>
            <strong>Percentage read as mg/mL.</strong> A 10% solution is 100
            mg/mL, not 10 mg/mL. This tenfold error propagates through every
            immunoglobulin and albumin calculation that follows it.
          </li>
          <li>
            <strong>Concentration taken from the vial, not the bag.</strong>{" "}
            Once a drug has been diluted into a bag, the vial concentration is
            irrelevant. The rate calculation uses the concentration of what is
            actually hanging.
          </li>
          <li>
            <strong>A course total entered as a single-day dose.</strong>{" "}
            Immunomodulatory immunoglobulin courses are frequently prescribed as
            a total to be divided across consecutive days. Infusing the whole
            course in one sitting is a volume error and a rate error at the same
            time.
          </li>
          <li>
            <strong>Drop factor assumed rather than read.</strong> Sets from
            different manufacturers on the same trolley can be 15 and 20 gtt/mL.
            Running a 20 gtt/mL calculation through a 15 gtt/mL set delivers
            about a third too fast.
          </li>
          <li>
            <strong>Weight taken from the notes rather than the scale.</strong>{" "}
            A documented weight that is months old, or one the patient
            estimated, quietly corrupts every weight-based figure downstream of
            it.
          </li>
        </ul>

        <h2>Before You Press Start</h2>
        <p>
          A short independent check catches most of the above without slowing
          anything down.
        </p>
        <ul className="custom-list">
          <li>
            Does the rate look like a rate? Adult maintenance fluids sit in the
            tens to low hundreds of mL/hr. A four-digit rate on a routine
            infusion is nearly always a decimal error.
          </li>
          <li>
            Does the bag empty in a sensible time? Divide the volume by your
            calculated rate and check the answer against the length of the
            shift.
          </li>
          <li>
            Is the concentration the one on the label in front of you, in mg/mL,
            converted from any percentage on the packaging?
          </li>
          <li>
            For anything weight-based, has the weight been measured today, and
            in kilograms?
          </li>
          <li>
            For high-risk infusions, has a second clinician worked the
            arithmetic independently rather than confirming yours?
          </li>
        </ul>
        <p>
          For the pharmacology behind why the rate matters as much as the dose —
          half-life, clearance, and time to steady state — see our{" "}
          <Link href="/pharmacokinetics-calculator/" className="my-link">
            pharmacokinetics calculator
          </Link>
          . For weight-based dosing before an IV is prepared, the{" "}
          <Link href="/dose-calculator/" className="my-link">
            dose calculator
          </Link>{" "}
          handles mg/kg and mg/lb orders, and our{" "}
          <Link
            href="/blog/ultimate-iv-infusion-calculator-guide/"
            className="my-link"
          >
            full IV infusion guide
          </Link>{" "}
          works through longer scenarios end to end.
        </p>
        <h2>IV Infusion Questions, Answered</h2>

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
        <ReviewedBy medical />
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
