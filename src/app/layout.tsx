import "./globals.css";

import type { Metadata } from "next";
import Script from "next/script";

import Link from "next/link";
import Header from "./components/Header";
import CookieConsentWrapper from "./components/CookieConsentWrapper";

export const metadata: Metadata = {
  title: "Numbers on Your Tip | Free Online Calculators & Tools",
  description:
    "Explore 40+ free online calculators and tools — health, finance, daily use & utilities. Get instant, accurate results right in your browser.",
  alternates: {
    canonical: "https://numbersonyourtip.com/",
  },
  keywords:
    "online calculators, BMI calculator, EMI calculator, age calculator, calorie calculator, body fat calculator, GPA calculator, time calculator, currency converter, free calculators",
  openGraph: {
    title: "Numbers on Your Tip | Free Online Calculators & Tools",
    description:
      "Free online calculators for BMI, EMI, age, calories, body fat, GPA, time, currency conversion and more.",
    type: "website",
    url: "https://numbersonyourtip.com",
    siteName: "Numbers on Your Tip",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Numbers on Your Tip | Free Online Calculators & tools for Everyday Use",
    description:
      "Explore 40+ free online calculators and tools — health, finance, daily use & utilities. Get instant, accurate results right in your browser.",
  },
  verification: {
    google: "g4Na71reWnkqSwlrZGdq44S53pf-c_9vcQ5m7bSL5Ls",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Numbers on Your Tip",
    alternateName: "numbersonyourtip.com",
    url: "https://numbersonyourtip.com/",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate:
          "https://numbersonyourtip.com/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  const siteNavigationLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: [
      {
        "@type": "SiteNavigationElement",
        position: 1,
        name: "Image Converter",
        url: "https://numbersonyourtip.com/image-converter/",
      },
      {
        "@type": "SiteNavigationElement",
        position: 2,
        name: "Dose Calculator",
        url: "https://numbersonyourtip.com/dose-calculator/",
      },
      {
        "@type": "SiteNavigationElement",
        position: 3,
        name: "VAT Calculator",
        url: "https://numbersonyourtip.com/vat-calculator/",
      },
      {
        "@type": "SiteNavigationElement",
        position: 4,
        name: "Our Blogs",
        url: "https://numbersonyourtip.com/blogs/",
      },
      {
        "@type": "SiteNavigationElement",
        position: 5,
        name: "Currency Converter",
        url: "https://numbersonyourtip.com/currency-converter/",
      },
      {
        "@type": "SiteNavigationElement",
        position: 6,
        name: "Time Calculator",
        url: "https://numbersonyourtip.com/time-calculator/",
      },
      {
        "@type": "SiteNavigationElement",
        position: 7,
        name: "Freelancer Tax Calculator",
        url: "https://numbersonyourtip.com/freelancer-tax-calculator/",
      },
      {
        "@type": "SiteNavigationElement",
        position: 8,
        name: "EMI Calculator",
        url: "https://numbersonyourtip.com/emi-calculator/",
      },
      {
        "@type": "SiteNavigationElement",
        position: 9,
        name: "BMI Calculator",
        url: "https://numbersonyourtip.com/bmi-calculator/",
      },
      {
        "@type": "SiteNavigationElement",
        position: 10,
        name: "Age Calculator",
        url: "https://numbersonyourtip.com/age-calculator/",
      },
    ],
  };

  return (
    <html lang="en">
      <head>
        <meta
          name="dmca-site-verification"
          content="SVBqMmxLeFQ5YnVYbk1peFpRak9YcHJlZHoxb1RIbk1lSGxZZjRSTWdVUT01"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(siteNavigationLd),
          }}
        />
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-MWMWX4NG7E"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-MWMWX4NG7E');
          `}
        </Script>
      </head>
      <body
        style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <Header />
        <main
          className="container mobile-padding"
          style={{ flex: 1, padding: "40px 0" }}
        >
          {children}
        </main>
        <footer style={{ background: "#001f54", color: "#c7c7c7" }}>
          <div
            className="container-header"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: "30px",
              padding: "40px 0",
              alignItems: "start",
            }}
          >
            {/* Column 1: Logo & Text */}
            <div>
              <Link href="/" style={{ textDecoration: "none" }}>
                <img
                  src="/brand-logo.png"
                  alt="Numbers On Your Tip"
                  style={{
                    height: "40px",
                    width: "auto",
                    display: "block",
                  }}
                />
              </Link>
              <p
                style={{
                  fontSize: "17px",
                  lineHeight: "1.6",
                  color: "#c7c7c7",
                }}
              >
                Smart, fast & private calculators & tools for daily life,
                fitness, finance and education.
              </p>
            </div>

            {/* Column 2: Finance */}
            <div
              className="footer-li"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <p
                style={{
                  color: "white",
                  fontSize: "20px",
                  fontWeight: "800",
                  marginBottom: "10px",
                  marginTop: "0",
                }}
              >
                Finance
              </p>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  fontSize: "13px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                <li>
                  <Link
                    href="/emi-calculator/"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    EMI Calculator
                  </Link>
                </li>
                <li>
                  <Link
                    href="/currency-converter/"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    Currency Converter
                  </Link>
                </li>
                <li>
                  <Link
                    href="/loan-calculator/"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    Loan Calculator
                  </Link>
                </li>
                <li>
                  <Link
                    href="/home-mortgage-calculator/"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    Mortgage Calculator
                  </Link>
                </li>
                <li>
                  <Link
                    href="/income-tax-calculator/"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    Income Tax Calculator
                  </Link>
                </li>
                <li>
                  <Link
                    href="/rent-calculator/"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    Rent Calculator
                  </Link>
                </li>
                <li>
                  <Link
                    href="/vat-calculator/"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    VAT Calculator
                  </Link>
                </li>
                <li>
                  <Link
                    href="/net-worth-calculator/"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    Net Worth Calculator
                  </Link>
                </li>
                <li>
                  <Link
                    href="/freelancer-tax-calculator/"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    Freelancer Tax Calculator
                  </Link>
                </li>
                <li>
                  <Link
                    href="/salary-hike-calculator/"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    Salary Hike Calculator
                  </Link>
                </li>
                <li>
                  <Link
                    href="/fuel-cost-calculator/"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    Fuel Cost Calculator
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Health */}
            <div className="footer-li">
              <h4
                style={{
                  color: "white",
                  fontSize: "20px",
                  marginBottom: "10px",
                  marginTop: "0",
                }}
              >
                Health
              </h4>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  fontSize: "13px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                <li>
                  <Link
                    href="/bmi-calculator/"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    BMI Calculator
                  </Link>
                </li>
                <li>
                  <Link
                    href="/body-fat-calculator/"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    Body Fat Calculator
                  </Link>
                </li>
                <li>
                  <Link
                    href="/calorie-calculator/"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    Calorie Calculator
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dose-calculator/"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    Dose Calculator
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dose-stock-calculator/"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    Dose Stock Calculator
                  </Link>
                </li>
                <li>
                  <Link
                    href="/iv-calculator/"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    IV Calculator
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pharmacokinetics-calculator/"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    Pharmacokinetics Calculator
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pharmacodynamics-calculator/"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    Pharmacodynamics Calculator
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Daily Use */}
            <div className="footer-li">
              <h4
                style={{
                  color: "white",
                  fontSize: "20px",
                  marginBottom: "10px",
                  marginTop: "0",
                }}
              >
                Daily Use
              </h4>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  fontSize: "13px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                <li>
                  <Link
                    href="/age-calculator/"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    Age Calculator
                  </Link>
                </li>
                <li>
                  <Link
                    href="/days-between-calculator/"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    Days Calculator
                  </Link>
                </li>
                <li>
                  <Link
                    href="/gpa-calculator/"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    GPA Calculator
                  </Link>
                </li>
                <li>
                  <Link
                    href="/gpa-percentage/"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    GPA Percentage Calculator
                  </Link>
                </li>
                <li>
                  <Link
                    href="/percentage-calculator/"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    Percentage Calculator
                  </Link>
                </li>
                <li>
                  <Link
                    href="/time-calculator/"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    Time Calculator
                  </Link>
                </li>
                <li>
                  <Link
                    href="/unit-conversion-calculator/"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    Unit Conversion
                  </Link>
                </li>
                <li>
                  <Link
                    href="/bill-split-calculator/"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    Bill Split Calculator
                  </Link>
                </li>
                <li>
                  <Link
                    href="/discount-calculator/"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    Discount Calculator
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 5: Other Tools */}
            <div className="footer-li">
              <h4
                style={{
                  color: "white",
                  fontSize: "20px",
                  marginBottom: "10px",
                  marginTop: "0",
                }}
              >
                Other Tools
              </h4>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  fontSize: "13px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                <li>
                  <Link
                    href="/currency-converter/"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    Currency Converter
                  </Link>
                </li>
                <li>
                  <Link
                    href="/image-converter/"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    Image Converter
                  </Link>
                </li>
                <li>
                  <Link
                    href="/image-compressor/"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    Image Compressor
                  </Link>
                </li>
                <li>
                  <Link
                    href="/image-resizer/"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    Image Resizer
                  </Link>
                </li>
                <li>
                  <Link
                    href="/password-generator/"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    Password Generator
                  </Link>
                </li>
                <li>
                  <Link
                    href="/lorem-ipsum-generator/"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    Lorem Ipsum Generator
                  </Link>
                </li>
                <li>
                  <Link
                    href="/text-converter/"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    Text Case Converter
                  </Link>
                </li>
                <li>
                  <Link
                    href="/text-generator/"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    Text Generator
                  </Link>
                </li>
                <li>
                  <Link
                    href="/word-char-counter/"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    Words Counter
                  </Link>
                </li>
                <li>
                  <Link
                    href="/color-picker/"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    Color Picker & Palletes
                  </Link>
                </li>
                <li>
                  <Link
                    href="/carbon-footprint-calculator/"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    Carbon Footprint Calculator
                  </Link>
                </li>
                <li>
                  <Link
                    href="/time-zone-converter/"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    Time Zone & World Clock
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 6: Networking */}
            <div className="footer-li">
              <h4
                style={{
                  color: "white",
                  fontSize: "20px",
                  marginBottom: "10px",
                  marginTop: "0",
                }}
              >
                Networking
              </h4>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  fontSize: "13px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                <li>
                  <Link
                    href="/dns-lookup/"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    DNS Lookup
                  </Link>
                </li>
                <li>
                  <Link
                    href="/ip-detector/"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    IP Detector
                  </Link>
                </li>
                <li>
                  <Link
                    href="/email-validator/"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    Email Validator
                  </Link>
                </li>
                <li>
                  <Link
                    href="/domain-name-checker/"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    Domain Name Checker
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 6: Maths */}
            <div className="footer-li">
              <h4
                style={{
                  color: "white",
                  fontSize: "20px",
                  marginBottom: "10px",
                  marginTop: "0",
                }}
              >
                Mathematics
              </h4>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  fontSize: "13px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                <li>
                  <Link
                    href="/mean-median-mode-calculator/"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    Mean Median Mode
                  </Link>
                </li>
                <li>
                  <Link
                    href="/matrix-calculator/"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    Matrix Calculator
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div
            className="footer-line-mobile"
            style={{
              borderTop: "1px solid rgba(255,255,255,0.1)",
              textAlign: "center",
              padding: "20px 0",
              fontSize: "17px",
              color: "#ffffff",
            }}
          >
            © 2026 Numbers On Your Tip. All rights reserved.
            <div
              className="footer-line-tags"
              style={{
                marginTop: "10px",
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "20px",
                fontSize: "15px",
              }}
            >
              <Link
                href="/about-us/"
                style={{ color: "#c7c7c7", textDecoration: "none" }}
              >
                About
              </Link>
              <Link
                href="/blog/"
                style={{ color: "#c7c7c7", textDecoration: "none" }}
              >
                Blogs
              </Link>
              <Link
                href="/contact-us/"
                style={{ color: "#c7c7c7", textDecoration: "none" }}
              >
                Contact
              </Link>
              <Link
                href="/privacy-policy/"
                style={{ color: "#c7c7c7", textDecoration: "none" }}
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms-conditions/"
                style={{ color: "#c7c7c7", textDecoration: "none" }}
              >
                Terms & Conditions
              </Link>
              <Link
                href="/cookies/"
                style={{ color: "#c7c7c7", textDecoration: "none" }}
              >
                Cookies
              </Link>
              <Link
                href="/disclaimer/"
                style={{ color: "#c7c7c7", textDecoration: "none" }}
              >
                Disclaimer
              </Link>
            </div>
            <div
              style={{
                marginTop: "10px",
              }}
            >
              <a
                href="//www.dmca.com/Protection/Status.aspx?ID=27108e52-becc-483f-88e6-b551cafe2c3b"
                title="DMCA.com Protection Status"
                className="dmca-badge"
              >
                {" "}
                <img
                  src="https://images.dmca.com/Badges/DMCA_logo-grn-btn120w.png?ID=27108e52-becc-483f-88e6-b551cafe2c3b"
                  alt="DMCA.com Protection Status"
                />
              </a>{" "}
              <script src="https://images.dmca.com/Badges/DMCABadgeHelper.min.js">
                {" "}
              </script>
            </div>
          </div>
        </footer>
        <CookieConsentWrapper />
      </body>
    </html>
  );
}
