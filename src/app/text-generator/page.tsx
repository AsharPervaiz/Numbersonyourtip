"use client";
import { useState } from "react";

// Predefined Lorem Ipsum words
const LOREM_WORDS = `Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua`.split(
  " "
);

export default function TextGenerator() {
  const [wordCount, setWordCount] = useState("");
  const [generatedText, setGeneratedText] = useState("");

  const generateText = () => {
    const count = Number(wordCount) || 0;
    if (count <= 0) return;

    let result = [];
    // Repeat Lorem words as needed
    for (let i = 0; i < count; i++) {
      result.push(LOREM_WORDS[i % LOREM_WORDS.length]);
    }

    setGeneratedText(result.join(" "));
  };

  const handleClear = () => {
    setWordCount("");
    setGeneratedText("");
  };

  return (
    <div className="single-page-padding">
    <div className="calc-card">
      <h2 className="calc-title">Text Generator</h2>

      <input
        className="calc-input"
        type="number"
        placeholder="Number of Words"
        value={wordCount}
        onChange={(e) => setWordCount(e.target.value)}
      />

      {/* Buttons: Generate & Clear */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <button className="calc-button" onClick={generateText}>
          Generate
        </button>
        <button className="calc-button calc-clear" onClick={handleClear}>
          Clear
        </button>
      </div>

      {generatedText && (
        <div
          className="calc-result"
          style={{
            whiteSpace: "pre-wrap",
            wordWrap: "break-word",
            lineHeight: "1.6",
            maxHeight: "300px",
            overflowY: "auto",
          }}
        >
          {generatedText}
        </div>
      )}
    </div>
    </div>
  );
}
