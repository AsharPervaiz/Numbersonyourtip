import Link from "next/link";


import "@fortawesome/fontawesome-free/css/all.min.css";
import { IconCircle, Icons } from "../components/MenuIcons";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Finance Calculators — Loans, Tax, Rent, VAT",
  description:
    "Loan, EMI, mortgage, rent, tax, VAT and net worth calculators — with a guide to which tool answers which money decision.",
  alternates: {
    canonical: "/finance-calculators/",
  },
  openGraph: {
    title: "Finance Calculators — Loans, Tax, Rent, VAT",
    description:
      "Borrowing, tax, affordability and net worth tools, and how the answers feed into each other.",
    url: "/finance-calculators/",
    type: "website",
  },
  twitter: {
    title: "Finance Calculators",
    description:
      "Loans, EMI, mortgage, rent, income tax, VAT, freelance tax and net worth.",
  },
};

export default function Financecals() {
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
            <h1 className="more-tools">Financial Calculators</h1>
            <p style={{ maxWidth: "640px", marginBottom: "28px", lineHeight: 1.7 }}>
              Every calculator on this page solves a specific money problem —
              working out a loan repayment, comparing rent against take-home
              pay, splitting a bill, or figuring out what a freelance invoice
              actually nets after tax. Each one uses the same formulas banks,
              accountants, and lenders use, runs instantly in your browser
              with no sign-up, and shows the full breakdown behind the
              result, not just a final number. Pick the tool that matches your
              question below.
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
                      <IconCircle color="pink">
                        <Icons.EMI />
                      </IconCircle>{" "}
                      <h4>EMI Calculator</h4>
                    </div>
                  ),
                  href: "/emi-calculator/",
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
                        <Icons.Mortgage />
                      </IconCircle>{" "}
                      <h4>Mortgage Calculator</h4>
                    </div>
                  ),
                  href: "/home-mortgage-calculator/",
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
                        <Icons.IncomeTax />
                      </IconCircle>{" "}
                      <h4>Income Tax Calculator</h4>
                    </div>
                  ),
                  href: "/income-tax-calculator/",
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
                        <Icons.Loan />
                      </IconCircle>{" "}
                      <h4>Loan Calculator</h4>
                    </div>
                  ),
                  href: "/loan-calculator/",
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
                        <Icons.Rent />
                      </IconCircle>{" "}
                      <h4>Rent Calculator</h4>
                    </div>
                  ),
                  href: "/rent-calculator/",
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
                        <Icons.VAT />
                      </IconCircle>{" "}
                      <h4>VAT Calculator</h4>
                    </div>
                  ),
                  href: "/vat-calculator/",
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
                      <IconCircle color="teal">
                        <Icons.Fuel />
                      </IconCircle>{" "}
                      <h4>Fuel Cost Calculator</h4>
                    </div>
                  ),
                  href: "/fuel-cost-calculator/",
                },
                {
                  name: (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <IconCircle color="amber">
                        <Icons.Gold />
                      </IconCircle>{" "}
                      <h4>Gold Calculator</h4>
                    </div>
                  ),
                  href: "/gold-calculator/",
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
            <h2>Pick the Tool by the Decision You Are Making</h2>
            <p>
              Money tools overlap more than health ones do, and several of these
              answer questions that sound similar and are not. This is the
              shortest route from a decision to the right page.
            </p>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>The decision in front of you</th>
                    <th>Use</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>What will this loan cost me every month?</td>
                    <td>
                      <Link className="my-link" href="/emi-calculator/">
                        EMI calculator
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <td>Which of these two loan offers is actually cheaper?</td>
                    <td>
                      <Link className="my-link" href="/loan-calculator/">
                        Loan calculator
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <td>Can I afford this house, and what will it really cost?</td>
                    <td>
                      <Link className="my-link" href="/home-mortgage-calculator/">
                        Mortgage calculator
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <td>How much rent can I take on?</td>
                    <td>
                      <Link className="my-link" href="/rent-calculator/">
                        Rent affordability calculator
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <td>What is left after tax on my salary?</td>
                    <td>
                      <Link className="my-link" href="/income-tax-calculator/">
                        Income tax calculator
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <td>How much of this invoice should I set aside for tax?</td>
                    <td>
                      <Link
                        className="my-link"
                        href="/freelancer-tax-calculator/"
                      >
                        Freelance tax calculator
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <td>Do I add VAT to this price or take it out?</td>
                    <td>
                      <Link className="my-link" href="/vat-calculator/">
                        VAT calculator
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <td>Is this raise or offer actually worth it?</td>
                    <td>
                      <Link className="my-link" href="/salary-hike-calculator/">
                        Salary hike calculator
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <td>Am I making financial progress overall?</td>
                    <td>
                      <Link className="my-link" href="/net-worth-calculator/">
                        Net worth calculator
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <td>What does this journey or commute cost to drive?</td>
                    <td>
                      <Link className="my-link" href="/fuel-cost-calculator/">
                        Fuel cost calculator
                      </Link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2>The Three Borrowing Tools Are Not Duplicates</h2>
            <p>
              EMI, loan and mortgage all compute a monthly payment from the same
              underlying formula, and each is built around a different question.
            </p>
            <p>
              The <strong>EMI calculator</strong> is about the anatomy of a
              single payment — how much of each instalment is interest, how that
              split moves over the term, and what a lump-sum prepayment does to
              it. Use it once you have a loan, or when comparing what different
              terms feel like month to month.
            </p>
            <p>
              The <strong>loan calculator</strong> is about choosing between
              offers. Its subject is total cost of credit rather than monthly
              payment, because fees and quoting conventions routinely make the
              lower advertised rate the more expensive loan.
            </p>
            <p>
              The <strong>mortgage calculator</strong> is about the costs the
              payment leaves out — taxes, insurance, maintenance — and about the
              term decision, where the numbers are large enough that a couple of
              years changes the total by six figures.
            </p>

            <h2>Where One Answer Feeds the Next</h2>
            <p>
              Several of these tools are more useful in sequence than
              individually.
            </p>
            <pre>
              Gross salary → Income tax calculator → take-home pay{"\n"}
              Take-home pay → Rent calculator → what you can afford{"\n"}
              Take-home pay → Mortgage calculator → what you can borrow{"\n"}
              Balances and assets → Net worth calculator → where you stand
            </pre>
            <p>
              The common thread is that almost every affordability question
              starts from take-home pay rather than gross, while almost every
              lender and letting agent assesses you on gross. That gap is the
              single most common reason people are approved for commitments they
              then find uncomfortable, and it is worth running both numbers
              deliberately rather than accepting one.
            </p>

            <h2>What These Calculators Assume</h2>
            <p>
              Each tool models a clean version of a situation, and real
              circumstances add complications the arithmetic does not see.
            </p>
            <ul className="custom-list">
              <li>
                Tax thresholds, VAT rates, allowances and contribution rules
                differ by country and change regularly, often annually. Confirm
                any figure against your own tax authority before filing or
                signing.
              </li>
              <li>
                Loan calculations assume payments arrive on schedule and rates
                behave as entered. Variable rates, missed payments and fees
                charged mid-term all change the outcome.
              </li>
              <li>
                Affordability results describe arithmetic, not your life. They
                cannot see job security, dependants, or an expense that is
                coming but has not arrived.
              </li>
              <li>
                Nothing here is financial, tax or investment advice. These are
                tools for understanding a decision, not for making it on your
                behalf — see our{" "}
                <Link className="my-link" href="/disclaimer/">
                  disclaimer
                </Link>{" "}
                for the full position.
              </li>
            </ul>

            <h2>How These Pages Are Kept Current</h2>
            <p>
              Each finance calculator is checked against the published formula
              it implements — standard reducing-balance amortisation for loans
              and mortgages, the statutory basis for VAT and income tax
              calculations — and tested against worked examples with known
              answers before publication. All finance calculators on this site
              were last reviewed on <strong>27 August 2026</strong>, and each
              page carries its own review date. You can read more about the
              process on our{" "}
              <Link className="my-link" href="/about-us/#review-process">
                about page
              </Link>
              .
            </p>
            <section className="related-guides">
              <h2>The Definitions These Calculators Assume</h2>
              <p>The guides below cover the definitions these calculators assume — the part that decides whether the number you get is the number you wanted.</p>
              <ul>
                <li>
                  <Link href="/blog/marginal-vs-effective-tax-rate/" className="related-card">
                    <span className="related-title">Marginal vs Effective Tax Rate</span>
                    <span className="related-blurb">A raise into a higher bracket never lowers your take-home pay.</span>
                  </Link>
                </li>
                <li>
                  <Link href="/blog/2026-tax-brackets/" className="related-card">
                    <span className="related-title">2026 Tax Brackets, Deductions and What Changed</span>
                    <span className="related-blurb">Brackets for all four filing statuses, with worked examples.</span>
                  </Link>
                </li>
                <li>
                  <Link href="/blog/how-much-house-can-i-afford/" className="related-card">
                    <span className="related-title">How Much House Can I Afford?</span>
                    <span className="related-blurb">The 28/36 rule, what PITI includes, and the costs budgets miss.</span>
                  </Link>
                </li>
                <li>
                  <Link href="/blog/how-do-i-calculate-my-net-worth/" className="related-card">
                    <span className="related-title">How Do I Calculate My Net Worth?</span>
                    <span className="related-blurb">Assets minus liabilities is easy; deciding what counts is not.</span>
                  </Link>
                </li>
                <li>
                  <Link href="/blog/what-is-vat/" className="related-card">
                    <span className="related-title">What Is VAT? The Chain, the Reclaim and the Threshold</span>
                    <span className="related-blurb">Why only the final consumer pays it, and what you can reclaim.</span>
                  </Link>
                </li>
                <li>
                  <Link href="/blog/why-was-my-bonus-taxed-so-much/" className="related-card">
                    <span className="related-title">Why Was My Bonus Taxed So Much?</span>
                    <span className="related-blurb">Withholding is not tax owed, and the difference comes back.</span>
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
