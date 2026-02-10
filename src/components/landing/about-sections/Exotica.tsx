"use client";

import React from 'react';
import { motion } from 'framer-motion';
import styles from './about-sections.module.scss';
import clsx from 'clsx';

const Exotica: React.FC = () => {
  return (
    <section className={styles.about_section}>
      <div className={clsx(styles.about_main_section, styles.reverse)}>
        <div className={styles.about_img_grid_container}>
          <motion.div
            className={styles.imgtwo}
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <img
              src="https://res.cloudinary.com/dgc9mpvvw/image/upload/v1705036869/espektro/2023/about/exotica.webp"
              alt="Exotica cultural stage"
              className={styles.about_img}
            />
          </motion.div>
          {/* <motion.div
            className={styles.imgthree}
            initial={{ opacity: 0, scale: 0.5, x: 50 }}
            whileInView={{ opacity: 1, scale: 1, x: 0, y: "10%" }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <div className='w-[20%] -mt-10'>
              <img
                src="https://res.cloudinary.com/dlrlet9fg/image/upload/v1742322170/Oil_Lamps_and_Candles___by_Ev_Ganin_t6qzwx.png"
                alt="Exotica decorative lamps"
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
            <span className="text-[#B7410E] text-2xl font-bold">Exotica</span> stands as the cultural heartbeat of Espektro, showcasing a rich tapestry of talents from KGEC's student body. This segment immerses attendees in a <span className="text-[#B7410E] font-bold">captivating ambiance of music and dance</span>, deeply rooted in the college's cultural essence.
          </div>
          <p className="mt-4">
            Following the student performances, Exotica ascends to new heights with renowned artists from across India gracing the stage. Their emotive and masterful performances resonate deeply, leaving an indelible impact on every listener. Exotica harmoniously blends local talent with national luminaries.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Exotica;
