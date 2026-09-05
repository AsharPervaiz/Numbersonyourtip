import { Metadata } from "next";
import Link from "next/link";
import SimpleCalculator from "./components/SimpleCalculator";
import CalculatorSearch from "./components/CalculatorsSearch";
import HomepageFAQ from "./components/HomepageFAQ";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { IconCircle, Icons } from "./components/MenuIcons";

export const metadata: Metadata = {
  title:
    "Numbers on Your Tip | Free Online Calculators & Tools for Everyday Use",
  description:
    "48 free calculators for health, finance, math, and daily use. No sign-up, no data stored — every result runs instantly in your browser.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title:
      "Numbers on Your Tip | Free Online Calculators & Tools for Everyday Use",
    description:
      "From BMI and body fat to EMI, tax, and unit conversion — 48 calculators and tools organised by category, built for quick, accurate answers with no account required.",
    type: "website",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Numbers on Your Tip | Free Online Calculators & Tools for Everyday Use",
    description:
      "48 free calculators. No sign-up. No data stored. Just answers.",
  },
};

export const categories = [
  {
    id: "health",
    icon: "🩺",
    title: "Health & Fitness",
    href: "/health-calculators/",
    tools: [
      { label: "BMI Calculator", href: "/bmi-calculator/" },
      { label: "Body Fat Calculator", href: "/body-fat-calculator/" },
      { label: "Calorie Calculator", href: "/calorie-calculator/" },
      { label: "Dose Calculator", href: "/dose-calculator/" },
      { label: "Dose Stock Calculator", href: "/dose-stock-calculator/" },
      { label: "IV Calculator", href: "/iv-calculator/" },
      { label: "Pharmacokinetics", href: "/pharmacokinetics-calculator/" },
      { label: "Pharmacodynamics", href: "/pharmacodynamics-calculator/" },
    ],
  },
  {
    id: "finance",
    icon: "📊",
    title: "Finance",
    href: "/finance-calculators/",
    tools: [
      { label: "EMI Calculator", href: "/emi-calculator/" },
      { label: "Mortgage Calculator", href: "/home-mortgage-calculator/" },
      { label: "Net Worth Calculator", href: "/net-worth-calculator/" },
      { label: "Rent Calculator", href: "/rent-calculator/" },
      { label: "Loan Calculator", href: "/loan-calculator/" },
      { label: "Income Tax Calculator", href: "/income-tax-calculator/" },
      { label: "VAT Calculator", href: "/vat-calculator/" },
      {
        label: "Freelancer Tax Calculator",
        href: "/freelancer-tax-calculator/",
      },
      { label: "Salary Hike Calculator", href: "/salary-hike-calculator/" },
      { label: "Fuel Cost Calculator", href: "/fuel-cost-calculator/" },
      { label: "Gold Calculator", href: "/gold-calculator/" },
    ],
  },
  {
    id: "daily",
    icon: "📅",
    title: "Daily Use",
    href: "/daily-use-calculators/",
    tools: [
      { label: "Days Between Dates", href: "/days-between-calculator/" },
      { label: "Time Calculator", href: "/time-calculator/" },
      { label: "Age Calculator", href: "/age-calculator/" },
      { label: "GPA Calculator", href: "/gpa-calculator/" },
      { label: "GPA Percentage", href: "/gpa-percentage/" },
      { label: "Percentage Calculator", href: "/percentage-calculator/" },
      { label: "Unit Conversion", href: "/unit-conversion-calculator/" },
      { label: "Discount Calculator", href: "/discount-calculator/" },
      { label: "Bill Split Calculator", href: "/bill-split-calculator/" },
    ],
  },
  {
    id: "tools",
    icon: "🧰",
    title: "Tools & Utilities",
    href: "/tools/",
    tools: [
      { label: "Currency Converter", href: "/currency-converter/" },
      { label: "Image Converter", href: "/image-converter/" },
      { label: "Image Compressor", href: "/image-compressor/" },
      { label: "Image Resizer", href: "/image-resizer/" },
      { label: "Password Generator", href: "/password-generator/" },
      { label: "Lorem Ipsum", href: "/lorem-ipsum-generator/" },
      { label: "Text Generator", href: "/text-generator/" },
      { label: "Text Case Converter", href: "/text-converter/" },
      { label: "Words Counter", href: "/word-char-counter/" },
      { label: "Color Picker", href: "/color-picker/" },
      {
        label: "Carbon Footprint Calculator",
        href: "/carbon-footprint-calculator/",
      },
      {
        label: "Time Zone Converter & World Clock",
        href: "/time-zone-converter/",
      },
    ],
  },
  {
    id: "maths",
    icon: "🧮",
    title: "Maths",
    href: "/math-calculators/",
    tools: [
      { label: "Mixed Number Calculator", href: "/mixed-number-calculator/" },
      { label: "Matrix Calculator", href: "/matrix-calculator/" },
      {
        label: "Mean, Median and Mode",
        href: "/mean-median-mode-calculator/",
      },
    ],
  },
  {
    id: "networking",
    icon: "🌐",
    title: "Networking",
    href: "/networking-tools/",
    tools: [
      { label: "IP Detector", href: "/ip-detector/" },
      { label: "DNS Lookup", href: "/dns-lookup/" },
      { label: "Email Validator", href: "/email-validator/" },
      { label: "Domain Name Checker", href: "/domain-name-checker/" },
      { label: "Internet Speed Test", href: "/internet-speed-test/" },
    ],
  },
];

