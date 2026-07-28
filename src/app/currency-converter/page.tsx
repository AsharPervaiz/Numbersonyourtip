import { Metadata } from "next";
import CurrencyConverter from "../components/CurrencyConverter";

export const metadata: Metadata = {
  title: "Currency Converter | Live Exchange Rates & Instant Conversion",
  description:
    "Free Currency Converter with live exchange rates. Convert between USD, EUR, GBP, INR, CAD, AUD, and 150+ currencies instantly. Fast, accurate, and easy to use",
  metadataBase: new URL("https://numbersonyourtip.com"),
  alternates: {
    canonical: "https://numbersonyourtip.com/currency-converter/",
  },
};

export default function Page() {
  return <CurrencyConverter />;
}
