"use client";

import { useEffect, useState } from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ShieldAlert } from "lucide-react";

export function TicketDisclaimerDialog({ hasTickets }: { hasTickets: boolean }) {
    const [open, setOpen] = useState(false);
    const [dontShowAgain, setDontShowAgain] = useState(false);

    useEffect(() => {
        // Only show if user has tickets and hasn't dismissed it permanently
        if (hasTickets) {
            const isDismissed = localStorage.getItem("espektro-hide-ticket-disclaimer");
            if (!isDismissed) {
                setOpen(true);
            }
        }
    }, [hasTickets]);

    const handleClose = () => {
        if (dontShowAgain) {
            localStorage.setItem("espektro-hide-ticket-disclaimer", "true");
        }
        setOpen(false);
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2 text-amber-600">
                        <ShieldAlert className="h-5 w-5" />
                        Security Warning
                    </AlertDialogTitle>
                    <AlertDialogDescription className="space-y-2 pt-2 text-foreground" asChild>
                        <div>
                            <p className="font-medium">
                                Do not share your tickets or QR codes with anyone.
                            </p>
                            <p className="text-muted-foreground">
                                These tickets are for <strong>one-time use only</strong>. Once scanned, they cannot be used again.
                                Sharing your QR code may result in someone else claiming your entry, and you will be denied access.
                            </p>
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="flex items-center space-x-2 py-4">
                    <Checkbox
                        id="dont-show"
                        checked={dontShowAgain}
                        onCheckedChange={(checked) => setDontShowAgain(checked as boolean)}
                    />
                    <Label htmlFor="dont-show" className="text-sm font-normal cursor-pointer">
                        Don't show this warning again
                    </Label>
                </div>
                <AlertDialogFooter>
                    <AlertDialogAction onClick={handleClose}>I Understand</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
