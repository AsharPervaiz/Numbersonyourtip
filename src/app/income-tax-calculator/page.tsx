import { Metadata } from "next";
import IncomeTaxCalculator from "../components/IncomeTaxCalculator";

export const metadata: Metadata = {
  title:
    "Free Income Tax Calculator 2026 | Pakistan, India, USA, UK, Canada & Australia",
  description:
    "Free income tax calculator with deductions for salaried persons — Pakistan FBR 2026, India, USA, UK, Canada, Australia, or custom rate. See tax slabs, effective rate, and net take-home instantly.",
  metadataBase: new URL("https://numbersonyourtip.com"),
  alternates: {
    canonical: "https://numbersonyourtip.com/income-tax-calculator/",
  },
};

export default function Page() {
  return <IncomeTaxCalculator />;
}
