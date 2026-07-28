"use client";
import { useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";

type ConversionType =
  | "uppercase"
  | "lowercase"
  | "capitalize"
  | "camelcase"
  | "pascalcase"
  | "snakecase"
  | "kebabcase";

export default function TextConverter() {
  const [inputText, setInputText] = useState("");
  const [convertedText, setConvertedText] = useState("");
  const [conversionType, setConversionType] =
    useState<ConversionType>("uppercase");
  const [copied, setCopied] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  /* ── Helper: split any input into clean word tokens ──
     Handles spaces, dashes, underscores, camel/PascalCase boundaries,
     and multiple consecutive separators. */
  const tokenize = (text: string): string[] =>
    text
      .replace(/([a-z])([A-Z])/g, "$1 $2") // split camel/Pascal boundaries
      .replace(/[_\-\s]+/g, " ") // normalize separators
      .replace(/[^a-zA-Z0-9 ]/g, "") // strip punctuation
      .trim()
      .split(/\s+/)
      .filter(Boolean);

  const handleConvert = () => {
    if (!inputText) return;

    let result = "";
    switch (conversionType) {
      case "uppercase":
        result = inputText.toUpperCase();
        break;

      case "lowercase":
        result = inputText.toLowerCase();
        break;

      case "capitalize":
        result = inputText
          .toLowerCase()
          .replace(/\b\w/g, (char) => char.toUpperCase());
        break;

      case "camelcase": {
        const words = tokenize(inputText);
        result = words
          .map((w, i) =>
            i === 0
              ? w.toLowerCase()
              : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(),
          )
          .join("");
        break;
      }

      case "pascalcase": {
        const words = tokenize(inputText);
        result = words
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join("");
        break;
      }

      case "snakecase": {
        const words = tokenize(inputText);
        result = words.map((w) => w.toLowerCase()).join("_");
        break;
      }

      case "kebabcase": {
        const words = tokenize(inputText);
        result = words.map((w) => w.toLowerCase()).join("-");
        break;
      }
    }

    setConvertedText(result);
  };

  const handleClear = () => {
    setInputText("");
    setConvertedText("");
    setConversionType("uppercase");
    setCopied(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(convertedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  /* ── FAQ data (also used for JSON-LD schema) ── */
  const faqs: [string, string][] = [
    [
      "What is a text case converter and how does it work?",
      "A text case converter changes the letter case or format of text — UPPERCASE, lowercase, Title Case, camelCase, PascalCase, snake_case, or kebab-case. Paste your text, pick a format, and the converter transforms it instantly without you retyping.",
    ],
    [
      "What is title case and when should I use it?",
      "Title case capitalizes the first letter of each major word — used for headlines, book titles, and article headings. It's the standard for AP, Chicago, and most editorial style guides. Example: 'A Guide to Better Writing' is in title case.",
    ],
    [
      "What is the difference between title case and sentence case?",
      "Title case capitalizes every major word (e.g. 'How to Learn JavaScript'). Sentence case only capitalizes the first word and proper nouns (e.g. 'How to learn JavaScript'). Sentence case reads more naturally in body copy; title case is standard for headings.",
    ],
    [
      "What is camelCase used for?",
      "camelCase is the standard naming convention for variables and functions in JavaScript, Java, Swift, and TypeScript. The first word is lowercase and each following word starts with a capital letter — e.g. userName, calculateTotal, getUserById.",
    ],
    [
      "What is the difference between camelCase and PascalCase?",
      "camelCase starts with a lowercase letter (userName), while PascalCase capitalizes every word including the first (UserName). camelCase is used for variables and functions; PascalCase is used for class names, React components, and type definitions.",
    ],
    [
      "What is snake_case used for?",
      "snake_case uses lowercase words separated by underscores. It's standard in Python, Ruby, and Rust for variables and functions (user_name, calculate_total), and in databases for column names.",
    ],
    [
      "What is kebab-case and where is it used?",
      "kebab-case uses lowercase words joined by hyphens (user-name). It's the standard for URLs, CSS class names, HTML attributes, and file names in web development. Search-engine-friendly URLs use kebab-case.",
    ],
    [
      "How do I uncapitalize text online?",
      "Paste your text into this converter and select 'Lowercase' to instantly convert ALL CAPS or Mixed Case to all lowercase. Useful for fixing accidental Caps Lock text or normalizing shouty content.",
    ],
    [
      "How do I fix accidental caps lock text?",
      "Paste the text into the input box, select 'Lowercase' to remove caps entirely, or 'Capitalize' to get proper title case back. The converter handles paragraphs of any length in one click.",
    ],
    [
      "Is this text converter free and safe to use?",
      "Yes — 100% free, no signup required, and all conversions happen in your browser. Your text never leaves your device or gets sent to a server.",
    ],
    [
      "Does it work on mobile devices?",
      "Yes. The tool works on phones, tablets, and desktops. Paste, tap the case type, tap Convert, then Copy.",
    ],
    [
      "Can I convert long paragraphs at once?",
      "Yes. Paste any length of text — sentences, paragraphs, or full articles — and the converter processes it in a single click.",
    ],
  ];

  return (
    <>
      {/* FAQ JSON-LD schema for rich results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map(([q, a]) => ({
              "@type": "Question",
              name: q,
              acceptedAnswer: { "@type": "Answer", text: a },
            })),
          }),
        }}
      />

      {/* ---- PAGE LAYOUT WRAPPER ---- */}
      <div className="page-layout single-page-padding">
        <div className="single-page-padding">
          <h1>Text Case Converter</h1>

          <p>
            Free <strong>text case converter online</strong> — convert to
            UPPERCASE, lowercase, Title Case, camelCase, PascalCase, snake_case,
            and kebab-case instantly. No signup, works on any device.
          </p>

          <div className="single-page-padding">
            <div className="calc-card">
              <textarea
                className="calc-input"
                placeholder="Paste your text here..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                style={{ minHeight: "100px", resize: "vertical" }}
              />

              {/* Radio Options — expanded with 4 new case types */}
              <div style={{ margin: "0" }}>
                {[
                  { label: "UPPERCASE", value: "uppercase" },
                  { label: "lowercase", value: "lowercase" },
                  { label: "Capitalize (Title Case)", value: "capitalize" },
                  { label: "camelCase", value: "camelcase" },
                  { label: "PascalCase", value: "pascalcase" },
                  { label: "snake_case", value: "snakecase" },
                  { label: "kebab-case", value: "kebabcase" },
                ].map((item) => (
                  <label
                    key={item.value}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "0px",
                      cursor: "pointer",
                      padding: "8px 10px",
                      color: "white",
                      borderRadius: "10px",
                    }}
                  >
                    <input
                      type="radio"
                      name="conversion"
                      value={item.value}
                      checked={conversionType === item.value}
                      onChange={() =>
                        setConversionType(item.value as ConversionType)
                      }
                      style={{
                        width: "18px",
                        height: "18px",
                        accentColor: "#1f9fb8",
                        cursor: "pointer",
                      }}
                    />
                    {item.label}
                  </label>
                ))}
              </div>

              <div
                style={{ display: "flex", gap: "10px", marginBottom: "10px" }}
              >
                <button className="calc-button" onClick={handleConvert}>
                  Convert
                </button>
                <button
                  className="calc-button calc-clear"
                  onClick={handleClear}
                >
                  Clear
                </button>
              </div>

              {convertedText && (
                <div
                  className="calc-result"
                  style={{
                    whiteSpace: "pre-wrap",
                    wordWrap: "break-word",
                    lineHeight: "1.6",
                    paddingBottom: "45px",
                    position: "relative",
                  }}
                >
                  {convertedText}

                  <button
                    onClick={copyToClipboard}
                    style={{
                      position: "absolute",
                      bottom: "10px",
                      right: "10px",
                      padding: "6px 14px",
                      border: "none",
                      background: "#d8a13a",
                      color: "white",
                      borderRadius: "2px",
                      fontSize: "13px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <i className="fa-solid fa-copy"></i>
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ── SEO CONTENT — REWRITTEN ── */}

          <h2>What Is a Text Case Converter?</h2>
          <p>
            A <strong>text case converter</strong> is a tool that changes the
            letter case or format of a piece of text — UPPERCASE, lowercase,
            Title Case, camelCase, PascalCase, snake_case, or kebab-case. It
            saves you from retyping text or manually editing every word, and
            it's essential for writers, developers, students, and anyone who
            works with formatted text daily.
          </p>
          <p>
            Our <strong>free online text case converter</strong> supports all
            seven common formats in one tool. Paste your text, pick a case, hit
            Convert, and copy the result. Everything happens in your browser —
            your text never leaves your device.
          </p>

          <h2>All 7 Text Cases Explained (With Examples)</h2>
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
                  Case Type
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Example
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Common Use
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  <strong>UPPERCASE</strong>
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  HELLO WORLD FROM CLAUDE
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Headings, emphasis, acronyms, warning labels
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  <strong>lowercase</strong>
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  hello world from claude
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Code, URLs, email addresses, casual writing
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  <strong>Title Case</strong>
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Hello World From Claude
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Book titles, article headings, blog posts
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  <strong>camelCase</strong>
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  helloWorldFromClaude
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  JavaScript / Java variables and functions
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  <strong>PascalCase</strong>
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  HelloWorldFromClaude
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Class names, React components, TypeScript types
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  <strong>snake_case</strong>
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  hello_world_from_claude
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Python / Ruby variables, database columns
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  <strong>kebab-case</strong>
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  hello-world-from-claude
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  URLs, CSS class names, HTML attributes, file names
                </td>
              </tr>
            </tbody>
          </table>

          <h2>How to Use This Text Case Converter</h2>
          <ol className="custom-list">
            <li>
              <strong>Paste your text</strong> into the input box above.
            </li>
            <li>
              <strong>Pick the target case</strong> from the radio options —
              UPPERCASE, lowercase, Title Case, camelCase, PascalCase,
              snake_case, or kebab-case.
            </li>
            <li>
              Click <strong>Convert</strong> to transform the text instantly.
            </li>
            <li>
              Click <strong>Copy</strong> to send the result straight to your
              clipboard.
            </li>
          </ol>
          <p>
            The converter handles paragraphs, sentences, or single lines. For
            programmer cases (camel, Pascal, snake, kebab), it automatically
            splits text at spaces, hyphens, underscores, and even existing
            camelCase boundaries — so <em>helloWorld</em>, <em>hello_world</em>,
            and <em>hello world</em> all convert cleanly.
          </p>

          <h2>Title Case Converter — What Is Title Case and When to Use It?</h2>
          <p>
            <strong>Title case</strong> capitalizes the first letter of every
            major word in a heading. It's the standard for book titles, article
            headings, blog posts, and formal document sections. Most style
            guides (AP, Chicago, MLA) have their own rules for what counts as a
            "major word", but our converter capitalizes the first letter of
            every word — which matches how most CMS and publishing platforms
            display headings.
          </p>
          <p>
            <strong>When to use title case:</strong>
          </p>
          <ul className="custom-list">
            <li>Article and blog post titles</li>
            <li>Book, movie, and song titles</li>
            <li>Chapter and section headings</li>
            <li>Job titles on resumes and LinkedIn</li>
            <li>Slide titles in presentations</li>
          </ul>

          <h2>Title Case vs Sentence Case — What's the Difference?</h2>
          <p>These two often get confused. Here's the clean split:</p>
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
                  Style
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Rule
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Example
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  <strong>Title Case</strong>
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Capitalize the first letter of every major word
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  How to Learn JavaScript in 30 Days
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  <strong>Sentence case</strong>
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Only capitalize the first word (and proper nouns)
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  How to learn JavaScript in 30 days
                </td>
              </tr>
            </tbody>
          </table>
          <p>
            Title case is standard for headings and titles. Sentence case reads
            more naturally in body copy, UI microcopy, and modern brand style
            guides (Google, Airbnb, and Apple all use sentence case for most UI
            text). Neither is wrong — pick one and stay consistent.
          </p>

          <h2>camelCase vs PascalCase — What's the Difference?</h2>
          <p>
            Both remove spaces and capitalize word boundaries. The only
            difference is the first letter:
          </p>
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
                  Case
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Rule
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Example
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Used For
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  <strong>camelCase</strong>
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  First word lowercase, rest capitalized
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  userName, calculateTotal
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Variables, functions, methods (JavaScript, Java, Swift)
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  <strong>PascalCase</strong>
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Every word capitalized (including the first)
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  UserName, CalculateTotal
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Class names, React components, TypeScript types
                </td>
              </tr>
            </tbody>
          </table>
          <p>
            Quick rule of thumb for developers: if it's something you can
            instantiate or export as a component, use PascalCase. If it's a
            variable or function, use camelCase.
          </p>

          <h2>snake_case vs kebab-case — When to Use Each</h2>
          <p>
            Same idea (lowercase words joined by a separator) but the separator
            matters because different environments treat them differently.
          </p>
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
                  Case
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Separator
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Example
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Standard In
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  <strong>snake_case</strong>
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Underscore <code>_</code>
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  user_name, get_full_address
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Python, Ruby, Rust, SQL columns, environment variables
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  <strong>kebab-case</strong>
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Hyphen <code>-</code>
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  user-name, get-full-address
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  URLs, CSS classes, HTML attributes, file names
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  <strong>SCREAMING_SNAKE_CASE</strong>
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Underscore + uppercase
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  MAX_RETRIES, API_KEY
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Constants in most languages
                </td>
              </tr>
            </tbody>
          </table>
          <p>
            <strong>Important:</strong> never use kebab-case for JavaScript
            variables (the hyphen is a minus operator). Never use spaces or
            special characters in URLs — always kebab-case.
          </p>

          <h2>Common Uses for the Text Case Converter</h2>
          <ul className="custom-list">
            <li>
              <strong>Fix accidental Caps Lock text</strong> — paste the shouty
              text, pick lowercase or Title Case, done.
            </li>
            <li>
              <strong>Uncapitalize text</strong> — convert ALL CAPS blocks to
              lowercase for a calmer tone.
            </li>
            <li>
              <strong>Format blog post titles</strong> — paste a rough title,
              apply Title Case, publish.
            </li>
            <li>
              <strong>Convert variable names between languages</strong> —{" "}
              <code>user_name</code> (Python) → <code>userName</code>{" "}
              (JavaScript) → <code>UserName</code> (C#) in two clicks.
            </li>
            <li>
              <strong>Generate SEO-friendly URL slugs</strong> — paste your page
              title, apply kebab-case, done.
            </li>
            <li>
              <strong>Prepare CSS class names</strong> — convert design labels
              to kebab-case for stylesheets.
            </li>
            <li>
              <strong>Normalize database column names</strong> — apply
              snake_case to headings before importing to SQL.
            </li>
            <li>
              <strong>Format social media captions</strong> — apply Title Case
              for hashtags-turned-captions.
            </li>
            <li>
              <strong>Prepare React component names</strong> — apply PascalCase
              to feature descriptions.
            </li>
          </ul>

          <h2>Programming Language Case Conventions (Cheat Sheet)</h2>
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
                  Language
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Variables / Functions
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Classes / Types
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Constants
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  JavaScript / TypeScript
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  camelCase
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  PascalCase
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  SCREAMING_SNAKE_CASE
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Python
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  snake_case
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  PascalCase
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  SCREAMING_SNAKE_CASE
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Ruby
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  snake_case
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  PascalCase
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  SCREAMING_SNAKE_CASE
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Java
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  camelCase
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  PascalCase
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  SCREAMING_SNAKE_CASE
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  C#
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  PascalCase (methods) / camelCase (locals)
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  PascalCase
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  PascalCase
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Rust
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  snake_case
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  PascalCase
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  SCREAMING_SNAKE_CASE
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Go
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  camelCase / PascalCase (exported)
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  PascalCase
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  PascalCase or camelCase
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  CSS
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  kebab-case
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>—</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>—</td>
              </tr>
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  HTML attributes
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  kebab-case
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>—</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>—</td>
              </tr>
            </tbody>
          </table>

          <h2>Why Use This Free Text Case Converter</h2>
          <ul className="custom-list">
            <li>
              ✅ <strong>7 case types</strong> — UPPERCASE, lowercase, Title
              Case, camelCase, PascalCase, snake_case, kebab-case
            </li>
            <li>
              ✅ <strong>100% free</strong> — no signup, no login, no ads on the
              tool
            </li>
            <li>
              ✅ <strong>Fully client-side</strong> — your text never leaves
              your browser
            </li>
            <li>
              ✅ <strong>Handles messy input</strong> — spaces, dashes,
              underscores, and existing case boundaries all recognized
            </li>
            <li>
              ✅ <strong>One-click copy</strong> — result goes straight to your
              clipboard
            </li>
            <li>
              ✅ <strong>Works on mobile</strong> — phone, tablet, laptop,
              desktop
            </li>
            <li>
              ✅{" "}
              <strong>
                Perfect for developers, writers, students, and bloggers
              </strong>
            </li>
          </ul>

          <h2>Frequently Asked Questions</h2>

          {faqs.map(([q, a], i) => (
            <div className="faq-item" key={i}>
              <h3 onClick={() => toggleFAQ(i)}>
                {q}
                <i
                  className={`fa-solid fa-chevron-down ${openFAQ === i ? "rotate" : ""}`}
                />
              </h3>
              {openFAQ === i && <p>{a}</p>}
            </div>
          ))}

          <h2>Final Thoughts</h2>
          <p>
            Whether you're formatting a blog post title, generating a URL slug,
            converting Python variables to JavaScript, or just fixing a
            paragraph you accidentally typed with Caps Lock on, this{" "}
            <strong>text case converter</strong> covers every common case format
            in one place. Bookmark it for the next time you need to switch
            between UPPERCASE and camelCase — or anything in between.
          </p>
        </div>
      </div>
    </>
  );
}
