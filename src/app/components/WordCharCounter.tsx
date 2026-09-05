"use client";
import { useState } from "react";
import Link from "next/link";

const FAQ_DATA: [string, string][] = [
  [
    "Why do two tools give different word counts for the same text?",
    "Because there is no single definition of a word. Tools differ on whether hyphens split compounds, whether apostrophes split contractions, whether a decimal point separates numbers, and whether standalone punctuation counts. This counter splits on whitespace, so state-of-the-art is one word. If an exact count matters, use the tool that will judge it and treat every other figure as an estimate.",
  ],
  [
    "Should I count characters with or without spaces?",
    "It depends who is asking. Social platforms and SMS count spaces because every character occupies transmission space. Translation and copywriting are often priced per character excluding spaces, since spaces are not work. Database and form limits count everything. The gap is not trivial — 1,000 characters with spaces is roughly 830 without.",
  ],
  [
    "Why does a field reject my text when it looks short enough?",
    "Almost always because the limit counts storage units rather than visible characters. An emoji can occupy several units while appearing as one symbol, so a handful can exhaust a 20-character field that looks nearly empty. Accented letters and non-Latin scripts can also take more than one unit each. Removing emoji usually brings it back under.",
  ],
  [
    "Why does deleting an emoji sometimes leave part of it behind?",
    "Because some emoji are built from several joined components — a base symbol plus modifiers for skin tone or gender, connected by invisible joining characters. Deleting one unit can remove a component while leaving the rest, which renders as a fragment. It is the same underlying reason those emoji count as several characters.",
  ],
  [
    "How accurate is the estimated reading time?",
    "It is an assumption rather than a measurement — word count divided by an assumed speed, typically somewhere between 200 and 250 words a minute for ordinary prose. That band is wide enough that the same article can honestly be called a five or a seven minute read. It also ignores technical vocabulary, code samples, images and whether the reader is skimming.",
  ],
  [
    "How long should a script be for a ten-minute talk?",
    "Considerably shorter than a ten-minute read. Speaking runs closer to 130 to 150 words per minute against 200 to 250 for silent reading, so a ten-minute presentation needs roughly 1,300 to 1,500 words rather than well over 2,000. Timing a read-through aloud is more reliable than any word-count estimate.",
  ],
  [
    "What is the best way to cut text down to a word limit?",
    "In order: remove qualifiers such as very, quite and really; replace phrases with single words, so in order to becomes to; then cut whole sentences rather than shaving words from every sentence, since removing one paragraph usually reads better than trimming ten percent off all of them. Leave the opening and closing until last, as they carry disproportionate weight.",
  ],
  [
    "Does changing capitalisation change the character count?",
    "No. Case conversion never alters how many characters there are, even though capital letters occupy more visual width and can make a line look longer. If a design overflows after converting to upper case, that is a layout width issue rather than a character count one.",
  ],
  [
    "Is my text stored or sent anywhere?",
    "No. Counting happens in your browser as you type, so nothing is uploaded and nothing is retained. That matters for drafts, client work, and anything under confidentiality that you would not want to paste into a hosted service.",
  ],
];

