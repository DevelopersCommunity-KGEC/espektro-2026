"use client";

import React, { useState, useEffect } from "react";
import { getEvents, issueManualTicket } from "@/actions/admin-actions";
import { ensureFestDays } from "@/actions/seed-actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle2, AlertCircle, Ticket } from "lucide-react";
import { useAuthorization } from "@/hooks/use-authorization";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";

const singleTicketSchema = z.object({
  eventId: z.string().min(1, "Select an event"),
  email: z.string().email("Invalid email"),
});

const seasonPassSchema = z.object({
  isBulk: z.boolean(),
  email: z.string().optional(),
  bulkEmails: z.string().optional(),
}).refine(data => {
  if (data.isBulk) {
    return !!data.bulkEmails && data.bulkEmails.trim().length > 0;
  }
  return !!data.email && z.string().email().safeParse(data.email).success;
}, {
  message: "Valid email(s) required",
  path: ["email"], // simplified error path
});

export default function ManualTicketsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const { isAuthorized, isLoading, session } = useAuthorization(['super-admin']);
  const userRole = (session?.user as any)?.role;

  const singleForm = useForm<z.infer<typeof singleTicketSchema>>({
    resolver: zodResolver(singleTicketSchema),
    defaultValues: {
      eventId: "",
      email: "",
    },
  });

  const seasonForm = useForm({
    resolver: zodResolver(seasonPassSchema),
    defaultValues: {
      isBulk: false,
      email: "",
      bulkEmails: "",
    },
  });

  useEffect(() => {
    if (isAuthorized) {
      fetchEvents();
    }
  }, [isAuthorized, userRole]);

  if (isLoading || !isAuthorized) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const fetchEvents = async () => {
    const data = await getEvents();
    // Filter out fest days from the regular dropdown if needed, or keep them all.
    // For manual tickets, we might want to manually exclude 'fest-day' types from the dropdown if we only want them selectable via the "Season Pass" tab or specific logic.
    // But currently issueManualTicket handles them. For single ticket tab, we probably just want "event" types.
    setEvents(data.filter((e: any) => e.type !== 'fest-day'));
  };

  const handleSeedFestDays = async () => {
    setLoading(true);
    try {
      await ensureFestDays();
      setMessage({ type: 'success', text: "Fest days seeded successfully" });
      fetchEvents();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const onSingleSubmit = async (values: z.infer<typeof singleTicketSchema>) => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await issueManualTicket(values.eventId, values.email, false);
      setMessage({ type: 'success', text: res.message || "Ticket issued successfully!" });
      singleForm.reset({ eventId: values.eventId, email: "" });
      fetchEvents();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || "Failed to issue ticket" });
    } finally {
      setLoading(false);
    }
  };

  const onSeasonSubmit = async (values: z.infer<typeof seasonPassSchema>) => {
    setLoading(true);
    setMessage(null);
    try {
      if (values.isBulk && values.bulkEmails) {
        const emails = values.bulkEmails.split(',').map(e => e.trim()).filter(e => e);
        let successCount = 0;
        let errors: string[] = [];

        for (const email of emails) {
          try {
            await issueManualTicket("", email, true);
            successCount++;
          } catch (err: any) {
            errors.push(`${email}: ${err.message}`);
          }
        }

        if (errors.length > 0) {
          setMessage({ type: 'error', text: `Issued ${successCount} tickets. Errors: ${errors.join('; ')}` });
        } else {
          setMessage({ type: 'success', text: `Successfully issued ${successCount} season passes.` });
        }
      } else if (values.email) {
        const res = await issueManualTicket("", values.email, true);
        setMessage({ type: 'success', text: res.message || "Season pass issued successfully!" });
      }
      seasonForm.reset({ isBulk: values.isBulk, email: "", bulkEmails: "" });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || "Failed to issue season pass" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manual Ticket Assignment</h1>
        </div>
        <Button variant="outline" size="sm" onClick={handleSeedFestDays} disabled={loading}>
          Seed Fest Days
        </Button>
      </div>

      <Tabs defaultValue="single" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="single">Single Event / Day Pass</TabsTrigger>
          <TabsTrigger value="season">Season Pass (All 4 Days)</TabsTrigger>
        </TabsList>

        <TabsContent value="single">
          <Card>
            <CardHeader>
              <CardTitle>Issue Single Ticket</CardTitle>
              <CardDescription>Issue a ticket for a specific event or individual fest day.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...singleForm}>
                <form onSubmit={singleForm.handleSubmit(onSingleSubmit)} className="space-y-4">
                  <FormField
                    control={singleForm.control}
                    name="eventId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Event</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select an event" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {events.map((event) => (
                              <SelectItem key={event._id} value={event._id}>
                                {event.title} ({event.ticketsSold}/{event.capacity})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={singleForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>User Email</FormLabel>
                        <FormControl>
                          <Input placeholder="student@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Issue Ticket
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="season">
          <Card>
            <CardHeader>
              <CardTitle>Issue Season Pass</CardTitle>
              <CardDescription>Generates 4 separate tickets (D1, D2, D3, D4) for the user.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-muted rounded-md text-sm text-muted-foreground mb-4">
                This will automatically check for "Day 1 Pass", "Day 2 Pass", etc. events and issue a ticket for each one found.
              </div>

              <Form {...seasonForm}>
                <form onSubmit={seasonForm.handleSubmit(onSeasonSubmit)} className="space-y-4">
                  <FormField
                    control={seasonForm.control}
                    name="isBulk"
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
                            Bulk Issue Mode
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  {seasonForm.watch('isBulk') ? (
                    <FormField
                      control={seasonForm.control}
                      name="bulkEmails"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>User Emails (comma separated)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="student1@example.com, student2@example.com, ..."
                              rows={5}
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Enter multiple emails separated by commas.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : (
                    <FormField
                      control={seasonForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>User Email</FormLabel>
                          <FormControl>
                            <Input placeholder="student@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <Button type="submit" disabled={loading} className="w-full">
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {seasonForm.watch('isBulk') ? "Issue Bulk Season Passes" : "Issue Season Pass"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {message && (
        <Alert variant={message.type === 'success' ? 'default' : 'destructive'} className={message.type === 'success' ? "border-green-500 text-green-700 bg-green-50" : ""}>
          {message.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <AlertDescription>
            {message.text}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
