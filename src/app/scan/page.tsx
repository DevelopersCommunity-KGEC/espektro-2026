"use client";

import React, { useEffect, useState, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { verifyTicket } from "@/actions/ticket-actions";
// import { Button } from "@/components/ui/button"; // Not used in snippet
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react"; // Import Loader2

export default function ScanPage() {
    const [scanResult, setScanResult] = useState<any>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [isScanning, setIsScanning] = useState(false);

    const { data: session, isPending } = authClient.useSession();
    const router = useRouter();

    const isProcessingRef = useRef(false);
    const scannerRef = useRef<Html5Qrcode | null>(null);

    useEffect(() => {
        if (!isPending && !session) {
            router.replace("/login");
        }
    }, [session, isPending, router]);

    useEffect(() => {
        if (!isScanning) return;

        const scanner = new Html5Qrcode("reader");
        scannerRef.current = scanner;

        const config = {
            fps: 10,
            qrbox: (viewfinderWidth: number, viewfinderHeight: number) => {
                const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
                return {
                    width: Math.floor(minEdge * 0.7),
                    height: Math.floor(minEdge * 0.7),
                };
            },
        };

        scanner.start(
            { facingMode: "environment" },
            config,
            onScanSuccess,
            () => { }
        ).catch(err => {
            console.error("Error starting scanner", err);
            setError("Failed to start camera: " + (err?.message || err));
            setIsScanning(false);
        });

        async function onScanSuccess(decodedText: string) {
            if (isProcessingRef.current) return;
            isProcessingRef.current = true;

            try {
                if (scannerRef.current) {
                    await scannerRef.current.stop();
                    scannerRef.current = null;
                }
            } catch (e) {
                console.error("Failed to stop scanner", e);
            }

            setIsScanning(false);
            setLoading(true);

            try {
                // Pass clubId context if enforced? verifyTicket currently infers from ticket.eventId
                // But we could enforce client side check if we knew the clubs.
                const result = await verifyTicket(decodedText);
                setScanResult(result);
                if (!result.success) {
                    setError(result.message);
                }
            } catch (err: any) {
                setError(err.message || "Verification failed");
            } finally {
                setLoading(false);
                isProcessingRef.current = false;
            }
        }

        return () => {
            if (scannerRef.current) {
                const scanner = scannerRef.current;
                scanner.stop()
                    .then(() => {
                        try {
                            scanner.clear();
                        } catch (e) {
                            console.warn("Failed to clear scanner", e);
                        }
                    })
                    .catch((err) => {
                        console.warn("Scanner cleanup error", err);
                    });
            }
        };
    }, [isScanning]);

    const startScanning = () => {
        setScanResult(null);
        setError("");
        setIsScanning(true);
        isProcessingRef.current = false;
    };

    if (isPending || !session) return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="container mx-auto max-w-md p-4 min-h-screen flex flex-col">
            <h1 className="text-2xl font-bold mb-4 text-center">Ticket Scanner</h1>

            <div id="reader" className="w-full bg-black rounded-lg overflow-hidden mb-6 min-h-75 relative">
                {!isScanning && !loading && !scanResult && (
                    <div className="absolute inset-0 flex items-center justify-center text-white">
                        <button onClick={startScanning} className="bg-primary px-6 py-3 rounded-lg font-bold">
                            Start Camera
                        </button>
                    </div>
                )}
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white z-10">
                        <Loader2 className="h-10 w-10 animate-spin" />
                    </div>
                )}
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            {scanResult && (
                <div className={`border px-4 py-4 rounded relative mb-4 ${scanResult.success ? (scanResult.warning ? 'bg-yellow-100 border-yellow-400 text-yellow-700' : 'bg-green-100 border-green-400 text-green-700') : 'bg-red-100 border-red-400 text-red-700'}`}>
                    <div className="font-bold text-lg mb-2">
                        {scanResult.success ? (scanResult.warning ? "⚠️ ALREADY SCANNED" : "✅ ACCESS GRANTED") : "❌ ACCESS DENIED"}
                    </div>
                    <p className="font-medium">{scanResult.message}</p>

                    {scanResult.ticket && (
                        <div className="mt-3 text-sm border-t pt-2 border-current/20">
                            <p><strong>Name:</strong> {scanResult.ticket.eventId?.title}</p>
                            <p><strong>User:</strong> {scanResult.ticket.userEmail}</p>
                            <p><strong>Type:</strong> {scanResult.ticket.issueType}</p>
                        </div>
                    )}

                    <button
                        onClick={startScanning}
                        className="mt-4 w-full bg-white/50 hover:bg-white/80 border border-current text-inherit font-bold py-2 px-4 rounded"
                    >
                        Scan Next
                    </button>
                </div>
            )}

            {isScanning && (
                <button onClick={() => setIsScanning(false)} className="w-full py-3 bg-red-600 text-white rounded font-bold">
                    Stop Scanning
                </button>
            )}
        </div>
    );
}
