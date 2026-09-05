import { Metadata } from "next";
import TextConverter from "../components/TextConverter";

export const metadata: Metadata = {
  title: "Text Case Converter — Title, Sentence",
  description:
    "Convert text between upper, lower, title, sentence and toggle case — and see why automatic title case never matches every style guide.",
  alternates: {
    canonical: "/text-converter/",
  },
  openGraph: {
    title: "Text Case Converter — Title, Sentence",
    description:
      "Title case is not one rule. Plus what case conversion permanently destroys.",
    url: "/text-converter/",
    type: "article",
  },
  twitter: {
    title: "Text Case Converter — Title, Sentence",
    description:
      "Convert text between upper, lower, title, sentence and toggle case.",
  },
};

export default function Page() {
  return <TextConverter />;
}
