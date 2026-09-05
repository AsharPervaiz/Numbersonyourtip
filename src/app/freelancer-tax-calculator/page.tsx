import { Metadata } from "next";
import FreelancerTaxCalculator from "../components/FreelancerTaxCalculator";

export const metadata: Metadata = {
  title: "Freelance Tax & Income Calculator",
  description:
    "Work out freelance take-home from invoiced revenue — platform fees, deductible expenses, tax and contributions, and how much to set aside from each payment.",
  alternates: {
    canonical: "/freelancer-tax-calculator/",
  },
  openGraph: {
    title: "Freelance Tax & Income Calculator",
    description:
      "The four numbers between an invoice and your take-home, and the percentage to reserve from every payment.",
    url: "/freelancer-tax-calculator/",
    type: "article",
  },
  twitter: {
    title: "Freelance Tax & Income Calculator",
    description:
      "Freelance take-home after fees, expenses, tax and contributions — plus what to set aside.",
  },
};

export default function Page() {
  return <FreelancerTaxCalculator />;
}
