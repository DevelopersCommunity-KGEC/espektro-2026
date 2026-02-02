'use client'

// import HorizontalImg from '@/assets/images/horizontalimg.jpg';
// import VerticalImg from '@/assets/images/verticalimg.jpeg';
import React from 'react';

import { motion } from 'framer-motion';

// import AnimatedHeading from '@/components-global/animated-heading';
import styles from './style.module.scss';
import OutlinedHeading from '@/components/layout/outlined-heading';
// import OutlinedHeading from '@/components-global/outlined-heading';


const Techtix: React.FC = () => {
  return (
    <section className={styles.about_section}>
      {/* <AnimatedHeading heading="Techtix" variant="light" /> */}
      <OutlinedHeading label="Techtix" theme="vintage" />
      <div className={styles.about_main_section}>
        <motion.div
          className={styles.about_content_section}
          initial={{
            opacity: 0,
            transform: 'translateX(50%)',
          }}
          transition={{
            delay: 0.5,
            duration: 1,
          }}
          whileInView={{
            opacity: 1,
            transform: 'translateX(0px)',
          }}
          viewport={{
            once: true,
          }}
        >
          <div className='font-medieval text-xl leading-relaxed'>
          {/* <span className="text-3xl font-bold text-amber-200">Techtix</span> serves as the technical cornerstone of Espektro, immersing 
            participants in a diverse variety of activities throughout the day. Organized by the college's technical clubs, this 
            segment showcases a spectrum of <span className="text-amber-200 text-3xl">compelling games and interactive challenges.</span>{" "}
            Participants are afforded the opportunity to demonstrate their skills, engage in friendly competition, and immerse 
            themselves in hands-on experiences. From <span className="text-amber-200 text-3xl">innovative workshops to competitive events,</span>{" "}
            Techtix is designed to captivate and challenge attendees, fostering a spirit of ingenuity and collaboration. Blending 
            education with entertainment, Techtix elevates the Espektro festival experience, promoting continuous learning and 
            nurturing a vibrant community of aspiring engineers and tech enthusiasts. */}

            <span className="text-3xl font-bold text-vintage-brown-text">Techtix</span>{" "}
                    serves as the technical cornerstone of Espektro, immersing
                    participants in a diverse variety of activities throughout
                    the day. Organized by the college's technical clubs, this
                    segment showcases a spectrum of{" "}
                    <span className="text-3xl font-bold text-vintage-brown-text">
                      compelling games and interactive challenges.
                    </span>{" "}
                    Participants are afforded the opportunity to demonstrate
                    their skills, engage in friendly competition, and immerse
                    themselves in hands-on experiences. From{" "}
                    <span className="text-3xl font-bold text-vintage-brown-text">
                      innovative workshops to competitive events,
                    </span>{" "}
                    Techtix is designed to captivate and challenge attendees,
                    fostering a spirit of ingenuity and collaboration. Blending
                    education with entertainment, Techtix elevates the Espektro
                    festival experience.
          </div>
        </motion.div>

        <div className={styles.about_img_grid_container}>
          <motion.div
            className={styles.imgtwo}
            initial={{
              opacity: 0,
              transform: 'scale(0.5)',
            }}
            transition={{
              delay: 0.5,
              duration: 1,
            }}
            whileInView={{
              opacity: 1,
              transform: 'scale(1)',
            }}
            viewport={{
              once: true,
            }}
          >
            <img
              src="https://res.cloudinary.com/dgc9mpvvw/image/upload/v1705035889/espektro/2023/about/techtix.webp"
              alt="vertical"
              className={styles.about_img}
            />
          </motion.div>
          <motion.div
            className={styles.imgone}
            initial={{
              opacity: 0,
              transform: 'scale(0.5) translateX(-50%)',
              zIndex: 100,
            }}
            whileInView={{
              opacity: 1,
              transform: 'scale(1) translateX(0px)',
            }}
            viewport={{
              once: true,
            }}
          >
            {/* <img
              src="https://res.cloudinary.com/dlrlet9fg/image/upload/v1742233725/download_14_hgxhex.png"
              alt="horizontal"
              className={styles.about_img}
            /> */}
          </motion.div>
          <motion.div
            className={styles.imgthree}
            initial={{
              opacity: 0,
              transform: 'scale(0.5) translateX(50%)',
            }}
            whileInView={{
              opacity: 1,
              transform: 'scale(1) translateX(0px)',
            }}
            viewport={{
              once: true,
            }}
          ><div className='w-[80%]'>
            <img
              src="https://res.cloudinary.com/dlrlet9fg/image/upload/v1742233725/download_14_hgxhex.png"
              alt="horizontal"
              className={styles.about_img}
            /></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Techtix;