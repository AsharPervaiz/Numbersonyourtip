import { Metadata } from "next";
import PasswordGenerator from "../components/PasswordGenerator";

export const metadata: Metadata = {
  title: "Password Generator | Create Strong & Secure Passwords Instantly",
  description:
    "Free Password Generator to create strong, secure, and random passwords. Customize length, include uppercase, lowercase, numbers, and symbols. Ideal for accounts, security, and privacy.",
  metadataBase: new URL("https://numbersonyourtip.com"),
  alternates: {
    canonical: "https://numbersonyourtip.com/password-generator/",
  },
};

export default function Page() {
  return <PasswordGenerator />;
}
