"use client";
import { useState } from "react";
import Link from "next/link";
import "@fortawesome/fontawesome-free/css/all.min.css";
import BlogSidebar from "./BlogSidebar";
import ReviewedBy from "./ReviewedBy";

const FAQ_DATA: [string, string][] = [
  [
    "Why is writing 1.0 mg considered unsafe when 1 mg is not?",
    "Because the decimal point is the fragile part. If it is lost to a smudge, a fax, a photocopy or a low-resolution screen, 1.0 mg reads as 10 mg and the order still looks complete. Writing 1 mg removes the character that can fail. The mirror-image rule is to always write a leading zero, so that .5 mg cannot be read as 5 mg.",
  ],
  [
    "What is the difference between 1:1,000 and 1:10,000?",
    "A factor of ten. A 1:1,000 preparation is one gram in 1,000 mL, which is 1 mg/mL; 1:10,000 is one gram in 10,000 mL, which is 0.1 mg/mL. Both appear on adrenaline, for different routes, and mixing them up is a well-documented error. Converting a ratio strength to mg/mL before calculating anything removes the risk entirely.",
  ],
  [
    "Why does a 125 mg/5 mL label cause errors?",
    "Because it is read as 125 mg/mL. Oral liquids are usually labelled per 5 mL because that is a spoonful, so the concentration is 25 mg/mL, not 125. Reading it wrongly gives a dose five times too small — an error that is easy to miss, because unlike a tenfold overdose it produces no immediate harm, only a treatment that quietly does not work.",
  ],
  [
    "How can I check my own dose calculation properly?",
    "Re-derive it instead of re-reading it. Reading your working back tends to reproduce the original mistake, because you follow the same reasoning. Start again from the prescription and take a different route where possible — reach the answer through the total daily dose rather than the single dose, for instance — and compare the two results.",
  ],
  [
    "What makes a second check by a colleague genuinely independent?",
    "That they work from the prescription rather than from your answer. Asking someone to confirm a figure you have already stated makes agreement far more likely, because you have anchored them. A real independent check means handing over the order, the label and the weight, and comparing the two answers only afterwards.",
  ],
  [
    "Why are paediatric doses riskier to calculate than adult ones?",
    "Because there is no familiar range to compare against. Most adult doses cluster into recognisable figures, so a wrong answer looks wrong. Paediatric doses are calculated individually from weight, so every result is unfamiliar and an erroneous one blends in. Checking the volume for plausibility, and against the adult maximum, partly substitutes for that missing intuition.",
  ],
  [
    "Can a weight-based dose exceed the normal adult dose?",
    "Yes, and for a heavy adolescent it often will, because the formula keeps scaling with weight while the drug's maximum does not. Where the calculated dose passes the adult maximum, the adult maximum is generally the ceiling. No weight-based calculator knows this, so it is a check that has to happen after the arithmetic.",
  ],
  [
    "Does reconstituting a powder change the concentration I should use?",
    "It creates it. A powdered vial has no concentration until it is made up, and the final figure depends on the diluent volume actually added, which is not always the volume you intended. Read the concentration off the vial after reconstitution rather than working from the number you planned to use.",
  ],
  [
    "Is it safe to rely on an online dose calculator?",
    "As a second opinion on a number you have already worked out, yes. As a first and only source, no. A calculator answers the question it was given: it cannot see the patient, the order, the vial, the allergy list or the renal function, and it will return a confident answer to a question entered wrongly.",
  ],
];

