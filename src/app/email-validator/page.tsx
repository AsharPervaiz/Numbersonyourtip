import { Metadata } from "next";
import EmailValidator from "../components/EmailValidator";

export const metadata: Metadata = {
  title: "Free Email Validator | Check Syntax, Domain & MX Records Instantly",
  description:
    "alidate any email address instantly — check syntax, domain existence, MX records, disposable provider detection, and typo suggestions. Free, no sign-up required.",
  metadataBase: new URL("https://numbersonyourtip.com"),
  alternates: {
    canonical: "https://numbersonyourtip.com/email-validator/",
  },
};

export default function Page() {
  return <EmailValidator />;
}
