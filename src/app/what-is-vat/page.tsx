import { Metadata } from "next";
import WhatIsVat from "../components/WhatIsVat";

export const metadata: Metadata = {
  title: "What Is VAT, and Who Actually Pays It?",
  description:
    "VAT is collected at every stage and borne by one person. How the credit chain works, and what you can and cannot reclaim.",
  alternates: {
    canonical: "/blog/what-is-vat/",
  },
  openGraph: {
    title: "What Is VAT? The Chain, the Reclaim and the Threshold",
    description:
      "A worked chain from forest to living room showing why only the final consumer pays, plus what you cannot reclaim and why zero-rated is not exempt.",
    url: "/blog/what-is-vat/",
    type: "article",
    publishedTime: "2026-03-25T00:00:00.000Z",
    modifiedTime: "2026-08-29T00:00:00.000Z",
    authors: ["Ashar Pervaiz"],
    section: "Finance",
  },
  twitter: {
    title: "What Is VAT, and Who Actually Pays It?",
    description:
      "Collected at every stage, borne by one person. The chain, the reclaim, the threshold.",
  },
};

export default function Page() {
  return <WhatIsVat />;
}
