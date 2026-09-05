import { Metadata } from "next";
import ZakatOnGold from "../components/ZakatOnGold";

export const metadata: Metadata = {
  title: "Zakat on Gold: Why Karat Decides It",
  description:
    "Nisab is a weight of pure gold, so 22K jewellery needs 95.5 g to reach it, not 87.48 g. The purity step, the two nisab figures, and the school differences.",
  alternates: {
    canonical: "/blog/zakat-on-gold-nisab-and-karat/",
  },
  openGraph: {
    title: "Zakat on Gold: Why Karat Decides the Answer",
    description:
      "The nisab threshold is measured in pure gold, not gross weight. What each karat has to weigh to reach it, why two nisab figures circulate, and where the schools differ.",
    url: "/blog/zakat-on-gold-nisab-and-karat/",
    type: "article",
    publishedTime: "2026-09-05T00:00:00.000Z",
    authors: ["Ashar Pervaiz"],
    section: "Finance",
  },
  twitter: {
    title: "Zakat on Gold: Why Karat Decides It",
    description:
      "Nisab is pure gold weight. 22K jewellery needs 95.5 g to reach it, not 87.48 g.",
  },
};

export default function Page() {
  return <ZakatOnGold />;
}
