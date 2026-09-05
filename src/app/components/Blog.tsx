"use client";

import Link from "next/link";
import { useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";

type Post = {
  id: string;
  title: string;
  category: string;
  image: string;
  author: string;
  date: string;
  dateISO: string;
  slug: string;
  words: number;
  excerpt: string;
};

const blogs: Post[] = [
  {
    id: "1",
    title: "What Is VAT? The Chain, the Reclaim and the Threshold",
    category: "Finance",
    image: "/blog1.webp",
    author: "Ashar Pervaiz",
    date: "25 March 2026",
    dateISO: "2026-03-25",
    slug: "/blog/what-is-vat/",
    words: 1979,
    excerpt:
      "VAT is charged at every stage of production, but only the final consumer carries it. How the credit chain works, what you can and cannot reclaim, and when registration becomes compulsory.",
  },
  {
    id: "2",
    title: "Medication Dose Calculation: Where the Errors Actually Come From",
    category: "Health",
    image: "/blog2.webp",
    author: "Ashar Pervaiz",
    date: "3 April 2026",
    dateISO: "2026-04-03",
    slug: "/blog/medication-dose-calculation-complete-guide-to-dose-calculator-safe-drug-dosing/",
    words: 1929,
    excerpt:
      "Dosing mistakes are almost never arithmetic. They are decimal points, micrograms read as milligrams, and labels that give a total where you expected a concentration.",
  },
  {
    id: "3",
    title: "IV Infusion Calculations: Drip Rates, Pump Rates and IVIG Ramps",
    category: "Health",
    image: "/blog3.webp",
    author: "Ashar Pervaiz",
    date: "13 April 2026",
    dateISO: "2026-04-13",
    slug: "/blog/ultimate-iv-infusion-calculator-guide/",
    words: 2402,
    excerpt:
      "Four different calculations get called IV maths. Which one applies when, the drop factor that changes every answer, and why a stepped IVIG infusion runs an hour longer than it looks.",
  },
  {
    id: "4",
    title: "The Smart Renter's Guide: What You Can Actually Afford",
    category: "Finance",
    image: "/blog4.webp",
    author: "Ashar Pervaiz",
    date: "1 May 2026",
    dateISO: "2026-05-01",
    slug: "/blog/the-smart-renters-guide-what-you-can-actually-afford/",
    words: 1844,
    excerpt:
      "The 30% rule is a starting point, not an answer. Deposits, the costs that sit outside rent, and what a landlord's affordability check actually tests.",
  },
  {
    id: "5",
    title: "How Do I Calculate My Net Worth?",
    category: "Finance",
    image: "/blog5.webp",
    author: "Ashar Pervaiz",
    date: "10 May 2026",
    dateISO: "2026-05-10",
    slug: "/blog/how-do-i-calculate-my-net-worth/",
    words: 2470,
    excerpt:
      "Assets minus liabilities is the easy part. Deciding what counts is not — where a car, a pension and a mortgage each belong, and why the trend matters more than the total.",
  },
  {
    id: "6",
    title: "Best Free Financial Calculators for Everyday Money Questions",
    category: "Finance",
    image: "/blog6.webp",
    author: "Ashar Pervaiz",
    date: "30 May 2026",
    dateISO: "2026-05-30",
    slug: "/blog/best-free-financial-calculators-for-everyday-money-questions/",
    words: 3177,
    excerpt:
      "Nine calculators for the money questions that come up most often, what each one is genuinely good for, and which of them are worth using together.",
  },
  {
    id: "7",
    title: "Can AI Replace Financial Calculators? Here's the Honest Truth",
    category: "Finance",
    image: "/blog7.webp",
    author: "Ashar Pervaiz",
    date: "7 June 2026",
    dateISO: "2026-06-07",
    slug: "/blog/can-ai-replace-financial-calculators/",
    words: 2806,
    excerpt:
      "Where a language model genuinely helps with a money question, where it quietly invents a number, and how to use both without trusting the wrong one.",
  },
  {
    id: "8",
    title: "Renting vs. Buying a Home: How to Decide With Numbers",
    category: "Finance",
    image: "/blog8.webp",
    author: "Ashar Pervaiz",
    date: "14 June 2026",
    dateISO: "2026-06-14",
    slug: "/blog/renting-vs-buying-a-home/",
    words: 3006,
    excerpt:
      "The break-even point, the price-to-rent ratio, and why the old rule that renting throws money away stopped holding at current rates.",
  },
  {
    id: "9",
    title: "Healthy Body Fat Percentage by Age and Gender",
    category: "Health",
    image: "/blog9.webp",
    author: "Ashar Pervaiz",
    date: "20 June 2026",
    dateISO: "2026-06-20",
    slug: "/blog/healthy-bodyfat-percentage-by-age-and-gender/",
    words: 2028,
    excerpt:
      "What the standard percentage ranges actually mean, how they shift by decade, and why where the fat sits matters more than the headline number.",
  },
  {
    id: "10",
    title: "What Is Numbers on Your Tip?",
    category: "Daily Use",
    image: "/blog10.webp",
    author: "Ashar Pervaiz",
    date: "3 July 2026",
    dateISO: "2026-07-03",
    slug: "/blog/what-is-numbers-on-your-tip/",
    words: 3481,
    excerpt:
      "What this site is, who builds it, how it is funded, and what happens to the numbers you type into it — which is nothing, because they never leave your browser.",
  },
  {
    id: "11",
    title: "Every Matrix Operation, Worked by Hand",
    category: "Maths",
    image: "/blog11.webp",
    author: "Ashar Pervaiz",
    date: "12 July 2026",
    dateISO: "2026-07-12",
    slug: "/blog/matrix-calculator-guide/",
    words: 4147,
    excerpt:
      "Every operation the calculator performs, worked out step by step, with the shape rules that decide whether an operation is defined before you attempt it.",
  },
  {
    id: "12",
    title: "2026 Tax Brackets, Deductions and What Changed",
    category: "Finance",
    image: "/blog12.webp",
    author: "Ashar Pervaiz",
    date: "17 July 2026",
    dateISO: "2026-07-17",
    slug: "/blog/2026-tax-brackets/",
    words: 3894,
    excerpt:
      "The 2026 federal brackets for all four filing statuses, the standard deduction, long-term capital gains rates, and worked examples at common income levels.",
  },
  {
    id: "13",
    title: "How Many Calories Should I Eat to Lose Weight?",
    category: "Health",
    image: "/blog13.webp",
    author: "Ashar Pervaiz",
    date: "26 July 2026",
    dateISO: "2026-07-26",
    slug: "/blog/how-many-calories-to-lose-weight/",
    words: 2767,
    excerpt:
      "Working out a deficit you can actually hold, why the first two weeks mislead almost everybody, and what a plateau really is.",
  },
  {
    id: "14",
    title: "How Much House Can I Afford?",
    category: "Finance",
    image: "/blog14.webp",
    author: "Ashar Pervaiz",
    date: "30 July 2026",
    dateISO: "2026-07-30",
    slug: "/blog/how-much-house-can-i-afford/",
    words: 3249,
    excerpt:
      "The 28/36 rule, everything PITI actually includes, and the ownership costs that budgets routinely leave out until the first bill arrives.",
  },
  {
    id: "15",
    title: "How To Calculate Exact Age?",
    category: "Daily Use",
    image: "/blog15.webp",
    author: "Ashar Pervaiz",
    date: "3 August 2026",
    dateISO: "2026-08-03",
    slug: "/blog/how-to-calculate-exact-age/",
    words: 3433,
    excerpt:
      "Three-column subtraction with borrowing, the six places it reliably goes wrong, and how a 29 February birthday is treated for legal ages.",
  },
  {
    id: "16",
    title: "Marginal vs Effective Tax Rate",
    category: "Finance",
    image: "/blog16.webp",
    author: "Ashar Pervaiz",
    date: "5 August 2026",
    dateISO: "2026-08-05",
    slug: "/blog/marginal-vs-effective-tax-rate/",
    words: 3166,
    excerpt:
      "A raise that crosses a bracket never lowers your take-home pay. What each rate measures, and the three real situations people mistake for the myth.",
  },
  {
    id: "17",
    title: "Why Was My Bonus Taxed So Much?",
    category: "Finance",
    image: "/blog17.webp",
    author: "Ashar Pervaiz",
    date: "7 August 2026",
    dateISO: "2026-08-07",
    slug: "/blog/why-was-my-bonus-taxed-so-much/",
    words: 3261,
    excerpt:
      "Withholding is not tax owed. Why the flat supplemental rate makes the deduction look brutal, and when the difference comes back to you.",
  },
  {
    id: "18",
    title: "Online Privacy & Security Basics",
    category: "Networking",
    image: "/blog18.webp",
    author: "Ashar Pervaiz",
    date: "27 August 2026",
    dateISO: "2026-08-27",
    slug: "/blog/online-privacy-security-basics/",
    words: 2275,
    excerpt:
      "What an IP address does and does not reveal about you, what a DNS lookup exposes about a domain, and a five-minute check anyone can run.",
  },
  {
    id: "19",
    title: "Zakat on Gold: Why Karat Decides the Answer",
    category: "Finance",
    image: "/blog19.webp",
    author: "Ashar Pervaiz",
    date: "5 September 2026",
    dateISO: "2026-09-05",
    slug: "/blog/zakat-on-gold-nisab-and-karat/",
    words: 3139,
    excerpt:
      "The nisab threshold is a weight of pure gold, so alloyed jewellery has to weigh more to reach it — plus why two nisab figures circulate and where the schools differ.",
  },
];

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
          Each calculator on this site answers one question. These eighteen
          guides cover the part a calculator cannot: what the inputs mean, where
          the standard formula stops being reliable, and how to tell a wrong
          answer from a merely surprising one.
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
