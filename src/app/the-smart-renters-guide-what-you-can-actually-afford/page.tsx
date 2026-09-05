import { Metadata } from "next";
import RentCalculatorBlogPost from "../components/TheSmartRentersGuide";

export const metadata: Metadata = {
  title: "How Much Rent Can You Actually Afford?",
  description:
    "The 30% rule is a starting point, not an answer. Deposits, the costs outside rent, and what an affordability check tests.",
  alternates: {
    canonical: "/blog/the-smart-renters-guide-what-you-can-actually-afford/",
  },
  openGraph: {
    title: "The Smart Renter's Guide: What You Can Actually Afford",
    description:
      "Global housing rules, debt-to-income ratios, and a free calculator to figure out what rent you can actually afford.",
    url: "/blog/the-smart-renters-guide-what-you-can-actually-afford/",
    type: "article",
    publishedTime: "2026-05-01T00:00:00.000Z",
    authors: ["Ashar Pervaiz"],
    section: "Finance",
  },
  twitter: {
    title: "The Smart Renter's Guide",
    description:
      "Housing rules, DTI ratios, and a free calculator for realistic rent.",
  },
};

export default function Page() {
  return <RentCalculatorBlogPost />;
}
