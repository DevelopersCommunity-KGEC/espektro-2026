'use client'

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
      <OutlinedHeading label="Quixine" theme="vintage" />
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
              src="https://res.cloudinary.com/dlrlet9fg/image/upload/v1742327716/Quixine_web_poezry.png"
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
            <div className='w-[50%] h-full' >
            <img
              src="https://res.cloudinary.com/dlrlet9fg/image/upload/v1742327453/free_download_cliparts_of_witch_xgdwjx.png"
              alt="horizontal"
              className={styles.about_img}
            /></div>

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
            <div className='w-[50%] h-full' >
            {/* <img
              src="https://res.cloudinary.com/dlrlet9fg/image/upload/v1742327453/free_download_cliparts_of_witch_xgdwjx.png"
              alt="horizontal"
              className={styles.about_img}
            /> */}
            </div>
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
          {/* <span className="text-3xl font-bold text-amber-200">Exotica</span>{" "}
                    stands as the cultural heartbeat of Espektro, showcasing a
                    rich tapestry of talents from KGEC's student body. This
                    segment immerses attendees in a{" "}
                    <span className="text-3xl font-bold text-amber-200">
                      captivating ambiance of music and dance, deeply
                    </span>{" "}
                    rooted in the college's cultural essence. Following the
                    student performances, Exotica ascends to new heights with
                    the renowned artists from across India gracing the stage.
                    Their emotive and masterful performances resonate deeply,
                    leaving an indelible impact on every listener. Through
                    Exotica, Espektro not only celebrates KGEC's cultural
                    heritage but also becomes a platform where local talent
                    harmoniously blends with national luminaries. */}


                    <span className="text-3xl font-bold text-vintage-brown-text">Quixine</span>{" "}
                    awaits, promising a{" "}
                    <span className="text-3xl font-bold text-vintage-brown-text">gastronomic haven</span>{" "}
                    that will ignite your senses and elevate your culinary
                    experience. Prepare to embark on a journey through a myriad
                    of flavors and culinary marvels,{" "}
                    <span className="text-3xl font-bold text-vintage-brown-text">
                      where every bite tells a story and every dish is a
                      masterpiece
                    </span>{" "}
                    in its own right. Immerse yourself in a world of excitement
                    as Quixine hosts exhilarating culinary contests, inviting
                    you to showcase your skills and creativity in the kitchen.
                    Whether you're a seasoned chef or an aspiring{" "}
                    <span className="text-3xl font-bold text-vintage-brown-text">home cook</span>, there's
                    something for everyone to savor and enjoy.
                    <br />
                    Join us at Quixine and discover the true essence of culinary
                    artistry. Your taste buds will thank you for this
                    unforgettable experience!</div>
        </motion.div>
      </div>
    </section>
  );
};

export default Exotica;
