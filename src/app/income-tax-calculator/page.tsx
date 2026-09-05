import { Metadata } from "next";
import IncomeTaxCalculator from "../components/IncomeTaxCalculator";

export const metadata: Metadata = {
  title: "Income Tax Calculator With Deductions",
  description:
    "Estimate income tax across bands, and see why marginal, effective and withholding rates differ — plus what a deduction is really worth against a credit.",
  alternates: {
    canonical: "/income-tax-calculator/",
  },
  openGraph: {
    title: "Income Tax Calculator With Deductions",
    description:
      "Tax across bands, the three rates people all call their tax rate, and why a raise never leaves you worse off.",
    url: "/income-tax-calculator/",
    type: "article",
  },
  twitter: {
    title: "Income Tax Calculator With Deductions",
    description:
      "Income tax by band, marginal versus effective rate, deductions versus credits.",
  },
};

export default function Page() {
  return <IncomeTaxCalculator />;
}
