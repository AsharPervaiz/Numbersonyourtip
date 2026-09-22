import { Metadata } from "next";
import BlogsPage from "../components/Blog";
import { POST_COUNT_WORD } from "../data/posts";

export const metadata: Metadata = {
  title: "Guides Behind the Calculators",
  description: `${
    POST_COUNT_WORD.charAt(0).toUpperCase() + POST_COUNT_WORD.slice(1)
  } guides covering what the calculators cannot: what the inputs mean, where the standard formula stops being reliable, and how to spot a wrong answer.`,
  alternates: {
    canonical: "/blog/",
  },
  openGraph: {
    title: "Guides Behind the Calculators",
    description:
      "Finance, health, maths and networking guides written to be read alongside the tool they explain. Clinical guides are medically reviewed.",
    url: "/blog/",
    type: "website",
  },
  twitter: {
    title: "Guides Behind the Calculators",
    description:
      "What the inputs mean, where the formula breaks, and how to spot a wrong answer.",
  },
};

export default function Page() {
  return <BlogsPage />;
}
