"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";

/* ─────────────────────────────────────────
   Weight units, in grams.

   The South Asian units are exact by definition: a tola is 11.664 g
   (3/8 of a troy ounce, historically), 1 tola = 12 masha and
   1 masha = 8 ratti. The troy ounce is the unit every gold chart in
   the world quotes, and it is heavier than the avoirdupois ounce a
   kitchen scale uses — 31.1035 g against 28.3495 g. Mixing the two
   overstates a holding by about 9.6%, which is the single most common
   arithmetic error in a home gold valuation.
───────────────────────────────────────── */
const WEIGHT_UNITS = {
  g: { label: "Gram (g)", grams: 1 },
  kg: { label: "Kilogram (kg)", grams: 1000 },
  tola: { label: "Tola", grams: 11.664 },
  masha: { label: "Masha", grams: 0.972 },
  ratti: { label: "Ratti", grams: 0.1215 },
  ozt: { label: "Troy ounce (ozt)", grams: 31.1034768 },
  oz: { label: "Ounce (oz)", grams: 28.349523125 },
  dwt: { label: "Pennyweight (dwt)", grams: 1.55517384 },
} as const;

type UnitKey = keyof typeof WEIGHT_UNITS;

/* Hallmark fineness in parts per thousand. These are the stamped
   standards, not karat/24 — a 22K piece is stamped 916 although
   22/24 is 91.667%, and 14K is stamped 585 although 14/24 is 58.33%.
   Using the stamp is what an assay office and a buyer both go by. */
const GOLD_PURITIES = [
  { k: "24K", fine: 999 },
  { k: "23K", fine: 958 },
  { k: "22K", fine: 916 },
  { k: "21K", fine: 875 },
  { k: "20K", fine: 833 },
  { k: "18K", fine: 750 },
  { k: "14K", fine: 585 },
  { k: "10K", fine: 417 },
  { k: "9K", fine: 375 },
];

const SILVER_PURITIES = [
  { k: "Fine", fine: 999 },
  { k: "Britannia", fine: 958 },
  { k: "Sterling", fine: 925 },
  { k: "Coin", fine: 900 },
  { k: "Continental", fine: 800 },
];

const CURRENCIES = [
  "USD", "PKR", "INR", "BDT", "GBP", "EUR", "SAR", "AED", "LKR", "NPR",
  "QAR", "KWD", "OMR", "EGP", "TRY", "MYR", "IDR", "ZAR", "NGN", "CAD",
  "AUD", "SGD",
];

/* Zakat nisab, as weight of the pure metal. */
const NISAB_GOLD_G = 87.48;
const NISAB_SILVER_G = 612.36;

type Metal = "gold" | "silver";
type MakingMode = "percent" | "flat";

const num = (s: string) => {
  const v = parseFloat(s.replace(/,/g, ""));
  return Number.isFinite(v) ? v : NaN;
};

function money(v: number, ccy: string) {
  if (!Number.isFinite(v)) return "—";
  const frac = Math.abs(v) >= 1000 ? 0 : 2;
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: ccy,
      maximumFractionDigits: frac,
      minimumFractionDigits: frac,
    }).format(v);
  } catch {
    return `${ccy} ${v.toFixed(frac)}`;
  }
}

const grams = (v: number) =>
  !Number.isFinite(v)
    ? "—"
    : v >= 100
      ? v.toFixed(1) + " g"
      : v >= 1
        ? v.toFixed(2) + " g"
        : v.toFixed(4) + " g";

