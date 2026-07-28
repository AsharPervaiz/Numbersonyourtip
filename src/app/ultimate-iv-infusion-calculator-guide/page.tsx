import { Metadata } from "next";
import IVCalculatorBlogPost from "../components/UltimateIVInfusionCalculatorGuide";

export const metadata: Metadata = {
  title:
    "Ultimate IV Infusion Calculator Guide: Formulas, Drip Rates & Dosages",
  description:
    "Master IV calculations with our comprehensive guide. Learn how to calculate drip rate, ml/hr, mg/kg dosing, and more using an IV infusion calculator. Perfect for nurses, doctors, and students.",
  metadataBase: new URL("https://numbersonyourtip.com"),
  alternates: {
    canonical:
      "https://numbersonyourtip.com/blog/ultimate-iv-infusion-calculator-guide/",
  },
};

export default function Page() {
  return <IVCalculatorBlogPost />;
}
