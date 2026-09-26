"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import "@fortawesome/fontawesome-free/css/all.min.css";

/* ─────────────────────────────────────────
   Exact arithmetic helpers

   Most solvers hand back 1.5615528128088303. When the coefficients are
   whole numbers the answer usually has an exact form — a fraction, or a
   surd — and that is what a marked answer is expected to be. These keep
   the exact form wherever one exists and fall back to decimals when it
   does not.
───────────────────────────────────────── */

const gcd = (x: number, y: number): number => {
  x = Math.abs(x);
  y = Math.abs(y);
  while (y) [x, y] = [y, x % y];
  return x || 1;
};

const isInt = (n: number) => Number.isFinite(n) && Number.isInteger(n);

/** √n as k√m, pulling out every square factor. */
function simplifySurd(n: number): { k: number; m: number } {
  let k = 1;
  let m = n;
  for (let f = 2; f * f <= m; f++) {
    while (m % (f * f) === 0) {
      m /= f * f;
      k *= f;
    }
  }
  return { k, m };
}

/** p/q in lowest terms, sign carried on the numerator. */
function frac(p: number, q: number): string {
  if (q < 0) [p, q] = [-p, -q];
  const g = gcd(p, q);
  p /= g;
  q /= g;
  return (q === 1 ? String(p) : `${p}/${q}`).replace("-", "−");
}

/** Display form: a true minus sign, not the hyphen JS prints. */
const dec = (n: number, dp = 4): string => {
  if (!Number.isFinite(n)) return "—";
  const r = Number(n.toFixed(dp));
  return Object.is(r, -0) ? "0" : String(r).replace("-", "−");
};

/** Drops a leading minus of either kind, so a sign can be placed by hand. */
const unsigned = (t: string) => t.replace(/^[−-]/, "");

/** Reads a coefficient box, tolerating a blank, a lone minus, or "2/3". */
function readCoef(s: string): number | null {
  const t = s.trim().replace(/\s+/g, "");
  if (t === "" || t === "-" || t === "+") return null;
  if (/^[-+]?\d+\/\d+$/.test(t)) {
    const [p, q] = t.split("/").map(Number);
    return q === 0 ? null : p / q;
  }
  const v = Number(t);
  return Number.isFinite(v) ? v : null;
}

type Kind = "two" | "one" | "complex" | "linear" | "degenerate" | "identity";

type Outcome = {
  kind: Kind;
  a: number;
  b: number;
  c: number;
  disc: number;
  /** Real roots, largest first. Empty when there are none. */
  roots: number[];
  /** Exact text for each root where one exists. */
  rootsExact: string[];
  /** Real and imaginary parts when the roots are complex. */
  complex: { re: number; im: number } | null;
  vertex: { h: number; k: number } | null;
  sum: number | null;
  product: number | null;
  factored: string | null;
  headline: string;
  steps: string[];
};

