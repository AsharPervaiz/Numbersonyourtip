import { Metadata } from "next";
import PasswordGenerator from "../components/PasswordGenerator";

export const metadata: Metadata = {
  title: "Password Generator — Strong Passwords",
  description:
    "Generate strong random passwords in your browser, with the length and character options that actually matter and where to keep what you generate.",
  alternates: {
    canonical: "/password-generator/",
  },
  openGraph: {
    title: "Password Generator — Strong Passwords",
    description:
      "What makes a password genuinely strong, and the habits that undo strong generation.",
    url: "/password-generator/",
    type: "article",
  },
  twitter: {
    title: "Password Generator — Strong Passwords",
    description:
      "Create strong random passwords locally, with guidance on length and storage.",
  },
};

export default function Page() {
  return <PasswordGenerator />;
}
