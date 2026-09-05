import { Metadata } from "next";
import DomainNameChecker from "../components/DomainNameChecker";

export const metadata: Metadata = {
  title: "Domain Name Checker — Availability & Price",
  description:
    "Check domain availability across extensions, and the three things availability does not tell you: premium pricing, trademark risk and the domain's past.",
  alternates: {
    canonical: "/domain-name-checker/",
  },
  openGraph: {
    title: "Domain Name Checker — Availability & Price",
    description:
      "Available is the first check, not the only one. Premium pricing, renewals, trademarks and domain history.",
    url: "/domain-name-checker/",
    type: "article",
  },
  twitter: {
    title: "Domain Name Checker — Availability & Price",
    description:
      "Domain availability across extensions, plus what to check before you register.",
  },
};

export default function Page() {
  return <DomainNameChecker />;
}
