import { Metadata } from "next";
import DNSLookup from "../components/DNSLookup";

export const metadata: Metadata = {
  title: "DNS Lookup — A, MX, TXT, NS and CNAME",
  description:
    "Look up DNS records for any domain, and understand what TTL, caching and each record type mean — including why your change has not appeared yet.",
  alternates: {
    canonical: "/dns-lookup/",
  },
  openGraph: {
    title: "DNS Lookup — A, MX, TXT, NS and CNAME",
    description:
      "Every record type answers a different question. Plus why nothing actually propagates.",
    url: "/dns-lookup/",
    type: "article",
  },
  twitter: {
    title: "DNS Lookup — A, MX, TXT, NS and CNAME",
    description:
      "DNS records for any domain, with TTL, caching and mail authentication explained.",
  },
};

export default function Page() {
  return <DNSLookup />;
}
