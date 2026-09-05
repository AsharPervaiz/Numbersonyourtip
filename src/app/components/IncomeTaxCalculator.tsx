"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface TaxResult {
  grossIncome: number;
  taxableIncome: number;
  taxAmount: number;
  netIncome: number;
  effectiveRate: number;
  deductions: number;
  country: string;
}
function needleDeg(ratio: number): number {
  const clamped = Math.min(Math.max(ratio, 0), 1);
  return -90 + clamped * 180;
}

function IncomeTaxResultPanel({ result }: { result: TaxResult | null }) {
  if (!result) {
    return (
      <div className="cr-panel-placeholder">
        <div className="cr-ph-icon">
          <i className="fa-solid fa-landmark" aria-hidden="true" />
        </div>
        Enter your income details to see your tax breakdown here.
      </div>
    );
  }
  const {
    grossIncome,
    taxableIncome,
    taxAmount,
    netIncome,
    effectiveRate,
    deductions,
    country,
  } = result;
  const fmt = (n: number) =>
    n.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  const scaleMax = 50;
  const ratio = Math.min(effectiveRate / scaleMax, 1);
  const barPct = 2 + ratio * 96;
  const rateLabel =
    effectiveRate === 0
      ? "Tax-free"
      : effectiveRate < 10
        ? "Very low tax"
        : effectiveRate < 20
          ? "Low tax"
          : effectiveRate < 30
            ? "Moderate tax"
            : effectiveRate < 40
              ? "High tax"
              : "Very high tax";
  const rateBadge =
    effectiveRate === 0
      ? "good"
      : effectiveRate < 10
        ? "good"
        : effectiveRate < 20
          ? "normal"
          : effectiveRate < 30
            ? "warning"
            : "danger";
  const netPct =
    grossIncome > 0 ? Math.round((netIncome / grossIncome) * 100) : 0;
  const taxPct =
    grossIncome > 0 ? Math.round((taxAmount / grossIncome) * 100) : 0;
  const deductionPct =
    grossIncome > 0 ? Math.round((deductions / grossIncome) * 100) : 0;
  return (
    <div className="cr-panel">
      <div className="cr-gauge-wrap">
        <svg
          className="cr-gauge-svg"
          width="100"
          height="60"
          viewBox="0 0 120 70"
          role="img"
          aria-label={`Effective tax rate: ${effectiveRate.toFixed(1)}%`}
        >
          <defs>
            <clipPath id="itax-half">
              <rect x="0" y="0" width="120" height="65" />
            </clipPath>
          </defs>
          <circle
            cx="60"
            cy="65"
            r="52"
            fill="none"
            stroke="#97C459"
            strokeWidth="12"
            strokeDasharray="65 326"
            strokeDashoffset="-163"
            clipPath="url(#itax-half)"
          />
          <circle
            cx="60"
            cy="65"
            r="52"
            fill="none"
            stroke="#C0DD97"
            strokeWidth="12"
            strokeDasharray="65 326"
            strokeDashoffset="-228"
            clipPath="url(#itax-half)"
          />
          <circle
            cx="60"
            cy="65"
            r="52"
            fill="none"
            stroke="#FAC775"
            strokeWidth="12"
            strokeDasharray="65 326"
            strokeDashoffset="-293"
            clipPath="url(#itax-half)"
          />
          <circle
            cx="60"
            cy="65"
            r="52"
            fill="none"
            stroke="#F09595"
            strokeWidth="12"
            strokeDasharray="82 326"
            strokeDashoffset="-358"
            clipPath="url(#itax-half)"
          />
          <line
            x1="60"
            y1="65"
            x2="60"
            y2="20"
            stroke="#111111"
            strokeWidth="2.5"
            strokeLinecap="round"
            style={{
              transformOrigin: "60px 65px",
              transform: `rotate(${needleDeg(ratio)}deg)`,
              transition: "transform 0.5s ease",
            }}
          />
          <circle cx="60" cy="65" r="5" fill="#111111" />
        </svg>
        <div className="cr-score-block">
          <div className="cr-score-small">{fmt(netIncome)}</div>
          <div className="cr-score-label">net income after tax</div>
          <span className={`cr-badge ${rateBadge}`}>{rateLabel}</span>
        </div>
      </div>
      <hr className="cr-divider" />
      <div>
        <div className="cr-bar-label">
          effective tax rate — {effectiveRate.toFixed(1)}% of gross income
        </div>
        <div
          className="cr-bar-track"
          style={{
            background:
              "linear-gradient(to right, #97C459 0%, #C0DD97 25%, #FAC775 55%, #F09595 100%)",
          }}
        >
          <div className="cr-bar-thumb" style={{ left: `${barPct}%` }} />
        </div>
        <div className="cr-bar-ticks">
          <span>0%</span>
          <span>10%</span>
          <span>25%</span>
          <span>35%</span>
          <span>50%</span>
        </div>
      </div>
      <hr className="cr-divider" />
      <div className="cr-metrics-grid">
        <div className="cr-metric-card">
          <div className="cr-m-label">Gross income</div>
          <div className="cr-m-value" style={{ fontSize: "13px" }}>
            {fmt(grossIncome)}
          </div>
          <div className="cr-m-sub">before tax</div>
        </div>
        <div className="cr-metric-card">
          <div className="cr-m-label">Taxable income</div>
          <div className="cr-m-value" style={{ fontSize: "13px" }}>
            {fmt(taxableIncome)}
          </div>
          <div className="cr-m-sub">after deductions</div>
        </div>
        <div className="cr-metric-card">
          <div className="cr-m-label">Tax amount</div>
          <div
            className="cr-m-value"
            style={{ fontSize: "13px", color: "#A32D2D" }}
          >
            {fmt(taxAmount)}
          </div>
          <div className="cr-m-sub">
            {effectiveRate.toFixed(1)}% effective rate
          </div>
        </div>
        <div className="cr-metric-card">
          <div className="cr-m-label">Net income</div>
          <div
            className="cr-m-value"
            style={{ fontSize: "13px", color: "#3B6D11" }}
          >
            {fmt(netIncome)}
          </div>
          <div className="cr-m-sub">{netPct}% of gross</div>
        </div>
      </div>
      <hr className="cr-divider" />
      <div>
        <div className="cr-world-title">where your income goes</div>
        <div className="cr-world-bar-row">
          <span className="cr-w-label">Net income</span>
          <div className="cr-world-track">
            <div
              className="cr-world-fill"
              style={{ width: `${netPct}%`, background: "#97C459" }}
            />
          </div>
          <span className="cr-w-pct" style={{ width: "32px" }}>
            {netPct}%
          </span>
        </div>
        <div className="cr-world-bar-row">
          <span className="cr-w-label">Tax</span>
          <div className="cr-world-track">
            <div
              className="cr-world-fill"
              style={{ width: `${taxPct}%`, background: "#F09595" }}
            />
          </div>
          <span className="cr-w-pct" style={{ width: "32px" }}>
            {taxPct}%
          </span>
        </div>
        {deductionPct > 0 && (
          <div className="cr-world-bar-row">
            <span className="cr-w-label">Deductions</span>
            <div className="cr-world-track">
              <div
                className="cr-world-fill"
                style={{ width: `${deductionPct}%`, background: "#B5D4F4" }}
              />
            </div>
            <span className="cr-w-pct" style={{ width: "32px" }}>
              {deductionPct}%
            </span>
          </div>
        )}
        <p className="cr-world-note">
          You keep <strong>{fmt(netIncome)}</strong> from every{" "}
          {fmt(grossIncome)} earned — {netPct}% of gross income
          {country ? ` (${country})` : ""}.
        </p>
      </div>
    </div>
  );
}

