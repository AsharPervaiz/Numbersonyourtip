import { Metadata } from "next";
import BodyFatCalculator from "../components/BodyFatCalculator";

export const metadata: Metadata = {
  title: "Body Fat Calculator | Estimate Your Body Fat Percentage (Free)",
  description:
    "Use our free body fat calculator to estimate your body fat percentage with the U.S. Navy formula. See your category, fat mass, lean mass, and fitness target instantly.",
  metadataBase: new URL("https://numbersonyourtip.com"),
  alternates: {
    canonical: "https://numbersonyourtip.com/body-fat-calculator/",
  },
};

export default function Page() {
  return <BodyFatCalculator />;
}
