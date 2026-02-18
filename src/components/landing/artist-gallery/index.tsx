"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { pastArtists } from "@/data/landing-content";
import styles from "./artist-gallery.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function ArtistGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!gridRef.current || !containerRef.current) return;

    const gridItems = gridRef.current.querySelectorAll(`.${styles.rowItem}`);

    if (isMobile) {
      // Mobile: Simple alternating column animation
      const numColumns = window.innerWidth < 520 ? 2 : 3;
      const columnGroups: Element[][] = Array.from({ length: numColumns }, () => []);

      // Distribute items into column groups
      gridItems.forEach((item, index) => {
        const columnIndex = index % numColumns;
        columnGroups[columnIndex].push(item);
      });

      const st = ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
        onUpdate: (self) => {
          const scrollProgress = self.progress;

          columnGroups.forEach((columnItems, columnIndex) => {
            // Alternate columns: even columns move down, odd columns move up
            const direction = columnIndex % 2 === 0 ? 1 : -1;

            // Increased speed for 2-column layout
            const baseSpeed = numColumns === 2 ? 350 : 200;
            const scrollAmount = (scrollProgress - 0.5) * baseSpeed;

            // For odd columns (moving up), add negative initial offset to prevent white space
            // This makes them start as if they're already scrolled up
            const initialOffset = columnIndex % 2 === 1 ? -250 : 0;
            const yOffset = scrollAmount * direction + initialOffset;

            columnItems.forEach((item) => {
              gsap.set(item, {
                y: yOffset,
                x: 0,
                filter: 'brightness(100%) contrast(100%)'
              });
            });
          });
        }
      });

      return () => {
        st.kill();
      };
    } else {
      // Desktop: Original animation logic
      const itemsPerGroup = 10;
      const groups: Element[][] = [];

      for (let i = 0; i < gridItems.length; i += itemsPerGroup) {
        groups.push(Array.from(gridItems).slice(i, i + itemsPerGroup));
      }

      const numGroups = groups.length;
      const middleGroupIndex = Math.floor(numGroups / 2);

      const baseAmt = 0.1;
      const renderedStyles = Array.from({ length: numGroups }, (_, index) => {
        const distanceFromMiddle = Math.abs(index - middleGroupIndex);
        const amt = Math.max(baseAmt - distanceFromMiddle * 0.03, 0.05);
        return {
          amt,
          translateX: { previous: 0, current: 0 },
          brightness: { previous: 100, current: 100 },
          contrast: { previous: 100, current: 100 }
        };
      });

      let scrollProgress = 0;
      let rafId: number | null = null;

      const lerp = (a: number, b: number, n: number) => (1 - n) * a + n * b;

      const calculateMappedX = () => {
        return ((scrollProgress * 2 - 1) * 40 * window.innerWidth) / 100;
      };

      const calculateMappedBrightness = () => {
        const centerBrightness = 100;
        const edgeBrightness = 15;
        const t = Math.abs(scrollProgress * 2 - 1);
        const factor = Math.pow(t, 2);
        return centerBrightness - factor * (centerBrightness - edgeBrightness);
      };

      const calculateMappedContrast = () => {
        const centerContrast = 100;
        const edgeContrast = 330;
        const t = Math.abs(scrollProgress * 2 - 1);
        const factor = Math.pow(t, 2);
        return centerContrast - factor * (centerContrast - edgeContrast);
      };

      const render = () => {
        const mappedX = calculateMappedX();
        const mappedBrightness = calculateMappedBrightness();
        const mappedContrast = calculateMappedContrast();

        groups.forEach((groupItems, index) => {
          const style = renderedStyles[index];

          style.translateX.current = mappedX;
          style.brightness.current = mappedBrightness;
          style.contrast.current = mappedContrast;

          style.translateX.previous = lerp(
            style.translateX.previous,
            style.translateX.current,
            style.amt
          );
          style.brightness.previous = lerp(
            style.brightness.previous,
            style.brightness.current,
            style.amt
          );
          style.contrast.previous = lerp(
            style.contrast.previous,
            style.contrast.current,
            style.amt
          );

          groupItems.forEach(item => {
            gsap.set(item, {
              x: style.translateX.previous,
              y: 0,
              filter: `brightness(${style.brightness.previous}%) contrast(${style.contrast.previous}%)`
            });
          });
        });

        rafId = requestAnimationFrame(render);
      };

      const startRendering = () => {
        if (rafId === null) {
          render();
        }
      };

      const stopRendering = () => {
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      };

      const st = ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          scrollProgress = self.progress;
        },
        onEnter: () => {
          startRendering();
        },
        onLeave: () => {
          stopRendering();
        },
        onEnterBack: () => {
          startRendering();
        },
        onLeaveBack: () => {
          stopRendering();
        }
      });

      return () => {
        st.kill();
        stopRendering();
      };
    }
  }, [isMobile]);

  const handleImageClick = (url: string) => {
    setSelectedImage(url);
    document.body.style.overflow = 'hidden';
  };

  const closePopup = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto'
  };

  // Duplicate images based on screen size
  const duplicateTimes = isMobile ? 12 : 10;
  const allArtists = Array(duplicateTimes).fill(pastArtists).flat();

  return (
    <div className="relative w-full z-10" style={{ backgroundColor: "#FFF8F0" }}>
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

      <div className="container mx-auto relative pt-20 pl-0 md:pl-4 sm:pl-20 md:pl-28 lg:pl-32 px-0" ref={containerRef}>
        <div className="mt-20 max-w-[100vw] md:max-w-[95vw] lg:max-w-7xl mx-auto relative rounded-xl ">
          {/* <div className="text-center mb-15">
            <h3 className="font-serif text-2xl lg:text-5xl font-bold text-black mb-10">
              Glimpses of <span className="text-[#F4A900]">Past Artists</span>
            </h3>
          </div> */}
          <div className="relative z-10 flex justify-center mb-12">
            <div className="flex flex-col items-center">
              <p className="text-lg md:text-xl text-[#8B2635] tracking-wide mb-3 font-medium uppercase font-[family-name:var(--font-roboto-slab)] text-center">
                Cultural Stars
              </p>
              <h2 className="text-5xl md:text-6xl lg:text-7xl text-[#2C1810] mb-6 leading-[1.1] font-[family-name:var(--font-medieval-sharp)] text-center">
                Glimpses of <span className="text-[#B7410E]">Past Artists</span>
              </h2>
            </div>
          </div>
          <div className={styles.galleryMask}>
            {/* Left Border SVG */}
            {/* <div
              className="absolute top-0 left-0 bottom-0 w-16 md:w-24 overflow-hidden hidden sm:block z-60"
              style={{
                backgroundImage: 'url(/images/border2.webp)',
                backgroundRepeat: 'repeat-y',
                backgroundSize: '100% auto',
                backgroundPosition: 'top center'
              }}
            /> */}
            {/* Right Border SVG */}
            {/* <div
              className="absolute top-0 right-0 rotate-180 bottom-0 w-16 md:w-24 overflow-hidden hidden sm:block z-60"
              style={{
                backgroundImage: 'url(/images/border2.webp)',
                backgroundRepeat: 'repeat-y',
                backgroundSize: '100% auto',
                backgroundPosition: 'top center'
              }}
            /> */}
            {/* Bottom Border SVG */}
            {/* <img src="/border.svg" alt="" className={styles.borderBottom} /> */}

            <div className={styles.gridWrapper} ref={gridRef}>
              {allArtists.map((item, index) => {
                const spanClass = isMobile ? '' : (() => {
                  const pattern = index % 15;
                  if (pattern === 0) return styles.span2x2;
                  if (pattern === 5) return styles.span2x1;
                  if (pattern === 10) return styles.span1x2;
                  return '';
                })();

                return (
                  <div
                    key={`${item.id}-${index}`}
                    className={`${styles.rowItem} ${spanClass}`}
                    onClick={() => handleImageClick(item.url)}
                  >
                    <div className={styles.rowItemInner}>
                      <div
                        className={styles.rowItemImg}
                        style={{ backgroundImage: `url(${item.url})` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {selectedImage && (
            <div className={styles.popup} onClick={closePopup}>
              <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeBtn} onClick={closePopup}>
                  ×
                </button>
                <img src={selectedImage} alt="Artist" className={styles.popupImg} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
