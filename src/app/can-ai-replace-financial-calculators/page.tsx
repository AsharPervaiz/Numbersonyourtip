import { Metadata } from "next";
import AIvsFinancialCalculators from "../components/CanAIReplaceFinancialCalculators";

export const metadata: Metadata = {
  title: "Can AI Replace Financial Calculators?",
  description:
    "Where a language model genuinely helps with a money question, where it quietly invents a number, and how to use both safely.",
  alternates: {
    canonical: "/blog/can-ai-replace-financial-calculators/",
  },
  openGraph: {
    title:
      "Can AI Replace Financial Calculators? Here's the Honest Truth (2026)",
    description:
      "Backed by 2026 research — where AI helps with money questions, where it fails, and why calculators still win for EMI, tax, mortgage, and net worth.",
    url: "/blog/can-ai-replace-financial-calculators/",
    type: "article",
    publishedTime: "2026-06-07T00:00:00.000Z",
    authors: ["Ashar Pervaiz"],
    section: "Finance",
  },
  twitter: {
    title: "Can AI Replace Financial Calculators?",
    description:
      "Where AI helps with money, where it fails, and why calculators still win.",
  },
};

export default function Page() {
  return <AIvsFinancialCalculators />;
}
