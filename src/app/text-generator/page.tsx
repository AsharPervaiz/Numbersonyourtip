import { Metadata } from "next";
import TextGenerator from "../components/TextGenerator";

export const metadata: Metadata = {
  title:
    "Random Text Generator | Free Online English Placeholder Text by Word Count",
  description:
    "Free random text generator online. Generate exact word count English placeholder text for UI mockups, testing & content prototyping — better than Lorem Ipsum.",
  metadataBase: new URL("https://numbersonyourtip.com"),
  alternates: {
    canonical: "https://numbersonyourtip.com/text-generator/",
  },
};

export default function Page() {
  return <TextGenerator />;
}
