"use client";
import { useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";

const LOREM_WORDS = [
  "lorem",
  "ipsum",
  "dolor",
  "sit",
  "amet",
  "consectetur",
  "adipiscing",
  "elit",
  "sed",
  "do",
  "eiusmod",
  "tempor",
  "incididunt",
  "ut",
  "labore",
  "dolore",
  "magna",
  "aliqua",
  "enim",
  "ad",
  "minim",
  "veniam",
  "quis",
  "nostrud",
  "exercitation",
  "ullamco",
  "laboris",
  "nisi",
  "aliquip",
  "ex",
  "ea",
  "commodo",
  "consequat",
  "duis",
  "aute",
  "irure",
  "reprehenderit",
  "voluptate",
  "velit",
  "esse",
  "cillum",
  "eu",
  "fugiat",
  "nulla",
  "pariatur",
  "excepteur",
  "sint",
  "occaecat",
  "cupidatat",
  "non",
  "proident",
  "sunt",
  "culpa",
  "qui",
  "officia",
  "deserunt",
  "mollit",
  "anim",
  "est",
  "laborum",
  "perspiciatis",
  "unde",
  "omnis",
  "iste",
  "natus",
  "error",
  "voluptatem",
  "accusantium",
  "doloremque",
  "laudantium",
  "totam",
  "rem",
  "aperiam",
  "eaque",
  "ipsa",
  "quae",
  "ab",
  "illo",
  "inventore",
  "veritatis",
];

const PRESETS = [50, 100, 200, 500, 1000];

export default function LoremGenerator() {
  const [wordCount, setWordCount] = useState("");
  const [generatedText, setGeneratedText] = useState("");
  const [copied, setCopied] = useState(false);
  const [activePreset, setActivePreset] = useState<number | null>(null);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const getLoremWords = (count: number): string => {
    const result: string[] = [];
    for (let i = 0; i < count; i++) {
      result.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
    }
    // Always start with "Lorem ipsum" for authenticity
    if (count >= 2) {
      result[0] = "Lorem";
      result[1] = "ipsum";
    }
    return result.join(" ");
  };

  const generateText = (count?: number) => {
    const n = count ?? Number(wordCount);
    if (!n || n <= 0) return;
    setGeneratedText(getLoremWords(n));
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

  return (
    <div className="single-page-padding">
      <div>
        <h1>Lorem Ipsum Generator</h1>
        <p>
          Generate classic Lorem Ipsum placeholder text instantly for web
          design, UI/UX mockups, and development testing.
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
        />

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
            <i className="fa-solid fa-paragraph"></i>
            Pick a preset or enter a custom count, then hit Generate
          </div>
        )}
      </div>

      {/* ===== SEO CONTENT ===== */}

      <h2>What Is Lorem Ipsum?</h2>
      <p>
        <strong>Lorem Ipsum</strong> is the most widely used placeholder text in
        the world of design, publishing, and web development. It is a form of
        dummy text that allows designers and developers to fill layout spaces
        with readable content — without the distraction of meaningful language.
        Instead of leaving blank white space or repeating "content here"
        endlessly, Lorem Ipsum provides a visually balanced block of text that
        closely mimics the appearance of real written content.
      </p>
      <p>
        The origins of Lorem Ipsum date back to classical Latin literature. It
        is derived from <em>De Finibus Bonorum et Malorum</em>, a philosophical
        work by Cicero written in 45 BC. The scrambled version we use today has
        been the industry standard since the 1500s, when an unknown printer took
        a galley of type and scrambled it to make a type specimen book. It has
        survived not only five centuries but also the leap into digital
        typesetting and modern web design.
      </p>

      <h2>Why Do Designers and Developers Use Lorem Ipsum?</h2>
      <p>
        There's a very good reason Lorem Ipsum has remained relevant for over
        500 years — it works. When you're designing a webpage, building a UI
        component, or laying out a printed brochure, the last thing you want is
        for real content to distract reviewers from evaluating the visual
        structure. Lorem Ipsum keeps the focus on design, not words.
      </p>
      <ul className="custom-list">
        <li>
          <strong>Realistic visual representation</strong> — It produces
          natural-looking blocks of text that simulate how actual content will
          flow in your layout.
        </li>
        <li>
          <strong>UI/UX design mockups</strong> — Designers use it in Figma,
          Adobe XD, Sketch, and other tools to prototype interfaces before
          content is finalized.
        </li>
        <li>
          <strong>Layout spacing and alignment testing</strong> — Ensures that
          columns, margins, padding, and typography scale correctly before real
          copy is inserted.
        </li>
        <li>
          <strong>Client presentations</strong> — Prevents clients from focusing
          on placeholder words instead of reviewing the actual design concept.
        </li>
        <li>
          <strong>Development and QA testing</strong> — Developers use it to
          populate database fields, test CMS templates, and validate component
          rendering.
        </li>
        <li>
          <strong>Print and publishing</strong> — Magazine editors, book
          designers, and brochure creators use Lorem Ipsum to plan page layouts
          before final copy arrives.
        </li>
        <li>
          <strong>Industry standard</strong> — Universally recognized across
          design and development tools, making collaboration seamless.
        </li>
      </ul>

      <h2>Key Features of Our Lorem Ipsum Generator</h2>
      <ul className="custom-list">
        <li>
          <strong>Exact Word Count Control</strong> — Generate precisely the
          number of words you need, from a single sentence to thousands of
          words.
        </li>
        <li>
          <strong>Quick Presets</strong> — One-click buttons for 50, 100, 200,
          500, and 1,000 words — no typing required.
        </li>
        <li>
          <strong>Live Stats</strong> — See word count and character count
          update instantly with every generation.
        </li>
        <li>
          <strong>Classic Lorem Ipsum Structure</strong> — Always begins with
          "Lorem ipsum" for the authentic, industry-standard format recognized
          across all design tools.
        </li>
        <li>
          <strong>Lightning Fast Generation</strong> — Produces your placeholder
          text instantly with zero loading time or delay.
        </li>
        <li>
          <strong>One-Click Copy</strong> — Copy all generated text to your
          clipboard with a single button, ready to paste anywhere.
        </li>
        <li>
          <strong>Fully Responsive Design</strong> — Works perfectly on desktop,
          tablet, and mobile browsers with no app download required.
        </li>
        <li>
          <strong>No Registration Needed</strong> — Completely free to use
          without creating an account or entering any personal information.
        </li>
        <li>
          <strong>Privacy Safe</strong> — No text or usage data is stored.
          Everything runs locally in your browser session.
        </li>
      </ul>

      <h2>Who Should Use a Lorem Ipsum Generator?</h2>
      <p>
        Our <strong>free Lorem Ipsum generator</strong> is built for anyone who
        works with content, design, or code. Here's who benefits most:
      </p>
      <ul className="custom-list">
        <li>
          <strong>Web Designers</strong> — Fill page templates and design
          systems with realistic placeholder text during the prototyping phase.
        </li>
        <li>
          <strong>Frontend Developers</strong> — Test HTML/CSS layouts,
          responsive grids, and typography with properly sized dummy content.
        </li>
        <li>
          <strong>Graphic Designers</strong> — Use in print projects like
          brochures, posters, business cards, and magazines to simulate
          real-world text placement.
        </li>
        <li>
          <strong>Content Strategists</strong> — Plan content structure, word
          count targets, and layout hierarchy before the writing begins.
        </li>
        <li>
          <strong>WordPress &amp; CMS Developers</strong> — Populate themes,
          page builders, and templates with dummy text to test visual rendering.
        </li>
        <li>
          <strong>Students &amp; Educators</strong> — Use for typography
          assignments, design exercises, and layout practice projects.
        </li>
        <li>
          <strong>Email Marketers</strong> — Fill email templates with
          placeholder text before final copy is ready for campaign deployment.
        </li>
      </ul>

      <h2>How to Use the Lorem Ipsum Generator</h2>
      <p>
        Generating placeholder text with our tool takes just seconds. Here's
        how:
      </p>
      <ul className="custom-list">
        <li>
          <strong>Step 1:</strong> Click a preset button (50, 100, 200, 500, or
          1,000 words) for instant generation — or type any custom number into
          the input field.
        </li>
        <li>
          <strong>Step 2:</strong> Click the <em>"Generate"</em> button to
          instantly produce your Lorem Ipsum text.
        </li>
        <li>
          <strong>Step 3:</strong> Click <em>"Copy"</em> in the toolbar to copy
          the text and paste it into your design tool, code editor, or document.
        </li>
      </ul>
      <p>
        No settings to configure. No account to create. Just instant, reliable
        Lorem Ipsum placeholder text whenever you need it.
      </p>

      <h2>
        Lorem Ipsum Generator vs. Random Text Generator: Which Should You Use?
      </h2>
      <p>
        Both tools serve the same core purpose — filling space with placeholder
        text — but they suit different use cases:
      </p>
      <ul className="custom-list">
        <li>
          <strong>Lorem Ipsum Generator</strong> — Best for design mockups,
          client presentations, and professional prototyping where the classic
          dummy text format is expected and recognized.
        </li>
        <li>
          <strong>Random English Text Generator</strong> — Better for SEO layout
          testing, stakeholder reviews, and situations where clients or team
          members need to read and understand the placeholder content.
        </li>
        <li>
          <strong>Use Lorem Ipsum when</strong> — You want reviewers to focus on
          visual design rather than text meaning.
        </li>
        <li>
          <strong>Use Random English Text when</strong> — You need placeholder
          content that feels natural and readable to non-technical audiences.
        </li>
      </ul>

      <h2>Frequently Asked Questions</h2>

      <div className="faq-item">
        <h3 onClick={() => toggleFAQ(0)}>
          What is Lorem Ipsum used for?
          <i
            className={`fa-solid fa-chevron-down ${openFAQ === 0 ? "rotate" : ""}`}
          ></i>
        </h3>
        {openFAQ === 0 && (
          <p>
            Lorem Ipsum is used as standard placeholder text in web design,
            UI/UX prototyping, graphic design, publishing, and software
            development. It allows teams to visualize layouts and design systems
            before real content is written or approved.
          </p>
        )}
      </div>

      <div className="faq-item">
        <h3 onClick={() => toggleFAQ(1)}>
          Is Lorem Ipsum a real language?
          <i
            className={`fa-solid fa-chevron-down ${openFAQ === 1 ? "rotate" : ""}`}
          ></i>
        </h3>
        {openFAQ === 1 && (
          <p>
            No. Lorem Ipsum is pseudo-Latin text derived from Cicero's classical
            Latin work <em>De Finibus Bonorum et Malorum</em>. The words have
            been scrambled and altered so they no longer carry meaningful Latin
            meaning — making them perfect as neutral placeholder text that
            doesn't distract readers.
          </p>
        )}
      </div>

      <div className="faq-item">
        <h3 onClick={() => toggleFAQ(2)}>
          Is this Lorem Ipsum generator completely free?
          <i
            className={`fa-solid fa-chevron-down ${openFAQ === 2 ? "rotate" : ""}`}
          ></i>
        </h3>
        {openFAQ === 2 && (
          <p>
            Yes, it is 100% free with no limitations. No account registration,
            no subscription, and no download required. Simply open the tool,
            enter your desired word count, and generate Lorem Ipsum text
            instantly.
          </p>
        )}
      </div>

      <div className="faq-item">
        <h3 onClick={() => toggleFAQ(3)}>
          How much Lorem Ipsum text can I generate at once?
          <i
            className={`fa-solid fa-chevron-down ${openFAQ === 3 ? "rotate" : ""}`}
          ></i>
        </h3>
        {openFAQ === 3 && (
          <p>
            Our generator can produce large volumes of Lorem Ipsum text in a
            single request. Whether you need 10 words for a button label or
            10,000 words for a full-page layout, the tool handles it instantly
            without performance issues.
          </p>
        )}
      </div>

      <div className="faq-item">
        <h3 onClick={() => toggleFAQ(4)}>
          Where did Lorem Ipsum originally come from?
          <i
            className={`fa-solid fa-chevron-down ${openFAQ === 4 ? "rotate" : ""}`}
          ></i>
        </h3>
        {openFAQ === 4 && (
          <p>
            Lorem Ipsum originates from Cicero's philosophical text written in
            45 BC. The version used today was popularized in the 1500s by a
            printer who scrambled the original Latin passages to create a
            neutral type specimen. It became the global standard for placeholder
            text and has been used ever since in print, design, and digital
            media.
          </p>
        )}
      </div>

      <div className="faq-item">
        <h3 onClick={() => toggleFAQ(5)}>
          Does Lorem Ipsum affect SEO?
          <i
            className={`fa-solid fa-chevron-down ${openFAQ === 5 ? "rotate" : ""}`}
          ></i>
        </h3>
        {openFAQ === 5 && (
          <p>
            Lorem Ipsum should never be published on a live website. Search
            engines like Google can detect and penalize pages with low-quality
            or nonsensical content. It is strictly a development and design tool
            — always replace it with real content before publishing any page
            publicly.
          </p>
        )}
      </div>

      <div className="faq-item">
        <h3 onClick={() => toggleFAQ(6)}>
          Can I use Lorem Ipsum in commercial design projects?
          <i
            className={`fa-solid fa-chevron-down ${openFAQ === 6 ? "rotate" : ""}`}
          ></i>
        </h3>
        {openFAQ === 6 && (
          <p>
            Yes. Lorem Ipsum text is in the public domain and free to use in any
            personal, academic, or commercial project including client mockups,
            agency presentations, product prototypes, and print design work.
          </p>
        )}
      </div>

      <div className="faq-item">
        <h3 onClick={() => toggleFAQ(7)}>
          Does the tool work on mobile and tablet devices?
          <i
            className={`fa-solid fa-chevron-down ${openFAQ === 7 ? "rotate" : ""}`}
          ></i>
        </h3>
        {openFAQ === 7 && (
          <p>
            Yes. The Lorem Ipsum generator is fully responsive and works on all
            modern devices including iPhones, Android phones, iPads, and desktop
            browsers. No installation or app download is needed.
          </p>
        )}
      </div>

      <div className="faq-item">
        <h3 onClick={() => toggleFAQ(8)}>
          Is my data safe when using this tool?
          <i
            className={`fa-solid fa-chevron-down ${openFAQ === 8 ? "rotate" : ""}`}
          ></i>
        </h3>
        {openFAQ === 8 && (
          <p>
            Absolutely. Our Lorem Ipsum generator does not collect, store, or
            share any user data. No input is logged and no cookies are used to
            track your activity. Your usage remains completely private and
            anonymous.
          </p>
        )}
      </div>

      <div className="faq-item">
        <h3 onClick={() => toggleFAQ(9)}>
          What is the standard Lorem Ipsum paragraph?
          <i
            className={`fa-solid fa-chevron-down ${openFAQ === 9 ? "rotate" : ""}`}
          ></i>
        </h3>
        {openFAQ === 9 && (
          <p>
            The standard Lorem Ipsum paragraph begins with "Lorem ipsum dolor
            sit amet, consectetur adipiscing elit..." and has been used as the
            default placeholder text across the design industry for centuries.
            Our tool generates this classic structure while allowing you to
            control the exact word count you need.
          </p>
        )}
      </div>
    </div>
  );
}
