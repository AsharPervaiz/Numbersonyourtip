"use client";
import { useState } from "react";
import Link from "next/link";
import "@fortawesome/fontawesome-free/css/all.min.css";

const FAQ_DATA: [string, string][] = [
  [
    "How long should a strong password be?",
    "At least 12 characters for most accounts, and 16 or more for high-value accounts like email, banking, and your password manager's master password. Length matters more than complexity — a random 16-character password is dramatically harder to crack than an 8-character one, even with symbols added, because every extra character multiplies the total number of possible combinations.",
  ],
  [
    "Are symbols and numbers necessary?",
    "They help, but length matters more. Enabling all four character types (uppercase, lowercase, numbers, symbols) maximizes entropy for a given length, but a 16-character password using only letters and numbers is still far stronger than an 8-character password using every character type available. Use as many character types as the site allows, at the longest length it accepts.",
  ],
  [
    "Is this password generator secure?",
    "Yes. Passwords are generated entirely inside your browser using JavaScript — nothing is sent to a server, logged, or stored anywhere. Each character is selected independently, so the result is unpredictable and does not follow patterns that cracking dictionaries could exploit.",
  ],
  [
    "Can I use these passwords for any account?",
    "Yes — email, banking, social media, work systems, and Wi-Fi networks all benefit from a unique, randomly generated password. The one thing to check is character restrictions: a small number of older sites reject certain symbols, so if a generated password is rejected, regenerate with only letters and numbers enabled.",
  ],
  [
    "Is this tool free?",
    "Yes. Our password generator is completely free and available anytime online, with no account, no download, and no limit on how many passwords you generate.",
  ],
  [
    "How do I remember a random password like this?",
    "You don't need to. The recommended approach is to use a password manager (Bitwarden, 1Password, or your browser's built-in manager) to store every generated password, and memorize only one strong master password to unlock the manager. Trying to memorize a unique strong password for every account is the main reason people fall back to weak, reused passwords.",
  ],
  [
    "Does a strong password alone keep my account safe?",
    "It's the biggest single factor, but not the only one. Wherever a service offers two-factor authentication (2FA), turn it on — it means an attacker needs a second code from your phone even if they somehow obtain your password. A strong, unique password plus 2FA is the practical standard for account security today.",
  ],
];

