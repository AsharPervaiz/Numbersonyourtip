import { Metadata } from "next";
import TextGenerator from "../components/TextGenerator";

export const metadata: Metadata = {
  title: "Random Text Generator",
  description:
    "Generate random placeholder text by word count, and see which values actually break an input field — empty strings, emoji, accents and over-length entries.",
  alternates: {
    canonical: "/text-generator/",
  },
  openGraph: {
    title: "Random Text Generator",
    description:
      "Placeholder text and test data are different jobs. Here is what each one needs to be.",
    url: "/text-generator/",
    type: "article",
  },
  twitter: {
    title: "Random Text Generator",
    description:
      "Random placeholder text by word count, plus test values that find real bugs.",
  },
};

export default function Page() {
  return <TextGenerator />;
}
