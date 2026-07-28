"use client";

import { useState } from "react";
import Link from "next/link";
import { calculators } from "../data/calculators";

export default function CalculatorSearch() {
  const [query, setQuery] = useState("");

  const filtered = calculators.filter((calc) =>
    calc.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="search-wrapper">
      <div className="search-input-box">
        {/* <span className="search-icon">🔍</span> */}

        <input
          type="text"
          placeholder="Search calculators..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />
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
