"use client";

import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';

const EspektroAbout: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const y4 = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const y5 = useTransform(scrollYProgress, [0, 1], [0, -60]);

  return (
    <section ref={sectionRef} className="relative flex justify-center items-center w-full py-20 pr-10 md:pr-0 md:px-4  z-10" style={{ backgroundColor: "#FFF8F0" }}>
      {/* Lotus Mandala Background - Centered and Subtle */}
      {/* <div className="absolute inset-0  flex items-center justify-center opacity-[0.1] pointer-events-none">
        <Image
          src="/images/background_web.webp"
          alt="Decorative lotus mandala"
          fill
          priority
          className="object-contain hidden md:block"
        />
        <Image
          src="/images/background_web_mobile.png"
          alt="Decorative lotus mandala"
          fill
          priority
          className="object-contain w-fit md:hidden bottom-50"
        />
      </div> */}

      {/* Left Vertical Tribal Border */}
      {/* <div
        className="absolute top-0 left-0 bottom-0 w-[60px] md:w-[80px] pointer-events-none z-[5] hidden lg:block"
        style={{
          backgroundImage: 'url(/border.svg)',
          backgroundRepeat: 'repeat-y',
          backgroundSize: '100% auto'
        }}
      /> */}

      {/* Left Tribal Border Pattern */}
      <div
        className="absolute top-0 left-0 bottom-0 w-16 md:w-24 overflow-hidden hidden sm:block z-0"
        style={{
          backgroundImage: 'url(/images/43a0b75b3caae95caa70550adda8ed60.webp)',
          backgroundRepeat: 'repeat-y',
          backgroundSize: '100% auto',
          backgroundPosition: 'top center'
        }}
      />

      {/* Top-Left Circular Basket Decoration */}
      {/* Top-Left Circular Basket Decoration - Front */}
      <motion.div
        className="absolute -left-16 top-6 w-32 h-32 md:w-48 md:h-48 lg:w-56 lg:h-56 z-[20] hidden sm:block"
        initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
        whileInView={{ opacity: 1, scale: 1, rotate: 360 }}
        transition={{
          rotate: { duration: 90, repeat: Infinity, ease: "linear" },
          opacity: { duration: 1 },
          scale: { duration: 1 }
        }}
        viewport={{ once: true }}
      >
        <Image
          src="/images/1c633fa82eab0887a01b2ba2b4c75bdc.webp"
          alt="Traditional woven basket decoration"
          fill
          className="object-contain drop-shadow-lg"
        />
      </motion.div>

      {/* Top-Left Circular Pattern - Back */}
      <motion.div
        className="absolute left-[-8rem] top-[-20rem] w-80 h-80 md:w-80 md:h-60 lg:w-100 lg:h-100 z-[21] hidden sm:block"
        initial={{ opacity: 0, scale: 0.8, rotate: -20 }}
        whileInView={{ opacity: 1, scale: 1, rotate: -360 }}
        transition={{
          rotate: { duration: 60, repeat: Infinity, ease: "linear" },
          opacity: { duration: 1.2, delay: 0.1 },
          scale: { duration: 1.2, delay: 0.1 }
        }}
        viewport={{ once: true }}
      >
        <Image
          src="/images/992241cef4a2175dfd465b2ebbe92e8e.webp"
          alt="Decorative circular pattern"
          fill
          className="object-contain"
        />
      </motion.div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto pl-4 sm:pl-20 md:pl-28 lg:pl-32">
        <div className="flex flex-col lg:flex-row-reverse items-start lg:items-center gap-12 lg:gap-16">

          {/* Right Content - Text */}
          <motion.div
            className="flex-1 text-justify max-w-xl ml-auto flex flex-col items-center"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg md:text-xl text-[#8B2635] tracking-wide mb-3 font-medium uppercase font-[family-name:var(--font-roboto-slab)]">
              Cultural & Technical Fest
            </h3>
            <h1 className="text-5xl md:text-6xl lg:text-7xl text-[#2C1810] mb-6 leading-[1.1] font-[family-name:var(--font-medieval-sharp)]">
              Espektro
            </h1>
            <p className="text-base md:text-lg leading-relaxed text-[#4A3428] font-[family-name:var(--font-open-sans)]">
              At Kalyani Government Engineering College, Espektro is not just a fest — it’s a four-day celebration of talent, technology, culture. It is the grand annual fest that brings together students from different departments under one vibrant platform. Every year, the campus transforms into a hub of excitement, creativity, and collaboration.
            </p>
            <a
              href="https://res.cloudinary.com/dezguraul/image/upload/v1741930364/espektro_sponsor_brochure_5_iubdru.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-8"
            >
              <Button
                variant="theatrical"
                className="bg-[#B7410E] hover:bg-[#8B2635] text-white font-bold h-10 uppercase text-[10px] tracking-[0.2em] shadow-md hover:shadow-xl hover:-translate-y-1 font-[family-name:var(--font-roboto-slab)] transition-all duration-300"
              >
                Event Brochure
              </Button>
            </a>
          </motion.div>

          {/* Left Content - Image Collage */}
          <motion.div
            className="flex-[1.2] w-full max-w-2xl relative z-30"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="relative w-full h-[500px] md:h-[600px] flex items-center justify-center">
              {/* Image 1 - Top Left - Removed as per user request */}

              {/* Image 2 - Top Right - Image */}
              <motion.div
                className="absolute top-[0%] right-0 w-[45%] h-[40%] rounded-lg overflow-hidden shadow-xl z-[1]"
                style={{ y: y2 }}
                initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 5 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Image
                  src="/images/kolkata-city.webp"
                  alt="City view"
                  fill
                  className="object-cover hover:scale-110 transition-transform duration-500"
                />
              </motion.div>

              {/* Image 3 - Center - Boxed Image */}
              <motion.div
                className="relative w-[65%] h-[50%] rounded-lg overflow-hidden shadow-2xl z-[50] border-4 border-white"
                initial={{ opacity: 0, scale: 0.9, x: -30, y: -30, rotate: 0 }}
                whileInView={{ opacity: 1, scale: 1, x: -30, y: -30, rotate: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Image
                  src="https://res.cloudinary.com/dgc9mpvvw/image/upload/v1705035698/espektro/2023/about/espektro.webp"
                  alt="Main Espektro focus"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
              </motion.div>

              {/* Image 4 - Bottom Left - Image */}
              <motion.div
                className="absolute -bottom-[20%] left-0 w-[45%] h-[40%] rounded-lg overflow-hidden shadow-xl z-[1]"
                style={{ y: y3 }}
                initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                whileInView={{ opacity: 1, scale: 1, rotate: -10 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <Image
                  src="/images/india-culture.webp"
                  alt="Culture art"
                  fill
                  className="object-cover hover:scale-110 transition-transform duration-500"
                />
              </motion.div>

              {/* Image 5 - Bottom Right - Transparent Element */}
              <motion.div
                className="absolute bottom-[0%] right-[-5%] w-[50%] h-[50%] z-[60]"
                style={{ y: y4 }}
                initial={{ opacity: 0, scale: 0.8, rotate: 15 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 12 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <Image
                  src="/images/Elements _20260218_030113_0004.webp"
                  alt="Clapperboard element"
                  fill
                  className="object-contain drop-shadow-2xl hover:scale-110 transition-transform duration-500"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Decorative Element - Tribal Pattern Footer */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 w-64 h-16 opacity-30 hidden md:block"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 0.3, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        viewport={{ once: true }}
      >
        {/* <Image
          src="/images/225fc2b0491f29fb9a027d0a94bfcf53.webp"
          alt="Decorative tribal pattern"
          fill
          className="object-contain"
        /> */}
      </motion.div>
    </section>
  );
};

export default EspektroAbout;

