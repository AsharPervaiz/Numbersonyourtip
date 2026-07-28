"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

type Currency = {
  code: string;
  name: string;
};

export default function CurrencyConverter() {
  const [amount, setAmount] = useState("1");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("PKR");
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [rate, setRate] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  /* Fetch all currencies */
  useEffect(() => {
    const fetchCurrencies = async () => {
      const res = await fetch(
        `https://v6.exchangerate-api.com/v6/${process.env.NEXT_PUBLIC_EXCHANGE_API_KEY}/codes`,
      );
      const data = await res.json();
      setCurrencies(
        data.supported_codes.map((c: [string, string]) => ({
          code: c[0],
          name: c[1],
        })),
      );
    };
    fetchCurrencies();
  }, []);

  /* Fetch rate when from/to changes */
  useEffect(() => {
    const fetchRate = async () => {
      const res = await fetch(
        `https://v6.exchangerate-api.com/v6/${process.env.NEXT_PUBLIC_EXCHANGE_API_KEY}/pair/${from}/${to}`,
      );
      const data = await res.json();
      setRate(data.conversion_rate);
      setLastUpdated(data.time_last_update_utc);
    };
    fetchRate();
  }, [from, to]);

  const convertedAmount =
    amount && rate ? (Number(amount) * rate).toFixed(2) : "";

  return (
    <>
      {/* ---- PAGE LAYOUT WRAPPER ---- */}
      <div className="page-layout single-page-padding">
        <div className="single-page-padding">
          <h1>Currency Converter — Live Exchange Rates</h1>

          <p>
            Select your currencies and enter an amount to get a live conversion
            instantly.
          </p>

          <div className="single-page-padding">
            <div className="calc-card single-calc">
              {/* FROM ROW */}
              <div
                style={{ display: "flex", gap: "10px", marginBottom: "14px" }}
              >
                <input
                  className="calc-input"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  style={{ flex: "1" }}
                />
                <select
                  className="calc-input"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  style={{ flex: "2.5" }}
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
                />
                <select
                  className="calc-input"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  style={{ flex: "2.5" }}
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
                  Last updated:{" "}
                  {new Date(Date.parse(lastUpdated)).toLocaleString()}
                </div>
              )}
            </div>
          </div>

          <h2>What Is a Currency Converter?</h2>
          <p>
            A <strong>currency converter</strong> is an online tool that
            calculates how much one currency is worth in another using live or
            updated <strong>exchange rates</strong>. Whether you're converting{" "}
            <strong>USD to PKR</strong>, <strong>EUR to USD</strong>, or any
            other currency pair, our free{" "}
            <strong>online currency converter</strong> gives you instant,
            accurate results based on real-time market rates — no registration
            required.
          </p>

          <h2>How Exchange Rates Work</h2>
          <p>
            An <strong>exchange rate</strong> tells you how much of one currency
            you need to buy one unit of another. For example, if the{" "}
            <strong>USD to EUR exchange rate</strong> is 0.92, one US dollar
            buys 0.92 euros. Exchange rates are not fixed — they fluctuate
            constantly based on supply and demand in global forex markets,
            interest rate decisions by central banks, inflation data, trade
            balances, and geopolitical events. Our converter pulls{" "}
            <strong>live exchange rates</strong> so your conversions always
            reflect current market conditions.
          </p>

          <h2>Most Searched Currency Conversions</h2>
          <p>
            Our tool supports 150+ currencies. Here are the most commonly
            converted currency pairs worldwide:
          </p>
          <ul className="custom-list">
            <li>
              <strong>USD to PKR</strong> — US Dollar to Pakistani Rupee
            </li>
            <li>
              <strong>USD to EUR</strong> — US Dollar to Euro
            </li>
            <li>
              <strong>USD to INR</strong> — US Dollar to Indian Rupee
            </li>
            <li>
              <strong>GBP to USD</strong> — British Pound to US Dollar
            </li>
            <li>
              <strong>EUR to USD</strong> — Euro to US Dollar
            </li>
            <li>
              <strong>USD to AED</strong> — US Dollar to UAE Dirham
            </li>
            <li>
              <strong>USD to SAR</strong> — US Dollar to Saudi Riyal
            </li>
            <li>
              <strong>USD to CAD</strong> — US Dollar to Canadian Dollar
            </li>
            <li>
              <strong>AUD to USD</strong> — Australian Dollar to US Dollar
            </li>
            <li>
              <strong>USD to JPY</strong> — US Dollar to Japanese Yen
            </li>
          </ul>

          <h2>How to Use the Currency Converter</h2>
          <p>
            Using our <strong>free currency converter</strong> is simple:
          </p>
          <ul className="custom-list">
            <li>
              <strong>Step 1:</strong> Enter the amount you want to convert in
              the top input field.
            </li>
            <li>
              <strong>Step 2:</strong> Select your source currency (the currency
              you have) from the first dropdown.
            </li>
            <li>
              <strong>Step 3:</strong> Select your target currency (the currency
              you want) from the second dropdown.
            </li>
            <li>
              <strong>Step 4:</strong> The converted amount and current exchange
              rate appear instantly — updated automatically as you change
              values.
            </li>
          </ul>

          <h2>Understanding Currency Exchange Rate Types</h2>

          <h3>1. Spot Rate (Live / Real-Time Rate)</h3>
          <p>
            The <strong>spot exchange rate</strong> is the current market rate
            at which two currencies can be exchanged immediately. This is the
            rate our converter uses, making it ideal for day traders, travelers
            checking live rates, and anyone needing the most current{" "}
            <strong>foreign exchange rate</strong>.
          </p>

          <h3>2. Mid-Market Rate</h3>
          <p>
            The <strong>mid-market rate</strong> (also called the interbank
            rate) is the midpoint between the buy and sell prices of two
            currencies. Banks and money transfer services typically add a markup
            above this rate. Our calculator displays the mid-market rate so you
            can compare it against what your bank or service charges.
          </p>

          <h3>3. Fixed vs. Floating Exchange Rates</h3>
          <p>
            Some currencies are <strong>pegged (fixed)</strong> to another
            currency — for example, the UAE Dirham (AED) is pegged to the US
            Dollar at a fixed rate of 3.6725. Most major currencies like the
            Euro, British Pound, and Japanese Yen are <strong>floating</strong>,
            meaning their value shifts with market forces daily.
          </p>

          <h2>Currency Conversion for Travel — What You Need to Know</h2>
          <p>
            When traveling internationally, <strong>currency conversion</strong>{" "}
            helps you budget accurately. A few important tips:
          </p>
          <ul className="custom-list">
            <li>
              <strong>Always check live rates</strong> before exchanging money
              at airports or hotels, which typically offer worse rates
            </li>
            <li>
              <strong>Use the mid-market rate as a benchmark</strong> — if a
              money changer's rate is significantly lower, look elsewhere
            </li>
            <li>
              <strong>Credit card foreign transaction fees</strong> typically
              add 1–3% on top of the exchange rate
            </li>
            <li>
              <strong>Dynamic currency conversion (DCC)</strong> at ATMs and
              shops abroad often applies unfavorable rates — always pay in the
              local currency
            </li>
          </ul>

          <h2>Benefits of Our Free Online Currency Converter</h2>
          <ul className="custom-list">
            <li>
              <strong>Live exchange rates</strong> — updated regularly for
              accurate, real-world conversions
            </li>
            <li>
              <strong>150+ currencies supported</strong> — including USD, EUR,
              GBP, INR, PKR, AED, SAR, JPY, CNY, CAD, AUD, and more
            </li>
            <li>
              <strong>Instant results</strong> — no button to press; conversion
              updates automatically
            </li>
            <li>
              <strong>Rate timestamp displayed</strong> — see exactly when the
              rate was last updated
            </li>
            <li>
              <strong>Free and mobile-friendly</strong> — works on any device
              with no sign-up or download required
            </li>
          </ul>

          <h2>Frequently Asked Questions About Currency Conversion</h2>

          <div className="faq-item">
            <h3 onClick={() => toggleFAQ(0)}>
              What is today's USD to PKR exchange rate?
              <i
                className={`fa-solid fa-chevron-down ${openFAQ === 0 ? "rotate" : ""}`}
              ></i>
            </h3>
            {openFAQ === 0 && (
              <p>
                The USD to PKR rate changes daily based on the forex market. Use
                the converter above — select USD as the source currency and PKR
                as the target — to see the current live exchange rate. The
                last-updated timestamp below the result tells you exactly how
                recent the rate is.
              </p>
            )}
          </div>

          <div className="faq-item">
            <h3 onClick={() => toggleFAQ(1)}>
              Does this converter use live exchange rates?
              <i
                className={`fa-solid fa-chevron-down ${openFAQ === 1 ? "rotate" : ""}`}
              ></i>
            </h3>
            {openFAQ === 1 && (
              <p>
                Yes. Our currency converter uses real-time, market-based
                exchange rates sourced from a reliable forex data provider.
                Every conversion reflects the most recently available rate, and
                the exact timestamp of the last update is displayed below the
                result so you always know how current the data is.
              </p>
            )}
          </div>

          <div className="faq-item">
            <h3 onClick={() => toggleFAQ(2)}>
              How many currencies does this converter support?
              <i
                className={`fa-solid fa-chevron-down ${openFAQ === 2 ? "rotate" : ""}`}
              ></i>
            </h3>
            {openFAQ === 2 && (
              <p>
                Our tool supports over <strong>150 global currencies</strong>,
                covering all major world currencies (USD, EUR, GBP, JPY, CNY,
                INR, AUD, CAD) as well as regional currencies across Asia, the
                Middle East, Africa, and Latin America including PKR, AED, SAR,
                BDT, NGN, KES, and many more.
              </p>
            )}
          </div>

          <div className="faq-item">
            <h3 onClick={() => toggleFAQ(3)}>
              What is the difference between the exchange rate and the
              mid-market rate?
              <i
                className={`fa-solid fa-chevron-down ${openFAQ === 3 ? "rotate" : ""}`}
              ></i>
            </h3>
            {openFAQ === 3 && (
              <p>
                The <strong>mid-market rate</strong> is the pure interbank rate
                — the midpoint between buy and sell prices — with no markup
                applied. Banks, airports, and transfer services add a margin
                above this rate as their fee or profit. Our converter shows the
                mid-market rate, which you can use as a benchmark to evaluate
                how good or bad the rate your bank or money changer is offering
                actually is.
              </p>
            )}
          </div>

          <div className="faq-item">
            <h3 onClick={() => toggleFAQ(4)}>
              Can I use this converter to send money abroad?
              <i
                className={`fa-solid fa-chevron-down ${openFAQ === 4 ? "rotate" : ""}`}
              ></i>
            </h3>
            {openFAQ === 4 && (
              <p>
                Our tool shows you the converted amount and live exchange rate
                so you can calculate exactly how much the recipient will get.
                However, actual money transfers require a payment service (such
                as Wise, Western Union, or your bank). Use our converter to
                compare the rate offered by any transfer service against the
                live mid-market rate before sending money internationally.
              </p>
            )}
          </div>

          <div className="faq-item">
            <h3 onClick={() => toggleFAQ(5)}>
              Why do exchange rates change every day?
              <i
                className={`fa-solid fa-chevron-down ${openFAQ === 5 ? "rotate" : ""}`}
              ></i>
            </h3>
            {openFAQ === 5 && (
              <p>
                Exchange rates fluctuate because currency values are determined
                by supply and demand in global forex markets, which operate 24
                hours a day. Key factors that move exchange rates include
                central bank interest rate decisions, inflation data, GDP
                growth, trade balances, political stability, and market
                sentiment. Major news events — such as a U.S. Federal Reserve
                rate announcement — can shift exchange rates significantly
                within minutes.
              </p>
            )}
          </div>

          <div className="faq-item">
            <h3 onClick={() => toggleFAQ(6)}>
              Is this currency converter free?
              <i
                className={`fa-solid fa-chevron-down ${openFAQ === 6 ? "rotate" : ""}`}
              ></i>
            </h3>
            {openFAQ === 6 && (
              <p>
                Yes — completely free with no account, no subscription, and no
                hidden fees. Simply open the page, select your currencies, enter
                an amount, and get the converted value instantly. It works on
                all devices including smartphones, tablets, and desktops.
              </p>
            )}
          </div>
        </div>

        {/* ---- SIDEBAR ---- */}
        <aside className="sidebar">
          <div className="sidebar-box">
            <p style={{ fontSize: "20px", fontWeight: 600 }}>Related Tools</p>
            <ul style={{ listStyle: "none", padding: 0 }}>
              <li>
                <Link href="/image-converter/">
                  <span
                    style={{ textDecoration: "none" }}
                    className="hover-item"
                  >
                    Image Converter
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/image-compressor/">
                  <span
                    style={{ textDecoration: "none" }}
                    className="hover-item"
                  >
                    Image Compressor
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/image-resizer/">
                  <span
                    style={{ textDecoration: "none" }}
                    className="hover-item"
                  >
                    Image Resizer
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/password-generator/">
                  <span
                    style={{ textDecoration: "none" }}
                    className="hover-item"
                  >
                    Password Generator
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/text-generator/">
                  <span
                    style={{ textDecoration: "none" }}
                    className="hover-item"
                  >
                    Text Generator
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/text-converter/">
                  <span
                    style={{ textDecoration: "none" }}
                    className="hover-item"
                  >
                    Text Converter
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/word-char-counter/">
                  <span
                    style={{ textDecoration: "none" }}
                    className="hover-item"
                  >
                    Word Counter
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/color-picker/">
                  <span
                    style={{ textDecoration: "none" }}
                    className="hover-item"
                  >
                    Color Picker
                  </span>
                </Link>
              </li>

              <style jsx>{`
                .hover-item:hover {
                  text-decoration: underline;
                }
              `}</style>
            </ul>
          </div>
        </aside>
      </div>
    </>
  );
}
