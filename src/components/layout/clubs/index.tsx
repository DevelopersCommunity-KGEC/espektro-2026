'use client'

import { useEffect, useRef, useState } from 'react';
import OutlinedHeading from '../outlined-heading';
import styles from './style.module.scss';

const BaseAWSURL =
  'https://res.cloudinary.com/dgc9mpvvw/image/upload/v1705041136/espektro/2023/clubs-logo/';

const CLUBS = [
  {
    id: 1,
    name: 'RIYAZ',
    image: `${BaseAWSURL}riyaz-logo.webp`,
    social_link: 'https://www.facebook.com/riyazkgec',
    type: 'pad' as const,
    lilypadVariant: 1,
  },
  {
    id: 2,
    name: 'LOTUS',
    image: '',
    social_link: '',
    type: 'lotus' as const,
  },
  {
    id: 3,
    name: 'GDSC KGEC',
    image: `${BaseAWSURL}gdsc-kgec.webp`,
    social_link: 'https://www.facebook.com/dsckgec',
    type: 'pad' as const,
    lilypadVariant: 2,
  },
  {
    id: 4,
    name: 'ELYSIUM',
    image: `${BaseAWSURL}elysium-logo.webp`,
    social_link: 'https://www.facebook.com/ElysiumKGEC',
    type: 'pad' as const,
    lilypadVariant: 1,
  },
  {
    id: 5,
    name: 'SHUTTERBUG',
    image: `${BaseAWSURL}shutterbug-logo.webp`,
    social_link: 'https://www.facebook.com/shutterbugkgec',
    type: 'pad' as const,
    lilypadVariant: 3,
  },
  {
    id: 6,
    name: 'SAC KGEC',
    image: `${BaseAWSURL}sac-kgec-logo.webp`,
    social_link: 'https://www.facebook.com/kgecSAC',
    type: 'pad' as const,
    lilypadVariant: 2,
  },
  {
    id: 7,
    name: 'CHITRANK',
    image: `${BaseAWSURL}chitrank-logo.webp`,
    social_link: 'https://www.facebook.com/groups/1500050480144825/',
    type: 'pad' as const,
    lilypadVariant: 1,
  },
  {
    id: 8,
    name: 'LITMUS',
    image: `${BaseAWSURL}litmus-logo.webp`,
    social_link: 'https://www.facebook.com/litmusKGEC',
    type: 'pad' as const,
    lilypadVariant: 3,
  },
  {
    id: 9,
    name: 'ROBOTICS SOCIETY',
    image: `${BaseAWSURL}robotics-society-logo.webp`,
    social_link: 'https://www.facebook.com/kgecrs',
    type: 'pad' as const,
    lilypadVariant: 2,
  },
  {
    id: 10,
    name: 'LOTUS',
    image: '',
    social_link: '',
    type: 'lotus' as const,
  },
  {
    id: 11,
    name: 'LES QUIZERABLES',
    image: `${BaseAWSURL}les-quizerable-logo.webp`,
    social_link: 'https://www.facebook.com/LesQuizerablesKgec',
    type: 'pad' as const,
    lilypadVariant: 1,
  },
  {
    id: 12,
    name: 'INFINITIO',
    image: `${BaseAWSURL}infinitio-logo.webp`,
    social_link: 'https://www.facebook.com/infinitio.kgec',
    type: 'pad' as const,
    lilypadVariant: 3,
  },
  {
    id: 13,
    name: 'KEYGEN CODERS',
    image: `${BaseAWSURL}keygen-coders-logo.webp`,
    social_link: 'https://www.facebook.com/KeyGEnCoders',
    type: 'pad' as const,
    lilypadVariant: 2,
  },
  {
    id: 14,
    name: 'NOSCOPE',
    image: `${BaseAWSURL}noscope-logo.webp`,
    social_link: 'https://www.facebook.com/profile.php?id=100090429646028',
    type: 'pad' as const,
    lilypadVariant: 1,
  },
  {
    id: 15,
    name: 'LOTUS',
    image: '',
    social_link: '',
    type: 'lotus' as const,
  },
  {
    id: 16,
    name: 'IMPOSTER',
    image: `${BaseAWSURL}imposter-logo.webp`,
    social_link: 'https://www.facebook.com/profile.php?id=100093346495217',
    type: 'pad' as const,
    lilypadVariant: 3,
  },
  {
    id: 17,
    name: 'NOVA',
    image: `${BaseAWSURL}nova-logo.webp`,
    social_link: 'https://www.facebook.com/kgec.nova',
    type: 'pad' as const,
    lilypadVariant: 2,
  },
];

