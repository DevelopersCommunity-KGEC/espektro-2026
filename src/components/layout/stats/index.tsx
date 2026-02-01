"use client"

import { useRef } from "react";
import Timeline from './timeline';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// import OutlinedHeading from "@/components-global/outlined-heading";

import { useGSAP } from "@gsap/react";

import NumberAnimation from "../NumberAnimation";
import styles from "./style.module.scss";
import OutlinedHeading from "../outlined-heading";

gsap.registerPlugin(ScrollTrigger);

const Stats = () => {
//   const yearsData = [
//     {
//       year: "Pre",
//       title: "The Beginning",
//       description:
//         "The initial years set the tone with local talents, establishing Espektro as a cultural cornerstone. And also bringing international brands on the scene.",
//     },
//     {
//       year: 2016,
//       title: "Arabian Nights",
//       description: `A rising star graced the stage, leaving an indelible mark on the fest's history`,
//     },
//     {
//       year: 2017,
//       title: "A World Of Novels",
//       description:
//         "The fest expanded its horizons, featuring renowned artists and attracting attention beyond the college boundaries",
//     },
//     {
//       year: 2018,
//       title: "Ethos of Bengal",
//       description:
//         "Espektro reached new heights with an unforgettable performance by a nationally acclaimed artist",
//     },
//     {
//       year: 2019,
//       title: "A Blast From The Past",
//       description:
//         "International participation elevated the fest's global appeal, making it a must-attend event",
//     },
//     {
//       year: 2020,
//       title: "Rajatam Vardhanam",
//       description:
//         "Despite challenges, Espektro adapted to virtual platforms, maintaining its spirit and engaging a wider audience.and also completing 25 years of kgec",
//     },
//     {
//       year: 2023,
//       title: "The Khronic Odyssey",
//       description:
//         "A grand comeback marked the year, with the fest returning to its physical glory, featuring a blockbuster lineup that left the audience in awe",
//     },
//     {
//       year: 2024,
//       title: "Taksha-tatva Sanghra",
//       description:
//         "A Technological Symphony at Espektro ’24 is the theme for this year’s event, celebrating the transformative power of technology and its beautiful synergy with various aspects of our lives",
//     },
//     {
//       year: 2025,
//       title: "The Wonders Weave",
//       description:
//         "The Wonder Weave emphasizes the creation of a magical and wondrous experience through the intertwining of diverse talents, ideas, and disciplines. It's about showcasing the amazing things that happen when creativity and collaboration come together.",
//     },
//   ];
  const statistics = [
    {
      id: 1,
      title: "Footfall",
      count: 25,
      unit: "k+",
    },
    {
      id: 2,
      title: "Artists",
      count: 250,
      unit: "+",
    },
    {
      id: 3,
      title: "Events",
      count: 100,
      unit: "+",
    },
  ];

  // const yearListContainerRef = useRef<HTMLUListElement>(null);
  // useGSAP(() => {
  //   const yearWiseLists: gsap.TweenTarget[] = gsap.utils.toArray(
  //     ".statistics-yearwise-list"
  //   );
  //   yearWiseLists.forEach((yearList) => {
  //     gsap.from(yearList, {
  //       yPercent: 50,
  //       duration: 6,
  //       ease: "power1.out",
  //       scrollTrigger: {
  //         trigger: yearList as gsap.DOMTarget,
  //         start: "top-=100% 80%",
  //         end: () => "+=" + 100,
  //         scrub: true,
  //         // markers: true,
  //       },
  //     });
  //   });

  //   if (!yearListContainerRef.current) return;
  //   const listHeight = yearListContainerRef.current.clientHeight;
  //   const lastChild = yearListContainerRef.current.lastChild as HTMLElement;
  //   const lastChildHeight = lastChild.clientHeight;
  //   gsap.to("#year-wise-list-container", {
  //     css: {
  //       "--central-line-visibility": "visible",
  //       "--central-line-height": `100%`,
  //       "--last-child-height": `${lastChildHeight + 5}px`,
  //     },
  //     ease: "none",
  //     duration: 1,
  //     scrollTrigger: {
  //       trigger: "#year-wise-list-container",
  //       start: "top 80%",
  //       end: "+=" + listHeight,
  //       toggleActions: "play none none reset",
  //       // markers: true,
  //       scrub: true,
  //     },
  //   });

  //   gsap.from(".statistics-content", {
  //     y: 50,
  //     opacity: 0,
  //     duration: 0.6,
  //     ease: "power4.out",
  //     stagger: 0.08,
  //     scrollTrigger: {
  //       trigger: ".statistics-content",
  //       start: "top 80%",
  //       end: "+=100",
  //       toggleActions: "play none none reverse",
  //     },
  //   });
  // });

  return (
    <div id="espektro-past-stats" className={styles.stats_main_container}>
      <article className={styles.statistics__article}>
        <OutlinedHeading label="Statistics" theme="vintage" />
        <div className={styles.statistics__wrapper}>
          {statistics.map((stats) => {
            return (
              <div
                key={stats.id}
                className={`${styles.statistics__container} statistics-content`}
              >
                <h2 className="">
                  <NumberAnimation endValue={stats.count} unit={stats.unit} />
                </h2>
                <p>{stats.title}</p>
              </div>
            );
          })}
        </div>
      </article>
      {/* <div className={styles.content_list_container}>
        <OutlinedHeading label="Over Years" theme="vintage" />
        <div className={styles.year__list__wrapper}>
          <ul
            ref={yearListContainerRef}
            id="year-wise-list-container"
            className={styles.year__list__container}
          >
            {yearsData.map((details, idx) => (
              <YearStats
                key={idx}
                year={details.year as any}
                description={details.description}
                title={details.title}
              />
            ))}
          </ul>
        </div>
      </div> */}
      
      <Timeline />
    </div>
  );
};

interface YearStatsProps extends React.HTMLAttributes<HTMLLIElement> {
  year: number;
  title: string;
  description: string;
}
function YearStats({ year, title, description, ...props }: YearStatsProps) {
  return (
    <li {...props} className={`${styles.year__list} statistics-yearwise-list`}>
      <div className={styles.year__list__year__label}>
        <p>{year}</p>
      </div>
      <div className={styles.year__list__title}>
        <p>{title}</p>
      </div>
      <div className={styles.year__list__description}>
        <p>{description}</p>
      </div>
    </li>
  );
}

export default Stats;