import { Metadata } from "next";

import TaxBrackets2026 from "../components/TaxBrackets2026";

export const metadata: Metadata = {
  title:
    "2026 Tax Brackets: Federal Income Tax Rates, Standard Deductions & Changes",
  description:
    "The complete 2026 federal income tax bracket guide — all four filing statuses, the new standard deductions, OBBBA changes, capital gains rates, and worked examples showing what you actually owe. Updated from IRS Rev. Proc. 2025-32.",
  metadataBase: new URL("https://numbersonyourtip.com"),
  alternates: {
    canonical: "https://numbersonyourtip.com/blog/2026-tax-brackets/",
  },
};

export default function Page() {
  return <TaxBrackets2026 />;
}
