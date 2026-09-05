import { Metadata } from "next";
import SpeedTest from "../components/SpeedTest";

export const metadata: Metadata = {
  title: "Internet Speed Test — Download, Upload, Ping",
  description:
    "Free internet speed test — check your real WiFi download speed, upload speed, ping, and jitter in seconds. No app, no sign-up, no data stored.",
  alternates: {
    canonical: "/internet-speed-test/",
  },
  openGraph: {
    title: "Internet Speed Test — Download, Upload, Ping",
    description:
      "Measure your real download speed, upload speed, ping, and jitter using multiple parallel connections — the same approach professional speed test tools use.",
    url: "/internet-speed-test/",
    type: "article",
  },
  twitter: {
    title: "Internet Speed Test",
    description:
      "Check your real WiFi download, upload, ping, and jitter — free, instant, no sign-up.",
  },
};

export default function Page() {
  return <SpeedTest />;
}
