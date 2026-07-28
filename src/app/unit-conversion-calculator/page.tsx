import { Metadata } from "next";
import UnitConversionCalculator from "../components/UnitConversionCalculator";

export const metadata: Metadata = {
  title:
    "Unit Conversion Calculator | Convert Length, Mass, Temperature & More",
  description:
    "Free Unit Conversion Calculator for converting length, mass, temperature, volume, area, and time. Enter value, choose units, and get instant accurate results online.",
  metadataBase: new URL("https://numbersonyourtip.com"),
  alternates: {
    canonical: "https://numbersonyourtip.com/unit-conversion-calculator/",
  },
};

export default function Page() {
  return <UnitConversionCalculator />;
}
