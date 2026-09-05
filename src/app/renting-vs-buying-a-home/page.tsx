import { Metadata } from "next";
import RentingVsBuying from "../components/RentingVsBuyingHome";

export const metadata: Metadata = {
  title: "Renting vs Buying: Deciding With Numbers",
  description:
    "The break-even point, the price-to-rent ratio, and why the old rule that renting throws money away stopped holding.",
  alternates: {
    canonical: "/blog/renting-vs-buying-a-home/",
  },
  openGraph: {
    title: "Renting vs. Buying a Home: How to Decide With Numbers (2026 Guide)",
    description:
      "Real costs, price-to-rent ratio, break-even point, and a 10-year wealth comparison — decide with your own numbers, not guesswork.",
    url: "/blog/renting-vs-buying-a-home/",
    type: "article",
    publishedTime: "2026-06-14T00:00:00.000Z",
    authors: ["Ashar Pervaiz"],
    section: "Finance",
  },
  twitter: {
    title: "Renting vs. Buying a Home (2026)",
    description:
      "Real costs, price-to-rent, break-even, and a 10-year wealth comparison.",
  },
};

export default function Page() {
  return <RentingVsBuying />;
}
