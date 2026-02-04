"use client";
import { useState } from "react";

export default function TextConverter() {
  const [inputText, setInputText] = useState("");
  const [convertedText, setConvertedText] = useState("");
  const [conversionType, setConversionType] = useState<"uppercase" | "lowercase" | "capitalize">(
    "uppercase"
  );

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
        result = inputText.replace(/\b\w/g, (char) => char.toUpperCase());
        break;
    }
    setConvertedText(result);
  };

  const handleClear = () => {
    setInputText("");
    setConvertedText("");
    setConversionType("uppercase");
  };

  return (
    <div className="single-page-padding">
    <div className="calc-card">
      <h2 className="calc-title">Text Converter</h2>

      <textarea
        className="calc-input"
        placeholder="Paste your text here..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        style={{ minHeight: "100px", resize: "vertical" }}
      />

      {/* Radio Options */}
      <div style={{ margin: "15px 0" }}>
        <label style={{ display: "block", marginBottom: "8px" }}>
          <input
            type="radio"
            name="conversion"
            value="uppercase"
            checked={conversionType === "uppercase"}
            onChange={() => setConversionType("uppercase")}
          />{" "}
          Uppercase
        </label>
        <label style={{ display: "block", marginBottom: "8px" }}>
          <input
            type="radio"
            name="conversion"
            value="lowercase"
            checked={conversionType === "lowercase"}
            onChange={() => setConversionType("lowercase")}
          />{" "}
          Lowercase
        </label>
        <label style={{ display: "block", marginBottom: "8px" }}>
          <input
            type="radio"
            name="conversion"
            value="capitalize"
            checked={conversionType === "capitalize"}
            onChange={() => setConversionType("capitalize")}
          />{" "}
          Capitalize
        </label>
      </div>

      {/* Buttons: Convert & Clear */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <button className="calc-button" onClick={handleConvert}>
          Convert
        </button>
        <button className="calc-button calc-clear" onClick={handleClear}>
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
            maxHeight: "300px",
            overflowY: "auto",
          }}
        >
          {convertedText}
        </div>
      )}
    </div>
    </div>
  );
}
