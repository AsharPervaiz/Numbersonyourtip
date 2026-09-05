"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import "@fortawesome/fontawesome-free/css/all.min.css";

type Matrix = number[][];
type StrMatrix = string[][];
const MAX_SIZE = 6;
const MIN_SIZE = 1;

function minor(M: Matrix, row: number, col: number): Matrix {
  return M.filter((_, i) => i !== row).map((r) =>
    r.filter((_, j) => j !== col),
  );
}
function determinant(M: Matrix): number {
  const n = M.length;
  if (n === 0) return 1;
  if (n === 1) return M[0][0];
  if (n === 2) return M[0][0] * M[1][1] - M[0][1] * M[1][0];
  let det = 0;
  for (let j = 0; j < n; j++) {
    det += (j % 2 === 0 ? 1 : -1) * M[0][j] * determinant(minor(M, 0, j));
  }
  return det;
}
function cofactorMatrix(M: Matrix): Matrix {
  return M.map((row, i) =>
    row.map(
      (_, j) => ((i + j) % 2 === 0 ? 1 : -1) * determinant(minor(M, i, j)),
    ),
  );
}
function transpose(M: Matrix): Matrix {
  return M[0].map((_, j) => M.map((row) => row[j]));
}
function adjugate(M: Matrix): Matrix {
  return transpose(cofactorMatrix(M));
}
function scalarMultiplyM(M: Matrix, k: number): Matrix {
  return M.map((row) => row.map((v) => v * k));
}
function inverseM(M: Matrix): Matrix | null {
  const det = determinant(M);
  if (Math.abs(det) < 1e-9) return null;
  return scalarMultiplyM(adjugate(M), 1 / det);
}
function addM(A: Matrix, B: Matrix): Matrix {
  return A.map((row, i) => row.map((v, j) => v + B[i][j]));
}
function subM(A: Matrix, B: Matrix): Matrix {
  return A.map((row, i) => row.map((v, j) => v - B[i][j]));
}
function multiplyM(A: Matrix, B: Matrix): Matrix {
  const r = A.length,
    c = B[0].length,
    inner = B.length;
  const result: Matrix = [];
  for (let i = 0; i < r; i++) {
    const row: number[] = [];
    for (let j = 0; j < c; j++) {
      let sum = 0;
      for (let k = 0; k < inner; k++) sum += A[i][k] * B[k][j];
      row.push(sum);
    }
    result.push(row);
  }
  return result;
}
function rrefM(matrix: Matrix): Matrix {
  const M = matrix.map((r) => r.slice());
  const rowCount = M.length,
    colCount = M[0].length;
  let lead = 0;
  for (let r = 0; r < rowCount; r++) {
    if (colCount <= lead) break;
    let i = r;
    while (Math.abs(M[i][lead]) < 1e-9) {
      i++;
      if (i === rowCount) {
        i = r;
        lead++;
        if (colCount === lead) return M;
      }
    }
    [M[i], M[r]] = [M[r], M[i]];
    const lv = M[r][lead];
    M[r] = M[r].map((v) => v / lv);
    for (let i2 = 0; i2 < rowCount; i2++) {
      if (i2 !== r) {
        const lv2 = M[i2][lead];
        M[i2] = M[i2].map((v, k) => v - lv2 * M[r][k]);
      }
    }
    lead++;
  }
  return M;
}
function rankM(M: Matrix): number {
  return rrefM(M).filter((row) => row.some((v) => Math.abs(v) > 1e-9)).length;
}
function traceM(M: Matrix): number {
  return M.reduce((s, row, i) => s + row[i], 0);
}
function identityM(n: number): Matrix {
  return Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)),
  );
}
function powerM(M: Matrix, n: number): Matrix {
  const size = M.length;
  let result = identityM(size);
  for (let i = 0; i < n; i++) result = multiplyM(result, M);
  return result;
}
function makeStrMatrix(rows: number, cols: number, fill = ""): StrMatrix {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => fill),
  );
}
function resizeStrMatrix(M: StrMatrix, rows: number, cols: number): StrMatrix {
  const result: StrMatrix = [];
  for (let i = 0; i < rows; i++) {
    const row: string[] = [];
    for (let j = 0; j < cols; j++) row.push(M[i]?.[j] ?? "");
    result.push(row);
  }
  return result;
}
function toNumMatrix(M: StrMatrix): Matrix {
  return M.map((row) =>
    row.map((v) => (v.trim() === "" ? 0 : parseFloat(v) || 0)),
  );
}
function fmt(n: number): string {
  if (Math.abs(n) < 1e-9) n = 0;
  const rounded = Math.round(n * 10000) / 10000;
  if (Number.isInteger(rounded)) return String(rounded);
  return rounded.toFixed(4).replace(/0+$/, "").replace(/\.$/, "");
}

