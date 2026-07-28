import { Metadata } from "next";
import TextConverter from "../components/TextConverter";

export const metadata: Metadata = {
  title:
    "Text Case Converter | Free Online UPPERCASE, camelCase, snake_case & More",
  description:
    "Free text case converter online. Convert to UPPERCASE, lowercase, Title Case, camelCase, PascalCase, snake_case & kebab-case instantly — no signup.",
  metadataBase: new URL("https://numbersonyourtip.com"),
  alternates: {
    canonical: "https://numbersonyourtip.com/text-converter/",
  },
};

export default function Page() {
  return <TextConverter />;
}
