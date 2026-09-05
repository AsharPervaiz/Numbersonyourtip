import "../globals.css";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read the Privacy Policy of Numbers On Your Tip. Learn how we collect, use, and protect your personal information when you use our online calculators and tools.",
  alternates: {
    canonical: "/privacy-policy/",
  },
  openGraph: {
    title: "Privacy Policy | Numbers On Your Tip",
    description:
      "How we collect, use, and protect your personal information when you use our calculators and tools.",
    url: "/privacy-policy/",
    type: "website",
  },
  twitter: {
    title: "Privacy Policy | Numbers On Your Tip",
    description:
      "How we handle and protect your data across our calculators and tools.",
  },
};

export default function PrivacyPolicy() {
  return (
    <>
      <div className="single-page-padding">
        <h1>Privacy Policy – Numbers On Your Tip</h1>

        <p>Last Updated: 5/3/2026</p>

        <p>
          At Numbers On Your Tip, we are committed to protecting the privacy of
          our visitors. This Privacy Policy explains how we collect, use, and
          safeguard your personal information when you visit our website.
        </p>

        <h2>1. Information We Collect</h2>
        <ul className="custom-list">
          <li>
            <strong>Personal information:</strong> We may collect personal
            identification information such as name and email address when you
            voluntarily submit it through contact forms or newsletter
            subscriptions.
          </li>
          <li>
            <strong>Non-personal information:</strong> We automatically collect
            data such as browser type, operating system, IP address, referring
            URLs, pages visited, and time spent on our website.
          </li>
        </ul>

        <h2>2. Cookies and Tracking Technologies</h2>
        <p>
          We use cookies and similar tracking technologies to enhance your
          experience, analyze site traffic, and serve personalized
          advertisements. Third-party vendors, including Google, may use cookies
          based on your prior visits to this and other websites.
        </p>

        <h2>3. Google AdSense and Third-Party Advertising</h2>
        <p>
          We use Google AdSense to display advertisements. Google uses the
          DoubleClick cookie to serve ads based on your visits to this and other
          websites. You may opt out of personalized advertising by visiting
          <Link
            className="my-link"
            href="https://adssettings.google.com"
            target="_blank"
          >
            Google Ads Settings
          </Link>
          .
        </p>

        <h2>4. Google Analytics</h2>
        <p>
          We use Google Analytics to understand how visitors interact with our
          website. It collects data such as pages visited, time spent, and
          referral sources. You can opt out using the Google Analytics Opt-Out
          Browser Add-on.
        </p>

        <h2>5. How We Use Your Information</h2>
        <ul className="custom-list">
          <li>To operate and maintain our website</li>
          <li>To improve and personalize user experience</li>
          <li>To analyze usage trends and performance</li>
          <li>To respond to user inquiries and support requests</li>
          <li>To comply with legal obligations</li>
        </ul>

        <h2>6. Data Sharing</h2>
        <p>
          We do not sell, trade, or rent your personal information. We may share
          aggregated, non-personal data with partners for analytics and
          advertising purposes.
        </p>

        <h2>7. Data Security</h2>
        <p>
          We implement appropriate security measures to protect your data.
          However, no method of transmission over the internet is 100% secure.
        </p>

        <h2>8. Your Rights</h2>
        <p>
          You have the right to access, correct, or delete your personal data.
          You can also manage or disable cookies through your browser settings.
        </p>

        <h2>9. Children’s Privacy</h2>
        <p>
          Our website is not intended for children under 13. We do not knowingly
          collect personal information from children under 13.
        </p>

        <h2>10. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Changes will be
          posted on this page with an updated revision date.
        </p>

        <h2>11. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, you can contact
          us at:{" "}
          <Link className="my-link" href="mailto:contact@numbersonyourtip.com">
            contact@numbersonyourtip.com
          </Link>
        </p>
      </div>
    </>
  );
}
