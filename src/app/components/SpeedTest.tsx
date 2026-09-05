"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import "@fortawesome/fontawesome-free/css/all.min.css";

type Phase = "idle" | "ping" | "download" | "upload" | "done" | "error";

interface Results {
  ping: number | null;
  jitter: number | null;
  download: number | null;
  upload: number | null;
}

interface IspInfo {
  org?: string;
  city?: string;
  country?: string;
  ip?: string;
}

const PING_SAMPLES = 6;
const DOWNLOAD_DURATION_MS = 8000;
const DOWNLOAD_STREAMS = 4;
const DOWNLOAD_CHUNK_BYTES = 25_000_000;
const UPLOAD_DURATION_MS = 6000;
const UPLOAD_STREAMS = 3;
const UPLOAD_CHUNK_BYTES = 8_000_000;

function fmt(v: number | null, digits = 1) {
  if (v == null || !isFinite(v)) return "--";
  return v < 10 ? v.toFixed(2) : v.toFixed(digits);
}

function downloadTier(mbps: number | null) {
  if (mbps == null) return { label: "", color: "#8a8a8a", use: "" };
  if (mbps < 5)
    return { label: "Basic", color: "#e8825a", use: "Email, browsing, SD video" };
  if (mbps < 25)
    return { label: "Good", color: "#e8b95a", use: "HD streaming, video calls" };
  if (mbps < 100)
    return { label: "Fast", color: "#4fd1b5", use: "4K streaming, multiple devices" };
  return { label: "Ultra-fast", color: "#7ed957", use: "4K on several devices, large downloads" };
}

function uploadTier(mbps: number | null) {
  if (mbps == null) return { label: "", color: "#8a8a8a", use: "" };
  if (mbps < 2)
    return { label: "Basic", color: "#e8825a", use: "Email, photo uploads" };
  if (mbps < 10)
    return { label: "Good", color: "#e8b95a", use: "Video calls, cloud backup" };
  if (mbps < 40)
    return { label: "Fast", color: "#4fd1b5", use: "HD video calls, live streaming" };
  return { label: "Ultra-fast", color: "#7ed957", use: "Large file uploads, 4K streaming out" };
}

function pingTier(ms: number | null) {
  if (ms == null) return { label: "", color: "#8a8a8a" };
  if (ms < 30) return { label: "Excellent", color: "#7ed957" };
  if (ms < 60) return { label: "Good", color: "#4fd1b5" };
  if (ms < 100) return { label: "Fair", color: "#e8b95a" };
  return { label: "High", color: "#e8825a" };
}

function Gauge({
  value,
  max,
  unit,
  color,
  label,
}: {
  value: number;
  max: number;
  unit: string;
  color: string;
  label: string;
}) {
  const r = 92;
  const circumference = 2 * Math.PI * r;
  const frac = Math.min(Math.sqrt(Math.max(value, 0) / max), 1);
  const offset = circumference * (1 - frac);
  return (
    <svg
      viewBox="0 0 220 220"
      style={{ width: "220px", height: "220px", maxWidth: "100%" }}
    >
      <circle
        cx="110"
        cy="110"
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="16"
      />
      <circle
        cx="110"
        cy="110"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="16"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform="rotate(-90 110 110)"
        style={{ transition: "stroke-dashoffset 0.2s linear" }}
      />
      <text
        x="110"
        y="104"
        textAnchor="middle"
        fontSize="40"
        fontWeight="800"
        fill="#ffffff"
      >
        {fmt(value)}
      </text>
      <text
        x="110"
        y="130"
        textAnchor="middle"
        fontSize="14"
        fill="rgba(255,255,255,0.65)"
      >
        {unit}
      </text>
      <text
        x="110"
        y="155"
        textAnchor="middle"
        fontSize="12"
        letterSpacing="2"
        fill={color}
        fontWeight="700"
      >
        {label.toUpperCase()}
      </text>
    </svg>
  );
}

