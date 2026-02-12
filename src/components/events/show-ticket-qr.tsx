"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import QRCode from "qrcode";
import { Loader2, QrCode, X } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface ShowTicketQrProps {
    ticket: {
        qrCodeToken: string;
        _id: string;
        status: string;
    };
}

export function ShowTicketQr({ ticket }: ShowTicketQrProps) {
    const [qrUrl, setQrUrl] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (ticket.qrCodeToken) {
            QRCode.toDataURL(ticket.qrCodeToken, { width: 300, margin: 2 }, (err, url) => {
                if (!err) setQrUrl(url);
            });
        }
    }, [ticket.qrCodeToken]);


    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    className="w-full py-8 text-xl font-bold bg-green-600 hover:bg-green-700"
                >
                    <QrCode className="mr-2 h-6 w-6" />
                    View Your Ticket
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-center">Your Ticket QR Code</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center justify-center space-y-4 py-4">
                    {qrUrl ? (
                        <div className="p-4 bg-white rounded-xl shadow-sm border">
                            <img src={qrUrl} alt="Ticket QR Code" className="w-64 h-64" />
                        </div>
                    ) : (
                        <div className="w-64 h-64 flex items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    )}
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground">Show this QR code at the venue entry.</p>
                        <p className="text-xs text-muted-foreground mt-1">ID: {ticket._id}</p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
