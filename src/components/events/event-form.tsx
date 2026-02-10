"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createEvent, updateEvent } from "@/actions/admin-actions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { clubs } from "@/data/clubs";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { EventData } from "@/types/events";

const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    image: z.string().url("Must be a valid URL"),
    clubId: z.string().min(1, "Please select a club"),
    date: z.string().min(1, "Date is required"),
    venue: z.string().min(1, "Venue is required"),
    price: z.coerce.number().min(0, "Price must be 0 or greater"),
    capacity: z.coerce.number().min(-1, "Capacity cannot be less than -1"),
    isVisible: z.boolean(),
    editors: z.string().optional(),
});

interface EventFormProps {
    initialData?: Partial<EventData>;
    isEditing?: boolean;
    onSuccess?: () => void;
    redirectPath?: string;
    lockedClubId?: string;
}

export default function EventForm({ initialData, isEditing, onSuccess, redirectPath, lockedClubId }: EventFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: initialData?.title || "",
            description: initialData?.description || "",
            image: initialData?.image || "",
            date: initialData?.date ? new Date(initialData.date).toISOString().slice(0, 16) : "",
            venue: initialData?.venue || "",
            price: initialData?.price || 0,
            capacity: initialData?.capacity || 0,
            isVisible: initialData?.isVisible ?? true,
            editors: initialData?.editors?.join(", ") || "",
            clubId: lockedClubId || initialData?.clubId || "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setLoading(true);
        try {
            const data = {
                ...values,
                price: Number(values.price),
                capacity: Number(values.capacity),
                editors: values.editors ? values.editors.split(",").map((e) => e.trim()).filter(Boolean) : [],
            };

            if (isEditing && initialData?._id) {
                await updateEvent(initialData._id, data);
            } else {
                await createEvent(data);
            }

            if (onSuccess) {
                onSuccess();
            } else if (redirectPath) {
                router.push(redirectPath);
                router.refresh();
            } else {
                router.push("/dashboard/events");
                router.refresh();
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>{isEditing ? "Edit Event" : "Create New Event"}</CardTitle>
                <CardDescription>Fill in the details for the event.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Event Title" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Event description..." rows={4} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="image"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Image URL</FormLabel>
                                    <FormControl>
                                        <Input type="url" placeholder="https://..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="clubId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Club</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        disabled={!!lockedClubId}
                                        value={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a club" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {clubs.map((club) => (
                                                <SelectItem key={club.id} value={club.id}>
                                                    {club.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="date"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Date & Time</FormLabel>
                                        <FormControl>
                                            <Input type="datetime-local" {...field} />
                                        </FormControl>
                                        <FormDescription>Set the date and time for the event</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="venue"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Venue</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Main Auditorium" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Price (₹)</FormLabel>
                                        <FormControl>
                                            <Input type="number" min="0" {...field} value={field.value as number} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="capacity"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Capacity</FormLabel>
                                        <div className="flex gap-3 items-center">
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    min="-1"
                                                    {...field}
                                                    value={field.value as number}
                                                    disabled={field.value === -1}
                                                    className={field.value === -1 ? "opacity-50" : ""}
                                                />
                                            </FormControl>
                                            <div className="flex items-center space-x-2 whitespace-nowrap">
                                                <Checkbox
                                                    id="unlimited-capacity"
                                                    checked={field.value === -1}
                                                    onCheckedChange={(checked) => {
                                                        if (checked) {
                                                            field.onChange(-1);
                                                        } else {
                                                            field.onChange(0);
                                                        }
                                                    }}
                                                />
                                                <label
                                                    htmlFor="unlimited-capacity"
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                    Unlimited
                                                </label>
                                            </div>
                                        </div>
                                        <FormDescription>
                                            {field.value === -1
                                                ? <span className="text-blue-600 font-medium">Capacity is unlimited (shown as Not Defined to users)</span>
                                                : field.value === 0
                                                    ? <span className="text-amber-600">Capacity is 0. No tickets can be sold.</span>
                                                    : "Number of tickets available for sale."
                                            }
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* <FormField
                            control={form.control}
                            name="editors"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Editors</FormLabel>
                                    <FormControl>
                                        <Input placeholder="email1@example.com, email2@example.com" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Comma separated emails of users who can edit this event.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        /> */}

                        <FormField
                            control={form.control}
                            name="isVisible"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>
                                            Visible to Public
                                        </FormLabel>
                                    </div>
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-4 pt-4">
                            <Button type="button" variant="outline" onClick={() => router.back()}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isEditing ? "Update Event" : "Create Event"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
