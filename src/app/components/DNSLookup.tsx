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

const FAQ_DATA: [string, string][] = [
  [
    "Why has my DNS change not taken effect yet?",
    "Because resolvers are still serving a cached copy. When you edit a record the authoritative server updates immediately, but every resolver that already cached the old answer keeps it until its TTL expires. A TTL of 86400 means some networks may hand out the previous value for up to a day. Nothing is broken and nothing is half-finished — you are looking at a cache.",
  ],
  [
    "How do I make a DNS change take effect faster?",
    "Lower the TTL well before you make the change, not at the same time. Resolvers holding the old record are also holding the old TTL, so dropping it to five minutes an hour before the switch achieves nothing. Reduce it a day or more ahead, make the change, then raise it again afterwards. For yourself, flushing your local cache or querying a public resolver bypasses the stale copy.",
  ],
  [
    "Does DNS really propagate across the internet?",
    "No, and the word is misleading. Nothing travels outward. The authoritative answer changes in one place at one moment, and every other resolver continues serving what it already had until that copy expires. This is why a colleague can see the new site while you see the old one, or why your phone is correct and your laptop is not.",
  ],
  [
    "What is the difference between an A record and a CNAME?",
    "An A record maps a name directly to an IPv4 address. A CNAME says to go and look up a different name instead, and whatever that resolves to becomes the answer. CNAMEs are used to point a subdomain at a hosted service so the provider can change the underlying address without you editing anything.",
  ],
  [
    "What are SPF, DKIM and DMARC and where do they live?",
    "All three are published as TXT records. SPF lists which servers may send mail using your domain. DKIM publishes a public key so recipients can verify a message was genuinely sent by an authorised system and not altered. DMARC ties the two together and tells recipients what to do with failures — nothing, quarantine, or reject — and requests reports on who is sending as you.",
  ],
  [
    "Can I have two SPF records?",
    "No. A domain should publish exactly one. Two SPF records do not combine — the check fails instead, which can send legitimate mail to spam. If you need to authorise several senders, merge them into a single record rather than adding another one.",
  ],
  [
    "Why did my mail stop being delivered after I added DMARC?",
    "Most likely you published a strict policy before confirming every legitimate sender passes. Marketing platforms, invoicing systems and helpdesk tools all send on your behalf, and a reject policy applied too early silently discards mail you wanted delivered. Start with a monitoring policy, read the reports until all real senders pass, then tighten it.",
  ],
  [
    "My lookup returned nothing. Does that mean the domain is broken?",
    "Not necessarily. There is a difference between the domain not existing at all — a typo or an expired registration — and the domain existing with no records of the type you asked for. Asking for MX records on a domain that only hosts a website correctly returns nothing. Also check the NS records: if the nameservers are not the provider you have been editing, your changes have been going to a zone nobody consults.",
  ],
  [
    "Does a correct DNS record mean my site is working?",
    "No. DNS answers where something is, not whether it is running. An A record can point perfectly at a server that is switched off, and MX records prove mail is configured rather than that any mailbox exists or the server is accepting connections. A lookup rules out one class of problem; it does not confirm the service behind it.",
  ],
];

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
        <h1>DNS Lookup — Check A, MX, TXT, NS and CNAME Records</h1>
        <p>
          Instantly look up DNS records for any domain — A, AAAA, MX, TXT, NS,
          CNAME, SOA, and CAA. This free DNS lookup tool queries the public
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
              <i className="fa-solid fa-triangle-exclamation"></i> Couldn&apos;t
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

        <h2>Each Record Type Answers a Different Question</h2>
        <p>
          A domain does not have one DNS entry; it has a set of them, and each
          one exists to answer a specific question a different piece of software
          is asking. Knowing which question you have tells you which record to
          look up.
        </p>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Record</th>
                <th>The question it answers</th>
                <th>Look here when</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>A</td>
                <td>Which IPv4 address serves this name?</td>
                <td>A site loads from the wrong server, or not at all</td>
              </tr>
              <tr>
                <td>AAAA</td>
                <td>Which IPv6 address serves this name?</td>
                <td>
                  A site works for some visitors and not others on modern
                  networks
                </td>
              </tr>
              <tr>
                <td>MX</td>
                <td>Which server handles mail for this domain?</td>
                <td>Mail is not arriving, or a mail move has stalled</td>
              </tr>
              <tr>
                <td>NS</td>
                <td>Which nameservers are authoritative for this domain?</td>
                <td>
                  Edits at your DNS host appear to have no effect anywhere
                </td>
              </tr>
              <tr>
                <td>TXT</td>
                <td>What arbitrary text has the owner published?</td>
                <td>
                  Checking domain verification, SPF, DKIM or DMARC entries
                </td>
              </tr>
              <tr>
                <td>CNAME</td>
                <td>Which other name should be looked up instead?</td>
                <td>A subdomain points at a hosted service</td>
              </tr>
              <tr>
                <td>SOA</td>
                <td>Who is the primary source, and what are the timers?</td>
                <td>Diagnosing zone-level or replication problems</td>
              </tr>
              <tr>
                <td>CAA</td>
                <td>
                  Which certificate authorities may issue for this domain?
                </td>
                <td>A certificate request is being refused</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          The NS row is the one to check first when something makes no sense at
          all. If the nameservers listed are not the provider you have been
          editing, every change you have made has been going to a zone nobody
          consults.
        </p>

        <h2>TTL Is Why Your Change Has Not Appeared</h2>
        <p>
          Every record carries a time to live: the number of seconds a resolver
          may keep the answer before asking again. It is the single most useful
          number in a DNS result and the most frequently ignored.
        </p>
        <p>
          When you edit a record, the authoritative server updates immediately.
          Every resolver that already cached the old answer keeps serving it
          until its copy expires. A TTL of 86400 seconds means some networks may
          continue handing out the previous value for up to a day.
        </p>
        <p>
          The practical consequence is a planning one. If you know a change is
          coming, lower the TTL well in advance — long enough before the change
          that the old, long TTL has expired everywhere. Dropping it to a few
          minutes an hour before you switch achieves nothing, because the
          resolvers still holding the old record are also holding the old TTL.
        </p>

        <h2>Nothing Actually Propagates</h2>
        <p>
          &quot;DNS propagation&quot; describes the delay accurately and the
          mechanism misleadingly. No update travels outward through the
          internet. The authoritative answer changes in one place at one moment,
          and everywhere else simply continues serving what it already had until
          that copy expires.
        </p>
        <p>
          This explains behaviour that otherwise looks random. A colleague sees
          the new site while you see the old one, because your resolvers cached
          at different times. Your phone on mobile data is correct while your
          laptop on the office network is not, for the same reason. Nothing is
          broken and nothing is half-finished — you are looking at two caches
          with different expiry times.
        </p>
        <p>
          It also explains why the usual advice works. Flushing your local cache
          or querying a public resolver directly bypasses whichever cache is
          holding the stale copy. It does not speed anything up for anyone else.
        </p>

        <h2>The Three Records That Decide Whether Your Mail Is Trusted</h2>
        <p>
          Mail authentication is published entirely as TXT records, and each of
          the three stops a different problem.
        </p>
        <p>
          <strong>SPF</strong> lists which servers are permitted to send mail
          using your domain. A receiving server checks the sending address
          against that list. One domain should publish exactly one SPF record —
          two is a configuration error that causes checks to fail rather than to
          combine.
        </p>
        <p>
          <strong>DKIM</strong> adds a cryptographic signature to outgoing mail,
          with the public key published in DNS. The recipient verifies that the
          message was genuinely sent by an authorised system and was not altered
          on the way.
        </p>
        <p>
          <strong>DMARC</strong> ties the two together and states what a
          recipient should do when a message fails: take no action, quarantine
          it, or reject it outright. It also requests reports, which are how you
          discover who is sending mail as your domain.
        </p>
        <p>
          A common and expensive mistake is publishing DMARC with a strict
          policy before confirming that all legitimate senders pass. Marketing
          platforms, invoicing systems and helpdesk tools all send on your
          behalf, and a strict policy applied too early silently rejects mail you
          wanted delivered. If mail is bouncing at one provider, these records
          are worth checking before you blame the recipient list — our{" "}
          <Link href="/email-validator/" className="my-link">
            email validator
          </Link>{" "}
          covers the address side of the same problem.
        </p>

        <h2>Reading a Lookup That Comes Back Empty</h2>
        <p>
          An empty result is not one condition, and the difference matters.
        </p>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Result</th>
                <th>Means</th>
                <th>Likely cause</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>No such domain</td>
                <td>The name does not exist at all</td>
                <td>A typo, or an expired or unregistered domain</td>
              </tr>
              <tr>
                <td>Domain exists, no records of this type</td>
                <td>The name is real but has nothing of what you asked for</td>
                <td>
                  Normal — for example a domain with a website but no mail
                </td>
              </tr>
              <tr>
                <td>Answer differs from what you configured</td>
                <td>You are being served a cached copy</td>
                <td>The old TTL has not yet expired</td>
              </tr>
              <tr>
                <td>Nameservers are not your provider</td>
                <td>Your edits are going to an unused zone</td>
                <td>Nameservers never switched at the registrar</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          The second row catches people out most often. Asking for MX records on
          a domain that only hosts a website returns nothing, and that is the
          correct answer rather than a fault.
        </p>

        <h2>What a Lookup Cannot Tell You</h2>
        <p>
          DNS answers where things are, not whether they work. A perfect set of
          records is entirely compatible with a site that is down.
        </p>
        <ul className="custom-list">
          <li>
            An A record pointing at a server says nothing about whether that
            server is running or responding.
          </li>
          <li>
            MX records prove mail is configured, not that any particular mailbox
            exists or that the server is accepting connections.
          </li>
          <li>
            Records are public by design, so a lookup reveals only what the
            owner chose to publish. Internal names and private infrastructure do
            not appear.
          </li>
          <li>
            You see the answer your resolver holds, which may not be the current
            authoritative one. Two people running the same query can legitimately
            get different results.
          </li>
        </ul>
        <p>
          To check what your own connection looks like from outside, the{" "}
          <Link href="/ip-detector/" className="my-link">
            IP detector
          </Link>{" "}
          shows the address and network you appear to be using, and our{" "}
          <Link
            href="/blog/online-privacy-security-basics/"
            className="my-link"
          >
            guide to what your IP address and DNS reveal
          </Link>{" "}
          covers the privacy side.
        </p>
      <h2>DNS Questions</h2>

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
    </div>
  );
}