function SideStat({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.15)",
        borderRadius: "12px",
        padding: "8px 16px",
        minWidth: "90px",
      }}
    >
      <div
        style={{
          fontSize: "11px",
          letterSpacing: "1px",
          color: "rgba(255,255,255,0.55)",
          marginBottom: "2px",
        }}
      >
        {label.toUpperCase()}
      </div>
      <div style={{ fontSize: "18px", fontWeight: 700, color: "#ffffff" }}>
        {value}
        <span
          style={{
            fontSize: "12px",
            fontWeight: 500,
            color: "rgba(255,255,255,0.55)",
            marginLeft: "3px",
          }}
        >
          {unit}
        </span>
      </div>
    </div>
  );
}

const FAQ_DATA: [string, string][] = [
  [
    "Is this internet speed test accurate?",
    "It measures your real, current connection using multiple parallel connections to Cloudflare's global network — the same public infrastructure that powers speed.cloudflare.com — so results reflect genuine throughput rather than a simulated number. As with any browser-based speed test, results can be affected by your device, Wi-Fi signal, and how many other devices or apps are using the connection at the same time.",
  ],
  [
    "Why is my speed lower than what I'm paying for?",
    "The most common causes are Wi-Fi signal strength (distance from the router, walls, interference from other networks), other devices or apps using bandwidth in the background, an older router that can't reach your plan's advertised speed, or your ISP measuring speed at the modem while you're testing over Wi-Fi. Testing on a device connected directly to the router by Ethernet cable, with other devices paused, gives the closest result to your plan's true ceiling.",
  ],
  [
    "What's the difference between download and upload speed?",
    "Download speed is how fast data moves from the internet to your device — it's what determines how quickly pages load, videos stream, and files download. Upload speed is how fast data moves from your device to the internet — it matters for video calls, live streaming, cloud backups, and sending large files. Most home internet plans are asymmetric, meaning download speed is much higher than upload speed.",
  ],
  [
    "What is ping and why does it matter?",
    "Ping (or latency) is the round-trip time, in milliseconds, for a small packet of data to travel from your device to a server and back. Lower is better. Ping matters most for anything real-time — online gaming, video calls, and voice chat — where even a fast download connection can feel laggy if ping is high.",
  ],
  [
    "What is jitter?",
    "Jitter measures how much your ping varies between individual measurements. A connection with low, consistent ping is more reliable for real-time uses like gaming and video calls than one with the same average ping but wildly inconsistent spikes.",
  ],
  [
    "How much internet speed do I actually need?",
    "For one person browsing and streaming HD video, 25 Mbps download is comfortable. For a household streaming 4K on multiple devices, working from home on video calls, and gaming simultaneously, 100–300 Mbps gives enough headroom. Upload speeds above 10 Mbps comfortably handle video calls and cloud backups for most households.",
  ],
  [
    "Does this speed test use a lot of data?",
    "Yes — like any real speed test, it transfers actual data rather than estimating. Because the test runs for a fixed time window, the faster your connection the more it moves: the download phase alone uses roughly 1 MB for every 1 Mbps of speed. That's about 30 MB on a 25 Mbps connection, around 120 MB on a 100 Mbps connection, and over 300 MB on a 300 Mbps line. Negligible on home broadband, but worth knowing before you run it on a limited or metered mobile data plan.",
  ],
  [
    "Why do results differ between Wi-Fi and a wired connection?",
    "Wi-Fi speed is affected by signal strength, distance from the router, wall and floor interference, and competing wireless networks nearby — none of which apply to a direct Ethernet cable connection. A wired test shows what your ISP is actually delivering to your home; a Wi-Fi test shows what's actually reaching your device, which is what you experience day to day.",
  ],
  [
    "Can I check which ISP or broadband provider I'm using?",
    "Yes — this tool detects and displays your internet service provider's name alongside your results, using the same public IP geolocation data as our IP Detector tool. This is useful for confirming you're connected through your expected ISP and not, for example, an active VPN or a neighbor's hotspot.",
  ],
  [
    "Can I run this test on mobile data?",
    "Yes, this works over 4G, 5G, or any mobile connection, in addition to Wi-Fi. Just be aware it will use a meaningful chunk of your data allowance, since the test measures real throughput rather than estimating it.",
  ],
];

