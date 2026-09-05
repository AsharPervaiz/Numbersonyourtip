"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";

/* ─────────────────────────────────────────
   Fraction engine
   n carries the sign, d is always positive.
───────────────────────────────────────── */
type Frac = { n: number; d: number };

const gcd = (a: number, b: number): number => {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    [a, b] = [b, a % b];
  }
  return a || 1;
};

const lcm = (a: number, b: number) => Math.abs(a * b) / gcd(a, b);

function simplify(f: Frac): Frac {
  let { n, d } = f;
  if (d < 0) {
    n = -n;
    d = -d;
  }
  const g = gcd(n, d);
  return { n: n / g, d: d / g };
}

/** A leading minus on the whole number applies to the whole quantity:
 *  −2 3/4 is −(2 + 3/4) = −11/4, not −2 + 3/4. */
function toImproper(w: number, n: number, d: number, wholeText: string): Frac {
  const W = Math.abs(w);
  const N = Math.abs(n);
  const D = Math.abs(d);
  const neg = w < 0 || /^\s*-/.test(wholeText) || (W === 0 && n < 0);
  const mag = W * D + N;
  return { n: neg ? -mag : mag, d: D };
}

function fracText(f: Frac): string {
  if (f.d === 1) return String(f.n);
  return `${f.n}/${f.d}`;
}

function mixedText(f: Frac): string {
  if (f.d === 1) return String(f.n);
  const sign = f.n < 0 ? "-" : "";
  const a = Math.abs(f.n);
  const whole = Math.floor(a / f.d);
  const rem = a % f.d;
  if (rem === 0) return `${sign}${whole}`;
  if (whole === 0) return `${sign}${rem}/${f.d}`;
  return `${sign}${whole} ${rem}/${f.d}`;
}

type Dec = { text: string; repetend: string | null; rounded: string };

function decimalOf(f: Frac): Dec {
  const sign = f.n < 0 ? "-" : "";
  const a = Math.abs(f.n);
  const d = f.d;
  const ip = Math.floor(a / d);
  let rem = a % d;
  const rounded = (f.n / f.d).toFixed(6).replace(/0+$/, "").replace(/\.$/, "");
  if (rem === 0) return { text: sign + ip, repetend: null, rounded: sign + ip };

  const seen = new Map<number, number>();
  const digits: number[] = [];
  let start = -1;
  while (rem !== 0 && digits.length < 40) {
    if (seen.has(rem)) {
      start = seen.get(rem)!;
      break;
    }
    seen.set(rem, digits.length);
    rem *= 10;
    digits.push(Math.floor(rem / d));
    rem %= d;
  }

  if (start >= 0) {
    const pre = digits.slice(0, start).join("");
    const rep = digits.slice(start).join("");
    // pad the repeating block out to a readable length, then ellipsis
    let tail = "";
    while (pre.length + tail.length < Math.max(4, rep.length)) tail += rep;
    return {
      text: `${sign}${ip}.${pre}${tail}…`,
      repetend: rep,
      rounded,
    };
  }
  return { text: `${sign}${ip}.${digits.join("")}`, repetend: null, rounded };
}

type Op = "add" | "sub" | "mul" | "div";

const OP_SYMBOL: Record<Op, string> = {
  add: "+",
  sub: "−",
  mul: "×",
  div: "÷",
};
const OP_NAME: Record<Op, string> = {
  add: "Addition",
  sub: "Subtraction",
  mul: "Multiplication",
  div: "Division",
};

type Outcome = {
  result: Frac;
  steps: string[];
  lcd: number | null;
  decimal: Dec;
  simplifiedFrom: string | null;
};

