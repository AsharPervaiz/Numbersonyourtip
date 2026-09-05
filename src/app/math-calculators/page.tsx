import Link from "next/link";


import "@fortawesome/fontawesome-free/css/all.min.css";
import { IconCircle, Icons } from "../components/MenuIcons";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Maths Calculators — Statistics and Matrices",
  description:
    "Statistics and linear algebra tools — mean, median, mode, range and standard deviation, plus matrix operations and solving AX = B.",
  alternates: {
    canonical: "/math-calculators/",
  },
  openGraph: {
    title: "Free Math Calculators | Numbers On Your Tip",
    description:
      "Descriptive statistics and matrix operations, and which of the two your problem actually needs.",
    url: "/math-calculators/",
    type: "website",
  },
  twitter: {
    title: "Math Calculators",
    description:
      "Mean, median, mode and spread, plus matrix products, inverses and AX = B.",
  },
};

export default function Mathcals() {
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
            <h1 className="more-tools">Math Calculators</h1>
            <p style={{ maxWidth: "640px", marginBottom: "28px", lineHeight: 1.7 }}>
              Two focused tools for coursework and applied math: a statistics
              calculator that returns mean, median, mode, range, variance,
              and standard deviation from any list of numbers, and a matrix
              calculator that handles addition, multiplication, determinants,
              inverses, and Gauss-Jordan elimination up to 6×6. Both show the
              full working, not just the final answer, so you can check your
              own calculation or verify homework instantly in your browser.
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
                      <IconCircle color="green">
                        <Icons.MeanMode />
                      </IconCircle>{" "}
                      <h4>Mean Median Mode Calculator</h4>
                    </div>
                  ),
                  href: "/mean-median-mode-calculator/",
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
                        <Icons.Matrix />
                      </IconCircle>{" "}
                      <h4>Matrix Calculator</h4>
                    </div>
                  ),
                  href: "/matrix-calculator/",
                },
                {
                  name: (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <IconCircle color="teal">
                        <Icons.Percentage />
                      </IconCircle>{" "}
                      <h4>Mixed Number Calculator</h4>
                    </div>
                  ),
                  href: "/mixed-number-calculator/",
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
            <h2>Two Tools, Two Different Branches of Maths</h2>
            <p>
              This section is deliberately small. It holds the two calculators
              that do genuine mathematical work rather than applying a formula to
              everyday quantities, and they belong to different fields that
              rarely overlap.
            </p>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>You have</th>
                    <th>You want</th>
                    <th>Use</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>A list of numbers</td>
                    <td>
                      The centre and spread — mean, median, mode, range,
                      standard deviation
                    </td>
                    <td>
                      <Link
                        className="my-link"
                        href="/mean-median-mode-calculator/"
                      >
                        Mean, median and mode calculator
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <td>A grid of numbers</td>
                    <td>
                      Products, determinant, inverse, rank, RREF, or a solution
                      to AX = B
                    </td>
                    <td>
                      <Link className="my-link" href="/matrix-calculator/">
                        Matrix calculator
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      Add, subtract, multiply or divide numbers written as a
                      whole part and a fraction
                    </td>
                    <td>
                      <Link className="my-link" href="/mixed-number-calculator/">
                        Mixed number calculator
                      </Link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>
              The distinction is worth stating plainly because the two are
              sometimes confused by the shape of the input. A single row of
              numbers can be typed into either, and they will do entirely
              different things with it: one summarises the values, the other
              treats them as a vector to be transformed.
            </p>

            <h2>Descriptive Statistics in One Sentence</h2>
            <p>
              Descriptive statistics reduce a set of observations to a few
              numbers that stand in for the whole. The useful part is knowing
              which summary to trust: the mean uses every value and is dragged by
              extremes, the median ignores magnitude and resists them, and the
              mode is the only one that works on categories rather than numbers.
              When those three disagree, the disagreement is itself informative
              about the shape of the data.
            </p>

            <h2>Linear Algebra in One Sentence</h2>
            <p>
              A matrix is a transformation written as a grid, and the operations
              describe what that transformation does. The determinant says
              whether it can be undone, the inverse undoes it, the rank counts
              how much independent information it carries, and solving AX = B
              answers a system of linear equations in a single step. Most errors
              in this area are dimension errors rather than arithmetic ones,
              which is why the matrix page leads with the shape rules.
            </p>

            <h2>Maths That Lives in Other Sections</h2>
            <p>
              Several calculations that are unambiguously mathematical sit
              elsewhere on the site, because they are organised by what people
              are trying to do rather than by subject.
            </p>
            <ul className="custom-list">
              <li>
                <Link className="my-link" href="/percentage-calculator/">
                  Percentage calculator
                </Link>{" "}
                — percentage of, increase, decrease, and reverse percentages
              </li>
              <li>
                <Link className="my-link" href="/gpa-calculator/">
                  GPA calculator
                </Link>{" "}
                and{" "}
                <Link className="my-link" href="/gpa-percentage/">
                  GPA to percentage
                </Link>{" "}
                — weighted averages applied to grades
              </li>
              <li>
                <Link className="my-link" href="/unit-conversion-calculator/">
                  Unit conversion
                </Link>{" "}
                — scaling between measurement systems
              </li>
              <li>
                <Link className="my-link" href="/time-calculator/">
                  Time calculator
                </Link>{" "}
                — arithmetic in base 60 rather than base 10
              </li>
            </ul>
            <p>
              If you arrived looking for one of those, the links above are
              faster than the tools on this page.
            </p>

            <h2>Where Floating-Point Arithmetic Shows Through</h2>
            <p>
              Both tools compute in the browser using standard double-precision
              arithmetic, and there are two places where that becomes visible
              rather than invisible.
            </p>
            <p>
              The first is harmless. Multiplying a matrix by its own inverse
              should return the identity, and it will — but the zeros may appear
              as values like 0.0000000000000002 rather than exactly 0. That is
              rounding at the seventeenth significant figure, not an error.
            </p>
            <p>
              The second is not harmless. When a determinant sits very close to
              zero, the inverse divides by that tiny number and produces enormous
              entries. Such a matrix is described as ill-conditioned: a change in
              the fourth decimal place of an input can move the output by orders
              of magnitude. If your determinant is near zero, treat the inverse
              as an indication rather than an answer.
            </p>
            <p>
              Statistical results carry a different caveat entirely. They
              describe exactly the numbers you entered and say nothing about
              whether those numbers were collected well. No summary statistic can
              detect a biased sample, and a precise mean of unrepresentative data
              is precisely wrong.
            </p>

            <h2>Verification and Review Date</h2>
            <p>
              Matrix results are checked by multiplying inverses back to the
              identity and by confirming products against hand-computed entries;
              statistical measures are checked against sets whose mean, median,
              spread and standard deviation were worked out by hand first. Both
              calculators were last reviewed on{" "}
              <strong>27 August 2026</strong>. Our{" "}
              <Link className="my-link" href="/about-us/#review-process">
                about page
              </Link>{" "}
              describes how tools on this site are built and verified.
            </p>
            <section className="related-guides">
              <h2>See the Working, Not Just the Output</h2>
              <p>If you want to see the working rather than take the output on trust:</p>
              <ul>
                <li>
                  <Link href="/blog/matrix-calculator-guide/" className="related-card">
                    <span className="related-title">Every Matrix Operation, Worked by Hand</span>
                    <span className="related-blurb">Each operation step by step, with the shape rules that decide whether it is defined at all.</span>
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
