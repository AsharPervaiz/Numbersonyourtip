import { Metadata } from "next";
import MatrixCalculatorGuide from "../components/MatrixCalculatorGuide";

export const metadata: Metadata = {
  title: "Every Matrix Operation, Worked by Hand",
  description:
    "Every matrix operation worked by hand, with the shape rules that decide whether an operation is defined before you attempt it.",
  alternates: {
    canonical: "/blog/matrix-calculator-guide/",
  },
  openGraph: {
    title:
      "Matrix Calculator: Guide to Determinants, Inverse, Rank & More (Free)",
    description:
      "Every operation covered — 2×2 inverse, 3×3 and 4×4 determinants, cofactor, adjoint, rank, diagonalization, and Ax=b — with formulas and worked examples.",
    url: "/blog/matrix-calculator-guide/",
    type: "article",
    publishedTime: "2026-07-12T00:00:00.000Z",
    authors: ["Ashar Pervaiz"],
    section: "Maths",
  },
  twitter: {
    title: "Matrix Calculator Guide",
    description:
      "Determinants, inverse, rank, diagonalization, and Ax=b — with worked examples.",
  },
};

export default function Page() {
  return <MatrixCalculatorGuide />;
}
