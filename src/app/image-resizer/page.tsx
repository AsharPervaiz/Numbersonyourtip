import { Metadata } from "next";
import ImageResizer from "../components/ImageResizer";

export const metadata: Metadata = {
  title: "Image Resizer Online Free – Resize Images Without Losing Quality",
  description:
    "Resize images online for free. Change image dimensions, reduce file size, and optimize photos without losing quality. Fast and easy image resizer tool.",
  metadataBase: new URL("https://numbersonyourtip.com"),
  alternates: {
    canonical: "https://numbersonyourtip.com/image-resizer/",
  },
};

export default function Page() {
  return <ImageResizer />;
}
