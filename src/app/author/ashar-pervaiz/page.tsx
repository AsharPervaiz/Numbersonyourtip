import Link from "next/link";
import { Metadata } from "next";
import "@fortawesome/fontawesome-free/css/all.min.css";

export const metadata: Metadata = {
  title: "Ashar Pervaiz — Author and Founder",
  description:
    "Who builds and writes Numbers On Your Tip: a software engineer from Karachi, what he does and does not claim expertise in, and how each tool is checked.",
  alternates: {
    canonical: "/author/ashar-pervaiz/",
  },
  openGraph: {
    title: "Ashar Pervaiz — Author and Founder, Numbers On Your Tip",
    description:
      "Software engineer, University of Karachi. Builds every calculator on this site and writes the guides that go with them.",
    url: "/author/ashar-pervaiz/",
    type: "profile",
  },
  twitter: {
    title: "Ashar Pervaiz — Author and Founder",
    description:
      "The software engineer behind the 48 calculators on Numbers On Your Tip.",
  },
};

const ARTICLES: [string, string, string][] = [
  ["/blog/online-privacy-security-basics/", "Online Privacy & Security Basics", "27 Aug 2026"],
  ["/blog/why-was-my-bonus-taxed-so-much/", "Why Was My Bonus Taxed So Much?", "7 Aug 2026"],
  ["/blog/marginal-vs-effective-tax-rate/", "Marginal vs Effective Tax Rate", "5 Aug 2026"],
  ["/blog/how-to-calculate-exact-age/", "How To Calculate Exact Age?", "3 Aug 2026"],
  ["/blog/how-much-house-can-i-afford/", "How Much House Can I Afford?", "30 Jul 2026"],
  ["/blog/how-many-calories-to-lose-weight/", "How Many Calories Should I Eat to Lose Weight?", "26 Jul 2026"],
  ["/blog/2026-tax-brackets/", "2026 Tax Brackets, Deductions and What Changed", "17 Jul 2026"],
  ["/blog/matrix-calculator-guide/", "Every Matrix Operation, Worked by Hand", "12 Jul 2026"],
  ["/blog/what-is-numbers-on-your-tip/", "What Is Numbers on Your Tip?", "3 Jul 2026"],
  ["/blog/healthy-bodyfat-percentage-by-age-and-gender/", "Healthy Body Fat Percentage by Age and Gender", "20 Jun 2026"],
  ["/blog/renting-vs-buying-a-home/", "Renting vs. Buying a Home", "14 Jun 2026"],
  ["/blog/can-ai-replace-financial-calculators/", "Can AI Replace Financial Calculators?", "7 Jun 2026"],
  ["/blog/best-free-financial-calculators-for-everyday-money-questions/", "Best Free Financial Calculators", "30 May 2026"],
  ["/blog/how-do-i-calculate-my-net-worth/", "How Do I Calculate My Net Worth?", "10 May 2026"],
  ["/blog/the-smart-renters-guide-what-you-can-actually-afford/", "The Smart Renter's Guide", "1 May 2026"],
  ["/blog/ultimate-iv-infusion-calculator-guide/", "IV Infusion Calculations", "13 Apr 2026"],
  ["/blog/medication-dose-calculation-complete-guide-to-dose-calculator-safe-drug-dosing/", "Medication Dose Calculation", "3 Apr 2026"],
  ["/blog/what-is-vat/", "What Is VAT?", "25 Mar 2026"],
];

const SKILLS: [string, string][] = [
  ["Frontend", "React, Next.js, JavaScript, HTML5, CSS3, Tailwind CSS"],
  ["Backend and data", "Node.js, PHP, MySQL, Supabase"],
  ["CMS and platforms", "WordPress, Shopify, Webflow"],
  ["Design", "Figma, Adobe XD, Photoshop, UI/UX design"],
];

