import { Metadata } from "next";
import IVCalculator from "../components/IVCalculator";

export const metadata: Metadata = {
  title: "IV Calculator | Infusion Rate, Drip Rate & IV Dose Calculator (Free)",
  description:
    "Use our free IV calculator to compute infusion rate (mL/hr), drip rate (drops/min), weight-based IV dosing, and vial dose. Built for nurses, pharmacists & students.",
  metadataBase: new URL("https://numbersonyourtip.com"),
  alternates: {
    canonical: "https://numbersonyourtip.com/iv-calculator/",
  },
};

export default function Page() {
  return <IVCalculator />;
}
