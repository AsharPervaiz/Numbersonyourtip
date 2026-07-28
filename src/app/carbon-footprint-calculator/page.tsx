import { Metadata } from "next";
import CarbonFootprintCalculator from "../components/CarbonFootprintCalculator";

export const metadata: Metadata = {
  title: "Carbon Footprint Calculator | Free CO₂ Impact Tool for Individuals",
  description:
    "Free personal carbon footprint calculator. Measure your CO₂ from flights, car, household energy & food using DEFRA factors — instant results, no signup.",
  metadataBase: new URL("https://numbersonyourtip.com"),
  alternates: {
    canonical: "https://numbersonyourtip.com/color-picker/",
  },
};

export default function Page() {
  return <CarbonFootprintCalculator />;
}
