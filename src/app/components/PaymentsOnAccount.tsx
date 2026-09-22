"use client";
import { useState } from "react";
import Link from "next/link";
import "@fortawesome/fontawesome-free/css/all.min.css";
import BlogSidebar from "./BlogSidebar";

export default function PaymentsOnAccount() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const toggleFAQ = (i: number) => setOpenFAQ(openFAQ === i ? null : i);

  /* ── FAQ data (also used for JSON-LD schema) ── */
  const faqs: [string, string][] = [
    [
      "Why is HMRC asking for more than the tax on my return?",
      "Because the demand contains two different things. One is the tax you owe for the year you have just filed, which is the figure on your calculation. The other is an advance instalment towards the year you are currently living through, set at half of the year you just filed. Added together they come to one and a half times your bill. Nothing has been miscalculated and you are not being charged twice — you are being asked to settle one year and start prepaying the next on the same day.",
    ],
    [
      "Do payments on account apply to everyone who files a return?",
      "No, and two separate tests decide it. Your Self Assessment bill has to come to more than £1,000, and less than 80% of the tax you owe for the year must already have been collected at source. Fail either test and the system leaves you alone. Someone employed full time with a modest side income usually escapes on the second test, because PAYE has already taken most of what they owe before the return is even filed.",
    ],
    [
      "How do I work out what I will actually be asked for in January?",
      "Take the tax bill for the year you are filing. Subtract any payments on account you already made during that year. What is left is the balancing payment. Then add half of that same year's bill as the first instalment towards the current year. The sum of those two is the January figure. In a first year there are no earlier instalments to subtract, which is why the first January is the expensive one.",
    ],
    [
      "Does the bill stay at one and a half times every year?",
      "No, and this is the part worth holding on to. The 50% uplift is the cost of joining the system, not an annual surcharge. If your income holds steady, the instalments you paid in January and July will already cover the following year's bill in full, so the balancing payment falls to nothing and January asks only for the next instalment. Steady income means January settles at half a year's tax, not one and a half.",
    ],
    [
      "My income has dropped. Can I pay less?",
      "Yes. You can ask HMRC to reduce both instalments to half of what you genuinely expect this year's bill to be, either through your online account or on form SA303. The estimate has to be honest rather than hopeful, because if the year turns out better than you claimed, interest is charged on the shortfall from the original due dates — not from the day the return revealed it. A reduction is a forecast you are held to, not a payment holiday.",
    ],
    [
      "What happens if my income goes up instead?",
      "Nothing immediate, and that is the trap. Your instalments were fixed by last year's figures, so a better year does not raise them. The whole increase arrives at once in the following January as a larger balancing payment, on top of an instalment that has also just been recalculated upwards. Two years of growth land in the same demand, which is why a good year is a reason to set aside more rather than less.",
    ],
    [
      "Are the July and January instalments different amounts?",
      "No. Both are exactly half of the previous year's bill, and neither is adjusted for anything that has happened since. July is easier to absorb only because it arrives on its own, whereas January arrives alongside the balancing payment for the year just filed. Same figure, different company.",
    ],
    [
      "Do the instalments include National Insurance?",
      "Class 4 National Insurance is part of the liability the instalments are based on, so it is carried along with the income tax. Class 2 is not — it is due with the balancing payment in January and is left out of the instalment calculation. It is a small amount, but it explains why a bill occasionally sits a little above exactly half of last year's figure when you check the arithmetic.",
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
          src="/blog22.1.webp"
          className="image-blog"
          alt="A close-up of a printed tax bill showing a total tax figure in a boxed column"
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
              22 Sep 2026
            </span>
          </small>
        </div>

        <article>
          <header>
            <h1>Your First Tax Bill Is 150% of the Tax You Owe</h1>
            <p>
              You finish your first Self Assessment return, the calculation
              appears, and it says you owe £3,000. You have saved for that. Then
              you look at what HMRC actually wants by 31 January and the figure
              is £4,500. No error has been made, nothing has been double
              counted, and there is nobody to appeal to, because the extra
              £1,500 is not tax on the year you just filed. It is the first
              instalment on the year you are living through right now. This is
              how payments on account work in the UK, and almost nobody is told
              about them until the demand arrives.
            </p>
          </header>

          <section style={{ marginBottom: "48px" }}>
            <h2>The System Asks You to Catch Up and Keep Up at Once</h2>
            <p>
              Employment collects tax as you earn it. Every payslip hands a
              slice to HMRC before the money reaches you, so by the end of the
              year the debt is already settled. Self-employment has no such
              mechanism. You earn for a full twelve months, the tax year closes
              on 5 April, and only then does anyone work out what is owed — with
              the payment not due until the January after that.
            </p>
            <p>
              Left alone, that arrangement would have HMRC waiting up to
              twenty-two months for money on income earned in the first week of
              a tax year. Payments on account exist to close that gap. Rather
              than ask you to predict your own income, the rule takes the only
              hard number available — what you owed last year — and asks for
              half of it twice, once in January and once in July.
            </p>
            <p>
              It is a reasonable design and it is defensible from HMRC&apos;s
              side. The difficulty is entirely in the transition. Once you are
              inside the system the instalments simply replace the lump sum. But
              the year you enter it, you are settling one year and prepaying
              another simultaneously, and eighteen months of tax falls due
              within six months.
            </p>
          </section>

          <section style={{ marginBottom: "48px" }}>
            <h2>Where the Extra Half Comes From</h2>
            <p>
              The arithmetic is short enough to do on the back of the
              calculation itself. Take the bill for the year you have filed.
              Subtract whatever instalments you already paid during that year.
              The remainder is the balancing payment. Then add half of that same
              bill as the first instalment towards the current year.
            </p>
            <p>
              In a first year there is nothing to subtract, because no
              instalments were ever set. So the whole bill survives as the
              balancing payment, and half of it is added on top:
            </p>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Due date</th>
                    <th>Balancing payment</th>
                    <th>Instalment</th>
                    <th>Total demanded</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>31 January, first year</td>
                    <td>£3,000</td>
                    <td>£1,500</td>
                    <td>
                      <strong>£4,500</strong>
                    </td>
                  </tr>
                  <tr>
                    <td>31 July, first year</td>
                    <td>—</td>
                    <td>£1,500</td>
                    <td>
                      <strong>£1,500</strong>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Six months</strong>
                    </td>
                    <td>
                      <strong>£3,000</strong>
                    </td>
                    <td>
                      <strong>£3,000</strong>
                    </td>
                    <td>
                      <strong>£6,000</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>
              £6,000 leaves your account inside six months against a tax bill of
              £3,000. Every penny is correctly charged. Half of it is simply
              money you would otherwise have paid a year later, brought forward
              permanently.
            </p>
            <p>
              That last word is the one to notice. This is not a loan and there
              is no point in the future where the timing reverses and you get a
              year off. You have moved onto a schedule that runs six months
              ahead of the old one, and the cost of moving is a single payment
              of half a year&apos;s tax, paid once, in the January you join.
            </p>
          </section>

          <img
            src="/blog22.2.webp"
            className="image-blog"
            alt="Someone completing a tax return by hand, with a calculator, a laptop and a note marked tax"
          />

          <section style={{ marginBottom: "48px" }}>
            <h2>Two Tests Decide Whether Any of This Applies</h2>
            <p>
              Plenty of people file a return and never encounter an instalment,
              which is why the demand blindsides those who do. Two conditions
              both have to be true before HMRC sets them.
            </p>
            <p>
              The first is size: your Self Assessment bill has to exceed £1,000.
              A bill of £980 is settled in one payment and forgotten. A bill of
              £1,020 brings instalments of £510 with it. Forty pounds of extra
              tax changes the January demand by more than five hundred.
            </p>
            <p>
              The second is about where your tax is already coming from. If 80%
              or more of what you owe has been collected at source — through
              PAYE on a salary, or deducted before payment under the
              Construction Industry Scheme — the instalments do not apply. The
              logic is that HMRC is already being paid as you earn, so there is
              no timing gap left to close.
            </p>
            <p>
              That second test is what separates two people with identical tax
              bills:
            </p>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Situation</th>
                    <th>Total tax</th>
                    <th>Collected at source</th>
                    <th>Share</th>
                    <th>Instalments?</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Employed, small side income</td>
                    <td>£2,400</td>
                    <td>£2,100</td>
                    <td>87.5%</td>
                    <td>No</td>
                  </tr>
                  <tr>
                    <td>Employed part time, growing freelance work</td>
                    <td>£2,400</td>
                    <td>£1,800</td>
                    <td>75.0%</td>
                    <td>Yes</td>
                  </tr>
                  <tr>
                    <td>Fully self-employed</td>
                    <td>£2,400</td>
                    <td>£0</td>
                    <td>0.0%</td>
                    <td>Yes</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>
              The middle row is the one that catches people, because it looks
              from the inside like the row above it. A salaried job is still
              covering most of the tax, the freelance work still feels
              incidental, and the test is failed by three and a half percentage
              points. If your own split is anywhere near the line, the{" "}
              <Link href="/percentage-calculator/" className="my-link">
                percentage calculator
              </Link>{" "}
              will settle it in one step — divide the tax already deducted by
              the total and see which side of 80% you land on.
            </p>
          </section>

          <section style={{ marginBottom: "48px" }}>
            <h2>The Second Year Is Cheaper Than the First</h2>
            <p>
              The 150% figure is a one-off, and missing that is what turns an
              unpleasant surprise into an unnecessary panic. It is the entry
              price, not a permanent markup.
            </p>
            <p>
              Follow the same £3,000 earner into a second year with steady
              income. By the time that return is filed, £3,000 of instalments
              have already been paid during the year. The balancing payment is
              therefore nothing, and January asks only for the next instalment:
            </p>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Year</th>
                    <th>Tax for the year</th>
                    <th>Already paid in instalments</th>
                    <th>Balancing payment</th>
                    <th>Plus new instalment</th>
                    <th>January demand</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>First</td>
                    <td>£3,000</td>
                    <td>£0</td>
                    <td>£3,000</td>
                    <td>£1,500</td>
                    <td>
                      <strong>£4,500</strong>
                    </td>
                  </tr>
                  <tr>
                    <td>Second, income flat</td>
                    <td>£3,000</td>
                    <td>£3,000</td>
                    <td>£0</td>
                    <td>£1,500</td>
                    <td>
                      <strong>£1,500</strong>
                    </td>
                  </tr>
                  <tr>
                    <td>Third, income up a third</td>
                    <td>£4,000</td>
                    <td>£3,000</td>
                    <td>£1,000</td>
                    <td>£2,000</td>
                    <td>
                      <strong>£3,000</strong>
                    </td>
                  </tr>
                  <tr>
                    <td>Fourth, income back down</td>
                    <td>£3,000</td>
                    <td>£4,000</td>
                    <td>−£1,000</td>
                    <td>£1,500</td>
                    <td>
                      <strong>£500</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>
              Two things fall out of that table. A flat year costs £1,500 in
              January rather than £4,500, so the shock genuinely does not
              repeat. And a falling year can produce a January demand smaller
              than the instalment itself, because the overpayment from the
              previous year is set against it before anything else is added.
            </p>
            <p>
              The third row is the one to plan around. Income rose by £1,000 of
              tax, but the January demand rose by £1,500 — the extra tax plus
              half of it again, because the instalment was recalculated upwards
              on the same day the shortfall was discovered. Growth always
              arrives in the demand at one and a half times its size.
            </p>
          </section>

          <section style={{ marginBottom: "48px" }}>
            <h2>A Bad Year Does Not Lower the Instalment By Itself</h2>
            <p>
              The instalments are built from last year&apos;s figures and know
              nothing about this year. If your income has halved, HMRC will
              still ask for half of a bill you are no longer going to owe, and
              will keep asking until a return tells it otherwise.
            </p>
            <p>
              You are allowed to correct this in advance. A claim to reduce
              payments on account — made through your online account or on form
              SA303 — replaces HMRC&apos;s figure with your own estimate of this
              year&apos;s liability, and both instalments are reset to half of
              it.
            </p>
            <p>
              The catch is worth stating plainly, because it is where an
              innocent optimism turns expensive. If you reduce the instalments
              and the year turns out better than you predicted, interest is
              charged on the difference from the dates the original payments
              were due — not from the point the return revealed the shortfall.
              Cut a January instalment and discover the truth thirteen months
              later, and the interest has been accruing for all thirteen.
            </p>
            <p>
              So a reduction is a forecast you are held to rather than a
              deferral you can undo. Reduce to what you actually expect, not to
              what you can comfortably afford this month, and if the two differ,
              the problem is a cash flow problem rather than a tax one.
            </p>
          </section>

          <section style={{ marginBottom: "48px" }}>
            <h2>What Falls Due Between Now and That January</h2>
            <p>
              The dates for the 2025/26 tax year, which closed on 5 April 2026,
              run as follows.
            </p>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>What is due</th>
                    <th>If you miss it</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>5 October 2026</td>
                    <td>
                      Register for Self Assessment if this is your first year
                    </td>
                    <td>A penalty based on the tax owed, not a flat fee</td>
                  </tr>
                  <tr>
                    <td>31 October 2026</td>
                    <td>Paper return</td>
                    <td>Late filing penalty — or file online instead</td>
                  </tr>
                  <tr>
                    <td>31 January 2027</td>
                    <td>
                      Online return, balancing payment and first instalment
                    </td>
                    <td>Penalty for the return, interest on the payment</td>
                  </tr>
                  <tr>
                    <td>31 July 2027</td>
                    <td>Second instalment</td>
                    <td>Interest from the due date</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>
              The filing deadline and the payment deadline share 31 January, and
              treating them as one date is the mistake that quietly costs money.
              A return filed in October is not paid in October — the money is
              still due in January. But filing early tells you what January
              holds while there are still three months to arrange it, which is
              the only part of this timetable you have any control over.
            </p>
            <p>
              If you want the gap in plain numbers rather than months, the{" "}
              <Link href="/days-between-calculator/" className="my-link">
                days between calculator
              </Link>{" "}
              will tell you exactly how long you have left to put the money
              aside.
            </p>
          </section>

          <section style={{ marginBottom: "48px" }}>
            <h2>Saving for a Bill That Lands in Two Pieces</h2>
            <p>
              The usual advice is to set aside a fixed share of everything you
              invoice. It is good advice and it is incomplete, because in your
              first year the share has to cover one and a half years of tax
              rather than one.
            </p>
            <p>
              Work out your expected liability for the year — the{" "}
              <Link href="/freelancer-tax-calculator/" className="my-link">
                freelancer tax calculator
              </Link>{" "}
              will give you income tax, Class 4 National Insurance and the
              effect of platform fees in one place — and then set aside 150% of
              it across that first year rather than 100%. On a £3,000 expected
              bill that is £4,500 saved by 31 January, which is exactly the
              demand, and the July instalment is then met from the following
              year&apos;s savings at the normal rate.
            </p>
            <p>
              From the second year the multiplier drops back to 100%, because
              the instalments you pay during the year are the tax for that year.
              You are simply paying it in two halves, in advance, instead of
              once in arrears.
            </p>
            <p>
              A word on the percentage itself: the share of income to set aside
              is not your tax band. Someone paying basic rate tax and Class 4
              National Insurance on profits is parting with rather more of each
              extra pound than the headline 20% implies, and rather less of
              their total income than the same figure suggests, because the
              personal allowance sits underneath untouched. That distinction —
              between the rate on the next pound and the rate across everything
              — is the one worth getting right before choosing a number, and it
              is set out in{" "}
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
            <h2>The Thing Worth Remembering in January</h2>
            <p>
              When the demand appears and it is larger than the calculation you
              just agreed to, the useful instinct is not to assume a mistake. It
              is to split the figure in two. One part is last year, finished and
              settled. The other part is this year, started early. Neither is a
              penalty and neither is negotiable, but knowing which is which
              turns an alarming total into two ordinary ones.
            </p>
            <p>
              And the first January is the worst one you will have. Everything
              after it is either half a year&apos;s tax or half a year&apos;s
              tax adjusted for how the year went — never the full catch-up
              again, as long as you stay in the system.
            </p>
          </section>

          {/* FAQ */}
          <section>
            <h2>Questions About Payments on Account</h2>

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
          ["/freelancer-tax-calculator/", "Freelancer Tax Calculator"],
          ["/income-tax-calculator/", "Income Tax Calculator"],
          ["/percentage-calculator/", "Percentage Calculator"],
        ]}
        relatedPosts={[
          [
            "/blog/marginal-vs-effective-tax-rate/",
            "Marginal vs Effective Tax Rate",
          ],
          [
            "/blog/why-was-my-bonus-taxed-so-much/",
            "Why Was My Bonus Taxed So Much?",
          ],
          ["/blog/2026-tax-brackets/", "2026 Tax Brackets"],
        ]}
      />
    </div>
  );
}
