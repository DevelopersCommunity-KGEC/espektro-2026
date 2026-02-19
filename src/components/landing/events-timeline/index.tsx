"use client";

import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { DaySchedule } from "@/types/landing";
import { CLUB_CATEGORIES } from "@/data/config";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const HOUR_START = 0;
const HOUR_END = 24;
const TOTAL_HOURS = HOUR_END - HOUR_START;

const categoryColors: Record<string, { bg: string; text: string; border: string }> = Object.keys(CLUB_CATEGORIES).reduce((acc, key) => {
    acc[key] = {
        bg: "bg-[#B7410E]/10",
        text: "text-[#B7410E]",
        border: "border-[#B7410E]/40",
    };
    return acc;
}, {} as any);

const categoryLabels: Record<string, string> = Object.entries(CLUB_CATEGORIES).reduce((acc, [key, value]) => {
    acc[key] = value.label;
    return acc;
}, {} as any);

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
    const scrollRef = useRef<HTMLDivElement>(null);
    const innerRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const sectionRef = useRef<HTMLElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [activeDay, setActiveDay] = useState(0);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
    const [tooltipData, setTooltipData] = useState<{ x: number; y: number; event: any } | null>(null);
    const [headerHeight, setHeaderHeight] = useState(0);

    // Measure header height on mount and resize
    useEffect(() => {
        if (headerRef.current) {
            setHeaderHeight(headerRef.current.offsetHeight);
        }
        const handleResize = () => {
            if (headerRef.current) {
                setHeaderHeight(headerRef.current.offsetHeight);
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [scheduleData, activeDay]);

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
            if (!target.closest(".event-bar") && !target.closest("#timeline-tooltip")) {
                setSelectedEvent(null);
                setTooltipData(null);
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

    // Auto-scroll to closest event / current time
    useEffect(() => {
        const scrollContainer = scrollRef.current;
        const inner = innerRef.current;
        if (!scrollContainer || !inner || !currentSchedule) return;

        const todayStr = currentTime.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });

        const nowHour = currentTime.getHours() + currentTime.getMinutes() / 60;

        let leftPct: number | null = null;

        if (currentSchedule.date === todayStr) {
            // Center on current time
            leftPct = ((nowHour - HOUR_START) / TOTAL_HOURS) * 100;
        } else {
            // Find closest event center in current schedule
            if (currentSchedule.events && currentSchedule.events.length > 0) {
                let best = currentSchedule.events[0];
                let bestDiff = Math.abs((best.startHour + best.duration / 2) - nowHour);
                for (const ev of currentSchedule.events) {
                    const center = ev.startHour + ev.duration / 2;
                    const diff = Math.abs(center - nowHour);
                    if (diff < bestDiff) {
                        best = ev;
                        bestDiff = diff;
                    }
                }
                const center = best.startHour + best.duration / 2;
                leftPct = ((center - HOUR_START) / TOTAL_HOURS) * 100;
            }
        }

        if (leftPct === null) return;

        const totalWidth = inner.scrollWidth;
        const target = (leftPct / 100) * totalWidth;
        const scrollLeft = Math.max(0, target - scrollContainer.clientWidth / 2);

        scrollContainer.scrollTo({ left: scrollLeft, behavior: "smooth" });
    }, [scheduleData, activeDay, currentTime, currentSchedule]);

    return (
        <section
            ref={sectionRef}
            id="schedule"
            className="relative z-10 py-24 lg:py-36 overflow-hidden z-10"
            style={{ backgroundColor: "#FFF8F0" }}
        >
            {/* Lotus Mandala Background - Centered and Subtle */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.08] pointer-events-none">
                <Image
                    src="/images/360_F_1706070199_WZV67PDH1xx2nGjbDWR2M7U3bc4CsQi8.webp"
                    alt="Decorative lotus mandala"
                    width={800}
                    height={600}
                    className="object-contain"
                />
            </div>

            {/* Left Tribal Border Pattern */}
            <div
                className="absolute top-0 left-0 bottom-0 w-16 md:w-24 overflow-hidden hidden sm:block"
                style={{
                    backgroundImage: 'url(/images/43a0b75b3caae95caa70550adda8ed60.webp)',
                    backgroundRepeat: 'repeat-y',
                    backgroundSize: '100% auto',
                    backgroundPosition: 'top center'
                }}
            />
            <div className="container mx-auto px-0 md:px-6 lg:px-8 pl-2 sm:pl-20 md:pl-28 lg:pl-32">
                {/* Header */}
                <div
                    className={`mb-14 transition-all duration-700 flex flex-col items-center text-center ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                >
                    <h3 className="text-[#8B2635] text-[10px] md:text-sm uppercase tracking-[0.5em] font-bold text-center mb-3 font-[family-name:var(--font-roboto-slab)]">
                        {scheduleData.length} Days of Excellence
                    </h3>
                    <h2 className="text-5xl md:text-6xl lg:text-7xl text-[#2C1810] mb-6 leading-[1.1] font-[family-name:var(--font-medieval-sharp)]">
                        Event Schedule
                    </h2>
                    <p className="text-[#4A3428] max-w-xl mx-auto font-medium font-[family-name:var(--font-open-sans)]">
                        A bird&rsquo;s-eye view of every event across {scheduleData.length} transformative days.
                    </p>
                </div>

                {/* Day selector tabs */}
                <div
                    className={`flex gap-3 mb-10 overflow-x-auto pb-4 transition-all duration-700 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                    style={{ scrollbarWidth: "none" }}
                >
                    {scheduleData.map((day, i) => (
                        <button
                            key={day.day}
                            type="button"
                            onClick={() => setActiveDay(i)}
                            className={`flex-shrink-0 px-8 py-4 theatrical-shape text-sm font-bold transition-all duration-300 min-w-[130px] font-[family-name:var(--font-roboto-slab)] uppercase tracking-wider ${activeDay === i
                                ? "bg-[#B7410E] text-white shadow-xl shadow-[#B7410E]/20 -translate-y-1"
                                : "bg-white border border-gray-100 text-muted-foreground hover:border-[#B7410E]/30 hover:text-[#B7410E] shadow-sm"
                                }`}
                        >
                            <span className="block text-xs opacity-60 mb-0.5">{day.date}</span>
                            <span className="block text-lg">{day.day}</span>
                            <span className="block text-[9px] mt-1 opacity-50 tracking-[0.1em]">
                                {day.label}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Legend */}
                <div
                    className={`flex flex-wrap justify-center gap-6 md:gap-8 mb-10 transition-all duration-700 delay-150 ${isVisible ? "opacity-100" : "opacity-0"}`}
                >
                    {Object.entries(categoryLabels).map(([key, label]) => {
                        const c = categoryColors[key];
                        return (
                            <div key={key} className="flex items-center gap-2 px-6 py-2 bg-white theatrical-shape shadow-sm flex-shrink-0 transition-all hover:bg-[#B7410E]/5 group cursor-default">
                                <span
                                    className={`w-2 h-2 rounded-full bg-[#B7410E] border border-[#B7410E]/20 shadow-[0_0_8px_rgba(183,65,14,0.3)]`}
                                />
                                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#4A3428] font-[family-name:var(--font-roboto-slab)] group-hover:text-[#B7410E] transition-colors">{label}</span>
                            </div>
                        );
                    })}
                </div>

                {/* Gantt chart */}
                <div
                    ref={containerRef}
                    className={`bg-white rounded-sm overflow-hidden flex flex-col items-center justify-center border-1 md:border-1 border-[#B7410E] transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                >
                    <div className="absolute inset-0 bg-[#FFF8F0]/30 z-0 pointer-events-none" />

                    {/* Gantt Content Area */}
                    <div className="relative z-10 w-full">
                        {/* Time header */}
                        <div ref={scrollRef} className="overflow-x-auto" style={{ scrollbarWidth: "none" }}>
                            <div ref={innerRef} className="relative" style={{ minWidth: "900px" }}>
                                {/* Hour labels */}
                                <div ref={headerRef} className="flex border-b border-border">
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
                                {currentSchedule.events.map((event, idx) => {
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
                                                                        {idx === 0 && (
                                                                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full px-1.5 py-0.5 bg-red-500 text-[8px] text-white rounded-sm font-bold whitespace-nowrap">
                                                                                NOW
                                                                            </div>
                                                                        )}
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
                                                        if (selectedEvent === event.name) {
                                                            setSelectedEvent(null);
                                                            setTooltipData(null);
                                                        } else {
                                                            const rect = e.currentTarget.getBoundingClientRect();
                                                            setSelectedEvent(event.name);
                                                            setTooltipData({
                                                                x: rect.left + rect.width / 2,
                                                                y: rect.top,
                                                                event: event,
                                                            });
                                                        }
                                                    }}
                                                    className={`event-bar relative h-10 rounded-sm ${c.bg} border-2 border-[#B7410E]/30 flex items-center px-6 transition-all duration-300 group-hover:shadow-md group-hover:border-[#B7410E]/50 cursor-pointer active:scale-[0.98] ${(() => {
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
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile hint */}
                {/* <p className="text-center text-xs text-muted-foreground mt-4 lg:hidden">
                    Scroll horizontally to see the full schedule
                </p> */}

                {tooltipData && (
                    <PortalTooltip x={tooltipData.x} y={tooltipData.y}>
                        <div
                            id="timeline-tooltip"
                            className="bg-popover text-popover-foreground border border-border px-3 py-2 rounded-md shadow-xl min-w-[140px] animate-in fade-in zoom-in-95 duration-200 flex flex-col gap-1 pointer-events-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="text-[10px] font-bold text-muted-foreground">
                                {formatTime(tooltipData.event.startHour)} - {formatTime(tooltipData.event.startHour + tooltipData.event.duration)}
                            </div>
                            {tooltipData.event._id ? (
                                <Link
                                    href={`/events/${tooltipData.event._id}`}
                                    className="text-[10px] font-medium text-primary hover:underline group/link block"
                                >
                                    <div className="font-semibold text-xs mb-1 line-clamp-2 flex items-center gap-1">
                                        {tooltipData.event.name}
                                        <ArrowRight className="w-3 h-3 transition-transform group-hover/link:translate-x-0.5" />
                                    </div>
                                </Link>
                            ) : (
                                <div className="font-semibold text-xs mb-1 line-clamp-2">
                                    {tooltipData.event.name}
                                </div>
                            )}
                        </div>
                    </PortalTooltip>
                )}
            </div>
        </section>
    );
}

function PortalTooltip({ children, x, y }: { children: React.ReactNode; x: number; y: number }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    // Shift tooltip to be above the point (y) and centered on x
    // Add some offset (e.g. 10px above)
    // We render at top/left but use transform to center
    // Using inline style for positioning
    return createPortal(
        <div
            style={{
                position: "fixed",
                top: y - 10,
                left: x,
                transform: "translate(-50%, -100%)", // Centered horizontally, moved up by 100% of its height
                zIndex: 60, // Higher than navbar usually
            }}
        >
            {children}
            {/* Arrow */}
            <div
                className="absolute bottom-[-5px] left-1/2 -translate-x-1/2 w-2 h-2 bg-popover border-b border-r border-border rotate-45"
            />
        </div>,
        document.body
    );
}
