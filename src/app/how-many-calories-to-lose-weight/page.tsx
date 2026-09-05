import { Metadata } from "next";
import CaloriesToLoseWeight from "../components/CaloriesToLoseWeight";

export const metadata: Metadata = {
  title: "How Many Calories to Lose Weight?",
  description:
    "Working out a deficit you can actually hold, why the first two weeks mislead almost everybody, and what a plateau really is.",
  alternates: {
    canonical: "/blog/how-many-calories-to-lose-weight/",
  },
  openGraph: {
    title: "How Many Calories Should I Eat to Lose Weight? TDEE Explained",
    description:
      "Your exact daily calorie target — the Mifflin-St Jeor formula, the right deficit, why plateaus happen, and how to break through.",
    url: "/blog/how-many-calories-to-lose-weight/",
    type: "article",
    publishedTime: "2026-07-26T00:00:00.000Z",
    authors: ["Ashar Pervaiz"],
    section: "Health",
  },
  twitter: {
    title: "How Many Calories to Lose Weight?",
    description:
      "Mifflin-St Jeor TDEE, the right deficit, and how to break plateaus.",
  },
};

export default function Page() {
  return <CaloriesToLoseWeight />;
}
