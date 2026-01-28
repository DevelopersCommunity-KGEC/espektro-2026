"use client"

import { useRef, useState, useEffect, useMemo } from 'react';
import styles from './style.module.scss';
import { events_data } from './events_data';
import { motion, AnimatePresence } from 'framer-motion';

const Gallery = () => {
    // Ensure we have at least 35 items by repeating the data if necessary
    const galleryItems = Array.from({ length: 35 }).map((_, i) => {
        return events_data[i % events_data.length];
    });

    // Generate deterministic random delays for the animation
    const randomDelays = useMemo(() => {
        return Array.from({ length: 35 }).map(() => Math.random() * 2.5);
    }, []);

    const containerRef = useRef(null);
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect(); // Only animate once
                }
            },
            { threshold: 0.1 } // Trigger when 10% visible
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => {
            if (containerRef.current) observer.unobserve(containerRef.current);
        };
    }, []);

    // Mobile: Split items into 3 rows
    const chunkSize = Math.ceil(galleryItems.length / 3);
    const row1 = galleryItems.slice(0, chunkSize);
    const row2 = galleryItems.slice(chunkSize, chunkSize * 2);
    const row3 = galleryItems.slice(chunkSize * 2);

    // Helper to duplicate for infinite scroll
    const renderRow = (items: any[], direction: string) => (
        <div className={styles.scrollTrack} style={{ animationDirection: direction }}>
            {/* Duplicate items for seamless loop */}
            {[...items, ...items, ...items].map((item, i) => (
                <div key={i} className={styles.mobileItem}>
                    <img src={item.image} alt={item.event_name} />
                </div>
            ))}
        </div>
    );

    return (
        <>
            {/* Desktop/Tablet View */}
            <div className={styles.galleryContainer} ref={containerRef}>
                <AnimatePresence>
                    {galleryItems.map((item, index) => (
                        <motion.div
                            key={index}
                            layout
                            initial={{
                                opacity: 0,
                                scale: 0.8
                            }}
                            animate={
                                isInView
                                    ? { opacity: 1, scale: 1, zIndex: 1 }
                                    : { opacity: 0, scale: 0.8, zIndex: 0 }
                            }
                            transition={{
                                duration: 0.8,
                                ease: "easeOut",
                                delay: randomDelays[index]
                            }}
                            whileHover={{
                                scale: 1.05,
                                zIndex: 100,
                                borderColor: "rgba(255, 255, 255, 0.5)",
                                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.7)"
                            }}
                            className={`${styles.galleryItem} ${styles[`item${index + 1}`]}`}
                            style={{
                                zIndex: index === 0 ? 50 : undefined
                            }}
                        >
                            <img src={item.image} alt={item.event_name} />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Mobile View */}
            <div className={styles.mobileGallery}>
                <div className={styles.mobileRow}>
                    {renderRow(row1, 'normal')}
                </div>
                <div className={styles.mobileRow}>
                    {renderRow(row2, 'reverse')}
                </div>
                <div className={styles.mobileRow}>
                    {renderRow(row3, 'normal')}
                </div>
            </div>
        </>
    );
};

export default Gallery;
