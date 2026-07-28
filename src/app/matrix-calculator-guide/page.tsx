import { Metadata } from "next";
import MatrixCalculatorGuide from "../components/MatrixCalculatorGuide";

export const metadata: Metadata = {
  title:
    "Matrix Calculator: Guide to Determinants, Inverse, Rank & More (Free)",
  description:
    "Free matrix calculator guide covering every operation: 2×2 inverse, 3×3 and 4×4 determinants, cofactor matrix, adjoint, rank diagonalization, and solving Ax=b. Full formulas, worked examples, and a free online calculator — no sign-up needed.",
  metadataBase: new URL("https://numbersonyourtip.com"),
  alternates: {
    canonical: "https://numbersonyourtip.com/blog/matrix-calculator-guide/",
  },
};

export default function Page() {
  return <MatrixCalculatorGuide />;
}
