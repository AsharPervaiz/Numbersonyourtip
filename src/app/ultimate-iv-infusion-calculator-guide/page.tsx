import { Metadata } from "next";
import IVCalculatorBlogPost from "../components/UltimateIVInfusionCalculatorGuide";

export const metadata: Metadata = {
  title: "IV Infusion Calculations Explained",
  description:
    "Drip rate, pump rate, mg/kg and mcg/kg/min worked step by step — plus why a stepped IVIG infusion takes over an hour longer than volume divided by rate suggests.",
  alternates: {
    canonical: "/blog/ultimate-iv-infusion-calculator-guide/",
  },
  openGraph: {
    title: "IV Infusion Calculations: Drip Rates, Pump Rates and IVIG Ramps",
    description:
      "Four calculations that get called IV maths, worked in full, with the unit conversions that cause most errors.",
    url: "/blog/ultimate-iv-infusion-calculator-guide/",
    type: "article",
    publishedTime: "2026-04-13T00:00:00.000Z",
    modifiedTime: "2026-08-29T00:00:00.000Z",
    authors: ["Ashar Pervaiz"],
    section: "Health",
  },
  twitter: {
    title: "IV Infusion Calculations Explained",
    description:
      "Why a stepped IVIG infusion runs an hour longer than the simple calculation says.",
  },
};

export default function Page() {
  return <IVCalculatorBlogPost />;
}
