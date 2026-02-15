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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

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

interface OnboardingDialogProps {
    open: boolean;
    onComplete: () => void;
}

export function OnboardingDialog({ open, onComplete }: OnboardingDialogProps) {
    const router = useRouter();
    const { data: session } = authClient.useSession();
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

    // Pre-fill form from session data
    useEffect(() => {
        if (session?.user) {
            const user = session.user as any;
            form.reset({
                name: session.user.name || "",
                email: session.user.email || "",
                phone: user.phone || "",
                course: user.course || "",
                graduationYear: user.graduationYear || "",
                isKGEC: user.collegeName === "Kalyani Government Engineering College",
                collegeName: user.collegeName === "Kalyani Government Engineering College"
                    ? ""
                    : user.collegeName || "",
            });
        }
    }, [session, form]);

    // Handle KGEC checkbox toggle
    useEffect(() => {
        if (isKGEC) {
            form.setValue("collegeName", "Kalyani Government Engineering College");
            form.clearErrors("collegeName");
        } else {
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
            onComplete();
            // Refresh server components so session data is up-to-date everywhere
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error("Failed to update profile. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={() => { /* non-dismissable */ }}>
            <DialogContent
                showCloseButton={false}
                onInteractOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
                className="sm:max-w-lg max-h-[90vh] overflow-y-auto"
            >
                <DialogHeader>
                    <DialogTitle className="text-2xl">Complete Your Profile</DialogTitle>
                    <DialogDescription>
                        We need a few more details to finish your registration for ESPEKTRO 2026.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                            <Input placeholder="email@example.com" {...field} disabled />
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

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                        <FormLabel>I am a student of KGEC</FormLabel>
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
            </DialogContent>
        </Dialog>
    );
}
