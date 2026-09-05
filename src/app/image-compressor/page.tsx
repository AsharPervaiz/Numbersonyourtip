import { Metadata } from "next";
import ImageCompressor from "../components/ImageCompressor";

export const metadata: Metadata = {
  title: "Image Compressor — Reduce File Size",
  description:
    "Compress images in your browser and see what compression actually discards, which quality settings are worth using, and when resizing is the better tool.",
  alternates: {
    canonical: "/image-compressor/",
  },
  openGraph: {
    title: "Image Compressor — Reduce File Size",
    description:
      "Quality settings have sharply diminishing returns. Resize before you compress.",
    url: "/image-compressor/",
    type: "article",
  },
  twitter: {
    title: "Image Compressor — Reduce File Size",
    description:
      "Reduce image file size locally, with honest guidance on quality settings.",
  },
};

export default function Page() {
  return <ImageCompressor />;
}
