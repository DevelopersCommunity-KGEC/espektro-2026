"use client";

import React from "react";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
    const handleLogin = async () => {
        await authClient.signIn.social({
            provider: "google",
            callbackURL: "/",
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-xl text-center">
                <h1 className="text-3xl font-bold mb-2">Espektro 2026</h1>
                <p className="text-gray-500 mb-8">Sign in to book your tickets</p>

                <button
                    onClick={handleLogin}
                    className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                    <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                    Continue with Google
                </button>
            </div>
        </div>
    );
}
