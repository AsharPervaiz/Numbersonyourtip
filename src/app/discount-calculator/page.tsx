import { Metadata } from "next";
import DiscountCalculator from "../components/DiscountCalculator";

export const metadata: Metadata = {
  title: "Discount Calculator — Sale Price & Savings",
  description:
    "Work out sale price and savings, reverse a discount to find the original, and see why 30% off then 20% off is 44% — not 50%.",
  alternates: {
    canonical: "/discount-calculator/",
  },
  openGraph: {
    title: "Discount Calculator — Sale Price & Savings",
    description:
      "Stacked discounts do not add up. The multiplier method, reverse discounts, and whether it is really a deal.",
    url: "/discount-calculator/",
    type: "article",
  },
  twitter: {
    title: "Discount Calculator — Sale Price & Savings",
    description:
      "Sale price, savings, reverse discounts and stacked offers done correctly.",
  },
};

export default function Page() {
  return <DiscountCalculator />;
}
