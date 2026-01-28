// import HorizontalImg from '@/assets/images/horizontalimg.jpg';
// import VerticalImg from '@/assets/images/verticalimg.jpeg';
import React from 'react';

import { motion } from 'framer-motion';

// import AnimatedHeading from '@/components-global/animated-heading';
import styles from './style.module.scss';
import OutlinedHeading from '@/components/layout/outlined-heading';
// import OutlinedHeading from '@/components-global/outlined-heading';

const Exotica: React.FC = () => {
  return (
    <section className={styles.about_section}>
      {/* <AnimatedHeading heading="Exotica" variant="light" /> */}
      <OutlinedHeading label="Exotica" theme="vintage" />
      <div className={styles.about_main_section}>
        <div className={styles.about_img_grid_container}>
          <motion.div
            className={styles.imgtwo}
            initial={{
              opacity: 0,
              transform: 'scale(0.5)',
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
              src="https://res.cloudinary.com/dgc9mpvvw/image/upload/v1705036869/espektro/2023/about/exotica.webp"
              alt="vertical"
              className={styles.about_img}
            />
          </motion.div>
          <motion.div
            className={styles.imgone}
            initial={{
              opacity: 0,
              transform: 'scale(0.5) translateX(-50%)',
            }}
            whileInView={{
              opacity: 1,
              transform: 'scale(1) translateX(0px)',
            }}
            viewport={{
              once: true,
            }}
          >
         

          </motion.div>
          <motion.div
            className={styles.imgthree}
            initial={{
              opacity: 0,
              transform: 'scale(0.5) translateX(50%)',
            }}
            whileInView={{
              opacity: 1,
              transform: 'scale(1) translateX(0px) translateY(10%)',
            }}
            viewport={{
              once: true,
            }}
          >
            {/* shkfb */}
            <div className='w-[20%] -mt-50' >
            <img
              src="https://res.cloudinary.com/dlrlet9fg/image/upload/v1742322170/Oil_Lamps_and_Candles___by_Ev_Ganin_t6qzwx.png"
              alt="horizontal"
              className={styles.about_img}
            /></div>
          </motion.div>
        </div>
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
        ><div className='font-medieval  text-lg'>
          <span className="text-3xl font-bold text-vintage-brown-text">Exotica</span>{" "}
                    stands as the cultural heartbeat of Espektro, showcasing a
                    rich tapestry of talents from KGEC's student body. This
                    segment immerses attendees in a{" "}
                    <span className="text-3xl font-bold text-vintage-brown-text">
                      captivating ambiance of music and dance, deeply
                    </span>{" "}
                    rooted in the college's cultural essence. Following the
                    student performances, Exotica ascends to new heights with
                    the renowned artists from across India gracing the stage.
                    Their emotive and masterful performances resonate deeply,
                    leaving an indelible impact on every listener. Through
                    Exotica, Espektro not only celebrates KGEC's cultural
                    heritage but also becomes a platform where local talent
                    harmoniously blends with national luminaries.</div>
        </motion.div>
      </div>
    </section>
  );
};

export default Exotica;
