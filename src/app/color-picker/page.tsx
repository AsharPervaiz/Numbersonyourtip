import { Metadata } from "next";
import ColorPickerTool from "../components/ColorPicker";

export const metadata: Metadata = {
  title:
    "Free Color Picker & Palette Generator | HEX, RGB, HSL, CMYK Codes Online",
  description:
    "Free color code picker online with HEX, RGB, HSL, CMYK, LAB, and XYZ conversion. Generate harmonious palettes, check contrast, find complementary colors, and export CSS.",
  metadataBase: new URL("https://numbersonyourtip.com"),
  alternates: {
    canonical: "https://numbersonyourtip.com/color-picker/",
  },
};

export default function Page() {
  return <ColorPickerTool />;
}
