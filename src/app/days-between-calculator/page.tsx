import { Metadata } from "next";
import DaysBetweenCalculator from "../components/DaysBetweenCalculator";

export const metadata: Metadata = {
  title: "Days Between Dates Calculator",
  description:
    "Count days between two dates, days since a past date, or what date falls 30, 60 or 90 days from today — and why counting both ends changes the answer.",
  alternates: {
    canonical: "/days-between-calculator/",
  },
  openGraph: {
    title: "Days Between Dates Calculator",
    description:
      "Days since, days until, and what date falls N days out — plus the off-by-one problem that trips up deadlines.",
    url: "/days-between-calculator/",
    type: "article",
  },
  twitter: {
    title: "Days Between Dates Calculator",
    description:
      "Days between any two dates, days since, days until, and dates N days from today.",
  },
};

export default function Page() {
  return <DaysBetweenCalculator />;
}
