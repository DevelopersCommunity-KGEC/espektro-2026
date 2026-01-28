"use client"

import React from "react";
import ReactPlayer from 'react-youtube';

import styles from "./styles.module.scss";

function AfterMovieSection(): React.JSX.Element {


  return (
    <section className={styles.after__movie__section__container}>
      <div className="w-full h-full flex justify-center items-center">
      {/* <ReactPlayer url='https://www.youtube.com/watch?v=gy9v5iKmV-I'  playing={true} muted /> */}
      {/* <ReactPlayer
          url='https://www.youtube.com/watch?v=gy9v5iKmV-I'
          className={styles.react__player}
          playing={true}
          muted
          width="100%"
          height="100%"
        /> */}
      </div>
    </section>
  );
}

export default AfterMovieSection;
