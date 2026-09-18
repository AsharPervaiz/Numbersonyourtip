import { Metadata } from "next";
import MulchCalculator from "../components/MulchCalculator";

export const metadata: Metadata = {
  title: "Mulch Calculator — Bags, Cubic Yards & Cost",
  description:
    "Work out how much mulch a garden bed needs in bags, cubic feet, cubic yards or cubic metres — one bed or several, in feet and inches or metres and centimetres.",
  alternates: {
    canonical: "/mulch-calculator/",
  },
  openGraph: {
    title: "Mulch Calculator — Bags, Cubic Yards & Cost",
    description:
      "How many bags of mulch do I need? Coverage per bag at each depth, why two to three inches is the range, and what to add for settling.",
    url: "/mulch-calculator/",
    type: "website",
  },
  twitter: {
    title: "Mulch Calculator — Bags, Cubic Yards & Cost",
    description:
      "Bed size and depth to bags, cubic yards and cost, with the arithmetic shown.",
  },
};

export default function Page() {
  return <MulchCalculator />;
}
