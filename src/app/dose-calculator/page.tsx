import { Metadata } from "next";
import DoseCalculator from "../components/DoseCalculator";

export const metadata: Metadata = {
  title: "Dosage Calculator by Weight (mg/kg)",
  description:
    "Calculate a medication dose from body weight in mg/kg or mg/lb, split a daily dose across three or four times a day, and convert mg to mL from the label.",
  alternates: {
    canonical: "/dose-calculator/",
  },
  openGraph: {
    title: "Dosage Calculator by Weight (mg/kg)",
    description:
      "Weight-based dosing, divided daily doses, and mg-to-mL conversion — with the dosing-weight distinctions that change the answer.",
    url: "/dose-calculator/",
    type: "article",
  },
  twitter: {
    title: "Dosage Calculator by Weight (mg/kg)",
    description:
      "Dose by weight, split a daily total, and convert milligrams to millilitres.",
  },
};

export default function Page() {
  return <DoseCalculator />;
}
