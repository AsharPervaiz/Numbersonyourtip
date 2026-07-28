import { Metadata } from "next";
import AIvsFinancialCalculators from "../components/CanAIReplaceFinancialCalculators";

export const metadata: Metadata = {
  title: "Can AI Replace Financial Calculators? Here's the Honest Truth (2026)",
  description:
    "AI is everywhere in personal finance — but can it actually replace a calculator? Backed by 2026 research, we break down exactly where AI helps, where it fails, and why precise financial tools still win for EMI, tax, mortgage, and net worth.",
  metadataBase: new URL("https://numbersonyourtip.com"),
  alternates: {
    canonical:
      "https://numbersonyourtip.com/blog/can-ai-replace-financial-calculators/",
  },
};

export default function Page() {
  return <AIvsFinancialCalculators />;
}
