import "../globals.css";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookies Policy | Numbers On Your Tip",
  description:
    "Learn about the Cookies Policy of Numbers On Your Tip. Understand how we use cookies and tracking technologies to improve your experience on our online calculators and tools.",
};

export default function Cookies() {
  return (
    <>
      <div className="single-page-padding">
        <h1>Cookies Policy – Numbers On Your Tip</h1>

        <p>
          Numbers On Your Tip uses cookies and similar tracking technologies to
          enhance your browsing experience, analyze site traffic, and improve
          our services. This Cookies Policy explains what cookies are, how we
          use them, and your choices regarding their use.
        </p>

        <h2>1. What Are Cookies?</h2>
        <p>
          Cookies are small text files stored on your device by your web
          browser. They help websites remember your preferences, login sessions,
          and usage patterns. Cookies can be essential for website functionality
          or used for analytics and advertising purposes.
        </p>

        <h2>2. How We Use Cookies</h2>
        <ul>
          <li>
            <strong>Essential Cookies:</strong> Required for the basic operation
            of our website and calculators.
          </li>
          <li>
            <strong>Performance Cookies:</strong> Collect anonymous information
            on how visitors use our tools to improve website performance.
          </li>
          <li>
            <strong>Functionality Cookies:</strong> Remember your preferences
            and settings for a smoother user experience.
          </li>
          <li>
            <strong>Advertising Cookies:</strong> Used to show relevant ads and
            track ad performance. These may involve third-party providers like
            Google AdSense.
          </li>
        </ul>

        <h2>3. Third-Party Cookies</h2>
        <p>
          We may use third-party services such as Google AdSense, analytics
          platforms, or social media integrations that place cookies on your
          device. These third-party cookies are subject to their own privacy
          policies, which we encourage you to review.
        </p>

        <h2>4. Your Choices Regarding Cookies</h2>
        <p>
          You can choose to accept or reject cookies by adjusting your browser
          settings. Most browsers allow you to:
        </p>
        <ul>
          <li>Block or delete cookies entirely</li>
          <li>Clear existing cookies</li>
          <li>Set preferences for specific websites</li>
        </ul>
        <p>
          Please note that disabling cookies may limit the functionality of some
          calculators and features on our website.
        </p>

        <h2>5. Consent</h2>
        <p>
          By using Numbers On Your Tip, you consent to the use of cookies as
          described in this policy unless you disable them in your browser
          settings.
        </p>

        <h2>6. Updates to Cookies Policy</h2>
        <p>
          We may update this Cookies Policy from time to time to reflect changes
          in technology or our services. Any updates will be posted on this page
          with the effective date. Continued use of our website constitutes
          acceptance of the updated policy.
        </p>

        <h2>7. Contact Us</h2>
        <p>
          If you have any questions about our Cookies Policy or how we use
          cookies, you can contact us at:
          <Link href="mailto:contact@numbersonyourtip.com">
            contact@numbersonyourtip.com
          </Link>
          .
        </p>
      </div>
    </>
  );
}