export default function WordCharCounter() {
  const [text, setText] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  const handleCount = () => {
    const trimmed = text.trim();

    const words = trimmed.length > 0 ? trimmed.split(/\s+/).length : 0;
    const chars = trimmed.length;

    setWordCount(words);
    setCharCount(chars);
  };

  const handleClear = () => {
    setText("");
    setWordCount(0);
    setCharCount(0);
  };
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
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
        <h1>Word & Character Counter</h1>

        <p>Count Words, Characters, Sentences & Paragraphs.</p>
        <div>
          <div className="calc-card">
              <textarea
                className="calc-input"
                placeholder="Type or paste your text here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                style={{ minHeight: "120px", resize: "vertical" }}
              />

              {/* Buttons */}
              <div
                style={{ display: "flex", gap: "10px", marginBottom: "10px" }}
              >
                <button className="calc-button" onClick={handleCount}>
                  Count
                </button>

                <button
                  className="calc-button calc-clear"
                  onClick={handleClear}
                >
                  Clear
                </button>
              </div>

              {/* Results */}
              {(wordCount > 0 || charCount > 0) && (
                <div className="calc-result" style={{ lineHeight: "1.8" }}>
                  <p>
                    <strong>Words:</strong> {wordCount}
                  </p>
                  <p>
                    <strong>Characters:</strong> {charCount}
                  </p>
                </div>
              )}
            </div>
          </div>
          <h2>What Counts as a Word?</h2>
          <p>
            Two tools can count the same text and disagree, and neither is
            broken. There is no single definition of a word, so every counter
            makes choices — and the choices show up most on exactly the text
            people care about counting.
          </p>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Text</th>
                  <th>Could count as</th>
                  <th>Why it varies</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>state-of-the-art</td>
                  <td>1 or 4</td>
                  <td>Whether hyphens split words</td>
                </tr>
                <tr>
                  <td>don&apos;t</td>
                  <td>1 or 2</td>
                  <td>Whether apostrophes split words</td>
                </tr>
                <tr>
                  <td>3.5</td>
                  <td>1 or 2</td>
                  <td>Whether the decimal point separates</td>
                </tr>
                <tr>
                  <td>—</td>
                  <td>0 or 1</td>
                  <td>Whether standalone punctuation counts</td>
                </tr>
                <tr>
                  <td>a URL</td>
                  <td>1 or many</td>
                  <td>Whether dots and slashes split</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            Most counters, including this one, split on whitespace, which treats
            hyphenated compounds and contractions as single words. That matches
            how people usually read, and it is why a document can come out a few
            percent shorter here than in a tool that splits more aggressively.
          </p>
          <p>
            The practical rule is that if a specific count matters — a
            submission limit, a contractual deliverable — count it in the tool
            that will be used to judge it, and treat every other figure as an
            estimate.
          </p>

          <h2>Characters With and Without Spaces</h2>
          <p>
            The two figures differ by roughly the word count, since most words
            are followed by one space. Which one applies depends entirely on who
            is asking.
          </p>
          <ul className="custom-list">
            <li>
              <strong>Social platforms and SMS</strong> count characters
              including spaces, because every character occupies transmission
              space.
            </li>
            <li>
              <strong>Translation and copywriting</strong> are frequently priced
              per character excluding spaces, since spaces are not work.
            </li>
            <li>
              <strong>Database fields and form limits</strong> count everything,
              including spaces and line breaks.
            </li>
          </ul>
          <p>
            The difference is not trivial. A 1,000-character piece with spaces is
            roughly 830 without, which changes an invoice noticeably.
          </p>

          <h2>Why Some Characters Count as More Than One</h2>
          <p>
            A character limit is often not counting what you see. Many systems
            count storage units rather than visible characters, and the two
            diverge outside plain English.
          </p>
          <p>
            An emoji can occupy several units while appearing as one symbol, so a
            few emoji can exhaust a 20-character field that looks nearly empty.
            Accented letters and non-Latin scripts can also take more than one
            unit each. Some emoji are built from several joined components, which
            is why deleting one sometimes leaves a fragment behind.
          </p>
          <p>
            If a field rejects text that appears to be within the limit, this is
            almost always why. Removing emoji is usually enough to bring it back
            under.
          </p>

          <h2>Reading Time Is an Assumption, Not a Measurement</h2>
          <p>
            Estimated reading time is word count divided by an assumed speed, and
            the assumption does most of the work. Typical figures sit somewhere
            around 200 to 250 words per minute for silent reading of ordinary
            prose, which is a wide enough band that the same article can honestly
            be labelled a five or a seven minute read.
          </p>
          <p>
            The estimate also ignores everything that changes actual reading
            speed: technical vocabulary, code samples that get studied rather
            than read, images and tables that interrupt the flow, and whether the
            reader is skimming. Speaking is slower still — a presentation script
            usually runs closer to 130 to 150 words per minute, which is why a
            ten-minute talk needs far fewer words than a ten-minute read.
          </p>
          <p>
            Treat the number as a rough signal of length rather than a promise
            about time.
          </p>

          <h2>Hitting a Limit Without Damaging the Writing</h2>
          <p>
            Cutting to a word count is a skill, and the order in which you cut
            matters.
          </p>
          <ul className="custom-list">
            <li>
              Remove qualifiers first — very, quite, really, somewhat. They
              almost always weaken the sentence they modify.
            </li>
            <li>
              Replace phrases with words: &quot;in order to&quot; becomes
              &quot;to&quot;, &quot;due to the fact that&quot; becomes
              &quot;because&quot;.
            </li>
            <li>
              Cut whole sentences before trimming words from every sentence.
              Removing one paragraph usually reads better than shaving ten
              percent off all of them.
            </li>
            <li>
              Leave the opening and closing alone until last. They carry
              disproportionate weight, and cutting them to save words is a poor
              trade.
            </li>
          </ul>
          <p>
            To normalise capitalisation across a piece before submitting it, the{" "}
            <Link href="/text-converter/" className="my-link">
              text case converter
            </Link>{" "}
            handles that, and the{" "}
            <Link href="/text-generator/" className="my-link">
              random text generator
            </Link>{" "}
            produces text at an exact word count if you need to test a limit.
          </p>
          <h2>Counting Questions</h2>

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
      </div>
  );
}