interface Position {
  x: number;
  y: number;
}

interface ElementPosition extends Position {
  width: number;
  height: number;
  rotation: number;
}

interface CircleRadii {
  inner: number;
  middle: number;
  outer: number;
}

interface LayoutAngles {
  inner: number[];
  middle: number[];
  outer: number[];
}

function ClubComponent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [elementPositions, setElementPositions] = useState<ElementPosition[]>([]);
  const [circleRadii, setCircleRadii] = useState<CircleRadii>({ inner: 130, middle: 240, outer: 370 });
  const [isVerticalLayout, setIsVerticalLayout] = useState(false);

  // Seeded random number generator for consistent layouts
  const seededRandom = (seed: number) => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };

  const getLayoutAngles = (containerWidth: number): LayoutAngles => {
    
    if (containerWidth >= 300 && containerWidth < 520) {
      return {
        inner: [],
        middle: [],
        outer: [],
      };
    }
    
    if (containerWidth >= 2000) {
      return {
        inner: [-90, 30, 150],                        
        middle: [-90, -18, 54, 126, 198],             
        outer: [140, 180, 220, -40, 0, 40],           
      };
    }
    
    if (containerWidth >= 1000) {
      return {
        inner: [-90, 30, 150],                        
        middle: [-90, -18, 54, 97, 198],             
        outer: [140, 180, 220, -40, 0, 40],          
      };
    }

    if (containerWidth >= 768) {
      return {
        inner: [-90, 30, 150],                        
        middle: [-110, -18, 54, 126, 198],             
        outer: [140, 90, 220, -40, -90, 40],          
      };
    }
    
    if (containerWidth >= 600) {
      return {
        inner: [-90, 30, 150],                        
        middle: [-165, -115, -20, 70, 120],           
        outer: [-140, -90, -40, 40, 90, 140],         
      };
    }

    if (containerWidth >= 520) {
      return {
        inner: [-90, 30, 150],                        
        middle: [-165, -115, -20, 70, 120],           
        outer: [-130, -90, -50, 50, 90, 133],         
      };
    }
    
    return {
      inner: [-90, 30, 150],
      middle: [-90, -18, 54, 126, 198],
      outer: [140, 180, 220, -40, 0, 40],
    };
  };

  const calculateCircleRadii = (containerWidth: number): CircleRadii => {
    const baseInner = 130;   
    const baseMiddle = 240;
    const baseOuter = 370;
    
    if (containerWidth >= 2000) {
      return {
        inner: baseInner + 20,
        middle: baseMiddle + 20,
        outer: baseOuter + 40,
      };
    }
    
    if (containerWidth >= 1000) {
      return {
        inner: baseInner,
        middle: baseMiddle + 30,
        outer: baseOuter + 40,
      };
    }

    if (containerWidth >= 890) {
      return {
        inner: baseInner,
        middle: baseMiddle + 10,
        outer: baseOuter + 20,
      };
    }
    
    if (containerWidth >= 768) {
      const scaleFactor = containerWidth / 1600;
      const enhancedScale = scaleFactor * 1.6;
      
      return {
        inner: baseInner * enhancedScale + 15,
        middle: baseMiddle * enhancedScale + 30,
        outer: baseOuter * enhancedScale + 60,
      };
    }
    
    if (containerWidth >= 650) {
      const scaleFactor = containerWidth / 1600;
      const enhancedScale = scaleFactor * 1.6;
      
      return {
        inner: baseInner * enhancedScale+15,
        middle: baseMiddle * enhancedScale + 45,
        outer: baseOuter * enhancedScale + 70,
      };
    }

    if (containerWidth >= 520) {
      const scaleFactor = containerWidth / 1600;
      const enhancedScale = scaleFactor * 1.7;
      
      return {
        inner: baseInner * enhancedScale+30,
        middle: baseMiddle * enhancedScale + 70,
        outer: baseOuter * enhancedScale + 120,
      };
    }
    
    const scaleFactor = containerWidth / 1600;
    const mobileEnhancedScale = scaleFactor * 1.3;
    
    return {
      inner: baseInner * mobileEnhancedScale,
      middle: baseMiddle * mobileEnhancedScale,
      outer: baseOuter * mobileEnhancedScale,
    };
  };

  // Intersection Observer for scroll-triggered animations
  useEffect(() => {
    if (!containerRef.current) return;
    
    const wrapper = containerRef.current;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement;
            element.classList.add(styles.visible);
            observer.unobserve(entry.target); // Play only once
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );
    
    const padContainers = wrapper.querySelectorAll(`.${styles.padContainer}`);
    padContainers.forEach((pad) => observer.observe(pad));
    
    return () => {
      observer.disconnect();
    };
  }, []); 


  useEffect(() => {
    const positionElements = () => {
      if (!containerRef.current) return;

      const wrapper = containerRef.current;
      const wrapperRect = wrapper.getBoundingClientRect();
      const elements = wrapper.querySelectorAll('[data-club-id]');
      
      if (elements.length === 0) return;

      const containerWidth = wrapperRect.width;
      const isVertical = containerWidth >= 240 && containerWidth < 520;
      setIsVerticalLayout(isVertical);

      if (isVertical) {
        const positions: ElementPosition[] = [];
        const padding = 20;
        const centerX = wrapperRect.width / 2;
        
        const lilyPads = CLUBS.filter(club => club.type === 'pad');
        
        let currentY = padding + 60;
        
        const positionMap = new Map<number, ElementPosition>();
        
        const topLotus = Array.from(elements).find(el => 
          parseInt(el.getAttribute('data-club-id') || '0') === 2
        );
        
        if (topLotus) {
          const rect = topLotus.getBoundingClientRect();
          positionMap.set(2, {
            x: centerX - rect.width / 2,
            y: currentY,
            width: rect.width,
            height: rect.height,
            rotation: 0
          });
          currentY += rect.height + 40;
        }
        
        lilyPads.forEach((club, lilyPadIndex) => {
          const el = Array.from(elements).find(e => 
            parseInt(e.getAttribute('data-club-id') || '0') === club.id
          );
          
          if (!el) return;
          
          const rect = el.getBoundingClientRect();
          
          const isLeft = lilyPadIndex % 2 === 0;
          
          let centerPercent;
          
          if (isLeft) {
            centerPercent = 0.10 + (seededRandom(club.id * 88) * 0.30);
          } else {
            centerPercent = 0.50 + (seededRandom(club.id * 99) * 0.34);
          }
          
          let x = (wrapperRect.width * centerPercent) - (rect.width / 2);
          
          x = Math.max(padding, Math.min(x, wrapperRect.width - padding - rect.width));
          
          positionMap.set(club.id, {
            x,
            y: currentY,
            width: rect.width,
            height: rect.height,
            rotation: (seededRandom(club.id * 100) - 0.5) * 10
          });
          
          const gap = 20 + (seededRandom(club.id * 12) * 20);
          currentY += rect.height * 0.5 + gap; 
        });
        
        const otherLotus = CLUBS.filter(c => c.type === 'lotus' && c.id !== 2);
        otherLotus.forEach((club, lotusIndex) => {
          const el = Array.from(elements).find(e => 
            parseInt(e.getAttribute('data-club-id') || '0') === club.id
          );
          
          if (!el) return;
          
          const rect = el.getBoundingClientRect();
          const isLeft = lotusIndex % 2 === 0;
          
          const x = isLeft 
            ? padding + 10
            : wrapperRect.width - padding - rect.width - 10;
          
          positionMap.set(club.id, {
            x,
            y: currentY,
            width: rect.width,
            height: rect.height,
            rotation: (seededRandom(club.id * 100) - 0.5) * 15
          });
          
          if (!isLeft) {
            currentY += rect.height + 50;
          }
        });
        
        wrapper.style.height = `${currentY + 100}px`; 
        
        elements.forEach((el, index) => {
          const clubId = parseInt(el.getAttribute('data-club-id') || '0');
          const position = positionMap.get(clubId);
          
          if (position) {
            const element = el as HTMLElement;
            element.style.left = `${position.x}px`;
            element.style.top = `${position.y}px`;
            element.style.transform = `rotate(${position.rotation}deg)`;
            element.style.animationDelay = `${index * 0.08}s`;
            positions.push(position);
          }
        });

        setElementPositions(positions);
        return;
      }

      wrapper.style.height = '';
      
      const radii = calculateCircleRadii(wrapperRect.width);
      setCircleRadii(radii);

      const angles = getLayoutAngles(wrapperRect.width);

      const positions: ElementPosition[] = [];
      
      const screenWidth = wrapperRect.width;
      const padding = screenWidth < 768 ? 20 : screenWidth < 1024 ? 30 : 40;
      
      const innerCircleRadius = radii.inner;
      const middleCircleRadius = radii.middle;
      const outerCircleRadius = radii.outer;
      const centerX = wrapperRect.width / 2;
      const centerY = wrapperRect.height / 2;
      
      const innerCirclePadIds = [1, 4, 7];              
      const middleCirclePadIds = [3, 6, 9, 11, 14];     
      const outerCirclePadIds = [5, 8, 12, 13, 16, 17]; 
      
      const circlePositions = new Map<number, Position>();
      
      innerCirclePadIds.forEach((id, index) => {
        const angle = angles.inner[index] * (Math.PI / 180);
        const x = centerX + innerCircleRadius * Math.cos(angle);
        const y = centerY + innerCircleRadius * Math.sin(angle);
        circlePositions.set(id, { x, y });
      });
      
      middleCirclePadIds.forEach((id, index) => {
        const angle = angles.middle[index] * (Math.PI / 180);
        const x = centerX + middleCircleRadius * Math.cos(angle);
        const y = centerY + middleCircleRadius * Math.sin(angle);
        circlePositions.set(id, { x, y });
      });
      
      outerCirclePadIds.forEach((id, index) => {
        const angle = angles.outer[index] * (Math.PI / 180);
        const x = centerX + outerCircleRadius * Math.cos(angle);
        const y = centerY + outerCircleRadius * Math.sin(angle);
        circlePositions.set(id, { x, y });
      });
      
      const lotusIds = [2, 10, 15];
      const lotusRadii = [
        (innerCircleRadius + middleCircleRadius) / 2,  
        (middleCircleRadius + outerCircleRadius) / 2,  
        (middleCircleRadius + outerCircleRadius) / 2,  
      ];
      
      const lotusAngles = [
        90,   
        210,  
        330,  
      ];
      
      lotusIds.forEach((id, index) => {
        const angle = lotusAngles[index] * (Math.PI / 180);
        const radius = lotusRadii[index];
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        circlePositions.set(id, { x, y });
      });
      
      const getMinDistance = (width: number, height: number): number => {
        const avgSize = (width + height) / 2;
        return avgSize * 0.6;
      };

      const hasOverlap = (newPos: ElementPosition, existingPositions: ElementPosition[]): boolean => {
        return existingPositions.some(pos => {
          const dx = newPos.x - pos.x;
          const dy = newPos.y - pos.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          const avgNewSize = (newPos.width + newPos.height) / 2;
          const avgExistingSize = (pos.width + pos.height) / 2;
          const minDist = (avgNewSize + avgExistingSize) / 2 + getMinDistance(newPos.width, newPos.height);
          
          return distance < minDist;
        });
      };

      const isWithinBounds = (pos: ElementPosition, wrapperWidth: number, wrapperHeight: number): boolean => {
        return pos.x >= padding && 
               pos.y >= padding && 
               pos.x + pos.width <= wrapperWidth - padding && 
               pos.y + pos.height <= wrapperHeight - padding;
      };

      elements.forEach((el, index) => {
        const rect = el.getBoundingClientRect();
        const isLotus = el.classList.contains(styles.lotusContainer);
        const clubId = parseInt(el.getAttribute('data-club-id') || '0');
        
        let position: ElementPosition | null = null;
        
        if (circlePositions.has(clubId)) {
          const circlePos = circlePositions.get(clubId)!;
          position = {
            x: circlePos.x - rect.width / 2,
            y: circlePos.y - rect.height / 2,
            width: rect.width,
            height: rect.height,
            rotation: (seededRandom(clubId * 100) - 0.5) * 8
          };
        } else {
          let attempts = 0;
          const maxAttempts = 200;

          while (attempts < maxAttempts && !position) {
            const seed = index * 1000 + attempts;
            const randomX = seededRandom(seed);
            const randomY = seededRandom(seed + 500);
            
            const availableWidth = wrapperRect.width - padding * 2 - rect.width;
            const availableHeight = wrapperRect.height - padding * 2 - rect.height;
            
            const x = padding + randomX * availableWidth;
            const y = padding + randomY * availableHeight;
            
            const distanceFromCenter = Math.sqrt(
              Math.pow(x + rect.width / 2 - centerX, 2) + 
              Math.pow(y + rect.height / 2 - centerY, 2)
            );
            
            const minDistanceFromCenter = middleCircleRadius + 80;
            
            const rotation = (seededRandom(seed + 1000) - 0.5) * (isLotus ? 20 : 8);
            
            const candidate: ElementPosition = {
              x,
              y,
              width: rect.width,
              height: rect.height,
              rotation
            };

            if (!hasOverlap(candidate, positions) && 
                isWithinBounds(candidate, wrapperRect.width, wrapperRect.height) &&
                distanceFromCenter > minDistanceFromCenter) {
              position = candidate;
            }
            
            attempts++;
          }

          if (!position) {
            const cols = Math.ceil(Math.sqrt(elements.length));
            const rows = Math.ceil(elements.length / cols);
            const row = Math.floor(index / cols);
            const col = index % cols;
            
            const cellWidth = (wrapperRect.width - padding * 2) / cols;
            const cellHeight = (wrapperRect.height - padding * 2) / rows;
            
            const randomOffsetX = (seededRandom(index * 100) - 0.5) * cellWidth * 0.3;
            const randomOffsetY = (seededRandom(index * 200) - 0.5) * cellHeight * 0.3;
            
            position = {
              x: padding + (col * cellWidth) + (cellWidth - rect.width) / 2 + randomOffsetX,
              y: padding + (row * cellHeight) + (cellHeight - rect.height) / 2 + randomOffsetY,
              width: rect.width,
              height: rect.height,
              rotation: (seededRandom(index * 100) - 0.5) * 5
            };
          }
        }

        positions.push(position);

        const element = el as HTMLElement;
        element.style.left = `${position.x}px`;
        element.style.top = `${position.y}px`;
        element.style.transform = `rotate(${position.rotation}deg)`;
        
        if (!isLotus && circlePositions.has(clubId)) {
          element.style.width = `${position.width}px`;
          element.style.height = `${position.height}px`;

          const dx = position.x + position.width / 2 - centerX;
          const dy = position.y + position.height / 2 - centerY;
          const distanceFromCenter = Math.sqrt(dx * dx + dy * dy);
          
          const animationDelay = distanceFromCenter * 0.0015; 
          
          element.style.setProperty('--bloom-delay', `${animationDelay}s`);

          if (containerWidth >= 520) {
             const originX = centerX - position.x;
             const originY = centerY - position.y;
             element.style.transformOrigin = `${originX}px ${originY}px`;
          } else {
             element.style.transformOrigin = 'center';
          }

        } else {
          if (containerWidth >= 520) {
             const dx = position.x + position.width / 2 - centerX;
             const dy = position.y + position.height / 2 - centerY;
             const distanceFromCenter = Math.sqrt(dx * dx + dy * dy);
             const animationDelay = distanceFromCenter * 0.0015;
             element.style.setProperty('--bloom-delay', `${animationDelay}s`);
             
             const originX = centerX - position.x;
             const originY = centerY - position.y;
             element.style.transformOrigin = `${originX}px ${originY}px`;
          } else {
             element.style.animationDelay = `${index * 0.08}s`;
             element.style.transformOrigin = 'center';
          }
        }
      });

      setElementPositions(positions);
    };

    const initialTimer = setTimeout(positionElements, 100);

    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(positionElements, 150);
    };

    window.addEventListener('resize', handleResize);
    
    const images = containerRef.current?.querySelectorAll('img');
    images?.forEach((img) => {
      if (!img.complete) {
        img.addEventListener('load', () => {
          setTimeout(positionElements, 50);
        });
      }
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
      clearTimeout(initialTimer);
    };
  }, []);

  return (
    <section id="espektro-clubs" className={styles.ClubComponent__section}>
      <OutlinedHeading label="Our Clubs" />
      <div className={styles.ClubComponent__section__club__wrapper} ref={containerRef}>
        {!isVerticalLayout && (
          <div className={styles.centralLotusWrapper}>
            <svg className={styles.concentricCircles} aria-hidden="true">
              <circle cx="50%" cy="50%" r={circleRadii.inner} className={styles.circle} />
              <circle cx="50%" cy="50%" r={circleRadii.middle} className={styles.circle} />
              <circle cx="50%" cy="50%" r={circleRadii.outer} className={styles.circle} />
            </svg>
            <div className={styles.centralLotus}>
              <img 
                src="/lotus.svg" 
                alt="Central Lotus" 
                className={styles.centralLotusImage}
              />
            </div>
          </div>
        )}

        <div className={styles.clubsGrid}>
          {CLUBS.map((club) => {
            if (club.type === 'lotus') {
              return (
                <div
                  key={club.id}
                  data-club-id={club.id}
                  className={styles.lotusContainer}
                >
                  <img 
                    src="/lotus.svg" 
                    alt="Lotus decoration" 
                    className={styles.lotus}
                  />
                </div>
              );
            }

            return (
              <div
                key={club.id}
                data-club-id={club.id}
                className={styles.padContainer}
              >
                <a
                  href={club.social_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.padLink}
                >
                  <img 
                    src={`/lilypad${club.lilypadVariant}.svg`}
                    alt="" 
                    className={styles.lilyPad}
                  />
                  <div className={styles.logoContainer}>
                    <img src={club.image} alt={club.name} />
                  </div>
                  <div className={styles.nameOverlay}>
                    <p>{club.name}</p>
                  </div>
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ClubComponent;