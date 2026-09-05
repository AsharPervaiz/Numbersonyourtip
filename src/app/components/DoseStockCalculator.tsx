"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import ReviewedBy from "./ReviewedBy";

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
        against the prescribing physician&apos;s instructions and current drug
        references before administration.
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Main Calculator Page
───────────────────────────────────────── */
const FAQ_DATA: [string, string][] = [
  [
    "What does 'desired over have times quantity' mean?",
    "It is the standard stock dose formula: divide the dose you want by the strength you have, then multiply by the quantity that strength comes in. Desired is the prescribed dose, Have is the stock strength printed on the label, and Quantity is the unit that strength is expressed in — one tablet, 5 mL, or the vial volume. The same equation is also taught as need over have, D ÷ H × Q, and stock required over stock strength.",
  ],
  [
    "Why do I multiply by 5 for a syrup but not for tablets?",
    "Because the quantity term differs. A tablet strength is expressed per tablet, so Q is 1 and multiplying changes nothing. A suspension is labelled per 5 mL, so Q is 5 and leaving it out gives an answer five times too small. The alternative is to convert the label to mg per mL first by dividing by 5, then not multiply at all. Both work; doing half of each is what produces the error.",
  ],
  [
    "How do I read a label that says 40 mg/mL instead of 80 mg/2 mL?",
    "They can describe the same vial. When the label states a concentration per millilitre, the quantity term is 1 mL and the calculation is a straight division of dose by concentration. When it states a total in a stated volume, use that volume as Q. Treating a per-millilitre concentration as though it were the whole vial contents halves every dose drawn.",
  ],
  [
    "What should I do if the answer is 1.2 tablets?",
    "Treat it as a signal rather than an instruction. A fraction that is not a clean half usually means the available strength does not suit the prescribed dose, or a number was transcribed wrongly. Check whether another strength or a liquid form exists before considering splitting. Only scored, immediate-release tablets divide reliably — coated, enteric and modified-release tablets must not be broken, and capsules cannot be split at all.",
  ],
  [
    "How do I convert a percentage strength into mg per mL?",
    "A percentage is grams per 100 mL, so multiply the percentage by 10 to get mg/mL. A 2% solution is 2 g in 100 mL, which is 20 mg/mL. A 10% solution is 100 mg/mL. Entering the percentage figure directly as a concentration understates the strength tenfold, which is one of the most consequential errors in stock dose calculation.",
  ],
  [
    "How many doses will a bottle give me?",
    "Divide the bottle volume by the volume of a single dose, then divide that by the number of doses per day to get days of supply. A 100 mL bottle at 8 mL per dose holds twelve full doses, which at three times daily lasts four days. Round down: a partial dose left at the bottom of the bottle is not a dose.",
  ],
  [
    "Can I measure a liquid dose with a kitchen spoon?",
    "Use an oral syringe or the measuring device supplied with the medicine. Household spoons vary substantially in capacity — enough that the same measured 'teaspoon' can differ by a factor approaching two between utensils in one drawer. On an adult paracetamol dose that is tolerable; on a paediatric antibiotic or anything with a narrow margin it is not.",
  ],
  [
    "How do I check my answer without redoing the calculation?",
    "Compare the dose to the stock strength before you calculate. If the dose required is larger than the stock strength, the answer must be more than one unit of stock; if smaller, less than one. A 400 mg dose from a 250 mg/5 mL bottle must fall between 5 and 10 mL, which confirms 8 mL and immediately rules out 1.6 mL or 80 mL.",
  ],
  [
    "Should I enter the single dose or the total daily dose?",
    "The single dose. This calculator converts one prescribed dose into tablets or millilitres. If the prescription is written as a daily total to be divided — 40 mg/kg/day in three doses, for example — divide it by the frequency first, and bring the per-dose figure here.",
  ],
];

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
        <h1>Dose Stock Calculator — Desired Over Have (D ÷ H × Q)</h1>


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

        <h2>The Same Formula Under Four Different Names</h2>
        <p>
          Search for how to work out a dose from stock and you will meet the
          same equation wearing several different labels. It gets taught as
          &quot;desired over have&quot;, written on whiteboards as D ÷ H × Q,
          called &quot;need over have times volume&quot; in some nursing
          programmes, and printed in textbooks as stock required over stock
          strength. They are one formula.
        </p>
        <pre>
          Amount to give = (Dose you want ÷ Strength you have) × Quantity that
          strength comes in
        </pre>
        <p>
          The three inputs map onto the prescription and the label like this:
        </p>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Term</th>
                <th>Also called</th>
                <th>Where you read it</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>D — Desired</td>
                <td>Need, dose required, prescribed dose</td>
                <td>The prescription</td>
              </tr>
              <tr>
                <td>H — Have</td>
                <td>Stock strength, on-hand strength, available dose</td>
                <td>The box or bottle label</td>
              </tr>
              <tr>
                <td>Q — Quantity</td>
                <td>Stock volume, vehicle, unit</td>
                <td>
                  The label: 1 tablet, 5 mL, 2 mL — the amount that H comes in
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          Q is the part people drop, because for tablets it is 1 and multiplying
          by 1 feels invisible. The moment the stock is a liquid, Q becomes 5 mL
          or 10 mL and omitting it produces an answer that is wrong by that
          factor.
        </p>

        <h2>Reading the Three Numbers Off a Real Label</h2>
        <p>
          A bottle reading{" "}
          <strong>&quot;Amoxicillin 250 mg/5 mL — 100 mL&quot;</strong> contains
          four numbers and only two of them belong in the formula. The 250 mg is
          H. The 5 mL is Q. The 100 mL is the bottle size, which tells you how
          many doses you can get out of it but plays no part in working out a
          single dose. The drug name is not a number at all, but checking it
          against the prescription is the step that catches the errors
          arithmetic cannot.
        </p>
        <p>
          If the prescription asks for 400 mg:
        </p>
        <pre>(400 ÷ 250) × 5 = 1.6 × 5 = 8 mL</pre>
        <p>
          A useful habit is to state the answer with its unit attached from the
          start — &quot;8 mL&quot;, not &quot;8&quot;. A bare number carries no
          protection against being read as 8 tablets, 8 mg, or 8 spoonfuls by
          whoever picks the note up next.
        </p>

        <h2>Tablets, and What to Do With a Fraction</h2>
        <p>
          For solid dose forms Q is one tablet, so the formula collapses to a
          division:
        </p>
        <pre>Tablets = Dose required ÷ Strength per tablet</pre>
        <p>
          A 75 mg prescription against 25 mg tablets is three tablets. A 30 mg
          prescription against the same stock is 1.2 tablets, and that is where
          the arithmetic stops being useful and a decision starts.
        </p>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Result</th>
                <th>What it usually means</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>A whole number</td>
                <td>Give that many tablets</td>
              </tr>
              <tr>
                <td>Exactly one half</td>
                <td>
                  Acceptable only if the tablet is scored and the formulation
                  allows splitting
                </td>
              </tr>
              <tr>
                <td>A third, a quarter, or 1.2</td>
                <td>
                  The available strength is wrong for this dose — check for
                  another strength, a liquid form, or a transcription error
                </td>
              </tr>
              <tr>
                <td>Less than half a tablet</td>
                <td>
                  Almost always signals the wrong stock strength was entered
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          Splitting is not a purely mechanical question. A scored,
          immediate-release tablet generally divides acceptably. A film-coated,
          enteric-coated, or modified-release tablet does not: breaking the
          coating on a modified-release product can release the whole dose at
          once instead of over twelve hours, converting a routine dose into an
          overdose. Capsules cannot be split at all. When the arithmetic
          produces a fraction the formulation will not support, the answer is a
          different preparation, not a sharper knife.
        </p>

        <h2>Liquids: the Per-5-mL Problem</h2>
        <p>
          Oral suspensions are almost universally labelled per 5 mL because that
          is a spoon, not because it is a convenient unit for calculation. Two
          equally valid routes exist and mixing them is the classic error.
        </p>
        <p>
          <strong>Route one — keep Q as 5 mL.</strong> Use the label as it is
          written and let the formula handle it: (Dose ÷ 250) × 5.
        </p>
        <p>
          <strong>Route two — convert to mg/mL first.</strong> Divide the
          labelled strength by 5, then divide the dose by the result: 250 ÷ 5 =
          50 mg/mL, so a 400 mg dose is 400 ÷ 50 = 8 mL.
        </p>
        <p>
          Both give 8 mL. What produces a five-fold error is converting the
          strength to mg/mL and then still multiplying by 5, or leaving the
          strength as 250 and forgetting to multiply. Pick one route and use it
          every time rather than choosing per problem.
        </p>
        <p>
          Measure the result with an oral syringe rather than a kitchen spoon.
          Household teaspoons vary by a factor of roughly two between the
          smallest and largest in an average drawer, which on a paediatric dose
          is the difference between a therapeutic and a doubled dose.
        </p>

        <h2>Vials and Injections</h2>
        <p>
          Injectable stock uses the same three terms, with Q as the vial volume:
        </p>
        <pre>
          Volume to draw = (Dose required ÷ Vial strength) × Vial volume
        </pre>
        <p>
          Drawing 60 mg from a vial labelled 80 mg in 2 mL: (60 ÷ 80) × 2 = 1.5
          mL.
        </p>
        <p>
          Two label conventions cause trouble here. Some vials are labelled as a
          total (80 mg/2 mL); others as a concentration (40 mg/mL). They describe
          the same vial. If the label gives a concentration, Q is 1 mL and the
          calculation is a plain division. Reading 40 mg/mL as though it were 40
          mg in the whole vial halves every dose drawn from it.
        </p>
        <p>
          Percentage-strength solutions are the second. A 2% solution is 2 g per
          100 mL, which is 20 mg/mL. Treating the 2 as milligrams per millilitre
          understates the strength tenfold. Convert any percentage to mg/mL
          before it goes anywhere near the formula — the{" "}
          <Link href="/iv-calculator/" className="my-link">
            IV calculator
          </Link>{" "}
          covers this in the context of infusion rates.
        </p>

        <h2>Running the Formula Backwards</h2>
        <p>
          The same relationship answers a question that comes up at every
          discharge: will this bottle last?
        </p>
        <pre>
          Doses in the bottle = Bottle volume ÷ Volume per dose{"\n"}Days of
          supply = Doses in the bottle ÷ Doses per day
        </pre>
        <p>
          A 100 mL bottle giving 8 mL per dose holds 12 full doses. At three
          times daily that is four days — short of a five-day course, and the
          kind of thing better noticed at the counter than at the weekend.
          Fractional doses at the end of a bottle count as unusable; twelve and a
          half doses is twelve.
        </p>

        <h2>Checking Your Own Answer</h2>
        <p>
          Estimation before calculation catches most order-of-magnitude errors.
          If the dose required is larger than the stock strength, the answer must
          be more than one unit of stock. If it is smaller, the answer must be
          less than one. A 400 mg dose from a 250 mg/5 mL bottle must therefore
          land between 5 and 10 mL, which makes 8 mL believable and instantly
          rules out 1.6 mL or 80 mL.
        </p>
        <ul className="custom-list">
          <li>
            Ratio first: is the dose bigger or smaller than the stock strength,
            and does your answer sit on the right side of one unit?
          </li>
          <li>
            Units attached: mL for liquids, tablets for solids, stated out loud
            with the number.
          </li>
          <li>
            Q accounted for: 1 for tablets, 5 mL for a per-5-mL suspension, the
            vial volume for injections.
          </li>
          <li>
            Percentages converted to mg/mL before use, never entered as
            themselves.
          </li>
          <li>
            The drug name on the label read against the prescription, not just
            the strength.
          </li>
        </ul>
        <p>
          Where the prescription gives a rate per kilogram rather than a finished
          dose, work that out first with the{" "}
          <Link href="/dose-calculator/" className="my-link">
            dosage calculator
          </Link>
          , then bring the resulting milligrams back here to convert into
          tablets or millilitres.
        </p>
        <h2>Stock Dose Questions, Answered</h2>

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
