"use client";

import React, { useEffect, useState, useRef, useCallback, useSyncExternalStore } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { verifyTicket } from "@/actions/ticket-actions";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { ScannerSkeleton } from "@/components/skeletons";
import { Loader2, SwitchCamera, Zap, ZapOff, ScanLine } from "lucide-react";
import { Button } from "@/components/ui/button";

// Ensures consistent server/client first-render to avoid hydration mismatch
const emptySubscribe = () => () => { };
function useIsMounted() {
    return useSyncExternalStore(
        emptySubscribe,
        () => true,  // client: mounted
        () => false  // server: not mounted
    );
}

/** Safely stop and clear an Html5Qrcode instance, returning a promise */
async function safeStopScanner(instance: Html5Qrcode | null): Promise<void> {
    if (!instance) return;
    try {
        const state = instance.getState();
        // States: 1=NOT_STARTED, 2=SCANNING, 3=PAUSED
        if (state === 2 || state === 3) {
            await instance.stop();
        }
    } catch (_) {
        // getState or stop may throw if already stopped / bad state
    }
    try {
        instance.clear();
    } catch (_) {
        // clear may throw if DOM element already removed
    }
}

/** Small delay to let the browser fully release camera hardware */
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function ScanPage() {
    const [scanResult, setScanResult] = useState<any>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
    const [torchOn, setTorchOn] = useState(false);
    const [hasMultipleCameras, setHasMultipleCameras] = useState(false);
    const [hasTorch, setHasTorch] = useState(false);

    const isMounted = useIsMounted();
    const { data: session, isPending } = authClient.useSession();
    const router = useRouter();

    const isProcessingRef = useRef(false);
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const cameraCheckedRef = useRef(false);

    useEffect(() => {
        if (!isPending && !session) {
            router.replace("/login");
        }
    }, [session, isPending, router]);

    // Check available cameras once (not inside the scanner effect)
    useEffect(() => {
        if (cameraCheckedRef.current) return;
        cameraCheckedRef.current = true;
        Html5Qrcode.getCameras()
            .then((devices) => {
                setHasMultipleCameras(devices && devices.length > 1);
            })
            .catch((err) => {
                console.warn("Error checking cameras", err);
            });
    }, []);

    useEffect(() => {
        if (!isScanning) return;

        let isMounted = true;
        let currentScanner: Html5Qrcode | null = null;

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

        async function startScanner(retries = 3): Promise<void> {
            // First, fully release any previous scanner instance
            if (scannerRef.current) {
                await safeStopScanner(scannerRef.current);
                scannerRef.current = null;
                // Give the browser time to release the camera hardware
                await delay(400);
            }

            if (!isMounted) return;

            const scanner = new Html5Qrcode("reader");
            scannerRef.current = scanner;
            currentScanner = scanner;

            try {
                await scanner.start(
                    { facingMode },
                    config,
                    (decodedText) => {
                        if (isMounted) onScanSuccess(decodedText);
                    },
                    () => { }
                );

                if (!isMounted) {
                    await safeStopScanner(scanner);
                    return;
                }

                // Check torch capability
                try {
                    const capabilities = scanner.getRunningTrackCameraCapabilities();
                    setHasTorch(!!(capabilities as any).torch);
                } catch (_) {
                    setHasTorch(false);
                }
            } catch (err: any) {
                if (!isMounted) return;

                const isResourceBusy =
                    err?.name === "NotReadableError" ||
                    (typeof err?.message === "string" &&
                        err.message.includes("Could not start video source"));

                if (isResourceBusy && retries > 0) {
                    console.warn(`Camera busy, retrying... (${retries} left)`);
                    // Clean up the failed attempt
                    await safeStopScanner(scanner);
                    scannerRef.current = null;
                    // Wait longer for camera hardware to free up
                    await delay(800);
                    if (isMounted) {
                        return startScanner(retries - 1);
                    }
                } else {
                    console.error("Error starting scanner", err);
                    setError(
                        isResourceBusy
                            ? "Camera is busy or unavailable. Please close other apps using the camera and try again."
                            : "Failed to start camera: " + (err?.message || err)
                    );
                    setIsScanning(false);
                }
            }
        }

        async function onScanSuccess(decodedText: string) {
            if (isProcessingRef.current) return;
            isProcessingRef.current = true;

            // Stop scanner before verifying to free up camera
            if (scannerRef.current) {
                await safeStopScanner(scannerRef.current);
                scannerRef.current = null;
            }

            if (isMounted) setIsScanning(false);
            if (isMounted) setLoading(true);

            try {
                const result = await verifyTicket(decodedText);
                if (isMounted) {
                    setScanResult(result);
                    if (!result.success) {
                        setError(result.message);
                    }
                }
            } catch (err: any) {
                if (isMounted) setError(err.message || "Verification failed");
            } finally {
                if (isMounted) setLoading(false);
                isProcessingRef.current = false;
            }
        }

        startScanner();

        return () => {
            isMounted = false;
            const instance = scannerRef.current || currentScanner;
            scannerRef.current = null;
            // Fire-and-forget cleanup — safeStopScanner won't throw
            safeStopScanner(instance);
        };
    }, [isScanning, facingMode]);

    const startScanning = useCallback(() => {
        setScanResult(null);
        setError("");
        setIsScanning(true);
        setTorchOn(false);
        isProcessingRef.current = false;
    }, []);

    const switchCamera = useCallback(() => {
        setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
        setTorchOn(false);
    }, []);

    const toggleTorch = useCallback(async () => {
        if (!scannerRef.current) return;
        try {
            await scannerRef.current.applyVideoConstraints({
                advanced: [{ torch: !torchOn }],
            } as any);
            setTorchOn(!torchOn);
        } catch (err) {
            console.error("Torch toggle failed", err);
        }
    }, [torchOn]);

    if (!isMounted || isPending || !session) return <ScannerSkeleton />;

    return (
        <div className="container mx-auto max-w-md p-4 min-h-screen flex flex-col">
            <h1 className="text-2xl font-bold mb-4 text-center">Ticket Scanner</h1>

            <div className="w-full bg-black rounded-lg overflow-hidden mb-6 min-h-[300px] relative">
                {/* Scanner logic handles this div */}
                {isScanning && <div id="reader" className="w-full h-full" />}

                {/* Fallback / Initial State */}
                {!isScanning && !loading && !scanResult && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-white bg-gray-900">
                        <ScanLine className="w-16 h-16 opacity-50" />
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
