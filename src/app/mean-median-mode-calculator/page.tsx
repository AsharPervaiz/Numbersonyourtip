import { Metadata } from "next";
import MeanMedianMode from "../components/MeanMedianMode";

export const metadata: Metadata = {
  title: "Mean, Median and Mode Calculator",
  description:
    "Calculate mean, median, mode, range and standard deviation from any dataset — and work out which average actually describes your data and which one misleads.",
  alternates: {
    canonical: "/mean-median-mode-calculator/",
  },
  openGraph: {
    title: "Mean, Median and Mode Calculator",
    description:
      "Mean, median, mode, range and standard deviation, plus what the gap between mean and median tells you.",
    url: "/mean-median-mode-calculator/",
    type: "article",
  },
  twitter: {
    title: "Mean, Median and Mode Calculator",
    description:
      "Mean, median, mode, range and standard deviation for any list of numbers.",
  },
};

export default function Page() {
  return <MeanMedianMode />;
}
