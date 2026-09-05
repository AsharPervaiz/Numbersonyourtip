"use client";
import { useState } from "react";
import Link from "next/link";
import "@fortawesome/fontawesome-free/css/all.min.css";
import BlogSidebar from "./BlogSidebar";

const FAQ_DATA: [string, string][] = [
  [
    "How do I calculate my exact age in years, months, and days?",
    "Write today's date on top and your birth date below in DD/MM/YYYY format. Subtract column by column starting with days. If the birth day is larger than today's day, borrow the number of days from the previous month and reduce the current month by 1. Then subtract months — if the birth month is larger, borrow 12 months from the year column. Finally subtract years. The three numbers you're left with are your exact age in years, months, and days.",
  ],
  [
    "What is the formula for calculating age from date of birth?",
    'The core formula is: Age = Current Date − Date of Birth, calculated separately across three columns (day, month, year) with borrowing rules. In spreadsheets, the DATEDIF function handles it automatically using the intervals "Y", "YM", and "MD" to return years, months, and days respectively. For instant results without a spreadsheet, use an online age calculator.',
  ],
  [
    "How do you calculate age manually without a calculator?",
    "Use the three-column subtraction method. Write current date and birth date in DD/MM/YYYY format. Subtract each column from right to left. When you can't subtract the day column, borrow the number of days in the previous month. When you can't subtract the month column, borrow 12 from the year column. This gives you an exact age in years, months, and days without any tool.",
  ],
  [
    "Why does my age calculation come out off by one day?",
    "The most common cause is using 30 days by default when borrowing, instead of the actual length of the previous month. Borrowing from July into August adds 31 days, not 30. Borrowing from February in a non-leap year adds 28 days. Always check which month you're borrowing from before adding days. This single mistake accounts for the majority of off-by-one errors in manual age calculations.",
  ],
  [
    "How is age calculated for someone born on February 29?",
    "In most jurisdictions, including most U.S. states and the U.K., a person born on February 29 celebrates their legal birthday on March 1 in non-leap years. A few jurisdictions use February 28 instead. Legally, a leapling turns 18 on March 1 following their 17th real Feb 29 birthday. Culturally many leaplings choose to celebrate on either Feb 28 or March 1 depending on personal preference, but legal age of majority follows the local jurisdiction's rule.",
  ],
  [
    "What is the difference between Korean age and international age?",
    "International age starts at 0 at birth and adds a year on each birthday. Traditional Korean age starts at 1 at birth and adds a year on January 1, regardless of your actual birthday. This makes Korean age typically 1 or 2 years higher than international age. South Korea officially retired traditional Korean age for legal and administrative purposes in June 2023, standardizing on the international system, though the traditional system still appears in casual conversation.",
  ],
  [
    "Does the age calculation include the birth date itself?",
    "By convention, the birth date counts as day zero — you turn one day old the day after your birth date. So if you were born on 1 January 2000 and today is 2 January 2000, you are 1 day old, not 2. This convention keeps age counts consistent with how birthdays are celebrated (you turn 1 year old on your first birthday, not the day you're born).",
  ],
  [
    "Can I calculate someone's age between two specific past dates?",
    "Yes — the same three-column method works for any two dates, not just birth date to today. This is how historians and genealogists calculate a person's age at a specific historical event, or how insurers calculate age at the effective date of a policy. Just substitute the target date for today's date and follow the same subtraction and borrowing rules.",
  ],
  [
    "Do leap years affect my age in years and months?",
    "Leap years don't change your age in complete years or months — a birthday marks a completed year regardless of whether the year has 365 or 366 days. Leap years only affect the day component of your age, and only for people whose birth date falls before 29 February in a leap year but is being calculated in a non-leap year. For most people on most dates, leap years are invisible in a years-months-days answer.",
  ],
  [
    "What's the fastest way to calculate age without doing manual math?",
    "Use an online age calculator with your date of birth and today's date. It handles leap years, month lengths, and borrowing automatically and returns your exact age in years, months, and days. Manual calculation is worth learning because it teaches you which errors to catch, but for everyday use — filling in forms, checking eligibility — a calculator is faster and more reliable.",
  ],
];

