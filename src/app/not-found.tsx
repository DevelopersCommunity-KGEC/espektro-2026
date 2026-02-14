import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowRight } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="max-w-lg w-full text-center space-y-8">
                {/* Decorative element */}
                <div className="relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-40 h-40 rounded-full border border-dashed border-secondary/30 animate-[spin_25s_linear_infinite]" />
                    </div>
                    <div className="relative">
                        <h1 className="text-8xl font-bold tracking-tighter text-primary/15 select-none">
                            404
                        </h1>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-5xl">🏮</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <h2 className="text-2xl font-bold tracking-tight font-serif text-foreground">
                        Lost in the festival?
                    </h2>
                    <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                        The page you&apos;re looking for doesn&apos;t exist. It may have been moved or the link is incorrect.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
                        <Link href="/">
                            <Home className="h-4 w-4" />
                            Back to Espektro
                        </Link>
                    </Button>
                    <Button variant="outline" className="gap-2 border-border hover:bg-muted" asChild>
                        <Link href="/events">
                            Browse Events
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
