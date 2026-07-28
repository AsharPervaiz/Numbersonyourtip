import { Metadata } from "next";
import CalorieCalculator from "../components/CalorieCalculator";

export const metadata: Metadata = {
  title: "Calorie Calculator | Find Your Daily Calorie Needs for Free",
  description:
    "Use our free calorie calculator to find your BMR, TDEE, and daily calorie needs for weight loss, maintenance, or muscle gain based on the Mifflin-St Jeor formula.",
  metadataBase: new URL("https://numbersonyourtip.com"),
  alternates: {
    canonical: "https://numbersonyourtip.com/calorie-calculator/",
  },
};

export default function Page() {
  return <CalorieCalculator />;
}
