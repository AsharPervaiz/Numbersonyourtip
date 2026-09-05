import { Metadata } from "next";
import IVCalculator from "../components/IVCalculator";

export const metadata: Metadata = {
  title: "IV & IVIG Infusion Rate Calculator",
  description:
    "Work out IV infusion rate in mL/hr, gravity drip rate, IVIG step-up rates and vial draw volume — including the conversions that go wrong most often.",
  alternates: {
    canonical: "/iv-calculator/",
  },
  openGraph: {
    title: "IV & IVIG Infusion Rate Calculator",
    description:
      "Infusion rate, drip rate, IVIG escalation schedules and vial volumes, with worked examples for pumps and gravity sets.",
    url: "/iv-calculator/",
    type: "article",
  },
  twitter: {
    title: "IV & IVIG Infusion Rate Calculator",
    description:
      "mL/hr, gtt/min, IVIG step-up rates and vial draw volume in one tool.",
  },
};

export default function Page() {
  return <IVCalculator />;
}
