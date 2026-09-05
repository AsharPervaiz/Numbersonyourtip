import { Metadata } from "next";
import NetWorthGuide from "../components/HowDoICalculateMyNetWorth";

export const metadata: Metadata = {
  title: "How to Calculate Your Net Worth",
  description:
    "Learn how to calculate your net worth easily. Discover the net worth formula, see real-life examples, and use our personal net worth calculator to track your wealth.",
  alternates: {
    canonical: "/blog/how-do-i-calculate-my-net-worth/",
  },
  openGraph: {
    title: "How Do I Calculate My Net Worth? A Step-by-Step Beginner's Guide",
    description:
      "The net worth formula explained with real examples, plus a free calculator to track your wealth over time.",
    url: "/blog/how-do-i-calculate-my-net-worth/",
    type: "article",
    publishedTime: "2026-05-10T00:00:00.000Z",
    authors: ["Ashar Pervaiz"],
    section: "Finance",
  },
  twitter: {
    title: "How to Calculate Your Net Worth",
    description:
      "The formula, worked examples, and a free calculator to track your wealth.",
  },
};

export default function Page() {
  return <NetWorthGuide />;
}
