import { Metadata } from "next";
import AgeCalculator from "../components/AgeCalculator";

export const metadata: Metadata = {
  title: "Age Calculator | How Old Am I? Free Age Calculator by Date of Birth",
  description:
    "Free age calculator online — find your exact age in years, months, days, hours & minutes from your date of birth. Includes Korean age, dog years & half birthday.",
  metadataBase: new URL("https://numbersonyourtip.com"),
  alternates: {
    canonical: "https://numbersonyourtip.com/age-calculator/",
  },
};

export default function Page() {
  return <AgeCalculator />;
}
