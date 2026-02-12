"use client";

import React from 'react';
import Image from 'next/image';
import styles from './clubs.module.scss';
import { clubLogos as CLUBS } from '@/data/landing-content';

export default function ClubsSection() {
    const midIndex = Math.ceil(CLUBS.length / 2);
    const row1 = CLUBS.slice(0, midIndex);
    const row2 = CLUBS.slice(midIndex);

    const marqueeRow1 = [...row1, ...row1, ...row1, ...row1];
    const marqueeRow2 = [...row2, ...row2, ...row2, ...row2];

    return (
        <section id="clubs" className={`${styles.clubs_section} relative z-10`} style={{ position: 'relative' }}>
            {/* Decorative side borders */}
            <img
                src="/border.svg"
                alt=""
                aria-hidden="true"
                className="absolute top-0 left-0 bottom-0 h-full w-[60px] md:w-[80px] object-cover pointer-events-none z-[5] opacity-60 hidden lg:block"
            />
            <img
                src="/border.svg"
                alt=""
                aria-hidden="true"
                className="absolute top-0 right-0 bottom-0 h-full w-[60px] md:w-[80px] object-cover pointer-events-none z-[5] opacity-60 hidden lg:block scale-x-[-1]"
            />
            <div className="container mx-auto px-6 lg:px-24">
                <div className={styles.clubs_header}>
                    <p>Our Community</p>
                    <h2 className="font-serif">KGEC Clubs &amp; Societies</h2>
                </div>
            </div>

            <div className={styles.clubs_marquee_container}>
                <div className={styles.marquee_row}>
                    <div className={`${styles.marquee_inner} ${styles.left}`}>
                        {marqueeRow1.map((club, index) => (
                            <ClubItem key={`r1-${club.id}-${index}`} club={club} />
                        ))}
                    </div>
                </div>

                <div className={styles.marquee_row}>
                    <div className={`${styles.marquee_inner} ${styles.right}`}>
                        {marqueeRow2.map((club, index) => (
                            <ClubItem key={`r2-${club.id}-${index}`} club={club} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function ClubItem({ club }: { club: any }) {
    return (
        <div className={styles.club_item}>
            <a href={club.social_link} target="_blank" rel="noopener noreferrer">
                <div className={styles.img_container}>
                    <Image src={club.image} alt={club.name} width={80} height={80} className="object-contain" />
                </div>
                <p>{club.name}</p>
            </a>
        </div>
    );
}
