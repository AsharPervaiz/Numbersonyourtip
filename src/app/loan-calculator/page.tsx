import { Metadata } from "next";
import LoanCalculator from "../components/LoanCalculator";

export const metadata: Metadata = {
  title: "Loan Calculator — True Cost of Credit",
  description:
    "Compare loan offers on total cost of credit rather than headline rate, see where fees hide, and check affordability against debt-to-income properly.",
  alternates: {
    canonical: "/loan-calculator/",
  },
  openGraph: {
    title: "Loan Calculator — True Cost of Credit",
    description:
      "Why a 9.5% loan can cost more than a 10.5% one, what APR misses, and how to pay off early.",
    url: "/loan-calculator/",
    type: "article",
  },
  twitter: {
    title: "Loan Calculator — True Cost of Credit",
    description:
      "Compare loans on cost of credit, spot hidden fees, and check debt-to-income.",
  },
};

export default function Page() {
  return <LoanCalculator />;
}
