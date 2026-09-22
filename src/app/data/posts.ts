/* The blog index data.

   This lives outside the component because the post count and the article
   list are also read by server components (the /blog/ metadata and the
   author page). A "use client" module cannot supply those — its exports
   arrive on the server as client references rather than as values. */

export type Post = {
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

export const blogs: Post[] = [
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
  {
    id: "20",
    title: "Shrinkflation and the True Unit Price",
    category: "Daily Use",
    image: "/blog20.webp",
    author: "Ashar Pervaiz",
    date: "12 September 2026",
    dateISO: "2026-09-12",
    slug: "/blog/shrinkflation-and-unit-price/",
    words: 2296,
    excerpt:
      "A pack that quietly loses a tenth of its contents costs 11.11% more per gram, not 10% — and a discount can be smaller than the shrink it follows.",
  },
  {
    id: "22",
    title: "Your First Tax Bill Is 150% of the Tax You Owe",
    category: "Finance",
    image: "/blog22.webp",
    author: "Ashar Pervaiz",
    date: "22 September 2026",
    dateISO: "2026-09-22",
    slug: "/blog/payments-on-account-first-tax-bill/",
    words: 2373,
    excerpt:
      "A £3,000 Self Assessment bill arrives as a £4,500 demand, and nothing has gone wrong. The January figure is last year settled and this year started early — here is the arithmetic, and why the second year costs a third of the first.",
  },
  {
    id: "21",
    title: "The Energy Price Cap Is Not a Cap on Your Bill",
    category: "Daily Use",
    image: "/blog21.webp",
    author: "Ashar Pervaiz",
    date: "19 September 2026",
    dateISO: "2026-09-19",
    slug: "/blog/energy-price-cap-what-it-actually-caps/",
    words: 1981,
    excerpt:
      "£1,723 is not the most you can be charged — it is one assumed household's arithmetic. Here is how the headline is built, and why using a fifth less energy takes only a sixth off the bill.",
  },
];

/* The post count appears in prose on three pages and in this file's own
   lede. It is derived here so that publishing a post updates all of them,
   rather than leaving a number behind to go stale. */
const SPELL = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
  "nineteen",
  "twenty",
  "twenty-one",
  "twenty-two",
  "twenty-three",
  "twenty-four",
  "twenty-five",
  "twenty-six",
  "twenty-seven",
  "twenty-eight",
  "twenty-nine",
  "thirty",
];

export const POST_COUNT = blogs.length;
export const POST_COUNT_WORD = SPELL[blogs.length] ?? String(blogs.length);
export const POSTS_NEWEST_FIRST = [...blogs].sort((a, b) =>
  b.dateISO.localeCompare(a.dateISO),
);
