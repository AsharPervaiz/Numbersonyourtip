import { Metadata } from "next";
import EMICalculator from "../components/EMICalculator";

export const metadata: Metadata = {
  title: "EMI Calculator | Calculate Your Monthly Loan Installment Online",
  description:
    "Use our free EMI calculator online to instantly find your monthly loan payment, total interest, and repayment breakdown for home, car, personal, and education loans.",
  metadataBase: new URL("https://numbersonyourtip.com"),
  alternates: {
    canonical: "https://numbersonyourtip.com/emi-calculator/",
  },
};

export default function Page() {
  return <EMICalculator />;
}