interface OpDef {
  id: string;
  label: string;
  kind: "pair" | "single";
  target?: "A" | "B";
  needsScalar?: boolean;
  needsPower?: boolean;
}
const PAIR_OPS: OpDef[] = [
  { id: "add", label: "A + B", kind: "pair" },
  { id: "sub", label: "A − B", kind: "pair" },
  { id: "mul", label: "A × B", kind: "pair" },
  { id: "solve", label: "Solve AX = B", kind: "pair" },
];
function singleOpsFor(target: "A" | "B"): OpDef[] {
  return [
    { id: `transpose${target}`, label: `${target}ᵀ`, kind: "single", target },
    { id: `det${target}`, label: `det(${target})`, kind: "single", target },
    { id: `inv${target}`, label: `${target}⁻¹`, kind: "single", target },
    { id: `adj${target}`, label: `adj(${target})`, kind: "single", target },
    { id: `rank${target}`, label: `rank(${target})`, kind: "single", target },
    { id: `trace${target}`, label: `trace(${target})`, kind: "single", target },
    { id: `rref${target}`, label: `RREF(${target})`, kind: "single", target },
    {
      id: `power${target}`,
      label: `${target}ⁿ`,
      kind: "single",
      target,
      needsPower: true,
    },
    {
      id: `scalar${target}`,
      label: `k·${target}`,
      kind: "single",
      target,
      needsScalar: true,
    },
  ];
}
const ALL_OPS: OpDef[] = [
  ...PAIR_OPS,
  ...singleOpsFor("A"),
  ...singleOpsFor("B"),
];

