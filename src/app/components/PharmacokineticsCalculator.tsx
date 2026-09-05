"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import ReviewedBy from "./ReviewedBy";

/* ─────────────────────────────────────────
   Types
───────────────────────────────────────── */
type Mode =
  | "Half-Life"
  | "Elimination Rate Constant"
  | "Volume of Distribution"
  | "Clearance"
  | "Loading Dose"
  | "Maintenance Dose";

interface PKResult {
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
   PKResultPanel
───────────────────────────────────────── */
function PKResultPanel({ result }: { result: PKResult | null }) {
  if (!result) {
    return (
      <div className="cr-panel-placeholder">
        <div className="cr-ph-icon">
          <i className="fa-solid fa-flask-vial" aria-hidden="true" />
        </div>
        Enter your PK values to see the calculated result here.
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
            <clipPath id="pk-half">
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
            clipPath="url(#pk-half)"
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
            clipPath="url(#pk-half)"
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
            clipPath="url(#pk-half)"
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
            clipPath="url(#pk-half)"
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
          <span>{(scaleMax * 0.25).toFixed(1)}</span>
          <span>{(scaleMax * 0.5).toFixed(1)}</span>
          <span>{(scaleMax * 0.75).toFixed(1)}</span>
          <span>{scaleMax.toFixed(1)}+</span>
        </div>
      </div>
      <hr className="cr-divider" />
      <div className="cr-world-note" style={{ fontStyle: "italic" }}>
        <i
          className="fa-solid fa-triangle-exclamation"
          style={{ marginRight: "6px" }}
        />
        This meter is a general reference, not drug-specific. PK parameters vary
        widely by drug — always verify against current clinical references and
        patient-specific data.
      </div>
    </div>
  );
}

const FAQ_DATA: [string, string][] = [
  [
    "How do I calculate a drug half-life from two blood levels?",
    "Take the natural log of each concentration, subtract, and divide by the time between the samples to get the elimination rate constant: k = (ln C₁ − ln C₂) ÷ (t₂ − t₁). Half-life is then 0.693 ÷ k. A level of 18 mg/L falling to 6 mg/L over eight hours gives k = 0.137 per hour and a half-life of 5.1 hours. Both samples must be drawn in the elimination phase, not while the drug is still distributing.",
  ],
  [
    "Why is half-life calculated with 0.693?",
    "It is the natural logarithm of 2, which appears whenever an exponential process is halved. First-order elimination removes a constant fraction per unit time, so the time to fall by half is the same wherever you start on the curve. That constancy is what makes half-life a usable single number.",
  ],
  [
    "How long does it take to reach steady state?",
    "About five half-lives, at which point roughly 97% of steady state has been reached. Each half-life closes half the remaining gap: 50%, 75%, 87.5%, 93.75%, then 96.9%. The same figures run in reverse after stopping. Five is a convention rather than a threshold — nothing changes at that point, the remaining gap simply becomes small enough to ignore.",
  ],
  [
    "Why can volume of distribution be larger than the body?",
    "Because it is a ratio, not a physical space. Vd is the volume that would be required to hold the entire dose at the concentration actually measured in plasma. A drug that binds extensively to tissue leaves very little in plasma, so the denominator is small and the calculated volume becomes very large. Read as a description of where the drug sits, a high Vd means most of it is out of the bloodstream.",
  ],
  [
    "Why is dialysis ineffective for drugs with a high Vd?",
    "Dialysis filters blood, and a drug with a high volume of distribution is mostly not in the blood — it is bound in tissue. Clearing the plasma compartment therefore removes only a small fraction of the total amount in the body, and tissue stores refill the plasma afterwards. Drugs confined largely to plasma are the ones dialysis removes efficiently.",
  ],
  [
    "How are half-life, clearance and volume of distribution related?",
    "Half-life is not independent of the other two: t½ = 0.693 × Vd ÷ Cl. This explains apparent contradictions. A drug with poor clearance can still have a short half-life if its Vd is small, and a drug with excellent clearance can have a long half-life if it is extensively distributed, because clearance can only act on the fraction currently in plasma.",
  ],
  [
    "Should a loading dose be reduced in renal impairment?",
    "Generally not. The loading dose fills the volume of distribution, which renal impairment does not meaningfully change, so the same loading dose is needed to reach the target concentration. What changes is clearance, so the maintenance dose or the dosing interval is adjusted instead. Reducing the loading dose only delays reaching a therapeutic level.",
  ],
  [
    "What is the difference between clearance and the elimination rate constant?",
    "Clearance is a volume of plasma cleared per unit time and is what sets the maintenance dose. The elimination rate constant k is the fraction of drug removed per unit time and is what sets half-life and the shape of the concentration curve. They are linked by Cl = k × Vd, so knowing any two gives the third.",
  ],
  [
    "How does bioavailability change the dose?",
    "Bioavailability F is the fraction of an administered dose that reaches systemic circulation, and both dose equations divide by it. Intravenous administration has F of 1. Any other route has less, because of incomplete absorption and first-pass metabolism, so an equivalent oral dose has to be larger. Halving F doubles the oral dose needed for the same exposure.",
  ],
  [
    "When do these formulas stop applying?",
    "When elimination is saturated. These equations assume first-order kinetics, where a constant fraction is removed per unit time. Under zero-order kinetics a constant amount is removed instead and half-life is no longer a fixed number. The warning sign is a small dose increase producing a disproportionately large rise in measured concentration — at that point extrapolation with these formulas will underestimate the next level.",
  ],
];

/* ─────────────────────────────────────────
   Main Calculator Page
───────────────────────────────────────── */
export default function PharmacokineticsCalculator() {
  const types = [
    "Half-Life",
    "Elimination Rate Constant",
    "Volume of Distribution",
    "Clearance",
    "Loading Dose",
    "Maintenance Dose",
  ] as const;
  const [mode, setMode] = useState<(typeof types)[number]>("Half-Life");
  const [order, setOrder] = useState<"First Order" | "Zero Order">(
    "First Order",
  );
  const [orderOpen, setOrderOpen] = useState(false);

  const [k, setK] = useState("");
  const [c0, setC0] = useState("");
  const [k0, setK0] = useState("");
  const [halfLife, setHalfLife] = useState("");
  const [c0Elim, setC0Elim] = useState("");
  const [cFinal, setCFinal] = useState("");
  const [tElim, setTElim] = useState("");
  const [amount, setAmount] = useState("");
  const [cp, setCp] = useState("");
  const [kCl, setKCl] = useState("");
  const [vd, setVd] = useState("");
  const [k0Cl, setK0Cl] = useState("");
  const [cCl, setCCl] = useState("");
  const [vdLD, setVdLD] = useState("");
  const [cpLD, setCpLD] = useState("");
  const [fLD, setFLD] = useState("");
  const [clMD, setClMD] = useState("");
  const [cpMD, setCpMD] = useState("");
  const [tau, setTau] = useState("");
  const [fMD, setFMD] = useState("");

  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };
  const [result, setResult] = useState<string | null>(null);
  const [panelResult, setPanelResult] = useState<PKResult | null>(null);

  const orderModes = ["Half-Life", "Elimination Rate Constant", "Clearance"];
  const hasOrder = orderModes.includes(mode);

  const handleClear = () => {
    setOrder("First Order");
    setOrderOpen(false);
    setK("");
    setC0("");
    setK0("");
    setHalfLife("");
    setC0Elim("");
    setCFinal("");
    setTElim("");
    setAmount("");
    setCp("");
    setKCl("");
    setVd("");
    setK0Cl("");
    setCCl("");
    setVdLD("");
    setCpLD("");
    setFLD("");
    setClMD("");
    setCpMD("");
    setTau("");
    setFMD("");
    setResult(null);
    setPanelResult(null);
  };

  const calculate = () => {
    try {
      let res = "";
      switch (mode) {
        case "Half-Life": {
          if (order === "First Order") {
            const kVal = Number(k);
            if (!kVal)
              return setResult("Enter a valid elimination rate constant (k)");
            const t = 0.693 / kVal;
            res = `${t.toFixed(4)} hr`;
          } else {
            const c0Val = Number(c0);
            const k0Val = Number(k0);
            if (!c0Val || !k0Val)
              return setResult("Enter valid values for C₀ and K₀");
            const t = c0Val / (2 * k0Val);
            res = `${t.toFixed(4)} hr`;
          }
          break;
        }
        case "Elimination Rate Constant": {
          if (order === "First Order") {
            const hl = Number(halfLife);
            if (!hl) return setResult("Enter a valid half-life value");
            const kVal = 0.693 / hl;
            res = `${kVal.toFixed(4)} hr⁻¹`;
          } else {
            const c0Val = Number(c0Elim);
            const cVal = Number(cFinal);
            const tVal = Number(tElim);
            if (!c0Val || !cVal || !tVal)
              return setResult("Enter valid values for C₀, C, and Time");
            const k0Val = (c0Val - cVal) / tVal;
            res = `${k0Val.toFixed(4)} mg/L/hr`;
          }
          break;
        }
        case "Volume of Distribution": {
          const aVal = Number(amount);
          const cpVal = Number(cp);
          if (!aVal || !cpVal)
            return setResult(
              "Enter valid values for Drug Amount and Plasma Concentration",
            );
          const vdVal = aVal / cpVal;
          res = `${vdVal.toFixed(4)} L`;
          break;
        }
        case "Clearance": {
          if (order === "First Order") {
            const kVal = Number(kCl);
            const vdVal = Number(vd);
            if (!kVal || !vdVal)
              return setResult("Enter valid values for k and Vd");
            const cl = kVal * vdVal;
            res = `${cl.toFixed(4)} L/hr`;
          } else {
            const k0Val = Number(k0Cl);
            const cVal = Number(cCl);
            if (!k0Val || !cVal)
              return setResult("Enter valid values for K₀ and C");
            const cl = k0Val / cVal;
            res = `${cl.toFixed(4)} L/hr`;
          }
          break;
        }
        case "Loading Dose": {
          const vdVal = Number(vdLD);
          const cpVal = Number(cpLD);
          const fVal = Number(fLD);
          if (!vdVal || !cpVal || !fVal)
            return setResult(
              "Enter valid values for Vd, Cp, and Bioavailability",
            );
          const ld = (vdVal * cpVal) / fVal;
          res = `${ld.toFixed(4)} mg`;
          break;
        }
        case "Maintenance Dose": {
          const clVal = Number(clMD);
          const cpVal = Number(cpMD);
          const tauVal = Number(tau);
          const fVal = Number(fMD);
          if (!clVal || !cpVal || !tauVal || !fVal)
            return setResult("Enter valid values for all fields");
          const md = (clVal * cpVal * tauVal) / fVal;
          res = `${md.toFixed(4)} mg`;
          break;
        }
        default:
          setResult("Select a valid calculation type");
          return;
      }
      setResult(res);
    } catch {
      setResult("Error in calculation");
    }
  };

  useEffect(() => {
    try {
      if (mode === "Half-Life") {
        if (order === "First Order") {
          const kVal = Number(k);
          if (!kVal || kVal <= 0) {
            setPanelResult(null);
            return;
          }
          const t = 0.693 / kVal;
          if (!isFinite(t) || t <= 0) {
            setPanelResult(null);
            return;
          }
          const scaleMax = 48;
          setPanelResult({
            mode,
            value: t,
            unit: "hr",
            ratio: Math.min(t / scaleMax, 1),
            scaleMax,
            scaleLabel: "half-life vs. typical drug range (hours)",
          });
        } else {
          const c0Val = Number(c0);
          const k0Val = Number(k0);
          if (!c0Val || c0Val <= 0 || !k0Val || k0Val <= 0) {
            setPanelResult(null);
            return;
          }
          const t = c0Val / (2 * k0Val);
          if (!isFinite(t) || t <= 0) {
            setPanelResult(null);
            return;
          }
          const scaleMax = 48;
          setPanelResult({
            mode,
            value: t,
            unit: "hr",
            ratio: Math.min(t / scaleMax, 1),
            scaleMax,
            scaleLabel: "half-life vs. typical drug range (hours)",
          });
        }
      } else if (mode === "Elimination Rate Constant") {
        if (order === "First Order") {
          const hl = Number(halfLife);
          if (!hl || hl <= 0) {
            setPanelResult(null);
            return;
          }
          const kVal = 0.693 / hl;
          if (!isFinite(kVal) || kVal <= 0) {
            setPanelResult(null);
            return;
          }
          const scaleMax = 1;
          setPanelResult({
            mode,
            value: kVal,
            unit: "hr⁻¹",
            ratio: Math.min(kVal / scaleMax, 1),
            scaleMax,
            scaleLabel: "elimination rate vs. typical range (hr⁻¹)",
          });
        } else {
          const c0Val = Number(c0Elim);
          const cVal = Number(cFinal);
          const tVal = Number(tElim);
          if (
            !c0Val ||
            c0Val <= 0 ||
            !cVal ||
            cVal <= 0 ||
            !tVal ||
            tVal <= 0
          ) {
            setPanelResult(null);
            return;
          }
          const k0Val = (c0Val - cVal) / tVal;
          if (!isFinite(k0Val) || k0Val <= 0) {
            setPanelResult(null);
            return;
          }
          const scaleMax = 25;
          setPanelResult({
            mode,
            value: k0Val,
            unit: "mg/L/hr",
            ratio: Math.min(k0Val / scaleMax, 1),
            scaleMax,
            scaleLabel: "elimination rate vs. typical range (mg/L/hr)",
          });
        }
      } else if (mode === "Volume of Distribution") {
        const aVal = Number(amount);
        const cpVal = Number(cp);
        if (!aVal || aVal <= 0 || !cpVal || cpVal <= 0) {
          setPanelResult(null);
          return;
        }
        const vdVal = aVal / cpVal;
        if (!isFinite(vdVal) || vdVal <= 0) {
          setPanelResult(null);
          return;
        }
        const scaleMax = 200;
        setPanelResult({
          mode,
          value: vdVal,
          unit: "L",
          ratio: Math.min(vdVal / scaleMax, 1),
          scaleMax,
          scaleLabel:
            "Vd vs. typical range — plasma (low) to tissue-bound (high)",
        });
      } else if (mode === "Clearance") {
        if (order === "First Order") {
          const kVal = Number(kCl);
          const vdVal = Number(vd);
          if (!kVal || kVal <= 0 || !vdVal || vdVal <= 0) {
            setPanelResult(null);
            return;
          }
          const cl = kVal * vdVal;
          if (!isFinite(cl) || cl <= 0) {
            setPanelResult(null);
            return;
          }
          const scaleMax = 20;
          setPanelResult({
            mode,
            value: cl,
            unit: "L/hr",
            ratio: Math.min(cl / scaleMax, 1),
            scaleMax,
            scaleLabel: "clearance vs. typical range (L/hr)",
          });
        } else {
          const k0Val = Number(k0Cl);
          const cVal = Number(cCl);
          if (!k0Val || k0Val <= 0 || !cVal || cVal <= 0) {
            setPanelResult(null);
            return;
          }
          const cl = k0Val / cVal;
          if (!isFinite(cl) || cl <= 0) {
            setPanelResult(null);
            return;
          }
          const scaleMax = 20;
          setPanelResult({
            mode,
            value: cl,
            unit: "L/hr",
            ratio: Math.min(cl / scaleMax, 1),
            scaleMax,
            scaleLabel: "clearance vs. typical range (L/hr)",
          });
        }
      } else if (mode === "Loading Dose") {
        const vdVal = Number(vdLD);
        const cpVal = Number(cpLD);
        const fVal = Number(fLD);
        if (
          !vdVal ||
          vdVal <= 0 ||
          !cpVal ||
          cpVal <= 0 ||
          !fVal ||
          fVal <= 0
        ) {
          setPanelResult(null);
          return;
        }
        const ld = (vdVal * cpVal) / fVal;
        if (!isFinite(ld) || ld <= 0) {
          setPanelResult(null);
          return;
        }
        const scaleMax = 1500;
        setPanelResult({
          mode,
          value: ld,
          unit: "mg",
          ratio: Math.min(ld / scaleMax, 1),
          scaleMax,
          scaleLabel: "loading dose vs. typical range (mg)",
        });
      } else if (mode === "Maintenance Dose") {
        const clVal = Number(clMD);
        const cpVal = Number(cpMD);
        const tauVal = Number(tau);
        const fVal = Number(fMD);
        if (
          !clVal ||
          clVal <= 0 ||
          !cpVal ||
          cpVal <= 0 ||
          !tauVal ||
          tauVal <= 0 ||
          !fVal ||
          fVal <= 0
        ) {
          setPanelResult(null);
          return;
        }
        const md = (clVal * cpVal * tauVal) / fVal;
        if (!isFinite(md) || md <= 0) {
          setPanelResult(null);
          return;
        }
        const scaleMax = 1000;
        setPanelResult({
          mode,
          value: md,
          unit: "mg",
          ratio: Math.min(md / scaleMax, 1),
          scaleMax,
          scaleLabel: "maintenance dose vs. typical range (mg)",
        });
      }
    } catch {
      setPanelResult(null);
    }
  }, [
    mode,
    order,
    k,
    c0,
    k0,
    halfLife,
    c0Elim,
    cFinal,
    tElim,
    amount,
    cp,
    kCl,
    vd,
    k0Cl,
    cCl,
    vdLD,
    cpLD,
    fLD,
    clMD,
    cpMD,
    tau,
    fMD,
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
        <h1>Pharmacokinetics Calculator — Half-Life, Vd, Clearance</h1>

        <p>
          Calculate half-life, elimination rate constant, volume of
          distribution, clearance, loading dose, and maintenance dose — with
          full support for both first order and zero order kinetics. Built for
          pharmacists, physicians, nurses, and pharmacy students.
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
                onClick={() => {
                  setMode(t);
                  setResult(null);
                  setOrder("First Order");
                }}
                style={{
                  flex: "1 1 45%",
                  minWidth: "130px",
                  textAlign: "center",
                  padding: "10px",
                  borderRadius: "2px",
                  border:
                    mode === t ? "2px solid #dededea1" : "1px solid #ececec6b",
                  background: "#1F9FB8",
                  cursor: "pointer",
                  fontWeight: mode === t ? 600 : 400,
                  fontSize: "14px",
                }}
              >
                {t}
              </div>
            ))}
          </div>

