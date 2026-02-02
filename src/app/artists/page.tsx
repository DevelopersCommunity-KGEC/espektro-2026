"use client"

import { useRef } from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// import highway from "@/assets/highway_final.jpg";
// import papon from "@/assets/papon_final.jpeg";
import OutlinedHeading from "@/components/layout/outlined-heading";
import { useGSAP } from "@gsap/react";

import { ARTIST_DATA } from "./artist_data";
import styles from "./style.module.scss";

import ComingSoonDotsComponent from "../../components/layout/coming-soon-dots";

gsap.registerPlugin(ScrollTrigger);

const ArtistSection = () => {
  const mainContentRef = useRef<HTMLDivElement>(null);
  const galleryContainerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const imgitems = Array.from(
      galleryContainerRef.current?.children || []
    ).flatMap((item) => Array.from(item.querySelectorAll("img")));

    imgitems.forEach((item) => {
      item.onmouseenter = (e) => {
        gsap.to(e.target, {
          scale: 1.1,
          ease: "power4.out",
        });
      };
      item.onmouseleave = (e) => {
        gsap.to(e.target, {
          scale: 1,
          ease: "power4.out",
        });
      };
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: mainContentRef.current || undefined,
        start: "top 70%",
        end: "bottom bottom",
        toggleActions: "play none none reverse",
        // markers: true,
      },
    });

    tl.from(imgitems, {
      opacity: 0,
      x: "-100%",
      ease: "power2.out",
    });
  });

  return (
    <div
      className={styles.main_container}
      ref={mainContentRef}
      id="espektro-past-artists"
    >
      <OutlinedHeading label="Pronites" />

      {/* <div className={styles.special__container}>
        <div className="relative">
          <img src={papon} alt="" />
          <div
            className={
              `absolute bottom-0 backdrop-blur-sm w-full text-2xl text-text-light` +
              `${styles.text__image__container}`
            }
          >
            <p>Papon</p>
            <p>24th March</p>
          </div>
        </div>
        <div className="relative">
          <img src={highway} alt="" />
          <div
            className={
              `absolute bottom-0 backdrop-blur-sm w-full text-2xl text-text-light` +
              `${styles.text__image__container}`
            }
          >
            <p>Highway</p>
            <p>23rd March</p>
          </div>
        </div>
      </div> */}
      {/* <OutlinedHeading label="Coming Soon" /> */}
      {/* <AnimatedHeadingV2 heading='Coming Soon' variant='light' /> */}

      {/* <div className={styles.cardSection}>
        {/* <div className={styles.cardContainer}>
          <div className={styles.card}>
            <div className={styles.imgContent}>
                <img src={papon} alt="" />
            </div>
            {/* <div className={styles.content}>
              <p className={styles.heading}>Card Hover</p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipii
                voluptas ten mollitia pariatur odit, ab
                minus ratione adipisci accusamus vel est excepturi laboriosam magnam
                necessitatibus dignissimos molestias.
              </p>
            </div> 
          </div>
        </div>
        <div className={styles.cardContainer}>
          <div className={styles.card}>
            <div className={styles.imgContent}>
              <img src={highway} alt="" />
            </div>
            {/* <div className={styles.content}>
              <p className={styles.heading}>Card Hover</p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipii
                voluptas ten mollitia pariatur odit, ab
                minus ratione adipisci accusamus vel est excepturi laboriosam magnam
                necessitatibus dignissimos molestias.
              </p>
            </div> 
          </div>
        </div> 
      </div> */}

      <h1 className="text-4xl text-center font-bold text-text-light py-24">
         Coming Soon
        <div className={styles.coming__soon}>
          <ComingSoonDotsComponent/>
        </div>
      </h1>

      <div className="w-full py-32">
        <OutlinedHeading label="Past Artists" />
      </div>
      <div className={styles.main_gallery} ref={galleryContainerRef}>
        {ARTIST_DATA.map((item, index) => {
          return <ArtistCard key={index} id={item.id} imageUrl={item.url} />;
        })}
      </div>
    </div>
  );
};
function ArtistCard({ id, imageUrl }: { id: string; imageUrl: string }) {
  return (
    <div aria-label={id} key={id} className="">
      <img src={imageUrl} alt="" />
    </div>
  );
}
export default ArtistSection;
