"use client";
import { useState } from "react";
import Link from "next/link";
import "@fortawesome/fontawesome-free/css/all.min.css";

const SENTENCES = [
  "Modern web design improves user experience and engagement across all platforms.",
  "Developers use placeholder text during UI development to simulate real content.",
  "High quality content is essential for SEO performance and organic traffic growth.",
  "Clean layout structure enhances readability and usability for every visitor.",
  "Random text helps in testing responsive web design and component spacing.",
  "Good typography increases the visual appeal and professionalism of websites.",
  "Web applications must focus on speed and accessibility to retain users.",
  "Design systems maintain consistency across all components and product surfaces.",
  "Testing interfaces requires realistic sample content to catch layout issues early.",
  "SEO friendly structure improves search engine ranking and click-through rates.",
  "Minimal design helps users focus on the most important content and actions.",
  "Frontend development requires careful attention to layout alignment and spacing.",
  "Dummy text is widely used in design prototyping and content planning workflows.",
  "User centered design principles improve conversion rates and customer satisfaction.",
  "Well structured content improves website clarity and reduces user confusion.",
  "Performance optimization is a critical step in modern web application development.",
  "Consistent spacing and padding create a more polished and professional appearance.",
  "Accessible design ensures that all users can navigate and interact with content.",
  "Color contrast ratios play an important role in readability and visual hierarchy.",
  "Interactive prototypes help teams validate design decisions before writing code.",
  "Component driven development speeds up the building process for complex interfaces.",
  "Semantic HTML improves both accessibility and search engine crawlability.",
  "Lazy loading techniques help reduce initial page load times significantly.",
  "Content strategy guides the tone, structure, and purpose of every web page.",
  "Responsive images ensure fast loading experiences across all screen sizes.",
];

const PRESETS = [50, 100, 200, 500, 1000];

