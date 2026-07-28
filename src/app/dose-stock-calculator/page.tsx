import { Metadata } from "next";
import DoseStockCalculator from "../components/DoseStockCalculator";

export const metadata: Metadata = {
  title: "Dose Stock Calculator | Tablet & Syrup Dosing Tool (Free)",
  description:
    "Use our free dose stock calculator to find exactly how many tablets or mL of syrup to give for a prescribed dose. Works for nursing, pharmacy, and home use.",
  metadataBase: new URL("https://numbersonyourtip.com"),
  alternates: {
    canonical: "https://numbersonyourtip.com/dose-stock-calculator/",
  },
};

export default function Page() {
  return <DoseStockCalculator />;
}
