"use client";
import { useState } from "react";
import Link from "next/link";
import "@fortawesome/fontawesome-free/css/all.min.css";

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
    <>
      {/* ---- PAGE LAYOUT WRAPPER ---- */}
      <div className="page-layout single-page-padding">
        <div className="single-page-padding">
          <h1>Password Generator</h1>

          <p>Create Strong & Secure Passwords Instantly</p>
          <div className="single-page-padding">
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
              <div
                style={{ display: "flex", gap: "10px", marginBottom: "10px" }}
              >
                <button className="calc-button" onClick={generatePassword}>
                  Generate
                </button>
                <button
                  className="calc-button calc-clear"
                  onClick={handleClear}
                >
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

          <h2>What Is a Password?</h2>
          <p>
            A password is a string of characters used to verify identity and
            provide access to accounts, devices, or secured information. Strong
            passwords help protect against unauthorized access and cyberattacks.
            A secure password usually includes a mix of letters, numbers, and
            special characters.
          </p>

          <h2>Why Strong Passwords Matter</h2>
          <ul className="custom-list">
            <li>Prevents unauthorized access to your accounts</li>
            <li>Protects personal information and privacy</li>
            <li>Reduces risk of hacking, identity theft, and data breaches</li>
            <li>
              Required for banking, social media, business, and email accounts
            </li>
            <li>Essential for strengthening overall cybersecurity</li>
          </ul>

          <h2>Password Generator Options</h2>

          <h3>1. Password Length</h3>
          <p>
            Allows you to choose how long your password should be. Longer
            passwords are harder to guess and more secure.
          </p>

          <h3>2. Uppercase Letters</h3>
          <p>
            Includes capital letters (A–Z) to increase password complexity and
            strengthen security.
          </p>

          <h3>3. Lowercase Letters</h3>
          <p>
            Adds small letters (a–z), which form the base of most passwords.
          </p>

          <h3>4. Numbers</h3>
          <p>
            Includes digits (0–9) to add variation and make your password harder
            to predict.
          </p>

          <h3>5. Symbols</h3>
          <p>
            Adds special characters like !, @, #, $, %, & which significantly
            increase password strength.
          </p>

          <h2>How Password Generation Works</h2>
          <p>
            The password generator randomly selects characters based on the
            options you choose. It combines uppercase letters, lowercase
            letters, numbers, and symbols to create a strong and unpredictable
            password. The result is a secure password that cannot be easily
            guessed or cracked.
          </p>

          <h2>Benefits of Using Our Password Generator</h2>
          <ul className="custom-list">
            <li>Creates strong and secure passwords instantly</li>
            <li>Fully customizable based on your requirements</li>
            <li>Protects your accounts from hacking attempts</li>
            <li>Generates highly random and hard-to-crack passwords</li>
            <li>Free and easy to use on any device</li>
            <li>Improves overall digital security</li>
          </ul>

          <h2>Examples of Where You Need Strong Passwords</h2>
          <ul className="custom-list">
            <li>Email accounts and cloud storage services</li>
            <li>Online banking and financial apps</li>
            <li>Social media accounts like Facebook or Instagram</li>
            <li>Work accounts and business systems</li>
            <li>Shopping websites and online payment platforms</li>
            <li>Wi-Fi networks and smart home devices</li>
          </ul>

          <h2>Frequently Asked Questions</h2>

          <div className="faq-item">
            <h3 onClick={() => toggleFAQ(0)}>
              How long should a strong password be?
              <i
                className={`fa-solid fa-chevron-down ${openFAQ === 0 ? "rotate" : ""}`}
              ></i>
            </h3>
            {openFAQ === 0 && (
              <p>
                Ideally at least 12–16 characters long. Longer passwords are
                more secure.
              </p>
            )}
          </div>

          <div className="faq-item">
            <h3 onClick={() => toggleFAQ(1)}>
              Are symbols and numbers necessary?
              <i
                className={`fa-solid fa-chevron-down ${openFAQ === 1 ? "rotate" : ""}`}
              ></i>
            </h3>
            {openFAQ === 1 && (
              <p>
                Yes. They significantly increase password strength and reduce
                the chance of hacking.
              </p>
            )}
          </div>

          <div className="faq-item">
            <h3 onClick={() => toggleFAQ(2)}>
              Is this password generator secure?
              <i
                className={`fa-solid fa-chevron-down ${openFAQ === 2 ? "rotate" : ""}`}
              ></i>
            </h3>
            {openFAQ === 2 && (
              <p>
                Yes. It generates passwords locally in your browser and does not
                store or share any data.
              </p>
            )}
          </div>

          <div className="faq-item">
            <h3 onClick={() => toggleFAQ(3)}>
              Can I use these passwords for any account?
              <i
                className={`fa-solid fa-chevron-down ${openFAQ === 3 ? "rotate" : ""}`}
              ></i>
            </h3>
            {openFAQ === 3 && (
              <p>
                Absolutely. You can use them for social media, banking, email,
                work, and more.
              </p>
            )}
          </div>

          <div className="faq-item">
            <h3 onClick={() => toggleFAQ(4)}>
              Is this tool free?
              <i
                className={`fa-solid fa-chevron-down ${openFAQ === 4 ? "rotate" : ""}`}
              ></i>
            </h3>
            {openFAQ === 4 && (
              <p>
                Yes. Our password generator is completely free and available
                anytime online.
              </p>
            )}
          </div>
        </div>

        {/* ---- SIDEBAR ---- */}
        <aside className="sidebar">
          <div className="sidebar-box">
            <p style={{ fontSize: "20px", fontWeight: 600 }}>Related Tools</p>
            <ul style={{ listStyle: "none", padding: 0 }}>
              <li>
                <Link href="/image-converter/">
                  <span
                    style={{ textDecoration: "none" }}
                    className="hover-item"
                  >
                    Image Converter
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/image-compressor/">
                  <span
                    style={{ textDecoration: "none" }}
                    className="hover-item"
                  >
                    Image Compressor
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/currency-converter/">
                  <span
                    style={{ textDecoration: "none" }}
                    className="hover-item"
                  >
                    Currency Converter
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/text-generator/">
                  <span
                    style={{ textDecoration: "none" }}
                    className="hover-item"
                  >
                    Text Generator
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/text-converter/">
                  <span
                    style={{ textDecoration: "none" }}
                    className="hover-item"
                  >
                    Text Converter
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/word-char-counter/">
                  <span
                    style={{ textDecoration: "none" }}
                    className="hover-item"
                  >
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
    </>
  );
}
