import { Metadata } from "next";

import TaxBrackets2026 from "../components/TaxBrackets2026";

export const metadata: Metadata = {
  title: "2026 Federal Tax Brackets and Deductions",
  description:
    "All four filing statuses, the 2026 standard deduction, capital gains rates and worked examples showing what you actually owe.",
  alternates: {
    canonical: "/blog/2026-tax-brackets/",
  },
  openGraph: {
    title:
      "2026 Tax Brackets: Federal Income Tax Rates, Standard Deductions & Changes",
    description:
      "All four filing statuses, new standard deductions, OBBBA changes, capital gains rates, and worked examples — sourced from IRS Rev. Proc. 2025-32.",
    url: "/blog/2026-tax-brackets/",
    type: "article",
    publishedTime: "2026-07-17T00:00:00.000Z",
    authors: ["Ashar Pervaiz"],
    section: "Finance",
  },
  twitter: {
    title: "2026 Federal Tax Brackets Guide",
    description:
      "All 2026 brackets, standard deductions, and OBBBA changes with worked examples.",
  },
};

export default function Page() {
  return <TaxBrackets2026 />;
}
