import { Metadata } from "next";
import BodyFatPercentage from "../components/HealthyBodyFat";

export const metadata: Metadata = {
  title:
    "Healthy Body Fat Percentage by Age and Gender: The Complete Chart Guide",
  description:
    "What's a healthy body fat percentage for your age? See the full NIH/WHO and ACE charts for men and women by decade — from your 20s to 60s — plus how to measure it, what visceral fat means, and what to do about your number.",
  metadataBase: new URL("https://numbersonyourtip.com"),
  alternates: {
    canonical:
      "https://numbersonyourtip.com/blog/healthy-bodyfat-percentage-by-age-and-gender/",
  },
};

export default function Page() {
  return <BodyFatPercentage />;
}
