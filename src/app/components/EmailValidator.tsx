"use client";
import { useState } from "react";
import Link from "next/link";
import "@fortawesome/fontawesome-free/css/all.min.css";

interface MXRecord {
  priority: number;
  host: string;
}

type Verdict = "valid" | "risky" | "invalid";

const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

const ROLE_LOCAL_PARTS = [
  "admin",
  "administrator",
  "info",
  "support",
  "contact",
  "sales",
  "noreply",
  "no-reply",
  "marketing",
  "help",
  "office",
  "billing",
  "webmaster",
  "postmaster",
  "abuse",
  "hello",
  "team",
];

const DISPOSABLE_DOMAINS = [
  "mailinator.com",
  "tempmail.com",
  "temp-mail.org",
  "guerrillamail.com",
  "10minutemail.com",
  "throwawaymail.com",
  "yopmail.com",
  "trashmail.com",
  "getnada.com",
  "fakeinbox.com",
  "sharklasers.com",
  "dispostable.com",
  "maildrop.cc",
  "mintemail.com",
  "mohmal.com",
  "discard.email",
  "mailnesia.com",
  "tempinbox.com",
  "moakt.com",
  "emailondeck.com",
];

const COMMON_DOMAINS = [
  "gmail.com",
  "yahoo.com",
  "outlook.com",
  "hotmail.com",
  "icloud.com",
  "aol.com",
  "protonmail.com",
  "live.com",
  "msn.com",
  "yandex.com",
];

function levenshtein(a: string, b: string): number {
  const dp: number[][] = Array.from({ length: a.length + 1 }, () =>
    new Array(b.length + 1).fill(0),
  );
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[a.length][b.length];
}

const FAQ_DATA: [string, string][] = [
  [
    "How do I check whether an email domain is valid?",
    "Look up the domain for MX records. Their presence means someone deliberately configured that domain to receive mail, which is a strong signal addresses there can work. If the domain does not resolve at all, no address on it is deliverable. If it resolves but has no MX record, that is usually a typo landing on a real but mail-less domain — flagged as risky rather than invalid, because mail can still fall back to the address record in some setups.",
  ],
  [
    "Can a validator tell me whether a specific mailbox exists?",
    "No, and neither can any other tool, honestly. Catch-all domains accept every address at the domain, so they answer yes to everything. Many servers deliberately accept all addresses at the connection stage to defeat exactly this kind of probing, and greylisting makes a first attempt look like a failure. Repeated probes also get your sending address blocked. Syntax and domain checks rule out what cannot work; a confirmation email establishes the rest.",
  ],
  [
    "Why does my form reject an address with a plus sign in it?",
    "Because the form is stricter than the addressing rules. Plus addressing is entirely legitimate and widely used for filtering incoming mail. Rejecting it turns away real customers silently, and accepting it costs nothing. The same applies to apostrophes, subdomains and long top-level domains, all of which valid addresses use.",
  ],
  [
    "What is an MX record and why does it matter for validation?",
    "It is a DNS entry naming the server that handles mail for a domain. Checking for one is the fastest way to catch a mistyped provider, since misspelled domains rarely have mail configured. What it cannot tell you is whether an individual mailbox exists — an MX record describes the domain, not the person.",
  ],
  [
    "Should I reject disposable email addresses?",
    "That is a policy decision rather than a validity finding. Disposable addresses come from services offering throwaway inboxes that expire in minutes; they are technically deliverable but the mail lands somewhere nobody reads. Blocking them makes sense for trials and paid signups, and less sense where a one-off transaction is all you need.",
  ],
  [
    "Are role addresses like info@ or support@ acceptable?",
    "Technically valid and contextually dependent. They reach a function rather than a person, usually a shared inbox or ticket queue, which makes them entirely appropriate for business correspondence and a poor fit for anything personalised, where consent and identity get ambiguous with several readers. A support desk should accept them; a personalised newsletter probably should not.",
  ],
  [
    "What is the difference between a hard and a soft bounce?",
    "A hard bounce is permanent — the address or domain does not exist — and should be removed immediately, since retrying damages your sending reputation. A soft bounce is temporary: a full mailbox, a server down, a message too large. Retry those, and remove them after repeated failures.",
  ],
  [
    "My whole campaign bounced from one provider. Are the addresses bad?",
    "Usually not. When an entire send fails at one provider, the likelier cause is that the receiving server declined you rather than the addresses — a sender authentication or reputation problem. Check that SPF, DKIM and DMARC records are published for your sending domain. Cleaning the list will not fix a blocking problem.",
  ],
  [
    "Does a valid result mean the email will definitely arrive?",
    "It means the address is correctly formed and its domain is configured to receive mail, which rules out the failures that can be detected from outside. Delivery still depends on whether that specific mailbox exists, whether it is full, and whether the receiving server accepts mail from you. Treat a valid result as removing known problems rather than as a guarantee.",
  ],
];

