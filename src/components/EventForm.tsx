"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createEvent, updateEvent } from "@/actions/admin-actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox"; // Need to check if I installed checkbox
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";

// I need to install checkbox if I haven't. I did init with many components, checking...
// The previous install command was: add button avatar dropdown-menu card sheet input separator label form dialog textarea
// "Checkbox" was NOT in that list. I will use standard checkbox or install it.
// I will verify installation first or just use "Input type='checkbox'" styled properly, OR I can run install command.
// I will assume I need to run install command for 'checkbox' specifically if I want the full shadcn experience.
import { Loader2 } from "lucide-react";

interface EventFormProps {
    initialData?: any;
    isEditing?: boolean;
    onSuccess?: () => void;
}

export default function EventForm({ initialData, isEditing, onSuccess }: EventFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: initialData?.title || "",
        description: initialData?.description || "",
        image: initialData?.image || "",
        date: initialData?.date ? new Date(initialData.date).toISOString().split("T")[0] : "",
        venue: initialData?.venue || "",
        price: initialData?.price || 0,
        capacity: initialData?.capacity || 0,
        isVisible: initialData?.isVisible ?? true,
        editors: initialData?.editors?.join(", ") || "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        // For standard inputs
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCheckedChange = (checked: boolean) => {
        setFormData(prev => ({ ...prev, isVisible: checked }));
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = {
                ...formData,
                price: Number(formData.price),
                capacity: Number(formData.capacity),
                editors: formData.editors.split(",").map((e: string) => e.trim()).filter(Boolean),
            };

            if (isEditing) {
                await updateEvent(initialData._id, data);
            } else {
                await createEvent(data);
            }

            if (onSuccess) {
                onSuccess();
            } else {
                router.push("/dashboard/events");
                router.refresh();
            }
        } catch (error: any) {
            alert(error.message);
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
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            placeholder="Event Title"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            placeholder="Event description..."
                            rows={4}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="image">Image URL</Label>
                        <Input
                            id="image"
                            name="image"
                            type="url"
                            value={formData.image}
                            onChange={handleChange}
                            required
                            placeholder="https://..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="date">Date</Label>
                            <Input
                                id="date"
                                name="date"
                                type="date"
                                value={formData.date}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="venue">Venue</Label>
                            <Input
                                id="venue"
                                name="venue"
                                value={formData.venue}
                                onChange={handleChange}
                                required
                                placeholder="Main Auditorium"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="price">Price (₹)</Label>
                            <Input
                                id="price"
                                name="price"
                                type="number"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                min="0"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="capacity">Capacity</Label>
                            <Input
                                id="capacity"
                                name="capacity"
                                type="number"
                                value={formData.capacity}
                                onChange={handleChange}
                                required
                                min="-1"
                            />
                            <p className="text-xs text-muted-foreground mt-1">Set to -1 for unlimited capacity</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="editors">Editors</Label>
                        <Input
                            id="editors"
                            name="editors"
                            value={formData.editors}
                            onChange={handleChange}
                            placeholder="email1@example.com, email2@example.com"
                        />
                        <p className="text-xs text-muted-foreground">Comma separated emails of users who can edit this event.</p>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="isVisible"
                            checked={formData.isVisible}
                            onCheckedChange={(checked) => handleCheckedChange(checked as boolean)}
                        />
                        <Label htmlFor="isVisible">Visible to Public</Label>
                    </div>

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
            </CardContent>
        </Card>
    );
}
