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
    q: "The domain shows as available but costs far more than expected. Why?",
    a: "It is probably classified as premium. Registries price short names, common words and obviously commercial terms above the standard rate, and such domains still show as unregistered because nobody owns them. Check whether the elevated price applies only to the first year or to every renewal, since some premium names carry the higher rate permanently.",
  },
  {
    q: "Does an available domain mean I am allowed to use it?",
    a: "No. Registration and trademark are separate systems that do not consult each other. A registrar will sell you a name matching an existing brand without any check, and the trademark holder can later have it transferred away through a dispute — costing you the name, the fee and anything built on it. Search the relevant trademark registers and the name itself before committing anything commercial to it.",
  },
  {
    q: "Should I check a domain's history before registering it?",
    a: "Yes, and it takes minutes. Names get abandoned, sometimes because they were used for spam, malware or link schemes, and registering one means inheriting that reputation. The symptoms appear later: mail landing in spam because the domain is on blocklists, or a site that will not rank because of a penalty predating you. Look the name up in a web archive and search for it before buying.",
  },
  {
    q: "Why is the renewal price different from the first-year price?",
    a: "Registrars compete on the first-year figure because it is what appears in advertising, and recover the difference at renewal. A domain is a recurring cost, so compare three numbers rather than one: first year, renewal, and any transfer-out fee. A heavily discounted first year against a high standard renewal often costs more over five years than a flat-rate registrar.",
  },
  {
    q: "Does the extension affect search rankings?",
    a: "Not directly — search engines do not rank a .com above a .net for being a .com. What the extension changes is human behaviour: how memorable the address is, whether people type the right one from memory, and how it reads when spoken. If your audience will assume .com and you own something else, expect to lose some traffic to the wrong address permanently.",
  },
  {
    q: "Can I get a domain back after it expires?",
    a: "Usually, but not cheaply and not immediately. An expired domain does not return to general availability straight away — there is a grace period, then a redemption window where recovery carries a substantial fee, before it is released. The reliable protection is auto-renew with a valid payment method and a contact address that is not on the domain itself.",
  },
  {
    q: "Why can I not transfer my new domain to another registrar?",
    a: "Newly registered domains generally cannot be transferred for a set initial period after registration. If you register somewhere for a cheap first year intending to move before renewal, check that the lock period has expired first — otherwise you may be renewing at the higher price whether you meant to or not.",
  },
  {
    q: "What does WHOIS show now that privacy is standard?",
    a: "Much less than it used to. Privacy protection is enabled by default at most registrars, so personal contact details are typically replaced by a forwarding service. What generally remains visible is the registrar, the registration and expiry dates, and the nameservers — enough to see when a domain was created and where it is hosted, but not who owns it.",
  },
  {
    q: "Should I register several extensions of the same name?",
    a: "It depends on what you are protecting against. Registering the obvious alternatives prevents someone else trading on your name and catches people who type the wrong one, which matters most once a brand has recognition. Early on it is a recurring cost for names you will not use. A common middle path is to hold the primary plus your country code, and add others if the name gains value.",
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
          Domain Name Checker — Availability, Price and History
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
            brand and we&apos;ll check availability across 8 popular extensions
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

        {/* ---- SEO CONTENT ---- */}

        <h2>&quot;Available&quot; Is the First Check, Not the Only One</h2>
        <p>
          A domain showing as unregistered means nobody currently holds it. That
          is genuinely useful and it is a narrower statement than most people
          read it as. Four separate things can stand between an available domain
          and a domain you can actually use.
        </p>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Check</th>
                <th>What it establishes</th>
                <th>Where it fails</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Registration</td>
                <td>Nobody currently owns it</td>
                <td>This tool answers it directly</td>
              </tr>
              <tr>
                <td>Price</td>
                <td>What it costs to register and to keep</td>
                <td>
                  Premium names and renewal pricing are set per domain
                </td>
              </tr>
              <tr>
                <td>Trademark</td>
                <td>Whether someone can force you off it</td>
                <td>
                  Availability says nothing about anyone&apos;s rights to the
                  name
                </td>
              </tr>
              <tr>
                <td>History</td>
                <td>What the name was used for previously</td>
                <td>
                  A dropped domain can carry penalties and blocklist entries
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          The last two are the ones that cost people money after the purchase
          rather than before it, and both are checkable in a few minutes.
        </p>

        <h2>The Four States a Domain Can Be In</h2>
        <p>
          Results are usually presented as available or taken. There are
          effectively four situations, and the middle two are commonly mistaken
          for one of the outer ones.
        </p>
        <ul className="custom-list">
          <li>
            <strong>Unregistered.</strong> Free to register at the standard
            price for that extension, first come first served.
          </li>
          <li>
            <strong>Registered and in use.</strong> Someone owns it and is using
            it. Buying it means approaching the owner, and the price is whatever
            they will accept.
          </li>
          <li>
            <strong>Registered and parked.</strong> Owned but showing only ads
            or a for-sale page. Frequently held by investors, and often
            negotiable — though the asking price reflects that the holder is in
            the business of selling names.
          </li>
          <li>
            <strong>Premium or reserved.</strong> Unregistered but priced far
            above the standard rate by the registry, or held back from general
            registration entirely. It shows as available and costs a multiple of
            what you expect.
          </li>
        </ul>
        <p>
          The premium case surprises people at checkout. Short names, common
          words and obviously commercial terms are frequently classified this
          way, and the elevated price sometimes applies to every year rather
          than only the first.
        </p>

        <h2>Renewal Pricing Is Where the Cost Actually Lives</h2>
        <p>
          Registrars compete on first-year pricing because it is the number
          shown in advertising. A domain is a recurring cost, so the renewal
          price is the one that matters over any realistic period.
        </p>
        <p>
          A first year discounted heavily against a standard renewal can look
          cheap and cost several times more over five years than a registrar
          charging a flat rate throughout. Before registering anywhere, check
          three prices rather than one: the first year, the renewal, and the
          transfer-out fee if there is one.
        </p>
        <p>
          Two related details are worth knowing in advance. A newly registered
          domain generally cannot be transferred to another registrar for a set
          initial period, so switching because you found a cheaper renewal is
          not immediate. And a lapsed domain does not become available the day
          it expires — there is a grace period, then a redemption window with a
          substantial recovery fee, before it returns to general availability.
          Losing a domain by forgetting to renew is expensive to undo.
        </p>

        <h2>Availability Is Not Permission</h2>
        <p>
          Registration and trademark are separate systems that do not consult
          each other. A registrar will sell you a domain matching an existing
          brand without any check, and the trademark holder can subsequently
          have it transferred away through a dispute process — losing you the
          name, the registration fee, and whatever you built on it.
        </p>
        <p>
          Before committing to a name for anything commercial, spend a few
          minutes on the obvious checks: search your national and regional
          trademark registers for the term, search the name plainly to see who
          is already trading under it, and consider whether a reasonable person
          could confuse your use with an established business. None of that is
          legal advice, and it catches the clear-cut problems.
        </p>
        <p>
          The rule of thumb worth applying is that the more distinctive and
          invented your name, the safer it is. Descriptive names are harder to
          protect and easier to collide with.
        </p>

        <h2>Check What the Name Was Before</h2>
        <p>
          An unregistered domain has not necessarily always been unregistered.
          Names get abandoned, and some are abandoned because they were used for
          spam, malware distribution or link schemes. Registering one means
          inheriting whatever reputation it accumulated.
        </p>
        <p>
          The symptoms are unpleasant and not obvious at purchase: mail from the
          domain lands in spam because the name appears on blocklists, or the
          site struggles to rank because of a search penalty that has nothing to
          do with you. Two checks before buying are worth the time — look the
          name up in a web archive to see what it hosted previously, and search
          for it to see whether anything unwelcome surfaces. A name with a long
          gap and no history is the clean case.
        </p>

        <h2>Extensions: What Matters and What Does Not</h2>
        <p>
          The extension carries less technical weight than people assume and
          more social weight.
        </p>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Extension</th>
                <th>Reads as</th>
                <th>Worth knowing</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>.com</td>
                <td>The default for anything commercial</td>
                <td>
                  People type it by reflex, which is its real advantage
                </td>
              </tr>
              <tr>
                <td>.org</td>
                <td>Non-profit, community, open project</td>
                <td>Open to anyone, despite the association</td>
              </tr>
              <tr>
                <td>.net</td>
                <td>Technical, or a fallback when .com is gone</td>
                <td>Neutral; rarely a first choice today</td>
              </tr>
              <tr>
                <td>.io, .dev, .app, .ai</td>
                <td>Technology and startups</td>
                <td>
                  Higher renewal prices; some enforce security requirements
                </td>
              </tr>
              <tr>
                <td>Country codes</td>
                <td>A specific national market</td>
                <td>
                  Some require local presence; strong signal if you serve one
                  country
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          Search engines do not rank a .com above a .net for being a .com. What
          the extension changes is human behaviour — how memorable the address
          is, whether people type the right one from memory, and how the brand
          reads when spoken aloud. If your audience will assume .com and you own
          something else, expect to lose some traffic to the wrong address
          permanently.
        </p>

        <h2>After You Register</h2>
        <ul className="custom-list">
          <li>
            <strong>Turn on auto-renew and check the card on file.</strong> The
            most common way to lose a domain is an expired payment method
            attached to an address nobody reads.
          </li>
          <li>
            <strong>Keep the contact email off the domain itself.</strong> If
            the domain lapses, notices sent to an address on that domain will
            not reach you.
          </li>
          <li>
            <strong>Enable registrar lock and two-factor authentication.</strong>{" "}
            Domain theft happens through registrar account access, not through
            the DNS.
          </li>
          <li>
            <strong>Leave privacy protection on</strong> unless you have a
            reason to publish your details. It is standard now and keeps
            personal information out of public records.
          </li>
          <li>
            <strong>Point the records where they need to go.</strong> Our{" "}
            <Link href="/dns-lookup/" className="my-link">
              DNS lookup tool
            </Link>{" "}
            confirms what a domain is currently publishing, and the{" "}
            <Link href="/email-validator/" className="my-link">
              email validator
            </Link>{" "}
            checks whether a domain is configured to receive mail.
          </li>
        </ul>
      <h2>Domain Registration Questions</h2>

      {FAQ_DATA.map(({ q, a }, i) => {
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
