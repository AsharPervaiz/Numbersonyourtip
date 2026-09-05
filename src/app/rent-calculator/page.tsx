import { Metadata } from "next";
import RentCalculator from "../components/RentCalculator";

export const metadata: Metadata = {
  title: "Rent Affordability Calculator",
  description:
    "Work out the rent you can afford from take-home pay, check what landlords require, and split rent fairly with housemates by room size or income.",
  alternates: {
    canonical: "/rent-calculator/",
  },
  openGraph: {
    title: "Rent Affordability Calculator",
    description:
      "What you can afford, what a landlord will accept, and why those two numbers are not the same.",
    url: "/rent-calculator/",
    type: "article",
  },
  twitter: {
    title: "Rent Affordability Calculator",
    description:
      "Rent you can afford from net pay, landlord income multiples, and fair housemate splits.",
  },
};

export default function Page() {
  return <RentCalculator />;
}
