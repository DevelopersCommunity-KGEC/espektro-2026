"use client";

import React, { useEffect, useState, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { verifyTicket } from "@/actions/ticket-actions";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { ScannerSkeleton } from "@/components/skeletons";
import { Loader2, SwitchCamera, Zap, ZapOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ScanPage() {
    const [scanResult, setScanResult] = useState<any>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
    const [torchOn, setTorchOn] = useState(false);
    const [hasMultipleCameras, setHasMultipleCameras] = useState(false);
    const [hasTorch, setHasTorch] = useState(false);

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

        Html5Qrcode.getCameras().then(devices => {
            setHasMultipleCameras(devices && devices.length > 1);
        }).catch(err => {
            console.warn("Error checking cameras", err);
        });

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
            { facingMode: facingMode },
            config,
            onScanSuccess,
            () => { }
        ).then(() => {
            try {
                const capabilities = scanner.getRunningTrackCameraCapabilities();
                setHasTorch(!!(capabilities as any).torch);
            } catch (e) {
                console.warn("Could not get camera capabilities", e);
                setHasTorch(false);
            }
        }).catch(err => {
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
    }, [isScanning, facingMode]);

    const startScanning = () => {
        setScanResult(null);
        setError("");
        setIsScanning(true);
        setTorchOn(false);
        isProcessingRef.current = false;
    };

    const switchCamera = () => {
        setFacingMode(prev => prev === "environment" ? "user" : "environment");
        setTorchOn(false);
    };

    const toggleTorch = async () => {
        if (!scannerRef.current) return;
        try {
            await scannerRef.current.applyVideoConstraints({
                advanced: [{ torch: !torchOn }]
            } as any);
            setTorchOn(!torchOn);
        } catch (err) {
            console.error("Torch toggle failed", err);
            // Don't set error state as it might just be unavailable
        }
    };

    if (isPending || !session) return <ScannerSkeleton />;

    return (
        <div className="container mx-auto max-w-md p-4 min-h-screen flex flex-col">
            <h1 className="text-2xl font-bold mb-4 text-center">Ticket Scanner</h1>

            <div id="reader" className="w-full bg-black rounded-lg overflow-hidden mb-6 min-h-75 relative">
                {!isScanning && !loading && !scanResult && (
                    <div className="absolute inset-0 flex items-center justify-center text-white">
                        <Button onClick={startScanning} size="lg" className="font-bold">
                            Start Camera
                        </Button>
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

                    <Button
                        onClick={startScanning}
                        variant="secondary"
                        className="mt-4 w-full font-bold"
                    >
                        Scan Next
                    </Button>
                </div>
            )}

            {isScanning && (
                <div className="flex gap-2">
                    <Button onClick={() => setIsScanning(false)} variant="destructive" className="flex-1 py-6 font-bold">
                        Stop Scanning
                    </Button>
                    {hasMultipleCameras && (
                        <Button onClick={switchCamera} size="icon" variant="secondary" className="w-16 h-auto" title="Switch Camera">
                            <SwitchCamera className="w-6 h-6" />
                        </Button>
                    )}
                    {hasTorch && (
                        <Button onClick={toggleTorch} size="icon" variant={torchOn ? "default" : "secondary"} className={`w-16 h-auto ${torchOn ? 'bg-secondary hover:bg-secondary/80' : ''}`} title="Toggle Flashlight">
                            {torchOn ? <ZapOff className="w-6 h-6" /> : <Zap className="w-6 h-6" />}
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}
