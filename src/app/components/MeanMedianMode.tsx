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
      <div className="single-page-padding">
        <h1>
          Mean, Median, Mode Calculator — Instant Statistics for Any Dataset
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

        <section>
          <h2>What Are Mean, Median, and Mode?</h2>
          <p>
            Mean, median, and mode are the three central measures of tendency in
            descriptive statistics — each summarizing a dataset with a single
            representative value, but from a different angle. Together they give
            you a complete picture of where your data clusters and how it is
            distributed.
          </p>
          <p>
            These three measures are foundational to every branch of statistics,
            from academic research and scientific analysis to business
            reporting, financial modeling, and everyday data tasks. Whether you
            are a student working through homework problems, an analyst
            processing survey responses, or a teacher grading an exam, this
            calculator computes all three instantly along with range, sum,
            variance, and standard deviation. If you are working specifically
            with academic grades, our{" "}
            <Link href="/gpa-calculator/" className="my-link">
              GPA calculator
            </Link>{" "}
            handles weighted grade-point averages, which are a specialized form
            of weighted mean.
          </p>
        </section>

        <section>
          <h2>Mean — The Arithmetic Average</h2>
          <p>
            The mean (also called the arithmetic mean or average) is calculated
            by adding all values in a dataset and dividing by the count of
            values.
          </p>
          <h3>Mean Formula</h3>
          <pre>Mean = Sum of all values ÷ Number of values</pre>
          <p>
            Example: For the dataset 4, 8, 6, 10, 2 — the sum is 30 and the
            count is 5, so the mean is 30 ÷ 5 = <strong>6.0</strong>.
          </p>
          <p>
            The mean is the most widely used measure of central tendency and is
            ideal when data is symmetrically distributed without extreme
            outliers. However, it is sensitive to outliers — a single very large
            or very small value can pull the mean far from where most data
            points sit. In such cases, the median is often a more informative
            measure. GPA is a practical example of a weighted mean — each course
            grade is weighted by credit hours. Our{" "}
            <Link href="/gpa-calculator/" className="my-link">
              GPA calculator
            </Link>{" "}
            applies this weighted formula automatically.
          </p>
        </section>

        <section>
          <h2>Median — The Middle Value</h2>
          <p>
            The median is the middle value when a dataset is arranged in
            ascending order. It divides the dataset into two equal halves — 50%
            of values fall below it, and 50% fall above.
          </p>
          <h3>Median Formula</h3>
          <ul className="custom-list">
            <li>
              <strong>Odd count:</strong> The median is the middle value. For 5
              values sorted as 2, 4, 6, 8, 10 — the median is <strong>6</strong>
              .
            </li>
            <li>
              <strong>Even count:</strong> The median is the average of the two
              middle values. For 4 values sorted as 2, 4, 8, 10 — the median is
              (4 + 8) ÷ 2 = <strong>6</strong>.
            </li>
          </ul>
          <p>
            The median is resistant to outliers, making it a better central
            measure for skewed distributions. This is why real estate reports
            and income statistics typically use median rather than mean — a
            handful of extremely high-value homes or salaries would distort the
            mean significantly.
          </p>
        </section>

        <section>
          <h2>Mode — The Most Frequent Value</h2>
          <p>
            The mode is the value (or values) that appear most often in a
            dataset. Unlike mean and median, the mode is the only measure of
            central tendency that can be applied to non-numeric (categorical)
            data.
          </p>
          <h3>Types of Mode</h3>
          <ul className="custom-list">
            <li>
              <strong>No mode:</strong> Every value appears exactly once (e.g.
              1, 2, 3, 4, 5).
            </li>
            <li>
              <strong>Unimodal:</strong> One value appears more than any other.
              Dataset 2, 3, 3, 5, 7 has mode <strong>3</strong>.
            </li>
            <li>
              <strong>Bimodal:</strong> Two values tie for most frequent.
              Dataset 1, 2, 2, 3, 5, 5, 6 has modes <strong>2 and 5</strong>.
            </li>
            <li>
              <strong>Multimodal:</strong> Three or more values tie for most
              frequent.
            </li>
          </ul>
          <p>
            The mode is especially useful in business and social science. A
            clothing retailer cares most about the modal shoe size (the most
            commonly purchased) rather than the mean or median.
          </p>
        </section>

        <section>
          <h2>Mean vs Median vs Mode — Which Should You Use?</h2>
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginBottom: "20px",
                border: "1px solid #1b3067",
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: "#1b3067",
                    color: "#ffffff",
                    textAlign: "left",
                  }}
                >
                  <th
                    style={{
                      padding: "15px",
                      borderBottom: "2px solid #ffffff",
                    }}
                  >
                    Measure
                  </th>
                  <th
                    style={{
                      padding: "15px",
                      borderBottom: "2px solid #ffffff",
                    }}
                  >
                    Best Used When
                  </th>
                  <th
                    style={{
                      padding: "15px",
                      borderBottom: "2px solid #ffffff",
                    }}
                  >
                    Weakness
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ backgroundColor: "#fff" }}>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                    <strong>Mean</strong>
                  </td>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                    Data is roughly symmetric, no extreme outliers
                  </td>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                    Distorted by outliers
                  </td>
                </tr>
                <tr style={{ backgroundColor: "#f8f9fc" }}>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                    <strong>Median</strong>
                  </td>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                    Data is skewed or has outliers (income, home prices)
                  </td>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                    Ignores actual values outside the center
                  </td>
                </tr>
                <tr style={{ backgroundColor: "#fff" }}>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                    <strong>Mode</strong>
                  </td>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                    Categorical data, identifying the most common value
                  </td>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                    May not exist or be unique; ignores other values
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            In practice, comparing all three measures reveals the shape of your
            distribution. When mean ≈ median ≈ mode, the data is roughly
            symmetrical. When the mean is much higher than the median, the data
            is right-skewed (pulled by a few large values). When the mean is
            much lower than the median, the data is left-skewed.
          </p>
        </section>

        <section>
          <h2>Range, Variance, and Standard Deviation</h2>
          <p>
            Central tendency tells you where data clusters. Measures of spread
            tell you how much the data varies around that center. This
            calculator also computes:
          </p>

          <h3>Range</h3>
          <pre>Range = Maximum value − Minimum value</pre>
          <p>
            The simplest measure of spread. A range of 0 means all values are
            identical; a large range indicates high variability. It is easy to
            understand but sensitive to outliers since it only considers the two
            most extreme values.
          </p>

          <h3>Variance (σ²)</h3>
          <pre>Variance = Σ(x − mean)² ÷ n</pre>
          <p>
            Variance measures the average squared deviation from the mean.
            Squaring ensures positive values and gives extra weight to values
            far from the mean. This calculator uses the population variance
            formula (dividing by n), appropriate when your dataset represents
            the entire population rather than a sample.
          </p>

          <h3>Standard Deviation (σ)</h3>
          <pre>Standard Deviation = √Variance</pre>
          <p>
            Standard deviation is the square root of variance, expressed in the
            same units as the original data. It is the most commonly used
            measure of spread. For a normally distributed dataset, roughly 68%
            of values fall within one standard deviation of the mean, and about
            95% fall within two standard deviations.
          </p>
        </section>

        <section>
          <h2>Worked Examples</h2>

          <h3>Example 1: Exam Scores</h3>
          <p>A class of 7 students scored: 72, 85, 90, 68, 90, 77, 85</p>
          <ul className="custom-list">
            <li>Sorted: 68, 72, 77, 85, 85, 90, 90</li>
            <li>
              Mean = 567 ÷ 7 = <strong>81.0</strong>
            </li>
            <li>
              Median = 4th value = <strong>85</strong>
            </li>
            <li>
              Modes = 85 and 90 (both appear twice) →{" "}
              <strong>Bimodal: 85, 90</strong>
            </li>
            <li>
              Range = 90 − 68 = <strong>22</strong>
            </li>
          </ul>
          <p>
            The median (85) is slightly higher than the mean (81) because the
            lower score of 68 pulls the mean down. In this case, the median
            better represents the typical student's performance. If these
            students need to convert their scores to a grade-point scale, our{" "}
            <Link href="/gpa-calculator/" className="my-link">
              GPA calculator
            </Link>{" "}
            handles that conversion, and our{" "}
            <Link href="/gpa-percentage/" className="my-link">
              GPA to percentage converter
            </Link>{" "}
            translates between the two systems.
          </p>

          <h3>Example 2: Monthly Sales ($000s)</h3>
          <p>Sales over 6 months: 42, 38, 45, 200, 41, 39</p>
          <ul className="custom-list">
            <li>Sorted: 38, 39, 41, 42, 45, 200</li>
            <li>
              Mean = 405 ÷ 6 = <strong>67.5</strong>
            </li>
            <li>
              Median = (41 + 42) ÷ 2 = <strong>41.5</strong>
            </li>
            <li>
              Mode = <strong>No mode</strong> (all values unique)
            </li>
          </ul>
          <p>
            The outlier month (200) inflates the mean to 67.5, which is far
            above five of the six data points. The median (41.5) is a far more
            accurate representation of typical monthly sales. When reporting
            these figures as growth rates or ratios, our{" "}
            <Link href="/percentage-calculator/" className="my-link">
              percentage calculator
            </Link>{" "}
            can help compute percentage changes between months.
          </p>

          <h3>Example 3: Shoe Sizes Sold</h3>
          <p>A store sold sizes: 8, 9, 9, 10, 9, 8, 10, 9, 7, 9</p>
          <ul className="custom-list">
            <li>
              Mean = 88 ÷ 10 = <strong>8.8</strong>
            </li>
            <li>
              Median = (9 + 9) ÷ 2 = <strong>9.0</strong>
            </li>
            <li>
              Mode = <strong>9</strong> (appears 5 times)
            </li>
          </ul>
          <p>
            For restocking decisions, the mode (9) is the most useful number —
            it tells the store exactly which size is most in demand, regardless
            of the average.
          </p>
        </section>

        <section>
          <h2>How to Enter Data Into This Calculator</h2>
          <p>
            This calculator accepts numbers in flexible formats — no need to
            reformat your data before pasting it in:
          </p>
          <ul className="custom-list">
            <li>
              <strong>Comma-separated:</strong> 4, 8, 15, 16, 23, 42
            </li>
            <li>
              <strong>Space-separated:</strong> 4 8 15 16 23 42
            </li>
            <li>
              <strong>Mixed delimiters:</strong> 4, 8 15, 16 23 42
            </li>
            <li>
              <strong>Multi-line:</strong> paste a column of numbers directly
              from a spreadsheet
            </li>
            <li>
              <strong>Decimals:</strong> 3.14, 2.71, 1.41, 1.73 — all supported
            </li>
            <li>
              <strong>Negative numbers:</strong> -5, -3, 0, 2, 7 — fully
              supported
            </li>
          </ul>
          <p>
            Results update automatically as you type. The sorted list, frequency
            bar chart (for datasets up to 30 values), and all statistics are
            computed in real time. For large datasets, copy and paste directly
            from Excel, Google Sheets, or a CSV file. If your data includes
            values in different units that need converting first, our{" "}
            <Link href="/unit-conversion-calculator/" className="my-link">
              unit conversion calculator
            </Link>{" "}
            can handle length, mass, temperature, and volume conversions before
            you run the statistics.
          </p>
        </section>

        <section>
          <h2>Mean, Median, Mode in Real-World Applications</h2>
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginBottom: "20px",
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: "var(--card-bg, #f5f5f5)",
                    textAlign: "left",
                  }}
                >
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                    Field
                  </th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                    Common Use
                  </th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                    Preferred Measure
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  [
                    "Economics",
                    "Household income distribution",
                    "Median (skewed by high earners)",
                  ],
                  [
                    "Education",
                    "Student test score reporting",
                    "Mean + standard deviation",
                  ],
                  [
                    "Real Estate",
                    "Home price reporting",
                    "Median (outliers distort mean)",
                  ],
                  ["Medicine", "Clinical trial results", "Mean ± std dev"],
                  ["Retail", "Most popular product size/color", "Mode"],
                  [
                    "Finance",
                    "Average return over time",
                    "Mean (symmetric returns)",
                  ],
                  [
                    "Sports",
                    "Player performance benchmarking",
                    "Mean + median",
                  ],
                  ["Weather", "Temperature averages", "Mean"],
                ].map(([field, use, measure], i) => (
                  <tr
                    key={i}
                    style={{
                      backgroundColor: i % 2 === 0 ? "#fff" : "#f8f9fc",
                    }}
                  >
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                      {field}
                    </td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                      {use}
                    </td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                      {measure}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            In academic contexts, understanding how your mean exam score
            translates to a GPA matters as much as the raw number. Use our{" "}
            <Link href="/gpa-percentage/" className="my-link">
              GPA to percentage converter
            </Link>{" "}
            to bridge between percentage-based grading systems and the 4.0 GPA
            scale. For time-based analysis — calculating average durations,
            response times, or intervals — our{" "}
            <Link href="/time-calculator/" className="my-link">
              time calculator
            </Link>{" "}
            handles hours, minutes, and seconds arithmetic.
          </p>
        </section>

        <section>
          <h2>Common Mistakes When Calculating Mean, Median, and Mode</h2>
          <ul className="custom-list">
            <li>
              <strong>Forgetting to sort before finding the median.</strong> The
              median requires values in ascending (or descending) order. Picking
              the "middle" value from an unsorted list gives the wrong answer.
              This calculator sorts automatically.
            </li>
            <li>
              <strong>Confusing "no mode" with "mode is zero."</strong> When
              every value appears once, there is no mode — the dataset is
              amodal. A mode of 0 means zero is the most frequently occurring
              value, which is a completely different situation.
            </li>
            <li>
              <strong>Using mean for skewed data.</strong> Reporting mean income
              or mean home price in a skewed market misrepresents the typical
              experience. Always check whether mean and median diverge
              significantly — if they do, the median is usually the better
              summary.
            </li>
            <li>
              <strong>
                Mixing up population and sample standard deviation.
              </strong>{" "}
              If your data is a sample from a larger population, the correct
              formula divides by (n−1), not n. This calculator uses population
              standard deviation (dividing by n). For sample calculations,
              adjust manually.
            </li>
            <li>
              <strong>
                Comparing means from different-sized groups without weighting.
              </strong>{" "}
              Averaging two group means without accounting for group size
              produces a misleading result. This is known as Simpson's paradox
              in extreme cases.
            </li>
          </ul>
        </section>

        <section>
          <h2>Frequently Asked Questions</h2>
          {[
            [
              "What is the difference between mean and average?",
              "They are the same thing. 'Mean' is the precise mathematical term; 'average' is the everyday word for it. Both refer to the sum of all values divided by the count of values. In statistics, 'average' can technically refer to any measure of central tendency (mean, median, or mode), but in common usage it almost always means the arithmetic mean.",
            ],
            [
              "Can a dataset have more than one mode?",
              "Yes. A dataset is unimodal when one value appears most often, bimodal when two values tie, and multimodal when three or more values tie for most frequent. When all values appear the same number of times (usually once), there is no mode. This calculator shows all modes when multiple exist.",
            ],
            [
              "When is the median better than the mean?",
              "The median is preferred when a dataset is skewed or contains outliers. Classic examples: income data (a few very high earners inflate the mean), home prices (luxury properties distort the average), and response times (occasional very long waits skew the mean). In these cases, the median gives a more representative center.",
            ],
            [
              "What does standard deviation tell you?",
              "Standard deviation measures how spread out the values in a dataset are around the mean. A low standard deviation means values are clustered close to the mean; a high standard deviation means they are spread out widely. For a normally distributed dataset, about 68% of values fall within one standard deviation of the mean.",
            ],
            [
              "What is the difference between population and sample standard deviation?",
              "Population standard deviation (σ) divides by n and is used when your dataset is the entire population. Sample standard deviation (s) divides by n−1 and is used when your data is a sample drawn from a larger population. This calculator uses population standard deviation. For sample statistics, multiply the displayed variance by n/(n−1) and take the square root.",
            ],
            [
              "How do I find the median of an even set of numbers?",
              "Sort the numbers in ascending order, find the two middle values, then take their average. For example, with 8 numbers the middle positions are 4th and 5th. If those values are 12 and 16, the median is (12 + 16) ÷ 2 = 14. This calculator handles even and odd counts automatically.",
            ],
            [
              "Can I paste data from Excel or Google Sheets?",
              "Yes. Copy a column of numbers from Excel or Google Sheets and paste directly into the input box. The calculator accepts numbers separated by commas, spaces, or newlines, so a pasted column works immediately without reformatting.",
            ],
            [
              "What is the relationship between mean and GPA?",
              "GPA is a weighted mean — each course grade is multiplied by its credit hours before averaging. A simple mean treats all values equally, while GPA gives more weight to higher-credit courses. Use this calculator for simple means and our GPA calculator for credit-weighted academic averages.",
            ],
            [
              "Is this calculator free to use?",
              "Yes — completely free with no sign-up, no download, and no usage limits. Results appear instantly as you type, and the full statistics panel shows mean, median, mode, range, sum, count, min, max, variance, standard deviation, sorted values, and a frequency chart.",
            ],
          ].map(([q, a], i) => (
            <div className="faq-item" key={i}>
              <h3 onClick={() => toggleFAQ(i)}>
                {q}
                <i
                  className={`fa-solid fa-chevron-down ${openFAQ === i ? "rotate" : ""}`}
                />
              </h3>
              {openFAQ === i && <p>{a}</p>}
            </div>
          ))}
        </section>

        <section>
          <h2>Final Thoughts</h2>
          <p>
            Mean, median, and mode each reveal a different truth about your
            data. No single measure tells the whole story — comparing all three,
            alongside standard deviation and range, gives you a genuinely
            complete picture of any dataset. Use this calculator for quick
            statistics on any list of numbers, and pair it with our{" "}
            <Link href="/gpa-calculator/" className="my-link">
              GPA calculator
            </Link>{" "}
            for academic averages, our{" "}
            <Link href="/percentage-calculator/" className="my-link">
              percentage calculator
            </Link>{" "}
            for ratio-based analysis, or our{" "}
            <Link href="/age-calculator/" className="my-link">
              age calculator
            </Link>{" "}
            if you need to compute time-based differences in your dataset.
          </p>
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
