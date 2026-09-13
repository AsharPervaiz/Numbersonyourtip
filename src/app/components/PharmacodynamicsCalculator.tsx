"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import ReviewedBy from "./ReviewedBy";

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
    q: "What is the difference between potency and efficacy?",
    a: "Potency is about how much drug is needed and is measured by EC50 or ED50 — a lower value means the curve sits further left and less drug achieves a given effect. Efficacy is about the ceiling and is measured by Emax — how large the maximum achievable effect is, however much you give. They are independent: a drug can be highly potent with low efficacy, meaning tiny doses do something that never amounts to much. Clinically, efficacy usually decides whether a drug is worth using; potency mostly decides the tablet size.",
  },
  {
    q: "What does EC50 actually mean?",
    a: "It is the concentration producing half the maximum effect, which places it at the midpoint of the rising part of the concentration-effect curve. Substituting C = EC50 into the Emax equation gives exactly Emax ÷ 2, which is the definition restated algebraically. A lower EC50 means a more potent drug, and comparisons are only meaningful between drugs producing the same effect by a comparable mechanism.",
  },
  {
    q: "Why does doubling the dose sometimes add no benefit?",
    a: "Because of the shape of the curve. In the Emax model, once concentration is well above EC50 the denominator is dominated by concentration and effect approaches the plateau, so further increases achieve almost nothing. The mechanisms producing side effects have their own separate curves and may still be climbing steeply at that point, which is why pushing a dose past adequate response tends to buy toxicity rather than efficacy.",
  },
  {
    q: "What is the difference between ED50, TD50 and LD50?",
    a: "They are the same measure applied to three different endpoints — therapeutic effect, defined toxicity, and lethality. The 50 refers to the proportion of the population, not the proportion of effect: an ED50 is the dose at which half the individuals respond, not the dose at which everyone gets half an effect. LD50 is a preclinical animal toxicology measure rather than a clinical figure.",
  },
  {
    q: "What counts as a good therapeutic index?",
    a: "A larger TD50 ÷ ED50 ratio means a wider gap between the dose that helps and the dose that harms, so a value around 100 offers considerable margin while one near 2 offers almost none. But the index compares two midpoints and ignores how steeply the curves rise, so two drugs with the same index are not necessarily equally forgiving, and a very steep toxicity curve can make a respectable-looking index misleading.",
  },
  {
    q: "Does a high therapeutic index mean a drug is safe?",
    a: "No. The index describes the relationship between dose and one defined toxic endpoint in a population. Allergic reactions, idiosyncratic responses and drug interactions are not dose-related in that sense and fall entirely outside what it measures. Both figures are also population averages, so an individual patient may sit far from either midpoint — which is why narrow-index drugs are managed with concentration monitoring rather than by trusting the ratio.",
  },
  {
    q: "How does a partial agonist differ from a full agonist?",
    a: "A partial agonist binds the same receptor but plateaus at a lower maximum effect no matter how much is present, so its ceiling is below the full agonist's regardless of potency. This produces a result students often find counter-intuitive: in the presence of a full agonist, a partial agonist can behave as an antagonist, because it occupies receptors while producing less effect than the drug it displaced.",
  },
  {
    q: "What does a competitive antagonist do to the curve?",
    a: "It shifts the agonist's concentration-effect curve to the right without lowering the plateau. More agonist is needed to achieve any given effect, but the maximum achievable effect is unchanged because enough agonist can still outcompete the antagonist. That rightward shift with an intact ceiling is the signature of competitive antagonism.",
  },
  {
    q: "How is absolute bioavailability calculated?",
    a: "Compare the area under the concentration-time curve for the route in question against the intravenous route, correcting for any difference in dose: F = (AUC oral ÷ AUC IV) × (Dose IV ÷ Dose oral). Intravenous is the reference because none of the dose is lost. Relative bioavailability compares two non-intravenous formulations instead and underpins bioequivalence testing for generic products.",
  },
  {
    q: "Why is pharmacodynamics taught alongside pharmacokinetics?",
    a: "Because each answers half the question. Pharmacokinetics describes what the body does to the drug and predicts what concentration a dose will produce. Pharmacodynamics describes what the drug does to the body and predicts what that concentration will achieve. A dosing regimen needs both: the right concentration is a pharmacokinetic result, and knowing which concentration is right is a pharmacodynamic one.",
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

        <h1>Pharmacodynamics Calculator — EC50, Emax, Therapeutic Index</h1>

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
        </div>

        <div className="cr-mobile-slot">
          <PDResultPanel result={panelResult} />
        </div>

        {/* ─────────── SEO CONTENT ─────────── */}

        <h2>One Curve Underneath All of It</h2>
        <p>
          Almost every pharmacodynamic quantity is a description of the same
          picture: a graph of drug concentration against the effect it produces.
          Plotted against the logarithm of concentration, that relationship
          takes an S shape — little effect at low concentrations, a steep middle
          section where small increases produce large changes, and a plateau
          where adding more drug achieves nothing further.
        </p>
        <p>
          Once you can see that curve, the parameters stop being a list to
          memorise and become features of it:
        </p>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Parameter</th>
                <th>Where it lives on the curve</th>
                <th>What it tells you</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>EC50</td>
                <td>The concentration at the midpoint of the rise</td>
                <td>How much drug is needed — its potency</td>
              </tr>
              <tr>
                <td>Emax</td>
                <td>The height of the plateau</td>
                <td>How much effect is achievable — its efficacy</td>
              </tr>
              <tr>
                <td>Slope of the middle</td>
                <td>Steepness of the rise</td>
                <td>
                  How sharply effect changes for a small concentration change
                </td>
              </tr>
              <tr>
                <td>ED50, TD50, LD50</td>
                <td>
                  Midpoints of three separate curves for three different effects
                </td>
                <td>
                  Where benefit, toxicity and lethality each become likely
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          Two parameters therefore define a drug&apos;s basic pharmacodynamic
          character: how far along the axis the curve sits, and how high it
          rises. They are independent of one another, which is where most
          confusion in this topic originates.
        </p>

        <h2>Potency and Efficacy Are Not the Same Question</h2>
        <p>
          These two are conflated constantly in ordinary speech and separated
          rigorously in pharmacology, and the distinction is worth getting
          exactly right because it appears in almost every exam on the subject.
        </p>
        <p>
          <strong>Potency</strong> is about dose. A more potent drug achieves a
          given effect at a lower concentration — its curve sits further left.
          It is measured by EC50 or ED50, and a lower value means greater
          potency.
        </p>
        <p>
          <strong>Efficacy</strong> is about ceiling. A drug with greater
          efficacy produces a larger maximum effect, however much of it you give
          — its curve plateaus higher. It is measured by Emax.
        </p>
        <p>
          A drug can be highly potent and have low efficacy: tiny doses do
          something, but that something never amounts to much. Another can be
          weakly potent yet highly efficacious: it takes a large dose, and at
          that dose it does a great deal. Clinically, efficacy usually decides
          whether a drug is worth using at all; potency mostly decides the size
          of the tablet.
        </p>
        <p>
          Comparing potencies is only meaningful between drugs producing the
          same effect through a comparable mechanism. Comparing the EC50 of a
          painkiller with that of an antihypertensive is arithmetic without
          meaning.
        </p>

        <h2>Reading the Emax Model</h2>
        <p>The Emax equation is the algebraic form of the curve:</p>
        <pre>Effect = (Emax × C) ÷ (EC50 + C)</pre>
        <p>
          Substituting C = EC50 gives Effect = Emax ÷ 2, which is the definition
          of EC50 restated: the concentration producing half the maximum effect.
        </p>
        <p>
          The equation carries a consequence with real clinical weight. Once
          concentration is well above EC50, the denominator is dominated by C
          and the fraction approaches one, so effect approaches Emax and stops
          responding to further increases. Doubling the dose at that point adds
          essentially no benefit — while the mechanisms producing side effects,
          which have their own separate curves, may still be climbing steeply.
        </p>
        <p>
          This is the pharmacological reason that pushing a dose past the point
          of adequate response tends to buy toxicity rather than efficacy.
        </p>

        <h2>Three Doses, Three Different Populations</h2>
        <p>
          ED50, TD50 and LD50 are structurally identical measures applied to
          different endpoints, and the shared &quot;50&quot; refers to the
          proportion of a population, not to a proportion of effect.
        </p>
        <ul className="custom-list">
          <li>
            <strong>ED50</strong> — the dose producing the desired therapeutic
            effect in half the population tested.
          </li>
          <li>
            <strong>TD50</strong> — the dose producing a defined toxic effect in
            half the population.
          </li>
          <li>
            <strong>LD50</strong> — the dose that is lethal in half the animals
            tested, a preclinical toxicology measure rather than a clinical one.
          </li>
        </ul>
        <p>
          The population framing matters. An ED50 does not mean each individual
          gets half an effect; it means half the individuals respond. Everything
          derived from these figures inherits that population basis, which is
          precisely why they cannot be applied to a single patient in front of
          you.
        </p>

        <h2>What a Therapeutic Index Actually Buys You</h2>
        <pre>Therapeutic index = TD50 ÷ ED50</pre>
        <p>
          A larger ratio means a wider gap between the dose that helps and the
          dose that harms. A drug with a TI of 100 has considerable margin; one
          with a TI near 2 has almost none, and small errors in dose, absorption
          or clearance can cross from therapy into toxicity.
        </p>
        <p>Three qualifications keep the number in proportion.</p>
        <p>
          First, the index compares two midpoints and says nothing about the
          curves&apos; steepness. If the toxicity curve rises very sharply, a
          respectable-looking index can still describe a drug where a small
          overshoot produces sudden harm. Two drugs with the same TI are not
          necessarily equally forgiving.
        </p>
        <p>
          Second, both figures are population averages. Individual variation in
          absorption, protein binding, clearance and receptor sensitivity means
          a particular patient may sit far from either midpoint, which is why
          narrow-index drugs are managed with concentration monitoring rather
          than by trusting the ratio.
        </p>
        <p>
          Third, a high therapeutic index is not a synonym for safety. It
          addresses the relationship between dose and one defined toxic
          endpoint. Allergic reactions, idiosyncratic responses and drug
          interactions are not dose-related in this sense and sit entirely
          outside what the index describes.
        </p>

        <h2>Agonists, Partial Agonists and Antagonists on the Same Axes</h2>
        <p>
          The curve also distinguishes the main receptor behaviours without
          needing separate definitions.
        </p>
        <p>
          A <strong>full agonist</strong> produces the maximum response the
          system can generate — its curve plateaus at the top. A{" "}
          <strong>partial agonist</strong> binds the same receptor but plateaus
          lower no matter how much is present, so it has a ceiling below the
          full agonist&apos;s regardless of potency. A{" "}
          <strong>competitive antagonist</strong> produces no effect alone; its
          presence shifts an agonist&apos;s curve to the right, meaning more
          agonist is needed for the same effect, while the achievable maximum is
          unchanged.
        </p>
        <p>
          The partial agonist case has a consequence students often find
          counter-intuitive: in the presence of a full agonist, a partial
          agonist can behave as an antagonist, because it occupies receptors
          while producing less effect than the drug it displaced.
        </p>

        <h2>Where Bioavailability Fits</h2>
        <p>
          Bioavailability is a pharmacokinetic quantity, but it is calculated
          here because it sits directly between a dose and the concentration
          that produces an effect.
        </p>
        <pre>
          Absolute F = (AUC oral ÷ AUC intravenous) × (Dose IV ÷ Dose oral)
        </pre>
        <p>
          Intravenous administration is the reference because none of the dose
          is lost. Any other route loses some fraction to incomplete absorption
          and to first-pass metabolism in gut wall and liver, so oral doses are
          usually larger than their intravenous equivalents for the same
          exposure.
        </p>
        <p>
          Relative bioavailability compares two non-intravenous formulations
          rather than against an intravenous standard, and is the basis of
          bioequivalence testing for generics — the question there is not
          whether a formulation is well absorbed in absolute terms, but whether
          it behaves closely enough to the reference product.
        </p>
        <p>
          For half-life, volume of distribution, clearance and the dose
          calculations that use them, see the{" "}
          <Link href="/pharmacokinetics-calculator/" className="my-link">
            pharmacokinetics calculator
          </Link>
          . For converting a decided dose into an administered amount, the{" "}
          <Link href="/dose-calculator/" className="my-link">
            dosage calculator
          </Link>{" "}
          handles weight-based orders.
        </p>
        <h2>Pharmacodynamics Questions From the Exam Room</h2>

        {FAQ_DATA.map(({ q, a }, i) => {
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