function calcTax(
  grossIncome: number,
  deductions: number,
  country: string,
  customRate: number,
): { taxAmount: number; taxableIncome: number } {
  const taxable = Math.max(0, grossIncome - deductions);
  if (country === "Custom") {
    return { taxAmount: (taxable * customRate) / 100, taxableIncome: taxable };
  }
  const slab = (income: number, slabs: [number, number, number][]) => {
    let tax = 0;
    for (const [from, to, rate] of slabs) {
      if (income <= from) break;
      tax += (Math.min(income, to) - from) * (rate / 100);
    }
    return tax;
  };
  if (country === "India") {
    return {
      taxAmount: slab(taxable, [
        [0, 300000, 0],
        [300000, 700000, 5],
        [700000, 1000000, 10],
        [1000000, 1200000, 15],
        [1200000, 1500000, 20],
        [1500000, Infinity, 30],
      ]),
      taxableIncome: taxable,
    };
  }
  if (country === "USA") {
    return {
      taxAmount: slab(taxable, [
        [0, 11600, 10],
        [11600, 47150, 12],
        [47150, 100525, 22],
        [100525, 191950, 24],
        [191950, 243725, 32],
        [243725, 609350, 35],
        [609350, Infinity, 37],
      ]),
      taxableIncome: taxable,
    };
  }
  if (country === "UK") {
    const personalAllowance = 12570;
    const adj = Math.max(0, taxable - personalAllowance);
    return {
      taxAmount: slab(adj, [
        [0, 37700, 20],
        [37700, 125140, 40],
        [125140, Infinity, 45],
      ]),
      taxableIncome: taxable,
    };
  }
  if (country === "Canada") {
    return {
      taxAmount: slab(taxable, [
        [0, 55867, 15],
        [55867, 111733, 20.5],
        [111733, 154906, 26],
        [154906, 220000, 29],
        [220000, Infinity, 33],
      ]),
      taxableIncome: taxable,
    };
  }
  if (country === "Australia") {
    return {
      taxAmount: slab(taxable, [
        [0, 18200, 0],
        [18200, 45000, 19],
        [45000, 120000, 32.5],
        [120000, 180000, 37],
        [180000, Infinity, 45],
      ]),
      taxableIncome: taxable,
    };
  }
  if (country === "Pakistan") {
    return {
      taxAmount: slab(taxable, [
        [0, 600000, 0],
        [600000, 1200000, 5],
        [1200000, 2200000, 15],
        [2200000, 3200000, 25],
        [3200000, 4100000, 30],
        [4100000, Infinity, 35],
      ]),
      taxableIncome: taxable,
    };
  }
  return { taxAmount: (taxable * customRate) / 100, taxableIncome: taxable };
}

