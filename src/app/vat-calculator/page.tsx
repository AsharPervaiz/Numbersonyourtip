import { Metadata } from "next";
import VATCalculator from "../components/VATCalculator";

export const metadata: Metadata = {
  title: "VAT Calculator — Add or Reverse VAT Online",
  description:
    "Add VAT to a net price or reverse it out of a gross total at any rate, with the VAT fractions, rounding rules and the zero-rated versus exempt distinction.",
  alternates: {
    canonical: "/vat-calculator/",
  },
  openGraph: {
    title: "VAT Calculator — Add or Reverse VAT Online",
    description:
      "Why removing VAT is a division and not a subtraction, plus the fractions that let you check any receipt in your head.",
    url: "/vat-calculator/",
    type: "article",
  },
  twitter: {
    title: "VAT Calculator — Add or Reverse VAT Online",
    description:
      "Add VAT, reverse VAT out of a gross total, and extract the VAT element at any rate.",
  },
};

export default function Page() {
  return <VATCalculator />;
}
