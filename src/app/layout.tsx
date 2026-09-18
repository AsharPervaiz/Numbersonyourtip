import "./globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import type { Metadata } from "next";
import Script from "next/script";

import Link from "next/link";
import Header from "./components/Header";
import Breadcrumbs from "./components/Breadcrumbs";
import CookieConsentWrapper from "./components/CookieConsentWrapper";

export const metadata: Metadata = {
  metadataBase: new URL("https://numbersonyourtip.com"),
  title: {
    default: "Numbers on Your Tip | Free Online Calculators & Tools",
    template: "%s | Numbers on Your Tip",
  },
  description:
    "Explore 50 free online calculators and tools — health, finance, daily use & utilities. Get instant, accurate results right in your browser.",
  applicationName: "Numbers on Your Tip",
  authors: [{ name: "Ashar Pervaiz" }],
  creator: "Ashar Pervaiz",
  publisher: "Numbers on Your Tip",
  openGraph: {
    type: "website",
    siteName: "Numbers on Your Tip",
    locale: "en_US",
    // NO title, description, url here — pages must set them
  },
  twitter: {
    card: "summary_large_image",
    // NO title, description here — pages must set them
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "g4Na71reWnkqSwlrZGdq44S53pf-c_9vcQ5m7bSL5Ls",
  },
  // NO alternates.canonical here — pages must set their own
  // NO keywords here — either drop entirely or set per-page
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
  };

  const organizationLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Numbers on Your Tip",
    alternateName: "numbersonyourtip.com",
    url: "https://numbersonyourtip.com/",
    logo: "https://numbersonyourtip.com/brand-logo.png",
    founder: {
      "@type": "Person",
      name: "Ashar Pervaiz",
      url: "https://numbersonyourtip.com/author/ashar-pervaiz/",
      sameAs: [
        "https://asharpervaiz.dev/",
        "https://www.linkedin.com/in/ashar-pervaiz-b3a718256",
      ],
    },
    sameAs: [
      "https://www.facebook.com/share/1WXWd29Bkp/",
      "https://www.instagram.com/numbersonyourtip/",
      "https://www.youtube.com/@Numbersonyourtip",
      "https://www.tiktok.com/@numberstip",
      "https://www.threads.com/@numbersonyourtip",
      "https://medium.com/@numbersonyourtip",
    ],
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
        url: "https://numbersonyourtip.com/blog/",
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
        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1466808362272721"
          crossOrigin="anonymous"
        ></script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationLd),
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
        {/* Microsoft Clarity */}
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "yeq6h1kj8k");
          `}
        </Script>
      </head>
      <body
        style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <Header />
        <main className="container mobile-padding" style={{ flex: 1 }}>
          <Breadcrumbs />
          {children}
        </main>
        <footer style={{ background: "#001f54", color: "#c7c7c7" }}>
          <div
            className="container-header"
            style={{
              display: "grid",
              gridTemplateColumns: "1.7fr 1fr 1fr 1fr",
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
              <ul
                className="footer-social"
                aria-label="Follow Numbers On Your Tip"
              >
                {[
                  [
                    "Facebook",
                    "fa-brands fa-facebook-f",
                    "https://www.facebook.com/share/1WXWd29Bkp/",
                  ],
                  [
                    "Instagram",
                    "fa-brands fa-instagram",
                    "https://www.instagram.com/numbersonyourtip/",
                  ],
                  [
                    "YouTube",
                    "fa-brands fa-youtube",
                    "https://www.youtube.com/@Numbersonyourtip",
                  ],
                  [
                    "TikTok",
                    "fa-brands fa-tiktok",
                    "https://www.tiktok.com/@numberstip",
                  ],
                  [
                    "Threads",
                    "fa-brands fa-threads",
                    "https://www.threads.com/@numbersonyourtip",
                  ],
                  [
                    "Medium",
                    "fa-brands fa-medium",
                    "https://medium.com/@numbersonyourtip",
                  ],
                ].map(([name, icon, href]) => (
                  <li key={name}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer me"
                      aria-label={`Numbers On Your Tip on ${name}`}
                      title={name}
                    >
                      <i className={icon} aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: Calculator categories */}
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
                Calculators
              </p>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  fontSize: "15px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <li>
                  <Link
                    href="/health-calculators/"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    Health Calculators
                  </Link>
                </li>
                <li>
                  <Link
                    href="/finance-calculators/"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    Finance Calculators
                  </Link>
                </li>
                <li>
                  <Link
                    href="/daily-use-calculators/"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    Daily Use Calculators
                  </Link>
                </li>
                <li>
                  <Link
                    href="/math-calculators/"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    Maths Calculators
                  </Link>
                </li>
                <li>
                  <Link
                    href="/construction-calculators/"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    Construction Calculators
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Tools and the blog */}
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
                Tools & Reading
              </p>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  fontSize: "15px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <li>
                  <Link
                    href="/tools/"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    Online Tools
                  </Link>
                </li>
                <li>
                  <Link
                    href="/networking-tools/"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    Networking Tools
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog/"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Company and policies */}
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
                Company
              </p>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  fontSize: "15px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <li>
                  <Link
                    href="/about-us/"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/author/ashar-pervaiz/"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    Author
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact-us/"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy/"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-conditions/"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    Terms &amp; Conditions
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cookies/"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    Cookies
                  </Link>
                </li>
                <li>
                  <Link
                    href="/disclaimer/"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    Disclaimer
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
