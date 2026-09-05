"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

type Currency = {
  code: string;
  name: string;
};

/* ─────────────────────────────────────────
   Fallback currency list
   Renders on the server and works instantly
   even before the live currency list loads
   (or if the rates API is unreachable).
───────────────────────────────────────── */
const POPULAR_CURRENCIES: Currency[] = [
  { code: "USD", name: "US Dollar" },
  { code: "EUR", name: "Euro" },
  { code: "GBP", name: "British Pound Sterling" },
  { code: "PKR", name: "Pakistani Rupee" },
  { code: "INR", name: "Indian Rupee" },
  { code: "AED", name: "UAE Dirham" },
  { code: "SAR", name: "Saudi Riyal" },
  { code: "CAD", name: "Canadian Dollar" },
  { code: "AUD", name: "Australian Dollar" },
  { code: "JPY", name: "Japanese Yen" },
  { code: "CNY", name: "Chinese Yuan" },
  { code: "CHF", name: "Swiss Franc" },
  { code: "BDT", name: "Bangladeshi Taka" },
  { code: "TRY", name: "Turkish Lira" },
  { code: "ZAR", name: "South African Rand" },
  { code: "NGN", name: "Nigerian Naira" },
  { code: "KES", name: "Kenyan Shilling" },
  { code: "SGD", name: "Singapore Dollar" },
  { code: "HKD", name: "Hong Kong Dollar" },
  { code: "NZD", name: "New Zealand Dollar" },
  { code: "SEK", name: "Swedish Krona" },
  { code: "NOK", name: "Norwegian Krone" },
  { code: "DKK", name: "Danish Krone" },
  { code: "PLN", name: "Polish Zloty" },
  { code: "MXN", name: "Mexican Peso" },
  { code: "BRL", name: "Brazilian Real" },
  { code: "EGP", name: "Egyptian Pound" },
  { code: "QAR", name: "Qatari Riyal" },
  { code: "KWD", name: "Kuwaiti Dinar" },
  { code: "LKR", name: "Sri Lankan Rupee" },
  { code: "NPR", name: "Nepalese Rupee" },
];

/* ─────────────────────────────────────────
   FAQ data (also used to build the FAQPage
   JSON-LD schema, so schema and on-page copy
   always match exactly)
───────────────────────────────────────── */
const faqs: [string, string][] = [
  [
    "Why is the rate I get worse than the rate I looked up?",
    "Because published rates are the mid-market rate — the midpoint between wholesale buying and selling prices — and almost nobody transacts at it. What you receive is that rate plus a margin, which is frequently presented as a rate rather than as a fee. Comparing the rate you were offered against the mid-market rate at that moment shows the true cost, whatever the fee line says.",
  ],
  [
    "Is a commission-free exchange actually free?",
    "Usually not. Charging nothing while moving the rate two or three percent is a common structure, and it costs more than a visible fee against a near-mid-market rate. A stated fee has the advantage of being comparable — you can add it up — whereas a margin built into the rate has to be worked out by comparing against mid-market.",
  ],
  [
    "Should I pay in my own currency when a card machine abroad offers?",
    "No — always choose the local currency. Being offered your home currency is dynamic currency conversion, which lets the merchant's payment provider set the exchange rate, and they set it in their favour. Declining lets your own card issuer convert instead, normally at a materially better rate. If a terminal shows two amounts, take the one in local money.",
  ],
  [
    "How do I work out what a transfer really cost?",
    "Divide the amount that arrived by the amount you sent to get your effective rate, then compare that against the mid-market rate at the time. Sending 1,000 and having 1,062 arrive when mid-market was 1.1000 means an effective rate of 1.0620 against a possible 1,100 — a cost of 38, or about 3.5%, however the provider described its charges.",
  ],
  [
    "Where is currency exchange most expensive?",
    "Airport and station desks, where the margin reflects the absence of alternatives rather than the cost of the service. High street bureaux are usually better and often improve for larger amounts. Cash withdrawals abroad can carry a transaction fee plus a cash advance charge if made on a credit card, which is easy to overlook.",
  ],
  [
    "Which rate should I use for an invoice or a tax return?",
    "The rate for the date the transaction occurred, not today's. That is the figure any audit will check against, and reconstructing it later is much harder than recording it at the time. Note both the rate and the date when the conversion happens, alongside the source you took it from.",
  ],
  [
    "How often do exchange rates change?",
    "Continuously during trading hours, so any rate you look up is a snapshot rather than a fixed price. For a small conversion the movement between checking and transacting is negligible; for a large transfer it can exceed the fee you were comparing. A quote is only valid for as long as the provider states.",
  ],
  [
    "Does my card charge extra for spending abroad?",
    "Many do, as a foreign transaction fee applied on top of the conversion. The difference between cards is often larger than the difference between exchange methods, so it is worth checking before travelling rather than discovering it on the statement afterwards.",
  ],
  [
    "Can I use these rates for an actual transaction?",
    "They are indicative and intended for estimating. Use them to compare options, budget a trip, or sanity-check a quote you have been given. For settlement, the rate that applies is the one your provider quotes at the moment the transaction executes, which will differ from any reference rate shown here.",
  ],
];

