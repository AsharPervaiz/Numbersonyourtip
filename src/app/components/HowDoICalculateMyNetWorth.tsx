"use client";
import { useState } from "react";
import Link from "next/link";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function NetWorthGuide() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="blog-container">
      {/* MAIN CONTENT (70%) */}
      <div className="blog-content">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "14px",
            marginBottom: "10px",
          }}
        >
          <Link
            href="https://numbersonyourtip.com/"
            style={{
              textDecoration: "none",
              color: "#000000",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
            className="my-link"
          >
            <i className="fa-solid fa-house"></i>
            Home
          </Link>

          <i
            className="fa-solid fa-angle-right"
            style={{ fontSize: "12px" }}
          ></i>

          <span style={{ color: "#000000" }}>
            How Do I Calculate My Net Worth?
          </span>
        </div>
        <hr></hr>
        <img src="/blog5.1.webp" className="image-blog" alt="blog" />
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
              <img className="founder-photo" src="/founder_photo.webp" alt="" />
              Ashar Pervaiz
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
              <i className="custom-meta-icon fa-solid fa-calendar"></i>10 May
              2026
            </span>
          </small>
        </div>
        <article>
          {/* --- HEADER --- */}
          <header>
            <h1>How Do I Calculate My Net Worth?</h1>
            <p>
              Forget your salary for a second. If you want to know how wealthy
              you actually are, you need to look at your net worth. Here is
              exactly how to figure it out without the confusing financial
              jargon.
            </p>
          </header>

          {/* --- FEATURED SNIPPET --- */}
          <section
            className="featured-snippet"
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
            <h2>What is Net Worth?</h2>
            <p style={{ marginBottom: "0", color: "white" }}>
              <strong>Net worth</strong> is the total value of everything you
              own (your assets) minus everything you owe (your liabilities). You
              can figure this out using the standard{" "}
              <strong>net worth formula</strong>: Total Assets − Total
              Liabilities = Net Worth. Understanding{" "}
              <strong>how to calculate net worth</strong> is the most accurate
              way to measure your personal financial health, far more so than
              simply looking at your annual salary.
            </p>
          </section>

          {/* --- INTRODUCTION --- */}
          <section id="introduction" style={{ marginBottom: "50px" }}>
            <h2>The Truth About Wealth vs. Salary</h2>
            <p>
              Let’s be completely honest for a second. Society has taught us to
              equate wealth with a high paycheck. When we see someone driving a
              brand new European luxury car, wearing designer clothes, and
              taking quarterly trips to the Maldives, our immediate thought is,{" "}
              <em>"Wow, they must be rich."</em>
            </p>
            <p>
              But as any seasoned financial advisor will tell you, a high income
              does not automatically equal high wealth. In fact, that person
              driving the luxury car might be drowning in lease payments,
              carrying heavy credit card balances, and living paycheck to
              paycheck.
            </p>
            <p>
              On the flip side, the quiet person living next door, driving a
              seven-year-old sedan and working a mid-level management job, might
              be a millionaire.
            </p>
            <p>
              Why? Because the quiet neighbor focuses on{" "}
              <strong>net worth tracking</strong>, while the other person
              focuses purely on cash flow.
            </p>
            <p>
              If you are serious about your financial future, learning{" "}
              <strong>how to find net worth</strong> is the most critical step
              you can take. It strips away the illusion of a paycheck and shows
              you the raw, unfiltered truth about your finances. In this guide,
              I’m going to walk you through exactly how to do it, what counts,
              what doesn't, and how you can start growing that number today.
            </p>
          </section>

          {/* --- WHAT IS NET WORTH? --- */}
          <section id="what-is-net-worth" style={{ marginBottom: "50px" }}>
            <h2>What Exactly Is Net Worth?</h2>
            <p>
              Simply put, your personal net worth is the ultimate scorecard of
              your financial life. It is the financial value that would be left
              over if you were to sell every single thing you own and use that
              cash to pay off every single penny of debt you owe.
            </p>
            <p>
              Think of it as a snapshot in time. A{" "}
              <strong>personal net worth calculator</strong> takes your entire
              financial existence and boils it down to one single, clear number.
            </p>

            <h3>Positive vs. Negative Net Worth</h3>
            <p>
              When you calculate this number, you will end up in one of two
              categories:
            </p>
            <ul
              style={{
                listStyleType: "square",
                paddingLeft: "20px",
                fontSize: "1.1rem",
              }}
            >
              <li style={{ marginBottom: "15px" }}>
                <strong>Positive Net Worth:</strong> This means the value of
                your assets is higher than your debts. If you sold everything,
                you’d have money left over. This is the goal.
              </li>
              <li style={{ marginBottom: "15px" }}>
                <strong>Negative Net Worth:</strong> This means you owe more
                money than you own. If you sold everything, you would still be
                in debt.
              </li>
            </ul>
            <p>
              <strong>Don't panic if your number is negative!</strong> This is
              incredibly common for recent college graduates carrying heavy
              student loans, or young families who have just taken out a
              mortgage but haven't built equity yet. A negative number isn't a
              life sentence; it’s simply a starting line.
            </p>
          </section>

          {/* --- THE FORMULA --- */}
          <section id="the-formula" style={{ marginBottom: "50px" }}>
            <h2>The Net Worth Formula Explained</h2>
            <p>
              The math behind this isn't complicated. You don't need a degree in
              finance to understand it. The <strong>net worth formula</strong>{" "}
              is just basic addition and subtraction.
            </p>

            <div
              style={{
                backgroundColor: "#1f9fb8",
                padding: "20px",
                borderRadius: "10px",
                textAlign: "center",
                margin: "30px 0",
              }}
            >
              <h3
                style={{
                  color: "white",
                }}
              >
                Total Assets − Total Liabilities = Net Worth
              </h3>
            </div>

            <p>
              That's it. You add up the value of what you own (Assets), add up
              the total of what you owe (Liabilities), and subtract the second
              number from the first.
            </p>
          </section>

          {/* --- WHAT COUNTS AS AN ASSET? --- */}
          <section id="assets" style={{ marginBottom: "50px" }}>
            <h2>What Counts as an Asset?</h2>
            <p>
              An asset is anything you own that holds significant financial
              value. When using an{" "}
              <strong>assets and liabilities calculator</strong>, people often
              get confused about what to include. Here is a breakdown of what
              belongs in the "Assets" column.
            </p>

            <h3>Liquid Assets (Cash and Cash Equivalents)</h3>
            <p>
              These are assets you can easily and quickly convert into cash
              without losing value.
            </p>
            <ul style={{ listStyleType: "circle", paddingLeft: "20px" }}>
              <li>
                <strong>Checking and Savings Accounts:</strong> The actual cash
                sitting in the bank right now.
              </li>
              <li>
                <strong>Emergency Funds:</strong> High-yield savings accounts or
                money market accounts.
              </li>
              <li>
                <strong>Physical Cash:</strong> The emergency money hidden in
                your drawer (yes, it counts!).
              </li>
            </ul>

            <h3>Investments</h3>
            <p>
              These are the engines of wealth building. They fluctuate in value,
              so check their current market value on the day you do your
              calculation.
            </p>
            <ul style={{ listStyleType: "circle", paddingLeft: "20px" }}>
              <li>
                <strong>Brokerage Accounts:</strong> Stocks, bonds, mutual
                funds, ETFs.
              </li>
              <li>
                <strong>Retirement Accounts:</strong> 401(k)s, IRAs, Roth IRAs,
                or pension cash values. (Note: Use the current balance, even
                though you'd face penalties for early withdrawal).
              </li>
              <li>
                <strong>Crypto Assets:</strong> Bitcoin, Ethereum, and other
                cryptocurrencies. (Since these are volatile, use the exact price
                on the day of calculation).
              </li>
            </ul>

            <h3>Real Estate & Tangible Assets</h3>
            <p>
              These are physical items of high value. They are considered
              "illiquid" because it takes time to sell them and turn them into
              cash.
            </p>
            <ul style={{ listStyleType: "circle", paddingLeft: "20px" }}>
              <li>
                <strong>Primary Residence:</strong> The current market value of
                your home (not the purchase price!). You can use sites like
                Zillow or Redfin for a rough estimate, but be conservative.
              </li>
              <li>
                <strong>Investment Properties:</strong> Rental homes, commercial
                real estate, or land you own.
              </li>
              <li>
                <strong>Vehicles:</strong> Cars, motorcycles, or boats. Use a
                valuation site like Kelley Blue Book to find the private-party
                sale value.{" "}
                <em>(Remember: cars go down in value over time!)</em>
              </li>
              <li>
                <strong>Valuables:</strong> Fine jewelry, fine art, or high-end
                collectibles. Unless it's appraised and highly valuable, leave
                out everyday furniture and electronics. Don't add your
                television to your net worth.
              </li>
            </ul>

            <h3>Business Ownership</h3>
            <p>
              If you own a business or a percentage of an LLC, the estimated
              value of your equity is an asset.
            </p>
          </section>
          <img src="/blog5.2.webp" className="image-blog" alt="blog" />
          {/* --- WHAT COUNTS AS A LIABILITY? --- */}
          <section id="liabilities" style={{ marginBottom: "50px" }}>
            <h2>What Counts as a Liability?</h2>
            <p>
              A liability is simply a debt. It is money that you legally owe to
              someone else—a bank, a credit card company, the government, or
              even a family member.
            </p>
            <p>
              When doing your <strong>net worth statement</strong>, you must
              include the <em>total outstanding payoff balance</em> of the debt,
              not just your monthly payment.
            </p>

            <h3>Secured Debts (Tied to an Asset)</h3>
            <ul style={{ listStyleType: "circle", paddingLeft: "20px" }}>
              <li>
                <strong>Mortgages:</strong> The total amount remaining on your
                <Link href="/home-mortgage-calculator/" className="my-link">
                  home loan
                </Link>
                .
              </li>
              <li>
                <strong>Car Loans:</strong> The total payoff amount for your
                vehicle. (If you want to dive deeper into how loan interest
                impacts this, check out our{" "}
                <Link href="/loan-calculator/" className="my-link">
                  Loan Calculator
                </Link>
                ).
              </li>
            </ul>

            <h3>Unsecured Debts (Not Tied to an Asset)</h3>
            <ul style={{ listStyleType: "circle", paddingLeft: "20px" }}>
              <li>
                <strong>Credit Card Debt:</strong> The full revolving balance
                you owe across all cards.
              </li>
              <li>
                <strong>Student Loans:</strong> Both federal and private student
                loan balances.
              </li>
              <li>
                <strong>Personal Loans:</strong> Medical debt, consolidation
                loans, or "Buy Now, Pay Later" balances.
              </li>
              <li>
                <strong>Tax Debt:</strong> Unpaid back-taxes owed to the
                government.
              </li>
            </ul>
            <div
              style={{
                backgroundColor: "#ffffff",
                color: "black",
                padding: "15px",
                borderLeft: "5px solid red",
                margin: "20px 0",
              }}
            >
              <strong>Important Note:</strong> Your monthly rent, grocery bills,
              and utility bills are <em>expenses</em>, not liabilities. You do
              not include them in a net worth calculation. (If you're trying to
              figure out how much rent you can afford based on your income, use
              our{" "}
              <Link href="/rent-calculator/" className="my-link">
                Rent Calculator
              </Link>{" "}
              instead).
            </div>
          </section>

          {/* --- STEP-BY-STEP --- */}
          <section id="step-by-step" style={{ marginBottom: "50px" }}>
            <h2>Step-by-Step: How to Calculate Your Net Worth</h2>
            <p>
              Alright, let's put the theory into practice. Here is how you can{" "}
              <strong>calculate my net worth</strong> in under 20 minutes. Grab
              a cup of coffee, open up a spreadsheet (or a notebook), and pull
              up your financial accounts online.
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                marginTop: "30px",
              }}
            >
              <div
                style={{
                  padding: "20px",
                  border: "1px solid #c4c4c4",
                  borderRadius: "8px",
                  position: "relative",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: "-15px",
                    left: "20px",
                    backgroundColor: "#1B3066",
                    color: "#ffffff",
                    padding: "5px 15px",
                    borderRadius: "20px",
                    fontWeight: "bold",
                  }}
                >
                  Step 1
                </span>
                <h3>List All Your Assets</h3>
                <p style={{ margin: "0" }}>
                  Log into your banking and investment apps. Write down the
                  exact balances of your checking, savings, retirement, and
                  brokerage accounts. Estimate the current market value of your
                  home and your car.
                </p>
              </div>

              <div
                style={{
                  padding: "20px",
                  border: "1px solid #c4c4c4",
                  borderRadius: "8px",
                  position: "relative",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: "-15px",
                    left: "20px",
                    backgroundColor: "#1B3066",
                    color: "#ffffff",
                    padding: "5px 15px",
                    borderRadius: "20px",
                    fontWeight: "bold",
                  }}
                >
                  Step 2
                </span>
                <h3>Add the Assets Together</h3>
                <p style={{ margin: "0" }}>
                  Sum up every single number from Step 1. This gives you your
                  Total Assets figure. This is the fun part!
                </p>
              </div>

              <div
                style={{
                  padding: "20px",
                  border: "1px solid #c4c4c4",
                  borderRadius: "8px",
                  position: "relative",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: "-15px",
                    left: "20px",
                    backgroundColor: "#1B3066",
                    color: "#ffffff",
                    padding: "5px 15px",
                    borderRadius: "20px",
                    fontWeight: "bold",
                  }}
                >
                  Step 3
                </span>
                <h3>List All Your Liabilities</h3>
                <p style={{ margin: "0" }}>
                  Now, face the music. Look up the payoff balances for your
                  mortgage, car loan, student loans, and every credit card.
                  Don't hide any debts from yourself.
                </p>
              </div>

              <div
                style={{
                  padding: "20px",
                  border: "1px solid #c4c4c4",
                  borderRadius: "8px",
                  position: "relative",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: "-15px",
                    left: "20px",
                    backgroundColor: "#1B3066",
                    color: "#ffffff",
                    padding: "5px 15px",
                    borderRadius: "20px",
                    fontWeight: "bold",
                  }}
                >
                  Step 4
                </span>
                <h3>Add the Liabilities Together</h3>
                <p style={{ margin: "0" }}>
                  Sum up every debt from Step 3. This is your Total Liabilities
                  figure.
                </p>
              </div>

              <div
                style={{
                  padding: "20px",
                  border: "2px solid #1B3066",
                  borderRadius: "8px",
                  position: "relative",
                  backgroundColor: "#ffffff",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: "-15px",
                    left: "20px",
                    backgroundColor: "#1B3066",
                    color: "#fff",
                    padding: "5px 15px",
                    borderRadius: "20px",
                    fontWeight: "bold",
                  }}
                >
                  Step 5
                </span>
                <h3>Do the Final Math</h3>
                <p style={{ margin: "0" }}>
                  Subtract your Total Liabilities from your Total Assets. You
                  now have your current personal net worth.
                </p>
              </div>
            </div>
          </section>

          {/* --- EXAMPLE CALCULATION --- */}
          <section id="example" style={{ marginBottom: "50px" }}>
            <h2>A Real-Life Net Worth Example</h2>
            <p>
              Let’s look at a practical <strong>net worth example</strong>. Meet
              Sarah. She is 30 years old, earns a decent salary, owns a modest
              home, but also has student loans and credit card debt. Let’s
              create a <strong>financial net worth calculator</strong> sheet for
              her.
            </p>

            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginBottom: "20px",
                fontSize: "1.1rem",
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      backgroundColor: "#1b3067",
                      color: "#fff",
                      padding: "15px",
                      textAlign: "left",
                      width: "50%",
                      borderTopLeftRadius: "8px",
                    }}
                  >
                    Sarah's Assets (What She Owns)
                  </th>
                  <th
                    style={{
                      backgroundColor: "#1B3066",
                      color: "#fff",
                      padding: "15px",
                      textAlign: "left",
                      width: "50%",
                      borderTopRightRadius: "8px",
                    }}
                  >
                    Sarah's Liabilities (What She Owes)
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: "1px solid #ddd" }}>
                  <td
                    style={{ padding: "15px", borderRight: "1px solid #ddd" }}
                  >
                    Checking Account: $2,500
                  </td>
                  <td style={{ padding: "15px" }}>
                    Mortgage Balance: $210,000
                  </td>
                </tr>
                <tr
                  style={{
                    borderBottom: "1px solid #ddd",
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <td
                    style={{ padding: "15px", borderRight: "1px solid #ddd" }}
                  >
                    Emergency Savings: $5,000
                  </td>
                  <td style={{ padding: "15px" }}>Student Loans: $28,000</td>
                </tr>
                <tr style={{ borderBottom: "1px solid #ddd" }}>
                  <td
                    style={{ padding: "15px", borderRight: "1px solid #ddd" }}
                  >
                    401(k) Retirement: $35,000
                  </td>
                  <td style={{ padding: "15px" }}>Car Loan: $12,000</td>
                </tr>
                <tr
                  style={{
                    borderBottom: "1px solid #ddd",
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <td
                    style={{ padding: "15px", borderRight: "1px solid #ddd" }}
                  >
                    Current Home Value: $275,000
                  </td>
                  <td style={{ padding: "15px" }}>Credit Card Debt: $4,500</td>
                </tr>
                <tr style={{ borderBottom: "2px solid #1b3067" }}>
                  <td
                    style={{ padding: "15px", borderRight: "1px solid #ddd" }}
                  >
                    Car Current Value: $14,000
                  </td>
                  <td style={{ padding: "15px" }}>Personal Loan: $0</td>
                </tr>
                <tr style={{ fontWeight: "bold", backgroundColor: "#e2e8f0" }}>
                  <td
                    style={{
                      padding: "15px",
                      borderRight: "1px solid #ddd",
                      color: "#1b3067",
                    }}
                  >
                    Total Assets: $331,500
                  </td>
                  <td style={{ padding: "15px", color: "#DC2626" }}>
                    Total Liabilities: $254,500
                  </td>
                </tr>
              </tbody>
            </table>

            <div
              style={{
                padding: "20px",
                backgroundColor: "#1F9FB8",
                color: "white",
                borderRadius: "8px",
                fontWeight: "bold",
                fontSize: "1.3rem",
                textAlign: "center",
              }}
            >
              Calculation: $331,500 (Assets) − $254,500 (Liabilities) = <br />
              <span style={{ fontSize: "2rem" }}>$77,000 Net Worth</span>
            </div>
            <p style={{ marginTop: "15px" }}>
              Despite having over $250,000 in debt, Sarah is actually doing
              quite well financially. Because her home value and retirement
              accounts exceed her debts, she has a solid positive net worth of
              $77,000.
            </p>
          </section>

          {/* --- HOW OFTEN TO CALCULATE --- */}
          <section id="frequency" style={{ marginBottom: "50px" }}>
            <h2>How Often Should You Calculate Your Net Worth?</h2>
            <p>
              There is a fine line between financial awareness and financial
              obsession. Checking your stock portfolio every three hours isn't
              healthy. So, how often should you sit down and use a{" "}
              <strong>net worth calculator</strong>?
            </p>
            <ul style={{ listStyleType: "circle", paddingLeft: "20px" }}>
              <li>
                <strong>Monthly:</strong> Great for aggressive debt-payers. If
                you are actively paying down high-interest credit cards,
                checking monthly keeps you motivated as you watch the liability
                column shrink.
              </li>
              <li>
                <strong>Quarterly (Every 3 Months):</strong> This is the sweet
                spot for most people. It accounts for normal market fluctuations
                without making you crazy if the stock market dips for a week.
              </li>
              <li>
                <strong>Yearly:</strong> The absolute bare minimum. Doing a
                massive financial checkup every December or January helps you
                set goals for the new year.
              </li>
            </ul>
            <p>
              <em>Pro Tip:</em> Pick a frequency, put a recurring calendar
              invite in your phone, and make a date out of it.
            </p>
          </section>

          {/* --- HOW TO INCREASE --- */}
          <section id="how-to-increase" style={{ marginBottom: "50px" }}>
            <h2>Proven Ways to Increase Your Net Worth</h2>
            <p>
              Once you know your number, human nature takes over: you want to
              make it bigger. Wondering{" "}
              <strong>how to increase net worth</strong>? There are
              mathematically only two ways to do it: increase your assets or
              decrease your liabilities.
            </p>

            <h3>1. Demolish High-Interest Debt</h3>
            <p>
              Paying off a credit card with a 24% interest rate gives you an
              immediate, guaranteed 24% return on your money. Every dollar you
              pay down on debt is a dollar directly added to your net worth.
            </p>

            <h3>2. Automate Your Investing</h3>
            <p>
              You cannot save your way to wealth; you must invest. Take
              advantage of employer 401(k) matches (that is literal free money)
              and set up automatic transfers to a brokerage account or IRA every
              time you get paid. Compound interest is the secret weapon of the
              wealthy.
            </p>

            <h3>3. Control Lifestyle Creep</h3>
            <p>
              When people get a raise, they usually upgrade their car or
              apartment. This keeps their net worth stagnant. If you get a 10%
              raise, try to save and invest 8% of it, and only inflate your
              lifestyle by 2%.
            </p>

            <h3>4. Increase Your Income Streams</h3>
            <p>
              Whether it’s asking for a promotion, starting a side hustle, or
              investing in dividend-paying stocks, increasing cash flow allows
              you to buy more assets faster.
            </p>
          </section>

          {/* --- COMMON MISTAKES --- */}
          <section id="mistakes" style={{ marginBottom: "50px" }}>
            <h2>Common Calculation Mistakes to Avoid</h2>
            <p>
              I see smart people mess up their net worth calculations all the
              time. When using an{" "}
              <strong>assets and liabilities calculator</strong>, avoid these
              traps:
            </p>
            <ul style={{ listStyleType: "none", paddingLeft: "0" }}>
              <li
                style={{
                  marginBottom: "15px",
                  padding: "15px",
                  borderLeft: "4px solid #DC2626",
                  backgroundColor: "#ffffff",
                }}
              >
                <strong>Mistake #1: Overvaluing Your Car.</strong> People often
                list what they paid for the car. Cars depreciate rapidly. Be
                brutally honest and use the current trade-in value.
              </li>
              <li
                style={{
                  marginBottom: "15px",
                  padding: "15px",
                  borderLeft: "4px solid #DC2626",
                  backgroundColor: "#ffffff",
                }}
              >
                <strong>Mistake #2: Forgetting Taxes on Retirement.</strong>{" "}
                While you don't necessarily need to deduct future taxes from
                your 401(k) for a basic calculation, remembering that 100% of a
                traditional 401(k) isn't "yours" (the government gets a cut
                later) keeps your expectations realistic.
              </li>
              <li
                style={{
                  marginBottom: "15px",
                  padding: "15px",
                  borderLeft: "4px solid #DC2626",
                  backgroundColor: "#ffffff",
                }}
              >
                <strong>Mistake #3: Including Furniture and Jewelry.</strong>{" "}
                Unless it is an appraised Rolex, a diamond ring, or fine art, do
                not include household goods. Your used couch is not a liquid
                asset.
              </li>
              <li
                style={{
                  marginBottom: "15px",
                  padding: "15px",
                  borderLeft: "4px solid #DC2626",
                  backgroundColor: "#ffffff",
                }}
              >
                <strong>Mistake #4: Confusing Income with Assets.</strong> Your
                $100,000 salary is not an asset. It is an income stream. It only
                becomes an asset if you save or invest it.
              </li>
            </ul>
          </section>

          {/* --- NET WORTH BY AGE --- */}
          <section id="by-age" style={{ marginBottom: "50px" }}>
            <h2>Average Net Worth by Age</h2>
            <p>
              It is natural to want to compare yourself to your peers. However,
              remember that averages are often skewed by a few ultra-wealthy
              billionaires. A better metric to look at is the <em>median</em>{" "}
              <strong>net worth by age</strong>.
            </p>
            <p>
              According to recent data from the U.S. Federal Reserve, here are
              the median benchmarks. (Keep in mind, global numbers vary
              significantly, but this shows the natural progression of wealth
              over a lifetime).
            </p>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginBottom: "20px",
                textAlign: "left",
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#1b3067", color: "#fff" }}>
                  <th style={{ padding: "12px", border: "1px solid #ddd" }}>
                    Age Bracket
                  </th>
                  <th style={{ padding: "12px", border: "1px solid #ddd" }}>
                    Median Net Worth
                  </th>
                  <th style={{ padding: "12px", border: "1px solid #ddd" }}>
                    Why?
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                    Under 35
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      border: "1px solid #ddd",
                      fontWeight: "bold",
                    }}
                  >
                    $39,000
                  </td>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                    High student loan debt, lower starting salaries.
                  </td>
                </tr>
                <tr style={{ backgroundColor: "#f9f9f9" }}>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                    35 - 44
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      border: "1px solid #ddd",
                      fontWeight: "bold",
                    }}
                  >
                    $135,600
                  </td>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                    Buying first homes, building early equity, starting 401(k)s.
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                    45 - 54
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      border: "1px solid #ddd",
                      fontWeight: "bold",
                    }}
                  >
                    $247,200
                  </td>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                    Peak earning years, compounding investments.
                  </td>
                </tr>
                <tr style={{ backgroundColor: "#f9f9f9" }}>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                    55 - 64
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      border: "1px solid #ddd",
                      fontWeight: "bold",
                    }}
                  >
                    $320,700
                  </td>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                    Home mortgages nearly paid off, maximum retirement savings.
                  </td>
                </tr>
              </tbody>
            </table>
            <p
              style={{
                fontSize: "0.95rem",
                color: "#666",
                fontStyle: "italic",
              }}
            >
              *Source: Federal Reserve Survey of Consumer Finances.
            </p>
            <p>
              If you are behind these benchmarks, do not get discouraged. The
              best time to plant a tree was 20 years ago; the second best time
              is today.
            </p>
          </section>

          {/* --- CTA / TOOL SECTION --- */}
          <section
            style={{
              backgroundColor: "#1b3067",
              padding: "40px",
              borderRadius: "15px",
              textAlign: "center",
              color: "#fff",
              marginBottom: "50px",
              boxShadow: "0 10px 20px rgba(27,48,103,0.2)",
            }}
          >
            <h2 style={{ color: "#ffffff" }}>
              Stop Guessing. Start Calculating.
            </h2>
            <p
              style={{
                marginBottom: "30px",
                maxWidth: "700px",
                margin: "0 auto 30px auto",
                color: "white",
              }}
            >
              You know the formula. You know the steps. Now it's time to find
              out your true financial standing. Use our free, interactive
              calculator to do the heavy lifting for you in seconds.
            </p>
            <Link
              href="/net-worth-calculator/"
              style={{
                display: "inline-block",
                backgroundColor: "#ffffff",
                color: "#302e64",
                padding: "15px 35px",
                fontSize: "1.2rem",
                fontWeight: "bold",
                textDecoration: "none",
                borderRadius: "6px",
                transition: "transform 0.2s",
              }}
            >
              Launch Net Worth Calculator
            </Link>
          </section>

          {/* --- FAQ --- */}
          <section>
            <h2>Frequently Asked Questions</h2>

            <div className="faq-item">
              <h3 onClick={() => toggleFAQ(0)}>
                Is salary included in a net worth calculator?
                <i
                  className={`fa-solid fa-chevron-down ${openFAQ === 0 ? "rotate" : ""}`}
                ></i>
              </h3>
              {openFAQ === 0 && (
                <p style={{ margin: "0" }}>
                  No. Salary is an income stream, not an asset. It is what you
                  use to <em>buy</em> assets or pay down liabilities. Only
                  include the actual cash sitting in your bank accounts.
                </p>
              )}
            </div>

            <div className="faq-item">
              <h3 onClick={() => toggleFAQ(1)}>
                Should I include my business in my net worth?
                <i
                  className={`fa-solid fa-chevron-down ${openFAQ === 1 ? "rotate" : ""}`}
                ></i>
              </h3>
              {openFAQ === 1 && (
                <p style={{ margin: "0" }}>
                  Yes, absolutely. If you own a business, it is an asset.
                  However, valuing a private business can be tricky. A
                  conservative approach is to estimate what someone would
                  realistically pay to buy it from you today.
                </p>
              )}
            </div>

            <div className="faq-item">
              <h3 onClick={() => toggleFAQ(2)}>
                Is it normal to have a negative net worth?
                <i
                  className={`fa-solid fa-chevron-down ${openFAQ === 2 ? "rotate" : ""}`}
                ></i>
              </h3>
              {openFAQ === 2 && (
                <p style={{ margin: "0" }}>
                  Yes, especially for people in their 20s and early 30s. Student
                  loans and early auto loans often outweigh the small amount of
                  cash or retirement savings young professionals have built up.
                  The goal is to trend upwards over time.
                </p>
              )}
            </div>

            <div className="faq-item">
              <h3 onClick={() => toggleFAQ(3)}>
                How do taxes (like VAT or income tax) affect net worth?
                <i
                  className={`fa-solid fa-chevron-down ${openFAQ === 3 ? "rotate" : ""}`}
                ></i>
              </h3>
              {openFAQ === 3 && (
                <p style={{ margin: "0" }}>
                  Taxes are an expense that reduces your cash flow, making it
                  harder to build assets. If you owe back-taxes to the
                  government, that is a liability. (If you're managing a
                  business and need to figure out your tax margins, try our{" "}
                  <Link href="/vat-calculator/" className="my-link">
                    VAT Calculator
                  </Link>
                  ).
                </p>
              )}
            </div>

            <div className="faq-item">
              <h3 onClick={() => toggleFAQ(4)}>
                Do I count my 401(k) or pension even though I can't touch it
                yet?
                <i
                  className={`fa-solid fa-chevron-down ${openFAQ === 4 ? "rotate" : ""}`}
                ></i>
              </h3>
              {openFAQ === 4 && (
                <p style={{ margin: "0" }}>
                  Yes! Retirement accounts are major assets. Even though they
                  are illiquid (you'd face penalties to withdraw them early),
                  they still contribute to your overall{" "}
                  <Link
                    href="https://www.nerdwallet.com/article/investing/net-worth-calculator"
                    className="my-link"
                  >
                    wealth profile
                  </Link>
                  .
                </p>
              )}
            </div>

            <div className="faq-item">
              <h3 onClick={() => toggleFAQ(5)}>
                What is considered a "good" net worth?
                <i
                  className={`fa-solid fa-chevron-down ${openFAQ === 5 ? "rotate" : ""}`}
                ></i>
              </h3>
              {openFAQ === 5 && (
                <p style={{ margin: "0" }}>
                  "Good" is highly subjective and depends on your age, location,
                  and lifestyle goals. A common financial independence rule of
                  thumb is aiming for a net worth equal to 25 times your annual
                  living expenses.
                </p>
              )}
            </div>

            <div className="faq-item">
              <h3 onClick={() => toggleFAQ(6)}>
                Should married couples calculate net worth together or
                separately?
                <i
                  className={`fa-solid fa-chevron-down ${openFAQ === 6 ? "rotate" : ""}`}
                ></i>
              </h3>
              {openFAQ === 6 && (
                <p style={{ margin: "0" }}>
                  If you share finances, bank accounts, and property, it is much
                  easier and more accurate to calculate a combined household net
                  worth. Just make sure to include <em>both</em> partners' debts
                  as well.
                </p>
              )}
            </div>

            <div className="faq-item">
              <h3 onClick={() => toggleFAQ(7)}>
                Why does my net worth drop when the stock market goes down?
                <i
                  className={`fa-solid fa-chevron-down ${openFAQ === 7 ? "rotate" : ""}`}
                ></i>
              </h3>
              {openFAQ === 7 && (
                <p style={{ margin: "0" }}>
                  Because the value of your assets (like index funds and
                  retirement accounts) fluctuates daily based on market
                  conditions. This is completely normal. Don't panic sell; keep
                  focusing on long-term growth.
                </p>
              )}
            </div>
          </section>
        </article>
      </div>
      {/* SIDEBAR (30%) */}
      <aside className="blog-sidebar">
        <p>Recent Blogs</p>

        <ul>
          <li>
            <Link href="/blog/what-is-vat/">
              <span
                style={{
                  textDecoration: "none",

                  display: "flex",
                  alignItems: "center",
                  gap: "6px", // space between icon and text
                }}
              >
                <i
                  className="fa-solid fa-angle-right"
                  style={{ color: "#D8A13A" }}
                ></i>
                What Is VAT?
              </span>
            </Link>
          </li>
          <li>
            <Link href="/blog/ultimate-iv-infusion-calculator-guide/">
              <span
                style={{
                  textDecoration: "none",

                  display: "flex",
                  alignItems: "center",
                  gap: "6px", // space between icon and text
                }}
              >
                <i
                  className="fa-solid fa-angle-right"
                  style={{ color: "#D8A13A" }}
                ></i>
                Ultimate IV Infusion Calculator Guide
              </span>
            </Link>
          </li>
          <li>
            <Link href="/blog/medication-dose-calculation-complete-guide-to-dose-calculator-safe-drug-dosing/">
              <span
                style={{
                  textDecoration: "none",

                  display: "flex",
                  alignItems: "center",
                  gap: "6px", // space between icon and text
                }}
              >
                <i
                  className="fa-solid fa-angle-right"
                  style={{ color: "#D8A13A" }}
                ></i>
                Medication Dose Calculation
              </span>
            </Link>
          </li>
        </ul>
      </aside>
    </div>
  );
}
