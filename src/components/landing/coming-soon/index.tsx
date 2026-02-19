"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function ComingSoon() {
  return (
    <div className="relative w-full h-[30vh] md:h-[60vh] flex flex-col items-center justify-center bg-[#FFF8F0] overflow-hidden">
      {/* Subtle Background Pattern (Optional, low opacity for 'simple' look) */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <Image
          src="/images/360_F_1706070199_WZV67PDH1xx2nGjbDWR2M7U3bc4CsQi8.webp"
          alt="Background Pattern"
          fill
          className="object-cover"
        />
      </div>

      <div className="z-10 text-center px-4">
        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-2xl md:text-5xl font-bold text-[#2C1810] font-[family-name:var(--font-medieval-sharp)] mb-4 tracking-wide shadow-sm"
        >
          COMING SOON
        </motion.h1>

        {/* Separator Line */}
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          whileInView={{ opacity: 1, width: "100px" }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="h-1 bg-[#B7410E] mx-auto mb-8"
        />

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-xs md:text-sm text-[#2C1810]/70 font-[family-name:var(--font-roboto-slab)] uppercase tracking-[0.25em]"
        >
          Stay Tuned for Espektro 2026
        </motion.p>
      </div>
    </div>
  );
}
