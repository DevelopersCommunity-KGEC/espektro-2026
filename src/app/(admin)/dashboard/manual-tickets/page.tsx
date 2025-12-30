"use client";

import React, { useState, useEffect } from "react";
import { getEvents, issueManualTicket, issueBulkManualTickets, getMyQuota } from "@/actions/admin-actions";
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

export default function ManualTicketsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [email, setEmail] = useState("");
  const [bulkEmails, setBulkEmails] = useState("");
  const [isBulk, setIsBulk] = useState(false);
  const [quota, setQuota] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const { isAuthorized, isLoading, session } = useAuthorization(['admin', 'ticket-issuer']);
  const userRole = (session?.user as any)?.role;

  useEffect(() => {
    if (isAuthorized) {
      fetchEvents();
      if (userRole === "ticket-issuer") {
        fetchQuota();
      }
    }
  }, [isAuthorized, userRole]);

  if (isLoading || !isAuthorized) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const fetchQuota = async () => {
    const q = await getMyQuota();
    setQuota(q);
  };

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

  const handleIssue = async (isSeasonPass: boolean) => {
    if (isSeasonPass && isBulk) {
      if (!bulkEmails) {
        setMessage({ type: 'error', text: "Please enter emails" });
        return;
      }
      const emails = bulkEmails.split(',').map(e => e.trim()).filter(e => e);
      if (emails.length === 0) {
        setMessage({ type: 'error', text: "Please enter valid emails" });
        return;
      }

      setLoading(true);
      setMessage(null);
      try {
        const res = await issueBulkManualTickets("", emails, true);
        setMessage({ type: 'success', text: res.message || "Tickets issued successfully!" });
        setBulkEmails("");
        if (userRole === "ticket-issuer") fetchQuota();
      } catch (error: any) {
        setMessage({ type: 'error', text: error.message || "Failed to issue tickets" });
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!email) {
      setMessage({ type: 'error', text: "Please enter an email" });
      return;
    }
    if (!isSeasonPass && !selectedEvent) {
      setMessage({ type: 'error', text: "Please select an event for single ticket" });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await issueManualTicket(selectedEvent, email, isSeasonPass);
      setMessage({ type: 'success', text: res.message || "Ticket issued successfully!" });
      setEmail("");
      if (!isSeasonPass) fetchEvents(); // Refresh stats
      if (userRole === "ticket-issuer") fetchQuota(); // Refresh quota
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || "Failed to issue ticket" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manual Ticket Assignment</h1>
          {quota !== null && userRole === 'ticket-issuer' && (
            <div className="mt-2 inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              <Ticket className="h-4 w-4" />
              <span>Your Quota: {quota}</span>
            </div>
          )}
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
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Select Event</Label>
                <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an event" />
                  </SelectTrigger>
                  <SelectContent>
                    {events.map((event) => (
                      <SelectItem key={event._id} value={event._id}>
                        {event.title} ({event.ticketsSold}/{event.capacity})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>User Email</Label>
                <Input
                  type="email"
                  placeholder="student@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Button
                onClick={() => handleIssue(false)}
                disabled={loading}
                className="w-full"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Issue Ticket
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="season">
          <Card>
            <CardHeader>
              <CardTitle>Issue Season Pass</CardTitle>
              <CardDescription>Generates 4 separate tickets (D1, D2, D3, D4) for the user.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted rounded-md text-sm text-muted-foreground">
                This will automatically check for "Day 1 Pass", "Day 2 Pass", etc. events and issue a ticket for each one found.
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="bulk-mode" checked={isBulk} onCheckedChange={(checked) => setIsBulk(checked as boolean)} />
                <Label htmlFor="bulk-mode">Bulk Issue Mode</Label>
              </div>

              {isBulk ? (
                <div className="space-y-2">
                  <Label>User Emails (comma separated)</Label>
                  <Textarea
                    placeholder="student1@example.com, student2@example.com, ..."
                    value={bulkEmails}
                    onChange={(e) => setBulkEmails(e.target.value)}
                    rows={5}
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter multiple emails separated by commas.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label>User Email</Label>
                  <Input
                    type="email"
                    placeholder="student@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              )}

              <Button
                onClick={() => handleIssue(true)}
                disabled={loading}
                className="w-full"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isBulk ? "Issue Bulk Season Passes" : "Issue Season Pass"}
              </Button>
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
