"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Application error:", error);
    }, [error]);

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="max-w-lg w-full text-center space-y-8">
                {/* Decorative rangoli-inspired border */}
                <div className="relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-32 h-32 rounded-full border-2 border-dashed border-primary/20 animate-[spin_20s_linear_infinite]" />
                    </div>
                    <div className="relative mx-auto w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <span className="text-4xl">🪔</span>
                    </div>
                </div>

                <div className="space-y-3">
                    <h1 className="text-3xl font-bold tracking-tight font-serif text-foreground">
                        Something went wrong
                    </h1>
                    <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                        An unexpected error occurred. Don&apos;t worry — let&apos;s get you back on track.
                    </p>
                    {error?.digest && (
                        <p className="text-[10px] text-muted-foreground/50 font-mono mt-2">
                            Ref: {error.digest}
                        </p>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button onClick={reset} className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
                        <RotateCcw className="h-4 w-4" />
                        Try Again
                    </Button>
                    <Button variant="outline" className="gap-2 border-border hover:bg-muted" asChild>
                        <Link href="/">
                            <Home className="h-4 w-4" />
                            Back to Espektro
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
