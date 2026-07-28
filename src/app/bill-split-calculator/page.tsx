import { Metadata } from "next";
import BillSplitCalculator from "../components/BillSplitCalculator";

export const metadata: Metadata = {
  title: "Bill Split Calculator with Tip | Split Any Bill Free",
  description:
    "Split any restaurant bill equally or unevenly with tip. Free bill split calculator for groups — handles custom amounts per person. Instant results, no login needed.",
  metadataBase: new URL("https://numbersonyourtip.com"),
  alternates: {
    canonical: "https://numbersonyourtip.com/bill-split-calculator/",
  },
};

export default function Page() {
  return <BillSplitCalculator />;
}