function solve(a: number, b: number, c: number): Outcome {
  const base = {
    a,
    b,
    c,
    roots: [] as number[],
    rootsExact: [] as string[],
    complex: null,
    vertex: null,
    sum: null,
    product: null,
    factored: null,
  };

  /* a = 0 is not a quadratic at all. Solvers that silently divide by 2a
     here return Infinity; naming the case is more useful. */
  if (a === 0) {
    if (b === 0) {
      return c === 0
        ? {
            ...base,
            kind: "identity",
            disc: 0,
            headline: "every x",
            steps: [
              "With a, b and c all zero the equation reads 0 = 0.",
              "That is true for every value of x, so there is nothing to solve.",
            ],
          }
        : {
            ...base,
            kind: "degenerate",
            disc: 0,
            headline: "no solution",
            steps: [
              `With a = 0 and b = 0 the equation reads ${dec(c)} = 0.`,
              "That is false whatever x is, so the equation has no solution.",
            ],
          };
    }
    const x = -c / b;
    return {
      ...base,
      kind: "linear",
      disc: 0,
      roots: [x],
      rootsExact: [isInt(b) && isInt(c) ? frac(-c, b) : dec(x)],
      headline: `x = ${isInt(b) && isInt(c) ? frac(-c, b) : dec(x)}`,
      steps: [
        "a is zero, so there is no x² term and this is a linear equation.",
        `${dec(b)}x + ${dec(c)} = 0 rearranges to ${dec(b)}x = ${dec(-c)}.`,
        `x = ${dec(-c)} ÷ ${dec(b)} = ${dec(x)}. The quadratic formula cannot be used, because it divides by 2a.`,
      ],
    };
  }

  const disc = b * b - 4 * a * c;
  const exact = isInt(a) && isInt(b) && isInt(c);
  const vertexH = -b / (2 * a);
  const vertexK = a * vertexH * vertexH + b * vertexH + c;
  const vertex = { h: vertexH, k: vertexK };
  const sum = -b / a;
  const product = c / a;

  const steps: string[] = [
    `Written in standard form: ${dec(a)}x² ${b < 0 ? "−" : "+"} ${dec(Math.abs(b))}x ${c < 0 ? "−" : "+"} ${dec(Math.abs(c))} = 0.`,
    `Discriminant: b² − 4ac = (${dec(b)})² − 4(${dec(a)})(${dec(c)}) = ${dec(b * b)} ${4 * a * c < 0 ? "+" : "−"} ${dec(Math.abs(4 * a * c))} = ${dec(disc)}.`,
  ];

  if (disc < 0) {
    const re = -b / (2 * a);
    const im = Math.sqrt(-disc) / (2 * Math.abs(a));
    steps.push(
      `${dec(disc)} is negative, so the parabola never crosses the x-axis and there are no real roots.`,
      `The square root of a negative number is imaginary: √(${dec(disc)}) = ${dec(Math.sqrt(-disc))}i.`,
      `x = (${dec(-b)} ± ${dec(Math.sqrt(-disc))}i) ÷ ${dec(2 * a)} = ${dec(re)} ± ${dec(im)}i.`,
    );
    return {
      ...base,
      kind: "complex",
      disc,
      complex: { re, im },
      vertex,
      sum,
      product,
      headline: `${dec(re, 3)} ± ${dec(im, 3)}i`,
      steps,
    };
  }

  if (disc === 0) {
    const x = -b / (2 * a);
    const xt = exact ? frac(-b, 2 * a) : dec(x);
    steps.push(
      "The discriminant is exactly zero, so the ± makes no difference and both roots are the same number.",
      `x = ${dec(-b)} ÷ ${dec(2 * a)} = ${xt}. The parabola touches the x-axis at one point rather than crossing it.`,
    );
    return {
      ...base,
      kind: "one",
      disc,
      roots: [x],
      rootsExact: [xt],
      vertex,
      sum,
      product,
      factored: exact
        ? `${a === 1 ? "" : dec(a)}(x ${x < 0 ? "+" : "−"} ${unsigned(frac(Math.abs(b), 2 * Math.abs(a)))})²`
        : null,
      headline: `x = ${xt}`,
      steps,
    };
  }

  const root = Math.sqrt(disc);
  const x1 = (-b + root) / (2 * a);
  const x2 = (-b - root) / (2 * a);
  const [hi, lo] = x1 >= x2 ? [x1, x2] : [x2, x1];

  let exactTexts: string[] = [dec(hi), dec(lo)];
  let factored: string | null = null;

  if (exact) {
    const { k, m } = simplifySurd(disc);
    if (m === 1) {
      // Perfect square: the roots are rational and it factorises.
      exactTexts = [frac(-b + k, 2 * a), frac(-b - k, 2 * a)];
      if (x1 < x2) exactTexts.reverse();
      steps.push(
        `${dec(disc)} is a perfect square — √${dec(disc)} = ${k} exactly — so both roots are fractions and the quadratic factorises.`,
      );
      factored = `${a === 1 ? "" : dec(a)}(x ${hi < 0 ? "+" : "−"} ${unsigned(exactTexts[0])})(x ${lo < 0 ? "+" : "−"} ${unsigned(exactTexts[1])})`;
    } else {
      const g = gcd(gcd(Math.abs(b), k), Math.abs(2 * a));
      const num = `${-b / g === 0 ? "" : dec(-b / g)} ± ${k / g === 1 ? "" : k / g}√${m}`;
      const den = (2 * a) / g;
      exactTexts = [
        `(${num.trim()}) / ${dec(den)}`,
        `(${num.trim()}) / ${dec(den)}`,
      ];
      steps.push(
        `${dec(disc)} is positive but not a perfect square, so the roots are irrational: √${dec(disc)} = ${k === 1 ? "" : k}√${m}.`,
      );
    }
  }

  steps.push(
    `x = (${dec(-b)} ± ${dec(root)}) ÷ ${dec(2 * a)}`,
    `x₁ = ${dec(hi)}  and  x₂ = ${dec(lo)}`,
  );

  return {
    ...base,
    kind: "two",
    disc,
    roots: [hi, lo],
    rootsExact: exactTexts,
    vertex,
    sum,
    product,
    factored,
    headline: `${dec(hi, 3)}, ${dec(lo, 3)}`,
    steps,
  };
}

