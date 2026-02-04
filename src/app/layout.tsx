import "./globals.css";
import Link from "next/link";
import Header from "./components/Header";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Header />  {/* Client component */}
        <main className="container mobile-padding" style={{ flex: 1, padding: "40px 0" }}>
          {children}
        </main>
        <footer style={{ background: "#1B3066", color: "#ffffff" }}>
  <div
    className="container-header"
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(5, 1fr)",
      gap: "30px",
      padding: "40px 0",
    }}
  >
    {/* Column 1: Logo & Text */}
    <div>
      <Link href="/" style={{ textDecoration: "none" }}>
  <img 
    src="/no.-2.png" 
    alt="Numbers On Your Tip" 
    style={{
      height: "60px",     // adjust size as needed
      width: "auto",
      display: "block"    // removes small baseline gap
    }}
  />
</Link>
      <p style={{ fontSize: "17px", lineHeight: "1.6", color: "#ffffff" }}>
        Smart, fast & private calculators for daily life, fitness, finance and
        education.
      </p>
    </div>

    {/* Column 2: Fitness Calculators */}
    <div>
  <h4 style={{ fontSize: "20px", marginBottom: "10px", marginTop: "0" }}>Finance</h4>
  <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "17px", display: "flex", flexDirection: "column", gap: "2px", }}>
    <li>
      <Link href="/emi-calculator" style={{ textDecoration: "none", color: "inherit" }}>
        EMI Calculator
      </Link>
    </li>
    <li>
      <Link href="/currency-converter" style={{ textDecoration: "none", color: "inherit" }}>
        Currency Converter
      </Link>
    </li>
    <li>
      <Link href="/loan-calculator" style={{ textDecoration: "none", color: "inherit" }}>
        Loan Calculator
      </Link>
    </li>
    <li>
      <Link href="/home-mortgage-calculator" style={{ textDecoration: "none", color: "inherit" }}>
        Mortgage Calculator
      </Link>
    </li>
    <li>
      <Link href="/income-tax-calculator" style={{ textDecoration: "none", color: "inherit" }}>
        Income Tax Calculator
      </Link>
    </li>
    <li>
      <Link href="/rent-calculator" style={{ textDecoration: "none", color: "inherit" }}>
        Rent Calculator
      </Link>
    </li>
  </ul>
</div>

    {/* Column 3: Daily Use Calculators */}
    <div>
  <h4 style={{ fontSize: "20px", marginBottom: "10px", marginTop: "0" }}>Health</h4>
  <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "17px", display: "flex", flexDirection: "column", gap: "2px", }}>
    <li>
      <Link href="/bmi-calculator" style={{ textDecoration: "none", color: "inherit" }}>
        BMI Calculator
      </Link>
    </li>
    <li>
      <Link href="/body-fat-calculator" style={{ textDecoration: "none", color: "inherit" }}>
        Body Fat Calculator
      </Link>
    </li>
    <li>
      <Link href="/calorie-calculator" style={{ textDecoration: "none", color: "inherit" }}>
        Calorie Calculator
      </Link>
    </li>
    <li>
      <Link href="/dose-calculator" style={{ textDecoration: "none", color: "inherit" }}>
        Dose Calculator
      </Link>
    </li>
  </ul>
</div>

    {/* Column 4: Finance Calculators */}
    <div>
  <h4 style={{ fontSize: "20px", marginBottom: "10px", marginTop: "0" }}>Daily Use</h4>
  <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "17px", display: "flex", flexDirection: "column", gap: "2px", }}>
    <li>
      <Link href="/age-calculator" style={{ textDecoration: "none", color: "inherit" }}>
        Age Calculator
      </Link>
    </li>
    <li>
      <Link href="/days-between-calculator" style={{ textDecoration: "none", color: "inherit" }}>
        Days Calculator
      </Link>
    </li>
    <li>
      <Link href="/gpa-calculator" style={{ textDecoration: "none", color: "inherit" }}>
        GPA Calculator
      </Link>
    </li>
    <li>
      <Link href="/gpa-percentage" style={{ textDecoration: "none", color: "inherit" }}>
        GPA Percentage Calculator
      </Link>
    </li>
    <li>
      <Link href="/percentage-calculator" style={{ textDecoration: "none", color: "inherit" }}>
        Percentage Calculator
      </Link>
    </li>
    <li>
      <Link href="/time-calculator" style={{ textDecoration: "none", color: "inherit" }}>
        Time Calculator
      </Link>
    </li>
    <li>
      <Link href="/unit-conversion-calculator" style={{ textDecoration: "none", color: "inherit" }}>
        Unit Conversion
      </Link>
    </li>
  </ul>
</div>

    {/* Column 5: More */}
    <div>
  <h4 style={{ fontSize: "20px", marginBottom: "10px", marginTop: "0" }}>Other Tools</h4>
  <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "17px", display: "flex", flexDirection: "column", gap: "2px", }}>
    <li>
      <Link href="/currency-converter" style={{ textDecoration: "none", color: "inherit" }}>
        Currency Converter
      </Link>
    </li>
    <li>
      <Link href="/password-generator" style={{ textDecoration: "none", color: "inherit" }}>
        Password Generator
      </Link>
    </li>
    <li>
      <Link href="/text-converter" style={{ textDecoration: "none", color: "inherit" }}>
        Text Converter
      </Link>
    </li>
    <li>
      <Link href="/text-generator" style={{ textDecoration: "none", color: "inherit" }}>
        Text Generator
      </Link>
    </li>
    <li>
      <Link href="/currencies" style={{ textDecoration: "none", color: "inherit" }}>
        Currency Rates
      </Link>
    </li>
    <li>
      <Link href="/crypto" style={{ textDecoration: "none", color: "inherit" }}>
        Cryptocurrency Rates
      </Link>
    </li>
  </ul>
</div>
  </div>

  {/* Bottom bar */}
  <div
  style={{
    borderTop: "1px solid rgba(255,255,255,0.1)",
    textAlign: "center",
    padding: "20px 0",
    fontSize: "17px",
    color: "#ffffff",
  }}
>
  © 2026 Numbers On Your Tip. All rights reserved.

  {/* Links Row */}
  <div
    style={{
      marginTop: "10px",
      display: "flex",
      justifyContent: "center",
      gap: "20px",
      fontSize: "15px",
    }}
  >
    <Link href="#" style={{ color: "#ffffff", textDecoration: "none" }}>
      Privacy Policy
    </Link>
    <Link href="#" style={{ color: "#ffffff", textDecoration: "none" }}>
      Terms & Conditions
    </Link>
    <Link href="#" style={{ color: "#ffffff", textDecoration: "none" }}>
      Cookies
    </Link>
  </div>
</div>

</footer>

      </body>
    </html>
  );
}
