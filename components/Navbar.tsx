"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebaseConfig";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";

export default function Navbar() {
  const [user, setUser] = React.useState<User | null>(null);
  const router = useRouter();

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  // Klik avatar/logout icon untuk sign out
  const handleAvatarClick = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-md px-6 py-1 flex items-center justify-between">
      {/* Kiri: Logo + DooIT */}
      <div className="flex items-center gap-2">
        <Image
          src="/images/DooIT.png"
          alt="DooIT Logo"
          width={70}
          height={70}
          className="object-contain"
        />
        <span className="text-2xl font-bold text-blue-900 tracking-wide ml-2">
          DooIT
        </span>
      </div>
      {/* Kanan: Menu + Profile */}
      <div className="flex items-center gap-7">
        <Link
          href="/about"
          className="text-blue-900 font-medium hover:text-blue-500 transition-colors"
        >
          About
        </Link>
        <Link
          href="/instruction"
          className="text-blue-900 font-medium hover:text-blue-500 transition-colors"
        >
          Instruction
        </Link>
        {user && (
          <button
            onClick={handleAvatarClick}
            title="Logout"
            className="ml-4 px-3 py-2 rounded-full hover:bg-[#295B82]/10 transition-colors text-blue-900 text-lg"
          >
            <FontAwesomeIcon icon={faRightFromBracket} />
          </button>
        )}
      </div>
    </nav>
  );
}
