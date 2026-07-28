import { Metadata } from "next";
import ImageConverter from "../components/ImageConverter";

export const metadata: Metadata = {
  title: "Free Image Converter | JPG to PNG, WebP, GIF Online",
  description:
    "Convert images online instantly at Numbers On Your Tip. Free JPG to PNG, PNG to WebP, WebP to JPG, GIF, TIFF & more. High-quality, fast, secure image converter tool.",
  metadataBase: new URL("https://numbersonyourtip.com"),
  alternates: {
    canonical: "https://numbersonyourtip.com/image-converter/",
  },
};

export default function Page() {
  return <ImageConverter />;
}
