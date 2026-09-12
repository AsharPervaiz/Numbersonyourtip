// Breadcrumb trail data for every route on the site.
//
// `sections` maps a category landing page to its label. `pages` maps every
// other route to a label and, where it belongs under a category, its parent.
//
// Blog posts are served from the site root but canonicalise to /blog/<slug>/,
// so they carry an explicit `canonicalBase` — the schema must point at the
// canonical URL, not the served one.

export const SITE = "https://numbersonyourtip.com";

export type Crumb = { label: string; href: string };

type Entry = { label: string; parent?: string; canonical?: string };

export const SECTIONS: Record<string, string> = {
  "/health-calculators/": "Health Calculators",
  "/finance-calculators/": "Finance Calculators",
  "/daily-use-calculators/": "Daily Use Calculators",
  "/math-calculators/": "Maths Calculators",
  "/networking-tools/": "Networking Tools",
  "/tools/": "Tools",
  "/blog/": "Blog",
  "/about-us/": "About Us",
};

export const PAGES: Record<string, Entry> = {
  // --- category landing pages -------------------------------------------
  "/health-calculators/": { label: "Health Calculators" },
  "/finance-calculators/": { label: "Finance Calculators" },
  "/daily-use-calculators/": { label: "Daily Use Calculators" },
  "/math-calculators/": { label: "Maths Calculators" },
  "/networking-tools/": { label: "Networking Tools" },
  "/tools/": { label: "Tools" },
  "/blog/": { label: "Blog" },

  // --- health ------------------------------------------------------------
  "/bmi-calculator/": { label: "BMI Calculator", parent: "/health-calculators/" },
  "/body-fat-calculator/": { label: "Body Fat Calculator", parent: "/health-calculators/" },
  "/calorie-calculator/": { label: "Calorie Calculator", parent: "/health-calculators/" },
  "/dose-calculator/": { label: "Dose Calculator", parent: "/health-calculators/" },
  "/dose-stock-calculator/": { label: "Dose Stock Calculator", parent: "/health-calculators/" },
  "/iv-calculator/": { label: "IV Infusion Calculator", parent: "/health-calculators/" },
  "/pharmacokinetics-calculator/": { label: "Pharmacokinetics Calculator", parent: "/health-calculators/" },
  "/pharmacodynamics-calculator/": { label: "Pharmacodynamics Calculator", parent: "/health-calculators/" },

  // --- finance -----------------------------------------------------------
  "/emi-calculator/": { label: "EMI Calculator", parent: "/finance-calculators/" },
  "/loan-calculator/": { label: "Loan Calculator", parent: "/finance-calculators/" },
  "/home-mortgage-calculator/": { label: "Mortgage Calculator", parent: "/finance-calculators/" },
  "/income-tax-calculator/": { label: "Income Tax Calculator", parent: "/finance-calculators/" },
  "/rent-calculator/": { label: "Rent Calculator", parent: "/finance-calculators/" },
  "/vat-calculator/": { label: "VAT Calculator", parent: "/finance-calculators/" },
  "/net-worth-calculator/": { label: "Net Worth Calculator", parent: "/finance-calculators/" },
  "/freelancer-tax-calculator/": { label: "Freelancer Tax Calculator", parent: "/finance-calculators/" },
  "/salary-hike-calculator/": { label: "Salary Hike Calculator", parent: "/finance-calculators/" },
  "/fuel-cost-calculator/": { label: "Fuel Cost Calculator", parent: "/finance-calculators/" },
  "/gold-calculator/": { label: "Gold Calculator", parent: "/finance-calculators/" },

  // --- daily use ---------------------------------------------------------
  "/age-calculator/": { label: "Age Calculator", parent: "/daily-use-calculators/" },
  "/days-between-calculator/": { label: "Days Between Calculator", parent: "/daily-use-calculators/" },
  "/gpa-calculator/": { label: "GPA Calculator", parent: "/daily-use-calculators/" },
  "/gpa-percentage/": { label: "GPA to Percentage", parent: "/daily-use-calculators/" },
  "/percentage-calculator/": { label: "Percentage Calculator", parent: "/daily-use-calculators/" },
  "/time-calculator/": { label: "Time Calculator", parent: "/daily-use-calculators/" },
  "/unit-conversion-calculator/": { label: "Unit Conversion", parent: "/daily-use-calculators/" },
  "/bill-split-calculator/": { label: "Bill Split Calculator", parent: "/daily-use-calculators/" },
  "/discount-calculator/": { label: "Discount Calculator", parent: "/daily-use-calculators/" },

  // --- maths -------------------------------------------------------------
  "/mean-median-mode-calculator/": { label: "Mean, Median and Mode", parent: "/math-calculators/" },
  "/matrix-calculator/": { label: "Matrix Calculator", parent: "/math-calculators/" },
  "/mixed-number-calculator/": { label: "Mixed Number Calculator", parent: "/math-calculators/" },

  // --- networking --------------------------------------------------------
  "/dns-lookup/": { label: "DNS Lookup", parent: "/networking-tools/" },
  "/ip-detector/": { label: "IP Detector", parent: "/networking-tools/" },
  "/email-validator/": { label: "Email Validator", parent: "/networking-tools/" },
  "/domain-name-checker/": { label: "Domain Name Checker", parent: "/networking-tools/" },
  "/internet-speed-test/": { label: "Internet Speed Test", parent: "/networking-tools/" },

  // --- tools -------------------------------------------------------------
  "/currency-converter/": { label: "Currency Converter", parent: "/tools/" },
  "/image-converter/": { label: "Image Converter", parent: "/tools/" },
  "/image-compressor/": { label: "Image Compressor", parent: "/tools/" },
  "/image-resizer/": { label: "Image Resizer", parent: "/tools/" },
  "/password-generator/": { label: "Password Generator", parent: "/tools/" },
  "/lorem-ipsum-generator/": { label: "Lorem Ipsum Generator", parent: "/tools/" },
  "/text-converter/": { label: "Text Case Converter", parent: "/tools/" },
  "/text-generator/": { label: "Text Generator", parent: "/tools/" },
  "/word-char-counter/": { label: "Word and Character Counter", parent: "/tools/" },
  "/color-picker/": { label: "Colour Picker", parent: "/tools/" },
  "/carbon-footprint-calculator/": { label: "Carbon Footprint Calculator", parent: "/tools/" },
  "/time-zone-converter/": { label: "Time Zone Converter", parent: "/tools/" },

  // --- blog posts (served at root, canonical under /blog/) ---------------
  "/what-is-vat/": { label: "What Is VAT?", parent: "/blog/", canonical: "/blog/what-is-vat/" },
  "/medication-dose-calculation-complete-guide-to-dose-calculator-safe-drug-dosing/": {
    label: "Medication Dose Calculation",
    parent: "/blog/",
    canonical: "/blog/medication-dose-calculation-complete-guide-to-dose-calculator-safe-drug-dosing/",
  },
  "/ultimate-iv-infusion-calculator-guide/": {
    label: "IV Infusion Calculations",
    parent: "/blog/",
    canonical: "/blog/ultimate-iv-infusion-calculator-guide/",
  },
  "/the-smart-renters-guide-what-you-can-actually-afford/": {
    label: "How Much Rent Can You Afford?",
    parent: "/blog/",
    canonical: "/blog/the-smart-renters-guide-what-you-can-actually-afford/",
  },
  "/how-do-i-calculate-my-net-worth/": {
    label: "How to Calculate Your Net Worth",
    parent: "/blog/",
    canonical: "/blog/how-do-i-calculate-my-net-worth/",
  },
  "/best-free-financial-calculators-for-everyday-money-questions/": {
    label: "Free Financial Calculators Worth Using",
    parent: "/blog/",
    canonical: "/blog/best-free-financial-calculators-for-everyday-money-questions/",
  },
  "/can-ai-replace-financial-calculators/": {
    label: "Can AI Replace Financial Calculators?",
    parent: "/blog/",
    canonical: "/blog/can-ai-replace-financial-calculators/",
  },
  "/renting-vs-buying-a-home/": {
    label: "Renting vs Buying",
    parent: "/blog/",
    canonical: "/blog/renting-vs-buying-a-home/",
  },
  "/healthy-bodyfat-percentage-by-age-and-gender/": {
    label: "Healthy Body Fat Percentage by Age",
    parent: "/blog/",
    canonical: "/blog/healthy-bodyfat-percentage-by-age-and-gender/",
  },
  "/what-is-numbers-on-your-tip/": {
    label: "What Is Numbers on Your Tip?",
    parent: "/blog/",
    canonical: "/blog/what-is-numbers-on-your-tip/",
  },
  "/matrix-calculator-guide/": {
    label: "Every Matrix Operation, Worked by Hand",
    parent: "/blog/",
    canonical: "/blog/matrix-calculator-guide/",
  },
  "/2026-tax-brackets/": {
    label: "2026 Tax Brackets",
    parent: "/blog/",
    canonical: "/blog/2026-tax-brackets/",
  },
  "/how-many-calories-to-lose-weight/": {
    label: "How Many Calories to Lose Weight?",
    parent: "/blog/",
    canonical: "/blog/how-many-calories-to-lose-weight/",
  },
  "/how-much-house-can-i-afford/": {
    label: "How Much House Can I Afford?",
    parent: "/blog/",
    canonical: "/blog/how-much-house-can-i-afford/",
  },
  "/how-to-calculate-exact-age/": {
    label: "How to Calculate Your Exact Age",
    parent: "/blog/",
    canonical: "/blog/how-to-calculate-exact-age/",
  },
  "/marginal-vs-effective-tax-rate/": {
    label: "Marginal vs Effective Tax Rate",
    parent: "/blog/",
    canonical: "/blog/marginal-vs-effective-tax-rate/",
  },
  "/why-was-my-bonus-taxed-so-much/": {
    label: "Why Was My Bonus Taxed So Much?",
    parent: "/blog/",
    canonical: "/blog/why-was-my-bonus-taxed-so-much/",
  },
  "/online-privacy-security-basics/": {
    label: "What Your IP, DNS and Email Reveal",
    parent: "/blog/",
    canonical: "/blog/online-privacy-security-basics/",
  },
  "/zakat-on-gold-nisab-and-karat/": {
    label: "Zakat on Gold: Why Karat Decides the Answer",
    parent: "/blog/",
    canonical: "/blog/zakat-on-gold-nisab-and-karat/",
  },
  "/shrinkflation-and-unit-price/": {
    label: "Shrinkflation and the True Unit Price",
    parent: "/blog/",
    canonical: "/blog/shrinkflation-and-unit-price/",
  },

  // --- standalone pages --------------------------------------------------
  "/about-us/": { label: "About Us" },
  "/author/ashar-pervaiz/": { label: "Ashar Pervaiz", parent: "/about-us/" },
  "/contact-us/": { label: "Contact Us" },
  "/privacy-policy/": { label: "Privacy Policy" },
  "/terms-conditions/": { label: "Terms and Conditions" },
  "/cookies/": { label: "Cookie Policy" },
  "/disclaimer/": { label: "Disclaimer" },
};

/** Build the crumb trail for a pathname. Returns [] for the homepage and
 *  for any route with no entry (404, for example), so nothing renders. */
export function trailFor(pathname: string): Crumb[] {
  let p = pathname.endsWith("/") ? pathname : pathname + "/";
  let entry = PAGES[p];

  // Blog posts are built at the site root (/what-is-vat/) but served at
  // /blog/what-is-vat/ by the .htaccess rewrite. The static HTML is therefore
  // rendered for the root path while usePathname() reports the /blog/ path
  // after hydration — without this fallback the lookup misses on the client
  // and the whole breadcrumb unmounts a moment after the page appears.
  if (!entry && p.startsWith("/blog/") && p !== "/blog/") {
    const rootPath = p.slice("/blog".length);
    if (PAGES[rootPath]) {
      entry = PAGES[rootPath];
      p = rootPath;
    }
  }

  if (!entry) return [];

  const crumbs: Crumb[] = [{ label: "Home", href: "/" }];
  if (entry.parent) {
    crumbs.push({ label: SECTIONS[entry.parent] ?? "", href: entry.parent });
  }
  crumbs.push({ label: entry.label, href: entry.canonical ?? p });
  return crumbs;
}
