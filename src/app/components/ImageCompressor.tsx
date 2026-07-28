"use client";
import React, { useEffect, useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import UPNG from "upng-js";

type CompressedItem = {
  url: string;
  before: number;
  after: number;
  name: string;
  ext: string;
};

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

        <section>
          <h2>What Is an Image Compressor?</h2>
          <p>
            An image compressor is a tool that reduces the file size of a photo
            or graphic while keeping it looking as good as the original. When
            you compress an image, the tool removes unnecessary data, optimizes
            how the pixels are stored, or applies smarter encoding — all without
            making the image look noticeably different to the human eye.
          </p>
          <p>
            People compress images every day for all kinds of reasons: speeding
            up a slow website, shrinking a photo before sending it by email,
            reducing storage use on a phone, or meeting file size limits on an
            upload form. Our free online image compressor handles all of these
            use cases in seconds, entirely inside your browser — nothing is sent
            to any server.
          </p>
        </section>

        <section>
          <h2>Supported Image Formats</h2>
          <p>
            Our compressor works with all the major image formats used today:
          </p>
          <ul className="custom-list">
            <li>
              <b>JPG / JPEG</b> – The most common photo format. Compresses very
              well with minimal visible quality loss.
            </li>
            <li>
              <b>PNG</b> – Supports transparency. Compressed using lossless
              techniques to maintain pixel-perfect quality.
            </li>
            <li>
              <b>WebP</b> – Google's modern format. Already efficient, but still
              compressible with smart quality tuning.
            </li>
            <li>
              <b>AVIF</b> – Next-generation format with excellent compression.
              Browser support is growing rapidly.
            </li>
            <li>
              <b>GIF</b> – Supported for basic compression while preserving the
              same format.
            </li>
            <li>
              <b>BMP</b> – Uncompressed by default; our tool significantly
              reduces BMP file sizes.
            </li>
            <li>
              <b>SVG</b> – Vector format supported in browser-compatible
              environments.
            </li>
            <li>
              <b>TIFF / TIF</b> – High-quality format used in print and
              photography workflows.
            </li>
            <li>
              <b>ICO</b> – Icon format used for browser tabs and desktop
              shortcuts.
            </li>
            <li>
              <b>HEIC / HEIF</b> – Apple's default iPhone photo format,
              supported where the browser allows.
            </li>
          </ul>
        </section>

        <section>
          <h2>Why Should You Compress Images?</h2>
          <p>
            Image files are often the single largest contributor to slow
            websites, full storage drives, and failed email attachments.
            Compressing your images solves all of these problems at once — and
            in most cases, the visual difference between a compressed image and
            the original is so small that nobody would notice unless they zoomed
            in and compared them side by side.
          </p>

          <h3>✔ Faster Website Loading Speed</h3>
          <p>
            Page speed is one of the most important factors in both user
            experience and Google search rankings. Studies consistently show
            that users abandon pages that take more than 3 seconds to load.
            Images are almost always the biggest contributor to slow load times.
            Compressing your images before uploading them to your website is one
            of the highest-impact, lowest-effort optimizations you can make. A 2
            MB image compressed to 400 KB loads five times faster — and that
            adds up across dozens of images on a page.
          </p>

          <h3>✔ Improve Your Google PageSpeed Score</h3>
          <p>
            Google's PageSpeed Insights tool explicitly flags oversized images
            as a performance issue and suggests compressing them. Images that
            are too large directly drag down your Core Web Vitals scores —
            particularly Largest Contentful Paint (LCP), which measures how
            quickly the main content of a page loads. Compressing images is one
            of the first things SEO professionals and web developers do when
            optimizing a site.
          </p>

          <h3>✔ Reduce Storage Space on Any Device</h3>
          <p>
            Whether you're running low on storage on your iPhone, cleaning up a
            Google Drive folder, or managing thousands of product images in an
            online store — smaller image files mean you can store more of them
            in the same space. Compressing a folder of 500 product photos from
            an average of 3 MB each down to 500 KB each saves over 1 GB of
            storage instantly.
          </p>

          <h3>✔ Send Images by Email Without Hitting File Limits</h3>
          <p>
            Most email providers have attachment size limits somewhere between
            10 MB and 25 MB. A batch of photos from a modern camera or iPhone
            can easily exceed that limit before you've even selected five
            images. Compressing your photos before attaching them solves this
            instantly — and the person receiving them sees essentially the same
            image, just at a fraction of the file size.
          </p>

          <h3>✔ Faster Uploading to Social Media</h3>
          <p>
            Instagram, Facebook, LinkedIn, and X all re-compress images after
            you upload them anyway. If you upload a large, uncompressed image,
            you're wasting upload time and giving the platform's compression
            algorithm more work to do — often with worse results than if you'd
            compressed it yourself first. Pre-compressing your images before
            uploading gives you more control over the final quality.
          </p>

          <h3>✔ Lower Bandwidth Costs for Website Owners</h3>
          <p>
            If you pay for web hosting based on bandwidth usage, serving large
            uncompressed images to thousands of visitors per day adds up fast.
            Compressing images is one of the most effective ways to reduce
            bandwidth consumption and keep hosting costs under control,
            especially for image-heavy sites like photography portfolios,
            e-commerce stores, and blogs.
          </p>
        </section>

        <section>
          <h2>How to Compress an Image Online — Step by Step</h2>
          <p>
            Compressing an image with our free tool takes under 30 seconds from
            start to download. Here's how it works:
          </p>
          <ul className="custom-list">
            <li>
              <b>Step 1:</b> Click "Upload Images" or drag and drop your image
              files into the upload box. You can compress up to 3 images at
              once.
            </li>
            <li>
              <b>Step 2:</b> Once your files are uploaded, the Compress and
              Clear buttons will appear.
            </li>
            <li>
              <b>Step 3:</b> Click the "Compress" button. The compression runs
              locally in your browser — your images are never sent to any
              server.
            </li>
            <li>
              <b>Step 4:</b> When compression is complete, you'll see each image
              with its before and after file size. Click Download to save the
              compressed version.
            </li>
          </ul>
          <p>
            The whole thing is free, requires no account, leaves no watermark,
            and works on any device — phone, tablet, or desktop.
          </p>
        </section>

        <section>
          <h2>How to Compress JPG Images Without Losing Quality</h2>
          <p>
            JPG is the most popular image format in the world, and it's also the
            one where smart compression makes the biggest difference. A typical
            DSLR camera photo saved as JPG might be 5–10 MB straight off the
            camera. Most of that data is invisible to the human eye — it's
            ultra-fine detail in shadows, gradients, and textures that gets
            thrown away in the compression process without any perceptible
            visual change.
          </p>
          <p>
            Our compressor applies quality-based lossy compression to JPG files,
            testing multiple quality levels (starting at 0.82 and stepping down
            through 0.76, 0.70, 0.64, and 0.58) until it finds a good balance of
            size and quality. For most real-world photos, the compressed version
            looks identical to the original when viewed at normal size on a
            screen.
          </p>
          <p>
            If you're compressing product photos for an online store, event
            photos for a blog, or any image that's going to be viewed at screen
            resolution rather than printed, our JPG compressor will typically
            reduce your file size by 40–70% with no visible quality loss.
          </p>
        </section>

        <section>
          <h2>How to Compress PNG Images Online for Free</h2>
          <p>
            PNG compression works differently from JPG compression because PNG
            is a lossless format — every pixel is stored exactly as-is, with no
            quality degradation. This makes PNG files larger than JPGs, but it
            also means PNG is the right format for logos, icons, screenshots,
            and any image that needs to be pixel-perfect.
          </p>
          <p>
            Our PNG compressor uses the UPNG library to apply intelligent color
            quantization. Instead of storing full 24-bit or 32-bit color data
            for every pixel, it reduces the color palette to 256 colors — which
            is more than enough for most graphics, logos, and illustrations —
            while preserving the PNG format and any transparency in the original
            image.
          </p>
          <p>
            This approach can reduce PNG file sizes by 40–60% without any
            visible quality change for most non-photographic images. If you have
            a large PNG photograph (not a logo or graphic), you'd get better
            compression results by converting it to JPG or WebP instead.
          </p>
        </section>

        <section>
          <h2>How to Reduce Image File Size for a Website</h2>
          <p>
            If you're trying to speed up a website, image optimization should be
            your first stop. Here's a practical guide to reducing image file
            sizes specifically for web use:
          </p>
          <ul className="custom-list">
            <li>
              <b>Compress every image before uploading.</b> Never upload an
              uncompressed image to a website. Always run it through a
              compressor first. A 3 MB PNG compressed to 400 KB loads 7.5x
              faster.
            </li>
            <li>
              <b>Use the right format for each image type.</b> Photos should be
              JPG or WebP. Graphics and logos with transparency should be PNG or
              WebP. Icons should be SVG where possible.
            </li>
            <li>
              <b>Don't upload images larger than they'll display.</b> If an
              image will display at 800 pixels wide on your site, there's no
              need to upload a 4000-pixel-wide image. Resize it first, then
              compress it.
            </li>
            <li>
              <b>Check your PageSpeed score after compressing.</b> Use Google's
              free PageSpeed Insights tool to see how much your images affect
              your load times and scores.
            </li>
            <li>
              <b>Batch compress multiple images at once.</b> Our tool lets you
              compress up to 3 images per batch, which is useful when you're
              updating multiple images on a page.
            </li>
          </ul>
        </section>

        <section>
          <h2>Lossless vs Lossy Image Compression — What's the Difference?</h2>
          <p>
            When you compress an image, there are two fundamentally different
            approaches, and understanding them helps you choose the right one
            for your use case.
          </p>

          <h3>Lossless Compression</h3>
          <p>
            Lossless compression reduces file size without throwing away any
            image data. The compressed file can be decompressed back to the
            exact original, pixel for pixel. This is how PNG compression works —
            the file is smaller than an uncompressed bitmap, but contains
            exactly the same visual information. Lossless compression is ideal
            for logos, icons, screenshots, and any image where exact pixel
            accuracy matters. The trade-off is that lossless compression doesn't
            achieve as dramatic file size reductions as lossy compression for
            photographic content.
          </p>

          <h3>Lossy Compression</h3>
          <p>
            Lossy compression achieves much smaller file sizes by permanently
            removing some image data — specifically, the data that the human
            visual system is least likely to notice. JPG, WebP, and AVIF all use
            lossy compression. A high-quality lossy-compressed JPG at 0.82
            quality looks essentially identical to the original at normal
            viewing sizes but might be 60% smaller. Lossy compression is the
            right choice for photos, product images, blog images, and any
            photographic content where you don't need pixel-perfect accuracy.
          </p>

          <h3>Smart Compression</h3>
          <p>
            Our tool uses smart compression — it automatically selects the right
            approach for each format. PNG files get lossless-style color
            quantization. JPG, WebP, and AVIF files get quality-based lossy
            compression that starts at high quality and only goes lower if
            needed. You don't need to choose settings — the tool handles it
            automatically and only saves the compressed version if it's actually
            smaller than the original.
          </p>
        </section>

        <section>
          <h2>Why Our Compressor Processes Images in the Browser</h2>
          <p>
            Most image compression tools work by sending your files to a remote
            server, processing them there, and sending them back. That means
            your images pass through someone else's infrastructure — and
            depending on the tool, they may be stored there temporarily or even
            permanently.
          </p>
          <p>
            Our compressor works entirely differently. All compression happens
            locally in your browser using JavaScript and the HTML5 Canvas API.
            Your images are never sent to any server, never stored anywhere, and
            are never seen by anyone but you. This has several practical
            advantages:
          </p>
          <ul className="custom-list">
            <li>
              <b>Complete privacy.</b> Personal photos, business images, ID
              scans — whatever you compress stays on your device.
            </li>
            <li>
              <b>No file size limits.</b> Server-based tools often cap uploads
              at 5 MB or 10 MB. Since we process locally, the only limit is your
              browser's memory.
            </li>
            <li>
              <b>No daily limits.</b> Many free tools limit you to a certain
              number of compressions per day. Ours doesn't — compress as many as
              you need.
            </li>
            <li>
              <b>Works offline.</b> Once the page is loaded, the compression
              itself doesn't require an active internet connection.
            </li>
            <li>
              <b>Faster results.</b> No waiting for upload and download round
              trips to a remote server.
            </li>
          </ul>
        </section>

        <section>
          <h2>How Much Can You Reduce Image File Size?</h2>
          <p>
            The amount of compression you can achieve depends on the original
            format, the content of the image, and the target format. Here are
            realistic expectations for common scenarios:
          </p>
          <ul className="custom-list">
            <li>
              <b>JPG photos from a camera or phone:</b> Typically 40–70% file
              size reduction with no perceptible quality loss. A 5 MB photo
              often compresses to 1–2 MB.
            </li>
            <li>
              <b>PNG graphics and logos:</b> Typically 30–60% reduction using
              color quantization. A 500 KB PNG logo often compresses to 150–250
              KB.
            </li>
            <li>
              <b>PNG screenshots:</b> Typically 20–50% reduction. Screenshots
              with text and solid colors compress well while staying sharp.
            </li>
            <li>
              <b>WebP images:</b> WebP is already an efficient format, so gains
              are smaller — typically 15–35% reduction.
            </li>
            <li>
              <b>BMP files:</b> BMP is completely uncompressed by default, so
              these see the biggest gains — often 80–90% size reduction when
              converted to compressed formats.
            </li>
            <li>
              <b>AVIF images:</b> AVIF is already very efficient. Gains are
              typically 10–25%.
            </li>
          </ul>
          <p>
            Our tool never saves a compressed version that's actually larger
            than the original. If the compressed output would be bigger than the
            source file (which can happen with already-optimized images), we
            return the original file so you're never worse off than when you
            started.
          </p>
        </section>

        <section>
          <h2>Image Compression for E-commerce Stores</h2>
          <p>
            If you run an online store — whether on Shopify, WooCommerce, Etsy,
            or any other platform — image optimization is one of the most
            impactful things you can do for your business. Here's why:
          </p>
          <p>
            Product pages with slow-loading images have significantly higher
            bounce rates. Shoppers who wait more than 2–3 seconds for a page to
            load are much more likely to leave and buy from a competitor. Google
            also uses page speed as a ranking factor in search results, so slow
            product pages rank lower and get less organic traffic.
          </p>
          <p>
            A typical product listing might have 5–8 photos. If each photo is 3
            MB uncompressed, that's 15–24 MB of images on a single product page
            — which is far too heavy for a good shopping experience. Compressing
            those photos to 300–500 KB each brings the total to 1.5–4 MB, which
            loads much faster without any visible difference in product quality.
          </p>
          <p>
            Use our compressor to batch process up to 3 product images at a time
            before uploading them to your store. It takes a few seconds per
            batch and makes a real, measurable difference in your store's
            performance.
          </p>
        </section>

        <section>
          <h2>Image Compression for WordPress and Blogs</h2>
          <p>
            WordPress is the most popular website platform in the world, and
            images are almost always the biggest performance problem on
            WordPress sites. Blog posts with multiple images, comparison tables
            with screenshots, and galleries with high-res photos can bring page
            load times to a crawl if the images aren't compressed.
          </p>
          <p>
            While WordPress plugins like ShortPixel, Smush, and Imagify can
            automate compression after upload, many bloggers and site owners
            prefer to compress images manually before uploading so they have
            full control over the quality. Our tool is perfect for this workflow
            — compress your post's images before uploading, and they'll load
            fast from day one without relying on a plugin.
          </p>
          <p>
            For blog feature images (the large header images at the top of
            posts), we generally recommend compressing to under 200 KB for a
            good balance of quality and speed. For inline images within a post,
            under 100 KB is ideal where possible.
          </p>
        </section>

        <section>
          <h2>Common Questions About Image Compression</h2>

          <div className="faq-item">
            <h3 onClick={() => toggleFAQ(0)}>
              Is this image compressor completely free?
              <i
                className={`fa-solid fa-chevron-down ${openFAQ === 0 ? "rotate" : ""}`}
              ></i>
            </h3>
            {openFAQ === 0 && (
              <p>
                Yes, 100% free with no hidden costs, daily limits, or premium
                tiers. You can compress as many images as you want without
                creating an account or paying anything. The full tool is
                available to everyone at no cost.
              </p>
            )}
          </div>

          <div className="faq-item">
            <h3 onClick={() => toggleFAQ(1)}>
              Will compressing my images reduce the visual quality?
              <i
                className={`fa-solid fa-chevron-down ${openFAQ === 1 ? "rotate" : ""}`}
              ></i>
            </h3>
            {openFAQ === 1 && (
              <p>
                For most images, the quality difference between the compressed
                and original version is invisible when viewed at normal screen
                sizes. JPG and WebP files use quality-based compression starting
                at 0.82 quality, which preserves the vast majority of visual
                detail. PNG files use lossless color quantization, which keeps
                quality extremely high. We also only save the compressed file if
                it's actually smaller than the original — if not, you get the
                original back.
              </p>
            )}
          </div>

          <div className="faq-item">
            <h3 onClick={() => toggleFAQ(2)}>
              Are my images uploaded to your server?
              <i
                className={`fa-solid fa-chevron-down ${openFAQ === 2 ? "rotate" : ""}`}
              ></i>
            </h3>
            {openFAQ === 2 && (
              <p>
                No — nothing is ever uploaded to any server. All compression
                happens locally in your browser using JavaScript. Your images
                stay entirely on your device, which means complete privacy and
                no risk of your files being stored or accessed by anyone else.
              </p>
            )}
          </div>

          <div className="faq-item">
            <h3 onClick={() => toggleFAQ(3)}>
              Can I compress multiple images at once?
              <i
                className={`fa-solid fa-chevron-down ${openFAQ === 3 ? "rotate" : ""}`}
              ></i>
            </h3>
            {openFAQ === 3 && (
              <p>
                Yes — you can upload and compress up to 3 images per batch. Drag
                and drop multiple files or select multiple files when clicking
                the upload button. Each image is compressed individually and
                available for separate download.
              </p>
            )}
          </div>

          <div className="faq-item">
            <h3 onClick={() => toggleFAQ(4)}>
              Does the compressed image keep the same format?
              <i
                className={`fa-solid fa-chevron-down ${openFAQ === 4 ? "rotate" : ""}`}
              ></i>
            </h3>
            {openFAQ === 4 && (
              <p>
                Yes. Our compressor keeps the same file format after
                compression. JPG files stay JPG, PNG files stay PNG, WebP files
                stay WebP, and so on. You won't need to worry about format
                changes breaking anything — the downloaded file is the same
                format as what you uploaded, just smaller.
              </p>
            )}
          </div>

          <div className="faq-item">
            <h3 onClick={() => toggleFAQ(5)}>
              Does this tool work on mobile phones?
              <i
                className={`fa-solid fa-chevron-down ${openFAQ === 5 ? "rotate" : ""}`}
              ></i>
            </h3>
            {openFAQ === 5 && (
              <p>
                Yes, the compressor is fully mobile-friendly. It works on
                iPhone, iPad, Android phones and tablets, as well as Mac,
                Windows, and Linux desktops. All you need is a modern browser —
                Chrome, Safari, Firefox, or Edge.
              </p>
            )}
          </div>

          <div className="faq-item">
            <h3 onClick={() => toggleFAQ(6)}>
              How much can this tool reduce my image file size?
              <i
                className={`fa-solid fa-chevron-down ${openFAQ === 6 ? "rotate" : ""}`}
              ></i>
            </h3>
            {openFAQ === 6 && (
              <p>
                It depends on the format and content of your image. JPG photos
                typically see 40–70% file size reduction. PNG graphics typically
                see 30–60% reduction. BMP files (which are uncompressed by
                default) often see 80–90% reduction. WebP and AVIF files are
                already efficient, so gains are smaller — typically 15–35%.
              </p>
            )}
          </div>

          <div className="faq-item">
            <h3 onClick={() => toggleFAQ(7)}>
              Is there a file size limit for images I can compress?
              <i
                className={`fa-solid fa-chevron-down ${openFAQ === 7 ? "rotate" : ""}`}
              ></i>
            </h3>
            {openFAQ === 7 && (
              <p>
                Because compression happens in your browser rather than on a
                server, there's no externally enforced file size limit. Very
                large images (30 MB+) may take a few seconds longer depending on
                your device's processing power, but the tool will handle them.
                Typical photos and graphics — even high-resolution ones —
                compress in under two seconds.
              </p>
            )}
          </div>

          <div className="faq-item">
            <h3 onClick={() => toggleFAQ(8)}>
              Can I compress PNG images without losing transparency?
              <i
                className={`fa-solid fa-chevron-down ${openFAQ === 8 ? "rotate" : ""}`}
              ></i>
            </h3>
            {openFAQ === 8 && (
              <p>
                Yes. Our PNG compressor uses UPNG, which preserves the alpha
                channel (transparency) when compressing PNG files. Your logos,
                icons, and any images with transparent backgrounds will keep
                their transparency after compression — no white background will
                be added.
              </p>
            )}
          </div>

          <div className="faq-item">
            <h3 onClick={() => toggleFAQ(9)}>
              How does compressing images help with SEO?
              <i
                className={`fa-solid fa-chevron-down ${openFAQ === 9 ? "rotate" : ""}`}
              ></i>
            </h3>
            {openFAQ === 9 && (
              <p>
                Page loading speed is a confirmed Google ranking factor. Large,
                uncompressed images are the most common cause of slow page load
                times. Compressing your images reduces the amount of data the
                browser has to download before it can display your page, which
                directly improves metrics like Largest Contentful Paint (LCP) —
                one of Google's Core Web Vitals. Faster pages rank higher, have
                lower bounce rates, and provide a better experience for users.
              </p>
            )}
          </div>

          <div className="faq-item">
            <h3 onClick={() => toggleFAQ(10)}>
              What's the difference between compressing and converting an image?
              <i
                className={`fa-solid fa-chevron-down ${openFAQ === 10 ? "rotate" : ""}`}
              ></i>
            </h3>
            {openFAQ === 10 && (
              <p>
                Compressing reduces the file size of an image while keeping the
                same format. Converting changes the image from one format to
                another (for example, PNG to WebP or HEIC to JPG). Our Image
                Compressor tool handles compression while keeping the original
                format. If you need to change formats, our separate Image
                Converter tool handles that.
              </p>
            )}
          </div>
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
