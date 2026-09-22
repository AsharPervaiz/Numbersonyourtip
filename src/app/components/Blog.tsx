"use client";

import Link from "next/link";
import { useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { blogs, POST_COUNT_WORD, type Post } from "../data/posts";

const GROUP_NOTES: [string, string][] = [
  [
    "Finance",
    "Money questions where the arithmetic is straightforward and the definitions are not — what counts as an asset, what withholding actually is, and when buying beats renting.",
  ],
  [
    "Health",
    "Clinical and body-composition calculations, reviewed by a medical professional, written with the failure cases in front of them rather than buried at the end.",
  ],
  [
    "Daily Use",
    "Everyday arithmetic that turns out to have edge cases: calendar dates, leap years, and how this site itself works.",
  ],
  [
    "Maths",
    "Operations worked by hand, so you can see what the calculator did rather than taking the output on trust.",
  ],
  [
    "Networking",
    "What the ordinary traces you leave online actually reveal, checked against the tools that read them.",
  ],
];

const CATEGORIES = [
  "All",
  "Finance",
  "Health",
  "Daily Use",
  "Maths",
  "Networking",
];

function readMinutes(words: number) {
  return Math.max(1, Math.round(words / 220));
}

const byNewest = (a: Post, b: Post) => b.dateISO.localeCompare(a.dateISO);

function PostCard({
  post,
  featured = false,
}: {
  post: Post;
  featured?: boolean;
}) {
  return (
    <article className={featured ? "post-row post-row-featured" : "post-row"}>
      {/* The thumbnail already carries the title as artwork, so it is
          decorative here and kept out of the tab order. */}
      <Link
        href={post.slug}
        className="post-thumb"
        tabIndex={-1}
        aria-hidden="true"
      >
        <img src={post.image} alt="" loading="lazy" />
      </Link>

      <div className="post-body">
        <p className="post-meta-top">
          <span className="post-cat">{post.category}</span>
          {featured && <span className="post-badge">Latest</span>}
          <time dateTime={post.dateISO}>{post.date}</time>
          <span className="post-dot">·</span>
          <span>{readMinutes(post.words)} min read</span>
        </p>

        <h3 className="post-title">
          <Link href={post.slug}>{post.title}</Link>
        </h3>

        <p className="post-excerpt">{post.excerpt}</p>

        <Link href={post.slug} className="post-more">
          Read the guide <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}

export default function BlogsPage() {
  const [active, setActive] = useState("All");
  const [newestFirst, setNewestFirst] = useState(true);

  const sorted = [...blogs].sort(byNewest);
  const featured = sorted[0];

  const counts: Record<string, number> = { All: blogs.length };
  for (const b of blogs) counts[b.category] = (counts[b.category] || 0) + 1;

  // The full list, not the list minus the featured post: excluding it meant
  // filtering to a category whose only guide is the featured one returned
  // nothing while its chip still showed a count.
  const shown = sorted
    .filter((b) => active === "All" || b.category === active)
    .sort((a, b) => (newestFirst ? byNewest(a, b) : byNewest(b, a)));

  return (
    <div className="blog-index">
      <header className="blog-index-head">
        <h1>Guides Behind the Calculators</h1>
        <p className="blog-lede">
          Each calculator on this site answers one question. These{" "}
          {POST_COUNT_WORD} guides cover the part a calculator cannot: what the
          inputs mean, where the standard formula stops being reliable, and how
          to tell a wrong answer from a merely surprising one.
        </p>
        <p>
          They are written to be read alongside the tool they relate to, and
          every one links to it. Where a guide covers clinical material — drug
          dosing, infusion rates, body composition — it has been reviewed by our
          medical reviewer, and that review is stated on the page itself. The
          finance guides are not medically reviewed and do not pretend to be;
          their review dates are recorded on the{" "}
          <Link href="/about-us/" className="my-link">
            about page
          </Link>
          {"."}
        </p>
      </header>

      <section className="blog-featured">
        <h2>Most Recent</h2>
        <PostCard post={featured} featured />
      </section>

      <section className="blog-all">
        <h2>Every Guide</h2>

        <div className="blog-controls">
          <div
            className="filter-chips"
            role="group"
            aria-label="Filter guides by category"
          >
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                className={c === active ? "chip chip-on" : "chip"}
                aria-pressed={c === active}
                onClick={() => setActive(c)}
              >
                {c} <span className="chip-count">{counts[c] ?? 0}</span>
              </button>
            ))}
          </div>

          <button
            type="button"
            className="sort-toggle"
            onClick={() => setNewestFirst((v) => !v)}
          >
            <i
              className="fa-solid fa-arrow-down-short-wide"
              aria-hidden="true"
            ></i>{" "}
            {newestFirst ? "Newest first" : "Oldest first"}
          </button>
        </div>

        {active !== "All" && (
          <p className="result-count" aria-live="polite">
            Showing {shown.length} {active}{" "}
            {shown.length === 1 ? "guide" : "guides"}.
          </p>
        )}

        <div className="post-list">
          {shown.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
      </section>

      <section className="blog-groups">
        <h2>What Each Group Covers</h2>
        <dl>
          {GROUP_NOTES.map(([name, note]) => (
            <div key={name}>
              <dt>
                {name} <span>({counts[name] ?? 0})</span>
              </dt>
              <dd>{note}</dd>
            </div>
          ))}
        </dl>
        <p>
          Nothing here is gated, and none of the calculators these guides point
          to send your figures anywhere. Filtering and sorting above happen
          entirely in your browser — no page reloads, no extra URLs, and every
          guide stays on this one page.
        </p>
      </section>
    </div>
  );
}
