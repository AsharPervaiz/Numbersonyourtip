"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import ReviewedBy from "./ReviewedBy";

/* ─────────────────────────────────────────
   Types & constants
───────────────────────────────────────── */
type Gender = "male" | "female";
type Activity = "sedentary" | "light" | "moderate" | "active" | "very-active";
type Goal = "lose" | "maintain" | "gain";
type HeightUnit = "cm" | "ftin";
type WeightUnit = "kg" | "lbs";

interface CalResult {
  bmr: number;
  tdee: number;
  target: number;
  goal: Goal;
}

const ACTIVITY_MULT: Record<Activity, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  "very-active": 1.9,
};
const ACTIVITY_LABELS: Record<Activity, string> = {
  sedentary: "Sedentary — desk job, little exercise",
  light: "Lightly active — 1–3 days / week",
  moderate: "Moderately active — 3–5 days / week",
  active: "Very active — 6–7 days / week",
  "very-active": "Extremely active — twice a day / hard labor",
};
const GOAL_LABELS: Record<Goal, string> = {
  lose: "Weight loss (−500 kcal)",
  maintain: "Maintain",
  gain: "Weight gain (+500 kcal)",
};

/* ─────────────────────────────────────────
   Pure helpers
───────────────────────────────────────── */
function mifflinBMR(
  weightKg: number,
  heightCm: number,
  age: number,
  gender: Gender,
): number {
  return (
    10 * weightKg + 6.25 * heightCm - 5 * age + (gender === "male" ? 5 : -161)
  );
}
function needleDeg(target: number, tdee: number): number {
  const ratio = Math.min(Math.max(target / (tdee * 1.5), 0), 1);
  return -90 + ratio * 180;
}
function barPct(target: number, tdee: number): number {
  const ratio = Math.min(Math.max(target / (tdee * 1.5), 0), 1);
  return 2 + ratio * 96;
}

