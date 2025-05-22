"use client";

import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

export function AddBalanceCard() {
    const [amount, setAmount] = React.useState("");
    const [date, setDate] = React.useState<Date | undefined>(new Date());
    const [type, setType] = React.useState("");
    const [desc, setDesc] = React.useState("");

    // Handle submit (dummy)
    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        // TODO: save logic
        setAmount("");
        setDesc("");
        setType("");
        // date tetap, bisa direset kalau mau
    }

    return (
        <Card className="max-w-lg w-full bg-[#6FACDD] rounded-2xl p-6 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]">
            <CardHeader className="pb-3">
                <CardTitle className="text-white text-xl">Add Balance</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <form onSubmit={handleSubmit}>
                    {/* Amount */}
                    <div className="flex items-center bg-white rounded px-2 mb-2">
                        <span className="mr-2">
                            <Image
                                src="/images/united-states.png"
                                alt="US flag"
                                width={32}
                                height={32}
                                className="rounded-full object-cover"
                            />
                        </span>
                        <Input
                            type="number"
                            placeholder="Amount"
                            className="focus:ring-0 bg-transparent text-gray-500 placeholder:text-gray-400"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            required
                        />
                    </div>
                    {/* Date & Type */}
                    <div className="flex gap-2 bg-white rounded px-2 py-2 mb-2">
                        <div className="flex-1 flex flex-col">
                            <Label htmlFor="date" className="text-blue-800 text-xs font-semibold">Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <button
                                        type="button"
                                        className="w-full flex justify-between items-center bg-white px-2 py-2 rounded border text-blue-900 font-bold text-lg"
                                    >
                                        {date ? format(date, "PPP") : <span>Pilih tanggal</span>}
                                        <CalendarIcon className="ml-2 h-5 w-5 text-blue-600" />
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
                            <Label htmlFor="type" className="text-blue-800 text-xs font-semibold">Type</Label>
                            <Select value={type} onValueChange={setType}>
                                <SelectTrigger id="type" className="border-0 focus:ring-0 bg-transparent font-bold text-lg text-blue-900">
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
                    <div className="mb-2">
                        <Label htmlFor="desc" className="text-blue-800 text-xs font-semibold">Desc</Label>
                        <Textarea
                            id="desc"
                            placeholder="Deskripsi..."
                            className="bg-white rounded border-0 focus:ring-0 text-blue-900 font-semibold"
                            value={desc}
                            onChange={e => setDesc(e.target.value)}
                            rows={2}
                        />
                    </div>
                    {/* Save Button */}
                    <Button
                        className="w-full mt-3 bg-[#295B82] rounded-full text-lg font-bold"
                        type="submit"
                    >
                        SAVE
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
