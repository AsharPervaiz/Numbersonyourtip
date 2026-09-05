import { Metadata } from "next";
import FuelCostCalculator from "../components/FuelCostCalculator";

export const metadata: Metadata = {
  title: "Fuel Cost Calculator — MPG and L/100km",
  description:
    "Trip fuel cost, cost per mile or kilometre, and fair fuel splits — with conversions between US MPG, imperial MPG, L/100 km and km/L that actually line up.",
  alternates: {
    canonical: "/fuel-cost-calculator/",
  },
  openGraph: {
    title: "Fuel Cost Calculator — MPG and L/100km",
    description:
      "Trip cost, cost per mile, commute budgets and fuel splits, plus why the four efficiency units are not interchangeable.",
    url: "/fuel-cost-calculator/",
    type: "article",
  },
  twitter: {
    title: "Fuel Cost Calculator — MPG and L/100km",
    description:
      "Trip fuel cost, cost per mile, and conversions between MPG, L/100 km and km/L.",
  },
};

export default function Page() {
  return <FuelCostCalculator />;
}
