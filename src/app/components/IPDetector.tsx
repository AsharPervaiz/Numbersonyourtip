"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import "@fortawesome/fontawesome-free/css/all.min.css";

interface IPData {
  ip: string;
  city?: string;
  region?: string;
  country_name?: string;
  country_code?: string;
  postal?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  utc_offset?: string;
  org?: string;
  asn?: string;
  currency?: string;
  currency_name?: string;
  languages?: string;
  country_calling_code?: string;
}

export default function IPDetector() {
  const [data, setData] = useState<IPData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errorDetail, setErrorDetail] = useState("");
  const [copied, setCopied] = useState(false);
  const [lookupIp, setLookupIp] = useState("");
  const [isCustomLookup, setIsCustomLookup] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const fetchIPInfo = async (ip?: string) => {
    setLoading(true);
    setError(false);
    setErrorDetail("");

    try {
      const trimmed = ip?.trim();
      const url = trimmed
        ? `https://get.geojs.io/v1/ip/geo/${encodeURIComponent(trimmed)}.json`
        : `https://get.geojs.io/v1/ip/geo.json`;

      const res = await fetch(url);

      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("json")) {
        const text = await res.text();
        throw new Error(
          `Non-JSON response (status ${res.status}): ${text.slice(0, 120)}`,
        );
      }

      const json = await res.json();
      const result = Array.isArray(json) ? json[0] : json;

      if (!result || !result.ip) {
        throw new Error("Lookup failed — no data returned for that IP");
      }

      const normalized: IPData = {
        ip: result.ip,
        city: result.city || undefined,
        region: result.region || undefined,
        country_name: result.country || undefined,
        country_code: result.country_code || undefined,
        latitude: result.latitude ? parseFloat(result.latitude) : undefined,
        longitude: result.longitude ? parseFloat(result.longitude) : undefined,
        timezone: result.timezone || undefined,
        org:
          result.organization_name && result.organization_name !== "Unknown"
            ? result.organization_name
            : undefined,
        asn: result.asn ? `AS${result.asn}` : undefined,
      };

      setData(normalized);
    } catch (e: any) {
      console.error("IP lookup failed:", e?.message || e);
      setErrorDetail(e?.message || "Unknown error");
      setError(true);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIPInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCopy = () => {
    if (!data?.ip) return;
    navigator.clipboard.writeText(data.ip);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleLookup = () => {
    if (!lookupIp.trim()) return;
    setIsCustomLookup(true);
    fetchIPInfo(lookupIp.trim());
  };

  const handleMyIp = () => {
    setLookupIp("");
    setIsCustomLookup(false);
    fetchIPInfo();
  };

  return (
    <div className="single-page-padding">
      <div>
        <h1>
          Free IP Address Detector – Find Your IP &amp; Location Instantly
        </h1>
        <p>
          Instantly detect your public IP address, ISP, city, country, and
          timezone — or look up any IP address for free. No sign-up, no API key,
          no limits.
        </p>
      </div>

      <div className="calc-card">
        {/* ── Loading ── */}
        {loading && (
          <div className="empty-hint">
            <i className="fa-solid fa-spinner fa-spin"></i>
            Detecting IP address…
          </div>
        )}

        {/* ── Error ── */}
        {!loading && error && (
          <div className="empty-hint">
            <i className="fa-solid fa-triangle-exclamation"></i>
            Couldn't fetch IP data{errorDetail ? `: ${errorDetail}` : "."}{" "}
            Please try again.
          </div>
        )}

        {/* ── Result ── */}
        {!loading && !error && data && (
          <div className="calc-result" style={{ marginTop: 0, padding: 0 }}>
            {/* Big centered IP, click to copy */}
            <div className="ip-hero">
              <div className="ip-hero-ring" aria-hidden="true"></div>
              <div
                className="ip-hero-value"
                onClick={handleCopy}
                title="Click to copy"
              >
                {data.ip}
              </div>
              <div className={`ip-hero-copied${copied ? " show" : ""}`}>
                <i
                  className={`fa-solid ${copied ? "fa-check" : "fa-copy"}`}
                ></i>
                {copied ? "Copied to clipboard" : "Click the IP to copy"}
              </div>

              <div
                className="stats-pills-row"
                style={{ justifyContent: "center", marginTop: "14px" }}
              >
                <div className="stat-chip">
                  Type: <b>{data.ip?.includes(":") ? "IPv6" : "IPv4"}</b>
                </div>
                {data.country_code && (
                  <div className="stat-chip">
                    Country: <b>{data.country_code}</b>
                  </div>
                )}
                {data.city && (
                  <div className="stat-chip">
                    City: <b>{data.city}</b>
                  </div>
                )}
              </div>
            </div>

            {/* Lookup row */}
            <div className="ip-lookup-row">
              <input
                className="tool-input"
                type="text"
                placeholder="Look up any IP address and press Enter…"
                value={lookupIp}
                onChange={(e) => setLookupIp(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleLookup();
                }}
                style={{ marginBottom: 0 }}
              />
              {isCustomLookup && (
                <span className="ip-lookup-back" onClick={handleMyIp}>
                  <i className="fa-solid fa-rotate-left"></i> My IP
                </span>
              )}
            </div>

            {/* Other details below */}
            <div className="ip-detail-grid">
              <InfoRow icon="fa-map" label="Region" value={data.region} />
              <InfoRow
                icon="fa-flag"
                label="Country"
                value={data.country_name}
              />
              <InfoRow icon="fa-clock" label="Timezone" value={data.timezone} />
              <InfoRow icon="fa-building" label="ISP / Org" value={data.org} />
              <InfoRow icon="fa-network-wired" label="ASN" value={data.asn} />
              <InfoRow
                icon="fa-globe"
                label="Coordinates"
                value={
                  data.latitude && data.longitude
                    ? `${data.latitude}, ${data.longitude}`
                    : undefined
                }
              />
            </div>
          </div>
        )}
      </div>

      {/* ===== SEO CONTENT ===== */}

      <h2>What Is an IP Address Detector?</h2>
      <p>
        An IP address detector is a free online tool that instantly reveals your
        public IP address along with related network and location information —
        your approximate city, country, internet service provider (ISP),
        timezone, and autonomous system number (ASN). The moment you load this
        page, your browser's public-facing IP is automatically detected and
        displayed without you clicking anything or signing up for an account.
      </p>
      <p>
        Every device connected to the internet is assigned a public IP address
        by its internet service provider. This address acts like a return
        address for data traveling across the web, allowing websites, servers,
        and other devices to know where to send information back to you. This
        tool reads that address directly from your connection and
        cross-references it against IP geolocation databases to surface useful
        details about your network.
      </p>
      <p>
        If you are troubleshooting a domain or email issue alongside your IP
        lookup, our{" "}
        <Link href="/dns-lookup/" className="my-link">
          DNS lookup tool
        </Link>{" "}
        lets you check a domain's A, MX, TXT, and NS records in real time — a
        natural companion when diagnosing connectivity problems.
      </p>

      <h2>Why Would You Need to Check Your IP Address?</h2>
      <ul className="custom-list">
        <li>
          <strong>Troubleshooting network issues</strong> — Confirm your public
          IP when setting up port forwarding, remote desktop access, firewall
          rules, or self-hosted services.
        </li>
        <li>
          <strong>Verifying VPN or proxy connections</strong> — Check that your
          IP actually changed after connecting to a VPN, confirming your traffic
          is routing through the expected location and server.
        </li>
        <li>
          <strong>Gaming and server hosting</strong> — Multiplayer games and
          self-hosted game servers often require you to know your public IP so
          friends can connect directly.
        </li>
        <li>
          <strong>Security and privacy audits</strong> — See exactly what
          information websites can detect about your connection, including your
          approximate location, ISP, and ASN.
        </li>
        <li>
          <strong>Remote work and IT support</strong> — Quickly share your IP
          address with an IT administrator for whitelisting, VPN configuration,
          or firewall rule setup.
        </li>
        <li>
          <strong>Geo-restricted content troubleshooting</strong> — Understand
          why a streaming service or website thinks you are in a particular
          country when you are not.
        </li>
        <li>
          <strong>Email deliverability checks</strong> — If your outbound email
          is being rejected, knowing your sending IP helps you check whether it
          is blacklisted. Pair this with our{" "}
          <Link href="/email-validator/" className="my-link">
            email validator
          </Link>{" "}
          to verify recipient addresses and our{" "}
          <Link href="/dns-lookup/" className="my-link">
            DNS lookup tool
          </Link>{" "}
          to check SPF and DKIM records.
        </li>
      </ul>

      <h2>What Information Does This Tool Show?</h2>
      <p>
        The table below explains each data point this IP detector returns and
        what it tells you about your connection:
      </p>
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: "20px",
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: "var(--card-bg, #f5f5f5)",
                textAlign: "left",
              }}
            >
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                Field
              </th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                What It Shows
              </th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                Why It Matters
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              [
                "Public IP Address",
                "Your IPv4 or IPv6 address as seen by external servers",
                "Required for remote access, port forwarding, VPN verification",
              ],
              [
                "City & Region",
                "Approximate geographic location from ISP-assigned IP ranges",
                "Helps diagnose geo-restriction issues and VPN location checks",
              ],
              [
                "Country",
                "Country your IP block is registered to, with country code",
                "Explains why region-locked content is or isn't accessible",
              ],
              [
                "ISP / Organization",
                "The company that owns the IP block (your internet provider)",
                "Useful for reporting abuse, checking blacklists, or contacting support",
              ],
              [
                "Timezone",
                "Local timezone associated with your detected location",
                "Helpful when scheduling across time zones or debugging timestamps",
              ],
              [
                "ASN",
                "Autonomous System Number identifying your network operator",
                "Used in network engineering, peering analysis, and abuse reporting",
              ],
              [
                "Coordinates",
                "Approximate latitude and longitude of the IP's registered location",
                "Shows the general area, not your exact address — typically city-level",
              ],
            ].map(([field, shows, matters], i) => (
              <tr key={i}>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {field}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {shows}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {matters}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>How to Use the IP Address Detector</h2>
      <ul className="custom-list">
        <li>
          <strong>Step 1:</strong> Your own public IP and location details load
          automatically the moment you open this page — no action needed.
        </li>
        <li>
          <strong>Step 2:</strong> To check a different IP address, type it into
          the search field and press Enter.
        </li>
        <li>
          <strong>Step 3:</strong> Click the large IP address display to
          instantly copy it to your clipboard.
        </li>
        <li>
          <strong>Step 4:</strong> Click "My IP" at any time to return to your
          own detected address.
        </li>
      </ul>

      <h2>IPv4 vs. IPv6 — What Is the Difference?</h2>
      <p>
        The internet uses two versions of the IP addressing system. This tool
        automatically detects which one your connection is using.
      </p>
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: "20px",
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: "var(--card-bg, #f5f5f5)",
                textAlign: "left",
              }}
            >
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                Feature
              </th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                IPv4
              </th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                IPv6
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              [
                "Format",
                "Four decimal numbers (e.g. 192.168.1.1)",
                "Eight hexadecimal groups (e.g. 2001:0db8::7334)",
              ],
              ["Address Length", "32-bit", "128-bit"],
              [
                "Total Addresses",
                "~4.3 billion",
                "~340 undecillion (virtually unlimited)",
              ],
              [
                "Adoption",
                "Universal — still the majority of traffic",
                "Growing — most modern ISPs support both",
              ],
              [
                "NAT Required?",
                "Yes — ISPs share addresses via NAT",
                "No — every device can have a unique address",
              ],
              [
                "Header Complexity",
                "More complex, variable-length",
                "Simplified, fixed-length — faster routing",
              ],
            ].map(([feature, v4, v6], i) => (
              <tr key={i}>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {feature}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {v4}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {v6}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        IPv4 is the older, more widely used system. Because its 4.3 billion
        addresses have essentially run out, ISPs increasingly assign IPv6
        addresses to new connections. Most devices and networks support both
        simultaneously, and this detector automatically identifies which version
        your connection is using.
      </p>

      <h2>Public vs. Private IP Addresses</h2>
      <p>
        Your home or office network actually uses two types of IP addresses, and
        understanding the difference is important for troubleshooting:
      </p>
      <ul className="custom-list">
        <li>
          <strong>Public IP address</strong> — The address assigned by your ISP
          that represents your entire network to the outside internet. This is
          what websites, game servers, and remote services see when you connect.
          This is the address this tool detects.
        </li>
        <li>
          <strong>Private IP address</strong> — The address assigned by your
          router to each device within your local network (typically starting
          with 192.168.x.x, 10.x.x.x, or 172.16.x.x). Private IPs are invisible
          to the outside internet and are only used for communication between
          devices on your own network.
        </li>
      </ul>
      <p>
        When you set up port forwarding, configure a VPN, or share your IP with
        IT support, they need your public IP — not your private one. This tool
        always shows the public address.
      </p>

      <h2>How IP Geolocation Works — And Its Limitations</h2>
      <p>
        IP geolocation maps an IP address to a geographic location by
        cross-referencing it against databases maintained by regional internet
        registries (RIRs) and commercial geolocation providers. These databases
        track which IP ranges are assigned to which ISPs, and where those ISPs
        operate geographically.
      </p>
      <p>
        The result is an approximation, not a GPS fix. Here is what you can
        generally expect in terms of accuracy:
      </p>
      <ul className="custom-list">
        <li>
          <strong>Country:</strong> Accurate in 95 to 99% of cases.
        </li>
        <li>
          <strong>City / Region:</strong> Accurate within 50 to 100 km for most
          connections. Rural or mobile connections may resolve to the nearest
          major city.
        </li>
        <li>
          <strong>Exact street address:</strong> Not possible from an IP address
          alone. IP geolocation will never pinpoint your house or building —
          this is true of all IP lookup tools, not just this one.
        </li>
      </ul>
      <p>
        If the city shown does not match your actual location, it is usually
        because your ISP routes your traffic through a regional hub in a
        different city. This is especially common with mobile data connections,
        satellite internet, and carrier-grade NAT setups.
      </p>

      <h2>Is It Safe to Share Your IP Address?</h2>
      <p>
        Sharing your public IP address carries minimal risk in most situations.
        It does not reveal your exact physical address, name, or personal
        identity — only an approximate location tied to your ISP's regional
        infrastructure, which is often a city or region away from where you
        actually are.
      </p>
      <p>
        That said, it is good practice to avoid sharing your IP with untrusted
        parties. A determined attacker with your IP could potentially attempt
        port scanning, DDoS attacks, or social engineering against your ISP.
        Using a VPN masks your real IP and adds a layer of protection in
        situations where privacy matters.
      </p>
      <p>
        This tool runs the lookup directly from your browser to a geolocation
        API — we do not log, store, or track the IP addresses or results you
        look up.
      </p>

      <h2>Common IP Address Troubleshooting Scenarios</h2>

      <h3>VPN Not Working as Expected</h3>
      <p>
        Connect to your VPN, then reload this page. If the IP address shown is
        still your real one (same city, same ISP), the VPN connection is not
        active or is leaking your real IP. Try reconnecting, switching VPN
        protocols, or contacting your VPN provider's support.
      </p>

      <h3>Remote Access Not Connecting</h3>
      <p>
        If you are trying to access your home computer remotely and the
        connection fails, confirm that the public IP you shared has not changed.
        Many ISPs assign dynamic IPs that rotate periodically. Check this tool
        to see your current IP and update your remote access configuration if it
        has changed.
      </p>

      <h3>Website or Service Thinks You Are in the Wrong Country</h3>
      <p>
        Some streaming services, banking apps, and government websites use IP
        geolocation to restrict access. If a service blocks you despite being in
        the correct country, your ISP may be routing traffic through an
        international hub. Contacting your ISP to confirm your IP range's
        registered country is the first step. Alternatively, connecting through
        a VPN server in the correct country resolves most geo-restriction
        issues.
      </p>

      <h3>Email Being Rejected or Blacklisted</h3>
      <p>
        If outbound email from your server is being rejected, your sending IP
        may be on a blacklist. Use this tool to confirm the IP your mail server
        is sending from, then check it against major blacklist databases. You
        can also verify your email configuration using our{" "}
        <Link href="/email-validator/" className="my-link">
          email validator
        </Link>{" "}
        and confirm your domain's SPF and DKIM records with our{" "}
        <Link href="/dns-lookup/" className="my-link">
          DNS lookup tool
        </Link>
        .
      </p>

      <h2>Frequently Asked Questions</h2>

      {[
        [
          "Is this IP detector tool free to use?",
          "Yes, completely free with no limits, no sign-up, and no hidden charges. Your IP and location details load automatically, and you can look up additional IP addresses as many times as you need.",
        ],
        [
          "Why does the location shown not match my exact address?",
          "IP geolocation is based on the regional block of addresses assigned by your ISP, not GPS data. It typically identifies the city or region accurately but rarely pinpoints an exact street address. This is a fundamental limitation of all IP lookup tools, not a flaw in this one.",
        ],
        [
          "Can I look up someone else's IP address?",
          "Yes. Enter any public IPv4 or IPv6 address into the search field to see its associated location, ISP, ASN, and other publicly available network details. This works for any valid public IP address.",
        ],
        [
          "Why does my IP address change when I use a VPN?",
          "A VPN routes your internet traffic through a remote server, so websites and tools see the VPN server's IP address instead of your real one. This tool is a quick way to confirm your VPN is actively masking your IP and showing the expected location.",
        ],
        [
          "What is an ISP and why does it appear in the results?",
          "ISP stands for Internet Service Provider — the company that provides your internet connection. Every public IP address is registered to an ISP or hosting organization, which is why this detail appears in the lookup. Common examples include Comcast, AT&T, Jio, PTCL, and Vodafone.",
        ],
        [
          "Does this tool store or track my IP address?",
          "No. The detection happens directly between your browser and the geolocation provider (GeoJS) in real time. We do not log, store, or share any IP addresses or lookup results.",
        ],
        [
          "What is the difference between a public and private IP address?",
          "A private IP address (like 192.168.1.x) is used only within your home or office network and is invisible to the outside internet. A public IP address is the one assigned by your ISP that represents your network to the wider internet — this is the address this tool detects. You need your public IP for remote access, gaming, and VPN verification.",
        ],
        [
          "Does this work on mobile devices?",
          "Yes. The IP detector is fully responsive and works on iPhones, Android phones, tablets, and desktop browsers. No app installation required — just open this page and your IP is detected instantly.",
        ],
        [
          "Why does my IP address change periodically?",
          "Most residential ISPs assign dynamic IP addresses, which can change every time your router restarts or at regular intervals set by the ISP. If you need a permanent address for hosting or remote access, ask your ISP about a static IP — though these usually cost extra.",
        ],
      ].map(([q, a], i) => (
        <div className="faq-item" key={i}>
          <h3 onClick={() => toggleFAQ(i)}>
            {q}
            <i
              className={`fa-solid fa-chevron-down ${openFAQ === i ? "rotate" : ""}`}
            ></i>
          </h3>
          {openFAQ === i && <p>{a}</p>}
        </div>
      ))}

      <h2>Final Thoughts</h2>
      <p>
        Your IP address is one of the most basic but important pieces of your
        internet identity. Whether you are verifying a VPN, setting up remote
        access, diagnosing email issues, or simply curious about what the
        internet can see about your connection, this tool gives you the answer
        in seconds.
      </p>
      <p>
        For related diagnostics, check domain configurations with our{" "}
        <Link href="/dns-lookup/" className="my-link">
          DNS lookup tool
        </Link>
        , validate email addresses with our{" "}
        <Link href="/email-validator/" className="my-link">
          email validator
        </Link>
        , or explore our full collection of{" "}
        <Link href="/" className="my-link">
          free calculators and tools
        </Link>
        .
      </p>

      <style jsx>{`
        .ip-hero {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 36px 16px 8px;
          overflow: hidden;
        }
        .ip-hero-ring {
          position: absolute;
          top: 4px;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          border: 1px solid #1f9fb8;
          opacity: 0.35;
          animation: ip-pulse 2.6s ease-out infinite;
          pointer-events: none;
        }
        @keyframes ip-pulse {
          0% {
            width: 90px;
            height: 90px;
            opacity: 0.5;
          }
          100% {
            width: 260px;
            height: 260px;
            opacity: 0;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .ip-hero-ring {
            animation: none;
            display: none;
          }
        }
        .ip-hero-value {
          position: relative;
          display: inline-block;
          cursor: pointer;
          font-weight: 800;
          font-size: clamp(1.9rem, 6vw, 3.4rem);
          letter-spacing: -0.01em;
          color: #0d2a5c;
          word-break: break-all;
          line-height: 1.15;
          transition: color 0.15s ease;
        }
        .ip-hero-value:hover {
          color: #1f9fb8;
        }
        .ip-hero-copied {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: 10px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.03em;
          text-transform: uppercase;
          color: #1f9fb8;
          transition: color 0.15s ease;
        }
        .ip-hero-copied.show {
          color: #1f9fb8;
        }
        .ip-lookup-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 28px 0 8px;
          padding: 0 16px;
        }
        .ip-lookup-row i.fa-magnifying-glass {
          color: #999;
          font-size: 13px;
        }
        .ip-lookup-back {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          white-space: nowrap;
          font-size: 13px;
          font-weight: 600;
          color: #1f9fb8;
          cursor: pointer;
        }
        .ip-lookup-back i {
          font-size: 11px;
        }
        .ip-detail-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 12px;
          padding: 20px 16px 16px;
        }
      `}</style>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value?: string;
}) {
  if (!value) return null;
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
      <i
        className={`fa-solid ${icon}`}
        style={{
          color: "#1F9FB8",
          fontSize: "14px",
          marginTop: "3px",
          width: "16px",
        }}
      ></i>
      <div>
        <div
          style={{
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            color: "#999",
          }}
        >
          {label}
        </div>
        <div style={{ fontSize: "18px", fontWeight: 600, color: "#000" }}>
          {value}
        </div>
      </div>
    </div>
  );
}
