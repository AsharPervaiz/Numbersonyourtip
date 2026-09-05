import { Metadata } from "next";
import CurrencyConverter from "../components/CurrencyConverter";

export const metadata: Metadata = {
  title: "Currency Converter — Live Rates",
  description:
    "Convert between world currencies, and learn why the rate you look up is not the rate you get and how to work out what a transfer really cost.",
  alternates: {
    canonical: "/currency-converter/",
  },
  openGraph: {
    title: "Currency Converter — Live Rates",
    description:
      "The mid-market rate, where the margin hides, and why you should always decline conversion at the terminal.",
    url: "/currency-converter/",
    type: "article",
  },
  twitter: {
    title: "Currency Converter — Live Rates",
    description:
      "Convert currencies and understand the margin built into every retail rate.",
  },
};

export default function Page() {
  return <CurrencyConverter />;
}
