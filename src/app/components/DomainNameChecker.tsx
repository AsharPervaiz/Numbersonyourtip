"use client";
import { useState } from "react";
import Link from "next/link";
import Head from "next/head";
import "@fortawesome/fontawesome-free/css/all.min.css";

const POPULAR_TLDS = [
  ".com",
  ".net",
  ".org",
  ".io",
  ".co",
  ".dev",
  ".app",
  ".ai",
];

function stripDomain(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .split("/")[0]
    .split("?")[0];
}
function getDomainBase(d: string): string {
  return d.split(".")[0] || "";
}

interface CheckResult {
  domain: string;
  available: boolean | null;
  registrar?: string;
  nameservers?: string[];
  statuses?: string[];
}

const FAQ_DATA = [
  {
    q: "Is this domain checker free to use?",
    a: "Yes, completely free with no sign-up, no purchase required, and no limits. Check as many domain names as you need. Results come from live RDAP and WHOIS registry data.",
  },
  {
    q: "How do I check if a domain name is available?",
    a: "Enter a name (just the word, without an extension) into the search field and press Enter or click Check. The tool queries live registration databases for all 8 extensions simultaneously and shows which are available and which are taken.",
  },
  {
    q: "How accurate are the results?",
    a: "Results come from live RDAP and WHOIS registry data — the same authoritative source that registrars use. Availability is accurate at the moment of the check, though a domain showing as available could be registered by someone else in the seconds between checking and your own registration.",
  },
  {
    q: "What does 'Unknown' mean for a result?",
    a: "Some domain registries do not support RDAP or WHOIS lookups from public tools, or they rate-limit requests. Unknown means the check timed out or returned an unreadable response — it does not necessarily mean the domain is taken. Try again after a moment.",
  },
  {
    q: "How do I find out who owns a domain?",
    a: "For domains that show as taken, this tool displays the registrar name or primary nameserver when available. For full ownership details (registrant name, contact information), you would need to run a full WHOIS lookup — though many domain owners use privacy protection services that hide this information.",
  },
  {
    q: "Which is better — .com, .net, or .org?",
    a: ".com is the most recognized and trusted extension globally and should be your first choice if available. .net was originally intended for network infrastructure companies but is now used as a general-purpose alternative. .org is traditionally associated with non-profits and open-source projects. For most businesses, .com is the strongest option.",
  },
  {
    q: "Can I check a domain without being forced to buy it?",
    a: "Yes. This is a free domain checker without buying — it only checks availability using public registry data. There is no registration, no shopping cart, and no affiliate links to registrars. You take the results and register wherever you choose.",
  },
  {
    q: "Where can I register a domain once I find an available one?",
    a: "Any ICANN-accredited registrar — Cloudflare, Namecheap, GoDaddy, Porkbun, Google Domains (now via Squarespace), and others. Prices vary by TLD and registrar, so compare before registering.",
  },
  {
    q: "Does this tool store my searches?",
    a: "No. Checks go directly from your browser to the RDAP/WHOIS API. Nothing is logged, stored, or shared on our end.",
  },
];

