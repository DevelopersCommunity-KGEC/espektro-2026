"use client";

import { useRef } from 'react';
import styles from './about-v2.module.scss';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ASSETS = {
    BORDER_SIDE: "https://res.cloudinary.com/dlxpcyiin/image/upload/v1770840857/acceeec5cca8bcd386d1ccf3692c9947-removebg-preview_ja16p2.png",
    CENTER_DECOR: "https://res.cloudinary.com/dlxpcyiin/image/upload/v1770841101/b5de07a807fe30f3bb20a1ca2f2bb61f_q1mxom.png",
    // BOTTOM_BIRDS: "https://res.cloudinary.com/dlxpcyiin/image/upload/v1770841097/birds_fxvslb.png"
};

const AboutV2 = () => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const techtixRef = useRef<HTMLDivElement>(null);
    const exoticaRef = useRef<HTMLDivElement>(null);
    const quizineRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        // Desktop check: only run complex stacking animation on larger screens
        const isDesktop = window.innerWidth > 768;
        
        if (!isDesktop) return; // Exit if mobile, let CSS handle natural flow

        const tl = gsap.timeline({
            defaults: { ease: "none" }
        });

        // --- STACKING SETUP ---
        // Initially set sections off-screen using yPercent (Reliable)
        // Techtix stays at 0
        gsap.set(exoticaRef.current, { yPercent: 100 }); 
        gsap.set(quizineRef.current, { yPercent: 200 }); // Further down to prevent early overlap

        // --- MAIN SCROLL SEQUENCE ---
        tl.to(exoticaRef.current, {
            yPercent: 0,
            duration: 1
        })
        .to(quizineRef.current, {
            yPercent: 0,
            duration: 1
        });

        // Pin the wrapper while the sequence plays
        ScrollTrigger.create({
            animation: tl,
            trigger: wrapperRef.current,
            start: 'top top',
            end: '+=300%', // Scroll distance: 100% per slide roughly
            scrub: true,
            pin: true,
            anticipatePin: 1,
        });

        // --- INTERNAL ANIMATIONS (Text & Images) ---
        // Helper to get children safely
        const getChildren = (element: HTMLElement | null, isCollage: boolean) => {
            if (!element) return [];
            const contentWrapper = element.children[4]; // 4th index because of 4 decor images before it
            if(!contentWrapper) return [];
            return isCollage 
                ? contentWrapper.children[1]?.children[0]?.children || [] 
                : contentWrapper.children[0]?.children || [];
        };

        // Internal Animation Timelines (triggered when the specific section arrives)
        // Note: Using containerAnimation property of ScrollTrigger might be cleaner, 
        // but simple triggers work if we account for the pinning.
        
        // Techtix Internal
        const techtixTl = gsap.timeline({
            scrollTrigger: {
                trigger: techtixRef.current,
                start: 'top center',
                toggleActions: 'play none none reverse'
            }
        });
        
        // Techtix Images
        gsap.utils.toArray(getChildren(techtixRef.current, true)).forEach((el, index) => {
            gsap.set(el as HTMLElement, { y: `${index * 30}px` }); // reduced stagger offset
            techtixTl.fromTo((el as HTMLElement).children, { x: '-120%', scale: 1.1 }, { x: '0%', scale: 1, duration: 0.6 }, 0);
        });
        // Techtix Text
        techtixTl.fromTo(getChildren(techtixRef.current, false), { opacity: 0, y: 30 }, { opacity: 1, y: 0, stagger: 0.1, duration: 0.6 }, 0.2);


        // Exotica Internal (Triggered when Exotica comes into view)
        // We link this to the main timeline progress or use the section as trigger
        // Since Exotica is moving via transform, standard ScrollTrigger might miss it.
        // It's safer to attach these internal animations to the main `tl` directly or rely on the visual entry.
        
    }, { scope: wrapperRef }); // Scope ensures clean cleanup

    return (
        <div className={styles.wrapper} ref={wrapperRef}>
            <div className={styles.main_container}>
                
                {/* Techtix Section */}
                <div className={`${styles.section_container} ${styles.techtix_section}`} ref={techtixRef}>
                    <img src={ASSETS.BORDER_SIDE} className={styles.decor_border_left} alt="" />
                    <img src={ASSETS.BORDER_SIDE} className={styles.decor_border_right} alt="" />
                    <img src={ASSETS.CENTER_DECOR} className={styles.decor_center} alt="" />
                    {/* <img src={ASSETS.BOTTOM_BIRDS} className={styles.decor_bottom} alt="" /> */}

                    <div className={styles.content_wrapper}>
                        <div className={styles.description_side}>
                            <p className={styles.section_label}>Technical Excellence</p>
                            <h2 className={styles.section_title}>Techtix</h2>
                            <p className={styles.section_description}>
                                The technical heartbeat of Espektro where innovation meets competition. 
                                Experience cutting-edge technology through coding marathons and tech showcases.
                            </p>
                            <p className={styles.section_description}>
                                From AI workshops to hackathons, Techtix brings together the brightest minds.
                            </p>
                        </div>
                        <div className={styles.collage_side}>
                            <div className={styles.grid_collage}>
                                <div className={`${styles.grid_item} ${styles.item_1}`}><img src="/images/artist-2.jpg" alt="" /></div>
                                <div className={`${styles.grid_item} ${styles.item_2}`}><img src="/images/kolkata-monochrome.jpeg" alt="" /></div>
                                <div className={`${styles.grid_item} ${styles.item_3}`}><img src="/images/artist-3.jpg" alt="" /></div>
                                <div className={`${styles.grid_item} ${styles.item_4}`}><img src="/images/timeline.jpg" alt="" /></div>
                                <div className={`${styles.grid_item} ${styles.item_5}`}><img src="/images/bengali-culture.jpeg" alt="" /></div>
                                <div className={`${styles.grid_item} ${styles.item_6}`}><img src="/images/kolkata-city.jpeg" alt="" /></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Exotica Section */}
                <div className={`${styles.section_container} ${styles.exotica_section}`} ref={exoticaRef}>
                    <img src={ASSETS.BORDER_SIDE} className={styles.decor_border_left} alt="" />
                    <img src={ASSETS.BORDER_SIDE} className={styles.decor_border_right} alt="" />
                    <img src={ASSETS.CENTER_DECOR} className={styles.decor_center} alt="" />
                    {/* <img src={ASSETS.BOTTOM_BIRDS} className={styles.decor_bottom} alt="" /> */}

                    <div className={styles.content_wrapper}>
                        <div className={styles.description_side}>
                            <p className={styles.section_label}>Cultural Celebration</p>
                            <h2 className={styles.section_title}>Exotica</h2>
                            <p className={styles.section_description}>
                                A celebration of culture and artistry where tradition meets contemporary expression. 
                            </p>
                            <p className={styles.section_description}>
                                From classical performances to modern interpretations, Exotica is a vibrant tapestry.
                            </p>
                        </div>
                        <div className={styles.collage_side}>
                            <div className={`${styles.grid_collage} ${styles.grid_exotica}`}>
                                <div className={`${styles.grid_item} ${styles.exotica_item_1}`}><img src="/images/artist-4.jpg" alt="" /></div>
                                <div className={`${styles.grid_item} ${styles.exotica_item_2}`}><img src="/images/bengali-culture.jpeg" alt="" /></div>
                                <div className={`${styles.grid_item} ${styles.exotica_item_3}`}><img src="/images/india-culture.jpeg" alt="" /></div>
                                <div className={`${styles.grid_item} ${styles.exotica_item_4}`}><img src="/images/kolkata-city.jpeg" alt="" /></div>
                                <div className={`${styles.grid_item} ${styles.exotica_item_5}`}><img src="/images/artist-1.jpg" alt="" /></div>
                                <div className={`${styles.grid_item} ${styles.exotica_item_6}`}><img src="/images/kolkata-monochrome.jpeg" alt="" /></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quizine Section */}
                <div className={`${styles.section_container} ${styles.quizine_section}`} ref={quizineRef}>
                    <img src={ASSETS.BORDER_SIDE} className={styles.decor_border_left} alt="" />
                    <img src={ASSETS.BORDER_SIDE} className={styles.decor_border_right} alt="" />
                    <img src={ASSETS.CENTER_DECOR} className={styles.decor_center} alt="" />
                    {/* <img src={ASSETS.BOTTOM_BIRDS} className={styles.decor_bottom} alt="" /> */}

                    <div className={styles.content_wrapper}>
                        <div className={styles.description_side}>
                            <p className={styles.section_label}>Mind Games</p>
                            <h2 className={styles.section_title}>Quizine</h2>
                            <p className={styles.section_description}>
                                The ultimate battleground for knowledge enthusiasts and quiz aficionados.
                            </p>
                            <p className={styles.section_description}>
                                Engage in thrilling quiz competitions that will put your knowledge to the test.
                            </p>
                        </div>
                        <div className={styles.collage_side}>
                            <div className={`${styles.grid_collage} ${styles.grid_quizine}`}>
                                <div className={`${styles.grid_item} ${styles.quizine_item_1}`}><img src="/images/india-culture.jpeg" alt="" /></div>
                                <div className={`${styles.grid_item} ${styles.quizine_item_2}`}><img src="/images/artist-1.jpg" alt="" /></div>
                                <div className={`${styles.grid_item} ${styles.quizine_item_3}`}><img src="/images/timeline.jpg" alt="" /></div>
                                <div className={`${styles.grid_item} ${styles.quizine_item_4}`}><img src="/images/artist-2.jpg" alt="" /></div>
                                <div className={`${styles.grid_item} ${styles.quizine_item_5}`}><img src="/images/kolkata-city.jpeg" alt="" /></div>
                                <div className={`${styles.grid_item} ${styles.quizine_item_6}`}><img src="/images/artist-3.jpg" alt="" /></div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AboutV2;