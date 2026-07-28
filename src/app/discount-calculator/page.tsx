import { Metadata } from "next";
import DiscountCalculator from "../components/DiscountCalculator";

export const metadata: Metadata = {
  title: "Discount Calculator | Calculate Sale Price & Savings",
  description:
    "Free discount calculator — find sale price, savings & final price after any % or flat discount. Includes tax/GST option. Works for all currencies. Instant results.",
  metadataBase: new URL("https://numbersonyourtip.com"),
  alternates: {
    canonical: "https://numbersonyourtip/discount-calculator/",
  },
};

export default function Page() {
  return <DiscountCalculator />;
}