export default function MedicationDoseCalculation() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="blog-container">
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
      {/* MAIN CONTENT (70%) */}
      <div className="blog-content">
        <img src="/blog2.1.webp" className="image-blog" alt="blog" />
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
              <Link href="/author/ashar-pervaiz/" className="byline-author">
              <img className="founder-photo" src="/founder_photo.webp" alt="" />
              Ashar Pervaiz
              </Link>
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
              <i className="custom-meta-icon fa-solid fa-calendar"></i>3 April
              2026
            </span>
          </small>
        </div>
        <main>
          <h1>Medication Dose Calculation: Where the Errors Actually Come From</h1>

          <p>
            The arithmetic in medication dosing is not difficult. It is
            multiplication and division that most people finished learning
            before they were twelve. Yet dosing remains one of the most common
            sources of preventable harm in healthcare, and the reason is that
            the errors do not come from the sums.
          </p>

          <p>
            They come from a decimal point, a unit read as another unit, a label
            that gives a total where you expected a concentration, or a number
            that was checked by the same person who produced it. This guide is
            about those failure modes. If what you need is the calculation
            itself, the{" "}
            <Link href="/dose-calculator/" className="my-link">
              dose calculator
            </Link>{" "}
            handles weight-based dosing and the{" "}
            <Link href="/dose-stock-calculator/" className="my-link">
              stock dose calculator
            </Link>{" "}
            converts a dose into what you draw up.
          </p>

          <h2>Dosing Errors Are Not Random</h2>

          <p>
            A useful thing about calculation errors is that they are not spread
            evenly. A dose is almost never wrong by seven percent. It is wrong
            by a factor — ten, sixty, a thousand — because the mistake was
            structural rather than arithmetic.
          </p>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Mistake</th>
                  <th>Answer is out by</th>
                  <th>Typical origin</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Decimal point misplaced</td>
                  <td>10× or 100×</td>
                  <td>A trailing zero or a leading decimal on a handwritten order</td>
                </tr>
                <tr>
                  <td>mcg read as mg</td>
                  <td>1,000×</td>
                  <td>Abbreviations that look alike at a glance</td>
                </tr>
                <tr>
                  <td>Per-minute treated as per-hour</td>
                  <td>60×</td>
                  <td>An infusion order converted in one step instead of two</td>
                </tr>
                <tr>
                  <td>Vial total read as concentration</td>
                  <td>Varies with vial size</td>
                  <td>A label showing both, read in the wrong order</td>
                </tr>
                <tr>
                  <td>Weight in pounds used as kilograms</td>
                  <td>2.2×</td>
                  <td>A chart recorded in one unit, an order written in the other</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            This is genuinely good news, because an error of that size is
            visible. Nobody can eyeball whether 1,080 mg is right for a
            particular patient, but almost anyone can tell that 10,800 mg is
            not. The single most effective check is not recalculating — it is
            pausing to ask whether the magnitude of the answer is believable
            before checking anything else.
          </p>

          <h2>The Decimal Point Does More Damage Than the Arithmetic</h2>

          <p>
            Two writing habits cause a large share of tenfold errors, and both
            are avoidable.
          </p>

          <p>
            <strong>A trailing zero.</strong> Written as 1.0 mg, the dose reads
            as 10 mg the moment the decimal point is lost to a smudge, a fax, a
            photocopy or a poorly rendered screen. Write 1 mg.
          </p>

          <p>
            <strong>A naked decimal.</strong> Written as .5 mg, the dose reads
            as 5 mg under exactly the same conditions. Write 0.5 mg, so the
            leading zero signals that a decimal point belongs there.
          </p>

          <p>
            Both conventions exist because the error they prevent is a tenfold
            one, and a tenfold error in a drug with a narrow margin between an
            effective dose and a harmful one does not announce itself. The same
            logic covers writing units in full: U for units can be read as a
            zero, turning 4 U into 40.
          </p>

          <h2>Micrograms, Milligrams, and the Thousandfold Gap</h2>

          <p>
            Three units cover almost everything you will dose, and they sit a
            thousand apart from each other.
          </p>

          <pre>1 g = 1,000 mg{"\n"}1 mg = 1,000 mcg{"\n"}1 g = 1,000,000 mcg</pre>

          <p>
            The danger is not the conversion, which is trivial. It is that mg
            and mcg look similar written quickly, and that the abbreviation μg
            is easily read as mg when the Greek letter is poorly formed — which
            is why μg is discouraged in favour of writing mcg.
          </p>

          <p>
            The consequence of confusing them is severe in a way that a small
            error never is. A patient prescribed 500 mcg who receives 500 mg has
            received a thousand times the intended dose. For most drugs there is
            no dose at which that is survivable, and no downstream check will
            catch it if the volume drawn up looks unremarkable.
          </p>

          <p>
            Percentages and ratio strengths are the other place units hide. A
            percentage is grams per 100 mL, so a 2% solution is 20 mg/mL. A
            ratio strength of 1:1,000 is one gram in 1,000 mL, which is 1 mg/mL,
            and 1:10,000 is a tenth of that. Converting both to mg/mL before
            doing anything else removes an entire class of error.
          </p>

          <h2>Reading a Label Without Assuming</h2>

          <p>
            Labels state strength in whichever form suits the product, and the
            form changes between a tablet, a bottle and a vial. Reading one as
            though it were another is a quiet, common failure.
          </p>

          <ul className="custom-list">
            <li>
              <strong>Tablets</strong> state the amount per tablet. That is a
              concentration in disguise, and the answer must come out as a
              countable number — halves at most, and only on a scored tablet.
            </li>
            <li>
              <strong>Liquids</strong> usually state the amount per 5 mL rather
              than per mL, because 5 mL is a spoon. Treating 125 mg/5 mL as 125
              mg/mL gives a dose five times too small.
            </li>
            <li>
              <strong>Vials</strong> frequently show both the total contents and
              the concentration — 500 mg in 10 mL, and 50 mg/mL. Both numbers
              are correct and they answer different questions. Using the total
              where the concentration belongs is the error the layout invites.
            </li>
            <li>
              <strong>Reconstituted powders</strong> have no concentration until
              they are made up, and the final concentration depends on the
              diluent volume you actually added. Read it off the vial after
              reconstitution, not before.
            </li>
          </ul>

          <h2>Why Paediatric Doses Deserve More Caution</h2>

          <p>
            Adult dosing has a safety net that paediatric dosing does not: most
            adult doses fall into a familiar range, so an answer far outside it
            looks wrong to an experienced eye. Paediatric doses are calculated
            individually from weight, so every answer is unfamiliar and nothing
            about a wrong one looks out of place.
          </p>

          <p>
            Two checks partly replace that missing intuition. The first is the
            adult ceiling: a weight-based calculation for a large adolescent can
            exceed the maximum adult dose, and where it does, the adult maximum
            usually applies. A weight-based formula does not know that and will
            keep scaling.
          </p>

          <p>
            The second is volume plausibility. A dose that requires 14 mL of an
            oral suspension for an infant, or an injection volume larger than
            the site can take, is worth re-deriving before it is drawn up.
            Implausible volumes are the visible symptom of an error in the
            milligrams.
          </p>

          <h2>Why Independent Checking Works and Re-Reading Does Not</h2>

          <p>
            Checking your own working is close to useless, because you follow
            the same reasoning that produced the mistake and arrive at the same
            answer with more confidence than before. This is not carelessness;
            it is how reading back over your own work behaves.
          </p>

          <p>
            What does work is re-deriving. Start again from the original order
            and, where you can, take a different route — reach the volume via
            the total daily dose rather than the single dose, or via mg/hr
            rather than mL/min. Two routes that agree are meaningful evidence.
            The same route walked twice is not.
          </p>

          <p>
            When a second person checks, independence is the whole point. Being
            told &quot;this is 21.6 mL, can you confirm?&quot; makes agreement
            far more likely than working from the order alone. A genuine second
            check starts from the prescription, not from your answer.
          </p>

          <h2>What a Dose Calculator Cannot Check</h2>

          <p>
            Every calculator on this site, and every other one, answers the
            question you typed. It has no view of anything around it.
          </p>

          <ul className="custom-list">
            <li>
              Whether the order itself is appropriate for this patient, this
              indication and this route.
            </li>
            <li>
              Whether the weight entered is current, and whether this drug
              should be dosed on actual, ideal or adjusted weight.
            </li>
            <li>
              Whether renal or hepatic function requires the calculated dose to
              be reduced.
            </li>
            <li>
              Whether an allergy or an interaction makes the drug the wrong
              choice.
            </li>
            <li>Whether the vial in your hand is the one on the label you read.</li>
          </ul>

          <p>
            None of that is a limitation to work around. It is the boundary
            between arithmetic and clinical judgement, and a calculator is
            useful precisely because it stays on its side of it. Treat any tool
            here as a second opinion on a number you have already worked out —
            never as a substitute for the prescription, the product information,
            or the check by a colleague.
          </p>
          <img src="/blog2.3.webp" className="image-blog" alt="blog" />
          <section>
            <h2>Questions About Safe Dosing</h2>

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
          </section>
        </main>

        {/* STATIC BLOG POSTS */}
        <ReviewedBy medical />
      </div>

      <BlogSidebar
        relatedTools={[
          ["/dose-calculator/", "Dose Calculator"],
          ["/dose-stock-calculator/", "Dose Stock Calculator"],
          ["/iv-calculator/", "IV Calculator"],
        ]}
        relatedPosts={[
          [
            "/blog/ultimate-iv-infusion-calculator-guide/",
            "Ultimate IV Infusion Calculator Guide",
          ],
          [
            "/blog/healthy-bodyfat-percentage-by-age-and-gender/",
            "Healthy Body Fat Percentage by Age and Gender",
          ],
          [
            "/blog/how-many-calories-to-lose-weight/",
            "How Many Calories Should I Eat to Lose Weight?",
          ],
        ]}
      />
    </div>
  );
}
