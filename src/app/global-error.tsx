"use client";

import { useEffect } from "react";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Global error:", error);
    }, [error]);

    return (
        <html lang="en">
            <body style={{
                margin: 0,
                fontFamily: "'Playfair Display', Georgia, serif",
                // Espektro warm background
                background: "hsl(34, 22%, 96%)",
                color: "hsl(0, 0%, 10%)",
            }}>
                <div style={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "1rem",
                }}>
                    <div style={{ maxWidth: "28rem", textAlign: "center" }}>
                        {/* Diya emoji as visual anchor */}
                        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🪔</div>

                        <h1 style={{
                            fontSize: "1.75rem",
                            fontWeight: 700,
                            marginBottom: "0.5rem",
                            color: "hsl(0, 0%, 10%)",
                        }}>
                            Something went wrong
                        </h1>
                        <p style={{
                            // muted-foreground
                            color: "hsl(26, 13%, 34%)",
                            fontSize: "0.875rem",
                            marginBottom: "1.5rem",
                            lineHeight: 1.6,
                        }}>
                            A critical error occurred. Please try refreshing the page.
                        </p>
                        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
                            <button
                                onClick={reset}
                                style={{
                                    padding: "0.625rem 1.5rem",
                                    borderRadius: "0.625rem",
                                    border: "none",
                                    // primary: terracotta
                                    background: "hsl(14, 86%, 39%)",
                                    color: "#fff",
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    fontSize: "0.875rem",
                                    fontFamily: "system-ui, sans-serif",
                                }}
                            >
                                Try Again
                            </button>
                            <a
                                href="/"
                                style={{
                                    padding: "0.625rem 1.5rem",
                                    borderRadius: "0.625rem",
                                    // border color
                                    border: "1px solid hsl(29, 23%, 78%)",
                                    background: "transparent",
                                    color: "hsl(0, 0%, 10%)",
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    fontSize: "0.875rem",
                                    textDecoration: "none",
                                    fontFamily: "system-ui, sans-serif",
                                }}
                            >
                                Back to Espektro
                            </a>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    );
}
