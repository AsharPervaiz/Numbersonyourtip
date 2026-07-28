import { Metadata } from "next";
import IPDetector from "../components/IPDetector";

export const metadata: Metadata = {
  title: "Free IP Address Detector | Find Your IP & Location Instantly",
  description:
    "Instantly detect your public IP address, ISP, city, country, timezone, and ASN. Look up any IP for free — no sign-up, no limits, works on all devices.",
  metadataBase: new URL("https://numbersonyourtip.com"),
  alternates: {
    canonical: "https://numbersonyourtip.com/ip-detector/",
  },
};

export default function Page() {
  return <IPDetector />;
}
