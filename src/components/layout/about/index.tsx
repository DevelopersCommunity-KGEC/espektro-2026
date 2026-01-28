import React from 'react';
import EspektroAbout from './components/Espektro';
import Exotica from './components/Exotica';
import Quizine from './components/Quizine';
import Techtix from './components/Techtix';
import styles from './style.module.scss';
import AfterMovieSection from '../after-movie';
// import OutlinedHeading from '@/components-global/outlined-heading';
import OutlinedHeading from '../outlined-heading';
// import About24 from '../about-24-page/About24';
const AboutSection: React.FC = () => {
  return (
    <article id="espektro-about" className={styles.about__article}>
      <OutlinedHeading  label="Aftermovie" />
      <AfterMovieSection />
      <EspektroAbout />
      <Techtix />
      <Exotica />
      <Quizine/>
   {/* <About24 /> */}
    </article>
  );
};

export default AboutSection;
