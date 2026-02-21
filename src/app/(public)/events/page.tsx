import React, { Suspense } from "react";
import { getPublicEvents } from "@/actions/event-actions";
import { EventsGridSkeleton } from "@/components/skeletons";
import { EventsList } from "@/components/events/events-list";
import Image from "next/image";
import * as motion from "framer-motion/client";

export const dynamic = "force-dynamic";

export default async function PublicEventsPage() {
  const events = await getPublicEvents();

  return (
    <main
      className="relative min-h-screen overflow-hidden z-10"
      style={{ backgroundColor: "#FFF8F0" }}
    >
      {/* Lotus Mandala Background - Fixed and Visible */}
      <div className="fixed inset-0 top-[30%] flex items-center justify-center opacity-[0.9] pointer-events-none z-0">
        <Image
          src="/images/background_web.webp"
          alt="Decorative lotus mandala"
          fill
          priority
          className="object-contain hidden md:block"
        />
        <Image
          src="/images/background_web_mobile.webp"
          alt="Decorative lotus mandala"
          fill
          priority
          className="object-contain w-fit md:hidden"
        />
      </div>

      {/* Left tribal border pattern */}
      <div
        className="absolute top-0 left-0 bottom-0 w-16 md:w-24 overflow-hidden hidden sm:block z-10"
        style={{
          backgroundImage: "url(/images/43a0b75b3caae95caa70550adda8ed60.webp)",
          backgroundRepeat: "repeat-y",
          backgroundSize: "100% auto",
          backgroundPosition: "top center",
        }}
      />


      {/* Main Content Content */}
      <div className="relative z-20 container mx-auto px-6 pt-24 pb-12 sm:pl-24 md:pl-32 lg:pl-40">
        <Suspense fallback={<EventsGridSkeleton />}>
          <EventsList initialEvents={events} />
        </Suspense>
      </div>
    </main>
  );
}
