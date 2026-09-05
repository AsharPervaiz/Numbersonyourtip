import Link from "next/link";


import "@fortawesome/fontawesome-free/css/all.min.css";
import { IconCircle, Icons } from "../components/MenuIcons";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Networking Tools — DNS, IP, Email, Domains",
  description:
    "DNS record lookup, public IP and location, email domain validation, domain availability and a live speed test — with what each one cannot prove.",
  alternates: {
    canonical: "/networking-tools/",
  },
  openGraph: {
    title: "Free Networking Tools | Numbers On Your Tip",
    description:
      "A diagnostic order for when a site will not load or mail will not arrive, and the limits of each check.",
    url: "/networking-tools/",
    type: "website",
  },
  twitter: {
    title: "Networking Tools",
    description:
      "DNS records, public IP, email domain validation, domain checks and speed test.",
  },
};

export default function Networktools() {
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
            <h1 className="more-tools">Networking Tools</h1>
            <p style={{ maxWidth: "640px", marginBottom: "28px", lineHeight: 1.7 }}>
              Everyday diagnostic tools for developers, sysadmins, and anyone
              troubleshooting a network or email issue: look up any domain&apos;s
              DNS records (A, MX, TXT, CNAME, and more) straight from
              Google&apos;s public resolver, detect your own or any public IP
              address and its approximate location, validate whether an
              email address is correctly formatted and deliverable, check
              domain name availability across popular TLD extensions, and run
              a real internet speed test to measure your download, upload,
              and ping. Every lookup runs live — nothing is cached or served
              from an old snapshot.
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
                      <IconCircle color="teal">
                        <Icons.Speed />
                      </IconCircle>{" "}
                      <h4>Internet Speed Test</h4>
                    </div>
                  ),
                  href: "/internet-speed-test/",
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
            <h2>Two Kinds of Question Live Here</h2>
            <p>
              These five tools split cleanly in two. Three of them ask something
              about a domain that belongs to someone else. Two ask something
              about the connection you are sitting on right now.
            </p>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Asks about</th>
                    <th>Tool</th>
                    <th>Answers</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>A domain</td>
                    <td>
                      <Link className="my-link" href="/dns-lookup/">
                        DNS lookup
                      </Link>
                    </td>
                    <td>Where its records point, and how long they are cached</td>
                  </tr>
                  <tr>
                    <td>A domain</td>
                    <td>
                      <Link className="my-link" href="/email-validator/">
                        Email validator
                      </Link>
                    </td>
                    <td>Whether an address is well formed and its domain takes mail</td>
                  </tr>
                  <tr>
                    <td>A domain</td>
                    <td>
                      <Link className="my-link" href="/domain-name-checker/">
                        Domain name checker
                      </Link>
                    </td>
                    <td>Whether a name is registered, across several extensions</td>
                  </tr>
                  <tr>
                    <td>Your connection</td>
                    <td>
                      <Link className="my-link" href="/ip-detector/">
                        IP detector
                      </Link>
                    </td>
                    <td>The address, provider and rough location you present as</td>
                  </tr>
                  <tr>
                    <td>Your connection</td>
                    <td>
                      <Link className="my-link" href="/internet-speed-test/">
                        Internet speed test
                      </Link>
                    </td>
                    <td>Download, upload, ping and jitter measured live</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2>A Working Order for &quot;Something Is Broken&quot;</h2>
            <p>
              Most people arrive at these tools mid-problem. Running them in a
              sensible sequence narrows the fault faster than trying them at
              random.
            </p>
            <p>
              <strong>A website will not load.</strong> Start with the DNS
              lookup. If the A record is missing, the problem is the records. If
              it is present and points somewhere you recognise, DNS has done its
              job and the fault is the server or the route to it — check your own
              connection with the speed test before assuming the site is down.
            </p>
            <p>
              <strong>Mail is not arriving.</strong> Check the recipient domain
              for MX records with the DNS lookup, then run the address through
              the email validator. If both are fine and mail still fails, the
              issue is usually sender authentication rather than the address:
              look up SPF, DKIM and DMARC as TXT records on your own sending
              domain.
            </p>
            <p>
              <strong>A change you made has not appeared.</strong> Look at the
              TTL on the record. Almost every case of a DNS change not taking
              effect is a cached copy that has not yet expired, and the NS
              records will tell you whether you have even been editing the zone
              that is actually in use.
            </p>
            <p>
              <strong>A service says you are in the wrong country.</strong> The
              IP detector shows what that service is seeing. Country is usually
              accurate; city frequently is not.
            </p>

            <h2>What These Tools Cannot Prove</h2>
            <p>
              Each of these answers a narrow question well and a broad one not at
              all, which is worth stating plainly.
            </p>
            <ul className="custom-list">
              <li>
                A DNS record shows where something is pointed, never whether the
                server behind it is running.
              </li>
              <li>
                An email domain with MX records accepts mail, which says nothing
                about whether a specific mailbox exists — that cannot be
                established reliably from outside at all.
              </li>
              <li>
                An available domain may still be premium-priced, trademarked by
                someone else, or carrying penalties from a previous owner.
              </li>
              <li>
                IP geolocation is a database lookup, not a measurement. Country
                is usually right, coordinates are typically a regional
                placeholder.
              </li>
              <li>
                A speed test measures the path between your device and one test
                server at one moment, which is not the same as the speed you get
                to every service all day.
              </li>
            </ul>

            <h2>Everything Here Is Already Public</h2>
            <p>
              None of these tools uncovers anything hidden. DNS records are
              published deliberately so the internet can find a domain. Your IP
              address is visible to every site you visit, because it is how
              responses find their way back to you. Registration status is a
              matter of public record.
            </p>
            <p>
              That is the useful framing for the privacy question these tools
              raise. The question is not how to hide what they show, but how to
              understand what is visible by default and decide what to do about
              it. Our guide to{" "}
              <Link
                className="my-link"
                href="/blog/online-privacy-security-basics/"
              >
                what your IP address, DNS and email actually reveal
              </Link>{" "}
              works through that in detail.
            </p>

            <h2>Accuracy and Data Sources</h2>
            <p>
              These tools differ from the calculators elsewhere on this site in
              one important way: they do not compute an answer from your inputs,
              they report what a live external service returns.
            </p>
            <p>
              DNS results come from a public DNS-over-HTTPS resolver, so you see
              what that resolver currently holds — which can differ from your own
              network&apos;s cache. IP and location details come from a
              geolocation service that maps address ranges to places. Domain
              registration status comes from public registry data. The speed test
              measures against a large public network with servers worldwide, so
              your result reflects the route to the nearest of those rather than
              to any particular website.
            </p>
            <p>
              In each case the accuracy of the answer is the accuracy of the
              underlying source, which is why every page here says what it cannot
              establish as well as what it can. Nothing you enter is stored, and
              the queries run from your browser.
            </p>
            <section className="related-guides">
              <h2>What These Checks Actually Reveal</h2>
              <p>What these tools actually reveal, and how to read the output:</p>
              <ul>
                <li>
                  <Link href="/blog/online-privacy-security-basics/" className="related-card">
                    <span className="related-title">Online Privacy & Security Basics</span>
                    <span className="related-blurb">What an IP address does and does not expose, what a DNS lookup shows, and a five-minute check anyone can run.</span>
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
