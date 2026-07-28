import { Metadata } from "next";
import RentingVsBuying from "../components/RentingVsBuyingHome";

export const metadata: Metadata = {
  title: "Renting vs. Buying a Home: How to Decide With Numbers (2026 Guide)",
  description:
    "Rent or buy in 2026? We break down the real costs, the price-to-rent ratio,the break-even point, and a side-by-side 10-year wealth comparison — so you can make the decision with your actual numbers, not guesswork.",
  metadataBase: new URL("https://numbersonyourtip.com"),
  alternates: {
    canonical: "https://numbersonyourtip.com/blog/renting-vs-buying-a-home/",
  },
};

export default function Page() {
  return <RentingVsBuying />;
}
