'use client'

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { AddBalanceCard } from "@/components/AddBalanceCard";
import { auth } from "@/lib/firebaseConfig";
import { onAuthStateChanged, signOut, User } from "firebase/auth";

export default function Home() {
  const [showBalance, setShowBalance] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false); // <-- penting!

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setAuthChecked(true);
    });
    return () => unsubscribe();
  }, []);

  // Sambil nunggu auth state ke-load, tampilkan loading (atau skeleton UI)
  if (!authChecked) {
    return (
      <section className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#4484B7] to-[#6FACDD]">
        <div className="text-white text-xl font-semibold">Loading...</div>
      </section>
    );
  }

  // Kalau user belum login, redirect ke /login (hanya setelah auth dicek)
  if (!user && typeof window !== "undefined") {
    window.location.href = "/login";
    return null;
  }

  return (
    <section className="bg-[linear-gradient(135deg,_#4484B7_10%,_#6FACDD_90%)] min-h-screen overflow-hidden">
      <div className="flex flex-col gap-4 h-screen w-full">
        <div className="m-10">
          <div className="rounded-2xl max-w-lg p-5 bg-[#6FACDD] shadow-2xl">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="text-4xl">Total Balance</div>
                <button
                  onClick={() => signOut(auth)}
                  className="text-sm bg-white px-4 py-1 rounded-lg shadow font-bold text-blue-900 hover:bg-blue-100"
                >
                  Logout
                </button>
              </div>
              <div className="text-6xl flex items-baseline">
                <span className="inline-block min-w-[400px]">
                  {showBalance ? "Rp. 500.000" : "*******"}
                </span>
                <button
                  onClick={() => setShowBalance(!showBalance)}
                  className="focus:outline-none flex items-end"
                  title={showBalance ? "Sembunyikan Saldo" : "Tampilkan Saldo"}
                >
                  <FontAwesomeIcon
                    icon={showBalance ? faEye : faEyeSlash}
                    className="text-3xl"
                  />
                </button>
              </div>
              <div className="text-blue-100 text-md">
                Hi, {user?.displayName || user?.email}!
              </div>
            </div>
          </div>

          <div className="mt-10 flex">
            <AddBalanceCard />
          </div>
        </div>
      </div>
    </section>
  );
}