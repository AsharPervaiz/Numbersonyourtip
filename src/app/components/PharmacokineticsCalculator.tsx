"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

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
      <div className="single-page-padding">
        <h1>Pharmacokinetics Calculator</h1>
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

        <h2>What Is Pharmacokinetics?</h2>
        <p>
          Pharmacokinetics (PK) is the branch of pharmacology that studies what
          the body does to a drug after it is administered. It covers four
          fundamental processes — absorption, distribution, metabolism, and
          excretion — collectively known as ADME. These processes determine how
          quickly a drug reaches its target site, how long it remains active in
          the body, and how it is eventually eliminated.
        </p>
        <p>
          This free pharmacokinetics calculator covers the six core PK
          parameters used daily in clinical and academic settings: half-life,
          elimination rate constant, volume of distribution, clearance, loading
          dose, and maintenance dose — with full support for both first order
          and zero order kinetics. For the practical clinical tools that use
          these PK values — calculating actual patient doses and infusion rates
          — see our{" "}
          <Link href="/dose-calculator/" className="my-link">
            dose calculator
          </Link>{" "}
          and{" "}
          <Link href="/iv-calculator/" className="my-link">
            IV calculator
          </Link>
          .
        </p>

        <h2>PK Parameters at a Glance — Summary Table</h2>
        <p>
          The table below summarizes all six pharmacokinetic parameters this
          calculator covers, their formulas, and what each one tells you
          clinically:
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
                  Parameter
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Formula
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Unit
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Clinical Meaning
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Half-Life (t½)
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  0.693 ÷ k
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  hr
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Time for concentration to fall 50%
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Elimination Rate (k)
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  0.693 ÷ t½
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  hr⁻¹
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Fraction of drug removed per hour
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Volume of Distribution (Vd)
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  A ÷ Cp
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>L</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  How widely drug distributes into tissues
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Clearance (Cl)
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  k × Vd
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  L/hr
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Volume of plasma cleared per hour
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Loading Dose (LD)
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  (Vd × Cp) ÷ F
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  mg
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Initial dose to rapidly reach target level
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Maintenance Dose (MD)
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  (Cl × Cp × τ) ÷ F
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  mg
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Repeat dose to sustain therapeutic level
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>First Order vs Zero Order Kinetics</h2>
        <p>
          First order kinetics is the most common model. A constant fraction of
          the drug is eliminated per unit time, and the elimination rate is
          proportional to plasma concentration. As concentration falls, so does
          the rate of removal — producing an exponential decline in drug levels.
        </p>
        <p>
          Zero order kinetics occurs when elimination pathways become saturated.
          A constant amount of drug is removed per unit time regardless of
          concentration, leading to a linear decline. This model carries a
          higher risk of toxic accumulation because small dose increases can
          produce disproportionately large rises in plasma levels. Classic
          examples include ethanol, phenytoin at high doses, and aspirin in
          overdose.
        </p>

        <h2>Pharmacokinetic Formulas — Complete Reference with Examples</h2>

        <h3>1. Half-Life (t½)</h3>
        <p>
          Half-life is the time required for plasma concentration to decrease by
          50%. It determines dosing frequency, time to steady state
          (approximately 5 half-lives), and how long a drug remains active after
          discontinuation.
        </p>
        <h4>First Order</h4>
        <p>
          <strong>Formula:</strong> t½ = 0.693 ÷ k
        </p>
        <p>
          <strong>Example:</strong> If k = 0.2 hr⁻¹ → t½ = 0.693 ÷ 0.2 ={" "}
          <strong>3.46 hours</strong>
        </p>
        <h4>Zero Order</h4>
        <p>
          <strong>Formula:</strong> t½ = C₀ ÷ (2 × K₀)
        </p>
        <p>
          <strong>Example:</strong> If C₀ = 100 mg/L, K₀ = 10 mg/L/hr → t½ = 100
          ÷ 20 = <strong>5 hours</strong>
        </p>

        <h3>2. Elimination Rate Constant (k)</h3>
        <p>
          The elimination rate constant describes the fraction of drug removed
          from the body per unit time. It is inversely related to half-life and
          represents the slope of the log-linear concentration–time curve.
        </p>
        <h4>First Order</h4>
        <p>
          <strong>Formula:</strong> k = 0.693 ÷ t½
        </p>
        <p>
          <strong>Example:</strong> If t½ = 6 hr → k = 0.693 ÷ 6 ={" "}
          <strong>0.115 hr⁻¹</strong>
        </p>
        <h4>Zero Order</h4>
        <p>
          <strong>Formula:</strong> k₀ = (C₀ − C) ÷ t
        </p>
        <p>
          <strong>Example:</strong> C₀ = 100 mg/L, C = 60 mg/L, t = 4 hr → k₀ =
          40 ÷ 4 = <strong>10 mg/L/hr</strong>
        </p>

        <h3>3. Volume of Distribution (Vd)</h3>
        <p>
          Volume of distribution is a theoretical volume that relates the total
          amount of drug in the body to its measured plasma concentration. A
          high Vd indicates extensive tissue binding; a low Vd suggests the drug
          largely remains in plasma.
        </p>
        <p>
          <strong>Formula:</strong> Vd = A ÷ Cp
        </p>
        <p>
          <strong>Example:</strong> 500 mg administered, Cp = 10 mg/L → Vd ={" "}
          <strong>50 L</strong>
        </p>

        <h3>4. Clearance (Cl)</h3>
        <p>
          Clearance is the volume of plasma completely cleared of drug per unit
          time. It is the primary parameter for calculating maintenance doses
          and is directly affected by renal and hepatic function.
        </p>
        <h4>First Order</h4>
        <p>
          <strong>Formula:</strong> Cl = k × Vd
        </p>
        <p>
          <strong>Example:</strong> k = 0.1 hr⁻¹, Vd = 40 L → Cl ={" "}
          <strong>4 L/hr</strong>
        </p>
        <h4>Zero Order</h4>
        <p>
          <strong>Formula:</strong> Cl = K₀ ÷ C
        </p>
        <p>
          <strong>Example:</strong> K₀ = 20 mg/hr, C = 10 mg/L → Cl ={" "}
          <strong>2 L/hr</strong>
        </p>

        <h3>5. Loading Dose (LD)</h3>
        <p>
          A loading dose is a higher initial dose given to rapidly achieve a
          therapeutic plasma concentration. It is essential for drugs with long
          half-lives where waiting for steady state would take clinically
          unacceptable time.
        </p>
        <p>
          <strong>Formula:</strong> LD = (Vd × Cp) ÷ F
        </p>
        <p>
          <strong>Example:</strong> Vd = 30 L, Cp = 5 mg/L, F = 0.5 → LD ={" "}
          <strong>300 mg</strong>
        </p>

        <h3>6. Maintenance Dose (MD)</h3>
        <p>
          The maintenance dose replaces the amount of drug eliminated between
          doses, keeping plasma concentrations within the therapeutic window.
        </p>
        <p>
          <strong>Formula:</strong> MD = (Cl × Cp × τ) ÷ F
        </p>
        <p>
          <strong>Example:</strong> Cl = 4 L/hr, Cp = 10 mg/L, τ = 12 hr, F =
          0.8 → MD = <strong>600 mg</strong>
        </p>

        <h2>Common Drug PK Parameters — Reference Table</h2>
        <p>
          The following table provides approximate PK values for commonly
          studied and clinically monitored drugs. Use these as reference points
          when working through calculations. Values are for healthy adults and
          may differ significantly in renal or hepatic impairment.
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
                  Drug
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Half-Life
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Vd (L/kg)
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Oral F
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Kinetics
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Gentamicin
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  2–3 hr
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  0.25
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  —(IV only)
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  1st order
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Vancomycin
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  4–6 hr
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  0.7
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  —(IV only)
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  1st order
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Digoxin
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  36–48 hr
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  7.0
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  0.60–0.80
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  1st order
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Phenytoin
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  12–36 hr*
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  0.65
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  0.80–0.95
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Zero order at high C
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Lithium
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  18–24 hr
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  0.7–1.0
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  ~1.0
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  1st order
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Amiodarone
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  40–55 days
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  66
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  0.35–0.65
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  1st order
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          <em>
            *Phenytoin follows first order kinetics at low concentrations but
            switches to zero order (Michaelis-Menten saturation) at higher
            therapeutic and toxic concentrations — one of the reasons it
            requires careful therapeutic drug monitoring.
          </em>
        </p>

        <h2>Clinical Importance of Pharmacokinetic Calculations</h2>
        <p>
          Pharmacokinetic calculations are fundamental to individualizing drug
          therapy. Incorrect dosing can lead to subtherapeutic levels, treatment
          failure, or toxic accumulation. Key scenarios requiring PK-guided dose
          adjustment include:
        </p>
        <ul className="custom-list">
          <li>
            <strong>Renal impairment</strong> — reduces clearance of renally
            excreted drugs (vancomycin, gentamicin, digoxin, metformin),
            requiring dose reduction or interval extension
          </li>
          <li>
            <strong>Hepatic disease</strong> — impairs first-pass metabolism and
            hepatic clearance, increasing bioavailability and plasma levels
          </li>
          <li>
            <strong>Pediatric and geriatric dosing</strong> — body composition,
            renal function, and enzyme activity differ from standard adult
            values. Use our{" "}
            <Link href="/dose-calculator/" className="my-link">
              weight-based dose calculator
            </Link>{" "}
            as a starting point for pediatric dose estimation
          </li>
          <li>
            <strong>Obesity</strong> — alters Vd for lipophilic drugs, affecting
            loading dose calculations. Our{" "}
            <Link href="/bmi-calculator/" className="my-link">
              BMI calculator
            </Link>{" "}
            can help classify the patient's weight status
          </li>
          <li>
            <strong>Drug interactions</strong> — enzyme inducers (rifampicin)
            and inhibitors (fluconazole) directly alter clearance and half-life
            of co-administered drugs
          </li>
          <li>
            <strong>Therapeutic drug monitoring (TDM)</strong> — drugs with
            narrow therapeutic indices (lithium, aminoglycosides, cyclosporine,
            phenytoin) require regular plasma level monitoring guided by PK
            principles
          </li>
        </ul>

        <h2>How This Calculator Fits With Other Clinical Tools</h2>
        <p>
          Pharmacokinetic parameters inform the calculations performed by our
          other clinical tools:
        </p>
        <ul className="custom-list">
          <li>
            <strong>
              <Link href="/dose-calculator/" className="my-link">
                Dose Calculator
              </Link>
            </strong>{" "}
            — uses patient weight and a prescribed mg/kg rate to calculate the
            total dose in mg. The mg/kg rate itself is derived from PK studies
            of the drug.
          </li>
          <li>
            <strong>
              <Link href="/dose-stock-calculator/" className="my-link">
                Dose Stock Calculator
              </Link>
            </strong>{" "}
            — converts the mg dose into tablets or mL of liquid from available
            stock. Used after the dose is determined.
          </li>
          <li>
            <strong>
              <Link href="/iv-calculator/" className="my-link">
                IV Calculator
              </Link>
            </strong>{" "}
            — calculates infusion rate (mL/hr) and drip rate (drops/min) for IV
            delivery. The infusion rate depends on the PK-derived dose and the
            drug's concentration.
          </li>
        </ul>

        <h2>How to Use This Pharmacokinetics Calculator</h2>
        <ul className="custom-list">
          <li>
            <strong>Step 1:</strong> Select the PK parameter you want to
            calculate — half-life, elimination rate constant, Vd, clearance,
            loading dose, or maintenance dose.
          </li>
          <li>
            <strong>Step 2:</strong> Choose the kinetic model — first order or
            zero order — based on the drug's known elimination behavior.
          </li>
          <li>
            <strong>Step 3:</strong> Enter the required input values.
          </li>
          <li>
            <strong>Step 4:</strong> Click Calculate to see your result
            instantly, with a visual gauge showing where the value falls on a
            general clinical scale.
          </li>
        </ul>

        <h2>Frequently Asked Questions</h2>

        {[
          [
            "What is the difference between first order and zero order kinetics?",
            "In first order kinetics, a constant fraction of drug is eliminated per unit time and the rate depends on concentration — producing exponential decline. In zero order kinetics, a constant amount is eliminated regardless of concentration because metabolic pathways are saturated — producing linear decline. Zero order drugs (ethanol, phenytoin at high doses) carry a higher risk of toxic accumulation with small dose increases.",
          ],
          [
            "Why is volume of distribution (Vd) important in clinical practice?",
            "Vd determines the loading dose needed to achieve a target plasma concentration, predicts how long a drug remains in the body, and indicates whether a drug can be effectively removed by dialysis. Drugs with very high Vd (chloroquine, digoxin) are poorly dialyzable because most drug is bound in tissues rather than circulating in plasma.",
          ],
          [
            "When is a loading dose clinically necessary?",
            "A loading dose is used when a rapid therapeutic effect is needed and waiting 4–5 half-lives for steady state is clinically unacceptable. Common examples include digoxin in atrial fibrillation, amiodarone in arrhythmias, phenytoin in acute seizures, and vancomycin in serious gram-positive infections.",
          ],
          [
            "What does bioavailability (F) mean and how does it affect dosing?",
            "Bioavailability is the fraction of an administered dose that reaches systemic circulation unchanged. IV drugs have F = 1. Oral drugs have F less than 1 due to incomplete absorption and first-pass metabolism. If F = 0.5, you must double the oral dose to match IV exposure. F is essential for calculating accurate loading and maintenance doses for non-IV routes.",
          ],
          [
            "How many half-lives does it take to reach steady state?",
            "Approximately 5 half-lives are required to reach 97% of steady-state concentration. This applies both to accumulation during regular dosing and to elimination after stopping. For amiodarone with a half-life of 40–55 days, steady state without a loading dose would take over 6 months.",
          ],
          [
            "What is therapeutic drug monitoring (TDM)?",
            "TDM involves measuring plasma drug concentrations at specific time points and using PK calculations to individualize dosing. It is most critical for drugs with narrow therapeutic indices — vancomycin, aminoglycosides, lithium, digoxin, phenytoin, and cyclosporine — where small differences between effective and toxic concentrations require precise dose adjustment.",
          ],
          [
            "How does renal impairment affect pharmacokinetics?",
            "Renal impairment reduces clearance of renally excreted drugs, prolonging half-life and increasing accumulation risk. Drugs like gentamicin, vancomycin, metformin, and digoxin require dose reduction or interval extension based on creatinine clearance or eGFR.",
          ],
          [
            "Can this calculator be used for pharmacy board exam preparation?",
            "Yes. This calculator covers all core PK formulas tested in NAPLEX, OSCE, and university pharmacology exams — including half-life, Vd, clearance, loading dose, and maintenance dose for both kinetic orders. Use it to verify manual calculations during study.",
          ],
          [
            "What is the difference between clearance and elimination rate constant?",
            "Clearance (L/hr) is the volume of plasma cleared of drug per unit time — used to calculate maintenance doses. The elimination rate constant k (hr⁻¹) is the fraction removed per unit time — used to calculate half-life and predict concentration–time curves. They are linked by: Cl = k × Vd.",
          ],
          [
            "Is this pharmacokinetics calculator free to use?",
            "Yes, completely free with no registration required. Designed for pharmacy students, pharmacists, physicians, nurses, and clinical researchers. All calculations run locally in your browser. This tool is a reference aid — all clinical dosing decisions should be reviewed by a qualified healthcare professional.",
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