export default function TextGenerator() {
  const [wordCount, setWordCount] = useState("");
  const [generatedText, setGeneratedText] = useState("");
  const [copied, setCopied] = useState(false);
  const [activePreset, setActivePreset] = useState<number | null>(null);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const getWords = (count: number): string => {
    const words: string[] = [];
    const pool = [...SENTENCES].sort(() => Math.random() - 0.5);
    let si = 0;
    while (words.length < count) {
      const s = pool[si % pool.length];
      si++;
      for (const w of s.split(" ")) {
        if (words.length < count) words.push(w);
        else break;
      }
    }
    return words.join(" ");
  };

  const generateText = (count?: number) => {
    const n = count ?? Number(wordCount);
    if (!n || n <= 0) return;
    setGeneratedText(getWords(n));
    setCopied(false);
  };

  const handlePreset = (n: number) => {
    setActivePreset(n);
    setWordCount(String(n));
    generateText(n);
  };

  const handleClear = () => {
    setWordCount("");
    setGeneratedText("");
    setCopied(false);
    setActivePreset(null);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const statWords = generatedText
    ? generatedText.trim().split(/\s+/).filter(Boolean).length
    : 0;
  const statChars = generatedText.length;
  const statSents = generatedText
    ? (generatedText.match(/[.!?]+/g) || []).length
    : 0;

  /* ── FAQ data (also used for JSON-LD schema) ── */
  const faqs: [string, string][] = [
    [
      "What is random text actually used for?",
      "Two different jobs. As placeholder text it lets you judge a layout without being distracted by what it says, so it wants to be plausible and unremarkable. As test data it is meant to find where software breaks, so it wants to be awkward — empty strings, values one character over the limit, apostrophes, accents and emoji. Choosing the wrong kind is why generated text sometimes reveals nothing.",
    ],
    [
      "Should I use random English words or lorem ipsum?",
      "English words read more naturally and are better when you want a design to feel real. Pseudo-Latin is better when you want reviewers to look at the layout rather than read the words, since recognisable language pulls attention to meaning. Both work; the choice is about whether you want the text noticed or ignored.",
    ],
    [
      "How long should my placeholder text be?",
      "As long as the real content will be, and then generate it again at the longest plausible length. A card designed against two neat lines breaks when the actual headline runs to four. Vary the length between items too — identical blocks in every card produce a grid that looks perfect and never occurs in practice.",
    ],
    [
      "What test values are most likely to break an input field?",
      "Empty and whitespace-only strings, a value one character over the limit, apostrophes and quotation marks, accented or non-Latin characters, emoji, and a single very long unbroken word. Each targets a different assumption: null checks, off-by-one limits, escaping, encoding, length counting and text wrapping.",
    ],
    [
      "Why do emoji cause length problems?",
      "Because one emoji can occupy several storage units while looking like a single character. A field limited to 20 characters may be counting units rather than visible characters, so a handful of emoji can exhaust it while appearing far shorter than the limit. It is one of the most reliable ways to find a counting bug.",
    ],
    [
      "Can I use generated text as sample names or addresses?",
      "Better not to. Random text that happens to look like a plausible name or address can end up in a database, an email or a support ticket, and separating test records from real ones afterwards is much harder than keeping them obviously distinguishable from the start. Use values clearly reserved for testing, as payment processors provide for card numbers.",
    ],
    [
      "Can I publish random text on a website?",
      "No — it has no meaning, so it cannot inform anyone, and pages built from it add nothing for a reader. Search engines are specifically built to identify that kind of content. Placeholder text is for the period before real content exists, and the last step is always replacing it.",
    ],
    [
      "Is random text safe to use as a password?",
      "No. Random-looking words are not drawn from a proper random source and are far more predictable than they appear. Use a dedicated password generator, which draws from a cryptographically suitable source and lets you control length and character set.",
    ],
    [
      "How do I make sure placeholder text does not reach production?",
      "Search for a distinctive word from your generated text before shipping, and prefer text that is obviously not real over text that reads plausibly. Placeholder copy escaping into a live page is common enough to be a recognised category of embarrassment, and it is almost always caught by one search.",
    ],
  ];

  return (
    <>
      <div className="single-page-padding">
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

        <div>
          <h1>Random Text Generator — Placeholder and Test Data</h1>
          <p>
            Free <strong>random text generator online</strong> — generate exact
            word count English placeholder text for UI mockups, layout testing,
            and content prototyping. No signup, works instantly.
          </p>
        </div>

        <div className="calc-card">
          {/* ── Presets ── */}
          <div
            style={{
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
              marginBottom: "12px",
            }}
          >
            {PRESETS.map((n) => (
              <button
                key={n}
                className={`preset-pill${activePreset === n ? " active" : ""}`}
                onClick={() => handlePreset(n)}
              >
                {n.toLocaleString()} words
              </button>
            ))}
          </div>

          {/* ── Input row ── */}
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <input
              className="calc-input"
              type="number"
              placeholder="Or enter a custom word count…"
              value={wordCount}
              onChange={(e) => {
                setWordCount(e.target.value);
                setActivePreset(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") generateText();
              }}
              style={{ marginBottom: 0, flex: 1 }}
            />
          </div>

          {/* ── Action buttons ── */}
          <div className="action-buttons">
            <button className="calc-button" onClick={() => generateText()}>
              Generate
            </button>
            <button className="calc-button calc-clear" onClick={handleClear}>
              Clear
            </button>
          </div>

          {/* ── Output ── */}
          {generatedText ? (
            <div
              className="calc-result"
              style={{ marginTop: "14px", padding: 0 }}
            >
              <div className="stats-bar">
                <div className="stats-pills-row">
                  <div className="stat-chip">
                    Words: <b>{statWords.toLocaleString()}</b>
                  </div>
                  <div className="stat-chip">
                    Chars: <b>{statChars.toLocaleString()}</b>
                  </div>
                  <div className="stat-chip">
                    Sentences: <b>{statSents.toLocaleString()}</b>
                  </div>
                </div>
                <button
                  className={`copy-btn${copied ? " copied" : ""}`}
                  onClick={handleCopy}
                >
                  <i
                    className={`fa-solid ${copied ? "fa-check" : "fa-copy"}`}
                  ></i>
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <div className="output-text">{generatedText}</div>
            </div>
          ) : (
            <div className="empty-hint">
              <i className="fa-solid fa-align-left"></i>
              Pick a preset or enter a custom count, then hit Generate
            </div>
          )}
        </div>

        {/* ===== SEO CONTENT ===== */}

        <h2>Placeholder Text and Test Data Are Different Jobs</h2>
        <p>
          Random text gets used for two purposes that pull in opposite
          directions, and choosing the wrong one is why generated text sometimes
          fails to reveal the problem you were looking for.
        </p>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Placeholder text</th>
                <th>Test data</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Purpose</td>
                <td>Show how a layout looks with content in it</td>
                <td>Find out where software breaks</td>
              </tr>
              <tr>
                <td>Wants to be</td>
                <td>Plausible, unremarkable, easy to ignore</td>
                <td>Awkward, extreme, deliberately difficult</td>
              </tr>
              <tr>
                <td>Good length</td>
                <td>Roughly what the real content will be</td>
                <td>Empty, one character, and far past the limit</td>
              </tr>
              <tr>
                <td>Good characters</td>
                <td>Ordinary letters and punctuation</td>
                <td>Accents, quotes, emoji, right-to-left scripts</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          Filling a form with pleasant random words tests almost nothing.
          Filling it with an empty string, a single space, 5,000 characters and
          an apostrophe tests quite a lot.
        </p>

        <h2>Making Placeholder Text Do Its Job</h2>
        <p>
          The point of placeholder text is to let you judge a layout without
          being distracted by what it says. That only works if the text is
          honest about length.
        </p>
        <ul className="custom-list">
          <li>
            <strong>Match the real length.</strong> A card designed against two
            neat lines breaks when the actual headline runs to four. Generate at
            the length you expect, and then again at the longest plausible
            length.
          </li>
          <li>
            <strong>Vary it between items.</strong> Identical blocks in every
            card produce a grid that looks perfect and never occurs. Real
            content is ragged, and the ragged version is what you need to see.
          </li>
          <li>
            <strong>Include the short case.</strong> A one-word entry in a space
            designed for a paragraph looks just as wrong as an overflow, and it
            is tested far less often.
          </li>
          <li>
            <strong>Replace it before anyone outside sees it.</strong>{" "}
            Placeholder text reaching production is common enough to be a genre
            of embarrassment. Search for a distinctive word from your generated
            text before shipping.
          </li>
        </ul>

        <h2>What Actually Breaks Software</h2>
        <p>
          If you are generating text to test an input rather than to fill a
          design, the useful values are the ones nobody would type on purpose.
        </p>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Input</th>
                <th>What it tends to expose</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Empty and whitespace-only</td>
                <td>Validation that checks for null but not for blank</td>
              </tr>
              <tr>
                <td>One character over the limit</td>
                <td>
                  Off-by-one errors, and truncation that loses data silently
                </td>
              </tr>
              <tr>
                <td>Apostrophes and quotation marks</td>
                <td>Escaping problems in storage and display</td>
              </tr>
              <tr>
                <td>Accented and non-Latin characters</td>
                <td>Encoding assumptions, and byte-versus-character limits</td>
              </tr>
              <tr>
                <td>Emoji</td>
                <td>
                  Length counting, since one emoji can occupy several units
                </td>
              </tr>
              <tr>
                <td>A very long single word</td>
                <td>Layouts that assume text can wrap somewhere</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          The emoji row is the one that surprises developers most. A field
          limited to 20 characters may count storage units rather than visible
          characters, so a handful of emoji can exhaust it while looking far
          shorter than the limit.
        </p>

        <h2>Never Use Generated Text as Sample Personal Data</h2>
        <p>
          A related habit worth naming. When a test needs names, addresses or
          card numbers, use values that are unmistakably fake and reserved for
          the purpose rather than anything that could belong to a real person.
        </p>
        <p>
          Random text that happens to form a plausible name or address can end
          up in a database, an email, or a support ticket, and telling test
          records from real ones afterwards is much harder than keeping them
          distinguishable from the start. Payment processors publish test card
          numbers for exactly this reason, and using anything else is a bad idea
          even when it works.
        </p>

        <h2>Where Random Text Is the Wrong Tool</h2>
        <p>
          Generated text has clear limits, and pushing past them wastes time.
        </p>
        <ul className="custom-list">
          <li>
            <strong>Judging whether a design communicates.</strong> Meaningless
            words show you spacing and rhythm. They cannot tell you whether a
            heading is persuasive or a label is clear, because there is nothing
            to understand.
          </li>
          <li>
            <strong>Anything a reader will see.</strong> Random text has no
            meaning, so it cannot inform anyone. Publishing it adds pages without
            adding value, which is exactly what search engines are built to
            detect.
          </li>
          <li>
            <strong>Realistic performance testing.</strong> Uniform generated
            blocks compress and cache differently from real content, so timings
            taken against them can mislead.
          </li>
          <li>
            <strong>Passwords or identifiers.</strong> Random words are not
            random enough for security. Use a{" "}
            <Link href="/password-generator/" className="my-link">
              password generator
            </Link>
            , which draws from a proper random source.
          </li>
        </ul>
        <p>
          For classic pseudo-Latin filler rather than English words, the{" "}
          <Link href="/lorem-ipsum-generator/" className="my-link">
            lorem ipsum generator
          </Link>{" "}
          produces the traditional form, and the{" "}
          <Link href="/word-char-counter/" className="my-link">
            word and character counter
          </Link>{" "}
          tells you exactly how long any generated block runs.
        </p>
        <h2>Random Text Questions</h2>

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
    </>
  );
}
