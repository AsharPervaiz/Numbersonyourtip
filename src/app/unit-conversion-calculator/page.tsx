import { Metadata } from "next";
import UnitConversionCalculator from "../components/UnitConversionCalculator";

export const metadata: Metadata = {
  title: "Unit Conversion Calculator",
  description:
    "Convert length, weight, volume, temperature and more, with exact conversion factors — and why temperature needs an offset that every other unit does not.",
  alternates: {
    canonical: "/unit-conversion-calculator/",
  },
  openGraph: {
    title: "Unit Conversion Calculator",
    description:
      "Exact conversion factors, the temperature exception, and how much precision to actually report.",
    url: "/unit-conversion-calculator/",
    type: "article",
  },
  twitter: {
    title: "Unit Conversion Calculator",
    description:
      "Length, weight, volume and temperature conversions with exact factors.",
  },
};

export default function Page() {
  return <UnitConversionCalculator />;
}
