import { Metadata } from "next";
import EmailValidator from "../components/EmailValidator";

export const metadata: Metadata = {
  title: "Email Validator — Syntax & Domain Check",
  description:
    "Check email syntax and validate the domain through its MX records, and see exactly which parts of an address can be verified without sending mail.",
  alternates: {
    canonical: "/email-validator/",
  },
  openGraph: {
    title: "Email Validator — Syntax & Domain Check",
    description:
      "Four questions hide inside is this email valid. Three are checkable from outside; one is not.",
    url: "/email-validator/",
    type: "article",
  },
  twitter: {
    title: "Email Validator — Syntax & Domain Check",
    description:
      "Validate email syntax and the receiving domain via MX records, with honest limits.",
  },
};

export default function Page() {
  return <EmailValidator />;
}
