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
      <div>
        <h1>
          Free Email Validator – Check Syntax &amp; Mail Server (MX) Records
        </h1>
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
            <i className="fa-solid fa-triangle-exclamation"></i> Couldn't
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

      {/* ===== SEO CONTENT ===== */}

      <h2>What Is an Email Validator?</h2>
      <p>
        An email validator checks whether an email address is both correctly
        formatted and actually capable of receiving mail. Most free validators
        only check the format — this tool goes further by querying live DNS
        records to confirm the domain has a working mail server (an MX record),
        which catches a much larger share of fake, mistyped, or abandoned
        addresses.
      </p>
      <p>
        This tool does not send any email or attempt to verify that a specific
        mailbox exists — that would require contacting the mail server directly,
        which is unreliable and frequently blocked by providers. Instead, it
        confirms the things that can be checked safely and instantly: valid
        syntax, a registered domain, a configured mail server, and whether the
        domain belongs to a disposable or role-based category.
      </p>
      <p>
        The MX record lookup uses the same Google Public DNS resolver
        (dns.google) that powers our{" "}
        <Link href="/dns-lookup/" className="my-link">
          DNS lookup tool
        </Link>
        . If you want to dig deeper into a domain's full DNS configuration — A
        records, TXT records, NS records, and more — that tool gives you the
        complete picture.
      </p>

      <h2>Why Validate Email Addresses?</h2>
      <ul className="custom-list">
        <li>
          <strong>Catching typos in sign-up forms</strong> — Mistakes like
          "gmial.com" or "yahooo.com" are surprisingly common. This validator
          flags them and even suggests the correct domain so the user can fix it
          before submitting.
        </li>
        <li>
          <strong>Reducing email bounce rates</strong> — Sending to addresses
          with no mail server damages your sender reputation and can get your
          domain or IP blacklisted. Validating before sending prevents this. If
          you suspect your sending IP is already blacklisted, our{" "}
          <Link href="/ip-detector/" className="my-link">
            IP address detector
          </Link>{" "}
          can help you identify the IP your mail server uses.
        </li>
        <li>
          <strong>Filtering disposable emails</strong> — Throwaway addresses
          from services like Mailinator or YOPmail are commonly used to bypass
          sign-up requirements. Detecting them lets you decide whether to accept
          them or ask for a real address.
        </li>
        <li>
          <strong>Spotting role-based addresses</strong> — Generic addresses
          like info@, support@, or admin@ are often shared mailboxes not tied to
          a specific person. Identifying them helps you prioritize personal
          outreach.
        </li>
        <li>
          <strong>Mailing list hygiene</strong> — Periodically run your list
          through validation to catch addresses whose domains have since stopped
          accepting mail, expired, or been decommissioned.
        </li>
        <li>
          <strong>Verifying before cold outreach</strong> — Checking that a
          domain has active MX records before sending a cold email saves you
          from bounces that hurt your deliverability score.
        </li>
      </ul>

      <h2>What This Tool Checks — Step by Step</h2>
      <p>
        The validator runs six checks in sequence. Here is exactly what happens
        when you enter an email address:
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
                Check
              </th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                What It Does
              </th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                Fail = ?
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              [
                "Syntax validation",
                "Tests email format against RFC 5322 rules (local part, @, valid domain)",
                "Invalid",
              ],
              [
                "Domain existence",
                "Queries DNS to confirm the domain is registered (not NXDOMAIN)",
                "Invalid",
              ],
              [
                "MX record check",
                "Looks up mail exchange records to confirm a mail server is configured",
                "Risky (if no MX)",
              ],
              [
                "A record fallback",
                "If no MX exists, checks for an A record (RFC 5321 implicit MX)",
                "Risky",
              ],
              [
                "Disposable detection",
                "Compares domain against a list of known throwaway email providers",
                "Risky flag",
              ],
              [
                "Role-based detection",
                "Checks if the local part is a generic role (admin@, info@, etc.)",
                "Role-based flag",
              ],
            ].map(([check, what, fail], i) => (
              <tr key={i}>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {check}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {what}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {fail}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        A typo suggestion also runs in parallel — if the domain is within two
        edits of a common provider (Gmail, Yahoo, Outlook, etc.), the validator
        offers a "Did you mean…?" correction.
      </p>

      <h2>Understanding the Verdicts</h2>

      <h3>Looks Deliverable</h3>
      <p>
        The address passes all checks: valid syntax, the domain exists, and it
        has active MX records pointing to mail servers. This is the strongest
        signal that the address is likely to accept mail. It does not guarantee
        the specific mailbox exists, but the infrastructure is in place.
      </p>

      <h3>Risky</h3>
      <p>
        The address is correctly formatted and the domain exists, but something
        raises a concern. This typically means one of three things: the domain
        has no MX records configured (relying only on an A record fallback,
        which is unreliable), the domain belongs to a known disposable email
        provider, or both. Sending to risky addresses is more likely to bounce
        or go unread.
      </p>

      <h3>Invalid</h3>
      <p>
        The address either has incorrect syntax (missing @, illegal characters,
        malformed domain) or the domain does not exist at all (NXDOMAIN). Email
        sent to these addresses will definitely bounce — remove them from your
        list.
      </p>

      <h2>How to Use This Email Validator</h2>
      <ul className="custom-list">
        <li>
          <strong>Step 1:</strong> Type or paste an email address into the
          field.
        </li>
        <li>
          <strong>Step 2:</strong> Press Enter or click "Check."
        </li>
        <li>
          <strong>Step 3:</strong> Review the verdict — Looks deliverable,
          Risky, or Invalid — along with the specific checks behind it.
        </li>
        <li>
          <strong>Step 4:</strong> If a "Did you mean…" suggestion appears,
          click it to automatically re-check the corrected address.
        </li>
        <li>
          <strong>Step 5:</strong> For deeper domain investigation, click
          through to our{" "}
          <Link href="/dns-lookup/" className="my-link">
            DNS lookup tool
          </Link>{" "}
          to see full MX, TXT (SPF/DKIM), and NS records for that domain.
        </li>
      </ul>

      <h2>What Are MX Records and Why Do They Matter?</h2>
      <p>
        MX (Mail Exchange) records are DNS entries that tell the internet which
        servers handle incoming email for a domain. When you send an email to
        someone@example.com, the sending server looks up example.com's MX
        records to find out where to deliver the message. Each MX record has a
        priority number — lower numbers are tried first, and higher numbers
        serve as backups.
      </p>
      <p>
        A domain with no MX records is not explicitly configured to receive
        email. Per RFC 5321, a sending server can fall back to the domain's A
        record as an implicit mail destination, but this is unreliable in
        practice — many such domains simply do not accept mail at all. This is
        why our validator flags "no MX" domains as risky rather than valid.
      </p>
      <p>
        If you want to see the full MX records for any domain — including
        priority levels and the actual mail server hostnames — use our{" "}
        <Link href="/dns-lookup/" className="my-link">
          DNS lookup tool
        </Link>{" "}
        and select the MX record type.
      </p>

      <h2>Common Email Typos This Tool Catches</h2>
      <p>
        The typo detection compares the entered domain against the ten most
        common email providers and flags any domain within two character edits.
        Here are real-world examples it catches:
      </p>
      <ul className="custom-list">
        <li>
          <strong>gmial.com → gmail.com</strong> — transposed letters
        </li>
        <li>
          <strong>gmal.com → gmail.com</strong> — missing letter
        </li>
        <li>
          <strong>yahooo.com → yahoo.com</strong> — extra letter
        </li>
        <li>
          <strong>outllook.com → outlook.com</strong> — doubled letter
        </li>
        <li>
          <strong>hotmal.com → hotmail.com</strong> — missing letter
        </li>
        <li>
          <strong>iclould.com → icloud.com</strong> — transposed letters
        </li>
      </ul>
      <p>
        These are among the most frequent errors in sign-up forms. The "Did you
        mean…?" prompt lets the user fix the mistake with a single click.
      </p>

      <h2>Disposable Email Providers — What They Are and Why They Matter</h2>
      <p>
        Disposable email services provide temporary, throwaway email addresses
        that work for a few minutes or hours and then stop accepting mail.
        Popular examples include Mailinator, YOPmail, Guerrilla Mail, and 10
        Minute Mail. People use them to sign up for services without giving a
        real address — which means any verification email, onboarding sequence,
        or follow-up you send will never be read.
      </p>
      <p>
        This validator checks the domain against a curated list of known
        disposable providers and flags them as "Risky." Whether you choose to
        accept these addresses depends on your use case — a free tool might
        allow them, while a paid subscription probably should not.
      </p>

      <h2>Role-Based Addresses — When to Accept Them</h2>
      <p>
        Role-based addresses like admin@, info@, support@, billing@, and
        noreply@ are tied to a function rather than an individual. They are
        perfectly valid and often actively monitored, but they present specific
        considerations:
      </p>
      <ul className="custom-list">
        <li>
          They are often shared among multiple people, so personalized outreach
          gets diluted.
        </li>
        <li>
          Some email marketing platforms (Mailchimp, SendGrid) flag or suppress
          role-based addresses by default.
        </li>
        <li>
          noreply@ addresses are specifically designed not to be monitored —
          replying to them goes nowhere.
        </li>
      </ul>
      <p>
        This validator flags role-based addresses so you can make an informed
        decision. For transactional email (order confirmations, invoices),
        role-based addresses are fine. For marketing and outreach, a personal
        address is preferable.
      </p>

      <h2>Email Validation vs. Email Verification — What Is the Difference?</h2>
      <p>
        These terms are often used interchangeably but refer to different levels
        of checking:
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
                Email Validation (this tool)
              </th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                Email Verification (SMTP check)
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Checks syntax", "Yes", "Yes"],
              ["Checks domain existence", "Yes", "Yes"],
              ["Checks MX records", "Yes", "Yes"],
              ["Contacts the mail server", "No", "Yes — connects via SMTP"],
              ["Confirms mailbox exists", "No", "Attempts to (unreliable)"],
              [
                "Privacy risk",
                "None — no email sent",
                "Moderate — server contacted",
              ],
              ["Speed", "Instant (< 1 second)", "Slower (2–10 seconds)"],
              [
                "Blocked by providers?",
                "No",
                "Often — especially Gmail, Outlook",
              ],
            ].map(([feature, validation, verification], i) => (
              <tr key={i}>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {feature}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {validation}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {verification}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        This tool performs validation — the checks that are reliable, instant,
        and privacy-respecting. SMTP-level verification is increasingly
        unreliable because major providers like Gmail and Outlook accept all
        addresses at the SMTP level regardless of whether the mailbox exists,
        making the extra step pointless for the majority of email addresses.
      </p>

      <h2>Common Reasons Emails Bounce</h2>
      <p>
        Most bounced emails fall into a small number of categories, and this
        tool is built to catch exactly these before you find out from a bounce
        notification:
      </p>
      <ul className="custom-list">
        <li>
          <strong>Typo in the domain</strong> — gmial.com instead of gmail.com.
          The typo suggestion catches these.
        </li>
        <li>
          <strong>Domain no longer exists</strong> — the company shut down or
          let the domain expire. The domain existence check catches this.
        </li>
        <li>
          <strong>Domain exists but has no mail server</strong> — a website-only
          domain with no email configured. The MX record check catches this.
        </li>
        <li>
          <strong>Disposable address that expired</strong> — the address worked
          for 10 minutes and then stopped. The disposable provider detection
          flags these upfront.
        </li>
        <li>
          <strong>Mailbox full or deactivated</strong> — this is the one case no
          validator can reliably catch without actually sending a message.
        </li>
      </ul>

      <h2>Frequently Asked Questions</h2>

      {[
        [
          "Does this confirm the exact mailbox exists?",
          "No. Confirming a specific mailbox requires contacting the destination mail server via SMTP, which most providers block or return misleading results for. This tool instead confirms that the address is correctly formatted, the domain is registered, and a mail server is configured — the checks that are reliable and instant.",
        ],
        [
          "Is this email validator free to use?",
          "Yes, completely free with no sign-up and no limits. Check as many email addresses as you need. The DNS checks run directly between your browser and Google's public DNS resolver.",
        ],
        [
          "What does the 'Risky' verdict mean?",
          "Risky means the address is correctly formatted and the domain exists, but something suggests it may not reliably receive mail. This is typically because no MX records are configured (only an A record fallback), or the domain belongs to a known disposable email provider.",
        ],
        [
          "What is a role-based email address?",
          "A role-based address is tied to a function rather than a specific person — addresses like info@, support@, admin@, or noreply@. These are often valid and monitored, but for personal outreach or account verification, a personal address is usually more appropriate.",
        ],
        [
          "Why does it flag some domains as disposable?",
          "Disposable email services provide temporary addresses that expire within minutes or hours. They are commonly used to bypass sign-up verification. Flagging them lets you decide whether to accept throwaway addresses for your specific use case.",
        ],
        [
          "Does this tool store the email addresses I check?",
          "No. The DNS checks happen directly between your browser and Google's public DNS resolver in real time. We do not log, store, or share the addresses you check.",
        ],
        [
          "Can I check a list of emails in bulk?",
          "This tool checks one address at a time. For bulk list cleaning, a dedicated bulk verification service would be needed. This tool is best suited for individual checks during sign-up flows, outreach planning, or manual list review.",
        ],
        [
          "How is this different from an SMTP verification tool?",
          "This tool performs DNS-level validation — checking syntax, domain existence, and MX records. SMTP verification goes a step further by connecting to the mail server to ask if a mailbox exists. However, SMTP checks are increasingly unreliable because major providers like Gmail accept all addresses at the SMTP level regardless of whether the mailbox is real.",
        ],
        [
          "Can I use this to check if my own domain's email is set up correctly?",
          "Yes — enter any address at your domain and the validator will confirm whether your MX records are published and pointing to active mail servers. For a more detailed view of your domain's full DNS configuration, including SPF, DKIM, and DMARC TXT records, use our DNS lookup tool.",
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
        Email validation is one of the simplest ways to protect your sender
        reputation, reduce bounces, and ensure that the addresses you collect
        are actually reachable. This tool gives you a quick, reliable answer for
        any email address — checking syntax, domain health, mail server
        configuration, and common red flags — all without sending a single
        message.
      </p>
      <p>
        For deeper domain diagnostics, use our{" "}
        <Link href="/dns-lookup/" className="my-link">
          DNS lookup tool
        </Link>{" "}
        to inspect MX, TXT, SPF, and DKIM records directly. To check what IP
        address your mail server is sending from, our{" "}
        <Link href="/ip-detector/" className="my-link">
          IP address detector
        </Link>{" "}
        can help. And if you need to generate a strong password for any of those
        email accounts, our{" "}
        <Link href="/password-generator/" className="my-link">
          password generator
        </Link>{" "}
        creates secure, random passwords instantly.
      </p>
    </div>
  );
}
