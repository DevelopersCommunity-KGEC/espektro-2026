"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { updateUserProfile } from "@/actions/user-actions";
import { Loader2 } from "lucide-react";
import { useState } from "react";

const profileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  phone: z.string().optional(),
  course: z.string().optional(),
  graduationYear: z.string().optional(),
  collegeName: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  user: {
    name: string;
    email: string;
    phone?: string;
    course?: string;
    graduationYear?: string;
    collegeName?: string;
  };
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name || "",
      phone: user.phone || "",
      course: user.course || "",
      graduationYear: user.graduationYear || "",
      collegeName: user.collegeName || "",
    },
  });

  async function onSubmit(data: ProfileFormValues) {
    setLoading(true);
    try {
      await updateUserProfile({
          name: data.name,
          phone: data.phone || "",
          course: data.course || "",
          graduationYear: data.graduationYear || "",
          collegeName: data.collegeName || ""
      });
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Email (Read Only) */}
        <div className="space-y-2">
            <FormLabel>Email</FormLabel>
            <Input disabled value={user.email} className="bg-muted" />
            <FormDescription>Email cannot be changed.</FormDescription>
        </div>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="+91 9876543210" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="collegeName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>College Name</FormLabel>
              <FormControl>
                <Input placeholder="Knowles College" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="course"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Course</FormLabel>
                <FormControl>
                    <Input placeholder="B.Tech" {...field} />
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
                    <Input placeholder="2026" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Update Profile
        </Button>
      </form>
    </Form>
  );
}