/* ─────────────────────────────────────────
   Result panel
───────────────────────────────────────── */

const KIND_LABEL: Record<Kind, string> = {
  two: "Two real roots",
  one: "One repeated root",
  complex: "No real roots",
  linear: "Linear, not quadratic",
  degenerate: "No solution",
  identity: "True for every x",
};

const KIND_BADGE: Record<Kind, string> = {
  two: "good",
  one: "warning",
  complex: "danger",
  linear: "warning",
  degenerate: "danger",
  identity: "warning",
};

/** Squashes an unbounded discriminant onto −90°…+90° so the needle
 *  reports which of the three cases you are in. */
function needleDeg(disc: number): number {
  if (disc === 0) return 0;
  const n = Math.min(1, Math.log10(1 + Math.abs(disc)) / 3);
  return (disc > 0 ? 1 : -1) * Math.max(8, n * 90);
}

function QuadraticResultPanel({ result }: { result: Outcome | null }) {
  if (!result) {
    return (
      <div className="cr-panel-placeholder">
        <div className="cr-ph-icon">
          <i className="fa-solid fa-square-root-variable" aria-hidden="true" />
        </div>
        Enter a, b and c to see the roots, the discriminant, the vertex and
        every step of the working.
      </div>
    );
  }

  const {
    kind,
    disc,
    roots,
    rootsExact,
    complex,
    vertex,
    sum,
    product,
    steps,
  } = result;
  const isQuad = kind === "two" || kind === "one" || kind === "complex";

  return (
    <div className="cr-panel">
      <div className="cr-gauge-wrap">
        <svg
          className="cr-gauge-svg"
          width="100"
          height="60"
          viewBox="0 0 120 70"
          role="img"
          aria-label={`Discriminant gauge: ${dec(disc)}, meaning ${KIND_LABEL[kind].toLowerCase()}`}
        >
          <defs>
            <clipPath id="quad-half">
              <rect x="0" y="0" width="120" height="65" />
            </clipPath>
          </defs>
          <circle
            cx="60"
            cy="65"
            r="52"
            fill="none"
            stroke="#F09595"
            strokeWidth="12"
            strokeDasharray="82 326"
            strokeDashoffset="-163"
            clipPath="url(#quad-half)"
          />
          <circle
            cx="60"
            cy="65"
            r="52"
            fill="none"
            stroke="#FAC775"
            strokeWidth="12"
            strokeDasharray="4 326"
            strokeDashoffset="-245"
            clipPath="url(#quad-half)"
          />
          <circle
            cx="60"
            cy="65"
            r="52"
            fill="none"
            stroke="#97C459"
            strokeWidth="12"
            strokeDasharray="78 326"
            strokeDashoffset="-249"
            clipPath="url(#quad-half)"
          />
          <circle
            cx="60"
            cy="65"
            r="52"
            fill="none"
            stroke="#F09595"
            strokeWidth="12"
            strokeDasharray="163 326"
            strokeDashoffset="-327"
            clipPath="url(#quad-half)"
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
              transform: `rotate(${isQuad ? needleDeg(disc) : 0}deg)`,
              transition: "transform 0.5s ease",
            }}
          />
          <circle cx="60" cy="65" r="5" fill="#111111" />
        </svg>

        <div className="cr-score-block">
          <div
            className="cr-score"
            style={{ fontSize: "26px", lineHeight: 1.2 }}
          >
            {result.headline}
          </div>
          <div className="cr-score-label">
            {kind === "complex"
              ? "complex roots"
              : kind === "identity"
                ? "identity"
                : "solution for x"}
          </div>
          <span className={`cr-badge ${KIND_BADGE[kind]}`}>
            {KIND_LABEL[kind]}
          </span>
        </div>
      </div>

      {isQuad && (
        <>
          <hr className="cr-divider" />
          <div>
            <div className="cr-bar-label">
              discriminant b² − 4ac = {dec(disc)}
            </div>
            <div
              className="cr-bar-track"
              style={{
                background:
                  "linear-gradient(to right, #F09595 0%, #F09595 48%, #FAC775 48%, #FAC775 52%, #97C459 52%, #97C459 100%)",
              }}
            >
              <div
                className="cr-bar-thumb"
                style={{ left: `${50 + (needleDeg(disc) / 90) * 48}%` }}
              />
            </div>
            <div className="cr-bar-ticks">
              <span>negative</span>
              <span>zero</span>
              <span>positive</span>
            </div>
          </div>
        </>
      )}

      <hr className="cr-divider" />

      <div className="cr-metrics-grid">
        {kind === "two" && (
          <>
            <div className="cr-metric-card">
              <div className="cr-m-label">Larger root</div>
              <div className="cr-m-value">{dec(roots[0], 4)}</div>
            </div>
            <div className="cr-metric-card">
              <div className="cr-m-label">Smaller root</div>
              <div className="cr-m-value">{dec(roots[1], 4)}</div>
            </div>
          </>
        )}
        {kind === "one" && (
          <div className="cr-metric-card">
            <div className="cr-m-label">Repeated root</div>
            <div className="cr-m-value">{dec(roots[0], 4)}</div>
          </div>
        )}
        {kind === "complex" && complex && (
          <>
            <div className="cr-metric-card">
              <div className="cr-m-label">Real part</div>
              <div className="cr-m-value">{dec(complex.re, 4)}</div>
            </div>
            <div className="cr-metric-card">
              <div className="cr-m-label">Imaginary part</div>
              <div className="cr-m-value">± {dec(complex.im, 4)}i</div>
            </div>
          </>
        )}
        {vertex && (
          <>
            <div className="cr-metric-card">
              <div className="cr-m-label">Vertex</div>
              <div className="cr-m-value" style={{ fontSize: "17px" }}>
                ({dec(vertex.h, 3)}, {dec(vertex.k, 3)})
              </div>
            </div>
            <div className="cr-metric-card">
              <div className="cr-m-label">Axis of symmetry</div>
              <div className="cr-m-value" style={{ fontSize: "17px" }}>
                x = {dec(vertex.h, 3)}
              </div>
            </div>
          </>
        )}
        {sum !== null && (
          <>
            <div className="cr-metric-card">
              <div className="cr-m-label">Sum of roots (−b/a)</div>
              <div className="cr-m-value">{dec(sum, 4)}</div>
            </div>
            <div className="cr-metric-card">
              <div className="cr-m-label">Product of roots (c/a)</div>
              <div className="cr-m-value">{dec(product!, 4)}</div>
            </div>
          </>
        )}
      </div>

      {(result.rootsExact.length > 0 || result.factored) && isQuad && (
        <div className="cr-world-note" style={{ marginTop: "10px" }}>
          {kind !== "complex" && rootsExact.length > 0 && (
            <>
              <strong>Exact form:</strong>{" "}
              {rootsExact[0] === rootsExact[1]
                ? `x = ${rootsExact[0]}`
                : `x = ${rootsExact.join("  and  x = ")}`}
              {result.factored && (
                <>
                  <br />
                  <strong>Factorised:</strong> {result.factored} = 0
                </>
              )}
            </>
          )}
          {kind === "complex" && (
            <>
              A negative discriminant means the parabola sits entirely above or
              entirely below the x-axis. The roots still exist — they are just
              not real numbers.
            </>
          )}
        </div>
      )}

      <hr className="cr-divider" />

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
    "What does it mean when the discriminant is negative?",
    "It means the parabola never touches the x-axis, so there is no real number you can put in for x that makes the equation zero. The roots still exist, but they are complex — a real part plus or minus an imaginary part. This calculator shows them rather than stopping at 'no solution', because in physics and engineering the complex pair is often the answer you actually want.",
  ],
  [
    "Why do I have to rearrange the equation to equal zero first?",
    "Because the formula was derived from ax² + bx + c = 0 and nothing else. If you feed it x² + 3x = 10 as though c were 10, you are solving a different equation. Move everything to one side first, so it becomes x² + 3x − 10 = 0 and c is −10. Forgetting the sign change on the term you moved is the single most common error with quadratics.",
  ],
  [
    "Is b negative if the equation shows a minus sign?",
    "Yes. In 2x² − 7x + 3, b is −7, not 7. The formula starts with −b, so a negative b becomes +7 in the numerator. Typing 7 instead of −7 gives two answers that look plausible and are both wrong, which is why this calculator prints the substitution back to you with the signs in place.",
  ],
  [
    "When should I factorise instead of using the formula?",
    "When the discriminant is a perfect square, because that is exactly the condition under which the roots are rational and the factors are whole. If b² − 4ac comes out as 1, 4, 9, 16, 25 and so on, factorising is quicker. If it does not, no pair of whole numbers will ever work and hunting for them wastes time the formula would have saved.",
  ],
  [
    "How can I check an answer without solving it all over again?",
    "Add your two roots and multiply them. The sum should equal −b/a and the product should equal c/a. For 2x² − 3x − 5 the roots are 2.5 and −1: they add to 1.5, which matches −(−3)/2, and multiply to −2.5, which matches −5/2. Both checks passing at once means an arithmetic slip is very unlikely.",
  ],
  [
    "What happens if a is zero?",
    "It stops being a quadratic. With no x² term the equation is linear and has exactly one solution, x = −c/b. The formula cannot be used because it divides by 2a, which would be division by zero. This calculator detects that case and solves the linear equation instead of returning an error.",
  ],
  [
    "What is the vertex, and why does the calculator show it?",
    "It is the turning point of the parabola, at x = −b/2a, and it sits exactly halfway between the two roots. That makes it a useful sanity check: if your roots are not symmetric about the vertex, one of them is wrong. It also answers the question quadratics are usually asked in real problems — the maximum height, the minimum cost, the best price.",
  ],
  [
    "Why does the answer sometimes show a square root sign instead of a decimal?",
    "Because that is the exact value and the decimal is only an approximation. When the discriminant is not a perfect square the root is irrational, so 2.618033988… never terminates. Exam answers are usually expected in the exact form, so this calculator gives both — the surd for writing down and the decimal for using.",
  ],
  [
    "Does a repeated root mean there is only one solution?",
    "There is one distinct value of x, but the root is counted twice, which is why it is called a repeated or double root. Geometrically the parabola touches the x-axis without crossing it. It happens precisely when the discriminant is zero, and it means the quadratic is a perfect square, such as x² − 6x + 9 = (x − 3)².",
  ],
];

