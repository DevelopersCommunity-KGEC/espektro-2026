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
import { VENUES } from "@/data/venues";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { EventData } from "@/types/events";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ImageUpload from "@/components/ui/image-upload";

const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    image: z.url("Must be a valid URL"),
    clubId: z.string().min(1, "Please select a club"),
    date: z.string().min(1, "Start Date is required"),
    endDate: z.string().min(1, "End Date is required"),
    venue: z.string().min(1, "Venue is required"),
    price: z.coerce.number().min(0, "Entry Fees must be 0 or greater"),
    capacity: z.coerce.number().min(-1, "Capacity cannot be less than -1"),
    maxTeamSize: z.coerce.number().min(1, "Max team size must be at least 1").default(1),
    allowMultipleBookings: z.boolean().default(false),
    allowBooking: z.boolean().default(true),
    isVisible: z.boolean(),
    editors: z.string().optional(),
}).refine((data) => {
    const start = new Date(data.date).getTime();
    const end = new Date(data.endDate).getTime();
    return end >= start;
}, {
    message: "End date cannot be before start date",
    path: ["endDate"],
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

    // console.log("Initial Data:", initialData);

    const toISTISOString = (dateInput: string | Date | undefined) => {
        if (!dateInput) return "";
        const date = new Date(dateInput);
        if (isNaN(date.getTime())) return "";

        // Add 5.5 hours to the UTC date object to adjust it to IST
        // This makes the internal time value match the IST wall clock time
        const istDate = new Date(date.getTime() + (5.5 * 60 * 60 * 1000));
        return istDate.toISOString().slice(0, 16);
    };

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: initialData?.title || "",
            description: initialData?.description || "",
            image: initialData?.image || "",
            date: toISTISOString(initialData?.date),
            endDate: toISTISOString(initialData?.endDate),
            venue: initialData?.venue || "",
            price: initialData?.price || 0,
            capacity: initialData?.capacity,
            maxTeamSize: initialData?.maxTeamSize || 1,
            allowMultipleBookings: initialData?.allowMultipleBookings ?? false,
            allowBooking: initialData?.allowBooking ?? true,
            isVisible: initialData?.isVisible ?? true,
            editors: initialData?.editors?.join(", ") || "",
            clubId: lockedClubId || initialData?.clubId || "",
        },
    });

    const clubId = form.watch("clubId");
    const allowBooking = form.watch("allowBooking");
    const date = form.watch("date");

    // Auto-fill endDate with date if endDate is empty
    React.useEffect(() => {
        if (date && !form.getValues("endDate")) {
            form.setValue("endDate", date);
        }
    }, [date, form]);

    // Clear price, capacity, and maxTeamSize when allowBooking is disabled
    React.useEffect(() => {
        if (!allowBooking) {
            form.setValue("price", 0);
            form.setValue("capacity", -1);
            form.setValue("maxTeamSize", 1);
            form.setValue("allowMultipleBookings", false);
        }
    }, [allowBooking, form]);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setLoading(true);
        try {
            // Ensure values are reset if booking is disabled
            // This is a safety check in case the useEffect didn't fire or state is inconsistent
            if (!values.allowBooking) {
                values.price = 0;
                values.capacity = -1;
                values.maxTeamSize = 1;
                values.allowMultipleBookings = false;
            }

            const data = {
                ...values,
                date: new Date(values.date + "+05:30").toISOString(),
                endDate: new Date(values.endDate + "+05:30").toISOString(),
                price: Number(values.price),
                capacity: Number(values.capacity),
                maxTeamSize: Number(values.maxTeamSize),
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
        <Card className="max-w-2xl mx-auto" >
            <CardHeader>
                <CardTitle>{isEditing ? "Edit Event" : "Create New Event"}</CardTitle>
                <CardDescription>Fill in the details for the event.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="clubId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="gap-1">Club<span className="text-red-500">*</span></FormLabel>
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

                            <FormField
                                control={form.control}
                                name="isVisible"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-3 mt-8">
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
                        </div>

                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Event Title" {...field} autoFocus />
                                    </FormControl>
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
                                        <FormLabel>Start Date & Time</FormLabel>
                                        <FormControl>
                                            <Input type="datetime-local" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="endDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>End Date & Time</FormLabel>
                                        <FormControl>
                                            <Input type="datetime-local" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="venue"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Venue</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select venue" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {VENUES.map((venue) => (
                                                    <SelectItem key={venue.name} value={venue.name}>
                                                        {venue.name}
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
                                name="allowBooking"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-3 mt-8">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>
                                                Allow Booking
                                            </FormLabel>
                                            <FormDescription>
                                                Enable or disable ticket booking.
                                            </FormDescription>
                                        </div>
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
                                        <FormLabel>Entry Fees (₹)</FormLabel>
                                        <FormControl>
                                            <Input type="number" min="0" {...field} value={field.value as number} disabled={!allowBooking} />
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
                                        <div className="flex gap-2 items-center">
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    min="-1"
                                                    {...field}
                                                    value={field.value === -1 ? "" : (field.value?.toString() ?? "")}
                                                    disabled={field.value === -1 || !allowBooking}
                                                    placeholder={field.value === -1 ? "Unlimited" : "Capacity"}
                                                    className={field.value === -1 ? "opacity-50 flex-1" : "flex-1"}
                                                />
                                            </FormControl>
                                            <div className="flex items-center space-x-2 whitespace-nowrap">
                                                <Checkbox
                                                    id="unlimited-capacity"
                                                    checked={field.value === -1}
                                                    disabled={!allowBooking}
                                                    onCheckedChange={(checked) => {
                                                        if (checked) {
                                                            field.onChange(-1);
                                                        } else {
                                                            field.onChange("");
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
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="maxTeamSize"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Max Team Size</FormLabel>
                                        <FormControl>
                                            <Input type="number" min="1" {...field} value={field.value as number} disabled={!allowBooking} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="allowMultipleBookings"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-3 mt-8">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                disabled={!allowBooking}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>
                                                Allow Multiple Tickets
                                            </FormLabel>
                                            <FormDescription>
                                                Allow users to book multiple tickets. (Default: One per user)
                                            </FormDescription>
                                        </div>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <Tabs defaultValue="write" className="w-full">
                                        <TabsList className="mb-2">
                                            <TabsTrigger value="write">Write</TabsTrigger>
                                            <TabsTrigger value="preview">Preview</TabsTrigger>
                                        </TabsList>
                                        <TabsContent value="write" className="mt-0">
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Event description... (Markdown supported)"
                                                    rows={8}
                                                    {...field}
                                                />
                                            </FormControl>
                                        </TabsContent>
                                        <TabsContent value="preview" className="mt-0">
                                            <div className="prose prose-sm dark:prose-invert max-w-none border rounded-md p-4 min-h-50 bg-card overflow-y-auto">
                                                {field.value ? (
                                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                        {field.value}
                                                    </ReactMarkdown>
                                                ) : (
                                                    <p className="text-muted-foreground italic">No description content to preview</p>
                                                )}
                                            </div>
                                        </TabsContent>
                                    </Tabs>
                                    <FormDescription>
                                        Supports standard Markdown syntax (headers, lists, links, etc).
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="image"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Event Poster</FormLabel>
                                    <FormControl>
                                        <ImageUpload
                                            value={field.value}
                                            onChange={field.onChange}
                                            onRemove={() => field.onChange("")}
                                            folder={clubId ? `clubs/${clubId}/events` : "clubs/general/events"}
                                            disabled={!clubId}
                                        />
                                    </FormControl>
                                    {!clubId && <FormDescription className="text-amber-600 font-medium">Please select a club above to enable image upload.</FormDescription>}
                                    <FormMessage />
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
