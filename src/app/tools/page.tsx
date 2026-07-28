import Link from "next/link";

import SimpleCalculator from "../components/SimpleCalculator";

import "@fortawesome/fontawesome-free/css/all.min.css";
import { IconCircle, Icons } from "../components/MenuIcons";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tools | Numbers On Your Tip",
  description:
    "Read the Terms and Conditions for Numbers On Your Tip. Learn about usage rules, limitations, privacy, and your rights while using our online calculators and tools.",
};

export default function Tools() {
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
            <h1 className="more-tools">Tools</h1>
            <div
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
                      <IconCircle color="pink">
                        <Icons.Image />
                      </IconCircle>{" "}
                      <h4>Image Converter</h4>
                    </div>
                  ),
                  href: "/image-converter/",
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
                        <Icons.Compress />
                      </IconCircle>{" "}
                      <h4>Image Compressor</h4>
                    </div>
                  ),
                  href: "/image-compressor/",
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
                        <Icons.Resize />
                      </IconCircle>{" "}
                      <h4>Image Resizer</h4>
                    </div>
                  ),
                  href: "/image-resizer/",
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
                        <Icons.Currency />
                      </IconCircle>{" "}
                      <h4>Currency Converter</h4>
                    </div>
                  ),
                  href: "/currency-converter/",
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
                        <Icons.Password />
                      </IconCircle>{" "}
                      <h4>Password Generator</h4>
                    </div>
                  ),
                  href: "/password-generator/",
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
                        <Icons.Lorem />
                      </IconCircle>{" "}
                      <h4>Lorem Ipsum Generator</h4>
                    </div>
                  ),
                  href: "/lorem-ipsum-generator/",
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
                        <Icons.TextEdit />
                      </IconCircle>{" "}
                      <h4>Random Text Generator</h4>
                    </div>
                  ),
                  href: "/text-generator/",
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
                        <Icons.TextType />
                      </IconCircle>{" "}
                      <h4>Text Case Converter</h4>
                    </div>
                  ),
                  href: "/text-converter/",
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
                        <Icons.WordCount />
                      </IconCircle>{" "}
                      <h4>Word Counter</h4>
                    </div>
                  ),
                  href: "/word-char-counter/",
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
                        <Icons.ColorPicker />
                      </IconCircle>{" "}
                      <h4>Color Picker & Palletes</h4>
                    </div>
                  ),
                  href: "/color-picker/",
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
                        <Icons.Carbon />
                      </IconCircle>{" "}
                      <h4>Carbon Footprint Calculator</h4>
                    </div>
                  ),
                  href: "/carbon-footprint-calculator/",
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
                        <Icons.DNS />
                      </IconCircle>{" "}
                      <h4>DNS Lookup</h4>
                    </div>
                  ),
                  href: "/dns-lookup/",
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
                        <Icons.IP />
                      </IconCircle>{" "}
                      <h4>IP Detector</h4>
                    </div>
                  ),
                  href: "/ip-detector/",
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
                        <Icons.Email />
                      </IconCircle>{" "}
                      <h4>Email Validator</h4>
                    </div>
                  ),
                  href: "/email-validator/",
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
                        <Icons.Domainname />
                      </IconCircle>{" "}
                      <h4>Domain Name Checker</h4>
                    </div>
                  ),
                  href: "/domain-name-checker/",
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
                        <Icons.Timezone />
                      </IconCircle>{" "}
                      <h4>Time Zones & World Clock</h4>
                    </div>
                  ),
                  href: "/time-zone-converter/",
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
                      borderRadius: "12px",
                      color: "black",
                      background: "white",

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
