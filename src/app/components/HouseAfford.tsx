"use client";
import { useState } from "react";
import Link from "next/link";
import "@fortawesome/fontawesome-free/css/all.min.css";
import BlogSidebar from "./BlogSidebar";

const FAQ_DATA: [string, string][] = [
  [
    "How much house can I afford on a $100,000 salary?",
    "At today's average 30-year mortgage rate of 6.58% with 20% down and no other debts, you can comfortably afford a home priced around $335,000 to $380,000. Using the 28% front-end DTI rule, your max monthly PITI is about $2,333. Stretched to 35% DTI, you could technically qualify for a home priced up to $420,000, but that leaves very little room for savings and emergencies.",
  ],
  [
    "What is the 28/36 rule for buying a house?",
    "The 28/36 rule states that your monthly housing costs (principal, interest, taxes, and insurance) should not exceed 28% of your gross monthly income, and your total monthly debt payments — including the mortgage — should not exceed 36%. Lenders use this benchmark to decide loan approvals, and it remains the most reliable guideline for figuring out how much house you can afford without becoming house poor.",
  ],
  [
    "How much of a down payment do I need to buy a house in 2026?",
    "The minimum depends on the loan type. Conventional loans allow as little as 3% down, FHA loans require 3.5%, and VA and USDA loans allow 0% down for eligible borrowers. However, putting down 20% eliminates Private Mortgage Insurance (PMI) and gives you the best interest rate. On a $400,000 home, that's $80,000 down — a big number, but it saves you hundreds per month for years.",
  ],
  [
    "What is a good debt-to-income ratio for a mortgage?",
    "Lenders consider a back-end DTI under 36% excellent, 36% to 43% good, and 43% to 50% acceptable with strong credit and cash reserves. Above 50% makes approval difficult on most conventional loans. FHA loans can approve up to 57% DTI with compensating factors, and VA loans can go as high as 60% — but these upper limits often mean uncomfortably tight monthly budgets.",
  ],
  [
    "Should I get pre-approved before house hunting?",
    "Yes. Pre-approval gives you a firm number to shop against, shows sellers you're serious, and locks in a rate estimate. It typically takes 24 to 72 hours and involves a soft or hard credit pull. Get pre-approved from at least three lenders — Freddie Mac data shows shopping three quotes saves borrowers around $1,200 over the life of the loan on average.",
  ],
  [
    "How much home can I afford if I have student loan debt?",
    "Your student loan payment counts fully toward your back-end DTI. A $400 monthly student loan payment means $400 less available for a housing payment under the 36% rule. On a $75,000 salary, that student loan effectively reduces your affordable home price by roughly $60,000 to $70,000. Paying down or refinancing student loans before applying for a mortgage can significantly increase what you qualify for.",
  ],
  [
    "Is it better to buy a cheaper house or put more money down?",
    "Generally, buying a cheaper house is safer because it lowers your total monthly obligation including taxes, insurance, and maintenance. A larger down payment reduces your loan but not your ongoing property tax bill or maintenance costs. If you're on the edge of affordability, choosing a smaller home leaves more room in your budget for savings, emergencies, and enjoying life outside your mortgage.",
  ],
  [
    "How does my credit score affect how much house I can afford?",
    "Your credit score affects both approval and interest rate. Moving from a 680 score to a 760+ score can lower your rate by 0.25% to 0.5%, which on a $400,000 loan saves about $60 to $125 per month. Over 30 years, that's $22,000 to $45,000 saved. It also lets you afford roughly $15,000 to $40,000 more in home price at the same monthly payment.",
  ],
  [
    "What monthly income do I need for a $500,000 house?",
    "Using the 28% housing rule at today's 6.58% rate with 20% down, you'd need a gross monthly income of about $12,500 — roughly a $150,000 annual salary — to comfortably afford a $500,000 home. If you have other debts, you'll need to earn more. Stretched to 32% DTI, a $125,000 salary could technically qualify, but the monthly budget would be tight.",
  ],
  [
    "How much should I keep in savings after buying a house?",
    "Aim for at least 3 to 6 months of PITI plus other essential expenses in an emergency fund after closing. If your monthly PITI is $2,500 and other expenses are $2,000, that's $13,500 to $27,000 you should keep liquid. First-year homeownership almost always brings surprise costs — a broken water heater, an insurance jump, an HVAC repair — and having a real cushion is what separates comfortable ownership from stress.",
  ],
];

