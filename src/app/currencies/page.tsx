"use client";
import { useEffect, useRef } from "react";

export default function ForexWidgetPage() {
  const forexWidgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      title: "Currencies",
      title_link: "/markets/currencies/rates-major/",
      width: "100%",
      height: "600",
      locale: "en",
      showSymbolLogo: true,
      symbolsGroups: [
        {
          name: "Major",
          symbols: [
            { name: "FX_IDC:EURUSD", displayName: "EUR to USD" },
            { name: "FX_IDC:USDJPY", displayName: "USD to JPY" },
            { name: "FX_IDC:GBPUSD", displayName: "GBP to USD" },
            { name: "FX_IDC:AUDUSD", displayName: "AUD to USD" },
            { name: "FX_IDC:USDCAD", displayName: "USD to CAD" },
            { name: "FX_IDC:USDCHF", displayName: "USD to CHF" },
          ],
        },
        {
          name: "Minor",
          symbols: [
            { name: "FX_IDC:EURGBP", displayName: "EUR to GBP" },
            { name: "FX_IDC:EURJPY", displayName: "EUR to JPY" },
            { name: "FX_IDC:GBPJPY", displayName: "GBP to JPY" },
            { name: "FX_IDC:CADJPY", displayName: "CAD to JPY" },
            { name: "FX_IDC:GBPCAD", displayName: "GBP to CAD" },
            { name: "FX_IDC:EURCAD", displayName: "EUR to CAD" },
          ],
        },
        {
          name: "Exotic",
          symbols: [
            { name: "FX_IDC:USDSEK", displayName: "USD to SEK" },
            { name: "FX_IDC:USDMXN", displayName: "USD to MXN" },
            { name: "FX_IDC:USDZAR", displayName: "USD to ZAR" },
            { name: "FX_IDC:EURTRY", displayName: "EUR to TRY" },
            { name: "FX_IDC:EURNOK", displayName: "EUR to NOK" },
            { name: "FX_IDC:GBPPLN", displayName: "GBP to PLN" },
          ],
        },
      ],
      colorTheme: "light",
    });

    forexWidgetRef.current?.appendChild(script);
  }, []);

  return (
    <div className="calc-card">
      <h1 className="calc-title">Forex Currencies Market</h1>
      <div ref={forexWidgetRef} />
    </div>
  );
}
