import { Metadata } from "next";
import GravelCalculator from "../components/GravelCalculator";

export const metadata: Metadata = {
  title: "Gravel Calculator — Cubic Yards, Tons & Cost",
  description:
    "Work out how much gravel you need in cubic yards, tons or cubic metres, plus bags and material cost — for driveways, paths, rectangles, circles and multiple areas.",
  alternates: {
    canonical: "/gravel-calculator/",
  },
  openGraph: {
    title: "Gravel Calculator — Cubic Yards, Tons & Cost",
    description:
      "How much gravel do I need? Area and depth to cubic yards, tons, bags and cost, with the arithmetic shown and the driveway example worked through.",
    url: "/gravel-calculator/",
    type: "website",
  },
  twitter: {
    title: "Gravel Calculator — Cubic Yards, Tons & Cost",
    description:
      "Volume, weight, bags and cost for gravel, pea gravel, crushed stone and river rock — with the working shown.",
  },
};

export default function Page() {
  return <GravelCalculator />;
}
