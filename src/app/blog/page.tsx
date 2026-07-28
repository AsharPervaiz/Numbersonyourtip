import { Metadata } from "next";
import BlogsPage from "../components/Blog";

export const metadata: Metadata = {
  title: "Free Calculator Guides & Tools Blog | Numbers On Your Tip",
  description:
    "Explore our blog for in-depth guides on calculators, finance, health, and online tools. Learn how to calculate VAT, BMI, EMI, dosage, and more with easy step-by-step tutorials.",
  metadataBase: new URL("https://numbersonyourtip.com"),
  alternates: {
    canonical: "https://numbersonyourtip.com/blog/",
  },
};

export default function Page() {
  return <BlogsPage />;
}
