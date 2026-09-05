"use client";
import { useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Link from "next/link";

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
      "Why does automatic title case sometimes look wrong?",
      "Because title case is not one rule. Style guides genuinely disagree about short prepositions, the word after a colon, the second half of hyphenated words and whether the final word is always capitalised. No automatic conversion matches every house style, so convert first and then correct the handful of words your own style treats differently.",
    ],
    [
      "What is the difference between title case and sentence case?",
      "Sentence case capitalises the first word and proper nouns and nothing else. Title case capitalises the significant words throughout. Sentence case is easier to read and much harder to get wrong, which is why most modern interfaces use it for headings; title case reads as more formal and remains standard for book titles and article headlines.",
    ],
    [
      "Can I undo a case conversion?",
      "Not reliably. Converting to upper or lower case discards the original capitalisation permanently. Take a sentence to upper case and back to lower and every proper noun, acronym and sentence-initial capital is gone. Keep an unconverted copy before transforming anything you cannot easily retype.",
    ],
    [
      "What happens to acronyms when I convert case?",
      "They are the most visible casualty. Lowercase a paragraph containing NASA, PDF or URL and no automatic conversion restores them — title case produces Nasa, Pdf and Url, which reads worse than either extreme. If your text contains acronyms, expect to fix them by hand after any conversion.",
    ],
    [
      "Why is text in all capitals harder to read?",
      "Because capital letters share a uniform rectangular outline, while lower case letters have ascenders and descenders that give each word a distinctive shape readers recognise at a glance. Capitals work well for short labels and acronyms and become tiring across a paragraph.",
    ],
    [
      "Is it safe to lowercase an email address?",
      "The domain half is case-insensitive and safe to convert. The local part before the @ technically is not, although virtually every provider treats it as case-insensitive in practice. Lowercasing both sides before comparing is standard for matching, but store the address as the user typed it where you can.",
    ],
    [
      "Are there values I should never case-convert?",
      "Yes — anything genuinely case-sensitive, including API keys, passwords, tokens and base64 strings. Normalising those silently breaks them, often in ways that surface much later. As a rule, never case-convert a value you did not generate yourself.",
    ],
    [
      "Does case conversion work correctly in other languages?",
      "Not always. Case rules are language-specific, and a simple transformation may not implement every language's behaviour correctly, particularly around accented characters and scripts with special casing rules. Check the output in any language you cannot read rather than assuming it converted properly.",
    ],
    [
      "Which case should I use for headings on my site?",
      "Whichever you can apply consistently. The common real problem is not the choice but the mixture — some headings in title case, some in sentence case, one in capitals — which looks careless even when each individual choice was defensible. Decide once per element type, write it down, and apply it everywhere.",
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

        {/* ── SEO CONTENT ── */}

        <h2>Title Case Is Not One Rule</h2>
        <p>
          Most case conversions are mechanical. Upper, lower and toggle case
          apply a fixed transformation to every character and there is nothing to
          disagree about. Title case is different: it depends on which style
          guide you follow, and the major guides genuinely disagree.
        </p>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>The question</th>
                <th>One convention</th>
                <th>Another convention</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Short prepositions such as &quot;with&quot;</td>
                <td>Lowercase</td>
                <td>Capitalise anything over three letters</td>
              </tr>
              <tr>
                <td>The word after a colon</td>
                <td>Always capitalised</td>
                <td>Only if it begins a full clause</td>
              </tr>
              <tr>
                <td>The second half of a hyphenated word</td>
                <td>Capitalised</td>
                <td>Lowercase unless it is a proper noun</td>
              </tr>
              <tr>
                <td>The last word of a title</td>
                <td>Always capitalised, whatever it is</td>
                <td>Treated like any other word</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          Because of this, no automatic title case is correct for every house
          style. The useful approach is to convert first and then read the
          result, correcting the few words your own style treats differently.
          Consistency within one publication matters far more than matching any
          particular guide.
        </p>

        <h2>What Each Case Is Actually For</h2>
        <p>
          <strong>Sentence case</strong> capitalises the first word and proper
          nouns, and nothing else. It is the easiest to read and the hardest to
          get wrong, which is why most modern interfaces and many publications
          use it for headings.
        </p>
        <p>
          <strong>Title case</strong> capitalises the significant words. It reads
          as more formal and is standard for book titles, article headlines and
          academic references.
        </p>
        <p>
          <strong>Upper case</strong> works for short labels and acronyms. In
          longer runs it is genuinely harder to read, because capital letters
          share a uniform rectangular outline while lower case letters have
          ascenders and descenders that give words a recognisable shape.
        </p>
        <p>
          <strong>Lower case</strong> is useful for normalising data before
          comparison, and for the deliberate informality some brands adopt.
        </p>

        <h2>Converting Loses Information</h2>
        <p>
          This is the trap that catches people editing existing text. Converting
          to upper or lower case discards the original capitalisation, and no
          conversion back can restore it.
        </p>
        <p>
          Take a sentence to upper case and back to lower and every proper noun,
          every acronym and the sentence-initial capital are all gone. The text
          reads as lower case throughout, and restoring it means retyping the
          names by hand.
        </p>
        <p>
          Acronyms are the most visible casualty. Convert a paragraph containing
          NASA, PDF or URL to lower case and no automatic conversion will bring
          them back — title case will produce Nasa, Pdf and Url, which is worse
          than either extreme. Keep an unconverted copy before transforming
          anything you cannot easily retype.
        </p>

        <h2>Case in Data, Not Just Prose</h2>
        <p>
          Case conversion is used as often for tidying data as for writing, and
          the considerations are different.
        </p>
        <ul className="custom-list">
          <li>
            <strong>Comparing values.</strong> Converting both sides to lower
            case before comparing makes matching case-insensitive, which is
            usually what you want for names and email addresses.
          </li>
          <li>
            <strong>Email addresses.</strong> The domain half is case-insensitive
            and safe to lowercase. The local part technically is not, though in
            practice virtually every provider treats it as such.
          </li>
          <li>
            <strong>Identifiers and codes.</strong> Some are genuinely
            case-sensitive — API keys, passwords, base64 strings — and
            normalising them silently breaks them. Never case-convert a value you
            did not generate.
          </li>
          <li>
            <strong>Accented characters.</strong> Case conversion of non-English
            text follows language-specific rules that a simple transformation may
            not implement correctly, so check results in any language you cannot
            read.
          </li>
        </ul>

        <h2>Choosing One and Sticking to It</h2>
        <p>
          The most common real-world problem is not choosing the wrong case but
          mixing several. A page with some headings in title case, some in
          sentence case and one in capitals looks careless even when every
          individual choice was defensible.
        </p>
        <p>
          Decide once, per element type: headings one way, buttons another,
          navigation a third if you like — and then apply it everywhere. Readers
          never notice consistent styling and always notice inconsistent
          styling, which is the whole argument for writing the rule down.
        </p>
        <p>
          To check length after converting, the{" "}
          <Link href="/word-char-counter/" className="my-link">
            word and character counter
          </Link>{" "}
          gives exact counts, which matters because case conversion never changes
          character count even though capitals occupy more visual width.
        </p>
        <h2>Text Case Questions</h2>

          {faqs.map(([q, a], i) => {
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
    </>
  );
}
