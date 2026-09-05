import { Metadata } from "next";
import AgeCalculator from "../components/AgeCalculator";

export const metadata: Metadata = {
  title: "Age Calculator — How Old Am I?",
  description:
    "Find your exact age in years, months and days from your date of birth, and see why two age calculators can disagree by a day on the same dates.",
  alternates: {
    canonical: "/age-calculator/",
  },
  openGraph: {
    title: "Age Calculator — How Old Am I?",
    description:
      "Exact age in years, months and days, the borrowing rule behind it, and leap-day birthdays.",
    url: "/age-calculator/",
    type: "article",
  },
  twitter: {
    title: "Age Calculator — How Old Am I?",
    description:
      "Your exact age in years, months and days from any date of birth.",
  },
};

export default function Page() {
  return <AgeCalculator />;
}
