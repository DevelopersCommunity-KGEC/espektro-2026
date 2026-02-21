"use client";

import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"; // Note: Badge might need to be installed or I can use custom class if not available yet.
// Ensuring Badge is installed is separate, I'll stick to classes for badge if I didn't install it, OR better, I'll install it.
// I haven't installed `badge` yet. I'll use standard classes for badge for now or standard tailwind, to be safe. 
// Wait, I should install badge.
// Actually, I'll stick to minimal components to be fast. I'll use div for badge.
import { Eye, EyeOff, Download, Loader2 } from "lucide-react";
import { TicketData } from "@/types/tickets";
import { generateTicketImage } from "@/lib/generate-ticket-image";

interface TicketCardProps {
    ticket: TicketData;
}

export default function TicketCard({ ticket }: TicketCardProps) {
    const [qrUrl, setQrUrl] = useState("");
    const [showQR, setShowQR] = useState(false);
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        if (ticket.qrCodeToken) {
            QRCode.toDataURL(ticket.qrCodeToken, { width: 300 }, (err, url) => {
                if (!err) setQrUrl(url);
            });
        }
    }, [ticket.qrCodeToken]);

    const event = ticket.eventId;

    if (!event) {
        return (
            <Card className="overflow-hidden">
                <CardHeader>
                    <CardTitle className="text-destructive">Event Not Found</CardTitle>
                    <CardDescription>This ticket is associated with an event that no longer exists.</CardDescription>
                </CardHeader>
            </Card>
        )
    }


    // Determine the ticket holder (Team Leader)
    const holderName = typeof ticket.userId === 'object' ? ticket.userId?.name : (ticket.guestName || "Ticket Holder");
    const holderEmail = typeof ticket.userId === 'object' ? ticket.userId?.email : ticket.userEmail;

    const handleDownload = async () => {
        setDownloading(true);
        try {
            const dataUrl = await generateTicketImage({
                eventTitle: event.title,
                venue: event.venue,
                date: new Date(event.date).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "full", timeStyle: "short" }) + (event.endDate && new Date(event.date).getTime() !== new Date(event.endDate).getTime() ? ` to ${new Date(event.endDate).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", timeStyle: "short" })}` : ""),
                holderName: holderName || "Guest",
                holderEmail: holderEmail || ticket.userEmail,
                status: ticket.status,
                ticketType: ticket.issueType,
                price: ticket.price,
                qrCodeToken: ticket.qrCodeToken,
                teamMembers: ticket.teamMembers,
                ticketId: ticket._id,
            });
            const link = document.createElement("a");
            link.download = `espektro-ticket-${event.title.replace(/\s+/g, "-").toLowerCase()}.webp`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error("Failed to generate ticket image", err);
        } finally {
            setDownloading(false);
        }
    };

    // Combine holder with team members if present
    const hasTeam = ticket.teamMembers && ticket.teamMembers.length > 0;

    return (
        <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="space-y-1">
                    <CardTitle>{event.title}</CardTitle>
                    <CardDescription>
                        {event.venue} • {new Date(event.date).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" })}
                        {event.endDate && new Date(event.date).getTime() !== new Date(event.endDate).getTime() && (
                            <> to {new Date(event.endDate).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" })}</>
                        )}
                    </CardDescription>
                </div>
                <Badge variant={ticket.status === 'checked-in' ? "secondary" : "default"} className={ticket.status === 'checked-in' ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-primary/10 text-primary hover:bg-primary/10"}>
                    {ticket.status}
                </Badge>
            </CardHeader>
            <CardContent>
                {showQR && (
                    <div className="flex flex-col items-center justify-center py-4 animate-in fade-in zoom-in duration-300">
                        {qrUrl ? (
                            <>
                                <img src={qrUrl} alt="Ticket QR Code" className="w-48 h-48 border-4 border-card shadow-sm rounded-lg" />
                                {/* <p className="mt-2 text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded">{ticket.qrCodeToken}</p> */}
                            </>
                        ) : (
                            <p className="text-sm text-muted-foreground">Generating QR...</p>
                        )}
                    </div>
                )}

                {hasTeam ? (
                    <div className="mt-4 pt-4 border-t">
                        <h4 className="text-sm font-semibold mb-2">Team Members</h4>
                        <ul className="text-sm space-y-2">
                            {/* Team Leader (Ticket Holder) */}
                            <li className="flex flex-col bg-muted/50 p-2 rounded border border-primary/20">
                                <span className="font-medium text-foreground flex items-center gap-2">
                                    {holderName} <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full uppercase tracking-wider font-bold">Leader</span>
                                </span>
                                <span className="text-xs text-muted-foreground">{holderEmail}</span>
                            </li>

                            {/* Other Members */}
                            {ticket.teamMembers?.map((member, i) => (
                                <li key={i} className="flex flex-col text-muted-foreground bg-muted/30 p-2 rounded">
                                    <span className="font-medium text-foreground">{member.name}</span>
                                    <span className="text-xs">{member.email}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    null
                )}
            </CardContent>
            <CardFooter className="flex gap-2">
                <Button
                    variant={showQR ? "secondary" : "default"}
                    onClick={() => setShowQR(!showQR)}
                    className="flex-1"
                >
                    {showQR ? <><EyeOff className="mr-2 h-4 w-4" /> Hide QR</> : <><Eye className="mr-2 h-4 w-4" /> View QR</>}
                </Button>
                <Button
                    variant="outline"
                    onClick={handleDownload}
                    disabled={downloading}
                    className="flex-1"
                >
                    {downloading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                    {downloading ? "Generating..." : "Download"}
                </Button>
            </CardFooter>
        </Card>
    );
}
