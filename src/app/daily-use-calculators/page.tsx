import Link from "next/link";

import "@fortawesome/fontawesome-free/css/all.min.css";
import { IconCircle, Icons } from "../components/MenuIcons";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daily Use Calculators — Dates, Percentages, GPA",
  description:
    "Age, days between dates, time, percentages, discounts, GPA, unit conversion and bill splitting — with the five traps that cause most wrong answers.",
  alternates: {
    canonical: "/daily-use-calculators/",
  },
  openGraph: {
    title: "Free Daily Use Calculators | Numbers On Your Tip",
    description:
      "Four kinds of everyday question, and the predictable ways each one goes wrong.",
    url: "/daily-use-calculators/",
    type: "website",
  },
  twitter: {
    title: "Daily Use Calculators",
    description:
      "Age, dates, GPA, percentages, unit conversion, and more — free everyday tools.",
  },
};

export default function Dailycals() {
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
            <h1 className="more-tools">Daily Use Calculators</h1>
            <p
              style={{
                maxWidth: "640px",
                marginBottom: "28px",
                lineHeight: 1.7,
              }}
            >
              The small, everyday calculations that come up constantly — your
              exact age, the days between two dates, a GPA conversion, a quick
              percentage, converting between units, or splitting a dinner bill
              fairly. This page groups the tools people reach for most often day
              to day, alongside a few finance calculators (net worth, discounts,
              salary hikes) that fit the same &quot;quick answer, right
              now&quot; use case. Every tool is free, works on mobile, and needs
              no sign-up.
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
                      <IconCircle color="purple">
                        <Icons.Age />
                      </IconCircle>

                      <h4>Age Calculator</h4>
                    </div>
                  ),
                  href: "/age-calculator/",
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
                      <IconCircle color="amber">
                        <Icons.Percentage />
                      </IconCircle>{" "}
                      <h4>Percentage Calculator</h4>
                    </div>
                  ),
                  href: "/percentage-calculator/",
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
                        <Icons.Calendar />
                      </IconCircle>{" "}
                      <h4>Days Between Dates</h4>
                    </div>
                  ),
                  href: "/days-between-calculator/",
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
                        <Icons.GPA />
                      </IconCircle>{" "}
                      <h4>GPA Calculator</h4>
                    </div>
                  ),
                  href: "/gpa-calculator/",
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
                      <IconCircle color="blue">
                        <Icons.PercentageGPA />
                      </IconCircle>{" "}
                      <h4>GPA to Percentage</h4>
                    </div>
                  ),
                  href: "/gpa-percentage/",
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
                        <Icons.Clock />
                      </IconCircle>{" "}
                      <h4>Time Calculator</h4>
                    </div>
                  ),
                  href: "/time-calculator/",
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
                        <Icons.Convert />
                      </IconCircle>{" "}
                      <h4>Unit Converter</h4>
                    </div>
                  ),
                  href: "/unit-conversion-calculator/",
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
                      <IconCircle color="amber">
                        <Icons.NetWorth />
                      </IconCircle>{" "}
                      <h4>Net Worth Calculator</h4>
                    </div>
                  ),
                  href: "/net-worth-calculator/",
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
                        <Icons.Discount />
                      </IconCircle>{" "}
                      <h4>Discount Calculator</h4>
                    </div>
                  ),
                  href: "/discount-calculator/",
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
                        <Icons.Salary />
                      </IconCircle>{" "}
                      <h4>Salary Hike Calculator</h4>
                    </div>
                  ),
                  href: "/salary-hike-calculator/",
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
                        <Icons.Freelancer />
                      </IconCircle>{" "}
                      <h4>Freelancer Tax Calculator</h4>
                    </div>
                  ),
                  href: "/freelancer-tax-calculator/",
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
                      <IconCircle color="blue">
                        <Icons.Split />
                      </IconCircle>{" "}
                      <h4>Bill Split Calculator</h4>
                    </div>
                  ),
                  href: "/bill-split-calculator/",
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
                      <IconCircle color="amber">
                        <Icons.Gravel />
                      </IconCircle>{" "}
                      <h4>Gravel Calculator</h4>
                    </div>
                  ),
                  href: "/gravel-calculator/",
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
                        <Icons.Fuel />
                      </IconCircle>{" "}
                      <h4>Fuel Cost Calculator</h4>
                    </div>
                  ),
                  href: "/fuel-cost-calculator/",
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
            <h2>Four Kinds of Everyday Question</h2>
            <p>
              The tools on this page cover the arithmetic that comes up away
              from work and away from anything technical — dates, time, grades,
              shopping and splitting costs. They group into four kinds of
              question.
            </p>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Kind</th>
                    <th>Tools</th>
                    <th>The awkward part</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Dates and time</td>
                    <td>
                      <Link className="my-link" href="/age-calculator/">
                        Age
                      </Link>
                      ,{" "}
                      <Link
                        className="my-link"
                        href="/days-between-calculator/"
                      >
                        days between
                      </Link>
                      ,{" "}
                      <Link className="my-link" href="/time-calculator/">
                        time
                      </Link>
                    </td>
                    <td>Units of unequal length, and base 60</td>
                  </tr>
                  <tr>
                    <td>Proportions</td>
                    <td>
                      <Link className="my-link" href="/percentage-calculator/">
                        Percentage
                      </Link>
                      ,{" "}
                      <Link className="my-link" href="/discount-calculator/">
                        discount
                      </Link>
                    </td>
                    <td>Knowing which number is the base</td>
                  </tr>
                  <tr>
                    <td>Grades</td>
                    <td>
                      <Link className="my-link" href="/gpa-calculator/">
                        GPA
                      </Link>
                      ,{" "}
                      <Link className="my-link" href="/gpa-percentage/">
                        GPA to percentage
                      </Link>
                    </td>
                    <td>Credit weighting, and which scale you are on</td>
                  </tr>
                  <tr>
                    <td>Sharing and converting</td>
                    <td>
                      <Link className="my-link" href="/bill-split-calculator/">
                        Bill split
                      </Link>
                      ,{" "}
                      <Link
                        className="my-link"
                        href="/unit-conversion-calculator/"
                      >
                        unit conversion
                      </Link>
                    </td>
                    <td>Applying tax and tip fairly; the temperature offset</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <h2>Five Traps That Account for Most Wrong Answers</h2>
            <p>
              Everyday arithmetic goes wrong in a small number of predictable
              ways, and each of these is covered in detail on the page it
              belongs to.
            </p>
            <ul className="custom-list">
              <li>
                <strong>Decimal hours read as minutes.</strong> A 7.5-hour shift
                is 7 hours 30 minutes, not 7 hours 50. Entering 8 hours 10
                minutes as 8.10 rather than 8.17 understates every shift.
              </li>
              <li>
                <strong>Counting both ends of a date range.</strong> From 1
                March to 8 March is seven days of difference and eight dates.
                Which one applies depends on whether you are counting hotel
                nights or days of leave.
              </li>
              <li>
                <strong>Averaging averages.</strong> Two class averages, two
                exam percentages or two semester GPAs cannot simply be averaged
                unless the groups are the same size. Add the raw amounts and
                divide once.
              </li>
              <li>
                <strong>Assuming discounts add.</strong> Thirty percent off then
                twenty percent off is forty-four percent off, not fifty.
                Multiply the multipliers rather than adding the rates.
              </li>
              <li>
                <strong>Reversing a percentage by adding it back.</strong> A
                price of 63 after 30% off was 90, not 81.90. Undoing a
                percentage is always a division.
              </li>
            </ul>
            <h2>Where the Answers Feed Into Each Other</h2>
            <p>
              Several of these tools are more useful in combination than alone.
            </p>
            <pre>
              Date of birth → Age calculator → exact age for a form or
              eligibility{"\n"}Two dates → Days between → a deadline or a notice
              period{"\n"}Course grades → GPA calculator → GPA to percentage →
              an application figure{"\n"}Bill total → Bill split → each
              person&apos;s share including tip
            </pre>
            <p>
              The grade chain is the one worth following carefully. Work out the
              credit-weighted GPA first, then convert it — and convert against
              the scale your transcript actually uses, since a weighted average
              above 4.0 cannot be converted with the usual multiplier.
            </p>
            <h2>Why These Answers Are Exact</h2>
            <p>
              This section differs from the health and finance tools in a way
              worth stating. Those produce estimates: a calorie target depends
              on an activity level you chose, and a loan repayment depends on
              rates behaving as entered. The tools here mostly do not estimate
              at all.
            </p>
            <p>
              A day count between two dates is exact. A percentage of a number
              is exact. A conversion between metres and feet uses a factor that
              is exact by international definition rather than measured. Where
              these tools return a wrong answer, it is because the wrong
              question was asked — the wrong base for a percentage, the wrong
              scale for a GPA, the wrong counting convention for a date range —
              rather than because the arithmetic is approximate.
            </p>
            <p>
              The three genuine exceptions are worth naming. Converting days
              into months or years is approximate, because months and years vary
              in length. Currency conversion uses a rate that changes rather
              than a fixed factor. And any figure you enter carries its own
              precision, which no calculation can improve on. Everything else on
              this page is arithmetic you could check by hand, and each page
              shows the working so you can.
            </p>
            <section className="related-guides">
              <h2>The Edge Cases Behind the Everyday Tools</h2>
              <p>
                Two guides cover the edge cases behind the everyday tools above:
              </p>
              <ul>
                <li>
                  <Link
                    href="/blog/how-to-calculate-exact-age/"
                    className="related-card"
                  >
                    <span className="related-title">
                      How To Calculate Exact Age?
                    </span>
                    <span className="related-blurb">
                      Borrowing across months, and how a 29 February birthday is
                      handled legally.
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog/what-is-numbers-on-your-tip/"
                    className="related-card"
                  >
                    <span className="related-title">
                      What Is Numbers on Your Tip?
                    </span>
                    <span className="related-blurb">
                      What this site is, how it is funded, and what happens to
                      what you type.
                    </span>
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
