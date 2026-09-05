import { Metadata } from "next";
import BodyFatCalculator from "../components/BodyFatCalculator";

export const metadata: Metadata = {
  title: "Body Fat Percentage Calculator",
  description:
    "Estimate body fat percentage from neck, waist and hip measurements, with exact tape placement, honest accuracy limits and healthy ranges by sex and age.",
  alternates: {
    canonical: "/body-fat-calculator/",
  },
  openGraph: {
    title: "Body Fat Percentage Calculator",
    description:
      "A tape-measure body fat estimate, plus where to place the tape, how accurate it really is, and what the number cannot tell you.",
    url: "/body-fat-calculator/",
    type: "article",
  },
  twitter: {
    title: "Body Fat Percentage Calculator",
    description:
      "Body fat from tape measurements, with placement guidance and honest error bands.",
  },
};

export default function Page() {
  return <BodyFatCalculator />;
}
