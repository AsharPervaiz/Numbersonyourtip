import { Metadata } from "next";
import WordCharCounter from "../components/WordCharCounter";

export const metadata: Metadata = {
  title: "Word & Character Counter | Count Words, Characters & More Instantly",
  description:
    "Free Word and Character Counter to instantly count words, characters, sentences, and paragraphs. Paste your text and get instant analysis for writing, editing, and content creation.",
  metadataBase: new URL("https://numbersonyourtip.com"),
  alternates: {
    canonical: "https://numbersonyourtip.com/word-char-counter/",
  },
};

export default function Page() {
  return <WordCharCounter />;
}
