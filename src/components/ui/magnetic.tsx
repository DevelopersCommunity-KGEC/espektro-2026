'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Magnetic({ children }: { children: React.ReactElement }) {
    const magnetic = useRef<HTMLElement>(null);

    useEffect(() => {
        if (!magnetic.current) return;

        const xTo = gsap.quickTo(magnetic.current, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
        const yTo = gsap.quickTo(magnetic.current, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });

        const mouseMove = (e: MouseEvent) => {
            if (!magnetic.current) return;
            const { clientX, clientY } = e;
            const rect = magnetic.current.getBoundingClientRect();
            if (!rect) return;
            const { height, width, left, top } = rect;
            const x = clientX - (left + width / 2);
            const y = clientY - (top + height / 2);
            xTo(x);
            yTo(y);
        };

        const mouseLeave = () => {
            xTo(0);
            yTo(0);
        };

        const element = magnetic.current;
        element.addEventListener("mousemove", mouseMove);
        element.addEventListener("mouseleave", mouseLeave);

        return () => {
            element.removeEventListener("mousemove", mouseMove);
            element.removeEventListener("mouseleave", mouseLeave);
        };
    }, []);

    return React.cloneElement(children as React.ReactElement<{ ref: React.Ref<any> }>, { ref: magnetic });
}
