import { Metadata } from "next";
import IPDetector from "../components/IPDetector";

export const metadata: Metadata = {
  title: "IP Address Detector — Your Public IP",
  description:
    "See your public IP address, provider and approximate location — plus how accurate IP geolocation really is and what your address does not reveal.",
  alternates: {
    canonical: "/ip-detector/",
  },
  openGraph: {
    title: "IP Address Detector — Your Public IP",
    description:
      "Your public address is your router's, not your device's. Here is what it reveals and what it does not.",
    url: "/ip-detector/",
    type: "article",
  },
  twitter: {
    title: "IP Address Detector — Your Public IP",
    description:
      "Public IP, provider and approximate location, with honest accuracy limits.",
  },
};

export default function Page() {
  return <IPDetector />;
}
