"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { pastArtists } from "@/data/landing-content";
import styles from "./cultural-illustrations.module.scss";

export function CulturalIllustrations() {
  const plane1 = useRef<HTMLDivElement>(null);
  const plane2 = useRef<HTMLDivElement>(null);
  const plane3 = useRef<HTMLDivElement>(null);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  let requestAnimationFrameId: number | null = null;
  let xForce = 0;
  let yForce = 0;
  const easing = 0.08;
  const speed = 0.002;

  const manageMouseMove = (e: React.MouseEvent) => {
    const { movementX, movementY } = e;
    xForce += movementX * speed;
    yForce += movementY * speed;

    if (requestAnimationFrameId === null) {
      requestAnimationFrameId = requestAnimationFrame(animate);
    }
  };

  const lerp = (start: number, target: number, amount: number) =>
    start * (1 - amount) + target * amount;

  const animate = () => {
    xForce = lerp(xForce, 0, easing);
    yForce = lerp(yForce, 0, easing);

    if (plane1.current) gsap.set(plane1.current, { x: `+=${xForce}`, y: `+=${yForce}` });
    if (plane2.current) gsap.set(plane2.current, { x: `+=${xForce * 0.5}`, y: `+=${yForce * 0.5}` });
    if (plane3.current) gsap.set(plane3.current, { x: `+=${xForce * 0.25}`, y: `+=${yForce * 0.25}` });

    if (Math.abs(xForce) < 0.001) xForce = 0;
    if (Math.abs(yForce) < 0.001) yForce = 0;

    if (xForce !== 0 || yForce !== 0) {
      requestAnimationFrameId = requestAnimationFrame(animate);
    } else {
      requestAnimationFrameId = null;
    }
  };

  useEffect(() => {
    return () => {
      if (requestAnimationFrameId) cancelAnimationFrame(requestAnimationFrameId);
    };
  }, [requestAnimationFrameId]);

  const p1Images = pastArtists.slice(0, 6);
  const p2Images = pastArtists.slice(6, 11);
  const p3Images = pastArtists.slice(11, 16);

  const configs = [
    /* 0 */ { top: "10%", left: "10%", w: 220, h: 220 },   /* 1 */ { bottom: "18%", left: "18%", w: 180, h: 220 },
    /* 2 */ { top: "20%", right: "18%", w: 180, h: 220 },  /* 3 */ { bottom: "18%", right: "18%", w: 180, h: 220 },
    /* 4 */ { top: "48%", left: "10%", w: 160, h: 200 },  /* 5 */ { top: "48%", right: "22%", w: 160, h: 200 },

    /* 6 */ { top: "15%", left: "34%", w: 200, h: 200 },   /* 7 */ { top: "15%", right: "42%", w: 130, h: 160 },
    /* 8 */ { bottom: "15%", left: "42%", w: 130, h: 160 },/* 9 */ { bottom: "15%", right: "42%", w: 130, h: 160 },
    /* 10 */ { bottom: "28%", left: "50%", w: 130, h: 160 },

    /* 11 */ { top: "25%", left: "15%", w: 200, h: 200 }, /* 12 */ { top: "32%", right: "32%", w: 100, h: 130 },
    /* 13 */ { bottom: "42%", left: "32%", w: 200, h: 200 },/* 14 */ { bottom: "32%", right: "32%", w: 100, h: 130 },
    /* 15 */ { top: "32%", left: "50%", w: 100, h: 130 }
  ];

  return (
    <>
      <section
        onMouseMove={manageMouseMove}
        className={styles.gallerySection}
      >

        <div className={styles.bgContainer}>
          <Image
            src="/images/kolkata-city.webp"
            alt=""
            fill
            className={styles.bgImage}
            sizes="100vw"
          />
        </div>

        <div className={styles.titleContainer}>
          <p>THE SPIRIT OF BENGAL</p>
          <h2>A Culture That<br /><span>Breathes Art</span></h2>
        </div>

        <div ref={plane1} className={`${styles.plane} ${styles.plane1}`}>
          {p1Images.map((artist, idx) => (
            <div
              key={artist.id}
              className={styles.imgWrap}
              style={{ top: configs[idx].top, left: configs[idx].left, right: configs[idx].right, bottom: configs[idx].bottom }}
              onClick={() => setSelectedImg(artist.url)}
            >
              <div className={styles.indexLabel}>{idx}</div>
              <Image src={artist.url} alt="Artist" width={configs[idx].w} height={configs[idx].h} />
            </div>
          ))}
        </div>

        <div ref={plane2} className={`${styles.plane} ${styles.plane2}`}>
          {p2Images.map((artist, idx) => (
            <div
              key={artist.id}
              className={styles.imgWrap}
              style={{ top: configs[idx + 6].top, left: configs[idx + 6].left, right: configs[idx + 6].right, bottom: configs[idx + 6].bottom }}
              onClick={() => setSelectedImg(artist.url)}
            >
              <div className={styles.indexLabel}>{idx + 6}</div>
              <Image src={artist.url} alt="Artist" width={configs[idx + 6].w} height={configs[idx + 6].h} />
            </div>
          ))}
        </div>

        <div ref={plane3} className={`${styles.plane} ${styles.plane3}`}>
          {p3Images.map((artist, idx) => (
            <div
              key={artist.id}
              className={styles.imgWrap}
              style={{ top: configs[idx + 11].top, left: configs[idx + 11].left, right: configs[idx + 11].right, bottom: configs[idx + 11].bottom }}
              onClick={() => setSelectedImg(artist.url)}
            >
              <div className={styles.indexLabel}>{idx + 11}</div>
              <Image src={artist.url} alt="Artist" width={configs[idx + 11].w} height={configs[idx + 11].h} />
            </div>
          ))}
        </div>
      </section>

      {selectedImg && (
        <div className={styles.modalOverlay} onClick={() => setSelectedImg(null)}>
          <Image src={selectedImg} alt="Fullscreen artist" fill className="object-contain" sizes="100vw" />
        </div>
      )}
    </>
  );
}
