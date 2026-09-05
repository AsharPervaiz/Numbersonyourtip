import { Metadata } from "next";
import BodyFatPercentage from "../components/HealthyBodyFat";

export const metadata: Metadata = {
  title: "Healthy Body Fat Percentage by Age",
  description:
    "What the standard body fat ranges actually mean, how they shift by decade, and why where the fat sits matters more than the number.",
  alternates: {
    canonical: "/blog/healthy-bodyfat-percentage-by-age-and-gender/",
  },
  openGraph: {
    title:
      "Healthy Body Fat Percentage by Age and Gender: The Complete Chart Guide",
    description:
      "Full NIH/WHO and ACE charts by decade for men and women, how to measure body fat, what visceral fat really means, and how to act on your number.",
    url: "/blog/healthy-bodyfat-percentage-by-age-and-gender/",
    type: "article",
    publishedTime: "2026-06-20T00:00:00.000Z",
    authors: ["Ashar Pervaiz"],
    section: "Health",
  },
  twitter: {
    title: "Healthy Body Fat % by Age and Gender",
    description:
      "Full charts by decade for men and women — plus how to measure and act on it.",
  },
};

export default function Page() {
  return <BodyFatPercentage />;
}
