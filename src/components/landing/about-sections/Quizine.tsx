"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import styles from './about-sections.module.scss';
import clsx from 'clsx';

const Quizine: React.FC = () => {
  return (
    <section className={styles.about_section}>
      <div className={styles.about_main_section}>
        <div className={styles.about_img_grid_container}>
          <motion.div
            className={styles.imgtwo}
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <Image
              src="https://res.cloudinary.com/dlrlet9fg/image/upload/v1742327716/Quixine_web_poezry.png"
              alt="Quizine food stalls"
              fill
              className={styles.about_img}
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </motion.div>
          {/* <motion.div
            className={styles.imgone}
            initial={{ opacity: 0, scale: 0.5, x: "-50%" }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <div className='w-[50%] h-full'>
              <img
                src="https://res.cloudinary.com/dlrlet9fg/image/upload/v1742327453/free_download_cliparts_of_witch_xgdwjx.png"
                alt="Quizine mascot"
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
            <span className="text-[#B7410E] text-2xl font-bold">Quizine</span> awaits, promising a <span className="text-[#B7410E] font-bold">gastronomic haven</span> that will ignite your senses and elevate your culinary experience. Prepare to embark on a journey through a myriad of flavors and culinary marvels, <span className="text-[#B7410E]">where every bite tells a story.</span>
          </div>
          <p className="mt-4">
            Immerse yourself in a world of excitement as Quizine hosts exhilarating culinary contests, inviting you to showcase your skills and creativity. Whether you're a seasoned chef or an aspiring home cook, there's something for everyone to savor and enjoy at the true essence of culinary artistry.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Quizine;
