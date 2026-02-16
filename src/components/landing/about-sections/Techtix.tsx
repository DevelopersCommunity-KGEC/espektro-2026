"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const Techtix: React.FC = () => {
  return (
    <section className="relative flex justify-center items-center w-full flex-col overflow-hidden text-foreground py-16 px-3 bg-cover bg-center bg-no-repeat bg-[url('/images/360_F_1706070199_WZV67PDH1xx2nGjbDWR2M7U3bc4CsQi8.png')] bg-white">
      <div className="flex justify-center items-center flex-col w-full h-min">
        <div className="flex flex-col w-full max-w-[1400px] mx-auto gap-8 p-8 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
          <motion.div
            className="flex-1 text-left pr-0 lg:pr-8"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl text-[#333] tracking-wide mb-2 font-medium uppercase font-[family-name:var(--font-roboto-slab)]">Technical Excellence</h3>
            <h1 className="text-6xl text-[#1a1a1a] mb-6 leading-[1.1] font-[family-name:var(--font-medieval-sharp)]">Techtix</h1>
            <p className="text-base leading-relaxed text-[#555] font-[family-name:var(--font-open-sans)]">
              The technical heartbeat of Espektro where innovation meets competition. Experience cutting-edge technology through coding marathons and tech showcases.
              <br /><br />
              From AI workshops to hackathons, Techtix brings together the brightest minds.
            </p>
          </motion.div>

          <motion.div
            className="flex-[1.5] grid grid-cols-2 lg:grid-cols-[1fr_1.5fr_1.5fr] grid-rows-[auto_auto_auto] gap-4 w-full"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {/* Top Row */}
            <div className="relative rounded overflow-hidden bg-[#e0e0e0] min-h-[100px] col-span-1 row-span-1 h-[120px]">
              <div className="w-full h-full bg-[#7a7a7a] min-h-full transition-transform duration-300 ease-in-out hover:scale-105"></div>
            </div>
            <div className="relative rounded overflow-hidden bg-[#e0e0e0] min-h-[100px] col-span-1 row-span-1 h-[120px]">
              <div className="w-full h-full bg-[#7a7a7a] min-h-full transition-transform duration-300 ease-in-out hover:scale-105"></div>
            </div>
            <div className="relative rounded overflow-hidden bg-[#e0e0e0] min-h-[100px] col-span-1 row-span-1 h-[120px]">
              <div className="w-full h-full bg-[#7a7a7a] min-h-full transition-transform duration-300 ease-in-out hover:scale-105"></div>
            </div>

            {/* Second Row Starts */}
            {/* Column 1 items */}
            <div className="relative rounded overflow-hidden bg-[#e0e0e0] min-h-[100px] col-span-1 row-span-1 h-[120px]">
              <div className="w-full h-full bg-[#7a7a7a] min-h-full transition-transform duration-300 ease-in-out hover:scale-105"></div>
            </div>
            <div className="relative rounded overflow-hidden bg-[#e0e0e0] min-h-[100px] col-span-1 row-span-1 h-[120px]">
              <div className="w-full h-full bg-[#7a7a7a] min-h-full transition-transform duration-300 ease-in-out hover:scale-105"></div>
            </div>

            {/* Big items */}
            <div className="relative rounded overflow-hidden bg-[#e0e0e0] min-h-[100px] col-span-1 row-span-2 h-auto">
              <div className="w-full h-full bg-[#7a7a7a] min-h-full transition-transform duration-300 ease-in-out hover:scale-105"></div>
            </div>
            <div className="relative rounded overflow-hidden bg-[#e0e0e0] min-h-[100px] col-span-1 row-span-2 h-auto">
              <div className="w-full h-full bg-[#7a7a7a] min-h-full transition-transform duration-300 ease-in-out hover:scale-105"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Techtix;
