"use client";

import * as React from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeftRight } from "lucide-react";

const currencies = [
  { code: "USD", name: "USD", flag: "/images/region/united-states.png", symbol: "$" },
  { code: "AUD", name: "AUD", flag: "/images/region/australia.png", symbol: "A$" },
  { code: "IDR", name: "IDR", flag: "/images/region/indonesia.png", symbol: "Rp" },
  { code: "SGD", name: "SGD", flag: "/images/region/singapore.png", symbol: "S$" },
];

const API_KEY = "61eae3d0d51842aba3f89742b0fbc2cc";

export function CalculatorCard() {
  const [fromCurrency, setFromCurrency] = React.useState(currencies[0]);
  const [toCurrency, setToCurrency] = React.useState(currencies[2]);
  const [fromAmount, setFromAmount] = React.useState("1000");
  const [toAmount, setToAmount] = React.useState("");
  const [rates, setRates] = React.useState<{ [k: string]: number }>({});
  const [loading, setLoading] = React.useState(true);

  // Fetch rates (sekali di awal)
  React.useEffect(() => {
    async function fetchRates() {
      try {
        const symbols = currencies.map((c) => c.code).join(",");
        const res = await fetch(
          `https://api.currencyfreaks.com/latest?apikey=${API_KEY}&symbols=${symbols}`
        );
        const data = await res.json();
        const rates: { [k: string]: number } = {};
        for (const k in data.rates) {
          rates[k.toUpperCase()] = Number(data.rates[k]);
        }
        rates["USD"] = 1; // fallback
        setRates(rates);
        setLoading(false);
      } catch {
        setRates({});
        setLoading(false);
      }
    }
    fetchRates();
  }, []);

  // Konversi function
  function convert(value: string, from: string, to: string, formatted = false) {
    if (!value || isNaN(Number(value.replace(/,/g, "")))) return "";
    if (!rates[from] || !rates[to]) return "";
    const amount = Number(value.replace(/,/g, ""));
    let usd;
    if (from === "USD") {
      usd = amount;
    } else {
      usd = amount / rates[from];
    }
    let target;
    if (to === "USD") {
      target = usd;
    } else {
      target = usd * rates[to];
    }
    return formatted
      ? target.toLocaleString("id-ID", { maximumFractionDigits: 2 })
      : String(Number(target.toFixed(2)));
  }


  React.useEffect(() => {
    setToAmount(convert(fromAmount, fromCurrency.code, toCurrency.code));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromAmount, fromCurrency, toCurrency]);

  // **NEW: Otomatis update toAmount saat rates selesai didapat**
  React.useEffect(() => {
    if (
      rates &&
      Object.keys(rates).length > 0 &&
      fromAmount &&
      fromCurrency.code &&
      toCurrency.code
    ) {
      setToAmount(convert(fromAmount, fromCurrency.code, toCurrency.code));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rates]);

  function handleSwap() {
    // Swap currency, always reset nominal ke 1000
    const newFrom = toCurrency;
    const newTo = fromCurrency;
    setFromCurrency(newFrom);
    setToCurrency(newTo);
    setFromAmount("1000");
    setToAmount(convert("1000", newFrom.code, newTo.code));
  }

  function handleClear() {
    setFromAmount("");
    setToAmount("");
  }


  function handleSelectFrom(code: string) {
    const found = currencies.find((c) => c.code === code);
    if (found) {
      setFromCurrency(found);
      setFromAmount("1000");
      setToAmount(convert("1000", found.code, toCurrency.code));
    }
  }
  function handleSelectTo(code: string) {
    const found = currencies.find((c) => c.code === code);
    if (found) {
      setToCurrency(found);
      setToAmount(convert(fromAmount, fromCurrency.code, found.code));
    }
  }

  // Untuk display di kanan atas (selalu 1000, tidak tergantung fromAmount user)
  const display1000 = convert("1000", fromCurrency.code, toCurrency.code);

  return (
    <Card className="w-full max-w-2xl bg-white/80 rounded-2xl shadow-lg px-4 py-5">
      <CardHeader className="flex flex-row justify-between items-center pb-2">
        <CardTitle className="text-blue-900 text-lg font-bold">Calculator</CardTitle>
        <div className="text-right">
          <div className="text-sm font-bold text-blue-900">
            {fromCurrency.symbol} 1,000 {fromCurrency.name}
            <span className="mx-1">=</span>
            {toCurrency.symbol} {display1000 || "0"} {toCurrency.name}
          </div>
          <div className="text-[11px] text-blue-900 italic">
            {loading
              ? "Loading rate..."
              : `Kurs realtime per ${new Date().toLocaleTimeString()}`}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 pt-1">
        <div className="flex items-center gap-3">
          {/* FROM */}
          <div className="flex-1 bg-white rounded-lg flex items-center px-3 h-12 shadow-sm">
            <select
              className="mr-2 bg-transparent text-blue-900 font-bold border-0 outline-none"
              value={fromCurrency.code}
              onChange={e => handleSelectFrom(e.target.value)}
            >
              {currencies.map((c) => (
                <option key={c.code} value={c.code}>{c.name}</option>
              ))}
            </select>
            <Image
              src={fromCurrency.flag}
              alt={fromCurrency.code}
              width={28}
              height={28}
              className="rounded-full border object-cover"
            />
            <Input
              type="number"
              inputMode="numeric"
              placeholder="Amount"
              className="border-0 bg-transparent outline-none focus:ring-0 placeholder:text-blue-900/50 text-blue-900 font-semibold text-lg flex-1 px-1"
              value={fromAmount}
              onChange={e => setFromAmount(e.target.value)}
            />
          </div>

          {/* Swap */}
          <Button
            type="button"
            variant="ghost"
            className="bg-[#295B82] hover:bg-[#244f70] rounded-full p-2 shadow text-white mx-1"
            onClick={handleSwap}
            aria-label="Swap currency"
          >
            <ArrowLeftRight className="w-6 h-6" />
          </Button>

          {/* TO */}
          <div className="flex-1 bg-white rounded-lg flex items-center px-3 h-12 shadow-sm">
            <select
              className="mr-2 bg-transparent text-blue-900 font-bold border-0 outline-none"
              value={toCurrency.code}
              onChange={e => handleSelectTo(e.target.value)}
            >
              {currencies.map((c) => (
                <option key={c.code} value={c.code}>{c.name}</option>
              ))}
            </select>
            <Image
              src={toCurrency.flag}
              alt={toCurrency.code}
              width={28}
              height={28}
              className="rounded-full border object-cover"
            />
            <Input
              type="number"
              inputMode="numeric"
              placeholder="Amount"
              className="border-0 bg-transparent outline-none focus:ring-0 placeholder:text-blue-900/50 text-blue-900 font-semibold text-lg flex-1 px-1"
              value={toAmount}
              readOnly
              tabIndex={-1}
              style={{ background: "inherit", cursor: "not-allowed" }}
            />
          </div>
        </div>
        {/* Clear Button */}
        <div className="flex justify-end mt-2">
          <Button
            type="button"
            className="rounded-full px-6 py-1 bg-[#295B82] text-white font-bold hover:bg-blue-900 shadow"
            onClick={handleClear}
          >
            Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
