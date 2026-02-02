// export default function EventsPage() {
//     return (
//         <div className="w-full h-full items-center justify-between">
//            Events
//         </div>
//     );
// }

"use client"

import { useEffect, useMemo, useState } from 'react';
import moment from 'moment';
import { GiWizardStaff } from 'react-icons/gi';
import { FaChevronDown } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

import OutlinedHeading from '@/components/layout/outlined-heading';

import EventCard from '../../components/layout/EventCard/EventCard';
import styles from './styles.module.scss';
import type { EventData } from './types';

import { demoEventData } from './data';
import './harryPotter.scss';

const eventLinks = [
    {
        id: 1,
        label: 'Techtix',
        href: '/events/techtix',
    },
    {
        id: 2,
        label: 'Exotica',
        href: '/events/exotica',
    },
    {
        id: 3,
        label: 'Exotica',
        href: '/events/exotica',
    },
];

function EventsNav({
    active,
    setActive,
}: {
    active: number;
    setActive: (tab: number) => void;
}) {
    return (
        <ul className={styles.events_nav}>
            {eventLinks.map((link) => (
                <li
                    data-active={link.id === active}
                    key={link.id}
                    onClick={() => setActive(link.id)}
                >
                    <a>{link.label}</a>
                </li>
            ))}
        </ul>
    );
}

function EventsV2() {
    const [events, setEvents] = useState<EventData[]>([]);

    useEffect(() => {
        // Replace the axios call with the demo data
        setEvents(demoEventData);

        // The commented code below is kept as is
        // const getData = async () => {
        //   const data = await axios.get(
        //     'https://tessarus-pwa.vercel.app/dashboard/events'
        //   );

        //   const eventData = data.data.events.documents;

        //   setEvents(eventData);

        //   // const day0 = eventData.filter(
        //   //   (event: EventData) =>
        //   //     event.startTime.split('-')[2].split('T')[0] === '19'
        //   // );
        //   // setDay0Event(day0);

        //   // const day1 = eventData.filter(
        //   //   (event: EventData) =>
        //   //     event.startTime.split('-')[2].split('T')[0] === '20'
        //   // );
        //   // setDay1Event(day1);

        //   // const day2 = eventData.filter(
        //   //   (event: EventData) =>
        //   //     event.startTime.split('-')[2].split('T')[0] === '21'
        //   // );
        //   // setDay2Event(day2);

        //   // const day3 = eventData.filter(
        //   //   (event: EventData) =>
        //   //     event.startTime.split('-')[2].split('T')[0] === '22'
        //   // );
        //   // setDay3Event(day3);

        //   // setDataArray([
        //   //   {
        //   //     day: 0,
        //   //     event: day0,
        //   //   },
        //   //   {
        //   //     day: 1,
        //   //     event: day1,
        //   //   },
        //   //   {
        //   //     day: 2,
        //   //     event: day2,
        //   //   },
        //   //   {
        //   //     day: 3,
        //   //     event: day3,
        //   //   },
        //   // ]);
        // };
        // getData();
    }, []);

    const eventsMap = useMemo(() => {
        // group events by day
        const eventsMap = new Map<string, EventData[]>();
        events.forEach((event) => {
            const day = moment(event.startTime)
                .subtract('330', 'minutes')
                .format('DD-MM-YYYY');
            if (eventsMap.has(day)) {
                eventsMap.get(day)?.push(event);
            } else {
                eventsMap.set(day, [event]);
            }
        });
        return Array.from(eventsMap.entries()).map(([day, event]) => ({
            day,
            event,
        }));
    }, [events]);

    return (
        <div className={styles.event__main__container}>
            <div className={styles.section__container}>
                <OutlinedHeading label="Our Events" />
                <EventsSection days={eventsMap} />
            </div>
        </div>
    );
}

function EventsSection({
    days,
}: {
    days: { day: string; event: EventData[] }[];
}) {
    return (
        <section className={styles.event__section}>
            <div className="cloud-background"></div>
            <article>
                {days.map((day, idx: number) => {
                    return (
                        <EventDayContainer key={idx} day={day.day} events={day.event} defaultOpen={idx === 0} />
                    );
                })}
            </article>
        </section>
    );
}

function EventDayContainer({
    day,
    events,
    defaultOpen = false,
}: {
    day: string;
    events: EventData[];
    defaultOpen?: boolean;
}) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className={`${styles.event_day_container} magic-parchment`}>
            <div
                className={`${styles.day_header} cursor-pointer select-none flex items-center justify-between w-full px-4 pt-4`}
                onClick={() => setIsOpen(!isOpen)}
            >
                {/* Spacer to center the date text visually if needed, or just justify-between */}
                <div className="w-6"></div>

                <h3 className="flex items-center text-xl font-bold">
                    <GiWizardStaff className="staff-icon mr-2" />
                    <span>{moment(day, 'DD-MM-YYYY').format('Do MMMM')}</span>
                    <GiWizardStaff className="staff-icon ml-2" />
                </h3>

                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <FaChevronDown />
                </motion.div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className={styles.events_grid_container}>
                            {events.map((event, idx) => (
                                <div key={idx} className={styles.event_grid_item}>
                                    <EventCard {...event} />
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export {
    EventCard,
    EventData,
    EventDayContainer,
    EventsNav,
    EventsSection,
    EventsV2,
};

export default EventsV2;