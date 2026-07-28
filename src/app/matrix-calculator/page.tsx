import { Metadata } from "next";
import MatrixCalculator from "../components/MatrixCalculator";

export const metadata: Metadata = {
  title:
    "Free Matrix Calculator | Add, Multiply, Invert & Solve Matrices Online",
  description:
    "Free matrix calculator for addition, subtraction, multiplication, transpose, determinant, inverse, adjoint, rank, trace, RREF, and solving AX=B. Up to 6×6, instant results.",
  metadataBase: new URL("https://numbersonyourtip.com"),
  alternates: {
    canonical: "https://numbersonyourtip.com/matrix-calculator/",
  },
};

export default function Page() {
  return <MatrixCalculator />;
}
