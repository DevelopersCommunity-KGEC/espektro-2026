"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import EventForm from "@/components/EventForm";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";

interface EditEventModalProps {
    event: any;
}

export function EditEventModal({ event }: EditEventModalProps) {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const handleSuccess = () => {
        setOpen(false);
        router.refresh();
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <Pencil className="h-4 w-4" />
                    Edit Event
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Event</DialogTitle>
                    <DialogDescription>
                        Make changes to the event details here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <EventForm
                    initialData={event}
                    isEditing={true}
                    onSuccess={handleSuccess}
                />
            </DialogContent>
        </Dialog>
    );
}
