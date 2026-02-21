"use client";

import React, { useState, useEffect, useRef } from "react";

interface LazySectionProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    threshold?: number;
    rootMargin?: string;
    minHeight?: string;
}

export function LazySection({
    children,
    threshold = 0.1,
    rootMargin = "200px",
    minHeight = "400px",
    ...props
}: LazySectionProps) {
    const [isInView, setIsInView] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold, rootMargin }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, [threshold, rootMargin]);

    return (
        <div ref={containerRef} style={{ minHeight, ...props.style }} {...props}>
            {isInView ? children : null}
        </div>
    );
}
