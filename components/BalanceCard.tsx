import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import type { User } from "firebase/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const currencies = [
  { code: "IDR", symbol: "Rp" },
  { code: "USD", symbol: "$" },
  { code: "SGD", symbol: "S$" },
  { code: "AUD", symbol: "A$" },
];

const API_KEY = "61eae3d0d51842aba3f89742b0fbc2cc";
const MAIN_CURRENCY = "USD";

export function BalanceCard({ user }: { user: User | null }) {
  const [showBalance, setShowBalance] = useState(true);
  const [userBalance, setUserBalance] = useState(0); // USD
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [exchangeRates, setExchangeRates] = useState<{ [k: string]: number }>({});
  const [loading, setLoading] = useState(true);

  // Listen user balance from Firestore (USD)
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    const docRef = doc(db, "users", user.uid);

    const unsubscribe = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setUserBalance(data.balance || 0);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Fetch rates with base USD, to all supported currencies
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const symbols = currencies.map((c) => c.code).join(",");
        const res = await fetch(
          `https://api.currencyfreaks.com/latest?apikey=${API_KEY}&symbols=${symbols}`
        );
        const data = await res.json();
        console.log("RAW API RESPONSE", data);
        const rates: { [k: string]: number } = {};
        for (const k in data.rates) {
          rates[k.toUpperCase()] = Number(data.rates[k]);
        }
        setExchangeRates(rates);
        console.log("Rates fetched:", rates);
      } catch {
        setExchangeRates({});
      }
    };
    fetchRates();
  }, []);

  // Calculate converted balance (always from USD as base)
  const rateValue =
    selectedCurrency === MAIN_CURRENCY
      ? 1
      : exchangeRates[selectedCurrency] ?? 1;

  const convertedBalance = showBalance
    ? Math.round(userBalance * rateValue).toLocaleString("id-ID")
    : "*******";

  const selectedSymbol =
    currencies.find((c) => c.code === selectedCurrency)?.symbol || "$";

  // --------- DEBUG LOG -----------
  console.log(
    "exchangeRates:", exchangeRates,
    "| selectedCurrency:", selectedCurrency,
    "| userBalance:", userBalance,
    "| rateValue:", rateValue,
    "| convertedBalance:", convertedBalance
  );
  // -------------------------------

  if (loading) {
    return (
      <div className="max-w-[450px] w-full bg-white/80 rounded-2xl shadow-2xl font-sans p-6 flex flex-col justify-between h-full">
        <div className="text-blue-900 text-lg font-semibold text-center py-10">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[450px] w-full bg-white/80 rounded-2xl shadow-2xl font-sans p-6 flex flex-col justify-between h-full">
      <div className="flex flex-col gap-5">
        <div className="text-blue-900 text-xl font-semibold">
          Hello, {user?.displayName || user?.email}!
        </div>
        <div className="text-4xl text-blue-900 font-bold mb-2">
          Total Balance
        </div>
        <div className="flex items-center mt-[-10px] w-full gap-2">
          {/* Currency Symbol Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="text-3xl font-bold px-3 min-w-[48px]"
                aria-label="Pilih Mata Uang"
              >
                {selectedSymbol}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuRadioGroup
                value={selectedCurrency}
                onValueChange={(val) => {
                  setSelectedCurrency(val);
                  console.log("Dropdown changed to:", val);
                }}
              >
                {currencies.map((c) => (
                  <DropdownMenuRadioItem
                    key={c.code}
                    value={c.code}
                    className="text-xl"
                  >
                    {c.symbol}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* Nominal */}
          <span
            className="
              block w-full whitespace-nowrap overflow-hidden text-ellipsis
              text-[clamp(1.25rem,7vw,2.6rem)] font-bold text-blue-900 text-right
            "
            title={showBalance ? convertedBalance : "*******"}
          >
            {convertedBalance}
          </span>
          {/* Eye Icon */}
          <button
            onClick={() => setShowBalance(!showBalance)}
            className="ml-4 p-2 rounded-full hover:bg-blue-100 transition"
            title={showBalance ? "Sembunyikan Saldo" : "Tampilkan Saldo"}
            type="button"
          >
            <FontAwesomeIcon
              icon={showBalance ? faEye : faEyeSlash}
              className="text-2xl"
            />
          </button>
        </div>
      </div>
    </div>
  );
}
