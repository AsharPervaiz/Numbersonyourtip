import { Metadata } from "next";
import MedicationDoseCalculation from "../components/MedicationDoseCalculation";

export const metadata: Metadata = {
  title:
    "Medication Dose Calculator Guide – How to Calculate Drug Dosage Safely",
  description:
    "Medication Dose Calculator Guide – How to Calculate Drug Dosage SafelyLearn how to calculate medication dosage using weight-based formulas. Complete guide to dose calculation, mg/kg dosing, examples, and free dose calculator.",
  metadataBase: new URL("https://numbersonyourtip.com"),
  alternates: {
    canonical:
      "https://numbersonyourtip.com/blog/medication-dose-calculation-complete-guide-to-dose-calculator-safe-drug-dosing/",
  },
};

export default function Page() {
  return <MedicationDoseCalculation />;
}
