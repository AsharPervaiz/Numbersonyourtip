import { Metadata } from "next";
import BMICalculator from "../components/BMICalculator";

export const metadata: Metadata = {
  title: "BMI Calculator in kg, cm, Feet and Inches",
  description:
    "Calculate BMI from kg and cm, kg and feet, or pounds and inches — plus what age, sex and population cut-offs actually change about the result.",
  alternates: {
    canonical: "/bmi-calculator/",
  },
  openGraph: {
    title: "BMI Calculator in kg, cm, Feet and Inches",
    description:
      "BMI in any unit combination, with the four situations where the number misleads and what to measure alongside it.",
    url: "/bmi-calculator/",
    type: "article",
  },
  twitter: {
    title: "BMI Calculator in kg, cm, Feet and Inches",
    description:
      "BMI from any unit combination, and what the categories can and cannot tell you.",
  },
};

export default function Page() {
  return <BMICalculator />;
}
