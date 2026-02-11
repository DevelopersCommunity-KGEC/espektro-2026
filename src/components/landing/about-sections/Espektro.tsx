"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import styles from './about-sections.module.scss';
import clsx from 'clsx';

const EspektroAbout: React.FC = () => {
  return (
    <section className={styles.about_section}>
      <div className={clsx(styles.about_main_section, styles.reverse)}>
        <div className={styles.about_img_grid_container}>
          <motion.div
            className={styles.imgtwo}
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <Image
              src="https://res.cloudinary.com/dgc9mpvvw/image/upload/v1705035698/espektro/2023/about/espektro.webp"
              alt="Main Espektro event"
              fill
              className={styles.about_img}
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </motion.div>
          {/* <motion.div
            className={styles.imgone}
            initial={{ opacity: 0, scale: 0.5, x: "-30%" }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true, margin: "-50px" }}
          >
            <img
              src="https://res.cloudinary.com/dlrlet9fg/image/upload/v1742233724/Layer_0_dhjh2p.png"
              alt="Espektro visual element"
              className={styles.about_img}
              loading="lazy"
            />
          </motion.div>
          <motion.div
            className={styles.imgthree}
            initial={{ opacity: 0, scale: 0.5, x: "30%" }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true, margin: "-50px" }}
          >
            <img
              src="https://res.cloudinary.com/dlrlet9fg/image/upload/v1742233724/download_16_fvtzyw.png"
              alt="Espektro decoration"
              className={styles.about_img}
              loading="lazy"
            />
          </motion.div> */}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          viewport={{ once: true, margin: "-50px" }}
          className={styles.about_content_section}
        >
          <p>
            <span className="text-[#B7410E] text-2xl font-serif">Espektro</span> is the annual cultural and technical spectacle hosted by <span className="text-[#B7410E] text-2xl font-serif">Kalyani Government Engineering College</span>. As West Bengal's second-largest fest, Espektro masterfully intertwines the realms of technology and creativity, setting the stage for a multifaceted celebration.
          </p>
          <p className={styles.brochureText}>
            Espektro – Where culture meets technology in a festival of innovation and creativity!
          </p>
          <a
            href="https://res.cloudinary.com/dezguraul/image/upload/v1741930364/espektro_sponsor_brochure_5_iubdru.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className={styles.button}>Event Brochure</button>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default EspektroAbout;
