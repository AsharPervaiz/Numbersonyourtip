import { Metadata } from "next";
import DNSLookup from "../components/DNSLookup";

export const metadata: Metadata = {
  title: "Free DNS Lookup Tool | Check A, MX, TXT, NS, CNAME & More",
  description:
    "Instantly look up DNS records for any domain — A, AAAA, MX, TXT, NS, CNAME, SOA, CAA. Free, no sign-up, queries Google's public DNS resolver directly.",
  metadataBase: new URL("https://numbersonyourtip.com"),
  alternates: {
    canonical: "https://numbersonyourtip/dns-lookup/",
  },
};

export default function Page() {
  return <DNSLookup />;
}
