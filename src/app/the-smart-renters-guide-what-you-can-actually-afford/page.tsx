import { Metadata } from "next";
import RentCalculatorBlogPost from "../components/TheSmartRentersGuide";

export const metadata: Metadata = {
  title: "The Smart Renter’s Guide: What You Can Actually Afford",
  description:
    "Discover exactly how much rent you can afford with our comprehensive guide. Explore global housing rules, debt-to-income ratios, and use our house rent calculator to budget smartly.",
  metadataBase: new URL("https://numbersonyourtip.com"),
  alternates: {
    canonical:
      "https://numbersonyourtip.com/blog/the-smart-renters-guide-what-you-can-actually-afford/",
  },
};

export default function Page() {
  return <RentCalculatorBlogPost />;
}
