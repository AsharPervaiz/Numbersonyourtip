import { Metadata } from "next";
import CalorieCalculator from "../components/CalorieCalculator";

export const metadata: Metadata = {
  title: "Calorie Calculator — BMR and Daily Needs",
  description:
    "Estimate daily calorie needs from BMR and activity level, find out which part of the estimate is unreliable, and test the number against two weeks of data.",
  alternates: {
    canonical: "/calorie-calculator/",
  },
  openGraph: {
    title: "Calorie Calculator — BMR and Daily Needs",
    description:
      "Daily calorie needs, why the activity multiplier carries most of the error, and how to find your real maintenance figure.",
    url: "/calorie-calculator/",
    type: "article",
  },
  twitter: {
    title: "Calorie Calculator — BMR and Daily Needs",
    description:
      "BMR, daily energy needs, and how to test the estimate against real data.",
  },
};

export default function Page() {
  return <CalorieCalculator />;
}
