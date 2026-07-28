import { Metadata } from "next";
import WhatIsNumbersOnYourTip from "../components/WhatIsNumbersOnYourTip";

export const metadata: Metadata = {
  title: "What Is Numbers on Your Tip? Free Online Calculators, Zero Sign-Up",
  description:
    "Numbers on Your Tip is a free online calculator platform with 43+ tools across health, finance, daily use, and more. No account, no registration, zero data stored. Here's everything the site offers and who it's built for.",
  metadataBase: new URL("https://numbersonyourtip.com"),
  alternates: {
    canonical: "https://numbersonyourtip.com/blog/what-is-numbers-on-your-tip/",
  },
};

export default function Page() {
  return <WhatIsNumbersOnYourTip />;
}
