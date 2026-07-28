import { Metadata } from "next";
import FuelCostCalculator from "../components/FuelCostCalculator";

export const metadata: Metadata = {
  title:
    "Fuel Cost Calculator | Trip Fuel Cost, Cost Per KM & Gas Split (Free)",
  description:
    "Free fuel cost calculator online for any trip — find how much gas you need, total cost, cost per km/mile, toll charges, & per-passenger split. Supports L/100km, km/L, and MPG.",
  metadataBase: new URL("https://numbersonyourtip.com"),
  alternates: {
    canonical: "https://numbersonyourtip.com/fuel-cost-calculator/",
  },
};

export default function Page() {
  return <FuelCostCalculator />;
}
