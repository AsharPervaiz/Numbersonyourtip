import { Metadata } from "next";
import ColorPicker from "../components/ColorPicker";

export const metadata: Metadata = {
  title: "Colour Picker & Palette Generator",
  description:
    "Pick colours and generate palettes in HEX, RGB and HSL, with contrast ratios that decide readability rather than leaving it to taste.",
  alternates: {
    canonical: "/color-picker/",
  },
  openGraph: {
    title: "Colour Picker & Palette Generator",
    description:
      "Three notations for the same colour, why HSL is the one for designing, and measurable contrast.",
    url: "/color-picker/",
    type: "article",
  },
  twitter: {
    title: "Colour Picker & Palette Generator",
    description:
      "HEX, RGB and HSL values, palette harmonies and contrast checking.",
  },
};

export default function Page() {
  return <ColorPicker />;
}