export default function HowMuchHouseCanIAfford() {
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
          src="/blog14.1.webp"
          className="image-blog"
          alt="How much house can I afford - 2026 mortgage affordability calculator guide"
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
              30 Jul 2026
            </span>
          </small>
        </div>

        <article>
          {/* HEADER */}
          <header>
            <h1>
              How Much House Can I Afford? A Complete 2026 Mortgage
              Affordability Guide
            </h1>
            <p>
              Buying a home is the biggest financial decision most people ever
              make — and the question "how much house can I afford?" carries far
              more weight than it first appears. Your salary is only part of the
              answer. Interest rates, property taxes, homeowners insurance,
              existing debts, down payment size, and the gap between what a
              lender will approve you for and what you can actually live with
              all shape the real number. This guide walks through the exact math
              lenders use in 2026, shows real affordability figures by income
              level, and explains the difference between qualifying for a
              mortgage and being comfortable with one.
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
            <h2 style={{ color: "white" }}>How Much House Can I Afford?</h2>
            <p style={{ marginBottom: 0, color: "white" }}>
              A safe estimate is that you can afford a home priced at roughly{" "}
              <strong>3 to 4 times your gross annual income</strong>, provided
              your total monthly housing costs stay under{" "}
              <strong>28% of gross monthly income</strong> and your total debts
              stay under <strong>36%</strong>. At today's average 30-year rate
              of about <strong>6.58%</strong> with 20% down, a household earning{" "}
              <strong>$100,000</strong> can comfortably afford a home priced
              around <strong>$335,000 to $380,000</strong>. Recalculate your
              number whenever rates move by more than 0.25%, and always leave a
              10–15% cushion below whatever a lender approves.
            </p>
          </section>

          {/* SECTION 1 — WHY THE QUESTION IS PERSONAL */}
          <section
            id="why-affordability-is-personal"
            style={{ marginBottom: "48px" }}
          >
            <h2>Why "You Can Afford X" Answers Are Almost Always Wrong</h2>
            <p>
              Two households earning the same $120,000 per year can have wildly
              different home-buying power. One has $600 in car and student loan
              payments; the other is debt-free. One lives in a state with 2.2%
              property tax; the other in a state with 0.7%. One has 20% saved
              for a down payment; the other has 5%. All four of these
              differences move the affordable home price by tens of thousands of
              dollars — and none of them are captured by a generic "3× your
              salary" rule.
            </p>
            <p>
              The starting point for any sensible home affordability calculation
              is your personal debt-to-income ratio, not a rule of thumb. Once
              you know it, everything else — your maximum monthly payment, your
              target home price, your down payment goal — falls into place as
              arithmetic.
            </p>
          </section>

          {/* SECTION 2 — THE 28/36 RULE */}
          <section id="the-28-36-rule" style={{ marginBottom: "48px" }}>
            <h2>The 28/36 Rule: The Foundation of Home Affordability</h2>
            <p>
              Every mortgage affordability calculation starts here. The 28/36
              rule is the benchmark lenders have used for decades, and it
              remains the single most important formula for figuring out how
              much house you can afford in 2026.
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
                      Ratio
                    </th>
                    <th style={{ padding: "12px 16px", textAlign: "left" }}>
                      What It Covers
                    </th>
                    <th style={{ padding: "12px 16px", textAlign: "center" }}>
                      Cap
                    </th>
                    <th style={{ padding: "12px 16px", textAlign: "left" }}>
                      Why It Matters
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    [
                      "Front-End DTI",
                      "Monthly PITI only (principal, interest, taxes, insurance)",
                      "28%",
                      "Protects you from housing eating your paycheck",
                    ],
                    [
                      "Back-End DTI",
                      "PITI + all other monthly debts (car, student, credit card, personal loans)",
                      "36%",
                      "Ensures total debt load stays manageable",
                    ],
                  ].map(([ratio, covers, cap, why], i) => (
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
                        {ratio}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          border: "1px solid #e8edf5",
                          color: "#444",
                        }}
                      >
                        {covers}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          border: "1px solid #e8edf5",
                          textAlign: "center",
                          fontWeight: 700,
                        }}
                      >
                        {cap}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          border: "1px solid #e8edf5",
                          color: "#444",
                        }}
                      >
                        {why}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

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
                Household earning $8,000/month gross, with $600 in other debts
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
                28% front-end cap: $8,000 × 0.28 = $2,240 max PITI
                <br />
                36% back-end cap: $8,000 × 0.36 = $2,880 total debts
                <br />
                After subtracting $600 in other debts: $2,880 − $600 = $2,280
                <br />
                <strong>
                  Max monthly housing payment: $2,240 (lower of the two)
                </strong>
              </p>
              <p
                style={{
                  margin: "10px 0 0 0",
                  fontSize: "0.9rem",
                  color: "#666",
                }}
              >
                Whichever ratio produces the smaller number becomes your
                ceiling. If you have no other debts, the 28% rule almost always
                sets the cap.
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
              <strong>Why this rule still matters in 2026:</strong> Lenders will
              often approve back-end DTIs up to 45% for conventional loans, 57%
              for FHA, and up to 60% for VA. But approval is not affordability.
              The 28/36 rule protects you from becoming "house poor" — the
              situation where you own a beautiful home but cannot afford
              vacations, savings, or emergencies.
            </div>
          </section>

          {/* SECTION 3 — TODAY'S RATES */}
          <section id="mortgage-rates-2026" style={{ marginBottom: "48px" }}>
            <h2>
              Today's Mortgage Rates and Why They Change What You Can Afford
            </h2>
            <p>
              As of late July 2026, the average 30-year fixed mortgage rate is
              hovering around <strong>6.58%</strong>, with the 15-year fixed
              near <strong>5.96%</strong>. Rates have sat in the 6% range
              throughout 2026, and Fannie Mae's latest forecast projects they'll
              stay near 6.4% through year-end.
            </p>
            <p>
              A single percentage point on your mortgage rate changes what you
              can afford by tens of thousands of dollars. Here is what the same
              $500,000 loan looks like at three different rates:
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
                      Interest Rate
                    </th>
                    <th style={{ padding: "12px 16px", textAlign: "center" }}>
                      Monthly P&amp;I
                    </th>
                    <th style={{ padding: "12px 16px", textAlign: "center" }}>
                      Total Interest (30 yrs)
                    </th>
                    <th style={{ padding: "12px 16px", textAlign: "center" }}>
                      Payment vs. 5%
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["5.00%", "$2,684", "$466,278", "Baseline"],
                    ["6.58%", "$3,185", "$646,530", "+$501/mo"],
                    ["7.50%", "$3,496", "$758,772", "+$812/mo"],
                  ].map(([rate, pi, total, vs], i) => (
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
                        {rate}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          border: "1px solid #e8edf5",
                          textAlign: "center",
                          fontWeight: 600,
                        }}
                      >
                        {pi}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          border: "1px solid #e8edf5",
                          textAlign: "center",
                        }}
                      >
                        {total}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          border: "1px solid #e8edf5",
                          textAlign: "center",
                          fontWeight: 700,
                          color: "#DC2626",
                        }}
                      >
                        {vs}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p>
              That $501 monthly gap between 5% and 6.58% is real money. At a 28%
              housing ratio, you need to earn about $21,500 more per year to
              afford the same house at today's rates than you would have at 5%.
              This is exactly why running the numbers through a{" "}
              <Link href="/home-mortgage-calculator/" className="my-link">
                home mortgage calculator
              </Link>{" "}
              with current rates matters — old rules of thumb from the 2010s no
              longer apply cleanly.
            </p>
          </section>

          {/* SECTION 4 — PITI */}
          <section id="what-is-piti" style={{ marginBottom: "48px" }}>
            <h2>What Your Monthly Mortgage Payment Actually Includes (PITI)</h2>
            <p>
              When people say "mortgage payment," they usually mean just
              principal and interest. But your real monthly obligation is
              bigger. Lenders calculate affordability using{" "}
              <strong>PITI</strong>:
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
                THE FOUR COMPONENTS OF PITI
              </p>
              <p
                style={{
                  fontFamily: "monospace",
                  fontSize: "1rem",
                  margin: "0 0 8px 0",
                  color: "white",
                  lineHeight: 2.2,
                }}
              >
                <strong>P</strong> — Principal: portion that reduces the loan
                balance
                <br />
                <strong>I</strong> — Interest: cost of borrowing, based on the
                remaining balance
                <br />
                <strong>T</strong> — Taxes: property taxes, typically 1–2.5% of
                home value per year
                <br />
                <strong>I</strong> — Insurance: homeowners insurance + PMI (if
                down payment under 20%)
              </p>
            </div>

            <p>
              Skip PITI and your affordability estimate will be off by hundreds
              of dollars a month. On a $400,000 home in a state like New Jersey
              with a 2.2% property tax rate, you're looking at roughly{" "}
              <strong>$733 per month in property taxes alone</strong>. In
              Tennessee, at 0.7%, the same home costs about $233 a month in
              taxes — a $500 gap that translates to about $85,000 in affordable
              home price at today's rates.
            </p>
          </section>

          {/* SECTION 5 — BY INCOME TABLE */}
          <section
            id="affordability-by-income"
            style={{ marginBottom: "48px" }}
          >
            <h2>How Much House Can You Afford By Income? Real 2026 Numbers</h2>
            <p>
              This is the table most homebuyers actually want to see. All
              numbers assume a 30-year fixed mortgage at 6.58%, 20% down, 1.25%
              property tax, 0.35% insurance, and no existing debts. Numbers get
              smaller if you have car loans, student loans, or a smaller down
              payment.
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
                      Annual Income
                    </th>
                    <th style={{ padding: "11px 14px", textAlign: "center" }}>
                      Max PITI (28%)
                    </th>
                    <th style={{ padding: "11px 14px", textAlign: "center" }}>
                      Comfortable Home Price
                    </th>
                    <th style={{ padding: "11px 14px", textAlign: "center" }}>
                      Stretched Home Price
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["$50,000", "$1,167", "$165,000", "$210,000"],
                    ["$75,000", "$1,750", "$250,000", "$315,000"],
                    ["$100,000", "$2,333", "$335,000", "$420,000"],
                    ["$125,000", "$2,917", "$420,000", "$525,000"],
                    ["$150,000", "$3,500", "$500,000", "$630,000"],
                    ["$200,000", "$4,667", "$670,000", "$835,000"],
                    ["$250,000", "$5,833", "$835,000", "$1,050,000"],
                  ].map(([income, piti, comfy, stretched], i) => (
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
                        {income}
                      </td>
                      <td
                        style={{
                          padding: "11px 14px",
                          border: "1px solid #e8edf5",
                          textAlign: "center",
                          fontWeight: 600,
                        }}
                      >
                        {piti}
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
                        {comfy}
                      </td>
                      <td
                        style={{
                          padding: "11px 14px",
                          border: "1px solid #e8edf5",
                          textAlign: "center",
                          color: "#DC2626",
                        }}
                      >
                        {stretched}
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
              <Link href="/home-mortgage-calculator/" className="my-link">
                home mortgage calculator
              </Link>{" "}
              for your specific numbers.
            </p>

            <p>
              The "comfortable" column applies the 28% front-end rule. The
              "stretched" column pushes to 35%, which most lenders will approve
              for buyers with solid credit and no other debt. Just because you
              can borrow that much doesn't mean you should — stretched numbers
              leave little room for savings, emergencies, or lifestyle spending.
            </p>
          </section>

          <img
            src="/blog14.2.webp"
            className="image-blog"
            alt="Mortgage affordability, PITI, and DTI ratios explained"
          />

          {/* SECTION 6 — DOWN PAYMENT */}
          <section id="down-payment" style={{ marginBottom: "48px" }}>
            <h2>Down Payment: The Lever That Changes Everything</h2>
            <p>
              Your down payment does two things: it lowers the amount you need
              to borrow, and it can eliminate Private Mortgage Insurance (PMI).
              PMI is required on conventional loans when you put down less than
              20%, typically costing between 0.3% and 1.5% of your loan amount
              per year.
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
                      Loan Type
                    </th>
                    <th style={{ padding: "12px 16px", textAlign: "center" }}>
                      Min. Down
                    </th>
                    <th style={{ padding: "12px 16px", textAlign: "center" }}>
                      PMI Required?
                    </th>
                    <th style={{ padding: "12px 16px", textAlign: "left" }}>
                      Best For
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    [
                      "Conventional",
                      "3–5%",
                      "Yes, below 20%",
                      "Credit 680+, plans to reach 20% equity",
                    ],
                    [
                      "FHA",
                      "3.5%",
                      "Yes, life of loan",
                      "Credit 580–680, higher DTI",
                    ],
                    ["VA", "0%", "No PMI", "Veterans and active-duty military"],
                    [
                      "USDA",
                      "0%",
                      "Yes (guarantee fee)",
                      "Rural and eligible suburban areas",
                    ],
                    [
                      "Conventional 20%",
                      "20%",
                      "No PMI",
                      "Buyers with substantial savings",
                    ],
                  ].map(([type, down, pmi, best], i) => (
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
                        {type}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          border: "1px solid #e8edf5",
                          textAlign: "center",
                          fontWeight: 600,
                        }}
                      >
                        {down}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          border: "1px solid #e8edf5",
                          textAlign: "center",
                        }}
                      >
                        {pmi}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          border: "1px solid #e8edf5",
                          color: "#444",
                          fontSize: "0.93rem",
                        }}
                      >
                        {best}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p>
              If you're still building your down payment, our{" "}
              <Link href="/net-worth-calculator/" className="my-link">
                net worth calculator
              </Link>{" "}
              helps you track savings progress against a target home price. If
              your goal feels far away, use our{" "}
              <Link href="/salary-hike-calculator/" className="my-link">
                salary hike calculator
              </Link>{" "}
              to time your home purchase around an expected raise or promotion.
            </p>
          </section>

          {/* SECTION 7 — DTI BY LOAN PROGRAM */}
          <section id="dti-limits-2026" style={{ marginBottom: "48px" }}>
            <h2>Loan Programs and Their DTI Limits in 2026</h2>
            <p>
              Not all mortgages have the same debt-to-income limits. If your DTI
              is on the higher side, the loan program you choose can be the
              difference between approval and denial.
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
                      Loan Type
                    </th>
                    <th style={{ padding: "12px 16px", textAlign: "center" }}>
                      Standard DTI Cap
                    </th>
                    <th style={{ padding: "12px 16px", textAlign: "center" }}>
                      Max DTI (with compensating factors)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Conventional (Fannie/Freddie)", "43%", "Up to 50%"],
                    ["FHA", "43%", "Up to 57%"],
                    ["VA", "41%", "Up to 60%"],
                    ["USDA", "41%", "Up to 46%"],
                    ["Jumbo", "43%", "Up to 45%"],
                  ].map(([type, std, max], i) => (
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
                        {type}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          border: "1px solid #e8edf5",
                          textAlign: "center",
                          fontWeight: 600,
                        }}
                      >
                        {std}
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
                        {max}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p>
              "Compensating factors" usually means a credit score of 720 or
              higher, substantial cash reserves (typically 3 to 6 months of PITI
              in the bank), a large down payment, or a very stable employment
              history. Without them, expect lenders to hold you closer to the
              standard cap.
            </p>
            <p>
              One more thing to know: 2026's conforming loan limit — the maximum
              for a standard conventional loan — is <strong>$832,750</strong> in
              most U.S. areas. Anything above that is a jumbo loan, which comes
              with slightly higher rates and stricter requirements.
            </p>
          </section>

          {/* SECTION 8 — HIDDEN COSTS */}
          <section id="hidden-costs" style={{ marginBottom: "48px" }}>
            <h2>The Hidden Costs of Homeownership Most Buyers Underestimate</h2>
            <p>
              PITI is not the whole picture. Once you close, a stack of new
              expenses lands on your plate that renters never had to think
              about. Budget for these before you decide how much home to buy:
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {[
                {
                  title: "Maintenance and repairs",
                  body: "The widely used rule of thumb is 1% to 3% of home value per year. On a $400,000 home, that's $4,000 to $12,000 annually — often front-loaded in the first year for surprises.",
                },
                {
                  title: "HOA fees",
                  body: "In condos and planned communities, expect $200 to $600 per month, sometimes much more. HOA fees count toward your DTI and reduce how much house you can qualify for.",
                },
                {
                  title: "Utilities",
                  body: "Most homes use two to three times the energy of a similar-sized apartment. Factor in bigger electric, gas, water, and trash bills — often $200 to $400 more per month than renting.",
                },
                {
                  title: "Closing costs",
                  body: "Typically 2% to 5% of the loan amount, paid at closing. On a $400,000 mortgage, that's $8,000 to $20,000 out of pocket — separate from your down payment.",
                },
                {
                  title: "Moving and setup",
                  body: "Furniture, appliances, window coverings, yard equipment, and everything else. Easily $5,000 to $15,000 in the first year alone.",
                },
                {
                  title: "Insurance surprises",
                  body: "Homeowners insurance has climbed sharply in climate-affected states like Florida, California, Texas, and Louisiana. Always get real quotes before falling in love with a house.",
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

            <div
              style={{
                backgroundColor: "#fff",
                borderLeft: "5px solid #DC2626",
                padding: "18px 20px",
                borderRadius: "0 8px 8px 0",
                margin: "24px 0",
              }}
            >
              <strong>The 30% rule for true monthly cost:</strong> A realistic
              buyer treats homeownership as costing PITI plus about 30% for
              these extras. On a $2,500 PITI, that's another $750 per month in
              true monthly cost — the reason so many first-time buyers end up
              feeling stretched even when their mortgage math looked fine on
              paper.
            </div>
          </section>

          {/* SECTION 9 — HOW TO USE A CALCULATOR */}
          <section
            id="how-to-use-mortgage-calculator"
            style={{ marginBottom: "48px" }}
          >
            <h2>How to Actually Use a Mortgage Affordability Calculator</h2>
            <p>
              A mortgage calculator turns theory into one clean number — but
              only if you feed it accurate inputs. Follow this workflow:
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
                  "Start with your gross monthly income",
                  "Use the number before taxes and deductions. If buying with a partner, combine both incomes only if both will be on the mortgage.",
                ],
                [
                  "Add up all recurring monthly debts",
                  "Include car loans, student loans, credit card minimums, personal loans, alimony, and child support. Skip utilities, groceries, subscriptions, and retirement contributions.",
                ],
                [
                  "Enter down payment in dollars, not percentage",
                  "This gives you a clearer picture of true purchasing power and matches how lenders think about your cash-to-close.",
                ],
                [
                  "Use the current interest rate",
                  "Don't plug in the rate you hope for — plug in the rate you'll actually get. As of this week, that's around 6.58% for a 30-year fixed with strong credit.",
                ],
                [
                  "Set property tax to your state's effective rate",
                  "National average is about 1.1%, but the range is wide — New Jersey is 2.2%, Hawaii is 0.3%. Use your specific state, not the national average.",
                ],
                [
                  "Use 0.35% for homeowners insurance",
                  "A reasonable starting point. For a real number, get a quote in the specific neighborhood you're targeting.",
                ],
                [
                  "Subtract 10–15% from the resulting home price",
                  "That built-in cushion covers rate increases while shopping, unexpected repairs in year one, and closing costs.",
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

            <p style={{ marginTop: "22px" }}>
              Run this in our{" "}
              <Link href="/home-mortgage-calculator/" className="my-link">
                home mortgage calculator
              </Link>{" "}
              and cross-check the monthly payment with our{" "}
              <Link href="/loan-calculator/" className="my-link">
                loan calculator
              </Link>{" "}
              to see how principal and interest change over the life of the
              loan. If you're a freelancer or self-employed, remember lenders
              use your net income after business expenses — our{" "}
              <Link href="/freelancer-tax-calculator/" className="my-link">
                freelancer tax calculator
              </Link>{" "}
              helps you estimate the number they'll actually see on your tax
              returns.
            </p>
          </section>

          {/* SECTION 10 — RENT VS BUY */}
          <section id="rent-vs-buy" style={{ marginBottom: "48px" }}>
            <h2>Renting vs. Buying: When Does Buying Actually Make Sense?</h2>
            <p>
              Buying isn't always the right move. At 6.58% mortgage rates, the
              classic "buying is always better than renting" wisdom often falls
              apart in the first three to five years. Break-even on transaction
              costs — closing costs plus selling costs down the road — typically
              takes 5 to 7 years at today's rates.
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
                      Buying Makes Sense When...
                    </th>
                    <th style={{ padding: "12px 16px", textAlign: "left" }}>
                      Renting Makes Sense When...
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    [
                      "You'll stay in the home for at least 5 years",
                      "You may move within 3 years for career or family",
                    ],
                    [
                      "PITI is within 15% of local rent for a comparable home",
                      "Local rent is significantly cheaper than owning",
                    ],
                    [
                      "You have 3–6 months of expenses saved after the down payment",
                      "You'd be stretching to hit the down payment",
                    ],
                    [
                      "Your income is stable and career direction is settled",
                      "Your income is variable or you value flexibility",
                    ],
                    [
                      "You want customization and long-term stability",
                      "You'd rather invest the difference elsewhere",
                    ],
                  ].map(([buy, rent], i) => (
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
                          color: "#16a34a",
                          fontWeight: 600,
                          fontSize: "0.93rem",
                        }}
                      >
                        {buy}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          border: "1px solid #e8edf5",
                          color: "#1F9FB8",
                          fontWeight: 600,
                          fontSize: "0.93rem",
                        }}
                      >
                        {rent}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p>
              Our{" "}
              <Link href="/rent-calculator/" className="my-link">
                rent calculator
              </Link>{" "}
              helps you figure out what you can afford in rent so you can make a
              fair side-by-side comparison against a mortgage payment.
            </p>
          </section>

          {/* SECTION 11 — HOW TO INCREASE AFFORDABILITY */}
          <section id="increase-affordability" style={{ marginBottom: "48px" }}>
            <h2>How to Increase How Much House You Can Afford</h2>
            <p>
              If the number from your affordability calculation is smaller than
              you hoped, you have real levers to pull. In order of impact:
            </p>
            <ul style={{ paddingLeft: "20px", lineHeight: 2.2, color: "#333" }}>
              <li>
                <strong>Pay down high-payment debts.</strong> A $500 car payment
                paid off equals roughly $80,000 more in home price at today's
                rates. The biggest lever most buyers ignore.
              </li>
              <li>
                <strong>Increase your down payment.</strong> Every extra $10,000
                down reduces your monthly payment by about $65 at 6.58%, or lets
                you buy about $12,000 more in home.
              </li>
              <li>
                <strong>Improve your credit score.</strong> Going from 680 to
                760 can cut your rate by 0.25% to 0.5%, saving hundreds a month
                or letting you afford $30,000 to $60,000 more home.
              </li>
              <li>
                <strong>Buy in a lower-tax jurisdiction.</strong> Moving from a
                2.2% property tax state to a 0.7% state can add $150,000+ to
                your affordable home price on the same income.
              </li>
              <li>
                <strong>Consider a longer-term loan carefully.</strong> These
                lower your monthly payment but cost far more over time. Only use
                them if you have a clear payoff plan.
              </li>
              <li>
                <strong>Add a co-borrower.</strong> A spouse, partner, or family
                member with additional income increases the amount you can
                qualify for.
              </li>
            </ul>
            <p>
              One thing not to do: don't stretch to the absolute lender maximum.
              Every experienced homeowner will tell you the same thing — leaving
              a cushion is what makes homeownership enjoyable rather than
              stressful.
            </p>
          </section>

          {/* SECTION 12 — QUICK REFERENCE */}
          <section id="quick-reference" style={{ marginBottom: "48px" }}>
            <h2>Mortgage Affordability Quick Reference</h2>
            <p>
              Here's a compact summary you can bookmark. All numbers assume a
              30-year fixed mortgage at current 2026 rates:
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
                      Metric
                    </th>
                    <th style={{ padding: "11px 14px", textAlign: "center" }}>
                      Safe Zone
                    </th>
                    <th style={{ padding: "11px 14px", textAlign: "center" }}>
                      Stretched Zone
                    </th>
                    <th style={{ padding: "11px 14px", textAlign: "center" }}>
                      Danger Zone
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    [
                      "Housing DTI (front-end)",
                      "Under 25%",
                      "25% – 32%",
                      "Over 32%",
                    ],
                    [
                      "Total DTI (back-end)",
                      "Under 36%",
                      "36% – 43%",
                      "Over 43%",
                    ],
                    ["Home price to income", "2x – 3x", "3x – 4x", "Over 4x"],
                    ["Down payment", "20%+", "10% – 20%", "Under 10%"],
                    [
                      "Emergency fund after closing",
                      "6+ months",
                      "3 – 6 months",
                      "Under 3 months",
                    ],
                    ["Credit score", "760+", "680 – 759", "Under 680"],
                  ].map(([metric, safe, stretched, danger], i) => (
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
                        {metric}
                      </td>
                      <td
                        style={{
                          padding: "11px 14px",
                          border: "1px solid #e8edf5",
                          textAlign: "center",
                          color: "#16a34a",
                          fontWeight: 600,
                        }}
                      >
                        {safe}
                      </td>
                      <td
                        style={{
                          padding: "11px 14px",
                          border: "1px solid #e8edf5",
                          textAlign: "center",
                          color: "#F59E0B",
                          fontWeight: 600,
                        }}
                      >
                        {stretched}
                      </td>
                      <td
                        style={{
                          padding: "11px 14px",
                          border: "1px solid #e8edf5",
                          textAlign: "center",
                          color: "#DC2626",
                          fontWeight: 600,
                        }}
                      >
                        {danger}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* FAQ */}
          <section>
            <h2>Affordability Questions</h2>

            {FAQ_DATA.map(([q, a], i) => (
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
                  aria-expanded={openFAQ === i}
                  aria-controls={`faq-answer-${i}`}
                >
                  {q}
                  <i
                    className={`fa-solid fa-chevron-down ${openFAQ === i ? "rotate" : ""}`}
                    aria-hidden="true"
                  />
                </h3>
                <div
                  id={`faq-answer-${i}`}
                  className={`faq-answer-wrap ${openFAQ === i ? "open" : ""}`}
                  aria-hidden={openFAQ !== i}
                >
                  <div className="faq-answer-inner">
                    <p>{a}</p>
                  </div>
                </div>
              </div>
            ))}
          </section>
        </article>
      </div>

      <BlogSidebar
        relatedTools={[
          ["/home-mortgage-calculator/", "Home Mortgage Calculator"],
          ["/rent-calculator/", "Rent Calculator"],
          ["/loan-calculator/", "Loan Calculator"],
        ]}
        relatedPosts={[
          ["/blog/renting-vs-buying-a-home/", "Renting vs. Buying a Home: How to Decide With Numbers"],
          [
            "/blog/the-smart-renters-guide-what-you-can-actually-afford/",
            "The Smart Renter's Guide: What You Can Actually Afford",
          ],
          [
            "/blog/how-do-i-calculate-my-net-worth/",
            "How Do I Calculate My Net Worth?",
          ],
        ]}
      />
    </div>
  );
}
