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
      <div>
        <h1>
          Free Matrix Calculator – Add, Multiply, Invert &amp; Solve Matrices
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

      <h2>What Is a Matrix Calculator?</h2>
      <p>
        A matrix calculator performs linear algebra operations on user-entered
        matrices instantly — without needing a graphing calculator, MATLAB
        license, or manual computation. This tool supports two matrices, A and
        B, and covers the full range of operations typically taught in a linear
        algebra or precalculus course: arithmetic between matrices,
        single-matrix transformations, and the structural properties used to
        analyze a matrix or solve a system of linear equations.
      </p>
      <p>
        Everything runs directly in your browser using standard linear algebra
        algorithms — cofactor expansion for determinants and adjoints, and
        Gauss-Jordan elimination for row reduction — so results appear instantly
        as you type, with no server round-trip and no data stored.
      </p>

      <h2>Supported Operations — Quick Reference</h2>
      <p>
        The table below summarizes every operation this calculator supports, the
        dimensional requirements, and what each one returns:
      </p>
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
                Operation
              </th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                Requirement
              </th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                Returns
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              ["A + B / A − B", "Same dimensions", "Matrix (same size)"],
              ["A × B", "Columns of A = Rows of B", "Matrix (rows A × cols B)"],
              ["Scalar k·A", "Any matrix", "Matrix (same size)"],
              ["Transpose Aᵀ", "Any matrix", "Matrix (rows ↔ cols swapped)"],
              ["Determinant det(A)", "Square matrix only", "Single number"],
              ["Inverse A⁻¹", "Square, det ≠ 0", "Matrix (same size)"],
              ["Adjoint adj(A)", "Square matrix only", "Matrix (same size)"],
              ["Rank", "Any matrix", "Single number"],
              [
                "Trace",
                "Square matrix only",
                "Single number (sum of diagonal)",
              ],
              ["RREF", "Any matrix", "Matrix (reduced row echelon form)"],
              ["Power Aⁿ", "Square matrix only", "Matrix (same size)"],
              ["Solve AX = B", "A square & invertible", "Matrix X = A⁻¹B"],
            ].map(([op, req, ret], i) => (
              <tr key={i}>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {op}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {req}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {ret}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>How to Use This Matrix Calculator</h2>
      <ul className="custom-list">
        <li>
          <strong>Step 1:</strong> Set rows and columns for Matrix A (and B if
          needed) using the + / − controls. Matrices can be up to 6×6.
        </li>
        <li>
          <strong>Step 2:</strong> Type values directly into each cell. Decimals
          and negative numbers are fully supported.
        </li>
        <li>
          <strong>Step 3:</strong> Select an operation from the chip rows.
          Results update instantly as you type or change the operation.
        </li>
        <li>
          <strong>Step 4:</strong> Click the result to copy it — it copies in
          tab-separated format ready to paste into Excel or Google Sheets.
        </li>
      </ul>

      <h2>Key Formulas Behind Each Operation</h2>
      <h3>Determinant (Cofactor Expansion)</h3>
      <p>
        For a 2×2 matrix [[a, b], [c, d]], the determinant is ad − bc. For
        larger matrices, this calculator uses recursive cofactor expansion along
        the first row. The determinant tells you whether a matrix is invertible
        (non-zero det) or singular (det = 0), and its absolute value represents
        the scaling factor the matrix applies to area or volume.
      </p>
      <h3>Inverse (via Adjugate)</h3>
      <pre>A⁻¹ = (1 / det(A)) × adj(A)</pre>
      <p>
        The inverse exists only when the determinant is non-zero. This
        calculator computes the cofactor matrix, transposes it to get the
        adjugate, then scales by 1/det. The inverse is essential for solving
        systems: if AX = B, then X = A⁻¹B.
      </p>
      <h3>RREF (Gauss-Jordan Elimination)</h3>
      <p>
        Reduced Row Echelon Form is the simplest equivalent form of a matrix,
        produced by applying elementary row operations until every leading entry
        is 1 and is the only non-zero entry in its column. RREF reveals rank,
        solution existence, and free variables in underdetermined systems.
      </p>

      <h2>Worked Examples</h2>
      <h3>Example 1: 2×2 Matrix Multiplication</h3>
      <p>A = [[1, 2], [3, 4]] and B = [[5, 6], [7, 8]]</p>
      <ul className="custom-list">
        <li>
          Row 1, Col 1: (1×5) + (2×7) = <strong>19</strong>
        </li>
        <li>
          Row 1, Col 2: (1×6) + (2×8) = <strong>22</strong>
        </li>
        <li>
          Row 2, Col 1: (3×5) + (4×7) = <strong>43</strong>
        </li>
        <li>
          Row 2, Col 2: (3×6) + (4×8) = <strong>50</strong>
        </li>
      </ul>
      <p>Result: [[19, 22], [43, 50]]</p>

      <h3>Example 2: Determinant and Inverse</h3>
      <p>A = [[4, 7], [2, 6]]</p>
      <ul className="custom-list">
        <li>
          det(A) = (4×6) − (7×2) = <strong>10</strong>
        </li>
        <li>
          A⁻¹ = (1/10) × [[6, −7], [−2, 4]] ={" "}
          <strong>[[0.6, −0.7], [−0.2, 0.4]]</strong>
        </li>
      </ul>

      <h3>Example 3: Solving a Linear System</h3>
      <p>Solve: 2x + y = 5 and 4x + 3y = 11</p>
      <ul className="custom-list">
        <li>A = [[2, 1], [4, 3]], B = [[5], [11]]</li>
        <li>det(A) = 2 (non-zero, solvable)</li>
        <li>
          X = A⁻¹B → x = <strong>2</strong>, y = <strong>1</strong>
        </li>
      </ul>

      <h2>When and Why You Would Use Each Operation</h2>
      <ul className="custom-list">
        <li>
          <strong>Determinant</strong> — Check if a system has a unique
          solution, or calculate area/volume scaling in geometry and physics.
        </li>
        <li>
          <strong>Inverse</strong> — Solve linear systems, decode Hill cipher
          cryptography, or find transformation reversals in computer graphics.
        </li>
        <li>
          <strong>RREF</strong> — Solve any system of equations including
          underdetermined and overdetermined ones, find basis vectors, and
          determine linear independence.
        </li>
        <li>
          <strong>Rank</strong> — Determine column space dimension, check system
          solvability, and identify redundant equations.
        </li>
        <li>
          <strong>Transpose</strong> — Rotate data for statistical operations,
          compute symmetric matrices (AᵀA), and prepare least-squares
          regression.
        </li>
        <li>
          <strong>Matrix Power</strong> — Model discrete time-step systems like
          Markov chains, population models, and recurrence relations.
        </li>
      </ul>
      <p>
        If you need to work with the individual numbers in your results —
        computing percentages, averages, or statistical measures — our{" "}
        <Link href="/percentage-calculator/" className="my-link">
          percentage calculator
        </Link>{" "}
        and{" "}
        <Link href="/mean-median-mode-calculator/" className="my-link">
          mean, median, mode calculator
        </Link>{" "}
        handle those computations.
      </p>

      <h2>Why Some Operations Show an Error</h2>
      <ul className="custom-list">
        <li>
          <strong>Addition / Subtraction:</strong> Both matrices must have
          exactly the same dimensions.
        </li>
        <li>
          <strong>Multiplication:</strong> Columns of A must equal rows of B.
        </li>
        <li>
          <strong>Determinant, Inverse, Adjoint, Trace, Power:</strong> All
          require a square matrix.
        </li>
        <li>
          <strong>Inverse:</strong> Also requires non-zero determinant. When det
          = 0, the matrix is singular.
        </li>
        <li>
          <strong>Solve AX = B:</strong> Requires A to be both square and
          invertible, and B to have the same number of rows as A.
        </li>
      </ul>

      <h2>Common Mistakes in Matrix Operations</h2>
      <ul className="custom-list">
        <li>
          <strong>Assuming multiplication is commutative.</strong> A × B is
          almost never the same as B × A. Order matters.
        </li>
        <li>
          <strong>Confusing adjoint with adjugate.</strong> In some textbooks,
          "adjoint" means conjugate transpose (for complex matrices). Here and
          in most linear algebra courses, it means the transpose of the cofactor
          matrix.
        </li>
        <li>
          <strong>Forgetting det = 0 means no inverse.</strong> If you try to
          solve AX = B and A has a zero determinant, use RREF instead to analyze
          the solution space.
        </li>
        <li>
          <strong>Mixing up rows and columns in multiplication.</strong> An m×n
          matrix times an n×p matrix gives m×p. If it says "columns of A must
          match rows of B," check that colsA = rowsB.
        </li>
        <li>
          <strong>Entering values in the wrong matrix for Solve AX = B.</strong>{" "}
          A is the coefficient matrix and B is the constant vector (column
          matrix). Swapping them gives wrong results.
        </li>
      </ul>

      <h2>Where Matrices Are Used in the Real World</h2>
      <ul className="custom-list">
        <li>
          <strong>Computer graphics and gaming</strong> — Every 3D rotation,
          scaling, and translation on screen is a matrix multiplication.
        </li>
        <li>
          <strong>Machine learning</strong> — Neural networks are built entirely
          on matrix multiplication and element-wise operations.
        </li>
        <li>
          <strong>Economics and finance</strong> — Input-output models,
          portfolio optimization, and Markov chains for market modeling. For
          applied financial math, our{" "}
          <Link href="/emi-calculator/" className="my-link">
            EMI calculator
          </Link>{" "}
          and{" "}
          <Link href="/loan-calculator/" className="my-link">
            loan calculator
          </Link>{" "}
          handle practical loan computations.
        </li>
        <li>
          <strong>Engineering</strong> — Structural analysis, circuit analysis,
          and control systems rely on solving matrix equations.
        </li>
        <li>
          <strong>Statistics</strong> — Regression analysis, covariance
          matrices, and PCA are matrix operations. Our{" "}
          <Link href="/mean-median-mode-calculator/" className="my-link">
            statistics calculator
          </Link>{" "}
          covers descriptive statistics.
        </li>
        <li>
          <strong>Cryptography</strong> — The Hill cipher uses matrix
          multiplication and modular inverses to encrypt and decrypt messages.
        </li>
      </ul>

      <h2>Frequently Asked Questions</h2>
      {[
        [
          "Is this matrix calculator free to use?",
          "Yes, completely free with no sign-up and no limits. Everything runs in your browser — no data is sent to any server.",
        ],
        [
          "What is the largest matrix size supported?",
          "Up to 6×6 for either matrix. This covers virtually all coursework and standard engineering applications while keeping determinant and adjoint calculations fast and instant.",
        ],
        [
          "Why does my matrix have no inverse?",
          "A matrix has no inverse when its determinant is zero — this is called a singular matrix. Geometrically, it means the matrix collapses space into a lower dimension, which cannot be undone.",
        ],
        [
          "What does it mean if 'Solve AX = B' shows an error?",
          "This means A is singular (det = 0), so the system either has no solution or infinitely many. Use the RREF operation instead to analyze the full solution space.",
        ],
        [
          "What is the difference between rank and RREF?",
          "RREF is the simplified matrix itself, produced by Gauss-Jordan elimination. Rank is a single number — the count of non-zero rows in the RREF, representing how many linearly independent rows or columns the original matrix has.",
        ],
        [
          "Is matrix multiplication commutative?",
          "No. A × B and B × A almost always give different results. In fact, one product may be defined while the other gives a different-sized result. Always multiply in the order specified.",
        ],
        [
          "Can I use decimals or negative numbers?",
          "Yes. Every cell accepts decimals and negative numbers — type them directly, e.g. -2.5 or 0.333. Results display to four decimal places where needed.",
        ],
        [
          "Can I copy results to a spreadsheet?",
          "Yes. Click the result area and it copies in tab-separated format, which pastes cleanly into Excel, Google Sheets, or any other spreadsheet.",
        ],
        [
          "Does this tool store the matrices I enter?",
          "No. All calculations happen entirely in your browser using JavaScript — nothing is sent to a server, logged, or stored.",
        ],
      ].map(([q, a], i) => (
        <div className="faq-item" key={i}>
          <h3 onClick={() => toggleFAQ(i)}>
            {q}
            <i
              className={`fa-solid fa-chevron-down ${openFAQ === i ? "rotate" : ""}`}
            ></i>
          </h3>
          {openFAQ === i && <p>{a}</p>}
        </div>
      ))}

      <h2>Final Thoughts</h2>
      <p>
        Matrices are the language of linear algebra, and linear algebra is the
        mathematical backbone of everything from search algorithms to 3D video
        games to medical imaging. This calculator gives you instant access to
        every standard matrix operation — enter your values, pick an operation,
        and see the result in real time. For related math tools, try our{" "}
        <Link href="/percentage-calculator/" className="my-link">
          percentage calculator
        </Link>{" "}
        for ratio-based computations, our{" "}
        <Link href="/mean-median-mode-calculator/" className="my-link">
          mean, median, mode calculator
        </Link>{" "}
        for descriptive statistics, or our{" "}
        <Link href="/gpa-calculator/" className="my-link">
          GPA calculator
        </Link>{" "}
        for weighted academic averages.
      </p>
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
