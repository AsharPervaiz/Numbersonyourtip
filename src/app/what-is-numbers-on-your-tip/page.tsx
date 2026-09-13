import { Metadata } from "next";
import WhatIsNumbersOnYourTip from "../components/WhatIsNumbersOnYourTip";

export const metadata: Metadata = {
  title: "What Is Numbers on Your Tip?",
  description:
    "What this site is, who builds it, how it is funded, and what happens to the numbers you type — which is nothing.",
  alternates: {
    canonical: "/blog/what-is-numbers-on-your-tip/",
  },
  openGraph: {
    title: "What Is Numbers on Your Tip? Free Online Calculators, Zero Sign-Up",
    description:
      "49 free calculators across health, finance, and daily use. No account, no data stored — here's everything the site offers and who it's for.",
    url: "/blog/what-is-numbers-on-your-tip/",
    type: "article",
    publishedTime: "2026-07-03T00:00:00.000Z",
    authors: ["Ashar Pervaiz"],
    section: "Daily Use",
  },
  twitter: {
    title: "What Is Numbers on Your Tip?",
    description:
      "49 free calculators, no sign-up, nothing stored. Here's the tour.",
  },
};

export default function Page() {
  return <WhatIsNumbersOnYourTip />;
}
