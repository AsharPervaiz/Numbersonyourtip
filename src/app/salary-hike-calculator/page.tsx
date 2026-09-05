import { Metadata } from "next";
import SalaryHikeCalculator from "../components/SalaryHikeCalculator";

export const metadata: Metadata = {
  title: "Salary Hike Calculator — Percentage & Real Terms",
  description:
    "Work out a salary increase percentage, check it against inflation in real terms, and compare an internal raise with an external offer on the full package.",
  alternates: {
    canonical: "/salary-hike-calculator/",
  },
  openGraph: {
    title: "Salary Hike Calculator — Percentage & Real Terms",
    description:
      "Hike percentage from two salaries, why the base matters, and when a raise is really a pay cut.",
    url: "/salary-hike-calculator/",
    type: "article",
  },
  twitter: {
    title: "Salary Hike Calculator — Percentage & Real Terms",
    description:
      "Salary increase percentage, real-terms value after inflation, and offer comparison.",
  },
};

export default function Page() {
  return <SalaryHikeCalculator />;
}
