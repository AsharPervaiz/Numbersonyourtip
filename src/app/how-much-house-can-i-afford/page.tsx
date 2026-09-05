import { Metadata } from "next";
import HowMuchHouseCanIAfford from "../components/HouseAfford";

export const metadata: Metadata = {
  title: "How Much House Can I Afford?",
  description:
    "The 28/36 rule, everything PITI includes, and the ownership costs budgets leave out until the first bill arrives.",
  alternates: {
    canonical: "/blog/how-much-house-can-i-afford/",
  },
  openGraph: {
    title: "How Much House Can I Afford? 2026 Mortgage Calculator Guide",
    description:
      "The 28/36 rule, current mortgage rates, DTI limits, and affordability numbers by income — with a free calculator for your exact answer.",
    url: "/blog/how-much-house-can-i-afford/",
    type: "article",
    publishedTime: "2026-07-30T00:00:00.000Z",
    authors: ["Ashar Pervaiz"],
    section: "Finance",
  },
  twitter: {
    title: "How Much House Can I Afford in 2026?",
    description:
      "28/36 rule, current rates, DTI limits, and real numbers by income.",
  },
};

export default function Page() {
  return <HowMuchHouseCanIAfford />;
}
