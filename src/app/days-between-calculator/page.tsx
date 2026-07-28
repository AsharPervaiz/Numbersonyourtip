import { Metadata } from "next";
import DaysBetweenCalculator from "../components/DaysBetweenCalculator";

export const metadata: Metadata = {
  title:
    "Days Between Dates Calculator | How Many Days Until or Since Any Date",
  description:
    "Free days between dates calculator — find exact days, weeks, months, and years between any two dates. Quick reference for 30, 60, 90, and 180 days from today.",
  metadataBase: new URL("https://numbersonyourtip.com"),
  alternates: {
    canonical: "https://numbersonyourtip.com/days-between-calculator/",
  },
};

export default function Page() {
  return <DaysBetweenCalculator />;
}
