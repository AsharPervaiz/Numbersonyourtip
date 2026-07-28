"use client";
import { useState } from "react";

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
    <>
      {/* ---- PAGE LAYOUT WRAPPER ---- */}
      <div className="page-layout single-page-padding">
        <div className="single-page-padding">
          <h1>Word & Character Counter</h1>

          <p>Count Words, Characters, Sentences & Paragraphs.</p>
          <div className="single-page-padding">
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
          <h2>What Is a Word & Character Counter?</h2>
          <p>
            A word and character counter is a tool that automatically counts the
            number of words, characters, sentences, and paragraphs in a piece of
            text. It helps you stay within limits for essays, descriptions,
            captions, and content guidelines without doing manual counting.
          </p>

          <h2>Why Word & Character Counting Matters</h2>
          <ul className="custom-list">
            <li>Ensures your text meets word or character requirements</li>
            <li>Helps writers stay within assignment and publishing limits</li>
            <li>
              Useful for SEO, social media posts, and ad copy restrictions
            </li>
            <li>Improves writing clarity with structured text analysis</li>
            <li>Saves time by eliminating manual counting</li>
          </ul>

          <h2>What This Tool Can Count</h2>

          <h3>1. Word Count</h3>
          <p>
            Counts the number of words in your text. Essential for essays,
            articles, SEO content, and assignments that require specific word
            limits.
          </p>

          <h3>2. Character Count</h3>
          <p>
            Counts characters with and without spaces. Useful for social media
            captions, ads, and tight formatting requirements.
          </p>

          <h3>3. Sentence Count</h3>
          <p>
            Helps analyze writing structure by identifying how many complete
            sentences are in the text.
          </p>

          <h3>4. Paragraph Count</h3>
          <p>
            Detects paragraph breaks to help organize long documents and content
            sections.
          </p>

          <h2>How the Counter Works</h2>
          <p>
            The tool analyzes your input in real time and breaks down the text
            into words, characters, sentences, and paragraphs using advanced
            detection rules. No matter how long your text is, the results update
            instantly as you type or paste content.
          </p>

          <h2>Benefits of Using Our Word & Character Counter</h2>
          <ul className="custom-list">
            <li>Instant and accurate text measurement</li>
            <li>Free to use with no sign-up needed</li>
            <li>Works on all devices including phones and tablets</li>
            <li>Ideal for students, writers, teachers, and professionals</li>
            <li>Helps optimize content for platforms with strict limits</li>
            <li>Perfect for editing articles, essays, emails, and messages</li>
          </ul>

          <h2>Examples of Word & Character Counter Uses</h2>
          <ul className="custom-list">
            <li>Checking essay or assignment word limits</li>
            <li>Optimizing SEO and blog content</li>
            <li>Writing social media captions within character limits</li>
            <li>Preparing ad copy for platforms like Google or Facebook</li>
            <li>Editing professional emails and documents</li>
            <li>Improving readability and writing structure</li>
          </ul>

          <h2>Frequently Asked Questions</h2>

          <div className="faq-item">
            <h3 onClick={() => toggleFAQ(0)}>
              Can I paste long text into the counter?
              <i
                className={`fa-solid fa-chevron-down ${openFAQ === 0 ? "rotate" : ""}`}
              ></i>
            </h3>
            {openFAQ === 0 && (
              <p>
                Yes. The counter supports both short and very long text inputs.
              </p>
            )}
          </div>

          <div className="faq-item">
            <h3 onClick={() => toggleFAQ(1)}>
              Are the counts accurate?
              <i
                className={`fa-solid fa-chevron-down ${openFAQ === 1 ? "rotate" : ""}`}
              ></i>
            </h3>
            {openFAQ === 1 && (
              <p>
                Absolutely. The tool uses reliable counting rules to deliver
                precise results.
              </p>
            )}
          </div>

          <div className="faq-item">
            <h3 onClick={() => toggleFAQ(2)}>
              Do I need to sign up?
              <i
                className={`fa-solid fa-chevron-down ${openFAQ === 2 ? "rotate" : ""}`}
              ></i>
            </h3>
            {openFAQ === 2 && (
              <p>No. The tool is free to use with no account required.</p>
            )}
          </div>

          <div className="faq-item">
            <h3 onClick={() => toggleFAQ(3)}>
              Can I use the tool on my phone?
              <i
                className={`fa-solid fa-chevron-down ${openFAQ === 3 ? "rotate" : ""}`}
              ></i>
            </h3>
            {openFAQ === 3 && (
              <p>
                Yes. It works seamlessly on all devices including mobile,
                tablet, and desktop.
              </p>
            )}
          </div>

          <div className="faq-item">
            <h3 onClick={() => toggleFAQ(4)}>
              What can I do with the results?
              <i
                className={`fa-solid fa-chevron-down ${openFAQ === 4 ? "rotate" : ""}`}
              ></i>
            </h3>
            {openFAQ === 4 && (
              <p>
                You can use the counts for assignments, social media, articles,
                documents, or any writing that requires accurate text
                measurement.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
