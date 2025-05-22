import * as React from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeftRight } from "lucide-react";

// Dummy country data
const countries = [
    { code: "US", name: "USD", flag: "/images/united-states.png" },
    { code: "AU", name: "AUD", flag: "/images/australia.png" },
    { code: "ID", name: "IDR", flag: "/images/indonesia.png" },
];

export function CalculatorCard() {
    // State
    const [fromCountry, setFromCountry] = React.useState(countries[0]);
    const [toCountry, setToCountry] = React.useState(countries[1]);
    const [fromAmount, setFromAmount] = React.useState("");
    const [toAmount, setToAmount] = React.useState("");
    // Dummy result
    const rate = 10540;
    const time = "15:14";

    // Swap countries
    function handleSwap() {
        setFromCountry(toCountry);
        setToCountry(fromCountry);
        setFromAmount(toAmount);
        setToAmount(fromAmount);
    }

    // Clear input
    function handleClear() {
        setFromAmount("");
        setToAmount("");
    }

    return (
        <Card className="max-w-3xl w-full bg-[#6FACDD] rounded-2xl shadow-[0_4px_4px_0_rgba(0,0,0,0.15)] mx-auto px-6 py-4">
            <CardHeader className="flex flex-row justify-between items-start pb-2">
                <CardTitle className="text-white text-lg">Calculator</CardTitle>
                <div className="text-right">
                    <div className="text-xs md:text-sm font-bold text-white">
                        A${fromAmount || "1,000"} {fromCountry.name} = Rp{(Number(fromAmount.replace(/,/g, "")) * rate || rate).toLocaleString("id-ID")} {toCountry.name}
                    </div>
                    <div className="text-[11px] text-white/80 italic leading-tight">
                        Nilai tukar pasar tengah pada {time}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                    {/* FROM */}
                    <div className="flex-1 bg-white rounded-lg flex items-center px-2 h-12 relative">
                        {/* Flag */}
                        <button className="flex items-center mr-2 focus:outline-none">
                            <Image
                                src={fromCountry.flag}
                                alt={fromCountry.code}
                                width={28}
                                height={28}
                                className="rounded-full object-cover border"
                            />
                            {/* Bisa tambahkan select negara jika ingin */}
                            <span className="ml-1 font-bold text-gray-500 text-xs">{fromCountry.name}</span>
                            <span className="ml-1">&#9660;</span>
                        </button>
                        <Input
                            placeholder="Amount"
                            className="border-0 bg-transparent placeholder:text-gray-300 text-gray-500 font-semibold text-lg"
                            value={fromAmount}
                            onChange={e => setFromAmount(e.target.value)}
                        />
                    </div>

                    {/* Swap */}
                    <Button
                        type="button"
                        variant="ghost"
                        className="bg-[#295B82] hover:bg-[#244f70] rounded-full p-2 mx-1 shadow text-white"
                        onClick={handleSwap}
                    >
                        <ArrowLeftRight className="w-6 h-6" />
                    </Button>

                    {/* TO */}
                    <div className="flex-1 bg-white rounded-lg flex items-center px-2 h-12 relative">
                        <button className="flex items-center mr-2 focus:outline-none">
                            <Image
                                src={toCountry.flag}
                                alt={toCountry.code}
                                width={28}
                                height={28}
                                className="rounded-full object-cover border"
                            />
                            <span className="ml-1 font-bold text-gray-500 text-xs">{toCountry.name}</span>
                            <span className="ml-1">&#9660;</span>
                        </button>
                        <Input
                            placeholder="Amount"
                            className="border-0 bg-transparent placeholder:text-gray-300 text-gray-500 font-semibold text-lg"
                            value={toAmount}
                            onChange={e => setToAmount(e.target.value)}
                        />
                    </div>
                </div>
                {/* Clear Button */}
                <div className="flex justify-end mt-2">
                    <button
                        type="button"
                        onClick={handleClear}
                        className="text-white text-sm font-bold underline hover:text-blue-100"
                    >
                        Clear
                    </button>
                </div>
            </CardContent>
        </Card>
    );
}
