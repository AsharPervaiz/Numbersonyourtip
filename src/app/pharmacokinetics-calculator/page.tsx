import { Metadata } from "next";
import PharmacokineticsCalculator from "../components/PharmacokineticsCalculator";

export const metadata: Metadata = {
  title: "Pharmacokinetics & Drug Half-Life Calculator",
  description:
    "Calculate drug half-life from two levels, plus Vd, clearance, loading and maintenance dose — and how the three parameters constrain each other.",
  alternates: {
    canonical: "/pharmacokinetics-calculator/",
  },
  openGraph: {
    title: "Pharmacokinetics & Drug Half-Life Calculator",
    description:
      "Half-life from measured levels, volume of distribution, clearance, and the loading versus maintenance dose distinction.",
    url: "/pharmacokinetics-calculator/",
    type: "article",
  },
  twitter: {
    title: "Pharmacokinetics & Drug Half-Life Calculator",
    description:
      "Half-life, Vd, clearance, loading and maintenance dose in one tool.",
  },
};

export default function Page() {
  return <PharmacokineticsCalculator />;
}
