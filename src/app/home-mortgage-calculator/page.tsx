import { Metadata } from "next";
import HomeMortgageCalculator from "../components/HomeMortgageCalculator";

export const metadata: Metadata = {
  title:
    "Home Mortgage Calculator | Estimate Your Monthly House Payment Online",
  description:
    "Use our free home mortgage calculator online to estimate monthly payments, total interest, and loan cost. Compare rates, terms, and down payments instantly.",
  metadataBase: new URL("https://numbersonyourtip.com"),
  alternates: {
    canonical: "https://numbersonyourtip.com/home-mortgage-calculator/",
  },
};

export default function Page() {
  return <HomeMortgageCalculator />;
}
