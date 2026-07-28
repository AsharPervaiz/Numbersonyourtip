import { Metadata } from "next";
import TimezoneTool from "../components/TimeZone";

export const metadata: Metadata = {
  title:
    "Free Time Zone Converter & World Clock | Convert EST, PST, IST, PKT & 80+ Cities",
  description:
    "Free time zone converter with DST support — convert PKT to EST, IST to PST, GMT to IST, and 80+ cities instantly. Live world clock with analog clocks, 12/24h toggle, and abbreviation reference.",
  metadataBase: new URL("https://numbersonyourtip.com"),
  alternates: {
    canonical: "https://numbersonyourtip.com/time-zone-converter/",
  },
};

export default function Page() {
  return <TimezoneTool />;
}
