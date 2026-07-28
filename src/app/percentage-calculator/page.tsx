import { Metadata } from "next";
import PercentageCalculator from "../components/PercentageCalculator";

export const metadata: Metadata = {
  title:
    "Percentage Calculator | Free Online Percent, Increase & Decrease Calculator",
  description:
    "Free percentage calculator online. Find what X% of Y is, percentage increase or decrease, reverse percentage & percentage of marks — instant results.",
  metadataBase: new URL("https://numbersonyourtip.com"),
  alternates: {
    canonical: "https://numbersonyourtip.com/percentage-calculator/",
  },
};

export default function Page() {
  return <PercentageCalculator />;
}
