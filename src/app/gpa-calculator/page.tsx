import { Metadata } from "next";
import GPACalculator from "../components/GPACalculator";

export const metadata: Metadata = {
  title: "GPA Calculator | Free Semester GPA Calculator with Credit Hours",
  description:
    "Free college GPA calculator with credit hours and letter grades. Calculate semester GPA, cumulative GPA & target GPA on the 4.0 scale in seconds.",
  metadataBase: new URL("https://numbersonyourtip.com"),
  alternates: {
    canonical: "https://numbersonyourtip.com/gpa-calculator/",
  },
};

export default function Page() {
  return <GPACalculator />;
}
