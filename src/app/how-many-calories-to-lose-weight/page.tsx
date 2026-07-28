import { Metadata } from "next";
import CaloriesToLoseWeight from "../components/CaloriesToLoseWeight";

export const metadata: Metadata = {
  title: "How Many Calories Should I Eat to Lose Weight? TDEE Explained",
  description:
    "Find your exact daily calorie target for weight loss. Learn the Mifflin-St Jeor TDEE formula, how to set the right deficit, why plateaus happen, and how to break through them — with worked examples and a free calorie calculator.",
  metadataBase: new URL("https://numbersonyourtip.com"),
  alternates: {
    canonical:
      "https://numbersonyourtip.com/blog/how-do-i-calculate-my-net-worth/",
  },
};

export default function Page() {
  return <CaloriesToLoseWeight />;
}
