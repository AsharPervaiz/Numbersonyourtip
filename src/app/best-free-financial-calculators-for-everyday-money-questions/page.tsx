import { Metadata } from "next";
import BestFreeFinancialCalculators from "../components/BestFreeFinancialCalculators";

export const metadata: Metadata = {
  title: "Best Free Financial Calculators for Everyday Money Questions",
  description:
    "Discover the 9 best free financial calculators for VAT, EMI, loans, rent, mortgage, net worth, salary hike, freelancer tax, and income tax. Get instant, accurate answers to your everyday money questions — no sign-up needed.",
  metadataBase: new URL("https://numbersonyourtip.com"),
  alternates: {
    canonical:
      "https://numbersonyourtip.com/blog/best-free-financial-calculators-for-everyday-money-questions/",
  },
};

export default function Page() {
  return <BestFreeFinancialCalculators />;
}
