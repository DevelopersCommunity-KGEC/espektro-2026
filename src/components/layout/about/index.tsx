'use client'

import React from 'react';
import QuiXinePage from '@/components/test/events';
import styles from './style.module.scss';
import AfterMovieSection from '../after-movie';
// import OutlinedHeading from '@/components-global/outlined-heading';
import OutlinedHeading from '../outlined-heading';
// import About24 from '../about-24-page/About24';
const AboutSection: React.FC = () => {
  return (
    <article id="espektro-about" className={styles.about__article}>
      <OutlinedHeading label="Aftermovie" />
      <AfterMovieSection />
      <QuiXinePage />
      {/* <About24 /> */}
    </article>
  );
};

export default AboutSection;
