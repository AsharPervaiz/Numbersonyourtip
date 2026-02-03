"use client";
import { useState, useEffect } from "react";

type Currency = {
  code: string;
  name: string;
};

export default function CurrencyConverter() {
  const [amount, setAmount] = useState("1");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("PKR");
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [rate, setRate] = useState<number | null>(null);

  /* Fetch all currencies */
  useEffect(() => {
    const fetchCurrencies = async () => {
      const res = await fetch(
        `https://v6.exchangerate-api.com/v6/${process.env.NEXT_PUBLIC_EXCHANGE_API_KEY}/codes`
      );
      const data = await res.json();
      setCurrencies(
        data.supported_codes.map((c: [string, string]) => ({
          code: c[0],
          name: c[1],
        }))
      );
    };
    fetchCurrencies();
  }, []);

  /* Fetch rate when from/to changes */
  useEffect(() => {
    const fetchRate = async () => {
      const res = await fetch(
        `https://v6.exchangerate-api.com/v6/${process.env.NEXT_PUBLIC_EXCHANGE_API_KEY}/pair/${from}/${to}`
      );
      const data = await res.json();
      setRate(data.conversion_rate);
    };
    fetchRate();
  }, [from, to]);

  const convertedAmount =
    amount && rate ? (Number(amount) * rate).toFixed(2) : "";

return (
  <div className="calc-card">
    <h2 className="calc-title">Currency Converter</h2>

    {/* FROM ROW */}
    <div style={{ display: "flex", gap: "10px", marginBottom: "14px" }}>
      {/* Amount (small width) */}
      <input
        className="calc-input"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{ flex: "1" }}
      />

      {/* Currency (wide) */}
      <select
        className="calc-input"
        value={from}
        onChange={(e) => setFrom(e.target.value)}
        style={{ flex: "2.5" }}
      >
        {currencies.map((c) => (
          <option key={c.code} value={c.code}>
            {c.name} ({c.code})
          </option>
        ))}
      </select>
    </div>

    {/* TO ROW */}
    <div style={{ display: "flex", gap: "10px" }}>
      {/* Converted amount (small width) */}
      <input
        className="calc-input"
        type="text"
        value={convertedAmount}
        readOnly
        style={{ flex: "1" }}
      />

      {/* Currency (wide) */}
      <select
        className="calc-input"
        value={to}
        onChange={(e) => setTo(e.target.value)}
        style={{ flex: "2.5" }}
      >
        {currencies.map((c) => (
          <option key={c.code} value={c.code}>
            {c.name} ({c.code})
          </option>
        ))}
      </select>
    </div>

    {rate && (
      <div className="calc-result">
        1 {from} ≈ {rate.toFixed(4)} {to}
      </div>
    )}
  </div>
);

}
