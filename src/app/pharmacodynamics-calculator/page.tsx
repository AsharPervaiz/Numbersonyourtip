import { Metadata } from "next";
import PharmacodynamicsCalculator from "../components/PharmacodynamicsCalculator";

export const metadata: Metadata = {
  title: "Pharmacodynamics Calculator — EC50 & Emax",
  description:
    "Therapeutic index, Emax model and bioavailability, explained through the concentration-effect curve — including how potency and efficacy actually differ.",
  alternates: {
    canonical: "/pharmacodynamics-calculator/",
  },
  openGraph: {
    title: "Pharmacodynamics Calculator — EC50 & Emax",
    description:
      "Therapeutic index, EC50, Emax and bioavailability, read off one concentration-effect curve.",
    url: "/pharmacodynamics-calculator/",
    type: "article",
  },
  twitter: {
    title: "Pharmacodynamics Calculator — EC50 & Emax",
    description:
      "Therapeutic index, Emax model and bioavailability for pharmacology study.",
  },
};

export default function Page() {
  return <PharmacodynamicsCalculator />;
}
