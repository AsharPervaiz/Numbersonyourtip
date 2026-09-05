"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import ReviewedBy from "./ReviewedBy";

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
        physician&apos;s instructions and current drug references before
        administration.
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   FAQ data (also used to build the FAQPage
   JSON-LD schema, so schema and on-page copy
   always match exactly)
───────────────────────────────────────── */
const FAQ_DATA: [string, string][] = [
  [
    "How do I calculate a dose for a medicine taken three times a day?",
    "Work out the daily total first, then divide. Multiply the weight by the mg/kg/day rate to get the total for 24 hours, then divide that by the number of doses. An 18 kg child on 40 mg/kg/day in three divided doses needs 720 mg per day and 240 mg per dose. The most common error here is administering the daily total at each dose, which triples the intended amount.",
  ],
  [
    "Which weight should I use — actual, ideal, or adjusted body weight?",
    "Actual measured weight is the default and is correct for most drugs and most patients. Some drugs distribute poorly into fat and are dosed on ideal body weight, calculated from height using the Devine equations; others use an adjusted weight that sits between the two. Which basis applies is a property of the drug, so it comes from the prescribing reference rather than from the calculator. Children are dosed on actual weight, measured on the day.",
  ],
  [
    "How do I convert mg to mL for a liquid medicine?",
    "Divide the dose in milligrams by the concentration in mg per mL. The trap is that suspensions are labelled per 5 mL, so a bottle marked 250 mg/5 mL is 50 mg/mL, not 250 mg/mL. A 360 mg dose from that bottle is 7.2 mL. Using the labelled number without dividing by five gives a fifth of the intended dose.",
  ],
  [
    "What is a dosing weight calculator actually calculating?",
    "It converts height and measured weight into the reference weight a particular drug is dosed against. Ideal body weight for a woman is 45.5 kg plus 2.3 kg for each inch over five feet; adjusted body weight adds a fraction of the difference between actual and ideal. For a 95 kg woman of 5 feet 6 inches, actual, adjusted and ideal weights are 95, 73.6 and 59.3 kg, which produce doses more than 60% apart from the same order.",
  ],
  [
    "Does a heavier child get an adult dose?",
    "Never more than one. Many paediatric drugs carry a maximum single dose and a maximum daily dose pegged to the standard adult dose, and those ceilings override the weight-based multiplication. Once a child is heavy enough that the calculation exceeds the adult maximum, the adult maximum is the dose. Always compare a weight-based result against the reference maximum before administering it.",
  ],
  [
    "What is the difference between mg/kg and mg/kg/day?",
    "A rate in mg/kg is a single dose. A rate in mg/kg/day is a total for 24 hours that then has to be divided by the frequency. The two look nearly identical on a prescription and produce answers that differ by a factor equal to the number of doses per day, so read to the end of the unit before multiplying.",
  ],
  [
    "How do I handle an order written in mg per pound?",
    "Keep the units of the order and the units of the weight aligned rather than converting halfway. If the order is mg/lb, use the weight in pounds. If you convert the weight to kilograms, you must also convert the rate. One pound is 0.45359237 kg, so applying a mg/lb rate to a kilogram weight produces a dose roughly 2.2 times too low.",
  ],
  [
    "Can I use this for veterinary dosing?",
    "The arithmetic is identical and the calculator supports both mg/kg and mg/lb, which is the unit most veterinary references use. What does not transfer is the dose rate itself — species differ sharply in how they handle drugs, and several medicines that are routine in humans are toxic to cats or dogs. Take the rate from a species-specific reference every time.",
  ],
  [
    "Is a calculated dose safe to give without checking?",
    "No. A calculator confirms the arithmetic, not the prescription. It cannot know the drug, the indication, the patient's renal function, what else they are taking, or whether the rate you entered was the right one. Treat the result as a figure to be verified against the prescribing reference and, for high-risk medicines, independently recalculated by a second clinician.",
  ],
];

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
  const handleFAQKey = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleFAQ(index);
    }
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
      {/* FAQ JSON-LD schema for rich results */}
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

      {/* ---- MAIN CONTENT ---- */}
      <div className="single-page-padding">
        <h1>Dosage Calculator — Dose by Weight in mg/kg or mg/lb</h1>


        <p>
          Enter the patient&apos;s body weight and the prescribed dose rate to
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

        <h2>One Prescription, Three Different Numbers</h2>
        <p>
          A weight-based prescription contains more numbers than it appears to.
          Read the line &quot;amoxicillin 40 mg/kg/day in three divided doses&quot;
          and there are three separate quantities in play: the rate (40
          mg/kg/day), the total daily dose in milligrams, and the amount that
          actually goes into the spoon or syringe each time. Confusing the
          second for the third gives a patient three times their intended dose
          and is one of the most reproducible errors in medication maths.
        </p>
        <p>
          This page works through the three questions that sit between a
          prescription and an administered dose, in the order they have to be
          answered: which weight to use, what the total comes to, and how to
          split and measure it.
        </p>

        <h2>Which Weight Do You Dose On?</h2>
        <p>
          The instinctive answer is &quot;the one on the scale&quot;, and for
          most patients it is right. But actual body weight is not the dosing
          weight for every drug or every patient, and a calculator will happily
          multiply whatever you type in. The distinction matters most at the
          extremes of body composition.
        </p>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Weight basis</th>
                <th>What it is</th>
                <th>Typically used when</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Actual body weight (ABW)</td>
                <td>The measured weight</td>
                <td>
                  Most drugs, most patients; the default unless a reference says
                  otherwise
                </td>
              </tr>
              <tr>
                <td>Ideal body weight (IBW)</td>
                <td>A height-derived reference weight</td>
                <td>
                  Drugs that distribute poorly into fat, where dosing on ABW
                  would overshoot
                </td>
              </tr>
              <tr>
                <td>Adjusted body weight (AdjBW)</td>
                <td>IBW plus a fraction of the excess over IBW</td>
                <td>
                  A middle course for some drugs in obesity, where neither ABW
                  nor IBW fits
                </td>
              </tr>
              <tr>
                <td>Lean body weight</td>
                <td>Total weight minus fat mass</td>
                <td>
                  Certain anaesthetic and induction agents, per specialist
                  protocol
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          Ideal body weight is calculated from height using the Devine
          equations, which take a baseline at 5 feet and add a fixed increment
          per additional inch:
        </p>
        <pre>
          Men: IBW (kg) = 50 + 2.3 × (height in inches over 60){"\n"}Women: IBW
          (kg) = 45.5 + 2.3 × (height in inches over 60)
        </pre>
        <p>
          A woman of 5 feet 6 inches has an IBW of 45.5 + (2.3 × 6) = 59.3 kg.
          If she weighs 95 kg, adjusted body weight at the commonly used 0.4
          factor is 59.3 + 0.4 × (95 − 59.3) = 73.6 kg. Dosing the same 5 mg/kg
          order on those three weights gives 475 mg, 297 mg, or 368 mg — a
          spread of more than 60% from a single prescription. Which one is
          correct is a drug-specific question answered by the prescribing
          reference, not by the calculator.
        </p>
        <p>
          For children the question is usually settled the other way: paediatric
          dosing is on actual weight, measured today, in kilograms, because
          growth makes any recorded weight stale quickly.
        </p>

        <h2>From mg/kg to the Amount in the Syringe</h2>
        <p>
          Once the weight is settled, the total dose is a multiplication:
        </p>
        <pre>Dose (mg) = Weight (kg) × Prescribed rate (mg/kg)</pre>
        <p>
          A 24 kg child prescribed 15 mg/kg of paracetamol needs 360 mg. That is
          the answer to the arithmetic, but nobody administers milligrams. The
          second step converts it into a measurable volume using the strength on
          the bottle:
        </p>
        <pre>Volume (mL) = Dose (mg) ÷ Concentration (mg/mL)</pre>
        <p>
          Paediatric suspensions are labelled per 5 mL rather than per mL, which
          is where the conversion trips. A bottle marked 250 mg/5 mL is 50
          mg/mL, so 360 mg is 360 ÷ 50 = 7.2 mL. Reading the label as 250 mg/mL
          and dividing gives 1.44 mL — a fifth of the intended dose, and an
          error that looks entirely reasonable in a syringe.
        </p>
        <p>
          Always divide the labelled strength by 5 before using it. The{" "}
          <Link href="/dose-stock-calculator/" className="my-link">
            dose stock calculator
          </Link>{" "}
          handles the per-5-mL form directly if you would rather not convert by
          hand.
        </p>

        <h2>&quot;Three Times a Day&quot;: Splitting a Daily Dose</h2>
        <p>
          A large share of dosing errors live in this one step. Prescriptions
          are frequently written as a daily total to be divided, and the number
          that gets calculated is the daily total, not the individual dose.
        </p>
        <pre>
          Single dose = (Weight × Daily rate in mg/kg/day) ÷ Number of doses per
          day
        </pre>
        <p>
          An 18 kg child on 40 mg/kg/day of amoxicillin in three divided doses:
          18 × 40 = 720 mg per day, divided by 3 = 240 mg per dose. At 250 mg/5
          mL that is 240 ÷ 50 = 4.8 mL, three times daily. Giving 720 mg at each
          administration would deliver 2,160 mg in a day against an intended
          720.
        </p>
        <p>
          Prescription abbreviations carry the frequency, and they are worth
          reading precisely because several look alike:
        </p>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Abbreviation</th>
                <th>Means</th>
                <th>Doses per day</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>OD / daily</td>
                <td>Once daily</td>
                <td>1</td>
              </tr>
              <tr>
                <td>BD / BID</td>
                <td>Twice daily</td>
                <td>2</td>
              </tr>
              <tr>
                <td>TDS / TID</td>
                <td>Three times daily</td>
                <td>3</td>
              </tr>
              <tr>
                <td>QDS / QID</td>
                <td>Four times daily</td>
                <td>4</td>
              </tr>
              <tr>
                <td>Q6H</td>
                <td>Every six hours</td>
                <td>4, but on a clock rather than waking hours</td>
              </tr>
              <tr>
                <td>Q8H</td>
                <td>Every eight hours</td>
                <td>3, evenly spaced day and night</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          The last two rows are not interchangeable with the rows above them
          even though the dose count matches. &quot;Three times daily&quot; is
          usually taken with meals across waking hours; &quot;every eight
          hours&quot; means a dose overnight. For antibiotics where the time
          spent above a minimum concentration drives the effect, that difference
          is clinically real rather than pedantic.
        </p>

        <h2>When the Weight-Based Answer Is Too High</h2>
        <p>
          Weight-based dosing assumes a linear relationship between size and
          dose, and that assumption fails at the top end. Many paediatric drugs
          carry a maximum single dose or a maximum daily dose that applies
          regardless of what the multiplication produces, usually pegged to the
          standard adult dose.
        </p>
        <p>
          A 60 kg adolescent on a 15 mg/kg paracetamol order calculates to 900
          mg, above the usual 1 g single dose only marginally — but the same
          child on a drug capped at 500 mg would calculate to 900 mg and need
          capping. Any weight-based result should be compared against the
          reference maximum before it is given, and a heavier child should never
          receive more than an adult would.
        </p>
        <p>
          The same ceiling logic applies in reverse for renal or hepatic
          impairment, where the correct dose can be lower than weight alone
          suggests. That adjustment is driven by clearance rather than mass —
          our{" "}
          <Link href="/pharmacokinetics-calculator/" className="my-link">
            pharmacokinetics calculator
          </Link>{" "}
          covers the relationship between clearance, half-life and maintenance
          dosing.
        </p>

        <h2>Pounds, and Veterinary Orders</h2>
        <p>
          Orders written in mg/lb appear in veterinary practice and in some
          consumer product labelling. The conversion is exact: 1 lb = 0.45359237
          kg, so a rate in mg/lb is roughly 2.2 times smaller in magnitude than
          the same clinical intent expressed in mg/kg.
        </p>
        <pre>Weight in kg = Weight in lb × 0.4536</pre>
        <p>
          A 44 lb dog is 19.96 kg. Prescribed at 2 mg/lb, the dose is 88 mg;
          converting the rate instead and applying 2 mg/kg to 19.96 kg gives
          39.9 mg. Both calculations are internally consistent and one of them
          is half the intended dose, so keep the units of the order and the
          units of the weight aligned rather than converting mid-problem.
          Species-specific references matter here too: doses for cats, dogs and
          horses diverge sharply, and human references do not transfer.
        </p>

        <h2>One Prescription, Start to Finish</h2>
        <p>
          Putting the steps together on a single realistic order. A 27 kg child
          is prescribed cefalexin 25 mg/kg/day in two divided doses; stock is
          125 mg/5 mL.
        </p>
        <pre>
          Daily dose = 27 × 25 = 675 mg{"\n"}Per dose = 675 ÷ 2 = 337.5 mg{"\n"}
          Concentration = 125 ÷ 5 = 25 mg/mL{"\n"}Volume per dose = 337.5 ÷ 25 =
          13.5 mL, twice daily
        </pre>
        <p>
          Four operations, each one a place an error can enter: the wrong
          weight, the wrong divisor, an unconverted per-5-mL strength, or a
          decimal slip in the final division. Working them in a fixed order and
          writing each intermediate result down is what makes the check
          possible; a single answer with no working cannot be verified by anyone
          else.
        </p>

        <h2>Sense-Checking the Result</h2>
        <ul className="custom-list">
          <li>
            Is the volume measurable? Oral syringes read to 0.1 or 0.2 mL. A
            result of 0.03 mL cannot be given accurately and usually signals a
            concentration error.
          </li>
          <li>
            Is the volume plausible for the patient? More than about 10 mL in a
            single dose for an infant, or a tablet count above two, is worth
            re-deriving before it is given.
          </li>
          <li>
            Does the daily total stay under the reference maximum once every
            dose is added up, including any of the same drug in a combination
            product?
          </li>
          <li>
            Was the weight measured, in kilograms, and recorded today for a
            child?
          </li>
          <li>
            Does the frequency in your calculation match the frequency written
            on the prescription, not the one you expected to see?
          </li>
        </ul>
        <p>
          For intravenous orders, where a rate and a duration join the
          arithmetic, continue with the{" "}
          <Link href="/iv-calculator/" className="my-link">
            IV calculator
          </Link>
          . For a longer walkthrough with additional examples, see our{" "}
          <Link
            href="/blog/medication-dose-calculation-complete-guide-to-dose-calculator-safe-drug-dosing/"
            className="my-link"
          >
            guide to medication dose calculation
          </Link>
          .
        </p>
        <h2>Dosing Questions People Actually Get Wrong</h2>

        {FAQ_DATA.map(([q, a], i) => {
          const isOpen = openFAQ === i;
          return (
            <div className="faq-item" key={i}>
              <h3
                onClick={() => toggleFAQ(i)}
                onKeyDown={(e) => handleFAQKey(e, i)}
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
