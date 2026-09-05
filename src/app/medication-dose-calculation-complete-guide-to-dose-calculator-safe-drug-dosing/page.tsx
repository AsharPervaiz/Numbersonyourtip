import { Metadata } from "next";
import MedicationDoseCalculation from "../components/MedicationDoseCalculation";

export const metadata: Metadata = {
  title: "How Dosing Errors Actually Happen",
  description:
    "Dosing mistakes are rarely arithmetic. They are decimal points, mcg read as mg, and labels giving a total where you expected a rate.",
  alternates: {
    canonical:
      "/blog/medication-dose-calculation-complete-guide-to-dose-calculator-safe-drug-dosing/",
  },
  openGraph: {
    title: "Medication Dose Calculation: Where the Errors Actually Come From",
    description:
      "The decimal point, the thousandfold gap between mcg and mg, reading a label without assuming, and why re-reading your own working does not catch anything.",
    url: "/blog/medication-dose-calculation-complete-guide-to-dose-calculator-safe-drug-dosing/",
    type: "article",
    publishedTime: "2026-04-03T00:00:00.000Z",
    modifiedTime: "2026-08-29T00:00:00.000Z",
    authors: ["Ashar Pervaiz"],
    section: "Health",
  },
  twitter: {
    title: "How Dosing Errors Actually Happen",
    description:
      "Not the arithmetic — the decimal point, the units, and the label.",
  },
};

export default function Page() {
  return <MedicationDoseCalculation />;
}
