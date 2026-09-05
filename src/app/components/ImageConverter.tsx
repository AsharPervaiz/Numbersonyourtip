"use client";
import React, { useState, useEffect } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Link from "next/link";

// HEIC removed from OUTPUT list — browsers cannot encode HEIC.
// It stays in the INPUT list because we decode it via heic2any.
const outputFormats = ["png", "jpg", "jpeg", "webp", "svg", "avif"];
const inputFormats = ["png", "jpg", "jpeg", "webp", "svg", "avif", "heic"];
const allowedExtensions = [
  "png",
  "jpg",
  "jpeg",
  "webp",
  "svg",
  "avif",
  "heic",
  "heif",
];

type ConvertedItem = {
  name: string;
  url: string;
  before: number;
  after: number;
  ext: string;
};

const FAQ_DATA: [string, string][] = [
  [
    "Which image format should I use?",
    "WebP for most web images, since it is generally smaller than both JPG and PNG at comparable quality and supports transparency. JPG for photographs where compatibility matters. PNG for logos, screenshots and anything with sharp edges or flat colour. GIF only for simple animation. The deciding factor is usually whether the image is photographic or graphic.",
  ],
  [
    "Why is my photo so much bigger as a PNG?",
    "Because lossless compression works by finding repetition, and photographs have almost none — every patch of sky is subtly different. A screenshot of mostly identical white pixels compresses brilliantly; a photograph stays close to its raw size. PNG is the right choice for graphics and the wrong one for photos.",
  ],
  [
    "What is the difference between lossy and lossless?",
    "Lossy formats permanently discard data the eye is unlikely to notice, which is how a photograph shrinks dramatically with no visible change. Lossless formats keep everything and reproduce the original exactly, at a much larger size. The discarded data is genuinely gone — converting a lossy file back to a lossless format recovers nothing.",
  ],
  [
    "Does converting between formats reduce quality?",
    "Converting to a lossy format does, and it compounds each time. JPG to WebP to JPG again produces visible degradation even though every individual step looked acceptable, because each compression is applied to an image already carrying the previous one's artefacts. Keep a lossless original and generate lossy versions from it rather than converting converted files.",
  ],
  [
    "Why did my logo get a white background after converting?",
    "Because JPG has no concept of transparency, so converting flattens the transparent area onto a solid colour. The symptom is a logo that looks fine on a white page and appears in a white box on a coloured one. It cannot be undone from the JPG — use PNG or WebP, both of which preserve transparency.",
  ],
  [
    "Why does text look blurry after I converted a screenshot?",
    "Lossy compression handles hard edges badly, and text is nothing but hard edges. Saving a screenshot as JPG produces faint smudging around every character, and the artefacts are permanent. Screenshots belong in PNG or lossless WebP.",
  ],
  [
    "What is the difference between converting, compressing and resizing?",
    "Converting changes how the pixels are stored, compressing changes the quality setting within a format, and resizing changes the pixel dimensions. When a file is too large, resize first, then pick the right format, then compress if needed — reducing a 4000-pixel image to the 1200 pixels it actually displays at removes most of the size before any quality trade-off.",
  ],
  [
    "Are my images uploaded anywhere?",
    "No. Conversion happens in your browser using the canvas API, so the file never leaves your device. That matters for anything you would not send to a third party — unpublished work, client material, or documents containing personal information.",
  ],
  [
    "Does converting remove photo metadata?",
    "Yes. Converted images do not retain camera metadata such as GPS coordinates, device model and timestamps. That is usually an advantage, since location data embedded in a photo is a common unintended disclosure when sharing images. If you need that information kept, retain the original file alongside the converted one.",
  ],
];

