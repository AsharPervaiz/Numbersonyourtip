import { Metadata } from "next";
import TimeZone from "../components/TimeZone";

export const metadata: Metadata = {
  title: "Time Zone Converter & World Clock",
  description:
    "Convert times between cities worldwide, and avoid the four assumptions that break cross-zone scheduling — fixed offsets, whole hours, and ambiguous abbreviations.",
  alternates: {
    canonical: "/time-zone-converter/",
  },
  openGraph: {
    title: "Time Zone Converter & World Clock",
    description:
      "Why recurring meetings drift by an hour, and why CST can mean three different zones.",
    url: "/time-zone-converter/",
    type: "article",
  },
  twitter: {
    title: "Time Zone Converter & World Clock",
    description:
      "Convert times between cities, with the scheduling traps that catch people out.",
  },
};

export default function Page() {
  return <TimeZone />;
}
