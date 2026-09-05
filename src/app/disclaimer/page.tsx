import "../globals.css";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer",
  description:
    "Disclaimer for Numbers On Your Tip — how our medical and finance calculators are reviewed, the limits of that review, and our no-advice position.",
  alternates: {
    canonical: "/disclaimer/",
  },
  openGraph: {
    title: "Disclaimer | Numbers On Your Tip",
    description:
      "How our calculators should be used — accuracy limitations, no professional advice, affiliate disclosure, and educational-use terms.",
    url: "/disclaimer/",
    type: "website",
  },
  twitter: {
    title: "Disclaimer | Numbers On Your Tip",
    description:
      "Content limitations, no professional advice, and educational-use terms.",
  },
};

export default function TermsAndConditions() {
  return (
    <>
      <div className="single-page-padding">
        <h1>Disclaimer – Numbers On Your Tip</h1>

        <p>Last Updated: 27 August 2026</p>

        <p>
          The information provided on numbersonyourtip.com is for general
          informational and educational purposes only. All content is published
          in good faith and is intended to be accurate at the time of
          publication.
        </p>

        <h2>1. No Professional Advice</h2>
        <p>
          The content on this website does not constitute financial, legal,
          medical, or any other professional advice. You should always seek
          guidance from a qualified professional before making any decisions
          based on the information provided on this website.
        </p>

        <h2>2. Accuracy of Information</h2>
        <p>
          While we strive to ensure that all information is accurate and up to
          date, we make no guarantees regarding the completeness, reliability,
          or accuracy of any content published on this website.
        </p>
        <h2>3. Medical &amp; Health Calculators</h2>
        <p>
          The health and medical calculators on this website — including the
          BMI, Body Fat, Calorie, Dose, Dose Stock, IV, Pharmacokinetics, and
          Pharmacodynamics calculators — are provided for general educational
          and informational purposes only. They are not medical devices and are
          not intended to diagnose, treat, or guide clinical dosing decisions.
          Formulas used are based on standard published references, but results
          may not account for individual patient factors, drug interactions, or
          clinical context. Always verify dosing and clinical calculations
          independently and consult a licensed physician, pharmacist, or nurse
          before making any medical or treatment decision. Do not use this
          website as a substitute for professional clinical judgment.
        </p>

        <h2>4. Medical Review and Its Limits</h2>
        <p>
          The clinical formulas, dosing logic, and safety wording used in our
          medical calculators and health guides were reviewed for accuracy by{" "}
          <strong>Dr. Syeda Khadija Akbar, PharmD (Doctor of Pharmacy)</strong>,
          our medical reviewer. Medical content was last reviewed on{" "}
          <strong>27 August 2026</strong>, and each calculator page displays its
          own review date.
        </p>
        <p>
          This review confirms that the formulas and terminology reflect
          standard pharmacy practice. It is expressly <strong>not</strong> a
          patient-specific recommendation, a prescription, a diagnosis, or the
          establishment of any pharmacist–patient or doctor–patient
          relationship. No reviewer, author, or operator of this website accepts
          liability for decisions made on the basis of a calculated result. The
          treating clinician remains solely responsible for verifying every
          dose, rate, and clinical calculation before it is acted upon. You can
          read more about our reviewer and process on our{" "}
          <Link className="my-link" href="/about-us/#medical-reviewer">
            about page
          </Link>
          .
        </p>

        <h2>5. Financial, Tax and Loan Calculators</h2>
        <p>
          The financial calculators on this website — including the EMI, loan,
          mortgage, rent affordability, income tax, freelance tax, VAT, net
          worth, salary hike and fuel cost calculators — are provided for
          general educational and informational purposes only. They produce
          estimates based solely on the values you enter and the standard
          published formula each one implements.
        </p>
        <p>
          <strong>
            All finance calculators on this site were last reviewed on 27 August
            2026.
          </strong>{" "}
          That review verifies the arithmetic against the standard method for
          each calculation and against worked examples with known answers. It is
          a check of method and accuracy only. It is expressly{" "}
          <strong>not</strong> financial, tax, investment, mortgage or debt
          advice, does not constitute a recommendation to enter into any
          agreement, and does not create any advisory or fiduciary relationship
          between you and this website or its operators.
        </p>
        <p>
          Results cannot account for your jurisdiction, your personal
          circumstances, lender-specific terms, fees not entered, or rules that
          changed after the review date. Tax thresholds, allowances, VAT rates
          and contribution rules are revised regularly and differ by country.
          Before relying on any figure for a filing, an application or a
          contract, confirm it with your own tax authority, lender, or a
          qualified accountant or financial adviser. No operator, author or
          reviewer of this website accepts liability for decisions made on the
          basis of a calculated result. You can read more about how these
          calculators are verified on our{" "}
          <Link className="my-link" href="/about-us/#finance-review">
            about page
          </Link>
          .
        </p>
        <h2>6. External Links Disclaimer</h2>
        <p>
          Our website may contain links to external websites. We do not control
          or endorse the content of third-party websites and are not responsible
          for any information, services, or practices they provide.
        </p>

        <h2>7. Earnings Disclaimer</h2>
        <p>
          Any references to earnings, income, or financial results are for
          illustrative purposes only. Individual results may vary, and we do not
          guarantee that you will achieve similar outcomes.
        </p>

        <h2>8. Affiliate Disclaimer</h2>
        <p>
          Some links on this website may be affiliate links. If you click on
          these links and make a purchase, we may earn a small commission at no
          extra cost to you.
        </p>

        <h2>9. General Disclaimer</h2>
        <p>
          All content is provided “as is” without any warranties of any kind,
          either expressed or implied. Your use of the website and reliance on
          any information is strictly at your own risk.
        </p>
      </div>
    </>
  );
}
