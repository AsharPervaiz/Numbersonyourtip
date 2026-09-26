import { Metadata } from "next";
import QuadraticCalculator from "../components/QuadraticCalculator";

export const metadata: Metadata = {
  title: "Quadratic Equation Calculator With Full Working",
  description:
    "Solve ax² + bx + c = 0 with every step shown — discriminant, exact surds, the vertex and the complex pair when there are no real roots.",
  alternates: {
    canonical: "/quadratic-equation-calculator/",
  },
  openGraph: {
    title: "Quadratic Equation Calculator With Full Working",
    description:
      "Roots, discriminant, vertex and factorised form, with the substitution printed back so you can see where each number came from.",
    url: "/quadratic-equation-calculator/",
  },
  twitter: {
    title: "Quadratic Equation Calculator",
    description:
      "Every step of the working, exact surds, and the complex roots most solvers hide.",
  },
};

export default function Page() {
  return <QuadraticCalculator />;
}
