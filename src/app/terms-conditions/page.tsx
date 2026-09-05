import "../globals.css";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description:
    "Read the Terms and Conditions for Numbers On Your Tip. Learn about usage rules, limitations, privacy, and your rights while using our online calculators and tools.",
  alternates: {
    canonical: "/terms-conditions/",
  },
  openGraph: {
    title: "Terms and Conditions | Numbers On Your Tip",
    description:
      "Usage rules, limitations, and your rights when using our calculators and tools.",
    url: "/terms-conditions/",
    type: "website",
  },
  twitter: {
    title: "Terms and Conditions | Numbers On Your Tip",
    description:
      "Usage rules, limitations, and your rights on Numbers On Your Tip.",
  },
};

export default function TermsAndConditions() {
  return (
    <>
      <div className="single-page-padding">
        <h1>Terms and Conditions – Numbers On Your Tip</h1>

        <p>Last Updated: 5/3/2026</p>

        <p>
          By accessing and using numbersonyourtip.com, you accept and agree to
          be bound by these Terms and Conditions. If you do not agree with any
          part of these terms, please do not use our website.
        </p>

        <h2>1. Acceptance of Terms</h2>
        <p>
          By using Numbers On Your Tip, you agree to comply with these Terms and
          all applicable laws and regulations. If you do not agree, you must
          stop using the website immediately.
        </p>

        <h2>2. Intellectual Property</h2>
        <p>
          All content on this website, including text, graphics, logos, images,
          and software, is the property of Numbers On Your Tip and is protected
          by copyright and trademark laws. You may not reproduce, distribute, or
          create derivative works without prior written permission.
        </p>

        <h2>3. Acceptable Use</h2>
        <ul>
          <li>You agree to use this website only for lawful purposes.</li>
          <li>
            You must not use the website in a way that violates any laws or
            regulations.
          </li>
          <li>
            You must not upload or transmit harmful, illegal, or defamatory
            content.
          </li>
        </ul>

        <h2>4. Disclaimer of Warranties</h2>
        <p>
          All tools, calculators, and content are provided on an “as is” basis.
          We do not guarantee accuracy, completeness, or reliability of results
          and do not provide any warranties of any kind.
        </p>

        <h2>5. Limitation of Liability</h2>
        <p>
          Numbers On Your Tip shall not be liable for any direct, indirect,
          incidental, or consequential damages resulting from the use or
          inability to use the website or its tools.
        </p>

        <h2>6. User Responsibility</h2>
        <ul>
          <li>
            You are responsible for verifying all results before making
            decisions.
          </li>
          <li>
            You must ensure all input data provided in calculators is accurate.
          </li>
          <li>
            We are not responsible for any decisions made based on tool outputs.
          </li>
        </ul>

        <h2>7. External Links</h2>
        <p>
          Our website may contain links to third-party websites. We are not
          responsible for the content, accuracy, or practices of external
          websites.
        </p>

        <h2>8. Privacy</h2>
        <p>
          Please review our{" "}
          <Link className="my-link" href="/privacy-policy/">
            Privacy Policy
          </Link>{" "}
          to understand how we handle your data.
        </p>

        <h2>9. Modifications</h2>
        <p>
          We reserve the right to update or modify these Terms and Conditions at
          any time. Continued use of the website means you accept any updated
          terms.
        </p>

        <h2>10. Governing Law</h2>
        <p>
          These Terms shall be governed by and interpreted according to the laws
          of your applicable country or region.
        </p>

        <h2>11. Contact Information</h2>
        <p>
          If you have any questions about these Terms and Conditions, you can
          contact us at:{" "}
          <Link className="my-link" href="mailto:contact@numbersonyourtip.com">
            contact@numbersonyourtip.com
          </Link>
        </p>
      </div>
    </>
  );
}
