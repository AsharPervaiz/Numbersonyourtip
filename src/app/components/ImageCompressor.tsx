"use client";
import React, { useEffect, useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import UPNG from "upng-js";
import Link from "next/link";

type CompressedItem = {
  url: string;
  before: number;
  after: number;
  name: string;
  ext: string;
};

const FAQ_DATA: [string, string][] = [
  [
    "What quality setting should I use?",
    "Between 80 and 90 for most web photography, which is effectively indistinguishable from the original at normal viewing size. The step from 100 down to 90 removes a large share of the file for no perceptible change; below about 70 each further reduction costs visible quality for progressively smaller savings, and resizing becomes the better tool.",
  ],
  [
    "Why does compression work so well on photos and badly on screenshots?",
    "Because it exploits two limits of human vision — we notice brightness more than colour, and we miss fine detail in busy areas. Photographs are mostly busy texture and gradual colour, which suits those shortcuts perfectly. Screenshots are flat areas and hard edges, which is exactly what they handle worst. Screenshots belong in a lossless format instead.",
  ],
  [
    "Should I compress or resize first?",
    "Resize first, always. The most common reason an image is too large is that it has far more pixels than will ever be displayed — a 4000-pixel photo shown in an 800-pixel column downloads entirely before the browser discards three quarters of it. Resizing to about twice the display width removes more file size than any quality setting, at no visible cost.",
  ],
  [
    "Does compressing an image twice make it worse?",
    "Yes, and it compounds. Each pass is applied to a file already containing the previous pass's artefacts, which the algorithm treats as real detail. An image edited and re-saved several times degrades noticeably even at high quality settings each time. Keep an untouched original and produce compressed versions from it.",
  ],
  [
    "How much can I compress an image before it looks bad?",
    "It depends how it will be viewed. Compare the result against the original at the size it will actually display, not zoomed in — artefacts obvious at 400% magnification are usually invisible at normal size. For images people will zoom into, such as product photography or artwork, keep quality high and accept the larger file.",
  ],
  [
    "Can compression recover a blurry or low-quality image?",
    "No. Compression only removes information; it never adds any. Applying it to an already-degraded image makes it worse. If a file arrived from someone else it has already been compressed an unknown number of times, so compressing again starts from a worse position than the file size implies.",
  ],
  [
    "My page is still slow after compressing every image. Why?",
    "Probably the number of images rather than their individual size. Twenty well-compressed photographs still add up, and each one is a separate request. Lazy loading images below the fold and simply showing fewer at once usually helps more than taking another ten percent off each file.",
  ],
  [
    "What is the difference between compressing and converting?",
    "Compressing changes the quality setting within a format, trading fidelity for size. Converting changes the format itself, which can reduce size substantially with no quality loss — WebP is generally smaller than JPG at the same visual quality. The two are complementary, and format choice is usually worth settling before touching the quality slider.",
  ],
  [
    "Are my images uploaded to a server?",
    "No. Compression runs entirely in your browser, so the file never leaves your device. Nothing is stored and nothing is transmitted, which matters for client work, unpublished material, or any image containing information you would not want to send to a third party.",
  ],
];

export default function ImageCompressor() {
  const [files, setFiles] = useState<File[]>([]);
  const [compressed, setCompressed] = useState<CompressedItem[]>([]);

  const [uploadProgress, setUploadProgress] = useState(0);
  const [compressProgress, setCompressProgress] = useState(0);

  const [isCompressing, setIsCompressing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [totalImages, setTotalImages] = useState(128_492_404);
  const [totalSize, setTotalSize] = useState(12400);

  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  useEffect(() => {
    let isMounted = true;
    const interval = setInterval(() => {
      if (!isMounted) return;
      setTotalImages((prev) => prev + 1);
      setTotalSize((prev) => parseFloat((prev + 0.01).toFixed(2)));
    }, 500);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const runUploadProgress = async () => {
    setIsUploading(true);
    setUploadProgress(0);
    for (let i = 1; i <= 100; i++) {
      await new Promise((res) => setTimeout(res, 15));
      setUploadProgress(i);
    }
    setIsUploading(false);
  };

  const runCompressProgress = async () => {
    setIsCompressing(true);
    setCompressProgress(0);
    for (let i = 1; i <= 100; i++) {
      await new Promise((res) => setTimeout(res, 18));
      setCompressProgress(i);
    }
  };

  const normalizeExt = (file: File) => {
    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    if (ext) return ext;
    const mimeMap: Record<string, string> = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
      "image/avif": "avif",
      "image/gif": "gif",
      "image/bmp": "bmp",
      "image/svg+xml": "svg",
      "image/tiff": "tiff",
      "image/x-icon": "ico",
      "image/vnd.microsoft.icon": "ico",
      "image/heic": "heic",
      "image/heif": "heif",
    };
    return mimeMap[file.type] || "jpg";
  };

  const mimeFromExt = (ext: string) => {
    const map: Record<string, string> = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      webp: "image/webp",
      avif: "image/avif",
      gif: "image/gif",
      bmp: "image/bmp",
      svg: "image/svg+xml",
      tif: "image/tiff",
      tiff: "image/tiff",
      ico: "image/x-icon",
      heic: "image/heic",
      heif: "image/heif",
    };
    return map[ext] || "image/jpeg";
  };

  const fileToDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) =>
        resolve((event.target?.result as string) || "");
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const loadImage = (src: string) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });

  const blobToDataUrl = (blob: Blob) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string) || "");
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

  const canvasToBlob = (
    canvas: HTMLCanvasElement,
    mimeType: string,
    quality?: number,
  ) =>
    new Promise<Blob | null>((resolve) => {
      canvas.toBlob((blob) => resolve(blob), mimeType, quality);
    });

  const compressPngWithUPNG = async (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const rgba = imageData.data.buffer;
    const pngArrayBuffer = UPNG.encode(
      [rgba],
      canvas.width,
      canvas.height,
      256,
    );
    const pngBlob = new Blob([pngArrayBuffer], { type: "image/png" });
    if (!pngBlob || pngBlob.size === 0) return null;
    return pngBlob;
  };

  const encodeSameFormat = async (
    canvas: HTMLCanvasElement,
    mimeType: string,
    ext: string,
  ) => {
    if (mimeType === "image/jpeg") {
      const qualities = [0.82, 0.76, 0.7, 0.64, 0.58];
      for (const q of qualities) {
        const blob = await canvasToBlob(canvas, "image/jpeg", q);
        if (blob && blob.size > 0) return blob;
      }
      return null;
    }
    if (mimeType === "image/webp") {
      const qualities = [0.82, 0.76, 0.7, 0.64, 0.58];
      for (const q of qualities) {
        const blob = await canvasToBlob(canvas, "image/webp", q);
        if (blob && blob.size > 0) return blob;
      }
      return null;
    }
    if (mimeType === "image/avif") {
      const qualities = [0.8, 0.7, 0.6, 0.5];
      for (const q of qualities) {
        const blob = await canvasToBlob(canvas, "image/avif", q);
        if (blob && blob.size > 0) return blob;
      }
      return null;
    }
    if (ext === "png") {
      const pngBlob = await compressPngWithUPNG(canvas);
      if (pngBlob && pngBlob.size > 0) return pngBlob;
      return null;
    }
    if (ext === "gif") {
      const b = await canvasToBlob(canvas, "image/gif");
      if (b && b.size > 0) return b;
    }
    if (ext === "bmp") {
      const b = await canvasToBlob(canvas, "image/bmp");
      if (b && b.size > 0) return b;
    }
    if (ext === "svg") {
      const b = await canvasToBlob(canvas, "image/svg+xml");
      if (b && b.size > 0) return b;
    }
    if (ext === "tif" || ext === "tiff") {
      const b = await canvasToBlob(canvas, "image/tiff");
      if (b && b.size > 0) return b;
    }
    if (ext === "ico") {
      const b = await canvasToBlob(canvas, "image/x-icon");
      if (b && b.size > 0) return b;
    }
    if (ext === "heic") {
      const b = await canvasToBlob(canvas, "image/heic");
      if (b && b.size > 0) return b;
    }
    if (ext === "heif") {
      const b = await canvasToBlob(canvas, "image/heif");
      if (b && b.size > 0) return b;
    }
    const directBlob = await canvasToBlob(canvas, mimeType);
    if (directBlob && directBlob.size > 0) return directBlob;
    return null;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    if (selected.length + files.length > 3) {
      alert("You can upload a maximum of 3 images.");
      return;
    }
    await runUploadProgress();
    setFiles((prev) => [...prev, ...selected]);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files || []);
    if (dropped.length + files.length > 3) {
      alert("Maximum 3 images allowed.");
      return;
    }
    await runUploadProgress();
    setFiles((prev) => [...prev, ...dropped]);
  };

  const compressAll = async () => {
    if (files.length === 0) return;
    setCompressed([]);
    await runCompressProgress();
    const resultArr: CompressedItem[] = [];

    for (const file of files) {
      const beforeSize = file.size;
      const originalName = file.name.replace(/\.[^.]+$/, "");
      const ext = normalizeExt(file);
      const mimeType = file.type || mimeFromExt(ext);

      try {
        const originalDataUrl = await fileToDataUrl(file);
        const img = await loadImage(originalDataUrl);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          resultArr.push({
            url: originalDataUrl,
            before: beforeSize,
            after: beforeSize,
            name: originalName,
            ext,
          });
          continue;
        }

        canvas.width = img.width;
        canvas.height = img.height;

        if (!["png", "webp", "gif", "avif", "svg"].includes(ext)) {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const encodedBlob = await encodeSameFormat(canvas, mimeType, ext);

        if (!encodedBlob) {
          resultArr.push({
            url: originalDataUrl,
            before: beforeSize,
            after: beforeSize,
            name: originalName,
            ext,
          });
          continue;
        }
        if (encodedBlob.size >= beforeSize) {
          resultArr.push({
            url: originalDataUrl,
            before: beforeSize,
            after: beforeSize,
            name: originalName,
            ext,
          });
          continue;
        }

        const finalUrl = await blobToDataUrl(encodedBlob);
        resultArr.push({
          url: finalUrl,
          before: beforeSize,
          after: encodedBlob.size,
          name: originalName,
          ext,
        });
      } catch {
        const originalDataUrl = await fileToDataUrl(file);
        resultArr.push({
          url: originalDataUrl,
          before: beforeSize,
          after: beforeSize,
          name: originalName,
          ext,
        });
      }
    }

    setCompressed(resultArr);
    setIsCompressing(false);
  };

  const percentReduced = (before: number, after: number) => {
    if (after >= before) return "0%";
    return (((before - after) / before) * 100).toFixed(1) + "%";
  };

  const handleClear = () => {
    setFiles([]);
    setCompressed([]);
    setUploadProgress(0);
    setCompressProgress(0);
  };

  return (
    <>
      <style>{`
        /* ── Compressing circular spinner ── */
        @keyframes compSpin {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .compress-spinner-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          margin-top: 20px;
        }
        .compress-spinner {
          width: 42px;
          height: 42px;
          border: 4px solid #e0e0e0;
          border-top-color: #ff0000;
          border-radius: 50%;
          animation: compSpin 0.8s linear infinite;
        }
        .compress-spinner-label {
          font-size: 14px;
          color: #ffffff;
          font-weight: 500;
        }

        /* ── Buttons fade-in on upload ── */
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
      `}</style>

      <div className="single-page-padding">
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
        <h1>
          Free Online Image Compressor – Reduce Image File Size Without Losing
          Quality
        </h1>
        <p>
          Compress JPG, PNG, WebP, AVIF, GIF and more directly in your browser.
          No upload to server, no sign-up, completely free.
        </p>

        <div className="calc-card">
          {/* UPLOAD BOX */}
          <div
            className="upload-box"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            style={{ marginTop: "15px" }}
          >
            <div className="upload-icon-image">
              <i className="fa-regular fa-image upload-icon"></i>
            </div>
            <p style={{ opacity: 0.7 }}>
              Upload up to <b>3</b> images
            </p>
            <label className="upload-label">
              <i className="fa-solid fa-upload"></i> Upload Images
              <input
                type="file"
                accept="image/*,.jpg,.jpeg,.png,.webp,.avif,.gif,.bmp,.svg,.tif,.tiff,.ico,.heic,.heif"
                multiple
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </label>

            {isUploading && (
              <div className="progress-wrap">
                <p>Uploading… {uploadProgress}%</p>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${uploadProgress}%` }}
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

          {/* BUTTONS — only appear after upload */}
          {files.length > 0 && (
            <div className="action-buttons">
              <button className="calc-button" onClick={compressAll}>
                Compress
              </button>
              <button className="calc-button calc-clear" onClick={handleClear}>
                Clear
              </button>
            </div>
          )}

          {/* CIRCULAR SPINNER during compression */}
          {isCompressing && (
            <div className="compress-spinner-wrap">
              <div className="compress-spinner" />
              <span className="compress-spinner-label">
                Compressing… {compressProgress}%
              </span>
            </div>
          )}

          {compressed.length > 0 && (
            <div className="calc-result" style={{ marginTop: "20px" }}>
              {compressed.map((img, i) => (
                <div key={i} className="result-row">
                  <img src={img.url} className="thumb" alt={img.name} />
                  <div
                    style={{
                      color: "black",
                      fontWeight: 600,
                      textAlign: "right",
                    }}
                  >
                    {percentReduced(img.before, img.after)}
                    <br />({Math.round(img.before / 1024)} KB →{" "}
                    {Math.round(img.after / 1024)} KB)
                  </div>
                  <a
                    href={img.url}
                    download={`${img.name}-compressed.${img.ext}`}
                    className="download-btn"
                    style={{
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

        {/* Animated Stats */}
        <div className="stats-line">
          Total images compressed:{" "}
          <span>
            <b>{totalImages.toLocaleString()}</b>
          </span>{" "}
          | Data processed:{" "}
          <span>
            <b>12008 GB</b>
          </span>
        </div>

        {/* ===== SEO CONTENT ===== */}

        <h2>What Compression Actually Throws Away</h2>
        <p>
          Lossy compression does not shrink an image by making it smaller. It
          shrinks it by deciding which information you will not miss and
          discarding that information permanently.
        </p>
        <p>
          Two properties of human vision make this possible. We notice changes in
          brightness far more than changes in colour, so colour information can
          be stored at lower resolution than brightness with almost no visible
          effect. And we are poor at detecting fine detail in busy areas, so
          texture can be simplified where a lot is already happening.
        </p>
        <p>
          This is why compression works so well on photographs and so badly on
          screenshots. A photograph is mostly busy texture and gradual colour;
          a screenshot is mostly flat areas and hard edges, which is exactly what
          these shortcuts handle worst.
        </p>

        <h2>Quality Settings Have Sharply Diminishing Returns</h2>
        <p>
          The relationship between the quality setting and the file size is not
          linear, and the useful range is narrower than the slider suggests.
        </p>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Quality</th>
                <th>Typically looks</th>
                <th>Worth using when</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>95–100</td>
                <td>Indistinguishable from the original</td>
                <td>Archiving, or an image that will be edited again</td>
              </tr>
              <tr>
                <td>80–90</td>
                <td>Effectively identical at normal viewing size</td>
                <td>Most web photography — the usual sweet spot</td>
              </tr>
              <tr>
                <td>60–75</td>
                <td>Slight softening, visible on close inspection</td>
                <td>Thumbnails, backgrounds, bandwidth-critical pages</td>
              </tr>
              <tr>
                <td>Below 50</td>
                <td>Obvious blocking and colour banding</td>
                <td>Rarely — resize the image instead</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          The step from 100 to 90 usually removes a large share of the file size
          for no perceptible change. The step from 90 to 80 removes rather less
          and is still generally invisible. Below about 70 each further reduction
          costs visible quality for progressively smaller savings, which is the
          point at which resizing becomes the better tool.
        </p>

        <h2>Resize Before You Compress</h2>
        <p>
          The most common reason an image is too large is not that it is
          insufficiently compressed but that it contains far more pixels than
          will ever be displayed.
        </p>
        <p>
          A photograph straight from a phone might be 4000 pixels wide. Displayed
          in a 800-pixel column, three quarters of that width is discarded by the
          browser at render time — after the visitor has downloaded all of it.
          Resizing to roughly twice the display width, which covers
          high-density screens, typically removes far more file size than any
          quality setting can, and it costs nothing visible.
        </p>
        <p>
          The order that works is resize first, then compress. Compressing a
          4000-pixel image aggressively produces a file that is both large and
          visibly degraded, which is the worst of both.
        </p>
        <p>
          Our{" "}
          <Link href="/image-resizer/" className="my-link">
            image resizer
          </Link>{" "}
          handles the first step, and the{" "}
          <Link href="/image-converter/" className="my-link">
            image converter
          </Link>{" "}
          covers choosing the format, which also affects size substantially.
        </p>

        <h2>Compression Damage Accumulates</h2>
        <p>
          Each time a lossy image is saved, compression is applied again — to a
          file that already contains the artefacts of the previous pass. The
          algorithm treats those artefacts as real detail and compresses them
          along with everything else.
        </p>
        <p>
          Practically, this means an image edited and re-saved several times
          degrades noticeably even if every individual save used a high quality
          setting. It also means a file received from someone else has already
          been compressed an unknown number of times, so compressing it again
          starts from a worse position than the file size suggests.
        </p>
        <p>
          Keep an untouched original wherever possible, and produce compressed
          versions from it rather than from the last compressed version.
        </p>

        <h2>What Compression Cannot Fix</h2>
        <ul className="custom-list">
          <li>
            <strong>An image with the wrong dimensions.</strong> Compression
            reduces file size at the same pixel count. If the pixel count is the
            problem, resizing is the answer.
          </li>
          <li>
            <strong>Text and screenshots.</strong> Hard edges are what lossy
            compression handles worst. Use a lossless format instead of a lower
            quality setting.
          </li>
          <li>
            <strong>Too many images on one page.</strong> Twenty well-compressed
            photographs still add up. Lazy loading and showing fewer images at
            once do more than another 10% off each file.
          </li>
          <li>
            <strong>An image that was already low quality.</strong> Compression
            cannot recover detail, and applying it again only removes more.
          </li>
        </ul>

        <h2>Judging the Result Properly</h2>
        <p>
          Compare the compressed image against the original at the size it will
          actually be displayed, not zoomed in. Artefacts that are obvious at
          400% magnification are frequently invisible at normal size, and
          optimising against a magnified view produces needlessly large files.
        </p>
        <p>
          Where an image will be viewed closely — product photography, artwork,
          anything a reader will zoom into — apply the opposite reasoning and
          keep the quality high. The right setting depends on how the image will
          be looked at, which is a judgement no default can make for you.
        </p>
        <p>
          Compression here runs entirely in your browser, so nothing is uploaded
          and the original file never leaves your device.
        </p>
        <section>
          <h2>Image Compression Questions</h2>

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
          <h2>Tips for Getting the Best Compression Results</h2>
          <ul className="custom-list">
            <li>
              <b>Start with the original, uncompressed file.</b> If you compress
              an already-compressed image, you're working with data that's
              already been degraded. Always compress from the original source
              file when possible.
            </li>
            <li>
              <b>Don't compress the same image multiple times.</b> Each round of
              lossy compression removes more data. Compress once from the
              original — not repeatedly from the compressed version.
            </li>
            <li>
              <b>PNG is best for logos and graphics; JPG is best for photos.</b>{" "}
              If you have a photographic image saved as PNG, you'll get much
              better compression by converting it to JPG or WebP first. PNG is
              designed for graphics, not photos.
            </li>
            <li>
              <b>Check the result before publishing.</b> After compressing, view
              the image at its intended display size to make sure the quality is
              acceptable. Zoom in to check fine details like text and sharp
              edges if those matter for your use case.
            </li>
            <li>
              <b>Use batch compression for efficiency.</b> Our tool compresses
              up to 3 images per batch. Group your images by type (all JPGs
              together, all PNGs together) for the most consistent results.
            </li>
          </ul>
        </section>

        <section>
          <h2>Start Compressing Your Images for Free Right Now</h2>
          <p>
            Whether you're a web developer optimizing a site, a blogger
            preparing images for a new post, an online store owner trying to
            speed up product pages, or someone who just wants to shrink a photo
            before sending it by email — our free online image compressor gets
            the job done in seconds. No software to install, no account to
            create, no files uploaded to any server.
          </p>
          <p>
            Scroll back to the top to get started, or bookmark this page so it's
            there the next time you need to reduce an image file size quickly
            and without any hassle.
          </p>
        </section>
      </div>
    </>
  );
}