function compute(a: Frac, b: Frac, op: Op): Outcome | { error: string } {
  if (op === "div" && b.n === 0) {
    return { error: "You cannot divide by zero — the second value works out to 0." };
  }

  const steps: string[] = [];
  let raw: Frac;
  let lcd: number | null = null;

  steps.push(
    `Convert both to improper fractions: ${fracText(a)} and ${fracText(b)}.`
  );

  if (op === "add" || op === "sub") {
    lcd = lcm(a.d, b.d);
    const an = a.n * (lcd / a.d);
    const bn = b.n * (lcd / b.d);
    if (a.d === b.d) {
      steps.push(`The denominators already match at ${a.d}, so no LCD step is needed.`);
    } else {
      steps.push(
        `Find the lowest common denominator of ${a.d} and ${b.d}: LCD = ${lcd}.`
      );
      steps.push(
        `Rewrite over ${lcd}: ${fracText(a)} = ${an}/${lcd} and ${fracText(b)} = ${bn}/${lcd}.`
      );
    }
    const total = op === "add" ? an + bn : an - bn;
    steps.push(
      `${op === "add" ? "Add" : "Subtract"} the numerators: ${an} ${
        op === "add" ? "+" : "−"
      } ${bn} = ${total}. The denominator stays ${lcd}.`
    );
    raw = { n: total, d: lcd };
  } else if (op === "mul") {
    steps.push(
      `Multiply straight across: ${a.n} × ${b.n} = ${a.n * b.n} over ${a.d} × ${b.d} = ${a.d * b.d}.`
    );
    raw = { n: a.n * b.n, d: a.d * b.d };
  } else {
    steps.push(
      `Flip the second fraction and multiply: ${fracText(a)} × ${b.d}/${b.n}.`
    );
    steps.push(
      `That gives ${a.n} × ${b.d} = ${a.n * b.d} over ${a.d} × ${b.n} = ${a.d * b.n}.`
    );
    raw = { n: a.n * b.d, d: a.d * b.n };
  }

  const norm = raw.d < 0 ? { n: -raw.n, d: -raw.d } : raw;
  const result = simplify(norm);
  const g = gcd(norm.n, norm.d);

  let simplifiedFrom: string | null = null;
  if (g > 1) {
    simplifiedFrom = fracText(norm);
    steps.push(
      `Simplify ${fracText(norm)} by dividing both parts by ${g}: ${fracText(result)}.`
    );
  } else {
    steps.push(`${fracText(result)} is already in lowest terms.`);
  }

  if (result.d !== 1 && Math.abs(result.n) > result.d) {
    const whole = Math.floor(Math.abs(result.n) / result.d);
    const rem = Math.abs(result.n) % result.d;
    steps.push(
      `Convert back to a mixed number: ${Math.abs(result.n)} ÷ ${result.d} = ${whole} remainder ${rem}, so ${mixedText(result)}.`
    );
  }

  return { result, steps, lcd, decimal: decimalOf(result), simplifiedFrom };
}

/* ─────────────────────────────────────────
   Inputs
───────────────────────────────────────── */
type Fields = { w: string; n: string; d: string };

const EMPTY: Fields = { w: "", n: "", d: "" };

function readFields(f: Fields): { frac: Frac; error: string | null } {
  const w = f.w.trim() === "" || f.w.trim() === "-" ? 0 : Number(f.w);
  const n = f.n.trim() === "" ? 0 : Number(f.n);
  const d = f.d.trim() === "" ? 1 : Number(f.d);
  if (![w, n, d].every(Number.isFinite) || ![w, n, d].every(Number.isInteger)) {
    return { frac: { n: 0, d: 1 }, error: "Use whole numbers only in each box." };
  }
  if (d === 0) return { frac: { n: 0, d: 1 }, error: "A denominator cannot be 0." };
  return { frac: toImproper(w, n, d, f.w), error: null };
}

function MixedInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: Fields;
  onChange: (v: Fields) => void;
}) {
  return (
    <div className="mn-operand">
      <span className="mn-operand-label">{label}</span>
      <div className="mn-fields">
        <input
          className="mn-whole"
          inputMode="numeric"
          placeholder="0"
          aria-label={`${label} whole number`}
          value={value.w}
          onChange={(e) => onChange({ ...value, w: e.target.value })}
        />
        <div className="mn-frac">
          <input
            inputMode="numeric"
            placeholder="0"
            aria-label={`${label} numerator`}
            value={value.n}
            onChange={(e) => onChange({ ...value, n: e.target.value })}
          />
          <span className="mn-bar" aria-hidden="true" />
          <input
            inputMode="numeric"
            placeholder="1"
            aria-label={`${label} denominator`}
            value={value.d}
            onChange={(e) => onChange({ ...value, d: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Result panel
───────────────────────────────────────── */
function ResultPanel({
  outcome,
  error,
  op,
}: {
  outcome: Outcome | null;
  error: string | null;
  op: Op;
}) {
  if (error) {
    return (
      <div className="cr-panel-placeholder" role="status">
        <div className="cr-ph-icon">
          <i className="fa-solid fa-triangle-exclamation" aria-hidden="true" />
        </div>
        {error}
      </div>
    );
  }
  if (!outcome) {
    return (
      <div className="cr-panel-placeholder">
        <div className="cr-ph-icon">
          <i className="fa-solid fa-divide" aria-hidden="true" />
        </div>
        Fill in both mixed numbers to see the answer, the improper fraction, the
        decimal and every step.
      </div>
    );
  }

  const { result, steps, lcd, decimal, simplifiedFrom } = outcome;

  return (
    <div className="cr-panel">
      <div style={{ textAlign: "center", padding: "6px 0 2px" }}>
        <div className="mn-eyebrow">{OP_NAME[op]} result</div>
        <div className="mn-answer">{mixedText(result)}</div>
        <div className="cr-score-label">mixed number, lowest terms</div>
      </div>

      <div className="mn-grid">
        <div>
          <span className="mn-eyebrow">Improper fraction</span>
          <strong>{fracText(result)}</strong>
        </div>
        <div>
          <span className="mn-eyebrow">Decimal</span>
          <strong>{decimal.text}</strong>
          {decimal.repetend && (
            <em>{decimal.repetend} repeats forever</em>
          )}
        </div>
        {lcd !== null && (
          <div>
            <span className="mn-eyebrow">Lowest common denominator</span>
            <strong>{lcd}</strong>
          </div>
        )}
        {simplifiedFrom && (
          <div>
            <span className="mn-eyebrow">Simplified from</span>
            <strong>{simplifiedFrom}</strong>
          </div>
        )}
      </div>

      <div className="mn-steps">
        <span className="mn-eyebrow">Step by step</span>
        <ol>
          {steps.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   FAQ
───────────────────────────────────────── */
const FAQ_DATA: [string, string][] = [
  [
    "How do you subtract mixed numbers when the first fraction is smaller?",
    "You borrow one whole from the whole-number part and add it to the fraction. For 5 1/4 − 2 3/4, a quarter is smaller than three quarters, so rewrite 5 1/4 as 4 5/4 — the borrowed 1 becomes 4/4, added to the 1/4 already there. Now 4 5/4 − 2 3/4 = 2 2/4 = 2 1/2. Converting to improper fractions first avoids the borrowing entirely, which is why this calculator does that.",
  ],
  [
    "Why can't I just multiply the whole numbers and the fractions separately?",
    "Because multiplying two sums multiplies every part by every other part, not just like with like. For 2 1/2 × 1 1/3 the separate method gives 2 + 1/6 = 2 1/6, but the real answer is 3 1/3 — out by more than a whole unit. The two cross terms, 2 × 1/3 and 1/2 × 1, are the pieces that get dropped.",
  ],
  [
    "How do I turn a mixed number into an improper fraction?",
    "Multiply the whole number by the denominator, add the numerator, and keep the same denominator. For 3 1/2: 3 × 2 = 6, plus 1 gives 7, so 7/2. It works because the whole number is really that many copies of the denominator — three wholes is six halves.",
  ],
  [
    "How do I turn an improper fraction back into a mixed number?",
    "Divide the numerator by the denominator. The quotient is the whole number and the remainder becomes the new numerator. For 22/7: 22 ÷ 7 is 3 remainder 1, so 3 1/7. If the remainder is 0 the answer is a whole number and there is no fraction left.",
  ],
  [
    "Do I need the LCD to multiply or divide fractions?",
    "No. A common denominator is only needed for adding and subtracting, because you can only combine parts that are the same size. Multiplication and division work straight across whatever the denominators are, which is why they are usually easier than addition despite feeling harder.",
  ],
  [
    "What does a negative sign in front of a mixed number apply to?",
    "The whole quantity, not just the whole-number part. −2 3/4 means −(2 + 3/4) = −11/4, not −2 + 3/4. This trips people up constantly on subtraction problems that cross zero. Enter the minus on the whole-number box here and it is handled correctly.",
  ],
  [
    "Why does my answer come out as a repeating decimal?",
    "Because the denominator in lowest terms has a prime factor other than 2 or 5. Thirds, sixths, sevenths and ninths all repeat; halves, quarters, fifths, eighths and tenths all terminate. The fraction is the exact value — the decimal is the approximation, which is why exam answers are usually expected as fractions.",
  ],
  [
    "Is 4/4 a mixed number, an improper fraction, or a whole number?",
    "It is an improper fraction that simplifies to the whole number 1, and it is not a mixed number because a mixed number needs both a whole part and a proper fraction. Any fraction whose numerator is a multiple of its denominator reduces to a whole number this way.",
  ],
  [
    "Does the order matter for these four operations?",
    "For addition and multiplication, no — swapping the two values gives the same answer. For subtraction and division it matters completely: 5 1/4 − 2 3/4 is 2 1/2, while 2 3/4 − 5 1/4 is −2 1/2. Division is the same story, and reversing it gives the reciprocal of the right answer.",
  ],
];

/* ─────────────────────────────────────────
   Page
───────────────────────────────────────── */
export default function MixedNumberCalculator() {
  const [a, setA] = useState<Fields>({ w: "3", n: "1", d: "2" });
  const [b, setB] = useState<Fields>({ w: "2", n: "2", d: "3" });
  const [op, setOp] = useState<Op>("add");
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const toggleFAQ = (i: number) => setOpenFAQ(openFAQ === i ? null : i);

  const { outcome, error } = useMemo(() => {
    const ra = readFields(a);
    const rb = readFields(b);
    if (ra.error) return { outcome: null, error: ra.error };
    if (rb.error) return { outcome: null, error: rb.error };
    const blank =
      a.w.trim() === "" && a.n.trim() === "" && b.w.trim() === "" && b.n.trim() === "";
    if (blank) return { outcome: null, error: null };
    const res = compute(ra.frac, rb.frac, op);
    if ("error" in res) return { outcome: null, error: res.error };
    return { outcome: res, error: null };
  }, [a, b, op]);

  const clear = () => {
    setA(EMPTY);
    setB(EMPTY);
  };

  const panel = <ResultPanel outcome={outcome} error={error} op={op} />;

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

      <div className="mn-main">
        <h1>Mixed Number Calculator — Add, Subtract, Multiply, Divide</h1>
        <p>
          Work with mixed numbers and improper fractions in any of the four
          operations, and get the answer three ways — as a mixed number, as an
          improper fraction and as a decimal — with every step shown, including
          the lowest common denominator and the simplification.
        </p>

        <div className="calc-card single-calc">
          <div className="mn-row">
            <MixedInput label="First value" value={a} onChange={setA} />

            <div className="mn-op-wrap">
              <label className="mn-operand-label" htmlFor="mn-op">
                Operation
              </label>
              <select
                id="mn-op"
                className="mn-op-select"
                value={op}
                onChange={(e) => setOp(e.target.value as Op)}
              >
                {(["add", "sub", "mul", "div"] as Op[]).map((o) => (
                  <option key={o} value={o}>
                    {OP_SYMBOL[o]}
                  </option>
                ))}
              </select>
            </div>

            <MixedInput label="Second value" value={b} onChange={setB} />
          </div>

          <p className="mn-hint">
            Leave the whole-number box empty for a plain fraction, and leave the
            fraction empty for a whole number. Put a minus on the whole-number
            box for a negative mixed number.
          </p>

          <div style={{ display: "flex", gap: "10px" }}>
            <button className="calc-button calc-clear" onClick={clear}>
              Clear
            </button>
          </div>
        </div>

        <div className="cr-mobile-slot">{panel}</div>

        {/* ── SEO CONTENT ── */}

        <h2>Every Operation Starts by Getting Rid of the Mixed Number</h2>
        <p>
          A mixed number is a sum in disguise. Written 3 1/2, it means 3 + 1/2,
          and that hidden plus sign is what makes the four operations behave so
          differently from the whole-number versions people expect.
        </p>
        <p>
          The single move that makes all of it manageable is to convert to an
          improper fraction before doing anything else. Once both values are a
          single numerator over a single denominator, there is no whole part to
          keep track of and no borrowing to get wrong.
        </p>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Operation</th>
                <th>Needs a common denominator?</th>
                <th>What you actually do</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>Add</strong>
                </td>
                <td>Yes</td>
                <td>Match denominators, then add numerators</td>
              </tr>
              <tr>
                <td>
                  <strong>Subtract</strong>
                </td>
                <td>Yes</td>
                <td>Match denominators, then subtract numerators</td>
              </tr>
              <tr>
                <td>
                  <strong>Multiply</strong>
                </td>
                <td>No</td>
                <td>Multiply straight across, top and bottom</td>
              </tr>
              <tr>
                <td>
                  <strong>Divide</strong>
                </td>
                <td>No</td>
                <td>Flip the second fraction, then multiply</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          Notice that the two operations that feel harder — multiplication and
          division — are the ones with fewer steps. Addition and subtraction
          need the extra denominator work, which is where most of the errors
          live.
        </p>

        <h2>Subtraction Is the One That Needs Borrowing</h2>
        <p>
          Subtracting mixed numbers by hand is the operation people get stuck
          on, and it has one specific failure point: when the first fraction is
          smaller than the second.
        </p>
        <p>
          Take 5 1/4 − 2 3/4. A quarter minus three quarters is negative, so you
          cannot just subtract the parts. You borrow one whole from the 5, which
          becomes 4/4, and add it to the quarter already there:
        </p>
        <pre>
          5 1/4 → 4 + 4/4 + 1/4 → 4 5/4{"\n"}4 5/4 − 2 3/4 = 2 2/4 = 2 1/2
        </pre>
        <p>
          The improper-fraction route sidesteps the borrowing completely: 21/4 −
          11/4 = 10/4 = 5/2 = 2 1/2. Same answer, no decision about when to
          borrow. Both methods are worth knowing, because borrowing is what most
          classrooms teach and improper fractions are what most exams reward for
          speed.
        </p>
        <p>
          The other place subtraction goes wrong is crossing zero. 1 1/3 − 2 1/2
          gives −1 1/6, and the minus applies to the whole quantity: it is
          −(1 + 1/6), not −1 + 1/6. That distinction matters as soon as the
          result feeds into another calculation.
        </p>

        <h2>Why the Whole Numbers Cannot Be Multiplied Separately</h2>
        <p>
          The most common wrong answer in this topic comes from treating a
          mixed-number product as two independent products — whole times whole,
          fraction times fraction. It looks reasonable and it is badly wrong.
        </p>
        <p>
          Take 2 1/2 × 1 1/3. The separate method gives 2 × 1 = 2 and 1/2 × 1/3
          = 1/6, so 2 1/6. The correct answer is 3 1/3. That is not a rounding
          difference; it is out by more than a whole unit.
        </p>
        <p>
          The reason is that multiplying two sums multiplies every part by every
          other part:
        </p>
        <pre>
          (2 + 1/2)(1 + 1/3){"\n"}= 2×1 + 2×1/3 + 1/2×1 + 1/2×1/3{"\n"}= 2 + 2/3
          + 1/2 + 1/6{"\n"}= 3 1/3
        </pre>
        <p>
          The separate method keeps the first and last of those four terms and
          silently drops the two cross terms in the middle, which between them
          are worth 2/3 + 1/2. Converting to improper fractions first — 5/2 ×
          4/3 = 20/6 = 10/3 — makes the mistake impossible, because there is no
          whole number left to peel off.
        </p>

        <h2>Converting Both Ways</h2>
        <p>
          The two conversions are the same division read in opposite
          directions, and understanding one gives you the other.
        </p>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Direction</th>
                <th>Method</th>
                <th>Example</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Mixed → improper</td>
                <td>whole × denominator + numerator</td>
                <td>3 1/2 → (3×2)+1 = 7 → 7/2</td>
              </tr>
              <tr>
                <td>Improper → mixed</td>
                <td>divide, keep the remainder</td>
                <td>22/7 → 22÷7 = 3 r 1 → 3 1/7</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          The first works because a whole number is just that many copies of the
          denominator — three wholes is six halves, so 3 1/2 is seven halves.
          The second is ordinary division with a remainder, where the quotient
          becomes the whole part and the remainder stays over the original
          denominator.
        </p>
        <p>
          A remainder of zero means there was no fraction to begin with: 12/4
          divides exactly, so it is the whole number 3 rather than a mixed
          number. To use the calculator above as a converter, leave the whole
          box empty and enter the improper fraction — the panel gives you the
          mixed form, the decimal and the simplification at once.
        </p>

        <h2>Finding the LCD, and When You Can Skip It</h2>
        <p>
          You can only add parts that are the same size. Halves and thirds do
          not combine any more than centimetres and inches do, so addition and
          subtraction need both fractions rewritten over a common denominator
          first.
        </p>
        <p>
          The lowest common denominator is the lowest common multiple of the two
          denominators. For 2 and 3 it is 6; for 4 and 6 it is 12, not 24. Using
          the product of the denominators always works, but it leaves a larger
          fraction to simplify at the end.
        </p>
        <p>
          Two shortcuts cover most school problems. If one denominator divides
          into the other, the larger one is the LCD — for 3 and 9 it is 9. If
          the two share no common factor, the LCD is their product — for 4 and 7
          it is 28.
        </p>
        <p>
          Multiplication and division need none of this. That surprises people,
          but it follows from what the operations mean: adding asks how many
          equal parts you have altogether, which requires equal parts;
          multiplying asks for a fraction of a fraction, which does not.
        </p>

        <h2>Simplifying, and What Lowest Terms Actually Means</h2>
        <p>
          A fraction is in lowest terms when the numerator and denominator share
          no common factor above 1. To get there, divide both by their greatest
          common divisor.
        </p>
        <p>
          For 20/6 the greatest common divisor is 2, giving 10/3. For 8/12 it is
          4, giving 2/3 — dividing by 2 twice gets to the same place, just more
          slowly.
        </p>
        <p>
          Simplifying never changes the value, only how it is written, which is
          why 2/4, 3/6 and 1/2 are the same number. Most marking schemes expect
          the simplified form, and mixed-number answers are usually expected to
          have a proper fraction attached — 3 5/4 is not a finished answer, since
          the 5/4 still contains a whole.
        </p>

        <h2>When the Decimal Never Ends</h2>
        <p>
          Every fraction converts to a decimal by dividing the numerator by the
          denominator, but only some of those decimals stop.
        </p>
        <p>
          The rule is about the denominator in lowest terms. If its only prime
          factors are 2 and 5, the decimal terminates. Anything else repeats
          forever.
        </p>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Fraction</th>
                <th>Decimal</th>
                <th>Terminates?</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1/4</td>
                <td>0.25</td>
                <td>Yes — 4 = 2×2</td>
              </tr>
              <tr>
                <td>3/8</td>
                <td>0.375</td>
                <td>Yes — 8 = 2×2×2</td>
              </tr>
              <tr>
                <td>1/3</td>
                <td>0.3333…</td>
                <td>No — 3 is not 2 or 5</td>
              </tr>
              <tr>
                <td>5/6</td>
                <td>0.8333…</td>
                <td>No — 6 = 2×3</td>
              </tr>
              <tr>
                <td>1/7</td>
                <td>0.142857142857…</td>
                <td>No — six digits repeat</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          This is why fraction answers are treated as exact and decimal answers
          as approximations. 1/3 is precise; 0.333 is not, and rounding it early
          in a multi-step problem pushes error into everything downstream. The
          calculator above shows the repeating block explicitly so you can see
          where the pattern starts rather than reading a wall of threes.
        </p>
        <p>
          For working with percentages rather than fractions, the{" "}
          <Link href="/percentage-calculator/" className="my-link">
            percentage calculator
          </Link>{" "}
          handles that conversion, and the{" "}
          <Link href="/unit-conversion-calculator/" className="my-link">
            unit converter
          </Link>{" "}
          covers the fractional inches and feet that come up in measurements.
        </p>

        <h2>Where Mixed Numbers Turn Up Outside a Classroom</h2>
        <p>
          Recipes are the obvious one — scaling 2 1/4 cups by one and a half is
          exactly the multiplication above, and it is the case where the
          separate-wholes error produces a genuinely inedible result.
        </p>
        <p>
          Imperial measurement is the other. Timber, pipe and fastener sizes are
          quoted in fractional inches, so cutting 3 5/8 inches from a 12 1/4
          inch length is a mixed-number subtraction with borrowing. Sheet music
          works the same way when time signatures are added up, and so does any
          time sheet kept in quarter-hours.
        </p>
        <p>
          In all three the fraction is the honest form. Converting 5/8 to 0.625
          is fine; converting 1/3 of a cup to 0.33 and then multiplying by three
          gives 0.99, and the missing hundredth is the sort of drift that
          matters once it accumulates.
        </p>

        <section>
          <h2>Mixed Number Questions</h2>
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
              ["/percentage-calculator/", "Percentage Calculator"],
              ["/mean-median-mode-calculator/", "Mean, Median and Mode"],
              ["/matrix-calculator/", "Matrix Calculator"],
              ["/unit-conversion-calculator/", "Unit Conversion Calculator"],
              ["/gpa-percentage/", "GPA to Percentage"],
              ["/discount-calculator/", "Discount Calculator"],
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
