import { Metadata } from "next";
import OnlinePrivacySecurityBasics from "../components/OnlinePrivacySecurityBasics";

export const metadata: Metadata = {
  title: "What Your IP, DNS and Email Reveal",
  description:
    "Can someone track you with your IP address? Here's what your IP, DNS, email and passwords really reveal — plus free ways to check each one yourself.",
  alternates: {
    canonical: "/blog/online-privacy-security-basics/",
  },
  openGraph: {
    title: "Can Someone Track You With Your IP Address? (Plain English)",
    description:
      "What your IP address, DNS, email and passwords actually reveal about you — explained without jargon, with a free way to check each one yourself.",
    url: "/blog/online-privacy-security-basics/",
    type: "article",
    publishedTime: "2026-08-27T00:00:00.000Z",
    authors: ["Ashar Pervaiz"],
    section: "Networking",
  },
  twitter: {
    title: "Can Someone Track You With Your IP Address?",
    description:
      "What your IP, DNS, email and passwords really reveal — and how to check each one free.",
  },
};

export default function Page() {
  return <OnlinePrivacySecurityBasics />;
}
