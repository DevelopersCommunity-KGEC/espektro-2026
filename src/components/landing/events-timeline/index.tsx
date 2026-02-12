"use client";

import { useRef, useState, useEffect } from "react";
import { DaySchedule } from "@/types/landing";

const HOUR_START = 0;
const HOUR_END = 24;
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

const hours = Array.from({ length: TOTAL_HOURS }, (_, i) => {
    const h = HOUR_START + i;
    if (h === 0 || h === 24) return "12 AM";
    if (h === 12) return "12 PM";
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
    const [currentTime, setCurrentTime] = useState(new Date());
    const [selectedEvent, setSelectedEvent] = useState<string | null>(null);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000); // Update every minute
        return () => clearInterval(timer);
    }, []);

    // Helper to format 24h number to AM/PM string
    const formatTime = (hour: number) => {
        const h = Math.floor(hour);
        const m = Math.round((hour - h) * 60);
        const ampm = h >= 12 && h < 24 ? "PM" : "AM";
        const displayH = h % 12 === 0 ? 12 : h > 12 ? h - 12 : (h === 0 ? 12 : h);
        return `${displayH}:${m.toString().padStart(2, "0")} ${ampm}`;
    };

    // Auto-select today if it's during the fest
    useEffect(() => {
        const todayStr = currentTime.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });
        const index = scheduleData.findIndex((d) => d.date === todayStr);
        if (index !== -1) {
            setActiveDay(index);
        }
    }, [scheduleData]);

    // Close badge when clicking anywhere else
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest(".event-bar")) {
                setSelectedEvent(null);
            }
        };

        if (selectedEvent) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [selectedEvent]);

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
            className="relative py-24 lg:py-36 bg-muted/40 overflow-hidden"
        >
            {/* Decorative side borders */}
            {/* <img
                src="https://res.cloudinary.com/dlxpcyiin/image/upload/v1770840857/acceeec5cca8bcd386d1ccf3692c9947-removebg-preview_ja16p2.png"
                alt=""
                aria-hidden="true"
                className="absolute top-0 left-0 bottom-0 h-full w-auto max-w-[60px] md:max-w-[80px] object-cover pointer-events-none z-[5] opacity-60 hidden lg:block"
            />
            <img
                src="https://res.cloudinary.com/dlxpcyiin/image/upload/v1770840857/acceeec5cca8bcd386d1ccf3692c9947-removebg-preview_ja16p2.png"
                alt=""
                aria-hidden="true"
                className="absolute top-0 right-0 bottom-0 h-full w-auto max-w-[60px] md:max-w-[80px] object-cover pointer-events-none z-[5] opacity-60 hidden lg:block scale-x-[-1]"
            /> */}
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
                                <div className="flex-1 flex relative">
                                    {hours.map((label, i) => (
                                        <div
                                            key={label}
                                            className="flex-1 text-center py-3 text-[10px] text-muted-foreground border-r border-border/50 last:border-r-0"
                                        >
                                            {i % 2 === 0 ? label : ""}
                                        </div>
                                    ))}
                                    {/* Final tick at 12 AM/midnight if needed, but last column handles it */}
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
                                        {/* Bar area - removed px-1 to align perfectly with grid */}
                                        <div className="flex-1 relative py-2">
                                            {/* Grid lines */}
                                            <div className="absolute inset-0 flex pointer-events-none">
                                                {hours.map((h) => (
                                                    <div
                                                        key={h}
                                                        className="flex-1 border-r border-border/20 last:border-r-0"
                                                    />
                                                ))}
                                                {/* Current Time Indicator */}
                                                {(() => {
                                                    const todayStr = currentTime.toLocaleDateString("en-US", {
                                                        month: "short",
                                                        day: "numeric",
                                                    });
                                                    if (currentSchedule.date === todayStr) {
                                                        const nowHour = currentTime.getHours() + currentTime.getMinutes() / 60;
                                                        if (nowHour >= HOUR_START && nowHour <= HOUR_END) {
                                                            const left = ((nowHour - HOUR_START) / TOTAL_HOURS) * 100;
                                                            return (
                                                                <div
                                                                    className="absolute top-0 bottom-0 w-px bg-red-500 z-20 shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                                                                    style={{ left: `${left}%` }}
                                                                >
                                                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full px-1.5 py-0.5 bg-red-500 text-[8px] text-white rounded-sm font-bold whitespace-nowrap">
                                                                        NOW
                                                                    </div>
                                                                </div>
                                                            );
                                                        }
                                                    }
                                                    return null;
                                                })()}
                                            </div>
                                            {/* Bar */}
                                            <div
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedEvent(selectedEvent === event.name ? null : event.name);
                                                }}
                                                className={`event-bar relative h-10 rounded-md ${c.bg} border ${c.border} flex items-center px-3 transition-all duration-300 group-hover:shadow-md cursor-pointer active:scale-[0.98] ${(() => {
                                                    const todayStr = currentTime.toLocaleDateString("en-US", {
                                                        month: "short",
                                                        day: "numeric",
                                                    });
                                                    if (currentSchedule.date === todayStr) {
                                                        const nowHour = currentTime.getHours() + currentTime.getMinutes() / 60;
                                                        if (nowHour >= event.startHour && nowHour <= event.startHour + event.duration) {
                                                            return "ring-2 ring-primary ring-offset-2 ring-offset-card shadow-lg";
                                                        }
                                                    }
                                                    return "";
                                                })()} ${selectedEvent === event.name ? "z-30 shadow-lg scale-[1.02]" : "z-10"}`}
                                                style={{
                                                    marginLeft: `${leftPct}%`,
                                                    width: `${widthPct}%`,
                                                }}
                                            >
                                                <span
                                                    className={`text-[10px] sm:text-xs font-semibold ${c.text} truncate`}
                                                >
                                                    {event.name}
                                                    {event.prize && (
                                                        <span className="ml-1.5 opacity-70">
                                                            &middot; {event.prize}
                                                        </span>
                                                    )}
                                                </span>

                                                {/* Time Badge - shown above bar when clicked */}
                                                {selectedEvent === event.name && (
                                                    <div className="absolute bottom-[calc(100%+8px)] left-0 bg-popover text-popover-foreground border border-border px-2 py-1 rounded shadow-xl text-[9px] font-bold whitespace-nowrap z-50 animate-in fade-in zoom-in-95 duration-200">
                                                        <div className="absolute -bottom-1 left-4 w-2 h-2 bg-popover border-b border-r border-border rotate-45" />
                                                        {formatTime(event.startHour)} - {formatTime(event.startHour + event.duration)}
                                                    </div>
                                                )}
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