const FAQ_DATA = [
  {
    q: "Will a pay rise push me into a higher bracket and leave me worse off?",
    a: "No. A higher band applies only to the income above its threshold, not to everything you earn. In a system taxing 20% up to 40,000 and 40% above it, going from 40,000 to 41,000 means the extra 1,000 is taxed at 40%, so 600 of it survives. That is less than the whole raise and still 600 more than before. Nobody takes home less by earning more under a marginal system.",
  },
  {
    q: "What is the difference between my marginal and effective tax rate?",
    a: "The marginal rate is charged on your next unit of income — your top band. The effective rate is your total tax divided by your total income. Someone earning 41,000 in the example above is a 40% taxpayer with an effective rate of 15.6%, because most of their income was taxed at lower rates or not at all. Both statements are true at once, which is why the two terms exist.",
  },
  {
    q: "Is a tax deduction the same as a tax credit?",
    a: "No, and they are worth different amounts. A deduction reduces the income you are taxed on, so it is worth your marginal rate — a 1,000 deduction saves 200 at 20% and 400 at 40%. A credit reduces the tax itself, so 1,000 saves 1,000 for everyone. This is why targeted support is often given as a credit: its value does not rise with income.",
  },
  {
    q: "Is it worth buying something because it is tax deductible?",
    a: "Only if you needed it anyway. A deduction returns your marginal rate on the amount spent, never the whole amount. Spending 1,000 to save 400 in tax leaves you 600 poorer than not spending it. Deductibility reduces the cost of a purchase you were going to make; it does not make a purchase free.",
  },
  {
    q: "Why was my bonus taxed so heavily?",
    a: "Because withholding assumes your current pay continues all year. A month containing a large one-off payment looks to the payroll system like a month at a much higher annual salary, so it withholds at a higher rate. There is usually no special bonus tax — it is a timing effect that settles when the year is assessed, which is why bonus months often precede a refund.",
  },
  {
    q: "Why does my payslip deduction not match my final tax bill?",
    a: "Withholding is a running estimate rather than a calculation of your actual liability. It goes wrong whenever the assumption of steady income breaks — starting or leaving mid-year, holding two jobs whose payrolls cannot see each other, receiving bonuses, or having income outside payroll such as freelance work or rent. The annual assessment reconciles the estimate against reality.",
  },
  {
    q: "Is a big tax refund a good thing?",
    a: "It is your own money being returned after being held for a year without interest. A refund means withholding over-collected, and a bill means it under-collected. Neither indicates a mistake, but a consistently large refund is worth adjusting, since the same money in your account through the year is more useful than a lump sum afterwards.",
  },
  {
    q: "Why are pension contributions more valuable to higher earners?",
    a: "Because of where they sit in the calculation. Pre-tax contributions come off before the bands are applied, so they remove income from the top of your earnings rather than the bottom. A 40% taxpayer therefore saves 40% on the amount contributed, while a 20% taxpayer saves 20% on the same contribution.",
  },
  {
    q: "Can I rely on tax rates I find online?",
    a: "Only with a year attached and confirmed against your own tax authority. Thresholds, rates, allowances and the definition of taxable income change regularly, often annually, and differ substantially between countries. The structure is stable — a tax-free amount, rising rates on successive slices, deductions and credits treated differently — but the numbers are not.",
  },
];

