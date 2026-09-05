"use client";
import { useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Link from "next/link";

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

const FAQ_DATA: [string, string][] = [
  [
    "Why use fake Latin instead of real text in a mockup?",
    "Because real sentences get read. Put actual copy into a design review and people start debating the wording, questioning claims and fixing typos instead of looking at the layout. Text that has the shape of language without any meaning lets the eye register rhythm, line length and density while keeping the conversation about the design.",
  ],
  [
    "Where does lorem ipsum come from?",
    "From a first-century BC Latin philosophical text, scrambled at some point into near-Latin that no longer parses as language. The familiar opening is a fragment cut out of a longer sentence, which is why it starts in the middle of a word rather than at the beginning of one.",
  ],
  [
    "What does lorem ipsum fail to show me?",
    "Whether your actual copy is any good, how the layout handles a very short or empty entry, what happens when a real headline runs long, and how accented or non-Latin characters render. Those are exactly the cases that break designs after approval, so generate long and short versions deliberately rather than relying on a single tidy paragraph.",
  ],
  [
    "Should I design with placeholder text or real content?",
    "Placeholder early, real content before anything is signed off. Content and layout constrain each other, and a design built around three neat lines of Latin makes a promise about the copy that nobody agreed to. Switching to draft content while both sides can still move avoids the choice between breaking the design and cutting the writing to fit.",
  ],
  [
    "How much placeholder text should I generate?",
    "At least three versions: the length you expect, the longest a user could plausibly enter, and a one-word or empty case. Vary the length between repeated items too — a grid where every card holds identical text looks immaculate and never occurs in practice, while real content is ragged.",
  ],
  [
    "Is lorem ipsum better than random English words?",
    "For design review, usually yes, because recognisable language pulls attention toward meaning and pseudo-Latin does not. English placeholder text is better when you want a mockup to feel realistic to a client, or when you are testing how a specific language renders. The choice is about whether you want the words noticed or ignored.",
  ],
  [
    "How do I stop placeholder text reaching a live page?",
    "Search your project for a distinctive word from the passage before shipping — the standard opening words appear nowhere in real writing. Being obviously Latin is an advantage here: a stray paragraph is immediately visible to anyone who sees it, which realistic-looking English filler is not.",
  ],
  [
    "Can I publish lorem ipsum on a website?",
    "No. It carries no meaning, so a page built from it informs nobody, and search engines are specifically built to identify content of that kind. Placeholder text belongs to the period before real content exists, and replacing it is always the last step rather than an optional one.",
  ],
  [
    "Does lorem ipsum work for testing input fields?",
    "Poorly. It is deliberately plausible and well-behaved, which is the opposite of what breaks software. Testing an input wants empty strings, values one character over the limit, apostrophes, emoji and unbroken long words. Use a generator aimed at test data rather than at page layout.",
  ],
];

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

      <h2>Why Designers Use Fake Latin Instead of Real Words</h2>
      <p>
        Lorem ipsum is deliberately unreadable, and that is the whole point.
        Put real sentences into a mockup and everyone in the room starts
        reading them — debating the wording, questioning a claim, correcting a
        typo — instead of looking at the thing you asked them to look at.
      </p>
      <p>
        Meaningless text that still has the shape of language lets the eye
        register rhythm, line length and density without engaging with meaning.
        It keeps a design review about the design.
      </p>
      <p>
        The passage itself comes from a first-century BC Latin philosophical
        text, scrambled at some point into near-Latin that no longer parses.
        The familiar opening is a fragment of a longer sentence, cut
        mid-word — which is why it begins in the middle of a word rather than
        at the start of one.
      </p>

      <h2>What It Is Good At, and What It Hides</h2>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Shows you</th>
              <th>Hides from you</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Line length and how comfortably text reads</td>
              <td>Whether the actual copy is any good</td>
            </tr>
            <tr>
              <td>Spacing, rhythm and vertical density</td>
              <td>Whether headings are the right length</td>
            </tr>
            <tr>
              <td>How a typeface behaves at a given size</td>
              <td>How the layout handles a very short entry</td>
            </tr>
            <tr>
              <td>Overall page balance and hierarchy</td>
              <td>Accented characters and non-Latin scripts</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        The right column is where designs fail after approval. A layout signed
        off with neat Latin paragraphs meets a real headline that runs to four
        lines, a product name with an umlaut, or a description field somebody
        left almost empty — and none of those appeared in the mockup.
      </p>

      <h2>The Case Against Using It Too Long</h2>
      <p>
        The argument against placeholder text is not that it is unrealistic
        but that it lets a design avoid the hardest question for too long.
      </p>
      <p>
        Content and layout constrain each other. A design built around three
        tidy lines of Latin is making a promise about the copy that nobody has
        agreed to, and when real text arrives the design either breaks or the
        writing gets cut to fit a box that was never built for it. Designing
        with real content, even rough draft content, surfaces that negotiation
        while both sides can still move.
      </p>
      <p>
        The practical compromise most teams settle on is to use placeholder
        text early, when the question is structural, and switch to real or
        draft copy before anything is signed off. Lorem ipsum is a tool for the
        first half of a project.
      </p>

      <h2>Generate the Awkward Cases Too</h2>
      <p>
        Whatever text you use, generate it at more than one length. Three
        versions catch most layout failures:
      </p>
      <ul className="custom-list">
        <li>
          <strong>The expected length</strong>, matching what you think the
          real content will be.
        </li>
        <li>
          <strong>The long case</strong>, at the maximum a user could plausibly
          enter, to see what overflows.
        </li>
        <li>
          <strong>The short case</strong> — one word, or nothing at all. An
          empty state looks just as wrong as an overflow and is tested far less
          often.
        </li>
      </ul>
      <p>
        Vary the length between repeated items as well. A grid where every
        card holds identical text looks immaculate and never occurs in
        practice; real content is ragged, and the ragged version is the one
        worth reviewing.
      </p>

      <h2>Getting It Out Before Launch</h2>
      <p>
        Placeholder text reaching a live page is common enough to be a
        recognised category of mistake, and it is entirely preventable.
      </p>
      <p>
        Search your project for a distinctive word from the generated text
        before shipping — the opening words of the standard passage are
        unmistakable and appear nowhere in real writing. Because it is Latin
        rather than plausible English, a stray paragraph is obvious to anyone
        who sees it, which is a genuine advantage over realistic-looking
        filler.
      </p>
      <p>
        One thing it should never be used for: publishing. Placeholder text
        carries no meaning, so a page built from it informs nobody, and search
        engines are specifically designed to identify content of that kind.
      </p>
      <p>
        For English placeholder words rather than pseudo-Latin, the{" "}
        <Link href="/text-generator/" className="my-link">
          random text generator
        </Link>{" "}
        produces text by exact word count, and the{" "}
        <Link href="/word-char-counter/" className="my-link">
          word and character counter
        </Link>{" "}
        measures whatever you generate against a limit.
      </p>
      <h2>Placeholder Text Questions</h2>

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