/** Counts are derived, never hand-written — the old hard-coded "08"/"17"
 *  strings drifted out of date as tools were added. */
const toolTotal = categories.reduce((n, c) => n + c.tools.length, 0);

export default function Home() {
  return (
    <>
      {/* =======================
    SECTION 2 – TWO COLUMN
=========================== */}
      <div className="section-two">
        <div className="section-two-inner">
          {/* Left Content */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div className="badge-wrapper">
              <div className="badge-pill">
                <span className="badge-dot"></span>
                <span className="badge-text">
                  FREE CALCULATORS, ZERO SIGN-UP
                </span>
              </div>
            </div>
            <h1 className="main-first-heading">
              Every number you need ,{" "}
              <span className="gradient-text">right at your fingertips</span>.
            </h1>

            <p>
              <strong>Numbers On Your Tip</strong> is your all-in-one
              destination for free online calculators and smart digital tools
              built to make everyday math and decisions effortless.
            </p>

            <div className="calc-hero-search">
              <CalculatorSearch />
            </div>
            <div className="stats-wrapper">
              <div className="stat-item">
                <span className="stat-number">{toolTotal}</span>
                <span className="stat-label">Calculators & tools</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number">100%</span>
                <span className="stat-label">Free, no account</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number">0</span>
                <span className="stat-label">Data ever stored</span>
              </div>
            </div>
          </div>

          {/* Right Calculator */}
          <div style={{ width: "100%" }}>
            <SimpleCalculator />
          </div>
        </div>
      </div>

      {/* =======================
    HOW IT WORKS
=========================== */}
      <section className="section-new how-it-works-section">
        <div className="header-new">
          <h2 className="title-new">How It Works</h2>
          <p className="subtitle-new">
            Three steps, no account, no waiting.
          </p>
        </div>
        <div className="grid-new how-it-works-grid">
          <div className="card">
            <div className="cardHeader" style={{ marginBottom: "12px" }}>
              <div className="cardTitleGroup">
                <IconCircle color="purple">
                  <Icons.Search />
                </IconCircle>
                <h3 className="cardTitle">Pick a tool</h3>
              </div>
            </div>
            <p style={{ color: "#6b6b7b", lineHeight: 1.6, margin: 0 }}>
              Search or browse by category — health, finance, math, daily
              use, or networking — and open the calculator that matches your
              question.
            </p>
          </div>
          <div className="card">
            <div className="cardHeader" style={{ marginBottom: "12px" }}>
              <div className="cardTitleGroup">
                <IconCircle color="blue">
                  <Icons.Keyboard />
                </IconCircle>
                <h3 className="cardTitle">Enter your values</h3>
              </div>
            </div>
            <p style={{ color: "#6b6b7b", lineHeight: 1.6, margin: 0 }}>
              Type in the numbers that apply to you. Nothing is uploaded —
              every calculation runs locally in your browser.
            </p>
          </div>
          <div className="card">
            <div className="cardHeader" style={{ marginBottom: "12px" }}>
              <div className="cardTitleGroup">
                <IconCircle color="teal">
                  <Icons.CheckCircle />
                </IconCircle>
                <h3 className="cardTitle">Get your answer</h3>
              </div>
            </div>
            <p style={{ color: "#6b6b7b", lineHeight: 1.6, margin: 0 }}>
              Results appear instantly, with the formula and a worked example
              shown on the page so you can verify the math yourself.
            </p>
          </div>
        </div>
      </section>

      <section className="section-new">
        <div className="header-new">
          <h2 className="title-new">
            All {toolTotal} free calculators and tools
          </h2>
          <p className="subtitle-new">
            The complete library across six categories — health, finance, daily
            use, maths, networking and utilities.
          </p>
        </div>

        <div className="grid-new">
          {categories.map((category) => (
            <div key={category.id} className="card">
              <div className="cardHeader">
                <div className="cardTitleGroup">
                  <div className="iconWrapper">{category.icon}</div>
                  <h2 className="cardTitle">
                    <Link href={category.href}>{category.title}</Link>
                  </h2>
                </div>
                <span className="badge">
                  {String(category.tools.length).padStart(2, "0")}
                </span>
              </div>

              <div className="tags">
                {category.tools.map((tool) => (
                  <Link key={tool.label} href={tool.href} className="tag">
                    {tool.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="trustBanner">
          <div className="trustIconWrapper">🛡️</div>
          <div className="trustText">
            <h3>Trusted &amp; private by design</h3>
            <p>
              All calculators are accuracy-verified and fully private. Every
              calculation runs in your browser, so your inputs are never stored
              or shared.
            </p>
          </div>
        </div>
      </section>

      <HomepageFAQ />
    </>
  );
}
