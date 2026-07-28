import { Metadata } from "next";
import FreelancerTaxCalculator from "../components/FreelancerTaxCalculator";

export const metadata: Metadata = {
  title:
    "Free Freelance Tax Calculator | Take-Home Pay After Tax, Fees & Deductions",
  description:
    "Free freelance tax calculator with deductions, platform fees, and effective tax rate. Estimate your self-employment tax, quarterly payments, and real take-home pay instantly.",
  metadataBase: new URL("https://numbersonyourtip.com"),
  alternates: {
    canonical: "https://numbersonyourtip.com/freelancer-tax-calculator/",
  },
};

export default function Page() {
  return <FreelancerTaxCalculator />;
}
