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

const FAQ_DATA: [string, string][] = [
  [
    "Is this my computer's IP address?",
    "No. It is the address of the point where your network meets the internet, usually your router. Every device in your home shares it as far as any website is concerned. Inside your network each device has a private address beginning 192.168, 10. or 172.16 to 172.31, which is not routable across the internet and cannot be seen from outside.",
  ],
  [
    "Why does the city shown not match where I am?",
    "Because there is no location data in an IP address. Geolocation works from a database mapping address ranges to places, built from registry records and inference, so country and provider are usually right while city is frequently wrong. Mobile connections route through gateways that may be in another city, and office or university networks often route through a central site, so a remote worker can appear at their employer's headquarters.",
  ],
  [
    "Are the coordinates my actual position?",
    "No. When a database has no precise information it returns a default point for the region or country, which is why unrelated addresses map to the same spot. It looks like precision and is a placeholder. Nothing in an IP address describes a physical position.",
  ],
  [
    "Can someone find my home address from my IP?",
    "Not from outside. An IP address identifies a connection, not a person — it carries no name, address or identity. The link between an address and a subscriber is held by your internet provider and released to third parties only under legal process. What a website can reasonably infer is your country, your provider and an approximate area.",
  ],
  [
    "Why does my IP address keep changing?",
    "Most residential connections get a dynamic address from a pool, reassigned when the router restarts, when the lease expires, or when the provider reorganises. A static address stays fixed and is usually a paid business option, since it is what running a server reachable from outside requires.",
  ],
  [
    "The address here does not appear anywhere in my router settings. Why?",
    "You are probably behind carrier-grade translation, where the provider places multiple subscribers behind one public address because IPv4 addresses ran short. If so, you share that address with strangers, and incoming connections and port forwarding will not work no matter how the router is configured. Getting a genuinely public address usually means asking the provider for one.",
  ],
  [
    "What is the difference between IPv4 and IPv6?",
    "IPv4 uses four numbers like 203.0.113.42 and its roughly 4.3 billion addresses ran out, which is why sharing behind translation became common. IPv6 uses a much longer hexadecimal format and has enough addresses that scarcity is not a concern, so devices can each hold a routable one. That makes a single device potentially easier to follow across sites, which is why operating systems rotate IPv6 addresses using privacy extensions.",
  ],
  [
    "Does a VPN hide my IP address?",
    "It replaces the address sites see with the VPN server's, so reloading this page on a VPN should show a different result — if it does not, the tunnel is not carrying your traffic. It does not make you anonymous: accounts, cookies and browser characteristics still identify returning visitors, and logging in identifies you outright. Also check that DNS queries go through the tunnel, or your provider still sees every domain you look up.",
  ],
  [
    "Is it dangerous for a website to see my IP address?",
    "It is unavoidable and normally harmless — the address is how responses find their way back to you, so every site you visit necessarily sees it. The realistic risks are approximate location disclosure and, for someone running a server at home, being a target for unsolicited connection attempts. It is not a credential and cannot be used to access your devices on its own.",
  ],
];

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQ_DATA.map(([q, a]) => ({
              "@type": "Question",
              name: q,
              acceptedAnswer: { "@type": "Answer", text: a },
            })),
          }),
        }}
      />
      <div>
        <h1>
          IP Address Detector — Your Public IP, Provider and Location
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
            Couldn&apos;t fetch IP data{errorDetail ? `: ${errorDetail}` : "."}{" "}
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

        {/* ---- SEO CONTENT ---- */}

        <h2>This Is Not Your Computer&apos;s Address</h2>
        <p>
          The address shown above belongs to the point where your network meets
          the internet — usually your router, sometimes a piece of equipment
          further upstream at your provider. Your laptop, phone and television
          all appear as this same address to every site they visit.
        </p>
        <p>
          Inside your home network each device has its own private address,
          typically beginning 192.168, 10., or 172.16 through 172.31. Those
          ranges are reserved and are not routable across the internet, so
          countless networks worldwide use the identical numbers without
          conflict. Your router translates between the private addresses inside
          and the single public one outside, which is why a site can tell that
          someone at your connection visited but not which device did.
        </p>
        <p>
          This distinction matters for a practical reason. When a service asks
          you to allow-list your IP address, it means the public one shown here.
          When you are configuring a printer or a media server at home, it means
          the private one, which this page cannot see.
        </p>

        <h2>How Accurate Is the Location, Really?</h2>
        <p>
          Geolocation is not a measurement. There is no positioning data in an
          IP address, and nothing about the number describes a place. What
          exists is a database mapping ranges of addresses to locations, built
          from registry records, provider disclosures and inference. Accuracy
          therefore varies enormously by field.
        </p>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Field</th>
                <th>Typical reliability</th>
                <th>Why</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Country</td>
                <td>Usually correct</td>
                <td>Address blocks are allocated by regional registries</td>
              </tr>
              <tr>
                <td>Provider and network</td>
                <td>Usually correct</td>
                <td>Ownership of the block is a matter of public record</td>
              </tr>
              <tr>
                <td>Region or state</td>
                <td>Often correct</td>
                <td>Depends on how the provider distributes its blocks</td>
              </tr>
              <tr>
                <td>City</td>
                <td>Frequently wrong</td>
                <td>
                  Often resolves to a provider hub rather than to you
                </td>
              </tr>
              <tr>
                <td>Coordinates</td>
                <td>Not your location</td>
                <td>
                  Commonly a city or country centre point used as a placeholder
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          The coordinates row is worth dwelling on. When a database has no
          precise information it often returns a default point for the region,
          which is how entirely unrelated addresses end up mapped to the same
          spot. It looks like precision and is not.
        </p>
        <p>
          Two situations make city-level results wrong almost by default. Mobile
          data routes through gateways that may be in another city entirely, so
          a phone can appear a hundred kilometres from where it is. Business and
          university connections often route through a central office, which is
          why a remote worker can appear at their employer&apos;s headquarters.
        </p>

        <h2>What Your Address Reveals, and What It Does Not</h2>
        <p>
          A website you visit can see your IP address without you doing
          anything. From it, with a lookup like this one, it can reasonably infer
          your country, your internet provider and an approximate area. That is
          the extent of it.
        </p>
        <p>
          What it does not reveal is your name, your address, your identity, or
          anything about you personally. The mapping from an address to a
          subscriber is held by your provider and released to third parties only
          under legal process. From outside, an IP address identifies a
          connection, not a person.
        </p>
        <p>
          Your provider is in a different position. They allocated the address,
          so they can connect it to your account, and they see which sites you
          connect to. Encryption protects the contents of what you send; it does
          not hide who you are talking to. Our{" "}
          <Link
            href="/blog/online-privacy-security-basics/"
            className="my-link"
          >
            guide to what your IP address and DNS actually reveal
          </Link>{" "}
          works through this in more detail.
        </p>

        <h2>Why the Number Changes</h2>
        <p>
          Most residential connections receive a dynamic address, reassigned
          from a pool. It commonly changes when the router restarts, when a
          lease expires, or when the provider reorganises its network. A static
          address stays fixed and is normally a paid business option, because it
          is what running a server reachable from outside requires.
        </p>
        <p>
          There is a third arrangement that surprises people. Because IPv4
          addresses ran short years ago, many providers place multiple
          subscribers behind a single public address using carrier-grade
          translation. If that is your situation, you share a public IP with
          strangers, and neither incoming connections nor port forwarding will
          work regardless of how your router is configured. The symptom is
          usually that the address shown here does not appear anywhere in your
          router&apos;s own settings.
        </p>

        <h2>IPv4 and IPv6 Side by Side</h2>
        <p>
          You may be shown either format, or both, depending on your connection.
        </p>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th></th>
                <th>IPv4</th>
                <th>IPv6</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Looks like</td>
                <td>203.0.113.42</td>
                <td>2001:0db8:85a3::8a2e:0370:7334</td>
              </tr>
              <tr>
                <td>Address space</td>
                <td>About 4.3 billion — exhausted</td>
                <td>Vast enough that scarcity is not a concern</td>
              </tr>
              <tr>
                <td>Sharing</td>
                <td>Frequently shared behind translation</td>
                <td>Devices can each hold a routable address</td>
              </tr>
              <tr>
                <td>Privacy note</td>
                <td>Shared addresses blur individual devices</td>
                <td>
                  A per-device address can be more identifying, which privacy
                  extensions rotate to mitigate
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          The last row is a genuine trade-off rather than a flaw. IPv6 removes
          the address shortage and, without privacy extensions, would make a
          single device easier to follow across sites than a shared IPv4 address
          does. Modern operating systems rotate their IPv6 addresses for exactly
          this reason.
        </p>

        <h2>When a VPN Changes the Answer and When It Does Not</h2>
        <p>
          A VPN routes your traffic through another server, so the address a
          site sees becomes the VPN&apos;s rather than yours. Reload this page on
          a VPN and the result should change — if it does not, the tunnel is not
          carrying your traffic.
        </p>
        <p>
          What a VPN moves is the answer to &quot;where does this connection
          appear to come from&quot;. It does not make you anonymous. Sites still
          identify returning visitors through accounts, cookies and browser
          characteristics, none of which the tunnel touches. If you log in, you
          have identified yourself regardless of the address.
        </p>
        <p>
          Two leaks are worth checking rather than assuming. If DNS queries
          bypass the tunnel, your provider still sees every domain you look up
          even though the traffic itself is encrypted elsewhere. And browser
          features that establish direct peer connections have historically been
          able to expose a local address. A VPN that changes the result here has
          passed the basic test, not every test.
        </p>

        <h2>What to Do With This Page</h2>
        <ul className="custom-list">
          <li>
            <strong>Allow-listing.</strong> Copy the public address when a
            service asks you to authorise your connection — and remember it will
            stop working when a dynamic address changes.
          </li>
          <li>
            <strong>Confirming a VPN is active.</strong> Compare the result with
            and without the tunnel. Country and provider should both change.
          </li>
          <li>
            <strong>Explaining a geo-restriction.</strong> If a service thinks
            you are in the wrong country, this shows what it is seeing.
          </li>
          <li>
            <strong>Reporting a fault.</strong> Support teams routinely ask for
            your public address and the provider name, both of which are shown
            above.
          </li>
        </ul>
        <p>
          To look up the records behind a domain rather than your own
          connection, use the{" "}
          <Link href="/dns-lookup/" className="my-link">
            DNS lookup tool
          </Link>
          , and the{" "}
          <Link href="/internet-speed-test/" className="my-link">
            internet speed test
          </Link>{" "}
          measures what the connection is actually delivering.
        </p>
      <h2>IP Address Questions</h2>

      {FAQ_DATA.map(([q, a], i) => {
        const isOpen = openFAQ === i;
        return (
          <div className="faq-item" key={i}>
            <h3
              onClick={() => toggleFAQ(i)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggleFAQ(i);
                }
              }}
              role="button"
              tabIndex={0}
              aria-expanded={isOpen}
              aria-controls={`faq-answer-${i}`}
            >
              {q}
              <i
                className={`fa-solid fa-chevron-down ${isOpen ? "rotate" : ""}`}
                aria-hidden="true"
              />
            </h3>
            <div
              id={`faq-answer-${i}`}
              className={`faq-answer-wrap ${isOpen ? "open" : ""}`}
              aria-hidden={!isOpen}
            >
              <div className="faq-answer-inner">
                <p>{a}</p>
              </div>
            </div>
          </div>
        );
      })}

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
