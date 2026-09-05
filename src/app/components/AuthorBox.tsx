import Link from "next/link";

/**
 * Author credit placed at the foot of every guide. Kept factual: it states
 * what the author does build and know, and points clinical authority at the
 * medical reviewer rather than claiming it here.
 */
export default function AuthorBox() {
  return (
    <section className="author-box" aria-labelledby="author-box-heading">
      {/* Deliberately not an <h2>: this is an attribution block, not a
          content section, and an identical heading on all 18 guides would
          be exactly the repeated-boilerplate pattern the rest of the site
          avoids. */}
      <p className="author-box-heading" id="author-box-heading">
        About the author
      </p>
      <div className="author-box-inner">
        <Link href="/author/ashar-pervaiz/" aria-hidden="true" tabIndex={-1}>
          <img
            src="/founder-noyt.webp"
            alt=""
            width={92}
            height={92}
            loading="lazy"
          />
        </Link>
        <div>
          <p className="author-box-name">
            <Link href="/author/ashar-pervaiz/">Ashar Pervaiz</Link>
          </p>
          <p className="author-box-role">
            Founder and author · Frontend developer, Karachi
          </p>
          <p className="author-box-bio">
            Ashar builds every calculator on Numbers On Your Tip and writes the
            guides that go with them. He holds a degree in Software Engineering
            from the University of Karachi and works in React and Next.js. He is
            not a clinician or a financial adviser — clinical pages on this site
            are reviewed separately by{" "}
            <Link href="/about-us/#medical-reviewer" className="my-link">
              Dr. Syeda Khadija Akbar, PharmD
            </Link>
            .
          </p>
          <p className="author-box-links">
            <Link href="/author/ashar-pervaiz/">Full profile</Link>
            <a
              href="https://www.linkedin.com/in/ashar-pervaiz-b3a718256"
              target="_blank"
              rel="noopener noreferrer me"
            >
              LinkedIn
            </a>
            <a
              href="https://asharpervaiz.dev/"
              target="_blank"
              rel="noopener noreferrer me"
            >
              Portfolio
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
