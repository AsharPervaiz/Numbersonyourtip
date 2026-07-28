import { Metadata } from "next";
import DomainLookup from "../components/DomainNameChecker";

export const metadata: Metadata = {
  title: "Free Domain Name Checker | Check Availability Across All Extensions",
  description:
    "Free domain name checker — check if a website name is taken across .com, .net, .org, .io, .co, .dev, .app, and .ai at once. No sign-up, no purchase required, live RDAP/WHOIS data.",
  metadataBase: new URL("https://numbersonyourtip.com"),
  alternates: {
    canonical: "https://numbersonyourtip/domain-name-checker/",
  },
};

export default function Page() {
  return <DomainLookup />;
}
