import { Metadata } from "next";
import PharmacodynamicsCalculator from "../components/PharmacodynamicsCalculator";

export const metadata: Metadata = {
  title:
    "Free Pharmacodynamics Calculator Online – TI, Emax, Bioavailability (All Formulas)",
  description:
    "Free pharmacodynamics calculator with all formulas — therapeutic index, Emax model, absolute and relative bioavailability. Built for pharmacy students, pharmacists, and clinical professionals.",
  metadataBase: new URL("https://numbersonyourtip.com"),
  alternates: {
    canonical: "https://numbersonyourtip.com/pharmacodynamics-calculator/",
  },
};

export default function Page() {
  return <PharmacodynamicsCalculator />;
}
