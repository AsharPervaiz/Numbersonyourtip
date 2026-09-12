"use client";
import { useState } from "react";
import Link from "next/link";
import "@fortawesome/fontawesome-free/css/all.min.css";
import BlogSidebar from "./BlogSidebar";

export default function Shrinkflation() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const toggleFAQ = (i: number) => setOpenFAQ(openFAQ === i ? null : i);

  /* ── FAQ data (also used for JSON-LD schema) ── */
  const faqs: [string, string][] = [
    [
      "If a pack loses a tenth of its contents, has the price gone up a tenth?",
      "No, slightly more — about an eleventh, or 11.11%. The two percentages are measured against different quantities. The tenth that vanished is measured against the old pack, but the price rise is measured against the new one, and the new one is smaller. The gap widens as the shrink grows: a fifth off the pack is a quarter on the unit price, and a third off the pack is a full half on the unit price.",
    ],
    [
      "How much would the price have to fall to cancel out a shrink?",
      "By exactly the fraction the pack lost. If the contents dropped by a tenth, the price has to drop by a tenth to leave the unit price where it started. That sounds obvious until you notice it means a 10% discount on a pack that quietly lost 15% of its contents still leaves you paying more per gram than before, which is the arithmetic behind a good many promotions.",
    ],
    [
      "What unit should I compare in?",
      "Whatever unit lets you compare the things in front of you, applied consistently. Per 100 grams and per 100 millilitres suit most groceries because they keep the numbers readable. The unit matters less than using the same one for every option, and than choosing one that measures what you actually consume — sheets rather than rolls, washes rather than tablets, made-up servings rather than bottles of concentrate.",
    ],
    [
      "Is the shop obliged to show me a unit price?",
      "It depends where you shop. In the United Kingdom the Price Marking Order requires a unit price alongside the selling price for most pre-packaged goods, and comparable requirements apply across the European Union. The United States has no federal rule; unit pricing is a matter for individual states, several of which have required it for decades while others have not. So in some places the comparison is done for you, and in others you are on your own.",
    ],
    [
      "Why is the bigger pack sometimes worse value?",
      "Because the price of a pack is not simply the price of its contents. Packaging, shelf position, promotion and what the shop believes you will tolerate all feed into it, and none of them scale neatly with size. Large packs are often cheaper per unit and are marketed as though they always are, which is precisely why the exception is worth checking rather than assuming.",
    ],
    [
      "How do I tell shrinkflation from an ordinary price rise?",
      "By the fact that nothing on the shelf tells you. An ordinary price rise is visible the moment you look at the tag, and most people notice. A shrink leaves the tag alone and moves a number printed on the pack instead, usually in small type, and often alongside a redesign that makes the previous pack hard to recall. The only reliable way to catch it is to have written down what the pack used to hold.",
    ],
    [
      "Does buying the same item every week make this easier to spot?",
      "It makes it easier and harder at once. You are more likely to sense that something has changed, but you are also less likely to read a label you have read a hundred times. Habit is what the practice relies on. Recording the size and price of the ten or so things you buy most often takes a few minutes and turns a vague suspicion into a figure you can check.",
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
          src="/blog20.1.webp"
          className="image-blog"
          alt="Letter tiles spelling the word inflation above a red arrow climbing steeply away from a wallet"
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
              12 Sep 2026
            </span>
          </small>
        </div>

        <article>
          <header>
            <h1>Shrinkflation and the True Unit Price</h1>
            <p>
              A price rise announces itself. The number on the shelf edge is
              larger than it was, you notice, and you decide whether to put the
              thing in the basket anyway. A shrink announces nothing. The shelf
              price holds still, the pack looks much as it did, and the only
              evidence is a figure printed on the back in type small enough to
              be ignorable. You are paying more per gram, and every signal the
              shop is obliged to give you says you are not. This is the
              arithmetic that makes the change visible again, and it is
              simpler than the effort put into hiding it.
            </p>
          </header>

          <section style={{ marginBottom: "48px" }}>
            <h2>The Price Tag Is the One Number That Did Not Change</h2>
            <p>
              Everything you use to judge value at a shelf edge refers to the
              pack: this costs that much. The moment the pack stops being a
              fixed quantity, the comparison quietly stops working, because you
              are comparing prices of two different things while believing you
              are comparing prices of one.
            </p>
            <p>
              That is the whole mechanism. Not deception in any legal sense —
              the new weight is printed on the packaging, accurately — but a
              change placed where habit will not look, on the one number
              shoppers were never trained to read. A price rise has to survive
              your judgement. A shrink never faces it.
            </p>
            <p>
              The defence is a single division: price divided by quantity. What
              follows is what that division does that people do not expect.
            </p>
          </section>

          <section style={{ marginBottom: "48px" }}>
            <h2>A Tenth Smaller Is an Eleventh Dearer</h2>
            <p>
              Take a pack that loses a tenth of its contents while the price
              stays put. Almost everyone reads that as a ten per cent increase.
              It is not: it is 11.11%.
            </p>
            <p>
              The two percentages are measured against different quantities.
              The tenth that disappeared is a tenth of the <em>old</em> pack.
              The rise in unit price is measured against what you can buy now,
              and what you can buy now is the smaller pack. Divide by something
              smaller and the result grows faster than the shrink suggests.
            </p>
            <p>
              The gap widens as the shrink grows, which is the part worth
              carrying around:
            </p>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Pack loses</th>
                    <th>You now get</th>
                    <th>Unit price rises by</th>
                    <th>Price cut that would undo it</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["5%", "95% of before", "5.26%", "5%"],
                    ["8%", "92%", "8.70%", "8%"],
                    ["10%", "90%", "11.11%", "10%"],
                    ["12.5%", "87.5%", "14.29%", "12.5%"],
                    ["15%", "85%", "17.65%", "15%"],
                    ["20%", "80%", "25.00%", "20%"],
                    ["25%", "75%", "33.33%", "25%"],
                    ["one third", "two thirds", "50.00%", "one third"],
                  ].map((row) => (
                    <tr key={row[0]}>
                      {row.map((c, i) => (
                        <td key={i}>{c}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p>
              A third off the pack is a half onto the unit price. That is the
              figure that surprises people, and it is the one that turns up when
              a redesign is dramatic enough that nobody expects the old size to
              be a fair comparison anyway.
            </p>
            <p>
              The last column is the one to keep. To leave you exactly where you
              started, the price has to fall by the same fraction the pack lost —
              not by the larger figure the unit price rose. The two are
              different numbers and only one of them is the discount you would
              need.
            </p>
          </section>

          <section style={{ marginBottom: "48px" }}>
            <h2>When the Pack Shrinks and the Price Rises Together</h2>
            <p>
              The two happen at once more often than either happens alone,
              usually a season apart so that neither is memorable. They compound
              rather than add, and the combination runs ahead of what either
              number would lead you to expect.
            </p>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Pack loses</th>
                    <th>Price rises</th>
                    <th>What you actually pay per unit</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["10%", "5%", "16.67% more"],
                    ["10%", "10%", "22.22% more"],
                    ["15%", "10%", "29.41% more"],
                    ["5%", "15%", "21.05% more"],
                    ["20%", "20%", "50.00% more"],
                  ].map((row) => (
                    <tr key={row[0] + row[1]}>
                      {row.map((c, i) => (
                        <td key={i}>{c}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p>
              A fifth off the pack alongside a fifth onto the price is not a
              forty per cent rise. It is fifty. Neither half of it would have
              been remarkable on its own, and spread across two visits, neither
              half is even noticed.
            </p>
          </section>

          <section style={{ marginBottom: "48px" }}>
            <h2>A Discount Can Be Smaller Than the Shrink It Follows</h2>
            <p>
              This is the part that turns arithmetic into something you can act
              on. A promotion on a pack that has already shrunk does not start
              from where you remember. It starts from the higher unit price the
              shrink created, and it has to climb back down before it saves you
              anything at all.
            </p>
            <p>
              The break-even is clean: the discount has to match the fraction
              the pack lost. Anything less and you are still paying more per
              gram than you were before either change happened.
            </p>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Pack lost</th>
                    <th>Headline discount</th>
                    <th>Unit price against where you started</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["10%", "5% off", "still 5.56% more", true],
                    ["10%", "10% off", "exactly level", false],
                    ["10%", "20% off", "11.11% less — a real saving", false],
                    ["15%", "10% off", "still 5.88% more", true],
                    ["20%", "10% off", "still 12.50% more", true],
                    ["20%", "20% off", "exactly level", false],
                  ].map((row, i) => (
                    <tr key={i}>
                      <td>{row[0] as string}</td>
                      <td>{row[1] as string}</td>
                      <td>{row[2] as string}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p>
              Twenty per cent off a pack that lost a fifth of its contents
              returns you precisely to the price you were paying a year ago,
              and is advertised as a saving. Nothing about that is untrue. It
              is simply measured from a starting point that was moved while
              nobody was looking. If you want to run the numbers on a specific
              promotion, the{" "}
              <Link href="/discount-calculator/" className="my-link">
                discount calculator
              </Link>{" "}
              handles the price side and the{" "}
              <Link href="/percentage-calculator/" className="my-link">
                percentage calculator
              </Link>{" "}
              will work back to the original figure when you only have the
              reduced one.
            </p>
          </section>

          <section style={{ marginBottom: "48px" }}>
            <h2>Ounces, Grams and the Comparison That Does Not Line Up</h2>
            <p>
              Dividing price by quantity only works when the quantities are in
              the same unit, and shelves rarely oblige. One product is in
              ounces, its neighbour in grams, the value pack in pounds. Compare
              the numbers as printed and you are not comparing anything.
            </p>
            <p>
              Three packs of the same thing, priced as they might appear
              together:
            </p>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Pack</th>
                    <th>As labelled</th>
                    <th>Price</th>
                    <th>In grams</th>
                    <th>Per 100 g</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["A", "14.4 oz", "6.69", "408.2", "1.639"],
                    ["B", "400 g", "6.29", "400.0", "1.573"],
                    ["C", "1 lb", "7.49", "453.6", "1.651"],
                  ].map((row) => (
                    <tr key={row[0]}>
                      {row.map((c, i) => (
                        <td key={i}>{c}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p>
              The largest pack is the worst value and the smallest is the best,
              which no glance at the shelf would suggest. The spread between
              best and worst is about five per cent — not dramatic, but reliably
              in the shop&rsquo;s favour, and repeated across a basket every
              week it is not nothing.
            </p>
            <p>
              Note also how close A and C look once converted: 408 grams against
              454. Presented as &ldquo;14.4 oz&rdquo; and &ldquo;1 lb&rdquo;
              they sound like different orders of thing. Converting first is not
              pedantry; it is the only way the comparison exists. The{" "}
              <Link href="/unit-conversion-calculator/" className="my-link">
                unit conversion calculator
              </Link>{" "}
              will move between ounces, grams and pounds, and the{" "}
              <Link href="/percentage-calculator/" className="my-link">
                percentage calculator
              </Link>{" "}
              will turn the resulting gap into a figure you can judge.
            </p>
          </section>

          {/* Sits where the article turns from arithmetic you can do on a
              shelf to the tricks that stop the arithmetic working at all. */}
          <img
            src="/blog20.2.webp"
            className="image-blog"
            alt="Loose coins and small change scattered on a dark slate surface, the difference a shrinking pack takes a little at a time"
          />

          <section style={{ marginBottom: "48px" }}>
            <h2>Counting Rolls Instead of Sheets</h2>
            <p>
              Some products are sold in units that are not quantities at all. A
              roll is not an amount of paper. A tablet is not an amount of
              detergent. A pod is not an amount of coffee. Each is a container
              whose contents the seller is free to change, which makes it the
              perfect place to put a shrink.
            </p>
            <p>
              This is why pack fronts drift towards the language of size —
              large, mega, giant, family — rather than the number of sheets, and
              why the comparison a shopper naturally makes, counting the
              containers, is the one comparison that carries no information. Two
              packs of the same roll count can differ substantially in paper.
            </p>
            <p>
              The rule that survives all of it: divide by the thing you actually
              consume. Sheets or length, not rolls. Washes, not tablets. Grams
              of coffee, not pods. Made-up servings, not bottles of concentrate,
              which is a category where the dilution ratio can change without a
              single visible number moving. Where a pack will not tell you the
              underlying quantity, that reticence is itself the finding.
            </p>
          </section>

          <section style={{ marginBottom: "48px" }}>
            <h2>What the Shelf Label Owes You, and Where It Owes You Nothing</h2>
            <p>
              Some of this work has already been done for you, depending on
              where you shop. In the United Kingdom, the Price Marking Order
              requires most pre-packaged goods to carry a unit price alongside
              the selling price — per kilogram or per 100 grams for food, per
              litre or per 100 millilitres for drinks, per item where items are
              genuinely discrete. Comparable requirements run across the
              European Union.
            </p>
            <p>
              The United States has no federal equivalent. Unit pricing is left
              to individual states, and while several have required it for
              decades, others have never done so. Two shops a state line apart
              can therefore offer completely different amounts of help with the
              same decision.
            </p>
            <p>
              Where the unit price is displayed, read it rather than the price —
              it is the number that keeps working when the pack changes. Where
              it is displayed, treat it as a starting point rather than a
              verdict: it is usually rounded, it will not tell you the pack was
              larger last year, and it cannot know that the pods got smaller.
              Where it is absent, the division is yours to do.
            </p>
          </section>

          <section style={{ marginBottom: "48px" }}>
            <h2>Keeping a Record That Makes the Change Visible</h2>
            <p>
              Every method above compares things standing next to each other.
              Shrinkflation is a comparison across time, and time is the one
              axis a shelf cannot show you. Memory is not equal to it either:
              people remember prices approximately and pack sizes not at all,
              which is precisely the asymmetry the practice depends on.
            </p>
            <p>
              The fix is unglamorous. Take the ten or fifteen things you buy
              most often and write down, once, the price, the quantity and the
              resulting unit price. It takes a few minutes with the receipt and
              the packs already in the cupboard. Revisit it a couple of times a
              year.
            </p>
            <p>
              What that record buys you is not outrage but accuracy. Most items
              will not have moved. One or two will have moved a great deal, and
              those are the ones worth switching, buying differently, or simply
              knowing about. Without the record you have a suspicion that
              everything costs more, which is true but useless. With it you have
              a short list, which is the thing you can act on.
            </p>
          </section>

          {/* FAQ */}
          <section>
            <h2>Questions About Unit Price and Shrinking Packs</h2>

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
          ["/discount-calculator/", "Discount Calculator"],
          ["/percentage-calculator/", "Percentage Calculator"],
          ["/unit-conversion-calculator/", "Unit Conversion Calculator"],
        ]}
        relatedPosts={[
          ["/blog/what-is-vat/", "What Is VAT, and Who Actually Pays It?"],
          [
            "/blog/how-do-i-calculate-my-net-worth/",
            "How to Calculate Your Net Worth",
          ],
          [
            "/blog/best-free-financial-calculators-for-everyday-money-questions/",
            "Best Free Financial Calculators for Everyday Money Questions",
          ],
        ]}
      />
    </div>
  );
}
