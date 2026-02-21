"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import styles from './clubs.module.scss';
import { clubLogos as CLUBS } from '@/data/landing-content';

export default function ClubsSection() {
    return (
        <section id="clubs" className={`${styles.clubs_section} relative z-10`} style={{ backgroundColor: "#FFF8F0" }}>
            {/* Lotus Mandala Background - Centered and Subtle */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.08] pointer-events-none">
                <Image
                    src="/images/360_F_1706070199_WZV67PDH1xx2nGjbDWR2M7U3bc4CsQi8.webp"
                    alt="Decorative lotus mandala"
                    width={800}
                    height={600}
                    className="object-contain"
                />
            </div>

            {/* Global Vertical Pattern Alignment */}
            <div
                className="absolute top-0 left-0 bottom-0 w-16 md:w-24 overflow-hidden hidden sm:block z-60"
                style={{
                    backgroundImage: 'url(/images/43a0b75b3caae95caa70550adda8ed60.webp)',
                    backgroundRepeat: 'repeat-y',
                    backgroundSize: '100% auto',
                    backgroundPosition: 'top center'
                }}
            />

            <motion.div
                className="container mx-auto px-6 lg:px-24 pl-4 sm:pl-20 md:pl-28 lg:pl-32 relative z-10"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={{
                    hidden: { opacity: 0 },
                    visible: {
                        opacity: 1,
                        transition: {
                            staggerChildren: 0.1,
                            delayChildren: 0.1
                        }
                    }
                }}
            >
                <div className="flex flex-col items-center mb-12">
                    <motion.h3
                        className="text-lg md:text-xl text-[#8B2635] tracking-wide mb-3 font-medium uppercase font-[family-name:var(--font-roboto-slab)] text-center"
                        variants={{
                            hidden: { opacity: 0, y: 10 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
                        }}
                    >
                        Our Community
                    </motion.h3>
                    <motion.h2
                        className="text-5xl md:text-6xl lg:text-7xl text-[#2C1810] mb-6 leading-[1.1] font-[family-name:var(--font-medieval-sharp)] text-center flex flex-wrap justify-center overflow-hidden"
                        variants={{
                            hidden: { opacity: 0 },
                            visible: {
                                opacity: 1,
                                transition: { staggerChildren: 0.04 }
                            }
                        }}
                    >
                        {"KGEC ".split("").map((char, i) => (
                            <motion.span
                                key={`kgec-${i}`}
                                variants={{
                                    hidden: { opacity: 0, y: 40 },
                                    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.33, 1, 0.68, 1] } }
                                }}
                            >
                                {char === " " ? "\u00A0" : char}
                            </motion.span>
                        ))}
                        <span className="text-[#B7410E] flex">
                            {"Clubs".split("").map((char, i) => (
                                <motion.span
                                    key={`clubs-${i}`}
                                    variants={{
                                        hidden: { opacity: 0, y: 40 },
                                        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.33, 1, 0.68, 1] } }
                                    }}
                                >
                                    {char}
                                </motion.span>
                            ))}
                        </span>
                    </motion.h2>
                </div>

                <motion.div
                    className={styles.clubs_grid}
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: {
                                staggerChildren: 0.05
                            }
                        }
                    }}
                >
                    {CLUBS.map((club) => (
                        <ClubItem key={club.id} club={club} />
                    ))}
                </motion.div>
            </motion.div>
        </section>
    );
}

function ClubItem({ club }: { club: any }) {
    return (
        <motion.div
            className={styles.club_item}
            variants={{
                hidden: { opacity: 0, scale: 0.8, y: 20 },
                visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5 } }
            }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
            <a href={club.social_link} target="_blank" rel="noopener noreferrer">
                <div className={styles.img_container}>
                    <Image
                        src={club.image}
                        alt={club.name}
                        width={120}
                        height={120}
                        className="object-contain"
                    />
                </div>
                <p>{club.name}</p>
            </a>
        </motion.div>
    );
}
