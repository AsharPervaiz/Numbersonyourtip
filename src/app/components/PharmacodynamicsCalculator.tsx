"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

/* ─────────────────────────────────────────
   Types
───────────────────────────────────────── */
type Mode = "Therapeutic Index" | "Emax Model" | "Bioavailability";
type BioSub = "Absolute" | "Relative";
interface PDResult {
  mode: string;
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
   PDResultPanel
───────────────────────────────────────── */
function PDResultPanel({ result }: { result: PDResult | null }) {
  if (!result) {
    return (
      <div className="cr-panel-placeholder">
        <div className="cr-ph-icon">
          <i className="fa-solid fa-pills" aria-hidden="true" />
        </div>
        Enter your PD values to see the calculated result here.
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
            <clipPath id="pd-half">
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
            clipPath="url(#pd-half)"
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
            clipPath="url(#pd-half)"
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
            clipPath="url(#pd-half)"
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
            clipPath="url(#pd-half)"
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
        This meter is a general reference, not drug-specific. PD parameters vary
        widely by drug — always verify against current clinical references and
        patient-specific data.
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   FAQ Data (single source for accordion + schema)
───────────────────────────────────────── */
const FAQ_DATA = [
  {
    q: "What is the difference between pharmacokinetics and pharmacodynamics?",
    a: "Pharmacokinetics (PK) describes what the body does to a drug — absorption, distribution, metabolism, and excretion. Pharmacodynamics (PD) describes what the drug does to the body — the relationship between drug concentration and effect. In practice, PK tells you what plasma levels a dose will produce; PD tells you what those plasma levels will actually do. Together they form PK/PD modeling, used to optimize dosing regimens.",
  },
  {
    q: "What is a good therapeutic index value?",
    a: "There is no universal cutoff, but drugs with a TI above 10 are generally considered safe without intensive monitoring. Drugs with a TI below 2 (lithium, digoxin, warfarin, phenytoin, aminoglycosides) are classified as narrow therapeutic index drugs and require regular plasma level monitoring and careful dose individualization.",
  },
  {
    q: "What does EC50 mean in the Emax model?",
    a: "EC50 is the drug concentration that produces exactly 50% of the maximum possible effect (Emax). It is a measure of drug potency — a lower EC50 means the drug achieves significant effect at a lower concentration. Two drugs may have the same Emax but very different EC50 values, making one far more potent than the other.",
  },
  {
    q: "What is the difference between ED50, TD50, and LD50?",
    a: "ED50 is the dose that produces the desired therapeutic effect in 50% of a population. TD50 is the dose that causes toxicity in 50% of a population. LD50 is the dose that is lethal to 50% of a test population — used primarily in preclinical animal studies, not in humans. The therapeutic index uses TD50/ED50 in clinical contexts, while LD50/ED50 is used in preclinical safety profiling.",
  },
  {
    q: "Why is bioavailability important for oral drugs?",
    a: "Bioavailability determines how much of an oral dose actually reaches the bloodstream to produce an effect. If a drug has 25% oral bioavailability, you need to give 4× the IV dose orally to achieve the same systemic exposure. Without accounting for bioavailability, patients may receive subtherapeutic doses or toxic doses if absorption changes unexpectedly.",
  },
  {
    q: "What causes low oral bioavailability?",
    a: "Low oral bioavailability results from poor gastrointestinal absorption, chemical degradation in stomach acid, efflux transporters pumping drug out of gut cells, or extensive first-pass metabolism in the gut wall and liver. Drugs like nitroglycerin and lidocaine have such high first-pass metabolism that oral routes are clinically impractical at standard doses.",
  },
  {
    q: "What is bioequivalence and how does it relate to relative bioavailability?",
    a: "Bioequivalence means two formulations produce statistically equivalent drug exposure (AUC) and peak concentration (Cmax) within a regulatory acceptance window. Most agencies require 80–125% of the reference product. Relative bioavailability is the ratio used to assess this. Generic drugs must demonstrate bioequivalence before market authorization.",
  },
  {
    q: "What is the difference between efficacy and potency?",
    a: "Efficacy is the maximum effect a drug can produce — represented by Emax. Potency is the concentration required to produce a given effect — represented by EC50. A drug can be highly potent (very low EC50) but have low efficacy (low Emax), or vice versa. For clinical dosing, both matter.",
  },
  {
    q: "Can this calculator be used for pharmacy board exam preparation?",
    a: "Yes. This pharmacodynamics calculator covers the core PD formulas tested in NAPLEX, OSCE, and university pharmacology exams — therapeutic index, Emax model, and absolute and relative bioavailability. Use it to verify manual calculations and check your understanding during study sessions.",
  },
  {
    q: "Is this pharmacodynamics calculator free to use?",
    a: "Yes, completely free with no registration required. Designed for pharmacy students, pharmacists, physicians, nurses, and clinical researchers. All calculations run locally in your browser. This tool is a reference aid — all clinical dosing decisions should be reviewed by a qualified healthcare professional.",
  },
];

/* ─────────────────────────────────────────
   Main Calculator Page
───────────────────────────────────────── */
export default function PharmacodynamicsCalculator() {
  const types = ["Therapeutic Index", "Emax Model", "Bioavailability"] as const;
  const [mode, setMode] = useState<(typeof types)[number]>("Therapeutic Index");
  const [bioSub, setBioSub] = useState<BioSub>("Absolute");
  const [bioSubOpen, setBioSubOpen] = useState(false);
  const [td50, setTd50] = useState("");
  const [ed50, setEd50] = useState("");
  const [emax, setEmax] = useState("");
  const [conc, setConc] = useState("");
  const [ec50, setEc50] = useState("");
  const [aucOral, setAucOral] = useState("");
  const [aucIV, setAucIV] = useState("");
  const [doseIV, setDoseIV] = useState("");
  const [doseOral, setDoseOral] = useState("");
  const [aucTest, setAucTest] = useState("");
  const [aucRef, setAucRef] = useState("");
  const [doseRef, setDoseRef] = useState("");
  const [doseTest, setDoseTest] = useState("");
  const [sameDoses, setSameDoses] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };
  const [result, setResult] = useState<string | null>(null);
  const [panelResult, setPanelResult] = useState<PDResult | null>(null);

  const handleClear = () => {
    setBioSub("Absolute");
    setBioSubOpen(false);
    setTd50("");
    setEd50("");
    setEmax("");
    setConc("");
    setEc50("");
    setAucOral("");
    setAucIV("");
    setDoseIV("");
    setDoseOral("");
    setAucTest("");
    setAucRef("");
    setDoseRef("");
    setDoseTest("");
    setSameDoses(false);
    setResult(null);
    setPanelResult(null);
  };

  const calculate = () => {
    try {
      let res = "";
      switch (mode) {
        case "Therapeutic Index": {
          const td = Number(td50);
          const ed = Number(ed50);
          if (!td || !ed) return setResult("Enter valid TD50 and ED50 values");
          const ti = td / ed;
          res = `TI = ${ti.toFixed(4)}`;
          break;
        }
        case "Emax Model": {
          const emaxVal = Number(emax);
          const cVal = Number(conc);
          const ec50Val = Number(ec50);
          if (!emaxVal || !cVal || !ec50Val)
            return setResult("Enter valid values for Emax, C, and EC50");
          const e = (emaxVal * cVal) / (ec50Val + cVal);
          res = `E = ${e.toFixed(4)}`;
          break;
        }
        case "Bioavailability": {
          if (bioSub === "Absolute") {
            const aOral = Number(aucOral);
            const aIV = Number(aucIV);
            const dIV = Number(doseIV);
            const dOral = Number(doseOral);
            if (!aOral || !aIV || !dIV || !dOral)
              return setResult("Enter valid values for all fields");
            const f = (aOral / aIV) * (dIV / dOral) * 100;
            res = `F = ${f.toFixed(2)}%`;
          } else {
            const aTest = Number(aucTest);
            const aRef = Number(aucRef);
            if (!aTest || !aRef) return setResult("Enter valid AUC values");
            if (sameDoses) {
              const fr = (aTest / aRef) * 100;
              res = `Fr = ${fr.toFixed(2)}%`;
            } else {
              const dRef = Number(doseRef);
              const dTest = Number(doseTest);
              if (!dRef || !dTest)
                return setResult(
                  "Enter valid dose values or enable same doses",
                );
              const fr = (aTest / aRef) * (dRef / dTest) * 100;
              res = `Fr = ${fr.toFixed(2)}%`;
            }
          }
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
      if (mode === "Therapeutic Index") {
        const td = Number(td50);
        const ed = Number(ed50);
        if (!td || td <= 0 || !ed || ed <= 0) {
          setPanelResult(null);
          return;
        }
        const ti = td / ed;
        if (!isFinite(ti) || ti <= 0) {
          setPanelResult(null);
          return;
        }
        const scaleMax = 20;
        setPanelResult({
          mode,
          value: ti,
          unit: "(ratio)",
          ratio: Math.min(ti / scaleMax, 1),
          scaleMax,
          scaleLabel: "therapeutic index vs. safety margin scale",
        });
      } else if (mode === "Emax Model") {
        const emaxVal = Number(emax);
        const cVal = Number(conc);
        const ec50Val = Number(ec50);
        if (
          !emaxVal ||
          emaxVal <= 0 ||
          !cVal ||
          cVal <= 0 ||
          !ec50Val ||
          ec50Val <= 0
        ) {
          setPanelResult(null);
          return;
        }
        const e = (emaxVal * cVal) / (ec50Val + cVal);
        if (!isFinite(e) || e <= 0) {
          setPanelResult(null);
          return;
        }
        const scaleMax = emaxVal;
        setPanelResult({
          mode,
          value: e,
          unit: "(effect units)",
          ratio: Math.min(e / scaleMax, 1),
          scaleMax,
          scaleLabel: "drug effect vs. maximum possible effect (Emax)",
        });
      } else if (mode === "Bioavailability") {
        if (bioSub === "Absolute") {
          const aOral = Number(aucOral);
          const aIV = Number(aucIV);
          const dIV = Number(doseIV);
          const dOral = Number(doseOral);
          if (
            !aOral ||
            aOral <= 0 ||
            !aIV ||
            aIV <= 0 ||
            !dIV ||
            dIV <= 0 ||
            !dOral ||
            dOral <= 0
          ) {
            setPanelResult(null);
            return;
          }
          const f = (aOral / aIV) * (dIV / dOral) * 100;
          if (!isFinite(f) || f <= 0) {
            setPanelResult(null);
            return;
          }
          setPanelResult({
            mode: "Absolute Bioavailability",
            value: f,
            unit: "%",
            ratio: Math.min(f / 100, 1),
            scaleMax: 100,
            scaleLabel: "bioavailability vs. IV reference (0–100%)",
          });
        } else {
          const aTest = Number(aucTest);
          const aRef = Number(aucRef);
          if (!aTest || aTest <= 0 || !aRef || aRef <= 0) {
            setPanelResult(null);
            return;
          }
          let fr: number;
          if (sameDoses) {
            fr = (aTest / aRef) * 100;
          } else {
            const dRef = Number(doseRef);
            const dTest = Number(doseTest);
            if (!dRef || dRef <= 0 || !dTest || dTest <= 0) {
              setPanelResult(null);
              return;
            }
            fr = (aTest / aRef) * (dRef / dTest) * 100;
          }
          if (!isFinite(fr) || fr <= 0) {
            setPanelResult(null);
            return;
          }
          setPanelResult({
            mode: "Relative Bioavailability",
            value: fr,
            unit: "%",
            ratio: Math.min(fr / 200, 1),
            scaleMax: 200,
            scaleLabel:
              "relative bioavailability vs. reference formulation (%)",
          });
        }
      }
    } catch {
      setPanelResult(null);
    }
  }, [
    mode,
    bioSub,
    td50,
    ed50,
    emax,
    conc,
    ec50,
    aucOral,
    aucIV,
    doseIV,
    doseOral,
    aucTest,
    aucRef,
    doseRef,
    doseTest,
    sameDoses,
  ]);

  // FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_DATA.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  return (
    <div className="page-layout">
      <div className="single-page-padding">
        {/* FAQ Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />

        <h1>Free Pharmacodynamics Calculator Online</h1>
        <p>
          Calculate therapeutic index, drug effect using the Emax model, and
          absolute or relative bioavailability — the core pharmacodynamic
          parameters used in clinical pharmacology and pharmacy education.
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
                  setBioSub("Absolute");
                }}
                style={{
                  flex: "1 1 28%",
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
          {mode === "Bioavailability" && (
            <>
              <p
                style={{
                  marginTop: "10px",
                  marginBottom: "5px",
                  fontWeight: 600,
                  color: "white",
                }}
              >
                Select Bioavailability Type
              </p>
              <div
                className="modern-dropdown"
                onClick={() => setBioSubOpen(!bioSubOpen)}
                style={{ width: "100%", marginBottom: "10px" }}
              >
                {bioSub === "Absolute"
                  ? "Absolute Bioavailability (vs IV)"
                  : "Relative Bioavailability (vs Reference)"}
                <span className="dropdown-indicator">▼</span>
                {bioSubOpen && (
                  <ul className="dropdown-list">
                    <li
                      onClick={() => {
                        setBioSub("Absolute");
                        setBioSubOpen(false);
                        setResult(null);
                      }}
                    >
                      Absolute Bioavailability (vs IV)
                    </li>
                    <li
                      onClick={() => {
                        setBioSub("Relative");
                        setBioSubOpen(false);
                        setResult(null);
                      }}
                    >
                      Relative Bioavailability (vs Reference)
                    </li>
                  </ul>
                )}
              </div>
            </>
          )}
          {mode === "Therapeutic Index" && (
            <>
              <input
                className="calc-input white-bg"
                type="number"
                placeholder="TD50 — Toxic Dose in 50% of subjects (mg)"
                value={td50}
                onChange={(e) => setTd50(e.target.value)}
              />
              <input
                className="calc-input white-bg"
                type="number"
                placeholder="ED50 — Effective Dose in 50% of subjects (mg)"
                value={ed50}
                onChange={(e) => setEd50(e.target.value)}
              />
            </>
          )}
          {mode === "Emax Model" && (
            <>
              <input
                className="calc-input white-bg"
                type="number"
                placeholder="Emax — Maximum possible effect"
                value={emax}
                onChange={(e) => setEmax(e.target.value)}
              />
              <input
                className="calc-input white-bg"
                type="number"
                placeholder="C — Drug concentration (mg/ml)"
                value={conc}
                onChange={(e) => setConc(e.target.value)}
              />
              <input
                className="calc-input white-bg"
                type="number"
                placeholder="EC50 — Concentration for 50% of Emax (mg/ml)"
                value={ec50}
                onChange={(e) => setEc50(e.target.value)}
              />
            </>
          )}
          {mode === "Bioavailability" && bioSub === "Absolute" && (
            <>
              <input
                className="calc-input white-bg"
                type="number"
                placeholder="AUC oral — Area under curve (oral)"
                value={aucOral}
                onChange={(e) => setAucOral(e.target.value)}
              />
              <input
                className="calc-input white-bg"
                type="number"
                placeholder="AUC IV — Area under curve (IV)"
                value={aucIV}
                onChange={(e) => setAucIV(e.target.value)}
              />
              <input
                className="calc-input white-bg"
                type="number"
                placeholder="Dose IV (mg)"
                value={doseIV}
                onChange={(e) => setDoseIV(e.target.value)}
              />
              <input
                className="calc-input white-bg"
                type="number"
                placeholder="Dose oral (mg)"
                value={doseOral}
                onChange={(e) => setDoseOral(e.target.value)}
              />
            </>
          )}
          {mode === "Bioavailability" && bioSub === "Relative" && (
            <>
              <input
                className="calc-input white-bg"
                type="number"
                placeholder="AUC test — Area under curve (test formulation)"
                value={aucTest}
                onChange={(e) => setAucTest(e.target.value)}
              />
              <input
                className="calc-input white-bg"
                type="number"
                placeholder="AUC reference — Area under curve (reference formulation)"
                value={aucRef}
                onChange={(e) => setAucRef(e.target.value)}
              />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  margin: "8px 0",
                  color: "white",
                  fontSize: "14px",
                }}
              >
                <input
                  type="checkbox"
                  id="same-doses"
                  checked={sameDoses}
                  onChange={(e) => setSameDoses(e.target.checked)}
                  style={{ width: "16px", height: "16px", cursor: "pointer" }}
                />
                <label htmlFor="same-doses" style={{ cursor: "pointer" }}>
                  Doses are equal (skip dose correction)
                </label>
              </div>
              {!sameDoses && (
                <>
                  <input
                    className="calc-input white-bg"
                    type="number"
                    placeholder="Dose reference (mg)"
                    value={doseRef}
                    onChange={(e) => setDoseRef(e.target.value)}
                  />
                  <input
                    className="calc-input white-bg"
                    type="number"
                    placeholder="Dose test (mg)"
                    value={doseTest}
                    onChange={(e) => setDoseTest(e.target.value)}
                  />
                </>
              )}
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
          <PDResultPanel result={panelResult} />
        </div>

        {/* ─────────── SEO CONTENT ─────────── */}

        <h2>What Is Pharmacodynamics?</h2>
        <p>
          Pharmacodynamics is the branch of pharmacology that studies what a
          drug does to the body — specifically, the relationship between drug
          concentration at the site of action and the resulting biological or
          therapeutic effect. While pharmacokinetics answers "what the body does
          to the drug," pharmacodynamics answers "what the drug does to the
          body." Together, PK and PD form the complete picture of how a drug
          behaves in a patient, and PK/PD modeling is the foundation of rational
          dose optimization in modern clinical practice.
        </p>
        <p>
          This free pharmacodynamics calculator online covers the three core PD
          parameters used across clinical and academic settings: the therapeutic
          index (a drug safety measure), the Emax model (a concentration-effect
          relationship), and bioavailability (how much drug reaches the
          bloodstream). It is one of the most complete pharmacy calculators for
          students available free — covering all the pharmacodynamics formulas
          you need for coursework, board prep, and clinical practice in a single
          tool. For the PK side of the equation — half-life, clearance, volume
          of distribution, and dosing intervals — see our{" "}
          <Link href="/pharmacokinetics-calculator/" className="my-link">
            pharmacokinetics calculator
          </Link>
          .
        </p>

        <h2>PD Parameters at a Glance — Summary Table</h2>
        <p>
          The table below summarizes every pharmacodynamic parameter this
          calculator covers, including the formulas, units, and what each one
          tells you clinically:
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
                  Therapeutic Index (TI)
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  TD50 ÷ ED50
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Ratio
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Safety margin between effective and toxic dose
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Drug Effect (Emax model)
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  (Emax × C) ÷ (EC50 + C)
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Effect units
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Predicted effect at a given drug concentration
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Absolute Bioavailability (F)
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  (AUCoral ÷ AUCIV) × (DoseIV ÷ Doseoral) × 100
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>%</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Fraction of oral dose reaching systemic circulation vs IV
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Relative Bioavailability (Fr)
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  (AUCtest ÷ AUCref) × (Doseref ÷ Dosetest) × 100
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>%</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Drug exposure of one formulation compared to another
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>Pharmacodynamic Formulas — Complete Reference with Examples</h2>

        <h3>1. Therapeutic Index Calculator — TD50, ED50, and LD50</h3>
        <p>
          The therapeutic index quantifies how safe a drug is by comparing the
          dose that causes toxicity to the dose that produces the desired
          therapeutic effect. A high TI means a wide margin of safety; a low TI
          means the effective and toxic doses are dangerously close together,
          requiring careful monitoring. This makes it the most fundamental
          safety metric in pharmacodynamics.
        </p>
        <p>
          <strong>Formula:</strong> TI = TD50 ÷ ED50
        </p>
        <p>
          TD50 is the dose producing toxic effects in 50% of a population, and
          ED50 is the dose producing the desired effect in 50% of a population.
          In preclinical animal studies, the LD50 (lethal dose in 50% of
          animals) is sometimes used instead of TD50, giving TI = LD50 ÷ ED50.
          This LD50-based index provides an even starker safety picture but is
          only used in laboratory settings, not human clinical practice. This
          calculator uses the TD50/ED50 formulation appropriate for clinical
          pharmacology.
        </p>
        <h4>Example — Wide Margin (Safe Drug)</h4>
        <p>
          ED50 = 20 mg, TD50 = 200 mg → TI = 200 ÷ 20 = <strong>10</strong>. The
          toxic dose is 10 times the effective dose — a comfortable safety
          margin. Most over-the-counter analgesics have therapeutic indices in
          this range or higher.
        </p>
        <h4>Example — Narrow Margin (Dangerous Drug)</h4>
        <p>
          ED50 = 50 mg, TD50 = 60 mg → TI = 60 ÷ 50 = <strong>1.2</strong>. Very
          little difference between the effective and toxic dose. Drugs like
          warfarin, digoxin, lithium, and phenytoin fall in this category and
          require therapeutic drug monitoring with regular blood level checks.
        </p>

        <h3>2. Emax Model Calculator — Concentration-Effect Relationship</h3>
        <p>
          The Emax model describes how drug effect changes with concentration.
          As you increase the concentration, the effect rises — but only up to a
          ceiling called Emax. Beyond this point, adding more drug produces no
          additional benefit, only more risk. This sigmoidal
          concentration-effect relationship is the foundation of understanding
          both drug potency and efficacy in pharmacodynamics.
        </p>
        <p>
          <strong>Formula:</strong> E = (Emax × C) ÷ (EC50 + C)
        </p>
        <p>
          E is the predicted effect, Emax is the maximum possible effect, C is
          the current drug concentration, and EC50 is the concentration that
          produces 50% of Emax. A lower EC50 indicates a more potent drug — it
          achieves the same effect at a lower concentration.
        </p>
        <h4>Example</h4>
        <p>
          Emax = 100, C = 20 mg/ml, EC50 = 10 mg/ml → E = (100 × 20) ÷ (10 + 20)
          = 2000 ÷ 30 = <strong>66.7</strong>. The drug is producing 66.7% of
          its maximum possible effect at this concentration. Doubling the
          concentration to 40 mg/ml would give E = (100 × 40) ÷ (10 + 40) = 80 —
          only 13.3 more units of effect for twice the drug, illustrating the
          diminishing returns as you approach Emax.
        </p>

        <h3>3. Bioavailability Calculator — Absolute and Relative</h3>
        <p>
          Bioavailability is the fraction of an administered dose that reaches
          the systemic circulation unchanged. It determines how much of what you
          give a patient actually gets to the bloodstream and ultimately to the
          target site. This is why a bioavailability calculator is essential
          when switching between IV and oral dosing or when comparing brand-name
          and generic formulations.
        </p>

        <h4>Absolute Bioavailability</h4>
        <p>
          Compares drug exposure from an oral (or other non-IV) route to IV
          administration, which is the 100% reference because IV goes directly
          into the bloodstream.
        </p>
        <p>
          <strong>Formula:</strong> F = (AUCoral ÷ AUCIV) × (DoseIV ÷ Doseoral)
          × 100
        </p>
        <p>
          <strong>Example:</strong> AUCoral = 40, AUCIV = 80, DoseIV = 100 mg,
          Doseoral = 200 mg → F = (40 ÷ 80) × (100 ÷ 200) × 100 = 0.5 × 0.5 ×
          100 = <strong>25%</strong>. Only a quarter of the oral dose reached
          systemic circulation. If you need to switch this patient from IV to
          oral, you would need roughly 4× the IV dose to maintain the same drug
          exposure.
        </p>

        <h4>Relative Bioavailability</h4>
        <p>
          Compares drug exposure between two non-IV formulations — a brand name
          versus a generic, a capsule versus a suspension, or two different
          generic manufacturers. This is the basis of bioequivalence testing in
          regulatory approvals.
        </p>
        <p>
          <strong>Formula (different doses):</strong> Fr = (AUCtest ÷ AUCref) ×
          (Doseref ÷ Dosetest) × 100
        </p>
        <p>
          <strong>Formula (same doses):</strong> Fr = (AUCtest ÷ AUCref) × 100
        </p>
        <p>
          <strong>Example:</strong> Brand A AUC = 60, Brand B AUC = 40 (equal
          doses) → Fr = (60 ÷ 40) × 100 = <strong>150%</strong>. Brand A
          delivers 50% more drug exposure than Brand B at the same dose — they
          are not bioequivalent.
        </p>

        <h2>Clinical Importance of Pharmacodynamic Calculations</h2>
        <p>
          Pharmacodynamic calculations directly inform some of the most critical
          decisions in drug development, prescribing, and patient monitoring:
        </p>
        <ul className="custom-list">
          <li>
            <strong>Drug safety classification</strong> — the therapeutic index
            determines how much dosing flexibility exists. Narrow TI drugs
            (lithium, warfarin, digoxin, phenytoin, aminoglycosides) require
            therapeutic drug monitoring; wide TI drugs can be dosed more
            broadly.
          </li>
          <li>
            <strong>Dose-response optimization</strong> — the Emax model helps
            clinicians decide whether increasing a dose will yield meaningful
            additional effect or just add toxicity risk without clinical
            benefit.
          </li>
          <li>
            <strong>IV-to-oral conversions</strong> — absolute bioavailability
            calculations are essential when stepping a patient down from IV to
            oral therapy, ensuring the oral dose produces equivalent drug
            exposure. Our{" "}
            <Link href="/dose-calculator/" className="my-link">
              dose calculator
            </Link>{" "}
            can help with the resulting weight-based dose adjustments.
          </li>
          <li>
            <strong>Generic substitution decisions</strong> — relative
            bioavailability confirms whether two formulations deliver equivalent
            exposure, underpinning the 80–125% regulatory bioequivalence
            standard.
          </li>
          <li>
            <strong>First-pass metabolism assessment</strong> — low absolute
            bioavailability often signals heavy hepatic first-pass metabolism,
            which matters when liver function is impaired.
          </li>
          <li>
            <strong>Pediatric and geriatric dosing</strong> — altered body
            composition, enzyme activity, and organ function affect both drug
            effect and bioavailability differently from standard adult values.
            See our{" "}
            <Link href="/bmi-calculator/" className="my-link">
              BMI calculator
            </Link>{" "}
            for patient weight classification and our{" "}
            <Link href="/body-fat-calculator/" className="my-link">
              body fat calculator
            </Link>{" "}
            for body composition context.
          </li>
        </ul>

        <h2>How This PK/PD Calculator Fits With Other Clinical Tools</h2>
        <p>
          Pharmacodynamic parameters work hand-in-hand with the pharmacokinetic
          parameters calculated by our other tools. Together they form a
          complete PK/PD calculator suite:
        </p>
        <ul className="custom-list">
          <li>
            <strong>
              <Link href="/pharmacokinetics-calculator/" className="my-link">
                Pharmacokinetics Calculator
              </Link>
            </strong>{" "}
            — calculates half-life, clearance, volume of distribution, and
            dosing parameters. PK describes how the body processes the drug; PD
            describes what the drug does once it arrives.
          </li>
          <li>
            <strong>
              <Link href="/dose-calculator/" className="my-link">
                Dose Calculator
              </Link>
            </strong>{" "}
            — calculates weight-based doses in mg. Bioavailability from this PD
            calculator directly informs whether an oral dose needs adjustment
            relative to an IV dose.
          </li>
          <li>
            <strong>
              <Link href="/dose-stock-calculator/" className="my-link">
                Dose Stock Calculator
              </Link>
            </strong>{" "}
            — converts a calculated dose into the volume to draw from a stock
            solution.
          </li>
          <li>
            <strong>
              <Link href="/iv-calculator/" className="my-link">
                IV Calculator
              </Link>
            </strong>{" "}
            — calculates infusion rates for IV drug delivery, the route used as
            the 100% reference in absolute bioavailability calculations.
          </li>
        </ul>

        <h2>How to Use This Pharmacodynamics Calculator</h2>
        <ul className="custom-list">
          <li>
            <strong>Step 1:</strong> Select the PD parameter you want to
            calculate — Therapeutic Index, Emax Model, or Bioavailability.
          </li>
          <li>
            <strong>Step 2:</strong> For Bioavailability, choose Absolute (vs IV
            reference) or Relative (vs another formulation) from the dropdown.
          </li>
          <li>
            <strong>Step 3:</strong> Enter the required input values. The
            placeholder text in each field shows what unit is expected.
          </li>
          <li>
            <strong>Step 4:</strong> Click Calculate. The result appears below
            the inputs, and the visual gauge in the side panel shows where the
            value falls on a general clinical scale.
          </li>
        </ul>

        <h2>Frequently Asked Questions</h2>

        {FAQ_DATA.map(({ q, a }, i) => (
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
          Pharmacodynamics is where drug dosing meets patient outcomes.
          Understanding the therapeutic index tells you how safe a drug is. The
          Emax model tells you how much effect you are getting at a given
          concentration. And bioavailability tells you how much of what you
          prescribe actually reaches the bloodstream. This pharmacodynamics
          calculator puts all three formulas in one place — free, instant, and
          built specifically for pharmacy students and clinical professionals.
        </p>
        <p>
          For the complete PK/PD toolkit, pair this with our{" "}
          <Link href="/pharmacokinetics-calculator/" className="my-link">
            pharmacokinetics calculator
          </Link>{" "}
          for half-life and clearance, our{" "}
          <Link href="/dose-calculator/" className="my-link">
            dose calculator
          </Link>{" "}
          for weight-based dosing, our{" "}
          <Link href="/iv-calculator/" className="my-link">
            IV calculator
          </Link>{" "}
          for infusion rate planning, and our{" "}
          <Link href="/calorie-calculator/" className="my-link">
            calorie calculator
          </Link>{" "}
          for nutritional support in clinical settings.
        </p>
      </div>

      {/* ── SIDEBAR ── */}
      <aside className="sidebar">
        <div className="cr-desktop-slot">
          <PDResultPanel result={panelResult} />
        </div>
        <div className="sidebar-box">
          <p style={{ fontSize: "20px", fontWeight: 600 }}>
            Related Calculators
          </p>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li>
              <Link href="/pharmacokinetics-calculator/" className="my-link">
                Pharmacokinetics Calculator
              </Link>
            </li>
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
              <Link href="/body-fat-calculator/" className="my-link">
                Body Fat Calculator
              </Link>
            </li>
            <li>
              <Link href="/calorie-calculator/" className="my-link">
                Calorie Calculator
              </Link>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