export default function DomainChecker() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<CheckResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeDomain, setActiveDomain] = useState("");
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const toggleFAQ = (i: number) => setOpenFAQ(openFAQ === i ? null : i);

  const checkOne = async (domain: string): Promise<CheckResult> => {
    try {
      const res = await fetch(
        `https://who-dat.as93.net/${encodeURIComponent(domain)}`,
        { signal: AbortSignal.timeout(8000) },
      );
      const json = await res.json();
      if (json?.error) return { domain, available: null };
      const available = json?.isRegistered === false;
      const registrar =
        json?.registrar?.name || json?.domain?.registrar || undefined;
      const rawNS =
        json?.domain?.name_servers ??
        json?.domain?.nameServers ??
        json?.nameServers ??
        json?.name_servers ??
        [];
      const nameservers: string[] = Array.isArray(rawNS)
        ? rawNS.map((s: string) => s.toLowerCase().replace(/\.$/, ""))
        : [];
      const rawSt = json?.domain?.status ?? json?.status ?? [];
      const statuses: string[] = Array.isArray(rawSt)
        ? rawSt
            .map((s: string) => s.replace(/https?:\/\/\S+/g, "").trim())
            .filter(Boolean)
        : [];
      return { domain, available, registrar, nameservers, statuses };
    } catch {
      return { domain, available: null };
    }
  };

  const runCheck = async (baseName: string) => {
    const base =
      getDomainBase(stripDomain(baseName)) || getDomainBase(baseName);
    if (!base) return;
    setLoading(true);
    setActiveDomain(base);
    setResults([]);
    const checks = POPULAR_TLDS.map((tld) => checkOne(`${base}${tld}`));
    const settled = await Promise.all(checks);
    setResults(settled);
    setLoading(false);
  };

  const handleSearch = () => {
    const cleaned = stripDomain(input);
    if (cleaned) runCheck(cleaned);
  };
  const available = results.filter((r) => r.available === true);
  const taken = results.filter((r) => r.available === false);
  const errored = results.filter((r) => r.available === null);

  // FAQ Schema JSON-LD
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_DATA.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  return (
    <div className="single-page-padding">
      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div>
        <h1>
          Free Domain Name Checker – Check Availability Across All Extensions
        </h1>
        <p>
          Instantly check if a website name is taken across .com, .net, .org,
          .io, .co, .dev, .app, and .ai at once. This free domain availability
          check requires no signup and no purchase — just enter a name and see
          which extensions are available right now, powered by live RDAP and
          WHOIS data.
        </p>
      </div>

      <div className="calc-card">
        <div className="dns-search-row">
          <input
            className="tool-input"
            type="text"
            placeholder="Enter a name to check, e.g. mybrand"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            style={{ marginBottom: 0 }}
          />
          <button
            type="button"
            className="dns-search-btn"
            onClick={handleSearch}
            disabled={loading}
          >
            <i
              className={`fa-solid ${loading ? "fa-spinner fa-spin" : "fa-magnifying-glass"}`}
            ></i>
            {loading ? "Checking…" : "Check"}
          </button>
        </div>
        {!loading && results.length === 0 && (
          <div className="empty-hint">
            <i className="fa-solid fa-circle-info"></i>Enter a domain name or
            brand and we'll check availability across 8 popular extensions
            instantly.
          </div>
        )}
        {loading && (
          <div className="empty-hint">
            <i className="fa-solid fa-spinner fa-spin"></i>Checking{" "}
            <b>{activeDomain}</b> across {POPULAR_TLDS.length} extensions…
          </div>
        )}
        {!loading && results.length > 0 && (
          <div className="calc-result" style={{ marginTop: 0, padding: 0 }}>
            <div className="dc-hero">
              <div className="dc-hero-name">{activeDomain}</div>
              <div
                className="stats-pills-row"
                style={{ justifyContent: "center", marginTop: "14px" }}
              >
                <div className="stat-chip dc-pill-available">
                  <i className="fa-solid fa-circle-check"></i> Available:{" "}
                  <b>{available.length}</b>
                </div>
                <div className="stat-chip dc-pill-taken">
                  <i className="fa-solid fa-lock"></i> Taken:{" "}
                  <b>{taken.length}</b>
                </div>
                {errored.length > 0 && (
                  <div className="stat-chip">
                    Unknown: <b>{errored.length}</b>
                  </div>
                )}
              </div>
            </div>
            <div className="dc-list">
              {results.map((r) => (
                <div
                  key={`result-${r.domain}`}
                  className={`dc-row ${r.available === true ? "dc-row-available" : r.available === false ? "dc-row-taken" : "dc-row-unknown"}`}
                >
                  <div className="dc-row-domain">{r.domain}</div>
                  <div className="dc-row-right">
                    {r.available === false && r.registrar && (
                      <span className="dc-row-meta">{r.registrar}</span>
                    )}
                    {r.available === false &&
                      !r.registrar &&
                      r.nameservers &&
                      r.nameservers.length > 0 && (
                        <span className="dc-row-meta">{r.nameservers[0]}</span>
                      )}
                    <span
                      className={`dc-badge ${r.available === true ? "dc-badge-available" : r.available === false ? "dc-badge-taken" : "dc-badge-unknown"}`}
                    >
                      <i
                        className={`fa-solid ${r.available === true ? "fa-circle-check" : r.available === false ? "fa-lock" : "fa-circle-question"}`}
                      ></i>
                      {r.available === true
                        ? "Available"
                        : r.available === false
                          ? "Taken"
                          : "Unknown"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ===== SEO CONTENT ===== */}

      <h2>What Is a Domain Name Checker?</h2>
      <p>
        A domain name checker queries the live RDAP and WHOIS registration
        databases to tell you instantly whether a domain is available to
        register or already taken. This tool checks your domain name with all
        extensions — .com, .net, .org, .io, .co, .dev, .app, and .ai — in a
        single search rather than making you check one TLD at a time.
      </p>
      <p>
        Unlike many domain checkers that redirect you to a registrar shopping
        cart, this is a free domain checker without buying — no affiliate links,
        no registration pressure, no upsells. You see the results and decide
        independently where (and whether) to register. If you have already
        registered a domain and want to verify its DNS is configured correctly,
        our{" "}
        <Link href="/dns-lookup/" className="my-link">
          DNS lookup tool
        </Link>{" "}
        lets you check A, MX, TXT, NS, and other records in real time.
      </p>

      <h2>How to Check If a Domain Name Is Available</h2>
      <ul className="custom-list">
        <li>
          <strong>Step 1:</strong> Enter a name — just the word or brand,
          without an extension (e.g. "mybrand" not "mybrand.com"). The tool
          strips any URL formatting automatically.
        </li>
        <li>
          <strong>Step 2:</strong> Press Enter or click "Check." All 8
          extensions are queried simultaneously using live RDAP/WHOIS data.
        </li>
        <li>
          <strong>Step 3:</strong> Green rows with a checkmark are available to
          register right now. Red rows with a lock icon are already taken — many
          also show the registrar or nameserver so you can see who holds it.
        </li>
        <li>
          <strong>Step 4:</strong> If your preferred .com is taken, check the
          other extensions for alternatives — or modify the name and search
          again.
        </li>
      </ul>

      <h2>.com vs .net vs .org — Which Extension Is Better?</h2>
      <p>
        Choosing the right domain extension depends on your use case, audience,
        and brand positioning. Here is a comparison of all 8 extensions this
        tool checks:
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
                Extension
              </th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                Best For
              </th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                Typical Price
              </th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                Trust Level
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              [
                ".com",
                "General websites, businesses, personal brands",
                "$8–$15/yr",
                "Highest — universally recognized",
              ],
              [
                ".net",
                "Tech companies, network-related services",
                "$10–$15/yr",
                "High — established since 1985",
              ],
              [
                ".org",
                "Non-profits, open-source projects, communities",
                "$10–$15/yr",
                "High — associated with credibility",
              ],
              [
                ".io",
                "Tech startups, SaaS products, developer tools",
                "$25–$60/yr",
                "Moderate — strong in tech circles",
              ],
              [
                ".co",
                "Startups, short brand URLs, .com alternatives",
                "$20–$35/yr",
                "Moderate — growing recognition",
              ],
              [
                ".dev",
                "Developer portfolios, software projects, APIs",
                "$12–$20/yr",
                "Moderate — requires HTTPS",
              ],
              [
                ".app",
                "Mobile apps, web apps, software products",
                "$12–$20/yr",
                "Moderate — requires HTTPS",
              ],
              [
                ".ai",
                "AI and machine learning companies, tech products",
                "$50–$100/yr",
                "Growing — strong in AI space",
              ],
            ].map(([ext, best, price, trust], i) => (
              <tr key={i}>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  <strong>{ext}</strong>
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {best}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {price}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {trust}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        If .com is available for your brand, register it first — it carries the
        highest trust and recognition globally. Then consider securing .net and
        .org as brand protection. For tech and startup brands, .io, .dev, and
        .ai are strong choices if the .com is taken or if the extension
        reinforces your brand identity.
      </p>

      <h2>Why Check Multiple Extensions at Once?</h2>
      <ul className="custom-list">
        <li>
          <strong>Brand protection</strong> — Registering your brand across the
          most important TLDs prevents competitors or squatters from securing a
          confusingly similar domain.
        </li>
        <li>
          <strong>Fallback options</strong> — If your .com is taken, a .io, .co,
          or .dev may be available and perfectly suitable for your audience.
        </li>
        <li>
          <strong>SEO considerations</strong> — Different TLDs suit different
          niches. .dev and .app are widely used by software products, .org by
          non-profits, .ai by AI companies.
        </li>
        <li>
          <strong>Future-proofing</strong> — Securing multiple extensions while
          they are available is far cheaper than buying them later from a
          reseller at a premium.
        </li>
      </ul>

      <h2>How to Find Out Who Owns a Domain</h2>
      <p>
        When a domain shows as "Taken," this tool displays the registrar name or
        primary nameserver when available from the RDAP/WHOIS response. This
        tells you which company the domain is registered through (e.g. GoDaddy,
        Namecheap, Cloudflare). For full ownership details, a complete WHOIS
        lookup would show the registrant's name, organization, and contact
        information — though most domain owners now use WHOIS privacy protection
        services that replace their personal details with the registrar's proxy
        information.
      </p>
      <p>
        If you want to investigate a domain further — checking its DNS records,
        mail server configuration, or whether it is actively hosting a website —
        our{" "}
        <Link href="/dns-lookup/" className="my-link">
          DNS lookup tool
        </Link>{" "}
        lets you query A, AAAA, MX, TXT, NS, CNAME, and SOA records for any
        domain. And our{" "}
        <Link href="/ip-detector/" className="my-link">
          IP address detector
        </Link>{" "}
        can help you identify the IP address and hosting provider behind any
        website.
      </p>

      <h2>Tips for Choosing a Great Domain Name</h2>
      <ul className="custom-list">
        <li>
          <strong>Keep it short</strong> — shorter domains are easier to type,
          remember, and share. Aim for 6 to 14 characters if possible.
        </li>
        <li>
          <strong>Make it pronounceable</strong> — if you cannot easily say it
          over the phone, it will be harder for people to remember and share.
        </li>
        <li>
          <strong>Avoid hyphens and numbers</strong> — they are confusing
          verbally ("is it dash or hyphen? the number 4 or the word four?") and
          look less professional.
        </li>
        <li>
          <strong>Check for trademark conflicts</strong> — before registering,
          search your country's trademark database to make sure the name does
          not infringe on an existing brand.
        </li>
        <li>
          <strong>Prioritize .com</strong> — if the .com is available, secure it
          even if you plan to use a different extension as your primary. People
          will type .com by default.
        </li>
        <li>
          <strong>Think about email</strong> — your domain will likely also be
          your email domain (you@mybrand.com). Make sure it looks professional
          in that context. If you plan to use email on your domain, our{" "}
          <Link href="/email-validator/" className="my-link">
            email validator
          </Link>{" "}
          can verify that your MX records are properly configured after setup.
        </li>
      </ul>

      <h2>What Happens After You Find an Available Domain?</h2>
      <p>
        Once you have identified an available domain name, the next steps are
        registration and configuration:
      </p>
      <ul className="custom-list">
        <li>
          <strong>Register with a registrar</strong> — popular options include
          Cloudflare Registrar (at-cost pricing), Namecheap, Porkbun, and
          GoDaddy. Compare renewal prices, not just first-year promotional
          rates.
        </li>
        <li>
          <strong>Set up DNS records</strong> — point your domain to your
          hosting provider by configuring A records (for the website) and MX
          records (for email). Our{" "}
          <Link href="/dns-lookup/" className="my-link">
            DNS lookup tool
          </Link>{" "}
          lets you verify these records are working correctly after you set them
          up.
        </li>
        <li>
          <strong>Enable WHOIS privacy</strong> — most registrars offer free
          WHOIS privacy protection that hides your personal contact details from
          public lookup databases.
        </li>
        <li>
          <strong>Configure email</strong> — set up email hosting (Google
          Workspace, Microsoft 365, Zoho, etc.) and publish SPF, DKIM, and DMARC
          records to prevent your emails from landing in spam.
        </li>
        <li>
          <strong>Secure with SSL</strong> — ensure your site uses HTTPS. Most
          hosting providers include free SSL certificates via Let's Encrypt.
          Note that .dev and .app extensions require HTTPS by design.
        </li>
      </ul>

      <h2>Common Domain Registration Mistakes to Avoid</h2>
      <ul className="custom-list">
        <li>
          <strong>Only registering one extension</strong> — if your brand is
          "mybrand" and you only register mybrand.com, someone else can register
          mybrand.net and potentially confuse your customers.
        </li>
        <li>
          <strong>Falling for the first-year discount trap</strong> — some
          registrars offer $1 domains the first year but charge $20+ on renewal.
          Always check the renewal price.
        </li>
        <li>
          <strong>Using the registrar's website builder unnecessarily</strong> —
          registrar-provided website builders are often limited and lock you in.
          Register the domain separately and use a proper hosting provider.
        </li>
        <li>
          <strong>Forgetting to renew</strong> — set your domain to auto-renew.
          Expired domains enter a redemption period and can be snapped up by
          domain squatters within days.
        </li>
        <li>
          <strong>Not setting up email authentication</strong> — without SPF,
          DKIM, and DMARC records, emails from your domain may be rejected or
          flagged as spam. Use our{" "}
          <Link href="/dns-lookup/" className="my-link">
            DNS lookup tool
          </Link>{" "}
          to check your TXT records after configuration.
        </li>
      </ul>

      <h2>Frequently Asked Questions</h2>

      {FAQ_DATA.map(({ q, a }, i) => (
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
        Your domain name is the foundation of your online identity — it is the
        first thing people see, the address they type, and the brand they
        remember. Use this free domain name checker to find the right name
        across every major extension before someone else takes it.
      </p>
      <p>
        After registration, verify your setup with our{" "}
        <Link href="/dns-lookup/" className="my-link">
          DNS lookup tool
        </Link>{" "}
        to confirm DNS records are configured correctly, our{" "}
        <Link href="/email-validator/" className="my-link">
          email validator
        </Link>{" "}
        to check that MX records are active for email, and our{" "}
        <Link href="/ip-detector/" className="my-link">
          IP address detector
        </Link>{" "}
        to verify your site is resolving to the expected server.
      </p>

      <style jsx>{`
        .dc-hero {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 28px 16px 8px;
          margin-top: 20px;
        }
        .dc-hero-name {
          font-weight: 800;
          font-size: clamp(1.8rem, 6vw, 3rem);
          letter-spacing: -0.02em;
          color: #000;
          word-break: break-all;
        }
        .dc-pill-available {
          color: #16a34a;
        }
        .dc-pill-available i {
          margin-right: 4px;
        }
        .dc-pill-taken {
          color: #dc2626;
        }
        .dc-pill-taken i {
          margin-right: 4px;
        }
        .dc-list {
          display: flex;
          flex-direction: column;
          gap: 0;
          margin: 20px 0 0;
          border-top: 1px solid #f0f0f0;
        }
        .dc-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 14px 18px;
          border-bottom: 1px solid #f0f0f0;
          transition: background 0.1s ease;
        }
        .dc-row:hover {
          background: #fafafa;
        }
        .dc-row-available {
          background: rgba(22, 163, 74, 0.03);
        }
        .dc-row-taken {
          background: rgba(220, 38, 38, 0.02);
        }
        .dc-row-unknown {
          background: #fafafa;
        }
        .dc-row-domain {
          font-size: 15px;
          font-weight: 700;
          color: #111;
          letter-spacing: -0.01em;
        }
        .dc-row-available .dc-row-domain {
          color: #111;
        }
        .dc-row-taken .dc-row-domain {
          color: #555;
        }
        .dc-row-right {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }
        .dc-row-meta {
          font-size: 11.5px;
          color: #aaa;
          max-width: 160px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .dc-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 12px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.02em;
          white-space: nowrap;
        }
        .dc-badge-available {
          background: rgba(22, 163, 74, 0.1);
          color: #16a34a;
        }
        .dc-badge-taken {
          background: rgba(220, 38, 38, 0.08);
          color: #dc2626;
        }
        .dc-badge-unknown {
          background: #f0f0f0;
          color: #888;
        }
      `}</style>
    </div>
  );
}
