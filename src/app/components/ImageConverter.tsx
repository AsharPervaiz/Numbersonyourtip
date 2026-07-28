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

        <section>
          <h2>What Is an Online Image Converter?</h2>
          <p>
            An online image converter is a free web-based tool that lets you
            change an image from one file format to another — for example,
            converting PNG to JPG, JPG to WebP, or HEIC to PNG — without
            downloading any software or creating an account. Everything happens
            directly inside your browser, which means your files never leave
            your device.
          </p>
          <p>
            Whether you're a web developer trying to reduce page load times, a
            photographer dealing with Apple's HEIC format, or someone who just
            needs to share a photo in a format that actually opens on another
            device, an image converter saves you time and headaches every single
            day.
          </p>
        </section>

        <section>
          <h2>Supported Image Formats</h2>
          <p>
            Our free converter supports all the image formats that actually
            matter in 2026. Here's what you can convert from and to:
          </p>
          <ul className="custom-list">
            <li>
              <b>JPG / JPEG</b> – The most widely used photo format on the web
              and in cameras.
            </li>
            <li>
              <b>PNG</b> – Best for images with transparent backgrounds, logos,
              and graphics.
            </li>
            <li>
              <b>WebP</b> – Google's modern format that gives you smaller file
              sizes without visible quality loss.
            </li>
            <li>
              <b>SVG</b> – Scalable vector format, perfect for{" "}
              <Link href="https://iconoop.com" className="my-link">
                icons
              </Link>{" "}
              and simple illustrations.
            </li>
            <li>
              <b>AVIF</b> – A next-generation format that compresses even better
              than WebP.
            </li>
            <li>
              <b>HEIC</b> – The default photo format on iPhones running iOS 11
              and later.
            </li>
          </ul>
        </section>

        <section>
          <h2>Why Do People Need to Convert Image Formats?</h2>
          <p>
            Not all image formats work everywhere. A HEIC photo taken on your
            iPhone might not open on your Windows PC. A PNG file might be{" "}
            <Link href="/image-compressor/" className="my-link">
              too large
            </Link>{" "}
            to email. A WebP image might not display in an older app. These are
            real, everyday problems — and converting the image format is the
            quickest fix.
          </p>

          <h3>✔ Reduce File Size Without Losing Quality</h3>
          <p>
            Converting a PNG to WebP or AVIF can cut your file size by 25–50%
            with almost no visible difference in quality. This is huge for
            website performance. Smaller images load faster, which directly
            improves your Google PageSpeed score and user experience. If your
            site uses a lot of images, switching to WebP alone can shave seconds
            off your page load time.
          </p>

          <h3>✔ Fix Compatibility Issues Across Devices and Platforms</h3>
          <p>
            HEIC files are great on Apple devices but completely unreadable on
            most Windows PCs and many Android apps without additional software.
            Converting HEIC to JPG takes about five seconds with our tool and
            makes your photos instantly shareable on any device, operating
            system, or messaging app.
          </p>

          <h3>✔ Preserve or Add Transparency</h3>
          <p>
            JPG does not support transparent backgrounds. If you have a logo or
            design element that needs a transparent background, you need PNG or
            WebP. Converting JPG to PNG lets you work with transparency, which
            is essential for overlaying images on colored backgrounds without an
            ugly white box around them.
          </p>

          <h3>✔ Prepare Images for Social Media, Email, or Print</h3>
          <p>
            Different platforms have different requirements. Instagram
            recommends JPG. Some email clients strip WebP images. Print shops
            often require high-quality PNG. Our converter helps you get the
            right format for wherever your image is going — without touching any
            software.
          </p>

          <h3>✔ Meet Upload Requirements for Websites and Apps</h3>
          <p>
            Many platforms — from Shopify stores to government portals — accept
            only specific file formats. If you're trying to upload a PNG and the
            site only accepts JPG, you don't need to figure out Photoshop. Just
            convert it here in seconds.
          </p>
        </section>

        <section>
          <h2>How to Convert an Image Online — Step by Step</h2>
          <p>
            Converting an image with our tool takes less than 30 seconds. Here's
            exactly how it works:
          </p>
          <ul className="custom-list">
            <li>
              <b>Step 1:</b> Choose your output format from the dropdown on the
              right. For example, select WebP to optimize for your website.
            </li>
            <li>
              <b>Step 2:</b> Click "Upload Images" or drag and drop your file
              into the upload area. You can upload up to 3 images at once.
            </li>
            <li>
              <b>Step 3:</b> Hit the "Convert" button. The conversion happens
              instantly inside your browser — nothing is uploaded to any server.
            </li>
            <li>
              <b>Step 4:</b> Download your converted image with a single click.
              Done.
            </li>
          </ul>
          <p>
            The entire process is completely free. No sign-up, no watermark, no
            file size limit messages, and no waiting for an email with a
            download link.
          </p>
        </section>

        <section>
          <h2>
            How to Convert HEIC to JPG for Free (Without Installing Software)
          </h2>
          <p>
            HEIC (High Efficiency Image Container) is the default camera format
            on iPhones since iOS 11. Apple introduced it because HEIC files are
            about half the size of JPG files at the same quality — great for
            saving storage space on your phone.
          </p>
          <p>
            The problem is that HEIC is an Apple-native format. If you send a
            HEIC photo to someone using Windows, an Android phone, or try to
            upload it to most websites, it either won't open or will show an
            error. That's why converting HEIC to JPG is one of the most common
            image conversion tasks in the world right now.
          </p>
          <p>
            To convert HEIC to JPG using our free tool: select JPG as the output
            format from the dropdown, upload your HEIC image, and click Convert.
            Your converted JPG will be ready to download in seconds — completely
            in your browser, with no software installation required. You can
            also convert HEIC to PNG if you need transparency support, or HEIC
            to WebP if you're optimizing images for a website.
          </p>
        </section>

        <section>
          <h2>How to Convert PNG to JPG (and When You Should)</h2>
          <p>
            PNG files are lossless, which means they don't lose any quality when
            saved. That's great for logos and graphics, but it also means PNG
            files are often much larger than necessary for photos. A photo saved
            as PNG might be 4–5 MB, while the same photo as a JPG is 400–500 KB
            with barely any visible difference.
          </p>
          <p>
            Converting PNG to JPG makes sense when you need to share a photo by
            email, upload it to a platform with file size limits, or use it on a
            web page where load speed matters. Our converter handles PNG to JPG
            in under a second — just select JPG as the output, upload your PNG,
            and download the result.
          </p>
          <p>
            One important thing to keep in mind: JPG does not support
            transparency. If your PNG has a transparent background — for
            example, a logo with no background — converting it to JPG will fill
            that transparent area with white. If you need to keep the
            transparency, convert to WebP or keep it as PNG instead.
          </p>
        </section>

        <section>
          <h2>How to Convert Images to WebP — The Best Format for Websites</h2>
          <p>
            WebP is a modern image format developed by Google. It produces
            images that are typically 25–35% smaller than comparable JPG files
            and 25–50% smaller than PNG files, without any noticeable drop in
            quality. Google officially recommends WebP for web images, and it's
            supported by all modern browsers including Chrome, Firefox, Safari,
            and Edge.
          </p>
          <p>
            If you run a website or blog, switching your images from JPG or PNG
            to WebP is one of the fastest ways to improve your site's loading
            speed. Faster loading means lower bounce rates, better user
            experience, and higher rankings in Google search results.
          </p>
          <p>
            To convert any image to WebP: select WebP as the output format,
            upload your JPG, PNG, or other image, and click Convert. Your WebP
            file will be ready to download and use immediately. No plugins, no
            paid software, no complicated settings.
          </p>
        </section>

        <section>
          <h2>WebP vs JPG vs PNG — Which Image Format Should You Use?</h2>
          <p>
            This is probably the most common question when it comes to image
            formats. Here's a plain-English breakdown:
          </p>

          <h3>JPG — Best for Photographs</h3>
          <p>
            JPG is the most universally supported image format. Every device,
            browser, app, and platform in the world can open a JPG file. It's
            excellent for photographs and realistic images because it handles
            gradients and complex color transitions well. The downside is that
            JPG uses lossy compression — every time you save a JPG, it loses a
            tiny bit of quality. It also doesn't support transparency.
          </p>
          <p>
            Use JPG when: you're sharing photos with people on different
            devices, uploading to social media, or working with platforms that
            specifically require JPG.
          </p>

          <h3>PNG — Best for Graphics and Transparency</h3>
          <p>
            PNG uses lossless compression, meaning no quality is lost when
            saving. It also supports transparent backgrounds through an alpha
            channel, making it ideal for logos, UI elements, watermarks, and any
            graphic that needs to sit cleanly over different backgrounds. PNGs
            tend to be larger than JPGs for photographic content, so they're not
            ideal for photos where file size is a concern.
          </p>
          <p>
            Use PNG when: you need transparency, you're working with logos or
            icons, or image quality is more important than file size.
          </p>

          <h3>WebP — Best for Websites and Fast Loading</h3>
          <p>
            WebP gives you the best of both worlds. It supports both lossy and
            lossless compression, supports transparency like PNG, and produces
            significantly smaller files than both JPG and PNG. It was designed
            specifically for the web. By 2026, essentially all modern browsers
            and devices support WebP.
          </p>
          <p>
            Use WebP when: you're uploading images to a website, an online
            store, a blog, or any place where page load speed matters.
          </p>

          <h3>AVIF — The Next-Generation Format</h3>
          <p>
            AVIF is newer than WebP and compresses even better — sometimes 50%
            smaller than WebP at the same quality. It's based on the AV1 video
            codec and is supported by Chrome, Firefox, and most modern browsers.
            If you want the absolute smallest file sizes with excellent quality,
            AVIF is the format of the future.
          </p>
          <p>
            Use AVIF when: you're highly performance-focused and your users are
            on modern browsers.
          </p>
        </section>

        <section>
          <h2>How to Reduce Image File Size Without Losing Quality</h2>
          <p>
            One of the best ways to reduce image file size without visibly
            reducing quality is to convert to a more efficient format. Here's a
            practical guide:
          </p>
          <ul className="custom-list">
            <li>
              <b>Convert PNG photos to JPG or WebP.</b> If you have a photo (not
              a logo) saved as PNG, converting it to JPG or WebP can reduce file
              size by 60–80% with no visible quality loss.
            </li>
            <li>
              <b>Convert JPG to WebP.</b> For web images, WebP typically saves
              25–35% file size compared to JPG at the same quality setting.
            </li>
            <li>
              <b>Convert JPG to AVIF.</b> AVIF can go even further, often
              achieving 40–50% smaller file sizes than JPG.
            </li>
            <li>
              <b>Avoid converting PNG logos to JPG.</b> If your PNG has a
              transparent background, converting to JPG will add a white
              background and may look wrong. Stick to PNG or WebP for logos.
            </li>
          </ul>
          <p>
            Our converter processes everything locally in your browser, so you
            can convert as many images as you want for free, with no file size
            restrictions. We automatically apply a high-quality compression
            setting (0.92 quality) that balances size and sharpness well for
            most use cases.
          </p>
        </section>

        <section>
          <h2>Popular Image Conversions</h2>
          <ul className="custom-list">
            <li>
              <b>PNG to JPG</b> — Reduce file size for photos while keeping them
              universally compatible.
            </li>
            <li>
              <b>JPG to PNG</b> — Switch to lossless format or add transparency
              support.
            </li>
            <li>
              <b>PNG to WebP</b> — Optimize graphics and logos for faster
              website loading.
            </li>
            <li>
              <b>JPG to WebP</b> — Shrink photo file sizes for better web
              performance.
            </li>
            <li>
              <b>HEIC to JPG</b> — Make iPhone photos compatible with Windows,
              Android, and websites.
            </li>
            <li>
              <b>HEIC to PNG</b> — Convert iPhone photos to a lossless format
              with transparency support.
            </li>
            <li>
              <b>WebP to JPG</b> — Convert modern format back to universal JPG
              for older software or printing.
            </li>
            <li>
              <b>WebP to PNG</b> — Restore full lossless quality from WebP.
            </li>
            <li>
              <b>JPG to AVIF</b> — Get next-gen compression for high-traffic
              websites.
            </li>
            <li>
              <b>PNG to AVIF</b> — Shrink large images for modern browsers.
            </li>
            <li>
              <b>Image to SVG</b> — Embed raster images inside SVG format for
              web use.
            </li>
          </ul>
        </section>

        <section>
          <h2>
            Why Convert Images in the Browser Instead of Uploading to a Server?
          </h2>
          <p>
            Most image converter tools you'll find online work by uploading your
            image to their server, processing it there, then sending it back for
            you to download. That approach has real problems: it's slower, your
            files are exposed to a third-party server, and many tools impose
            daily limits, file size caps, or require you to create an account.
          </p>
          <p>
            Our converter does things differently. The entire conversion happens
            directly inside your web browser using the HTML5 Canvas API. Your
            image is never sent anywhere — it stays entirely on your device.
            This means:
          </p>
          <ul className="custom-list">
            <li>Your images remain completely private — we never see them.</li>
            <li>
              Conversion is faster because there's no upload/download round
              trip.
            </li>
            <li>There are no file size limits imposed by server bandwidth.</li>
            <li>It works even with a slow or unstable internet connection.</li>
            <li>There's no daily conversion limit or account required.</li>
          </ul>
        </section>

        <section>
          <h2>Is It Safe to Convert Images Online?</h2>
          <p>
            With our tool, yes — 100%. Because conversion happens entirely in
            your browser and files are never uploaded to a server, there's no
            privacy risk. Your images don't pass through any third-party
            infrastructure, aren't stored anywhere, and aren't accessible to
            anyone but you.
          </p>
          <p>
            This is especially important if you're converting documents,
            sensitive photos, ID scans, or any image that contains personal
            information. With server-based converters, you're trusting that
            company's privacy policy and security practices. With a
            browser-based converter like ours, there's nothing to trust because
            nothing leaves your device.
          </p>
        </section>

        <section>
          <h2>Understanding Image File Formats in Detail</h2>

          <h3>JPG / JPEG — Joint Photographic Experts Group</h3>
          <p>
            JPG has been the dominant photo format since the 1990s. It uses
            lossy compression, which means the file discards some image data to
            achieve smaller sizes. For most photos, this compression is nearly
            invisible to the human eye. JPG supports millions of colors and
            handles photographic content — landscapes,{" "}
            <Link href="/image-resizer/" className="my-link">
              portraits
            </Link>
            , product photos — extremely well. It does not support transparency
            or animation. JPG is the safe, universal choice when you just need
            the image to open everywhere.
          </p>

          <h3>PNG — Portable Network Graphics</h3>
          <p>
            PNG was created as an open-source alternative to GIF. It uses
            lossless compression, meaning every pixel is stored exactly as-is
            with no quality degradation. PNG supports full transparency through
            an alpha channel, making it ideal for logos, UI elements,
            watermarks, and any graphic that needs to sit cleanly over different
            backgrounds. PNGs tend to be larger than JPGs for photographic
            content, so they're not ideal for photos where file size is a
            concern.
          </p>

          <h3>WebP — Web Picture Format</h3>
          <p>
            Google introduced WebP as a superior alternative to both JPG and PNG
            for web use. It supports both lossy and lossless compression modes,
            alpha transparency, and even animation. In lossy mode, WebP
            typically achieves 25–34% better compression than JPG at equivalent
            visual quality. In lossless mode, WebP files are about 26% smaller
            than PNG files. By 2026, WebP is supported by all major browsers and
            should be your default format for any image going onto a website.
          </p>

          <h3>SVG — Scalable Vector Graphics</h3>
          <p>
            SVG is fundamentally different from the other formats on this list.
            While JPG, PNG, WebP, and AVIF are all raster formats (made of
            pixels), SVG is a vector format — it stores images as mathematical
            shapes and paths rather than pixels. This means SVGs can be scaled
            to any size without becoming blurry or pixelated. SVG is ideal for
            logos, icons, and illustrations where sharpness at every size
            matters. Note: our tool converts raster images into SVG by embedding
            the raster image inside an SVG wrapper, which is useful for web
            embedding but doesn't convert the image to true vector paths.
          </p>

          <h3>AVIF — AV1 Image File Format</h3>
          <p>
            AVIF is one of the newest mainstream image formats, finalized in
            2019 and based on the AV1 video codec. AVIF provides superior
            compression compared to both JPG and WebP — often 40–50% smaller
            file sizes at equivalent visual quality. It also supports HDR, wide
            color gamut, transparency, and both lossy and lossless compression.
            Browser support in 2026 covers Chrome, Firefox, Safari, and Edge.
            AVIF is the best choice if maximum compression efficiency is your
            goal.
          </p>

          <h3>HEIC — High Efficiency Image Container</h3>
          <p>
            HEIC is the file format Apple uses to store photos on iPhones and
            iPads running iOS 11 or later. HEIC files are roughly half the size
            of JPEG files at the same visual quality, which is why Apple adopted
            it. The downside is compatibility — HEIC isn't natively supported on
            most non-Apple devices. Windows 10 and 11 need a paid extension to
            view HEIC files natively, and most online upload forms don't accept
            HEIC. This is why converting HEIC to JPG or PNG is one of the most
            common image tasks people search for online.
          </p>
        </section>

        <section>
          <h2>Tips for Getting the Best Results When Converting Images</h2>
          <ul className="custom-list">
            <li>
              <b>Always start with the highest quality original.</b> Image
              converters can't add detail that isn't there. If you start with a
              heavily compressed, low-resolution JPG, the converted file won't
              look better — it'll just be in a different format.
            </li>
            <li>
              <b>Don't convert between lossy formats repeatedly.</b> Converting
              JPG → WebP → JPG → WebP repeatedly degrades quality slightly each
              time. Pick your final format and convert once from the original.
            </li>
            <li>
              <b>
                Use WebP or AVIF for web, PNG for graphics, JPG for broad
                compatibility.
              </b>{" "}
              This simple rule covers the majority of use cases.
            </li>
            <li>
              <b>Check transparency before converting to JPG.</b> If your image
              has a transparent background and you convert to JPG, the
              transparent areas become white. Use PNG or WebP if you need to
              keep the transparency.
            </li>
            <li>
              <b>Batch convert when possible.</b> Our tool lets you upload and
              convert up to 3 images at once, which saves time when you have
              multiple files to process.
            </li>
          </ul>
        </section>

        <section>
          <h2>Common Image Conversion Scenarios and Solutions</h2>

          <h3>Scenario 1: "My iPhone photos won't open on my Windows PC"</h3>
          <p>
            This happens because iPhone cameras default to saving photos in HEIC
            format, which Windows doesn't support natively. The fix is simple:
            use our converter to change your HEIC files to JPG. Select JPG as
            the output format, upload your HEIC photos, and download the
            converted files. They'll open instantly on any Windows PC, Android
            device, or any other platform.
          </p>

          <h3>
            Scenario 2: "My website is loading slowly because of large image
            files"
          </h3>
          <p>
            If your web pages feel slow, images are usually the biggest culprit.
            Converting your images from PNG or JPG to WebP can dramatically
            reduce file sizes. A 1 MB JPG can often become a 600–700 KB WebP
            with no visible quality difference. If you want to go further, try
            AVIF for even smaller files. Both formats are supported by all
            modern browsers and will make a real difference in your PageSpeed
            score.
          </p>

          <h3>
            Scenario 3: "I need to upload a logo with a transparent background
            but the site only accepts PNG"
          </h3>
          <p>
            If you have your logo as a WebP or SVG file and the upload form only
            accepts PNG, just convert it here — select PNG as the output format
            and upload your source file. The transparent background will be
            preserved in the converted PNG, so your logo will look exactly right
            on any colored background.
          </p>

          <h3>
            Scenario 4: "I have a PNG file that's 8 MB but the email limit is 5
            MB"
          </h3>
          <p>
            Large PNG files are often photos saved in the wrong format. Convert
            the PNG to JPG or WebP and you'll likely see the file size drop to
            1–2 MB immediately. If it's a photo (not a logo with transparency),
            JPG or WebP will give you essentially the same visual quality at a
            fraction of the file size.
          </p>

          <h3>
            Scenario 5: "I need to submit a document scan but they only accept
            JPG"
          </h3>
          <p>
            If you have a scan saved as PNG or WebP, converting it to JPG takes
            a few seconds with our tool. Select JPG from the dropdown, upload
            your scan, and download the converted file. It'll meet the JPG-only
            requirement without any loss in readability.
          </p>
        </section>

        <section>
          <h2>FAQ – Free Online Image Converter</h2>

          <div className="faq-item">
            <h3 onClick={() => toggleFAQ(0)}>
              Is this image converter completely free to use?
              <i
                className={`fa-solid fa-chevron-down ${openFAQ === 0 ? "rotate" : ""}`}
              ></i>
            </h3>
            {openFAQ === 0 && (
              <p>
                Yes, 100% free with no hidden costs. You can convert as many
                images as you need without paying anything, creating an account,
                or watching ads. There are no daily limits or premium tiers —
                the full tool is free for everyone.
              </p>
            )}
          </div>

          <div className="faq-item">
            <h3 onClick={() => toggleFAQ(1)}>
              Are my images safe? Does anything get uploaded to a server?
              <i
                className={`fa-solid fa-chevron-down ${openFAQ === 1 ? "rotate" : ""}`}
              ></i>
            </h3>
            {openFAQ === 1 && (
              <p>
                Your images are completely safe. The entire conversion process
                happens inside your web browser using the HTML5 Canvas API.
                Nothing is uploaded to any server, and nothing is stored
                anywhere. This makes our tool safe to use even with sensitive or
                private photos.
              </p>
            )}
          </div>

          <div className="faq-item">
            <h3 onClick={() => toggleFAQ(2)}>
              Will converting reduce my image quality?
              <i
                className={`fa-solid fa-chevron-down ${openFAQ === 2 ? "rotate" : ""}`}
              ></i>
            </h3>
            {openFAQ === 2 && (
              <p>
                Our converter uses a quality setting of 0.92 (out of 1.0), which
                is high enough that quality loss is essentially invisible in
                most cases. Converting to PNG or SVG is lossless — no quality is
                lost at all. The one case where quality can drop more noticeably
                is if you start with an already heavily compressed source image.
              </p>
            )}
          </div>

          <div className="faq-item">
            <h3 onClick={() => toggleFAQ(3)}>
              Can I convert multiple images at once?
              <i
                className={`fa-solid fa-chevron-down ${openFAQ === 3 ? "rotate" : ""}`}
              ></i>
            </h3>
            {openFAQ === 3 && (
              <p>
                Yes — you can upload and convert up to 3 images in a single
                batch. Just select multiple files when uploading or drag and
                drop multiple images into the upload area. Each image will be
                converted individually and available for separate download.
              </p>
            )}
          </div>

          <div className="faq-item">
            <h3 onClick={() => toggleFAQ(4)}>
              How do I convert HEIC to JPG without installing software?
              <i
                className={`fa-solid fa-chevron-down ${openFAQ === 4 ? "rotate" : ""}`}
              ></i>
            </h3>
            {openFAQ === 4 && (
              <p>
                You don't need any software. Just select JPG as the output
                format in our converter, upload your HEIC file from your iPhone
                or Mac, and click Convert. The resulting JPG file will download
                to your device instantly — no app installation, no account, no
                software required.
              </p>
            )}
          </div>

          <div className="faq-item">
            <h3 onClick={() => toggleFAQ(5)}>
              What's the difference between PNG and JPG?
              <i
                className={`fa-solid fa-chevron-down ${openFAQ === 5 ? "rotate" : ""}`}
              ></i>
            </h3>
            {openFAQ === 5 && (
              <p>
                PNG uses lossless compression and supports transparent
                backgrounds, making it ideal for logos, icons, and graphics. JPG
                uses lossy compression and doesn't support transparency, but
                produces much smaller file sizes for photographs. For photos
                where file size matters, use JPG. For logos, illustrations, or
                anything needing transparency, use PNG or WebP.
              </p>
            )}
          </div>

          <div className="faq-item">
            <h3 onClick={() => toggleFAQ(6)}>
              Why should I convert images to WebP?
              <i
                className={`fa-solid fa-chevron-down ${openFAQ === 6 ? "rotate" : ""}`}
              ></i>
            </h3>
            {openFAQ === 6 && (
              <p>
                WebP is Google's modern image format designed specifically for
                the web. WebP images are typically 25–35% smaller than JPG and
                up to 50% smaller than PNG at the same visual quality. Smaller
                images load faster, which improves your Google PageSpeed score,
                reduces bandwidth usage, and provides a better experience for
                your visitors. All major modern browsers support WebP, making it
                the best general-purpose format for websites.
              </p>
            )}
          </div>

          <div className="faq-item">
            <h3 onClick={() => toggleFAQ(7)}>
              Is there a file size limit for converting images?
              <i
                className={`fa-solid fa-chevron-down ${openFAQ === 7 ? "rotate" : ""}`}
              ></i>
            </h3>
            {openFAQ === 7 && (
              <p>
                Because conversion happens in your browser rather than on a
                server, there's no externally imposed file size limit. Very
                large images (50 MB+) may take a moment longer to process
                depending on your device's speed, but the tool will handle them.
                Most typical image files — photos, graphics, screenshots —
                convert in under two seconds.
              </p>
            )}
          </div>

          <div className="faq-item">
            <h3 onClick={() => toggleFAQ(8)}>
              Does this tool work on iPhone and Android?
              <i
                className={`fa-solid fa-chevron-down ${openFAQ === 8 ? "rotate" : ""}`}
              ></i>
            </h3>
            {openFAQ === 8 && (
              <p>
                Yes. Our image converter is fully mobile-friendly and works on
                iPhone, iPad, Android phones and tablets, as well as Mac,
                Windows, and Linux desktops. Since it's browser-based, all you
                need is a modern browser — Chrome, Safari, Firefox, or Edge —
                and it works exactly the same on every device.
              </p>
            )}
          </div>

          <div className="faq-item">
            <h3 onClick={() => toggleFAQ(9)}>
              Can I convert an image to SVG?
              <i
                className={`fa-solid fa-chevron-down ${openFAQ === 9 ? "rotate" : ""}`}
              ></i>
            </h3>
            {openFAQ === 9 && (
              <p>
                Yes, our tool can convert any raster image (JPG, PNG, WebP,
                HEIC, AVIF) to SVG format. Keep in mind that this embeds the
                raster image inside an SVG container — it doesn't trace the
                image into vector paths like dedicated vectorization tools do.
                The resulting SVG is useful for web embedding and can be scaled
                without becoming blurry, but it still contains pixel data
                internally.
              </p>
            )}
          </div>

          <div className="faq-item">
            <h3 onClick={() => toggleFAQ(10)}>
              What's AVIF and should I use it instead of WebP?
              <i
                className={`fa-solid fa-chevron-down ${openFAQ === 10 ? "rotate" : ""}`}
              ></i>
            </h3>
            {openFAQ === 10 && (
              <p>
                AVIF (AV1 Image File Format) is a next-generation image format
                that offers even better compression than WebP — often 40–50%
                smaller file sizes than JPG at the same quality. It's supported
                by Chrome, Firefox, and Safari. If you're running a{" "}
                <Link href="/" className="my-link">
                  high-traffic website
                </Link>{" "}
                and care deeply about performance, AVIF is worth switching to.
                For general use, WebP is still the safer and more compatible
                choice since it has broader support across older browsers and
                tools.
              </p>
            )}
          </div>

          <div className="faq-item">
            <h3 onClick={() => toggleFAQ(11)}>
              Does this converter support HEIC files from iPhone?
              <i
                className={`fa-solid fa-chevron-down ${openFAQ === 11 ? "rotate" : ""}`}
              ></i>
            </h3>
            {openFAQ === 11 && (
              <p>
                Yes, HEIC is fully supported. You can upload HEIC photos
                directly from your iPhone or Mac and convert them to JPG, PNG,
                WebP, or AVIF. This is the easiest way to make your iPhone
                photos compatible with Windows computers, Android devices, and
                websites that don't accept HEIC format — all without installing
                any software.
              </p>
            )}
          </div>
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
