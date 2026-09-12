import { Metadata } from "next";
import Shrinkflation from "../components/Shrinkflation";

export const metadata: Metadata = {
  title: "Shrinkflation and the True Unit Price",
  description:
    "A pack that loses a tenth of its contents costs 11.11% more per gram, not 10%. The arithmetic that makes a hidden price rise visible again.",
  alternates: {
    canonical: "/blog/shrinkflation-and-unit-price/",
  },
  openGraph: {
    title: "Shrinkflation and the True Unit Price",
    description:
      "Why a tenth smaller is an eleventh dearer, why a discount can be smaller than the shrink it follows, and how to compare packs labelled in different units.",
    url: "/blog/shrinkflation-and-unit-price/",
    type: "article",
    publishedTime: "2026-09-12T00:00:00.000Z",
    authors: ["Ashar Pervaiz"],
    section: "Daily Use",
  },
  twitter: {
    title: "Shrinkflation and the True Unit Price",
    description:
      "A tenth smaller is an eleventh dearer. The arithmetic behind a price rise you cannot see.",
  },
};

export default function Page() {
  return <Shrinkflation />;
}
