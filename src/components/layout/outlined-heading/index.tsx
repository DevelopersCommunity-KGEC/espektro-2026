import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import React from 'react';
import styles from './styles.module.scss';
gsap.registerPlugin(ScrollTrigger);

export interface OutlinedHeadingProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  theme?: string; // Add theme property to interface
}

const OutlinedHeading: React.FC<OutlinedHeadingProps> = ({ label, theme = "default", ...props }) => {
  const svgContainerRef = React.useRef<HTMLDivElement>(null);
  const svgRef = React.useRef<SVGSVGElement>(null);
  const outlineTextRef = React.useRef<SVGTextElement>(null);
  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: svgContainerRef.current,
        start: 'top bottom-=100px',
        end: () => '+=100',
        toggleActions: 'play none none reverse',
        // markers: true,
      },
    });
    tl.from(
      svgRef.current,
      {
        y: 50,
        opacity: 0,
        duration: 0.5,
        ease: 'power4.out',
      },
      '<'
    )
      .from(
        outlineTextRef.current,
        {
          y: 0,
          fontSize: 0,
          opacity: 0,
          duration: 1,
          ease: 'power4.out',
        },
        '<'
      )
      .fromTo(
        outlineTextRef.current,
        {
          css: {
            stroke: 'url(#outlined-heading-linear-gradient)',
            strokeDashoffset: '25%',
            strokeDasharray: '0 50%',
            strokeWidth: '1',
          },
        },
        {
          css: {
            stroke: 'url(#outlined-heading-linear-gradient)',
            strokeDashoffset: '-25%',
            strokeDasharray: '50% 0',
            strokeWidth: '1',
          },
          duration: 1.5,
        },
        '<'
      );
  });
  return (
    <div
      ref={svgContainerRef}
      {...props}
      className={`${styles.outline__heading__container} ${props.className} ${theme === "vintage" ? styles.vintage : ""}`}
    >
      <svg
        ref={svgRef}
        className="outline-heading-svg"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient
            gradientTransform="rotate(30)"
            id="outlined-heading-linear-gradient"
          >
            {theme === "vintage" ? (
              <>
                <stop offset="0%" stopColor="#8b6e4e" /> {/* Medium brown */}
                <stop offset="25%" stopColor="#a98459" /> {/* Medium brown text */}
                <stop offset="50%" stopColor="#a38767" /> {/* Dark brown */}
                <stop offset="75%" stopColor="#e8dcc9" /> {/* Light text on dark backgrounds */}
                <stop offset="100%" stopColor="#5e4a33" /> {/* Dark brown */}
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#e8dcc9" />
                <stop offset="100%" stopColor="#a98459" />
              </>
            )}
          </linearGradient>
        </defs>
        <text
          ref={outlineTextRef}
          className={`${styles.outline} outline-text`}
          x="50%"
          y="50%"
          text-anchor="middle"
          alignment-baseline="middle"
        >
          {label}
        </text>
        <text
          className={styles.solid}
          x="50%"
          y="50%"
          text-anchor="middle"
          alignment-baseline="middle"
        >
          {label}
        </text>
      </svg>
    </div>
  );
}

function OutlineWrapper() {
  return <OutlinedHeading label="Hello World" />;
}

export default OutlinedHeading;
export { OutlineWrapper };