export default function SpeedTest() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [results, setResults] = useState<Results>({
    ping: null,
    jitter: null,
    download: null,
    upload: null,
  });
  const [liveMbps, setLiveMbps] = useState(0);
  const [isp, setIsp] = useState<IspInfo>({});
  const [errorMsg, setErrorMsg] = useState("");
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [goHover, setGoHover] = useState(false);
  const runIdRef = useRef(0);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const fetchIsp = async () => {
    try {
      const res = await fetch("https://get.geojs.io/v1/ip/geo.json");
      const json = await res.json();
      const result = Array.isArray(json) ? json[0] : json;
      if (!result) return;
      setIsp({
        org:
          result.organization_name && result.organization_name !== "Unknown"
            ? result.organization_name
            : undefined,
        city: result.city || undefined,
        country: result.country || undefined,
        ip: result.ip || undefined,
      });
    } catch {
      /* ISP lookup is a nice-to-have, not test-critical */
    }
  };

  const measurePing = async (): Promise<{ ping: number; jitter: number }> => {
    const samples: number[] = [];
    for (let i = 0; i < PING_SAMPLES; i++) {
      const start = performance.now();
      await fetch(
        `https://speed.cloudflare.com/__down?bytes=0&i=${i}-${Date.now()}`,
        { cache: "no-store" },
      );
      samples.push(performance.now() - start);
    }
    const usable = samples.slice(1);
    const avg = usable.reduce((a, b) => a + b, 0) / usable.length;
    const diffs = usable.slice(1).map((v, i) => Math.abs(v - usable[i]));
    const jitter = diffs.length
      ? diffs.reduce((a, b) => a + b, 0) / diffs.length
      : 0;
    return { ping: avg, jitter };
  };

  const measureDownload = async (
    onTick: (mbps: number) => void,
  ): Promise<number> => {
    const controller = new AbortController();
    const totalBytes = { n: 0 };
    const start = performance.now();

    const runStream = async (streamIndex: number) => {
      while (performance.now() - start < DOWNLOAD_DURATION_MS) {
        let res: Response;
        try {
          res = await fetch(
            `https://speed.cloudflare.com/__down?bytes=${DOWNLOAD_CHUNK_BYTES}&s=${streamIndex}-${Date.now()}`,
            { cache: "no-store", signal: controller.signal },
          );
        } catch {
          if (controller.signal.aborted) return;
          throw new Error("Download test couldn't connect.");
        }
        const reader = res.body!.getReader();
        while (true) {
          let chunk: ReadableStreamReadResult<Uint8Array>;
          try {
            chunk = await reader.read();
          } catch {
            return;
          }
          if (chunk.done) break;
          totalBytes.n += chunk.value.length;
          const elapsed = (performance.now() - start) / 1000;
          if (elapsed > 0.15) onTick((totalBytes.n * 8) / elapsed / 1_000_000);
          if (performance.now() - start >= DOWNLOAD_DURATION_MS) {
            controller.abort();
            return;
          }
        }
      }
    };

    await Promise.all(
      Array.from({ length: DOWNLOAD_STREAMS }, (_, i) => runStream(i)),
    );
    const totalElapsed = (performance.now() - start) / 1000;

    if (totalBytes.n === 0) throw new Error("No data was received.");
    return (totalBytes.n * 8) / totalElapsed / 1_000_000;
  };

  const measureUpload = async (
    onTick: (mbps: number) => void,
  ): Promise<number> => {
    const start = performance.now();
    const totalBytes = { n: 0 };
    let stopped = false;
    const activeXhrs: XMLHttpRequest[] = [];

    const timer = setTimeout(() => {
      stopped = true;
      activeXhrs.forEach((x) => {
        try {
          x.abort();
        } catch {
          /* noop */
        }
      });
    }, UPLOAD_DURATION_MS);

    const runStream = () =>
      new Promise<void>((resolve) => {
        const data = new Uint8Array(UPLOAD_CHUNK_BYTES);
        const doUpload = () => {
          if (stopped) {
            resolve();
            return;
          }
          const xhr = new XMLHttpRequest();
          activeXhrs.push(xhr);
          let lastLoaded = 0;
          xhr.open("POST", "https://speed.cloudflare.com/__up");
          xhr.upload.onprogress = (e) => {
            totalBytes.n += e.loaded - lastLoaded;
            lastLoaded = e.loaded;
            const elapsed = (performance.now() - start) / 1000;
            if (elapsed > 0.15)
              onTick((totalBytes.n * 8) / elapsed / 1_000_000);
          };
          xhr.onload = () => {
            if (stopped) resolve();
            else doUpload();
          };
          xhr.onerror = () => resolve();
          xhr.onabort = () => resolve();
          xhr.send(data);
        };
        doUpload();
      });

    await Promise.all(Array.from({ length: UPLOAD_STREAMS }, () => runStream()));
    clearTimeout(timer);
    const totalElapsed = (performance.now() - start) / 1000;
    if (totalBytes.n === 0) throw new Error("No data was sent.");
    return (totalBytes.n * 8) / totalElapsed / 1_000_000;
  };

  const runTest = async () => {
    const myRunId = ++runIdRef.current;
    setResults({ ping: null, jitter: null, download: null, upload: null });
    setErrorMsg("");
    setLiveMbps(0);
    fetchIsp();
    try {
      setPhase("ping");
      const { ping, jitter } = await measurePing();
      if (runIdRef.current !== myRunId) return;
      setResults((r) => ({ ...r, ping, jitter }));

      setPhase("download");
      setLiveMbps(0);
      const download = await measureDownload((mbps) => {
        if (runIdRef.current === myRunId) setLiveMbps(mbps);
      });
      if (runIdRef.current !== myRunId) return;
      setResults((r) => ({ ...r, download }));

      setPhase("upload");
      setLiveMbps(0);
      const upload = await measureUpload((mbps) => {
        if (runIdRef.current === myRunId) setLiveMbps(mbps);
      });
      if (runIdRef.current !== myRunId) return;
      setResults((r) => ({ ...r, upload }));

      setPhase("done");
    } catch (e: unknown) {
      if (runIdRef.current !== myRunId) return;
      const message = e instanceof Error ? e.message : undefined;
      console.error("Speed test failed:", message || e);
      setErrorMsg(
        message ||
          "The test couldn't complete. Check your connection and try again.",
      );
      setPhase("error");
    }
  };

  const dlTier = downloadTier(results.download);
  const ulTier = uploadTier(results.upload);
  const pgTier = pingTier(results.ping);

  const gaugeColor = phase === "upload" ? "#1F9FB8" : "#d8a13a";
  const gaugeMax = phase === "upload" ? 200 : 500;

  const goBtnBaseStyle: React.CSSProperties = {
    width: "180px",
    height: "180px",
    borderRadius: "50%",
    border: "5px solid #d8a13a",
    background: goHover ? "rgba(216,161,58,0.18)" : "rgba(216,161,58,0.08)",
    color: "#ffffff",
    fontSize: "28px",
    fontWeight: 800,
    letterSpacing: "3px",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    transform: goHover ? "scale(1.04)" : "scale(1)",
    transition: "transform 0.15s ease, background 0.15s ease",
    fontFamily: "inherit",
  };

  return (
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
      <div>
        <h1>Internet Speed Test – Check Your WiFi Download, Upload &amp; Ping</h1>
        <p>
          Run a real, live speed test straight from your browser — no app to
          install, no email required. This tool measures your actual download
          speed, upload speed, ping, and jitter using multiple parallel
          connections to Cloudflare&apos;s global network, the same public
          infrastructure behind speed.cloudflare.com, so the numbers reflect
          your real connection rather than an estimate.
        </p>

        <div className="calc-card">
          <div style={{ textAlign: "center" }}>
            {(phase === "download" || phase === "upload") &&
              (results.ping != null || results.download != null) && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "12px",
                    flexWrap: "wrap",
                    marginBottom: "20px",
                  }}
                >
                  {results.ping != null && (
                    <SideStat label="Ping" value={fmt(results.ping, 0)} unit="ms" />
                  )}
                  {results.jitter != null && (
                    <SideStat
                      label="Jitter"
                      value={fmt(results.jitter, 0)}
                      unit="ms"
                    />
                  )}
                  {phase === "upload" && results.download != null && (
                    <SideStat
                      label="Download"
                      value={fmt(results.download)}
                      unit="Mbps"
                    />
                  )}
                </div>
              )}

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "16px",
              }}
            >
              {phase === "idle" && (
                <button
                  type="button"
                  onClick={runTest}
                  onMouseEnter={() => setGoHover(true)}
                  onMouseLeave={() => setGoHover(false)}
                  style={goBtnBaseStyle}
                  aria-label="Start speed test"
                >
                  GO
                </button>
              )}

              {phase === "ping" && (
                <div style={{ ...goBtnBaseStyle, cursor: "default" }}>
                  <i
                    className="fa-solid fa-spinner fa-spin"
                    style={{ fontSize: "34px" }}
                  ></i>
                </div>
              )}

              {(phase === "download" || phase === "upload") && (
                <Gauge
                  value={liveMbps}
                  max={gaugeMax}
                  unit="Mbps"
                  color={gaugeColor}
                  label={phase === "download" ? "Download" : "Upload"}
                />
              )}

              {phase === "error" && (
                <button
                  type="button"
                  onClick={runTest}
                  onMouseEnter={() => setGoHover(true)}
                  onMouseLeave={() => setGoHover(false)}
                  style={goBtnBaseStyle}
                  aria-label="Retry speed test"
                >
                  <i className="fa-solid fa-rotate-right"></i>
                </button>
              )}
            </div>

            {phase === "idle" && (
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px" }}>
                Press GO to measure your ping, download, and upload speed.
              </p>
            )}

            {phase === "ping" && (
              <p style={{ color: "rgba(255,255,255,0.75)" }}>
                Measuring ping and jitter…
              </p>
            )}

            {phase === "error" && (
              <div className="empty-hint" style={{ marginTop: "16px" }}>
                <i className="fa-solid fa-triangle-exclamation"></i>{" "}
                {errorMsg}
              </div>
            )}

            {phase === "done" && (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "56px",
                    flexWrap: "wrap",
                    marginBottom: "22px",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "13px",
                        letterSpacing: "2px",
                        color: "rgba(255,255,255,0.55)",
                        marginBottom: "4px",
                      }}
                    >
                      <i className="fa-solid fa-arrow-down"></i> DOWNLOAD
                    </div>
                    <div
                      style={{
                        fontSize: "52px",
                        fontWeight: 800,
                        color: "#ffffff",
                        lineHeight: 1.1,
                      }}
                    >
                      {fmt(results.download)}
                      <span
                        style={{
                          fontSize: "20px",
                          fontWeight: 600,
                          marginLeft: "6px",
                          color: "rgba(255,255,255,0.55)",
                        }}
                      >
                        Mbps
                      </span>
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "13px",
                        letterSpacing: "2px",
                        color: "rgba(255,255,255,0.55)",
                        marginBottom: "4px",
                      }}
                    >
                      <i className="fa-solid fa-arrow-up"></i> UPLOAD
                    </div>
                    <div
                      style={{
                        fontSize: "52px",
                        fontWeight: 800,
                        color: "#ffffff",
                        lineHeight: 1.1,
                      }}
                    >
                      {fmt(results.upload)}
                      <span
                        style={{
                          fontSize: "20px",
                          fontWeight: 600,
                          marginLeft: "6px",
                          color: "rgba(255,255,255,0.55)",
                        }}
                      >
                        Mbps
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "12px",
                    flexWrap: "wrap",
                    marginBottom: "22px",
                  }}
                >
                  <SideStat label="Ping" value={fmt(results.ping, 0)} unit="ms" />
                  <SideStat
                    label="Jitter"
                    value={fmt(results.jitter, 0)}
                    unit="ms"
                  />
                </div>

                <button
                  type="button"
                  className="calc-button"
                  onClick={runTest}
                >
                  <i
                    className="fa-solid fa-rotate-right"
                    style={{ marginRight: "8px" }}
                  ></i>
                  Test Again
                </button>
              </>
            )}

            {(isp.org || isp.city) && (
              <p
                style={{
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.55)",
                  marginTop: "16px",
                  marginBottom: 0,
                }}
              >
                <i className="fa-solid fa-signal"></i>{" "}
                {isp.org ? <strong style={{ color: "#ffffff" }}>{isp.org}</strong> : ""}
                {isp.city ? ` · ${isp.city}${isp.country ? `, ${isp.country}` : ""}` : ""}
                {isp.ip ? ` · IP ${isp.ip}` : ""}
              </p>
            )}
          </div>

          {phase === "done" && (
            <div className="calc-result" style={{ marginTop: "24px" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: "16px",
                }}
              >
                <div>
                  <strong style={{ color: dlTier.color }}>
                    {dlTier.label} download
                  </strong>
                  <p style={{ margin: "4px 0 0", fontSize: "13px" }}>
                    {dlTier.use}
                  </p>
                </div>
                <div>
                  <strong style={{ color: ulTier.color }}>
                    {ulTier.label} upload
                  </strong>
                  <p style={{ margin: "4px 0 0", fontSize: "13px" }}>
                    {ulTier.use}
                  </p>
                </div>
                <div>
                  <strong style={{ color: pgTier.color }}>
                    {pgTier.label} latency
                  </strong>
                  <p style={{ margin: "4px 0 0", fontSize: "13px" }}>
                    {results.ping != null && results.ping < 60
                      ? "Smooth for gaming and video calls"
                      : "May feel laggy for real-time gaming or calls"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        <p
          style={{
            fontSize: "12px",
            color: "#8a8a8a",
            marginTop: "10px",
            marginBottom: "30px",
          }}
        >
          <i className="fa-solid fa-circle-info"></i> This test transfers real
          data to measure your connection — roughly 1&nbsp;MB for every
          1&nbsp;Mbps of your download speed, so a faster line uses more. Worth
          noting on a metered mobile plan. Nothing about your results is stored
          or tracked.
        </p>

        {/* ---- SEO CONTENT ---- */}

        <h2>What Do Download, Upload, Ping, and Jitter Actually Mean?</h2>
        <p>
          A speed test measures four separate things about your connection,
          and each one affects a different part of what you do online:
        </p>
        <ul className="custom-list">
          <li>
            <strong>Download speed (Mbps)</strong> — how fast data travels
            from the internet to your device. This is what determines how
            quickly web pages load, videos buffer, and files download.
          </li>
          <li>
            <strong>Upload speed (Mbps)</strong> — how fast data travels from
            your device to the internet. This governs video call quality,
            live streaming, and how long it takes to back up photos or send
            large files.
          </li>
          <li>
            <strong>Ping / latency (ms)</strong> — the round-trip time for a
            small packet to reach a server and come back. Lower is better.
            Ping has little effect on download speed but a huge effect on how
            responsive gaming, video calls, and voice chat feel.
          </li>
          <li>
            <strong>Jitter (ms)</strong> — how much your ping varies from one
            moment to the next. A connection with consistent, low jitter
            feels smoother in real time than one with the same average ping
            but frequent spikes.
          </li>
        </ul>

        <h2>How Much Internet Speed Do You Actually Need?</h2>
        <p>
          Advertised plan speeds are a ceiling, not a guarantee — what matters
          is whether your connection comfortably handles what you actually do
          online. Here&apos;s a realistic guide:
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
                  Use Case
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Recommended Download
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Recommended Upload
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Email, browsing, social media", "5–10 Mbps", "1–2 Mbps"],
                ["HD video streaming (1 device)", "10–25 Mbps", "2–3 Mbps"],
                ["4K video streaming (1 device)", "25–35 Mbps", "3–5 Mbps"],
                ["Video calls / remote work", "10–25 Mbps", "5–10 Mbps"],
                ["Online gaming", "15–25 Mbps", "3–5 Mbps"],
                [
                  "Household with 4+ devices, streaming + calls + gaming",
                  "100–300 Mbps",
                  "10–20 Mbps",
                ],
                [
                  "Large file uploads / content creation",
                  "100+ Mbps",
                  "20–50+ Mbps",
                ],
              ].map(([use, dl, ul], i) => (
                <tr key={i}>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {use}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {dl}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {ul}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>Why Is My Speed Test Result Lower Than What I&apos;m Paying For?</h2>
        <p>
          It&apos;s normal for a real-world test to come in below your plan&apos;s
          advertised number — that figure is usually the maximum the line can
          deliver under ideal conditions, not a guarantee. The most common
          reasons for a gap:
        </p>
        <ul className="custom-list">
          <li>
            <strong>Wi-Fi signal strength</strong> — distance from the router,
            walls, floors, and interference from neighboring networks all
            reduce the speed that actually reaches your device, even if the
            connection coming into your home is full speed.
          </li>
          <li>
            <strong>Other devices sharing the connection</strong> — background
            downloads, cloud backups, streaming on another TV, or a
            housemate&apos;s video call all compete for the same bandwidth.
          </li>
          <li>
            <strong>An older or underpowered router</strong> — some routers
            physically cap out below what your internet plan provides,
            especially on plans above 300–500 Mbps.
          </li>
          <li>
            <strong>Testing over Wi-Fi vs. wired</strong> — a wired Ethernet
            connection to your router almost always tests faster and more
            consistently than Wi-Fi.
          </li>
          <li>
            <strong>Peak-hour congestion</strong> — speeds can dip in the
            evening when everyone in your area is online at once, particularly
            on cable and fixed-wireless connections that share local capacity.
          </li>
          <li>
            <strong>VPNs</strong> — routing traffic through a VPN adds
            distance and encryption overhead, which typically lowers both
            speed and increases ping.
          </li>
        </ul>

        <h2>Getting the Most Accurate Result</h2>
        <ul className="custom-list">
          <li>
            <strong>Step 1:</strong> Close other apps and browser tabs that
            might be streaming, downloading, or syncing in the background.
          </li>
          <li>
            <strong>Step 2:</strong> If possible, connect the device you&apos;re
            testing on directly to your router with an Ethernet cable to see
            your connection&apos;s true ceiling.
          </li>
          <li>
            <strong>Step 3:</strong> Pause any other devices on the network —
            smart TVs, game consoles, other phones — during the test.
          </li>
          <li>
            <strong>Step 4:</strong> Run the test two or three times at
            different points in the day. A single result is a snapshot; a
            few results give you a realistic average.
          </li>
          <li>
            <strong>Step 5:</strong> If you&apos;re troubleshooting a Wi-Fi dead
            zone, test in the specific room where the problem happens, not
            just next to the router.
          </li>
        </ul>

        <h2>How This Speed Test Works</h2>
        <p>
          When you press GO, the test runs in three stages entirely inside
          your browser:
        </p>
        <ul className="custom-list">
          <li>
            <strong>Ping &amp; jitter</strong> — six small round-trip requests
            measure how long a packet takes to reach the nearest server and
            come back. The first is discarded because it includes one-off
            connection setup, and the rest are averaged for ping, with the
            variation between them reported as jitter.
          </li>
          <li>
            <strong>Download</strong> — four parallel connections stream real
            data for an eight-second window, and your speed is the total bytes
            received divided by elapsed time. Multiple parallel connections are
            used because a single connection often can&apos;t saturate a fast
            line on its own — the same approach professional speed test tools
            take.
          </li>
          <li>
            <strong>Upload</strong> — three parallel connections send real data
            from your device for a six-second window, measured the same way in
            reverse.
          </li>
        </ul>
        <p>
          Your internet service provider and approximate location are looked
          up separately, using the same public IP geolocation data behind our{" "}
          <Link href="/ip-detector/" className="my-link">
            IP Detector
          </Link>{" "}
          tool. Nothing is estimated or simulated — every number comes from
          actual data transferred between your browser and the server during
          the test. No account, installation, or personal information is
          required, and results are not stored or logged.
        </p>

        <h2>Speed Test Questions</h2>

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

      </div>
    </div>
  );
}
