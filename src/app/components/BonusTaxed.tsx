"use client";
import { useState } from "react";
import Link from "next/link";
import "@fortawesome/fontawesome-free/css/all.min.css";
import BlogSidebar from "./BlogSidebar";

export default function WhyWasMyBonusTaxedSoMuch() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const toggleFAQ = (i: number) => setOpenFAQ(openFAQ === i ? null : i);

  /* ── FAQ data (also used for JSON-LD schema) ── */
  const faqs: [string, string][] = [
    [
      "Why was my bonus taxed at 22%?",
      "The IRS classifies bonuses as supplemental wages, and the standard federal withholding rate for supplemental wages is a flat 22% for amounts up to $1 million per year. This applies regardless of your normal paycheck's tax rate. On top of federal, you also pay 6.2% Social Security, 1.45% Medicare, and any applicable state and local tax. The 22% is withholding — not necessarily your final tax owed.",
    ],
    [
      "Will I get my bonus tax back at tax time?",
      "Possibly — it depends on your actual marginal tax rate. If your normal income keeps you in the 10% or 12% federal bracket, the flat 22% withholding on your bonus is too much, and you'll get the difference back as part of your federal refund. If you're already in a bracket above 22%, the withholding wasn't enough and you'll owe more at tax time.",
    ],
    [
      "How are bonuses taxed differently from regular salary?",
      "Bonuses are treated as 'supplemental wages' and are usually withheld at a flat 22% federal rate under the IRS percentage method. Your regular salary is withheld based on your W-4 form and progressive brackets, which typically produces a lower withholding rate on lower income. Both types of income are ultimately taxed at your marginal rate when you file — the difference is just in how withholding is calculated during the year.",
    ],
    [
      "Do I have to pay Social Security and Medicare tax on my bonus?",
      "Yes. Bonuses are subject to full FICA taxes: 6.2% for Social Security (until your total year's wages exceed the $184,500 wage base for 2026) and 1.45% for Medicare (no cap). If your total wages exceed $200,000 single or $250,000 MFJ, an extra 0.9% additional Medicare tax also applies to the income above that threshold.",
    ],
    [
      "Why does my paycheck get taxed less than my bonus?",
      "Because your regular paycheck's withholding is calculated using tables that reflect your annualized income and W-4 selections, while your bonus is withheld at a flat 22% federal rate under the supplemental wage rules. If your annual salary keeps you in the 12% bracket, your normal paycheck withholding will look much lower than 22% — but your bonus still gets the flat rate.",
    ],
    [
      "What is the aggregate method for bonus withholding?",
      "The aggregate method is one of two IRS-approved ways employers can withhold tax on bonuses. Under this method, the bonus is added to your regular paycheck and the total is withheld as if that combined amount was your normal pay — which often triggers a much higher withholding rate because the payroll software temporarily treats you as earning at a much higher annual rate. It's more common at smaller employers.",
    ],
    [
      "Can I avoid the 22% bonus withholding rate?",
      "Not directly — the 22% flat rate is required by the IRS for supplemental wages under the percentage method, and the aggregate method typically produces even higher withholding. What you can do is adjust your W-4 to reduce your regular paycheck withholding to compensate, or make an estimated tax payment adjustment. But the bonus itself will still be withheld under supplemental wage rules.",
    ],
    [
      "How much of a $10,000 bonus do I get to keep?",
      "For a typical W-2 employee in a no-state-tax state (Texas, Florida, etc.), a $10,000 bonus nets roughly $7,035 in take-home pay after 22% federal withholding, 6.2% Social Security, and 1.45% Medicare. In California, expect roughly $5,910 after adding 10.23% state supplemental and 1.1% state disability. If your regular marginal rate is 10% or 12%, expect to recover part of the federal withholding as a refund next April.",
    ],
    [
      "Are bonuses over $1 million taxed differently?",
      "Yes. Any supplemental wage amount above $1 million in a single calendar year must be withheld at the highest federal income tax bracket rate, currently 37% for 2026. This applies only to the portion above the $1 million threshold — the first $1 million is still withheld at 22%. This rule mostly affects executives, athletes, entertainers, and finance professionals receiving large equity vests or performance bonuses.",
    ],
    [
      "Does the OBBBA overtime deduction affect bonus tax?",
      "No — the OBBBA overtime deduction (up to $12,500 for 2026 through 2028) reduces overtime pay taxation, not bonus taxation. Bonuses and overtime are both classified as supplemental wages, but only qualifying overtime hours count toward the deduction. Bonuses remain fully taxable at your marginal rate and are still withheld at the standard 22% supplemental rate.",
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

      <div className="blog-content">
        <img
          src="/blog17.1.webp"
          className="image-blog"
          alt="Why was my bonus taxed so much - 22 percent supplemental withholding explained"
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
              07 Aug 2026
            </span>
          </small>
        </div>

        <article>
          {/* HEADER */}
          <header>
            <h1>
              Why Was My Bonus Taxed So Much? The 22% Supplemental Withholding
              Rate, Explained (2026 Guide)
            </h1>
            <p>
              You worked hard all year, your boss finally handed you a $5,000
              bonus, and when the deposit hit your account it was closer to{" "}
              <em>$3,300</em>. That is not a mistake — and no, your employer did
              not lose the rest. Nearly 34% of your bonus disappeared into
              federal withholding, FICA, and often state tax before you ever saw
              a dollar of it. This guide explains exactly why bonuses are taxed
              the way they are, why the number that comes out of your paycheck
              is not the same as the tax you actually owe, and — most
              importantly — how to figure out whether you will get some of that
              money back when you file your tax return.
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
            <h2 style={{ color: "white" }}>Why Is My Bonus Taxed So Much?</h2>
            <p style={{ marginBottom: 0, color: "white" }}>
              Bonuses are classified as <strong>supplemental wages</strong> by
              the IRS and are subject to a{" "}
              <strong>flat 22% federal withholding rate</strong> (37% on any
              amount over $1 million), plus <strong>7.65% FICA</strong> for
              Social Security and Medicare, plus state tax where applicable. On
              a $5,000 bonus, that usually means only about{" "}
              <strong>$3,300 to $3,500</strong> actually hits your bank account.
              But this is{" "}
              <strong>withholding — not the final tax you owe</strong>. If your
              actual marginal rate is below 22%, you will get some of this money
              back as a refund when you file your tax return. To model your
              exact bonus tax, use our{" "}
              <Link href="/income-tax-calculator/" className="my-link">
                income tax calculator
              </Link>
              .
            </p>
          </section>

          {/* SECTION 1 — THE FRUSTRATION */}
          <section id="the-bonus-frustration" style={{ marginBottom: "48px" }}>
            <h2>The Real Story: Where Did Half My Bonus Go?</h2>
            <p>
              Here is a scenario that plays out in millions of American bank
              accounts every December. You earn $60,000 a year at a normal desk
              job. Your paychecks are usually predictable — you take home about
              78% of your gross pay after federal tax, FICA, and state tax. Then
              bonus season comes, and your employer announces a $5,000 year-end
              bonus.
            </p>
            <p>
              You do quick math in your head:{" "}
              <em>
                &quot;22% for federal, 7.65% for FICA, maybe 5% for state — I
                should net about $3,300 or $3,400.&quot;
              </em>
            </p>
            <p>
              You&apos;re actually not wrong on the arithmetic. The problem is
              that your bonus was taxed at a{" "}
              <strong>higher effective rate than your normal paycheck</strong>.
              On a normal $5,000 chunk of your regular salary, the federal
              portion would be around 12% or lower — not 22%. That gap of 10
              percentage points is exactly why the bonus feels &quot;taxed so
              much&quot; even though the total deductions add up to what most
              people would guess.
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
              <strong>The most important thing to understand:</strong> what your
              employer withholds from your bonus is not the same as the tax you
              actually owe. Withholding is a payment on account. Your final tax
              is settled when you file your return the following spring. If they
              withheld too much, you get a refund. If they withheld too little,
              you owe more. This is the single biggest source of confusion about
              bonus tax in the U.S.
            </div>
          </section>

          {/* SECTION 2 — WHAT ARE SUPPLEMENTAL WAGES */}
          <section id="supplemental-wages" style={{ marginBottom: "48px" }}>
            <h2>What the IRS Considers &quot;Supplemental Wages&quot;</h2>
            <p>
              The IRS puts most one-time or irregular payments into a special
              category called <strong>supplemental wages</strong>, which are
              taxed differently than your regular paycheck. Bonuses are the most
              famous example, but they are far from the only kind. Here is what
              falls into this bucket:
            </p>

            <ul style={{ paddingLeft: "20px", lineHeight: 2.2, color: "#333" }}>
              <li>
                Cash bonuses (annual, quarterly, spot, sign-on, retention)
              </li>
              <li>Commissions</li>
              <li>Overtime pay</li>
              <li>Severance pay</li>
              <li>Back pay and awards</li>
              <li>Accumulated sick leave and PTO payouts</li>
              <li>Prizes and non-cash awards from your employer</li>
              <li>Retroactive wage increases</li>
              <li>Reported tips paid through the employer</li>
              <li>Certain vested restricted stock units (RSUs)</li>
            </ul>

            <p>
              Because the IRS treats these payments as separate from your normal
              pay, employers have two options for how to handle the withholding.
              Which one your employer uses determines exactly what shows up in
              your bank account.
            </p>
          </section>

          {/* SECTION 3 — TWO METHODS */}
          <section id="two-methods" style={{ marginBottom: "48px" }}>
            <h2>The Two Ways Your Employer Can Withhold Tax From a Bonus</h2>
            <p>
              Under IRS rules, employers must use one of two methods when
              running bonus payments through payroll. The one they choose can
              produce very different take-home numbers on the same bonus amount.
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
                      Method
                    </th>
                    <th style={{ padding: "12px 16px", textAlign: "left" }}>
                      How It Works
                    </th>
                    <th style={{ padding: "12px 16px", textAlign: "left" }}>
                      Who Uses It
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    [
                      "Percentage Method",
                      "A flat 22% federal rate is applied to the bonus, separate from regular pay. Simple, predictable.",
                      "Most employers, especially larger companies. Standard for separately paid bonuses.",
                    ],
                    [
                      "Aggregate Method",
                      "The bonus is added to your regular paycheck and total withholding is calculated as if the whole amount was normal pay — often at a higher rate.",
                      "Smaller employers, or when bonuses are paid inside a regular pay period without being flagged separately.",
                    ],
                  ].map(([method, how, who], i) => (
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
                        {method}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          border: "1px solid #e8edf5",
                          color: "#444",
                        }}
                      >
                        {how}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          border: "1px solid #e8edf5",
                          color: "#444",
                          fontSize: "0.93rem",
                        }}
                      >
                        {who}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p>
              The <strong>percentage method</strong> is far more common for
              standalone bonus checks. It is why the internet is full of
              &quot;22% bonus tax&quot; posts and explainers — that is the flat
              federal rate applied under this method. If your bonus was paid as
              a separate check or a separately labeled line item on your
              paystub, it was almost certainly withheld at 22%.
            </p>
            <p>
              The <strong>aggregate method</strong> can produce a bigger
              apparent tax hit because the software briefly treats you as if you
              were earning at a much higher annual rate. On a $5,000 bonus paid
              into a normal biweekly paycheck, the payroll system might use a
              withholding table that assumes you always earn that much — pushing
              you temporarily into a much higher bracket for that single
              paycheck. This is why some people report bonus withholding as high
              as 30% or 35% even before the 22% supplemental rate is quoted
              anywhere.
            </p>
          </section>

          {/* SECTION 4 — THE FULL BREAKDOWN */}
          <section id="full-breakdown" style={{ marginBottom: "48px" }}>
            <h2>The Full Bonus Tax Breakdown: What Actually Gets Deducted</h2>
            <p>
              Federal income tax withholding is just one layer. Here is
              everything that comes out of a bonus paid to a W-2 employee in the
              U.S. in 2026, under the percentage method:
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
                LAYERS OF TAX ON A U.S. W-2 BONUS
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
                Federal supplemental withholding: <strong>22%</strong> (37%
                above $1M)
                <br />
                Social Security tax: <strong>6.2%</strong> (up to $184,500 wage
                base for 2026)
                <br />
                Medicare tax: <strong>1.45%</strong> (no cap)
                <br />
                Additional Medicare tax: <strong>+0.9%</strong> above $200k
                (single) / $250k (MFJ)
                <br />
                State income tax: <strong>0% to ~11%</strong> depending on state
                <br />
                Local tax (some cities): <strong>0% to ~4%</strong>
              </p>
            </div>

            <h3>Worked Example: $5,000 Bonus for a Typical Employee</h3>
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
                Single filer, $60,000 base salary, no state tax (e.g., Texas or
                Florida)
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
                Bonus gross: $5,000
                <br />
                Federal withholding (22%): −$1,100
                <br />
                Social Security (6.2%): −$310
                <br />
                Medicare (1.45%): −$72.50
                <br />
                <strong>Take-home: $3,517.50 (about 70% of gross)</strong>
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
                Same bonus in California (state tax adds ~10.23% supplemental)
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
                Bonus gross: $5,000
                <br />
                Federal withholding (22%): −$1,100
                <br />
                California supplemental (10.23%): −$511.50
                <br />
                Social Security (6.2%): −$310
                <br />
                Medicare (1.45%): −$72.50
                <br />
                State disability insurance (1.1%): −$55
                <br />
                <strong>Take-home: $2,951 (about 59% of gross)</strong>
              </p>
            </div>

            <p>
              A $5,000 bonus in California nets you about $566 less than the
              same bonus in Texas — purely because of state supplemental
              withholding and state disability. This is why national averages
              for &quot;bonus tax&quot; can be so misleading; the state you live
              in changes the answer by hundreds of dollars.
            </p>
          </section>

          <img
            src="/blog17.2.webp"
            className="image-blog"
            alt="Bonus withholding vs actual tax owed and getting money back at tax time"
          />

          {/* SECTION 5 — WITHHOLDING VS TAX OWED */}
          <section id="withholding-vs-owed" style={{ marginBottom: "48px" }}>
            <h2>
              The Critical Distinction: Withholding Is Not the Same as Tax Owed
            </h2>
            <p>
              This is the single most misunderstood fact in U.S. payroll, and
              getting it wrong costs people real money — either in frustration,
              or in tax-planning mistakes based on the wrong rate.
            </p>
            <p>
              When your employer withholds 22% from your bonus, that money is
              being sent to the IRS as a <strong>prepayment</strong> against
              your final tax bill for the year. It is not your final tax rate.
              At tax time — when you file your return by April 15 the following
              year — the IRS calculates your total tax owed using your normal
              progressive brackets (10%, 12%, 22%, 24%, and so on), based on{" "}
              <em>total</em> income for the year, then compares that to{" "}
              <em>total</em> tax already withheld from all your paychecks
              combined.
            </p>
            <p>Three outcomes are possible:</p>

            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {[
                {
                  title: "You get a refund",
                  body: "Your actual marginal tax rate on the bonus was lower than 22%. This happens when your total taxable income keeps you in the 10% or 12% bracket. The IRS refunds the difference. Most workers earning under about $50,000 fall into this category.",
                  color: "#16a34a",
                },
                {
                  title: "You break even",
                  body: "Your actual marginal rate on the bonus turned out to be exactly 22%. This is more common for workers earning between roughly $60,000 and $105,000 who stay squarely in the 22% bracket. Nothing to refund, nothing extra owed on the bonus itself.",
                  color: "#F59E0B",
                },
                {
                  title: "You owe more",
                  body: "Your actual marginal rate on the bonus was higher than 22% — because the bonus pushed you into the 24%, 32%, 35%, or 37% bracket. The IRS collects the extra. Most common for higher earners and those with big bonuses relative to base salary.",
                  color: "#DC2626",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    borderLeft: `5px solid ${item.color}`,
                    padding: "18px 20px",
                    backgroundColor: i % 2 === 0 ? "#fff" : "#f9fafb",
                    borderBottom: "1px solid #e8edf5",
                  }}
                >
                  <strong
                    style={{
                      color: item.color,
                      display: "block",
                      marginBottom: "6px",
                      fontSize: "1rem",
                    }}
                  >
                    Scenario {i + 1}: {item.title}
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

            <p style={{ marginTop: "22px" }}>
              For a deeper understanding of how marginal rate differs from
              effective rate — the exact concept that determines which scenario
              applies to you — read our full breakdown on{" "}
              <Link
                href="/blog/marginal-vs-effective-tax-rate/"
                className="my-link"
              >
                marginal vs effective tax rate
              </Link>
              . It is the foundation of understanding why bonus tax works the
              way it does.
            </p>
          </section>

          {/* SECTION 6 — WORKED EXAMPLE OF GETTING MONEY BACK */}
          <section id="getting-money-back" style={{ marginBottom: "48px" }}>
            <h2>Worked Example: When You Get Bonus Tax Money Back</h2>
            <p>
              Meet Marcus, a single filer earning $40,000 as a warehouse
              supervisor in Texas (no state income tax). His year-end bonus is
              $3,000. His employer withholds 22% federal, plus FICA:
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
                What Marcus actually received on his bonus paycheck
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
                Bonus gross: $3,000
                <br />
                Federal withholding (22%): −$660
                <br />
                Social Security (6.2%): −$186
                <br />
                Medicare (1.45%): −$43.50
                <br />
                <strong>Take-home that day: $2,110.50</strong>
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
                What his final federal tax actually looked like at tax time
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
                Total gross income: $43,000 ($40k + $3k bonus)
                <br />
                Standard deduction 2026: −$16,100
                <br />
                Taxable income: $26,900
                <br />
                <br />
                Tax at 10% on first $12,400 = $1,240
                <br />
                Tax at 12% on $12,401–$26,900 = $1,740
                <br />
                <strong>Total federal tax owed: $2,980</strong>
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
                THE REFUND CALCULATION
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
                Withheld from bonus (22%): $660
                <br />
                Actual tax on that $3,000 of bonus (at 12% marginal): $360
                <br />
                <strong>Excess withholding refunded: $300</strong>
              </p>
            </div>

            <p>
              Marcus effectively paid{" "}
              <strong>10 extra percentage points</strong> on his bonus in
              withholding — and got them back three or four months later as part
              of his federal refund. This is the norm for anyone whose regular
              marginal rate is 10% or 12%. If your bonus felt punishingly taxed
              at 22% but your normal paycheck sits well below the 22% bracket,
              you are almost certainly getting a chunk of that back at tax time.
            </p>
          </section>

          {/* SECTION 7 — WHEN YOU OWE MORE */}
          <section id="when-you-owe-more" style={{ marginBottom: "48px" }}>
            <h2>
              When You Might Actually Owe <em>More</em> Tax on a Bonus
            </h2>
            <p>
              The opposite scenario is just as common for higher earners. If
              your regular income already puts you above the 22% bracket, the
              flat 22% withholding on your bonus <em>under-collects</em>, and
              you will owe more at tax time.
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
                      Your Regular Marginal Rate
                    </th>
                    <th style={{ padding: "12px 16px", textAlign: "center" }}>
                      Bonus Withholding
                    </th>
                    <th style={{ padding: "12px 16px", textAlign: "center" }}>
                      Result at Tax Time
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["10%", "22%", "You get 12 pts back → refund"],
                    ["12%", "22%", "You get 10 pts back → refund"],
                    ["22%", "22%", "Roughly break even"],
                    ["24%", "22%", "You owe 2 more pts → small extra bill"],
                    ["32%", "22%", "You owe 10 more pts → meaningful bill"],
                    ["35%", "22%", "You owe 13 more pts → large bill"],
                    ["37%", "22%", "You owe 15 more pts → biggest gap"],
                  ].map(([rate, wh, result], i) => (
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
                        {wh}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          border: "1px solid #e8edf5",
                          color: result.includes("refund")
                            ? "#16a34a"
                            : result.includes("break")
                              ? "#F59E0B"
                              : "#DC2626",
                          fontWeight: 600,
                          fontSize: "0.93rem",
                        }}
                      >
                        {result}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p>
              High earners with big bonuses should plan for this. A $50,000
              bonus for someone already in the 35% bracket carries a $6,500
              unrecovered gap — 13 percentage points × $50,000 — that shows up
              as an unexpected tax bill on April 15. The solution is either
              boosting your regular paycheck withholding through a W-4 update,
              or making an estimated tax payment before year-end to avoid an
              underpayment penalty.
            </p>
          </section>

          {/* SECTION 8 — WHAT ABOUT STATE TAX */}
          <section id="state-tax-on-bonus" style={{ marginBottom: "48px" }}>
            <h2>What About State Tax? The Layer Most Articles Ignore</h2>
            <p>
              Nearly every &quot;why is my bonus taxed so much&quot; article
              online talks only about the 22% federal number. But your state may
              add another significant chunk. Most states with income tax apply
              their own supplemental withholding rate on bonuses, and the range
              is wider than most people realize.
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
                      State Type
                    </th>
                    <th style={{ padding: "11px 14px", textAlign: "left" }}>
                      Examples
                    </th>
                    <th style={{ padding: "11px 14px", textAlign: "center" }}>
                      State Bonus Withholding
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    [
                      "No state income tax (9 states)",
                      "Texas, Florida, Washington, Nevada, Tennessee, South Dakota, Wyoming, Alaska, New Hampshire",
                      "0%",
                    ],
                    [
                      "Flat-tax states",
                      "Illinois (4.95%), Pennsylvania (3.07%), Colorado (~4.4%), Utah (~4.85%)",
                      "Flat state rate",
                    ],
                    [
                      "Progressive states with low supplemental",
                      "Georgia (~5.75%), Arizona (~2.5%)",
                      "~2%–6%",
                    ],
                    [
                      "Progressive states with high supplemental",
                      "New York (~11.7%), California (10.23% or 6.6%), Oregon (~8%)",
                      "6%–12%",
                    ],
                  ].map(([type, ex, rate], i) => (
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
                        {type}
                      </td>
                      <td
                        style={{
                          padding: "11px 14px",
                          border: "1px solid #e8edf5",
                          color: "#444",
                          fontSize: "0.9rem",
                        }}
                      >
                        {ex}
                      </td>
                      <td
                        style={{
                          padding: "11px 14px",
                          border: "1px solid #e8edf5",
                          textAlign: "center",
                          fontWeight: 700,
                          color: "#DC2626",
                        }}
                      >
                        {rate}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p>
              California has a special quirk worth knowing: normal supplemental
              income is withheld at 6.6%, but bonuses and stock options are
              withheld at <strong>10.23%</strong>. In New York City, on top of
              state and federal, you also get hit with NYC local supplemental
              withholding at around 4.25%. Living in a high-tax state on a big
              bonus can push total withholding well above 40%.
            </p>
          </section>

          {/* SECTION 9 — THE $1M RULE */}
          <section id="million-dollar-rule" style={{ marginBottom: "48px" }}>
            <h2>Bonuses Over $1 Million: The Special 37% Rule</h2>
            <p>
              For most people this section is theoretical, but if you work in
              finance, tech, entertainment, or executive leadership, it can be
              very real. Any portion of a supplemental payment above $1 million
              in a single calendar year is required to be withheld at the
              highest federal income tax bracket — currently{" "}
              <strong>37% for 2026</strong>.
            </p>
            <p>Here is how it works with a $1.5 million bonus:</p>

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
                  lineHeight: 2,
                  margin: 0,
                }}
              >
                First $1,000,000 at 22% = $220,000 withheld
                <br />
                Next $500,000 at 37% = $185,000 withheld
                <br />
                <strong>Total federal withholding: $405,000</strong>
                <br />
                (Plus FICA, additional Medicare, and any state tax on top)
              </p>
            </div>

            <p>
              For executives receiving equity vests, RSU cliffs, or
              multi-million bonuses, this rule is often what triggers massive
              same-day tax bills. The 37% rate is closer to a high earner&apos;s
              real marginal rate, so refunds on this tier are unusual.
            </p>
          </section>

          {/* SECTION 10 — HOW TO FIGURE OUT YOUR BONUS TAKE-HOME */}
          <section id="figure-out-bonus" style={{ marginBottom: "48px" }}>
            <h2>Step-by-Step: How to Estimate Your Actual Bonus Take-Home</h2>
            <p>
              Before you spend that bonus, run through this quick check so you
              know what to expect. This gives you a realistic take-home number
              and flags whether a tax bill is coming.
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
                  "Start with the gross bonus amount",
                  "The dollar figure your employer told you. That is the top of the funnel — everything comes off of it.",
                ],
                [
                  "Subtract 22% for federal withholding",
                  "For bonuses under $1M using the percentage method, this is standard. If you know your employer uses the aggregate method, expect withholding closer to your normal paycheck's federal rate.",
                ],
                [
                  "Subtract 7.65% for FICA",
                  "6.2% Social Security + 1.45% Medicare. Both apply to your bonus in full, unless you've already crossed the $184,500 Social Security wage base for 2026 (in which case only Medicare's 1.45% applies).",
                ],
                [
                  "Subtract your state's supplemental rate",
                  "Zero if you live in a no-income-tax state. Otherwise, use your state's supplemental rate — not your normal paycheck's tax rate. See the table above for common ranges.",
                ],
                [
                  "Check whether you'll cross the $200k additional Medicare threshold",
                  "If your total year's wages will exceed $200k single or $250k MFJ, an extra 0.9% Medicare tax applies to income above that line. Employers may withhold this on your bonus if it pushes you over.",
                ],
                [
                  "Estimate the reconciliation at tax time",
                  "Compare 22% (what was withheld) to your actual marginal rate. If your marginal is lower, expect a refund of the difference. If higher, expect a bill. Our income tax calculator handles this in seconds.",
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
              If your bonus is really a raise disguised as a one-time payment —
              some companies use bonuses in lieu of salary increases — our{" "}
              <Link href="/salary-hike-calculator/" className="my-link">
                salary hike calculator
              </Link>{" "}
              helps you compare the annualized value against what a genuine
              raise would have delivered. And for the deeper bracket breakdown
              of what &quot;marginal rate&quot; actually means for your bonus,
              see our{" "}
              <Link href="/blog/2026-tax-brackets/" className="my-link">
                2026 tax brackets guide
              </Link>
              .
            </p>
          </section>

          {/* FAQ */}
          <section>
            <h2>Bonus Withholding Questions</h2>

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
      </div>

      <BlogSidebar
        relatedTools={[
          ["/income-tax-calculator/", "Income Tax Calculator"],
          ["/salary-hike-calculator/", "Salary Hike Calculator"],
        ]}
        relatedPosts={[
          [
            "/blog/marginal-vs-effective-tax-rate/",
            "Marginal vs Effective Tax Rate",
          ],
          ["/blog/2026-tax-brackets/", "2026 Tax Brackets, Deductions and What Changed"],
          [
            "/blog/best-free-financial-calculators-for-everyday-money-questions/",
            "Best Free Financial Calculators for Everyday Money Questions",
          ],
        ]}
      />
    </div>
  );
}
