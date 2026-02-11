"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import styles from './about-sections.module.scss';
import clsx from 'clsx';

const Techtix: React.FC = () => {
  return (
    <section className={styles.about_section}>
      <div className={styles.about_main_section}>
        <div className={styles.about_img_grid_container}>
          <motion.div
            className={styles.imgtwo}
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            viewport={{ once: true }}
          >
            <Image
              src="https://res.cloudinary.com/dgc9mpvvw/image/upload/v1705035889/espektro/2023/about/techtix.webp"
              alt="Techtix technical event"
              fill
              className={styles.about_img}
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </motion.div>
          {/* <motion.div
            className={styles.imgthree}
            initial={{ opacity: 0, scale: 0.5, x: 50 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <div className="w-[80%]">
              <img
                src="https://res.cloudinary.com/dlrlet9fg/image/upload/v1742233725/download_14_hgxhex.png"
                alt="Techtix decorative image"
                className={styles.about_img}
              />
            </div>
          </motion.div> */}
        </div>
        <motion.div
          className={styles.about_content_section}
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          viewport={{ once: true }}
        >
          <div className="font-serif">
            <span className="text-[#B7410E] text-2xl font-bold">Techtix</span> serves as the technical cornerstone of Espektro, immersing participants in a diverse variety of activities throughout the day. Organized by the college's technical clubs, this segment showcases a spectrum of <span className="text-[#B7410E]">compelling games and interactive challenges.</span>
          </div>
          <p className="mt-4">
            Participants are afforded the opportunity to demonstrate their skills, engage in friendly competition, and immerse themselves in hands-on experiences. From <span className="text-[#B7410E] font-bold">innovative workshops to competitive events</span>, Techtix is designed to captivate and challenge attendees, fostering a spirit of ingenuity and collaboration.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Techtix;
