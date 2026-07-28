import { Metadata } from "next";
import GPAToPercentageCalculator from "../components/GPAToPercentage";

export const metadata: Metadata = {
  title:
    "GPA to Percentage Calculator | Free CGPA to % Converter (4.0, 5.0, 10 Scale)",
  description:
    "Free GPA to percentage calculator online. Convert GPA & CGPA to percentage on 4.0, 5.0 or 10-point scales instantly using the standard UGC formula.",
  metadataBase: new URL("https://numbersonyourtip.com"),
  alternates: {
    canonical: "https://numbersonyourtip.com/gpa-percentage/",
  },
};

export default function Page() {
  return <GPAToPercentageCalculator />;
}