/* ─────────────────────────────────────────
   Page
───────────────────────────────────────── */
export default function QuadraticCalculator() {
  const [aRaw, setARaw] = useState("2");
  const [bRaw, setBRaw] = useState("-3");
  const [cRaw, setCRaw] = useState("-5");
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const toggleFAQ = (i: number) => setOpenFAQ(openFAQ === i ? null : i);

  const result = useMemo(() => {
    const a = readCoef(aRaw);
    const b = readCoef(bRaw);
    const c = readCoef(cRaw);
    if (a === null && b === null && c === null) return null;
    return solve(a ?? 0, b ?? 0, c ?? 0);
  }, [aRaw, bRaw, cRaw]);

  const panel = <QuadraticResultPanel result={result} />;

  const labelStyle = {
    color: "white",
    fontSize: "15px",
    fontWeight: 600,
    marginBottom: "6px",
    marginTop: "14px",
  } as const;

  const inputStyle = {
    width: "100%",
    padding: "11px 12px",
    borderRadius: "8px",
    border: "1px solid #d9dced",
    fontSize: "16px",
    fontFamily: "inherit",
  } as const;

  const preset = (a: string, b: string, c: string) => () => {
    setARaw(a);
    setBRaw(b);
    setCRaw(c);
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
        <h1>Quadratic Equation Calculator</h1>
        <p>
          Solve ax² + bx + c = 0 and see the substitution, the discriminant and
          every step of the arithmetic — not just the two numbers at the end.
          Exact surds and fractions where they exist, decimals alongside, and
          the complex pair when the parabola never reaches the x-axis.
        </p>

        <div className="calc-card single-calc">
          <p style={{ ...labelStyle, marginTop: 0 }}>
            Coefficients of ax² + bx + c = 0
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "10px",
            }}
          >
            <div>
              <label
                htmlFor="q-a"
                style={{ color: "white", fontSize: "13px", fontWeight: 600 }}
              >
                a (x² term)
              </label>
              <input
                id="q-a"
                value={aRaw}
                onChange={(e) => setARaw(e.target.value)}
                inputMode="text"
                placeholder="2"
                style={{ ...inputStyle, marginTop: "5px" }}
              />
            </div>
            <div>
              <label
                htmlFor="q-b"
                style={{ color: "white", fontSize: "13px", fontWeight: 600 }}
              >
                b (x term)
              </label>
              <input
                id="q-b"
                value={bRaw}
                onChange={(e) => setBRaw(e.target.value)}
                inputMode="text"
                placeholder="-3"
                style={{ ...inputStyle, marginTop: "5px" }}
              />
            </div>
            <div>
              <label
                htmlFor="q-c"
                style={{ color: "white", fontSize: "13px", fontWeight: 600 }}
              >
                c (constant)
              </label>
              <input
                id="q-c"
                value={cRaw}
                onChange={(e) => setCRaw(e.target.value)}
                inputMode="text"
                placeholder="-5"
                style={{ ...inputStyle, marginTop: "5px" }}
              />
            </div>
          </div>

          <p
            style={{
              color: "rgba(255,255,255,0.75)",
              fontSize: "13px",
              marginTop: "10px",
              marginBottom: 0,
            }}
          >
            Minus signs belong in the box — in 2x² − 3x − 5, b is −3 and c is
            −5. Fractions such as 2/3 are accepted.
          </p>

          <p style={labelStyle}>Try one</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {[
              ["Two roots", "2", "-3", "-5"],
              ["Repeated root", "1", "-6", "9"],
              ["No real roots", "1", "2", "5"],
              ["Irrational roots", "1", "-3", "1"],
              ["Not a quadratic", "0", "4", "-12"],
            ].map(([label, a, b, c]) => (
              <button
                key={label}
                type="button"
                onClick={preset(a, b, c)}
                style={{
                  padding: "7px 12px",
                  fontSize: "13px",
                  fontWeight: 600,
                  fontFamily: "inherit",
                  color: "#ffffff",
                  background: "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(255,255,255,0.32)",
                  borderRadius: "999px",
                  cursor: "pointer",
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="cr-mobile-slot">{panel}</div>

        <section style={{ marginTop: "34px" }}>
          <h2>What the Discriminant Decides Before You Solve Anything</h2>
          <p>
            The whole character of a quadratic is settled by one number: b² −
            4ac, the part of the formula sitting under the square root. Work it
            out first and you know what kind of answer to expect, which saves
            solving an equation that was never going to give you what you
            wanted.
          </p>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>b² − 4ac</th>
                  <th>Roots</th>
                  <th>The parabola</th>
                  <th>Factorises with whole numbers?</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Positive, and a perfect square</td>
                  <td>Two rational</td>
                  <td>Crosses the x-axis twice</td>
                  <td>Yes</td>
                </tr>
                <tr>
                  <td>Positive, not a perfect square</td>
                  <td>Two irrational</td>
                  <td>Crosses the x-axis twice</td>
                  <td>No — the formula is the fast route</td>
                </tr>
                <tr>
                  <td>Exactly zero</td>
                  <td>One, repeated</td>
                  <td>Touches the axis without crossing</td>
                  <td>Yes, as a perfect square</td>
                </tr>
                <tr>
                  <td>Negative</td>
                  <td>Two complex</td>
                  <td>Never reaches the axis</td>
                  <td>No</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            The second row is the useful one. Plenty of time is lost hunting for
            two whole numbers that multiply to give ac and add to give b, when
            the discriminant already proves no such pair exists. Thirty seconds
            spent on b² − 4ac tells you whether factorising is worth attempting.
          </p>
        </section>

        <section style={{ marginTop: "34px" }}>
          <h2>Where the Formula Comes From</h2>
          <p>
            The quadratic formula is not an arbitrary thing to memorise. It is
            what you get when you complete the square on the general equation
            once, so that nobody has to do it again. Following the derivation
            makes the formula much harder to misremember.
          </p>
          <p>
            Start from ax² + bx + c = 0 and divide through by a, which is legal
            precisely because a is not zero:
          </p>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Step</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Divide by a</td>
                  <td>x² + (b/a)x + c/a = 0</td>
                </tr>
                <tr>
                  <td>Move the constant across</td>
                  <td>x² + (b/a)x = −c/a</td>
                </tr>
                <tr>
                  <td>Add (b/2a)² to both sides</td>
                  <td>x² + (b/a)x + (b/2a)² = b²/4a² − c/a</td>
                </tr>
                <tr>
                  <td>The left side is now a perfect square</td>
                  <td>(x + b/2a)² = (b² − 4ac) / 4a²</td>
                </tr>
                <tr>
                  <td>Square root both sides</td>
                  <td>x + b/2a = ± √(b² − 4ac) / 2a</td>
                </tr>
                <tr>
                  <td>Subtract b/2a</td>
                  <td>x = (−b ± √(b² − 4ac)) / 2a</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Two things fall out of that fourth line. The discriminant appears
            naturally as the thing being square-rooted, which is why its sign
            governs everything. And −b/2a turns up as the centre of the
            expression, which is exactly why the vertex of every parabola sits
            at x = −b/2a and why the two roots are always symmetric about it.
          </p>
        </section>

        <section style={{ marginTop: "34px" }}>
          <h2>Checking an Answer Without Solving It Twice</h2>
          <p>
            There is a check that costs two pieces of mental arithmetic and
            catches almost every slip. For any quadratic, the two roots must add
            up to −b/a and multiply to give c/a. Those relationships hold
            whatever the roots are, and they do not depend on how you found
            them.
          </p>
          <p>
            Take 2x² − 3x − 5 = 0, which this calculator opens with. The roots
            come out as 2.5 and −1. Their sum is 1.5, and −b/a is −(−3)/2 = 1.5.
            Their product is −2.5, and c/a is −5/2 = −2.5. Both match, so the
            answer is almost certainly right.
          </p>
          <p>
            The check is strongest where mistakes are most likely: a dropped
            minus sign will nearly always break the sum, and a misread
            coefficient will break the product. It is worth doing even when you
            trust the arithmetic, because it takes longer to read this sentence
            than to perform.
          </p>
        </section>

        <section style={{ marginTop: "34px" }}>
          <h2>The Four Mistakes That Produce Confident Wrong Answers</h2>
          <p>
            A quadratic gone wrong rarely announces itself. The answer looks
            like an answer — two plausible numbers — and nothing flags the
            error. Four causes account for most of them.
          </p>
          <p>
            <strong>Not rearranging to zero.</strong> x² + 3x = 10 has c = −10,
            not 10, because the 10 has to cross the equals sign first. Solving
            with c = 10 gives complex roots for an equation whose real answers
            are 2 and −5.
          </p>
          <p>
            <strong>Losing the sign of b.</strong> The formula opens with −b.
            When b is already negative, that becomes a plus, and entering 7
            where the equation says −7 changes both roots.
          </p>
          <p>
            <strong>Dividing before finishing the numerator.</strong> The 2a
            divides the whole of −b ± √(b² − 4ac), not just the square root.
            Written on one line without brackets this is easy to do and gives an
            answer that fails the sum check immediately.
          </p>
          <p>
            <strong>Assuming a is 1.</strong> When the x² term has a coefficient
            it appears in three places — inside the discriminant, in the
            denominator, and in the factorised form. Halving your attention to
            it is enough to lose it in one of them.
          </p>
          <p>
            If the arithmetic itself is the part that goes wrong rather than the
            method, the{" "}
            <Link href="/math-formulas/" className="my-link">
              formula library
            </Link>{" "}
            has the quadratic formula and its discriminant written out with the
            symbols named, and the{" "}
            <Link href="/percentage-calculator/" className="my-link">
              percentage calculator
            </Link>{" "}
            handles the proportion work that word problems usually wrap around a
            quadratic.
          </p>
        </section>

        <section style={{ marginTop: "34px" }}>
          <h2>Quadratics Outside the Textbook</h2>
          <p>
            Quadratics describe anything where a quantity depends on the square
            of something else, which happens more often than the word
            &quot;quadratic&quot; suggests.
          </p>
          <p>
            Anything thrown or dropped follows one, because gravity acts on time
            squared: height is a parabola against time, the vertex is the
            highest point, and the positive root is when it lands. Area problems
            produce them whenever a length appears twice — a path of uniform
            width around a lawn, a margin around a page, a fold in a sheet of
            metal. In business, revenue against price is quadratic whenever
            raising the price reduces the number sold, which is why the vertex,
            not a root, is the answer to &quot;what should I charge&quot;.
          </p>
          <p>
            That last case is worth noticing, because it is the one where people
            solve the wrong thing. The roots tell you where profit is zero. The
            vertex tells you where it is greatest. Both come from the same three
            coefficients, and this calculator reports both.
          </p>
        </section>

        {/* FAQ */}
        <section style={{ marginTop: "34px" }}>
          <h2>Quadratic Equation Questions</h2>
          {FAQ_DATA.map(([q, a], i) => {
            const isOpen = openFAQ === i;
            return (
              <div className="faq-item" key={i}>
                <h3
                  onClick={() => toggleFAQ(i)}
                  aria-expanded={isOpen}
                  aria-controls={`q-faq-${i}`}
                  role="button"
                  tabIndex={0}
                >
                  {q}
                  <i
                    className={`fa-solid fa-chevron-down ${isOpen ? "rotate" : ""}`}
                  />
                </h3>
                <div
                  id={`q-faq-${i}`}
                  className={`faq-answer-wrap ${isOpen ? "open" : ""}`}
                  aria-hidden={!isOpen}
                >
                  <div className="faq-answer-inner">
                    <p style={{ margin: 0 }}>{a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      </div>

      {/* ---- SIDEBAR ---- */}
      <aside className="sidebar">
        <div className="cr-desktop-slot">{panel}</div>

        <div className="sidebar-box">
          <p style={{ fontSize: "20px", fontWeight: 600 }}>
            Related Calculators
          </p>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li>
              <Link href="/math-formulas/">
                <span style={{ textDecoration: "none" }}>
                  Maths Formula Library
                </span>
              </Link>
            </li>
            <li>
              <Link href="/matrix-calculator/">
                <span style={{ textDecoration: "none" }}>
                  Matrix Calculator
                </span>
              </Link>
            </li>
            <li>
              <Link href="/mean-median-mode-calculator/">
                <span style={{ textDecoration: "none" }}>
                  Mean, Median and Mode Calculator
                </span>
              </Link>
            </li>
            <li>
              <Link href="/mixed-number-calculator/">
                <span style={{ textDecoration: "none" }}>
                  Mixed Number Calculator
                </span>
              </Link>
            </li>
            <li>
              <Link href="/percentage-calculator/">
                <span style={{ textDecoration: "none" }}>
                  Percentage Calculator
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
