import Link from "next/link";


import "@fortawesome/fontawesome-free/css/all.min.css";
import { IconCircle, Icons } from "../components/MenuIcons";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Health & Clinical Calculators",
  description:
    "BMI, body fat and calorie tools plus clinical dosing, IV rate and pharmacology calculators — with a guide to which one answers which question.",
  alternates: {
    canonical: "/health-calculators/",
  },
  openGraph: {
    title: "Free Health Calculators | Numbers On Your Tip",
    description:
      "BMI, body fat, calorie needs, medication dosing, IV drip rates, and pharmacokinetics — health tools for everyday and clinical use.",
    url: "/health-calculators/",
    type: "website",
  },
  twitter: {
    title: "Health Calculators",
    description:
      "BMI, body fat, calories, dosing, and clinical calculators — all free.",
  },
};

export default function Healthcals() {
  return (
    <>
      {/* =======================
    SECTION 2 – TWO COLUMN
=========================== */}
      <div className="section-two">
        <div className="section-two-inner single-col">
          {/* Left Content */}
          <section>
            {" "}
            <h1 className="more-tools">Health Calculators</h1>
            <p style={{ maxWidth: "640px", marginBottom: "28px", lineHeight: 1.7 }}>
              This collection covers both everyday health tracking — BMI,
              body fat percentage, and daily calorie needs — and clinical
              calculators built for nurses, pharmacists, and healthcare
              students, including weight-based medication dosing, IV drip
              rates, and pharmacokinetics. Every tool uses standard,
              published formulas (WHO guidelines, the U.S. Navy body fat
              method, Mifflin-St Jeor for calories) and runs entirely in your
              browser. Clinical tools are reference aids for practice and
              study — always verify dosing against a licensed provider and
              current drug references before administering any medication.
            </p>
            <div
              className="icon-grid1"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "15px",
                marginBottom: "50px",
              }}
            >
              {[
                {
                  name: (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px", // space between icon & text
                      }}
                    >
                      <IconCircle color="blue">
                        <Icons.Bmi />
                      </IconCircle>{" "}
                      <h4> BMI Calculator </h4>
                    </div>
                  ),
                  href: "/bmi-calculator/",
                },
                {
                  name: (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px", // space between icon & text
                      }}
                    >
                      <IconCircle color="teal">
                        <Icons.BodyFat />
                      </IconCircle>{" "}
                      <h4>Body Fat Calculator</h4>
                    </div>
                  ),
                  href: "/body-fat-calculator/",
                },
                {
                  name: (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px", // space between icon & text
                      }}
                    >
                      <IconCircle color="coral">
                        <Icons.Calorie />
                      </IconCircle>{" "}
                      <h4>Calorie Calculator</h4>
                    </div>
                  ),
                  href: "/calorie-calculator/",
                },

                {
                  name: (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px", // space between icon & text
                      }}
                    >
                      <IconCircle color="green">
                        <Icons.Dose />
                      </IconCircle>{" "}
                      <h4>Dose Calculator</h4>
                    </div>
                  ),
                  href: "/dose-calculator/",
                },
                {
                  name: (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px", // space between icon & text
                      }}
                    >
                      <IconCircle color="pink">
                        <Icons.DoseStock />
                      </IconCircle>{" "}
                      <h4>Dose Stock Calculator</h4>
                    </div>
                  ),
                  href: "/dose-stock-calculator/",
                },
                {
                  name: (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px", // space between icon & text
                      }}
                    >
                      <IconCircle color="purple">
                        <Icons.IV />
                      </IconCircle>{" "}
                      <h4>IV Drip Calculator</h4>
                    </div>
                  ),
                  href: "/iv-calculator/",
                },

                {
                  name: (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px", // space between icon & text
                      }}
                    >
                      <IconCircle color="purple">
                        <Icons.Pharmaco />
                      </IconCircle>{" "}
                      <h4>Pharmaco kinetics Calculator</h4>
                    </div>
                  ),
                  href: "/pharmacokinetics-calculator/",
                },
                {
                  name: (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px", // space between icon & text
                      }}
                    >
                      <IconCircle color="green">
                        <Icons.Dynamics />
                      </IconCircle>{" "}
                      <h4>Pharmaco dynamics Calculator</h4>
                    </div>
                  ),
                  href: "/pharmacodynamics-calculator/",
                },

                // ... add more as needed
              ].map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  style={{ textDecoration: "none" }}
                >
                  <div
                    className="calc-card bullet"
                    style={{
                      textAlign: "start",
                      padding: "12px 18px",
                      border: "1px solid #e4e6ee",

                      color: "black",
                      background: "white",
                      borderRadius: "12px",

                      transition: "0.2s ease",
                      cursor: "pointer",
                    }}
                  >
                    <div
                      className="card-title"
                      style={{ fontWeight: 600, fontSize: "14px", margin: 0 }}
                    >
                      {item.name}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <h2>Start From the Question, Not the Tool</h2>
            <p>
              Tool names are not always obvious about what they answer,
              particularly on the clinical side where two calculators can sound
              almost identical. This is the shortest route from a question to
              the right page.
            </p>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>What you want to know</th>
                    <th>Use</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Whether my weight is in a healthy range for my height</td>
                    <td>
                      <Link className="my-link" href="/bmi-calculator/">
                        BMI calculator
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      How much of my weight is fat rather than muscle
                    </td>
                    <td>
                      <Link className="my-link" href="/body-fat-calculator/">
                        Body fat calculator
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <td>How much I should be eating each day</td>
                    <td>
                      <Link className="my-link" href="/calorie-calculator/">
                        Calorie calculator
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      How many milligrams a patient should get, given their
                      weight
                    </td>
                    <td>
                      <Link className="my-link" href="/dose-calculator/">
                        Dosage calculator
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      How many tablets or millilitres that dose comes to from
                      the stock I have
                    </td>
                    <td>
                      <Link className="my-link" href="/dose-stock-calculator/">
                        Dose stock calculator
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      How fast to run an infusion, or how long it will take
                    </td>
                    <td>
                      <Link className="my-link" href="/iv-calculator/">
                        IV and IVIG calculator
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      How long a drug stays in the body, or what maintenance
                      dose holds a level
                    </td>
                    <td>
                      <Link
                        className="my-link"
                        href="/pharmacokinetics-calculator/"
                      >
                        Pharmacokinetics calculator
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      How concentration relates to effect, or what a therapeutic
                      index means
                    </td>
                    <td>
                      <Link
                        className="my-link"
                        href="/pharmacodynamics-calculator/"
                      >
                        Pharmacodynamics calculator
                      </Link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2>The Everyday Three Answer Different Questions</h2>
            <p>
              BMI, body fat and calories are often treated as interchangeable
              health metrics. They are not, and using only one of them is where
              most confusion comes from.
            </p>
            <p>
              BMI compares weight against height and nothing else. It is fast
              and it is a screening figure — useful for placing yourself
              roughly, useless for telling muscle from fat. Body fat percentage
              adds the dimension BMI is missing by using tape measurements to
              estimate composition, which is why two people with identical BMI
              can produce very different body fat results. Calorie needs answer
              a third question entirely: not what your body is made of, but how
              much energy it uses.
            </p>
            <p>
              A sensible sequence is BMI first for a rough position, body fat
              second if the BMI result seems at odds with how you look, and
              calories third once you have decided whether you want the number
              to change.
            </p>

            <h2>The Clinical Five Sit in a Chain</h2>
            <p>
              The clinical calculators are not alternatives to each other. Each
              handles one link between a prescription and an administered dose,
              and a single order can pass through three of them.
            </p>
            <pre>
              Prescription in mg/kg{"\n"}→ Dosage calculator gives the dose in
              mg{"\n"}→ Dose stock calculator converts mg into tablets or mL
              {"\n"}→ IV calculator turns that into a pump rate or drip rate
            </pre>
            <p>
              A paediatric antibiotic order typically stops after the second
              step. An intravenous antibiotic runs the full chain. An
              immunoglobulin infusion adds a fourth consideration, since the
              rate changes during administration rather than staying fixed.
            </p>
            <p>
              The two pharmacology calculators sit alongside rather than inside
              that chain. Pharmacokinetics answers what the body does to the
              drug — half-life, clearance, how long until a level is meaningful.
              Pharmacodynamics answers what the drug does to the body once it
              arrives. Both are more often used for study and for interpreting
              monitored levels than at the point of administration.
            </p>

            <h2>What These Tools Do Not Do</h2>
            <p>
              Every calculator here checks arithmetic. None of them checks
              clinical judgement, and the difference matters most on the pages
              where the stakes are highest.
            </p>
            <p>
              A dose calculator cannot know the drug, the indication, the
              patient&apos;s renal function, what else they are taking, or
              whether the rate you typed was the one on the prescription. It
              will multiply whatever it is given and return a confident-looking
              number. Treat every clinical result as a figure to be checked
              against the prescribing reference, and for high-risk medicines,
              recalculated independently by a second clinician rather than
              confirmed by them.
            </p>
            <p>
              The consumer tools carry a milder version of the same limit. They
              apply population equations to your measurements, which makes them
              a good starting estimate and a poor final verdict. Each page sets
              out where its own method breaks down.
            </p>

            <h2>How These Pages Are Reviewed</h2>
            <p>
              The clinical formulas, dosing logic, unit handling and safety
              wording across these calculators were reviewed for accuracy by{" "}
              <Link className="my-link" href="/about-us/#medical-reviewer">
                Dr. Syeda Khadija Akbar, PharmD
              </Link>
              , our medical reviewer. Each page shows its own review date, and
              the{" "}
              <Link className="my-link" href="/disclaimer/">
                disclaimer
              </Link>{" "}
              sets out what that review does and does not cover.
            </p>
            <section className="related-guides">
              <h2>Reading Behind the Clinical Tools</h2>
              <p>These go further into the reasoning behind the clinical tools above — the arithmetic worked out in full, and where it usually goes wrong.</p>
              <ul>
                <li>
                  <Link href="/blog/ultimate-iv-infusion-calculator-guide/" className="related-card">
                    <span className="related-title">IV Infusion Calculations: Drip Rates, Pump Rates and IVIG Ramps</span>
                    <span className="related-blurb">Why a stepped IVIG infusion runs an hour longer than volume divided by rate suggests.</span>
                  </Link>
                </li>
                <li>
                  <Link href="/blog/medication-dose-calculation-complete-guide-to-dose-calculator-safe-drug-dosing/" className="related-card">
                    <span className="related-title">Medication Dose Calculation: Where the Errors Actually Come From</span>
                    <span className="related-blurb">Dosing mistakes are decimal points and misread units, not arithmetic.</span>
                  </Link>
                </li>
                <li>
                  <Link href="/blog/healthy-bodyfat-percentage-by-age-and-gender/" className="related-card">
                    <span className="related-title">Healthy Body Fat Percentage by Age and Gender</span>
                    <span className="related-blurb">What the standard ranges mean, and why where the fat sits matters more.</span>
                  </Link>
                </li>
                <li>
                  <Link href="/blog/how-many-calories-to-lose-weight/" className="related-card">
                    <span className="related-title">How Many Calories Should I Eat to Lose Weight?</span>
                    <span className="related-blurb">Setting a deficit you can hold, and why the first two weeks mislead.</span>
                  </Link>
                </li>
              </ul>
            </section>

          </section>
        </div>
      </div>

      {/* =======================
    SECTION 3 – ICON BOXES
=========================== */}
    </>
  );
}
