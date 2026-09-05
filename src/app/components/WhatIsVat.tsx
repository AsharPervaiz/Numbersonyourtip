"use client";
import { useState } from "react";
import Link from "next/link";
import "@fortawesome/fontawesome-free/css/all.min.css";
import BlogSidebar from "./BlogSidebar";

const FAQ_DATA: [string, string][] = [
  [
    "If businesses reclaim VAT, who actually pays it?",
    "The final consumer, in full. Every business in the chain hands over the VAT it charged and takes back the VAT it was charged, so it only ever parts with the tax on the value it added. Add those instalments together and they come to exactly the VAT paid at the till — the tax is collected in pieces but borne by one person.",
  ],
  [
    "What is the difference between zero-rated and exempt?",
    "Zero-rated supplies are taxable at a rate of 0%, so the business is still making taxable supplies and can reclaim its input VAT in full — usually leaving it in a permanent refund position. Exempt supplies are outside the system, so no VAT is charged and none can be reclaimed. On an invoice both show nothing; on a return they are opposites.",
  ],
  [
    "When do I have to register for VAT?",
    "When taxable turnover passes the threshold, currently £90,000 in the UK. The test runs over any rolling twelve-month period rather than a tax year, which is the detail most often missed — a strong few months can push you over in the middle of an otherwise quiet year. There is also a forward-looking test if you expect to cross it within the next 30 days alone.",
  ],
  [
    "Is it worth registering voluntarily below the threshold?",
    "It depends entirely on who buys from you. Selling to VAT-registered businesses, they reclaim whatever you charge, so registering costs your customers nothing and lets you reclaim your own input VAT. Selling to consumers, registration makes you either 20% more expensive or 20% less profitable. For a zero-rated business it is almost always worth it.",
  ],
  [
    "Can I reclaim VAT without a proper invoice?",
    "Generally no. A valid VAT invoice showing the supplier's VAT number and the tax as a separate amount is what supports the claim, and a card receipt or bank statement is not a substitute. This is why registered businesses chase invoices that a non-registered business would not bother with — the paperwork is the entitlement.",
  ],
  [
    "Why can't I reclaim the VAT on a company car?",
    "Because the rules assume some private use unless you can show there is genuinely none, which is a demanding test in practice. Vans and commercial vehicles are treated more generously, and leasing is treated differently again, with a partial recovery commonly available. The blocking rule on business entertainment works on similar logic.",
  ],
  [
    "How do I get the VAT out of a price that already includes it?",
    "Divide by 1 plus the rate, not by subtracting the rate. At 20%, a gross figure of £120 divides by 1.2 to give £100 net, and the VAT element is £20. A useful shortcut is that at 20% the VAT is one sixth of the gross — subtracting 20% from £120 gives £96, which is wrong by £4.",
  ],
  [
    "Is a flat-rate scheme actually cheaper?",
    "It is simpler, which is not the same thing. You pay a fixed percentage of gross turnover and generally stop reclaiming input VAT on ordinary purchases, so it favours businesses with low costs and penalises those with significant expenditure. Work out both figures against a real quarter before choosing rather than assuming the simpler option costs less.",
  ],
  [
    "Do I charge VAT to customers in another country?",
    "Usually not at your own rate, but the rules depend on what you sell and to whom. Digital services to consumers are generally taxed where the customer belongs, which can mean accounting for several countries' VAT. Business-to-business sales often shift the obligation to the customer under a reverse charge. Both are areas where getting advice is cheaper than getting it wrong.",
  ],
];

