"use client";

import React, { useEffect, useState, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { verifyTicket } from "@/actions/ticket-actions";
import { Button } from "@/components/ui/button";
import { Loader2, Camera, ScanLine } from "lucide-react";
import { useAuthorization } from "@/hooks/use-authorization";

export default function ScanPage() {
  const [scanResult, setScanResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const { isAuthorized, isLoading } = useAuthorization(['admin', 'security']);

  const isProcessingRef = useRef(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  if (isLoading || !isAuthorized) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
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
      () => { } // Ignore failures (scanning in progress)
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
        scannerRef.current.stop().catch(() => { });
      }
    };
  }, [isScanning]);

  const startScanning = () => {
    setScanResult(null);
    setError("");
    setIsScanning(true);
    isProcessingRef.current = false;
  };

  return (
    <div className="max-w-md mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
      <h1 className="text-2xl font-bold mb-8 text-center">Security Scanner</h1>

      {/* Initial State: Start Button */}
      {!isScanning && !scanResult && !error && !loading && (
        <div className="text-center space-y-6">
          <div className="bg-muted p-8 rounded-full inline-block">
            <ScanLine className="w-16 h-16 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">Ready to scan tickets</p>
          <Button
            size="lg"
            onClick={startScanning}
            className="w-full max-w-xs text-lg h-12"
          >
            <Camera className="mr-2 h-5 w-5" />
            Start Scanning
          </Button>
        </div>
      )}

      {/* Scanning State */}
      {isScanning && (
        <div className="w-full space-y-4">
          <div id="reader" className="overflow-hidden rounded-xl border-2 border-blue-500 bg-black aspect-square w-full"></div>
          <p className="text-center text-sm text-muted-foreground">Point camera at QR code</p>
          <Button variant="outline" onClick={() => setIsScanning(false)} className="w-full">
            Cancel
          </Button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg font-medium">Verifying Ticket...</p>
        </div>
      )}

      {/* Result State */}
      {(scanResult || error) && !loading && !isScanning && (
        <div className={`w-full p-6 rounded-2xl shadow-lg text-center animate-in fade-in zoom-in duration-300 ${scanResult?.success ? "bg-green-100 dark:bg-green-900/20" : "bg-red-100 dark:bg-red-900/20"
          }`}>
          <div className="mb-6">
            {scanResult?.success ? (
              <div className="text-6xl mb-4">✅</div>
            ) : (
              <div className="text-6xl mb-4">❌</div>
            )}
            <h2 className={`text-2xl font-bold ${scanResult?.success ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"
              }`}>
              {scanResult?.message || error}
            </h2>
          </div>

          {scanResult?.ticket && (
            <div className="text-left bg-white dark:bg-zinc-900 p-4 rounded-lg mb-6 shadow-sm">
              <div className="space-y-2">
                <div>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">Event</span>
                  <p className="font-bold text-lg leading-tight">{scanResult.ticket.eventId.title}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">User</span>
                  <p className="text-base">{scanResult.ticket.userEmail}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">Venue</span>
                  <p className="text-base">{scanResult.ticket.eventId.venue}</p>
                </div>
                {scanResult.ticket.status === "checked-in" && (
                  <div className="pt-2 border-t mt-2">
                    <p className="text-xs text-orange-600 font-medium">
                      Checked in at: {new Date(scanResult.ticket.checkInTime).toLocaleTimeString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          <Button
            onClick={startScanning}
            size="lg"
            className="w-full font-bold text-lg h-12"
          >
            <Camera className="mr-2 h-5 w-5" />
            Scan Next
          </Button>
        </div>
      )}
    </div>
  );
}