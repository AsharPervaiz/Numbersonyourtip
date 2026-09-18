import { Metadata } from "next";
import EnergyPriceCap from "../components/EnergyPriceCap";

export const metadata: Metadata = {
  title: "The Energy Price Cap Is Not a Cap on Your Bill",
  description:
    "The energy price cap limits unit rates and standing charges, not your total. Where £1,723 comes from, and why using 20% less energy takes only 16% off the bill.",
  alternates: {
    canonical: "/blog/energy-price-cap-what-it-actually-caps/",
  },
  openGraph: {
    title: "The Energy Price Cap Is Not a Cap on Your Bill",
    description:
      "The headline figure rebuilt from the published rates, the £308 you pay before using anything, and why a fifth less energy is not a fifth off what you pay.",
    url: "/blog/energy-price-cap-what-it-actually-caps/",
    type: "article",
    publishedTime: "2026-09-19T00:00:00.000Z",
    authors: ["Ashar Pervaiz"],
    section: "Daily Use",
  },
  twitter: {
    title: "The Energy Price Cap Is Not a Cap on Your Bill",
    description:
      "£1,723 is not a maximum. It is one household's arithmetic, and here is how it is built.",
  },
};

export default function Page() {
  return <EnergyPriceCap />;
}
