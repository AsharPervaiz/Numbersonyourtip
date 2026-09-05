import { Metadata } from "next";
import ImageResizer from "../components/ImageResizer";

export const metadata: Metadata = {
  title: "Image Resizer — Change Dimensions",
  description:
    "Resize images by pixel dimensions with the aspect ratio locked, and understand why DPI changes nothing on screen and enlarging cannot add detail.",
  alternates: {
    canonical: "/image-resizer/",
  },
  openGraph: {
    title: "Image Resizer — Change Dimensions",
    description:
      "Pixels, file size and display size are three different numbers. Here is which one you actually need.",
    url: "/image-resizer/",
    type: "article",
  },
  twitter: {
    title: "Image Resizer — Change Dimensions",
    description:
      "Resize images in your browser, with the sizes that different uses actually need.",
  },
};

export default function Page() {
  return <ImageResizer />;
}
