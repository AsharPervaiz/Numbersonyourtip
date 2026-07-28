import { Metadata } from "next";
import NetWorthGuide from "../components/HowDoICalculateMyNetWorth";

export const metadata: Metadata = {
  title: "How Do I Calculate My Net Worth? A Step-by-Step Beginner's Guide",
  description:
    "Learn how to calculate your net worth easily. Discover the net worth formula, see real-life examples, and use our personal net worth calculator to track your wealth.",
  metadataBase: new URL("https://numbersonyourtip.com"),
  alternates: {
    canonical:
      "https://numbersonyourtip.com/blog/how-do-i-calculate-my-net-worth/",
  },
};

export default function Page() {
  return <NetWorthGuide />;
}
