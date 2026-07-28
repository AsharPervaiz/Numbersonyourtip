"use client";

import { useState, useEffect, useCallback } from "react";

interface KeyItem {
  label: string;
  action?: string;
  insert?: string;
  cls: string;
}

const KEYS: KeyItem[] = [
  { label: "sin", action: "sin", cls: "key fn" },
  { label: "cos", action: "cos", cls: "key fn" },
  { label: "tan", action: "tan", cls: "key fn" },
  { label: "(", insert: "(", cls: "key fn" },
  { label: ")", insert: ")", cls: "key fn" },
  { label: "√", action: "sqrt", cls: "key fn" },
  { label: "x²", action: "sq", cls: "key fn" },
  { label: "xʸ", insert: "^", cls: "key fn" },
  { label: "ln", action: "ln", cls: "key fn" },
  { label: "log", action: "log", cls: "key fn" },
  { label: "7", insert: "7", cls: "key" },
  { label: "8", insert: "8", cls: "key" },
  { label: "9", insert: "9", cls: "key" },
  { label: "÷", insert: "/", cls: "key op" },
  { label: "π", action: "pi", cls: "key fn" },
  { label: "4", insert: "4", cls: "key" },
  { label: "5", insert: "5", cls: "key" },
  { label: "6", insert: "6", cls: "key" },
  { label: "×", insert: "*", cls: "key op" },
  { label: "e", action: "e", cls: "key fn" },
  { label: "1", insert: "1", cls: "key" },
  { label: "2", insert: "2", cls: "key" },
  { label: "3", insert: "3", cls: "key" },
  { label: "−", insert: "-", cls: "key op" },
  { label: "1/x", action: "inv", cls: "key fn" },
  { label: "0", insert: "0", cls: "key" },
  { label: ".", insert: ".", cls: "key" },
  { label: "%", action: "pct", cls: "key fn" },
  { label: "+", insert: "+", cls: "key op" },
  { label: "⌫", action: "del", cls: "key acc" },
  { label: "AC", action: "ac", cls: "key acc wide" },
  { label: "=", action: "eq", cls: "key eq" },
];

function evaluate(expression: string): string | null {
  try {
    const safe = expression.replace(/\^/g, "**");
    // eslint-disable-next-line no-new-func
    const result = new Function(
      '"use strict";return (' + safe + ")",
    )() as unknown;
    if (
      result === undefined ||
      typeof result !== "number" ||
      Number.isNaN(result) ||
      !Number.isFinite(result)
    )
      return null;
    return String(Math.round((result as number) * 1e10) / 1e10);
  } catch {
    return null;
  }
}

function formatDisplay(raw: string): string {
  return raw.replace(/\*/g, "×").replace(/\//g, "÷");
}

export default function Calculator() {
  const [expr, setExpr] = useState<string>("");
  const [subText, setSubText] = useState<string>("");

  const liveResult = (() => {
    if (!expr) return "";
    const r = evaluate(expr);
    return r !== null && r !== expr ? r : "";
  })();

  const appendToExpr = useCallback((chars: string) => {
    setExpr((prev) => prev + chars);
  }, []);

  const handleAction = useCallback(
    (action: string) => {
      switch (action) {
        case "ac":
          setExpr("");
          setSubText("");
          break;
        case "del":
          setExpr((prev) => prev.slice(0, -1));
          break;
        case "pi":
          appendToExpr("Math.PI");
          break;
        case "e":
          appendToExpr("Math.E");
          break;
        case "sin":
          appendToExpr("Math.sin(");
          break;
        case "cos":
          appendToExpr("Math.cos(");
          break;
        case "tan":
          appendToExpr("Math.tan(");
          break;
        case "ln":
          appendToExpr("Math.log(");
          break;
        case "log":
          appendToExpr("Math.log10(");
          break;
        case "sqrt":
          appendToExpr("Math.sqrt(");
          break;
        case "sq":
          appendToExpr("**2");
          break;
        case "inv":
          appendToExpr("1/(");
          break;
        case "pct":
          appendToExpr("/100");
          break;
        case "eq": {
          const result = evaluate(expr);
          if (result !== null) {
            setSubText(formatDisplay(expr) + " =");
            setExpr(result);
          } else {
            setSubText("Error");
          }
          break;
        }
      }
    },
    [expr, appendToExpr],
  );

  const handleKey = useCallback(
    (action?: string, insert?: string) => {
      if (insert !== undefined) appendToExpr(insert);
      else if (action) handleAction(action);
    },
    [appendToExpr, handleAction],
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const k = e.key;
      if ("0123456789".includes(k)) {
        appendToExpr(k);
        return;
      }
      if ("+-*/".includes(k)) {
        appendToExpr(k);
        return;
      }
      if (k === ".") {
        appendToExpr(".");
        return;
      }
      if (k === "(") {
        appendToExpr("(");
        return;
      }
      if (k === ")") {
        appendToExpr(")");
        return;
      }
      if (k === "^") {
        appendToExpr("^");
        return;
      }
      if (k === "%") {
        handleAction("pct");
        return;
      }
      if (k === "Enter" || k === "=") {
        e.preventDefault();
        handleAction("eq");
        return;
      }
      if (k === "Backspace") {
        handleAction("del");
        return;
      }
      if (k === "Escape") {
        handleAction("ac");
        return;
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [appendToExpr, handleAction]);

  return (
    <div className="calc-wrap">
      <div className="calc" id="calc">
        <div className="calc-screen">
          <div className="sub">{subText || "\u00A0"}</div>
          <div className="main">{expr === "" ? "0" : formatDisplay(expr)}</div>
          <div className="live-preview">
            {liveResult ? "= " + liveResult : "\u00A0"}
          </div>
        </div>

        <div className="calc-pad">
          {KEYS.map((keyItem, index) => (
            <button
              key={index}
              className={keyItem.cls}
              onClick={() => handleKey(keyItem.action, keyItem.insert)}
            >
              {keyItem.label}
            </button>
          ))}
        </div>

        <div className="calc-tag">NUMBERS ON YOUR TIP®</div>
      </div>
    </div>
  );
}
