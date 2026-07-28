"use client";
import React, { useState, useRef } from "react";
import ReactCrop, { Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

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

        <section>
          <h2>What Is an Online Image Resizer and Crop Tool?</h2>
          <p>
            An online image resizer and crop tool lets you change the dimensions
            of an image, trim it to a specific area, or prepare it for a
            particular platform — all without installing any software. You
            upload an image, drag a selection box over the area you want to
            keep, set your exact pixel dimensions, and download the result in
            seconds.
          </p>
          <p>
            This kind of tool is used by web designers preparing hero images,
            bloggers resizing photos for posts, social media managers creating
            platform-specific thumbnails, photographers delivering client-ready
            crops, and anyone who's ever tried to upload a photo only to be told
            it's the wrong size. Our resizer handles all of it, directly in your
            browser, without your image ever leaving your device.
          </p>
        </section>

        <section>
          <h2>How to Resize and Crop an Image Online — Step by Step</h2>
          <p>
            Using our tool takes under a minute from upload to download. Here's
            exactly how it works:
          </p>
          <ul className="custom-list">
            <li>
              <b>Step 1:</b> Click "Upload Image" and select your photo.
            </li>
            <li>
              <b>Step 2:</b> Enter your desired Width and Height in the Crop
              Size inputs on the right panel.
            </li>
            <li>
              <b>Step 3:</b> Drag the crop box on the image to select the exact
              area you want to keep.
            </li>
            <li>
              <b>Step 4:</b> Fine-tune the X and Y position inputs if you need
              the crop to start at a specific pixel offset.
            </li>
            <li>
              <b>Step 5:</b> Click "Crop &amp; Save." The image is processed in
              your browser and ready to download as a lossless PNG immediately.
            </li>
          </ul>
          <p>
            No account, no watermark, no file uploaded to any server. The entire
            operation happens locally on your device.
          </p>
        </section>

        <section>
          <h2>How to Crop an Image to Exact Pixel Dimensions</h2>
          <p>
            Most online crop tools let you drag a selection and download
            whatever size that produces. That's fine for casual use, but it
            doesn't give you precise control. Our tool lets you specify the
            exact pixel dimensions you need in the Width and Height fields — the
            crop selection updates to match, and the output file is exactly that
            size.
          </p>
          <p>
            This is particularly useful when you have a strict pixel requirement
            — for example, a product image that must be exactly 800 × 800 pixels
            for an e-commerce platform, or a banner that must be exactly 728 ×
            90 pixels for an ad network. Enter the dimensions, position the crop
            box over the right part of your image, and the output will be
            precisely what you specified.
          </p>
          <p>
            The Selection value in the Output section updates after each
            completed drag, so you can always confirm the exact dimensions of
            your selection before clicking Crop &amp; Save.
          </p>
        </section>

        <section>
          <h2>How to Resize Images for a Website Without Losing Quality</h2>
          <p>
            Oversized images are one of the most common causes of slow websites.
            A photo taken on a modern smartphone or camera is often 4000–6000
            pixels wide and several megabytes in size. If your website only
            displays it at 800 pixels wide, you're making visitors download
            5–10x more data than necessary.
          </p>
          <p>
            Cropping and resizing your images to the actual display size before
            uploading has a direct, measurable impact on your site's loading
            speed:
          </p>
          <ul className="custom-list">
            <li>
              <b>Blog post images:</b> Resize to 1200 px wide. Most blog layouts
              display images at 700–900 px, so 1200 px gives you a sharp result
              on retina screens without excess file size.
            </li>
            <li>
              <b>Hero / banner images:</b> Crop and resize to your exact banner
              dimensions — upload the exact size rather than letting the browser
              scale down a 4 MB photo.
            </li>
            <li>
              <b>Product images:</b> Square crops work best for product grids.
              Set W and H to the same value (e.g. 800 × 800), position the crop
              over your product, and save.
            </li>
            <li>
              <b>Thumbnails:</b> Crop to a consistent aspect ratio first, then
              scale down. Consistent thumbnails look professional in grids and
              lists.
            </li>
          </ul>
          <p>
            After resizing, run your image through an image compressor for
            maximum efficiency. A 1200 px PNG resized from a 4000 px original,
            then compressed to WebP, can be 10–20x smaller than the original
            with no visible quality difference on screen.
          </p>
        </section>

        <section>
          <h2>Cropping vs Resizing — What's the Difference?</h2>

          <h3>Cropping</h3>
          <p>
            Cropping removes portions of an image. You select a rectangular area
            to keep and discard everything outside it. The pixel density of the
            remaining area stays the same as the original. Cropping changes the
            composition and aspect ratio — it's the right tool when you want to
            remove background, reframe a subject, or produce a specific ratio
            like 1:1 for Instagram.
          </p>

          <h3>Resizing</h3>
          <p>
            Resizing scales the entire image to different pixel dimensions. The
            composition stays the same — you're just making the whole thing
            bigger or smaller. It's the right tool when you need an image at a
            specific pixel size for a platform or want to reduce file size.
          </p>

          <h3>Using Both Together</h3>
          <p>
            Most professional workflows use both in sequence: first crop to the
            right composition and aspect ratio, then resize to the target pixel
            dimensions. Our tool handles both steps — drag the crop box to
            select the area, specify exact pixel dimensions in the inputs, and
            the output is produced at precisely those dimensions.
          </p>
        </section>

        <section>
          <h2>How to Resize Images for Social Media</h2>
          <p>
            Every social media platform has its own image size requirements.
            Getting them wrong results in blurry images, awkward automatic
            crops, or black bars. Here are the most common sizes — enter any of
            these directly into the W and H inputs:
          </p>
          <ul className="custom-list">
            <li>
              <b>Instagram Feed Post:</b> 1080 × 1080 px (square), 1080 × 566 px
              (landscape), 1080 × 1350 px (portrait).
            </li>
            <li>
              <b>Instagram Story / Reel:</b> 1080 × 1920 px (9:16 vertical).
            </li>
            <li>
              <b>Facebook Feed Post:</b> 1200 × 630 px. Cover photo: 820 × 312
              px.
            </li>
            <li>
              <b>Twitter / X:</b> 1200 × 675 px in-feed. Profile photo: 400 ×
              400 px.
            </li>
            <li>
              <b>LinkedIn Post:</b> 1200 × 627 px. Profile banner: 1584 × 396
              px.
            </li>
            <li>
              <b>YouTube Thumbnail:</b> 1280 × 720 px (16:9).
            </li>
            <li>
              <b>TikTok:</b> 1080 × 1920 px.
            </li>
            <li>
              <b>Pinterest:</b> 1000 × 1500 px (2:3 ratio).
            </li>
          </ul>
        </section>

        <section>
          <h2>Why Our Resizer Processes Images in the Browser</h2>
          <p>
            Most online image tools upload your file to a remote server, resize
            it there, and send it back. That means your photos travel across the
            internet and pass through infrastructure you don't control.
          </p>
          <p>
            Our tool handles everything locally using the HTML5 Canvas API. When
            you click Crop &amp; Save, the entire operation happens in your
            browser tab — your image never leaves your device. There are no file
            size limits, no daily usage caps, no account requirements, and it
            works even with a slow connection once the page has loaded.
          </p>
        </section>

        <section>
          <h2>Common Image Resizing Use Cases</h2>

          <h3>E-commerce Product Images</h3>
          <p>
            Marketplaces like Amazon, Etsy, and Shopify require product images
            at specific dimensions. Amazon's main image must be at least 1000 ×
            1000 px for zoom functionality, with the product occupying at least
            85% of the frame. Our crop tool lets you precisely frame your
            product and export at exactly the required dimensions.
          </p>

          <h3>Blog Featured Images</h3>
          <p>
            Most CMS themes display featured images at a specific aspect ratio —
            often 16:9, 4:3, or 3:2. If you upload a mismatched ratio, the theme
            crops it automatically and often cuts off important parts.
            Pre-cropping to your theme's exact ratio prevents this.
          </p>

          <h3>Email Marketing Headers</h3>
          <p>
            Email templates typically display headers at a fixed width of 600
            px. Resizing your image to exactly 600 px wide before inserting
            ensures it renders correctly across all email clients — no
            unexpected scaling, no overflow.
          </p>

          <h3>Presentation Slides</h3>
          <p>
            Standard slides are 16:9 — 1920 × 1080 px for HD or 1280 × 720 px
            for standard. Set those dimensions, position the crop over the most
            visually interesting part of your image, and the result fills any
            widescreen slide perfectly without distortion or black bars.
          </p>
        </section>

        <section>
          <h2>Frequently Asked Questions – Free Online Image Resizer</h2>

          <div className="faq-item">
            <h3 onClick={() => toggleFAQ(0)}>
              Is this image resizer free to use?
              <i
                className={`fa-solid fa-chevron-down ${openFAQ === 0 ? "rotate" : ""}`}
              ></i>
            </h3>
            {openFAQ === 0 && (
              <p>
                Yes, completely free. No hidden costs, account requirements,
                daily limits, or watermarks.
              </p>
            )}
          </div>

          <div className="faq-item">
            <h3 onClick={() => toggleFAQ(1)}>
              Is my image uploaded to a server?
              <i
                className={`fa-solid fa-chevron-down ${openFAQ === 1 ? "rotate" : ""}`}
              ></i>
            </h3>
            {openFAQ === 1 && (
              <p>
                No. All processing happens locally in your browser using the
                HTML5 Canvas API. Your image never leaves your device and is
                never sent to any server.
              </p>
            )}
          </div>

          <div className="faq-item">
            <h3 onClick={() => toggleFAQ(2)}>
              Will resizing or cropping reduce my image quality?
              <i
                className={`fa-solid fa-chevron-down ${openFAQ === 2 ? "rotate" : ""}`}
              ></i>
            </h3>
            {openFAQ === 2 && (
              <p>
                Cropping doesn't reduce quality — it just removes parts of the
                image while keeping the remaining pixels exactly as they are.
                The output is saved as PNG, a lossless format, so no compression
                artifacts are introduced.
              </p>
            )}
          </div>

          <div className="faq-item">
            <h3 onClick={() => toggleFAQ(3)}>
              Can I set exact pixel dimensions for the output?
              <i
                className={`fa-solid fa-chevron-down ${openFAQ === 3 ? "rotate" : ""}`}
              ></i>
            </h3>
            {openFAQ === 3 && (
              <p>
                Yes. Use the Width and Height inputs to type in exact pixel
                dimensions. The output file will be precisely that size.
              </p>
            )}
          </div>

          <div className="faq-item">
            <h3 onClick={() => toggleFAQ(4)}>
              What image formats can I upload?
              <i
                className={`fa-solid fa-chevron-down ${openFAQ === 4 ? "rotate" : ""}`}
              ></i>
            </h3>
            {openFAQ === 4 && (
              <p>
                You can upload any format your browser supports — JPG, PNG,
                WebP, GIF, AVIF, and HEIC on compatible browsers. The output is
                always PNG, a lossless high-quality format suitable for further
                editing or uploading.
              </p>
            )}
          </div>

          <div className="faq-item">
            <h3 onClick={() => toggleFAQ(5)}>
              Does this tool work on mobile?
              <i
                className={`fa-solid fa-chevron-down ${openFAQ === 5 ? "rotate" : ""}`}
              ></i>
            </h3>
            {openFAQ === 5 && (
              <p>
                Yes. The tool works on iPhone, iPad, and Android devices. The
                crop interface is touch-responsive — you can drag the crop box
                with your finger. The layout stacks vertically on smaller
                screens.
              </p>
            )}
          </div>

          <div className="faq-item">
            <h3 onClick={() => toggleFAQ(6)}>
              What are the X and Y position inputs for?
              <i
                className={`fa-solid fa-chevron-down ${openFAQ === 6 ? "rotate" : ""}`}
              ></i>
            </h3>
            {openFAQ === 6 && (
              <p>
                X sets how far from the left edge the crop starts. Y sets how
                far from the top. These inputs let you position the crop at a
                precise pixel offset — more accurate than dragging when you need
                the crop to start at a very specific position.
              </p>
            )}
          </div>

          <div className="faq-item">
            <h3 onClick={() => toggleFAQ(7)}>
              What's the difference between cropping and resizing?
              <i
                className={`fa-solid fa-chevron-down ${openFAQ === 7 ? "rotate" : ""}`}
              ></i>
            </h3>
            {openFAQ === 7 && (
              <p>
                Cropping removes portions of an image — you select what to keep
                and discard the rest. Resizing scales the entire image to
                different pixel dimensions without changing the composition. Our
                tool combines both in one pass.
              </p>
            )}
          </div>

          <div className="faq-item">
            <h3 onClick={() => toggleFAQ(8)}>
              Is there a file size limit?
              <i
                className={`fa-solid fa-chevron-down ${openFAQ === 8 ? "rotate" : ""}`}
              ></i>
            </h3>
            {openFAQ === 8 && (
              <p>
                Because everything is processed in your browser, there's no
                externally imposed file size limit. Very large images may take a
                moment longer depending on your device's speed, but the tool
                handles them. Most photos and graphics process in under two
                seconds.
              </p>
            )}
          </div>
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
