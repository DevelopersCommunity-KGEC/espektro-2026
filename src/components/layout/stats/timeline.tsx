import React from 'react';
import './timeline.css';
import TimelineContainer from './TimelineContainer';
import OutlinedHeading from "../outlined-heading";
export interface YearData {
    year: string | number;
    title: string;
    icon: string;
    description: string;
}

const yearsData: YearData[] = [
    {
        year: "Pre",
        title: "The Beginning",
        icon: "/time1.png",
        description:
            "The initial years set the tone with local talents, establishing Espektro as a cultural cornerstone. And also bringing international brands on the scene.",
    },
    {
        year: 2016,
        title: "Arabian Nights",
        icon: "/time2.png",
        description: `A rising star graced the stage, leaving an indelible mark on the fest's history`,
    },
    {
        year: 2017,
        title: "A World Of Novels",
        icon: "/time3.png",
        description:
            "The fest expanded its horizons, featuring renowned artists and attracting attention beyond the college boundaries",
    },
    {
        year: 2018,
        title: "Ethos of Bengal",
        icon: "/time4.png",
        description:
            "Espektro reached new heights with an unforgettable performance by a nationally acclaimed artist",
    },
    {
        year: 2019,
        title: "A Blast From The Past",
        icon: "/time5.png",
        description:
            "International participation elevated the fest's global appeal, making it a must-attend event",
    },
    {
        year: 2020,
        title: "Rajatam Vardhanam",
        icon: "/time1.png",
        description:
            "Despite challenges, Espektro adapted to virtual platforms, maintaining its spirit and engaging a wider audience.and also completing 25 years of kgec",
    },
    {
        year: 2023,
        title: "The Khronic Odyssey",
        icon: "/time2.png",
        description:
            "A grand comeback marked the year, with the fest returning to its physical glory, featuring a blockbuster lineup that left the audience in awe",
    },
    {
        year: 2024,
        title: "Taksha-tatva Sanghra",
        icon: "/time3.png",
        description:
            "A Technological Symphony at Espektro ’24 is the theme for this year’s event, celebrating the transformative power of technology and its beautiful synergy with various aspects of our lives",
    },
    {
        year: 2025,
        title: "The Wonders Weave",
        icon: "/time4.png",
        description:
            "The Wonder Weave emphasizes the creation of a magical and wondrous experience through the intertwining of diverse talents, ideas, and disciplines. It's about showcasing the amazing things that happen when creativity and collaboration come together.",
    },
];

export default function Timeline() {
    const timelineRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        // Observer for Scroll Reveal
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("in-view");
                    } else {
                        entry.target.classList.remove("in-view");
                    }
                });
            },
            { threshold: 0.1 }
        );

        const items = document.querySelectorAll(".timeline-container");
        items.forEach((item) => observer.observe(item));

        // Scroll Handler for Line Growth
        const updateLine = () => {
            const timeline = timelineRef.current;
            if (!timeline) return;

            const rect = timeline.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            // Calculate how much of the timeline is visible/scrolled past
            // Start growing when top enters valid area
            const startOffset = windowHeight * 0.2;
            const scrolled = windowHeight - rect.top - startOffset;

            let percentage = (scrolled / rect.height) * 100;

            // Clamp between 0 and 100
            percentage = Math.max(0, Math.min(100, percentage));

            timeline.style.setProperty("--line-height", `${percentage}%`);
        };

        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    updateLine();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener("scroll", handleScroll);
        updateLine();

        return () => {
            items.forEach((item) => observer.unobserve(item));
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <div>
            <OutlinedHeading label="Over Years" theme="vintage" />
        <div className="timeline" ref={timelineRef}>
            {yearsData.map((item, index) => (
                <TimelineContainer
                    key={index}
                    data={item}
                    position={index % 2 === 0 ? 'left' : 'right'}
                />
            ))}
        </div>
        </div>
    );
}
