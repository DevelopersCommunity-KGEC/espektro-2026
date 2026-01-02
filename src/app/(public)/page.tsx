import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            {/* Hero Section */}
            <section className="relative flex flex-col items-center justify-centerpx-4 pt-32 pb-16 md:pt-48 md:pb-32 text-center overflow-hidden">
                {/* Background Gradients/Effects could go here */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/20 blur-[100px] rounded-full -z-10 opacity-50" />

                <div className="container px-4 md:px-6 mx-auto flex flex-col items-center space-y-8">
                    <div className="space-y-4 max-w-3xl">
                        <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                            Experience the Magic of <br className="hidden sm:inline" />
                            <span className="text-primary bg-clip-text">Espektro 2026</span>
                        </h1>
                        <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                            The ultimate college fest experience. Discover events, book tickets, and make memories that last a lifetime.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                        <Button asChild size="lg" className="h-12 px-8 text-base">
                            <Link href="/events">
                                Browse Events
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base">
                            <Link href="/my-tickets">
                                My Tickets
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Features / Highlights Preview (Optional placeholder for more content) */}
            <section className="container px-4 md:px-6 mx-auto py-12 md:py-24 space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold">30+ Events</h3>
                        <p className="text-muted-foreground">From cultural performances to tech competitions.</p>
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold">Seamless Booking</h3>
                        <p className="text-muted-foreground">Book tickets instantly with our secure platform.</p>
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold">Live Updates</h3>
                        <p className="text-muted-foreground">Stay tuned with real-time event schedules.</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
