"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { updateUserProfile } from "@/actions/user-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

// Schema
const onboardingSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    course: z.string().min(2, "Course is required"),
    graduationYear: z.string().regex(/^\d{4}$/, "Year must be 4 digits"),
    isKGEC: z.boolean(),
    collegeName: z.string().optional(),
}).refine((data) => {
    if (!data.isKGEC && !data.collegeName) {
        return false;
    }
    return true;
}, {
    message: "College name is required",
    path: ["collegeName"],
});

type OnboardingFormValues = z.infer<typeof onboardingSchema>;

export default function OnboardingPage() {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();
    const [loading, setLoading] = useState(false);

    const form = useForm<OnboardingFormValues>({
        resolver: zodResolver(onboardingSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            course: "",
            graduationYear: "",
            isKGEC: false,
            collegeName: "",
        },
    });

    const isKGEC = form.watch("isKGEC");

    useEffect(() => {
        if (session?.user) {
            form.reset({
                name: session.user.name || "",
                email: session.user.email || "",
                phone: (session.user as any).phone || "",
                course: (session.user as any).course || "",
                graduationYear: (session.user as any).graduationYear || "",
                isKGEC: (session.user as any).collegeName === "Kalyani Government Engineering College",
                collegeName: (session.user as any).collegeName === "Kalyani Government Engineering College" ? "" : (session.user as any).collegeName || "",
            });

            // Pre-fill college name if KGEC based on logic
            if ((session.user as any).collegeName === "Kalyani Government Engineering College") {
                form.setValue("isKGEC", true);
            }
        }
    }, [session, form]);

    useEffect(() => {
        if (isKGEC) {
            form.setValue("collegeName", "Kalyani Government Engineering College");
            form.clearErrors("collegeName");
        } else {
            // If unchecking, maybe clear it or leave it empty
            if (form.getValues("collegeName") === "Kalyani Government Engineering College") {
                form.setValue("collegeName", "");
            }
        }
    }, [isKGEC, form]);

    async function onSubmit(data: OnboardingFormValues) {
        setLoading(true);
        try {
            await updateUserProfile({
                name: data.name,
                phone: data.phone,
                course: data.course,
                graduationYear: data.graduationYear,
                collegeName: data.isKGEC ? "Kalyani Government Engineering College" : data.collegeName!,
            });
            toast.success("Profile updated successfully!");
            // Refresh session?
            // Force a hard navigation to ensure session updates or just push
            window.location.href = "/my-tickets";
        } catch (error) {
            console.error(error);
            toast.error("Failed to update profile. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    if (isPending) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="container flex items-center justify-center min-h-screen py-10 px-4">
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
                    <CardDescription>
                        We need a few more details to finish your registration for ESPEKTRO 2026.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Your Name" {...field} />
                                            </FormControl>
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
                                                <Input placeholder="email@example.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone Number</FormLabel>
                                        <FormControl>
                                            <Input placeholder="1234567890" {...field} type="tel" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="course"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Course</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g. B.Tech CSE" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="graduationYear"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Graduation Year</FormLabel>
                                            <FormControl>
                                                <Input placeholder="2026" {...field} type="number" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="isKGEC"
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
                                                I am a student of KGEC
                                            </FormLabel>
                                            <FormDescription>
                                                Check this if you are from Kalyani Government Engineering College
                                            </FormDescription>
                                        </div>
                                    </FormItem>
                                )}
                            />

                            {!isKGEC && (
                                <FormField
                                    control={form.control}
                                    name="collegeName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>College Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter your college name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Complete Registration
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
