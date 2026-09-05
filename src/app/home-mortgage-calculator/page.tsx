import { Metadata } from "next";
import HomeMortgageCalculator from "../components/HomeMortgageCalculator";

export const metadata: Metadata = {
  title: "Mortgage Calculator — Payment and Total Cost",
  description:
    "Calculate a mortgage payment and total interest, see what ownership actually costs beyond principal and interest, and stress-test the term and rate.",
  alternates: {
    canonical: "/home-mortgage-calculator/",
  },
  openGraph: {
    title: "Mortgage Calculator — Payment and Total Cost",
    description:
      "Monthly payment, the costs the payment leaves out, and why ten years of payments clear so little of the balance.",
    url: "/home-mortgage-calculator/",
    type: "article",
  },
  twitter: {
    title: "Mortgage Calculator — Payment and Total Cost",
    description:
      "Mortgage payment, total interest, term trade-offs and the costs beyond the payment.",
  },
};

export default function Page() {
  return <HomeMortgageCalculator />;
}
