"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { calculators } from "../data/calculators";
import "@fortawesome/fontawesome-free/css/all.min.css";

const TYPEWRITER_EXAMPLES = [
  "BMI Calculator",
  "EMI Calculator",
  "Currency Converter",
  "Age Calculator",
  "Percentage Calculator",
  "Days Between Dates",
];

export default function CalculatorSearch() {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [typed, setTyped] = useState("");
  const [exampleIndex, setExampleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // Match the name or any of the optional keywords, so a search for what a
  // tool does ("fraction", "wifi") finds it even when the word is not in
  // its title.
  const q = query.trim().toLowerCase();
  const filtered = calculators.filter((calc) => {
    if (!q) return true;
    if (calc.name.toLowerCase().includes(q)) return true;
    const kw = (calc as { keywords?: string[] }).keywords;
    return kw ? kw.some((k) => k.toLowerCase().includes(q)) : false;
  });

  /* Typewriter animation for the placeholder — only runs while the
     field is empty and unfocused, so it never fights the real value. */
  useEffect(() => {
    if (query || isFocused) return;

    const currentWord = TYPEWRITER_EXAMPLES[exampleIndex];
    const typingSpeed = isDeleting ? 35 : 80;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (typed.length < currentWord.length) {
          setTyped(currentWord.slice(0, typed.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 1400);
        }
      } else {
        if (typed.length > 0) {
          setTyped(typed.slice(0, -1));
        } else {
          setIsDeleting(false);
          setExampleIndex((i) => (i + 1) % TYPEWRITER_EXAMPLES.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [typed, isDeleting, exampleIndex, query, isFocused]);

  const showTypewriter = !query && !isFocused;

  return (
    <div className="search-wrapper">
      <div className="search-input-box">
        <i className="fa-solid fa-magnifying-glass search-icon" aria-hidden="true" />

        <div className="search-input-shell">
          <input
            type="text"
            placeholder={showTypewriter ? "" : "Search calculators..."}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="search-input"
            aria-label="Search calculators and tools"
          />
          {showTypewriter && (
            <span className="search-typewriter" aria-hidden="true">
              Search &quot;{typed}
              <span className="search-cursor">|</span>&quot;
            </span>
          )}
        </div>
      </div>

      {query && (
        <div className="search-dropdown">
          {filtered.length > 0 ? (
            filtered.map((calc, index) => (
              <Link key={index} href={calc.slug} className="search-item">
                {calc.name}
              </Link>
            ))
          ) : (
            <div className="no-result">No calculators found</div>
          )}
        </div>
      )}
    </div>
  );
}
