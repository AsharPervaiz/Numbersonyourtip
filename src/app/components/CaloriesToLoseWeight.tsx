"use client";
import { useState } from "react";
import Link from "next/link";
import "@fortawesome/fontawesome-free/css/all.min.css";
import BlogSidebar from "./BlogSidebar";
import ReviewedBy from "./ReviewedBy";

export default function CaloriesToLoseWeight() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const toggleFAQ = (i: number) => setOpenFAQ(openFAQ === i ? null : i);

  /* ── FAQ data (also used for JSON-LD schema) ── */
  const faqs: [string, string][] = [
    [
      "How many calories should I eat to lose weight?",
      "For most adults, subtract 500 calories from your TDEE (Total Daily Energy Expenditure) for steady weight loss of about 1 pound per week. To lose 2 pounds per week, subtract 1,000 calories from your TDEE. Never go below 1,200 calories per day for women or 1,500 for men without medical supervision — extreme restriction backfires by triggering muscle loss and metabolic adaptation.",
    ],
    [
      "How many calories should a woman eat to lose weight?",
      "The average moderately active woman needs about 2,000–2,200 calories per day to maintain her weight. For weight loss, target 1,500–1,700 calories daily — a 500-calorie deficit that produces steady loss of about 1 pound per week. Never drop below 1,200 calories per day without medical supervision. For a personalized number, calculate your TDEE with our calorie calculator.",
    ],
    [
      "How many calories should a man eat to lose weight?",
      "The average moderately active man needs about 2,500–2,800 calories per day to maintain his weight. For weight loss, target 2,000–2,300 calories daily — a 500-calorie deficit produces roughly 1 pound of loss per week. Never drop below 1,500 calories per day without medical supervision. Muscle mass and activity level significantly influence this number.",
    ],
    [
      "Is 1,200 calories a day too low?",
      "1,200 calories per day is the absolute minimum recommended for most women to meet essential nutrient needs, and it's generally too low for men. Eating below your BMR for extended periods triggers muscle loss, metabolic adaptation (slower calorie burn), hormonal imbalance, fatigue, and severe nutrient deficiencies. If your TDEE calculation suggests you need to eat under 1,200, consult a registered dietitian rather than following that number blindly.",
    ],
    [
      "Why am I not losing weight in a calorie deficit?",
      "The most common reasons are: (1) underestimating your actual calorie intake — restaurant meals and untracked drinks add hundreds of calories, (2) overestimating your calorie burn from exercise — fitness trackers overestimate by 20–40%, (3) water retention from stress, sodium, or hormonal cycles masking real fat loss, and (4) genuine metabolic adaptation after 4+ weeks of dieting. Track everything meticulously for two weeks before concluding your deficit isn't working.",
    ],
    [
      "How much weight can I lose in a month safely?",
      "A safe, sustainable rate is 4–8 pounds per month for most adults (1–2 pounds per week). Losing more than 2 pounds per week beyond the first week is usually water weight or muscle loss, not fat. Very obese individuals may safely lose 3+ pounds per week initially under medical supervision, but average adults chasing faster loss almost always end up losing muscle and rebounding.",
    ],
    [
      "Do I need to count calories to lose weight?",
      "Not literally — but you do need to create a calorie deficit somehow. Some people succeed with structured meal plans, high-protein/high-fiber approaches that naturally reduce intake, or portion-controlled meal delivery, without tracking every calorie. However, tracking for at least 2–4 weeks is the fastest way to learn what your food actually contains. Most people underestimate their intake by 300–800 calories per day without realizing it.",
    ],
    [
      "What is TDEE and how do I calculate it?",
      "TDEE (Total Daily Energy Expenditure) is the total number of calories your body burns in a day, including your basal metabolic rate (BMR), physical activity, and the thermic effect of food. It's calculated by multiplying your BMR by an activity factor: 1.2 for sedentary, 1.375 for lightly active, 1.55 for moderately active, 1.725 for very active, and 1.9 for extremely active. Our calorie calculator uses the Mifflin-St Jeor formula to compute this automatically.",
    ],
    [
      "Can I lose weight without exercising?",
      "Yes — weight loss is primarily driven by calorie deficit, not exercise. Diet accounts for roughly 80% of weight loss results. However, exercise (especially resistance training) is critical for preserving muscle during a deficit, improving metabolic rate, and maintaining weight loss long-term. You can lose weight without training, but you won't look or feel as good, and the weight is more likely to come back.",
    ],
    [
      "How long will it take to lose 20 pounds?",
      "At a moderate 1 pound per week deficit (500 calories below TDEE), losing 20 pounds takes about 20 weeks — roughly 5 months. At a more aggressive 2 pounds per week (1,000 calorie deficit), it takes about 10 weeks or 2.5 months, but this pace is only sustainable for people well above their goal weight. Expect the last 5 pounds to slow considerably as your body adapts.",
    ],
    [
      "What foods should I eat to lose weight?",
      "Prioritize high-protein foods (chicken, fish, eggs, Greek yogurt, tofu, cottage cheese), high-fiber vegetables and fruits, and complex carbs (oats, quinoa, brown rice, sweet potatoes). These foods produce satiety per calorie — meaning you feel fuller on fewer calories. Minimize ultra-processed foods, sugary drinks, and alcohol, which pack calories without keeping you full.",
    ],
    [
      "Should I do keto, intermittent fasting, or just count calories?",
      "All three work for weight loss because they all create a calorie deficit — the mechanism is the same. Choose based on what fits your lifestyle: intermittent fasting suits people who don't like breakfast; keto suits people who overeat carbs; calorie counting suits people who want flexibility. There's no evidence any specific approach beats the others for fat loss when calories and protein are equated. Adherence matters far more than the method.",
    ],
  ];

  return (
    <div className="blog-container">
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

      {/* MAIN CONTENT */}
      <div className="blog-content">
        {/* HERO IMAGE */}
        <img
          src="/blog9.1.webp"
          className="image-blog"
          alt="How Many Calories Should I Eat to Lose Weight? — TDEE and deficit guide"
        />

        {/* META */}
        <div className="content-blog">
          <small
            className="meta-blog"
            style={{ display: "flex", alignItems: "center", gap: "40px" }}
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontWeight: 600,
                color: "#888",
                fontSize: "14px",
              }}
            >
              <Link href="/author/ashar-pervaiz/" className="byline-author">
              <img
                className="founder-photo"
                src="/founder_photo.webp"
                alt="Ashar Pervaiz, founder of Numbers On Your Tip"
              />
              Ashar Pervaiz
              </Link>
            </span>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontWeight: 600,
                color: "#888",
                fontSize: "14px",
              }}
            >
              <i className="custom-meta-icon fa-solid fa-calendar" />
              26 July 2026
            </span>
          </small>
        </div>

        <article>
          {/* HEADER */}
          <header>
            <h1>
              How Many Calories Should I Eat to Lose Weight? The Complete 2026
              Guide
            </h1>
            <p>
              &quot;How many calories should I eat to lose weight?&quot; is one
              of the most searched health questions on Google, and for good
              reason — get this number wrong, and you either don&apos;t lose
              weight or you lose it in ways that hurt your body. This complete
              guide breaks down exactly how to calculate your daily calorie
              target for fat loss using the proven Mifflin-St Jeor formula,
              backed by the latest 2026 research on metabolism, weight loss
              plateaus, and sustainable dieting.
            </p>
          </header>

          {/* FEATURED SNIPPET */}
          <section
            style={{
              backgroundColor: "#1F9FB8",
              color: "white",
              padding: "20px",
              borderLeft: "6px solid #1B3066",
              borderRadius: "0 8px 8px 0",
              marginBottom: "40px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
            }}
          >
            <h2 style={{ color: "white" }}>
              Quick Answer: How Many Calories to Lose Weight?
            </h2>
            <p style={{ marginBottom: "0", color: "white" }}>
              To lose weight, eat <strong>500 calories per day less</strong>{" "}
              than your TDEE (Total Daily Energy Expenditure). This creates a
              weekly deficit of 3,500 calories, which equals{" "}
              <strong>1 pound of fat loss per week</strong>. The average
              moderately active adult woman needs about{" "}
              <strong>1,500–1,700 calories</strong> and man needs{" "}
              <strong>2,000–2,300 calories</strong> daily to lose weight
              healthily. Never eat below 1,200 calories per day (women) or 1,500
              (men) without medical supervision.
            </p>
          </section>

          {/* INTRO */}
          <section id="the-real-answer" style={{ marginBottom: "40px" }}>
            <h2>The Truth About Calorie Counting for Weight Loss</h2>
            <p>
              Weight loss comes down to one immutable principle:{" "}
              <strong>calories in versus calories out</strong>. When you
              consistently consume fewer calories than your body burns, your
              body taps into stored fat for energy — and you lose weight. This
              is not a fad, a hack, or a secret. It&apos;s basic thermodynamics,
              backed by decades of clinical research.
            </p>
            <p>
              However, the specific number of calories YOU need to lose weight
              is unique to you. It depends on your age, gender, height, weight,
              activity level, and how much weight you want to lose. There is no
              universal &quot;magic number&quot; that works for everyone. This
              guide will help you find yours — and, crucially, show you how to
              adjust it when your first estimate stops working.
            </p>

            <div
              style={{
                backgroundColor: "#fef7e0",
                borderLeft: "5px solid #F59E0B",
                padding: "15px",
                borderRadius: "0 8px 8px 0",
                margin: "20px 0",
              }}
            >
              <p style={{ margin: "0", fontSize: "0.95rem" }}>
                <strong>⚠️ Important Reality Check:</strong> If someone tells
                you weight loss doesn&apos;t come down to calories, they&apos;re
                either selling something or confused about what &quot;a
                calorie&quot; actually is in a physiological context. Every
                credible obesity researcher confirms the calorie balance
                principle.
              </p>
            </div>
          </section>

          {/* STEP-BY-STEP */}
          <section id="calculate-target" style={{ marginBottom: "40px" }}>
            <h2>How to Calculate Your Exact Daily Calorie Target</h2>
            <p>
              Finding your correct calorie target for weight loss involves 3
              steps. Follow each carefully — this is the exact process
              nutritionists use with their clients.
            </p>

            {/* STEP 1 */}
            <div
              style={{
                padding: "20px",
                border: "1px solid #c4c4c4",
                borderRadius: "8px",
                position: "relative",
                marginTop: "20px",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: "-15px",
                  left: "20px",
                  backgroundColor: "#1B3066",
                  color: "#ffffff",
                  padding: "5px 15px",
                  borderRadius: "20px",
                  fontWeight: "bold",
                }}
              >
                Step 1: Calculate Your BMR
              </span>
              <p style={{ paddingTop: "8px", marginBottom: "12px" }}>
                Your <strong>Basal Metabolic Rate (BMR)</strong> is the number
                of calories your body burns at complete rest — just to keep your
                heart beating, lungs working, and brain functioning. Use the
                Mifflin-St Jeor formula (the most accurate BMR formula
                available):
              </p>
              <div
                style={{
                  backgroundColor: "#f4f4f8",
                  padding: "15px",
                  borderRadius: "8px",
                  fontFamily: "monospace",
                }}
              >
                <p style={{ margin: "0 0 10px 0" }}>
                  <strong>Men:</strong> BMR = (10 × weight in kg) + (6.25 ×
                  height in cm) − (5 × age) + 5
                </p>
                <p style={{ margin: "0" }}>
                  <strong>Women:</strong> BMR = (10 × weight in kg) + (6.25 ×
                  height in cm) − (5 × age) − 161
                </p>
              </div>
              <p style={{ marginTop: "15px", marginBottom: "0" }}>
                <strong>Example:</strong> A 35-year-old woman, 165 cm, 70 kg.
                BMR = (10 × 70) + (6.25 × 165) − (5 × 35) − 161 ={" "}
                <strong>1,395 calories</strong>.
              </p>
            </div>

            {/* STEP 2 */}
            <div
              style={{
                padding: "20px",
                border: "1px solid #c4c4c4",
                borderRadius: "8px",
                position: "relative",
                marginTop: "25px",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: "-15px",
                  left: "20px",
                  backgroundColor: "#1B3066",
                  color: "#ffffff",
                  padding: "5px 15px",
                  borderRadius: "20px",
                  fontWeight: "bold",
                }}
              >
                Step 2: Calculate Your TDEE
              </span>
              <p style={{ paddingTop: "8px", marginBottom: "12px" }}>
                Your <strong>Total Daily Energy Expenditure (TDEE)</strong> is
                your BMR multiplied by your activity level. This is the total
                number of calories you burn in a day.
              </p>

              <div style={{ overflowX: "auto", margin: "20px 0" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    marginBottom: "15px",
                    fontSize: "0.95rem",
                  }}
                >
                  <thead>
                    <tr style={{ backgroundColor: "#1b3067", color: "#fff" }}>
                      <th
                        style={{
                          padding: "10px",
                          border: "1px solid #ddd",
                          textAlign: "left",
                        }}
                      >
                        Activity Level
                      </th>
                      <th
                        style={{
                          padding: "10px",
                          border: "1px solid #ddd",
                          textAlign: "left",
                        }}
                      >
                        Multiplier
                      </th>
                      <th
                        style={{
                          padding: "10px",
                          border: "1px solid #ddd",
                          textAlign: "left",
                        }}
                      >
                        Who Fits Here
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Sedentary", "1.2", "Desk job, minimal walking"],
                      ["Lightly active", "1.375", "Light exercise 1–3 days/week"],
                      [
                        "Moderately active",
                        "1.55",
                        "Moderate exercise 3–5 days/week",
                      ],
                      ["Very active", "1.725", "Hard exercise 6–7 days/week"],
                      [
                        "Extremely active",
                        "1.9",
                        "Athlete or physical labour job",
                      ],
                    ].map(([level, mult, desc], i) => (
                      <tr
                        key={i}
                        style={{
                          backgroundColor: i % 2 === 0 ? "#fff" : "#f9f9f9",
                        }}
                      >
                        <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                          {level}
                        </td>
                        <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                          {mult}
                        </td>
                        <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                          {desc}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p style={{ marginBottom: "0" }}>
                <strong>Example continued:</strong> Our 35-year-old woman is
                moderately active. TDEE = 1,395 × 1.55 ={" "}
                <strong>2,162 calories</strong>. This is the amount she needs to
                maintain her current weight.
              </p>
            </div>

            {/* STEP 3 */}
            <div
              style={{
                padding: "20px",
                border: "1px solid #c4c4c4",
                borderRadius: "8px",
                position: "relative",
                marginTop: "25px",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: "-15px",
                  left: "20px",
                  backgroundColor: "#1B3066",
                  color: "#ffffff",
                  padding: "5px 15px",
                  borderRadius: "20px",
                  fontWeight: "bold",
                }}
              >
                Step 3: Subtract Your Deficit
              </span>
              <p style={{ paddingTop: "8px", marginBottom: "15px" }}>
                For sustainable weight loss, subtract a specific number of
                calories from your TDEE:
              </p>

              <ul style={{ paddingLeft: "20px", lineHeight: "1.8" }}>
                <li>
                  <strong>Mild loss (0.5 lb/week):</strong> Subtract 250
                  calories
                </li>
                <li>
                  <strong>Moderate loss (1 lb/week — recommended):</strong>{" "}
                  Subtract 500 calories
                </li>
                <li>
                  <strong>Aggressive loss (2 lb/week):</strong> Subtract 1,000
                  calories (only for overweight/obese individuals)
                </li>
              </ul>

              <div
                style={{
                  backgroundColor: "#f0fdf4",
                  borderLeft: "5px solid #16A34A",
                  padding: "15px",
                  borderRadius: "0 8px 8px 0",
                  margin: "15px 0",
                }}
              >
                <p style={{ margin: "0" }}>
                  <strong>Final Answer:</strong> Our example woman with TDEE of
                  2,162 should eat <strong>1,662 calories daily</strong> to lose
                  1 pound per week (2,162 − 500 = 1,662).
                </p>
              </div>
            </div>

            <p style={{ marginTop: "25px" }}>
              Skip the manual math and use our{" "}
              <Link href="/calorie-calculator/" className="my-link">
                free calorie calculator
              </Link>{" "}
              to instantly find your BMR, TDEE, and personalized calorie target
              for any weight loss goal.
            </p>
          </section>

          <img
            src="/blog9.2.webp"
            className="image-blog"
            alt="Calorie calculator planning weekly meals and macros"
          />

          {/* CALORIES BY DEMOGRAPHIC */}
          <section
            id="calorie-recommendations"
            style={{ marginBottom: "40px" }}
          >
            <h2>
              Calorie Recommendations by Age &amp; Gender (2026 Guidelines)
            </h2>
            <p>
              The following recommendations are based on the 2020–2025 Dietary
              Guidelines for Americans (updated targets for 2026), representing
              average calorie needs for adults in the U.S. Use these as a
              baseline reference — your specific number will vary.
            </p>

            <h3>Daily Calorie Needs — Women</h3>
            <div style={{ overflowX: "auto", margin: "20px 0" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  marginBottom: "20px",
                  fontSize: "1rem",
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: "#1b3067", color: "#fff" }}>
                    <th
                      style={{
                        padding: "12px",
                        border: "1px solid #ddd",
                        textAlign: "left",
                      }}
                    >
                      Age
                    </th>
                    <th
                      style={{
                        padding: "12px",
                        border: "1px solid #ddd",
                        textAlign: "center",
                      }}
                    >
                      Sedentary
                    </th>
                    <th
                      style={{
                        padding: "12px",
                        border: "1px solid #ddd",
                        textAlign: "center",
                      }}
                    >
                      Moderate
                    </th>
                    <th
                      style={{
                        padding: "12px",
                        border: "1px solid #ddd",
                        textAlign: "center",
                      }}
                    >
                      Active
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["19–30", "2,000", "2,200", "2,400"],
                    ["31–50", "1,800", "2,000", "2,200"],
                    ["51+", "1,600", "1,800", "2,000–2,200"],
                  ].map(([age, sed, mod, act], i) => (
                    <tr
                      key={i}
                      style={{
                        backgroundColor: i % 2 === 0 ? "#fff" : "#f9f9f9",
                      }}
                    >
                      <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                        {age}
                      </td>
                      <td
                        style={{
                          padding: "12px",
                          border: "1px solid #ddd",
                          textAlign: "center",
                        }}
                      >
                        {sed}
                      </td>
                      <td
                        style={{
                          padding: "12px",
                          border: "1px solid #ddd",
                          textAlign: "center",
                        }}
                      >
                        {mod}
                      </td>
                      <td
                        style={{
                          padding: "12px",
                          border: "1px solid #ddd",
                          textAlign: "center",
                        }}
                      >
                        {act}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3>Daily Calorie Needs — Men</h3>
            <div style={{ overflowX: "auto", margin: "20px 0" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  marginBottom: "20px",
                  fontSize: "1rem",
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: "#1b3067", color: "#fff" }}>
                    <th
                      style={{
                        padding: "12px",
                        border: "1px solid #ddd",
                        textAlign: "left",
                      }}
                    >
                      Age
                    </th>
                    <th
                      style={{
                        padding: "12px",
                        border: "1px solid #ddd",
                        textAlign: "center",
                      }}
                    >
                      Sedentary
                    </th>
                    <th
                      style={{
                        padding: "12px",
                        border: "1px solid #ddd",
                        textAlign: "center",
                      }}
                    >
                      Moderate
                    </th>
                    <th
                      style={{
                        padding: "12px",
                        border: "1px solid #ddd",
                        textAlign: "center",
                      }}
                    >
                      Active
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["19–30", "2,400", "2,600–2,800", "3,000"],
                    ["31–50", "2,200", "2,400–2,600", "2,800–3,000"],
                    ["51+", "2,000", "2,200–2,400", "2,400–2,800"],
                  ].map(([age, sed, mod, act], i) => (
                    <tr
                      key={i}
                      style={{
                        backgroundColor: i % 2 === 0 ? "#fff" : "#f9f9f9",
                      }}
                    >
                      <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                        {age}
                      </td>
                      <td
                        style={{
                          padding: "12px",
                          border: "1px solid #ddd",
                          textAlign: "center",
                        }}
                      >
                        {sed}
                      </td>
                      <td
                        style={{
                          padding: "12px",
                          border: "1px solid #ddd",
                          textAlign: "center",
                        }}
                      >
                        {mod}
                      </td>
                      <td
                        style={{
                          padding: "12px",
                          border: "1px solid #ddd",
                          textAlign: "center",
                        }}
                      >
                        {act}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p>
              Subtract 500 calories from your maintenance number to find your
              weight loss target. For example, a moderately active 40-year-old
              woman maintaining at 2,000 would eat 1,500 to lose weight.
            </p>
          </section>

          {/* NEW SECTION — TIME TO LOSE X POUNDS */}
          <section id="how-long-to-lose" style={{ marginBottom: "40px" }}>
            <h2>How Long Will It Take to Lose 10, 20, or 50 Pounds?</h2>
            <p>
              One of the most common follow-up questions after &quot;how many
              calories?&quot; is &quot;how long will this take?&quot; The math
              is simple, but reality is bumpier than the math suggests.
              Here&apos;s what to realistically expect at each level of deficit.
            </p>

            <div style={{ overflowX: "auto", margin: "20px 0" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "0.97rem",
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: "#1B3066", color: "white" }}>
                    <th style={{ padding: "12px", textAlign: "left" }}>
                      Weight to Lose
                    </th>
                    <th style={{ padding: "12px", textAlign: "center" }}>
                      At 0.5 lb/week
                    </th>
                    <th style={{ padding: "12px", textAlign: "center" }}>
                      At 1 lb/week
                    </th>
                    <th style={{ padding: "12px", textAlign: "center" }}>
                      At 2 lb/week
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["5 lbs", "10 weeks", "5 weeks", "2.5 weeks"],
                    ["10 lbs", "20 weeks", "10 weeks", "5 weeks"],
                    [
                      "20 lbs",
                      "40 weeks / ~9 months",
                      "20 weeks / ~5 months",
                      "10 weeks / ~2.5 months",
                    ],
                    [
                      "30 lbs",
                      "60 weeks / ~14 months",
                      "30 weeks / ~7 months",
                      "15 weeks / ~3.5 months",
                    ],
                    ["50 lbs", "~2 years", "~1 year", "~6 months"],
                    ["100 lbs", "~4 years", "~2 years", "~1 year"],
                  ].map(([wt, half, one, two], i) => (
                    <tr
                      key={i}
                      style={{
                        backgroundColor: i % 2 === 0 ? "#fff" : "#f7f9ff",
                      }}
                    >
                      <td
                        style={{
                          padding: "12px",
                          border: "1px solid #e8edf5",
                          fontWeight: 700,
                          color: "#1B3066",
                        }}
                      >
                        {wt}
                      </td>
                      <td
                        style={{
                          padding: "12px",
                          border: "1px solid #e8edf5",
                          textAlign: "center",
                        }}
                      >
                        {half}
                      </td>
                      <td
                        style={{
                          padding: "12px",
                          border: "1px solid #e8edf5",
                          textAlign: "center",
                        }}
                      >
                        {one}
                      </td>
                      <td
                        style={{
                          padding: "12px",
                          border: "1px solid #e8edf5",
                          textAlign: "center",
                        }}
                      >
                        {two}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p>Real-world caveats these theoretical numbers don&apos;t show:</p>
            <ul style={{ paddingLeft: "20px", lineHeight: "1.9" }}>
              <li>
                <strong>Week 1 is misleading.</strong> Most people lose 3–8
                pounds in the first week from water and glycogen depletion — not
                fat. The steady 1 lb/week trend usually starts in week 3 or 4.
              </li>
              <li>
                <strong>The last 5–10 pounds slow dramatically.</strong> As you
                get leaner, your TDEE drops (smaller body = fewer calories
                burned), and hormonal signals encourage food-seeking behavior.
                Expect the last 10 pounds to take 30–50% longer than the same
                weight earlier in your journey.
              </li>
              <li>
                <strong>Plateaus are guaranteed.</strong> After 8–12 weeks in a
                deficit, most people hit a 2–4 week plateau where the scale
                doesn&apos;t budge despite eating correctly. This is metabolic
                adaptation and it&apos;s normal.
              </li>
              <li>
                <strong>2 lb/week is unrealistic long-term for most.</strong> It
                works for very overweight or obese individuals starting out, but
                rarely for anyone under 200 lbs. Aiming for 1 lb/week produces
                better retention and less muscle loss.
              </li>
            </ul>

            <p>
              If your goal is 20+ pounds, plan for the journey to take{" "}
              <em>at least</em> the theoretical time plus 20%, and build a
              routine you could sustain for that long. Weight loss timelines
              that look ambitious on paper almost always underestimate how much
              metabolism and lifestyle push back over time.
            </p>
          </section>

          {/* WHY DIETS FAIL */}
          <section id="why-diets-fail" style={{ marginBottom: "40px" }}>
            <h2>Why Popular Diets Fail (And What Actually Works)</h2>
            <p>
              You&apos;ve seen the ads: keto, intermittent fasting, carnivore,
              Mediterranean, Whole30. Some work brilliantly for some people.
              Others fail spectacularly for others. Why? Because at their core,
              they all work through the same mechanism —{" "}
              <strong>creating a calorie deficit</strong> — but they achieve it
              through different strategies.
            </p>

            <h3>What All Successful Diets Have in Common</h3>
            <ul style={{ paddingLeft: "20px", lineHeight: "1.9" }}>
              <li>
                <strong>They reduce total calorie intake</strong> — whether by
                cutting food groups, restricting time windows, or focusing on
                filling foods.
              </li>
              <li>
                <strong>They&apos;re sustainable for the individual</strong> —
                the best diet is the one you can actually stick to for 6+
                months.
              </li>
              <li>
                <strong>They prioritize protein and fiber</strong> — the two
                most satiating macronutrients, which reduce hunger.
              </li>
            </ul>

            <h3>Why People Fail at Weight Loss</h3>
            <ul style={{ paddingLeft: "20px", lineHeight: "1.9" }}>
              <li>
                <strong>Underestimating calories:</strong> Studies consistently
                show people underestimate their calorie intake by{" "}
                <strong>25–40%</strong>. That &quot;small handful&quot; of nuts
                might be 300 calories. That &quot;healthy&quot; smoothie: 600.
              </li>
              <li>
                <strong>Overestimating exercise burns:</strong> Fitness trackers
                overestimate calorie burns by 20–40%. Running 5 km doesn&apos;t
                burn as many calories as your watch says.
              </li>
              <li>
                <strong>Weekend calorie blowouts:</strong> Eating perfectly
                Monday–Friday, then consuming 3,000+ calories on Saturday and
                Sunday can completely erase your weekly deficit.
              </li>
              <li>
                <strong>Ignoring liquid calories:</strong> Alcohol, sodas, fancy
                coffee drinks, and juice can add 500–1,000 unnoticed calories
                daily.
              </li>
            </ul>
          </section>

          {/* MISTAKES */}
          <section id="calorie-mistakes" style={{ marginBottom: "40px" }}>
            <h2>7 Common Calorie Counting Mistakes That Kill Weight Loss</h2>
            <ol style={{ paddingLeft: "20px", lineHeight: "1.9" }}>
              <li style={{ marginBottom: "10px" }}>
                <strong>Cutting calories too aggressively.</strong> Going below
                1,200 (women) or 1,500 (men) causes muscle loss, metabolic
                adaptation, and rebound weight gain.
              </li>
              <li style={{ marginBottom: "10px" }}>
                <strong>Not tracking cooking oils and dressings.</strong> That
                &quot;healthy salad&quot; with 2 tablespoons of olive oil adds
                240 hidden calories.
              </li>
              <li style={{ marginBottom: "10px" }}>
                <strong>Eyeballing portion sizes.</strong> Serving sizes have
                doubled or tripled since the 1970s. Use a food scale for the
                first month to calibrate your eye.
              </li>
              <li style={{ marginBottom: "10px" }}>
                <strong>Ignoring protein intake.</strong> Not eating enough
                protein (aim for 0.7–1 gram per pound of body weight) causes
                muscle loss during a deficit, which drops your TDEE and stalls
                progress.
              </li>
              <li style={{ marginBottom: "10px" }}>
                <strong>Weighing yourself daily and panicking.</strong> Water
                weight fluctuates 2–5 pounds daily. Weigh weekly at the same
                time, in the same conditions.
              </li>
              <li style={{ marginBottom: "10px" }}>
                <strong>Compensating with more exercise.</strong> Exercise
                accounts for only 10–20% of daily calorie burn. Diet is 80% of
                the equation.
              </li>
              <li>
                <strong>Setting unrealistic timelines.</strong> Losing 20 lbs in
                a month sounds great but is almost always unsustainable and
                often unsafe.
              </li>
            </ol>
          </section>

          {/* PLATEAUS */}
          <section id="plateaus" style={{ marginBottom: "40px" }}>
            <h2>
              Weight Loss Plateaus: Why They Happen &amp; How to Break Through
            </h2>
            <p>
              Around week 8–12 of dieting, almost everyone hits a plateau.
              You&apos;re eating the same calories, exercising the same, but the
              scale won&apos;t move. This is{" "}
              <strong>metabolic adaptation</strong> — a normal biological
              response to reduced calorie intake.
            </p>

            <h3>What&apos;s Happening in Your Body</h3>
            <ul style={{ paddingLeft: "20px", lineHeight: "1.9" }}>
              <li>
                Your BMR decreases by 5–15% as your body becomes more efficient
              </li>
              <li>
                Hormones (leptin, ghrelin, thyroid) shift to conserve energy
              </li>
              <li>
                You unconsciously move less throughout the day (NEAT reduction)
              </li>
              <li>Weight loss slows dramatically or stops completely</li>
            </ul>

            <h3>How to Break the Plateau</h3>
            <ol style={{ paddingLeft: "20px", lineHeight: "1.9" }}>
              <li>
                <strong>Recalculate your TDEE</strong> based on your new (lower)
                weight
              </li>
              <li>
                <strong>Reduce calories by another 100–200</strong> from the new
                TDEE
              </li>
              <li>
                <strong>Take a diet break for 1–2 weeks</strong> at maintenance
                calories to reset hormones
              </li>
              <li>
                <strong>Add resistance training</strong> if you haven&apos;t —
                muscle mass raises TDEE
              </li>
              <li>
                <strong>Get 7–9 hours of sleep</strong> — poor sleep raises
                cortisol and stalls fat loss
              </li>
            </ol>
          </section>

          {/* SUCCESS EXAMPLES */}
          <section id="real-world-examples" style={{ marginBottom: "40px" }}>
            <h2>Real-World Success Stories &amp; Calorie Numbers</h2>
            <p>
              Here are three realistic examples showing how different people
              calculate and reach their targets.
            </p>

            <h3>Example 1: Office Worker Wants to Lose 15 lbs</h3>
            <p>
              <strong>Sarah, 32, 165 cm, 75 kg, sedentary desk job</strong>
            </p>
            <ul style={{ paddingLeft: "20px", lineHeight: "1.9" }}>
              <li>BMR: 1,438 calories</li>
              <li>TDEE (sedentary × 1.2): 1,726 calories</li>
              <li>
                Target for 1 lb/week loss: <strong>1,226 calories</strong>
              </li>
              <li>
                Recommendation: Increase to lightly active by walking 30 min
                daily → new TDEE 1,977 → target <strong>1,477 calories</strong>{" "}
                (more sustainable)
              </li>
            </ul>

            <h3>Example 2: Active Man Cutting for Summer</h3>
            <p>
              <strong>
                Mike, 28, 180 cm, 85 kg, moderately active gym-goer
              </strong>
            </p>
            <ul style={{ paddingLeft: "20px", lineHeight: "1.9" }}>
              <li>BMR: 1,845 calories</li>
              <li>TDEE (moderate × 1.55): 2,860 calories</li>
              <li>
                Target for 1 lb/week loss: <strong>2,360 calories</strong>
              </li>
              <li>Protein target: 165g/day (0.9g per lb body weight)</li>
            </ul>

            <h3>Example 3: 50+ Woman Weight Loss</h3>
            <p>
              <strong>Linda, 55, 160 cm, 78 kg, lightly active</strong>
            </p>
            <ul style={{ paddingLeft: "20px", lineHeight: "1.9" }}>
              <li>BMR: 1,314 calories</li>
              <li>TDEE (light × 1.375): 1,807 calories</li>
              <li>
                Target for 0.5 lb/week (safer for 50+):{" "}
                <strong>1,557 calories</strong>
              </li>
              <li>Focus: Strength training 2× weekly to combat sarcopenia</li>
            </ul>
          </section>

          {/* FAQ */}
          <section>
            <h2>Questions About Calorie Deficits</h2>

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
                      <p style={{ margin: 0 }}>{a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </section>
        </article>
        <ReviewedBy medical />
      </div>

      <BlogSidebar
        relatedTools={[
          ["/calorie-calculator/", "Calorie Calculator"],
          ["/bmi-calculator/", "BMI Calculator"],
          ["/body-fat-calculator/", "Body Fat Calculator"],
        ]}
        relatedPosts={[
          [
            "/blog/healthy-bodyfat-percentage-by-age-and-gender/",
            "Healthy Body Fat Percentage by Age and Gender",
          ],
          [
            "/blog/medication-dose-calculation-complete-guide-to-dose-calculator-safe-drug-dosing/",
            "Medication Dose Calculation Guide",
          ],
          [
            "/blog/ultimate-iv-infusion-calculator-guide/",
            "Ultimate IV Infusion Calculator Guide",
          ],
        ]}
      />
    </div>
  );
}