export default function HowToCalculateExactAge() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const toggleFAQ = (i: number) => setOpenFAQ(openFAQ === i ? null : i);

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
      <div className="blog-content">
        <img
          src="/blog15.1.webp"
          className="image-blog"
          alt="How to calculate exact age in years, months and days - step by step guide"
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
                alt="Ashar Pervaiz"
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
              03 Aug 2026
            </span>
          </small>
        </div>

        <article>
          {/* HEADER */}
          <header>
            <h1>
              How to Calculate Your Exact Age in Years, Months, and Days (With
              Manual Formulas and Worked Examples)
            </h1>
            <p>
              At first glance, working out your age looks like the simplest math
              in the world — just subtract your birth year from the current year
              and you are done. But anyone who has ever tried to fill in an
              exact age on a passport form, a school enrollment document, an
              insurance application, or a legal contract knows the truth: the
              moment you need age expressed in years, months,
              <em> and </em>days together, the arithmetic gets surprisingly
              awkward. Months have different lengths. Leap-year birthdays have
              their own legal rules. Borrowing days from months and months from
              years is not the same as normal decimal subtraction. This guide
              walks you through the exact manual method for age calculation,
              shows worked examples, explains the mistakes people repeatedly
              make, and covers the edge cases most tutorials skip — including
              February 29 birthdays and the different age systems used around
              the world.
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
              How Do You Calculate Exact Age in Years, Months, and Days?
            </h2>
            <p style={{ marginBottom: 0, color: "white" }}>
              To calculate exact age, subtract the date of birth from the
              current date in <strong>three separate columns</strong>: day,
              month, and year. If the day of birth is greater than today's day,{" "}
              <strong>borrow</strong> the number of days in the previous month
              and reduce the current month by one. If the birth month is then
              greater than the current month, borrow 12 months from the year
              column and reduce the current year by one. Whatever remains is the
              exact age in years, months, and days. Example: someone born on{" "}
              <strong>15 November 2006</strong>, on today's date of{" "}
              <strong>02 August 2026</strong>, is exactly{" "}
              <strong>19 years, 8 months, and 18 days old</strong>. To skip the
              manual math, use our{" "}
              <Link href="/age-calculator/" className="my-link">
                age calculator
              </Link>
              .
            </p>
          </section>

          {/* SECTION 1 — WHY EXACT AGE MATTERS */}
          <section id="why-exact-age-matters" style={{ marginBottom: "48px" }}>
            <h2>Why Your Exact Age (Not Just Years) Actually Matters</h2>
            <p>
              For everyday conversation, saying "I'm 34" is enough. But plenty
              of situations require far more precision — cases where the
              difference between 34 years and 34 years, 7 months, 12 days
              changes what you're eligible for, what you owe, or what you're
              legally allowed to do.
            </p>
            <p>Real situations where months and days matter:</p>
            <ul style={{ paddingLeft: "20px", lineHeight: 2.2, color: "#333" }}>
              <li>
                <strong>School enrollment cutoffs.</strong> A child born on
                September 3 may miss the September 1 kindergarten cutoff by two
                days and have to wait an entire year to start school.
              </li>
              <li>
                <strong>Retirement account rules.</strong> The IRS uses "age
                59½" as the threshold for penalty-free withdrawals from IRAs and
                401(k) plans — half years and precise months are the difference
                between a clean withdrawal and a 10% penalty.
              </li>
              <li>
                <strong>Insurance premiums.</strong> Life and health insurance
                underwriters often price policies by "age nearest birthday,"
                meaning a policy taken out one month before your birthday can
                cost noticeably less than one taken out one month after.
              </li>
              <li>
                <strong>Pediatric medical dosing.</strong> Medication for
                infants and toddlers is often dosed by age in months, not years
                — a 14-month-old and a 22-month-old get different doses of the
                same drug.
              </li>
              <li>
                <strong>Legal age of majority.</strong> Contracts, voting,
                driving, and drinking eligibility all depend on the exact
                calendar date you turned a specific age — not the year.
              </li>
              <li>
                <strong>Youth sports eligibility.</strong> Junior leagues and
                academies use cutoff dates that push players into a different
                age bracket based on the month and day of birth.
              </li>
              <li>
                <strong>Passport and immigration forms.</strong> Many government
                forms require age in completed years and additional months,
                especially for minors traveling internationally.
              </li>
            </ul>
            <p>
              Beyond practical uses, there's something satisfying about knowing
              your age with precision. Understanding that you have been alive
              for a specific number of years, months, and days makes time feel
              measurable in a way general estimates never do.
            </p>
          </section>

          {/* SECTION 2 — THE MANUAL METHOD */}
          <section id="manual-age-method" style={{ marginBottom: "48px" }}>
            <h2>The Manual Age Method: Three-Column Subtraction Explained</h2>
            <p>
              The reliable way to calculate exact age by hand is to treat the
              date of birth and the current date like two rows in a subtraction
              problem, with three columns: <strong>day</strong>,{" "}
              <strong>month</strong>, and <strong>year</strong>. You then
              subtract column by column, borrowing when necessary. Because
              months have different numbers of days (28, 29, 30, or 31), the
              borrowing rule is what trips most people up.
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
                THE THREE-COLUMN AGE FORMULA
              </p>
              <p
                style={{
                  fontFamily: "monospace",
                  fontSize: "1.05rem",
                  margin: "0 0 10px 0",
                  color: "white",
                  lineHeight: 2,
                }}
              >
                Current Date: DD / MM / YYYY
                <br />
                − Birth Date: dd / mm / yyyy
                <br />= Age: (Days) (Months) (Years)
              </p>
              <p
                style={{
                  margin: "10px 0 0 0",
                  fontSize: "0.88rem",
                  color: "rgba(255,255,255,0.7)",
                }}
              >
                Rule: if a column comes out negative, borrow from the column to
                its left before subtracting.
              </p>
            </div>

            <h3>The Two Borrowing Rules You Must Remember</h3>
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
                      When to Borrow
                    </th>
                    <th style={{ padding: "12px 16px", textAlign: "left" }}>
                      What You Borrow
                    </th>
                    <th style={{ padding: "12px 16px", textAlign: "left" }}>
                      Where It Comes From
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    [
                      "Birth day > current day",
                      "The number of days in the previous month (28, 29, 30, or 31)",
                      "Subtract 1 from the current month",
                    ],
                    [
                      "Birth month > current month",
                      "12 months",
                      "Subtract 1 from the current year",
                    ],
                  ].map(([when, what, from], i) => (
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
                        {when}
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
                          color: "#444",
                        }}
                      >
                        {from}
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
              <strong>The mistake almost everyone makes:</strong> when you
              borrow a month to add days, the number of days you add is{" "}
              <em>not</em> always 30. It is the actual length of the previous
              month. If the current month is March, you borrow 28 or 29 from
              February (depending on whether the current year is a leap year).
              If the current month is May, you borrow 30 from April. Getting
              this wrong is the single most common reason manual age
              calculations come out one or two days off.
            </div>
          </section>

          {/* SECTION 3 — WORKED EXAMPLE */}
          <section id="worked-age-example" style={{ marginBottom: "48px" }}>
            <h2>Full Worked Example: Step-by-Step Age Calculation</h2>
            <p>
              Let's calculate the exact age of someone born on{" "}
              <strong>15 November 2006</strong>, as of today,{" "}
              <strong>02 August 2026</strong>. Follow along column by column.
            </p>

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
                Step 1 — Write the dates in three columns
              </p>
              <p
                style={{
                  fontFamily: "monospace",
                  fontSize: "0.97rem",
                  color: "#333",
                  lineHeight: 2,
                  margin: 0,
                }}
              >
                &nbsp;&nbsp;&nbsp;&nbsp;Day&nbsp;&nbsp;&nbsp;&nbsp;Month&nbsp;&nbsp;&nbsp;&nbsp;Year
                <br />
                Current:&nbsp;&nbsp;02&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;08&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2026
                <br />
                Birth:&nbsp;&nbsp;&nbsp;&nbsp;15&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;11&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2006
              </p>
            </div>

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
                Step 2 — Try subtracting days: 2 − 15
              </p>
              <p
                style={{
                  fontFamily: "monospace",
                  fontSize: "0.97rem",
                  color: "#333",
                  lineHeight: 2,
                  margin: 0,
                }}
              >
                2 − 15 is negative → we must borrow.
                <br />
                Current month is August (8), so the previous month is July (7).
                <br />
                July has 31 days. Add 31 to the current day: 2 + 31 = 33.
                <br />
                Reduce the current month by 1: 8 − 1 = 7.
              </p>
              <p
                style={{
                  fontFamily: "monospace",
                  fontSize: "0.97rem",
                  color: "#333",
                  lineHeight: 2,
                  margin: "10px 0 0 0",
                }}
              >
                Updated: 33 days / 7 months / 2026 years
              </p>
            </div>

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
                Step 3 — Subtract days: 33 − 15 = 18
              </p>
              <p
                style={{
                  fontFamily: "monospace",
                  fontSize: "0.97rem",
                  color: "#333",
                  lineHeight: 2,
                  margin: 0,
                }}
              >
                Days column result: <strong>18 days</strong>
              </p>
            </div>

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
                Step 4 — Try subtracting months: 7 − 11
              </p>
              <p
                style={{
                  fontFamily: "monospace",
                  fontSize: "0.97rem",
                  color: "#333",
                  lineHeight: 2,
                  margin: 0,
                }}
              >
                7 − 11 is negative → we must borrow.
                <br />
                Borrow 12 months from the year column: 7 + 12 = 19.
                <br />
                Reduce the current year by 1: 2026 − 1 = 2025.
              </p>
              <p
                style={{
                  fontFamily: "monospace",
                  fontSize: "0.97rem",
                  color: "#333",
                  lineHeight: 2,
                  margin: "10px 0 0 0",
                }}
              >
                Updated: 18 days / 19 months / 2025 years
              </p>
            </div>

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
                Step 5 — Subtract months and years
              </p>
              <p
                style={{
                  fontFamily: "monospace",
                  fontSize: "0.97rem",
                  color: "#333",
                  lineHeight: 2,
                  margin: 0,
                }}
              >
                Months: 19 − 11 = <strong>8 months</strong>
                <br />
                Years: 2025 − 2006 = <strong>19 years</strong>
              </p>
            </div>

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
                FINAL ANSWER
              </p>
              <p
                style={{
                  fontFamily: "monospace",
                  fontSize: "1.05rem",
                  margin: 0,
                  color: "white",
                }}
              >
                Age = <strong>19 years, 8 months, 18 days</strong>
              </p>
            </div>

            <p>
              You can verify this instantly using our{" "}
              <Link href="/age-calculator/" className="my-link">
                age calculator
              </Link>{" "}
              — enter the same two dates and you'll get exactly the same answer.
              The calculator is useful when you want the result in one click,
              but understanding the manual method matters because it teaches you
              which mistakes to catch when a result looks off.
            </p>
          </section>

          {/* SECTION 4 — COMMON MISTAKES */}
          <section id="common-age-mistakes" style={{ marginBottom: "48px" }}>
            <h2>The Six Most Common Age Calculation Mistakes</h2>
            <p>
              Nearly every age miscalculation comes down to one of six specific
              errors. Recognizing them ahead of time saves you from filling in
              the wrong number on a form or missing an eligibility cutoff by a
              day.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {[
                {
                  title: "Adding 30 days when borrowing, by default",
                  body: "The number of days you add when borrowing depends on the previous month, not a default of 30. Borrowing from January (into February) adds 31. Borrowing from February in a non-leap year adds 28. This single mistake can throw your answer off by 3 days.",
                },
                {
                  title: "Forgetting to check whether the birthday has passed",
                  body: "The most basic error: subtracting years without checking whether the person has actually had their birthday this year. If today is 15 March 2026 and someone was born 20 August 2000, they are 25 — not 26 — because their birthday has not yet arrived in 2026.",
                },
                {
                  title: "Not adjusting for a leap-year birth date",
                  body: "People born on 29 February have a legal birthday that most jurisdictions treat as 1 March in non-leap years, though a few use 28 February. Ignoring this can push the calculated age off by exactly one day in three out of every four years.",
                },
                {
                  title: "Mixing date formats (MM/DD vs DD/MM)",
                  body: "In documents that don't specify format clearly, 03/07/2026 could mean 3 July or 7 March. Age calculations built on the wrong interpretation can be off by months. Always confirm the format before you start subtracting.",
                },
                {
                  title: "Using the wrong 'current date'",
                  body: "Legal age is often determined at 00:00 local time on the effective date. Time-zone confusion — using UTC when the rule requires local time — has caused real problems in insurance and immigration cases. Match the calendar date to the jurisdiction that matters for the calculation.",
                },
                {
                  title: "Rounding months into years too early",
                  body: "Some people convert 11 months into 1 year during the calculation. This inflates the year count when the person has not yet had their next birthday. Always keep months as months until the final answer, and only report a full year when a birthday has actually been reached.",
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

          <img
            src="/blog15.2.webp"
            className="image-blog"
            alt="February 29 birthday age calculation and Korean age system explained"
          />

          {/* SECTION 5 — LEAP YEAR BIRTHDAY (age-specific angle only) */}
          <section id="leap-year-birthday-age" style={{ marginBottom: "48px" }}>
            <h2>
              The February 29 Birthday Problem: How Leaplings Calculate Legal
              Age
            </h2>
            <p>
              Roughly 1 in every 1,461 people is born on 29 February — the rare
              date that only appears on the calendar every four years. These
              "leaplings" face a genuine question with real legal answers:{" "}
              <em>how old are you on years that don't have a February 29?</em>
            </p>
            <p>
              There are three common conventions for handling a leap-year
              birthday when calculating age, and which one applies depends on
              the jurisdiction and the purpose of the calculation:
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
                      Convention
                    </th>
                    <th style={{ padding: "12px 16px", textAlign: "left" }}>
                      Effective Birthday in Non-Leap Years
                    </th>
                    <th style={{ padding: "12px 16px", textAlign: "left" }}>
                      Where It's Used
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    [
                      "March 1 rule",
                      "1 March",
                      "Most U.S. states, U.K., many European jurisdictions",
                    ],
                    [
                      "February 28 rule",
                      "28 February",
                      "Some U.S. states, parts of Asia",
                    ],
                    [
                      "Every 4 years only",
                      "No birthday until next Feb 29",
                      "Cultural or personal preference — rarely legal",
                    ],
                  ].map(([conv, effective, used], i) => (
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
                        {conv}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          border: "1px solid #e8edf5",
                          fontWeight: 600,
                        }}
                      >
                        {effective}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          border: "1px solid #e8edf5",
                          color: "#444",
                          fontSize: "0.93rem",
                        }}
                      >
                        {used}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p>
              The most common practical convention is the{" "}
              <strong>March 1 rule</strong>: a person born on 29 February 2000
              is treated as turning 25 on 1 March 2025 for legal purposes, even
              though 2025 has no Feb 29. This matters for driving eligibility,
              drinking age, and contract capacity. If you're calculating the
              exact age of a leapling manually, use 1 March as the effective
              birthday unless you know the local jurisdiction uses 28 February
              instead.
            </p>

            <div
              style={{
                backgroundColor: "#fff",
                borderLeft: "5px solid #DC2626",
                padding: "18px 20px",
                borderRadius: "0 8px 8px 0",
                margin: "20px 0",
              }}
            >
              <strong>Manual method for a leap-year birthday:</strong> If the
              current year is a leap year, use 29 February as the birth day. If
              the current year is <em>not</em> a leap year, substitute the
              jurisdiction's effective birthday (typically 1 March) before you
              start the three-column subtraction. Then proceed as normal. This
              avoids the negative-day trap you'd otherwise hit whenever you
              tried to subtract "29" from a February that only has 28 days.
            </div>
          </section>

          {/* SECTION 6 — AGE MILESTONES (replaced days/weeks/hours section) */}
          <section id="age-milestones" style={{ marginBottom: "48px" }}>
            <h2>Age Milestones That Depend on Exact Age (Not Just Years)</h2>
            <p>
              Certain legal, financial, and medical milestones don't just depend
              on your age in years — they depend on the specific calendar date
              you crossed a threshold. Knowing your exact age in years and
              months lets you confirm eligibility with confidence rather than
              guesswork.
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
                      Milestone
                    </th>
                    <th style={{ padding: "11px 14px", textAlign: "center" }}>
                      Exact Age Required
                    </th>
                    <th style={{ padding: "11px 14px", textAlign: "left" }}>
                      Why the Precision Matters
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    [
                      "Penalty-free IRA / 401(k) withdrawal (U.S.)",
                      "59 years, 6 months",
                      "One day early and the 10% penalty applies",
                    ],
                    [
                      "Full Social Security retirement age",
                      "66y 6m – 67y depending on birth year",
                      "Monthly benefit calculated to the exact month",
                    ],
                    [
                      "Medicare eligibility (U.S.)",
                      "65 years exact",
                      "Enrollment window opens 3 months before the birthday month",
                    ],
                    [
                      "Age of majority (most jurisdictions)",
                      "18 years exact",
                      "Contracts signed one day early may be void",
                    ],
                    [
                      "U.S. legal drinking age",
                      "21 years exact",
                      "ID checks are date-precise",
                    ],
                    [
                      "Youth sports age brackets",
                      "Cutoff date + years",
                      "Players may be placed in older or younger divisions",
                    ],
                    [
                      "School kindergarten enrollment",
                      "5 years by a set cutoff date",
                      "Missing by 1 day delays entry by a full year",
                    ],
                    [
                      "Pediatric vaccine schedule",
                      "Age in months (2m, 4m, 6m, 12m)",
                      "Vaccines are timed to immune-development windows",
                    ],
                    [
                      "Junior driving permit (varies by state)",
                      "14y – 16y depending on jurisdiction",
                      "Some states verify to the day",
                    ],
                    [
                      "Life-insurance underwriting",
                      "Age nearest birthday",
                      "Being 6 months out changes the premium bracket",
                    ],
                  ].map(([m, age, why], i) => (
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
                          fontWeight: 700,
                          color: "#1B3066",
                        }}
                      >
                        {m}
                      </td>
                      <td
                        style={{
                          padding: "11px 14px",
                          border: "1px solid #e8edf5",
                          textAlign: "center",
                          fontWeight: 600,
                        }}
                      >
                        {age}
                      </td>
                      <td
                        style={{
                          padding: "11px 14px",
                          border: "1px solid #e8edf5",
                          color: "#444",
                          fontSize: "0.93rem",
                        }}
                      >
                        {why}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p>
              If you need to work out the exact interval between two calendar
              dates for a milestone — say, the gap between a contract signing
              and an eligibility date — use our{" "}
              <Link href="/days-between-calculator/" className="my-link">
                days between calculator
              </Link>{" "}
              for the raw day count, then apply the manual age method above to
              translate it into years and months for the paperwork.
            </p>
          </section>

          {/* SECTION 7 — AGE SYSTEMS AROUND THE WORLD */}
          <section id="global-age-systems" style={{ marginBottom: "48px" }}>
            <h2>
              International, Korean, and East Asian Age Systems: The Same
              Person, Different Numbers
            </h2>
            <p>
              How old you are depends partly on which system is counting. The{" "}
              <strong>international system</strong> — the one used on passports,
              birth certificates, and medical records almost everywhere — starts
              counting at zero at birth and adds one year on each birthday. But
              other cultural traditions have counted age differently for
              centuries, and understanding these differences matters if you're
              comparing records across borders or having a conversation with
              someone from a different tradition.
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
                      System
                    </th>
                    <th style={{ padding: "11px 14px", textAlign: "center" }}>
                      Age at Birth
                    </th>
                    <th style={{ padding: "11px 14px", textAlign: "left" }}>
                      When You Age
                    </th>
                    <th style={{ padding: "11px 14px", textAlign: "left" }}>
                      Where Used
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    [
                      "International (Western)",
                      "0",
                      "On your birthday each year",
                      "Global standard; all official documents",
                    ],
                    [
                      "Traditional Korean",
                      "1",
                      "January 1 each year",
                      "Culturally used in Korea; retired from legal use in 2023",
                    ],
                    [
                      "East Asian counting",
                      "1",
                      "Lunar New Year each year",
                      "Historical China, Japan (largely retired)",
                    ],
                    [
                      "Korean 'year age' (also retired)",
                      "0",
                      "January 1 each year",
                      "Formerly used in some Korean statutes",
                    ],
                  ].map(([sys, birth, when, where], i) => (
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
                          fontWeight: 700,
                          color: "#1B3066",
                        }}
                      >
                        {sys}
                      </td>
                      <td
                        style={{
                          padding: "11px 14px",
                          border: "1px solid #e8edf5",
                          textAlign: "center",
                          fontWeight: 600,
                        }}
                      >
                        {birth}
                      </td>
                      <td
                        style={{
                          padding: "11px 14px",
                          border: "1px solid #e8edf5",
                          color: "#444",
                          fontSize: "0.93rem",
                        }}
                      >
                        {when}
                      </td>
                      <td
                        style={{
                          padding: "11px 14px",
                          border: "1px solid #e8edf5",
                          color: "#444",
                          fontSize: "0.93rem",
                        }}
                      >
                        {where}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p>
              A person born on 15 March 1995 has three potentially different
              ages on any given day. On 1 February 2026 (before the birthday has
              passed), their international age is <strong>30</strong>, but their
              traditional Korean age would be <strong>32</strong> — a two-year
              gap caused by both the "1 at birth" convention and the January 1
              aging rule. The simple Korean-age formula is:
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
                TRADITIONAL KOREAN AGE FORMULA
              </p>
              <p
                style={{
                  fontFamily: "monospace",
                  fontSize: "1rem",
                  margin: 0,
                  color: "white",
                  lineHeight: 2,
                }}
              >
                Korean Age = (Current Year − Birth Year) + 1
              </p>
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
              <strong>Important context:</strong> in June 2023, South Korea
              officially retired the traditional Korean age system for legal and
              administrative purposes and standardized on the international
              system. Traditional Korean age still shows up in casual
              conversation and cultural contexts, but ID documents, medical
              records, and legal ages of majority now use the international
              standard. So if you're calculating age from a Korean birth date
              for any official reason today, use the international method
              described earlier in this guide.
            </div>
          </section>

          {/* SECTION 8 — STEP BY STEP ACTION */}
          <section id="age-action-plan" style={{ marginBottom: "48px" }}>
            <h2>The Step-by-Step Action Plan: From Two Dates to Exact Age</h2>
            <p>
              Every concept in this guide comes down to a repeatable seven-step
              process. Once you have both dates written down, the rest is
              disciplined arithmetic.
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
                  "Write both dates in DD/MM/YYYY format",
                  "Line up the current date on top and the birth date below. A consistent format prevents the classic MM/DD mix-up.",
                ],
                [
                  "Confirm whether the birthday has passed this year",
                  "If today's month/day is on or after the birth month/day, the person has already had their birthday this year. If not, they haven't yet — and their year count will be one lower than the year difference suggests.",
                ],
                [
                  "Try to subtract the day column",
                  "If the birth day is greater than today's day, you'll need to borrow. Note the length of the previous month before you borrow.",
                ],
                [
                  "Borrow days if needed, then subtract",
                  "Add the number of days in the previous month to today's day, reduce the current month by 1, then subtract. Write down the day result.",
                ],
                [
                  "Try to subtract the month column",
                  "If the birth month is now greater than the (possibly reduced) current month, borrow 12 months from the year column and reduce the year by 1.",
                ],
                [
                  "Subtract months and years",
                  "With borrowing done, both remaining subtractions are straightforward. Write down the month result and the year result.",
                ],
                [
                  "Verify with a calculator",
                  "Cross-check your manual answer against an age calculator. If they disagree, the mistake is almost always in the day-borrowing step — recheck the length of the previous month.",
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

          {/* FAQ */}
          <section>
            <h2>Exact Age Questions</h2>

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
                      <p style={{ margin: 0 }}>{a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </section>
        </article>
      </div>

      <BlogSidebar
        relatedTools={[
          ["/age-calculator/", "Age Calculator"],
          ["/days-between-calculator/", "Days Between Dates Calculator"],
        ]}
        relatedPosts={[
          [
            "/blog/what-is-numbers-on-your-tip/",
            "What Is Numbers on Your Tip?",
          ],
          [
            "/blog/best-free-financial-calculators-for-everyday-money-questions/",
            "Best Free Financial Calculators for Everyday Money Questions",
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