const FAQ_DATA: [string, string][] = [
  [
    "Why is the ounce on a gold chart heavier than an ordinary ounce?",
    "Precious metals are weighed in troy ounces, which are 31.1035 grams. The avoirdupois ounce used for food and post is 28.3495 grams. A troy ounce is about 9.6% heavier, so converting a gold price with the wrong ounce understates the per-gram rate by roughly the same margin. This calculator lists both separately so the choice is explicit.",
  ],
  [
    "Is 22K gold 91.6% pure or 91.67% pure?",
    "Both numbers are defensible. Twenty-two parts in twenty-four is 91.667%, but the hallmark stamped on the piece is 916, meaning 91.6%. Assay offices and buyers work to the stamp, so this calculator uses the hallmark fineness. The difference is about seven hundredths of a percent, which on a tola of gold is a fraction of a gram — immaterial for a valuation, but worth knowing why two sources quote different figures.",
  ],
  [
    "How much gold is one tola?",
    "One tola is 11.664 grams exactly. It subdivides into 12 masha, and each masha into 8 ratti, so a tola is 96 ratti. The unit is still standard in Pakistan and parts of India, where gold rates are usually quoted per tola rather than per gram, and it is not a rounded version of any metric unit.",
  ],
  [
    "Why is the resale figure so much lower than what I paid?",
    "Because making charges, wastage and sales tax buy you craftsmanship and a receipt, not metal. When you sell, a jeweller pays for the metal content alone, and often applies a further deduction for refining. Everything above the metal value is spent on the way in and is not recoverable on the way out. The calculator shows both figures side by side so the gap is visible before you buy rather than after you sell.",
  ],
  [
    "Should I use the international spot price or my local rate?",
    "Use your local rate if you have one. Local markets add import duty, dealer premium and currency effects on top of international spot, and in Pakistan the per-tola rate is set by the local association rather than derived directly from the London price. The live spot figure here is a sanity check and a starting point, not a substitute for the rate your own market is quoting today.",
  ],
  [
    "Does this calculator tell me how much zakat I owe?",
    "It tells you the zakat due on this holding at 2.5%, and whether the holding on its own reaches the gold nisab of 87.48 grams of pure gold. It cannot tell you whether zakat is due overall, because nisab is assessed against your total zakatable wealth — gold, silver, cash, business assets and receivables combined — after deducting eligible debts, and only once a full lunar year has passed. Treat the figure here as one input to that larger sum.",
  ],
  [
    "What is wastage, and is it the same as making charges?",
    "They are separate. Making charges pay for the labour and design of the piece. Wastage is an extra percentage of gold weight the jeweller bills for, on the argument that metal is lost during manufacture. Some jewellers fold wastage into making charges, others itemise both, and a few bill wastage without naming it. Asking for the invoice to show gold value, making and wastage on separate lines is the simplest way to compare two quotes honestly.",
  ],
];

type Live = { gold: number; silver: number; at: string } | null;

