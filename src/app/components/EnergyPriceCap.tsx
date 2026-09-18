"use client";
import { useState } from "react";
import Link from "next/link";
import "@fortawesome/fontawesome-free/css/all.min.css";
import BlogSidebar from "./BlogSidebar";

export default function EnergyPriceCap() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const toggleFAQ = (i: number) => setOpenFAQ(openFAQ === i ? null : i);

  /* ── FAQ data (also used for JSON-LD schema) ── */
  const faqs: [string, string][] = [
    [
      "Does the energy price cap mean my bill cannot go above £1,723?",
      "No. The cap limits what a supplier may charge for each unit of energy and for each day of standing charge. It places no limit at all on how many units you use, so there is no ceiling on the total. The £1,723 figure describes what a household would pay if it used exactly the amount the regulator treats as typical — 2,500 kWh of electricity and 9,500 kWh of gas in a year. Use more than that and you will pay more, lawfully and within the cap.",
    ],
    [
      "What is a standing charge, and can I avoid it?",
      "It is a fixed daily fee for being connected, charged whether or not you use anything. Under the cap from 1 October 2026 it is 54.83p a day for electricity and 29.68p for gas, which is 84.51p a day together, or £308.46 across a year. You cannot avoid it while the meters are live and connected, which is why an empty flat still generates a bill and why switching everything off at the wall does not take the bill to zero.",
    ],
    [
      "If I cut my energy use by a fifth, does my bill fall by a fifth?",
      "No, it falls by about a sixth. At typical consumption the standing charges are £308.46 of a £1,723.61 bill, and that portion does not move however careful you are. Only the remaining £1,415.15 responds to using less, so a 20% reduction in energy saves £283.03 — a 16.4% reduction in what you actually pay. The rule of thumb is that your bill falls by roughly four fifths of whatever proportion you cut from your usage.",
    ],
    [
      "Why does using less seem to help my neighbour more than me?",
      "Because the fixed part is a larger share of a smaller bill. A household using half the typical amount pays £1,016.04, of which £308.46 — just over 30% — is standing charge, so a 20% cut in usage takes only 13.9% off the bill. A household using half as much again pays £2,431.19, where standing charge is under 13%, and the same 20% cut takes 17.5% off. The heavier user gets more back from the same discipline, which is the opposite of what most advice implies.",
    ],
    [
      "Why does my bill not match the price cap figure at all?",
      "Several reasons, and all of them are ordinary. The headline assumes a particular annual consumption, direct debit payment and an average region, and your position differs on at least one of those. Unit rates vary by region. Paying on receipt of bill or by prepayment carries different rates. And the cap changes every three months, so an annual figure describes a year at one quarter's prices rather than the year you actually lived through.",
    ],
    [
      "Is a fixed tariff below the cap automatically a better deal?",
      "Not automatically, because you are comparing a known price against an unknown one. A fix removes the risk of the cap rising and removes the benefit of it falling, and the cap is reset quarterly, so a twelve-month fix is a bet on four future decisions. Compare the standing charges as well as the unit rates — two tariffs with identical unit rates can differ by tens of pounds a year on the fixed portion alone, and that difference is invisible if you only compare the headline.",
    ],
    [
      "Does the cap apply to everyone?",
      "It applies to households in England, Scotland and Wales on a supplier's default or standard variable tariff. Northern Ireland has a separate regulatory arrangement. If you are on a fixed-term contract you are outside the cap for the length of that contract, which is why a fix agreed when wholesale prices were high can sit above a cap that has since come down.",
    ],
    [
      "How do I work out what my own energy actually costs?",
      "Take the unit rate and standing charge from your bill rather than from any headline, then multiply your own kWh by the rate and add the daily charge for the number of days in the period. Doing it once tells you something no average can: which of the two parts your money is going into. If the fixed portion dominates, the useful question is about the tariff rather than about your habits.",
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
          src="/blog21.1.webp"
          className="image-blog"
          alt="A domestic gas and electricity meter beside a printed energy bill"
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
              19 Sep 2026
            </span>
          </small>
        </div>

        <article>
          <header>
            <h1>The Energy Price Cap Is Not a Cap on Your Bill</h1>
            <p>
              Every three months a number is announced, and every three months a
              great many people hear it as a promise. From 1 October 2026 the
              figure is £1,723, and it is widely read as the most a household
              can be charged for a year of gas and electricity. It is not that.
              It is not close to that. It is the bill a very specific imaginary
              household would receive, and the regulator caps almost everything
              about that household except the one thing that decides what you
              pay.
            </p>
          </header>

          <section style={{ marginBottom: "48px" }}>
            <h2>What the Cap Actually Caps</h2>
            <p>
              A domestic energy bill has two parts. One is a rate charged for
              each kilowatt hour you consume. The other is a standing charge,
              billed for every day you are connected, whether you use anything
              or not. The cap sets a maximum for both of those.
            </p>
            <p>
              What it does not do — cannot do — is limit how many kilowatt hours
              you get through. Multiply an unlimited quantity by a capped rate
              and the product is still unlimited. A household in a large, poorly
              insulated house with electric heating can run well past £1,723
              without a single charge on the bill exceeding what the regulator
              permits. Nothing has gone wrong and no rule has been broken. The
              cap was never the kind of thing that could stop it.
            </p>
            <p>
              So the honest description of £1,723 is not a maximum but an
              illustration: this is what the capped rates come to when applied
              to one assumed pattern of use. The rates are the regulation. The
              total is an example.
            </p>
          </section>

          <section style={{ marginBottom: "48px" }}>
            <h2>Where the Headline Figure Comes From</h2>
            <p>
              The assumed household is published, so the number can be taken
              apart. From 1 July 2026 the regulator treats typical annual
              consumption as 2,500 kWh of electricity and 9,500 kWh of gas. From
              1 October 2026 the capped rates are 26.32p per kWh of electricity
              with a standing charge of 54.83p a day, and 7.97p per kWh of gas
              with a standing charge of 29.68p a day.
            </p>
            <p>That is everything needed to rebuild the headline.</p>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Fuel</th>
                    <th>Usage</th>
                    <th>Standing charge</th>
                    <th>Year</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Electricity</td>
                    <td>2,500 kWh × 26.32p = £658.00</td>
                    <td>54.83p × 365 = £200.13</td>
                    <td>£858.13</td>
                  </tr>
                  <tr>
                    <td>Gas</td>
                    <td>9,500 kWh × 7.97p = £757.15</td>
                    <td>29.68p × 365 = £108.33</td>
                    <td>£865.48</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Total</strong>
                    </td>
                    <td>
                      <strong>£1,415.15</strong>
                    </td>
                    <td>
                      <strong>£308.46</strong>
                    </td>
                    <td>
                      <strong>£1,723.61</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>
              £1,723.61 against a published £1,723 — the gap is rounding, and
              the sum is otherwise exactly what was advertised. It is worth
              doing once, because it makes the structure impossible to
              misremember afterwards. The headline is four multiplications and
              an addition, and three of the five inputs describe a household
              that may be nothing like yours.
            </p>
            <p>
              The split also shows where the money goes, which surprises people
              who assume electricity dominates. Gas accounts for a little over
              half the total here despite costing under a third as much per
              unit, because the assumed household burns almost four times as
              many units of it. Rates and quantities pull in opposite
              directions, and the quantity wins.
            </p>
          </section>

          <img
            src="/blog21.2.webp"
            className="image-blog"
            alt="A radiator thermostat turned down beside a household energy statement"
          />

          <section style={{ marginBottom: "48px" }}>
            <h2>What You Pay Before You Use Anything</h2>
            <p>
              Pull the standing charges out of that table and a figure appears
              that no headline mentions: <strong>£308.46 a year</strong>, or
              84.51p a day, charged for the existence of a live connection.
              Switch every appliance off at the wall, leave the heating cold for
              twelve months and go away, and the meters keep billing at that
              rate.
            </p>
            <p>
              This is the part that catches people with an empty flat between
              tenants, a property being renovated, or a place they only occupy
              for part of the year. They reason that no usage means no bill, and
              the reasoning is sound about the usage and silent about the rest.
              Roughly £25.70 a month accrues either way.
            </p>
            <p>
              There is a second consequence. However good you are, the bill
              cannot fall below the standing charge, and everything you do is
              competing for the portion above it.
            </p>
          </section>

          <section style={{ marginBottom: "48px" }}>
            <h2>The Fixed Part Blunts Every Saving</h2>
            <p>
              Here is the consequence that matters, and the reason careful
              households sometimes feel cheated by their own effort. At typical
              consumption, £308.46 of the £1,723.61 is immovable. Only £1,415.15
              — about 82% — responds to anything you do. So a cut in consumption
              arrives at the bill diluted.
            </p>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Cut in energy used</th>
                    <th>Saved</th>
                    <th>New bill</th>
                    <th>Cut in what you pay</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>10%</td>
                    <td>£141.52</td>
                    <td>£1,582.10</td>
                    <td>8.2%</td>
                  </tr>
                  <tr>
                    <td>20%</td>
                    <td>£283.03</td>
                    <td>£1,440.58</td>
                    <td>16.4%</td>
                  </tr>
                  <tr>
                    <td>30%</td>
                    <td>£424.55</td>
                    <td>£1,299.07</td>
                    <td>24.6%</td>
                  </tr>
                  <tr>
                    <td>50%</td>
                    <td>£707.58</td>
                    <td>£1,016.04</td>
                    <td>41.1%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>
              Halving your consumption — an enormous change in how a house is
              run — takes 41% off the bill, not 50%. The pattern is simple
              enough to carry in your head: the bill falls by about four fifths
              of whatever fraction you cut, because about four fifths of it is
              the part that can move. If you want to check a different figure,
              the{" "}
              <Link href="/percentage-calculator/" className="my-link">
                percentage calculator
              </Link>{" "}
              will do it against your own numbers rather than the assumed ones.
            </p>
            <p>
              None of this is an argument for using more. It is an argument for
              expecting the right reward, because a saving that lands smaller
              than promised is how people conclude that effort does not work and
              stop making it.
            </p>
          </section>

          <section style={{ marginBottom: "48px" }}>
            <h2>Small Households Feel the Standing Charge Hardest</h2>
            <p>
              The dilution is not the same for everyone, and it falls the wrong
              way round. Because the fixed charge is the same sum for every
              connected home, it forms a larger share of a smaller bill — so the
              households already using least get least back for using less
              still.
            </p>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Household</th>
                    <th>Annual bill</th>
                    <th>Standing charge share</th>
                    <th>Effect of using 20% less</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Half typical usage</td>
                    <td>£1,016.04</td>
                    <td>30.4%</td>
                    <td>13.9% off</td>
                  </tr>
                  <tr>
                    <td>Typical usage</td>
                    <td>£1,723.61</td>
                    <td>17.9%</td>
                    <td>16.4% off</td>
                  </tr>
                  <tr>
                    <td>Half as much again</td>
                    <td>£2,431.19</td>
                    <td>12.7%</td>
                    <td>17.5% off</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>
              A frugal single occupant in a small flat hands over nearly a third
              of their bill before the first kettle, and the advice they are
              most often given — turn things off, wash cooler, heat one room —
              is acting on the two thirds that remain. The household using half
              as much again gets a better return on precisely the same
              behaviour.
            </p>
            <p>
              Knowing this beats resenting it. If you are already a light user,
              the larger lever is usually the tariff and the standing charge
              attached to it, not another notch off the thermostat.
            </p>
          </section>

          <section style={{ marginBottom: "48px" }}>
            <h2>Reading Your Own Bill Instead of the Headline</h2>
            <p>
              Every figure above describes an average household in an average
              region paying by direct debit. Your unit rate depends on where you
              live, your standing charge depends on your tariff, and both are
              printed on your own statement. Using them takes a minute and
              replaces a national illustration with your actual position.
            </p>
            <pre>
              Usage cost = kWh used × unit rate{"\n"}Fixed cost = standing
              charge × days in the period{"\n"}Bill = usage cost + fixed cost
            </pre>
            <p>
              Run it for one quarter and the useful thing is not the total,
              which you already knew, but the split. If the fixed portion is a
              modest slice, your consumption is where the money is and habits
              will move it. If the fixed portion is close to a third, you have
              learned that the tariff deserves more attention than the
              thermostat.
            </p>
            <p>
              Meter readings in different units are worth squaring up before you
              start — gas meters commonly record cubic metres or hundreds of
              cubic feet rather than kilowatt hours, and the{" "}
              <Link href="/unit-conversion-calculator/" className="my-link">
                unit conversion calculator
              </Link>{" "}
              will handle the volume side of that conversion.
            </p>
          </section>

          <section style={{ marginBottom: "48px" }}>
            <h2>The Same Shape Turns Up in Other Bills</h2>
            <p>
              A fixed charge plus a variable rate is not an energy invention. It
              is how water is billed where meters exist, how many mobile and
              broadband contracts are built, how a gym membership with per-class
              extras works, and how a car costs money whether or not it leaves
              the drive.
            </p>
            <p>
              Wherever the structure appears, the same two consequences follow.
              There is a floor you cannot economise below, and every percentage
              saving on the variable part arrives at the total shrunken by
              however much of it is fixed. Recognising the shape is most of the
              work; the arithmetic afterwards is one multiplication and one
              addition.
            </p>
            <p>
              It also explains a familiar frustration with running a car, where
              insurance, tax and depreciation continue regardless and only fuel
              responds to driving less — the reason a{" "}
              <Link href="/fuel-cost-calculator/" className="my-link">
                cost per mile
              </Link>{" "}
              worked out from fuel alone always flatters the real figure.
            </p>
          </section>

          {/* FAQ */}
          <section>
            <h2>Questions About the Price Cap</h2>

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
          ["/percentage-calculator/", "Percentage Calculator"],
          ["/unit-conversion-calculator/", "Unit Conversion Calculator"],
          ["/fuel-cost-calculator/", "Fuel Cost Calculator"],
        ]}
        relatedPosts={[
          [
            "/blog/shrinkflation-and-unit-price/",
            "Shrinkflation and the True Unit Price",
          ],
          [
            "/blog/the-smart-renters-guide-what-you-can-actually-afford/",
            "The Smart Renter's Guide: What You Can Actually Afford",
          ],
          ["/blog/what-is-vat/", "What Is VAT, and Who Actually Pays It?"],
        ]}
      />
    </div>
  );
}
