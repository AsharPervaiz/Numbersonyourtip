"use client";
import { useState } from "react";
import Link from "next/link";
import "@fortawesome/fontawesome-free/css/all.min.css";
import BlogSidebar from "./BlogSidebar";

export default function ZakatOnGold() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const toggleFAQ = (i: number) => setOpenFAQ(openFAQ === i ? null : i);

  /* ── FAQ data (also used for JSON-LD schema) ── */
  const faqs: [string, string][] = [
    [
      "Does the nisab threshold apply to the weight of my jewellery or the gold inside it?",
      "The gold inside it. The threshold is defined as a weight of pure gold, and the alloy mixed in to make jewellery workable is disregarded. Because 22K is about 91.6% gold, a 22K collection has to weigh roughly 95.5 grams before it holds the 87.48 grams of pure gold the threshold asks for. Weighing the pieces on a scale and comparing that figure directly against the threshold overstates your position, and near the boundary it can turn a no into a yes.",
    ],
    [
      "Why do some sources say 87.48 grams and others say 85 grams?",
      "Both are conversions of the same classical quantity — twenty mithqal of gold — using different modern values for the mithqal. Taking the mithqal as 4.374 grams gives 87.48; taking it as 4.25 grams gives 85. The same split runs through the silver figure, which is two hundred dirhams and comes out at either 612.36 or 595 grams. Neither figure is careless. The larger pair is the more common in contemporary published guidance, and the more cautious choice for someone close to the line is the smaller one, because it brings the threshold within reach sooner.",
    ],
    [
      "Should I use the gold threshold or the silver one?",
      "The common guidance is that if gold is essentially all you hold, the gold threshold applies; if you hold a mixture of gold, cash and other zakatable assets, the silver threshold is the one to measure against. Because silver has become far cheaper relative to gold than it was when the two were set, the silver threshold is now worth a great deal less, so it brings more people into the obligation. Many scholars favour it for that reason.",
    ],
    [
      "Do I pay zakat on jewellery I wear every day?",
      "This is the genuine disagreement, not a matter of one right answer. The Hanafi position is that gold and silver are zakatable as monetary metals whether they are worn, stored or traded. The Maliki, Shafi'i and Hanbali positions exempt jewellery kept for ordinary personal adornment, provided it is genuinely worn, in customary quantity, and not held as an investment. Follow the position of the school you follow, and where you are unsure, the widely offered advice is to take the more cautious route and pay.",
    ],
    [
      "When exactly is my zakat due?",
      "On the anniversary of the day your zakatable wealth first rose above the threshold and stayed there — measured on the lunar calendar, so it moves about eleven days earlier each solar year. It is not tied to Ramadan. Many people choose to pay during Ramadan for the extra reward, which is a fine practice, but the date the obligation attaches is your own anniversary, and paying early against a date still to come is treated as paying in advance rather than as moving the date.",
    ],
    [
      "What happens if my wealth dips below the threshold partway through the year?",
      "The schools differ. The Hanafi position looks at the start and the end of the lunar year, so a dip in between does not break the count. The Maliki, Shafi'i and Hanbali positions treat a fall below the threshold as ending that year, so the count restarts when you next rise above it. In practice this matters most for people whose savings move around the line, and it is worth knowing which rule you are working to before you set your date.",
    ],
    [
      "Can I subtract my mortgage from my zakatable wealth?",
      "Not the whole balance. The general principle among contemporary scholars is that you deduct what is actually due, not the entire long-term liability, since the lender cannot demand the full sum at will. The common allowance is the instalments falling due in the coming year, and some bodies restrict it further to the payment currently due. Deducting an entire mortgage would wipe out the zakat of almost anyone with a house, which is why that reading is not the one generally given.",
    ],
    [
      "Does the making charge I paid count towards my zakat?",
      "No. Zakat on gold is assessed on the metal, valued at what it is worth now, so the labour, the wastage and the tax on the original invoice form no part of the base. This is why the zakat figure on a heavily worked piece can look low next to what the piece cost. It is also why the receipt is the wrong document to calculate from — the weight and the purity are what matter.",
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
          src="/blog19.1.webp"
          className="image-blog"
          alt="Zakat on gold — nisab measured in pure gold weight, and how karat changes the threshold"
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
              05 Sep 2026
            </span>
          </small>
        </div>

        <article>
          <header>
            <h1>Zakat on Gold: Why Karat Decides the Answer</h1>
            <p>
              Almost every guide to zakat on gold gives the same instruction:
              weigh what you own, look up the gold rate, take two and a half per
              cent. That works if your gold is pure. Very little jewellery is.
              A 22K bangle is roughly nine parts gold and one part something
              else, and the threshold that decides whether you owe zakat at all
              is written in pure gold — so the number on the kitchen scale and
              the number the threshold is asking for are not the same number.
              This guide works through the arithmetic that sits between them,
              and the handful of decisions that change the answer before you
              multiply anything.
            </p>
          </header>

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
            <h2 style={{ color: "white" }}>Before Anything Else</h2>
            <p style={{ marginBottom: 0, color: "white" }}>
              This is a guide to the calculation, written by the person who
              builds the calculators on this site. It is not a fatwa and I am
              not a scholar. Where the schools of law differ I have said so and
              named the positions rather than picking one, because the
              difference is real and it changes the answer. For a ruling on your
              own circumstances, ask a qualified scholar or your local zakat
              body. What I can help with is the arithmetic, which is where most
              of the mistakes actually happen.
            </p>
          </section>

          <section style={{ marginBottom: "48px" }}>
            <h2>The Step That Decides Whether You Owe Anything At All</h2>
            <p>
              The threshold for gold — the nisab — is commonly given as 87.48
              grams. What is less often spelled out is that this is a weight of{" "}
              <strong>pure</strong> gold. Jewellery is alloyed, and the alloy is
              not gold, so it does not count towards the threshold. The
              scholarly treatments are consistent on this: the impurity is
              disregarded and zakat attaches to the gold content.
            </p>
            <p>
              The practical consequence is that the weight you need on the scale
              rises as the purity falls, and it rises by more than most people
              expect. Working backwards from 87.48 grams of pure gold, here is
              what each common purity has to weigh before it reaches the
              threshold.
            </p>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Purity</th>
                    <th>Gold content</th>
                    <th>Gross weight to reach nisab</th>
                    <th>In tola</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["24K", "99.9%", "87.57 g", "7.51"],
                    ["22K", "91.6%", "95.50 g", "8.19"],
                    ["21K", "87.5%", "99.98 g", "8.57"],
                    ["18K", "75.0%", "116.64 g", "10.00"],
                    ["14K", "58.5%", "149.54 g", "12.82"],
                    ["9K", "37.5%", "233.28 g", "20.00"],
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
              The familiar figure of seven and a half tola is the 24K line. At
              22K, the purity most South Asian jewellery is made in, the
              threshold is nearer eight and a fifth tola. Someone holding eight
              tola of 22K who has been told the threshold is seven and a half
              tola will conclude they owe zakat when, on the gold content, they
              do not yet.
            </p>
            <p>
              Here is that trap with numbers. Three pieces: a 45 gram 22K
              necklace, 34 grams of 22K bangles, and a 13 gram 18K ring. The
              scale reads 92 grams, comfortably past 87.48, and the obvious
              conclusion is that zakat is due on the gold. But the gold content
              is 41.22 plus 31.14 plus 9.75, which is 82.11 grams — below the
              threshold. Change one bangle and the answer flips, which is
              exactly why the step is worth doing properly rather than
              approximating.
            </p>
            <p>
              None of this means the holder owes nothing. Gold is almost never
              assessed alone, and once cash and other assets join the sum the
              picture usually changes — which is the subject of two sections
              further down. The point here is narrower: the gold figure that
              enters that sum is the pure content, not the scale reading. Our{" "}
              <Link href="/gold-calculator/" className="my-link">
                gold calculator
              </Link>{" "}
              does this conversion for you and reports the pure weight
              alongside the value, in grams or tola.
            </p>
          </section>

          <section style={{ marginBottom: "48px" }}>
            <h2>Two Nisab Figures Are in Circulation, and Both Have a Basis</h2>
            <p>
              Search for the gold threshold and you will find 87.48 grams in
              some places and 85 grams in others, usually with no explanation of
              why they differ. It is not an error in either. Both are modern
              conversions of the same classical quantity, and the gap comes from
              the conversion rather than from the ruling.
            </p>
            <p>
              The classical threshold for gold is twenty mithqal, and for silver
              two hundred dirhams. The mithqal is a historical unit of mass, and
              scholars have put its modern equivalent at slightly different
              figures. Take the mithqal as 4.374 grams and twenty of them come
              to 87.48. Take it as 4.25 grams and you get 85. The same choice
              produces the two silver figures, since the dirham is conventionally
              seven tenths of a mithqal: 3.0618 grams gives 612.36 for two
              hundred, and 2.975 gives 595.
            </p>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Conversion used</th>
                    <th>Mithqal</th>
                    <th>Gold nisab (20 mithqal)</th>
                    <th>Silver nisab (200 dirhams)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Larger</td>
                    <td>4.374 g</td>
                    <td>87.48 g</td>
                    <td>612.36 g</td>
                  </tr>
                  <tr>
                    <td>Smaller</td>
                    <td>4.25 g</td>
                    <td>85 g</td>
                    <td>595 g</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>
              Both rows are internally consistent, which is a useful check that
              neither is a rounding accident: in each case the silver figure is
              exactly seven times the gold figure, because two hundred dirhams
              at seven tenths of a mithqal each is exactly a hundred and forty
              mithqal, or seven times twenty. The two traditions disagree about
              the size of the unit, not about the relationship between the
              metals.
            </p>
            <p>
              For most people the difference is immaterial — a little under three
              per cent. It only bites if you are sitting between the two, and
              there the cautious choice is the smaller figure, since it makes
              the obligation attach sooner.
            </p>
          </section>

          <section style={{ marginBottom: "48px" }}>
            <h2>Why the Gold and Silver Thresholds Drifted So Far Apart</h2>
            <p>
              The two thresholds were meant to be alternatives, and the standard
              guidance is that gold-only holdings are measured against the gold
              threshold while mixed holdings of gold, cash and other assets are
              measured against silver. What often goes unsaid is why that choice
              matters so much today, and the reason is a piece of monetary
              history rather than a point of law.
            </p>
            <p>
              As we just saw, the silver threshold weighs exactly seven times the
              gold one. At the time the thresholds were set, silver was worth
              roughly a seventh of gold by weight, so seven times the weight of
              the cheaper metal came to about the same value. The two were, in
              practice, the same threshold expressed twice.
            </p>
            <p>
              That relationship has not held. Gold has appreciated against silver
              over the centuries, and the market ratio in recent years has sat
              nearer seventy to one than seven to one. The thresholds did not
              move, but the metals underneath them did — so the silver threshold
              is now worth a small fraction of the gold one, and choosing between
              them is no longer a formality. It is the difference between owing
              zakat on modest savings and not reaching the threshold at all.
            </p>
            <p>
              This is the strongest practical argument for the silver threshold,
              and the reason many scholars and zakat bodies favour it: it keeps
              the obligation roughly where it was originally pitched, and it
              directs more towards those entitled to receive. Note that the ratio
              moves with the market, so the gap between the two thresholds is not
              a fixed quantity — it is worth checking the current metal prices
              rather than carrying a remembered figure from a previous year.
            </p>
          </section>

          {/* Sits on the hinge of the article: everything above is
              measurement, everything below is a question of law. */}
          <img
            src="/blog19.2.webp"
            className="image-blog"
            alt="Gold bangles and a chain on a jeweller's scale, the weight that a zakat calculation starts from"
          />

          <section style={{ marginBottom: "48px" }}>
            <h2>Jewellery You Actually Wear Is Where the Schools Diverge</h2>
            <p>
              Everything above concerns measurement. This section concerns a
              question of law on which the schools genuinely differ, and it is
              the one most likely to change what you pay.
            </p>
            <p>
              The <strong>Hanafi</strong> position treats gold and silver as
              monetary metals in themselves. Zakat is due on them whether they
              sit in a vault, are traded, or are worn daily as jewellery. The
              use to which they are put does not change their nature.
            </p>
            <p>
              The <strong>Maliki, Shafi&rsquo;i and Hanbali</strong> positions
              exempt jewellery kept for ordinary personal adornment. The
              exemption is not unlimited: the pieces have to be genuinely worn
              rather than stored, held in a customary quantity rather than
              accumulated, and not held with an eye to investment. Jewellery
              bought as a store of value and kept in a safe is treated as stored
              wealth by these schools too, and is zakatable.
            </p>
            <p>
              The practical upshot is that two households with identical
              jewellery can owe different amounts and both be correct, because
              they follow different schools. Follow the position of the school
              you follow. Where your case is ambiguous — jewellery that is partly
              worn and partly kept, or bought with mixed intentions — the advice
              offered across all of them is to lean towards paying, since the
              cost of paying zakat that was not strictly owed is treated very
              differently from the cost of withholding zakat that was.
            </p>
          </section>

          <section style={{ marginBottom: "48px" }}>
            <h2>Your Zakat Year Starts When You Crossed, Not When Ramadan Does</h2>
            <p>
              Zakat is not an annual tax collected on a fixed national date. It
              attaches to wealth that has been held above the threshold for a
              full lunar year, and the year runs from the day your zakatable
              wealth first rose above the threshold and stayed there. That date
              becomes your anniversary, and it recurs on the lunar calendar,
              which means it arrives about eleven days earlier each solar year.
            </p>
            <p>
              A great many people pay during Ramadan, and there is nothing wrong
              with that — the reward is greater and the habit is easier to keep.
              But it is worth being clear that this is a choice about timing, not
              the source of the obligation. If your anniversary falls in, say,
              Shawwal and you pay in the preceding Ramadan, you have paid in
              advance, which is permitted. You have not moved your anniversary.
            </p>
            <p>
              There is a second question here on which the schools differ again:
              what happens if your wealth dips below the threshold partway
              through the year. The Hanafi position looks only at the two ends of
              the lunar year, so a dip in the middle does not interrupt the
              count. The other three schools treat falling below the threshold as
              ending that year, so the clock restarts when you next rise above
              it. If your savings move around the line — as they do for most
              people who are near it — this is worth settling before you fix your
              date, because the two rules can produce different years. Counting
              the days between two dates on the lunar calendar is fiddly; a{" "}
              <Link href="/days-between-calculator/" className="my-link">
                days between dates calculator
              </Link>{" "}
              is a blunt but useful check that a full lunar year of roughly 354
              days has actually elapsed.
            </p>
          </section>

          <section style={{ marginBottom: "48px" }}>
            <h2>Debts Reduce the Base, but a Whole Mortgage Does Not</h2>
            <p>
              Zakat is assessed on net zakatable wealth, so liabilities come off.
              The common error is to subtract the entire outstanding balance of
              a long-term debt, which for anyone with a mortgage or a student
              loan wipes out the base completely and produces a zakat bill of
              nothing for the rest of their life. That is not the reading
              contemporary scholarship gives.
            </p>
            <p>
              The distinction generally drawn is between what is actually due and
              what is merely owed. A bill that has landed, an overdraft, a credit
              card balance, rent or wages you are behind on — these are due, and
              they come off. A mortgage cannot be called in by the lender at will;
              only the instalments come due, and only as they arrive. The common
              allowance is therefore the instalments falling due in the coming
              twelve months, and some bodies are stricter still, permitting only
              the payment currently due. There is also a caution attached: the
              allowance is intended for people whose ability to keep up the
              repayments would genuinely be affected, not as a default deduction
              for everyone.
            </p>
            <p>
              Money owed <em>to</em> you runs the other way and is easy to
              forget. A loan you made to a relative that you expect to be repaid
              is generally treated as part of your wealth, even though it is not
              in your hands.
            </p>
          </section>

          <section style={{ marginBottom: "48px" }}>
            <h2>What Sits Alongside the Gold in the Same Sum</h2>
            <p>
              Gold is one line in a larger calculation, and the threshold is
              tested against the whole of it rather than against any single
              holding. In broad terms the zakatable side includes cash wherever
              it sits, gold and silver, stock held for sale in a business, money
              owed to you that you expect back, and investments held in those
              things.
            </p>
            <p>
              Two categories are worth flagging because they trip people up.{" "}
              <strong>Shares</strong> are treated according to intention: bought
              to trade, the whole market value is in the base; bought to hold for
              dividends, the common approach is to include only the share of the
              company&rsquo;s own zakatable assets that your holding represents.{" "}
              <strong>Pensions</strong> turn on the type and on access: defined
              contribution pots are generally treated differently from defined
              benefit schemes, and where contributions are deducted at source and
              never come into your possession, a widely held view is that nothing
              is due until the money is actually received. Both of these deserve
              a proper answer from someone qualified if the sums are meaningful.
            </p>
            <p>
              What does not enter the base is the ordinary furniture of a life:
              your home, your car, your clothes, the tools of your trade. Zakat
              is a charge on accumulated wealth, not on possessions, which is why
              a zakat base is a narrower thing than a{" "}
              <Link href="/net-worth-calculator/" className="my-link">
                net worth calculation
              </Link>{" "}
              and cannot be lifted from one.
            </p>
          </section>

          <section style={{ marginBottom: "48px" }}>
            <h2>Working It Through End to End</h2>
            <p>
              Suppose a household holds an 80 gram 22K set, a 22 gram 22K chain
              and a 13 gram 18K ring, and follows a school on which worn
              jewellery is zakatable. The scale reads 115 grams. The gold content
              is 73.28 plus 20.15 plus 9.75, which is 103.18 grams of pure gold —
              past the 87.48 gram threshold on the gold measure, and past it on
              the smaller 85 gram figure too, so that particular disagreement
              does not need resolving here.
            </p>
            <p>
              Zakat is then two and a half per cent of the market value of 103.18
              grams of pure gold. Expressed in metal rather than money, that is
              2.58 grams of pure gold — a useful way to hold the figure, because
              it does not go out of date when the rate moves. Convert it at
              whatever your local rate is on your anniversary, not at what the
              pieces cost when they were bought, and not at the international
              spot price if your market quotes its own.
            </p>
            <p>
              Two things this example deliberately leaves out. The making charges
              and tax on the original invoice play no part — zakat is on the
              metal at today&rsquo;s value, which is why a heavily worked piece
              carries a smaller zakat figure than its purchase price suggests.
              And the gold does not stand alone: cash, savings and receivables
              join the same sum, deductible liabilities come off, and the
              threshold is applied to the total.
            </p>
            <p>
              The order that avoids most errors is: convert each piece to its
              pure gold weight, add the gold to your other zakatable assets at
              current value, subtract what is genuinely due, check the total
              against the threshold you are using, confirm a lunar year has
              passed, and only then take the two and a half per cent.
            </p>
          </section>

          {/* FAQ */}
          <section>
            <h2>Questions About Zakat on Gold</h2>

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
          ["/gold-calculator/", "Gold Calculator"],
          ["/net-worth-calculator/", "Net Worth Calculator"],
          ["/currency-converter/", "Currency Converter"],
        ]}
        relatedPosts={[
          [
            "/blog/how-do-i-calculate-my-net-worth/",
            "How to Calculate Your Net Worth",
          ],
          ["/blog/what-is-vat/", "What Is VAT, and Who Actually Pays It?"],
          [
            "/blog/best-free-financial-calculators-for-everyday-money-questions/",
            "Best Free Financial Calculators for Everyday Money Questions",
          ],
        ]}
      />
    </div>
  );
}