export default function GoldCalculator() {
  const [metal, setMetal] = useState<Metal>("gold");
  const [weight, setWeight] = useState("1");
  const [unit, setUnit] = useState<UnitKey>("tola");
  const [fine, setFine] = useState(916);
  const [customFine, setCustomFine] = useState("");
  const [ccy, setCcy] = useState("PKR");
  const [rate, setRate] = useState("");
  const [rateUnit, setRateUnit] = useState<UnitKey>("tola");
  const [rateFine, setRateFine] = useState(999);

  const [showCosts, setShowCosts] = useState(false);
  const [makingMode, setMakingMode] = useState<MakingMode>("percent");
  const [making, setMaking] = useState("");
  const [wastage, setWastage] = useState("");
  const [tax, setTax] = useState("");
  const [buyback, setBuyback] = useState("");

  const [live, setLive] = useState<Live>(null);
  const [fx, setFx] = useState<number | null>(null);
  const [liveState, setLiveState] = useState<"idle" | "loading" | "fail">(
    "loading",
  );
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const toggleFAQ = (i: number) => setOpenFAQ(openFAQ === i ? null : i);

  const purities = metal === "gold" ? GOLD_PURITIES : SILVER_PURITIES;

  /* Keep the purity selection valid when the metal changes: 916 has no
     meaning for silver, and 925 has none for gold. */
  useEffect(() => {
    const ok = (metal === "gold" ? GOLD_PURITIES : SILVER_PURITIES).some(
      (p) => p.fine === fine,
    );
    if (!ok && !customFine) setFine(metal === "gold" ? 916 : 925);
    setRateFine(999);
  }, [metal]); // eslint-disable-line react-hooks/exhaustive-deps

  /* Live spot, in USD per troy ounce. No API key, CORS open. If it fails
     the tool is unaffected — the rate field is the real input and this
     only ever pre-fills it. */
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [g, s] = await Promise.all([
          fetch("https://api.gold-api.com/price/XAU").then((r) => r.json()),
          fetch("https://api.gold-api.com/price/XAG").then((r) => r.json()),
        ]);
        if (!alive) return;
        if (typeof g?.price === "number" && typeof s?.price === "number") {
          setLive({ gold: g.price, silver: s.price, at: g.updatedAt ?? "" });
          setLiveState("idle");
        } else setLiveState("fail");
      } catch {
        if (alive) setLiveState("fail");
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  /* USD -> selected currency. Reuses the key the currency converter uses. */
  useEffect(() => {
    let alive = true;
    if (ccy === "USD") {
      setFx(1);
      return;
    }
    setFx(null);
    (async () => {
      try {
        const r = await fetch(
          `https://v6.exchangerate-api.com/v6/${process.env.NEXT_PUBLIC_EXCHANGE_API_KEY}/pair/USD/${ccy}`,
        );
        const j = await r.json();
        if (alive && typeof j?.conversion_rate === "number")
          setFx(j.conversion_rate);
      } catch {
        /* leave fx null — the spot helper simply will not offer a figure */
      }
    })();
    return () => {
      alive = false;
    };
  }, [ccy]);

  const effFine = customFine ? num(customFine) : fine;

  /* Spot for the chosen metal, expressed in the chosen currency and the
     chosen rate unit, at the purity the rate is quoted for. */
  const spotForRateField = useMemo(() => {
    if (!live || fx === null) return null;
    const perTroyOz = metal === "gold" ? live.gold : live.silver;
    const perGramFine = (perTroyOz / WEIGHT_UNITS.ozt.grams) * fx;
    return perGramFine * (rateFine / 1000) * WEIGHT_UNITS[rateUnit].grams;
  }, [live, fx, metal, rateUnit, rateFine]);

  const r = useMemo(() => {
    const w = num(weight);
    const p = num(rate);
    if (!Number.isFinite(w) || w <= 0) return null;
    if (!Number.isFinite(effFine) || effFine <= 0 || effFine > 1000) return null;
    if (!Number.isFinite(p) || p <= 0) return null;

    const totalGrams = w * WEIGHT_UNITS[unit].grams;
    const pureGrams = totalGrams * (effFine / 1000);

    /* Convert the quoted rate to a price per gram of *pure* metal, so the
       item's own purity and the rate's purity never get conflated. */
    const perGramPure =
      p / WEIGHT_UNITS[rateUnit].grams / (rateFine / 1000);
    const metalValue = pureGrams * perGramPure;

    const wast = Number.isFinite(num(wastage)) ? num(wastage) : 0;
    const wastageValue = metalValue * (wast / 100);

    let makingValue = 0;
    const mk = num(making);
    if (Number.isFinite(mk) && mk > 0) {
      makingValue =
        makingMode === "percent"
          ? metalValue * (mk / 100)
          : mk * (totalGrams / WEIGHT_UNITS[unit].grams);
    }

    const preTax = metalValue + wastageValue + makingValue;
    const tx = Number.isFinite(num(tax)) ? num(tax) : 0;
    const taxValue = preTax * (tx / 100);
    const counter = preTax + taxValue;

    const bb = Number.isFinite(num(buyback)) ? num(buyback) : 0;
    const resale = metalValue * (1 - bb / 100);

    const spread = counter - resale;
    const spreadPct = counter > 0 ? (spread / counter) * 100 : 0;

    const nisabG = metal === "gold" ? NISAB_GOLD_G : NISAB_SILVER_G;

    return {
      totalGrams,
      pureGrams,
      perGramPure,
      metalValue,
      wastageValue,
      makingValue,
      taxValue,
      counter,
      resale,
      spread,
      spreadPct,
      hasCosts: makingValue > 0 || wastageValue > 0 || taxValue > 0,
      zakat: metalValue * 0.025,
      nisabG,
      meetsNisab: pureGrams >= nisabG,
      nisabPct: (pureGrams / nisabG) * 100,
    };
  }, [
    weight, unit, effFine, rate, rateUnit, rateFine, metal,
    making, makingMode, wastage, tax, buyback,
  ]);

  const useSpot = () => {
    if (spotForRateField) setRate(spotForRateField.toFixed(2));
  };

  const clear = () => {
    setWeight("");
    setRate("");
    setMaking("");
    setWastage("");
    setTax("");
    setBuyback("");
    setCustomFine("");
  };

  const panel = !r ? (
    <div className="cr-panel-placeholder">
      <div className="cr-ph-icon">
        <i className="fa-solid fa-coins" aria-hidden="true" />
      </div>
      Enter a weight and a rate to value the piece. Everything else is optional
      — leave the cost boxes empty and you get the plain metal value.
    </div>
  ) : (
    <div className="cr-panel">
      {
        <>
          <span className="gc-eyebrow">Metal value</span>
          <div className="gc-answer">{money(r.metalValue, ccy)}</div>
          <p className="gc-sub">
            {grams(r.pureGrams)} of pure {metal} in {grams(r.totalGrams)} total
          </p>

          {r.hasCosts && (
            <div className="gc-flow">
              <div className="gc-flow-row">
                <span>Metal value</span>
                <strong>{money(r.metalValue, ccy)}</strong>
              </div>
              {r.wastageValue > 0 && (
                <div className="gc-flow-row">
                  <span>Wastage</span>
                  <strong>+ {money(r.wastageValue, ccy)}</strong>
                </div>
              )}
              {r.makingValue > 0 && (
                <div className="gc-flow-row">
                  <span>Making charges</span>
                  <strong>+ {money(r.makingValue, ccy)}</strong>
                </div>
              )}
              {r.taxValue > 0 && (
                <div className="gc-flow-row">
                  <span>Tax</span>
                  <strong>+ {money(r.taxValue, ccy)}</strong>
                </div>
              )}
              <div className="gc-flow-row gc-flow-total">
                <span>You pay</span>
                <strong>{money(r.counter, ccy)}</strong>
              </div>
              <div className="gc-flow-row gc-flow-back">
                <span>You get back</span>
                <strong>{money(r.resale, ccy)}</strong>
              </div>
              <div className="gc-spread">
                <span>
                  Round-trip cost — buying and selling back at today&rsquo;s
                  rate
                </span>
                <strong>
                  {money(r.spread, ccy)}
                  <em>{r.spreadPct.toFixed(1)}% of what you pay</em>
                </strong>
              </div>
            </div>
          )}

          <div className="gc-grid">
            <div>
              <strong>{money(r.perGramPure, ccy)}</strong>
              <em>per gram, pure metal</em>
            </div>
            <div>
              <strong>{(effFine / 10).toFixed(1)}%</strong>
              <em>purity used ({effFine} fine)</em>
            </div>
            <div>
              <strong>{money(r.zakat, ccy)}</strong>
              <em>zakat at 2.5% on this holding</em>
            </div>
            <div>
              <strong>{r.meetsNisab ? "Reaches" : "Below"}</strong>
              <em>
                {metal} nisab ({r.nisabG} g) — {r.nisabPct.toFixed(0)}%
              </em>
            </div>
          </div>

          <p className="gc-note">
            Nisab is judged on your total zakatable wealth, not one item. This
            row only shows where this holding sits against the {metal} nisab on
            its own.
          </p>
        </>
      }
    </div>
  );

  return (
    <div className="page-layout">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQ_DATA.map(([q, ans]) => ({
              "@type": "Question",
              name: q,
              acceptedAnswer: { "@type": "Answer", text: ans },
            })),
          }),
        }}
      />

      <div className="gc-main">
        <h1>Gold Calculator — Value, Purity, Resale and Zakat</h1>
        <p>
          Value gold or silver by weight and purity in grams, tola, masha or
          troy ounces, then see the two numbers that matter and rarely appear
          together: what a jeweller will charge you once making charges,
          wastage and tax are added, and what the same piece is worth when you
          sell it back.
        </p>

        <div className="calc-card single-calc">
          <div className="gc-metal-row">
            {(["gold", "silver"] as Metal[]).map((m) => (
              <button
                key={m}
                type="button"
                className={`gc-metal ${metal === m ? "active" : ""}`}
                onClick={() => setMetal(m)}
                aria-pressed={metal === m}
              >
                {m === "gold" ? "Gold" : "Silver"}
              </button>
            ))}
          </div>

          <div className="gc-row">
            <div className="gc-field gc-grow">
              <label className="gc-label" htmlFor="gc-weight">
                Weight
              </label>
              <input
                id="gc-weight"
                inputMode="decimal"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="1"
              />
            </div>
            <div className="gc-field">
              <label className="gc-label" htmlFor="gc-unit">
                Unit
              </label>
              <select
                id="gc-unit"
                value={unit}
                onChange={(e) => setUnit(e.target.value as UnitKey)}
              >
                {Object.entries(WEIGHT_UNITS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="gc-field">
              <label className="gc-label" htmlFor="gc-fine">
                Purity
              </label>
              <select
                id="gc-fine"
                value={customFine ? "custom" : String(fine)}
                onChange={(e) => {
                  if (e.target.value === "custom") setCustomFine("916");
                  else {
                    setCustomFine("");
                    setFine(Number(e.target.value));
                  }
                }}
              >
                {purities.map((p) => (
                  <option key={p.fine} value={p.fine}>
                    {p.k} · {p.fine}
                  </option>
                ))}
                <option value="custom">Custom fineness…</option>
              </select>
            </div>
          </div>

          {customFine !== "" && (
            <div className="gc-row">
              <div className="gc-field gc-grow">
                <label className="gc-label" htmlFor="gc-custom">
                  Fineness (parts per thousand, 1–1000)
                </label>
                <input
                  id="gc-custom"
                  inputMode="decimal"
                  value={customFine}
                  onChange={(e) => setCustomFine(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="gc-row">
            <div className="gc-field gc-grow">
              <label className="gc-label" htmlFor="gc-rate">
                Rate
              </label>
              <input
                id="gc-rate"
                inputMode="decimal"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                placeholder="today's rate"
              />
            </div>
            <div className="gc-field">
              <label className="gc-label" htmlFor="gc-ccy">
                Currency
              </label>
              <select
                id="gc-ccy"
                value={ccy}
                onChange={(e) => setCcy(e.target.value)}
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="gc-field">
              <label className="gc-label" htmlFor="gc-rate-unit">
                Rate is per
              </label>
              <select
                id="gc-rate-unit"
                value={rateUnit}
                onChange={(e) => setRateUnit(e.target.value as UnitKey)}
              >
                {Object.entries(WEIGHT_UNITS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="gc-field">
              <label className="gc-label" htmlFor="gc-rate-fine">
                Rate is for
              </label>
              <select
                id="gc-rate-fine"
                value={rateFine}
                onChange={(e) => setRateFine(Number(e.target.value))}
              >
                {purities.map((p) => (
                  <option key={p.fine} value={p.fine}>
                    {p.k} · {p.fine}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <p className="gc-spot">
            {liveState === "loading" && "Fetching international spot…"}
            {liveState === "fail" &&
              "Live spot unavailable right now — enter your local rate above."}
            {liveState === "idle" && spotForRateField && (
              <>
                International spot works out to{" "}
                <strong>{money(spotForRateField, ccy)}</strong> per{" "}
                {WEIGHT_UNITS[rateUnit].label.replace(/ \(.*\)/, "")} at{" "}
                {rateFine} fine.{" "}
                <button type="button" className="gc-link" onClick={useSpot}>
                  Use this
                </button>
                <span className="gc-spot-note">
                  Local rates usually sit above spot once duty and dealer
                  premium are added.
                </span>
              </>
            )}
            {liveState === "idle" && !spotForRateField && (
              <>Enter your local rate above.</>
            )}
          </p>

          <button
            type="button"
            className="gc-toggle"
            onClick={() => setShowCosts(!showCosts)}
            aria-expanded={showCosts}
          >
            <i
              className={`fa-solid fa-chevron-down ${showCosts ? "rotate" : ""}`}
              aria-hidden="true"
            />
            {showCosts ? "Hide" : "Add"} making charges, wastage and tax
          </button>

          {showCosts && (
            <div className="gc-costs">
              <div className="gc-row">
                <div className="gc-field gc-grow">
                  <label className="gc-label" htmlFor="gc-making">
                    Making charges
                  </label>
                  <input
                    id="gc-making"
                    inputMode="decimal"
                    value={making}
                    onChange={(e) => setMaking(e.target.value)}
                    placeholder={makingMode === "percent" ? "e.g. 12" : "per unit"}
                  />
                </div>
                <div className="gc-field">
                  <label className="gc-label" htmlFor="gc-making-mode">
                    Charged as
                  </label>
                  <select
                    id="gc-making-mode"
                    value={makingMode}
                    onChange={(e) =>
                      setMakingMode(e.target.value as MakingMode)
                    }
                  >
                    <option value="percent">% of metal value</option>
                    <option value="flat">
                      Flat per {WEIGHT_UNITS[unit].label.replace(/ \(.*\)/, "")}
                    </option>
                  </select>
                </div>
                <div className="gc-field">
                  <label className="gc-label" htmlFor="gc-wastage">
                    Wastage %
                  </label>
                  <input
                    id="gc-wastage"
                    inputMode="decimal"
                    value={wastage}
                    onChange={(e) => setWastage(e.target.value)}
                    placeholder="e.g. 5"
                  />
                </div>
              </div>
              <div className="gc-row">
                <div className="gc-field gc-grow">
                  <label className="gc-label" htmlFor="gc-tax">
                    Sales tax / GST %
                  </label>
                  <input
                    id="gc-tax"
                    inputMode="decimal"
                    value={tax}
                    onChange={(e) => setTax(e.target.value)}
                    placeholder="e.g. 3"
                  />
                </div>
                <div className="gc-field gc-grow">
                  <label className="gc-label" htmlFor="gc-buyback">
                    Buy-back deduction %
                  </label>
                  <input
                    id="gc-buyback"
                    inputMode="decimal"
                    value={buyback}
                    onChange={(e) => setBuyback(e.target.value)}
                    placeholder="e.g. 3"
                  />
                </div>
              </div>
              <p className="gc-hint">
                Making charges commonly run 6–25% of metal value, wastage 2–8%,
                and a buy-back deduction 0–5%. Ask for all three as separate
                lines on the invoice — a single bundled figure hides which one
                is being marked up.
              </p>
            </div>
          )}

          <div style={{ display: "flex", gap: "10px" }}>
            <button className="calc-button calc-clear" onClick={clear}>
              Clear
            </button>
          </div>
        </div>

        <div className="cr-mobile-slot">{panel}</div>

        {/* ── SEO CONTENT ── */}

        <h2>What You Pay and What You Get Back Are Two Different Numbers</h2>
        <p>
          A gold purchase has a price and a value, and they are not the same
          thing. The price includes the metal, the labour that shaped it, an
          allowance for metal lost in manufacture, and tax. The value, on the
          day you sell, is the metal and nothing else.
        </p>
        <p>
          That gap is the single most expensive thing about buying jewellery,
          and it is almost never quoted. Take a tola of 22K bought with 12%
          making charges, 5% wastage and 3% tax. The metal is worth what it is
          worth; the invoice comes to about 20% more. Sell it back the same
          afternoon, before the rate has moved at all, and a buyer pays for the
          gold content — say 3% under it, if they deduct for refining. The
          round trip has cost a little under a fifth of the purchase price
          without a single movement in the market, and at the upper end of
          making charges it passes a quarter.
        </p>
        <p>
          None of this means jewellery is a bad purchase. It means jewellery is
          a purchase, and gold bought as a store of value behaves differently
          from gold bought to wear. The calculator above puts both figures on
          screen at once so the decision is made with the spread visible rather
          than discovered years later.
        </p>

        <h2>Karat Is a Claim About Purity, Not a Weight</h2>
        <p>
          Karat measures how much of an alloy is gold, in twenty-fourths. Pure
          gold is 24 parts in 24; 22K is 22 parts gold and 2 parts something
          else, usually copper and silver. It says nothing about how heavy the
          piece is, which is why a valuation always needs both numbers.
        </p>
        <p>
          Fineness expresses the same idea in parts per thousand, and it is what
          the hallmark actually stamps. The two rarely agree exactly, because
          the stamped standards are rounded down to protect the buyer.
        </p>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Karat</th>
                <th>Arithmetic (k/24)</th>
                <th>Hallmark stamp</th>
                <th>Gold in 10 g</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["24K", "100%", "999", "9.99 g"],
                ["22K", "91.67%", "916", "9.16 g"],
                ["21K", "87.5%", "875", "8.75 g"],
                ["18K", "75%", "750", "7.50 g"],
                ["14K", "58.33%", "585", "5.85 g"],
                ["9K", "37.5%", "375", "3.75 g"],
              ].map((row) => (
                <tr key={row[0]}>
                  {row.map((c, i) => (
                    <td key={i}>{c}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p>
          The practical consequence is that two pieces of identical weight can
          differ in value by a third or more, and that a rate quoted &ldquo;per
          tola&rdquo; is meaningless until you know which purity it refers to.
          Markets that quote a 22K rate and markets that quote a 24K rate are
          both common, which is why the calculator asks separately what purity
          your rate is for and what purity your piece is.
        </p>

        <h2>The Tola Is Not a Rounded Gram</h2>
        <p>
          A tola is 11.664 grams — an exact figure, not an approximation of
          twelve. It descends from the British Indian rupee coin and survives as
          the standard trading unit for gold across Pakistan and much of India,
          where rates are quoted per tola and jewellery is sold by it.
        </p>
        <p>
          It subdivides in eights and twelves rather than tens: twelve masha to
          a tola, eight ratti to a masha, so ninety-six ratti in a tola. Older
          receipts and inherited pieces are often described this way, and
          converting them by treating a tola as &ldquo;about 11.7 grams&rdquo;
          introduces an error that compounds across a set.
        </p>

        <h2>Why the Ounce on a Gold Chart Is Heavier Than the One in Your Kitchen</h2>
        <p>
          International gold prices are quoted per troy ounce, which is 31.1035
          grams. The ounce on a kitchen scale is the avoirdupois ounce, 28.3495
          grams. The troy ounce is about 9.6% heavier.
        </p>
        <p>
          This is a genuine trap when converting a headline price into a local
          per-gram figure. Divide a spot price by 28.35 instead of 31.10 and the
          per-gram rate comes out roughly a tenth too high — enough to make a
          jeweller&rsquo;s honest quote look like an overcharge, or to overstate
          a holding by thousands. The calculator lists troy ounce and ounce as
          separate units for exactly this reason, and defaults gold work to the
          troy ounce.
        </p>

        <h2>Making Charges and Wastage Are Two Separate Deductions</h2>
        <p>
          Making charges pay for design and labour. They are usually quoted as a
          percentage of metal value, though some jewellers charge a flat amount
          per gram or per tola, which works out very differently on a light,
          intricate piece than on a heavy plain one.
        </p>
        <p>
          Wastage is a separate line: an extra percentage of gold weight billed
          on the argument that metal is lost during manufacture. Modern
          workshops recover most of it, so wastage is best understood as a
          negotiable margin rather than a physical fact.
        </p>
        <p>
          The reason to insist on seeing them separately is that a single
          bundled &ldquo;making&rdquo; figure makes two quotes impossible to
          compare. A jeweller quoting 8% making and 8% wastage is charging more
          than one quoting 14% making and none, and no amount of staring at the
          headline percentage will reveal it.
        </p>

        <h2>Local Rates Drift From International Spot</h2>
        <p>
          Spot is a wholesale price for large, deliverable bars in London and
          New York. What a local market quotes adds import duty, dealer margin,
          local demand and the exchange rate, and in Pakistan the per-tola rate
          is set by the local jewellers&rsquo; association rather than derived
          mechanically from the London fix.
        </p>
        <p>
          The live figure shown above is therefore a reference point, not an
          authority. Where the two diverge by a few per cent, the local rate is
          the one you will actually transact at. Where they diverge by a great
          deal, that itself is worth asking about before signing anything.
        </p>

        <h2>Zakat on Gold Uses the Weight, Not the Receipt</h2>
        <p>
          Zakat on gold is assessed on the metal&rsquo;s current market value at
          2.5%, not on what was paid for it. Making charges, wastage and tax
          form no part of the calculation, which means a heavily worked piece is
          assessed well below its purchase price.
        </p>
        <p>
          The threshold, nisab, is defined by weight of pure metal: 87.48 grams
          of gold, or 612.36 grams of silver. Because those two weights are
          worth very different amounts of money, which standard applies changes
          whether many people owe anything at all — and nisab is measured
          against total zakatable wealth after eligible debts, not a single
          holding. The calculator reports where one holding sits; the wider
          judgement needs the whole balance sheet and a full lunar year.
        </p>

        <section>
          <h2>Gold Valuation Questions</h2>
          {FAQ_DATA.map(([q, ans], i) => {
            const isOpen = openFAQ === i;
            return (
              <div className="faq-item" key={i}>
                <h3
                  onClick={() => toggleFAQ(i)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggleFAQ(i);
                    }
                  }}
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
                    <p>{ans}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      </div>

      <aside className="sidebar">
        <div className="cr-desktop-slot">{panel}</div>

        <div className="sidebar-box">
          <p style={{ fontSize: "18px", fontWeight: 600, margin: "0 0 12px" }}>
            Related Calculators
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {[
              ["/currency-converter/", "Currency Converter"],
              ["/net-worth-calculator/", "Net Worth Calculator"],
              ["/unit-conversion-calculator/", "Unit Conversion Calculator"],
              ["/percentage-calculator/", "Percentage Calculator"],
              ["/discount-calculator/", "Discount Calculator"],
              ["/vat-calculator/", "VAT Calculator"],
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
