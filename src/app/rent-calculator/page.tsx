import { Metadata } from "next";
import RentCalculator from "../components/RentCalculator";

export const metadata: Metadata = {
  title: "Rent Calculator | How Much Rent Can You Afford? Free Online Tool",
  description:
    "Use our free rent calculator online to find out how much rent you can afford based on your income and debts. Get a personalized affordable rent range instantly.",
  metadataBase: new URL("https://numbersonyourtip.com"),
  alternates: {
    canonical: "https://numbersonyourtip.com/rent-calculator/",
  },
};

export default function Page() {
  return <RentCalculator />;
}