/* ─────────────────────────────────────────
   CalorieResultPanel
───────────────────────────────────────── */
function CalorieResultPanel({ result }: { result: CalResult | null }) {
  if (!result) {
    return (
      <div className="cr-panel-placeholder">
        <div className="cr-ph-icon">
          <i className="fa-solid fa-fire-flame-curved" aria-hidden="true" />
        </div>
        Enter your details to see your calorie target here.
      </div>
    );
  }
  const { bmr, tdee, target, goal } = result;
  const badge =
    goal === "lose" ? "good" : goal === "maintain" ? "normal" : "warning";
  const proteinGrams = Math.round((target * 0.3) / 4);
  const carbGrams = Math.round((target * 0.45) / 4);
  const fatGrams = Math.round((target * 0.25) / 9);

  return (
    <div className="cr-panel">
      <div className="cr-gauge-wrap">
        <svg
          className="cr-gauge-svg"
          width="100"
          height="60"
          viewBox="0 0 120 70"
          role="img"
          aria-label={`Calorie target: ${target}`}
        >
          <defs>
            <clipPath id="cal-half">
              <rect x="0" y="0" width="120" height="65" />
            </clipPath>
          </defs>
          <circle
            cx="60"
            cy="65"
            r="52"
            fill="none"
            stroke="#97C459"
            strokeWidth="12"
            strokeDasharray="109 326"
            strokeDashoffset="-163"
            clipPath="url(#cal-half)"
          />
          <circle
            cx="60"
            cy="65"
            r="52"
            fill="none"
            stroke="#FAC775"
            strokeWidth="12"
            strokeDasharray="109 326"
            strokeDashoffset="-272"
            clipPath="url(#cal-half)"
          />
          <circle
            cx="60"
            cy="65"
            r="52"
            fill="none"
            stroke="#F09595"
            strokeWidth="12"
            strokeDasharray="108 326"
            strokeDashoffset="-381"
            clipPath="url(#cal-half)"
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
              transform: `rotate(${needleDeg(target, tdee)}deg)`,
              transition: "transform 0.5s ease",
            }}
          />
          <circle cx="60" cy="65" r="5" fill="#111111" />
        </svg>
        <div className="cr-score-block">
          <div className="cr-score">{target}</div>
          <div className="cr-score-label">kcal / day</div>
          <span className={`cr-badge ${badge}`}>{GOAL_LABELS[goal]}</span>
        </div>
      </div>
      <hr className="cr-divider" />
      <div>
        <div className="cr-bar-label">
          where you sit on the deficit → surplus scale
        </div>
        <div
          className="cr-bar-track"
          style={{
            background:
              "linear-gradient(to right, #97C459 0%, #FAC775 60%, #F09595 100%)",
          }}
        >
          <div
            className="cr-bar-thumb"
            style={{ left: `${barPct(target, tdee)}%` }}
          />
        </div>
        <div className="cr-bar-ticks">
          <span>−1000</span>
          <span>−500</span>
          <span>0</span>
          <span>+500</span>
          <span>+1000</span>
        </div>
      </div>
      <hr className="cr-divider" />
      <div className="cr-metrics-grid">
        <div className="cr-metric-card">
          <div className="cr-m-label">BMR</div>
          <div className="cr-m-value">{Math.round(bmr)}</div>
          <div className="cr-m-sub">at complete rest</div>
        </div>
        <div className="cr-metric-card">
          <div className="cr-m-label">TDEE</div>
          <div className="cr-m-value">{Math.round(tdee)}</div>
          <div className="cr-m-sub">total daily burn</div>
        </div>
        <div className="cr-metric-card">
          <div className="cr-m-label">Deficit / Surplus</div>
          <div className="cr-m-value">{target - Math.round(tdee)} kcal</div>
          <div className="cr-m-sub">vs. maintenance</div>
        </div>
        <div className="cr-metric-card">
          <div className="cr-m-label">Daily target</div>
          <div className="cr-m-value">{target}</div>
          <div className="cr-m-sub">recommended intake</div>
        </div>
      </div>
      <hr className="cr-divider" />
      <div>
        <div className="cr-world-title">Suggested macro split (30/45/25)</div>
        <div className="cr-world-bar-row">
          <span className="cr-w-label">Protein</span>
          <div className="cr-world-track">
            <div
              className="cr-world-fill"
              style={{ width: "30%", background: "#97C459" }}
            />
          </div>
          <span className="cr-w-pct">{proteinGrams}g</span>
        </div>
        <div className="cr-world-bar-row">
          <span className="cr-w-label">Carbs</span>
          <div className="cr-world-track">
            <div
              className="cr-world-fill"
              style={{ width: "45%", background: "#FAC775" }}
            />
          </div>
          <span className="cr-w-pct">{carbGrams}g</span>
        </div>
        <div className="cr-world-bar-row">
          <span className="cr-w-label">Fats</span>
          <div className="cr-world-track">
            <div
              className="cr-world-fill"
              style={{ width: "25%", background: "#F09595" }}
            />
          </div>
          <span className="cr-w-pct">{fatGrams}g</span>
        </div>
        <p className="cr-world-note">
          Macro split shown is a starting point — adjust protein higher (35–40%)
          if actively strength training.
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Main Calculator Page
───────────────────────────────────────── */
export default function CalorieCalculator() {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<Gender>("male");
  const [weight, setWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState<WeightUnit>("kg");
  const [heightUnit, setHeightUnit] = useState<HeightUnit>("cm");
  const [heightCm, setHeightCm] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [activity, setActivity] = useState<Activity>("moderate");
  const [goal, setGoal] = useState<Goal>("maintain");
  const [genderOpen, setGenderOpen] = useState(false);
  const [weightUnitOpen, setWeightUnitOpen] = useState(false);
  const [heightUnitOpen, setHeightUnitOpen] = useState(false);
  const [activityOpen, setActivityOpen] = useState(false);
  const [goalOpen, setGoalOpen] = useState(false);
  const [result, setResult] = useState<CalResult | null>(null);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const toggleFAQ = (i: number) => setOpenFAQ(openFAQ === i ? null : i);

  useEffect(() => {
    const a = Number(age);
    const w = Number(weight);
    if (!a || !w || a <= 0 || w <= 0) {
      setResult(null);
      return;
    }
    const weightKg = weightUnit === "kg" ? w : w * 0.453592;
    let heightCmVal = 0;
    if (heightUnit === "cm") {
      heightCmVal = Number(heightCm);
    } else {
      const ft = Number(heightFt);
      const inch = Number(heightIn) || 0;
      if (ft > 0) heightCmVal = ft * 30.48 + inch * 2.54;
    }
    if (!heightCmVal || heightCmVal <= 0) {
      setResult(null);
      return;
    }
    const bmr = mifflinBMR(weightKg, heightCmVal, a, gender);
    const tdee = bmr * ACTIVITY_MULT[activity];
    const targetRaw =
      goal === "lose" ? tdee - 500 : goal === "gain" ? tdee + 500 : tdee;
    const target = Math.round(targetRaw);
    setResult({ bmr, tdee, target, goal });
  }, [
    age,
    gender,
    weight,
    weightUnit,
    heightUnit,
    heightCm,
    heightFt,
    heightIn,
    activity,
    goal,
  ]);

  const handleCalculate = () => {
    /* auto via useEffect */
  };
  const handleClear = () => {
    setAge("");
    setWeight("");
    setHeightCm("");
    setHeightFt("");
    setHeightIn("");
    setGender("male");
    setActivity("moderate");
    setGoal("maintain");
    setWeightUnit("kg");
    setHeightUnit("cm");
    setResult(null);
  };

  /* ── FAQ data (also used for JSON-LD schema) ── */
  const faqs: [string, string][] = [
    [
      "How accurate is a calorie calculator?",
      "The resting metabolism half is reasonably reliable, typically landing within about ten percent for people of ordinary body composition. The activity multiplier is where the error lives, because it is a single coefficient summarising your whole week and you are the one choosing it. Moving one step up that scale changes the final figure by several hundred calories, which is more error than every other input combined.",
    ],
    [
      "Which activity level should I choose?",
      "The one below what you instinctively reach for, described against a typical week rather than your best one. Moderately active is the default almost everyone selects regardless of whether it fits. A gym membership is not attendance, and one hard session does not make a week active. If the resulting target proves too low, two weeks of weight data will show it and adjusting upward is straightforward.",
    ],
    [
      "How do I find my real maintenance calories?",
      "Measure rather than estimate. Eat at the calculated maintenance figure for fourteen days, weigh daily under the same conditions, and compare the week one and week two averages. Stable means the estimate is close, rising means it is too high, falling means it is too low. Adjust by about 200 kcal and repeat. Two rounds gets you closer than any equation, because it observes your actual expenditure instead of predicting it.",
    ],
    [
      "Why did I stop losing weight even though nothing changed?",
      "Partly because a smaller body needs less energy, and partly because spontaneous movement falls during a deficit — people sit more, move less between tasks, and take the lift without noticing the decision. Expenditure therefore drops somewhat beyond what the weight loss alone predicts. It is an expected feature of the process, and the response is a modest adjustment or a spell at maintenance, not a further large cut.",
    ],
    [
      "How big should my calorie deficit be?",
      "The largest one you can hold without it dominating your week. Around 500 kcal a day corresponds roughly to half a kilogram weekly, but a target adhered to at eighty percent for three months beats a stricter one abandoned after three. Larger deficits are faster on paper, harder to sustain, more likely to cost muscle, and more easily derailed by one disrupted week.",
    ],
    [
      "Why did I lose several kilos in the first week and then stall?",
      "Early weight change includes water and glycogen shifts that have nothing to do with fat, so the first week overstates progress and the apparent plateau that follows overstates failure. Judge progress on weekly averages across several weeks rather than on any single week, and particularly not on the first one.",
    ],
    [
      "Does the calculator work for muscular people?",
      "Less well. The standard equations were derived on typical body compositions and use total weight rather than composition, so a very muscular person tends to be underestimated and someone carrying a high proportion of fat tends to be overestimated. Muscle is metabolically active tissue and fat is much less so. In both cases the two-week test is a better answer than a different equation.",
    ],
    [
      "Is 1,200 calories a day safe?",
      "Below roughly 1,200 kcal for women and 1,500 for men, meeting micronutrient needs from food becomes genuinely difficult, and adherence usually suffers alongside. A calculated target that lands under those figures is a signal to lengthen the timeline rather than to eat less. Intakes below that range belong under medical supervision, not self-direction.",
    ],
    [
      "When should this calculator not be used at all?",
      "During pregnancy or breastfeeding, for children and adolescents, alongside a diagnosed eating disorder, and where a medical condition or medication affects appetite, absorption or metabolism. In each case requirements are managed against specific clinical guidance rather than a population equation, and a general estimate is more likely to mislead than to help.",
    ],
  ];

  return (
    <div className="page-layout">
      {/* FAQ JSON-LD schema for rich results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map(([q, a]) => ({
              "@type": "Question",
              name: q,
              acceptedAnswer: { "@type": "Answer", text: a },
            })),
          }),
        }}
      />

      <div className="single-page-padding">
        <h1>Calorie Calculator — Daily Needs, BMR and TDEE</h1>

        <p>
          Enter your age, gender, weight, height, and activity level to
          calculate your daily calorie target for weight loss, maintenance, or
          muscle gain. Uses the Mifflin-St Jeor formula — the most accurate BMR
          equation in use today. Results include your suggested macro split.
        </p>

        <div className="calc-card single-calc">
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              className="calc-input"
              type="number"
              placeholder="Age (years)"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              style={{ flex: 1 }}
            />
            <div
              className="modern-dropdown"
              style={{ flex: 1 }}
              onClick={() => setGenderOpen(!genderOpen)}
            >
              {gender === "male" ? "Male" : "Female"}
              <span className="dropdown-indicator">▼</span>
              {genderOpen && (
                <ul className="dropdown-list">
                  <li
                    onClick={(e) => {
                      e.stopPropagation();
                      setGender("male");
                      setGenderOpen(false);
                    }}
                  >
                    Male
                  </li>
                  <li
                    onClick={(e) => {
                      e.stopPropagation();
                      setGender("female");
                      setGenderOpen(false);
                    }}
                  >
                    Female
                  </li>
                </ul>
              )}
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <input
              className="calc-input"
              type="number"
              placeholder={`Weight (${weightUnit})`}
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              style={{ flex: 1 }}
            />
            <div
              className="modern-dropdown"
              style={{ flex: 1 }}
              onClick={() => setWeightUnitOpen(!weightUnitOpen)}
            >
              {weightUnit === "kg" ? "Weight in kg" : "Weight in lbs"}
              <span className="dropdown-indicator">▼</span>
              {weightUnitOpen && (
                <ul className="dropdown-list">
                  <li
                    onClick={(e) => {
                      e.stopPropagation();
                      setWeightUnit("kg");
                      setWeightUnitOpen(false);
                    }}
                  >
                    Weight in kg
                  </li>
                  <li
                    onClick={(e) => {
                      e.stopPropagation();
                      setWeightUnit("lbs");
                      setWeightUnitOpen(false);
                    }}
                  >
                    Weight in lbs
                  </li>
                </ul>
              )}
            </div>
          </div>

          <div
            className="modern-dropdown"
            onClick={() => setHeightUnitOpen(!heightUnitOpen)}
          >
            {heightUnit === "cm" ? "Height in cm" : "Height in ft / in"}
            <span className="dropdown-indicator">▼</span>
            {heightUnitOpen && (
              <ul className="dropdown-list">
                <li
                  onClick={(e) => {
                    e.stopPropagation();
                    setHeightUnit("cm");
                    setHeightUnitOpen(false);
                  }}
                >
                  Height in cm
                </li>
                <li
                  onClick={(e) => {
                    e.stopPropagation();
                    setHeightUnit("ftin");
                    setHeightUnitOpen(false);
                  }}
                >
                  Height in ft / in
                </li>
              </ul>
            )}
          </div>

          {heightUnit === "cm" ? (
            <input
              className="calc-input"
              type="number"
              placeholder="Height (cm)"
              value={heightCm}
              onChange={(e) => setHeightCm(e.target.value)}
            />
          ) : (
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                className="calc-input"
                type="number"
                placeholder="Feet"
                value={heightFt}
                onChange={(e) => setHeightFt(e.target.value)}
                style={{ flex: 1 }}
              />
              <input
                className="calc-input"
                type="number"
                placeholder="Inches"
                value={heightIn}
                onChange={(e) => setHeightIn(e.target.value)}
                style={{ flex: 1 }}
              />
            </div>
          )}

          <div
            className="modern-dropdown"
            onClick={() => setActivityOpen(!activityOpen)}
          >
            {ACTIVITY_LABELS[activity]}
            <span className="dropdown-indicator">▼</span>
            {activityOpen && (
              <ul className="dropdown-list">
                {(Object.keys(ACTIVITY_LABELS) as Activity[]).map((k) => (
                  <li
                    key={k}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActivity(k);
                      setActivityOpen(false);
                    }}
                  >
                    {ACTIVITY_LABELS[k]}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div
            className="modern-dropdown"
            onClick={() => setGoalOpen(!goalOpen)}
          >
            {GOAL_LABELS[goal]}
            <span className="dropdown-indicator">▼</span>
            {goalOpen && (
              <ul className="dropdown-list">
                {(Object.keys(GOAL_LABELS) as Goal[]).map((k) => (
                  <li
                    key={k}
                    onClick={(e) => {
                      e.stopPropagation();
                      setGoal(k);
                      setGoalOpen(false);
                    }}
                  >
                    {GOAL_LABELS[k]}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button className="calc-button" onClick={handleCalculate}>
              Calculate
            </button>
            <button className="calc-button calc-clear" onClick={handleClear}>
              Clear
            </button>
          </div>
        </div>

        <div className="cr-mobile-slot">
          <CalorieResultPanel result={result} />
        </div>

        {/* ---- SEO CONTENT ---- */}

        <h2>Treat the Result as a Hypothesis, Not a Measurement</h2>
        <p>
          A calorie calculator does not measure anything. It applies an equation
          derived from population averages to four inputs — age, sex, height and
          weight — and then multiplies by an activity factor you chose about
          yourself. The output is a well-reasoned starting estimate for a person
          with your characteristics, which is not the same as a correct number
          for you.
        </p>
        <p>
          That distinction matters because of how people use the figure. Treated
          as a measurement, a number that turns out to be 200 kcal off produces
          weeks of confusion and the conclusion that something is wrong with
          your metabolism. Treated as a starting hypothesis to be tested against
          two or three weeks of actual weight data, the same number does exactly
          what it should: it gets you close enough to start, and the results
          tell you the rest.
        </p>
        <p>
          The rest of this page is about where the error comes from, so you know
          which part of the estimate to distrust.
        </p>

        <h2>The Two Halves, and Which One Is Unreliable</h2>
        <p>
          Every daily calorie estimate is built in two stages.
        </p>
        <pre>
          BMR — energy used at complete rest{"\n"}× Activity factor — everything
          else you do{"\n"}= Daily energy expenditure
        </pre>
        <p>
          The first stage is comparatively trustworthy. Resting metabolism
          tracks closely with body size and composition, and the standard
          equations land within roughly ten percent for most people. The
          exceptions are predictable: the equations were built on typical body
          compositions, so a very muscular person is usually underestimated and
          someone carrying a high proportion of fat is usually overestimated,
          because muscle is metabolically active tissue and fat is much less so.
        </p>
        <p>
          The second stage is where the estimate becomes soft. The activity
          multiplier is a single coefficient asked to summarise a training
          schedule, a job, and how much you move without thinking about it —
          and you are the one choosing it.
        </p>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Typical label</th>
                <th>What it is meant to describe</th>
                <th>Why people pick it wrongly</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Sedentary</td>
                <td>Desk work, little deliberate exercise</td>
                <td>
                  Feels insulting, so it gets skipped by people it actually fits
                </td>
              </tr>
              <tr>
                <td>Lightly active</td>
                <td>Light exercise one to three days a week</td>
                <td>
                  A gym membership is counted rather than gym attendance
                </td>
              </tr>
              <tr>
                <td>Moderately active</td>
                <td>Moderate exercise three to five days a week</td>
                <td>
                  The default choice for almost everyone, regardless of fit
                </td>
              </tr>
              <tr>
                <td>Very active</td>
                <td>Hard exercise six or seven days a week</td>
                <td>
                  Intensity of individual sessions is confused with weekly
                  volume
                </td>
              </tr>
              <tr>
                <td>Extra active</td>
                <td>Physical job plus daily training</td>
                <td>
                  Chosen after an unusually heavy week rather than a typical one
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          Moving one step up this scale changes the final figure by a few
          hundred calories a day. That single dropdown carries more error than
          every other input combined, which is why two people with identical
          bodies can walk away with targets hundreds of calories apart.
        </p>
        <p>
          The practical advice is to choose the level below the one you
          instinctively reach for, and describe a typical week rather than your
          best one. If the resulting target proves too low, the weight data will
          tell you within a fortnight and adjusting upward is easy.
        </p>

        <h2>The Part No Equation Sees</h2>
        <p>
          Deliberate exercise is the component people focus on and it is rarely
          the largest variable. The energy spent on unplanned movement —
          fidgeting, standing, walking between rooms, gesturing, taking stairs
          without deciding to — varies enormously between individuals of similar
          size, and no calculator asks about it because nobody can report it
          accurately.
        </p>
        <p>
          It also moves on its own. When intake drops, spontaneous movement
          tends to fall with it: people in a deficit sit more, move less between
          tasks, and take the lift without noticing any decision. Expenditure
          therefore declines somewhat beyond what the smaller body alone would
          predict, which is part of why an initially effective deficit stops
          producing results after several weeks even when adherence has not
          slipped.
        </p>
        <p>
          This is worth knowing mostly so that a stall is read correctly. It is
          an expected feature of the process rather than evidence of a broken
          metabolism, and the response is a modest adjustment or a period at
          maintenance, not a further large cut.
        </p>

        <h2>Setting a Deficit That Survives Contact With Real Life</h2>
        <p>
          The arithmetic of a deficit is simple. Roughly 7,700 kcal is
          associated with a kilogram of body mass, so a daily shortfall of
          around 500 kcal corresponds to something in the region of half a
          kilogram a week.
        </p>
        <p>
          Two qualifications keep that from being taken too literally. Early
          weight change includes water and glycogen shifts that have nothing to
          do with fat, so the first week overstates progress and a subsequent
          plateau overstates failure. And the equation assumes expenditure holds
          constant, which the previous section explains it does not.
        </p>
        <p>
          A more useful way to choose a deficit is by what it costs you.
        </p>
        <ul className="custom-list">
          <li>
            A small deficit is slow, barely noticeable, and easy to hold for
            months. It is almost always the right choice for someone with no
            deadline.
          </li>
          <li>
            A large deficit is faster on paper, harder to sustain, more likely
            to cost muscle alongside fat, and far more vulnerable to a single
            disrupted week.
          </li>
          <li>
            The best deficit is the largest one you can maintain without it
            dominating your week. A target that is adhered to at eighty percent
            for three months beats a stricter one abandoned in three weeks.
          </li>
        </ul>
        <p>
          Protein intake deserves separate attention during a deficit, because
          it is the main lever for keeping the weight you lose weighted toward
          fat rather than muscle. Our{" "}
          <Link href="/body-fat-calculator/" className="my-link">
            body fat calculator
          </Link>{" "}
          is the tool for checking whether that is actually happening — the
          scale alone cannot distinguish the two.
        </p>

        <h2>Testing Your Own Number</h2>
        <p>
          Two weeks of data beats any equation. The method is deliberately
          unglamorous.
        </p>
        <ul className="custom-list">
          <li>
            Eat at the calculated maintenance figure, without a deficit, for
            fourteen days.
          </li>
          <li>
            Weigh yourself daily under the same conditions and use the weekly
            average rather than any single reading. Day-to-day fluctuation is
            mostly water and gut contents.
          </li>
          <li>
            Compare week one and week two averages. Stable means the estimate is
            close. Rising means it is too high; falling means it is too low.
          </li>
          <li>
            Adjust by around 200 kcal in the indicated direction and repeat.
            Two rounds of this will get you closer than any equation can.
          </li>
        </ul>
        <p>
          The reason this works is that it measures the one thing the calculator
          cannot: your actual expenditure, including all the parts nobody can
          report. It replaces an estimate with an observation.
        </p>

        <h2>Where the Number Should Not Be Used</h2>
        <p>
          Calorie estimates are built on data from healthy adults and assume
          nothing unusual is happening physiologically. They do not apply during
          pregnancy or breastfeeding, where requirements change substantially
          and are managed against pregnancy-specific guidance. They do not apply
          to children and adolescents, whose needs are dominated by growth. They
          should not be used to plan intake alongside a diagnosed eating
          disorder, or where a medical condition or medication affects appetite,
          absorption or metabolism, and they are not a substitute for a dietitian
          where one is involved in your care.
        </p>
        <p>
          Very low intakes carry their own problems regardless of what any
          arithmetic suggests. Below roughly 1,200 kcal for women and 1,500 for
          men, meeting micronutrient requirements from food becomes difficult,
          and a calculated target landing below those figures is a signal to
          extend the timeline rather than to eat less.
        </p>
        <p>
          For a fuller walkthrough of setting and adjusting a target, see our
          guide on{" "}
          <Link
            href="/blog/how-many-calories-to-lose-weight/"
            className="my-link"
          >
            how many calories to eat to lose weight
          </Link>
          . For where your weight sits relative to height, the{" "}
          <Link href="/bmi-calculator/" className="my-link">
            BMI calculator
          </Link>{" "}
          is a quick starting reference.
        </p>
        <section>
          <h2>Questions About Calorie Targets</h2>

          {faqs.map(([q, a], i) => {
            const isOpen = openFAQ === i;
            return (
              <div className="faq-item" key={i}>
                <h3
                  onClick={() => toggleFAQ(i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${i}`}
                  role="button"
                  tabIndex={0}
                >
                  {q}
                  <i
                    className={`fa-solid fa-chevron-down ${isOpen ? "rotate" : ""}`}
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
        </section>

        <ReviewedBy medical />
      </div>

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="cr-desktop-slot">
          <CalorieResultPanel result={result} />
        </div>
        <div className="sidebar-box">
          <p style={{ fontSize: "18px", fontWeight: 600, margin: "0 0 12px" }}>
            Related Calculators
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {[
              ["/bmi-calculator/", "BMI Calculator"],
              ["/body-fat-calculator/", "Body Fat Calculator"],
              ["/dose-calculator/", "Dose Calculator"],
              ["/iv-calculator/", "IV Calculator"],
            ].map(([href, label]) => (
              <li key={href} style={{ marginBottom: "6px" }}>
                <Link href={href} className="my-link">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
