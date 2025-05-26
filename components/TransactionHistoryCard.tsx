'use client';

import * as React from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import clsx from "clsx";
import { format, isValid } from "date-fns";
import type { Transaction } from "@/types/Transaction";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

type Props = {
  history?: Transaction[];
  className?: string;
  onDelete?: (id: string) => void;
};

export function TransactionHistoryCard({
  history = [],
  onDelete,
}: Props) {
  return (
    <Card className="w-full max-w-2xl bg-white/80 rounded-2xl shadow-xl font-sans">
      <CardHeader className="px-4 mb-[-10px]">
        <CardTitle className="text-blue-900 text-2xl font-semibold">Transaction History</CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-2">
        <div
          className="flex flex-col gap-3 overflow-y-auto"
          style={{ maxHeight: 300, minHeight: 240 }}
        >
          {history.length === 0 ? (
            <div className="text-center text-blue-900/60 italic">No transaction yet.</div>
          ) : (
            history.map((tx) => {
              let displayDate = "";
              if (tx.date) {
                const parsed =
                  typeof tx.date === "string"
                    ? new Date(tx.date)
                    : tx.date;
                displayDate = isValid(parsed)
                  ? format(parsed, "dd-MM-yyyy")
                  : "";
              }
              return (
                <div
                  key={tx.id}
                  className="flex items-center bg-white rounded-lg px-3 py-2 shadow-sm relative"
                >
                  <Image
                    src={tx.countryFlag}
                    alt={tx.currency}
                    width={30}
                    height={30}
                    className="rounded-full border mr-3"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span
                        className={clsx(
                          "font-bold text-md",
                          tx.type === "income"
                            ? "text-green-600"
                            : "text-red-500"
                        )}
                      >
                        {tx.type === "income" ? "+" : "-"}
                        {tx.amount.toLocaleString("id-ID")} {tx.currency}
                      </span>
                      <span className="text-xs text-blue-900">
                        {displayDate}
                      </span>
                    </div>
                    <div className="text-xs text-blue-900">{tx.desc}</div>
                  </div>
                  {/* Tombol Delete */}
                  <button
                    onClick={() => tx.id && onDelete?.(tx.id)}
                    className="ml-3 p-2 rounded-full hover:bg-red-100 transition-colors"
                    title="Delete"
                  >
                    <FontAwesomeIcon icon={faTrash} className="text-red-500 hover:text-red-700" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
