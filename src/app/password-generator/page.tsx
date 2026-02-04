"use client";
import { useState } from "react";

export default function PasswordGenerator() {
  const [length, setLength] = useState("");
  const [options, setOptions] = useState({
    upper: true,
    lower: false,
    numbers: false,
    symbols: false,
  });
  const [password, setPassword] = useState("");

  const handleOptionChange = (key: keyof typeof options) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const generatePassword = () => {
    const len = Number(length) || 0;
    if (len <= 0) return;

    let charset = "";
    if (options.upper) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (options.lower) charset += "abcdefghijklmnopqrstuvwxyz";
    if (options.numbers) charset += "0123456789";
    if (options.symbols) charset += "!@#$%^&*()_+~`|}{[]:;?><,./-=";

    if (!charset) return; // Nothing selected

    let pass = "";
    for (let i = 0; i < len; i++) {
      const randIndex = Math.floor(Math.random() * charset.length);
      pass += charset[randIndex];
    }

    setPassword(pass);
  };

  const handleClear = () => {
    setLength("");
    setOptions({ upper: true, lower: false, numbers: false, symbols: false });
    setPassword("");
  };

  return (
    <div className="single-page-padding">
    <div className="calc-card single-calc">
      <h2 className="calc-title">Password Generator</h2>

      <input
        className="calc-input"
        type="number"
        placeholder="Password Length"
        value={length}
        onChange={(e) => setLength(e.target.value)}
      />

      {/* Options as checkboxes */}
      <div style={{ margin: "10px 0" }}>
        {[
          { key: "upper", label: "Uppercase Letters" },
          { key: "lower", label: "Lowercase Letters" },
          { key: "numbers", label: "Numbers" },
          { key: "symbols", label: "Symbols" },
        ].map((opt) => (
          <label
            key={opt.key}
            style={{ display: "block", marginBottom: "8px", cursor: "pointer" }}
          >
            <input
              type="checkbox"
              checked={options[opt.key as keyof typeof options]}
              onChange={() => handleOptionChange(opt.key as keyof typeof options)}
              style={{ marginRight: "8px", accentColor: "#2563eb" }}
            />
            {opt.label}
          </label>
        ))}
      </div>

      {/* Buttons: Generate & Clear */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <button className="calc-button" onClick={generatePassword}>
          Generate
        </button>
        <button className="calc-button calc-clear" onClick={handleClear}>
          Clear
        </button>
      </div>

      {password && (
        <div className="calc-result">
          <p>Password: {password}</p>
        </div>
      )}
    </div>
    </div>
  );
}