export default function WhatIsVat() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

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
      {/* MAIN CONTENT (70%) */}
      <div className="blog-content">
        <img src="/blog1.3.webp" className="image-blog" alt="blog" />
        <div className="content-blog">
          <small
            className="meta-blog"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "40px ", // gap between date and author sections
            }}
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontWeight: "600",
                color: "#888",
                fontSize: "14px",
              }}
            >
              <Link href="/author/ashar-pervaiz/" className="byline-author">
              <img className="founder-photo" src="/founder_photo.webp" alt="" />
              Ashar Pervaiz
              </Link>
            </span>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontWeight: "600",
                color: "#888",
                fontSize: "14px",
              }}
            >
              <i className="custom-meta-icon fa-solid fa-calendar"></i>25 March
              2026
            </span>
          </small>
        </div>
        <main>
          <h1>What Is VAT? The Chain, the Reclaim and the Threshold</h1>

          <p>
            VAT is charged at every stage of production, collected by every
            business in the chain, and paid in full by exactly one person: the
            final consumer. Everyone in between hands over the tax they charged
            and takes back the tax they were charged, so the amount they part
            with is the tax on the value they added — which is where the name
            comes from.
          </p>

          <p>
            That mechanism explains almost everything else about VAT: why
            businesses can reclaim it, why registration thresholds exist, why a
            zero-rated business would voluntarily register, and why VAT and
            sales tax behave differently despite looking identical on a
            receipt. This page is about the mechanism. If you want the
            arithmetic — adding VAT, stripping it out, working backwards from a
            gross figure — the{" "}
            <Link href="/vat-calculator/" className="my-link">
              VAT calculator
            </Link>{" "}
            covers it in detail.
          </p>

          <h2>Only the Last Person in the Chain Actually Pays It</h2>

          <p>
            Follow a table from forest to living room, at a 20% rate. Each
            business charges VAT on what it sells and reclaims the VAT on what
            it bought.
          </p>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Stage</th>
                  <th>Sells for (net)</th>
                  <th>VAT charged</th>
                  <th>VAT reclaimed</th>
                  <th>Paid to the tax authority</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Forester sells timber</td>
                  <td>£100</td>
                  <td>£20</td>
                  <td>—</td>
                  <td>£20</td>
                </tr>
                <tr>
                  <td>Sawmill sells planks</td>
                  <td>£300</td>
                  <td>£60</td>
                  <td>£20</td>
                  <td>£40</td>
                </tr>
                <tr>
                  <td>Maker sells a table</td>
                  <td>£700</td>
                  <td>£140</td>
                  <td>£60</td>
                  <td>£80</td>
                </tr>
                <tr>
                  <td>Retailer sells to you</td>
                  <td>£1,000</td>
                  <td>£200</td>
                  <td>£140</td>
                  <td>£60</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            The government collects £20 + £40 + £80 + £60 ={" "}
            <strong>£200</strong>, which is exactly the VAT the consumer paid at
            the till. Nothing was taxed twice, and no business is out of pocket.
            Each one remitted 20% of the value it added: £100, £200, £400 and
            £300 of added value, taxed at £20, £40, £80 and £60.
          </p>

          <p>
            This is the property that makes VAT collectable at scale. The tax
            arrives in instalments from every business in the chain rather than
            depending entirely on the last shop getting it right, and each
            business has a documentary reason to want a proper invoice from its
            supplier.
          </p>

          <h2>Input VAT, Output VAT, and What You Reclaim</h2>

          <p>
            Two terms cover the whole of a VAT return, and mixing them up is the
            most common bookkeeping error a newly registered business makes.
          </p>

          <ul className="custom-list">
            <li>
              <strong>Output VAT</strong> is the VAT you charged your customers.
              It was never your money.
            </li>
            <li>
              <strong>Input VAT</strong> is the VAT your suppliers charged you.
              You get it back.
            </li>
          </ul>

          <p>
            Your return is the difference. Charge £9,000 of output VAT in a
            quarter and incur £3,500 of input VAT, and you pay £5,500. If the
            figures run the other way — a quarter of heavy equipment purchases
            against modest sales — the balance is a refund rather than a bill.
            That is what people mean by reclaiming VAT: it is not a rebate
            scheme, just the ordinary result of the subtraction coming out
            negative.
          </p>

          <p>
            The practical consequence is that output VAT sitting in your bank
            account is not revenue. Businesses that spend it and then meet a
            quarterly bill they had not budgeted for are the single most common
            VAT casualty. Moving the VAT element into a separate account as it
            comes in removes the problem entirely.
          </p>

          <h2>What You Cannot Reclaim</h2>

          <p>
            The right to reclaim input VAT is narrower than it first appears,
            and the exclusions are where honest mistakes happen.
          </p>

          <ul className="custom-list">
            <li>
              <strong>Anything without a valid VAT invoice.</strong> A card
              receipt is not enough. The invoice needs the supplier&apos;s VAT
              number and the VAT shown separately, and without it the claim
              fails no matter how genuine the expense.
            </li>
            <li>
              <strong>Business entertainment.</strong> Entertaining clients is
              generally blocked, while ordinary staff subsistence is generally
              not — a distinction that catches people out constantly.
            </li>
            <li>
              <strong>Cars.</strong> VAT on a car is usually irrecoverable
              unless it is used exclusively for business, which in practice
              means no private use at all. Vans and commercial vehicles are
              treated differently.
            </li>
            <li>
              <strong>The private portion of anything.</strong> A phone used 70%
              for work supports a claim on 70% of the VAT, not all of it, and
              the apportionment needs to be defensible.
            </li>
            <li>
              <strong>Goods bought under a margin scheme.</strong> Second-hand
              items sold under those rules carry no reclaimable VAT, because the
              seller only accounted for VAT on their margin.
            </li>
          </ul>

          <h2>Registration, and Why Some Businesses Volunteer</h2>

          <p>
            Registration is compulsory above a turnover threshold — currently
            £90,000 in the UK, measured on a rolling twelve months rather than a
            tax year, which is the part people miss. It is not a calendar-year
            test, so a strong autumn can trigger registration in the middle of
            a quiet year.
          </p>

          <p>
            Below the threshold, registration is optional, and whether it helps
            depends entirely on who your customers are. If you sell to VAT
            registered businesses, they reclaim whatever you charge, so your
            prices are effectively unchanged to them while you gain the ability
            to reclaim your own input VAT. If you sell to consumers, registering
            makes you 20% more expensive or 20% less profitable, and there is no
            third option.
          </p>

          <p>
            The clearest case for volunteering is a business making zero-rated
            supplies — most food, children&apos;s clothing, books, some
            exports. Zero-rated is not the same as exempt: a zero-rated business
            charges VAT at 0% but is still making taxable supplies, so it can
            reclaim input VAT in full and will be in a permanent refund
            position. An exempt business charges no VAT and cannot reclaim
            anything, which is a considerably worse place to be.
          </p>

          <h2>VAT and Sales Tax Are Not the Same Mechanism</h2>

          <p>
            Both add a percentage at the point of purchase, and there the
            similarity ends.
          </p>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th>VAT</th>
                  <th>US-style sales tax</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Collected</td>
                  <td>At every stage</td>
                  <td>Only at final sale</td>
                </tr>
                <tr>
                  <td>Business purchases</td>
                  <td>Reclaimed through the return</td>
                  <td>Exempt at purchase, via a resale certificate</td>
                </tr>
                <tr>
                  <td>Shown on the shelf price</td>
                  <td>Usually included</td>
                  <td>Usually added at the till</td>
                </tr>
                <tr>
                  <td>Set by</td>
                  <td>The national government</td>
                  <td>State, county and city, stacked</td>
                </tr>
                <tr>
                  <td>If a stage is missed</td>
                  <td>Earlier stages were still collected</td>
                  <td>The whole tax is lost</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            The last row is why more than 170 countries use VAT. A single-point
            tax collects nothing when the final sale escapes it; a staged tax
            has already banked most of the money by then.
          </p>

          <p>
            The shelf-price row is the one that surprises visitors in both
            directions. A price marked £12 in a British shop is £12 at the till.
            A price marked $12 in most of the United States is not.
          </p>

          <h2>Rates Vary More Than People Expect</h2>

          <p>
            There is no international standard rate, and the spread is wide.
            These are standard rates, and most countries also run reduced rates
            for particular categories.
          </p>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Country</th>
                  <th>Standard rate</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Hungary</td>
                  <td>27%</td>
                </tr>
                <tr>
                  <td>Sweden, Denmark, Norway</td>
                  <td>25%</td>
                </tr>
                <tr>
                  <td>Ireland</td>
                  <td>23%</td>
                </tr>
                <tr>
                  <td>Italy</td>
                  <td>22%</td>
                </tr>
                <tr>
                  <td>Spain, Netherlands</td>
                  <td>21%</td>
                </tr>
                <tr>
                  <td>United Kingdom, France</td>
                  <td>20%</td>
                </tr>
                <tr>
                  <td>Germany</td>
                  <td>19%</td>
                </tr>
                <tr>
                  <td>South Africa</td>
                  <td>15%</td>
                </tr>
                <tr>
                  <td>Australia (GST), Japan</td>
                  <td>10%</td>
                </tr>
                <tr>
                  <td>United Arab Emirates</td>
                  <td>5%</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            Rates move, and a table on any website ages. Treat these as an
            indication of the spread rather than a source to file a return
            against, and confirm the current figure with the relevant tax
            authority before it matters. Some systems do not have a single
            standard rate at all: India&apos;s GST runs several slabs, and
            Canada layers a federal tax with provincial ones.
          </p>

          <h2>Where VAT Goes Wrong for Small Businesses</h2>

          <ul className="custom-list">
            <li>
              <strong>Treating a gross figure as net.</strong> Applying 20% to a
              price that already includes VAT overstates the tax. Extracting VAT
              from a gross amount means dividing by 1.2, or multiplying by 1/6,
              not subtracting 20%.
            </li>
            <li>
              <strong>Missing the rolling threshold.</strong> Turnover is tested
              over any twelve months, not a tax year, and the obligation starts
              from the point it is crossed.
            </li>
            <li>
              <strong>Confusing zero-rated with exempt.</strong> Both show no VAT
              on the invoice and they have opposite consequences for what you
              can reclaim.
            </li>
            <li>
              <strong>Assuming a flat-rate scheme is simpler and cheaper.</strong>{" "}
              It is simpler. Whether it is cheaper depends on how much input VAT
              you would otherwise reclaim, and a business with significant
              purchases usually loses on it.
            </li>
            <li>
              <strong>Ignoring where the customer is.</strong> Cross-border
              digital sales are generally taxed where the customer belongs, not
              where you are, which can mean accounting for several countries&apos;
              VAT from a single laptop.
            </li>
          </ul>

          <p>
            None of these are arithmetic failures, which is the pattern worth
            noticing. The sums are the easy part; the definitions are where the
            money is lost.
          </p>
          <img className="image-blog" src="/blog1.2.webp" alt="" />
          <section>
            <h2>VAT Registration, Rates and Refunds</h2>

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
                      <p>{a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </section>
        </main>

        {/* STATIC BLOG POSTS */}
      </div>

      <BlogSidebar
        relatedTools={[
          ["/vat-calculator/", "VAT Calculator"],
          ["/income-tax-calculator/", "Income Tax Calculator"],
          ["/freelancer-tax-calculator/", "Freelancer Tax Calculator"],
        ]}
        relatedPosts={[
          ["/blog/2026-tax-brackets/", "2026 Tax Brackets, Deductions and What Changed"],
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
