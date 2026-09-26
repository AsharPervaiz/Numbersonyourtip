import { Metadata } from "next";
import FormulaLibrary from "../components/FormulaLibrary";
import { FORMULAS, FORMULA_COUNT } from "../data/formulas";

export const metadata: Metadata = {
  title: "Maths Formula Library With Worked Examples",
  description: `${FORMULA_COUNT} maths formulas — algebra, geometry, trigonometry, statistics, finance and measurement. Searchable, symbols named, every one worked through.`,
  alternates: {
    canonical: "/math-formulas/",
  },
  openGraph: {
    title: "Maths Formula Library With Worked Examples",
    description:
      "Search formulas by name, symbol or what you are trying to do. Each one names its symbols and is worked through with real numbers.",
    url: "/math-formulas/",
  },
  twitter: {
    title: "Maths Formula Library",
    description:
      "Searchable formulas with the symbols named and the arithmetic shown.",
  },
};

/* An ItemList tells search engines the page is a collection of named things
   rather than one article, which is what it actually is. */
const itemListLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Maths Formula Library",
  numberOfItems: FORMULA_COUNT,
  itemListElement: FORMULAS.map((f, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: f.name,
    description: `${f.expression} — ${f.use}`,
    url: `https://numbersonyourtip.com/math-formulas/#${f.id}`,
  })),
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
      />
      <FormulaLibrary />
    </>
  );
}
