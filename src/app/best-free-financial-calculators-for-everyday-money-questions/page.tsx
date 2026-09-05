import { Metadata } from "next";
import BestFreeFinancialCalculators from "../components/BestFreeFinancialCalculators";

export const metadata: Metadata = {
  title: "Free Financial Calculators Worth Using",
  description:
    "Nine calculators for the money questions that come up most, what each is genuinely good for, and which are worth using together.",
  alternates: {
    canonical:
      "/blog/best-free-financial-calculators-for-everyday-money-questions/",
  },
  openGraph: {
    title: "Best Free Financial Calculators for Everyday Money Questions",
    description:
      "Nine free calculators for VAT, EMI, loans, rent, mortgage, net worth, salary hike, freelancer tax, and income tax — with when to use each.",
    url: "/blog/best-free-financial-calculators-for-everyday-money-questions/",
    type: "article",
    publishedTime: "2026-05-30T00:00:00.000Z",
    authors: ["Ashar Pervaiz"],
    section: "Finance",
  },
  twitter: {
    title: "Best Free Financial Calculators",
    description:
      "9 free calculators for the money questions people actually ask.",
  },
};

export default function Page() {
  return <BestFreeFinancialCalculators />;
}
