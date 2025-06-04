'use client';

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <section className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#4484B7] to-[#6FACDD]">
      <div className="w-full max-w-5xl flex flex-col md:flex-row bg-white/80 rounded-2xl shadow-lg border border-blue-200 overflow-hidden">
        {/* Left - Logo & Text */}
        <div className="w-full md:w-2/3 flex flex-col items-center justify-center py-12 px-4 md:px-12">
          <Image
            src="/images/DooIT.png"
            alt="DooIT Logo"
            width={160}
            height={160}
            className="mb-6"
            priority
          />
          <h1 className="text-4xl md:text-3xl font-extrabold text-blue-900 text-center mb-3 font-sans">
            DooIT
          </h1>
          <div className="text-md md:text-lg text-[#295B82] font-bold text-center mb-6 font-sans drop-shadow">
            Konversi Kurs & Kelola Saldo Mata Uang, Instan dan Mudah!
          </div>
          <p className="text-xs md:text-base text-blue-900/70 text-center max-w-lg font-semibold leading-snug font-sans">
            DooIT adalah aplikasi web sederhana yang membantu Anda melakukan konversi kurs mata uang
            dengan cepat, memantau saldo dalam berbagai mata uang, serta mengonversi saldo ke mata uang lain secara instan.
            Cocok untuk traveler, pekerja internasional, maupun siapa saja yang ingin mengelola keuangan lintas negara secara praktis dan efisien.
            Semua fitur DooIT dapat diakses langsung tanpa instalasi, kapan saja dan di mana saja! 
          </p>
        </div>
        {/* Right - CTA */}
        <div className="w-full md:w-1/3 flex flex-col justify-center items-center gap-8 py-14 px-8 border-t md:border-t-0 md:border-l border-blue-200 bg-transparent">
          <Link href="/register" className="w-full flex justify-center">
            <Button
              size="lg"
              className="w-full max-w-xs py-7 text-xl font-semibold rounded-2xl shadow-md font-sans bg-[#295B82] text-white hover:bg-[#295B82]/90 transition-colors"
            >
              Sign Up
            </Button>
          </Link>
          <Link href="/login" className="w-full flex justify-center">
            <Button
              size="lg"
              className="w-full max-w-xs py-7 text-xl font-semibold rounded-2xl shadow-md font-sans bg-[#295B82] text-white hover:bg-[#295B82]/90 transition-colors"
            >
              Log In
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
