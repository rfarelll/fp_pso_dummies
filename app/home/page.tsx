'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AddBalanceCard } from "@/components/AddBalanceCard";
import { CalculatorCard } from "@/components/CalculatorCard";
import { BalanceCard } from "@/components/BalanceCard";
import { TransactionHistoryCard } from "@/components/TransactionHistoryCard";
import { auth } from "@/lib/firebaseConfig";
import { onAuthStateChanged, User } from "firebase/auth";
import { db } from "@/lib/firebaseConfig";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import type { Transaction } from "@/types/Transaction";

async function ensureUserInFirestore(user: User) {
  const userDoc = doc(db, "users", user.uid);
  const snap = await getDoc(userDoc);
  if (!snap.exists()) {
    await setDoc(userDoc, {
      balance: 0,
      currency: "IDR",
      displayName: user.displayName || "",
      email: user.email,
    });
  }
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [history, setHistory] = useState<Transaction[]>([]);
  const router = useRouter();

  // Cek autentikasi user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await ensureUserInFirestore(user);
        setUser(user);
      } else {
        setUser(null);
      }
      setAuthChecked(true);
    });
    return () => unsubscribe();
  }, []);

  // Redirect jika belum login
  useEffect(() => {
    if (authChecked && !user) {
      router.replace("/login");
    }
  }, [authChecked, user, router]);

  // Fetch transaksi dari Firestore (real-time, hanya user terkait)
  useEffect(() => {
    if (!user) {
      setHistory([]);
      return;
    }
    const q = query(
      collection(db, "transactions"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(q, (snap) => {
      const arr: Transaction[] = snap.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Transaction, "id">),
      }));
      setHistory(arr);
    });
    return () => unsubscribe();
  }, [user]);

  // Hapus transaksi dari Firestore & update FE state
  async function handleDeleteTransaction(id: string) {
    await deleteDoc(doc(db, "transactions", id));
    setHistory((prev) => prev.filter((tx) => tx.id !== id));
  }

  // Show loading
  if (!authChecked || (!user && typeof window !== "undefined")) {
    return (
      <section className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#4484B7] to-[#6FACDD]">
        <div className="text-white text-xl font-semibold">Loading...</div>
      </section>
    );
  }

  // Sudah login, tampilkan halaman utama
  return (
    <section className="bg-[linear-gradient(135deg,_#4484B7_10%,_#6FACDD_90%)] min-h-screen overflow-hidden flex items-center justify-center">
      <div className="min-h-[80vh] w-full flex items-center justify-center">
        <div className="max-w-6xl w-full mx-auto gap-y-8 px-4">
          {/* Atas */}
          <div className="flex gap-8 mb-8">
            <div className="flex-[1] flex">
              <BalanceCard user={user} />
            </div>
            <div className="flex-[1.6] flex">
              <CalculatorCard />
            </div>
          </div>
          {/* Bawah */}
          <div className="flex gap-8">
            <div className="flex-1 flex">
              <AddBalanceCard user={user} />
            </div>
            <div className="flex-1 flex">
              <TransactionHistoryCard
                history={history}
                onDelete={handleDeleteTransaction}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
