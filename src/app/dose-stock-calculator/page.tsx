import { Metadata } from "next";
import DoseStockCalculator from "../components/DoseStockCalculator";

export const metadata: Metadata = {
  title: "Dose Stock Calculator — Desired Over Have",
  description:
    "Work out tablets, syrup volume or vial draw from stock strength using desired over have times quantity, with label-reading and percentage conversions.",
  alternates: {
    canonical: "/dose-stock-calculator/",
  },
  openGraph: {
    title: "Dose Stock Calculator — Desired Over Have",
    description:
      "The D ÷ H × Q formula applied to tablets, per-5-mL suspensions and vials, including what to do when the answer is a fraction.",
    url: "/dose-stock-calculator/",
    type: "article",
  },
  twitter: {
    title: "Dose Stock Calculator — Desired Over Have",
    description:
      "Tablets, syrup volume and vial draw from the stock strength on the label.",
  },
};

export default function Page() {
  return <DoseStockCalculator />;
}
