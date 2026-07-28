import { Metadata } from "next";
import NetWorthCalculator from "../components/NetWorthCalculator";

export const metadata: Metadata = {
  title:
    "Free Net Worth Calculator Online | Assets Minus Liabilities Instantly",
  description:
    "Use our free net worth calculator to find your total net worth by entering assets and liabilities. See debt ratio, health status, and net worth benchmarks by age.",
  metadataBase: new URL("https://numbersonyourtip.com"),
  alternates: {
    canonical: "https://numbersonyourtip.com/net-worth-calculator/",
  },
};

export default function Page() {
  return <NetWorthCalculator />;
}
