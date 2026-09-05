import { Metadata } from "next";
import GoldCalculator from "../components/GoldCalculator";

export const metadata: Metadata = {
  title: "Gold Calculator — Value, Purity, Resale",
  description:
    "Value gold and silver by weight and karat in grams, tola or troy ounces, and see what a jeweller charges against what the piece is worth resold.",
  alternates: {
    canonical: "/gold-calculator/",
  },
  openGraph: {
    title: "Gold Calculator — Value, Purity, Resale and Zakat",
    description:
      "Work out gold value by karat and weight in tola, grams or troy ounces, with making charges, wastage, tax, resale value and zakat at 2.5%.",
    url: "/gold-calculator/",
    type: "website",
  },
  twitter: {
    title: "Gold Calculator — Value, Purity, Resale",
    description:
      "What a jeweller charges versus what the metal is worth, in tola, grams or troy ounces.",
  },
};

export default function Page() {
  return <GoldCalculator />;
}
