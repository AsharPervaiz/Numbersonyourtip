import { Metadata } from "next";
import NetWorthCalculator from "../components/NetWorthCalculator";

export const metadata: Metadata = {
  title: "Net Worth Calculator — Assets Minus Debts",
  description:
    "Work out your net worth, with clear answers on how to value a house, car or pension, which debts get forgotten, and why liquid net worth matters more.",
  alternates: {
    canonical: "/net-worth-calculator/",
  },
  openGraph: {
    title: "Net Worth Calculator — Assets Minus Debts",
    description:
      "The subtraction is easy; the judgement calls decide whether the number means anything.",
    url: "/net-worth-calculator/",
    type: "article",
  },
  twitter: {
    title: "Net Worth Calculator — Assets Minus Debts",
    description:
      "How to value what you own, list what you owe, and track total versus liquid net worth.",
  },
};

export default function Page() {
  return <NetWorthCalculator />;
}
