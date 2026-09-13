import "../globals.css";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Who builds Numbers On Your Tip, how every calculator is verified, and how our medical tools are reviewed for clinical accuracy by Dr. Syeda Khadija Akbar, PharmD.",
  alternates: {
    canonical: "/about-us/",
  },
  openGraph: {
    title:
      "About Numbers On Your Tip | Free Calculator Platform by Ashar Pervaiz",
    description:
      "Meet the founder behind Numbers On Your Tip — our mission, how we build every calculator, and the editorial standards we follow.",
    url: "/about-us/",
    type: "website",
  },
  twitter: {
    title: "About Numbers On Your Tip",
    description:
      "Free calculator platform built by Ashar Pervaiz. Learn about our mission and standards.",
  },
};

export default function AboutUs() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            name: "About Numbers On Your Tip",
            url: "https://numbersonyourtip.com/about-us/",
            mainEntity: {
              "@type": "Organization",
              name: "Numbers on Your Tip",
              url: "https://numbersonyourtip.com/",
              logo: "https://numbersonyourtip.com/brand-logo.png",
              founder: {
                "@type": "Person",
                name: "Ashar Pervaiz",
                jobTitle: "Software Engineer",
                url: "https://numbersonyourtip.com/about-us/",
              },
              employee: [
                {
                  "@type": "Person",
                  name: "Dr. Syeda Khadija Akbar",
                  honorificPrefix: "Dr.",
                  jobTitle: "Medical Reviewer",
                  hasCredential: {
                    "@type": "EducationalOccupationalCredential",
                    credentialCategory: "degree",
                    educationalLevel: "Doctor of Pharmacy (PharmD)",
                  },
                  knowsAbout: [
                    "Clinical pharmacy",
                    "Medication dosing",
                    "Pharmacokinetics",
                    "Pharmacodynamics",
                  ],
                },
              ],
            },
          }),
        }}
      />
      <div className="single-page-padding">
        <h1>About Us – Numbers On Your Tip</h1>

        <p>
          Numbers On Your Tip is a free calculator and tools platform — 49
          calculators covering health, finance, daily-use math, and digital
          utilities, built to give you accurate answers in seconds without
          sign-ups, paywalls, or clutter.
        </p>

        <h2>Our Mission</h2>
        <p>
          Every calculator on this site exists to answer one question well. We
          focus on getting the formula right, explaining what the result
          actually means, and keeping the tool fast and free — no accounts, no
          data stored, no unnecessary friction between you and your answer.
        </p>

        <h2 id="review-process">How We Build and Verify Every Calculator</h2>
        <p>
          Each tool starts with the same published source that professionals
          in that field actually use — WHO growth and BMI standards for
          health metrics, the standard reducing-balance amortization formula
          for loans and EMIs, IRS/HMRC published rates for tax calculators,
          NIST-recommended thresholds for security tools, and official SI/
          imperial conversion factors for unit tools. Before a calculator
          goes live, it is tested against known worked examples — cases
          where the correct answer is already published — to confirm the
          formula produces the right result, not just a plausible-looking
          one. Every page also includes the underlying formula and a worked
          example in plain text, so you can verify the math yourself rather
          than trusting a black box.
        </p>
        <p>
          When a calculator depends on a rate or standard that changes over
          time — a tax bracket, a WHO cut-off, an interest rate assumption —
          we note the year it applies to and update the page when the
          underlying figure changes.
        </p>
        <p>
          <strong>
            The last site-wide review was completed on 27 August 2026.
          </strong>{" "}
          Calculators published after that date are verified against worked
          examples before they go live — the{" "}
          <Link className="my-link" href="/mixed-number-calculator/">
            mixed number calculator
          </Link>{" "}
          was added and checked on 30 August 2026. Each calculator page shows
          its own review date, and that date is updated whenever the formula,
          the underlying standard, or the supporting content changes.
        </p>

        <h2 id="medical-reviewer">Medical Review</h2>
        <p>
          Health and clinical content carries a higher bar than the rest of the
          site, because a wrong number matters more. Every medical and
          health-related calculator on Numbers On Your Tip — the{" "}
          <Link className="my-link" href="/bmi-calculator/">
            BMI
          </Link>
          ,{" "}
          <Link className="my-link" href="/body-fat-calculator/">
            body fat
          </Link>
          ,{" "}
          <Link className="my-link" href="/calorie-calculator/">
            calorie
          </Link>
          ,{" "}
          <Link className="my-link" href="/dose-calculator/">
            dose
          </Link>
          ,{" "}
          <Link className="my-link" href="/dose-stock-calculator/">
            dose stock
          </Link>
          ,{" "}
          <Link className="my-link" href="/iv-calculator/">
            IV drip
          </Link>
          ,{" "}
          <Link className="my-link" href="/pharmacokinetics-calculator/">
            pharmacokinetics
          </Link>
          , and{" "}
          <Link className="my-link" href="/pharmacodynamics-calculator/">
            pharmacodynamics
          </Link>{" "}
          calculators, along with our health guides — has been reviewed for
          clinical accuracy by a qualified pharmacist.
        </p>

        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "16px",
            margin: "20px 0",
            padding: "18px",
            border: "1px solid #e5e5e5",
            borderLeft: "5px solid #1F9FB8",
            borderRadius: "12px",
            background: "#f9fbfd",
          }}
        >
          <i
            className="fa-solid fa-user-doctor"
            style={{ fontSize: "26px", color: "#1F9FB8", marginTop: "4px" }}
            aria-hidden="true"
          />
          <div>
            <p
              style={{
                margin: 0,
                fontWeight: 700,
                fontSize: "19px",
                color: "#1B3066",
              }}
            >
              Dr. Syeda Khadija Akbar
            </p>
            <p style={{ margin: "2px 0 8px", color: "#1F9FB8" }}>
              PharmD (Doctor of Pharmacy) — Medical Reviewer
            </p>
            <p style={{ margin: 0, fontSize: "14px" }}>
              Dr. Syeda Khadija Akbar reviewed the clinical formulas, dosing
              logic, unit handling, and safety wording used across every
              medical calculator and health guide on this site, to confirm they
              reflect standard pharmacy practice and carry appropriate
              warnings. This review covers clinical accuracy only; it is not a
              personal recommendation, and these tools remain educational
              references rather than a substitute for professional judgment.
              Medical content last reviewed: <strong>27 August 2026</strong>.
            </p>
          </div>
        </div>

        <h2 id="finance-review">Finance and Tax Calculator Review</h2>
        <p>
          Our financial calculators are not reviewed by our medical reviewer,
          whose remit is clinical content only. They are verified against the
          published formula or statutory basis each one implements, and tested
          against worked examples where the correct answer is already known
          before the page goes live.
        </p>
        <p>
          <strong>
            All finance calculators on this site were last reviewed on 27 August
            2026.
          </strong>{" "}
          That review covered the{" "}
          <Link className="my-link" href="/emi-calculator/">
            EMI
          </Link>
          ,{" "}
          <Link className="my-link" href="/loan-calculator/">
            loan
          </Link>
          ,{" "}
          <Link className="my-link" href="/home-mortgage-calculator/">
            mortgage
          </Link>
          ,{" "}
          <Link className="my-link" href="/rent-calculator/">
            rent affordability
          </Link>
          ,{" "}
          <Link className="my-link" href="/income-tax-calculator/">
            income tax
          </Link>
          ,{" "}
          <Link className="my-link" href="/freelancer-tax-calculator/">
            freelance tax
          </Link>
          ,{" "}
          <Link className="my-link" href="/vat-calculator/">
            VAT
          </Link>
          ,{" "}
          <Link className="my-link" href="/net-worth-calculator/">
            net worth
          </Link>
          ,{" "}
          <Link className="my-link" href="/salary-hike-calculator/">
            salary hike
          </Link>{" "}
          and{" "}
          <Link className="my-link" href="/fuel-cost-calculator/">
            fuel cost
          </Link>{" "}
          calculators, along with the supporting explanations on each page.
        </p>
        <p>
          What that review confirms is that the arithmetic matches the standard
          method — reducing-balance amortisation for loans and mortgages, band-by-band
          application for income tax, the statutory basis for adding and
          reversing VAT. It is expressly not financial, tax or investment
          advice, and it cannot account for your jurisdiction, your
          circumstances, or rules that changed after the review date. Tax
          thresholds and VAT rates in particular are revised regularly, so
          confirm any figure with your own tax authority before relying on it.
          Our{" "}
          <Link className="my-link" href="/disclaimer/">
            disclaimer
          </Link>{" "}
          sets out the full position.
        </p>
        <h2>Why Trust Us</h2>
        <ul className="custom-list">
          <li>
            Every calculator is built on standard published formulas (WHO
            guidelines for health metrics, standard financial/amortization
            formulas for loans and tax tools, official conversion standards for
            unit tools)
          </li>
          <li>
            Every medical and health calculator has been reviewed for clinical
            accuracy by{" "}
            <Link className="my-link" href="#medical-reviewer">
              Dr. Syeda Khadija Akbar, PharmD
            </Link>
            . They remain educational references only — never a substitute for
            a licensed healthcare professional. Please read our{" "}
            <Link className="my-link" href="/disclaimer/">
              disclaimer
            </Link>
            .
          </li>
          <li>
            Every finance and tax calculator is verified against the published
            formula or statutory basis it implements and was{" "}
            <Link className="my-link" href="#finance-review">
              last reviewed on 27 August 2026
            </Link>
            . These are educational tools, not financial or tax advice.
          </li>
          <li>
            Every calculator page shows when it was last reviewed, so you can
            see how current the information is instead of guessing.
          </li>
          <li>
            Calculators are updated when underlying rates, formulas, or
            standards change (e.g., tax brackets, WHO BMI cut-offs).
          </li>
          <li>
            No account, no data collection, and no calculator results are
            ever stored on a server — everything runs in your browser. Read
            our full{" "}
            <Link className="my-link" href="/privacy-policy/">
              privacy policy
            </Link>{" "}
            for details.
          </li>
        </ul>

        <h2>Explore Our Calculators</h2>
        <p>
          Tools are organized into five categories so you can find what you
          need quickly:
        </p>
        <ul className="custom-list">
          <li>
            <Link className="my-link" href="/finance-calculators/">
              Financial Calculators
            </Link>{" "}
            — loans, EMIs, mortgages, tax, rent, and net worth
          </li>
          <li>
            <Link className="my-link" href="/health-calculators/">
              Health Calculators
            </Link>{" "}
            — BMI, body fat, calories, and clinical dosing tools
          </li>
          <li>
            <Link className="my-link" href="/math-calculators/">
              Math Calculators
            </Link>{" "}
            — statistics and matrix operations
          </li>
          <li>
            <Link className="my-link" href="/networking-tools/">
              Networking Tools
            </Link>{" "}
            — DNS lookup, IP detection, email and domain checks
          </li>
          <li>
            <Link className="my-link" href="/daily-use-calculators/">
              Daily Use Calculators
            </Link>{" "}
            — age, dates, GPA, percentages, and unit conversion
          </li>
        </ul>

        <h2>Meet the Founder</h2>
        <div
          className="founder-card"
          style={{
            margin: "20px 0",
            padding: "16px",
            border: "1px solid #e5e5e5",
            borderRadius: "12px",
          }}
        >
          <img
            src="/founder-noyt.webp"
            alt="Ashar Pervaiz - Founder of Numbers On Your Tip"
            width={152}
            height={152}
            style={{
              borderRadius: "50%",
              objectFit: "cover",
              objectPosition: "center top",
              border: "2px solid #1F9FB8",
            }}
          />
          <div>
            <p
              style={{
                margin: 0,
                padding: 0,
                fontWeight: 600,
                fontSize: "22px",
                color: "#1B3066",
              }}
            >
              Ashar Pervaiz
            </p>
            <p style={{ margin: 0, color: "#1F9FB8" }}>Software Engineer</p>
            <p
              style={{
                fontSize: "18px",
                fontWeight: "600",
                color: "black",
                margin: 0,
                padding: 0,
              }}
            >
              &quot;Great decisions begin with accurate numbers. Our mission is to
              put reliable tools at your fingertips&mdash;simple, fast, and free.&quot;
            </p>
            <p
              style={{
                fontSize: "12px",
                margin: 0,
                padding: 0,
              }}
            >
              I build every calculator on this site myself, testing each formula
              against real-world examples before it goes live. If something
              looks off, tell me — I fix it fast.
            </p>
          </div>
        </div>

        <h2>Contact Us</h2>
        <p>
          Have questions, suggestions, or feedback? We would love to hear from
          you.
        </p>

        <p>
          You can reach us at:{" "}
          <Link className="my-link" href="mailto:contact@numbersonyourtip.com">
            contact@numbersonyourtip.com
          </Link>
        </p>
      </div>
    </>
  );
}
