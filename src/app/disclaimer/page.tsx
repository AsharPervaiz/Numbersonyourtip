import "../globals.css";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer | Numbers On Your Tip",
  description:
    "Read the disclaimer for Numbers On Your Tip to understand the limitations of our content, including no professional advice, accuracy limitations, affiliate disclosure, and earnings disclaimer for educational use only.",
};

export default function TermsAndConditions() {
  return (
    <>
      <div className="single-page-padding">
        <h1>Disclaimer – Numbers On Your Tip</h1>

        <p>Last Updated: 5/3/2026</p>

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
        <h2>3. Medical & Health Calculators</h2>
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

        <h2>4. External Links Disclaimer</h2>
        <p>
          Our website may contain links to external websites. We do not control
          or endorse the content of third-party websites and are not responsible
          for any information, services, or practices they provide.
        </p>

        <h2>5. Earnings Disclaimer</h2>
        <p>
          Any references to earnings, income, or financial results are for
          illustrative purposes only. Individual results may vary, and we do not
          guarantee that you will achieve similar outcomes.
        </p>

        <h2>6. Affiliate Disclaimer</h2>
        <p>
          Some links on this website may be affiliate links. If you click on
          these links and make a purchase, we may earn a small commission at no
          extra cost to you.
        </p>

        <h2>7. General Disclaimer</h2>
        <p>
          All content is provided “as is” without any warranties of any kind,
          either expressed or implied. Your use of the website and reliance on
          any information is strictly at your own risk.
        </p>
      </div>
    </>
  );
}
