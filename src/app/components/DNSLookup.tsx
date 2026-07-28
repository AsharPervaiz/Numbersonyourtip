"use client";
import { useState } from "react";
import Link from "next/link";
import "@fortawesome/fontawesome-free/css/all.min.css";

interface DNSAnswer {
  name: string;
  type: number;
  TTL: number;
  data: string;
}

const RECORD_TYPES = ["A", "AAAA", "MX", "TXT", "NS", "CNAME", "SOA", "CAA"];

const TYPE_NAMES: Record<number, string> = {
  1: "A",
  2: "NS",
  5: "CNAME",
  6: "SOA",
  12: "PTR",
  15: "MX",
  16: "TXT",
  28: "AAAA",
  33: "SRV",
  257: "CAA",
};

const STATUS_NAMES: Record<number, string> = {
  0: "NOERROR",
  1: "FORMERR",
  2: "SERVFAIL",
  3: "NXDOMAIN",
  4: "NOTIMP",
  5: "REFUSED",
};

const TYPE_ICONS: Record<string, string> = {
  A: "fa-route",
  AAAA: "fa-route",
  MX: "fa-envelope",
  TXT: "fa-file-lines",
  NS: "fa-sitemap",
  CNAME: "fa-arrows-left-right",
  SOA: "fa-file-contract",
  CAA: "fa-shield-halved",
  PTR: "fa-rotate-left",
  SRV: "fa-server",
};

