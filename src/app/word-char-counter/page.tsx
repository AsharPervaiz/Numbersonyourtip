import { Metadata } from "next";
import WordCharCounter from "../components/WordCharCounter";

export const metadata: Metadata = {
  title: "Word & Character Counter",
  description:
    "Count words, characters, sentences and reading time as you type, and find out why two tools can disagree about the same text.",
  alternates: {
    canonical: "/word-char-counter/",
  },
  openGraph: {
    title: "Word & Character Counter",
    description:
      "What counts as a word, characters with and without spaces, and why emoji break limits.",
    url: "/word-char-counter/",
    type: "article",
  },
  twitter: {
    title: "Word & Character Counter",
    description:
      "Count words, characters and reading time, with nothing sent to a server.",
  },
};

export default function Page() {
  return <WordCharCounter />;
}
