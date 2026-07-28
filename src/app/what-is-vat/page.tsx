import { Metadata } from "next";
import WhatIsVat from "../components/WhatIsVat";

export const metadata: Metadata = {
  title: "What is VAT? Complete Guide to Value Added Tax (2026)",
  description:
    "Learn what VAT (Value Added Tax) is, how it works globally, how to calculate VAT, and why it matters for businesses and consumers. Includes examples and free VAT calculator.",
  keywords:
    "VAT meaning, value added tax explained, VAT calculation, VAT calculator, how to calculate VAT, VAT rate by country, VAT vs, sales tax, add VAT calculator, remove VAT from price, net to gross VAT",
  metadataBase: new URL("https://numbersonyourtip.com"),
  alternates: {
    canonical: "https://numbersonyourtip.com/blog/what-is-vat/",
  },
};

export default function Page() {
  return <WhatIsVat />;
}
