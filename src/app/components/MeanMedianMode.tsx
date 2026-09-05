"use client";
import { useState, useMemo } from "react";
import Link from "next/link";

/* ─────────────────────────────────────────
   Types
───────────────────────────────────────── */
interface StatsResult {
  numbers: number[];
  mean: number;
  median: number;
  modes: number[];
  range: number;
  sum: number;
  count: number;
  min: number;
  max: number;
  variance: number;
  stdDev: number;
  sortedNumbers: number[];
}

/* ─────────────────────────────────────────
   Pure helpers
───────────────────────────────────────── */
function parseNumbers(input: string): number[] | null {
  const cleaned = input.trim().replace(/[\n\r]+/g, ",");
  const parts = cleaned.split(/[,\s]+/).filter((s) => s !== "");
  if (parts.length === 0) return null;
  const nums = parts.map(Number);
  if (nums.some(isNaN)) return null;
  return nums;
}

function calcMean(nums: number[]): number {
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function calcMedian(sorted: number[]): number {
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

function calcModes(nums: number[]): number[] {
  const freq: Record<number, number> = {};
  for (const n of nums) freq[n] = (freq[n] || 0) + 1;
  const maxFreq = Math.max(...Object.values(freq));
  if (maxFreq === 1) return [];
  return Object.keys(freq)
    .filter((k) => freq[Number(k)] === maxFreq)
    .map(Number)
    .sort((a, b) => a - b);
}

function calcVariance(nums: number[], mean: number): number {
  return nums.reduce((sum, n) => sum + Math.pow(n - mean, 2), 0) / nums.length;
}

function computeStats(nums: number[]): StatsResult {
  const sorted = [...nums].sort((a, b) => a - b);
  const mean = calcMean(nums);
  return {
    numbers: nums,
    mean,
    median: calcMedian(sorted),
    modes: calcModes(nums),
    range: sorted[sorted.length - 1] - sorted[0],
    sum: nums.reduce((a, b) => a + b, 0),
    count: nums.length,
    min: sorted[0],
    max: sorted[sorted.length - 1],
    variance: calcVariance(nums, mean),
    stdDev: Math.sqrt(calcVariance(nums, mean)),
    sortedNumbers: sorted,
  };
}

function barPctStat(value: number, min: number, max: number): number {
  if (max === min) return 50;
  const clamped = Math.min(Math.max(value, min), max);
  return 2 + ((clamped - min) / (max - min)) * 96;
}

function fmt(n: number): string {
  return Number.isInteger(n) ? String(n) : parseFloat(n.toFixed(4)).toString();
}

/* ─────────────────────────────────────────
   FrequencyBar
───────────────────────────────────────── */
function FrequencyBar({ numbers }: { numbers: number[] }) {
  const freq: Record<number, number> = {};
  for (const n of numbers) freq[n] = (freq[n] || 0) + 1;
  const entries = Object.entries(freq)
    .map(([k, v]) => ({ val: Number(k), count: v }))
    .sort((a, b) => a.val - b.val);
  const maxCount = Math.max(...entries.map((e) => e.count));
  return (
    <div>
      <div className="cr-world-title">Value frequency</div>
      {entries.map(({ val, count }) => (
        <div className="cr-world-bar-row" key={val}>
          <span className="cr-w-label">{val}</span>
          <div className="cr-world-track">
            <div
              className="cr-world-fill"
              style={{
                width: `${(count / maxCount) * 100}%`,
                background: count === maxCount ? "#97C459" : "#B5D4F4",
              }}
            />
          </div>
          <span className="cr-w-pct">×{count}</span>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────
   StatsResultPanel
───────────────────────────────────────── */
function StatsResultPanel({ result }: { result: StatsResult | null }) {
  if (!result) {
    return (
      <div className="cr-panel-placeholder">
        <div className="cr-ph-icon">
          <i className="fa-solid fa-chart-bar" aria-hidden="true" />
        </div>
        Enter a list of numbers to see mean, median, mode, and more.
      </div>
    );
  }

  const {
    mean,
    median,
    modes,
    range,
    sum,
    count,
    min,
    max,
    stdDev,
    variance,
    sortedNumbers,
    numbers,
  } = result;
  const modeDisplay =
    modes.length === 0 ? "No mode" : modes.map(fmt).join(", ");

  return (
    <div className="cr-panel">
      <div
        style={{ display: "flex", alignItems: "stretch", textAlign: "center" }}
      >
        <div
          style={{
            flex: 1,
            padding: "14px 8px",
            borderRight: "1px solid var(--border, #e5e7eb)",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: "var(--muted, #888)",
              marginBottom: "6px",
            }}
          >
            Mean
          </div>
          <div className="cr-score">{fmt(mean)}</div>
          <div className="cr-score-label">average</div>
        </div>
        <div style={{ flex: 1, padding: "14px 8px" }}>
          <div
            style={{
              fontSize: "11px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: "var(--muted, #888)",
              marginBottom: "6px",
            }}
          >
            Median
          </div>
          <div className="cr-score">{fmt(median)}</div>
          <div className="cr-score-label">middle value</div>
        </div>
      </div>
      <div
        style={{
          textAlign: "center",
          padding: "14px 8px",
          borderTop: "1px solid var(--border, #e5e7eb)",
        }}
      >
        <div
          style={{
            fontSize: "11px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: "var(--muted, #888)",
            marginBottom: "6px",
          }}
        >
          Mode
        </div>
        <div
          className="cr-score"
          style={{
            fontSize: modes.length > 2 ? "clamp(16px, 4vw, 22px)" : undefined,
          }}
        >
          {modeDisplay}
        </div>
        <div className="cr-score-label">most frequent</div>
        {modes.length === 0 && (
          <span
            className="cr-badge normal"
            style={{ marginTop: "6px", display: "inline-block" }}
          >
            all values unique
          </span>
        )}
        {modes.length > 1 && (
          <span
            className="cr-badge overweight"
            style={{ marginTop: "6px", display: "inline-block" }}
          >
            multimodal
          </span>
        )}
      </div>
      <hr className="cr-divider" />
      <div className="cr-metrics-grid">
        <div className="cr-metric-card">
          <div className="cr-m-label">Count</div>
          <div className="cr-m-value">{count}</div>
          <div className="cr-m-sub">values</div>
        </div>
        <div className="cr-metric-card">
          <div className="cr-m-label">Sum</div>
          <div className="cr-m-value">{fmt(sum)}</div>
          <div className="cr-m-sub">total</div>
        </div>
        <div className="cr-metric-card">
          <div className="cr-m-label">Range</div>
          <div className="cr-m-value">{fmt(range)}</div>
          <div className="cr-m-sub">max − min</div>
        </div>
        <div className="cr-metric-card">
          <div className="cr-m-label">Min</div>
          <div className="cr-m-value">{fmt(min)}</div>
          <div className="cr-m-sub">smallest</div>
        </div>
        <div className="cr-metric-card">
          <div className="cr-m-label">Max</div>
          <div className="cr-m-value">{fmt(max)}</div>
          <div className="cr-m-sub">largest</div>
        </div>
        <div className="cr-metric-card">
          <div className="cr-m-label">Std Dev</div>
          <div className="cr-m-value">{fmt(stdDev)}</div>
          <div className="cr-m-sub">spread (σ)</div>
        </div>
        <div className="cr-metric-card">
          <div className="cr-m-label">Variance</div>
          <div className="cr-m-value">{fmt(variance)}</div>
          <div className="cr-m-sub">σ²</div>
        </div>
      </div>
      <hr className="cr-divider" />
      <div>
        <div className="cr-bar-label">mean vs median — distribution skew</div>
        <div
          className="cr-bar-track"
          style={{
            background:
              "linear-gradient(to right, #B5D4F4 0%, #97C459 40%, #FAC775 70%, #F09595 100%)",
          }}
        >
          <div
            className="cr-bar-thumb"
            style={{
              left: `${barPctStat(median, min, max)}%`,
              background: "#1b3067",
            }}
            title={`Median: ${fmt(median)}`}
          />
          <div
            className="cr-bar-thumb"
            style={{
              left: `${barPctStat(mean, min, max)}%`,
              background: "#F09595",
              border: "2px solid #c0392b",
            }}
            title={`Mean: ${fmt(mean)}`}
          />
        </div>
        <div className="cr-bar-ticks">
          <span>{fmt(min)}</span>
          <span style={{ color: "#1b3067", fontWeight: 600 }}>◆ median</span>
          <span style={{ color: "#c0392b", fontWeight: 600 }}>● mean</span>
          <span>{fmt(max)}</span>
        </div>
      </div>
      <hr className="cr-divider" />
      <div>
        <div className="cr-world-title">Sorted values</div>
        <p
          style={{
            fontSize: "13px",
            color: "var(--muted, #666)",
            wordBreak: "break-word",
            margin: "6px 0 0",
          }}
        >
          {sortedNumbers.map(fmt).join(", ")}
        </p>
      </div>
      {numbers.length <= 30 && (
        <>
          <hr className="cr-divider" />
          <FrequencyBar numbers={numbers} />
        </>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   Main Page
───────────────────────────────────────── */
const FAQ_DATA: [string, string][] = [
  [
    "Should I use the mean or the median?",
    "Compare them first. If they are close, the data is roughly symmetric and the mean is fine — it uses every value. If they are far apart, the data is skewed and the mean is describing the tail rather than the typical case. With salaries of 24, 26, 27, 28, 30, 32 and 210, the mean is 53.9 and the median is 28, and six of the seven people earn below the mean.",
  ],
  [
    "Why are incomes and house prices always reported as medians?",
    "Because those distributions are skewed right — a small number of very large values pull the mean upward. The median depends on the position of values rather than their size, so extremes cannot drag it. In a right-skewed distribution the mean describes a person who does not exist, which is why statistical agencies publish medians.",
  ],
  [
    "What does it mean if the mean is much higher than the median?",
    "The data is skewed right, with a few unusually large values stretching the upper tail. The reverse — mean well below median — indicates left skew, with a few unusually small values. When the two are close, the distribution is roughly symmetric. Comparing them is a free check on the shape of your data without plotting anything.",
  ],
  [
    "What if my data has no mode?",
    "That happens whenever no value repeats, as in 1, 2, 3, 4, 5. Some conventions call this no mode and others call every value a mode; either way the measure is telling you nothing useful about that data. It is not an error, just a signal that mode is the wrong summary for this set.",
  ],
  [
    "What does it mean if my data has two modes?",
    "A bimodal result usually means two different groups have been combined into one dataset — two shifts, two age brackets, two product lines. Reporting a single average across them describes neither group. The honest response is generally to separate the groups and summarise each rather than to pick one mode.",
  ],
  [
    "Can I calculate an average of non-numeric data?",
    "Only the mode. Mean and median both need values you can add or rank, while mode only requires being able to tell whether two values are the same. There is no mean favourite colour and no median blood type, but there is a most common one. For survey answers, sizes and categories the mode is the only average defined.",
  ],
  [
    "What is the difference between range and standard deviation?",
    "Range is the largest value minus the smallest, so it uses exactly two numbers and is entirely set by the extremes. Standard deviation measures how far values sit from the mean on average, using every value. Adding a single 100 to the set 2, 3, 3, 4, 5 moves the range from 3 to 98 and the standard deviation from 1.02 to 36.01, while the median moves only from 3 to 3.5.",
  ],
  [
    "Why report standard deviation instead of variance?",
    "They measure the same thing, but variance is in squared units. If your data is in kilograms, the variance is in kilograms squared, which has no useful interpretation. Taking the square root returns it to the original units, so a standard deviation can be compared directly against the mean and against individual values.",
  ],
  [
    "Can I average two averages together?",
    "Only if both groups are the same size. A class of 10 averaging 70 and a class of 30 averaging 90 do not combine to 80 — the correct figure weights by group size, giving (10 × 70 + 30 × 90) ÷ 40 = 85. The naive answer is five marks out here, and the error grows as the groups become more unequal.",
  ],
  [
    "How many values do I need for an average to mean anything?",
    "There is no fixed threshold, but sensitivity falls sharply as the count rises: a mean of three numbers moves substantially when any one changes, while a mean of three hundred barely notices. Nothing in the calculation itself warns you which you have, so always report the count alongside the average — a figure with no sample size behind it cannot be evaluated by whoever reads it.",
  ],
];

export default function MeanMedianModeCalculator() {
  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const toggleFAQ = (i: number) => setOpenFAQ(openFAQ === i ? null : i);

  const result = useMemo<StatsResult | null>(() => {
    const nums = parseNumbers(submitted);
    if (!nums || nums.length === 0) return null;
    return computeStats(nums);
  }, [submitted]);

  const handleCalculate = () => {
    setSubmitted(input);
  };
  const handleClear = () => {
    setInput("");
    setSubmitted("");
  };

  return (
    <div className="page-layout">
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
      <div className="single-page-padding">
        <h1>
          Mean, Median and Mode Calculator — With Range and Std Dev
        </h1>
        <p>
          Enter any list of numbers separated by commas or spaces to instantly
          calculate the mean, median, mode, range, standard deviation, variance,
          and more — with a full sorted view and frequency breakdown.
        </p>

        <div className="calc-card single-calc">
          <textarea
            className="calc-input"
            rows={4}
            placeholder="Enter numbers separated by commas or spaces — e.g. 4, 8, 15, 16, 23, 42"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setSubmitted(e.target.value);
            }}
            style={{ resize: "vertical", fontFamily: "inherit" }}
          />
          <div style={{ display: "flex", gap: "10px" }}>
            <button className="calc-button" onClick={handleCalculate}>
              Calculate
            </button>
            <button className="calc-button calc-clear" onClick={handleClear}>
              Clear
            </button>
          </div>
        </div>

        <div className="cr-mobile-slot">
          <StatsResultPanel result={result} />
        </div>

        {/* ── SEO CONTENT ── */}

        <h2>When the Three Averages Disagree, That Is the Finding</h2>
        <p>
          Mean, median and mode are usually taught as three ways of doing the
          same job. They are better understood as three different questions, and
          the interesting cases are the ones where they give different answers.
        </p>
        <p>
          Take seven salaries at a small company, in thousands: 24, 26, 27, 28,
          30, 32 and 210.
        </p>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Measure</th>
                <th>Value</th>
                <th>The question it answers</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Mean</td>
                <td>53.9</td>
                <td>If the total were shared equally, what would each get?</td>
              </tr>
              <tr>
                <td>Median</td>
                <td>28</td>
                <td>What does the person in the middle earn?</td>
              </tr>
              <tr>
                <td>Mode</td>
                <td>None</td>
                <td>What is the most common value? Here, nothing repeats.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          Six of the seven people earn less than the mean. It is a perfectly
          correct arithmetic average and a poor description of a typical salary
          at that company, because one value is pulling it upward on its own.
          The median is unmoved by that value: shifting the top salary to 500
          would change the mean to nearly 95 and leave the median at exactly 28.
        </p>
        <p>
          This is what people mean by saying the median is robust. It depends on
          the position of values rather than their size, so extremes cannot drag
          it.
        </p>

        <h2>The Gap Between Mean and Median Is Itself a Measurement</h2>
        <p>
          Comparing the two tells you about the shape of the data without
          plotting anything.
        </p>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>If</th>
                <th>The distribution is</th>
                <th>Typically because</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Mean much higher than median</td>
                <td>Skewed right</td>
                <td>
                  A few very large values — incomes, house prices, response times
                </td>
              </tr>
              <tr>
                <td>Mean much lower than median</td>
                <td>Skewed left</td>
                <td>
                  A few very small values — exam scores where a handful did badly
                </td>
              </tr>
              <tr>
                <td>Mean and median close</td>
                <td>Roughly symmetric</td>
                <td>No dominant tail in either direction</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          It is worth running this check before deciding which figure to report.
          If the two are close, use the mean — it uses every value and is easier
          to work with algebraically. If they are far apart, the mean is
          describing the tail rather than the typical case.
        </p>
        <p>
          This is also why income and house price statistics are almost always
          published as medians. It is not a stylistic choice; the mean of a
          right-skewed distribution describes a person who does not exist.
        </p>

        <h2>Which One Should You Actually Report?</h2>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Use the</th>
                <th>When</th>
                <th>Example</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Mean</td>
                <td>
                  Data is roughly symmetric and you need every value to count
                </td>
                <td>Average test score in a normal class</td>
              </tr>
              <tr>
                <td>Median</td>
                <td>There are outliers or the data is skewed</td>
                <td>Typical salary, house price, or page load time</td>
              </tr>
              <tr>
                <td>Mode</td>
                <td>
                  Values are categories, or you want the most common outcome
                </td>
                <td>Most-ordered item, most frequent shoe size</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          Reporting more than one is usually better than choosing. Stating a
          mean of 53.9 alongside a median of 28 tells the reader more than either
          number alone, and it tells them immediately that something in the data
          is unusual.
        </p>

        <h2>Mode Is the Only One That Works on Non-Numbers</h2>
        <p>
          Mean and median both require values you can add or rank. Mode only
          requires that you can tell whether two values are the same, which
          makes it the only average available for categorical data.
        </p>
        <p>
          There is no mean favourite colour and no median blood type. There is a
          most common one, and that is the mode. For survey answers, product
          choices, error codes or sizes, it is not a lesser option — it is the
          only one defined.
        </p>

        <h3>No Mode, Two Modes, or All of Them</h3>
        <p>
          Mode has edge cases the other two do not, and they are worth
          recognising rather than treating as errors.
        </p>
        <ul className="custom-list">
          <li>
            <strong>No mode.</strong> In 1, 2, 3, 4, 5 every value appears once.
            Some conventions say there is no mode; others say every value is one.
            Either way the measure is telling you nothing useful about this data.
          </li>
          <li>
            <strong>Two modes.</strong> In 1, 1, 2, 2, 3 both 1 and 2 appear
            twice. A bimodal result often means two different groups have been
            combined into one dataset — two shifts, two age groups, two product
            lines — and the honest response is usually to separate them rather
            than to report one average.
          </li>
          <li>
            <strong>A mode that is not central at all.</strong> Nothing requires
            the most frequent value to sit near the middle. It can be the lowest
            or highest value in the set, which is why mode alone is a poor
            summary of numeric data.
          </li>
        </ul>

        <h2>Centre Without Spread Is Half the Story</h2>
        <p>
          Two datasets can share a mean and describe completely different
          situations. Spread is what separates them, and the two common measures
          behave very differently.
        </p>
        <p>
          <strong>Range</strong> is the largest value minus the smallest. It uses
          exactly two numbers and ignores everything in between, which makes it
          entirely determined by extremes.
        </p>
        <p>
          <strong>Standard deviation</strong> measures how far values sit from
          the mean on average, using every value in the set. It is in the same
          units as the data, which is why it is usually reported instead of
          variance — variance is the same quantity in squared units, useful in
          the algebra and awkward to interpret.
        </p>
        <p>
          Adding one outlier shows the difference between all four measures at
          once. Start with 2, 3, 3, 4, 5 and add a single value of 100:
        </p>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Measure</th>
                <th>Before</th>
                <th>After adding 100</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Mean</td>
                <td>3.4</td>
                <td>19.5</td>
              </tr>
              <tr>
                <td>Median</td>
                <td>3</td>
                <td>3.5</td>
              </tr>
              <tr>
                <td>Range</td>
                <td>3</td>
                <td>98</td>
              </tr>
              <tr>
                <td>Standard deviation</td>
                <td>1.02</td>
                <td>36.01</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          One value out of six multiplied the mean by more than five and the
          range by more than thirty, while the median moved by half a point. If
          your summary statistics change dramatically when a single observation
          is added, that observation deserves examination before the statistics
          are reported.
        </p>

        <h2>Two Ways an Average Goes Wrong</h2>
        <p>
          <strong>Averaging averages.</strong> Two class averages cannot be
          averaged unless the classes are the same size. A class of 10 averaging
          70 and a class of 30 averaging 90 do not combine to 80. The correct
          figure weights by group size: (10 × 70 + 30 × 90) ÷ 40 = 85. The naive
          answer is five marks out, and the error grows as the groups become
          more unequal.
        </p>
        <p>
          <strong>Averaging too few values.</strong> A mean of three numbers is
          extremely sensitive to each one; a mean of three hundred is not.
          Nothing in the calculation warns you which you are looking at, so
          report the count alongside the average. A single figure with no sample
          size behind it cannot be evaluated by anyone reading it.
        </p>
        <p>
          For descriptive statistics on values you have already computed, the{" "}
          <Link href="/percentage-calculator/" className="my-link">
            percentage calculator
          </Link>{" "}
          handles proportional comparisons, and the{" "}
          <Link href="/matrix-calculator/" className="my-link">
            matrix calculator
          </Link>{" "}
          covers linear algebra rather than descriptive measures.
        </p>
        <section>
          <h2>Questions About Averages and Spread</h2>
          {FAQ_DATA.map(([q, a], i) => {
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
        </section>

      </div>

      {/* ════════ RIGHT — sticky sidebar ════════ */}
      <aside className="sidebar">
        <div className="cr-desktop-slot">
          <StatsResultPanel result={result} />
        </div>

        <div className="sidebar-box">
          <p style={{ fontSize: "18px", fontWeight: 600, margin: "0 0 12px" }}>
            Related Calculators
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {[
              ["/percentage-calculator/", "Percentage Calculator"],
              ["/gpa-calculator/", "GPA Calculator"],
              ["/gpa-percentage/", "GPA Percentage"],
              ["/age-calculator/", "Age Calculator"],
              ["/unit-conversion-calculator/", "Unit Conversion Calculator"],
              ["/time-calculator/", "Time Calculator"],
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
