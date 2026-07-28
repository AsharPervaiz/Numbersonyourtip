"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

/* ─────────────────────────────────────────
   Types
───────────────────────────────────────── */
interface DoseResult {
  singleDose: number;
  weightKg: number;
  dosePerKg: number;
  doseUnit: string;
}

/* ─────────────────────────────────────────
   Pure helper
───────────────────────────────────────── */
function needleDeg(ratePerKg: number): number {
  const clamped = Math.min(Math.max(ratePerKg, 0), 50);
  return -90 + (clamped / 50) * 180;
}

/* ─────────────────────────────────────────
   DoseResultPanel
───────────────────────────────────────── */
function DoseResultPanel({ result }: { result: DoseResult | null }) {
  if (!result) {
    return (
      <div className="cr-panel-placeholder">
        <div className="cr-ph-icon">
          <i className="fa-solid fa-syringe" aria-hidden="true" />
        </div>
        Enter patient weight and dose rate to see the calculated dose here.
      </div>
    );
  }

  const { singleDose, weightKg, dosePerKg, doseUnit } = result;
  const weightLabel = doseUnit === "mg/lb" ? "lb" : "kg";

  const ratePerKg = doseUnit === "mg/lb" ? dosePerKg / 0.45359237 : dosePerKg;

  const clamped = Math.min(Math.max(ratePerKg, 0), 50);
  const ratePct = 2 + (clamped / 50) * 96;

  const intensityLabel =
    ratePerKg < 2
      ? "Low"
      : ratePerKg < 10
        ? "Standard"
        : ratePerKg < 25
          ? "High"
          : "Very high";

  const intensityBadge =
    ratePerKg < 2
      ? "info"
      : ratePerKg < 10
        ? "good"
        : ratePerKg < 25
          ? "warning"
          : "danger";

  return (
    <div className="cr-panel">
      {/* Gauge + primary result */}
      <div className="cr-gauge-wrap">
        <svg
          className="cr-gauge-svg"
          width="100"
          height="60"
          viewBox="0 0 120 70"
          role="img"
          aria-label={`Dose rate gauge showing ${ratePerKg.toFixed(1)} mg/kg`}
        >
          <defs>
            <clipPath id="dose-half">
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
            strokeDasharray="12 326"
            strokeDashoffset="-163"
            clipPath="url(#dose-half)"
          />
          <circle
            cx="60"
            cy="65"
            r="52"
            fill="none"
            stroke="#97C459"
            strokeWidth="12"
            strokeDasharray="52 326"
            strokeDashoffset="-175"
            clipPath="url(#dose-half)"
          />
          <circle
            cx="60"
            cy="65"
            r="52"
            fill="none"
            stroke="#FAC775"
            strokeWidth="12"
            strokeDasharray="98 326"
            strokeDashoffset="-227"
            clipPath="url(#dose-half)"
          />
          <circle
            cx="60"
            cy="65"
            r="52"
            fill="none"
            stroke="#F09595"
            strokeWidth="12"
            strokeDasharray="164 326"
            strokeDashoffset="-325"
            clipPath="url(#dose-half)"
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
              transform: `rotate(${needleDeg(ratePerKg)}deg)`,
              transition: "transform 0.5s ease",
            }}
          />
          <circle cx="60" cy="65" r="5" fill="#111111" />
        </svg>

        <div className="cr-score-block">
          <div className="cr-score">{singleDose.toFixed(2)} mg</div>
          <div className="cr-score-label">Calculated single dose</div>
          <span className={`cr-badge ${intensityBadge}`}>
            {intensityLabel} rate
          </span>
        </div>
      </div>

      <hr className="cr-divider" />

      {/* Dose rate intensity meter */}
      <div>
        <div className="cr-bar-label">
          where this dose rate lands ({ratePerKg.toFixed(1)} mg/kg)
        </div>
        <div
          className="cr-bar-track"
          style={{
            background:
              "linear-gradient(to right, #B5D4F4 0%, #97C459 18%, #FAC775 55%, #F09595 100%)",
          }}
        >
          <div className="cr-bar-thumb" style={{ left: `${ratePct}%` }} />
        </div>
        <div className="cr-bar-ticks">
          <span>0</span>
          <span>2</span>
          <span>10</span>
          <span>25</span>
          <span>50 mg/kg</span>
        </div>
      </div>

      <hr className="cr-divider" />

      {/* Breakdown */}
      <div className="cr-metrics-grid">
        <div className="cr-metric-card">
          <div className="cr-m-label">Patient weight</div>
          <div className="cr-m-value">
            {weightKg.toFixed(1)} {weightLabel}
          </div>
          <div className="cr-m-sub">as entered</div>
        </div>
        <div className="cr-metric-card">
          <div className="cr-m-label">Dose rate</div>
          <div className="cr-m-value">
            {dosePerKg} {doseUnit}
          </div>
          <div className="cr-m-sub">per unit weight</div>
        </div>
      </div>

      <hr className="cr-divider" />

      {/* Calculation shown transparently */}
      <div>
        <div className="cr-bar-label">calculation</div>
        <div className="cr-world-note">
          {weightKg.toFixed(1)} {weightLabel} × {dosePerKg} {doseUnit} ={" "}
          <strong>{singleDose.toFixed(2)} mg</strong>
        </div>
      </div>

      <hr className="cr-divider" />

      <div className="cr-world-note" style={{ fontStyle: "italic" }}>
        <i
          className="fa-solid fa-triangle-exclamation"
          style={{ marginRight: "6px" }}
        />
        The intensity meter is a general reference only, not drug-specific. This
        is a calculated estimate — always verify against the prescribing
        physician's instructions and current drug references before
        administration.
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Main Calculator Page
───────────────────────────────────────── */
export default function DoseCalculator() {
  const [weight, setWeight] = useState("");
  const [dosePerKg, setDosePerKg] = useState("");
  const [result, setResult] = useState<number | null>(null);

  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const [unitOpen, setUnitOpen] = useState(false);
  const [doseUnit, setDoseUnit] = useState("mg/kg");

  const [panelResult, setPanelResult] = useState<DoseResult | null>(null);

  const calculateDose = () => {
    let w = Number(weight) || 0;
    const doseKg = Number(dosePerKg) || 0;

    if (doseUnit === "mg/lb") {
      w = w * 0.45359237;
    }

    const singleDose = w * doseKg;
    setResult(singleDose);
  };

  useEffect(() => {
    const wRaw = Number(weight);
    const doseKg = Number(dosePerKg);

    if (!wRaw || wRaw <= 0 || !doseKg || doseKg <= 0) {
      setPanelResult(null);
      return;
    }

    let w = wRaw;
    if (doseUnit === "mg/lb") {
      w = w * 0.45359237;
    }

    const singleDose = w * doseKg;
    if (!isFinite(singleDose) || singleDose <= 0) {
      setPanelResult(null);
      return;
    }

    setPanelResult({
      singleDose,
      weightKg: wRaw,
      dosePerKg: doseKg,
      doseUnit,
    });
  }, [weight, dosePerKg, doseUnit]);

  const handleClear = () => {
    setWeight("");
    setDosePerKg("");
    setDoseUnit("mg/kg");
    setResult(null);
    setPanelResult(null);
  };

  return (
    <div className="page-layout">
      {/* ---- MAIN CONTENT ---- */}
      <div className="single-page-padding">
        <h1>Dose Calculator — Weight-Based Medication Dosing</h1>

        <p>
          Enter the patient's body weight and the prescribed dose rate to
          calculate the exact medication dose in milligrams instantly. This
          weight-based dosing calculator supports both mg/kg and mg/lb units,
          making it suitable for pediatric, adult, and veterinary dose
          calculations.
        </p>

        <div className="calc-card single-calc">
          <input
            className="calc-input"
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
            {doseUnit || "Select Dose Unit"}
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
            className="calc-input"
            type="number"
            placeholder="Dose per unit"
            value={dosePerKg}
            onChange={(e) => setDosePerKg(e.target.value)}
            style={{ marginTop: "10px" }}
          />

          <div
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "10px",
              marginTop: "10px",
            }}
          >
            <button className="calc-button" onClick={calculateDose}>
              Calculate
            </button>
            <button className="calc-button calc-clear" onClick={handleClear}>
              Clear
            </button>
          </div>

          {result !== null && (
            <div className="calc-result">
              <p>Single Dose: {result.toFixed(2)} mg</p>
            </div>
          )}
        </div>

        {/* Mobile-only result panel */}
        <div className="cr-mobile-slot">
          <DoseResultPanel result={panelResult} />
        </div>

        {/* ---- SEO CONTENT ---- */}

        <h2>What Is a Dose Calculator?</h2>
        <p>
          A dose calculator is a clinical tool that computes the correct amount
          of medication a patient should receive based on their body weight. It
          applies the standard weight-based dosing formula used by doctors,
          nurses, pharmacists, and veterinarians to determine safe and accurate
          drug doses for adults, children, and animals.
        </p>
        <p>
          Rather than performing manual arithmetic — which carries a real risk
          of human error, especially in high-pressure clinical settings — a
          medication dose calculator provides instant, precise results in
          milligrams (mg). This matters most in pediatric dosing, where even a
          small miscalculation relative to a child's body weight can lead to
          significant under-dosing or dangerous over-dosing.
        </p>

        <h2>The Weight-Based Dosing Formula</h2>
        <p>
          This calculator applies the universally accepted weight-based dosing
          formula used in hospitals, pharmacies, and veterinary clinics
          worldwide:
        </p>
        <pre>
          Medication Dose (mg) = Patient Weight × Dose Rate (mg/kg or mg/lb)
        </pre>
        <p>
          For liquid medications, the total milligram dose is converted to
          milliliters using the drug's concentration:
        </p>
        <pre>Volume (mL) = Total Dose (mg) ÷ Concentration (mg/mL)</pre>
        <p>
          Both calculations are standard practice in clinical pharmacy,
          pediatric care, and veterinary medicine. For more advanced drug
          modeling — including half-life, clearance, and volume of distribution
          — see our{" "}
          <Link href="/pharmacokinetics-calculator/" className="my-link">
            pharmacokinetics calculator
          </Link>
          .
        </p>

        <h2>What You Need for an Accurate Dose Calculation</h2>
        <ul className="custom-list">
          <li>
            <strong>Patient Weight:</strong> The exact body weight in kilograms
            (kg) or pounds (lb). Accurate weight is the foundation of
            weight-based dosing — even a 1 to 2 kg error in a pediatric patient
            can shift the dose by 10% or more, potentially crossing the line
            between therapeutic and toxic.
          </li>
          <li>
            <strong>Dose Rate (mg/kg or mg/lb):</strong> The prescribed
            medication requirement per unit of body weight, as specified by the
            healthcare provider, drug monograph, or reference guide like the BNF
            or Micromedex.
          </li>
          <li>
            <strong>Concentration (for liquid/injectable medications):</strong>{" "}
            If you need to convert the total mg dose to mL for an oral
            suspension, injection, or infusion, you will also need the drug's
            concentration in mg/mL. For intravenous delivery specifically, pair
            this tool with our{" "}
            <Link href="/iv-calculator/" className="my-link">
              IV calculator
            </Link>{" "}
            to determine drip rates and infusion volumes.
          </li>
        </ul>

        <h2>Step-by-Step Dose Calculation Examples</h2>

        <h3>Example 1: Pediatric Oral Suspension</h3>
        <p>
          A 20 kg child is prescribed amoxicillin at 10 mg/kg. The available
          suspension is 50 mg/mL.
        </p>
        <ul className="custom-list">
          <li>
            <strong>Step 1 — Calculate total dose:</strong> 20 kg × 10 mg/kg ={" "}
            <strong>200 mg</strong>
          </li>
          <li>
            <strong>Step 2 — Convert to mL:</strong> 200 mg ÷ 50 mg/mL ={" "}
            <strong>4 mL</strong>
          </li>
        </ul>
        <p>
          The child should receive 200 mg (4 mL) of the amoxicillin suspension
          per dose.
        </p>

        <h3>Example 2: Adult Dose in mg/kg</h3>
        <p>A 75 kg adult is prescribed a medication at 5 mg/kg.</p>
        <ul className="custom-list">
          <li>
            75 kg × 5 mg/kg = <strong>375 mg</strong>
          </li>
        </ul>
        <p>
          If the medication comes in 250 mg tablets, the patient needs 1.5
          tablets — a situation where a{" "}
          <Link href="/dose-stock-calculator/" className="my-link">
            dose stock calculator
          </Link>{" "}
          helps determine whether to round to the nearest available tablet
          strength or use a liquid formulation instead.
        </p>

        <h3>Example 3: Veterinary Dose in mg/lb</h3>
        <p>A 44 lb dog is prescribed a medication at 2.5 mg/lb.</p>
        <ul className="custom-list">
          <li>
            44 lb × 2.5 mg/lb = <strong>110 mg</strong>
          </li>
        </ul>
        <p>
          Many veterinary drug references list dose rates in mg/lb rather than
          mg/kg. This calculator supports both units — select the correct one
          from the dropdown before entering the dose rate.
        </p>

        <h2>Common Dose Rates — Quick Reference Table</h2>
        <p>
          The table below lists typical adult and pediatric dose ranges for
          commonly prescribed medications. These are general ranges for
          reference only — always confirm with the current prescribing
          information or a clinical pharmacist.
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
                  Medication
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Common Dose Rate
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Typical Use
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Amoxicillin
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  25–50 mg/kg/day (divided doses)
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Bacterial infections (pediatric)
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Ibuprofen
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  5–10 mg/kg per dose
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Pain relief, fever (pediatric)
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Paracetamol (Acetaminophen)
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  10–15 mg/kg per dose
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Pain relief, fever (pediatric/adult)
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Gentamicin
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  3–7 mg/kg/day
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Serious gram-negative infections
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Metronidazole
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  7.5 mg/kg per dose
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Anaerobic infections
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Vancomycin
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  15–20 mg/kg per dose
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  MRSA and serious gram-positive infections
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          <em>
            These dose rates are general references and may vary by indication,
            patient population, renal function, and institutional protocol.
            Always verify against current drug references before administering.
          </em>
        </p>

        <h2>Where Weight-Based Dose Calculators Are Used</h2>
        <p>
          This dosage calculator serves clinicians and caregivers across a wide
          range of settings:
        </p>
        <ul className="custom-list">
          <li>
            <strong>Pediatric wards and clinics</strong> — calculating safe
            doses for neonates, infants, and children where weight-based
            accuracy is non-negotiable
          </li>
          <li>
            <strong>Veterinary practice</strong> — computing drug doses for
            dogs, cats, horses, and livestock using mg/kg or mg/lb
          </li>
          <li>
            <strong>Hospital pharmacies</strong> — verifying prescribed doses
            against standard mg/kg references before dispensing
          </li>
          <li>
            <strong>Emergency departments and ICUs</strong> — rapid calculation
            when time-critical decisions must be made, such as in resuscitation
            or trauma
          </li>
          <li>
            <strong>Home care and parent guidance</strong> — helping parents
            calculate the correct dose of over-the-counter medications like
            paracetamol or ibuprofen for their child's weight
          </li>
          <li>
            <strong>Nursing and pharmacy education</strong> — practicing dosage
            calculations for clinical exams and board preparation
          </li>
          <li>
            <strong>mg to mL conversion</strong> — converting milligram doses to
            milliliter volumes for oral liquids, injections, and IV infusions.
            For IV-specific calculations, use our{" "}
            <Link href="/iv-calculator/" className="my-link">
              IV drip rate calculator
            </Link>
          </li>
        </ul>

        <h2>Why Patient Weight Matters So Much in Dosing</h2>
        <p>
          Weight-based dosing is the clinical standard for most medications
          because a patient's body weight directly affects how a drug is
          absorbed, distributed, metabolized, and excreted — the four processes
          studied in{" "}
          <Link href="/pharmacokinetics-calculator/" className="my-link">
            pharmacokinetics
          </Link>
          . Administering a fixed dose regardless of weight risks toxicity in
          smaller patients or sub-therapeutic drug levels in larger ones.
        </p>
        <p>This is especially critical in certain patient populations:</p>
        <ul className="custom-list">
          <li>
            <strong>Pediatric patients</strong> — a child's smaller body mass
            means the therapeutic window is narrower, and even small dosing
            errors can cause serious harm
          </li>
          <li>
            <strong>Chemotherapy</strong> — oncology drugs are often dosed per
            kg or per body surface area (BSA), where precision is literally a
            matter of life and death
          </li>
          <li>
            <strong>Antibiotics like gentamicin</strong> — effective treatment
            depends on maintaining correct peak and trough blood levels, which
            are directly tied to the mg/kg dose administered
          </li>
          <li>
            <strong>Anesthetics and sedatives</strong> — dosing must be tightly
            matched to body weight to avoid respiratory depression or inadequate
            sedation
          </li>
          <li>
            <strong>Obese patients</strong> — some drugs are dosed on actual
            body weight, others on ideal or adjusted body weight. Knowing which
            method applies to a specific drug is essential. Our{" "}
            <Link href="/bmi-calculator/" className="my-link">
              BMI calculator
            </Link>{" "}
            can help assess the patient's weight category as part of the
            clinical picture
          </li>
        </ul>

        <h2>
          Dose Calculator vs. Dose Stock Calculator — What Is the Difference?
        </h2>
        <p>
          These two tools serve different steps in the same clinical workflow,
          and understanding the distinction prevents confusion:
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
                  Feature
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Dose Calculator
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Dose Stock Calculator
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Purpose
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Calculate total dose in mg
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Calculate volume/tablets to administer
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Inputs
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Patient weight + dose rate (mg/kg)
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Total dose (mg) + stock concentration
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Output
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Total mg to give
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  mL to draw up or tablets to give
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  When to use
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Step 1 — determine the dose
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Step 2 — determine the volume
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          In clinical practice, both steps are performed together: first
          calculate the dose in mg using this tool, then use the{" "}
          <Link href="/dose-stock-calculator/" className="my-link">
            dose stock calculator
          </Link>{" "}
          to determine the exact volume or number of tablets to administer from
          the available stock.
        </p>

        <h2>Common Dosing Errors and How to Avoid Them</h2>
        <ul className="custom-list">
          <li>
            <strong>Using an outdated weight.</strong> Patient weight can change
            significantly over days in a hospital setting, especially in
            pediatric and ICU patients. Always use the most recent weight
            recorded in the patient's chart.
          </li>
          <li>
            <strong>Confusing mg/kg with mg/lb.</strong> A dose rate of 10 mg/kg
            is very different from 10 mg/lb — the mg/lb dose is less than half
            the mg/kg dose for the same patient. Double-check which unit the
            prescriber intended.
          </li>
          <li>
            <strong>Mixing up total daily dose with single dose.</strong> Some
            references list the daily dose (e.g., "50 mg/kg/day divided q8h"),
            while others list the per-dose amount. Dividing incorrectly can
            result in triple dosing or one-third dosing.
          </li>
          <li>
            <strong>Decimal point errors.</strong> Misplacing a decimal turns a
            1.5 mg dose into 15 mg — a 10x overdose. Calculators like this one
            eliminate manual decimal math entirely.
          </li>
          <li>
            <strong>Not accounting for dose adjustments.</strong> Patients with
            renal or hepatic impairment often require reduced doses. Calculator
            output should always be cross-referenced with the patient's clinical
            status.
          </li>
        </ul>

        <h2>Important Safety Notes</h2>
        <ul className="custom-list">
          <li>
            This medication dose calculator provides a calculated estimate based
            on the values entered — always verify against the prescribing
            physician's instructions and current drug references (BNF,
            Micromedex, Lexicomp, or equivalent).
          </li>
          <li>
            Consult a licensed healthcare professional before administering any
            medication, especially for pediatric, neonatal, geriatric, or
            renally-impaired patients whose dosing requirements may differ from
            standard rates.
          </li>
          <li>
            Use the patient's most recent and accurately measured body weight.
            Estimated or self-reported weights can introduce clinically
            significant dosing errors, particularly in weight-based regimens.
          </li>
          <li>
            For intravenous medications, always confirm infusion rates using a
            dedicated{" "}
            <Link href="/iv-calculator/" className="my-link">
              IV calculator
            </Link>{" "}
            in addition to the total dose calculation.
          </li>
          <li>
            This tool is designed to support — not replace — professional
            clinical judgment. All results should be independently verified
            before administration.
          </li>
        </ul>

        <h2>Benefits of Using This Dose Calculator</h2>
        <ul className="custom-list">
          <li>
            <strong>Instant mg results</strong> — no manual math, formula
            lookup, or mental arithmetic required
          </li>
          <li>
            <strong>Supports mg/kg and mg/lb</strong> — handles both metric and
            imperial weight inputs with automatic conversion
          </li>
          <li>
            <strong>Works for humans and animals</strong> — pediatric, adult,
            and veterinary dosing in a single tool
          </li>
          <li>
            <strong>Reduces dosing errors</strong> — eliminates arithmetic
            mistakes that are especially dangerous in high-stakes clinical
            environments
          </li>
          <li>
            <strong>Visual dose-rate indicator</strong> — the intensity gauge
            provides an at-a-glance sense of where the entered dose rate falls
            on a general low-to-high scale
          </li>
          <li>
            <strong>Free and mobile-friendly</strong> — accessible from any
            device at the bedside, in the pharmacy, or in the field
          </li>
        </ul>

        <h2>Frequently Asked Questions About Medication Dose Calculation</h2>

        <div className="faq-item">
          <h3 onClick={() => toggleFAQ(0)}>
            How do I calculate a medication dose by weight?
            <i
              className={`fa-solid fa-chevron-down ${openFAQ === 0 ? "rotate" : ""}`}
            ></i>
          </h3>
          {openFAQ === 0 && (
            <p>
              Multiply the patient's body weight (in kg or lb) by the prescribed
              dose rate (in mg/kg or mg/lb). For example, a 30 kg child
              prescribed 5 mg/kg should receive 30 × 5 = 150 mg. Enter these
              values into the calculator above for an instant result. For liquid
              medications, also divide by the concentration in mg/mL to get the
              volume.
            </p>
          )}
        </div>

        <div className="faq-item">
          <h3 onClick={() => toggleFAQ(1)}>
            Can this dosing calculator be used for children?
            <i
              className={`fa-solid fa-chevron-down ${openFAQ === 1 ? "rotate" : ""}`}
            ></i>
          </h3>
          {openFAQ === 1 && (
            <p>
              Yes. Pediatric medication dosing is almost always weight-based,
              making a dose calculator essential for safe pediatric care. Enter
              the child's weight in kg and the prescribed mg/kg dose to get the
              correct total dose. Always confirm the result with the prescribing
              physician or pharmacist, and never exceed the maximum recommended
              adult dose for that drug.
            </p>
          )}
        </div>

        <div className="faq-item">
          <h3 onClick={() => toggleFAQ(2)}>
            Can I use this for veterinary dose calculations?
            <i
              className={`fa-solid fa-chevron-down ${openFAQ === 2 ? "rotate" : ""}`}
            ></i>
          </h3>
          {openFAQ === 2 && (
            <p>
              Yes. Veterinarians and vet technicians regularly use mg/kg or
              mg/lb dosing to calculate drug doses for dogs, cats, horses, and
              livestock. This calculator supports both weight units. Always use
              a species-specific drug reference to confirm the correct dose rate
              — human and animal dose ranges can differ dramatically for the
              same drug.
            </p>
          )}
        </div>

        <div className="faq-item">
          <h3 onClick={() => toggleFAQ(3)}>
            How do I convert mg to mL for a liquid medication?
            <i
              className={`fa-solid fa-chevron-down ${openFAQ === 3 ? "rotate" : ""}`}
            ></i>
          </h3>
          {openFAQ === 3 && (
            <p>
              Divide the total dose in milligrams by the drug's concentration in
              mg/mL. For example, if the total dose is 200 mg and the suspension
              is 50 mg/mL, then 200 ÷ 50 = 4 mL. For intravenous medications,
              use our{" "}
              <Link href="/iv-calculator/" className="my-link">
                IV calculator
              </Link>{" "}
              to determine the correct infusion rate and volume.
            </p>
          )}
        </div>

        <div className="faq-item">
          <h3 onClick={() => toggleFAQ(4)}>
            What is the difference between a dose calculator and a dose stock
            calculator?
            <i
              className={`fa-solid fa-chevron-down ${openFAQ === 4 ? "rotate" : ""}`}
            ></i>
          </h3>
          {openFAQ === 4 && (
            <p>
              A dose calculator tells you the total amount of drug needed in mg.
              A{" "}
              <Link href="/dose-stock-calculator/" className="my-link">
                dose stock calculator
              </Link>{" "}
              then tells you how much of the available stock solution or tablet
              strength to draw up or administer to deliver that dose. Both steps
              are performed together in clinical practice.
            </p>
          )}
        </div>

        <div className="faq-item">
          <h3 onClick={() => toggleFAQ(5)}>
            What if I only know the total mg dose, not the mg/kg rate?
            <i
              className={`fa-solid fa-chevron-down ${openFAQ === 5 ? "rotate" : ""}`}
            ></i>
          </h3>
          {openFAQ === 5 && (
            <p>
              Divide the total dose by the patient's weight to find the rate.
              For example, if a 25 kg patient is prescribed 500 mg, the dose
              rate is 500 ÷ 25 = 20 mg/kg. You can then verify this rate against
              the recommended therapeutic range in a current clinical drug
              reference.
            </p>
          )}
        </div>

        <div className="faq-item">
          <h3 onClick={() => toggleFAQ(6)}>
            Is this dose calculator suitable for professional medical use?
            <i
              className={`fa-solid fa-chevron-down ${openFAQ === 6 ? "rotate" : ""}`}
            ></i>
          </h3>
          {openFAQ === 6 && (
            <p>
              This tool is designed to support — not replace — professional
              clinical judgment. It is suitable for use by doctors, nurses,
              pharmacists, paramedics, and veterinary professionals as a quick
              calculation aid. All results should be verified against current
              prescribing guidelines, the patient's clinical status, and
              institutional protocols before administering any medication.
            </p>
          )}
        </div>

        <div className="faq-item">
          <h3 onClick={() => toggleFAQ(7)}>
            What is the difference between mg/kg and mg/lb?
            <i
              className={`fa-solid fa-chevron-down ${openFAQ === 7 ? "rotate" : ""}`}
            ></i>
          </h3>
          {openFAQ === 7 && (
            <p>
              mg/kg is milligrams of drug per kilogram of body weight. mg/lb is
              milligrams per pound. Since 1 kg equals approximately 2.2 lb, a
              dose rate in mg/kg is roughly 2.2 times higher than the equivalent
              mg/lb rate. For example, 10 mg/kg is approximately equal to 4.5
              mg/lb. Always confirm which unit the prescriber intended, as using
              the wrong one results in a dose that is either double or half the
              correct amount.
            </p>
          )}
        </div>

        <div className="faq-item">
          <h3 onClick={() => toggleFAQ(8)}>
            Should obese patients be dosed on actual or ideal body weight?
            <i
              className={`fa-solid fa-chevron-down ${openFAQ === 8 ? "rotate" : ""}`}
            ></i>
          </h3>
          {openFAQ === 8 && (
            <p>
              It depends on the drug. Some medications — particularly lipophilic
              drugs — are dosed on actual body weight. Others, especially
              certain antibiotics and anesthetics, use ideal body weight or
              adjusted body weight to avoid overdosing. There is no universal
              rule; each drug's prescribing information specifies which weight
              metric to use. When in doubt, consult a clinical pharmacist.
            </p>
          )}
        </div>
      </div>

      {/* ---- SIDEBAR ---- */}
      <aside className="sidebar">
        <div className="cr-desktop-slot">
          <DoseResultPanel result={panelResult} />
        </div>

        <div className="sidebar-box">
          <p style={{ fontSize: "20px", fontWeight: 600 }}>
            Related Calculators
          </p>
          <ul style={{ listStyle: "none", padding: 0 }}>
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
