"use client";
import { useState } from "react";
import Link from "next/link";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function CaloriesToLoseWeight() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const toggleFAQ = (i: number) => setOpenFAQ(openFAQ === i ? null : i);

  return (
    <div className="blog-container">
      <div className="blog-content">
        {/* BREADCRUMB */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "14px",
            marginBottom: "10px",
          }}
        >
          <Link
            href="https://numbersonyourtip.com/"
            className="my-link"
            style={{
              textDecoration: "none",
              color: "#000",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <i className="fa-solid fa-house" />
            Home
          </Link>
          <i className="fa-solid fa-angle-right" style={{ fontSize: "12px" }} />
          <span style={{ color: "#000" }}>
            How Many Calories Should I Eat to Lose Weight?
          </span>
        </div>
        <hr />

        <img
          src="/blog13.1.webp"
          className="image-blog"
          alt="How many calories should I eat to lose weight - TDEE explained"
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
              <img
                className="founder-photo"
                src="/founder_photo.webp"
                alt="Ashar Pervaiz"
              />
              Ashar Pervaiz
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
              18 Jul 2026
            </span>
          </small>
        </div>

        <article>
          {/* HEADER */}
          <header>
            <h1>
              How Many Calories Should I Eat to Lose Weight? (TDEE, Deficits,
              and the Science Behind the Number)
            </h1>
            <p>
              You have probably heard the phrase "eat less, move more" so many
              times it has lost all meaning. And honestly, it is not wrong — but
              it is wildly incomplete. Knowing you need to eat less is about as
              useful as knowing you need to drive to get somewhere without
              knowing where you are starting, where you are going, or how far
              away it is. The number you actually need — your personal daily
              calorie target for weight loss — comes from one thing: your TDEE.
              This guide breaks it down completely, shows you the real math, and
              explains the common mistakes that keep people eating in a deficit
              without ever seeing results.
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
              How Many Calories Should I Eat to Lose Weight?
            </h2>
            <p style={{ marginBottom: 0, color: "white" }}>
              To lose weight, eat{" "}
              <strong>300–500 calories below your TDEE</strong> (Total Daily
              Energy Expenditure) each day. This creates a weekly deficit of
              2,100–3,500 calories, producing approximately 0.5–1 pound of fat
              loss per week. To find your specific number: calculate your BMR
              using the Mifflin-St Jeor formula, multiply by your activity
              factor to get your TDEE, then subtract your deficit. Women should
              never go below <strong>1,200 calories</strong> per day and men
              below <strong>1,500 calories</strong> without medical supervision.
              Recalculate every 10–15 pounds lost, as your TDEE decreases as
              your body gets lighter.
            </p>
          </section>

          {/* SECTION 1 — THE PROBLEM WITH GENERIC ADVICE */}
          <section
            id="problem-with-generic-advice"
            style={{ marginBottom: "48px" }}
          >
            <h2>Why "Just Eat Less" Is Useless Advice</h2>
            <p>
              Here is what almost no one tells you when you start trying to lose
              weight: the number of calories you need to eat is personal. Not
              just somewhat personal — radically personal. Two people of
              different heights, weights, ages, and activity levels standing in
              the same room have completely different daily calorie
              requirements. What constitutes a deficit for one person is
              maintenance for another. What is maintenance for one person is a
              surplus for someone else.
            </p>
            <p>
              A 28-year-old woman who is 5 feet 4 inches and weighs 145 pounds,
              works a desk job, and goes for a walk three times a week has a
              TDEE of roughly 1,850 calories. A 35-year-old man who is 6 feet 1
              inch and weighs 210 pounds and lifts weights four times a week has
              a TDEE of roughly 2,900 calories. Generic advice telling both of
              them to "eat 1,500 calories" is either an aggressive deficit for
              one or a moderate deficit for the other — and the outcome of each
              is completely different.
            </p>
            <p>
              The starting point for any sensible weight loss plan is your
              personal TDEE. Once you know it, everything else — your daily
              calorie target, your expected weekly loss rate, your minimum safe
              intake floor — falls into place as arithmetic.
            </p>
          </section>

          {/* SECTION 2 — WHAT IS TDEE */}
          <section id="what-is-tdee" style={{ marginBottom: "48px" }}>
            <h2>What Is TDEE? (Total Daily Energy Expenditure Explained)</h2>
            <p>
              TDEE stands for Total Daily Energy Expenditure. It is the total
              number of calories your body burns across a full 24-hour period —
              not just during exercise, but including every biological function
              your body performs to keep you alive, plus all the movement you do
              throughout the day.
            </p>
            <p>
              Your TDEE is made up of four components, and understanding what
              each contributes matters because it shows you exactly which levers
              you can pull when you want to create or deepen a calorie deficit.
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
                    <th style={{ padding: "12px 16px", textAlign: "left" }}>
                      Component
                    </th>
                    <th style={{ padding: "12px 16px", textAlign: "left" }}>
                      What It Is
                    </th>
                    <th style={{ padding: "12px 16px", textAlign: "center" }}>
                      % of Total TDEE
                    </th>
                    <th style={{ padding: "12px 16px", textAlign: "left" }}>
                      Can You Control It?
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    [
                      "BMR (Basal Metabolic Rate)",
                      "Calories burned at complete rest — breathing, organ function, cell repair",
                      "60–75%",
                      "Partially (muscle mass raises it)",
                    ],
                    [
                      "TEF (Thermic Effect of Food)",
                      "Calories burned digesting and processing what you eat",
                      "8–15%",
                      "Yes — more protein = higher TEF",
                    ],
                    [
                      "EAT (Exercise Activity Thermogenesis)",
                      "Calories burned during intentional exercise and workouts",
                      "5–15%",
                      "Yes — your most direct lever",
                    ],
                    [
                      "NEAT (Non-Exercise Activity Thermogenesis)",
                      "Calories burned in all non-workout movement: walking, fidgeting, chores",
                      "15–30%",
                      "Partially — most underestimated factor",
                    ],
                  ].map(([comp, what, pct, ctrl], i) => (
                    <tr
                      key={i}
                      style={{
                        backgroundColor: i % 2 === 0 ? "#fff" : "#f7f9ff",
                      }}
                    >
                      <td
                        style={{
                          padding: "12px 16px",
                          border: "1px solid #e8edf5",
                          fontWeight: 700,
                          color: "#1B3066",
                        }}
                      >
                        {comp}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          border: "1px solid #e8edf5",
                          color: "#444",
                        }}
                      >
                        {what}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          border: "1px solid #e8edf5",
                          textAlign: "center",
                          fontWeight: 600,
                        }}
                      >
                        {pct}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          border: "1px solid #e8edf5",
                          color: "#444",
                        }}
                      >
                        {ctrl}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p>
              NEAT deserves special attention because it is the component that
              varies most dramatically between individuals and is the most often
              overlooked. A person with a physically active job — a nurse, a
              teacher, a construction worker — can burn 600–1,000 more calories
              per day through NEAT than a person who sits at a desk all day.
              This explains a significant portion of why some people seem to eat
              a lot without gaining weight: their daily movement, not their
              formal exercise, is doing the metabolic heavy lifting.
            </p>
          </section>

          {/* SECTION 3 — BMR FORMULA */}
          <section id="bmr-formula" style={{ marginBottom: "48px" }}>
            <h2>
              Step 1: Calculate Your BMR Using the Mifflin-St Jeor Formula
            </h2>
            <p>
              Your BMR is the foundation of your TDEE calculation. There are
              three main formulas used for this — Harris-Benedict (1919, revised
              1984), Mifflin-St Jeor (1990), and Katch-McArdle (which requires
              body fat percentage). The{" "}
              <strong>Mifflin-St Jeor equation</strong> is the most widely
              recommended by registered dietitians and clinical researchers in
              2026 because it consistently provides the most accurate estimate
              for the general population. The American Council on Exercise (ACE)
              endorses it as the preferred starting formula.
            </p>

            <div
              style={{
                backgroundColor: "#1B3066",
                color: "white",
                padding: "22px",
                borderRadius: "10px",
                margin: "20px 0",
              }}
            >
              <p
                style={{
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  color: "rgba(255,255,255,0.6)",
                  marginBottom: "12px",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                }}
              >
                MIFFLIN-ST JEOR BMR FORMULA
              </p>
              <p
                style={{
                  fontFamily: "monospace",
                  fontSize: "1.05rem",
                  margin: "0 0 10px 0",
                  color: "white",
                }}
              >
                Men: BMR = (10 × weight in kg) + (6.25 × height in cm) − (5 ×
                age) + 5
              </p>
              <p
                style={{
                  fontFamily: "monospace",
                  fontSize: "1.05rem",
                  margin: 0,
                  color: "white",
                }}
              >
                Women: BMR = (10 × weight in kg) + (6.25 × height in cm) − (5 ×
                age) − 161
              </p>
            </div>

            <p>
              The only difference between the male and female formula is the
              final constant: +5 for men, −161 for women. This accounts for the
              average difference in lean body mass between sexes at equivalent
              heights and weights. Women naturally carry proportionally more fat
              mass and less muscle mass, which is metabolically less expensive
              to maintain — hence the lower baseline calorie requirement.
            </p>

            <h3>Worked Example</h3>
            <div
              style={{
                backgroundColor: "#f4f7ff",
                border: "1px solid #d0d9ef",
                borderRadius: "8px",
                padding: "20px",
                margin: "16px 0",
              }}
            >
              <p
                style={{
                  fontWeight: 700,
                  color: "#1B3066",
                  margin: "0 0 10px 0",
                }}
              >
                35-year-old woman, 5'6" (167 cm), 160 lbs (73 kg)
              </p>
              <p
                style={{
                  fontFamily: "monospace",
                  fontSize: "0.97rem",
                  color: "#333",
                  lineHeight: 2.2,
                  margin: 0,
                }}
              >
                BMR = (10 × 73) + (6.25 × 167) − (5 × 35) − 161
                <br />
                BMR = 730 + 1,043.75 − 175 − 161
                <br />
                <strong>BMR = 1,437 calories/day</strong>
              </p>
              <p
                style={{
                  margin: "10px 0 0 0",
                  fontSize: "0.9rem",
                  color: "#666",
                }}
              >
                This is the number of calories she burns if she stays completely
                still all day. Her actual daily burn will be significantly
                higher once activity is factored in.
              </p>
            </div>
          </section>

          {/* SECTION 4 — ACTIVITY MULTIPLIER */}
          <section id="activity-multiplier" style={{ marginBottom: "48px" }}>
            <h2>Step 2: Multiply by Your Activity Factor to Get Your TDEE</h2>
            <p>
              Once you have your BMR, you multiply it by an activity factor that
              represents your typical weekly movement. This is called the
              Harris-Benedict Activity Multiplier, and choosing the right level
              honestly is critical — most people overestimate how active they
              are, which inflates their TDEE and makes their deficit smaller
              than they think.
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
                    <th style={{ padding: "12px 16px", textAlign: "left" }}>
                      Activity Level
                    </th>
                    <th style={{ padding: "12px 16px", textAlign: "center" }}>
                      Multiplier
                    </th>
                    <th style={{ padding: "12px 16px", textAlign: "left" }}>
                      Who This Actually Describes
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    [
                      "Sedentary",
                      "× 1.2",
                      "Desk job, little or no intentional exercise, most daily steps under 5,000",
                    ],
                    [
                      "Lightly Active",
                      "× 1.375",
                      "Light exercise 1–3 days/week, or active job with minimal gym time",
                    ],
                    [
                      "Moderately Active",
                      "× 1.55",
                      "Moderate exercise 3–5 days/week — honest gym sessions, not light walks",
                    ],
                    [
                      "Very Active",
                      "× 1.725",
                      "Hard exercise 6–7 days/week, or physically demanding job plus gym work",
                    ],
                    [
                      "Extremely Active",
                      "× 1.9",
                      "Twice-daily training, professional athletes, heavy physical labour jobs",
                    ],
                  ].map(([level, mult, desc], i) => (
                    <tr
                      key={i}
                      style={{
                        backgroundColor: i % 2 === 0 ? "#fff" : "#f7f9ff",
                      }}
                    >
                      <td
                        style={{
                          padding: "12px 16px",
                          border: "1px solid #e8edf5",
                          fontWeight: 600,
                        }}
                      >
                        {level}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          border: "1px solid #e8edf5",
                          textAlign: "center",
                          fontWeight: 700,
                          color: "#1B3066",
                        }}
                      >
                        {mult}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          border: "1px solid #e8edf5",
                          color: "#444",
                          fontSize: "0.93rem",
                        }}
                      >
                        {desc}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div
              style={{
                backgroundColor: "#fff8e1",
                borderLeft: "5px solid #F59E0B",
                padding: "18px 20px",
                borderRadius: "0 8px 8px 0",
                margin: "20px 0",
              }}
            >
              <strong>Honest advice:</strong> Most people who describe
              themselves as "moderately active" are actually "lightly active."
              Going to the gym three times a week for 45 minutes, then sitting
              for most of the remaining hours, is closer to lightly active than
              moderate. When in doubt, choose the lower multiplier and adjust
              upward after 2–3 weeks of tracking results. Overestimating your
              activity level is one of the leading reasons people eat in what
              they think is a deficit but see no results.
            </div>

            <h3>Completing the Example</h3>
            <div
              style={{
                backgroundColor: "#f4f7ff",
                border: "1px solid #d0d9ef",
                borderRadius: "8px",
                padding: "20px",
                margin: "16px 0",
              }}
            >
              <p
                style={{
                  fontFamily: "monospace",
                  fontSize: "0.97rem",
                  color: "#333",
                  lineHeight: 2.2,
                  margin: 0,
                }}
              >
                BMR: 1,437 calories
                <br />
                Activity: Moderately active (× 1.55)
                <br />
                <strong>TDEE: 1,437 × 1.55 = 2,227 calories/day</strong>
              </p>
              <p
                style={{
                  margin: "10px 0 0 0",
                  fontSize: "0.9rem",
                  color: "#666",
                }}
              >
                This is her maintenance — the number of calories she needs to
                eat daily to keep her weight exactly where it is. Her weight
                loss target is built from here.
              </p>
            </div>
          </section>

          {/* SECTION 5 — THE DEFICIT */}
          <section
            id="calorie-deficit-calculator"
            style={{ marginBottom: "48px" }}
          >
            <h2>
              Step 3: Subtract Your Deficit to Get Your Weight Loss Calorie
              Target
            </h2>
            <p>
              One pound of body fat stores approximately 3,500 calories of
              energy. This is the foundational number behind all calorie deficit
              math. To lose one pound of fat per week, you need a total weekly
              deficit of 3,500 calories — which works out to 500 calories below
              your TDEE per day. To lose half a pound, aim for a 250-calorie
              daily deficit. To target 1.5 pounds per week, aim for 750 calories
              below TDEE.
            </p>
            <p>
              The 3,500-calorie figure is a useful rule of thumb, though
              research from the National Institutes of Health (NIH) has refined
              this slightly — actual fat loss rates vary with body composition,
              hormones, and metabolic adaptation. But the principle holds: a
              larger consistent deficit produces faster fat loss, up to a point
              where the costs outweigh the benefits.
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
                    <th style={{ padding: "12px 16px", textAlign: "left" }}>
                      Goal
                    </th>
                    <th style={{ padding: "12px 16px", textAlign: "center" }}>
                      Daily Deficit
                    </th>
                    <th style={{ padding: "12px 16px", textAlign: "center" }}>
                      Expected Weekly Loss
                    </th>
                    <th style={{ padding: "12px 16px", textAlign: "left" }}>
                      Best For
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    [
                      "Slow, sustainable fat loss",
                      "250 cal/day",
                      "~0.5 lb/week",
                      "Athletes, people close to goal weight, muscle preservation priority",
                    ],
                    [
                      "Moderate fat loss",
                      "500 cal/day",
                      "~1 lb/week",
                      "Most people — best balance of speed and sustainability",
                    ],
                    [
                      "Faster fat loss",
                      "750 cal/day",
                      "~1.5 lb/week",
                      "Those with significant weight to lose, with adequate protein intake",
                    ],
                    [
                      "Aggressive (proceed carefully)",
                      "1,000 cal/day",
                      "~2 lb/week",
                      "Only if TDEE is high enough to stay above 1,200/1,500 floor",
                    ],
                  ].map(([goal, deficit, loss, best], i) => (
                    <tr
                      key={i}
                      style={{
                        backgroundColor: i % 2 === 0 ? "#fff" : "#f7f9ff",
                      }}
                    >
                      <td
                        style={{
                          padding: "12px 16px",
                          border: "1px solid #e8edf5",
                          fontWeight: 600,
                        }}
                      >
                        {goal}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          border: "1px solid #e8edf5",
                          textAlign: "center",
                          color: "#1B3066",
                          fontWeight: 700,
                        }}
                      >
                        {deficit}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          border: "1px solid #e8edf5",
                          textAlign: "center",
                          fontWeight: 700,
                          color: "#16a34a",
                        }}
                      >
                        {loss}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          border: "1px solid #e8edf5",
                          color: "#444",
                          fontSize: "0.9rem",
                        }}
                      >
                        {best}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3>Completing the Full Calculation</h3>
            <div
              style={{
                backgroundColor: "#1B3066",
                color: "white",
                padding: "22px",
                borderRadius: "10px",
                margin: "20px 0",
              }}
            >
              <p
                style={{
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  color: "rgba(255,255,255,0.6)",
                  marginBottom: "12px",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                }}
              >
                FULL WORKED EXAMPLE
              </p>
              <p
                style={{
                  fontFamily: "monospace",
                  fontSize: "1rem",
                  margin: "0 0 8px 0",
                  lineHeight: 2.2,
                  color: "white",
                }}
              >
                BMR: 1,437 cal | Activity multiplier: 1.55 | TDEE: 2,227 cal
                <br />
                Goal: 1 lb/week loss → 500 cal/day deficit
                <br />
                <strong>
                  Daily calorie target: 2,227 − 500 = 1,727 calories/day
                </strong>
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.88rem",
                  color: "rgba(255,255,255,0.7)",
                }}
              >
                At 1,727 calories/day she stays well above the 1,200-calorie
                safety floor, creates a meaningful deficit, and can sustain this
                pace for months.
              </p>
            </div>

            <p>
              Use our free{" "}
              <Link href="/calorie-calculator/" className="my-link">
                calorie calculator
              </Link>{" "}
              to run this calculation for your own numbers in under 60 seconds.
              It applies the Mifflin-St Jeor formula, asks for your activity
              level, and returns your TDEE plus targets for weight loss,
              maintenance, and muscle gain automatically. Pair it with the{" "}
              <Link href="/body-fat-calculator/" className="my-link">
                body fat calculator
              </Link>{" "}
              to get a fuller picture of your body composition alongside your
              calorie needs.
            </p>
          </section>

          <img
            src="/blog13.2.webp"
            className="image-blog"
            alt="Calorie deficit, TDEE and metabolic adaptation science explained"
          />

          {/* SECTION 6 — MINIMUM FLOORS */}
          <section id="minimum-calorie-floor" style={{ marginBottom: "48px" }}>
            <h2>The Minimum Calorie Floor: Why Going Too Low Backfires</h2>
            <p>
              Here is one of the most important — and most ignored — numbers in
              weight loss nutrition: the minimum safe daily calorie intake. Most
              health organizations, including the National Institutes of Health
              and the British Dietetic Association, set these minimums at{" "}
              <strong>1,200 calories for women</strong> and{" "}
              <strong>1,500 calories for men</strong> per day, without medical
              supervision.
            </p>
            <p>
              These are not soft suggestions. They are the lower boundary below
              which the clinical evidence consistently shows harmful effects:
              muscle loss accelerating, metabolism suppressing, immune function
              declining, bone density reducing, hormonal disruption beginning
              (particularly for women), and the psychological cycle of
              restriction and binge eating becoming more likely.
            </p>
            <p>
              A landmark study from Pennington Biomedical Research Center
              tracked the metabolic consequences of severe calorie restriction
              and confirmed that prolonged restriction below these floors
              significantly lowers resting metabolic rate — independent of the
              weight lost. The body does not simply burn stored fat to
              compensate; it slows down every energy-using process it can
              control.
            </p>
            <p>
              An even more striking example came from the long-running follow-up
              of contestants from The Biggest Loser. Researchers found that
              years after the show, contestants' resting metabolic rates had
              dropped by an average of 500 calories per day below what would be
              predicted for their current body weight — a permanent metabolic
              downshift caused by the extreme calorie restriction the program
              imposed. Their bodies had adapted so aggressively that they now
              burned dramatically fewer calories than a person of the same size
              who had never dieted that severely.
            </p>

            <div
              style={{
                backgroundColor: "#fff",
                borderLeft: "5px solid #DC2626",
                padding: "18px 20px",
                borderRadius: "0 8px 8px 0",
                margin: "24px 0",
              }}
            >
              <strong>
                If your TDEE minus your target deficit puts you below the floor:
              </strong>{" "}
              Do not eat below 1,200 calories (women) or 1,500 calories (men).
              Instead, narrow your deficit until your target sits above the
              floor, and increase your TDEE through more movement. A 200-calorie
              daily deficit above the floor is better than a 500-calorie deficit
              below it — because the second option will stop working within
              weeks and damage your metabolism in the process.
            </div>
          </section>

          {/* SECTION 7 — TDEE BY NUMBERS REFERENCE */}
          <section id="tdee-reference-table" style={{ marginBottom: "48px" }}>
            <h2>
              Daily Calorie Needs by Body Type and Activity Level: Quick
              Reference Table
            </h2>
            <p>
              Before you have run your personal calculation, here is a practical
              reference showing estimated TDEE ranges for different profiles.
              These are based on the Mifflin-St Jeor formula and are intended as
              orientation points, not substitutes for your individual
              calculation.
            </p>

            <div style={{ overflowX: "auto", margin: "20px 0" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "0.95rem",
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: "#1B3066", color: "white" }}>
                    <th style={{ padding: "11px 14px", textAlign: "left" }}>
                      Profile
                    </th>
                    <th style={{ padding: "11px 14px", textAlign: "center" }}>
                      Sedentary TDEE
                    </th>
                    <th style={{ padding: "11px 14px", textAlign: "center" }}>
                      Lightly Active
                    </th>
                    <th style={{ padding: "11px 14px", textAlign: "center" }}>
                      Moderately Active
                    </th>
                    <th style={{ padding: "11px 14px", textAlign: "center" }}>
                      Loss Target (−500)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    [
                      "Woman, 25, 5'4\", 130 lbs",
                      "1,540",
                      "1,730",
                      "1,930",
                      "~1,430",
                    ],
                    [
                      "Woman, 35, 5'6\", 160 lbs",
                      "1,680",
                      "1,885",
                      "2,100",
                      "~1,600",
                    ],
                    [
                      "Woman, 45, 5'5\", 180 lbs",
                      "1,690",
                      "1,900",
                      "2,115",
                      "~1,615",
                    ],
                    [
                      "Man, 25, 5'10\", 170 lbs",
                      "2,000",
                      "2,250",
                      "2,510",
                      "~2,010",
                    ],
                    [
                      "Man, 35, 6'0\", 200 lbs",
                      "2,150",
                      "2,420",
                      "2,690",
                      "~2,190",
                    ],
                    [
                      "Man, 45, 5'11\", 220 lbs",
                      "2,170",
                      "2,440",
                      "2,715",
                      "~2,215",
                    ],
                  ].map(([profile, sed, light, mod, loss], i) => (
                    <tr
                      key={i}
                      style={{
                        backgroundColor: i % 2 === 0 ? "#fff" : "#f7f9ff",
                      }}
                    >
                      <td
                        style={{
                          padding: "11px 14px",
                          border: "1px solid #e8edf5",
                          fontWeight: 600,
                          fontSize: "0.9rem",
                        }}
                      >
                        {profile}
                      </td>
                      <td
                        style={{
                          padding: "11px 14px",
                          border: "1px solid #e8edf5",
                          textAlign: "center",
                        }}
                      >
                        {sed}
                      </td>
                      <td
                        style={{
                          padding: "11px 14px",
                          border: "1px solid #e8edf5",
                          textAlign: "center",
                        }}
                      >
                        {light}
                      </td>
                      <td
                        style={{
                          padding: "11px 14px",
                          border: "1px solid #e8edf5",
                          textAlign: "center",
                        }}
                      >
                        {mod}
                      </td>
                      <td
                        style={{
                          padding: "11px 14px",
                          border: "1px solid #e8edf5",
                          textAlign: "center",
                          fontWeight: 700,
                          color: "#16a34a",
                        }}
                      >
                        {loss}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p
              style={{
                fontSize: "0.88rem",
                color: "#666",
                fontStyle: "italic",
              }}
            >
              Estimates only. Run the exact calculation using our{" "}
              <Link href="/calorie-calculator/" className="my-link">
                calorie calculator
              </Link>{" "}
              for your specific numbers.
            </p>
          </section>

          {/* SECTION 8 — METABOLIC ADAPTATION */}
          <section id="metabolic-adaptation" style={{ marginBottom: "48px" }}>
            <h2>
              Metabolic Adaptation: Why the Deficit That Worked in Month 1 Stops
              Working in Month 3
            </h2>
            <p>
              This is the most important concept in long-term weight loss that
              most fitness content glosses over. If you have ever been
              faithfully eating in a deficit, losing weight steadily for the
              first six to eight weeks, and then suddenly watched the scale stop
              moving entirely despite changing nothing — you have experienced
              metabolic adaptation firsthand.
            </p>
            <p>
              Metabolic adaptation (also called adaptive thermogenesis) is your
              body's response to sustained calorie restriction. When calorie
              intake drops and stays low for weeks, your body interprets this as
              a potential survival threat — a famine signal — and begins
              suppressing energy expenditure to protect its fat stores. Several
              things happen simultaneously:
            </p>
            <ul style={{ paddingLeft: "20px", lineHeight: 2.2, color: "#333" }}>
              <li>
                Resting metabolic rate decreases — your BMR drops below what
                would be predicted for your current body weight.
              </li>
              <li>
                NEAT decreases — you unconsciously move less, fidget less, and
                conserve energy in ways you don't notice.
              </li>
              <li>
                Thyroid hormone output decreases, further lowering metabolic
                rate.
              </li>
              <li>
                Leptin (the satiety hormone) levels fall, increasing hunger
                signals.
              </li>
              <li>
                Ghrelin (the hunger hormone) levels rise, intensifying appetite.
              </li>
            </ul>
            <p>
              The compounding effect can be significant. A 2025 analysis from
              LifeBase showed that a 20-pound weight loss might reduce a
              person's TDEE by 400 calories instead of the expected 200 —
              meaning the body has adapted to burn 200 extra calories less per
              day than its reduced size would predict. In practice, a
              500-calorie deficit in week one may have eroded to just a
              100-calorie deficit by week twelve without any change in what
              you're eating or doing.
            </p>

            <h3>What to Do When You Hit a Plateau</h3>
            <p>
              First, confirm it is a genuine plateau. Daily weight can fluctuate
              by 2–5 pounds due to water retention, sodium, hormonal cycles, and
              carbohydrate intake. A single week without scale movement is not a
              plateau — it is normal variance. Wait at least three weeks of
              consistent tracking with zero scale movement before treating it as
              a true stall.
            </p>
            <p>If it is real, you have three options:</p>

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
                    <th style={{ padding: "12px 16px", textAlign: "left" }}>
                      Option
                    </th>
                    <th style={{ padding: "12px 16px", textAlign: "left" }}>
                      What It Means
                    </th>
                    <th style={{ padding: "12px 16px", textAlign: "left" }}>
                      Pros / Cons
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    [
                      "Reduce intake by 100–200 calories",
                      "Lower your daily calorie target to restore the deficit",
                      "Fast results, but risk accelerating adaptation further",
                    ],
                    [
                      "Increase TDEE through activity",
                      "Add daily steps or training to burn more without eating less",
                      "More sustainable; eat the same, move more",
                    ],
                    [
                      "Take a diet break (2 weeks at maintenance)",
                      "Eat at TDEE for 2 weeks, then resume the deficit",
                      "Research shows this partially reverses metabolic adaptation and improves long-term results",
                    ],
                  ].map(([opt, what, cons], i) => (
                    <tr
                      key={i}
                      style={{
                        backgroundColor: i % 2 === 0 ? "#fff" : "#f7f9ff",
                      }}
                    >
                      <td
                        style={{
                          padding: "12px 16px",
                          border: "1px solid #e8edf5",
                          fontWeight: 600,
                          color: "#1B3066",
                        }}
                      >
                        {opt}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          border: "1px solid #e8edf5",
                          color: "#444",
                        }}
                      >
                        {what}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          border: "1px solid #e8edf5",
                          color: "#555",
                          fontSize: "0.92rem",
                        }}
                      >
                        {cons}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p>
              The diet break approach — eating at maintenance for 1–2 weeks
              before resuming a deficit — is increasingly supported by research.
              A study published in the International Journal of Obesity found
              that intermittent dieting (2 weeks on, 2 weeks at maintenance)
              produced greater total fat loss and better muscle preservation
              than continuous restriction over the same period, even though
              participants spent half the time not in a deficit. The biological
              reason is that the maintenance phase partially restores leptin
              levels, reduces ghrelin, and allows NEAT and thyroid function to
              recover.
            </p>

            <p>
              Critically:{" "}
              <strong>recalculate your TDEE every 10–15 pounds lost.</strong> As
              your body gets lighter, it burns fewer calories — a smaller body
              requires less energy to move and maintain. Failing to recalculate
              means your initial deficit gradually shrinks to zero, which is
              exactly what plateau data shows happening to most dieters. Use the{" "}
              <Link href="/calorie-calculator/" className="my-link">
                calorie calculator
              </Link>{" "}
              each time you hit a 10-pound milestone and update your daily
              target accordingly.
            </p>
          </section>

          {/* SECTION 9 — WHY NOT LOSING WEIGHT */}
          <section id="why-not-losing-weight" style={{ marginBottom: "48px" }}>
            <h2>
              In a Calorie Deficit But Not Losing Weight? The Most Common Hidden
              Reasons
            </h2>
            <p>
              Research from the New England Journal of Medicine found that
              people underestimate their daily calorie intake by an average of{" "}
              <strong>47%</strong>. Almost half of everything eaten goes
              unaccounted for. This is not dishonesty — it is a documented
              perceptual bias. Cooking oils, dressings, sauces, tasting while
              cooking, drinks, and portion size errors collectively add hundreds
              of calories that never make it into food logs. Before attributing
              a plateau to metabolic adaptation, it is worth ruling out tracking
              accuracy as the real culprit.
            </p>

            <p>
              Beyond tracking errors, here are the most common legitimate
              reasons someone is eating in what they believe is a deficit but
              not seeing results:
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {[
                {
                  title: "Overestimating activity level",
                  body: "If you selected 'moderately active' but your day is mostly sedentary with three gym sessions, your real TDEE is lower than your calculation assumed. The deficit you think you're running may not exist at all. Drop to 'lightly active,' recalculate, and verify the result tracks with your weight over 2–3 weeks.",
                },
                {
                  title: "Liquid calories are invisible in tracking",
                  body: "A morning coffee with milk and sugar is 80–150 calories. A glass of orange juice is 110. A post-workout protein shake is 200–300. An evening glass of wine is 125. Together, these can easily add 400–600 untracked calories to a day that looks perfectly controlled in a food app.",
                },
                {
                  title: "Weekend drift is erasing the weekday deficit",
                  body: "Five days of a 500-calorie deficit (−2,500 calories) followed by two days of a 600-calorie surplus (+1,200 calories) produces a net weekly deficit of only 1,300 calories — enough for roughly 0.4 lbs/week rather than 1 lb. Weekends matter as much as weekdays.",
                },
                {
                  title: "Water retention masking fat loss",
                  body: "Starting a new exercise program, eating more sodium than usual, hormonal fluctuations, or beginning a new high-carb day after restriction can all cause the body to retain 2–5 pounds of water, completely hiding the fat that is actively being lost. The scale is not always a direct readout of fat changes.",
                },
                {
                  title: "A medical condition affecting metabolism",
                  body: "Hypothyroidism, polycystic ovary syndrome (PCOS), insulin resistance, and certain medications (corticosteroids, antidepressants, antipsychotics, beta blockers) can all meaningfully reduce the rate at which the body loses fat at a given calorie intake. If tracking is genuinely accurate and results are absent after 4 weeks, a GP referral is warranted.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    borderLeft: `5px solid ${i % 2 === 0 ? "#1B3066" : "#1F9FB8"}`,
                    padding: "18px 20px",
                    backgroundColor: i % 2 === 0 ? "#fff" : "#f9fafb",
                    borderBottom: "1px solid #e8edf5",
                  }}
                >
                  <strong
                    style={{
                      color: "#1B3066",
                      display: "block",
                      marginBottom: "6px",
                      fontSize: "1rem",
                    }}
                  >
                    {i + 1}. {item.title}
                  </strong>
                  <p
                    style={{
                      margin: 0,
                      color: "#333",
                      lineHeight: 1.7,
                      fontSize: "0.97rem",
                    }}
                  >
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 10 — PROTEIN AND MACROS */}
          <section id="protein-and-macros" style={{ marginBottom: "48px" }}>
            <h2>Calories Are the Foundation — But Protein Is the Enforcer</h2>
            <p>
              Knowing your daily calorie target is the essential first step. But
              what you fill those calories with determines whether the weight
              you lose is fat or a combination of fat and muscle — and the
              difference between those two outcomes is enormous for your
              long-term metabolism and body composition.
            </p>
            <p>
              Of the three macronutrients, protein is uniquely important in a
              calorie deficit for three reasons:
            </p>
            <ul style={{ paddingLeft: "20px", lineHeight: 2.2, color: "#333" }}>
              <li>
                <strong>It preserves muscle mass during weight loss.</strong>{" "}
                When calories are restricted, the body can break down muscle
                tissue for fuel. Adequate protein intake signals the body to
                protect lean mass, ensuring the majority of weight lost comes
                from fat stores rather than muscle.
              </li>
              <li>
                <strong>
                  It has the highest thermic effect of any macronutrient.
                </strong>{" "}
                Your body burns 20–30% of the calories from protein simply
                digesting it, compared to 5–10% for carbohydrates and 0–3% for
                fat. This means a high-protein diet effectively creates a small
                additional calorie deficit through digestion alone.
              </li>
              <li>
                <strong>It is the most satiating macronutrient.</strong> Protein
                suppresses ghrelin (the hunger hormone) and stimulates satiety
                hormones more effectively than carbohydrates or fat. Eating more
                protein means staying fuller for longer at the same calorie
                intake — which reduces the psychological difficulty of
                maintaining a deficit.
              </li>
            </ul>
            <p>
              The evidence-based target for protein intake during a calorie
              deficit is
              <strong>
                {" "}
                0.7–1.0 grams per pound of body weight per day
              </strong>{" "}
              (or 1.6–2.2g per kilogram). For the 160-pound woman in our
              example, that is 112–160 grams of protein daily. For most people,
              hitting this target requires deliberate effort — chicken breast,
              fish, eggs, Greek yogurt, cottage cheese, legumes, and protein
              powder all become useful tools.
            </p>

            <p>
              To understand how your body weight and composition interact with
              your calorie needs over time, our{" "}
              <Link href="/bmi-calculator/" className="my-link">
                BMI calculator
              </Link>{" "}
              gives you a baseline reference point, while the{" "}
              <Link href="/body-fat-calculator/" className="my-link">
                body fat calculator
              </Link>{" "}
              tracks changes in body composition more accurately than weight
              alone. Once you have a sense of your fat versus lean mass,
              recalculating your calorie needs with our{" "}
              <Link href="/calorie-calculator/" className="my-link">
                calorie calculator
              </Link>{" "}
              gives you a more precise TDEE estimate each time your body
              composition changes.
            </p>
          </section>

          {/* SECTION 11 — PRACTICAL GUIDE */}
          <section id="practical-action-plan" style={{ marginBottom: "48px" }}>
            <h2>
              The Step-by-Step Action Plan: From Zero to Your Daily Calorie
              Target
            </h2>
            <p>
              Every concept in this guide can be distilled into a clear,
              repeatable five-step process. Follow it once, set your target,
              track honestly for three weeks, then adjust based on what you
              observe.
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "14px",
                marginTop: "20px",
              }}
            >
              {[
                [
                  "Calculate your BMR",
                  "Use the Mifflin-St Jeor formula above, or enter your stats into our calorie calculator. You need your weight in kg, height in cm, and age.",
                ],
                [
                  "Multiply by your honest activity factor",
                  "Choose the level that describes your actual week, not your aspirational week. When in doubt, go one level lower than your first instinct.",
                ],
                [
                  "Subtract your deficit",
                  "For most people, a 300–500 calorie daily deficit is the sweet spot. Go lower if you have less weight to lose or want to preserve maximum muscle. Stay above the 1,200/1,500 calorie floor.",
                ],
                [
                  "Track everything for 2–3 weeks",
                  "Use a food tracking app with a kitchen scale. Weigh everything, including oils, dressings, and drinks. Be genuinely accurate for at least three weeks before drawing conclusions.",
                ],
                [
                  "Adjust and recalculate",
                  "If you are losing faster than 1% of body weight per week, slightly increase calories to preserve muscle. If you see no movement after three true weeks, reduce by 150–200 calories or add movement to raise TDEE. Recalculate your TDEE every 10–15 lbs lost.",
                ],
              ].map(([title, body], i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: "16px",
                    alignItems: "flex-start",
                    padding: "16px 18px",
                    borderRadius: "8px",
                    backgroundColor: i % 2 === 0 ? "#f4f7ff" : "#fff",
                    border: "1px solid #e0e7f3",
                  }}
                >
                  <div
                    style={{
                      minWidth: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      backgroundColor: "#1B3066",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontWeight: 800,
                      fontSize: "0.95rem",
                      marginTop: "2px",
                    }}
                  >
                    {i + 1}
                  </div>
                  <div>
                    <strong
                      style={{
                        color: "#1B3066",
                        display: "block",
                        marginBottom: "4px",
                      }}
                    >
                      {title}
                    </strong>
                    <span
                      style={{
                        color: "#444",
                        fontSize: "0.95rem",
                        lineHeight: 1.7,
                      }}
                    >
                      {body}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section
            style={{
              backgroundColor: "#1B3066",
              padding: "36px",
              borderRadius: "12px",
              textAlign: "center",
              color: "#fff",
              marginBottom: "48px",
              boxShadow: "0 10px 20px rgba(27,48,103,0.2)",
            }}
          >
            <h2 style={{ color: "#ffffff" }}>
              Find Your Exact Daily Calorie Target in 60 Seconds
            </h2>
            <p
              style={{
                color: "rgba(255,255,255,0.85)",
                maxWidth: "600px",
                margin: "0 auto 24px auto",
                lineHeight: 1.7,
              }}
            >
              Stop guessing. Enter your stats into our free calorie calculator
              and get your personal TDEE, your weight loss calorie target, and a
              full breakdown — free, no sign-up, no account required.
            </p>
            <Link
              href="/calorie-calculator/"
              style={{
                display: "inline-block",
                backgroundColor: "#1F9FB8",
                color: "#fff",
                padding: "14px 36px",
                fontSize: "1.1rem",
                fontWeight: 700,
                textDecoration: "none",
                borderRadius: "6px",
              }}
            >
              Calculate My Calories →
            </Link>
          </section>

          {/* FAQ */}
          <section>
            <h2>Frequently Asked Questions</h2>

            {[
              [
                "How many calories should I eat a day to lose weight?",
                "It depends entirely on your TDEE (Total Daily Energy Expenditure), which is personal to your height, weight, age, sex, and activity level. As a general framework: calculate your TDEE using the Mifflin-St Jeor formula, then subtract 300–500 calories for a moderate deficit targeting 0.5–1 pound of fat loss per week. Use our calorie calculator to get your specific number rather than relying on generic targets.",
              ],
              [
                "What is TDEE and why does it matter for weight loss?",
                "TDEE (Total Daily Energy Expenditure) is the total number of calories your body burns in a full day, including resting metabolism (BMR), food digestion (thermic effect of food), exercise, and all non-exercise movement (NEAT). It is the number that determines your maintenance calories. Creating a deficit below your TDEE causes fat loss. Eating at TDEE maintains weight. Eating above it causes weight gain. All calorie-based weight management math is built around this number.",
              ],
              [
                "Is 1,200 calories enough to lose weight?",
                "For very short, sedentary women it may produce a deficit, but 1,200 calories is the clinical minimum floor — not a recommended target. Most women have a TDEE between 1,700–2,200 calories, making 1,200 an aggressive 500–1,000 calorie deficit. Staying at 1,200 for extended periods risks metabolic adaptation, muscle loss, nutrient deficiencies, and rebound weight gain. A moderate deficit of 300–500 calories below your personal TDEE is far more effective long-term.",
              ],
              [
                "Why am I not losing weight in a calorie deficit?",
                "The most common reasons are: (1) underestimating calorie intake — research shows people underestimate by an average of 47%; (2) overestimating activity level, making the assumed deficit smaller than reality; (3) metabolic adaptation after weeks of restriction, where the body reduces its energy expenditure to match lower intake; (4) water retention masking real fat loss; and (5) an underlying medical condition like hypothyroidism or PCOS affecting metabolism. Track meticulously for 2 weeks and verify accuracy before assuming adaptation.",
              ],
              [
                "How much weight can I lose in a week safely?",
                "The evidence-based safe range is 0.5–1% of body weight per week. For a 160-pound person, that is 0.8–1.6 pounds per week. Losing faster than 1% of body weight weekly is associated with accelerated muscle loss, greater metabolic adaptation, and higher likelihood of rebound. Losing slower (0.25–0.5 lbs/week) is perfectly fine and is often optimal for people close to their goal weight or prioritizing body composition over scale speed.",
              ],
              [
                "Do I need to recalculate my calories as I lose weight?",
                "Yes — this is critical and most people skip it. As your body gets lighter, it burns fewer calories. A person who weighed 200 pounds burns more calories than the same person at 175 pounds, even if everything else stays the same. Failing to recalculate means your initial deficit gradually erodes as your weight drops. Recalculate your TDEE and daily calorie target every 10–15 pounds lost using the Mifflin-St Jeor formula or our calorie calculator.",
              ],
              [
                "What should my calorie deficit be to lose 1 pound a week?",
                "One pound of fat stores approximately 3,500 calories. To lose 1 pound per week, you need a total weekly deficit of 3,500 calories — which equals 500 calories per day below your TDEE. If your TDEE is 2,200 calories, your daily weight loss target would be 1,700 calories. This math is accurate as a starting estimate, though actual results vary slightly with body composition and metabolic adaptation.",
              ],
              [
                "Does eating more protein help with weight loss?",
                "Yes, significantly. Protein has three direct benefits during a calorie deficit: it preserves muscle mass (so more of the weight lost comes from fat), it has a higher thermic effect than other macronutrients (your body burns 20–30% of protein calories just digesting it), and it is the most satiating macronutrient (keeping you fuller at the same calorie intake). The evidence-based protein target during weight loss is 0.7–1.0 grams per pound of body weight per day.",
              ],
            ].map(([q, a], i) => (
              <div className="faq-item" key={i}>
                <h3 onClick={() => toggleFAQ(i)}>
                  {q}
                  <i
                    className={`fa-solid fa-chevron-down ${openFAQ === i ? "rotate" : ""}`}
                  />
                </h3>
                {openFAQ === i && <p style={{ margin: 0 }}>{a}</p>}
              </div>
            ))}
          </section>
        </article>
      </div>

      {/* SIDEBAR */}
      <aside className="blog-sidebar">
        <p>Recent Blogs</p>
        <ul>
          {[
            ["/blog/2026-tax-brackets/", "2026 Tax Brackets: Complete Guide"],
            [
              "/blog/matrix-calculator-guide/",
              "Matrix Calculator: Complete Guide",
            ],
            [
              "/blog/healthy-bodyfat-percentage-by-age-and-gender/",
              "Healthy Body Fat % by Age & Gender",
            ],
            ["/blog/renting-vs-buying-a-home/", "Renting vs. Buying a Home"],
            [
              "/blog/can-ai-replace-financial-calculators/",
              "Can AI Replace Financial Calculators?",
            ],
          ].map(([href, label]) => (
            <li key={href as string}>
              <Link href={href as string}>
                <span
                  style={{
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <i
                    className="fa-solid fa-angle-right"
                    style={{ color: "#D8A13A" }}
                  />
                  {label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
