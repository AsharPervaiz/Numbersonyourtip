"use client";
import React, { useState, useRef } from "react";
import ReactCrop, { Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Link from "next/link";

const FAQ_DATA: [string, string][] = [
  [
    "Can I enlarge an image without losing quality?",
    "Not really. Reducing an image discards pixels, which is straightforward, but enlarging has to invent pixels that were never captured. Interpolation estimates each new one from its neighbours, producing a larger and softer image rather than a more detailed one. A 400-pixel image scaled to 1600 holds exactly as much real information spread over sixteen times the area.",
  ],
  [
    "How do I resize without squashing the image?",
    "Keep the aspect ratio locked so both dimensions change together. Manually, the new height is the original height multiplied by the new width divided by the original width — so 1600 × 1200 resized to 800 wide needs a height of 600. When an image must fit a different shape, crop it rather than stretching, since cropping keeps what remains correct.",
  ],
  [
    "What size should my images be for a website?",
    "Roughly twice the width they will display at, which covers high-density screens without wasting data. That means about 1920–2400 pixels for a full-width banner, 1200–1600 for a main content image, 600–800 for a card, and 200–400 for an avatar. Anything much larger is downloaded and then discarded by the browser.",
  ],
  [
    "Does changing DPI make my image better on screen?",
    "No. DPI describes how densely pixels are placed when printed and has no effect on screen display. A 1200-pixel-wide image is 1200 pixels wide whether its metadata says 72 or 300. Changing that number alters nothing on a website, and it is the single most common piece of wasted effort in image preparation.",
  ],
  [
    "What does a 300 DPI image actually mean for print?",
    "It is a request for enough pixels rather than for a metadata value. At 300 DPI, a photo printed six inches wide needs 1800 pixels across. Work out the printed size in inches, multiply by 300, and that is the pixel count you need. The DPI field itself is just the unit the requirement was expressed in.",
  ],
  [
    "Why is my image still a large file after resizing?",
    "Resizing reduces the pixel count, which usually reduces file size substantially, but format and compression also matter. A resized photograph saved as PNG can still be very large, because lossless compression suits graphics rather than photos. Choose the format next, then compress if it remains bigger than you want.",
  ],
  [
    "Should I resize or compress to fix a slow page?",
    "Resize first. The most common cause is an image containing far more pixels than are ever displayed — a 4000-pixel phone photo used as a 600-pixel thumbnail wastes most of its size before anything is drawn. Compressing a hugely oversized image produces a file that is both large and visibly degraded.",
  ],
  [
    "Does resizing change how big the image looks on my page?",
    "Not directly. An image displays at whatever size the layout gives it, and the browser scales the pixels to fit. Making the file larger does not make the picture appear bigger — it only means more data is downloaded and then thrown away. Display size is controlled by the page, not by the file.",
  ],
  [
    "Are my images uploaded when I resize them?",
    "No. Resizing runs in your browser and the file never leaves your device. Work on a copy rather than your only original, though — resizing is destructive, and the discarded pixels cannot be recovered from the smaller version afterwards.",
  ],
];

export default function ImageResizer() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>({
    unit: "px",
    width: 300,
    height: 300,
    x: 50,
    y: 50,
  });

  const [completedCrop, setCompletedCrop] = useState<Crop | null>(null);
  const [output, setOutput] = useState<any>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [cropProgress, setCropProgress] = useState(0);

  const imgRef = useRef<HTMLImageElement | null>(null);

  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  // ── Upload ──
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result as string);
    reader.readAsDataURL(file);
    setOutput(null);
  };

  // ── Force integers (original) ──
  const toInt = (val: number) => Math.round(val || 0);

  // ── Sync width/height (original) ──
  const handleWidthChange = (val: number) => {
    setCrop((prev) => ({ ...prev, width: toInt(val) }));
  };
  const handleHeightChange = (val: number) => {
    setCrop((prev) => ({ ...prev, height: toInt(val) }));
  };

  // ── Spinner progress ──
  const runCropProgress = async () => {
    setIsCropping(true);
    setCropProgress(0);
    for (let i = 1; i <= 100; i++) {
      await new Promise((res) => setTimeout(res, 12));
      setCropProgress(i);
    }
  };

  // ── MAIN CROP — original accurate canvas logic, untouched ──
  const handleCrop = async () => {
    if (!completedCrop || !imgRef.current) return;
    await runCropProgress();

    const image = imgRef.current;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = Math.round(completedCrop.width! * scaleX);
    const height = Math.round(completedCrop.height! * scaleY);

    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);

    ctx.drawImage(
      image,
      completedCrop.x! * scaleX,
      completedCrop.y! * scaleY,
      completedCrop.width! * scaleX,
      completedCrop.height! * scaleY,
      0,
      0,
      width,
      height,
    );

    const base64 = canvas.toDataURL("image/png");
    setOutput({ url: base64, width, height });
    setIsCropping(false);
  };

  // ── Clear ──
  const handleClear = () => {
    setImageSrc(null);
    setOutput(null);
    setCropProgress(0);
  };

  return (
    <>
      <style>{`
        @keyframes resizerSpin {
          to { transform: rotate(360deg); }
        }
        .resizer-spinner-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          margin-top: 20px;
        }
        .resizer-spinner {
          width: 42px;
          height: 42px;
          border: 4px solid #e0e0e0;
          border-top-color: #ff0000;
          border-radius: 50%;
          animation: resizerSpin 0.8s linear infinite;
        }
        .resizer-spinner-label {
          font-size: 14px;
          color: #000000;
          font-weight: 500;
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .resizer-action-buttons {
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
          Free Online Image Resizer &amp; Crop Tool – Resize Images to Exact
          Pixels
        </h1>
        <p>
          Crop, resize, and export images to precise dimensions. Browser-based,
          no upload to server, works on any device.
        </p>

        <div className="calc-card resizer-layout">
          {/* ── LEFT: original upload box — untouched ── */}
          <div className="crop-area">
            {!imageSrc ? (
              <div className="upload-content">
                <div className="upload-icon-image">
                  <i className="fa-regular fa-image upload-icon"></i>
                </div>
                <p className="upload-text">
                  Upload <b>1</b> image
                </p>
                <label className="upload-label">
                  <i className="fa-solid fa-upload"></i>
                  Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUpload}
                    hidden
                  />
                </label>
              </div>
            ) : (
              <div className="image-wrapper">
                <ReactCrop
                  crop={crop}
                  onChange={(c) =>
                    setCrop({
                      ...c,
                      width: toInt(c.width!),
                      height: toInt(c.height!),
                      x: toInt(c.x!),
                      y: toInt(c.y!),
                    })
                  }
                  onComplete={(c) => setCompletedCrop(c)}
                >
                  <img ref={imgRef} src={imageSrc} className="crop-image" />
                </ReactCrop>
              </div>
            )}
          </div>

          {/* ── RIGHT: pro control panel ── */}
          <div className="crop-controls">
            {/* ── Crop Size ── */}
            <div className="ctrl-section">
              <div className="ctrl-section-header">
                <i className="fa-solid fa-crop-simple ctrl-icon" />
                <span>Crop Size</span>
              </div>
              <div className="dim-row">
                <div className="dim-field">
                  <label>
                    W <span className="unit-tag">px</span>
                  </label>
                  <input
                    type="number"
                    value={toInt(crop.width || 0)}
                    onChange={(e) => handleWidthChange(Number(e.target.value))}
                  />
                </div>
                <div className="dim-field">
                  <label>
                    H <span className="unit-tag">px</span>
                  </label>
                  <input
                    type="number"
                    value={toInt(crop.height || 0)}
                    onChange={(e) => handleHeightChange(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>

            {/* ── Position ── */}
            <div className="ctrl-section">
              <div className="ctrl-section-header">
                <i className="fa-solid fa-crosshairs ctrl-icon" />
                <span>Position</span>
              </div>
              <div className="dim-row">
                <div className="dim-field">
                  <label>
                    X <span className="unit-tag">px</span>
                  </label>
                  <input
                    type="number"
                    value={toInt(crop.x || 0)}
                    onChange={(e) =>
                      setCrop({ ...crop, x: toInt(Number(e.target.value)) })
                    }
                  />
                </div>
                <div className="dim-field">
                  <label>
                    Y <span className="unit-tag">px</span>
                  </label>
                  <input
                    type="number"
                    value={toInt(crop.y || 0)}
                    onChange={(e) =>
                      setCrop({ ...crop, y: toInt(Number(e.target.value)) })
                    }
                  />
                </div>
              </div>
            </div>

            {/* ── Output info ── */}
            <div className="ctrl-section">
              <div className="ctrl-section-header">
                <i className="fa-solid fa-file-image ctrl-icon" />
                <span>Output</span>
              </div>
              <div className="output-meta">
                <div className="meta-row">
                  <span className="meta-label">Format</span>
                  <span className="meta-value">PNG (lossless)</span>
                </div>
                <div className="meta-row">
                  <span className="meta-label">Processing</span>
                  <span className="meta-value">In-browser · Private</span>
                </div>
                <div className="meta-row">
                  <span className="meta-label">Selection</span>
                  <span className="meta-value">
                    {completedCrop
                      ? `${toInt(completedCrop.width!)} × ${toInt(completedCrop.height!)} px`
                      : "—"}
                  </span>
                </div>
              </div>
            </div>

            {/* ── Buttons — only after upload ── */}
            {imageSrc && (
              <div
                className="resizer-action-buttons"
                style={{ padding: "0 14px 14px" }}
              >
                <button className="calc-button" onClick={handleCrop}>
                  Crop &amp; Save
                </button>
                <button
                  className="calc-button calc-clear"
                  onClick={handleClear}
                >
                  Clear
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Spinner ── */}
        {isCropping && (
          <div className="resizer-spinner-wrap">
            <div className="resizer-spinner" />
            <span className="resizer-spinner-label">
              Processing… {cropProgress}%
            </span>
          </div>
        )}

        {/* ── Result ── */}
        {output && (
          <div className="calc-result">
            <p>Result</p>
            <div className="result-row">
              <img src={output.url} className="thumb" />
              <div className="result-info">
                {output.width} × {output.height} px
              </div>
              <a
                href={output.url}
                download="resized.png"
                className="download-btn"
                style={{ display: "flex", alignItems: "center", gap: "6px" }}
              >
                <i className="fa-solid fa-download" />
                Download
              </a>
            </div>
          </div>
        )}

        {/* ===== SEO CONTENT ===== */}

        <h2>Pixels, File Size and Display Size Are Three Different Numbers</h2>
        <p>
          Almost every confusion about image sizing comes from treating these as
          one thing.
        </p>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Number</th>
                <th>Means</th>
                <th>Changed by</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Pixel dimensions</td>
                <td>How much detail the image contains</td>
                <td>Resizing</td>
              </tr>
              <tr>
                <td>File size</td>
                <td>How many bytes it occupies</td>
                <td>Resizing, compression and format together</td>
              </tr>
              <tr>
                <td>Display size</td>
                <td>How large it appears on screen or paper</td>
                <td>The page layout, not the file</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          The third is the one people expect the file to control and it does
          not. An image displays at whatever size the layout gives it, and the
          browser scales the pixels to fit. Making the file bigger does not make
          the picture appear larger; it only means more data is downloaded and
          then discarded.
        </p>

        <h2>Enlarging Cannot Add Detail</h2>
        <p>
          Reducing an image discards pixels, which is straightforward. Enlarging
          it has to invent pixels that were never captured, and there is no way
          to invent the right ones.
        </p>
        <p>
          Interpolation estimates each new pixel from its neighbours, which
          produces a larger image that is softer than the original rather than a
          more detailed one. A 400-pixel image scaled to 1600 pixels contains
          exactly as much real information as it did before, spread across
          sixteen times the area.
        </p>
        <p>
          The practical rule is to always start from the largest version you
          have. If the only file available is small, enlarging it is a
          compromise rather than a fix, and modest enlargement — up to perhaps
          150% — survives better than dramatic scaling.
        </p>

        <h2>Aspect Ratio, and Why Images Get Squashed</h2>
        <p>
          Aspect ratio is the relationship between width and height. Change one
          without the other and the image distorts — faces widen, circles become
          ovals, and text stretches.
        </p>
        <pre>
          New height = Original height × (New width ÷ Original width)
        </pre>
        <p>
          A 1600 × 1200 image resized to 800 wide needs a height of 1200 × (800 ÷
          1600) = 600. Keeping the ratio locked handles this automatically, and
          it should be the default.
        </p>
        <p>
          When an image genuinely has to fit a different shape — a square avatar
          from a landscape photo — crop rather than stretch. Cropping removes
          part of the picture and keeps the rest correct. Stretching keeps
          everything and makes all of it wrong, which is far more noticeable.
        </p>

        <h2>What Size Does an Image Actually Need to Be?</h2>
        <p>
          The useful rule for screens is roughly twice the display width, which
          covers high-density displays without wasting data.
        </p>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Use</th>
                <th>Sensible width</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Full-width banner</td>
                <td>Around 1920–2400 pixels</td>
              </tr>
              <tr>
                <td>Main content image</td>
                <td>Around 1200–1600 pixels</td>
              </tr>
              <tr>
                <td>Card or thumbnail</td>
                <td>Around 600–800 pixels</td>
              </tr>
              <tr>
                <td>Avatar or icon</td>
                <td>Around 200–400 pixels</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          Anything substantially above these is downloaded and thrown away. A
          phone photograph at 4000 pixels used as a 600-pixel thumbnail wastes
          most of its file size before a single pixel is drawn.
        </p>

        <h2>DPI Does Not Affect Screen Images</h2>
        <p>
          This causes more wasted effort than any other sizing misconception. DPI
          — or PPI — describes how densely pixels are placed when an image is
          printed. It has no effect on how an image appears on a screen.
        </p>
        <p>
          A 1200-pixel-wide image is 1200 pixels wide whether its metadata says
          72 DPI or 300 DPI. Changing that number alters nothing visible on a
          website. Being asked for a &quot;300 DPI image&quot; for print is
          really a request for enough pixels: at 300 DPI, a photo printed 6
          inches wide needs 1800 pixels. The pixel count is the real requirement
          and DPI is just the unit it was expressed in.
        </p>

        <h2>Working Order</h2>
        <ul className="custom-list">
          <li>
            Start from the largest original you have, and keep it. Resizing is
            destructive, so work on a copy.
          </li>
          <li>
            Resize to about twice the intended display width, with the aspect
            ratio locked.
          </li>
          <li>
            Choose the format next — photographic or graphic decides it, and the{" "}
            <Link href="/image-converter/" className="my-link">
              image converter
            </Link>{" "}
            covers the trade-offs.
          </li>
          <li>
            Compress last, if the file is still larger than you want, using the{" "}
            <Link href="/image-compressor/" className="my-link">
              image compressor
            </Link>
            .
          </li>
          <li>
            Check the result at its real display size rather than zoomed in.
          </li>
        </ul>
        <p>
          Resizing here happens in your browser, so images are never uploaded and
          nothing leaves your device.
        </p>
        <section>
          <h2>Image Resizing Questions</h2>

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
          <h2>Tips for Getting the Best Results</h2>
          <ul className="custom-list">
            <li>
              <b>Always start from the highest resolution original.</b> You can
              always make an image smaller — you can't add pixels that don't
              exist.
            </li>
            <li>
              <b>Crop before compressing.</b> Get the right dimensions first,
              then compress to reduce file size.
            </li>
            <li>
              <b>Use the X and Y inputs for precision.</b> If you need a crop to
              start at a specific position, typing the values is more accurate
              than dragging.
            </li>
            <li>
              <b>Check the Selection value in the Output panel.</b> It updates
              after each drag to confirm your exact crop dimensions before
              saving.
            </li>
            <li>
              <b>Use PNG for further editing.</b> The output is lossless PNG —
              ideal if you plan to edit the image further before final use.
            </li>
          </ul>
        </section>

        <section>
          <h2>Crop and Resize Your Images for Free Right Now</h2>
          <p>
            Whether you're preparing images for a website, resizing product
            photos for an online store, cropping a profile picture, or creating
            a correctly sized thumbnail — our free online image resizer handles
            it all in seconds. No software to install, no account to create, no
            images sent to any server.
          </p>
          <p>
            Scroll back to the top to get started, or bookmark this page for the
            next time you need to resize or crop an image quickly and
            accurately.
          </p>
        </section>
      </div>
    </>
  );
}
