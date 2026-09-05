import Link from "next/link";


import "@fortawesome/fontawesome-free/css/all.min.css";
import { IconCircle, Icons } from "../components/MenuIcons";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Online Tools — Image, Text, Colour, Currency",
  description:
    "Image conversion, compression and resizing, text case and counting, colour picking, currency and time zones — all running in your browser, nothing uploaded.",
  alternates: {
    canonical: "/tools/",
  },
  openGraph: {
    title: "Free Online Tools | Numbers On Your Tip",
    description:
      "Tools that transform something rather than calculate a number, and why the order you use them in matters.",
    url: "/tools/",
    type: "website",
  },
  twitter: {
    title: "Free Online Tools",
    description:
      "Image, text, color, and utility tools — all free and browser-based.",
  },
};

export default function Tools() {
  return (
    <>
      {/* =======================
    SECTION 2 – TWO COLUMN
=========================== */}
      <div className="section-two">
        <div className="section-two-inner single-col">
          {/* Left Content */}
          <section>
            {" "}
            <h1 className="more-tools">Tools</h1>
            <p style={{ maxWidth: "640px", marginBottom: "28px", lineHeight: 1.7 }}>
              A mixed set of browser-based utilities that don&apos;t fit neatly
              into finance or health: convert, compress, and resize images
              without uploading them anywhere, generate strong passwords or
              placeholder text, clean up text case and word counts, build a
              color palette, estimate your carbon footprint, and run the same
              DNS, IP, email, and domain checks found in networking tools.
              Everything processes locally in your browser — nothing you
              upload or type is sent to a server or stored.
            </p>
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
                    <div
                      className="card-title"
                      style={{ fontWeight: 600, fontSize: "14px", margin: 0 }}
                    >
                      {item.name}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <h2>What This Section Is</h2>
            <p>
              Everything else on this site calculates a number. These tools
              transform something instead — an image into a different format,
              text into a different case, a colour into a different notation, one
              currency into another. The common thread is that you bring
              something in and take a changed version away.
            </p>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Group</th>
                    <th>Tools</th>
                    <th>What they change</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Images</td>
                    <td>
                      <Link className="my-link" href="/image-converter/">
                        Converter
                      </Link>
                      ,{" "}
                      <Link className="my-link" href="/image-compressor/">
                        compressor
                      </Link>
                      ,{" "}
                      <Link className="my-link" href="/image-resizer/">
                        resizer
                      </Link>
                    </td>
                    <td>Format, quality, dimensions</td>
                  </tr>
                  <tr>
                    <td>Text</td>
                    <td>
                      <Link className="my-link" href="/text-converter/">
                        Case converter
                      </Link>
                      ,{" "}
                      <Link className="my-link" href="/word-char-counter/">
                        counter
                      </Link>
                      ,{" "}
                      <Link className="my-link" href="/text-generator/">
                        generator
                      </Link>
                      ,{" "}
                      <Link className="my-link" href="/lorem-ipsum-generator/">
                        lorem ipsum
                      </Link>
                    </td>
                    <td>Capitalisation, length, placeholder content</td>
                  </tr>
                  <tr>
                    <td>Design</td>
                    <td>
                      <Link className="my-link" href="/color-picker/">
                        Colour picker and palettes
                      </Link>
                    </td>
                    <td>HEX, RGB and HSL notation, and contrast</td>
                  </tr>
                  <tr>
                    <td>Everyday</td>
                    <td>
                      <Link className="my-link" href="/currency-converter/">
                        Currency
                      </Link>
                      ,{" "}
                      <Link className="my-link" href="/time-zone-converter/">
                        time zones
                      </Link>
                      ,{" "}
                      <Link className="my-link" href="/password-generator/">
                        passwords
                      </Link>
                      ,{" "}
                      <Link
                        className="my-link"
                        href="/carbon-footprint-calculator/"
                      >
                        carbon footprint
                      </Link>
                    </td>
                    <td>Value, place, secrets, estimates</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2>The Three Image Tools Are Not Alternatives</h2>
            <p>
              They get confused constantly, because all three make a file
              smaller. They do it by changing three different things, and using
              them in the wrong order wastes effort.
            </p>
            <pre>
              Resize → fewer pixels{"\n"}Convert → a different way of storing
              the same pixels{"\n"}Compress → lower quality within the chosen
              format
            </pre>
            <p>
              Work in that order. The most common reason an image is too large is
              simply that it contains far more pixels than are ever displayed —
              a 4000-pixel photograph shown in an 800-pixel column downloads
              entirely before the browser discards three quarters of it. Resizing
              removes more file size than any quality setting, and it costs
              nothing visible.
            </p>

            <h2>Nothing Here Leaves Your Device</h2>
            <p>
              The image and text tools run entirely in your browser. Files are
              not uploaded, text is not transmitted, and nothing is stored on any
              server. That is a deliberate design choice rather than a marketing
              line, and it is why these tools work on client material,
              unpublished work, and documents you would not paste into a hosted
              service.
            </p>
            <p>
              The exceptions are the two tools that necessarily consult an
              outside source: currency conversion needs live exchange rates, and
              they come from an external rate provider. Everything you type stays
              local; only the rate lookup goes out.
            </p>
            <p>
              A useful side effect of local image processing is that converted
              and resized images do not carry camera metadata forward. GPS
              coordinates and device details embedded in a photograph are a
              common unintended disclosure when sharing images, and processing
              here removes them. If you need that data kept, retain the original.
            </p>

            <h2>Where These Tools Have Limits</h2>
            <ul className="custom-list">
              <li>
                <strong>Enlarging an image cannot add detail.</strong>{" "}
                Interpolation invents pixels from their neighbours, producing a
                larger and softer picture rather than a sharper one.
              </li>
              <li>
                <strong>Case conversion is destructive.</strong> Lowercasing
                text discards proper nouns and acronyms permanently — no
                conversion back restores NASA from nasa.
              </li>
              <li>
                <strong>Exchange rates are indicative.</strong> They are for
                estimating and comparing, not for settlement, and the rate you
                are actually offered will include a margin.
              </li>
              <li>
                <strong>A carbon footprint is a modelled estimate.</strong> The
                ordering of your categories is far more reliable than the total,
                and totals are not comparable across different calculators.
              </li>
              <li>
                <strong>Generated placeholder text is never publishable.</strong>{" "}
                It carries no meaning, so a page built from it informs nobody.
              </li>
            </ul>

            <h2>Privacy by Architecture</h2>
            <p>
              Most online tools of this kind work by uploading your file,
              processing it on a server and sending back a result, which means
              trusting an operator&apos;s retention policy. These run in the
              browser instead, so the question of what happens to your file
              afterwards does not arise — it never went anywhere.
            </p>
            <p>
              The trade-off is that processing speed depends on your own device
              rather than a server, so a very large image takes longer on an
              older phone than it would elsewhere. For the files most people
              handle, the difference is not noticeable, and the privacy position
              is considerably better.
            </p>
            <section className="related-guides">
              <h2>Why These Tools Work the Way They Do</h2>
              <p>Background reading for the tools on this page:</p>
              <ul>
                <li>
                  <Link href="/blog/online-privacy-security-basics/" className="related-card">
                    <span className="related-title">Online Privacy & Security Basics</span>
                    <span className="related-blurb">Why a password generator matters, and what your ordinary traces reveal.</span>
                  </Link>
                </li>
                <li>
                  <Link href="/blog/what-is-numbers-on-your-tip/" className="related-card">
                    <span className="related-title">What Is Numbers on Your Tip?</span>
                    <span className="related-blurb">Why the image and text tools run in your browser and upload nothing.</span>
                  </Link>
                </li>
              </ul>
            </section>

          </section>
        </div>
      </div>

      {/* =======================
    SECTION 3 – ICON BOXES
=========================== */}
    </>
  );
}