export default function AuthorPage() {
  const personLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: "Ashar Pervaiz",
      url: "https://numbersonyourtip.com/author/ashar-pervaiz/",
      image: "https://numbersonyourtip.com/founder-noyt.webp",
      jobTitle: "Frontend Developer and UI/UX Designer",
      description:
        "Software engineer based in Karachi, Pakistan. Founder of Numbers On Your Tip, where he builds every calculator and writes the accompanying guides.",
      email: "mailto:contact@numbersonyourtip.com",
      worksFor: { "@type": "Organization", name: "Social Gravity" },
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: "University of Karachi (UBIT)",
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Karachi",
        addressCountry: "PK",
      },
      knowsAbout: [
        "Front-end development",
        "React and Next.js",
        "UI/UX design",
        "Web performance",
        "Calculator and tool design",
      ],
      sameAs: [
        "https://asharpervaiz.dev/",
        "https://www.linkedin.com/in/ashar-pervaiz-b3a718256",
        "https://www.facebook.com/share/1WXWd29Bkp/",
        "https://www.instagram.com/numbersonyourtip/",
        "https://www.youtube.com/@Numbersonyourtip",
        "https://www.tiktok.com/@numberstip",
        "https://www.threads.com/@numbersonyourtip",
        "https://medium.com/@numbersonyourtip",
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
      />

      <div className="author-page">
        <header className="author-hero">
          <img
            src="/founder-noyt.webp"
            alt="Ashar Pervaiz, founder of Numbers On Your Tip"
            width={150}
            height={150}
          />
          <div>
            <h1>Ashar Pervaiz</h1>
            <p className="author-role">
              Founder and author, Numbers On Your Tip
            </p>
            <p className="author-sub">
              Frontend developer and UI/UX designer · Karachi, Pakistan
            </p>
            <ul className="author-links">
              <li>
                <a
                  href="https://asharpervaiz.dev/"
                  target="_blank"
                  rel="noopener noreferrer me"
                >
                  <i className="fa-solid fa-globe" aria-hidden="true" /> Portfolio
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/ashar-pervaiz-b3a718256"
                  target="_blank"
                  rel="noopener noreferrer me"
                >
                  <i className="fa-brands fa-linkedin-in" aria-hidden="true" />{" "}
                  LinkedIn
                </a>
              </li>
              <li>
                <Link href="/contact-us/">
                  <i className="fa-solid fa-envelope" aria-hidden="true" /> Contact
                </Link>
              </li>
            </ul>
          </div>
        </header>

        <h2>Who I Am</h2>
        <p>
          I am a software engineer from Karachi, Pakistan, with a degree in
          Software Engineering from the University of Karachi (UBIT), where I
          studied from 2021 to 2024. I work as a web developer at Social
          Gravity and have been building for the web for over two years,
          mostly in React, Next.js and WordPress.
        </p>
        <p>
          Numbers On Your Tip is mine. I designed it, wrote the code for all{" "}
          <Link href="/" className="my-link">
            48 calculators and tools
          </Link>
          , and wrote the eighteen{" "}
          <Link href="/blog/" className="my-link">
            guides
          </Link>{" "}
          that sit alongside them. There is no content team and no
          ghostwriter — if something on this site is wrong, it is my mistake.
        </p>

        <h2>What I Am Qualified to Say, and What I Am Not</h2>
        <p>
          This is the part most author pages skip, and it is the part that
          actually matters when you are deciding whether to trust a number.
        </p>
        <p>
          My expertise is engineering: implementing a published formula
          correctly, handling the edge cases, and building an interface that
          does not mislead. I am not a doctor, a pharmacist, an accountant or a
          financial adviser, and this site never claims otherwise.
        </p>
        <p>
          That is why the clinical calculators and health guides are reviewed
          by someone who is qualified.{" "}
          <Link href="/about-us/#medical-reviewer" className="my-link">
            Dr. Syeda Khadija Akbar, PharmD
          </Link>{" "}
          reviewed the dosing logic, unit handling and safety wording on every
          medical page. Her review covers clinical content only — it does not
          extend to the finance or maths tools, and those pages do not claim it
          does.
        </p>

        <h2>How I Build a Calculator</h2>
        <p>
          Every tool starts from the source that professionals in that field
          actually use — WHO standards for BMI, the U.S. Navy method for body
          fat, Mifflin-St Jeor for calorie needs, the standard
          reducing-balance formula for loans, published IRS and HMRC rates for
          tax.
        </p>
        <p>
          Before a calculator goes live I test it against worked examples where
          the correct answer is already published, so I am checking the output
          against a known result rather than against my own arithmetic. Each
          page then shows the formula and a worked example in plain text, so
          you can verify the maths yourself instead of trusting a black box.
        </p>
        <p>
          Where a figure changes over time — a tax bracket, a clinical cut-off
          — the page states the year it applies to and gets updated when the
          underlying number moves. Review dates are recorded on the{" "}
          <Link href="/about-us/#review-process" className="my-link">
            about page
          </Link>
          .
        </p>

        <h2>Why I Built This Site</h2>
        <p>
          Most free calculator sites answer the question and stop. You get a
          number with no formula, no worked example, and nothing about when the
          method stops being reliable — which is exactly when you most need to
          know.
        </p>
        <p>
          I wanted the opposite: the answer, the working, and an honest
          statement of the limits. That is why the guides spend more time on
          where a calculation goes wrong than on the arithmetic itself, and why
          every calculation runs in your browser rather than on a server. Your
          figures are never transmitted or stored, which is a design decision
          rather than a marketing line.
        </p>

        <h2>Technical Background</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Area</th>
                <th>Tools and technologies</th>
              </tr>
            </thead>
            <tbody>
              {SKILLS.map(([area, list]) => (
                <tr key={area}>
                  <td>
                    <strong>{area}</strong>
                  </td>
                  <td>{list}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Numbers On Your Tip runs on Next.js and React as a fully static
          export, which is why pages load quickly and why no calculation needs
          a server round trip. Other work of mine — PHP applications,
          WordPress themes and Shopify storefronts — is on my{" "}
          <a
            href="https://asharpervaiz.dev/"
            target="_blank"
            rel="noopener noreferrer me"
            className="my-link"
          >
            portfolio
          </a>
          .
        </p>

        <h2>Corrections</h2>
        <p>
          If you find a wrong result, a broken edge case or an out-of-date
          rate, tell me and I will fix it. Corrections to a live calculator go
          out the same week, and the page&apos;s review date is updated when
          they do. The fastest route is the{" "}
          <Link href="/contact-us/" className="my-link">
            contact page
          </Link>
          .
        </p>

        <h2>Articles by Ashar Pervaiz</h2>
        <p>
          Eighteen guides, newest first. Each one is written to be read
          alongside the calculator it relates to.
        </p>
        <ol className="author-articles">
          {ARTICLES.map(([href, title, date]) => (
            <li key={href}>
              <Link href={href}>{title}</Link>
              <span>{date}</span>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}