export default function DNSLookup() {
  const [domain, setDomain] = useState("");
  const [recordType, setRecordType] = useState("A");
  const [queriedDomain, setQueriedDomain] = useState("");
  const [records, setRecords] = useState<DNSAnswer[] | null>(null);
  const [statusCode, setStatusCode] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorDetail, setErrorDetail] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [exporting, setExporting] = useState(false);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const fetchDNS = async (domainToQuery?: string, typeToQuery?: string) => {
    const d = (domainToQuery ?? domain).trim();
    const t = typeToQuery ?? recordType;
    if (!d) return;
    setLoading(true);
    setError(false);
    setErrorDetail("");
    setRecords(null);
    setStatusCode(null);
    try {
      const url = `https://dns.google/resolve?name=${encodeURIComponent(d)}&type=${t}`;
      const res = await fetch(url);
      const contentType = res.headers.get("content-type") || "";
      if (
        !contentType.includes("javascript") &&
        !contentType.includes("json")
      ) {
        const text = await res.text();
        throw new Error(
          `Non-JSON response (status ${res.status}): ${text.slice(0, 120)}`,
        );
      }
      const json = await res.json();
      setQueriedDomain(d);
      setStatusCode(typeof json.Status === "number" ? json.Status : null);
      setRecords(json.Status === 0 ? json.Answer || [] : []);
    } catch (e: any) {
      console.error("DNS lookup failed:", e?.message || e);
      setErrorDetail(e?.message || "Unknown error");
      setError(true);
      setRecords(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!domain.trim()) return;
    fetchDNS(domain.trim(), recordType);
  };
  const handleTypeSelect = (type: string) => {
    setRecordType(type);
    if (domain.trim() && queriedDomain) {
      fetchDNS(domain.trim(), type);
    }
  };
  const handleCopyRecord = (value: string, index: number) => {
    navigator.clipboard.writeText(value);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const handleExportAll = async () => {
    if (!queriedDomain || exporting) return;
    setExporting(true);
    try {
      const results = await Promise.all(
        RECORD_TYPES.map(async (type) => {
          try {
            const res = await fetch(
              `https://dns.google/resolve?name=${encodeURIComponent(queriedDomain)}&type=${type}`,
            );
            const json = await res.json();
            const recs =
              json.Status === 0
                ? (json.Answer || []).map((a: DNSAnswer) => ({
                    name: a.name,
                    ttl: a.TTL,
                    data: a.data,
                  }))
                : [];
            return [type, recs] as const;
          } catch {
            return [type, []] as const;
          }
        }),
      );
      const recordsByType: Record<string, any> = {};
      results.forEach(([type, recs]) => {
        recordsByType[type] = recs;
      });
      const payload = {
        domain: queriedDomain,
        generatedAt: new Date().toISOString(),
        source: "dns.google/resolve",
        records: recordsByType,
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${queriedDomain}-dns-records.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Export failed:", e);
    } finally {
      setExporting(false);
    }
  };

  const hasSearched = queriedDomain !== "" && (records !== null || error);
  const statusLabel =
    statusCode !== null ? STATUS_NAMES[statusCode] || `CODE ${statusCode}` : "";

  return (
    <div className="single-page-padding">
      <div>
        <h1>Free DNS Lookup Tool – Check A, MX, TXT, NS &amp; CNAME Records</h1>
        <p>
          Instantly look up DNS records for any domain — A, AAAA, MX, TXT, NS,
          CNAME, SOA, and CAA. This free DNS lookup tool queries Google's public
          DNS resolver directly from your browser with no sign-up, no API key,
          and no rate limits.
        </p>

        <div className="calc-card">
          <div className="dns-search-row">
            <input
              className="tool-input"
              type="text"
              placeholder="Enter a domain, e.g. example.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              style={{ marginBottom: 0 }}
            />
            <button
              type="button"
              className="dns-search-btn"
              onClick={handleSearch}
            >
              <i className="fa-solid fa-magnifying-glass"></i> Search
            </button>
          </div>
          <div className="dns-type-row">
            {RECORD_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                className={`dns-type-chip${recordType === type ? " active" : ""}`}
                onClick={() => handleTypeSelect(type)}
              >
                {type}
              </button>
            ))}
          </div>
          {!hasSearched && !loading && (
            <div className="empty-hint">
              <i className="fa-solid fa-magnifying-glass"></i> Enter a domain
              and press Enter to look up its {recordType} records.
            </div>
          )}
          {loading && (
            <div className="empty-hint">
              <i className="fa-solid fa-spinner fa-spin"></i> Resolving{" "}
              {domain.trim() || "domain"}…
            </div>
          )}
          {!loading && error && (
            <div className="empty-hint">
              <i className="fa-solid fa-triangle-exclamation"></i> Couldn't
              complete the lookup{errorDetail ? `: ${errorDetail}` : "."} Please
              try again.
            </div>
          )}
          {!loading && !error && hasSearched && records !== null && (
            <div className="calc-result" style={{ marginTop: 0, padding: 0 }}>
              <div className="dns-hero">
                <div className="dns-hero-domain">{queriedDomain}</div>
                <div
                  className="stats-pills-row"
                  style={{ justifyContent: "center", marginTop: "14px" }}
                >
                  <div className="stat-chip">
                    Status: <b>{statusLabel}</b>
                  </div>
                  <div className="stat-chip">
                    Type: <b>{recordType}</b>
                  </div>
                  <div className="stat-chip">
                    Records: <b>{records.length}</b>
                  </div>
                </div>
                {statusCode === 0 && (
                  <button
                    type="button"
                    className="dns-export-btn"
                    onClick={handleExportAll}
                    disabled={exporting}
                  >
                    <i
                      className={`fa-solid ${exporting ? "fa-spinner fa-spin" : "fa-download"}`}
                    ></i>
                    {exporting
                      ? "Exporting all records…"
                      : "Export all DNS data (.json)"}
                  </button>
                )}
              </div>
              {statusCode !== 0 && (
                <div className="empty-hint">
                  <i className="fa-solid fa-circle-exclamation"></i>
                  {statusCode === 3
                    ? `${queriedDomain} doesn't exist (NXDOMAIN).`
                    : `Lookup returned ${statusLabel}.`}
                </div>
              )}
              {statusCode === 0 && records.length === 0 && (
                <div className="empty-hint">
                  <i className="fa-solid fa-circle-info"></i> No {recordType}{" "}
                  records found for {queriedDomain}.
                </div>
              )}
              {statusCode === 0 && records.length > 0 && (
                <div className="dns-record-list">
                  {records.map((rec, index) => {
                    const typeLabel = TYPE_NAMES[rec.type] || String(rec.type);
                    return (
                      <div
                        className="dns-record-row"
                        key={`${rec.name}-${rec.type}-${index}`}
                        onClick={() => handleCopyRecord(rec.data, index)}
                        title="Click to copy"
                      >
                        <span className="dns-record-icon">
                          <i
                            className={`fa-solid ${TYPE_ICONS[typeLabel] || "fa-route"}`}
                          ></i>
                        </span>
                        <div className="dns-record-main">
                          <div className="dns-record-meta">
                            <span className="dns-record-type">{typeLabel}</span>
                            <span className="dns-record-ttl">
                              TTL {rec.TTL}s
                            </span>
                          </div>
                          <div className="dns-record-data">{rec.data}</div>
                        </div>
                        <span
                          className={`dns-record-copy${copiedIndex === index ? " show" : ""}`}
                        >
                          <i
                            className={`fa-solid ${copiedIndex === index ? "fa-check" : "fa-copy"}`}
                          ></i>
                          {copiedIndex === index ? "Copied" : "Copy"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ---- SEO CONTENT ---- */}

        <h2>What Is a DNS Lookup Tool?</h2>
        <p>
          A DNS lookup tool queries the Domain Name System directly and shows
          you the raw records a domain publishes — the IP addresses it points
          to, the mail servers that handle its email, the nameservers that
          manage it, and any text-based configuration it exposes. Instead of
          relying on your computer's cached DNS, this tool sends a fresh query
          to Google's public DNS resolver (dns.google) and shows you exactly
          what comes back in real time.
        </p>
        <p>
          This is the same information your browser silently looks up every time
          you visit a website, except here it is surfaced directly so you can
          verify configuration, debug propagation issues, audit email
          authentication records, or confirm that DNS changes have actually
          taken effect. Whether you are a web developer, sysadmin, SEO
          professional, or site owner troubleshooting a problem, DNS lookup is
          one of the most fundamental diagnostic tools available.
        </p>

        <h2>Why Would You Need to Check DNS Records?</h2>
        <ul className="custom-list">
          <li>
            <strong>Verifying domain setup</strong> — Confirm A or CNAME records
            point to the correct server after pointing a domain at new hosting,
            a CDN, or a landing page builder.
          </li>
          <li>
            <strong>Email deliverability</strong> — Check that MX records
            resolve correctly and that SPF, DKIM, and DMARC TXT records are
            published as expected. Missing or misconfigured{" "}
            <Link href="/email-validator/" className="my-link">
              email authentication
            </Link>
            records are one of the top reasons legitimate emails land in spam.
          </li>
          <li>
            <strong>Debugging propagation</strong> — See what a public resolver
            currently returns while waiting for DNS changes to propagate
            globally after a hosting migration or nameserver change.
          </li>
          <li>
            <strong>Migrating providers</strong> — Confirm nameserver (NS)
            records have switched over after moving a domain to a new registrar
            or DNS host.
          </li>
          <li>
            <strong>Security audits</strong> — Review CAA records to see which
            certificate authorities are authorized to issue SSL/TLS certificates
            for a domain.
          </li>
          <li>
            <strong>Competitive research</strong> — Look up a competitor's DNS
            to see which hosting provider, CDN, or email service they use — all
            publicly available information in DNS.
          </li>
          <li>
            <strong>General troubleshooting</strong> — Diagnose "site not
            loading" or "email not arriving" issues that trace back to DNS
            misconfiguration.
          </li>
        </ul>

        <h2>DNS Record Types Explained</h2>
        <p>
          This tool supports all eight major DNS record types. The table below
          explains what each one does and when you would look it up:
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
                  Record
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Purpose
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Example Use Case
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                [
                  "A",
                  "Maps domain to an IPv4 address",
                  "Verify your site points to the correct server IP",
                ],
                [
                  "AAAA",
                  "Maps domain to an IPv6 address",
                  "Check if a domain supports IPv6",
                ],
                [
                  "CNAME",
                  "Alias pointing to another domain",
                  "Confirm a subdomain routes through a CDN",
                ],
                [
                  "MX",
                  "Specifies mail servers for the domain",
                  "Debug email delivery failures",
                ],
                [
                  "TXT",
                  "Free-form text for verification and auth",
                  "Check SPF, DKIM, DMARC records",
                ],
                [
                  "NS",
                  "Lists authoritative nameservers",
                  "Confirm nameserver migration completed",
                ],
                [
                  "SOA",
                  "Zone admin info (primary NS, serial, refresh)",
                  "Verify zone updates propagated",
                ],
                [
                  "CAA",
                  "Restricts which CAs can issue SSL certs",
                  "Audit SSL certificate authorization",
                ],
              ].map(([rec, purpose, use], i) => (
                <tr key={i}>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {rec}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {purpose}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {use}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>DNS Response Status Codes</h2>
        <p>
          Every DNS query returns a status code alongside the results.
          Understanding these codes helps you diagnose issues quickly:
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
                  Code
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Name
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  What It Means
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                [
                  "0",
                  "NOERROR",
                  "Query succeeded — records may or may not exist for that type",
                ],
                [
                  "2",
                  "SERVFAIL",
                  "Nameserver failed to process — often a server-side issue",
                ],
                [
                  "3",
                  "NXDOMAIN",
                  "Domain does not exist — not registered or expired",
                ],
                [
                  "5",
                  "REFUSED",
                  "Nameserver refused the query — usually a policy restriction",
                ],
              ].map(([code, name, meaning], i) => (
                <tr key={i}>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {code}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {name}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {meaning}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>How to Use This DNS Lookup Tool</h2>
        <ul className="custom-list">
          <li>
            <strong>Step 1:</strong> Type a domain name — for example,
            example.com or mail.example.com for a subdomain.
          </li>
          <li>
            <strong>Step 2:</strong> Select the record type you want to check.
          </li>
          <li>
            <strong>Step 3:</strong> Press Enter or click Search to run the
            lookup.
          </li>
          <li>
            <strong>Step 4:</strong> View results. Each record shows its type,
            TTL, and data value. Click any record to copy its value.
          </li>
          <li>
            <strong>Step 5:</strong> Use "Export all DNS data" to download every
            record type as a single JSON file for documentation or audits.
          </li>
        </ul>

        <h2>Understanding TTL (Time to Live)</h2>
        <p>
          Every DNS record has a TTL value, shown in seconds next to each
          result. TTL tells DNS resolvers how long they can cache that record
          before re-querying the authoritative nameserver. A TTL of 3600 means
          one hour of caching; 300 means five minutes.
        </p>
        <p>
          When you update a DNS record, the change does not appear everywhere
          instantly. Resolvers worldwide may still serve the old cached version
          until their local TTL expires. This is why freshly changed records can
          take minutes to 48 hours to propagate, depending on the previous TTL.
          Checking against a public resolver like this tool is the fastest way
          to see whether Google's DNS has picked up your change.
        </p>
        <p>
          If you plan to make DNS changes, lowering the TTL to 300 seconds a day
          or two beforehand ensures faster propagation when the actual update is
          made.
        </p>

        <h2>Common DNS Troubleshooting Scenarios</h2>

        <h3>Website Not Loading After Changing Hosting</h3>
        <p>
          Look up the A record. If it still shows your old hosting provider's
          IP, the DNS change has not propagated yet — check the TTL to estimate
          when it will. If the A record shows the new IP but the site does not
          load, the issue is at the hosting level, not DNS.
        </p>

        <h3>Email Not Being Delivered</h3>
        <p>
          Check MX records first — they must point to your email provider's
          servers. Then check TXT records for SPF, DKIM, and DMARC. If any of
          these are missing or incorrectly formatted, receiving servers may
          reject or spam-folder your outgoing mail.
        </p>

        <h3>SSL Certificate Not Issuing</h3>
        <p>
          If your hosting provider cannot issue an SSL certificate, check the
          CAA record. If a CAA record exists and does not include your
          certificate authority (e.g., letsencrypt.org), issuance will be
          blocked. Either add the correct CA or remove the CAA restriction.
        </p>

        <h3>Subdomain Not Resolving</h3>
        <p>
          Enter the full subdomain (e.g., blog.example.com) and look up its A or
          CNAME record. If NOERROR returns with zero records, the subdomain has
          not been created in DNS yet — add the record at your DNS provider.
        </p>

        <h2>Email Authentication Records — SPF, DKIM, and DMARC</h2>
        <p>
          Three TXT-based DNS records form the backbone of email authentication.
          If you manage a domain that sends email, these are critical for
          deliverability:
        </p>
        <ul className="custom-list">
          <li>
            <strong>SPF (Sender Policy Framework)</strong> — Lists the servers
            authorized to send email for your domain. Missing or overly broad
            SPF records are one of the most common causes of email going to
            spam.
          </li>
          <li>
            <strong>DKIM (DomainKeys Identified Mail)</strong> — Adds a
            cryptographic signature to outgoing emails. The receiving server
            uses a public key published in your DNS to verify the message was
            not tampered with.
          </li>
          <li>
            <strong>DMARC (Domain-based Message Authentication)</strong> — Tells
            receiving servers what to do when SPF or DKIM checks fail. DMARC
            also enables reporting so you can see who is sending email using
            your domain.
          </li>
        </ul>
        <p>
          Use the TXT record lookup in this tool to verify all three are
          correctly published for your domain.
        </p>

        <h2>How DNS Works — A Quick Overview</h2>
        <p>
          The Domain Name System is the internet's phone book. When you type a
          URL into your browser, your device does not know where to find that
          website. It asks a DNS resolver to translate the human-readable domain
          name (like example.com) into a machine-readable{" "}
          <Link href="/ip-detector/" className="my-link">
            IP address
          </Link>{" "}
          (like 93.184.216.34). The resolver checks its cache first; if it does
          not have the answer, it queries the authoritative nameservers for that
          domain and returns the result.
        </p>
        <p>
          This entire process — DNS resolution — happens in milliseconds and is
          invisible to the user. But when it breaks or is misconfigured,
          websites go down, emails stop arriving, and SSL certificates fail to
          issue. That is when a DNS lookup tool becomes essential for
          pinpointing what went wrong.
        </p>

        <h2>Frequently Asked Questions</h2>

        {[
          [
            "Is this DNS lookup tool free to use?",
            "Yes, completely free with no sign-up, no API key, and no query limits. The lookup runs directly between your browser and Google's public DNS resolver — nothing is logged or stored on our end.",
          ],
          [
            "Why does this tool show different results than my own computer?",
            "Your computer or ISP may have an older, cached version of a domain's DNS records. This tool queries Google's public DNS resolver fresh, which can show updated records before your local cache expires. If results differ, check the TTL to see how long the old record will persist.",
          ],
          [
            "What does NXDOMAIN mean?",
            "NXDOMAIN means the domain does not exist in DNS — it is not registered, its registration expired, or it was never created as a subdomain. This is different from a domain having no records of a particular type, which returns NOERROR with zero results.",
          ],
          [
            "Why are there no results for a record type I expected?",
            "Not every domain publishes every record type. A domain might have A records but no AAAA, or no CAA records if it has not restricted certificate issuance. NOERROR with zero records means that type is simply not configured.",
          ],
          [
            "Can I look up DNS records for a subdomain?",
            "Yes. Enter the full subdomain — for example, mail.example.com or blog.example.com — and it will be queried like any other domain.",
          ],
          [
            "What is the difference between A and CNAME records?",
            "An A record points a domain directly to an IP address. A CNAME record points to another domain name, which is then resolved to get the final IP. CNAMEs are useful for pointing subdomains at CDNs or SaaS services without hardcoding an IP that might change.",
          ],
          [
            "How long does DNS propagation take?",
            "It depends on the TTL of the old record. A TTL of 3600 (1 hour) means most resolvers pick up the change within an hour. A TTL of 86400 (24 hours) may take a full day. Most changes propagate within 1 to 4 hours in practice. Lowering TTL before making changes speeds up propagation.",
          ],
          [
            "What is the Export All DNS Data button?",
            "It queries every supported record type for the current domain in one batch and downloads the combined results as a JSON file. This is useful for documentation, security audits, or keeping a snapshot before making DNS changes.",
          ],
          [
            "Does this tool store or track the domains I look up?",
            "No. The DNS query goes directly from your browser to Google's public DNS resolver at dns.google. No data passes through our server and nothing is logged or stored.",
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
          DNS is the invisible infrastructure that makes the internet work. When
          everything is configured correctly, nobody thinks about it. When
          something breaks — a site goes down, email stops arriving, an SSL
          certificate fails to issue — DNS is almost always the first place to
          look. This tool gives you instant, reliable visibility into any
          domain's DNS configuration so you can diagnose issues, verify changes,
          and move on.
        </p>
        <p>
          Looking for other tools? Explore our{" "}
          <Link
            href="https://numbersonyourtip.com/emi-calculator/"
            className="my-link"
          >
            EMI calculator
          </Link>{" "}
          for loan planning, our{" "}
          <Link
            href="https://numbersonyourtip.com/calorie-calculator/"
            className="my-link"
          >
            calorie calculator
          </Link>{" "}
          for daily nutrition targets, or our{" "}
          <Link
            href="https://numbersonyourtip.com/bmi-calculator/"
            className="my-link"
          >
            BMI calculator
          </Link>{" "}
          to check your body mass index.
        </p>
      </div>
    </div>
  );
}