const FAQS: [string, string][] = [
  [
    "Why does my matrix multiplication give a dimension error?",
    "Because the inner dimensions do not meet. To multiply an m × n matrix by a p × q one, n must equal p, and the result is m × q. Each entry pairs a row of A against a column of B, which only works if they are the same length. If the error appears, either try the other order or check whether the matrix was entered transposed.",
  ],
  [
    "Is matrix multiplication commutative?",
    "No. AB and BA are usually different, and frequently not even the same size. Multiplying a 2 × 3 by a 3 × 2 gives a 2 × 2 result; reversing the order gives a 3 × 3 one from the same two matrices. Always multiply in the order the problem specifies. The order also reverses under transpose and inverse: (AB)ᵀ is BᵀAᵀ, and (AB)⁻¹ is B⁻¹A⁻¹.",
  ],
  [
    "Why can I only take a determinant of a square matrix?",
    "The determinant describes how a matrix scales space, which is only a meaningful question when the input and output have the same number of dimensions. A non-square matrix maps between spaces of different sizes, so there is nothing for the determinant to measure. The same restriction applies to inverse, trace and matrix powers.",
  ],
  [
    "What does it mean when a matrix is singular?",
    "Its determinant is zero, so it has no inverse. The 2 × 2 inverse formula divides by the determinant, and there is nothing to divide by. It is not a limitation of the calculator — a singular matrix has genuinely collapsed space rather than reshaping it, so the transformation cannot be undone. Any matrix with a repeated row, a zero row, or a row that is a combination of others is singular.",
  ],
  [
    "How do I find the inverse of a 2 × 2 matrix by hand?",
    "Compute the determinant as ad − bc, then swap the two diagonal entries, negate the other two, and divide everything by the determinant. For [3 8; 4 6] the determinant is 18 − 32 = −14, and the inverse is (1 ÷ −14) × [6 −8; −4 3], which gives [−3/7 4/7; 2/7 −3/14].",
  ],
  [
    "What does the rank of a matrix tell me?",
    "How many of its rows carry genuinely independent information. A square matrix is invertible exactly when its rank equals its size, so rank is a direct check on whether an inverse exists. Unlike the determinant it works on any shape, which makes it useful for non-square matrices where the determinant is not defined.",
  ],
  [
    "How does solving AX = B work?",
    "A holds the coefficients of a system of linear equations, B holds the right-hand sides, and X holds the unknowns. The system 2x + 3y = 8 and 5x + 4y = 13 becomes A = [2 3; 5 4] with B = [8; 13], giving x = 1 and y = 2. Algebraically X = A⁻¹B, though in practice it is solved by elimination directly, which is faster and numerically better behaved.",
  ],
  [
    "Why does solving my system say there is no unique solution?",
    "The coefficient matrix is singular, which means the equations do not pin down a single answer. Either they contradict each other and there is no solution, or one equation repeats information the others already contain and there are infinitely many. The message is telling you something about the equations rather than about the arithmetic.",
  ],
  [
    "How can I check a matrix result quickly?",
    "Check the shape before the numbers — if the result has the wrong dimensions, the wrong operation ran. Verify an inverse by multiplying it back: A × A⁻¹ should give the identity matrix, with tiny floating-point residues near zero being normal. For a product, hand-calculate just the top-left entry from the first row of A and first column of B.",
  ],
  [
    "My inverse has huge numbers in it. Is that wrong?",
    "Probably not wrong, but treat it carefully. A determinant very close to zero means the matrix is nearly singular, and the inverse formula divides by that small number, producing very large entries. Such matrices amplify small input errors enormously, so a result that looks precise may not be reliable.",
  ],
];

