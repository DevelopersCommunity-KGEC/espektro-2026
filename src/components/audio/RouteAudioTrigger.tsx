"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function RouteAudioTrigger() {
    const pathname = usePathname();
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const hasInteracted = useRef(false);

    useEffect(() => {
        // Initial interaction listener for mobile/safari autoplay policies
        const handleInteraction = () => {
            hasInteracted.current = true;
            document.removeEventListener("click", handleInteraction);
            document.removeEventListener("keydown", handleInteraction);
        };

        document.addEventListener("click", handleInteraction);
        document.addEventListener("keydown", handleInteraction);

        return () => {
            document.removeEventListener("click", handleInteraction);
            document.removeEventListener("keydown", handleInteraction);
        };
    }, []);

    useEffect(() => {
        // We only play on routes that are NOT the landing page
        if (pathname === "/") {
            return;
        }

        console.log(`[RouteAudioTrigger] Triggering audio for path: ${pathname}`);

        const playAudio = async () => {
            try {
                if (!audioRef.current) {
                    audioRef.current = new Audio("/music/STARTING SITE1.wav");
                    audioRef.current.volume = 0.5;
                }

                // Reset to start if already playing or finished
                audioRef.current.currentTime = 0;

                const playPromise = audioRef.current.play();

                if (playPromise !== undefined) {
                    playPromise.catch((error) => {
                        console.warn("[RouteAudioTrigger] Playback blocked by browser policy. Waiting for interaction.", error);
                    });
                }
            } catch (err) {
                console.error("[RouteAudioTrigger] Error playing audio:", err);
            }
        };

        // Small delay to allow page transition to settle
        const timer = setTimeout(playAudio, 300);

        return () => clearTimeout(timer);
    }, [pathname]);

    return null; // This component doesn't render anything
}
