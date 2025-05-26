'use client';

import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { db } from "@/lib/firebaseConfig";
import { doc, getDoc, setDoc, collection, addDoc } from "firebase/firestore";
import type { User } from "firebase/auth";

const currencies = [
  {
    code: "IDR",
    symbol: "Rp",
    label: "IDR",
    flag: "/images/region/indonesia.png",
  },
  {
    code: "USD",
    symbol: "$",
    label: "USD",
    flag: "/images/region/united-states.png",
  },
  {
    code: "SGD",
    symbol: "S$",
    label: "SGD",
    flag: "/images/region/singapore.png",
  },
  {
    code: "AUD",
    symbol: "A$",
    label: "AUD",
    flag: "/images/region/australia.png",
  },
];
interface Transaction {
  type: string;
  amount: number;
  currency: string;
  countryFlag: string;
  desc?: string;
  date: Date | string;
}
interface AddBalanceCardProps {
  user: User | null;
  onTransaction?: (tx: Transaction) => void;
}

export function AddBalanceCard({ user, onTransaction }: AddBalanceCardProps) {
  const [amount, setAmount] = React.useState("");
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [type, setType] = React.useState("income");
  const [desc, setDesc] = React.useState("");
  const [currency, setCurrency] = React.useState(currencies[0]);
  const [loading, setLoading] = React.useState(false);

  // Ganti ke mata uang utama (USD)
  const MAIN_CURRENCY = "USD";
  const API_KEY = "61eae3d0d51842aba3f89742b0fbc2cc";

  // Reset setelah submit
  const resetForm = () => {
    setAmount("");
    setDesc("");
    setDate(new Date());
    setType("income");
    setCurrency(currencies[0]);
  };

  // HANDLE SUBMIT
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return alert("User not found!");
    setLoading(true);

    try {
      // Ambil data user sebelumnya
      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);

      let currentBalance = 0;
      if (snap.exists()) {
        currentBalance = snap.data().balance || 0;
      }

      const nominal = Number(amount);
      let convertedNominal = nominal;

      // Konversi ke USD jika input bukan USD
      if (currency.code !== MAIN_CURRENCY) {
        const res = await fetch(
          `https://api.currencyfreaks.com/latest?apikey=${API_KEY}&symbols=${MAIN_CURRENCY},${currency.code}`
        );
        const data = await res.json();
        const fromRate = Number(data.rates[currency.code]);
        const toRate = Number(data.rates[MAIN_CURRENCY]);

        if (fromRate && toRate) {
          convertedNominal = nominal * (toRate / fromRate);
        }
      }

      let newBalance = currentBalance;
      if (type === "income") newBalance += convertedNominal;
      else newBalance -= convertedNominal;

      await setDoc(userRef, {
        balance: newBalance,
        currency: MAIN_CURRENCY,
        lastUpdate: date || new Date(),
        lastDesc: desc,
      }, { merge: true });

      // Tambahkan transaksi ke Firestore
      await addDoc(collection(db, "transactions"), {
        userId: user.uid,
        type,
        amount: nominal,
        currency: currency.code,
        countryFlag: currency.flag,
        desc,
        date: (date || new Date()).toISOString(),
        createdAt: new Date().toISOString(),
      });

      // FE callback jika ada
      if (onTransaction) {
        onTransaction({
          type,
          amount: nominal,
          currency: currency.code,
          countryFlag: currency.flag,
          desc,
          date: date || new Date(),
        });
      }


      alert("Balance updated!");
      resetForm();
    } catch (err: unknown) {
      let msg = "Gagal update balance";
      if (typeof err === "object" && err !== null && "message" in err) {
        msg = (err as { message?: string }).message || msg;
      }
      alert(msg);
    }
    setLoading(false);
  };

  return (
    <Card className="w-full bg-white/80 rounded-2xl p-6 shadow-xl font-sans">
      <CardHeader className="pb-3 px-0">
        <CardTitle className="text-blue-900 text-2xl font-semibold mb-[-15px]">Add Balance</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 px-0">
        <form onSubmit={handleSubmit}>
          {/* Dropdown flag + input amount */}
          <div className="flex items-center bg-white rounded-lg px-2 mb-4 py-2 border border-[#6FACDD] shadow-lg">
            <Select
              value={currency.code}
              onValueChange={(val) => {
                const found = currencies.find(c => c.code === val);
                if (found) setCurrency(found);
              }}
            >
              <SelectTrigger className="w-[56px] bg-transparent border-none outline-none shadow-none p-0">
                <Image
                  src={currency.flag}
                  alt={currency.code}
                  width={36}
                  height={36}
                  className="rounded-full object-cover"
                />
              </SelectTrigger>
              <SelectContent>
                {currencies.map(c => (
                  <SelectItem key={c.code} value={c.code} className="flex items-center gap-2">
                    <Image src={c.flag} alt={c.code} width={28} height={28} className="rounded-full object-cover inline-block mr-2" />
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="mx-2 text-xl text-blue-900 font-semibold">{currency.symbol}</span>
            <Input
              type="number"
              placeholder="Amount"
              className="focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-gray-700 placeholder:text-gray-400 text-lg font-medium w-full border-none"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              min={1}
              step="any"
            />
          </div>
          {/* Date & Type */}
          <div className="flex gap-4 mb-4">
            <div className="flex-1 flex flex-col">
              <Label className="text-blue-800 text-sm font-semibold mb-1 block">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="w-full flex justify-between items-center bg-white px-4 py-3 rounded-lg border border-[#6FACDD] text-gray-700 font-medium text-lg shadow-lg"
                  >
                    {date ? format(date, "dd - MM - yyyy") : <span>Pilih tanggal</span>}
                    <CalendarIcon className="ml-2 h-5 w-5 text-gray-500" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex-1 flex flex-col">
              <Label className="text-blue-800 text-sm font-semibold mb-1 block">Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger id="type" className="border border-[#6FACDD] rounded-lg focus-visible:ring-0 focus-visible:ring-offset-0 bg-white font-medium text-lg text-gray-700 w-full p-[26px] shadow-lg">
                  <SelectValue placeholder="Income" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {/* Description */}
          <div className="mb-4">
            <Label className="text-blue-800 text-sm font-semibold mb-1 block">Desc</Label>
            <Textarea
              placeholder="Write here"
              className="bg-white rounded-lg border border-[#6FACDD] focus-visible:ring-0 focus-visible:ring-offset-0 text-blue-900 font-semibold text-base p-3 shadow-lg"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={2}
            />
          </div>
          {/* Save Button */}
          <Button
            className="w-full mt-4 bg-[#295B82] rounded-full text-white text-lg py-3 font-semibold hover:bg-[#295B82]/90 shadow-lg"
            type="submit"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
