import { Metadata } from "next";
import MatrixCalculator from "../components/MatrixCalculator";

export const metadata: Metadata = {
  title: "Matrix Calculator — Multiply, Invert, Solve",
  description:
    "Matrix addition, multiplication, determinant, inverse, adjoint, rank, trace, RREF and solving AX = B — plus why each dimension error happens and how to fix it.",
  alternates: {
    canonical: "/matrix-calculator/",
  },
  openGraph: {
    title: "Matrix Calculator — Multiply, Invert, Solve",
    description:
      "Every matrix operation has a shape rule. Here is which one you broke, and what singular actually means.",
    url: "/matrix-calculator/",
    type: "article",
  },
  twitter: {
    title: "Matrix Calculator — Multiply, Invert, Solve",
    description:
      "Matrix operations up to 6×6, with the dimension rules behind every error.",
  },
};

export default function Page() {
  return <MatrixCalculator />;
}
