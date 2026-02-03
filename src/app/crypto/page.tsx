"use client";
import { useEffect, useRef } from "react";

export default function CryptoWidgetPage() {
  const screenerRef = useRef<HTMLDivElement>(null);
  const marketQuotesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // ===== Widget 1: Crypto Screener =====
    const screenerScript = document.createElement("script");
    screenerScript.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-screener.js";
    screenerScript.async = true;
    screenerScript.innerHTML = JSON.stringify({
      defaultColumn: "overview",
      screener_type: "crypto_mkt",
      displayCurrency: "USD",
      colorTheme: "light",
      isTransparent: true,
      locale: "en",
      width: "100%",
      height: 550,
    });

    screenerRef.current?.appendChild(screenerScript);

    // ===== Widget 2: Market Quotes =====
    const marketScript = document.createElement("script");
    marketScript.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js";
    marketScript.async = true;
    marketScript.innerHTML = JSON.stringify({
      title: "Cryptocurrencies",
      width: "100%",
      height: "600",
      locale: "en",
      showSymbolLogo: true,
      symbolsGroups: [
        {
          name: "Overview",
          symbols: [
            { name: "CRYPTOCAP:TOTAL" },
            { name: "BITSTAMP:BTCUSD" },
            { name: "BITSTAMP:ETHUSD" },
            { name: "COINBASE:SOLUSD" },
            { name: "BINANCE:AVAXUSD" },
            { name: "COINBASE:UNIUSD" },
          ],
        },
        {
          name: "Bitcoin",
          symbols: [
            { name: "BITSTAMP:BTCUSD" },
            { name: "COINBASE:BTCEUR" },
            { name: "COINBASE:BTCGBP" },
            { name: "BITFLYER:BTCJPY" },
          ],
        },
        {
          name: "Ethereum",
          symbols: [
            { name: "BITSTAMP:ETHUSD" },
            { name: "KRAKEN:ETHEUR" },
            { name: "COINBASE:ETHGBP" },
            { name: "BITFLYER:ETHJPY" },
            { name: "BINANCE:ETHUSDT" },
          ],
        },
      ],
      colorTheme: "light",
    });

    marketQuotesRef.current?.appendChild(marketScript);
  }, []);

  return (
    <div style={{ display: "grid", gap: "24px" }}>
      {/* ===== First Widget ===== */}
      <div className="calc-card">
        <h2 className="calc-title">Crypto Market Screener</h2>
        <div ref={screenerRef} />
      </div>

      {/* ===== Second Widget ===== */}
      <div className="calc-card">
        <h2 className="calc-title">Crypto Market Summary</h2>
        <div ref={marketQuotesRef} />
      </div>
    </div>
  );
}
