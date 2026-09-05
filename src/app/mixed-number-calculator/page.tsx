import { Metadata } from "next";
import MixedNumberCalculator from "../components/MixedNumberCalculator";

export const metadata: Metadata = {
  title: "Mixed Number Calculator with Steps",
  description:
    "Add, subtract, multiply and divide mixed numbers with every step shown — the LCD, the simplification and the decimal.",
  alternates: {
    canonical: "/mixed-number-calculator/",
  },
  openGraph: {
    title: "Mixed Number Calculator — Add, Subtract, Multiply, Divide",
    description:
      "Four operations on mixed numbers with a full worked solution, plus mixed-to-improper, improper-to-mixed and decimal conversion.",
    url: "/mixed-number-calculator/",
    type: "website",
  },
  twitter: {
    title: "Mixed Number Calculator with Steps",
    description:
      "Every step shown: the LCD, the simplification, the improper fraction and the decimal.",
  },
};

export default function Page() {
  return <MixedNumberCalculator />;
}
