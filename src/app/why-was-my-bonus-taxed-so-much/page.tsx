import { Metadata } from "next";
import WhyWasMyBonusTaxedSoMuch from "../components/BonusTaxed";

export const metadata: Metadata = {
  title: "Why Was My Bonus Taxed So Much?",
  description:
    "Withholding is not tax owed. Why the flat supplemental rate makes the deduction look brutal, and when it comes back.",
  alternates: {
    canonical: "/blog/why-was-my-bonus-taxed-so-much/",
  },
  openGraph: {
    title: "Why Was My Bonus Taxed So Much? The 22% Rule Explained",
    description:
      "The 22% federal rule, FICA and state on top, the aggregate method, and whether you get money back — with 2026 IRS rates and worked examples.",
    url: "/blog/why-was-my-bonus-taxed-so-much/",
    type: "article",
    publishedTime: "2026-08-07T00:00:00.000Z",
    authors: ["Ashar Pervaiz"],
    section: "Finance",
  },
  twitter: {
    title: "Why Was My Bonus Taxed So Much?",
    description: "The 22% rule, FICA, state, and whether you get money back.",
  },
};

export default function Page() {
  return <WhyWasMyBonusTaxedSoMuch />;
}
