import { Metadata } from "next";
import GPACalculator from "../components/GPACalculator";

export const metadata: Metadata = {
  title: "GPA Calculator with Credit Hours",
  description:
    "Calculate semester and cumulative GPA weighted by credit hours, and work out the grades you need next term to reach a target GPA.",
  alternates: {
    canonical: "/gpa-calculator/",
  },
  openGraph: {
    title: "GPA Calculator with Credit Hours",
    description:
      "Why a plain average of your grades is the wrong answer, and why cumulative GPA gets harder to move.",
    url: "/gpa-calculator/",
    type: "article",
  },
  twitter: {
    title: "GPA Calculator with Credit Hours",
    description:
      "Semester and cumulative GPA weighted by credits, plus target GPA planning.",
  },
};

export default function Page() {
  return <GPACalculator />;
}
