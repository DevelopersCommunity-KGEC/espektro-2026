"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { createManualTicket } from "@/actions/club-actions";
import { Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

const manualTicketSchema = z.object({
    email: z.string().email("Invalid email address"),
    eventId: z.string().min(1, "Please select an event"),
    name: z.string().optional(),
    phone: z.string().optional(),
});

type ManualTicketFormValues = z.infer<typeof manualTicketSchema>;

interface ManualTicketDialogProps {
    clubId: string;
    events: { _id: string; title: string }[];
}

export function ManualTicketDialog({ clubId, events }: ManualTicketDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const form = useForm<ManualTicketFormValues>({
        resolver: zodResolver(manualTicketSchema),
        defaultValues: {
            email: "",
            eventId: "",
            name: "",
            phone: "",
        },
    });

    async function onSubmit(data: ManualTicketFormValues) {
        setLoading(true);
        try {
            const result = await createManualTicket({
                clubId,
                eventId: data.eventId,
                userEmail: data.email,
                userName: data.name,
                phone: data.phone
            });

            if (result.success) {
                toast.success(result.message);
                setOpen(false);
                form.reset();
                router.refresh();
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to create ticket");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Manual Ticket
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-106.25 bg-gray-50">
                <DialogHeader>
                    <DialogTitle>Issue Manual Ticket</DialogTitle>
                    <DialogDescription>
                        Create a ticket manually for a participant.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="eventId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Event</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select an event" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {events.map((event) => (
                                                <SelectItem key={event._id} value={event._id}>
                                                    {event.title}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="participant@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name (Optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John Doe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Issue Ticket
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
