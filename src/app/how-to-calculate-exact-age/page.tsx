import { Metadata } from "next";
import HowToCalculateExactAge from "../components/HowToCalculateExactAge";

export const metadata: Metadata = {
  title: "How to Calculate Your Exact Age",
  description:
    "Three-column subtraction with borrowing, the six places it reliably goes wrong, and how a 29 February birthday is treated.",
  alternates: {
    canonical: "/blog/how-to-calculate-exact-age/",
  },
  openGraph: {
    title: "How to Calculate Your Exact Age in Years, Months, and Days",
    description:
      "The three-column subtraction method explained, plus worked examples, leap-year edge cases, and a free calculator to verify your result.",
    url: "/blog/how-to-calculate-exact-age/",
    type: "article",
    publishedTime: "2026-08-03T00:00:00.000Z",
    authors: ["Ashar Pervaiz"],
    section: "Daily Use",
  },
  twitter: {
    title: "How to Calculate Your Exact Age",
    description:
      "The three-column method, worked examples, and leap-year edge cases.",
  },
};

export default function Page() {
  return <HowToCalculateExactAge />;
}
