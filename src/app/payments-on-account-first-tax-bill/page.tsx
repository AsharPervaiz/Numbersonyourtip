import { Metadata } from "next";
import PaymentsOnAccount from "../components/PaymentsOnAccount";

export const metadata: Metadata = {
  title: "Your First Tax Bill Is 150% of the Tax You Owe",
  description:
    "HMRC asks for £4,500 on a £3,000 Self Assessment bill. Payments on account explained: where the extra half comes from, the two tests, and why year two costs less.",
  alternates: {
    canonical: "/blog/payments-on-account-first-tax-bill/",
  },
  openGraph: {
    title: "Your First Tax Bill Is 150% of the Tax You Owe",
    description:
      "The January demand is last year settled plus this year started early. The arithmetic, the £1,000 and 80% tests, and what changes in year two.",
    url: "/blog/payments-on-account-first-tax-bill/",
    type: "article",
    publishedTime: "2026-09-22T00:00:00.000Z",
    authors: ["Ashar Pervaiz"],
    section: "Finance",
  },
  twitter: {
    title: "Your First Tax Bill Is 150% of the Tax You Owe",
    description:
      "A £3,000 bill becomes a £4,500 demand. Nothing is wrong — here is the arithmetic behind payments on account.",
  },
};

export default function Page() {
  return <PaymentsOnAccount />;
}