export default function IncomeTaxCalculator() {
  const [income, setIncome] = useState("");
  const [deductions, setDeductions] = useState("");
  const [customRate, setCustomRate] = useState("");
  const [country, setCountry] = useState("India");
  const [countryOpen, setCountryOpen] = useState(false);
  const [panelResult, setPanelResult] = useState<TaxResult | null>(null);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const toggleFAQ = (index: number) =>
    setOpenFAQ(openFAQ === index ? null : index);
  const countries = [
    "India",
    "USA",
    "UK",
    "Canada",
    "Australia",
    "Pakistan",
    "Custom",
  ];

  const addCommas = (val: string): string => {
    const cleaned = val.replace(/[^0-9.]/g, "");
    const parts = cleaned.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.length > 1 ? parts[0] + "." + parts[1] : parts[0];
  };
  const handleChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setter(addCommas(e.target.value));
  const toNum = (val: string) => {
    const s = val.replace(/,/g, "");
    return s === "" ? 0 : Number(s);
  };

  const compute = (): TaxResult | null => {
    const grossIncome = toNum(income);
    const deductAmt = toNum(deductions);
    const cRate = toNum(customRate);
    if (!grossIncome || grossIncome <= 0) return null;
    if (country === "Custom" && !cRate) return null;
    const { taxAmount, taxableIncome } = calcTax(
      grossIncome,
      deductAmt,
      country,
      cRate,
    );
    const netIncome = Math.max(0, taxableIncome - taxAmount);
    const effectiveRate = grossIncome > 0 ? (taxAmount / grossIncome) * 100 : 0;
    return {
      grossIncome,
      taxableIncome,
      taxAmount,
      netIncome,
      effectiveRate,
      deductions: deductAmt,
      country,
    };
  };

  useEffect(() => {
    setPanelResult(compute());
  }, [income, deductions, customRate, country]);
  const calculate = () => setPanelResult(compute());
  const handleClear = () => {
    setIncome("");
    setDeductions("");
    setCustomRate("");
    setCountry("India");
    setCountryOpen(false);
    setPanelResult(null);
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_DATA.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  return (
    <div className="page-layout">
      <div className="single-page-padding">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />

        <h1>Income Tax Calculator — Marginal vs Effective Rate</h1>
        <p>
          Calculate your income tax, taxable income, effective tax rate, and net
          take-home pay instantly. This free income tax calculator with
          deductions works for salaried persons in Pakistan (FBR 2026 slabs),
          India, USA, UK, Canada, Australia, or any custom tax rate — enter your
          salary, subtract deductions, and see the exact breakdown.
        </p>

        <div className="calc-card single-calc">
          <div
            className="modern-dropdown"
            onClick={() => setCountryOpen(!countryOpen)}
          >
            {country}
            <span className="dropdown-indicator">▼</span>
            {countryOpen && (
              <ul className="dropdown-list">
                {countries.map((c) => (
                  <li
                    key={c}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCountry(c);
                      setCountryOpen(false);
                    }}
                  >
                    {c}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <input
            className="calc-input"
            type="text"
            inputMode="decimal"
            placeholder="Annual Gross Income"
            value={income}
            onChange={handleChange(setIncome)}
          />
          <input
            className="calc-input"
            type="text"
            inputMode="decimal"
            placeholder="Total Deductions (optional)"
            value={deductions}
            onChange={handleChange(setDeductions)}
          />
          {country === "Custom" && (
            <input
              className="calc-input"
              type="number"
              step="0.01"
              placeholder="Custom Tax Rate (%)"
              value={customRate}
              onChange={(e) => setCustomRate(e.target.value)}
            />
          )}
          <div style={{ display: "flex", gap: "10px" }}>
            <button className="calc-button" onClick={calculate}>
              Calculate
            </button>
            <button className="calc-button calc-clear" onClick={handleClear}>
              Clear
            </button>
          </div>
        </div>

        <div className="cr-mobile-slot">
          <IncomeTaxResultPanel result={panelResult} />
        </div>

        {/* ---- SEO CONTENT ---- */}

        <h2>Three Numbers People All Call &quot;My Tax Rate&quot;</h2>
        <p>
          Ask someone what tax rate they pay and you will get one of three
          answers, all of them arguably correct and all of them different. Most
          confusion about income tax dissolves once you can tell them apart.
        </p>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Rate</th>
                <th>What it measures</th>
                <th>What it is useful for</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Marginal</td>
                <td>
                  The rate charged on your next unit of income — your top band
                </td>
                <td>
                  Deciding whether extra work, a bonus or a deduction is worth it
                </td>
              </tr>
              <tr>
                <td>Effective</td>
                <td>Total tax divided by total income</td>
                <td>Understanding what you actually paid over the year</td>
              </tr>
              <tr>
                <td>Withholding</td>
                <td>What is deducted from each payslip</td>
                <td>Cash flow — and it is only an estimate</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          The first is nearly always the largest and the second nearly always
          the smallest. Quoting the marginal rate as &quot;what I pay&quot;
          overstates the position substantially, because it applies only to the
          top slice of income rather than to all of it.
        </p>

        <h2>Why a Raise Never Leaves You Worse Off</h2>
        <p>
          The most persistent misconception about income tax is that crossing
          into a higher band applies the new rate to everything you earn. It
          applies only to the income above the threshold.
        </p>
        <p>
          Take a simplified system with nothing taxed up to 10,000, 20% from
          10,001 to 40,000, and 40% above that.
        </p>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Gross income</th>
                <th>Tax</th>
                <th>Take-home</th>
                <th>Effective rate</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>40,000</td>
                <td>6,000</td>
                <td>34,000</td>
                <td>15.0%</td>
              </tr>
              <tr>
                <td>41,000</td>
                <td>6,400</td>
                <td>34,600</td>
                <td>15.6%</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          The extra 1,000 is taxed at 40%, so 600 of it survives. That is less
          than the whole raise, and it is still 600 more than before. Nobody
          takes home less by earning more under a marginal system.
        </p>
        <p>
          Notice the second row as well: this person is a 40% taxpayer whose
          effective rate is 15.6%. Both statements are true simultaneously, and
          that gap is the entire reason the two terms exist. Our guide on{" "}
          <Link
            href="/blog/marginal-vs-effective-tax-rate/"
            className="my-link"
          >
            marginal versus effective tax rates
          </Link>{" "}
          works through further examples.
        </p>
        <p>
          One genuine exception is worth knowing. Some systems withdraw an
          allowance or a benefit as income rises, which can create a narrow band
          where the effective rate on additional income is unusually high. That
          is a taper, not a tax band, and it is the only situation where the
          intuition about &quot;being pushed into a higher bracket&quot; has any
          real basis.
        </p>

        <h2>A Deduction and a Credit Are Not the Same Size</h2>
        <p>
          These two get used interchangeably in conversation and they are worth
          very different amounts.
        </p>
        <p>
          A <strong>deduction</strong> reduces the income you are taxed on, so
          it is worth your marginal rate. A <strong>credit</strong> reduces the
          tax itself, so it is worth its full face value regardless of what you
          earn.
        </p>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Your marginal rate</th>
                <th>Value of a 1,000 deduction</th>
                <th>Value of a 1,000 credit</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>20%</td>
                <td>200</td>
                <td>1,000</td>
              </tr>
              <tr>
                <td>40%</td>
                <td>400</td>
                <td>1,000</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          Two consequences follow. A credit is worth the same to everyone, while
          a deduction is worth more to higher earners — which is why targeted
          support is often delivered as a credit. And a deduction is never worth
          more than the amount spent, so &quot;it is tax deductible&quot; is not
          a reason to buy something. Spending 1,000 to save 400 leaves you 600
          down.
        </p>

        <h2>Why Your Payslip Does Not Match Your Return</h2>
        <p>
          Withholding is a running estimate, not a calculation of your actual
          liability. It works by assuming your current pay continues unchanged
          for the whole year, and it goes wrong whenever that assumption does.
        </p>
        <ul className="custom-list">
          <li>
            <strong>Bonuses.</strong> A month containing a large one-off payment
            looks, to the payroll system, like a month at a much higher annual
            salary, so it is withheld at a higher rate. This is a timing effect,
            not a special bonus tax — it settles up when the year is assessed.
          </li>
          <li>
            <strong>Starting or leaving mid-year.</strong> Working part of a year
            means your allowance is spread across fewer months, and the estimate
            often over-collects.
          </li>
          <li>
            <strong>Two jobs at once.</strong> Neither employer sees the other,
            so allowances can be applied twice or not at all.
          </li>
          <li>
            <strong>Income outside payroll.</strong> Freelance work, rent or
            investment income is not visible to your employer and is not being
            withheld against.
          </li>
        </ul>
        <p>
          The practical upshot is that a large refund is not a windfall — it is
          your own money returned after being held for a year — and an unexpected
          bill usually means withholding under-collected rather than that
          something went wrong.
        </p>

        <h2>The Order Things Happen In</h2>
        <p>
          Every system runs broadly the same sequence, and knowing it tells you
          where a given item takes effect.
        </p>
        <pre>
          Gross income{"\n"}− Pre-tax deductions (pension, certain benefits)
          {"\n"}− Allowances and reliefs{"\n"}= Taxable income{"\n"}× Applied
          band by band, not all at one rate{"\n"}− Tax credits{"\n"}= Tax
          payable
        </pre>
        <p>
          The position in that list is what determines an item&apos;s value.
          Anything above the &quot;taxable income&quot; line saves you your
          marginal rate. Anything below the band calculation saves you its face
          amount. This is also why pension contributions are efficient for
          higher-rate taxpayers specifically — they come off before the bands
          are applied, at the top of your income rather than the bottom.
        </p>

        <h2>What Changes Between Countries, and What Does Not</h2>
        <p>
          Band thresholds, rates, allowance amounts, the treatment of pensions
          and the definition of taxable income all differ by country and are
          revised regularly, often annually. Any figure quoted online without a
          year attached should be treated as unreliable.
        </p>
        <p>
          The structure is remarkably consistent. Almost every system has a
          tax-free amount at the bottom, applies rising rates to successive
          slices rather than to the whole, distinguishes deductions from
          credits, and collects through the year against an estimate that is
          reconciled afterwards. Understanding that shape transfers between
          jurisdictions even when none of the numbers do.
        </p>
        <p>
          Use this calculator to model the shape of a liability and to compare
          scenarios, then confirm current thresholds with your own tax authority
          before relying on a figure. Current-year bands are set out in our{" "}
          <Link href="/blog/2026-tax-brackets/" className="my-link">
            2026 tax brackets guide
          </Link>
          . If your income is self-employed rather than salaried, the{" "}
          <Link href="/freelancer-tax-calculator/" className="my-link">
            freelancer tax calculator
          </Link>{" "}
          accounts for contributions and business expenses as well.
        </p>
        <h2>Income Tax Questions</h2>

        {FAQ_DATA.map(({ q, a }, i) => {
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
                  <p>{a}</p>
                </div>
              </div>
            </div>
          );
        })}

      </div>

      {/* ---- SIDEBAR ---- */}
      <aside className="sidebar">
        <div className="cr-desktop-slot">
          <IncomeTaxResultPanel result={panelResult} />
        </div>
        <div className="sidebar-box">
          <p style={{ fontSize: "20px", fontWeight: 600 }}>
            Related Calculators
          </p>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {[
              ["/salary-hike-calculator/", "Salary Hike Calculator"],
              ["/freelancer-tax-calculator/", "Freelancer Tax Calculator"],
              ["/net-worth-calculator/", "Net Worth Calculator"],
              ["/emi-calculator/", "EMI Calculator"],
              ["/rent-calculator/", "Rent Calculator"],
              ["/home-mortgage-calculator/", "Home Mortgage Calculator"],
            ].map(([href, label]) => (
              <li key={href}>
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
