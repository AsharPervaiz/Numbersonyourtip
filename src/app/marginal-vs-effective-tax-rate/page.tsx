import { Metadata } from "next";
import MarginalVsEffectiveTaxRate from "../components/MarginalVsEffectiveTaxRate";

export const metadata: Metadata = {
  title: "Marginal vs Effective Tax Rate",
  description:
    "A raise that crosses a bracket never lowers your take-home pay. What each rate measures, and where the confusion comes from.",
  alternates: {
    canonical: "/blog/marginal-vs-effective-tax-rate/",
  },
  openGraph: {
    title: "Marginal vs Effective Tax Rate: The Difference Explained",
    description:
      "2026 IRS brackets, worked examples, side-by-side comparison, and why a raise never actually reduces your take-home pay.",
    url: "/blog/marginal-vs-effective-tax-rate/",
    type: "article",
    publishedTime: "2026-08-05T00:00:00.000Z",
    authors: ["Ashar Pervaiz"],
    section: "Finance",
  },
  twitter: {
    title: "Marginal vs Effective Tax Rate",
    description: "The real difference, with 2026 brackets and worked examples.",
  },
};

export default function Page() {
  return <MarginalVsEffectiveTaxRate />;
}
