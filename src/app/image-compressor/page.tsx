import { Metadata } from "next";
import ImageCompressor from "../components/ImageCompressor";

export const metadata: Metadata = {
  title:
    "Free Image Compressor | Reduce Image Size Online Without Losing Quality",
  description:
    "Compress images online for free at Numbers On Your Tip. Reduce JPG/JPEG, PNG and WebP file size without losing quality. Fast, secure, browser-based image compressor with instant download.",
  metadataBase: new URL("https://numbersonyourtip.com"),
  alternates: {
    canonical: "https://numbersonyourtip.com/image-compressor/",
  },
};

export default function Page() {
  return <ImageCompressor />;
}
