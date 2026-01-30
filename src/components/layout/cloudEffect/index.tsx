"use client"

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import styles from "./style.module.scss";

interface CloudEffectProps {
    startAnimation: boolean;
    onComplete: () => void;
}

const CloudEffect: React.FC<CloudEffectProps> = ({ startAnimation, onComplete }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const leftPanelRef = useRef<HTMLDivElement>(null);
    const rightPanelRef = useRef<HTMLDivElement>(null);
    const centerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (startAnimation) {
            const tl = gsap.timeline({
                onComplete: () => {
                    if (containerRef.current) {
                        containerRef.current.style.display = 'none';
                    }
                    onComplete();
                }
            });

            // Sequence:
            // 1. Fade out the artificial center filler rapidly (it's just there to plug gaps)
            // 2. Move panels apart slowly

            tl.to(centerRef.current, {
                duration: 1.0,
                opacity: 0,
                ease: "power2.in"
            }, 0);

            tl.to(leftPanelRef.current, {
                duration: 4.5,
                x: "-100%",
                ease: "power2.inOut",
            }, 0.2);

            tl.to(rightPanelRef.current, {
                duration: 4.5,
                x: "100%",
                ease: "power2.inOut",
            }, 0.2);

            // Parallax text/content inside could also move?
            // Optional: fade container at the very end to be sure
            tl.to(containerRef.current, {
                duration: 0.5,
                autoAlpha: 0
            }, "-=0.5");
        }
    }, [startAnimation, onComplete]);

    return (
        <div ref={containerRef} className={styles.cloudContainer}>
            {/* Center filler to block any tiny light gaps at the seam initially */}
            <div ref={centerRef} className={styles.centerFiller} />

            <div ref={leftPanelRef} className={`${styles.cloudPanel} ${styles.leftPanel}`}>
                <img
                    src="/assets/cloud_texture.png"
                    alt="Cloud Texture"
                    className={`${styles.cloudImage} ${styles.textureAnim}`}
                    style={{ left: '-10%' }} // Shift texture slightly
                />
                {/* Second layer for depth */}
                <img
                    src="/assets/cloud_texture.png"
                    alt="Cloud depth"
                    className={`${styles.cloudImage}`}
                    style={{ opacity: 0.5, mixBlendMode: 'overlay', transform: 'scale(1.5)' }}
                />
            </div>

            <div ref={rightPanelRef} className={`${styles.cloudPanel} ${styles.rightPanel}`}>
                <img
                    src="/assets/cloud_texture.png"
                    alt="Cloud Texture"
                    className={`${styles.cloudImage} ${styles.textureAnim}`}
                    style={{ left: '-40%', animationDelay: '-5s' }} // Offset texture to look different
                />
                <img
                    src="/assets/cloud_texture.png"
                    alt="Cloud depth"
                    className={`${styles.cloudImage}`}
                    style={{ opacity: 0.4, mixBlendMode: 'overlay', transform: 'scale(1.3) rotate(180deg)', left: '-20%' }}
                />
            </div>
        </div>
    );
};

export default CloudEffect;
