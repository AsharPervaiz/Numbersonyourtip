import { Metadata } from "next";
import BMICalculator from "../components/BMICalculator";

export const metadata: Metadata = {
  title: "BMI Calculator | Check Your Body Mass Index Instantly (Free)",
  description:
    "Use our free BMI calculator to check your Body Mass Index, WHO weight category, healthy weight range, and global percentile. Supports metric and imperial units.",
  metadataBase: new URL("https://numbersonyourtip.com"),
  alternates: {
    canonical: "https://numbersonyourtip.com/bmi-calculator/",
  },
};

export default function Page() {
  return <BMICalculator />;
}
