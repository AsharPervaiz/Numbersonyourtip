import { Metadata } from "next";
import SalaryHikeCalculator from "../components/SalaryHikeCalculator";

export const metadata: Metadata = {
  title: "Salary Hike Calculator | Calculate New Salary After Hike",
  description:
    "Use our free salary hike calculator to instantly find your new salary after appraisal. See annual and monthly breakdown. No login needed. Try it now!",
  metadataBase: new URL("https://numbersonyourtip.com"),
  alternates: {
    canonical: "https://numbersonyourtip.com/salary-hike-calculator/",
  },
};

export default function Page() {
  return <SalaryHikeCalculator />;
}
