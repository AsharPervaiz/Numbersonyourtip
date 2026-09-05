import { Metadata } from "next";
import PercentageCalculator from "../components/PercentageCalculator";

export const metadata: Metadata = {
  title: "Percentage Calculator — Of, Change, Reverse",
  description:
    "Find a percentage of a number, a percentage change, or the original value before a change — plus the difference between percent and percentage points.",
  alternates: {
    canonical: "/percentage-calculator/",
  },
  openGraph: {
    title: "Percentage Calculator — Of, Change, Reverse",
    description:
      "Four percentage questions and the formula each one needs, and why 4% to 6% is a 50% rise.",
    url: "/percentage-calculator/",
    type: "article",
  },
  twitter: {
    title: "Percentage Calculator — Of, Change, Reverse",
    description:
      "Percentage of, percentage change, reverse percentages and percentage points.",
  },
};

export default function Page() {
  return <PercentageCalculator />;
}
