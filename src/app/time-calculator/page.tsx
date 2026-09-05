import { Metadata } from "next";
import TimeCalculator from "../components/TimeCalculator";

export const metadata: Metadata = {
  title: "Time Calculator — Add and Subtract Hours",
  description:
    "Add and subtract times, find durations, and convert between decimal hours and hours and minutes — including shifts that cross midnight.",
  alternates: {
    canonical: "/time-calculator/",
  },
  openGraph: {
    title: "Time Calculator — Add and Subtract Hours",
    description:
      "Time is base 60, which is the whole problem. Carrying, borrowing, decimal hours and midnight crossings.",
    url: "/time-calculator/",
    type: "article",
  },
  twitter: {
    title: "Time Calculator — Add and Subtract Hours",
    description:
      "Add, subtract and convert times, with decimal hour conversion for timesheets.",
  },
};

export default function Page() {
  return <TimeCalculator />;
}
