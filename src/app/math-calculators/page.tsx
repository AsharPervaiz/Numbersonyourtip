import Link from "next/link";

import SimpleCalculator from "../components/SimpleCalculator";

import "@fortawesome/fontawesome-free/css/all.min.css";
import { IconCircle, Icons } from "../components/MenuIcons";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Math Calculators | Numbers On Your Tip",
  description:
    "Read the Terms and Conditions for Numbers On Your Tip. Learn about usage rules, limitations, privacy, and your rights while using our online calculators and tools.",
};

export default function Mathcals() {
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
            <h1 className="more-tools">Math Calculators</h1>
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
