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
      "What is a random text generator and how does it work?",
      "A random text generator is a tool that produces placeholder text on demand — usually to fill UI mockups, wireframes, or CMS templates before real copy is ready. This one generates readable English sentences drawn from a pool of design and development phrases, then trims the output to the exact word count you request.",
    ],
    [
      "Is this random text generator free?",
      "Yes — 100% free with no signup, login, or credit card. Everything runs in your browser and nothing is stored or tracked.",
    ],
    [
      "Does it generate an exact word count?",
      "Yes. Whether you pick a preset (50, 100, 200, 500, or 1,000 words) or type a custom number, the output matches the count exactly — no padding, no truncation, no rounding.",
    ],
    [
      "Is this better than a Lorem Ipsum generator?",
      "For most purposes, yes. Lorem Ipsum is Latin and often confuses clients and stakeholders. Real English placeholder text reads naturally, gives a truer preview of your final layout, and doesn't require a mental translation. Lorem Ipsum still has one use case — 'greeking' when you specifically want text that's hard to read so nobody focuses on the copy during a design review.",
    ],
    [
      "How many words can I generate at once?",
      "There's no hard cap. The tool comfortably handles anywhere from a few words up to several thousand in one click. For very large volumes (10,000+ words), you may want to generate in batches.",
    ],
    [
      "Is the generated text unique every time?",
      "The tool shuffles a sentence pool for each generation, so consecutive clicks produce different combinations. It's not cryptographically unique, but it's varied enough for design mockups and layout testing.",
    ],
    [
      "Can I use the generated text commercially?",
      "Yes. Free for personal, academic, and commercial use — client mockups, prototypes, CMS templates, print layouts, whatever you need.",
    ],
    [
      "Does the tool store or track my text?",
      "No. All generation happens in your browser. Nothing is sent to a server, stored, or logged.",
    ],
    [
      "Can I use this for random English words instead of full sentences?",
      "Yes. Set a low word count (e.g. 5–20) and the output reads more like a random English words generator. For single words, generate 1 word at a time.",
    ],
    [
      "Can I use this as a random phrase generator?",
      "Yes. Set the word count to 3–8 words and you'll get short phrase-length output. Regenerate for a new phrase each time.",
    ],
    [
      "Does this work on mobile devices?",
      "Yes — fully responsive on iPhones, Android phones, tablets, and desktop browsers. No app install needed.",
    ],
    [
      "How is this different from a random string or random letter generator?",
      "A random string or letter generator produces gibberish characters (like passwords or IDs). This is a random text generator — it produces readable English sentences, meant for filling UI layouts and content mockups, not for generating IDs or passwords.",
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
          <h1>Random Text Generator</h1>
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

        {/* ===== SEO CONTENT — REWRITTEN ===== */}

        <h2>What Is a Random Text Generator?</h2>
        <p>
          A <strong>random text generator</strong> produces placeholder text on
          demand — the kind you drop into a UI mockup, wireframe, blog template,
          or CMS layout while you're waiting for the real copy to be written.
          Instead of typing "asdf asdf asdf" or falling back on Latin Lorem
          Ipsum, you get clean, readable English sentences that look like real
          content in your design.
        </p>
        <p>
          This <strong>free online random text generator</strong> gives you
          exact word-count control (50, 100, 200, 500, 1,000 words, or any
          custom number), live stats for words, characters, and sentences, and
          one-click copy to clipboard. Everything runs in your browser — no
          signup, no data leaves your device.
        </p>

        <h2>Random Text Generator vs Lorem Ipsum — Which Should You Use?</h2>
        <p>
          Lorem Ipsum has been the default placeholder for 500 years (yes,
          really — it originated from a scrambled Cicero passage). It's still
          useful in one specific case: when you want the client to look at the
          design, not the words. But for most modern workflows, English
          placeholder text wins.
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
                Feature
              </th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                Random English Text
              </th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                Lorem Ipsum
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Language
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Modern English
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Scrambled Latin
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Client-friendly
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                ✅ Readable at a glance
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                ❌ Confusing for non-designers
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Layout realism
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                ✅ Matches real English word length &amp; rhythm
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                ❌ Latin word lengths differ
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Exact word count
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                ✅ Precise to the word
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                ❌ Usually generates paragraphs
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                SEO layout preview
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                ✅ Reflects real search snippet look
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                ❌ Won't reflect real snippet
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                "Greeking" (deliberate unreadability)
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                ❌ Too readable
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                ✅ Ideal for design-only reviews
              </td>
            </tr>
          </tbody>
        </table>
        <p>
          <strong>Short answer:</strong> use random English text for mockups
          clients will see, and Lorem Ipsum for pure typography or design
          reviews where you don't want reviewers reading the words.
        </p>

        <h2>How to Use the Random Text Generator</h2>
        <ol className="custom-list">
          <li>
            <strong>Pick a preset</strong> (50, 100, 200, 500, 1,000 words) or
            type a custom word count.
          </li>
          <li>
            Click <strong>Generate</strong> — the tool creates the text
            instantly.
          </li>
          <li>
            Check the <strong>live stats</strong> above the output for words,
            characters, and sentence count.
          </li>
          <li>
            Hit <strong>Copy</strong> to send the text straight to your
            clipboard.
          </li>
          <li>
            Paste it into Figma, VS Code, your CMS, an email template — wherever
            you need it.
          </li>
        </ol>
        <p>
          Need to regenerate? Just click Generate again — you'll get a different
          arrangement of the sentence pool each time.
        </p>

        <h2>Who Uses This Random Text Generator?</h2>
        <ul className="custom-list">
          <li>
            <strong>Web developers</strong> — test responsive layouts, line
            heights, and component overflow with realistic English.
          </li>
          <li>
            <strong>UI/UX designers</strong> — fill Figma and Adobe XD mockups
            with content that looks real to clients.
          </li>
          <li>
            <strong>Frontend teams</strong> — populate Storybook and component
            library examples.
          </li>
          <li>
            <strong>QA engineers</strong> — stress-test text fields, character
            limits, and form validation.
          </li>
          <li>
            <strong>CMS developers</strong> — pre-fill blog templates and
            content types during theme development.
          </li>
          <li>
            <strong>Content strategists</strong> — plan word counts and visual
            hierarchy before writing final copy.
          </li>
          <li>
            <strong>SEO specialists</strong> — simulate content density and
            heading structure during template design.
          </li>
          <li>
            <strong>Print designers</strong> — flow realistic text into
            brochures, flyers, and magazine layouts.
          </li>
          <li>
            <strong>Students &amp; educators</strong> — generate practice text
            for typography and document-layout assignments.
          </li>
        </ul>

        <h2>Common Use Cases for Placeholder Text</h2>
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
                Use Case
              </th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                Suggested Word Count
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Button label / short chip
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                1–3 words
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Card title
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                3–8 words
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Meta description mock
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                25–30 words (~160 chars)
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Blog intro paragraph
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                50–100 words
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Body section
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                200–300 words
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Full blog post mock
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                800–1,500 words
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Product description
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                100–200 words
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Email template body
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                100–250 words
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Testimonial block
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                30–60 words
              </td>
            </tr>
          </tbody>
        </table>

        <h2>Random English Words &amp; Phrase Generation</h2>
        <p>
          Need something shorter than full sentences? This tool doubles as a{" "}
          <strong>random English words generator</strong> and{" "}
          <strong>random phrase generator</strong>:
        </p>
        <ul className="custom-list">
          <li>
            <strong>Random single word</strong> — set word count to 1, hit
            Generate. Regenerate for a new word.
          </li>
          <li>
            <strong>Random word list</strong> — set 10 or 20 words for a quick
            word bank.
          </li>
          <li>
            <strong>Random phrase</strong> — 3–8 words gives you phrase-length
            output ideal for headline testing, tagline drafts, or design
            captions.
          </li>
          <li>
            <strong>Random sentence</strong> — 10–20 words returns a single
            natural sentence.
          </li>
        </ul>

        <h2>Random Text vs Random String vs Random Letter Generator</h2>
        <p>
          These sound similar but do very different jobs. Here's what each one
          is actually for:
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
                Tool Type
              </th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                Output Example
              </th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                Use Case
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                <strong>Random text generator</strong> (this tool)
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                "Modern web design improves user experience…"
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                UI mockups, content prototyping, CMS templates
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                <strong>Random word generator</strong>
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                "design, layout, content, users"
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Word banks, writing prompts, brainstorming
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                <strong>Random phrase generator</strong>
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                "clean layout structure"
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Headline tests, tagline drafts, caption ideas
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                <strong>Random letter generator</strong>
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                "K, F, Q, M"
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Games, quizzes, ID initials
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                <strong>Random string generator</strong>
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                "a8x3F9kL2m"
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                Passwords, API keys, unique IDs (not for reading)
              </td>
            </tr>
          </tbody>
        </table>
        <p>
          This tool covers the first three cases well. For random letters or
          random cryptographic strings (like passwords), use a dedicated
          password or ID generator — those need proper entropy, which isn't what
          a placeholder text tool provides.
        </p>

        <h2>Features of This Random Text Generator</h2>
        <ul className="custom-list">
          <li>
            ✅ <strong>Exact word count</strong> — precise to the word, no
            padding
          </li>
          <li>
            ✅ <strong>One-click presets</strong> for 50, 100, 200, 500, and
            1,000 words
          </li>
          <li>
            ✅ <strong>Live word, character, and sentence stats</strong>
          </li>
          <li>
            ✅ <strong>Real English</strong> — readable, natural-sounding
            sentences
          </li>
          <li>
            ✅ <strong>One-click copy</strong> to clipboard
          </li>
          <li>
            ✅ <strong>Instant generation</strong> — thousands of words in
            milliseconds
          </li>
          <li>
            ✅ <strong>No signup, no login, no ads on the tool</strong>
          </li>
          <li>
            ✅ <strong>Mobile-friendly</strong> — works on phone, tablet,
            laptop, desktop
          </li>
          <li>
            ✅ <strong>Privacy-first</strong> — nothing is stored or tracked
          </li>
          <li>
            ✅ <strong>Free for commercial use</strong> — client mockups,
            prototypes, print layouts
          </li>
        </ul>

        <h2>Related Tools You Might Need</h2>
        <p>
          Once your placeholder text is in place, you might need to format or
          transform it:
        </p>
        <ul className="custom-list">
          <li>
            Use our{" "}
            <Link href="/text-converter/" className="my-link">
              <span>text case converter</span>
            </Link>{" "}
            to convert your placeholder text to UPPERCASE, camelCase,
            snake_case, or Title Case.
          </li>
          <li>
            Use our{" "}
            <Link href="/percentage-calculator/" className="my-link">
              <span>percentage calculator</span>
            </Link>{" "}
            to work out text length ratios when planning content blocks.
          </li>
        </ul>

        <h2>Frequently Asked Questions</h2>

        {faqs.map(([q, a], i) => (
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

        <h2>Start Generating Now</h2>
        <p>
          Scroll back to the top, pick a preset or type your custom word count,
          and hit Generate. Copy the result and paste it into your Figma mockup,
          CMS template, code editor, or print layout — whatever you're building.
          Your placeholder problem is solved in three clicks.
        </p>
      </div>
    </>
  );
}
