"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import "@fortawesome/fontawesome-free/css/all.min.css";
import {
  CATEGORIES,
  COUNT_BY_CATEGORY,
  FORMULAS,
  FORMULA_COUNT,
  type Category,
} from "../data/formulas";

export default function FormulaLibrary() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<Category | "All">("All");

  /* Search covers the name, the symbols, the explanation and a list of
     aliases, because people look for "pythagoras" and "npr" as readily as
     they look for the formal name.

     Matches are then ranked, which matters more than it sounds: "pythagoras"
     appears in the body of four cards, and without a score the theorem itself
     came fourth. A hit in the name beats a hit in an alias, which beats a hit
     in the prose. */
  const score = (f: (typeof FORMULAS)[number], q: string) => {
    const name = f.name.toLowerCase();
    if (name === q) return 100;
    if (name.startsWith(q)) return 90;
    if (name.includes(q)) return 80;
    if (f.keywords.some((k) => k.toLowerCase() === q)) return 70;
    if (f.keywords.some((k) => k.toLowerCase().includes(q))) return 60;
    if (f.expression.toLowerCase().includes(q)) return 50;
    if (f.category.toLowerCase().includes(q)) return 40;
    if (f.use.toLowerCase().includes(q)) return 20;
    if (f.variables.toLowerCase().includes(q)) return 10;
    return 0;
  };

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const inCategory = FORMULAS.filter(
      (f) => active === "All" || f.category === active,
    );
    if (!q) return inCategory;
    return inCategory
      .map((f) => ({ f, s: score(f, q) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .map((x) => x.f);
  }, [query, active]);

  const filtering = query.trim() !== "" || active !== "All";

  return (
    <div className="section-two">
      <div className="section-two-inner single-col">
        <section>
          <h1 className="more-tools">Maths Formula Library</h1>
          <p className="fl-lede">
            Every formula here is written out, its symbols named, and then put
            through a worked example with real numbers — because a formula you
            have never seen used is a picture rather than a tool. Search by
            name, by symbol or by what you are trying to do: try{" "}
            <em>quadratic</em>, <em>pythagoras</em>, <em>npr</em> or{" "}
            <em>reverse vat</em>. Where a calculator on this site does the same
            job, the card links to it.
          </p>

          {/* ── controls ─────────────────────────────────────────────── */}
          <div className="fl-controls">
            <div className="fl-search">
              <i className="fa-solid fa-magnifying-glass" aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") setQuery("");
                }}
                placeholder={`Search ${FORMULA_COUNT} formulas…`}
                aria-label="Search formulas by name, symbol or keyword"
                className="fl-search-input"
              />
              {query && (
                <button
                  type="button"
                  className="fl-clear"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                >
                  <i className="fa-solid fa-xmark" aria-hidden="true" />
                </button>
              )}
            </div>

            <div
              className="fl-chips"
              role="group"
              aria-label="Filter formulas by subject"
            >
              <button
                type="button"
                className={`fl-chip ${active === "All" ? "is-active" : ""}`}
                aria-pressed={active === "All"}
                onClick={() => setActive("All")}
              >
                All <span className="fl-chip-n">{FORMULA_COUNT}</span>
              </button>
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`fl-chip ${active === c ? "is-active" : ""}`}
                  aria-pressed={active === c}
                  onClick={() => setActive(c)}
                >
                  {c} <span className="fl-chip-n">{COUNT_BY_CATEGORY[c]}</span>
                </button>
              ))}
            </div>
          </div>

          <p className="fl-count" aria-live="polite">
            {results.length === FORMULA_COUNT
              ? `Showing all ${FORMULA_COUNT} formulas`
              : `${results.length} of ${FORMULA_COUNT} formulas`}
            {filtering && (
              <button
                type="button"
                className="fl-reset"
                onClick={() => {
                  setQuery("");
                  setActive("All");
                }}
              >
                Reset
              </button>
            )}
          </p>

          {/* ── results ──────────────────────────────────────────────── */}
          {results.length === 0 ? (
            <div className="fl-empty">
              <p>
                Nothing matches <strong>{query}</strong>
                {active !== "All" && <> in {active}</>}.
              </p>
              <p>
                Try a shorter word, or{" "}
                <button
                  type="button"
                  className="fl-inline-btn"
                  onClick={() => setActive("All")}
                >
                  search every subject
                </button>
                . Formulas are also findable by their symbols, so <em>πr²</em>{" "}
                and <em>area of circle</em> both work.
              </p>
            </div>
          ) : (
            <ul className="fl-grid">
              {results.map((f) => (
                <li className="fl-card" key={f.id} id={f.id}>
                  <header className="fl-card-head">
                    <h3>{f.name}</h3>
                    <span
                      className={`fl-tag fl-tag-${f.category.toLowerCase()}`}
                    >
                      {f.category}
                    </span>
                  </header>

                  <div className="fl-eq">{f.expression}</div>

                  <dl className="fl-meta">
                    <dt>Symbols</dt>
                    <dd>{f.variables}</dd>
                    <dt>When to use it</dt>
                    <dd>{f.use}</dd>
                    <dt>Worked example</dt>
                    <dd className="fl-example">{f.example}</dd>
                  </dl>

                  {f.tool && (
                    <Link href={f.tool[0]} className="fl-tool">
                      <i
                        className="fa-solid fa-calculator"
                        aria-hidden="true"
                      />
                      {f.tool[1]}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          )}

          {/* ── editorial ────────────────────────────────────────────── */}
          <section className="fl-prose">
            <h2>Why Every Entry Carries an Example</h2>
            <p>
              A formula sheet that lists symbols and stops is useful only to
              someone who already knows the formula. The gap between reading
              <em> A = πr² </em> and using it is not the algebra — it is knowing
              that r is the radius and that the tape measure in your hand
              probably gave you the diameter. That is the kind of thing an
              example catches and a definition does not, so every card here has
              one, with the arithmetic left visible rather than tidied away.
            </p>
            <p>
              Several examples are deliberately built around the mistake rather
              than the method. Removing VAT by subtracting 20% instead of
              dividing by 1.2 gives an answer that is close enough to look right
              and wrong by ten pounds in three hundred. Dividing cubic feet by 3
              rather than 27 produces an order nine times too large. These are
              not exotic errors; they are the ordinary ones, and seeing the
              correct arithmetic beside them is what stops them.
            </p>

            <h2>Reading the Symbol Lists</h2>
            <p>
              Two conventions run through the library. Greek letters stand for
              quantities describing a whole set — μ for a population mean, σ for
              its standard deviation, Σ for a total — while Latin letters
              usually describe a single measurement or a sample. And a
              superscript is a power, not a multiplication: r² means r times
              itself, which is why a circle of double the radius has four times
              the area rather than twice.
            </p>
            <p>
              Units are the other half of the job, and no formula enforces them.
              Speed is distance over time whether or not the distance is in
              miles and the time in minutes, and it will return a number either
              way. Anything measured in more than one unit is worth converting
              before it reaches a formula rather than after, which the{" "}
              <Link href="/unit-conversion-calculator/" className="my-link">
                unit conversion calculator
              </Link>{" "}
              will do exactly, and the{" "}
              <Link href="/mixed-number-calculator/" className="my-link">
                mixed number calculator
              </Link>{" "}
              will handle for the fractions a tape measure gives you.
            </p>

            <h2>Where a Formula Stops Being the Right Answer</h2>
            <p>
              Most of these hold only under conditions the formula itself does
              not state. Pythagoras and SOH CAH TOA need a right angle, and give
              confident nonsense without one — the sine and cosine rules exist
              precisely for the triangles they cannot handle. Basic probability
              assumes every outcome is equally likely, which is true of a
              shuffled deck and false of almost anything involving people.
              Simple interest assumes nothing is ever added to the principal,
              which is why it understates nearly every real account.
            </p>
            <p>
              The mean deserves its own warning. It is the average everyone
              reaches for, and a single extreme value pulls it a long way from
              where most of the data sits. That is why incomes are reported as
              medians and why a room of ten people can have a mean wealth in the
              millions. When a set has outliers, the median describes it better
              — and both are worth calculating before deciding which one to
              quote.
            </p>
          </section>
        </section>
      </div>
    </div>
  );
}