export default function MatrixCalculator() {
  const [rowsA, setRowsA] = useState(2);
  const [colsA, setColsA] = useState(2);
  const [rowsB, setRowsB] = useState(2);
  const [colsB, setColsB] = useState(2);
  const [matrixA, setMatrixA] = useState<StrMatrix>(makeStrMatrix(2, 2));
  const [matrixB, setMatrixB] = useState<StrMatrix>(makeStrMatrix(2, 2));
  const [operation, setOperation] = useState("add");
  const [scalar, setScalar] = useState("2");
  const [power, setPower] = useState("2");
  const [copied, setCopied] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const toggleFAQ = (index: number) =>
    setOpenFAQ(openFAQ === index ? null : index);
  const updateDims = (which: "A" | "B", rows: number, cols: number) => {
    const r = Math.min(MAX_SIZE, Math.max(MIN_SIZE, rows));
    const c = Math.min(MAX_SIZE, Math.max(MIN_SIZE, cols));
    if (which === "A") {
      setRowsA(r);
      setColsA(c);
      setMatrixA((prev) => resizeStrMatrix(prev, r, c));
    } else {
      setRowsB(r);
      setColsB(c);
      setMatrixB((prev) => resizeStrMatrix(prev, r, c));
    }
  };
  const updateCell = (
    which: "A" | "B",
    i: number,
    j: number,
    value: string,
  ) => {
    const setter = which === "A" ? setMatrixA : setMatrixB;
    setter((prev) => {
      const copy = prev.map((row) => row.slice());
      copy[i][j] = value;
      return copy;
    });
  };
  const activeOp = ALL_OPS.find((o) => o.id === operation)!;

  const result = useMemo(() => {
    try {
      const A = toNumMatrix(matrixA);
      const B = toNumMatrix(matrixB);
      const squareCheck = (M: Matrix, name: string) => {
        if (M.length !== M[0].length)
          throw new Error(`${name} must be square for this operation.`);
      };
      switch (operation) {
        case "add": {
          if (rowsA !== rowsB || colsA !== colsB)
            throw new Error("A and B must be the same size to add.");
          return { type: "matrix" as const, value: addM(A, B) };
        }
        case "sub": {
          if (rowsA !== rowsB || colsA !== colsB)
            throw new Error("A and B must be the same size to subtract.");
          return { type: "matrix" as const, value: subM(A, B) };
        }
        case "mul": {
          if (colsA !== rowsB)
            throw new Error("Columns of A must match rows of B to multiply.");
          return { type: "matrix" as const, value: multiplyM(A, B) };
        }
        case "solve": {
          squareCheck(A, "A");
          if (rowsB !== rowsA)
            throw new Error("B must have the same number of rows as A.");
          const inv = inverseM(A);
          if (!inv)
            throw new Error(
              "A is singular (det = 0) — no unique solution exists.",
            );
          return { type: "matrix" as const, value: multiplyM(inv, B) };
        }
        case "transposeA":
          return { type: "matrix" as const, value: transpose(A) };
        case "transposeB":
          return { type: "matrix" as const, value: transpose(B) };
        case "detA":
          squareCheck(A, "A");
          return { type: "scalar" as const, value: determinant(A) };
        case "detB":
          squareCheck(B, "B");
          return { type: "scalar" as const, value: determinant(B) };
        case "invA": {
          squareCheck(A, "A");
          const inv = inverseM(A);
          if (!inv)
            throw new Error("A is singular (det = 0) — it has no inverse.");
          return { type: "matrix" as const, value: inv };
        }
        case "invB": {
          squareCheck(B, "B");
          const inv = inverseM(B);
          if (!inv)
            throw new Error("B is singular (det = 0) — it has no inverse.");
          return { type: "matrix" as const, value: inv };
        }
        case "adjA":
          squareCheck(A, "A");
          return { type: "matrix" as const, value: adjugate(A) };
        case "adjB":
          squareCheck(B, "B");
          return { type: "matrix" as const, value: adjugate(B) };
        case "rankA":
          return { type: "scalar" as const, value: rankM(A) };
        case "rankB":
          return { type: "scalar" as const, value: rankM(B) };
        case "traceA":
          squareCheck(A, "A");
          return { type: "scalar" as const, value: traceM(A) };
        case "traceB":
          squareCheck(B, "B");
          return { type: "scalar" as const, value: traceM(B) };
        case "rrefA":
          return { type: "matrix" as const, value: rrefM(A) };
        case "rrefB":
          return { type: "matrix" as const, value: rrefM(B) };
        case "powerA": {
          squareCheck(A, "A");
          const n = Math.max(0, Math.min(10, parseInt(power, 10) || 0));
          return { type: "matrix" as const, value: powerM(A, n) };
        }
        case "powerB": {
          squareCheck(B, "B");
          const n = Math.max(0, Math.min(10, parseInt(power, 10) || 0));
          return { type: "matrix" as const, value: powerM(B, n) };
        }
        case "scalarA": {
          const k = parseFloat(scalar) || 0;
          return { type: "matrix" as const, value: scalarMultiplyM(A, k) };
        }
        case "scalarB": {
          const k = parseFloat(scalar) || 0;
          return { type: "matrix" as const, value: scalarMultiplyM(B, k) };
        }
        default:
          return { type: "error" as const, message: "Unknown operation." };
      }
    } catch (e: any) {
      return {
        type: "error" as const,
        message: e?.message || "Couldn't compute this operation.",
      };
    }
  }, [matrixA, matrixB, rowsA, colsA, rowsB, colsB, operation, scalar, power]);

  const handleCopyResult = () => {
    if (result.type === "matrix") {
      const text = result.value
        .map((row) => row.map(fmt).join("\t"))
        .join("\n");
      navigator.clipboard.writeText(text);
    } else if (result.type === "scalar") {
      navigator.clipboard.writeText(fmt(result.value));
    } else {
      return;
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="single-page-padding">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQS.map(([q, a]) => ({
              "@type": "Question",
              name: q,
              acceptedAnswer: { "@type": "Answer", text: a },
            })),
          }),
        }}
      />
      <div>
        <h1>
          Matrix Calculator — Multiply, Invert, Solve AX = B
        </h1>
        <p>
          A complete matrix calculator for students and professionals: addition,
          subtraction, multiplication, transpose, determinant, inverse, adjoint,
          rank, trace, RREF, matrix powers, scalar multiplication, and solving
          linear systems AX = B. Enter your own values — everything calculates
          instantly in your browser.
        </p>
      </div>

      <div className="calc-card">
        <div className="mtx-matrices">
          <MatrixInput
            label="Matrix A"
            rows={rowsA}
            cols={colsA}
            matrix={matrixA}
            onDimsChange={(r, c) => updateDims("A", r, c)}
            onCellChange={(i, j, v) => updateCell("A", i, j, v)}
          />
          <MatrixInput
            label="Matrix B"
            rows={rowsB}
            cols={colsB}
            matrix={matrixB}
            onDimsChange={(r, c) => updateDims("B", r, c)}
            onCellChange={(i, j, v) => updateCell("B", i, j, v)}
          />
        </div>
        <div className="mtx-op-group">
          <div className="mtx-op-label">Using both matrices</div>
          <div className="dns-type-row">
            {PAIR_OPS.map((op) => (
              <button
                key={op.id}
                type="button"
                className={`dns-type-chip${operation === op.id ? " active" : ""}`}
                onClick={() => setOperation(op.id)}
              >
                {op.label}
              </button>
            ))}
          </div>
        </div>
        <div className="mtx-op-group">
          <div className="mtx-op-label">Matrix A operations</div>
          <div className="dns-type-row">
            {singleOpsFor("A").map((op) => (
              <button
                key={op.id}
                type="button"
                className={`dns-type-chip${operation === op.id ? " active" : ""}`}
                onClick={() => setOperation(op.id)}
              >
                {op.label}
              </button>
            ))}
          </div>
        </div>
        <div className="mtx-op-group">
          <div className="mtx-op-label">Matrix B operations</div>
          <div className="dns-type-row">
            {singleOpsFor("B").map((op) => (
              <button
                key={op.id}
                type="button"
                className={`dns-type-chip${operation === op.id ? " active" : ""}`}
                onClick={() => setOperation(op.id)}
              >
                {op.label}
              </button>
            ))}
          </div>
        </div>
        {(activeOp.needsScalar || activeOp.needsPower) && (
          <div className="mtx-param-row">
            {activeOp.needsScalar && (
              <label>
                Scalar k
                <input
                  className="calc-input"
                  type="text"
                  inputMode="decimal"
                  value={scalar}
                  onChange={(e) => setScalar(e.target.value)}
                  style={{ marginBottom: 0 }}
                />
              </label>
            )}
            {activeOp.needsPower && (
              <label>
                Power n (0–10)
                <input
                  className="calc-input"
                  type="text"
                  inputMode="numeric"
                  value={power}
                  onChange={(e) => setPower(e.target.value)}
                  style={{ marginBottom: 0 }}
                />
              </label>
            )}
          </div>
        )}
        <div className="calc-result" style={{ marginTop: "18px" }}>
          <div className="mtx-result-label">Result — {activeOp.label}</div>
          {result.type === "error" && (
            <div className="empty-hint">
              <i className="fa-solid fa-triangle-exclamation"></i>
              {result.message}
            </div>
          )}
          {result.type === "scalar" && (
            <div
              className="mtx-scalar-result"
              onClick={handleCopyResult}
              title="Click to copy"
            >
              {fmt(result.value)}
              <span className={`mtx-copy-flag${copied ? " show" : ""}`}>
                <i
                  className={`fa-solid ${copied ? "fa-check" : "fa-copy"}`}
                ></i>
                {copied ? "Copied" : "Copy"}
              </span>
            </div>
          )}
          {result.type === "matrix" && (
            <div
              onClick={handleCopyResult}
              title="Click to copy"
              style={{ cursor: "pointer" }}
            >
              <div
                className="mtx-grid mtx-grid-result"
                style={{
                  gridTemplateColumns: `repeat(${result.value[0]?.length || 1}, minmax(56px, 1fr))`,
                }}
              >
                {result.value.map((row, i) =>
                  row.map((v, j) => (
                    <div className="mtx-result-cell" key={`${i}-${j}`}>
                      {fmt(v)}
                    </div>
                  )),
                )}
              </div>
              <div>
                <span
                  className={`mtx-copy-flag${copied ? " show" : ""}`}
                  style={{ marginTop: "10px" }}
                >
                  <i
                    className={`fa-solid ${copied ? "fa-check" : "fa-copy"}`}
                  ></i>
                  {copied ? "Copied to clipboard" : "Click the result to copy"}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

        {/* ===== SEO CONTENT ===== */}

        <h2>Every Operation Has a Shape Rule</h2>
        <p>
          Matrix arithmetic fails more often than it succeeds for people
          learning it, and almost never because the numbers were wrong. It fails
          because the two matrices were the wrong shapes for the operation
          requested. Dimensions are not a formality here — they are the first
          thing to check and the reason most error messages appear.
        </p>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Operation</th>
                <th>Requirement</th>
                <th>Shape of the result</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>A + B, A − B</td>
                <td>Identical dimensions</td>
                <td>Same as the inputs</td>
              </tr>
              <tr>
                <td>A × B</td>
                <td>Columns of A must equal rows of B</td>
                <td>Rows of A × columns of B</td>
              </tr>
              <tr>
                <td>Determinant, Inverse, Adjoint, Trace, Power</td>
                <td>Square only</td>
                <td>A single number, or a square matrix</td>
              </tr>
              <tr>
                <td>Transpose</td>
                <td>None — works on any matrix</td>
                <td>Dimensions swapped</td>
              </tr>
              <tr>
                <td>Rank, Scalar multiplication</td>
                <td>None</td>
                <td>A number, or the same shape</td>
              </tr>
              <tr>
                <td>RREF (row reduced echelon form)</td>
                <td>None</td>
                <td>Same shape as the input</td>
              </tr>
              <tr>
                <td>Solve AX = B</td>
                <td>A square and non-singular; rows of B must match A</td>
                <td>Same rows as A, same columns as B</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          Two rows in that table cause nearly all the confusion, and both are
          worth understanding rather than memorising.
        </p>

        <h2>Multiplication: the Inner Dimensions Must Meet</h2>
        <p>
          Addition works elementwise, which is why it demands identical shapes.
          Multiplication does something quite different: each entry of the
          result is a row of A paired against a column of B. That pairing only
          works if the row and the column have the same length.
        </p>
        <pre>
          A is m × n, B is n × p → AB is m × p{"\n"}The two inner numbers must
          match; the outer two become the result
        </pre>
        <p>
          Multiplying a 2 × 3 by a 3 × 2 works, because the inner pair is 3 and
          3, and the answer is 2 × 2:
        </p>
        <pre>
          A = [1 2 3; 4 5 6]{"\n"}B = [7 8; 9 10; 11 12]{"\n"}
          {"\n"}AB[1][1] = 1×7 + 2×9 + 3×11 = 58{"\n"}AB[1][2] = 1×8 + 2×10 +
          3×12 = 64{"\n"}AB[2][1] = 4×7 + 5×9 + 6×11 = 139{"\n"}AB[2][2] = 4×8 +
          5×10 + 6×12 = 154{"\n"}
          {"\n"}AB = [58 64; 139 154]
        </pre>
        <p>
          Reverse the order and BA is also valid — the inner pair is 2 and 2 —
          but the result is 3 × 3. Same two matrices, different operation, a
          different-sized answer. This is the concrete version of the rule that
          matrix multiplication is not commutative: AB and BA are usually
          different, and are frequently not even the same shape.
        </p>
        <p>
          One consequence worth carrying: order reverses when you transpose or
          invert a product. (AB)ᵀ equals BᵀAᵀ, and (AB)⁻¹ equals B⁻¹A⁻¹. Writing
          them in the original order is a common and silent error, because the
          dimensions often still work out.
        </p>

        <h2>Determinant and Inverse: Square Only, and the Zero Wall</h2>
        <p>
          The determinant is defined only for square matrices, because it
          describes how the matrix scales space — a question that has no meaning
          when the input and output dimensions differ.
        </p>
        <pre>For a 2 × 2 [a b; c d]: det = ad − bc</pre>
        <p>
          For [3 8; 4 6] the determinant is (3 × 6) − (8 × 4) = 18 − 32 = −14.
          Once you have it, the 2 × 2 inverse is mechanical: swap the diagonal
          entries, negate the other two, and divide everything by the
          determinant.
        </p>
        <pre>
          A⁻¹ = (1 ÷ det) × [d −b; −c a]{"\n"}For [3 8; 4 6]: (1 ÷ −14) × [6 −8;
          −4 3] = [−3/7 4/7; 2/7 −3/14]
        </pre>
        <p>
          The division is where inverses fail. If the determinant is zero there
          is nothing to divide by, and the matrix has no inverse — it is called
          singular. This is not a computational limitation to work around; it
          means the matrix genuinely cannot be undone, because it has collapsed
          space rather than merely reshaping it.
        </p>
        <p>
          You can often spot it before calculating. In [1 2; 2 4] the second row
          is exactly twice the first, so the rows carry no independent
          information and the determinant is 4 − 4 = 0. Any matrix with a
          repeated row, a row of zeros, or one row that is a combination of
          others is singular for the same reason.
        </p>
        <p>
          Rank measures precisely this. It counts how many rows are genuinely
          independent, so a square matrix is invertible exactly when its rank
          equals its size. Rank works on any shape, which makes it a useful
          check when the determinant is unavailable.
        </p>

        <h2>Solving AX = B Without Inverting Anything</h2>
        <p>
          A system of linear equations can be written as one matrix equation,
          with A holding the coefficients, X the unknowns, and B the
          right-hand sides.
        </p>
        <pre>
          2x + 3y = 8{"\n"}5x + 4y = 13{"\n"}
          {"\n"}becomes A = [2 3; 5 4], B = [8; 13], solve for X{"\n"}
          {"\n"}Here the solution is x = 1, y = 2
        </pre>
        <p>
          Algebraically the solution is X = A⁻¹B, and that is how it is usually
          introduced. In practice it is solved directly by elimination rather
          than by computing the inverse first — the answer is the same and the
          direct route is faster and numerically better behaved. Either way the
          condition is identical: A must be square and non-singular.
        </p>
        <p>
          When A is singular, the system does not have one unique solution. It
          either has none, because the equations contradict each other, or
          infinitely many, because one equation adds nothing the others did not
          already say. An error at this point is telling you something about the
          equations rather than about the arithmetic.
        </p>

        <h2>What Each Error Message Is Telling You</h2>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>What happened</th>
                <th>What it means</th>
                <th>What to do</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Dimensions must match</td>
                <td>You tried to add or subtract different shapes</td>
                <td>Check both row and column counts</td>
              </tr>
              <tr>
                <td>Columns of A must match rows of B</td>
                <td>The inner dimensions do not meet</td>
                <td>
                  Try the other order, or check the matrix was entered
                  transposed
                </td>
              </tr>
              <tr>
                <td>Matrix must be square</td>
                <td>
                  Determinant, inverse, trace and power need equal rows and
                  columns
                </td>
                <td>Verify the size selector matches your data</td>
              </tr>
              <tr>
                <td>Matrix is singular</td>
                <td>The determinant is zero — no inverse exists</td>
                <td>
                  Look for a duplicated row, a zero row, or one row that is a
                  multiple of another
                </td>
              </tr>
              <tr>
                <td>No unique solution</td>
                <td>The coefficient matrix is singular</td>
                <td>
                  The system has no solution or infinitely many — re-read the
                  equations
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          The second row is the one worth pausing on. A dimension error on
          multiplication is often not a mistake in the operation but a matrix
          entered the wrong way round, and transposing it makes the product
          valid. Whether that is the product you actually wanted is a separate
          question.
        </p>

        <h2>Checking a Result Without Redoing It</h2>
        <p>
          Machine output is worth spot-checking, and a few properties make that
          quick.
        </p>
        <ul className="custom-list">
          <li>
            <strong>Verify an inverse by multiplying.</strong> A × A⁻¹ should
            give the identity matrix — ones down the diagonal, zeros elsewhere.
            Small floating-point residues near zero are normal.
          </li>
          <li>
            <strong>Check one entry of a product by hand.</strong> The top-left
            entry is the first row of A against the first column of B. If that
            matches, the shape and method are almost certainly right.
          </li>
          <li>
            <strong>Check the result shape first.</strong> Before reading any
            numbers, confirm the answer has the dimensions the rule predicts. A
            wrong shape means the wrong operation ran.
          </li>
          <li>
            <strong>Watch for a determinant very close to zero.</strong> A
            matrix that is nearly singular produces an inverse with very large
            entries, and small input errors get amplified enormously. Treat such
            results with suspicion rather than confidence.
          </li>
        </ul>
        <p>
          For statistics rather than linear algebra, our{" "}
          <Link href="/mean-median-mode-calculator/" className="my-link">
            mean, median and mode calculator
          </Link>{" "}
          handles descriptive measures, and the{" "}
          <Link href="/blog/matrix-calculator-guide/" className="my-link">
            matrix operations guide
          </Link>{" "}
          works through each operation step by step.
        </p>
      <h2>Matrix Operation Questions</h2>
      {FAQS.map(([q, a], i) => {
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
  );
}

function MatrixInput({
  label,
  rows,
  cols,
  matrix,
  onDimsChange,
  onCellChange,
}: {
  label: string;
  rows: number;
  cols: number;
  matrix: StrMatrix;
  onDimsChange: (rows: number, cols: number) => void;
  onCellChange: (i: number, j: number, value: string) => void;
}) {
  return (
    <div>
      <div className="mtx-section-label">
        <span className="mtx-section-title">{label}</span>
        <div className="mtx-dims">
          <div className="mtx-stepper">
            <button
              type="button"
              onClick={() => onDimsChange(rows - 1, cols)}
              aria-label="Fewer rows"
            >
              <i className="fa-solid fa-minus"></i>
            </button>
            <span>{rows}</span>
            <button
              type="button"
              onClick={() => onDimsChange(rows + 1, cols)}
              aria-label="More rows"
            >
              <i className="fa-solid fa-plus"></i>
            </button>
          </div>
          <span className="mtx-dims-x">×</span>
          <div className="mtx-stepper">
            <button
              type="button"
              onClick={() => onDimsChange(rows, cols - 1)}
              aria-label="Fewer columns"
            >
              <i className="fa-solid fa-minus"></i>
            </button>
            <span>{cols}</span>
            <button
              type="button"
              onClick={() => onDimsChange(rows, cols + 1)}
              aria-label="More columns"
            >
              <i className="fa-solid fa-plus"></i>
            </button>
          </div>
        </div>
      </div>
      <div
        className="mtx-grid"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(44px, 1fr))` }}
      >
        {matrix.map((row, i) =>
          row.map((val, j) => (
            <input
              key={`${i}-${j}`}
              className="mtx-cell-input"
              type="text"
              inputMode="decimal"
              placeholder="0"
              value={val}
              onChange={(e) => onCellChange(i, j, e.target.value)}
            />
          )),
        )}
      </div>
    </div>
  );
}
