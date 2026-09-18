"use client";

import { useState } from "react";

const FAQ_DATA: [string, string][] = [
  [
    "Is Numbers On Your Tip really free?",
    "Yes, completely. Every calculator and tool on the site is free to use, with no premium tier, no subscription, and no hidden paywall. The site is funded by advertising, not by charging users.",
  ],
  [
    "Do I need to create an account to use a calculator?",
    "No. There is no sign-up, no login, and no email required for any tool. Open the calculator you need, enter your values, and get your result immediately.",
  ],
  [
    "How accurate are the calculators?",
    "Every calculator is built on a standard published formula — WHO guidelines for health metrics, standard amortization formulas for loans and EMIs, official tax brackets, and internationally standardized unit conversion factors. Formulas are tested against known worked examples before going live, and each calculator page shows the underlying formula so you can verify the math yourself.",
  ],
  [
    "Is my data stored or shared with anyone?",
    "No. Every calculation runs entirely inside your browser using JavaScript. Nothing you type — whether it's a salary figure, a health metric, or a password you're generating — is ever sent to a server, logged, or stored. Refreshing the page clears everything.",
  ],
  [
    "Do the calculators work on mobile devices?",
    "Yes. Every tool is fully responsive and works on phones, tablets, and desktops in any modern browser, with no app to install.",
  ],
  [
    "How many calculators and tools are available?",
    "Fifty calculators and tools across seven categories: health, finance, daily use, maths, networking, construction, and general utilities. New calculators are added periodically based on what people actually search for.",
  ],
  [
    "Can I suggest a new calculator or report an error?",
    "Yes — feedback is welcome. Use the contact page to suggest a tool that's missing or flag a calculation that looks wrong, and it will be reviewed and, where valid, fixed or added.",
  ],
  [
    "Are the medical and dosing calculators safe to rely on?",
    "They are built for educational and reference use, using standard clinical formulas, and are useful for double-checking a manual calculation. They are not a substitute for a licensed healthcare professional's judgment — always verify dosing against current clinical references and your institution's protocols before administering any medication.",
  ],
];

export default function HomepageFAQ() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };
  const handleFAQKey = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleFAQ(index);
    }
  };

  return (
    <section
      className="homepage-faq"
      style={{ marginTop: "60px", marginBottom: "50px" }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQ_DATA.map(([q, a]) => ({
              "@type": "Question",
              name: q,
              acceptedAnswer: { "@type": "Answer", text: a },
            })),
          }),
        }}
      />
      <h2 className="more-tools">Frequently Asked Questions</h2>
      {FAQ_DATA.map(([q, a], i) => {
        const isOpen = openFAQ === i;
        return (
          <div className="faq-item" key={i}>
            <h3
              onClick={() => toggleFAQ(i)}
              onKeyDown={(e) => handleFAQKey(e, i)}
              role="button"
              tabIndex={0}
              aria-expanded={isOpen}
              aria-controls={`homepage-faq-answer-${i}`}
            >
              {q}
              <i
                className={`fa-solid fa-chevron-down ${isOpen ? "rotate" : ""}`}
                aria-hidden="true"
                style={{ marginLeft: "auto" }}
              />
            </h3>
            <div
              id={`homepage-faq-answer-${i}`}
              className={`faq-answer-wrap ${isOpen ? "open" : ""}`}
              aria-hidden={!isOpen}
            >
              <div className="faq-answer-inner">
                <p style={{ margin: 0 }}>{a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
