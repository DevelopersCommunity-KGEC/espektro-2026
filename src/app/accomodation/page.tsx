"use client";

// import Espektrologo from '@/components-global/espektro-animated-logo/Espektrologo';
import OutlinedHeading from '@/components/layout/outlined-heading';
import styles from './style.module.scss';
import Accordion from '@/components/layout/accomodationComponents/Accordion/Accordion';
import Info from '@/components/layout/accomodationComponents/Info/Info';
import Button from '@/components/layout/accomodationComponents/Button/Button';
import { Instruction } from '@/components/layout/accomodationComponents/Instruction/Instruction';
import { useState } from "react";

function accomodation() {
  const [searchData] = useState([]);

  return (
    <section className={styles.accommodation__page}>
      {/* <div className={styles.logo__wrapper}>
          <Espektrologo />
        </div> */}
      <OutlinedHeading label="Accommodation" theme="vintage" />
      <Instruction />
      <Button />
      <Info />
      <Accordion filterBySearch={searchData} />
    </section>
  );
}

export default accomodation;