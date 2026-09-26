import { Metadata } from "next";
import ChildBenefitCharge from "../components/ChildBenefitCharge";

export const metadata: Metadata = {
  title: "£80,000 Loses Child Benefit. £118,000 Keeps It.",
  description:
    "The high income child benefit charge reads one income, not the household's. How the clawback works, and why a parent of four keeps 37p of each extra pound.",
  alternates: {
    canonical: "/blog/high-income-child-benefit-charge/",
  },
  openGraph: {
    title: "£80,000 Loses Child Benefit. £118,000 Keeps It.",
    description:
      "One income decides the charge, never the household's. The £200 steps, the marginal rate by number of children, and the pension contribution that removes it.",
    url: "/blog/high-income-child-benefit-charge/",
    type: "article",
    publishedTime: "2026-09-26T00:00:00.000Z",
    authors: ["Ashar Pervaiz"],
    section: "Finance",
  },
  twitter: {
    title: "£80,000 Loses Child Benefit. £118,000 Keeps It.",
    description:
      "Two earners on £59,000 keep every penny. One earner on £80,000 keeps none. Here is the arithmetic behind that.",
  },
};

export default function Page() {
  return <ChildBenefitCharge />;
}
