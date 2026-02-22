"use client";

import { useEffect, useRef } from "react";
import "./logoani.css";

/**
 * Phase 1 – Main figure body (hand, guitar center) → fade + scale
 * Phase 2 – Top + left swirls, face → stroke draw + color fill
 * Phase 3 – Pen → fade (opacity 0→1)
 * Phase 4 – Right side (book/card) → stroke draw + color fill
 * Phase 5 – "espektro" text → arrival (slide in from below)
 * Phase 6 – "26" text → arrival (slide in from below)
 *
 * Each phase starts when the previous one finishes.
 */

const TEXT_GROUP_ID = "text";
const TEXT_SPLIT_Y = 860; // espektro text < 860, "26" text >= 860

function classifyElement(el: SVGGraphicsElement): number {
    if (el.closest(`#${TEXT_GROUP_ID}`)) {
        try {
            const bbox = el.getBBox();
            const cy = bbox.y + bbox.height / 2;
            return cy < TEXT_SPLIT_Y ? 5 : 6; // 5 = espektro, 6 = 26
        } catch {
            return 5;
        }
    }

    try {
        const bbox = el.getBBox();
        if (bbox.width === 0 && bbox.height === 0) return 1;

        const cx = bbox.x + bbox.width / 2;
        const cy = bbox.y + bbox.height / 2;

        // Right side (book/card with E logo) → Phase 4
        if (cx > 460 && cy > 260 && cy < 500) return 4;
        if (cx > 520 && cy > 150 && cy < 650) return 4;

        // Pen element → Phase 3 (use SVG group #pen)
        if (el.closest('#pen')) return 3;
        const className = el.getAttribute("class") || "";
        if (className.includes("st25")) return 3;

        // Top decorative swirls + left-side → Phase 2
        if (cy < 340) return 2;
        if (cx < 300) return 2;

        // Everything else → main body Phase 1
        return 1;
    } catch {
        return 1;
    }
}

/* ── Phase timing (sequential chaining) ── */

// Phase 1: Main body fade+scale
const FADE_TIMING: Record<number, { delay: number; dur: number }> = {
    1: { delay: 0, dur: 0.5 },
    3: { delay: 1.8, dur: 0.5 },
};

// Phase 2: Stroke draw (starts after Phase 1 ends)
// Phase 4: Stroke draw (starts after Phase 3 ends)
const STROKE_TIMING: Record<number, {
    strokeStart: number;
    strokeDur: number;
    fillDelay: number;
    fillDur: number;
}> = {
    2: { strokeStart: 0.5, strokeDur: 1.2, fillDelay: 1.3, fillDur: 0.5 },
    4: { strokeStart: 2.3, strokeDur: 1.0, fillDelay: 2.8, fillDur: 0.5 },
};

// Phase 5 (espektro text) & Phase 6 (26 text): arrival animation
const TEXT_ARRIVAL_TIMING: Record<number, { delay: number; dur: number }> = {
    5: { delay: 2.3, dur: 0.6 },
    6: { delay: 3.0, dur: 0.6 },
};

export default function LogoAniPage() {
    const svgContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function loadAndAnimateSVG() {
            const res = await fetch("/espektro-logo.svg");
            const svgText = await res.text();

            const container = svgContainerRef.current;
            if (!container) return;

            container.innerHTML = svgText;

            const svg = container.querySelector("svg");
            if (!svg) return;

            svg.classList.add("logo-animate");
            svg.removeAttribute("width");
            svg.removeAttribute("height");

            // Crop viewBox to actual content bounds for perfect centering
            const contentBBox = svg.getBBox();
            const pad = 10;
            svg.setAttribute("viewBox",
                `${contentBBox.x - pad} ${contentBBox.y - pad} ${contentBBox.width + pad * 2} ${contentBBox.height + pad * 2}`
            );

            const elements = svg.querySelectorAll(
                "path, polygon, polyline, circle, ellipse, rect, line"
            );

            const phaseCounters: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };

            elements.forEach((el) => {
                const gEl = el as SVGGraphicsElement;
                const phase = classifyElement(gEl);
                const htmlEl = el as HTMLElement;
                const idx = phaseCounters[phase]++;

                // DEBUG: find the black square element
                try {
                    const bb = gEl.getBBox();
                    const ccx = bb.x + bb.width / 2;
                    const ccy = bb.y + bb.height / 2;
                    if (ccx > 430 && ccx < 500 && ccy > 300 && ccy < 400 && bb.width < 50) {
                        console.log(`DEBUG element: phase=${phase} cx=${ccx.toFixed(1)} cy=${ccy.toFixed(1)} w=${bb.width.toFixed(1)} h=${bb.height.toFixed(1)}`, htmlEl.outerHTML.substring(0, 200));
                    }
                } catch { }

                htmlEl.setAttribute("data-phase", String(phase));

                if (phase === 1 || phase === 3) {
                    // ── Fade + scale phases (doodle body & pen) ──
                    const timing = FADE_TIMING[phase];
                    const microStagger = Math.min(idx * 0.006, 0.3);
                    htmlEl.style.setProperty("--anim-delay", `${timing.delay + microStagger}s`);
                    htmlEl.style.setProperty("--anim-dur", `${timing.dur}s`);
                } else if (phase === 5 || phase === 6) {
                    // ── Text arrival animation (slide in from below) ──
                    const timing = TEXT_ARRIVAL_TIMING[phase];
                    const microStagger = Math.min(idx * 0.03, 0.3);
                    htmlEl.style.setProperty("--arrival-delay", `${timing.delay + microStagger}s`);
                    htmlEl.style.setProperty("--arrival-dur", `${timing.dur}s`);
                } else {
                    // ── Stroke draw + fill phases (doodle swirls & right side) ──
                    const timing = STROKE_TIMING[phase];
                    if (!timing) return;

                    let len = 2000;
                    try {
                        if (typeof (el as SVGGeometryElement).getTotalLength === "function") {
                            len = (el as SVGGeometryElement).getTotalLength();
                        }
                    } catch { /* ignore */ }

                    const microStagger = Math.min(idx * 0.008, 0.4);
                    htmlEl.style.setProperty("--path-length", String(len));
                    htmlEl.style.setProperty("--stroke-start", `${timing.strokeStart + microStagger}s`);
                    htmlEl.style.setProperty("--stroke-dur", `${timing.strokeDur}s`);
                    htmlEl.style.setProperty("--fill-delay", `${timing.fillDelay + microStagger}s`);
                    htmlEl.style.setProperty("--fill-dur", `${timing.fillDur}s`);
                    htmlEl.style.strokeDasharray = String(len);
                    htmlEl.style.strokeDashoffset = String(len);
                }
            });
        }

        loadAndAnimateSVG();
    }, []);

    return (
        <div className="logoani-page">
            <div className="logo-container" ref={svgContainerRef} />
        </div>
    );
}
