import Link from "next/link";

import SimpleCalculator from "../components/SimpleCalculator";

import "@fortawesome/fontawesome-free/css/all.min.css";
import { IconCircle, Icons } from "../components/MenuIcons";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daily Use Calculators | Numbers On Your Tip",
  description:
    "Read the Terms and Conditions for Numbers On Your Tip. Learn about usage rules, limitations, privacy, and your rights while using our online calculators and tools.",
};

export default function Dailycals() {
  return (
    <>
      {/* =======================
    SECTION 2 – TWO COLUMN
=========================== */}
      <div className="section-two">
        <div className="section-two-inner">
          {/* Left Content */}
          <section>
            {" "}
            <h1 className="more-tools">Daily Use Calculators</h1>
            <div
              className="icon-grid1"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "15px",
                marginBottom: "50px",
              }}
            >
              {[
                {
                  name: (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px", // space between icon & text
                      }}
                    >
                      <IconCircle color="purple">
                        <Icons.Age />
                      </IconCircle>

                      <h4>Age Calculator</h4>
                    </div>
                  ),
                  href: "/age-calculator/",
                },
                {
                  name: (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px", // space between icon & text
                      }}
                    >
                      <IconCircle color="blue">
                        <Icons.Bmi />
                      </IconCircle>{" "}
                      <h4> BMI Calculator </h4>
                    </div>
                  ),
                  href: "/bmi-calculator/",
                },
                {
                  name: (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px", // space between icon & text
                      }}
                    >
                      <IconCircle color="teal">
                        <Icons.BodyFat />
                      </IconCircle>{" "}
                      <h4>Body Fat Calculator</h4>
                    </div>
                  ),
                  href: "/body-fat-calculator/",
                },
                {
                  name: (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px", // space between icon & text
                      }}
                    >
                      <IconCircle color="coral">
                        <Icons.Calorie />
                      </IconCircle>{" "}
                      <h4>Calorie Calculator</h4>
                    </div>
                  ),
                  href: "/calorie-calculator/",
                },
                {
                  name: (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px", // space between icon & text
                      }}
                    >
                      <IconCircle color="amber">
                        <Icons.Percentage />
                      </IconCircle>{" "}
                      <h4>Percentage Calculator</h4>
                    </div>
                  ),
                  href: "/percentage-calculator/",
                },
                {
                  name: (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px", // space between icon & text
                      }}
                    >
                      <IconCircle color="green">
                        <Icons.Calendar />
                      </IconCircle>{" "}
                      <h4>Days Between Dates</h4>
                    </div>
                  ),
                  href: "/days-between-calculator/",
                },
                {
                  name: (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px", // space between icon & text
                      }}
                    >
                      <IconCircle color="pink">
                        <Icons.EMI />
                      </IconCircle>{" "}
                      <h4>EMI Calculator</h4>
                    </div>
                  ),
                  href: "/emi-calculator/",
                },
                {
                  name: (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px", // space between icon & text
                      }}
                    >
                      <IconCircle color="purple">
                        <Icons.GPA />
                      </IconCircle>{" "}
                      <h4>GPA Calculator</h4>
                    </div>
                  ),
                  href: "/gpa-calculator/",
                },
                {
                  name: (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px", // space between icon & text
                      }}
                    >
                      <IconCircle color="blue">
                        <Icons.PercentageGPA />
                      </IconCircle>{" "}
                      <h4>GPA to Percentage</h4>
                    </div>
                  ),
                  href: "/gpa-percentage/",
                },
                {
                  name: (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px", // space between icon & text
                      }}
                    >
                      <IconCircle color="teal">
                        <Icons.Mortgage />
                      </IconCircle>{" "}
                      <h4>Mortgage Calculator</h4>
                    </div>
                  ),
                  href: "/home-mortgage-calculator/",
                },
                {
                  name: (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px", // space between icon & text
                      }}
                    >
                      <IconCircle color="coral">
                        <Icons.IncomeTax />
                      </IconCircle>{" "}
                      <h4>Income Tax Calculator</h4>
                    </div>
                  ),
                  href: "/income-tax-calculator/",
                },
                {
                  name: (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px", // space between icon & text
                      }}
                    >
                      <IconCircle color="amber">
                        <Icons.Loan />
                      </IconCircle>{" "}
                      <h4>Loan Calculator</h4>
                    </div>
                  ),
                  href: "/loan-calculator/",
                },
                {
                  name: (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px", // space between icon & text
                      }}
                    >
                      <IconCircle color="green">
                        <Icons.Dose />
                      </IconCircle>{" "}
                      <h4>Dose Calculator</h4>
                    </div>
                  ),
                  href: "/dose-calculator/",
                },
                {
                  name: (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px", // space between icon & text
                      }}
                    >
                      <IconCircle color="pink">
                        <Icons.DoseStock />
                      </IconCircle>{" "}
                      <h4>Dose Stock Calculator</h4>
                    </div>
                  ),
                  href: "/dose-stock-calculator/",
                },
                {
                  name: (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px", // space between icon & text
                      }}
                    >
                      <IconCircle color="purple">
                        <Icons.IV />
                      </IconCircle>{" "}
                      <h4>IV Drip Calculator</h4>
                    </div>
                  ),
                  href: "/iv-calculator/",
                },
                {
                  name: (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px", // space between icon & text
                      }}
                    >
                      <IconCircle color="blue">
                        <Icons.Rent />
                      </IconCircle>{" "}
                      <h4>Rent Calculator</h4>
                    </div>
                  ),
                  href: "/rent-calculator/",
                },
                {
                  name: (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px", // space between icon & text
                      }}
                    >
                      <IconCircle color="teal">
                        <Icons.Clock />
                      </IconCircle>{" "}
                      <h4>Time Calculator</h4>
                    </div>
                  ),
                  href: "/time-calculator/",
                },
                {
                  name: (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px", // space between icon & text
                      }}
                    >
                      <IconCircle color="coral">
                        <Icons.Convert />
                      </IconCircle>{" "}
                      <h4>Unit Converter</h4>
                    </div>
                  ),
                  href: "/unit-conversion-calculator/",
                },
                {
                  name: (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px", // space between icon & text
                      }}
                    >
                      <IconCircle color="amber">
                        <Icons.VAT />
                      </IconCircle>{" "}
                      <h4>VAT Calculator</h4>
                    </div>
                  ),
                  href: "/vat-calculator/",
                },
                {
                  name: (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px", // space between icon & text
                      }}
                    >
                      <IconCircle color="purple">
                        <Icons.Pharmaco />
                      </IconCircle>{" "}
                      <h4>Pharmaco kinetics Calculator</h4>
                    </div>
                  ),
                  href: "/pharmacokinetics-calculator/",
                },
                {
                  name: (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px", // space between icon & text
                      }}
                    >
                      <IconCircle color="green">
                        <Icons.Dynamics />
                      </IconCircle>{" "}
                      <h4>Pharmaco dynamics Calculator</h4>
                    </div>
                  ),
                  href: "/pharmacodynamics-calculator/",
                },
                {
                  name: (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px", // space between icon & text
                      }}
                    >
                      <IconCircle color="amber">
                        <Icons.NetWorth />
                      </IconCircle>{" "}
                      <h4>Net Worth Calculator</h4>
                    </div>
                  ),
                  href: "/net-worth-calculator/",
                },
                {
                  name: (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px", // space between icon & text
                      }}
                    >
                      <IconCircle color="green">
                        <Icons.Discount />
                      </IconCircle>{" "}
                      <h4>Discount Calculator</h4>
                    </div>
                  ),
                  href: "/discount-calculator/",
                },
                {
                  name: (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px", // space between icon & text
                      }}
                    >
                      <IconCircle color="coral">
                        <Icons.Salary />
                      </IconCircle>{" "}
                      <h4>Salary Hike Calculator</h4>
                    </div>
                  ),
                  href: "/salary-hike-calculator/",
                },
                {
                  name: (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px", // space between icon & text
                      }}
                    >
                      <IconCircle color="pink">
                        <Icons.Freelancer />
                      </IconCircle>{" "}
                      <h4>Freelancer Tax Calculator</h4>
                    </div>
                  ),
                  href: "/freelancer-tax-calculator/",
                },
                {
                  name: (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px", // space between icon & text
                      }}
                    >
                      <IconCircle color="blue">
                        <Icons.Split />
                      </IconCircle>{" "}
                      <h4>Bill Split Calculator</h4>
                    </div>
                  ),
                  href: "/bill-split-calculator/",
                },
                {
                  name: (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px", // space between icon & text
                      }}
                    >
                      <IconCircle color="teal">
                        <Icons.Fuel />
                      </IconCircle>{" "}
                      <h4>Fuel Cost Calculator</h4>
                    </div>
                  ),
                  href: "/fuel-cost-calculator/",
                },
                {
                  name: (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px", // space between icon & text
                      }}
                    >
                      <IconCircle color="green">
                        <Icons.MeanMode />
                      </IconCircle>{" "}
                      <h4>Mean Median Mode Calculator</h4>
                    </div>
                  ),
                  href: "/mean-median-mode-calculator/",
                },
                {
                  name: (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px", // space between icon & text
                      }}
                    >
                      <IconCircle color="coral">
                        <Icons.Matrix />
                      </IconCircle>{" "}
                      <h4>Matrix Calculator</h4>
                    </div>
                  ),
                  href: "/matrix-calculator/",
                },

                // ... add more as needed
              ].map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  style={{ textDecoration: "none" }}
                >
                  <div
                    className="calc-card bullet"
                    style={{
                      textAlign: "start",
                      padding: "12px 18px",
                      border: "1px solid #e4e6ee",

                      color: "black",
                      background: "white",
                      borderRadius: "12px",

                      transition: "0.2s ease",
                      cursor: "pointer",
                    }}
                  >
                    <p
                      className="card-title"
                      style={{ fontWeight: 600, fontSize: "14px", margin: 0 }}
                    >
                      {item.name}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
          {/* Right Calculator */}
          <div
            style={{
              position: "sticky",
              top: "70px",
              alignSelf: "start",
            }}
          >
            <SimpleCalculator />
          </div>
        </div>
      </div>

      {/* =======================
    SECTION 3 – ICON BOXES
=========================== */}
    </>
  );
}
