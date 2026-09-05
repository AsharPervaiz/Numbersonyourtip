import { Metadata } from "next";
import EMICalculator from "../components/EMICalculator";

export const metadata: Metadata = {
  title: "EMI Calculator — Monthly Instalment & Interest",
  description:
    "Calculate your EMI, see how each payment splits between interest and principal, and compare flat versus reducing balance rates before signing anything.",
  alternates: {
    canonical: "/emi-calculator/",
  },
  openGraph: {
    title: "EMI Calculator — Monthly Instalment & Interest",
    description:
      "Where each instalment goes, what a longer term really costs, and why a 10% flat rate is nearer 17%.",
    url: "/emi-calculator/",
    type: "article",
  },
  twitter: {
    title: "EMI Calculator — Monthly Instalment & Interest",
    description:
      "EMI, the interest and principal split, prepayment timing and flat versus reducing rates.",
  },
};

export default function Page() {
  return <EMICalculator />;
}
