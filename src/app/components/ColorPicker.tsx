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

const FAQS: [string, string][] = [
  [
    "What is the difference between HEX, RGB and HSL?",
    "They are three notations for the same colour, and each is convenient for something different. HEX packs red, green and blue into pairs of hex digits and is ideal for copying an exact value between tools. RGB gives the same three channels as decimal numbers and adds transparency easily. HSL describes hue, saturation and lightness, which is the only one of the three you can adjust deliberately.",
  ],
  [
    "Why should I use HSL when designing?",
    "Because it lets you change one property at a time. Making a colour darker in HEX or RGB means adjusting three numbers together and hoping the hue does not drift. In HSL you lower the lightness value and everything else stays put, which is what makes generating consistent tints and shades straightforward.",
  ],
  [
    "How do I read a HEX code without converting it?",
    "Read it as three pairs — red, green, blue — each running from 00 to FF. All three pairs equal means a shade of grey, so #333333 and #CCCCCC are grey at a glance. The three-digit shorthand doubles each character, so #F0A is #FF00AA, which is why only some colours can be written that way. An eight-digit code adds a fourth pair for transparency.",
  ],
  [
    "How do I build a colour palette that works?",
    "Derive every colour from one base rather than picking them independently. Monochromatic uses one hue at different lightness levels and is almost impossible to get wrong. Analogous uses neighbouring hues for a calm effect. Complementary uses the opposite hue for a single strong accent. In practice a workable interface palette is one dominant colour, one supporting colour, one accent used sparingly, and several neutral greys doing most of the work.",
  ],
  [
    "What contrast ratio do I need for readable text?",
    "At least 4.5:1 for normal body text and 3:1 for large text and meaningful interface elements, with 7:1 as the stricter standard for long-form reading. The scale runs from 1:1 for identical colours up to 21:1 for black on white. Light grey text on white is currently fashionable and frequently fails outright.",
  ],
  [
    "Why do two very different colours sometimes fail a contrast check?",
    "Because contrast depends on relative luminance rather than on how different the colours look. A mid red on a mid green looks wildly different and can be nearly unreadable, because both sit at similar brightness. This is why contrast has to be measured rather than judged by eye.",
  ],
  [
    "Is it enough to use colour alone to show status?",
    "No. Around one in twelve men has some form of colour vision deficiency, so a red and green indicator distinguished only by hue conveys nothing to them. Add a second signal — a shape, an icon, or a text label — so the meaning survives without the colour.",
  ],
  [
    "Why does my brand colour look different on another screen?",
    "Because a HEX code is an instruction rather than a guarantee. What a viewer sees depends on their display, its calibration and its colour profile, which is why the same value can look noticeably different on two monitors side by side. There is no way to control this from your end beyond choosing colours that remain acceptable across a range of displays.",
  ],
  [
    "Will my screen colours print correctly?",
    "Not always. Screens emit light and mix red, green and blue; print reflects light and mixes cyan, magenta, yellow and black. Some bright, saturated screen colours have no printable equivalent, and the conversion quietly substitutes the nearest one available. Anything going to print should be signed off from a physical proof rather than from a monitor.",
  ],
];

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

        <h2>Three Ways to Write the Same Colour</h2>
        <p>
          HEX, RGB and HSL are not three kinds of colour. They are three
          notations for the same thing, and the reason all three survive is that
          each is easy to do something different with.
        </p>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Notation</th>
                <th>Describes</th>
                <th>Good for</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>HEX</td>
                <td>Red, green and blue as pairs of hex digits</td>
                <td>Copying an exact colour between tools</td>
              </tr>
              <tr>
                <td>RGB</td>
                <td>The same three channels as decimal numbers</td>
                <td>Code, and adding transparency with an alpha value</td>
              </tr>
              <tr>
                <td>HSL</td>
                <td>Hue, saturation and lightness</td>
                <td>Adjusting a colour deliberately</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          HSL is the one worth learning if you design rather than just copy
          values. In HEX or RGB, making a colour slightly darker means changing
          three numbers in a coordinated way and hoping the hue does not shift.
          In HSL you reduce one number — lightness — and everything else stays
          where it was.
        </p>

        <h2>Reading a HEX Code Without a Converter</h2>
        <p>
          A HEX colour is three pairs: red, green, blue. Each pair runs from 00
          to FF, which is 0 to 255 in decimal.
        </p>
        <pre>
          #RRGGBB{"\n"}#FF0000 → all red, no green, no blue{"\n"}#000000 → black
          {"\n"}#FFFFFF → white{"\n"}#808080 → mid grey (equal channels)
        </pre>
        <p>
          Two shortcuts follow from that. Any code with all three pairs equal is
          a shade of grey, so #333333 and #CCCCCC are grey without needing to be
          converted. And the three-digit form is just the six-digit one with each
          pair doubled — #F0A expands to #FF00AA — which is why only some colours
          can be written in shorthand.
        </p>
        <p>
          An eight-digit code adds a fourth pair for transparency, where 00 is
          fully transparent and FF fully opaque.
        </p>

        <h2>Building a Palette That Holds Together</h2>
        <p>
          Palettes fail in two opposite ways: every colour fighting for
          attention, or everything so similar that nothing stands out. Both come
          from picking colours independently rather than deriving them from one
          another.
        </p>
        <p>
          The reliable approach is to choose one base colour and generate the
          rest from it by moving around the hue circle in a defined way.
        </p>
        <ul className="custom-list">
          <li>
            <strong>Monochromatic</strong> — one hue at several lightness and
            saturation levels. Impossible to get wrong, and can be flat without
            an accent.
          </li>
          <li>
            <strong>Analogous</strong> — neighbouring hues. Harmonious and
            low-contrast, which suits backgrounds and calm interfaces.
          </li>
          <li>
            <strong>Complementary</strong> — the hue directly opposite. Maximum
            contrast, which makes it excellent for a single accent and
            exhausting if used in equal amounts.
          </li>
          <li>
            <strong>Triadic</strong> — three hues evenly spaced. Vivid and
            balanced, and it needs one dominant colour with the other two held
            back.
          </li>
        </ul>
        <p>
          The common failure is treating a harmony rule as a licence to use every
          colour it produces at full strength. A workable interface palette is
          usually one dominant colour, one supporting colour and one accent used
          sparingly, with several neutral greys doing most of the actual work.
        </p>

        <h2>Contrast Is Not a Matter of Taste</h2>
        <p>
          Whether text is readable against a background is measurable rather than
          subjective. Contrast ratio compares the relative luminance of two
          colours and runs from 1:1, meaning identical, to 21:1 for black on
          white.
        </p>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Ratio</th>
                <th>Generally suitable for</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>At least 4.5:1</td>
                <td>Normal body text</td>
              </tr>
              <tr>
                <td>At least 3:1</td>
                <td>Large text, and meaningful interface elements</td>
              </tr>
              <tr>
                <td>At least 7:1</td>
                <td>The stricter standard, useful for long-form reading</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          Two points that catch designers out. Contrast depends on luminance
          rather than on how different two colours look, so two vivid colours of
          similar brightness — a mid red on a mid green, for instance — can be
          nearly unreadable despite looking wildly different. And light grey text
          on white, currently fashionable, frequently fails outright.
        </p>
        <p>
          Colour should also never be the only thing carrying meaning. Around one
          in twelve men has some form of colour vision deficiency, so a red and
          green status indicator distinguished only by hue conveys nothing to
          them. Add a shape, a label or an icon alongside it.
        </p>

        <h2>Why the Same Colour Looks Different Elsewhere</h2>
        <p>
          A HEX code is an instruction, not a guarantee. What a viewer actually
          sees depends on their screen, its calibration and its colour profile,
          which is why a brand colour can look noticeably different across two
          monitors in the same room.
        </p>
        <p>
          Print is a larger discontinuity. Screens emit light and mix red, green
          and blue; print reflects light and mixes cyan, magenta, yellow and
          black. Some screen colours — particularly bright, saturated ones — have
          no printable equivalent at all, and the conversion silently substitutes
          the nearest available. Anything destined for print should be checked as
          a proof rather than approved on screen.
        </p>
        <p>
          For picking and converting values, use the tool above. For counting
          characters in the CSS you write around them, the{" "}
          <Link href="/word-char-counter/" className="my-link">
            word and character counter
          </Link>{" "}
          is on hand.
        </p>
        <h2>Colour and Contrast Questions</h2>
        {FAQS.map(([q, a], i) => {
          const isOpen = openFAQ === i;
          return (
            <div className="faq-item" key={i}>
              <h3
                onClick={() => setOpenFAQ(isOpen ? null : i)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setOpenFAQ(isOpen ? null : i);
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
    </>
  );
}
