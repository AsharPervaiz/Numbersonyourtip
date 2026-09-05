import { Metadata } from "next";
import BillSplitCalculator from "../components/BillSplitCalculator";

export const metadata: Metadata = {
  title: "Bill Split Calculator with Tip",
  description:
    "Split a restaurant bill equally, by item or proportionally, with tip and tax applied correctly — plus who absorbs the rounding and how to handle drinks.",
  alternates: {
    canonical: "/bill-split-calculator/",
  },
  openGraph: {
    title: "Bill Split Calculator with Tip",
    description:
      "Equal is simple, fair is sometimes different. Tip and tax order, shared dishes, and the awkward situations.",
    url: "/bill-split-calculator/",
    type: "article",
  },
  twitter: {
    title: "Bill Split Calculator with Tip",
    description:
      "Split any bill equally, by item or proportionally, with tip and tax handled properly.",
  },
};

export default function Page() {
  return <BillSplitCalculator />;
}
