import { Metadata } from "next";
import CarbonFootprintCalculator from "../components/CarbonFootprintCalculator";

export const metadata: Metadata = {
  title: "Carbon Footprint Calculator",
  description:
    "Estimate your annual carbon footprint, and understand why two calculators can differ by a factor of two and which categories actually dominate.",
  alternates: {
    canonical: "/carbon-footprint-calculator/",
  },
  openGraph: {
    title: "Carbon Footprint Calculator",
    description:
      "Why footprint calculators disagree, where the large numbers really are, and what offsetting does.",
    url: "/carbon-footprint-calculator/",
    type: "article",
  },
  twitter: {
    title: "Carbon Footprint Calculator",
    description:
      "Estimate a personal carbon footprint, with honest limits on what the number means.",
  },
};

export default function Page() {
  return <CarbonFootprintCalculator />;
}
