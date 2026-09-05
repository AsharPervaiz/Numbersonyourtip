import { Metadata } from "next";
import ImageConverter from "../components/ImageConverter";

export const metadata: Metadata = {
  title: "Image Converter — JPG, PNG, WebP, GIF",
  description:
    "Convert images between JPG, PNG, WebP and GIF in your browser, and choose the format that suits the image rather than the one you always use.",
  alternates: {
    canonical: "/image-converter/",
  },
  openGraph: {
    title: "Image Converter — JPG, PNG, WebP, GIF",
    description:
      "Choosing a format is choosing what to lose. Lossy versus lossless, transparency, and stacking conversions.",
    url: "/image-converter/",
    type: "article",
  },
  twitter: {
    title: "Image Converter — JPG, PNG, WebP, GIF",
    description:
      "Convert between JPG, PNG, WebP and GIF locally — nothing is uploaded.",
  },
};

export default function Page() {
  return <ImageConverter />;
}
