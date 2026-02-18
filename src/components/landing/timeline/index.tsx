"use client";

import TimelineMobile from "./timeline";
import TimelineDesktop from "./timeline-desktop";

export default function Timeline() {
    return (
        <>
            {/* Mobile / small screens */}
            <div className="block md:hidden">
                <TimelineMobile />
            </div>

            {/* Desktop / medium+ screens */}
            <div className="hidden md:block">
                <TimelineDesktop />
            </div>
        </>
    );
}
