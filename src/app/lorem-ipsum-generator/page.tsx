import { Metadata } from "next";
import LoremGenerator from "../components/LoremIpsumGenerator";

export const metadata: Metadata = {
  title:
    "Lorem Ipsum Generator | Free Placeholder Text Tool for Designers & Developers",
  description:
    "Generate Lorem Ipsum placeholder text instantly with exact word count control. Free online tool for UI/UX designers, web developers, and content testers. No sign-up required.",
  metadataBase: new URL("https://numbersonyourtip.com"),
  alternates: {
    canonical: "https://numbersonyourtip.com/lorem-ipsum-generator/",
  },
};

export default function Page() {
  return <LoremGenerator />;
}
