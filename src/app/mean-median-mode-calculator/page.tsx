import { Metadata } from "next";
import MeanMedianModeCalculator from "../components/MeanMedianMode";

export const metadata: Metadata = {
  title: "Mean, Median, Mode Calculator | Instant Statistics for Any Dataset",
  description:
    "Calculate mean, median, mode, range, standard deviation, and variance for any dataset instantly. Paste numbers, get full statistics with frequency chart. Free, no sign-up.",
  metadataBase: new URL("https://numbersonyourtip.com"),
  alternates: {
    canonical: "https://numbersonyourtip.com/mean-median-mode-calculator/",
  },
};

export default function Page() {
  return <MeanMedianModeCalculator />;
}
