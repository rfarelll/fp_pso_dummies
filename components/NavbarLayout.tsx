'use client';

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function NavbarLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Hide navbar hanya di landing, login, dan register
  const hideNavbar =
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/register";

  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
    </>
  );
}
