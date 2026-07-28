import { Metadata } from "next";
import PharmacokineticsCalculator from "../components/PharmacokineticsCalculator";

export const metadata: Metadata = {
  title:
    "Pharmacokinetics Calculator | Half-Life, Clearance, Vd & Dosing (Free)",
  description:
    "Free pharmacokinetics calculator for half-life, elimination rate constant, Vd, clearance, loading dose, and maintenance dose. Supports first and zero order kinetics.",
  metadataBase: new URL("https://numbersonyourtip.com"),
  alternates: {
    canonical: "https://numbersonyourtip.com/pharmacokinetics-calculator/",
  },
};

export default function Page() {
  return <PharmacokineticsCalculator />;
}
