import { Metadata } from "next";
import GPAToPercentage from "../components/GPAToPercentage";

export const metadata: Metadata = {
  title: "GPA to Percentage Calculator & Chart",
  description:
    "Convert GPA to percentage on 4.0, 4.3, 5.0 and 10-point scales, with a full 0.1-step chart — and why a 4.2 GPA is not 105%.",
  alternates: {
    canonical: "/gpa-percentage/",
  },
  openGraph: {
    title: "GPA to Percentage Calculator & Chart",
    description:
      "There is no single GPA-to-percentage formula. Identify your scale first, then use the chart.",
    url: "/gpa-percentage/",
    type: "article",
  },
  twitter: {
    title: "GPA to Percentage Calculator & Chart",
    description:
      "GPA to percentage on 4.0, 5.0 and 10-point scales, with a full conversion chart.",
  },
};

export default function Page() {
  return <GPAToPercentage />;
}
