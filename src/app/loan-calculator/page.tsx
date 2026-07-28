import { Metadata } from "next";
import LoanCalculator from "../components/LoanCalculator";

export const metadata: Metadata = {
  title: "Loan Calculator Online – EMI, Total Interest & Loan Cost Instantly",
  description:
    "Free loan calculator with monthly payment, total interest, processing fees, and interest burden gauge. Works for personal, home, car, education, and business loans.",
  metadataBase: new URL("https://numbersonyourtip.com"),
  alternates: {
    canonical: "https://numbersonyourtip.com/loan-calculator/",
  },
};

export default function Page() {
  return <LoanCalculator />;
}
