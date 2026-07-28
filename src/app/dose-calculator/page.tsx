import { Metadata } from "next";
import DoseCalculator from "../components/DoseCalculator";

export const metadata: Metadata = {
  title: "Dose Calculator | Weight-Based Medication Dosing Tool (Free)",
  description:
    "Use our free dose calculator to compute accurate medication doses by patient weight in mg/kg or mg/lb. Works for pediatric, adult, and veterinary dosing.",
  metadataBase: new URL("https://numbersonyourtip.com"),
  alternates: {
    canonical: "https://numbersonyourtip.com/dose-calculator/",
  },
};

export default function Page() {
  return <DoseCalculator />;
}
