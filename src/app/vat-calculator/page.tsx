import { Metadata } from "next";
import VATCalculator from "../components/VATCalculator";

export const metadata: Metadata = {
  title:
    "Free VAT Calculator Online | Add or Remove VAT From Any Price Instantly",
  description:
    "Free VAT calculator — add VAT to a net price or reverse-calculate VAT from a gross amount. Supports any rate (5%, 15%, 18%, 20%, 25%). Instant breakdown with visual gauge.",
  metadataBase: new URL("https://numbersonyourtip.com"),
  alternates: {
    canonical: "https://numbersonyourtip.com/vat-calculator/",
  },
};

export default function Page() {
  return <VATCalculator />;
}
