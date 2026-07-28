import "../globals.css";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Numbers On Your Tip",
  description:
    "Contact Numbers On Your Tip for questions, feedback, or support. We’re here to help with our calculators, tools, and website-related inquiries. Reach out via email and we’ll respond within 24–48 hours.",
};

export default function AboutUs() {
  return (
    <>
      <div className="single-page-padding">
        <h1>Contact Us – Numbers On Your Tip</h1>

        <p>
          We’d love to hear from you! Whether you have a question, suggestion,
          feedback, or business inquiry, feel free to reach out. Our team will
          get back to you as soon as possible.
        </p>

        <h2>Get in Touch</h2>
        <p>You can contact us directly via email:</p>

        <p>
          <Link className="my-link" href="mailto:contact@numbersonyourtip.com">
            contact@numbersonyourtip.com
          </Link>
        </p>

        <h2>What You Can Contact Us For</h2>
        <ul className="custom-list">
          <li>Questions about our calculators and tools</li>
          <li>Suggestions for new features or improvements</li>
          <li>Report bugs or technical issues</li>
          <li>Business or collaboration inquiries</li>
          <li>General feedback or support</li>
        </ul>

        <h2>Response Time</h2>
        <p>
          We usually respond within 24–48 hours on working days. We appreciate
          your patience and will try our best to assist you quickly.
        </p>

        <h2>Thank You</h2>
        <p>
          Thank you for visiting Numbers On Your Tip. Your feedback helps us
          improve and grow better every day.
        </p>
      </div>
    </>
  );
}
