"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

/* ─────────────────────────────────────────
   Types
───────────────────────────────────────── */
interface StockResult {
  mode: "tablet" | "syrup";
  amount: number;
  requiredDose: number;
  availableDose: number;
  ratio: number;
}

/* ─────────────────────────────────────────
   Pure helper
───────────────────────────────────────── */
function needleDeg(ratio: number): number {
  const clamped = Math.min(Math.max(ratio, 0), 5);
  return -90 + (clamped / 5) * 180;
}

/* ─────────────────────────────────────────
   StockResultPanel
───────────────────────────────────────── */
function StockResultPanel({ result }: { result: StockResult | null }) {
  if (!result) {
    return (
      <div className="cr-panel-placeholder">
        <div className="cr-ph-icon">
          <i className="fa-solid fa-pills" aria-hidden="true" />
        </div>
        Enter the required and available dose to see how much to give here.
      </div>
    );
  }

  const { mode, amount, requiredDose, availableDose, ratio } = result;
  const unitLabel = mode === "tablet" ? "tablets" : "mL";

  const clamped = Math.min(Math.max(ratio, 0), 5);
  const ratioPct = 2 + (clamped / 5) * 96;

  const intensityLabel =
    ratio < 0.5
      ? "Small amount"
      : ratio <= 1.5
        ? "Standard"
        : ratio <= 3
          ? "Large amount"
          : "Very large";

  const intensityBadge =
    ratio < 0.5
      ? "info"
      : ratio <= 1.5
        ? "good"
        : ratio <= 3
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
          aria-label={`Stock gauge showing ${amount} ${unitLabel}`}
        >
          <defs>
            <clipPath id="stock-half">
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
            strokeDasharray="33 326"
            strokeDashoffset="-163"
            clipPath="url(#stock-half)"
          />
          <circle
            cx="60"
            cy="65"
            r="52"
            fill="none"
            stroke="#97C459"
            strokeWidth="12"
            strokeDasharray="65 326"
            strokeDashoffset="-196"
            clipPath="url(#stock-half)"
          />
          <circle
            cx="60"
            cy="65"
            r="52"
            fill="none"
            stroke="#FAC775"
            strokeWidth="12"
            strokeDasharray="98 326"
            strokeDashoffset="-261"
            clipPath="url(#stock-half)"
          />
          <circle
            cx="60"
            cy="65"
            r="52"
            fill="none"
            stroke="#F09595"
            strokeWidth="12"
            strokeDasharray="130 326"
            strokeDashoffset="-359"
            clipPath="url(#stock-half)"
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
          <div className="cr-score">
            {amount} {unitLabel}
          </div>
          <div className="cr-score-label">Amount to administer</div>
          <span className={`cr-badge ${intensityBadge}`}>{intensityLabel}</span>
        </div>
      </div>

      <hr className="cr-divider" />

      <div>
        <div className="cr-bar-label">
          {mode === "tablet"
            ? `relative to 1 tablet (${ratio.toFixed(2)}×)`
            : `relative to your entered dose volume (${ratio.toFixed(2)}×)`}
        </div>
        <div
          className="cr-bar-track"
          style={{
            background:
              "linear-gradient(to right, #B5D4F4 0%, #97C459 30%, #FAC775 60%, #F09595 100%)",
          }}
        >
          <div className="cr-bar-thumb" style={{ left: `${ratioPct}%` }} />
        </div>
        <div className="cr-bar-ticks">
          <span>0</span>
          <span>0.5×</span>
          <span>1×</span>
          <span>3×</span>
          <span>5×</span>
        </div>
      </div>

      <hr className="cr-divider" />

      <div className="cr-metrics-grid">
        <div className="cr-metric-card">
          <div className="cr-m-label">Required dose</div>
          <div className="cr-m-value">{requiredDose} mg</div>
          <div className="cr-m-sub">as prescribed</div>
        </div>
        <div className="cr-metric-card">
          <div className="cr-m-label">Available strength</div>
          <div className="cr-m-value">
            {availableDose} mg{mode === "syrup" ? "/mL" : ""}
          </div>
          <div className="cr-m-sub">
            {mode === "tablet" ? "per tablet" : "per volume"}
          </div>
        </div>
      </div>

      <hr className="cr-divider" />

      <div>
        <div className="cr-bar-label">calculation</div>
        <div className="cr-world-note">
          {requiredDose} mg ÷ {availableDose} mg{mode === "syrup" ? "/mL" : ""}{" "}
          ={" "}
          <strong>
            {amount} {unitLabel}
          </strong>
        </div>
      </div>

      <hr className="cr-divider" />

      <div className="cr-world-note" style={{ fontStyle: "italic" }}>
        <i
          className="fa-solid fa-triangle-exclamation"
          style={{ marginRight: "6px" }}
        />
        This is a calculated estimate, not drug-specific guidance. Always verify
        against the prescribing physician's instructions and current drug
        references before administration.
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Main Calculator Page
───────────────────────────────────────── */
export default function DoseStockCalculator() {
  const [mode, setMode] = useState<"tablet" | "syrup">("tablet");
  const [requiredDose, setRequiredDose] = useState("");
  const [availableDose, setAvailableDose] = useState("");
  const [quantity, setQuantity] = useState("");
  const [volume, setVolume] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const [panelResult, setPanelResult] = useState<StockResult | null>(null);

  const calculateDose = () => {
    const req = Number(requiredDose);
    const avail = Number(availableDose);
    const qty = Number(quantity) || 1;
    const vol = Number(volume) || 1;

    if (!req || !avail) {
      setResult("Please enter valid numbers.");
      return;
    }

    if (mode === "tablet") {
      const dose = (req / avail) * qty;
      const rounded = Math.round(dose * 100) / 100;
      const fraction = rounded % 1 === 0 ? rounded : `${Math.floor(rounded)} ½`;
      setResult(`${fraction} tablet${rounded > 1 ? "s" : ""}`);
    } else {
      const dose = (req / avail) * vol;
      const rounded = Math.round(dose * 100) / 100;
      setResult(`${rounded} mL`);
    }
  };

  useEffect(() => {
    const req = Number(requiredDose);
    const avail = Number(availableDose);

    if (!req || req <= 0 || !avail || avail <= 0) {
      setPanelResult(null);
      return;
    }

    if (mode === "tablet") {
      const qty = Number(quantity) || 1;
      const dose = (req / avail) * qty;
      const rounded = Math.round(dose * 100) / 100;
      if (!isFinite(rounded) || rounded <= 0) {
        setPanelResult(null);
        return;
      }
      const ratio = req / avail;
      setPanelResult({
        mode: "tablet",
        amount: rounded,
        requiredDose: req,
        availableDose: avail,
        ratio,
      });
    } else {
      const vol = Number(volume) || 1;
      const dose = (req / avail) * vol;
      const rounded = Math.round(dose * 100) / 100;
      if (!isFinite(rounded) || rounded <= 0) {
        setPanelResult(null);
        return;
      }
      const ratio = vol > 0 ? rounded / vol : rounded;
      setPanelResult({
        mode: "syrup",
        amount: rounded,
        requiredDose: req,
        availableDose: avail,
        ratio,
      });
    }
  }, [requiredDose, availableDose, quantity, volume, mode]);

  const handleClear = () => {
    setRequiredDose("");
    setAvailableDose("");
    setQuantity("");
    setVolume("");
    setResult(null);
    setPanelResult(null);
  };

  return (
    <div className="page-layout">
      {/* ---- MAIN CONTENT ---- */}
      <div className="single-page-padding">
        <h1>Dose Stock Calculator — Tablets & Syrup Dosing</h1>

        <p>
          Select tablet or syrup mode, enter the prescribed dose and the
          strength of your available stock, and find out exactly how many
          tablets or how many milliliters to administer. This dose stock
          calculator removes the arithmetic from medication preparation and
          reduces the risk of dispensing errors.
        </p>

        <div className="calc-card single-calc">
          {/* Mode Switcher */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              marginBottom: "15px",
            }}
          >
            {["tablet", "syrup"].map((t) => (
              <div
                key={t}
                onClick={() => setMode(t as "tablet" | "syrup")}
                style={{
                  flex: 1,
                  minWidth: "120px",
                  textAlign: "center",
                  padding: "12px",
                  borderRadius: "2px",
                  border:
                    mode === t ? "2px solid #dededea1" : "1px solid #ececec6b",
                  background: "#1f9fb8",
                  cursor: "pointer",
                  fontWeight: mode === t ? 600 : 400,
                  transition: "0.2s",
                }}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </div>
            ))}
          </div>

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
            placeholder={
              mode === "tablet"
                ? "Available Dose per Tablet (mg)"
                : "Available Dose per Volume (mg)"
            }
            value={availableDose}
            onChange={(e) => setAvailableDose(e.target.value)}
          />

          {mode === "tablet" && (
            <input
              className="calc-input white-bg"
              type="number"
              placeholder="Quantity (tablets)"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          )}

          {mode === "syrup" && (
            <input
              className="calc-input white-bg"
              type="number"
              placeholder="Volume (mL) per Dose"
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
            />
          )}

          <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
            <button className="calc-button" onClick={calculateDose}>
              Calculate
            </button>
            <button className="calc-button calc-clear" onClick={handleClear}>
              Clear
            </button>
          </div>

          {result && <div className="calc-result">Result: {result}</div>}
        </div>

        {/* Mobile-only result panel */}
        <div className="cr-mobile-slot">
          <StockResultPanel result={panelResult} />
        </div>

        {/* ---- SEO CONTENT ---- */}

        <h2>What Is a Dose Stock Calculator?</h2>
        <p>
          A dose stock calculator is a clinical tool that answers the most
          practical question in medication administration: you know how many
          milligrams the patient needs — now how much of the available stock do
          you actually give? It converts a prescribed dose in mg into a physical
          quantity — a number of tablets or a volume of liquid in mL — based on
          the strength of the medication you have on hand.
        </p>
        <p>
          This tool is used every day by nurses at the bedside, pharmacists
          behind the dispensing counter, paramedics in the field, and parents
          measuring liquid medicine at home. It eliminates the manual arithmetic
          that is responsible for a significant proportion of medication
          administration errors, especially in pediatric and high-alert drug
          settings.
        </p>
        <p>
          The dose stock calculator is always used after the total required dose
          in mg has been established. If you need to first determine the correct
          dose based on a patient's body weight, use our{" "}
          <Link href="/dose-calculator/" className="my-link">
            dose calculator
          </Link>{" "}
          to get the mg figure, then bring that value here.
        </p>

        <h2>The Dose Stock Formulas</h2>
        <p>
          Both tablet and liquid calculations follow the same core logic: divide
          what you need by what each unit contains.
        </p>

        <h3>Tablet Formula</h3>
        <pre>Tablets to Give = Required Dose (mg) ÷ Dose per Tablet (mg)</pre>

        <h3>Liquid / Syrup Formula</h3>
        <pre>
          Volume to Give (mL) = (Required Dose ÷ Concentration) × Volume per
          Dose
        </pre>
        <p>
          For intravenous preparations — drawing from a vial for IV
          administration — the volume formula is the same, but you also need to
          calculate the infusion rate and drip rate. Our{" "}
          <Link href="/iv-calculator/" className="my-link">
            IV calculator
          </Link>{" "}
          handles that second step.
        </p>

        <h2>Step-by-Step Calculation Examples</h2>

        <h3>Example 1: Tablet Calculation</h3>
        <p>
          A patient is prescribed <strong>750 mg</strong> of amoxicillin. The
          tablets available are <strong>250 mg each</strong>.
        </p>
        <ul className="custom-list">
          <li>
            Tablets to Give = 750 ÷ 250 = <strong>3 tablets</strong>
          </li>
        </ul>
        <p>Straightforward — no splitting needed.</p>

        <h3>Example 2: Tablet Splitting Required</h3>
        <p>
          A patient is prescribed <strong>375 mg</strong> of the same drug. Only{" "}
          <strong>250 mg tablets</strong> are in stock.
        </p>
        <ul className="custom-list">
          <li>
            Tablets to Give = 375 ÷ 250 = <strong>1.5 tablets</strong> (one
            whole tablet + half a tablet)
          </li>
        </ul>
        <p>
          The calculator displays fractional tablets clearly. If the tablet is
          not scored and cannot be split safely, the pharmacist may need to
          source an alternative strength or switch to a liquid formulation.
        </p>

        <h3>Example 3: Syrup / Liquid Calculation</h3>
        <p>
          A child needs <strong>120 mg</strong> of ibuprofen. The available
          suspension is labelled <strong>100 mg per 5 mL</strong>.
        </p>
        <ul className="custom-list">
          <li>
            Concentration = 100 mg ÷ 5 mL = <strong>20 mg/mL</strong>
          </li>
          <li>
            Volume to Give = (120 ÷ 100) × 5 = <strong>6 mL</strong>
          </li>
        </ul>
        <p>
          The child receives 6 mL of the ibuprofen suspension, measured with an
          oral syringe for accuracy.
        </p>

        <h3>Example 4: Injectable Volume From a Vial</h3>
        <p>
          A patient requires <strong>80 mg</strong> of gentamicin IV. The
          available vial contains <strong>40 mg/mL</strong>.
        </p>
        <ul className="custom-list">
          <li>
            Volume to Draw = 80 ÷ 40 = <strong>2 mL</strong>
          </li>
        </ul>
        <p>
          Draw up 2 mL from the vial, then use our{" "}
          <Link href="/iv-calculator/" className="my-link">
            IV calculator
          </Link>{" "}
          to determine the correct infusion rate for delivery.
        </p>

        <h2>Quick Reference: Common Stock Dose Calculations</h2>
        <p>
          The table below shows how different prescribed doses map to tablet or
          liquid quantities for commonly stocked strengths. These are
          calculation examples, not prescribing recommendations.
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
                  Prescribed Dose
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Stock Available
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Amount to Give
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  500 mg
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  250 mg tablets
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  2 tablets
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  750 mg
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  500 mg tablets
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  1.5 tablets
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  1000 mg
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  500 mg tablets
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  2 tablets
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  150 mg
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  100 mg/5 mL syrup
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  7.5 mL
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  200 mg
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  250 mg/5 mL syrup
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  4 mL
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  80 mg
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  40 mg/mL injection
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  2 mL
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>Understanding the Inputs — Tablet Mode</h2>
        <ul className="custom-list">
          <li>
            <strong>Required Dose (mg):</strong> The total dose the patient must
            receive, as prescribed by the healthcare provider. If you need to
            calculate this from the patient's body weight first, use our{" "}
            <Link href="/dose-calculator/" className="my-link">
              weight-based dose calculator
            </Link>{" "}
            and bring the mg result here.
          </li>
          <li>
            <strong>Available Dose per Tablet (mg):</strong> The strength
            printed on the tablet packaging — for example, 250 mg, 500 mg, or 1
            g (1,000 mg). This is the active drug content of one individual
            tablet.
          </li>
          <li>
            <strong>Quantity in Stock (tablets):</strong> The number of tablets
            currently available. The calculator uses this to confirm whether
            your stock is sufficient to cover the dose.
          </li>
        </ul>

        <h2>Understanding the Inputs — Syrup Mode</h2>
        <ul className="custom-list">
          <li>
            <strong>Required Dose (mg):</strong> The prescribed dose to be
            administered, either from the prescription directly or from a{" "}
            <Link href="/dose-calculator/" className="my-link">
              medication dose calculation
            </Link>{" "}
            based on patient weight.
          </li>
          <li>
            <strong>Available Dose per Volume (mg/mL):</strong> The
            concentration of the liquid medicine. If your label reads "250 mg
            per 5 mL," divide 250 by 5 to get 50 mg/mL before entering. This
            conversion is one of the most common sources of error — the section
            below explains how to handle it.
          </li>
          <li>
            <strong>Volume (mL) per Dose:</strong> The standard dose volume
            specified in the prescription or drug reference. The calculator
            scales the result to this volume.
          </li>
        </ul>

        <h2>How to Convert "mg per 5 mL" to "mg per mL"</h2>
        <p>
          Many liquid medications — especially pediatric syrups — list their
          concentration as mg per 5 mL rather than mg per mL. This is a frequent
          source of confusion and calculation errors. The conversion is simple:
          divide the mg by the stated volume.
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
                  Label Reads
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Conversion
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Enter as mg/mL
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  100 mg / 5 mL
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  100 ÷ 5
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  20 mg/mL
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  125 mg / 5 mL
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  125 ÷ 5
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  25 mg/mL
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  250 mg / 5 mL
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  250 ÷ 5
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  50 mg/mL
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  200 mg / 10 mL
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  200 ÷ 10
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  20 mg/mL
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Always check the label carefully. Two bottles of the same drug can
          have different concentrations — a "250 mg/5 mL" bottle and a "125 mg/5
          mL" bottle look similar on the shelf but deliver very different doses
          per milliliter.
        </p>

        <h2>Where Dose Stock Calculation Fits in the Clinical Workflow</h2>
        <p>
          In clinical practice, medication administration follows three
          sequential calculation steps. Each step uses a different tool:
        </p>
        <ul className="custom-list">
          <li>
            <strong>Step 1 — Calculate the dose in mg:</strong> Use our{" "}
            <Link href="/dose-calculator/" className="my-link">
              dose calculator
            </Link>{" "}
            to multiply the patient's weight by the prescribed mg/kg rate to get
            the total dose in milligrams.
          </li>
          <li>
            <strong>Step 2 — Calculate how much stock to give:</strong> Use this
            dose stock calculator to convert that mg figure into the number of
            tablets or mL of liquid needed from the available stock.
          </li>
          <li>
            <strong>
              Step 3 — For IV medications, calculate infusion parameters:
            </strong>{" "}
            If the route is intravenous, use our{" "}
            <Link href="/iv-calculator/" className="my-link">
              IV calculator
            </Link>{" "}
            to determine infusion rate (mL/hr) or drip rate (drops/min) for safe
            delivery.
          </li>
        </ul>
        <p>
          For a deeper understanding of how the body processes the drug after
          administration — including half-life, clearance, and volume of
          distribution — see our{" "}
          <Link href="/pharmacokinetics-calculator/" className="my-link">
            pharmacokinetics calculator
          </Link>
          .
        </p>

        <h2>Who Uses a Dose Stock Calculator?</h2>
        <ul className="custom-list">
          <li>
            <strong>Nurses and nursing students</strong> — performing bedside
            drug calculations before administration and preparing for NCLEX and
            other licensing exam dosage questions
          </li>
          <li>
            <strong>Pharmacists and pharmacy technicians</strong> — verifying
            dispensing quantities and confirming tablet or liquid dose accuracy
            before supply
          </li>
          <li>
            <strong>Parents and home caregivers</strong> — measuring the correct
            volume of over-the-counter liquid medicines like paracetamol or
            ibuprofen for children
          </li>
          <li>
            <strong>Paramedics and first responders</strong> — calculating field
            drug doses from the stock available in emergency kits
          </li>
          <li>
            <strong>Veterinary professionals</strong> — converting mg doses to
            tablet counts or liquid volumes for animal patients. Our{" "}
            <Link href="/dose-calculator/" className="my-link">
              dose calculator
            </Link>{" "}
            handles the weight-based step for any species
          </li>
          <li>
            <strong>Medical and pharmacy students</strong> — practicing
            pharmaceutical calculations for clinical exams and board preparation
          </li>
        </ul>

        <h2>Common Stock Dose Calculation Errors and How to Avoid Them</h2>
        <ul className="custom-list">
          <li>
            <strong>Confusing "mg per 5 mL" with "mg per mL."</strong> This is
            the single most common liquid dosing error. A syrup labelled "250
            mg/5 mL" contains 50 mg per mL, not 250. Always convert before
            entering.
          </li>
          <li>
            <strong>Rounding fractional tablets incorrectly.</strong> If the
            calculation says 1.5 tablets but the tablet is not scored, rounding
            to 1 or 2 gives either a 33% underdose or a 33% overdose. Contact
            the pharmacist for an alternative strength or formulation.
          </li>
          <li>
            <strong>Using the wrong tablet strength from the shelf.</strong>{" "}
            Medications often come in multiple strengths — 250 mg and 500 mg
            tablets of the same drug may look nearly identical. Always read the
            blister pack or bottle label immediately before calculating.
          </li>
          <li>
            <strong>Decimal point misplacement.</strong> Writing 0.5 mL instead
            of 5 mL — or vice versa — is a 10x error. A calculator removes this
            risk, but always double-check that the value you entered matches the
            label.
          </li>
          <li>
            <strong>
              Forgetting to divide daily dose into individual doses.
            </strong>{" "}
            A prescription that reads "1,500 mg/day in 3 divided doses" means
            each dose is 500 mg, not 1,500 mg. Enter the per-dose figure, not
            the daily total.
          </li>
        </ul>

        <h2>Why Accurate Stock Dose Calculations Matter</h2>
        <p>
          Dispensing the wrong number of tablets or the wrong volume of syrup is
          one of the most common sources of medication error in both hospital
          and home settings. A patient given half the required dose may fail to
          reach therapeutic drug levels, and a double dose risks toxicity. This
          risk is highest in three situations: pediatric dosing, where
          weight-based doses are small and proportional errors are large;
          high-alert medications like warfarin, digoxin, and insulin, where the
          margin between therapeutic and toxic is narrow; and home
          administration by non-medical caregivers, who may not be familiar with
          the concentration conversion step.
        </p>
        <p>
          A reliable dose stock calculator removes the arithmetic from this
          process entirely and provides a transparent calculation the clinician
          or caregiver can verify at a glance before administering.
        </p>

        <h2>Important Safety Notes</h2>
        <ul className="custom-list">
          <li>
            This calculator provides a mathematical result based on the values
            entered. It is designed to support — not replace — professional
            clinical judgment.
          </li>
          <li>
            Always verify results against the prescribing physician's
            instructions and current drug references (BNF, Micromedex, Lexicomp,
            or equivalent) before administration.
          </li>
          <li>
            For intravenous medications, always confirm infusion rates using a
            dedicated{" "}
            <Link href="/iv-calculator/" className="my-link">
              IV calculator
            </Link>{" "}
            in addition to the stock volume calculation.
          </li>
          <li>
            If a tablet calculation produces a result that requires splitting an
            unscored tablet, contact the prescriber or pharmacist for an
            alternative formulation or strength.
          </li>
        </ul>

        <h2>Frequently Asked Questions About Dose Stock Calculation</h2>

        <div className="faq-item">
          <h3 onClick={() => toggleFAQ(0)}>
            How do I calculate how many tablets to give for a prescribed dose?
            <i
              className={`fa-solid fa-chevron-down ${openFAQ === 0 ? "rotate" : ""}`}
            ></i>
          </h3>
          {openFAQ === 0 && (
            <p>
              Divide the required dose in mg by the dose per tablet in mg. For
              example, if 500 mg is needed and each tablet is 250 mg, then 500 ÷
              250 = 2 tablets. Enter these values into the Tablet mode above for
              an instant result. If you first need to calculate the total mg
              dose from body weight, use our{" "}
              <Link href="/dose-calculator/" className="my-link">
                dose calculator
              </Link>{" "}
              before coming here.
            </p>
          )}
        </div>

        <div className="faq-item">
          <h3 onClick={() => toggleFAQ(1)}>
            How do I convert a syrup label from "mg per 5 mL" to "mg per mL"?
            <i
              className={`fa-solid fa-chevron-down ${openFAQ === 1 ? "rotate" : ""}`}
            ></i>
          </h3>
          {openFAQ === 1 && (
            <p>
              Divide the milligrams by the stated volume. If the label reads
              "250 mg per 5 mL," divide 250 by 5 to get 50 mg/mL, then enter 50
              into the Available Dose per Volume field. This conversion is a
              standard step in pharmacy and nursing practice for all liquid
              medications.
            </p>
          )}
        </div>

        <div className="faq-item">
          <h3 onClick={() => toggleFAQ(2)}>
            Can this calculator be used for pediatric dosing?
            <i
              className={`fa-solid fa-chevron-down ${openFAQ === 2 ? "rotate" : ""}`}
            ></i>
          </h3>
          {openFAQ === 2 && (
            <p>
              Yes. The stock dose formula works identically for children and
              adults — it depends only on the required dose in mg and the
              available stock strength. For pediatric patients, the required
              dose is typically smaller since it is derived from body weight.
              Use our{" "}
              <Link href="/dose-calculator/" className="my-link">
                weight-based dose calculator
              </Link>{" "}
              to get the correct pediatric mg dose, then use this tool to
              determine the tablets or mL to administer.
            </p>
          )}
        </div>

        <div className="faq-item">
          <h3 onClick={() => toggleFAQ(3)}>
            What is the difference between a dose stock calculator and a dose
            calculator?
            <i
              className={`fa-solid fa-chevron-down ${openFAQ === 3 ? "rotate" : ""}`}
            ></i>
          </h3>
          {openFAQ === 3 && (
            <p>
              A{" "}
              <Link href="/dose-calculator/" className="my-link">
                dose calculator
              </Link>{" "}
              determines the total amount of drug required in mg, based on the
              patient's weight and the prescribed mg/kg rate. A dose stock
              calculator (this tool) takes that mg figure and converts it into
              the physical quantity to administer — number of tablets or mL of
              liquid — from the medication you have available. Both steps are
              performed sequentially in clinical practice.
            </p>
          )}
        </div>

        <div className="faq-item">
          <h3 onClick={() => toggleFAQ(4)}>
            What do I do if the result is a fraction and my tablet cannot be
            split?
            <i
              className={`fa-solid fa-chevron-down ${openFAQ === 4 ? "rotate" : ""}`}
            ></i>
          </h3>
          {openFAQ === 4 && (
            <p>
              If the calculator returns a fractional result (for example, 1.5
              tablets) and the available tablet is not scored for splitting, do
              not attempt to break it. Contact the pharmacist to request either
              a different tablet strength that divides evenly or a liquid
              formulation that can be measured precisely with an oral syringe.
            </p>
          )}
        </div>

        <div className="faq-item">
          <h3 onClick={() => toggleFAQ(5)}>
            Can I use the syrup mode for injectable or IV medications?
            <i
              className={`fa-solid fa-chevron-down ${openFAQ === 5 ? "rotate" : ""}`}
            ></i>
          </h3>
          {openFAQ === 5 && (
            <p>
              Yes — the volume calculation is identical whether you are drawing
              from a syrup bottle or a medication vial. However, for intravenous
              administration you also need to calculate the infusion rate
              (mL/hr) and drip rate (drops/min). Our{" "}
              <Link href="/iv-calculator/" className="my-link">
                IV calculator
              </Link>{" "}
              handles that step. Use both tools together for complete IV
              medication preparation.
            </p>
          )}
        </div>

        <div className="faq-item">
          <h3 onClick={() => toggleFAQ(6)}>
            Does this tool replace medical or pharmacist advice?
            <i
              className={`fa-solid fa-chevron-down ${openFAQ === 6 ? "rotate" : ""}`}
            ></i>
          </h3>
          {openFAQ === 6 && (
            <p>
              No. This calculator provides a mathematical result based on the
              values you enter and is intended to support professional clinical
              judgment, not replace it. All dosing decisions must follow a
              licensed healthcare provider's prescription and be verified
              against current drug references before any medication is given.
            </p>
          )}
        </div>

        <div className="faq-item">
          <h3 onClick={() => toggleFAQ(7)}>
            How should I measure liquid doses at home?
            <i
              className={`fa-solid fa-chevron-down ${openFAQ === 7 ? "rotate" : ""}`}
            ></i>
          </h3>
          {openFAQ === 7 && (
            <p>
              Always use an oral syringe or the graduated measuring cup that
              comes with the medication. Kitchen spoons are inaccurate and can
              easily lead to over- or under-dosing, especially for children.
              Draw the liquid to the exact mL line the calculator indicates,
              hold the syringe at eye level to check, and administer slowly.
            </p>
          )}
        </div>

        <div className="faq-item">
          <h3 onClick={() => toggleFAQ(8)}>
            Should I enter the total daily dose or the single-dose amount?
            <i
              className={`fa-solid fa-chevron-down ${openFAQ === 8 ? "rotate" : ""}`}
            ></i>
          </h3>
          {openFAQ === 8 && (
            <p>
              Enter the single-dose amount — the mg the patient receives at one
              time. If the prescription reads "1,500 mg/day in 3 divided doses,"
              the single dose is 1,500 ÷ 3 = 500 mg. Enter 500 mg, not 1,500 mg.
              Entering the full daily total without dividing is one of the most
              common causes of accidental overdosing.
            </p>
          )}
        </div>
      </div>

      {/* ---- SIDEBAR ---- */}
      <aside className="sidebar">
        <div className="cr-desktop-slot">
          <StockResultPanel result={panelResult} />
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
