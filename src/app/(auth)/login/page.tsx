"use client";

import React, { Suspense } from "react";
import { authClient } from "@/lib/auth-client";
import { useSearchParams } from "next/navigation";

function LoginContent() {
    const searchParams = useSearchParams();
    const callbackURL = searchParams.get("callbackUrl") || "/";

    const handleLogin = async () => {
        await authClient.signIn.social({
            provider: "google",
            callbackURL: callbackURL, // Use the dynamic callback URL
        });
    };

    return (
        <div className="max-w-md w-full p-8 bg-card rounded-2xl shadow-xl text-center">
            <h1 className="text-3xl font-bold mb-2">Espektro 2026</h1>
            <p className="text-muted-foreground mb-8">Sign in to book your tickets</p>

            <button
                onClick={handleLogin}
                className="w-full flex items-center justify-center gap-3 bg-card border border-border text-foreground py-3 px-4 rounded-xl font-semibold hover:bg-muted transition-colors"
            >
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                Continue with Google
            </button>
        </div>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <Suspense fallback={<div>Loading...</div>}>
                <LoginContent />
            </Suspense>
        </div>
    );
}
