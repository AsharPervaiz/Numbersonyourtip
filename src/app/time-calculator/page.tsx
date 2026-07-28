import { Metadata } from "next";
import TimeCalculator from "../components/TimeCalculator";

export const metadata: Metadata = {
  title:
    "Free Time Calculator – Add Hours & Minutes, Time Difference & Conversions",
  description:
    "Free time calculator — add or subtract hours and minutes, find hours between two times, convert minutes to hours, and see what time it will be in X hours. Instant results.",
  metadataBase: new URL("https://numbersonyourtip.com"),
  alternates: {
    canonical: "https://numbersonyourtip.com/time-calculator/",
  },
};

export default function Page() {
  return <TimeCalculator />;
}
