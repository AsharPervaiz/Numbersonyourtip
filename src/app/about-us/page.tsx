import "../globals.css";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Numbers On Your Tip",
  description:
    "Discover Numbers On Your Tip, your trusted platform for practical tips, how-to guides, and useful online tools. Learn our mission, values, and how we provide clear, reliable, and actionable information to help you make smarter decisions.",
};

export default function AboutUs() {
  return (
    <>
      <div className="single-page-padding">
        <h1>About Us – Numbers On Your Tip</h1>

        <p>
          Numbers On Your Tip is a free calculator and tools platform — 40+
          calculators covering health, finance, daily-use math, and digital
          utilities, built to give you accurate answers in seconds without
          sign-ups, paywalls, or clutter.
        </p>

        <h2>Our Mission</h2>
        <p>
          Every calculator on this site exists to answer one question well. We
          focus on getting the formula right, explaining what the result
          actually means, and keeping the tool fast and free — no accounts, no
          data stored, no unnecessary friction between you and your answer.
        </p>

        <h2>Why Trust Us</h2>
        <ul className="custom-list">
          <li>
            Every calculator is built on standard published formulas (WHO
            guidelines for health metrics, standard financial/amortization
            formulas for loans and tax tools, official conversion standards for
            unit tools)
          </li>
          <li>
            Medical and dosing calculators are for educational reference only —
            always confirmed against clinical sources, and never a substitute
            for a licensed healthcare professional. Please read{" "}
            <Link
              className="my-link"
              href="https://numbersonyourtip.com/disclaimer/"
            >
              disclaimer
            </Link>
          </li>
          <li>
            Calculators are updated when underlying rates, formulas, or
            standards change (e.g., tax brackets, WHO BMI cut-offs).
          </li>
        </ul>

        <h2>Meet the Founder</h2>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            margin: "20px 0",
            padding: "16px",
            border: "1px solid #e5e5e5",
            borderRadius: "12px",
          }}
        >
          <img
            src="/founder_photo.webp"
            alt="Ashar Pervaiz - Founder of Numbers On Your Tip"
            width={72}
            height={72}
            style={{
              width: "152px",
              height: "152px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid #1F9FB8",
              flexShrink: 0,
            }}
          />
          <div>
            <p
              style={{
                margin: 0,
                padding: 0,
                fontWeight: 600,
                fontSize: "22px",
                color: "#1B3066",
              }}
            >
              Ashar Pervaiz
            </p>
            <p style={{ margin: 0, color: "#1F9FB8" }}>Software Engineer</p>
            <p
              style={{
                fontSize: "18px",
                fontWeight: "600",
                color: "black",
                margin: 0,
                padding: 0,
              }}
            >
              "Great decisions begin with accurate numbers. Our mission is to
              put reliable tools at your fingertips—simple, fast, and free."
            </p>
            <p
              style={{
                fontSize: "12px",
                margin: 0,
                padding: 0,
              }}
            >
              I build every calculator on this site myself, testing each formula
              against real-world examples before it goes live. If something
              looks off, tell me — I fix it fast.
            </p>
          </div>
        </div>

        <h2>Contact Us</h2>
        <p>
          Have questions, suggestions, or feedback? We would love to hear from
          you.
        </p>

        <p>
          You can reach us at:{" "}
          <Link className="my-link" href="mailto:contact@numbersonyourtip.com">
            contact@numbersonyourtip.com
          </Link>
        </p>
      </div>
    </>
  );
}
