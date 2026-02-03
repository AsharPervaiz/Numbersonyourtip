import { useState } from "react";

export default function ScientificCalculator() {
  const [display, setDisplay] = useState("");
  const append = (v: string) => setDisplay((p) => p + v);
  const clear = () => setDisplay("");
  const calculate = () => {
    try {
      const expr = display
        .replace(/÷/g, "/")
        .replace(/×/g, "*")
        .replace(/π/g, "Math.PI")
        .replace(/e/g, "Math.E")
        .replace(/sin/g, "Math.sin")
        .replace(/cos/g, "Math.cos")
        .replace(/tan/g, "Math.tan")
        .replace(/log/g, "Math.log10")
        .replace(/ln/g, "Math.log")
        .replace(/√/g, "Math.sqrt")
        .replace(/\^/g, "**");
      setDisplay(String(eval(expr)));
    } catch {
      setDisplay("Error");
    }
  };

  const btn = (label: string, val: string = label, type: "default" | "number" = "default") => (
  <button
    key={label}
    onClick={() => append(val)}
    className={`${type === "number" ? "btn2" : "btn"} ${type === "number" ? "btn3" : "extra-operator"}`}

  >
    {label}
  </button>
);

  return (
    <div className="calc-card">
      <div className="display">{display || "0"}</div>

      <div className="grid">

  {/* Row 1 */}
  {btn("sin", "sin(")}
  {btn("cos", "cos(")}
  {btn("tan", "tan(")}
  {btn("sin⁻¹", "asin(")}
  {btn("cos⁻¹", "acos(")}

  {/* Row 2 */}
  <button className="btn2" onClick={() => append("7")}>7</button>
  <button className="btn2" onClick={() => append("8")}>8</button>
  <button className="btn2" onClick={() => append("9")}>9</button>
  <button className="btn3" onClick={() => append("÷")}>÷</button>
  {btn("π", "π")}

  {/* Row 3 */}
  
  <button className="btn2" onClick={() => append("4")}>4</button>
  <button className="btn2" onClick={() => append("5")}>5</button>
  <button className="btn2" onClick={() => append("6")}>6</button>
  <button className="btn3" onClick={() => append("×")}>×</button>
  {btn("tan⁻¹", "atan(")}
  

  {/* Row 4 */}
  <button className="btn2" onClick={() => append("1")}>1</button>
  <button className="btn2" onClick={() => append("2")}>2</button>
  <button className="btn2" onClick={() => append("3")}>3</button>
  <button className="btn3" onClick={() => append("-")}>-</button>
  {btn("y√x", "Math.pow(")}


  {/* Row 5 */}
  {btn("0")}
  {btn("³√x", "Math.cbrt(")}
  {btn("√x", "√(")}
  <button className="btn3" onClick={() => append("+")}>+</button> 
  {btn(".")}

  {/* Row 6 */}
  {btn("e")}
  {btn("xy", "^")}
  {btn("x³", "**3")}
  {btn("x²", "**2")}
  {btn("10ˣ", "10^")}


  {/* Row 7 */}
  {btn("³√x", "Math.cbrt(")}
  {btn("√x", "√(")}
  {btn("ln", "ln(")}

  {/* Row 8 */}
  {btn("log", "log(")}
  {btn("(")}
  {btn(")")}
  {btn("1/x", "1/")}

  {/* Row 8 */}
  {btn("%")}
  
  <button className="btn solve" onClick={calculate}>=</button>
  <button className="btn clear" onClick={clear}>AC</button>
</div>

    </div>
  );
}


