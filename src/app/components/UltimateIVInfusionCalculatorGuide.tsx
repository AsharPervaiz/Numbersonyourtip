"use client";
import Link from "next/link";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useState } from "react";

export default function IVCalculatorBlogPost() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="blog-container">
      {/* MAIN CONTENT (70%) */}
      <div className="blog-content">
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
            style={{
              textDecoration: "none",
              color: "#000000",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
            className="my-link"
          >
            <i className="fa-solid fa-house"></i>
            Home
          </Link>

          <i
            className="fa-solid fa-angle-right"
            style={{ fontSize: "12px" }}
          ></i>

          <span style={{ color: "#000000" }}>
            The Ultimate Guide to IV Infusion Calculations: Formulas, Drip
            Rates, and Dosages
          </span>
        </div>
        <hr></hr>
        <img src="/blog3.1.webp" className="image-blog" alt="blog" />
        <div className="content-blog">
          <small
            className="meta-blog"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "40px ", // gap between date and author sections
            }}
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontWeight: "600",
                color: "#888",
                fontSize: "14px",
              }}
            >
              <img className="founder-photo" src="/founder_photo.webp" alt="" />
              Ashar Pervaiz
            </span>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontWeight: "600",
                color: "#888",
                fontSize: "14px",
              }}
            >
              <i className="custom-meta-icon fa-solid fa-calendar"></i>13 April
              2026
            </span>
          </small>
        </div>
        <article className="seo-blog-post">
          {/* --- HEADER & FEATURED SNIPPET --- */}
          <header>
            <h1>
              The Ultimate Guide to IV Infusion Calculations: Formulas, Drip
              Rates, and Dosages
            </h1>
          </header>

          <section
            className="featured-snippet"
            style={{
              backgroundColor: "#1F9FB8",
              color: "white",
              padding: "20px",
              borderLeft: "5px solid #1B3066",
              borderRadius: "10px",
              margin: "20px 0",
            }}
          >
            <h2>What is an IV Infusion Calculator?</h2>
            <p style={{ color: "white" }}>
              An <strong>IV infusion calculator</strong> is a critical medical
              tool used by healthcare professionals to determine the exact rate,
              volume, and dosage of intravenous fluids or medications. By using
              specific formulas like the <strong>ml hr formula</strong> and the{" "}
              <strong>drip rate formula</strong>, medical staff can ensure safe
              patient care. Whether calculating simple fluid resuscitation or
              complex microgram-per-kilogram-per-minute (mcg/kg/min) titrations,
              accuracy in an <strong>iv therapy calculator</strong> prevents
              medication errors and saves lives.
            </p>
          </section>

          {/* --- INTRODUCTION --- */}
          <section id="introduction">
            <h2>Introduction to IV Therapy and Infusion Calculations</h2>
            <p>
              Intravenous (IV) therapy is a foundational element of modern
              global medicine. From emergency rooms in the United States to
              intensive care units in the UK, Europe, and Asia, administering
              fluids and medications directly into a patient's bloodstream is
              the fastest way to achieve systemic effects. However, this speed
              comes with profound responsibility. A minor mathematical error can
              lead to severe clinical consequences.
            </p>
            <p>
              This is exactly where an accurate{" "}
              <strong>iv therapy calculator</strong> becomes indispensable.
              Whether you are a seasoned ICU nurse, a paramedic in the field, a
              doctor prescribing complex chemotherapy, or a medical student
              preparing for pharmacological exams, mastering the math behind the
              medicine is non-negotiable.
            </p>
            <p>
              In this comprehensive guide, we will break down everything from
              basic <strong>drip rate calculator</strong> formulas to advanced{" "}
              <strong>infusion dose calculator</strong> methodologies. We will
              explore global standards, provide step-by-step clinical examples,
              and equip you with the knowledge to safely calculate and
              administer IV medications.
            </p>
            <p>
              <em>
                Want to skip the manual math? Try our interactive{" "}
                <Link href="/iv-calculator/" className="my-link">
                  IV Infusion Calculator
                </Link>{" "}
                and{" "}
                <Link href="/dose-calculator/" className="my-link">
                  Dose Calculator
                </Link>{" "}
                directly on <strong>Numbers on Your Tip</strong>.
              </em>
            </p>
          </section>

          {/* --- SECTION 1: BODY WEIGHT DOSE --- */}
          <section id="body-weight-dose">
            <h2>1. Body Weight Dose Calculation (mg/kg)</h2>
            <p>
              Weight-based dosing is the gold standard for pediatric patients
              worldwide and is increasingly used for specific high-risk
              medications in adults (such as critical care vasoactive drugs and
              oncology medications). Because every patient metabolizes drugs
              differently based on their size, calculating the dose per kilogram
              of body weight ensures therapeutic efficacy while minimizing
              toxicity.
            </p>

            <h3>The Core Formula</h3>
            <div
              className="formula-box"
              style={{
                background: "#1F9FB8",
                color: "white",
                padding: "15px",
                borderRadius: "8px",
              }}
            >
              <p style={{ color: "white" }}>
                <strong>
                  Patient Dose = Patient Weight (kg) × Ordered Dose (mg/kg)
                </strong>
              </p>
            </div>

            <h3>Understanding mg/kg and mcg/kg/min</h3>
            <p>
              While standard ward medications might use simple milligrams per
              kilogram (mg/kg), intensive care settings often require a{" "}
              <strong>mcg kg min calculator</strong>. This means you are
              calculating micrograms of the drug, per kilogram of the patient's
              body weight, delivered every single minute. It is one of the most
              complex <strong>drug calculation formulas for infusion</strong>.
            </p>

            <h3>Real-Life Clinical Examples</h3>
            <div className="example-box">
              <h4>Example A: Pediatric Antibiotic (Simple)</h4>
              <ul>
                <li>
                  <strong>Scenario:</strong> A doctor orders Amoxicillin for a
                  child weighing 44 lbs. The dose is 15 mg/kg.
                </li>
                <li>
                  <strong>Step 1 (Convert lbs to kg):</strong> 44 lbs ÷ 2.2 = 20
                  kg.{" "}
                  <em>(Global tip: Always use kg in medical calculations!)</em>
                </li>
                <li>
                  <strong>Step 2 (Calculate Dose):</strong> 20 kg × 15 mg/kg ={" "}
                  <strong>300 mg</strong>.
                </li>
              </ul>

              <h4>Example B: Adult Emergency Medication (Complex)</h4>
              <ul>
                <li>
                  <strong>Scenario:</strong> A 70 kg adult patient needs a
                  Dopamine infusion. The order is 5 mcg/kg/min.
                </li>
                <li>
                  <strong>Step 1:</strong> Calculate total micrograms per
                  minute: 70 kg × 5 mcg = 350 mcg/min.
                </li>
                <li>
                  <strong>Step 2:</strong> This result must then be
                  cross-referenced with the medication concentration to
                  determine the final{" "}
                  <strong>iv infusion rate calculator</strong> settings on the
                  pump.
                </li>
              </ul>
            </div>
            <p>
              <strong>Safety Consideration:</strong> Always ensure the patient's
              weight is current. Relying on estimated weights or outdated
              records is a leading cause of dosing errors globally.
            </p>
          </section>

          {/* --- SECTION 2: IV DRIP RATE --- */}
          <section id="iv-drip-rate">
            <h2>2. IV Drip Rate Calculation (Drops Per Minute / gtt/min)</h2>
            <p>
              In many parts of the world, especially in pre-hospital settings,
              field medicine, or hospitals without an abundance of electronic
              volumetric pumps, gravity infusions are heavily utilized. To
              control a gravity infusion, healthcare providers must calculate
              the manual drip rate. This requires a reliable{" "}
              <strong>iv drip rate calculator</strong> formula.
            </p>

            <h3>What is the Drop Factor (gtt/mL)?</h3>
            <p>
              The drop factor is the number of drops (gtt) it takes to make up
              one milliliter (1 mL) of fluid. This depends entirely on the
              physical IV tubing set you are using. You must look at the
              packaging of the IV line to find the{" "}
              <strong>drop factor equation</strong> variables.
            </p>
            <ul>
              <li>
                <strong>Macrodrip Sets:</strong> Typically deliver large drops.
                Common factors are 10 gtt/mL, 15 gtt/mL, or 20 gtt/mL. Used for
                rapid <strong>fluid resuscitation</strong>, blood transfusions,
                and routine hydration.
              </li>
              <li>
                <strong>Microdrip Sets:</strong> Typically deliver tiny drops,
                universally calibrated at 60 gtt/mL. Often used for pediatric
                patients or precise medication drips.
              </li>
            </ul>

            <h3>The Drip Rate Formula</h3>
            <div
              className="formula-box"
              style={{
                background: "#1F9FB8",
                padding: "15px",
                borderRadius: "8px",
              }}
            >
              <p style={{ color: "white" }}>
                <strong>
                  Drip Rate (gtt/min) = (Total Volume (mL) × Drop Factor
                  (gtt/mL)) / Total Time (minutes)
                </strong>
              </p>
            </div>

            <h3>How to Calculate gtt min: Step-by-Step Examples</h3>
            <div className="example-box">
              <h4>Example: Routine Fluid Resuscitation</h4>
              <ul>
                <li>
                  <strong>Order:</strong> Administer 1,000 mL of Normal Saline
                  (0.9% NaCl) over 8 hours.
                </li>
                <li>
                  <strong>Equipment:</strong> The tubing packaging states a drop
                  factor of 15 gtt/mL.
                </li>
                <li>
                  <strong>Step 1:</strong> Convert hours to minutes using the{" "}
                  <strong>infusion time formula</strong> (8 hours × 60 = 480
                  minutes).
                </li>
                <li>
                  <strong>Step 2:</strong> Apply the{" "}
                  <strong>drops per minute formula</strong>.
                </li>
                <li>
                  <strong>Calculation:</strong> (1,000 mL × 15 gtt/mL) / 480
                  mins = 15,000 / 480 = 31.25.
                </li>
                <li>
                  <strong>Result:</strong> Because you cannot count a fraction
                  of a drop, you round to <strong>31 gtt/min</strong>.
                </li>
              </ul>
            </div>
            <p>
              Learning <strong>how to calculate drip rate</strong> manually is a
              vital skill. By knowing your <strong>gtt formula</strong>, you can
              ensure your patient receives the exact prescribed therapy even in
              the event of a power outage or pump failure.
            </p>
          </section>

          {/* --- SECTION 3: DOSE FROM VIAL --- */}
          <section id="dose-from-vial">
            <h2>3. Dose from Vial Calculation (Liquid Concentration)</h2>
            <p>
              Medications are rarely supplied in the exact dose prescribed. They
              often come in vials with a specific concentration (e.g., 500 mg in
              10 mL). You must figure out how many milliliters of liquid to draw
              up in your syringe to get the correct milligram dose. This is
              where an <strong>infusion dose calculator</strong> logic applies.
            </p>

            <h3>The Universal Formula (Desired over Have)</h3>
            <div
              className="formula-box"
              style={{
                background: "#1F9FB8",
                padding: "15px",
                borderRadius: "8px",
              }}
            >
              <p style={{ color: "white" }}>
                <strong>
                  Volume to Administer = (Desired Dose / Have Concentration) ×
                  Volume on Hand
                </strong>
              </p>
            </div>

            <h3>Step-by-Step Example</h3>
            <div className="example-box">
              <ul>
                <li>
                  <strong>Order:</strong> Administer 4 mg of Ondansetron
                  (Zofran) IV push.
                </li>
                <li>
                  <strong>Supplied:</strong> A vial labeled 8 mg / 4 mL.
                </li>
                <li>
                  <strong>Desired:</strong> 4 mg
                </li>
                <li>
                  <strong>Have:</strong> 8 mg
                </li>
                <li>
                  <strong>Volume:</strong> 4 mL
                </li>
                <li>
                  <strong>Calculation:</strong> (4 mg / 8 mg) × 4 mL = 0.5 × 4
                  mL = <strong>2 mL</strong>.
                </li>
              </ul>
            </div>
            <p>
              This basic formulation is the backbone of safe IV pushes and is
              the preliminary step before setting up a{" "}
              <strong>medication drip calculator</strong> for continuous
              infusions.
            </p>
          </section>

          {/* --- SECTION 4: INFUSION RATE --- */}
          <section id="infusion-rate">
            <h2>4. Infusion Rate Calculation (mL/hr for IV Pumps)</h2>
            <p>
              In modern hospitals across the US, UK, EU, and advanced medical
              centers in Asia, electronic infusion pumps (smart pumps) are the
              standard of care. These pumps do not measure drops; they measure
              continuous volume over time. Therefore, you must know{" "}
              <strong>how to calculate ml per hour</strong> using an{" "}
              <strong>iv pump calculator</strong>.
            </p>

            <h3>The mL/hr Formula</h3>
            <div
              className="formula-box"
              style={{
                background: "#1F9FB8",
                padding: "15px",
                borderRadius: "8px",
              }}
            >
              <p style={{ color: "white" }}>
                <strong>
                  Infusion Rate (mL/hr) = Total Volume (mL) / Total Time (hours)
                </strong>
              </p>
            </div>

            <h3>How to Calculate ML Per Hour</h3>
            <div className="example-box">
              <h4>Example A: Total Parenteral Nutrition (TPN)</h4>
              <ul>
                <li>
                  <strong>Order:</strong> Infuse 1,200 mL of TPN over 12 hours.
                </li>
                <li>
                  <strong>Calculation:</strong> 1,200 mL / 12 hours ={" "}
                  <strong>100 mL/hr</strong>.
                </li>
                <li>
                  <strong>Result:</strong> You will set your{" "}
                  <strong>iv rate calculator</strong> on the pump to 100 mL/hr.
                </li>
              </ul>

              <h4>Example B: Less than an Hour (Antibiotic Infusion)</h4>
              <p>
                What if the medication needs to be infused in 30 minutes? You
                must adjust the time factor.
              </p>
              <ul>
                <li>
                  <strong>Order:</strong> 50 mL of Vancomycin to be infused over
                  30 minutes.
                </li>
                <li>
                  <strong>Step 1:</strong> Convert minutes to hours (30 mins =
                  0.5 hours).
                </li>
                <li>
                  <strong>Step 2:</strong> Apply the{" "}
                  <strong>calculate iv flow rate ml hr</strong> formula: 50 mL /
                  0.5 hr = <strong>100 mL/hr</strong>.
                </li>
              </ul>
            </div>
            <p>
              By understanding the{" "}
              <strong>infusion flow rate calculator</strong> mechanics,
              clinicians can program syringe drivers and volumetric pumps
              accurately, preventing dangerous under-dosing or lethal fluid
              overload.
            </p>
          </section>
          <img src="/blog3.2.webp" className="image-blog" alt="blog" />
          {/* --- QUICK REFERENCE TABLE --- */}
          <section id="formulas-table">
            <h2>Quick Reference: IV Infusion Formulas Table</h2>
            <p>
              Bookmark this page to keep these essential{" "}
              <strong>infusion calculator</strong> formulas at your fingertips.
            </p>
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
                    background: "#1B3066",
                    color: "#fff",
                    textAlign: "left",
                  }}
                >
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                    Calculation Type
                  </th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                    Formula / Equation
                  </th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                    Primary Use Case
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    <strong>Body Weight Dosing</strong>
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    Weight (kg) × Dose (mg/kg)
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    Pediatrics, critical care meds
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    <strong>mL/hr Rate</strong> (Pump)
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    Total Volume (mL) ÷ Total Time (hr)
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    Electronic IV pumps
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    <strong>Drip Rate</strong> (Gravity)
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    [Volume (mL) × Drop Factor] ÷ Time (min)
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    Manual IV drips without pumps
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    <strong>Liquid Dose (Vial)</strong>
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    (Desired / Have) × Volume
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    IV pushes, drawing up meds
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    <strong>Infusion Time</strong>
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    Total Volume (mL) ÷ Rate (mL/hr)
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    Estimating when a bag will empty
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

          {/* --- TIPS AND MISTAKES --- */}
          <section
            id="tips-and-mistakes"
            style={{
              backgroundColor: "#1F9FB8",
              padding: "20px",
              borderRadius: "8px",
              margin: "20px 0",
              color: "white",
            }}
          >
            <h2>Pro Tips & Common Calculation Mistakes</h2>
            <p style={{ color: "white" }}>
              Even with the best <strong>iv drip dosage calculator</strong>,
              human errors occur. Keep these safety tips in mind:
            </p>
            <ul>
              <li style={{ color: "white" }}>
                <strong>Pound to Kilogram Confusion:</strong> The #1 pediatric
                medication error globally. Always divide pounds by 2.2 to get
                kilograms. Never calculate a dose based on pounds.
              </li>
              <li style={{ color: "white" }}>
                <strong>Minute vs. Hour Mix-ups:</strong> Gravity drips use{" "}
                <em>minutes</em> (gtt/min). IV pumps use <em>hours</em> (mL/hr).
                Do not mix up the time measurements!
              </li>
              <li style={{ color: "white" }}>
                <strong>Ignoring the Drop Factor:</strong> Not all IV tubing is
                the same. Assuming a 15 gtt/mL drop factor when you actually
                have a 20 gtt/mL set will significantly alter your{" "}
                <strong>drip rate formula</strong> results.
              </li>
              <li style={{ color: "white" }}>
                <strong>Pump Programming Errors:</strong> "Smart pumps" are only
                as smart as the person programming them. Always double-check
                your zeroes (e.g., 10.0 vs 100).
              </li>
            </ul>
          </section>

          {/* --- FAQS --- */}
          <section>
            <h2>Frequently Asked Questions (FAQs)</h2>

            <div className="faq-item">
              <h3 onClick={() => toggleFAQ(0)}>
                1. What is the difference between an IV pump and a gravity drip?
                <i
                  className={`fa-solid fa-chevron-down ${openFAQ === 0 ? "rotate" : ""}`}
                ></i>
              </h3>
              {openFAQ === 0 && (
                <p>
                  An IV pump is an electronic device that forces fluid into the
                  vein at a highly controlled rate, calculated using a{" "}
                  <strong>ml hr formula</strong> (mL/hr). A gravity drip relies
                  on gravity to pull fluid down into the vein, and the rate is
                  manually controlled by adjusting a roller clamp and counting
                  drops using a <strong>drip rate calculator</strong> (gtt/min).
                </p>
              )}
            </div>

            <div className="faq-item">
              <h3 onClick={() => toggleFAQ(1)}>
                2. How do I use a mcg kg min calculator?
                <i
                  className={`fa-solid fa-chevron-down ${openFAQ === 1 ? "rotate" : ""}`}
                ></i>
              </h3>
              {openFAQ === 1 && (
                <p>
                  A <strong>mcg kg min calculator</strong> is used for titrating
                  powerful drugs (like Vasopressors). First, calculate the
                  micrograms needed per minute by multiplying the patient's
                  weight in kg by the ordered mcg dose. Then, find out how many
                  mcg are in 1 mL of your IV bag. Divide your needed mcg/min by
                  the mcg/mL to get mL/min, and multiply by 60 to find your pump
                  setting in mL/hr.
                </p>
              )}
            </div>

            <div className="faq-item">
              <h3 onClick={() => toggleFAQ(2)}>
                3. How do I calculate the infusion time of an IV bag?
                <i
                  className={`fa-solid fa-chevron-down ${openFAQ === 2 ? "rotate" : ""}`}
                ></i>
              </h3>
              {openFAQ === 2 && (
                <p>
                  Using the <strong>infusion time formula</strong>: Divide the
                  total volume of the bag (in mL) by the infusion rate (in
                  mL/hr). For example, a 1,000 mL bag running at 125 mL/hr will
                  take exactly 8 hours to complete (1000 / 125 = 8).
                </p>
              )}
            </div>

            <div className="faq-item">
              <h3 onClick={() => toggleFAQ(3)}>
                4. What does "fluid resuscitation" mean for IV calculations?
                <i
                  className={`fa-solid fa-chevron-down ${openFAQ === 3 ? "rotate" : ""}`}
                ></i>
              </h3>
              {openFAQ === 3 && (
                <p>
                  <strong>Fluid resuscitation</strong> is the rapid
                  administration of large volumes of IV fluids to treat profound
                  dehydration, shock, or trauma. These calculations often
                  require high flow rates, requiring providers to use macrodrip
                  tubings and rapid <strong>infusion rate calculator</strong>{" "}
                  settings.
                </p>
              )}
            </div>

            <div className="faq-item">
              <h3 onClick={() => toggleFAQ(4)}>
                5. Can I use an online iv infusion rate calculator in clinical
                practice?
                <i
                  className={`fa-solid fa-chevron-down ${openFAQ === 4 ? "rotate" : ""}`}
                ></i>
              </h3>
              {openFAQ === 4 && (
                <p>
                  While digital tools like an{" "}
                  <strong>infusion rate calculator</strong> provide excellent
                  secondary checks and help speed up complex math, most{" "}
                  <Link href={"https://www.cdc.gov"} className="my-link">
                    clinical guidelines
                  </Link>{" "}
                  state that healthcare professionals must verify automated
                  calculations manually. You should understand the underlying{" "}
                  <strong>drug calculation formula for infusion</strong>.
                </p>
              )}
            </div>
          </section>
          <img src="/blog3.3.webp" className="image-blog" alt="blog" />
          {/* --- CONCLUSION & CTA --- */}
          <section>
            <h2>Conclusion: Mastery of IV Calculations Saves Lives</h2>
            <p>
              Whether calculating a standard saline drip or a highly sensitive
              cardiac medication, mastering the math of IV therapy is essential
              for patient safety. By understanding the core equations—from the{" "}
              <strong>ml hr formula</strong> to the{" "}
              <strong>drip factor equation</strong>—you ensure precision in your
              clinical practice.
            </p>
            <p>
              Remember, calculations do not have to be intimidating. By breaking
              them down into logical steps, knowing your tubing equipment, and
              double-checking your math, you can deliver exceptional patient
              care.
            </p>
          </section>
        </article>

        {/* STATIC BLOG POSTS */}
      </div>

      {/* SIDEBAR (30%) */}
      <aside className="blog-sidebar">
        <p>Recent Blogs</p>

        <ul>
          <li>
            <Link href="/blog/what-is-vat/">
              <span
                style={{
                  textDecoration: "none",

                  display: "flex",
                  alignItems: "center",
                  gap: "6px", // space between icon and text
                }}
              >
                <i
                  className="fa-solid fa-angle-right"
                  style={{ color: "#D8A13A" }}
                ></i>
                What Is VAT?
              </span>
            </Link>
          </li>
          <li>
            <Link href="/blog/medication-dose-calculation-complete-guide-to-dose-calculator-safe-drug-dosing/">
              <span
                style={{
                  textDecoration: "none",

                  display: "flex",
                  alignItems: "center",
                  gap: "6px", // space between icon and text
                }}
              >
                <i
                  className="fa-solid fa-angle-right"
                  style={{ color: "#D8A13A" }}
                ></i>
                Medication Dose Calculation
              </span>
            </Link>
          </li>
          <li>
            <Link href="/blog/the-smart-renters-guide-what-you-can-actually-afford/">
              <span
                style={{
                  textDecoration: "none",

                  display: "flex",
                  alignItems: "center",
                  gap: "6px", // space between icon and text
                }}
              >
                <i
                  className="fa-solid fa-angle-right"
                  style={{ color: "#D8A13A" }}
                ></i>
                The Smart Renter's Guide
              </span>
            </Link>
          </li>
        </ul>
      </aside>
    </div>
  );
}
