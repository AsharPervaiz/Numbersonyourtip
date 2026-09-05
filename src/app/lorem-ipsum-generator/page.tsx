import { Metadata } from "next";
import LoremIpsumGenerator from "../components/LoremIpsumGenerator";

export const metadata: Metadata = {
  title: "Lorem Ipsum Generator",
  description:
    "Generate lorem ipsum placeholder text, and understand what it shows you about a layout and the failure cases it quietly hides.",
  alternates: {
    canonical: "/lorem-ipsum-generator/",
  },
  openGraph: {
    title: "Lorem Ipsum Generator",
    description:
      "Why designers use fake Latin, what it hides, and how to get it out before launch.",
    url: "/lorem-ipsum-generator/",
    type: "article",
  },
  twitter: {
    title: "Lorem Ipsum Generator",
    description:
      "Generate lorem ipsum placeholder text by paragraphs, words or sentences.",
  },
};

export default function Page() {
  return <LoremIpsumGenerator />;
}