export default function PasswordGenerator() {
  const [length, setLength] = useState("");
  const [options, setOptions] = useState({
    upper: true,
    lower: false,
    numbers: false,
    symbols: false,
  });
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const handleOptionChange = (key: keyof typeof options) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const generatePassword = () => {
    const len = Number(length) || 0;
    if (len <= 0) return;

    let charset = "";
    if (options.upper) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (options.lower) charset += "abcdefghijklmnopqrstuvwxyz";
    if (options.numbers) charset += "0123456789";
    if (options.symbols) charset += "!@#$%^&*()_+~`|}{[]:;?><,./-=";

    if (!charset) return;

    let pass = "";
    for (let i = 0; i < len; i++) {
      const randIndex = Math.floor(Math.random() * charset.length);
      pass += charset[randIndex];
    }

    setPassword(pass);
    setCopied(false);
  };

  const handleClear = () => {
    setLength("");
    setOptions({ upper: true, lower: false, numbers: false, symbols: false });
    setPassword("");
    setCopied(false);
  };

  const copyPassword = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="page-layout">
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
      <div className="single-page-padding">
        <h1>Password Generator</h1>

        <p>Create Strong & Secure Passwords Instantly</p>
        <div>
          <div className="calc-card single-calc">
            <input
              className="calc-input"
              type="number"
              placeholder="Password Length"
              value={length}
              onChange={(e) => setLength(e.target.value)}
            />

            {/* Options as checkboxes */}
            <div style={{ margin: "10px 0" }}>
              {[
                { key: "upper", label: "Uppercase Letters" },
                { key: "lower", label: "Lowercase Letters" },
                { key: "numbers", label: "Numbers" },
                { key: "symbols", label: "Symbols" },
              ].map((opt) => (
                <label
                  key={opt.key}
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    cursor: "pointer",
                    color: "white",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={options[opt.key as keyof typeof options]}
                    onChange={() =>
                      handleOptionChange(opt.key as keyof typeof options)
                    }
                    style={{
                      marginRight: "8px",
                      accentColor: "#1f9fb8",
                      color: "white",
                    }}
                  />
                  {opt.label}
                </label>
              ))}
            </div>

            {/* Buttons: Generate & Clear */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
              <button className="calc-button" onClick={generatePassword}>
                Generate
              </button>
              <button className="calc-button calc-clear" onClick={handleClear}>
                Clear
              </button>
            </div>

            {password && (
              <div
                className="calc-result"
                style={{ position: "relative", paddingBottom: "35px" }}
              >
                <p>Password: {password}</p>

                <button
                  onClick={copyPassword}
                  style={{
                    fontFamily: "Montserrat",
                    position: "absolute",
                    bottom: "5px",
                    right: "5px",
                    padding: "5px 10px",
                    fontSize: "14px",
                    cursor: "pointer",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    background: "#d8a13a",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    gap: "2px",
                  }}
                >
                  <i className="fa-solid fa-copy"></i>
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            )}
          </div>
        </div>

        <h2>What Makes a Password Actually Strong?</h2>
        <p>
          A password&apos;s strength comes down to one number: entropy, measured
          in bits. Entropy is a measure of how many guesses an attacker would
          need, on average, to find your password by brute force. Every
          character you add, and every additional character type you include
          (lowercase, uppercase, digits, symbols), multiplies the total number
          of possible combinations — which is why length and variety matter far
          more than clever substitutions like swapping &quot;a&quot; for
          &quot;@&quot;. A random 8-character password using only lowercase
          letters has about 37 bits of entropy. A random 16-character password
          using all four character types has over 100 bits — the difference
          between a password crackable in hours and one that would take longer
          than the age of the universe with current hardware.
        </p>
        <p>
          This tool generates passwords using your browser&apos;s cryptographic
          random number source, combining the character sets you select to
          maximize entropy for the length you choose. Nothing is predictable or
          pattern-based — every character is selected independently, which is
          exactly what makes a password resistant to both guessing and automated
          cracking tools.
        </p>

        <h2>How Long Would It Take to Crack Your Password?</h2>
        <p>
          The table below shows rough brute-force cracking times for different
          password lengths and character sets, based on a modern offline attack
          rate of roughly 10 billion guesses per second — a realistic figure for
          an attacker using consumer GPU hardware against a leaked password
          hash.
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
                  backgroundColor: "var(--card-bg, #0D2A5C)",
                  color: "#fff",
                  textAlign: "left",
                }}
              >
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Length
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Lowercase Only
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Upper + Lower + Numbers
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  All Characters + Symbols
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                ["8 characters", "5 hours", "8 days", "3 months"],
                ["10 characters", "3 months", "6 years", "44 years"],
                ["12 characters", "3 years", "34,000 years", "2 million years"],
                [
                  "16 characters",
                  "9,000 years",
                  "1 billion years",
                  "practically uncrackable",
                ],
              ].map(([len, a, b, c], i) => (
                <tr
                  key={len}
                  style={{ backgroundColor: i % 2 ? "#f8f9fc" : "#fff" }}
                >
                  <td
                    style={{
                      padding: "10px",
                      border: "1px solid #ddd",
                      fontWeight: 600,
                    }}
                  >
                    {len}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {a}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {b}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {c}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          <em>
            These are averages for a single offline brute-force attempt, not
            guarantees — a password could theoretically be guessed on the first
            try, or take twice as long. The point is the order of magnitude: a
            16-character password with mixed character types is not just &quot;a
            bit better&quot; than an 8-character one, it is millions of times
            harder to crack.
          </em>
        </p>

        <h2>Password Generator Options Explained</h2>

        <h3>1. Password Length</h3>
        <p>
          Length is the single biggest factor in password strength. Every extra
          character multiplies the total number of possible combinations by the
          size of your character set. Security researchers and organizations
          like NIST now recommend a minimum of 12 characters for important
          accounts, with 16 or more for anything protecting financial data,
          email, or password managers themselves.
        </p>

        <h3>2. Uppercase Letters (A–Z)</h3>
        <p>
          Adds 26 possible characters per position. Mixing case is a cheap way
          to multiply entropy without adding length, since most sites still
          accept it universally.
        </p>

        <h3>3. Lowercase Letters (a–z)</h3>
        <p>
          The base character set for most passwords and the one every site
          accepts. On its own it is the weakest option — always combine it with
          at least one other character type.
        </p>

        <h3>4. Numbers (0–9)</h3>
        <p>
          Adds 10 more possible characters per position. Avoid predictable
          placements like years, birthdays, or sequences (123, 2024) — a
          generated password places digits randomly throughout the string, not
          just at the end.
        </p>

        <h3>5. Symbols (!@#$%^&*)</h3>
        <p>
          Symbols add the largest character set per position and are required by
          most banking and enterprise login systems. Some older or poorly built
          sites still reject certain symbols — if your generated password gets
          rejected, regenerate with only letters and numbers enabled.
        </p>

        <h2>Common Password Mistakes That Undo Strong Generation</h2>
        <ul className="custom-list">
          <li>
            <strong>Reusing the same password across sites.</strong> If one
            service you use is breached — and data breaches happen constantly —
            attackers immediately try that same password on your email, banking,
            and social accounts. This single habit causes more account takeovers
            than weak passwords do.
          </li>
          <li>
            <strong>
              Using personal information (names, birthdays, pet names).
            </strong>{" "}
            These are the first guesses in any targeted attack and are often
            public on social media.
          </li>
          <li>
            <strong>Predictable substitutions.</strong> Replacing &quot;a&quot;
            with &quot;@&quot; or &quot;e&quot; with &quot;3&quot; (leetspeak)
            adds almost no real entropy — cracking tools have included these
            substitutions in their dictionaries for over a decade.
          </li>
          <li>
            <strong>Storing passwords in plain text.</strong> A note on your
            phone, a spreadsheet, or a sticky note is only as secure as whoever
            else can access that device. Use a dedicated password manager
            instead — see below.
          </li>
          <li>
            <strong>Never rotating breached passwords.</strong> If a service you
            use announces a breach, change that password immediately, and change
            it everywhere else you reused it.
          </li>
        </ul>

        <h2>Where to Store the Passwords You Generate</h2>
        <p>
          A truly random, unique 16-character password is impossible to memorize
          for every account — and that&apos;s fine. The correct approach
          isn&apos;t to memorize dozens of strong passwords, it&apos;s to use a
          password manager (Bitwarden, 1Password, and your browser&apos;s
          built-in manager are all reasonable choices) to store them, and
          memorize only one strong master password to unlock the manager itself.
          Generate a new password with this tool for each account, save it
          directly into your password manager, and let autofill handle the rest.
          This is the single most effective practical change most people can
          make to their account security.
        </p>
        <p>
          Wherever a service offers it, enable two-factor authentication (2FA)
          in addition to a strong password. 2FA means that even if a password is
          somehow compromised, an attacker still needs a second factor — a code
          from your phone or an authenticator app — to get in. Password strength
          and 2FA solve different problems and work best together.
        </p>

        <p>
          Passwords are one layer of a larger picture. For the rest of it — what
          a browser leaks about you, which settings are worth changing and which
          warnings are noise — see{" "}
          <Link
            href="/blog/online-privacy-security-basics/"
            className="my-link"
          >
            online privacy and security basics
          </Link>
          .
        </p>

        <h2>Password Security Questions</h2>

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

      {/* ---- SIDEBAR ---- */}
      <aside className="sidebar">
        <div className="sidebar-box">
          <p style={{ fontSize: "20px", fontWeight: 600 }}>Related Tools</p>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li>
              <Link href="/image-converter/">
                <span style={{ textDecoration: "none" }} className="hover-item">
                  Image Converter
                </span>
              </Link>
            </li>
            <li>
              <Link href="/image-compressor/">
                <span style={{ textDecoration: "none" }} className="hover-item">
                  Image Compressor
                </span>
              </Link>
            </li>
            <li>
              <Link href="/currency-converter/">
                <span style={{ textDecoration: "none" }} className="hover-item">
                  Currency Converter
                </span>
              </Link>
            </li>
            <li>
              <Link href="/text-generator/">
                <span style={{ textDecoration: "none" }} className="hover-item">
                  Text Generator
                </span>
              </Link>
            </li>
            <li>
              <Link href="/text-converter/">
                <span style={{ textDecoration: "none" }} className="hover-item">
                  Text Converter
                </span>
              </Link>
            </li>
            <li>
              <Link href="/word-char-counter/">
                <span style={{ textDecoration: "none" }} className="hover-item">
                  Word Counter
                </span>
              </Link>
            </li>

            <style jsx>{`
              .hover-item:hover {
                text-decoration: underline;
              }
            `}</style>
          </ul>
        </div>
      </aside>
    </div>
  );
}