          {hasOrder && (
            <>
              <p
                style={{
                  marginTop: "10px",
                  marginBottom: "5px",
                  fontWeight: 600,
                  color: "white",
                }}
              >
                Select Kinetic Order
              </p>
              <div
                className="modern-dropdown"
                onClick={() => setOrderOpen(!orderOpen)}
                style={{ width: "100%", marginBottom: "10px" }}
              >
                {order}
                <span className="dropdown-indicator">▼</span>
                {orderOpen && (
                  <ul className="dropdown-list">
                    <li
                      onClick={() => {
                        setOrder("First Order");
                        setOrderOpen(false);
                      }}
                    >
                      First Order
                    </li>
                    <li
                      onClick={() => {
                        setOrder("Zero Order");
                        setOrderOpen(false);
                      }}
                    >
                      Zero Order
                    </li>
                  </ul>
                )}
              </div>
            </>
          )}

          {mode === "Half-Life" && order === "First Order" && (
            <input
              className="calc-input white-bg"
              type="number"
              placeholder="Elimination Rate Constant k (hr⁻¹)"
              value={k}
              onChange={(e) => setK(e.target.value)}
            />
          )}
          {mode === "Half-Life" && order === "Zero Order" && (
            <>
              <input
                className="calc-input white-bg"
                type="number"
                placeholder="Initial Concentration C₀ (mg/L)"
                value={c0}
                onChange={(e) => setC0(e.target.value)}
              />
              <input
                className="calc-input white-bg"
                type="number"
                placeholder="Zero Order Rate Constant K₀ (mg/L/hr)"
                value={k0}
                onChange={(e) => setK0(e.target.value)}
              />
            </>
          )}
          {mode === "Elimination Rate Constant" && order === "First Order" && (
            <input
              className="calc-input white-bg"
              type="number"
              placeholder="Half-Life t½ (hr)"
              value={halfLife}
              onChange={(e) => setHalfLife(e.target.value)}
            />
          )}
          {mode === "Elimination Rate Constant" && order === "Zero Order" && (
            <>
              <input
                className="calc-input white-bg"
                type="number"
                placeholder="Initial Concentration C₀ (mg/L)"
                value={c0Elim}
                onChange={(e) => setC0Elim(e.target.value)}
              />
              <input
                className="calc-input white-bg"
                type="number"
                placeholder="Final Concentration C (mg/L)"
                value={cFinal}
                onChange={(e) => setCFinal(e.target.value)}
              />
              <input
                className="calc-input white-bg"
                type="number"
                placeholder="Time (hr)"
                value={tElim}
                onChange={(e) => setTElim(e.target.value)}
              />
            </>
          )}
          {mode === "Volume of Distribution" && (
            <>
              <input
                className="calc-input white-bg"
                type="number"
                placeholder="Amount of Drug in Body (mg)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <input
                className="calc-input white-bg"
                type="number"
                placeholder="Plasma Drug Concentration Cp (mg/L)"
                value={cp}
                onChange={(e) => setCp(e.target.value)}
              />
            </>
          )}
          {mode === "Clearance" && order === "First Order" && (
            <>
              <input
                className="calc-input white-bg"
                type="number"
                placeholder="Elimination Rate Constant k (hr⁻¹)"
                value={kCl}
                onChange={(e) => setKCl(e.target.value)}
              />
              <input
                className="calc-input white-bg"
                type="number"
                placeholder="Volume of Distribution Vd (L)"
                value={vd}
                onChange={(e) => setVd(e.target.value)}
              />
            </>
          )}
          {mode === "Clearance" && order === "Zero Order" && (
            <>
              <input
                className="calc-input white-bg"
                type="number"
                placeholder="Zero Order Rate Constant K₀ (mg/hr)"
                value={k0Cl}
                onChange={(e) => setK0Cl(e.target.value)}
              />
              <input
                className="calc-input white-bg"
                type="number"
                placeholder="Drug Concentration C (mg/L)"
                value={cCl}
                onChange={(e) => setCCl(e.target.value)}
              />
            </>
          )}
          {mode === "Loading Dose" && (
            <>
              <input
                className="calc-input white-bg"
                type="number"
                placeholder="Volume of Distribution Vd (L)"
                value={vdLD}
                onChange={(e) => setVdLD(e.target.value)}
              />
              <input
                className="calc-input white-bg"
                type="number"
                placeholder="Desired Plasma Concentration Cp (mg/L)"
                value={cpLD}
                onChange={(e) => setCpLD(e.target.value)}
              />
              <input
                className="calc-input white-bg"
                type="number"
                placeholder="Bioavailability F (e.g. 0.5 for 50%)"
                value={fLD}
                onChange={(e) => setFLD(e.target.value)}
              />
            </>
          )}
          {mode === "Maintenance Dose" && (
            <>
              <input
                className="calc-input white-bg"
                type="number"
                placeholder="Clearance Cl (L/hr)"
                value={clMD}
                onChange={(e) => setClMD(e.target.value)}
              />
              <input
                className="calc-input white-bg"
                type="number"
                placeholder="Target Plasma Concentration Cp (mg/L)"
                value={cpMD}
                onChange={(e) => setCpMD(e.target.value)}
              />
              <input
                className="calc-input white-bg"
                type="number"
                placeholder="Dosing Interval τ (hr)"
                value={tau}
                onChange={(e) => setTau(e.target.value)}
              />
              <input
                className="calc-input white-bg"
                type="number"
                placeholder="Bioavailability F (use 1 for IV)"
                value={fMD}
                onChange={(e) => setFMD(e.target.value)}
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
          <PKResultPanel result={panelResult} />
        </div>

        {/* ---- SEO CONTENT ---- */}

        <h2>Half-Life Is the Parameter Everything Else Hangs Off</h2>
        <p>
          Of the six quantities this calculator handles, half-life is the one
          most people arrive looking for, and it is also the one that answers
          the largest number of practical questions. How long until the drug
          works. How long until it has gone. How often it needs to be given.
          Whether a level taken this morning tells you anything useful.
        </p>
        <p>
          Half-life is the time for the plasma concentration to fall by half. In
          first-order kinetics that interval is constant regardless of where you
          start, which is the property that makes the whole framework useful.
        </p>
        <pre>t½ = 0.693 ÷ k</pre>
        <p>
          The 0.693 is the natural logarithm of 2 and appears wherever
          exponential decay is halved. If you know the elimination rate constant
          k, you have the half-life; if you know the half-life, you have k.
        </p>

        <h3>Getting Half-Life From Two Measured Levels</h3>
        <p>
          In practice half-life is often not given — it is derived from two
          concentrations taken a known time apart:
        </p>
        <pre>
          k = (ln C₁ − ln C₂) ÷ (t₂ − t₁){"\n"}t½ = 0.693 ÷ k
        </pre>
        <p>
          A level of 18 mg/L falling to 6 mg/L over eight hours gives ln 18 =
          2.890, ln 6 = 1.792, so k = (2.890 − 1.792) ÷ 8 = 0.137 per hour, and
          t½ = 0.693 ÷ 0.137 = 5.1 hours.
        </p>
        <p>
          Both samples must be drawn in the elimination phase for this to hold.
          A level taken while the drug is still distributing out of the
          bloodstream into tissue falls for a reason that has nothing to do with
          elimination, and a half-life calculated from it will be far too short.
          This is the single most common source of a nonsensical result.
        </p>

        <h2>Why Five Half-Lives Keeps Coming Up</h2>
        <p>
          The same figure governs both directions: accumulation towards steady
          state on repeated dosing, and washout after stopping. Each half-life
          closes half the remaining gap.
        </p>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Half-lives elapsed</th>
                <th>Percentage of steady state reached</th>
                <th>Percentage remaining after stopping</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>50%</td>
                <td>50%</td>
              </tr>
              <tr>
                <td>2</td>
                <td>75%</td>
                <td>25%</td>
              </tr>
              <tr>
                <td>3</td>
                <td>87.5%</td>
                <td>12.5%</td>
              </tr>
              <tr>
                <td>4</td>
                <td>93.75%</td>
                <td>6.25%</td>
              </tr>
              <tr>
                <td>5</td>
                <td>96.9%</td>
                <td>3.1%</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          Five half-lives is a convention rather than a threshold — it is simply
          where the remaining gap becomes small enough to ignore for most
          purposes. Nothing changes at that point.
        </p>
        <p>
          The practical consequences are worth spelling out. A drug with a
          six-hour half-life reaches steady state inside about thirty hours, so
          a level drawn on day two is meaningful. A drug with a half-life
          measured in weeks will not be at steady state for months, which means
          a level checked a fortnight in is still on the way up, and dose
          decisions made from it will systematically under-dose the patient. The
          same arithmetic explains why a drug stopped for a suspected adverse
          effect may take days to clear, and why an interacting drug started
          today may not show its full effect until next week.
        </p>

        <h2>Volume of Distribution Is Not a Volume</h2>
        <p>
          Vd is the parameter that causes the most confusion, because its name
          suggests a physical space and it is not one.
        </p>
        <pre>Vd = Dose ÷ Plasma concentration</pre>
        <p>
          It is the volume that <em>would</em> be needed to hold the whole dose
          at the concentration actually measured in plasma. If a drug leaves the
          bloodstream and binds extensively to tissue, very little remains in
          plasma to be measured, the denominator is small, and the calculated Vd
          becomes enormous — larger than the body, which is the clue that it is a
          ratio rather than a compartment.
        </p>
        <p>
          Read that way, Vd tells you where the drug is:
        </p>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Vd is roughly</th>
                <th>Interpretation</th>
                <th>Consequence</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Small (a few litres)</td>
                <td>Drug largely confined to plasma, often protein-bound</td>
                <td>Small loading doses; readily removed by dialysis</td>
              </tr>
              <tr>
                <td>Around total body water</td>
                <td>Distributes through body fluid without much binding</td>
                <td>Loading dose scales with body water, not total mass</td>
              </tr>
              <tr>
                <td>Very large</td>
                <td>Extensively bound in tissue, little left in plasma</td>
                <td>
                  Large loading doses required; dialysis removes almost nothing
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          That last row is why dialysis is ineffective for some overdoses. If
          the drug is sitting in tissue rather than circulating, filtering the
          blood filters a compartment that holds hardly any of it.
        </p>

        <h2>Clearance Sets the Maintenance Dose</h2>
        <p>
          Clearance is the volume of plasma completely cleared of drug per unit
          time. It is the parameter that determines how much drug has to be
          replaced to hold a concentration steady.
        </p>
        <pre>Cl = k × Vd</pre>
        <p>
          The relationship between the three parameters is the most useful thing
          on this page. Half-life is not an independent property — it is what
          falls out of clearance and volume of distribution together:
        </p>
        <pre>t½ = 0.693 × Vd ÷ Cl</pre>
        <p>
          This explains results that otherwise look contradictory. A drug with
          poor clearance can still have a short half-life if its Vd is small. A
          drug with excellent clearance can have a very long half-life if it is
          extensively distributed into tissue, because clearance can only act on
          the fraction currently in plasma. Half-life alone therefore says little
          about how efficiently the body is eliminating a drug.
        </p>

        <h2>Loading and Maintenance Answer Different Questions</h2>
        <p>
          The two dose calculations use different parameters because they solve
          different problems. The loading dose fills the distribution space; the
          maintenance dose replaces what is cleared.
        </p>
        <pre>
          Loading dose = (Target concentration × Vd) ÷ F{"\n"}Maintenance dose =
          (Target concentration × Cl × Dosing interval) ÷ F
        </pre>
        <p>
          Notice that the loading dose depends on Vd and not at all on clearance,
          while the maintenance dose depends on clearance and not at all on Vd.
          A patient with impaired renal function needs the same loading dose as
          anyone else — their distribution space has not changed — but a reduced
          maintenance dose, because the drug they are given now leaves more
          slowly. Reducing the loading dose in renal impairment is a common error
          that simply delays reaching a therapeutic concentration.
        </p>
        <p>
          F is bioavailability, the fraction of an administered dose reaching
          systemic circulation. It is 1 for intravenous administration and less
          for every other route. Dividing by F is what converts an intravenous
          dose into the larger oral dose that produces equivalent exposure.
        </p>

        <h2>When First-Order Assumptions Break</h2>
        <p>
          Everything above assumes first-order kinetics, where a constant
          fraction of drug is eliminated per unit time and the elimination
          machinery is nowhere near saturated. Most drugs at therapeutic
          concentrations behave this way.
        </p>
        <p>
          Zero-order kinetics is what happens when the enzymes are saturated: a
          constant <em>amount</em> is eliminated per unit time rather than a
          constant fraction, and half-life ceases to be a fixed number at all.
          Alcohol is the familiar example. The clinically dangerous cases are
          drugs that behave in first-order fashion through most of their
          therapeutic range and cross into saturation near the top of it — a
          modest dose increase then produces a disproportionate rise in
          concentration rather than a proportional one.
        </p>
        <p>
          A practical signal is worth watching for: if a small dose increase
          produces a much larger rise in measured level than expected, the
          assumption of first-order kinetics is probably no longer safe, and
          extrapolating with these formulas will underestimate the next
          concentration.
        </p>

        <h2>What Renal Impairment Actually Changes</h2>
        <p>
          Impaired renal function reduces clearance for renally eliminated
          drugs. Vd is largely unaffected. Since half-life is 0.693 × Vd ÷ Cl,
          a fall in clearance with unchanged Vd lengthens half-life
          proportionally, and time to steady state lengthens with it.
        </p>
        <p>
          Two adjustments follow, and they are not equivalent. Reducing the dose
          while keeping the interval lowers both peak and trough. Extending the
          interval while keeping the dose preserves the peak and lowers the
          trough. For drugs whose effect depends on achieving a high peak, the
          second is preferred; for drugs where toxicity tracks the trough,
          extending the interval is what gives the concentration time to fall.
          Which applies is a property of the drug.
        </p>
        <p>
          For the arithmetic of turning a calculated dose into an administered
          one, see the{" "}
          <Link href="/dose-calculator/" className="my-link">
            dosage calculator
          </Link>{" "}
          for weight-based orders and the{" "}
          <Link href="/iv-calculator/" className="my-link">
            IV calculator
          </Link>{" "}
          for infusion rates. The{" "}
          <Link href="/pharmacodynamics-calculator/" className="my-link">
            pharmacodynamics calculator
          </Link>{" "}
          covers the other half of the relationship — what the drug does once it
          is there.
        </p>
        <h2>Pharmacokinetics Questions, Worked Through</h2>

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

      {/* ── SIDEBAR ── */}
      <aside className="sidebar">
        <div className="cr-desktop-slot">
          <PKResultPanel result={panelResult} />
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
              <Link href="/iv-calculator/" className="my-link">
                IV Calculator
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