export default function CurrencyConverter() {
  const [amount, setAmount] = useState("1");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("PKR");
  const [currencies, setCurrencies] = useState<Currency[]>(POPULAR_CURRENCIES);
  const [rate, setRate] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

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

  /* Fetch the full 160+ currency list; fallback list stays in place if it fails */
  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const res = await fetch(
          `https://v6.exchangerate-api.com/v6/${process.env.NEXT_PUBLIC_EXCHANGE_API_KEY}/codes`,
        );
        const data = await res.json();
        if (Array.isArray(data.supported_codes)) {
          setCurrencies(
            data.supported_codes.map((c: [string, string]) => ({
              code: c[0],
              name: c[1],
            })),
          );
        }
      } catch {
        // keep the fallback POPULAR_CURRENCIES list
      }
    };
    fetchCurrencies();
  }, []);

  /* Fetch rate when from/to changes */
  useEffect(() => {
    const fetchRate = async () => {
      try {
        const res = await fetch(
          `https://v6.exchangerate-api.com/v6/${process.env.NEXT_PUBLIC_EXCHANGE_API_KEY}/pair/${from}/${to}`,
        );
        const data = await res.json();
        setRate(data.conversion_rate ?? null);
        setLastUpdated(data.time_last_update_utc ?? null);
      } catch {
        setRate(null);
        setLastUpdated(null);
      }
    };
    fetchRate();
  }, [from, to]);

  const convertedAmount =
    amount && rate ? (Number(amount) * rate).toFixed(2) : "";

  return (
    <div className="page-layout">
      {/* FAQ JSON-LD schema for rich results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map(([q, a]) => ({
              "@type": "Question",
              name: q,
              acceptedAnswer: { "@type": "Answer", text: a },
            })),
          }),
        }}
      />

      <div className="single-page-padding">
        <h1>Currency Converter — Live Exchange Rates</h1>

        <p>
          Convert any amount between 160+ world currencies using live,
          market-based exchange rates updated in real time. Enter an amount,
          pick your two currencies, and see the converted value along with the
          exact mid-market rate and the timestamp it was last updated.
        </p>

        <div className="calc-card single-calc">
          {/* FROM ROW */}
          <div style={{ display: "flex", gap: "10px", marginBottom: "14px" }}>
            <input
              className="calc-input"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{ flex: "1" }}
              aria-label="Amount to convert"
            />
            <select
              className="calc-input"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              style={{ flex: "2.5" }}
              aria-label="From currency"
            >
              {currencies.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name} ({c.code})
                </option>
              ))}
            </select>
          </div>

          {/* TO ROW */}
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              className="calc-input"
              type="text"
              value={convertedAmount}
              readOnly
              style={{ flex: "1" }}
              aria-label="Converted amount"
            />
            <select
              className="calc-input"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              style={{ flex: "2.5" }}
              aria-label="To currency"
            >
              {currencies.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name} ({c.code})
                </option>
              ))}
            </select>
          </div>

          {rate && (
            <div className="calc-result" style={{ marginTop: "10px" }}>
              1 {from} ≈ {rate.toFixed(4)} {to}
            </div>
          )}
          {lastUpdated && (
            <div
              className="calc-last-updated"
              style={{
                marginTop: "10px",
                fontSize: "0.9rem",
                color: "#ffffff",
              }}
            >
              Last updated: {new Date(Date.parse(lastUpdated)).toLocaleString()}
            </div>
          )}
        </div>

        {/* ---- SEO CONTENT ---- */}

        <h2>The Rate You See Is Not the Rate You Get</h2>
        <p>
          Look up an exchange rate anywhere and you will be shown the mid-market
          rate — the midpoint between what buyers are offering and what sellers
          are asking on the wholesale market. It is the honest reference rate,
          and almost nobody transacts at it.
        </p>
        <p>
          What you actually receive is that rate plus a margin. The margin is
          frequently presented as a favourable rate rather than as a fee, which
          is why an exchange advertised as commission-free can still be the more
          expensive option.
        </p>
        <pre>
          Mid-market rate: 1 unit = 1.1000{"\n"}Rate offered to you: 1 unit =
          1.0670{"\n"}
          {"\n"}Margin: 3% — charged as a rate, not shown as a fee
        </pre>
        <p>
          The way to see it is to compare the rate you were given against the
          mid-market rate for that moment. The gap is the true cost, whatever the
          fee line says.
        </p>

        <h2>Where the Cost Hides</h2>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Method</th>
                <th>Typical shape of the cost</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Airport exchange desks</td>
                <td>Very wide margin, often with a fixed fee on top</td>
              </tr>
              <tr>
                <td>High street bureaux</td>
                <td>Narrower margin; better rates for larger amounts</td>
              </tr>
              <tr>
                <td>Bank card abroad</td>
                <td>A card scheme rate plus a foreign transaction fee</td>
              </tr>
              <tr>
                <td>Cash withdrawal abroad</td>
                <td>
                  Transaction fee, plus a cash advance charge on credit cards
                </td>
              </tr>
              <tr>
                <td>Specialist transfer services</td>
                <td>An explicit fee against a rate near mid-market</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          The last row is worth noting because it looks worse and is often
          cheaper. A visible fee alongside a near-mid-market rate is usually
          better value than no fee and a rate quietly moved three percent, and it
          has the advantage of being comparable — you can add it up.
        </p>

        <h2>Always Decline Conversion at the Terminal</h2>
        <p>
          When a card machine or cash dispenser abroad offers to charge you in
          your home currency rather than the local one, that is dynamic currency
          conversion, and it is essentially always the worse choice.
        </p>
        <p>
          The offer sounds helpful — you see the amount in familiar money and
          avoid uncertainty. What you are agreeing to is letting the merchant&apos;s
          payment provider set the exchange rate, and they set it in their
          favour. Declining lets your own card issuer convert instead, usually at
          a materially better rate.
        </p>
        <p>
          The rule is simple: always pay in the local currency. If a terminal
          shows you two amounts and one is in your home currency, choose the
          other one.
        </p>

        <h2>Rates Move, and Quotes Go Stale</h2>
        <p>
          Currency rates change continuously during trading hours, so any rate
          you look up is a snapshot rather than a fixed price. For a small
          conversion the movement between checking and transacting is negligible.
          For a large transfer it can exceed the fee you were comparing.
        </p>
        <p>
          Two consequences follow. A quote is only valid for as long as the
          provider says it is, and a rate that looked good yesterday tells you
          nothing about today. And converting an amount for a document — an
          invoice, an expense claim, a tax return — should use the rate for the
          date the transaction occurred rather than today&apos;s, since that is
          the figure any audit will check against.
        </p>

        <h2>Working Out the True Cost of a Transfer</h2>
        <p>
          Comparing two providers means putting both on the same footing, which
          takes one calculation.
        </p>
        <pre>
          Amount actually received ÷ Amount sent = your effective rate{"\n"}
          Compare that against the mid-market rate at the time
        </pre>
        <p>
          Sending 1,000 and having 1,062 arrive when the mid-market rate was
          1.1000 means the effective rate was 1.0620, against a possible 1,100 —
          a cost of 38, or about 3.5%, regardless of how the provider described
          its charges.
        </p>
        <p>
          Do this once for each provider you are considering and the comparison
          becomes trivial. It also reveals the common case where a provider
          charging an explicit fee delivers more money than one charging nothing.
        </p>

        <h2>Practical Habits</h2>
        <ul className="custom-list">
          <li>
            Compare against the mid-market rate rather than against another
            provider&apos;s retail rate, so you are measuring the cost rather
            than choosing between two versions of it.
          </li>
          <li>
            Pay in local currency every time a terminal offers you a choice.
          </li>
          <li>
            Avoid exchanging at airports and stations, where the margin reflects
            the absence of alternatives rather than the cost of the service.
          </li>
          <li>
            For anything documented, record the rate and the date you used. Later
            reconstruction is much harder than noting it at the time.
          </li>
          <li>
            Check whether your card charges a foreign transaction fee before
            travelling, since the difference between cards is often larger than
            the difference between exchange methods.
          </li>
        </ul>
        <p>
          Rates shown here are indicative and intended for estimating rather than
          for settlement. For working out tax on a converted amount, the{" "}
          <Link href="/vat-calculator/" className="my-link">
            VAT calculator
          </Link>{" "}
          and{" "}
          <Link href="/income-tax-calculator/" className="my-link">
            income tax calculator
          </Link>{" "}
          handle those separately.
        </p>
        <section>
          <h2>Currency Exchange Questions</h2>

          {faqs.map(([q, a], i) => {
            const isOpen = openFAQ === i;
            return (
              <div className="faq-item" key={i}>
                <h3
                  onClick={() => toggleFAQ(i)}
                  onKeyDown={(e) => handleFAQKey(e, i)}
                  role="button"
                  tabIndex={0}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${i}`}
                >
                  {q}
                  <i
                    className={`fa-solid fa-chevron-down ${isOpen ? "rotate" : ""}`}
                    aria-hidden="true"
                  />
                </h3>
                <div
                  id={`faq-answer-${i}`}
                  className={`faq-answer-wrap ${isOpen ? "open" : ""}`}
                  aria-hidden={!isOpen}
                >
                  <div className="faq-answer-inner">
                    <p>{a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </section>

      </div>

      {/* ---- SIDEBAR ---- */}
      <aside className="sidebar">
        <div className="sidebar-box">
          <p style={{ fontSize: "18px", fontWeight: 600, margin: "0 0 12px" }}>
            Related Tools
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {[
              ["/image-converter/", "Image Converter"],
              ["/image-compressor/", "Image Compressor"],
              ["/image-resizer/", "Image Resizer"],
              ["/password-generator/", "Password Generator"],
              ["/text-generator/", "Text Generator"],
              ["/text-converter/", "Text Converter"],
              ["/word-char-counter/", "Word Counter"],
              ["/color-picker/", "Color Picker"],
            ].map(([href, label]) => (
              <li key={href} style={{ marginBottom: "6px" }}>
                <Link href={href} className="my-link">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
