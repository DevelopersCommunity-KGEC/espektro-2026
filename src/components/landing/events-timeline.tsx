"use client";

import { useRef, useState, useEffect } from "react";
import { DaySchedule } from "@/types/landing";

const HOUR_START = 8;
const HOUR_END = 24; // Extended range
const TOTAL_HOURS = HOUR_END - HOUR_START;

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
    tech: { bg: "bg-[#2E7D9B]/15", text: "text-[#2E7D9B]", border: "border-[#2E7D9B]/40" },
    cultural: { bg: "bg-[#B7410E]/15", text: "text-[#B7410E]", border: "border-[#B7410E]/40" },
    food: { bg: "bg-[#F4A900]/15", text: "text-[#F4A900]", border: "border-[#F4A900]/40" },
    gaming: { bg: "bg-[#4A7C59]/15", text: "text-[#4A7C59]", border: "border-[#4A7C59]/40" },
    ceremony: { bg: "bg-foreground/5", text: "text-muted-foreground", border: "border-border" },
};

const categoryLabels: Record<string, string> = {
    tech: "Tech",
    cultural: "Cultural",
    food: "Food",
    gaming: "Gaming",
    ceremony: "Ceremony",
};

const hours = Array.from({ length: TOTAL_HOURS + 1 }, (_, i) => {
    const h = HOUR_START + i;
    if (h === 12) return "12 PM";
    if (h === 24) return "12 AM";
    return h < 12 ? `${h} AM` : `${h - 12} PM`;
});

interface EventsTimelineProps {
    scheduleData: DaySchedule[];
}

export function EventsTimeline({ scheduleData }: EventsTimelineProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const sectionRef = useRef<HTMLElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [activeDay, setActiveDay] = useState(0);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setIsVisible(true);
            },
            { threshold: 0.05 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    // Safety check if scheduleData is empty
    if (!scheduleData || scheduleData.length === 0) {
        return null;
    }

    const currentSchedule = scheduleData[activeDay] || scheduleData[0];

    return (
        <section
            ref={sectionRef}
            id="schedule"
            className="py-24 lg:py-36 bg-muted/40 overflow-hidden"
        >
            <div className="container mx-auto px-6 lg:px-8">
                {/* Header */}
                <div
                    className={`mb-14 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                >
                    <p className="text-[#B7410E] text-xs uppercase tracking-[0.3em] mb-5 font-semibold">
                        {scheduleData.length} Days of Excellence
                    </p>
                    <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
                        Event Schedule
                    </h2>
                    <p className="text-muted-foreground max-w-xl">
                        A bird&rsquo;s-eye view of every event across {scheduleData.length} transformative days.
                    </p>
                </div>

                {/* Day selector tabs */}
                <div
                    className={`flex gap-2 mb-8 overflow-x-auto pb-2 transition-all duration-700 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                    style={{ scrollbarWidth: "none" }}
                >
                    {scheduleData.map((day, i) => (
                        <button
                            key={day.day}
                            type="button"
                            onClick={() => setActiveDay(i)}
                            className={`flex-shrink-0 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${activeDay === i
                                ? "bg-[#B7410E] text-white shadow-lg shadow-[#B7410E]/20"
                                : "bg-card border border-border text-muted-foreground hover:border-[#B7410E]/30 hover:text-foreground"
                                }`}
                        >
                            <span className="block font-bold">{day.day}</span>
                            <span className="block text-[10px] mt-0.5 opacity-70">
                                {day.date} &middot; {day.label}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Legend */}
                <div
                    className={`flex flex-wrap gap-4 mb-6 transition-all duration-700 delay-150 ${isVisible ? "opacity-100" : "opacity-0"}`}
                >
                    {Object.entries(categoryLabels).map(([key, label]) => {
                        const c = categoryColors[key];
                        return (
                            <div key={key} className="flex items-center gap-2">
                                <span
                                    className={`w-3 h-3 rounded-sm ${c.bg} border ${c.border}`}
                                />
                                <span className="text-xs text-muted-foreground">{label}</span>
                            </div>
                        );
                    })}
                </div>

                {/* Gantt chart */}
                <div
                    ref={containerRef}
                    className={`bg-card border border-border rounded-2xl overflow-hidden transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                >
                    {/* Time header */}
                    <div className="overflow-x-auto" style={{ scrollbarWidth: "none" }}>
                        <div style={{ minWidth: "900px" }}>
                            {/* Hour labels */}
                            <div className="flex border-b border-border">
                                {/* Left gutter for event labels */}
                                <div className="w-36 lg:w-44 flex-shrink-0 border-r border-border px-4 py-3">
                                    <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium">
                                        {currentSchedule.day} &middot; {currentSchedule.label}
                                    </span>
                                </div>
                                {/* Hour columns */}
                                <div className="flex-1 flex">
                                    {hours.map((label, i) => (
                                        <div
                                            key={label}
                                            className="flex-1 text-center py-3 text-[10px] text-muted-foreground border-r border-border/50 last:border-r-0"
                                            style={{ minWidth: `${100 / (TOTAL_HOURS + 1)}%` }}
                                        >
                                            {i % 2 === 0 ? label : ""}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Event rows */}
                            {currentSchedule.events.map((event) => {
                                const leftPct =
                                    ((event.startHour - HOUR_START) / TOTAL_HOURS) * 100;
                                const widthPct = (event.duration / TOTAL_HOURS) * 100;
                                const c = categoryColors[event.category];

                                return (
                                    <div
                                        key={event.name}
                                        className="flex border-b border-border/50 last:border-b-0 group"
                                    >
                                        {/* Event name gutter */}
                                        <div className="w-36 lg:w-44 flex-shrink-0 border-r border-border px-4 py-3 flex items-center">
                                            <span className="text-xs font-medium text-foreground truncate">
                                                {event.name}
                                            </span>
                                        </div>
                                        {/* Bar area */}
                                        <div className="flex-1 relative py-2 px-1">
                                            {/* Grid lines */}
                                            <div className="absolute inset-0 flex pointer-events-none">
                                                {hours.map((h) => (
                                                    <div
                                                        key={h}
                                                        className="flex-1 border-r border-border/20 last:border-r-0"
                                                    />
                                                ))}
                                            </div>
                                            {/* Bar */}
                                            <div
                                                className={`relative h-8 rounded-md ${c.bg} border ${c.border} flex items-center px-2.5 transition-all duration-500 group-hover:shadow-md`}
                                                style={{
                                                    marginLeft: `${leftPct}%`,
                                                    width: `${widthPct}%`,
                                                }}
                                            >
                                                <span
                                                    className={`text-[10px] font-semibold ${c.text} truncate`}
                                                >
                                                    {event.name}
                                                    {event.prize && (
                                                        <span className="ml-1.5 opacity-70">
                                                            &middot; {event.prize}
                                                        </span>
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Mobile hint */}
                <p className="text-center text-xs text-muted-foreground mt-4 lg:hidden">
                    Scroll horizontally to see the full schedule
                </p>
            </div>
        </section>
    );
}
