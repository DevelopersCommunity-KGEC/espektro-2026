"use client";

import styles from './animated-heading-v2.module.scss';
import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface AnimatedHeadingV2Props {
    heading: string;
    variant: 'light' | 'dark';
}

const AnimatedHeadingV2 = (props: AnimatedHeadingV2Props) => {
    const headingRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        gsap.from(textRef.current, {
            opacity: 0,
            duration: 0.5,
            y: 30,
            ease: "easeInOut",
            scrollTrigger: {
                trigger: headingRef.current,
                start: "top 50%",
                end: "+=100",
                toggleActions: "play none none reverse"
            }
        });
    });

    return (
        <div className={styles.heading_container} ref={headingRef}>
            <div>
                <h1 ref={textRef} style={props.variant === 'dark' ? { color: '#201d38' } : {}}>
                    {props.heading}
                </h1>
            </div>
        </div>
    );
};

export default AnimatedHeadingV2;