export default function EmailValidator() {
  const [email, setEmail] = useState("");
  const [checkedEmail, setCheckedEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorDetail, setErrorDetail] = useState("");
  const [hasChecked, setHasChecked] = useState(false);

  const [syntaxValid, setSyntaxValid] = useState(false);
  const [domain, setDomain] = useState("");
  const [domainExists, setDomainExists] = useState(false);
  const [mxRecords, setMxRecords] = useState<MXRecord[]>([]);
  const [hasFallbackA, setHasFallbackA] = useState(false);
  const [isDisposable, setIsDisposable] = useState(false);
  const [isRoleBased, setIsRoleBased] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);

  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const checkEmail = async (raw?: string) => {
    const value = (raw ?? email).trim();
    if (!value) return;

    setLoading(true);
    setError(false);
    setErrorDetail("");
    setHasChecked(false);
    setMxRecords([]);
    setHasFallbackA(false);
    setSuggestion(null);

    const ok = EMAIL_REGEX.test(value);
    setSyntaxValid(ok);
    setCheckedEmail(value);

    if (!ok) {
      setHasChecked(true);
      setLoading(false);
      return;
    }

    const atIndex = value.lastIndexOf("@");
    const localPart = value.slice(0, atIndex).toLowerCase();
    const domainPart = value.slice(atIndex + 1).toLowerCase();
    setDomain(domainPart);
    setIsRoleBased(ROLE_LOCAL_PARTS.includes(localPart));
    setIsDisposable(DISPOSABLE_DOMAINS.includes(domainPart));

    let best: { d: string; dist: number } | null = null;
    for (const d of COMMON_DOMAINS) {
      if (d === domainPart) {
        best = null;
        break;
      }
      const dist = levenshtein(domainPart, d);
      if (dist > 0 && dist <= 2 && (!best || dist < best.dist)) {
        best = { d, dist };
      }
    }
    if (best) setSuggestion(best.d);

    try {
      const mxRes = await fetch(
        `https://dns.google/resolve?name=${encodeURIComponent(domainPart)}&type=MX`,
      );
      const mxJson = await mxRes.json();
      const status = typeof mxJson.Status === "number" ? mxJson.Status : 2;
      const exists = status !== 3;
      setDomainExists(exists);

      const mx: MXRecord[] = (mxJson.Answer || [])
        .map((a: any) => {
          const parts = String(a.data).trim().split(/\s+/);
          const priority = parseInt(parts[0], 10);
          const host = parts.slice(1).join(" ").replace(/\.$/, "");
          return { priority: isNaN(priority) ? 0 : priority, host };
        })
        .sort((a: MXRecord, b: MXRecord) => a.priority - b.priority);
      setMxRecords(mx);

      if (mx.length === 0 && exists) {
        const aRes = await fetch(
          `https://dns.google/resolve?name=${encodeURIComponent(domainPart)}&type=A`,
        );
        const aJson = await aRes.json();
        setHasFallbackA(aJson.Status === 0 && (aJson.Answer || []).length > 0);
      }

      setHasChecked(true);
    } catch (e: any) {
      console.error("Email domain check failed:", e?.message || e);
      setErrorDetail(e?.message || "Unknown error");
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCheck = () => {
    if (!email.trim()) return;
    checkEmail(email.trim());
  };

  const applySuggestion = () => {
    if (!suggestion) return;
    const localPart = checkedEmail.slice(0, checkedEmail.lastIndexOf("@"));
    const fixed = `${localPart}@${suggestion}`;
    setEmail(fixed);
    checkEmail(fixed);
  };

  const getVerdict = (): Verdict => {
    if (!syntaxValid) return "invalid";
    if (!domainExists) return "invalid";
    if (mxRecords.length === 0 && !hasFallbackA) return "risky";
    if (isDisposable) return "risky";
    return "valid";
  };

  const verdict = hasChecked ? getVerdict() : null;
  const VERDICT_LABEL: Record<Verdict, string> = {
    valid: "Looks deliverable",
    risky: "Risky",
    invalid: "Invalid",
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
        <h1>Email Validator — Syntax and Email Domain Validation</h1>
        <p>
          Instantly check whether an email address is correctly formatted and
          whether its domain actually has a working mail server. This free email
          validation tool checks syntax, domain existence, MX records,
          disposable providers, and common typos — all from your browser with no
          sign-up required.
        </p>
      </div>

      <div className="calc-card">
        <div className="ev-search-row">
          <input
            className="tool-input"
            type="text"
            placeholder="Enter an email address, e.g. name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCheck();
            }}
            style={{ marginBottom: 0 }}
          />
          <button type="button" className="ev-search-btn" onClick={handleCheck}>
            <i className="fa-solid fa-magnifying-glass"></i> Check
          </button>
        </div>

        {!hasChecked && !loading && !error && (
          <div className="empty-hint">
            <i className="fa-solid fa-circle-info"></i> Enter an email address
            and press Enter to validate it.
          </div>
        )}
        {loading && (
          <div className="empty-hint">
            <i className="fa-solid fa-spinner fa-spin"></i> Checking{" "}
            {checkedEmail || "email"}…
          </div>
        )}
        {!loading && error && (
          <div className="empty-hint">
            <i className="fa-solid fa-triangle-exclamation"></i> Couldn&apos;t
            complete the check{errorDetail ? `: ${errorDetail}` : "."} Please
            try again.
          </div>
        )}

        {!loading && !error && hasChecked && verdict && (
          <div className="calc-result" style={{ marginTop: 0, padding: 0 }}>
            <div className="ev-hero">
              <div className="ev-hero-email">{checkedEmail}</div>
              <div className={`ev-verdict ev-verdict-${verdict}`}>
                <i
                  className={`fa-solid ${verdict === "valid" ? "fa-circle-check" : verdict === "risky" ? "fa-triangle-exclamation" : "fa-circle-xmark"}`}
                ></i>
                {VERDICT_LABEL[verdict]}
              </div>
              {suggestion && (
                <div className="ev-suggestion">
                  Did you mean{" "}
                  <button type="button" onClick={applySuggestion}>
                    {checkedEmail.slice(0, checkedEmail.lastIndexOf("@"))}@
                    {suggestion}
                  </button>
                  ?
                </div>
              )}
              <div
                className="stats-pills-row"
                style={{ justifyContent: "center", marginTop: "16px" }}
              >
                <div className="stat-chip">
                  Syntax: <b>{syntaxValid ? "Valid" : "Invalid"}</b>
                </div>
                {syntaxValid && (
                  <div className="stat-chip">
                    Domain: <b>{domainExists ? "Exists" : "Not found"}</b>
                  </div>
                )}
                {syntaxValid && domainExists && (
                  <div className="stat-chip">
                    Mail server:{" "}
                    <b>
                      {mxRecords.length > 0
                        ? "MX found"
                        : hasFallbackA
                          ? "A fallback"
                          : "None found"}
                    </b>
                  </div>
                )}
                {isRoleBased && (
                  <div className="stat-chip">
                    <b>Role-based</b>
                  </div>
                )}
                {isDisposable && (
                  <div className="stat-chip">
                    <b>Disposable provider</b>
                  </div>
                )}
              </div>
            </div>
            {mxRecords.length > 0 && (
              <div className="dns-record-list">
                {mxRecords.map((mx, index) => (
                  <div className="dns-record-row" key={`${mx.host}-${index}`}>
                    <span className="dns-record-icon">
                      <i className="fa-solid fa-server"></i>
                    </span>
                    <div className="dns-record-main">
                      <div className="dns-record-meta">
                        <span className="dns-record-type">
                          PRIORITY {mx.priority}
                        </span>
                      </div>
                      <div className="dns-record-data">{mx.host}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ---- SEO CONTENT ---- */}

      <h2>Four Questions Hide Inside &quot;Is This Email Valid?&quot;</h2>
      <p>
        The question sounds like one thing and is really four, arranged in order
        of how confidently they can be answered from outside. Being clear about
        which one you are asking explains both what this tool reports and why no
        tool can promise more.
      </p>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Question</th>
              <th>Checked how</th>
              <th>How certain</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Is the address correctly formed?</td>
              <td>Parsing the text against the addressing rules</td>
              <td>Definitive</td>
            </tr>
            <tr>
              <td>Does the domain exist?</td>
              <td>A DNS lookup for the part after the @</td>
              <td>Definitive</td>
            </tr>
            <tr>
              <td>Can the domain receive mail at all?</td>
              <td>Looking for MX records on that domain</td>
              <td>Strong, with one exception below</td>
            </tr>
            <tr>
              <td>Does that specific mailbox exist?</td>
              <td>Cannot be established reliably from outside</td>
              <td>
                <strong>Not checkable</strong>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        The first three are what a validator does. The fourth is what people
        usually want, and it is the one that cannot be answered honestly without
        sending mail. Everything below is about that gap.
      </p>

      <h2>Syntax: the Rules Are Looser Than Most Forms Assume</h2>
      <p>
        Addresses split at the last @ into a local part and a domain. The domain
        half is strict. The local half permits considerably more than typical
        sign-up forms accept, which is why perfectly real addresses get rejected
        at checkout.
      </p>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Address</th>
              <th>Verdict</th>
              <th>Why</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>first.last+shop@example.com</td>
              <td>Valid</td>
              <td>
                Plus addressing is legitimate and widely used for filtering
              </td>
            </tr>
            <tr>
              <td>o&apos;brien@example.com</td>
              <td>Valid</td>
              <td>Apostrophes are permitted in the local part</td>
            </tr>
            <tr>
              <td>user@sub.domain.example.com</td>
              <td>Valid</td>
              <td>Subdomains can hold mail</td>
            </tr>
            <tr>
              <td>user@@example.com</td>
              <td>Invalid</td>
              <td>Only one unquoted @ separator is allowed</td>
            </tr>
            <tr>
              <td>.user@example.com</td>
              <td>Invalid</td>
              <td>
                The local part cannot begin or end with a dot, or contain two in
                a row
              </td>
            </tr>
            <tr>
              <td>user@example</td>
              <td>Invalid in practice</td>
              <td>No public top-level domain to resolve</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        The plus-addressing row causes real commercial damage. Some sign-up
        forms strip or reject it, and a customer who gave you{" "}
        <em>name+yourstore@gmail.com</em> then finds the address you send to
        does not match the one they filter on. Rejecting valid syntax costs you
        customers silently, while accepting it costs you nothing.
      </p>

      <h2>Domain Validation: What an MX Record Proves</h2>
      <p>
        This is the check most people are actually looking for when they search
        for email domain validation, and it is worth understanding precisely.
      </p>
      <p>
        An MX record is a DNS entry naming the server that handles mail for a
        domain. Its presence means someone has deliberately configured that
        domain to receive mail, which is a strong signal that addresses there
        can work. Its absence is the interesting case.
      </p>
      <ul className="custom-list">
        <li>
          <strong>The domain does not resolve at all.</strong> Nothing exists at
          that name. No address there can receive mail, so the address is not
          deliverable.
        </li>
        <li>
          <strong>The domain resolves but has no MX record.</strong> The classic
          case of a typo landing on a real but mail-less domain, or a parked
          domain. Mail may still fall back to the address record in some
          configurations, so this is flagged as risky rather than invalid — a
          distinction worth keeping, because treating it as a hard failure will
          occasionally reject someone real.
        </li>
        <li>
          <strong>MX records are present.</strong> The domain accepts mail. This
          says nothing about the individual mailbox.
        </li>
      </ul>
      <p>
        Domain checks are also the fastest way to catch a typo, because
        misspelled providers rarely have mail configured. If you want to inspect
        the underlying records directly, our{" "}
        <Link href="/dns-lookup/" className="my-link">
          DNS lookup tool
        </Link>{" "}
        shows the MX entries for any domain.
      </p>

      <h2>The Mailbox Is the One You Cannot Check</h2>
      <p>
        Whether <em>that particular person</em> exists at a working domain is,
        from the outside, close to unanswerable. It is technically possible to
        open a connection to the mail server and ask, and it is a bad idea for
        four reasons.
      </p>
      <ul className="custom-list">
        <li>
          <strong>Catch-all domains accept everything.</strong> Many
          organisations configure the server to accept mail to any address at
          the domain, so it answers yes to every question you ask. The result is
          meaningless.
        </li>
        <li>
          <strong>Servers deliberately mislead.</strong> Accepting every address
          at the connection stage and rejecting later is a standard defence
          against exactly this kind of enumeration.
        </li>
        <li>
          <strong>Greylisting delays first contact.</strong> A temporary
          rejection on first attempt is normal behaviour, and reads as a failure
          if you only ask once.
        </li>
        <li>
          <strong>It damages your sending reputation.</strong> Repeated probe
          connections from one address look like address harvesting and get that
          address blocked, which harms the mail you actually want to deliver.
        </li>
      </ul>
      <p>
        The honest position is that syntax and domain checks eliminate the
        addresses that definitely cannot work, and a confirmation email
        establishes the rest. Any service claiming certainty about mailbox
        existence is overstating what the protocol allows.
      </p>

      <h2>Disposable and Role Addresses Are Valid but Different</h2>
      <p>
        Two categories pass every technical check and may still not be what you
        want. Both are policy decisions rather than validity findings.
      </p>
      <p>
        <strong>Disposable addresses</strong> come from services providing
        throwaway inboxes that expire in minutes. They are technically
        deliverable and almost never worth keeping on a list — the mail arrives
        somewhere nobody will read.
      </p>

      <p>
        From the other side of the form, a disposable address is a privacy
        tactic rather than a nuisance: it lets someone try a service without
        handing over an inbox they intend to keep. That trade-off, and others
        like it, are covered in{" "}
        <Link href="/blog/online-privacy-security-basics/" className="my-link">
          online privacy and security basics
        </Link>
        .
      </p>
      <p>
        <strong>Role addresses</strong> — info@, support@, sales@, admin@ —
        reach a function rather than a person, often a shared inbox or a
        ticketing queue. They are entirely valid for business correspondence and
        a poor fit for anything personalised, since consent and identity are
        ambiguous when several people read one inbox.
      </p>
      <p>
        The useful framing is that a validator tells you what an address{" "}
        <em>is</em>, and your own rules decide what to do about it. A support
        desk should accept role addresses without hesitation; a personalised
        newsletter probably should not.
      </p>

      <h2>Where Bounces Actually Come From</h2>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Means</th>
              <th>What to do</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Hard bounce</td>
              <td>Permanent — the address or domain does not exist</td>
              <td>Remove immediately; retrying damages your reputation</td>
            </tr>
            <tr>
              <td>Soft bounce</td>
              <td>Temporary — mailbox full, server down, message too large</td>
              <td>Retry, then remove after repeated failures</td>
            </tr>
            <tr>
              <td>Blocked</td>
              <td>The receiving server declined you rather than the address</td>
              <td>
                A sender reputation or authentication problem, not a list
                problem
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        The third row is regularly misdiagnosed. When a whole campaign bounces
        from one provider, the addresses are rarely at fault — the more likely
        causes are missing authentication records or a reputation problem, and
        cleaning the list will not fix either. SPF, DKIM and DMARC are the
        records involved, and the{" "}
        <Link href="/dns-lookup/" className="my-link">
          DNS lookup tool
        </Link>{" "}
        will show whether yours are published.
      </p>

      <h2>Validating Without Losing People</h2>
      <p>
        Validation has two failure modes and they are not symmetrical. Letting a
        bad address through costs one bounce. Rejecting a good one costs a
        customer who will not tell you why they left.
      </p>
      <ul className="custom-list">
        <li>
          Accept everything the addressing rules permit, including plus signs,
          apostrophes and long extensions. Over-strict validation rejects real
          people.
        </li>
        <li>
          Warn rather than block on a suspected typo. Suggest the correction and
          let the person decide — they know their own address better than the
          form does.
        </li>
        <li>
          Treat a missing MX record as a warning, not a rejection. It is usually
          a typo and occasionally an unusual but working setup.
        </li>
        <li>
          Confirm by sending. A confirmation link is the only check that proves
          the address reaches the person who typed it.
        </li>
        <li>
          Re-validate old lists before large sends. Domains lapse and mailboxes
          close, so a list validated two years ago is no longer clean.
        </li>
      </ul>
      <h2>Email Validation Questions</h2>

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
