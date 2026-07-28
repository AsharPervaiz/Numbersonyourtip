"use client";
import React, { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import "@fortawesome/fontawesome-free/css/all.min.css";

type SchemeMode =
  | "monochrome"
  | "monochrome-dark"
  | "monochrome-light"
  | "analogic"
  | "complement"
  | "analogic-complement"
  | "triad"
  | "quad";
type Tab = "picker" | "palette";
interface PaletteColor {
  hex: string;
  name: string;
  rgb: { r: number; g: number; b: number };
  locked: boolean;
}

const hsvToRgb = (h: number, s: number, v: number) => {
  s /= 100;
  v /= 100;
  const c = v * s,
    x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
    m = v - c;
  let r = 0,
    g = 0,
    b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
};
const rgbToHex = (r: number, g: number, b: number) =>
  "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
const hexToRgb = (hex: string) => {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.substring(0, 2), 16),
    g: parseInt(h.substring(2, 4), 16),
    b: parseInt(h.substring(4, 6), 16),
  };
};
const getLuminance = (hex: string) => {
  const { r, g, b } = hexToRgb(hex);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
};
const getOnColor = (hex: string) =>
  getLuminance(hex) > 0.45 ? "#1a1a1a" : "#ffffff";

export default function ColorTool() {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const hueRef = useRef<HTMLDivElement | null>(null);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [hue, setHue] = useState(220);
  const [sat, setSat] = useState(72);
  const [val, setVal] = useState(88);
  const [color, setColor] = useState("#3f7fe0");
  const [colorName, setColorName] = useState("");
  const [hexInput, setHexInput] = useState("3f7fe0");
  const [hexError, setHexError] = useState(false);
  const [copied, setCopied] = useState("");
  const [dragging, setDragging] = useState<"box" | "hue" | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("picker");
  const [schemeMode, setSchemeMode] = useState<SchemeMode>(
    "analogic-complement",
  );
  const [paletteCount, setPaletteCount] = useState(5);
  const [palette, setPalette] = useState<PaletteColor[]>([]);
  const [paletteLoading, setPaletteLoading] = useState(false);
  const [paletteError, setPaletteError] = useState("");
  const [savedPalettes, setSavedPalettes] = useState<PaletteColor[][]>([]);
  const [hoveredCol, setHoveredCol] = useState<number | null>(null);
  const [copiedPaletteHex, setCopiedPaletteHex] = useState("");

  useEffect(() => {
    const rgb = hsvToRgb(hue, sat, val);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    setColor(hex);
    setHexInput(hex.replace("#", ""));
  }, [hue, sat, val]);
  useEffect(() => {
    const t = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://www.thecolorapi.com/id?hex=${color.replace("#", "")}&format=json`,
        );
        const d = await res.json();
        setColorName(d?.name?.value || "");
      } catch {
        setColorName("");
      }
    }, 350);
    return () => clearTimeout(t);
  }, [color]);
  useEffect(() => {
    const initialHex = rgbToHex(
      ...(Object.values(hsvToRgb(220, 72, 88)) as [number, number, number]),
    );
    (async () => {
      try {
        const res = await fetch(
          `https://www.thecolorapi.com/scheme?hex=${initialHex.replace("#", "")}&mode=analogic-complement&count=5&format=json`,
        );
        const data = await res.json();
        setPalette(
          data.colors.map((c: any) => ({
            hex: c.hex.value,
            name: c.name.value,
            rgb: { r: c.rgb.r, g: c.rgb.g, b: c.rgb.b },
            locked: false,
          })),
        );
      } catch {}
    })();
  }, []);

  const rgb = hsvToRgb(hue, sat, val);
  const hslString = () => {
    const s = sat / 100,
      v2 = val / 100;
    const l = v2 * (1 - s / 2);
    const sl = l === 0 || l === 1 ? 0 : (v2 - l) / Math.min(l, 1 - l);
    return `hsl(${Math.round(hue)}, ${Math.round(sl * 100)}%, ${Math.round(l * 100)}%)`;
  };
  const cmykString = () => {
    let r = rgb.r / 255,
      g = rgb.g / 255,
      b = rgb.b / 255;
    const k = 1 - Math.max(r, g, b);
    return `cmyk(${Math.round(((1 - r - k) / (1 - k) || 0) * 100)}%, ${Math.round(((1 - g - k) / (1 - k) || 0) * 100)}%, ${Math.round(((1 - b - k) / (1 - k) || 0) * 100)}%, ${Math.round(k * 100)}%)`;
  };
  const xyzString = () => {
    let r = rgb.r / 255,
      g = rgb.g / 255,
      b = rgb.b / 255;
    r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
    g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
    b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
    return `${Math.round(r * 41.24 + g * 35.76 + b * 18.05)}, ${Math.round(r * 21.26 + g * 71.52 + b * 7.22)}, ${Math.round(r * 1.93 + g * 11.92 + b * 95.05)}`;
  };
  const labString = () => {
    let r = rgb.r / 255,
      g = rgb.g / 255,
      b = rgb.b / 255;
    r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
    g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
    b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
    let x = (r * 41.24 + g * 35.76 + b * 18.05) / 95.047;
    let y = (r * 21.26 + g * 71.52 + b * 7.22) / 100;
    let z = (r * 1.93 + g * 11.92 + b * 95.05) / 108.883;
    const f = (t: number) =>
      t > 0.008856 ? Math.pow(t, 1 / 3) : 7.787 * t + 16 / 116;
    return `L ${Math.round(116 * f(y) - 16)}, a ${Math.round(500 * (f(x) - f(y)))}, b ${Math.round(200 * (f(y) - f(z)))}`;
  };

  const updateBox = useCallback((cx: number, cy: number) => {
    if (!boxRef.current) return;
    const r = boxRef.current.getBoundingClientRect();
    setSat(Math.max(0, Math.min(100, ((cx - r.left) / r.width) * 100)));
    setVal(Math.max(0, Math.min(100, 100 - ((cy - r.top) / r.height) * 100)));
  }, []);
  const updateHue = useCallback((cx: number) => {
    if (!hueRef.current) return;
    const r = hueRef.current.getBoundingClientRect();
    setHue(Math.max(0, Math.min(359.9, ((cx - r.left) / r.width) * 360)));
  }, []);
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (dragging === "box") updateBox(e.clientX, e.clientY);
      if (dragging === "hue") updateHue(e.clientX);
    };
    const onUp = () => setDragging(null);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [dragging, updateBox, updateHue]);

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(""), 1400);
  };
  const handleHexChange = (v: string) => {
    setHexInput(v);
    const clean = "#" + v.replace("#", "");
    if (/^#[0-9A-Fa-f]{6}$/.test(clean)) {
      setHexError(false);
      const { r, g, b } = hexToRgb(clean);
      const max = Math.max(r, g, b),
        min = Math.min(r, g, b),
        d = max - min;
      let h = 0;
      if (d) {
        if (max === r) h = ((g - b) / d) % 6;
        else if (max === g) h = (b - r) / d + 2;
        else h = (r - g) / d + 4;
      }
      h = Math.round(h * 60);
      if (h < 0) h += 360;
      setHue(h);
      setSat(max === 0 ? 0 : (d / max) * 100);
      setVal((max / 255) * 100);
    } else setHexError(v.length > 0);
  };
  const pickFromScreen = async () => {
    if (!("EyeDropper" in window)) {
      alert("EyeDropper is only available in Chromium browsers.");
      return;
    }
    try {
      const r = await new (window as any).EyeDropper().open();
      handleHexChange(r.sRGBHex.replace("#", ""));
    } catch {}
  };

  const generatePalette = async () => {
    setPaletteLoading(true);
    setPaletteError("");
    try {
      const lockedColors = palette.filter((c) => c.locked);
      const hex = color.replace("#", "");
      const res = await fetch(
        `https://www.thecolorapi.com/scheme?hex=${hex}&mode=${schemeMode}&count=${paletteCount}&format=json`,
      );
      const data = await res.json();
      const fresh: PaletteColor[] = data.colors.map((c: any) => ({
        hex: c.hex.value,
        name: c.name.value,
        rgb: { r: c.rgb.r, g: c.rgb.g, b: c.rgb.b },
        locked: false,
      }));
      const merged = fresh.map((f, i) => {
        const lock = lockedColors.find((_, li) => li === i);
        return lock ? { ...lock } : f;
      });
      setPalette(merged);
    } catch {
      setPaletteError("Failed to connect. Please try again.");
    } finally {
      setPaletteLoading(false);
    }
  };
  const toggleLock = (i: number) =>
    setPalette((prev) =>
      prev.map((c, idx) => (idx === i ? { ...c, locked: !c.locked } : c)),
    );
  const copySingleHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedPaletteHex(hex);
    setTimeout(() => setCopiedPaletteHex(""), 1200);
  };
  const savePalette = () => {
    if (palette.length) setSavedPalettes((p) => [palette, ...p].slice(0, 8));
  };
  const exportCSS = (pal: PaletteColor[]) => {
    copy(
      `:root {\n${pal.map((c, i) => `  --color-${i + 1}: ${c.hex}; /* ${c.name} */`).join("\n")}\n}`,
    );
  };

  const SCHEMES: { value: SchemeMode; label: string }[] = [
    { value: "analogic", label: "Analogic" },
    { value: "complement", label: "Complementary" },
    { value: "analogic-complement", label: "Analogic & Comp" },
    { value: "triad", label: "Triadic" },
    { value: "quad", label: "Quadratic" },
    { value: "monochrome", label: "Monochrome" },
    { value: "monochrome-dark", label: "Mono Dark" },
    { value: "monochrome-light", label: "Mono Light" },
  ];

  return (
    <>
      <div className="single-page-padding ct-root">
        <h1>
          Color Picker &amp; Palette Generator — HEX, RGB, HSL Color Codes
        </h1>
        <p>
          Pick any color and get instant codes in HEX, RGB, HSL, CMYK, LAB, and
          XYZ. Switch to the Palette Generator to build harmonious brand color
          palettes using color theory — export as CSS variables, JSON, or save
          for later. Free color code picker online with contrast checking.
        </p>

        {/* ─── Segmented switcher ─── */}
        <div className="ct-switcher">
          <button
            className={`ct-switcher-btn${activeTab === "picker" ? " ct-switcher-active" : ""}`}
            onClick={() => setActiveTab("picker")}
          >
            <i className="fa-solid fa-eye-dropper"></i>
            <span>Color Picker</span>
          </button>
          <button
            className={`ct-switcher-btn${activeTab === "palette" ? " ct-switcher-active" : ""}`}
            onClick={() => setActiveTab("palette")}
          >
            <i className="fa-solid fa-palette"></i>
            <span>Palette Generator</span>
          </button>
        </div>

        {/* ══════════ PICKER ══════════ */}
        {activeTab === "picker" && (
          <div className="ct-picker-shell">
            <div className="ct-picker-left">
              <div
                ref={boxRef}
                className="ct-canvas"
                style={{ background: `hsl(${hue}, 100%, 50%)` }}
                onMouseDown={(e) => {
                  setDragging("box");
                  updateBox(e.clientX, e.clientY);
                }}
                onTouchStart={(e) =>
                  updateBox(e.touches[0].clientX, e.touches[0].clientY)
                }
                onTouchMove={(e) => {
                  e.preventDefault();
                  updateBox(e.touches[0].clientX, e.touches[0].clientY);
                }}
              >
                <div className="ct-canvas-white" />
                <div className="ct-canvas-black" />
                <div
                  className="ct-picker-knob"
                  style={{ left: `${sat}%`, top: `${100 - val}%` }}
                >
                  <div
                    className="ct-picker-knob-inner"
                    style={{ background: color }}
                  />
                </div>
              </div>
              <div
                ref={hueRef}
                className="ct-hue-rail"
                onMouseDown={(e) => {
                  setDragging("hue");
                  updateHue(e.clientX);
                }}
                onTouchStart={(e) => updateHue(e.touches[0].clientX)}
                onTouchMove={(e) => {
                  e.preventDefault();
                  updateHue(e.touches[0].clientX);
                }}
              >
                <div
                  className="ct-hue-thumb"
                  style={{
                    left: `${(hue / 360) * 100}%`,
                    background: `hsl(${hue}, 100%, 50%)`,
                  }}
                />
              </div>
              <div className="ct-hex-row">
                <div className={`ct-hex-box${hexError ? " ct-hex-error" : ""}`}>
                  <span className="ct-hex-hash">#</span>
                  <input
                    value={hexInput}
                    maxLength={6}
                    spellCheck={false}
                    onChange={(e) => handleHexChange(e.target.value)}
                    placeholder="3f7fe0"
                    className="ct-hex-input"
                  />
                </div>
                <div
                  className="ct-swatch"
                  style={{ background: color }}
                  title={color}
                />
                <button
                  className="ct-icon-btn"
                  onClick={pickFromScreen}
                  title="Pick from screen"
                >
                  <i className="fa-solid fa-eye-dropper"></i>
                </button>
              </div>
              {colorName && (
                <div className="ct-name-chip">
                  <span className="ct-name-dot" style={{ background: color }} />
                  {colorName}
                </div>
              )}
              <button
                className="ct-cta-btn"
                onClick={() => {
                  setActiveTab("palette");
                  if (!palette.length) generatePalette();
                }}
              >
                <i className="fa-solid fa-wand-magic-sparkles"></i> Generate
                palette from this color
              </button>
            </div>
            <div className="ct-picker-right">
              <div
                className="ct-big-swatch"
                style={{ background: color }}
                onClick={() => copy(color)}
              >
                <div
                  className="ct-big-swatch-label"
                  style={{ color: getOnColor(color) }}
                >
                  <span className="ct-big-hex">
                    {copied === color ? "Copied!" : color.toUpperCase()}
                  </span>
                  {colorName && (
                    <span className="ct-big-name">{colorName}</span>
                  )}
                </div>
              </div>
              <div className="ct-formats">
                {[
                  { label: "HEX", value: color.toUpperCase() },
                  { label: "RGB", value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
                  { label: "HSL", value: hslString() },
                  { label: "CMYK", value: cmykString() },
                  { label: "LAB", value: labString() },
                  { label: "XYZ", value: xyzString() },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="ct-format-chip"
                    onClick={() => copy(value)}
                  >
                    <div className="ct-format-label">{label}</div>
                    <div className="ct-format-value">
                      {copied === value ? "Copied!" : value}
                    </div>
                    <i className="fa-regular fa-copy ct-format-copy"></i>
                  </div>
                ))}
              </div>
              <div className="ct-contrast-row">
                <span className="ct-contrast-label">Contrast check</span>
                <div className="ct-contrast-chips">
                  <span
                    className="ct-contrast-chip"
                    style={{ background: color, color: "#fff" }}
                  >
                    Aa white
                  </span>
                  <span
                    className="ct-contrast-chip"
                    style={{ background: color, color: "#000" }}
                  >
                    Aa black
                  </span>
                  <span
                    className="ct-contrast-chip"
                    style={{
                      background: "#fff",
                      color: color,
                      border: `1.5px solid ${color}`,
                    }}
                  >
                    On white
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════ PALETTE ══════════ */}
        {activeTab === "palette" && (
          <div className="ct-palette-shell">
            <div className="ct-palette-controls">
              <div className="ct-palette-seed" title="Seed color from picker">
                <div className="ct-seed-swatch" style={{ background: color }} />
                <span className="ct-seed-hex">{color.toUpperCase()}</span>
                <button
                  className="ct-text-btn"
                  onClick={() => setActiveTab("picker")}
                >
                  <i className="fa-solid fa-pen"></i> Change
                </button>
              </div>
              <div className="ct-scheme-wrap">
                <select
                  value={schemeMode}
                  onChange={(e) => setSchemeMode(e.target.value as SchemeMode)}
                  className="ct-select"
                >
                  {SCHEMES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="ct-count-wrap">
                <label className="ct-count-label">
                  Colors: <strong>{paletteCount}</strong>
                </label>
                <input
                  type="range"
                  min={3}
                  max={9}
                  value={paletteCount}
                  step={1}
                  onChange={(e) => setPaletteCount(Number(e.target.value))}
                  className="ct-range"
                />
              </div>
              <button
                className="ct-gen-btn"
                onClick={generatePalette}
                disabled={paletteLoading}
              >
                {paletteLoading ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i> Generating…
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-shuffle"></i> Generate
                  </>
                )}
              </button>
            </div>
            {paletteError && <div className="ct-error">{paletteError}</div>}
            {palette.length > 0 && (
              <>
                <div className="ct-columns">
                  {palette.map((col, i) => {
                    const on = getOnColor(col.hex);
                    const isHovered = hoveredCol === i;
                    return (
                      <div
                        key={i}
                        className="ct-col"
                        style={{
                          background: col.hex,
                          flex: isHovered ? 1.35 : 1,
                        }}
                        onMouseEnter={() => setHoveredCol(i)}
                        onMouseLeave={() => setHoveredCol(null)}
                      >
                        <div
                          className={`ct-col-actions${isHovered ? " ct-col-actions-show" : ""}`}
                        >
                          <button
                            className="ct-col-action-btn"
                            style={{ color: on, borderColor: `${on}33` }}
                            onClick={() => toggleLock(i)}
                            title={col.locked ? "Unlock" : "Lock"}
                          >
                            <i
                              className={`fa-solid ${col.locked ? "fa-lock" : "fa-lock-open"}`}
                            ></i>
                          </button>
                          <button
                            className="ct-col-action-btn"
                            style={{ color: on, borderColor: `${on}33` }}
                            onClick={() => copySingleHex(col.hex)}
                            title="Copy HEX"
                          >
                            <i className="fa-regular fa-copy"></i>
                          </button>
                        </div>
                        <div className="ct-col-info">
                          {col.locked && (
                            <i
                              className="fa-solid fa-lock ct-col-lock-icon"
                              style={{ color: on }}
                            ></i>
                          )}
                          <div className="ct-col-hex" style={{ color: on }}>
                            {copiedPaletteHex === col.hex
                              ? "Copied!"
                              : col.hex.toUpperCase()}
                          </div>
                          <div className="ct-col-name" style={{ color: on }}>
                            {col.name}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="ct-palette-actions">
                  <button className="ct-action-btn" onClick={savePalette}>
                    <i className="fa-regular fa-bookmark"></i> Save palette
                  </button>
                  <button
                    className="ct-action-btn"
                    onClick={() => exportCSS(palette)}
                  >
                    <i className="fa-solid fa-code"></i>{" "}
                    {copied.startsWith(":root") ? "Copied!" : "Copy CSS vars"}
                  </button>
                  <button
                    className="ct-action-btn"
                    onClick={() => copy(palette.map((c) => c.hex).join(", "))}
                  >
                    <i className="fa-solid fa-list"></i> Copy all HEX
                  </button>
                  <button
                    className="ct-action-btn"
                    onClick={() =>
                      copy(
                        JSON.stringify(
                          palette.map((c) => ({
                            hex: c.hex,
                            name: c.name,
                            rgb: c.rgb,
                          })),
                          null,
                          2,
                        ),
                      )
                    }
                  >
                    <i className="fa-solid fa-file-code"></i> Copy JSON
                  </button>
                </div>
              </>
            )}
            {palette.length === 0 && !paletteLoading && (
              <div className="ct-empty">
                <div className="ct-empty-icon">
                  <i className="fa-solid fa-palette"></i>
                </div>
                <p>
                  Choose a harmony mode and click <strong>Generate</strong> to
                  build your palette.
                </p>
                <button className="ct-cta-btn" onClick={generatePalette}>
                  <i className="fa-solid fa-wand-magic-sparkles"></i> Generate
                  first palette
                </button>
              </div>
            )}
            {savedPalettes.length > 0 && (
              <div className="ct-saved">
                <div className="ct-saved-header">
                  <i className="fa-regular fa-bookmark"></i> Saved palettes
                </div>
                {savedPalettes.map((pal, pi) => (
                  <div key={pi} className="ct-saved-row">
                    <div className="ct-saved-strip">
                      {pal.map((c, ci) => (
                        <div
                          key={ci}
                          className="ct-saved-swatch"
                          style={{ background: c.hex }}
                          title={c.hex}
                        />
                      ))}
                    </div>
                    <div className="ct-saved-strip-hex">
                      {pal.map((c) => c.hex).join("  ·  ")}
                    </div>
                    <button
                      className="ct-icon-btn"
                      title="Copy CSS"
                      onClick={() => exportCSS(pal)}
                    >
                      <i className="fa-solid fa-code"></i>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── SEO Content ─── */}

        <h2>What Is a Color Picker?</h2>
        <p>
          A color picker is a tool that lets you select any color visually and
          get its exact values across every format — HEX for web CSS, RGB for
          screen displays, HSL for design adjustments, CMYK for print
          production, and LAB/XYZ for precision color science. This tool works
          as a hex color code finder, an RGB to HEX converter, a hex to HSL
          converter, and a color contrast checker — all in one interface. Pick a
          color from the gradient canvas, type a hex code directly, or use the
          EyeDropper to sample any pixel on your screen.
        </p>

        <h2>What Is a Palette Generator?</h2>
        <p>
          A palette generator uses color theory to build harmonious sets of
          colors from a single seed color. Rather than guessing which colors
          look good together, you get mathematically balanced relationships:
          complementary pairs, triadic triplets, analogic families, and more.
          This makes it a brand color palette generator — pick your primary
          brand color, select a harmony mode, and generate a complete palette
          ready for your website, app, or design system.
        </p>

        <h2>Supported Color Formats</h2>
        <p>
          This tool converts between six color formats in real time. Click any
          format value to copy it to your clipboard:
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
                  Format
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Example
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Best Used For
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                ["HEX", "#3F7FE0", "CSS, web design, brand guidelines"],
                [
                  "RGB",
                  "rgb(63, 127, 224)",
                  "Screens, digital design, JavaScript",
                ],
                [
                  "HSL",
                  "hsl(220, 72%, 56%)",
                  "Design adjustments — easy to tweak lightness and saturation",
                ],
                [
                  "CMYK",
                  "cmyk(72%, 43%, 0%, 12%)",
                  "Print design — magazines, packaging, business cards",
                ],
                [
                  "LAB",
                  "L 53, a 5, b -55",
                  "Perceptually uniform — accurate color matching across devices",
                ],
                [
                  "XYZ",
                  "23, 22, 72",
                  "Device-independent CIE standard, scientific applications",
                ],
              ].map(([format, example, use], i) => (
                <tr key={i}>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {format}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {example}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {use}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>How to Convert HEX to RGB</h2>
        <p>
          HEX and RGB represent the same thing — red, green, and blue channel
          values — just in different number systems. A HEX color code like
          #3F7FE0 is three pairs of hexadecimal digits: 3F for red, 7F for
          green, E0 for blue. To convert each pair to RGB, convert from base-16
          to base-10: 3F = 63, 7F = 127, E0 = 224, giving rgb(63, 127, 224).
        </p>
        <p>
          This tool handles the conversion automatically — pick or enter any
          color and all six formats update in real time. This makes it both an
          RGB to HEX converter (click the HEX value to copy) and a hex to HSL
          converter (click HSL to copy that format).
        </p>

        <h2>Color Harmony Modes Explained</h2>
        <p>
          Color harmony is the art of combining colors that look aesthetically
          pleasing together. The palette generator uses color theory to
          calculate these harmonies mathematically:
        </p>
        <ul className="custom-list">
          <li>
            <strong>Analogic:</strong> Adjacent colors on the wheel — calm,
            cohesive, and easy on the eyes. Great for backgrounds and subtle UI
            themes.
          </li>
          <li>
            <strong>Complementary:</strong> Colors directly opposite each other
            on the wheel. This is the complementary color finder mode — it
            creates high contrast and visual energy. Perfect for call-to-action
            buttons against a background.
          </li>
          <li>
            <strong>Analogic &amp; Complement:</strong> The richest blend — a
            family of adjacent colors plus one contrasting accent. The most
            versatile mode for full website palettes.
          </li>
          <li>
            <strong>Triadic:</strong> Three colors equally spaced around the
            wheel — vibrant, dynamic, and balanced. Popular in playful or
            creative brands.
          </li>
          <li>
            <strong>Quadratic:</strong> Four colors forming a rectangle on the
            wheel — complex and versatile, ideal for data visualization and
            dashboards.
          </li>
          <li>
            <strong>Monochrome:</strong> Tints and shades of a single hue —
            clean, elegant, and impossible to get wrong. The safest starting
            point for minimalist design.
          </li>
        </ul>

        <h2>What Are Complementary Colors?</h2>
        <p>
          Complementary colors sit directly opposite each other on the color
          wheel. Red and green, blue and orange, yellow and purple are the
          classic pairs. When placed side by side, complementary colors create
          maximum visual contrast — which is why they are used so heavily in
          call-to-action design, sports branding, and advertising. Select
          "Complementary" in the palette generator to instantly find the
          complementary pair for any color you pick.
        </p>

        <h2>What Is the 60-30-10 Color Rule?</h2>
        <p>
          The 60-30-10 rule is a design guideline for distributing colors in any
          visual project. It works for websites, interiors, presentations, and
          brand identity:
        </p>
        <ul className="custom-list">
          <li>
            <strong>60% — Dominant color:</strong> Your main background or
            primary brand color. Sets the overall tone and mood. Usually the
            most neutral or muted color in your palette.
          </li>
          <li>
            <strong>30% — Secondary color:</strong> Used for supporting elements
            like sidebars, cards, sections, or secondary buttons. Creates visual
            interest without competing with the dominant color.
          </li>
          <li>
            <strong>10% — Accent color:</strong> The boldest, most contrasting
            color. Reserved for call-to-action buttons, links, highlights, and
            elements you want the eye drawn to first.
          </li>
        </ul>
        <p>
          Generate a 3-color palette using the Complementary or Analogic mode,
          then apply the 60-30-10 split to your design. The result is a
          balanced, professional color scheme that avoids the common mistake of
          using too many colors at equal weight.
        </p>

        <h2>Color Contrast Checker</h2>
        <p>
          The contrast preview section under the color picker shows how your
          selected color looks with white text, black text, and as text on a
          white background. This is a quick color contrast checker for
          accessibility — ensuring text remains readable against your chosen
          background. WCAG accessibility guidelines recommend a contrast ratio
          of at least 4.5:1 for normal text and 3:1 for large text. Dark colors
          generally need white text; light colors need black text. The preview
          updates in real time as you pick.
        </p>

        <h2>How to Use This Tool for Brand Design</h2>
        <ul className="custom-list">
          <li>
            <strong>Step 1:</strong> Pick your primary brand color using the
            color picker or enter its HEX code directly.
          </li>
          <li>
            <strong>Step 2:</strong> Switch to the Palette Generator and select
            a harmony mode — Analogic &amp; Complement is the most versatile for
            brand palettes.
          </li>
          <li>
            <strong>Step 3:</strong> Adjust the color count (3 to 9 colors) and
            click Generate.
          </li>
          <li>
            <strong>Step 4:</strong> Lock any colors you love and regenerate to
            explore variations.
          </li>
          <li>
            <strong>Step 5:</strong> Export your palette as CSS variables, JSON,
            or a HEX list for your design system.
          </li>
          <li>
            <strong>Step 6:</strong> Apply the 60-30-10 rule to distribute your
            palette across your website or app.
          </li>
        </ul>
        <p>
          Once you have your brand colors finalized and you are building design
          assets, our{" "}
          <Link href="/image-resizer/" className="my-link">
            image resizer
          </Link>{" "}
          can prepare images in the exact dimensions your design requires, and
          our{" "}
          <Link href="/image-converter/" className="my-link">
            image converter
          </Link>{" "}
          handles format conversions between PNG, JPEG, WebP, and other formats
          for web-optimized delivery.
        </p>

        <h2>Frequently Asked Questions</h2>
        {[
          [
            "How do I generate a color palette?",
            "Pick a color using the visual picker or enter a HEX code, switch to the Palette Generator tab, select a harmony mode (Complementary, Analogic, Triadic, etc.), set the number of colors, and click Generate. The palette is built using color theory calculations via The Color API.",
          ],
          [
            "What does locking a color do?",
            "Locking a palette color preserves it when you regenerate. Unlocked slots get new colors while the locked ones stay fixed. This is useful when you have found one or two colors you love and want to explore variations around them.",
          ],
          [
            "How do I export a palette for CSS?",
            "Click 'Copy CSS vars' to get a :root { } block with named CSS custom properties for each color. You can also use 'Copy all HEX' for a comma-separated list or 'Copy JSON' for structured data with names and RGB values.",
          ],
          [
            "Can I pick a color from my screen?",
            "Yes. Click the eyedropper icon next to the HEX input to activate the browser's native EyeDropper API. This works in Chrome, Edge, and Opera. Click any pixel on your screen to sample its exact color.",
          ],
          [
            "How do I convert HEX to RGB?",
            "This tool does it automatically — pick any color and both HEX and RGB values appear instantly. To convert manually: each pair of hex digits represents a 0–255 value for red, green, and blue. #FF8800 = rgb(255, 136, 0).",
          ],
          [
            "What are complementary colors?",
            "Complementary colors are opposite each other on the color wheel — like blue and orange, red and green, or yellow and purple. They create maximum contrast when used together. Select the 'Complementary' harmony mode in the palette generator to find the complementary pair for any color.",
          ],
          [
            "What is the 60-30-10 color rule?",
            "It is a design guideline: use your dominant color for 60% of the design (backgrounds), a secondary color for 30% (cards, sidebars), and an accent color for 10% (buttons, links, highlights). This prevents visual chaos and creates professional-looking color distribution.",
          ],
          [
            "Can I use this for print design (CMYK)?",
            "Yes. CMYK values are shown in the format grid and update in real time. Note that on-screen CMYK is an approximation — for production-accurate print colors, always verify with your print provider's color profile.",
          ],
          [
            "Is this tool free to use?",
            "Yes — completely free with no sign-up and no limits. Pick colors, generate palettes, export CSS, save palettes, and convert between all six color formats without restrictions.",
          ],
        ].map(([q, a], i) => (
          <div className="faq-item" key={i}>
            <h3 onClick={() => setOpenFAQ(openFAQ === i ? null : i)}>
              {q}
              <i
                className={`fa-solid fa-chevron-down ${openFAQ === i ? "rotate" : ""}`}
              ></i>
            </h3>
            {openFAQ === i && <p>{a}</p>}
          </div>
        ))}

        <h2>Build Better Color Systems</h2>
        <p>
          Whether you are designing a website, building a brand identity,
          preparing artwork for print, or checking accessibility contrast, this
          tool gives you precise color values and harmonious palette generation
          in one place. Pick a color, get every format, generate a palette, and
          export it — all without leaving the page. For your visual assets, our{" "}
          <Link href="/image-resizer/" className="my-link">
            image resizer
          </Link>{" "}
          handles dimension adjustments and our{" "}
          <Link href="/image-converter/" className="my-link">
            image converter
          </Link>{" "}
          prepares images in the right format for web or print.
        </p>
      </div>
    </>
  );
}