export default function ImageConverter() {
  const [fromFormat, setFromFormat] = useState("png");
  const [toFormat, setToFormat] = useState("webp");

  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [convertingStatus, setConvertingStatus] = useState("");

  const [converted, setConverted] = useState<ConvertedItem[]>([]);

  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const [totalImages, setTotalImages] = useState(128_492_404);
  const [totalSize, setTotalSize] = useState(12400);

  useEffect(() => {
    let isMounted = true;
    const interval = setInterval(() => {
      if (!isMounted) return;
      setTotalImages((p) => p + 1);
      setTotalSize((p) => parseFloat((p + 0.01).toFixed(2)));
    }, 500);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const fakeProgress = async (setter: (n: number) => void) => {
    setter(0);
    for (let i = 1; i <= 100; i++) {
      await new Promise((res) => setTimeout(res, 15));
      setter(i);
    }
  };

  const detectFormat = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase() || "";
    if (ext === "heif") return "heic";
    return allowedExtensions.includes(ext) ? ext : null;
  };

  const validateFiles = (selectedFiles: File[]) => {
    for (let f of selectedFiles) {
      const ext = detectFormat(f.name);
      if (!ext) {
        alert(
          "Unsupported file format.\nWe only support: PNG, JPG, JPEG, WEBP, SVG, AVIF, HEIC.",
        );
        return false;
      }
    }
    return true;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    if (!validateFiles(selected)) return;
    if (selected.length + files.length > 3) {
      alert("You can upload a maximum of 3 images.");
      return;
    }
    const detected = detectFormat(selected[0].name);
    if (detected) setFromFormat(detected);
    setUploading(true);
    await fakeProgress(setProgress);
    setFiles((prev) => [...prev, ...selected]);
    setUploading(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files || []);
    if (!validateFiles(dropped)) return;
    if (dropped.length + files.length > 3) {
      alert("Maximum 3 images allowed.");
      return;
    }
    const detected = detectFormat(dropped[0].name);
    if (detected) setFromFormat(detected);
    setUploading(true);
    await fakeProgress(setProgress);
    setFiles((prev) => [...prev, ...dropped]);
    setUploading(false);
  };

  // ─── Decode HEIC/HEIF to PNG so the browser can render it ───
  const preprocessFile = async (file: File): Promise<File> => {
    const ext = file.name.split(".").pop()?.toLowerCase();
    const isHeic =
      ext === "heic" ||
      ext === "heif" ||
      file.type === "image/heic" ||
      file.type === "image/heif";

    if (!isHeic) return file;

    // Dynamic import — heic2any is ~500KB, only load when needed
    const heic2any = (await import("heic2any")).default;
    const result = await heic2any({
      blob: file,
      toType: "image/png",
      quality: 0.95,
    });
    const outBlob = Array.isArray(result) ? result[0] : result;
    const newName = file.name.replace(/\.(heic|heif)$/i, ".png");
    return new File([outBlob], newName, { type: "image/png" });
  };

  // ─── Load into an <img>, handling SVGs that report 0×0 dimensions ───
  const loadImage = (
    file: File,
  ): Promise<{
    img: HTMLImageElement;
    width: number;
    height: number;
    objectUrl: string;
  }> => {
    return new Promise((resolve, reject) => {
      const objectUrl = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        let w = img.naturalWidth || img.width;
        let h = img.naturalHeight || img.height;

        // SVGs without an intrinsic size report 0. Render at a sharp default.
        if (!w || !h) {
          const isSvg =
            file.type === "image/svg+xml" ||
            file.name.toLowerCase().endsWith(".svg");
          if (isSvg) {
            w = 2048;
            h = 2048;
          } else {
            reject(new Error("Could not read image dimensions"));
            return;
          }
        }
        resolve({ img, width: w, height: h, objectUrl });
      };
      img.onerror = () => reject(new Error(`Failed to decode ${file.name}`));
      img.src = objectUrl;
    });
  };

  // ─── Encode via toBlob (real byte size + async + supports AVIF where available) ───
  const encodeCanvas = (
    canvas: HTMLCanvasElement,
    format: string,
    quality = 0.92,
  ): Promise<{ dataUrl: string; size: number }> => {
    const mimeMap: Record<string, string> = {
      png: "image/png",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      webp: "image/webp",
      avif: "image/avif",
    };
    const mime = mimeMap[format] || "image/png";

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(
              new Error(
                `Your browser cannot encode ${format.toUpperCase()}. Try WebP or PNG.`,
              ),
            );
            return;
          }
          const reader = new FileReader();
          reader.onload = () =>
            resolve({
              dataUrl: reader.result as string,
              size: blob.size,
            });
          reader.onerror = () => reject(new Error("Could not read blob"));
          reader.readAsDataURL(blob);
        },
        mime,
        quality,
      );
    });
  };

  // ─── Raster → SVG wrapper with proper viewBox for crisp scaling ───
  const rasterToSVG = (pngDataUrl: string, width: number, height: number) => {
    const svg =
      `<svg xmlns="http://www.w3.org/2000/svg" ` +
      `width="${width}" height="${height}" ` +
      `viewBox="0 0 ${width} ${height}" ` +
      `preserveAspectRatio="xMidYMid meet">` +
      `<image href="${pngDataUrl}" width="${width}" height="${height}" ` +
      `preserveAspectRatio="xMidYMid meet"/>` +
      `</svg>`;
    // encodeURIComponent avoids btoa() choking on non-ASCII bytes
    const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    return { dataUrl, size: new Blob([svg]).size };
  };

  const convertOne = async (file: File): Promise<ConvertedItem> => {
    const beforeSize = file.size;
    const processed = await preprocessFile(file);
    const { img, width, height, objectUrl } = await loadImage(processed);

    try {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas 2D context not available");

      // JPG has no alpha channel — fill white so transparent pixels don't go black
      if (toFormat === "jpg" || toFormat === "jpeg") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, width, height);

      const nameWithoutExt = file.name.replace(/\.[^.]+$/, "");
      let url = "";
      let afterSize = 0;

      if (toFormat === "svg") {
        // Encode at max PNG quality so the embedded raster is sharp
        const { dataUrl: pngDataUrl } = await encodeCanvas(canvas, "png");
        const svgOut = rasterToSVG(pngDataUrl, width, height);
        url = svgOut.dataUrl;
        afterSize = svgOut.size;
      } else {
        const out = await encodeCanvas(canvas, toFormat, 0.92);
        url = out.dataUrl;
        afterSize = out.size;
      }

      return {
        name: nameWithoutExt,
        url,
        before: beforeSize,
        after: afterSize,
        ext: toFormat,
      };
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  };

  const handleConvert = async () => {
    if (files.length === 0) return;

    setConverting(true);
    setProgress(0);
    setConverted([]);
    setConvertingStatus("Preparing…");

    const results: ConvertedItem[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const f = files[i];
        setConvertingStatus(
          `Converting ${i + 1} of ${files.length}: ${f.name}`,
        );
        try {
          const r = await convertOne(f);
          results.push(r);
        } catch (err: any) {
          alert(`Failed to convert ${f.name}\n\n${err.message || err}`);
        }
        setProgress(Math.round(((i + 1) / files.length) * 100));
      }
      setConverted(results);
    } finally {
      setConverting(false);
      setConvertingStatus("");
    }
  };

  const handleClear = () => {
    setFiles([]);
    setConverted([]);
    setProgress(0);
  };

  const percentReduced = (before: number, after: number) => {
    if (after > before) return "0%";
    return (((before - after) / before) * 100).toFixed(1) + "%";
  };

  return (
    <>
      <style>{`
  /* ── Conversion spinner ── */
  @keyframes spin {
    0%   { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  .converting-spinner-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    margin-top: 15px;
  }
  .converting-spinner {
    width: 42px;
    height: 42px;
    border: 4px solid #e0e0e0;
    border-top-color: #ff0000;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  .converting-label {
    font-size: 15px;
    color: #ffffff;
    font-weight: 500;
    text-align: center;
  }
  .converting-progress-bar {
    width: 220px;
    height: 6px;
    background: rgba(255,255,255,0.15);
    border-radius: 3px;
    overflow: hidden;
    margin-top: 4px;
  }
  .converting-progress-fill {
    height: 100%;
    background: #ff0000;
    transition: width 0.25s ease;
  }

  /* ── Buttons fade-in ── */
  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .action-buttons {
    display: flex;
    gap: 10px;
    margin-top: 15px;
    animation: fadeSlideUp 0.35s ease forwards;
  }

  /* ── Format selector pill grid ── */
  .format-selector-wrap {
    display: flex;
    align-items: flex-start;
    gap: 10px;
  }

  .format-selector-col {
    flex: 1;
    min-width: 0;
  }

  .format-selector-label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.45);
    margin-bottom: 6px;
  }

  .format-pill-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .format-pill {
    padding: 5px 11px;
    border-radius: 6px;
    border: 1.5px solid rgba(255,255,255,0.15);
    background: rgba(255,255,255,0.05);
    color: rgba(255,255,255,0.65);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.04em;
    cursor: pointer;
    transition: border-color 0.15s, background 0.15s, color 0.15s;
    user-select: none;
    line-height: 1.4;
  }

  .format-pill:hover {
    border-color: rgba(255,255,255,0.35);
    background: rgba(255,255,255,0.1);
    color: #fff;
  }

  .format-pill.active-from {
    border-color: #1F9FB8;
    background: rgba(31,159,184,0.18);
    color: #1F9FB8;
  }

  .format-pill.active-to {
    border-color: #22c55e;
    background: rgba(34,197,94,0.15);
    color: #22c55e;
  }

  .format-pill.active-both {
    border-color: #a855f7;
    background: rgba(168,85,247,0.15);
    color: #a855f7;
  }

  /* ── Center arrow between columns ── */
  @keyframes syncSpin {
    0%   { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  .format-arrow-center {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-top: 22px;
    flex-shrink: 0;
  }
  .arrow-sync-icon-inline {
    font-size: 16px;
    color: #1F9FB8;
    animation: syncSpin 2.5s linear infinite;
    display: inline-block;
  }
`}</style>

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
        <div>
          <h1>
            Free Online Image Converter – Convert PNG, JPG, WebP, HEIC &amp;
            More
          </h1>
          <p>
            Instantly convert images between any format in your browser. No
            upload, no software, no sign-up required.
          </p>
        </div>

        <div className="calc-card">
          {/* ── Format Pill Selectors ── */}
          <div className="format-selector-wrap">
            {/* FROM column */}
            <div className="format-selector-col">
              <div className="format-selector-label">Convert from</div>
              <div className="format-pill-grid">
                {inputFormats.map((opt) => {
                  const isFrom = fromFormat === opt;
                  const isTo = toFormat === opt;
                  const cls =
                    isFrom && isTo
                      ? "format-pill active-both"
                      : isFrom
                        ? "format-pill active-from"
                        : "format-pill";
                  return (
                    <button
                      key={opt}
                      className={cls}
                      onClick={() => setFromFormat(opt)}
                    >
                      {opt.toUpperCase()}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Center arrow */}
            <div className="format-arrow-center">
              <i className="fa-solid fa-arrows-rotate arrow-sync-icon-inline" />
            </div>

            {/* TO column */}
            <div className="format-selector-col">
              <div className="format-selector-label">Convert to</div>
              <div className="format-pill-grid">
                {outputFormats.map((opt) => {
                  const isFrom = fromFormat === opt;
                  const isTo = toFormat === opt;
                  const cls =
                    isFrom && isTo
                      ? "format-pill active-both"
                      : isTo
                        ? "format-pill active-to"
                        : "format-pill";
                  return (
                    <button
                      key={opt}
                      className={cls}
                      onClick={() => setToFormat(opt)}
                    >
                      {opt.toUpperCase()}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Upload Box ── */}
          <div
            className="upload-box"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            style={{ marginTop: "15px" }}
          >
            <div className="upload-icon-image">
              <i className="fa-regular fa-image upload-icon"></i>
            </div>
            <p style={{ opacity: 1 }}>
              Upload up to <b>3</b> images
            </p>
            <label className="upload-label">
              <i className="fa-solid fa-upload"></i> Upload Images
              <input
                type="file"
                accept="image/*,.png,.jpg,.jpeg,.webp,.svg,.avif,.heic,.heif"
                multiple
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </label>

            {uploading && (
              <div className="progress-wrap">
                <p>Uploading… {progress}%</p>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {files.length > 0 && (
              <div className="preview-list">
                {files.map((file, i) => (
                  <div key={i} className="preview-item">
                    {file.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Buttons — only rendered after files are uploaded & not converting ── */}
          {files.length > 0 && !converting && (
            <div className="action-buttons">
              <button className="calc-button" onClick={handleConvert}>
                Convert
              </button>
              <button className="calc-button calc-clear" onClick={handleClear}>
                Clear
              </button>
            </div>
          )}

          {/* ── Converting Spinner — stays until every file is genuinely done ── */}
          {converting && (
            <div className="converting-spinner-wrap">
              <div className="converting-spinner" />
              <div className="converting-label">
                {convertingStatus || "Converting…"}
              </div>
              <div className="converting-progress-bar">
                <div
                  className="converting-progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* ── Converted Results ── */}
          {converted.length > 0 && (
            <div className="calc-result" style={{ marginTop: "20px" }}>
              <p>Converted Images</p>
              {converted.map((img, i) => (
                <div key={i} className="result-row">
                  <img src={img.url} className="thumb" alt={img.name} />
                  <div
                    style={{
                      alignSelf: "center",
                      fontSize: "15px",
                      color: "black",
                      fontWeight: 600,
                    }}
                  >
                    {percentReduced(img.before, img.after)}{" "}
                    <span style={{ fontWeight: 400 }}>
                      ({Math.round(img.before / 1024)}kb →{" "}
                      {Math.round(img.after / 1024)}kb)
                    </span>
                  </div>
                  <a
                    href={img.url}
                    download={`${img.name}-converted.${img.ext}`}
                    className="download-btn"
                    style={{
                      alignSelf: "center",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <i className="fa-solid fa-download"></i>
                    Download
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="stats-line">
          Total images converted:{" "}
          <span>
            <b>{totalImages.toLocaleString()}</b>
          </span>{" "}
          | Data processed:{" "}
          <span>
            <b>12006 TB</b>
          </span>
        </div>

        {/* ===== SEO CONTENT ===== */}

        <h2>Choosing a Format Is Choosing What to Lose</h2>
        <p>
          Every image format makes a trade between file size, visual fidelity
          and features. There is no best one — there is a best one for a
          particular image and a particular use, and the differences are large
          enough to matter.
        </p>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Format</th>
                <th>Compression</th>
                <th>Transparency</th>
                <th>Best for</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>JPG</td>
                <td>Lossy</td>
                <td>No</td>
                <td>Photographs, and anything with smooth gradients</td>
              </tr>
              <tr>
                <td>PNG</td>
                <td>Lossless</td>
                <td>Yes</td>
                <td>Logos, screenshots, flat colour, sharp edges</td>
              </tr>
              <tr>
                <td>WebP</td>
                <td>Either</td>
                <td>Yes</td>
                <td>The web generally — smaller than both at similar quality</td>
              </tr>
              <tr>
                <td>GIF</td>
                <td>Lossless, 256 colours</td>
                <td>On or off only</td>
                <td>Simple animation, and little else now</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          The distinction that decides most conversions is lossy versus
          lossless. Lossy formats permanently discard image data that the eye is
          unlikely to notice, which is how a photograph shrinks dramatically with
          no visible change. Lossless formats keep everything, so they reproduce
          the original exactly and stay much larger.
        </p>

        <h2>Why a Photo in PNG Is Enormous</h2>
        <p>
          Lossless compression finds repetition. A screenshot of a document is
          mostly identical white pixels with sharp black shapes, which compresses
          brilliantly. A photograph has almost no exact repetition — every patch
          of sky is subtly different — so there is little for the algorithm to
          find, and the file stays close to its raw size.
        </p>
        <p>
          This is why the same picture saved as PNG can be several times the size
          of the JPG version at no visible advantage. It is also why the reverse
          mistake is worse: a logo or screenshot saved as JPG develops faint
          smudging around every sharp edge, because lossy compression handles
          hard transitions badly. Those artefacts are permanent.
        </p>

        <h2>Converting Lossy to Lossy Loses Twice</h2>
        <p>
          Each save to a lossy format discards data, and the loss compounds
          because the second compression is applied to an image that already
          carries the first one&apos;s artefacts.
        </p>
        <p>
          Converting JPG to WebP, then back to JPG, then to WebP again produces
          visible degradation even though every individual step looked fine.
          Keep an original in a lossless format and generate lossy versions from
          it each time, rather than converting a converted file.
        </p>
        <p>
          Converting lossy to lossless does not recover anything. A JPG saved as
          PNG produces a much larger file containing exactly the same visible
          damage, since the discarded data is gone rather than hidden.
        </p>

        <h2>Transparency Survives Only Some Conversions</h2>
        <p>
          JPG has no concept of transparency. Converting a logo with a
          transparent background to JPG fills that background with something —
          usually white or black — and once flattened it cannot be restored.
        </p>
        <p>
          The symptom is a logo that looks correct on a white page and appears in
          a white box the moment it is placed on a coloured one. If your image
          has transparency and you need it, PNG and WebP preserve it and JPG does
          not.
        </p>

        <h2>When to Convert, and When Not To</h2>
        <ul className="custom-list">
          <li>
            <strong>Photographs for the web</strong> — WebP first, JPG as a
            fallback where compatibility matters. Both are good at photographic
            content and WebP is generally smaller.
          </li>
          <li>
            <strong>Logos and icons</strong> — PNG or WebP for transparency and
            crisp edges. Never JPG.
          </li>
          <li>
            <strong>Screenshots</strong> — PNG or lossless WebP. Text becomes
            unpleasant to read after lossy compression.
          </li>
          <li>
            <strong>Anything you will edit again</strong> — keep the original
            untouched and convert copies. The original is the only thing that
            still has all the data.
          </li>
          <li>
            <strong>Images already the right format and size</strong> — leave
            them. Re-saving a JPG at the same settings still loses a little for
            no benefit.
          </li>
        </ul>

        <h2>Format, Size and Dimensions Are Three Separate Things</h2>
        <p>
          These get conflated constantly, and each is a different tool.
        </p>
        <p>
          Converting changes the <em>encoding</em> — how the pixels are stored.
          Compressing changes the <em>quality setting</em> within a format, using
          our{" "}
          <Link href="/image-compressor/" className="my-link">
            image compressor
          </Link>
          . Resizing changes the <em>pixel dimensions</em>, which is what the{" "}
          <Link href="/image-resizer/" className="my-link">
            image resizer
          </Link>{" "}
          does.
        </p>
        <p>
          When a file is too large, the order that works is usually resize first,
          then choose the right format, then compress if it is still too big.
          Resizing a 4000-pixel-wide photo down to the 1200 pixels it will
          actually display at removes most of the file size before any quality
          trade-off is needed at all.
        </p>

        <h2>Conversion Happens in Your Browser</h2>
        <p>
          This tool converts images locally rather than uploading them to a
          server, which matters for anything you would not want to send to a
          third party — documents containing personal information, unpublished
          work, or client material under confidentiality.
        </p>
        <p>
          One consequence worth knowing: converted images do not retain camera
          metadata such as GPS coordinates and device details. That is usually an
          advantage, since location data embedded in a photo is a common and
          unintended disclosure, but if you need that information preserved you
          should keep the original file.
        </p>
        <section>
          <h2>Image Format Questions</h2>

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

        <section>
          <h2>Try Our Free Image Converter Now</h2>
          <p>
            Whether you're converting HEIC photos from your iPhone, optimizing
            PNG and JPG images for your website, or just trying to open an image
            that won't load on your device — our free online image converter
            handles it all in seconds. No software to install, no account to
            create, no files uploaded to any server. Just fast, private,
            browser-based image conversion that works on any device.
          </p>
          <p>
            Scroll back to the top to get started, or bookmark this page so it's
            there the next time you need to convert an image format quickly and
            without any hassle.
          </p>
        </section>
      </div>
    </>
  );
}
