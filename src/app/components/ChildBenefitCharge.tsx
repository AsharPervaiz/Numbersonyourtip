"use client";
import { useState } from "react";
import Link from "next/link";
import "@fortawesome/fontawesome-free/css/all.min.css";
import BlogSidebar from "./BlogSidebar";

export default function ChildBenefitCharge() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const toggleFAQ = (i: number) => setOpenFAQ(openFAQ === i ? null : i);

  /* ── FAQ data (also used for JSON-LD schema) ── */
  const faqs: [string, string][] = [
    [
      "How can a couple on £118,000 keep child benefit when one earner on £80,000 loses it?",
      "Because the charge looks at one person's income, never the household's. It is triggered by the highest single adjusted net income in the couple, so two people earning £59,000 each are both below the £60,000 threshold and neither pays anything. A single earner on £80,000 is £20,000 over it and repays the whole award. The government confirmed in the Autumn Budget 2024 that it would not move to a household basis, so this is settled rather than pending.",
    ],
    [
      "How much of the benefit do I lose at my income?",
      "One per cent of the year's child benefit for every £200 of adjusted net income above £60,000. Subtract £60,000 from your income, divide by 200, and that is the percentage you repay. At £66,000 the sum is 6,000 ÷ 200 = 30, so you repay 30%. Because £20,000 divided by £200 is exactly 100 steps, the charge reaches 100% at £80,000 and never exceeds it.",
    ],
    [
      "Should I just stop claiming to avoid the paperwork?",
      "Stop the payments if you want, but do not stop the claim. A claim for a child under 12 gives the parent who claims National Insurance credits towards their State Pension, which matters enormously if that parent is at home and not earning. The claim is also what generates the child's National Insurance number automatically at 16. You can claim and tick the box declining the money, which keeps both of those and leaves nothing to repay.",
    ],
    [
      "Is adjusted net income the same as my salary?",
      "No, and the difference is the useful part. Adjusted net income is your taxable income after certain deductions, the main one being pension contributions, along with gift aid donations grossed up. Someone on £66,000 who puts £6,000 into a pension has an adjusted net income of £60,000 and no charge at all. The salary on the contract is the starting point of the calculation, not the answer.",
    ],
    [
      "Do I have to file a Self Assessment return because of this?",
      "Not necessarily, and that changed recently. Since October 2025 there has been an online service that collects the charge through your PAYE tax code instead, provided you have no other reason to file. If you have previously paid it through Self Assessment you have to de-register from Self Assessment first — HMRC does not do it for you, and the PAYE option only becomes available the following day.",
    ],
    [
      "When is the charge actually collected?",
      "From 2026/27 onwards it is collected in the tax year it relates to, rather than in arrears the following January. If you pay through Self Assessment it forms part of your bill and can affect your payments on account. If you pay through PAYE your tax code carries it across the year, which spreads the cost but makes a mid-year pay rise worth telling HMRC about promptly.",
    ],
    [
      "My income goes above £60,000 some years and below it in others. What then?",
      "The charge is assessed year by year, so a year under the threshold carries no charge at all even if the year before was over it. Bonuses are what usually push people across, because the charge is based on income for the tax year rather than on a normal month scaled up. A one-off payment in March can create a charge for a year that otherwise would not have had one.",
    ],
    [
      "Which parent pays it if we both earn over £60,000?",
      "The one with the higher adjusted net income, regardless of who actually receives the child benefit payments into their account. It is common for one partner to claim the benefit while the other settles the charge, which catches people out when the claiming parent assumes no return is needed.",
    ],
  ];

  return (
    <div className="page-layout">
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
          src="/blog23.1.webp"
          className="image-blog"
          alt="A parent sitting on a sofa with two young children"
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
              26 Sep 2026
            </span>
          </small>
        </div>

        <article>
          <header>
            <h1>£80,000 Loses Child Benefit. £118,000 Keeps It.</h1>
            <p>
              Two households, both with two children, both claiming the same
              child benefit. In the first, one parent earns £80,000 and the
              other stays at home. In the second, both parents earn £59,000, so
              £118,000 comes through the door. The first household repays every
              penny of its child benefit. The second repays nothing. That is not
              a loophole anyone is exploiting and it is not an oversight waiting
              to be corrected — it is exactly how the High Income Child Benefit
              Charge is written, and the government confirmed in the Autumn
              Budget 2024 that it intends to leave it that way.
            </p>
          </header>

          <section style={{ marginBottom: "48px" }}>
            <h2>One Income Decides It, Never the Household&apos;s</h2>
            <p>
              The charge is triggered by the highest single adjusted net income
              in a couple. Not the total, not the average, not some combination
              weighted by who works more. One number, belonging to one person,
              decides whether a family keeps its child benefit.
            </p>
            <p>
              Because the threshold sits at £60,000 per person, a couple can in
              principle bring in just under £120,000 between them and stay
              entirely clear of it. Meanwhile a single parent, or a household
              where one person earns everything, hits the charge at £60,000 and
              loses the lot by £80,000.
            </p>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Household</th>
                    <th>Higher single income</th>
                    <th>Total coming in</th>
                    <th>Child benefit kept</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Two earners, £59,000 each</td>
                    <td>£59,000</td>
                    <td>£118,000</td>
                    <td>
                      <strong>All of it</strong>
                    </td>
                  </tr>
                  <tr>
                    <td>Two earners, £70,000 and £20,000</td>
                    <td>£70,000</td>
                    <td>£90,000</td>
                    <td>Half</td>
                  </tr>
                  <tr>
                    <td>One earner, £80,000</td>
                    <td>£80,000</td>
                    <td>£80,000</td>
                    <td>
                      <strong>None</strong>
                    </td>
                  </tr>
                  <tr>
                    <td>Single parent, £80,000</td>
                    <td>£80,000</td>
                    <td>£80,000</td>
                    <td>
                      <strong>None</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>
              The second row is the one people miss. A household on £90,000
              keeps half its benefit while a household on £80,000 keeps none,
              because the £70,000 earner is only £10,000 into the band while the
              £80,000 earner is all the way through it. Ten thousand pounds more
              household income, and a better outcome.
            </p>
          </section>

          <section style={{ marginBottom: "48px" }}>
            <h2>The Clawback Runs in Steps of £200</h2>
            <p>
              The rule is one per cent of the year&apos;s child benefit for
              every £200 of adjusted net income above £60,000. Subtract £60,000,
              divide by 200, and the answer is the percentage repaid.
            </p>
            <p>
              The design is tidier than it first looks. The band from £60,000 to
              £80,000 is £20,000 wide, and £20,000 divided by £200 is exactly
              100 steps of one per cent each. The charge therefore arrives at
              precisely 100% as income reaches £80,000, and stops there. Earning
              £95,000 does not repay more than earning £80,000; there is nothing
              left to repay.
            </p>
            <p>
              Child benefit for 2026/27 runs at £27.05 a week for the eldest
              child and £17.90 for each child after that. For a family with two
              children that is £44.95 a week, or £2,337.40 across a year. At an
              adjusted net income of £66,000 the sum is £6,000 ÷ £200 = 30, so
              30% is repaid: <strong>£701.22</strong>.
            </p>
            <p>
              If the percentage arithmetic is the part that slows you down, the{" "}
              <Link href="/percentage-calculator/" className="my-link">
                percentage calculator
              </Link>{" "}
              will do both halves of it — the share of the band you are into,
              and that share of your own award.
            </p>
          </section>

          <img
            src="/blog23.2.webp"
            className="image-blog"
            alt="Close-up of someone filling in a printed form by hand"
          />

          <section style={{ marginBottom: "48px" }}>
            <h2>What an Extra Pound Really Costs in That Band</h2>
            <p>
              Here is the figure that rarely gets published, and the reason this
              charge feels so much heavier than its size suggests. Inside the
              £60,000 to £80,000 band you are already paying 40% income tax and
              2% National Insurance. The child benefit clawback sits on top of
              that, and how much it adds depends on something income tax
              normally ignores entirely: how many children you have.
            </p>
            <p>
              Spread the annual award across the £20,000 band and it becomes an
              extra rate, which simply adds to the 42% already being paid:
            </p>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Children</th>
                    <th>Child benefit for the year</th>
                    <th>Spread across £20,000</th>
                    <th>Effective marginal rate</th>
                    <th>Kept from each extra £1</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>£1,406.60</td>
                    <td>7.0%</td>
                    <td>
                      <strong>49.0%</strong>
                    </td>
                    <td>51p</td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>£2,337.40</td>
                    <td>11.7%</td>
                    <td>
                      <strong>53.7%</strong>
                    </td>
                    <td>46p</td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>£3,268.20</td>
                    <td>16.3%</td>
                    <td>
                      <strong>58.3%</strong>
                    </td>
                    <td>42p</td>
                  </tr>
                  <tr>
                    <td>4</td>
                    <td>£4,199.00</td>
                    <td>21.0%</td>
                    <td>
                      <strong>63.0%</strong>
                    </td>
                    <td>37p</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>
              A parent of four in that band keeps <strong>37p</strong> of every
              extra pound earned — a higher marginal rate than anyone pays on
              any amount of income under the ordinary rates, including the
              additional rate charged above £125,140. It is reached quietly, at
              a salary most people would not describe as wealthy, and nothing on
              a payslip announces it.
            </p>
            <p>
              This is the clearest case going of a marginal rate and an average
              rate telling completely different stories. The overall share of
              income going in tax remains unremarkable; the rate on the next
              pound is the highest in the system. The distinction, and why it
              matters more for decisions than the headline, is the subject of{" "}
              <Link
                href="/blog/marginal-vs-effective-tax-rate/"
                className="my-link"
              >
                marginal versus effective tax rates
              </Link>
              .
            </p>
          </section>

          <section style={{ marginBottom: "48px" }}>
            <h2>Adjusted Net Income Is Not the Number on Your Contract</h2>
            <p>
              Everything above turns on adjusted net income, and that is not the
              salary you would quote to anyone. It is taxable income after
              specific deductions — chiefly pension contributions, along with
              gift aid donations grossed up for basic rate relief.
            </p>
            <p>
              Which means the threshold is not fixed for you in the way it
              looks. Take the family on £66,000 with two children, facing a
              £701.22 charge. A £6,000 pension contribution brings adjusted net
              income to exactly £60,000, and the charge disappears entirely:
            </p>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Pension contribution</th>
                    <th>Adjusted net income</th>
                    <th>% of benefit repaid</th>
                    <th>Charge</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>None</td>
                    <td>£66,000</td>
                    <td>30%</td>
                    <td>£701.22</td>
                  </tr>
                  <tr>
                    <td>£2,000</td>
                    <td>£64,000</td>
                    <td>20%</td>
                    <td>£467.48</td>
                  </tr>
                  <tr>
                    <td>£4,000</td>
                    <td>£62,000</td>
                    <td>10%</td>
                    <td>£233.74</td>
                  </tr>
                  <tr>
                    <td>£6,000</td>
                    <td>£60,000</td>
                    <td>0%</td>
                    <td>
                      <strong>Nothing</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>
              That money has not been spent — it has moved into a pension, and
              it attracts income tax relief on the way in as well. The charge
              avoided is on top of the relief, which is why this band is the one
              where pension contributions do the most work per pound. The same
              contribution made by someone on £45,000 saves tax and nothing
              else.
            </p>
            <p>
              Salary sacrifice reaches the same place by a different route,
              since it reduces gross pay directly rather than claiming relief
              afterwards. Either way, the lever exists, and it is the reason a
              pay rise that crosses £60,000 is worth modelling before it lands
              rather than after. The{" "}
              <Link href="/salary-hike-calculator/" className="my-link">
                salary hike calculator
              </Link>{" "}
              will show you where a rise puts you, and the{" "}
              <Link href="/income-tax-calculator/" className="my-link">
                income tax calculator
              </Link>{" "}
              what the underlying tax does at that level.
            </p>
          </section>

          <section style={{ marginBottom: "48px" }}>
            <h2>Keep Claiming Even When You Hand It All Back</h2>
            <p>
              Faced with repaying the whole award, the obvious move looks like
              cancelling the claim. It is the wrong move, and it costs more than
              the charge ever would.
            </p>
            <p>
              A child benefit claim for a child under 12 gives the parent who
              claims National Insurance credits towards their State Pension. For
              a parent at home and not earning, those credits are the only thing
              keeping the qualifying years accumulating. Stop the claim and the
              years stop too, quietly, for as long as the claim is not running —
              and the State Pension is built from the count of those years.
            </p>
            <p>
              A live claim is also what produces the child&apos;s National
              Insurance number automatically as they approach 16. Without one,
              that becomes an application rather than something that simply
              arrives.
            </p>
            <p>
              The answer is to make the claim and decline the payments. Ticking
              that box keeps the credits and the National Insurance number, and
              since no money is received there is no charge to repay and nothing
              to report. The one thing to remember is to restart the payments if
              income later falls back under £60,000.
            </p>
          </section>

          <section style={{ marginBottom: "48px" }}>
            <h2>Two Ways to Pay It, and a Trap Between Them</h2>
            <p>
              For years the charge meant filing a Self Assessment return, which
              pulled people who had never filed anything into the system for the
              sake of a few hundred pounds. Since October 2025 there has been
              another route: an online service that collects the charge through
              your PAYE tax code, available to anyone with no other reason to
              file.
            </p>
            <p>
              The trap sits between the two. If you have previously paid the
              charge through Self Assessment, you must de-register from Self
              Assessment yourself before the PAYE option becomes available —
              HMRC does not do it automatically, and the service only opens up
              the following day. People assume switching is a single choice and
              find themselves still in Self Assessment for another year.
            </p>
            <p>
              The timing has changed too. From 2026/27 the charge is collected
              in the tax year it relates to, rather than in arrears the
              following January. If you stay in Self Assessment it forms part of
              your bill, which means it also feeds into the instalments the
              system asks for in advance — a mechanism worth understanding
              before it appears, and one set out in{" "}
              <Link
                href="/blog/payments-on-account-first-tax-bill/"
                className="my-link"
              >
                why the first tax bill is larger than the tax owed
              </Link>
              .
            </p>
          </section>

          <section style={{ marginBottom: "48px" }}>
            <h2>The Threshold Stands Still While Pay Moves Past It</h2>
            <p>
              When the charge was introduced the threshold was £50,000, and it
              stayed there for more than a decade before rising to £60,000. Pay
              did not stand still during those years. Every year the figure is
              left alone, ordinary pay rises carry more families across a line
              that was originally drawn around high earners.
            </p>
            <p>
              This is worth knowing because it changes what the charge is. It
              was designed as something that happened to a small group at the
              top. It is becoming something that happens to teachers, nurses on
              senior bands, and experienced tradespeople — people whose income
              crossed a fixed line rather than people whose circumstances
              changed.
            </p>
            <p>
              Which is the practical reason to check where you sit before the
              year ends rather than after. Adjusted net income can still be
              moved before 5 April. Once the year closes, the figure is what it
              is, and the only remaining question is which of the two ways you
              would like to pay.
            </p>
          </section>

          {/* FAQ */}
          <section>
            <h2>Questions About the Child Benefit Charge</h2>

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
          ["/percentage-calculator/", "Percentage Calculator"],
        ]}
        relatedPosts={[
          [
            "/blog/payments-on-account-first-tax-bill/",
            "Your First Tax Bill Is 150% of the Tax You Owe",
          ],
          [
            "/blog/marginal-vs-effective-tax-rate/",
            "Marginal vs Effective Tax Rate",
          ],
          [
            "/blog/why-was-my-bonus-taxed-so-much/",
            "Why Was My Bonus Taxed So Much?",
          ],
        ]}
      />
    </div>
  );
}
