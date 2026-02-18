"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { getEvents, issueManualTicket, issueBulkManualTickets } from "@/actions/admin-actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, AlertCircle, X, UserPlus, Users, Pencil, Trash2, Check, AlertTriangle } from "lucide-react";
import { useAuthorization } from "@/hooks/use-authorization";

const EMAIL_REGEX = /^[a-zA-Z0-9](?:[a-zA-Z0-9._%+-]*[a-zA-Z0-9])?@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

function EmailTagInput({
  emails,
  onChange,
  disabled,
}: {
  emails: string[];
  onChange: (emails: string[]) => void;
  disabled?: boolean;
}) {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const [invalidEmails, setInvalidEmails] = useState<string[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const editRef = useRef<HTMLInputElement>(null);

  // Focus edit input when editing
  useEffect(() => {
    if (editingIndex !== null) editRef.current?.focus();
  }, [editingIndex]);

  // Clear error when all invalid emails are resolved
  useEffect(() => {
    if (invalidEmails.length === 0 && error) {
      setError("");
    }
  }, [invalidEmails.length, error]);

  const addEmail = useCallback(
    (raw: string) => {
      const email = raw.trim().toLowerCase();
      if (!email) return false;
      if (!EMAIL_REGEX.test(email)) {
        setError(`"${email}" is not a valid email`);
        return false;
      }
      if (emails.includes(email)) {
        setError(`"${email}" is already added`);
        return false;
      }
      setError("");
      onChange([...emails, email]);
      return true;
    },
    [emails, onChange],
  );

  const removeEmail = (index: number) => {
    onChange(emails.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "," || e.key === " " || e.key === "Tab") {
      e.preventDefault();
      if (inputValue.trim()) {
        if (addEmail(inputValue)) {
          setInputValue("");
        }
      }
    } else if (e.key === "Backspace" && !inputValue && emails.length > 0) {
      removeEmail(emails.length - 1);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text");
    const parts = paste.split(/[,;\s\n\r\t]+/).filter(Boolean);
    const newEmails = [...emails];
    const newInvalid: string[] = [...invalidEmails];
    let dupeCount = 0;

    for (const part of parts) {
      const email = part.trim().toLowerCase();
      if (!email) continue;
      if (!EMAIL_REGEX.test(email)) {
        if (!newInvalid.includes(email)) newInvalid.push(email);
        continue;
      }
      if (newEmails.includes(email)) {
        dupeCount++;
        continue;
      }
      newEmails.push(email);
    }

    onChange(newEmails);
    setInvalidEmails(newInvalid);
    setInputValue("");

    if (newInvalid.length > invalidEmails.length) {
      const added = newInvalid.length - invalidEmails.length;
      setError(`${added} invalid email(s) need review below${dupeCount > 0 ? ` • ${dupeCount} duplicates skipped` : ""}`);
    } else if (dupeCount > 0) {
      setError(`${dupeCount} duplicate(s) skipped`);
    } else {
      setError("");
    }
  };

  const startEditInvalid = (index: number) => {
    setEditingIndex(index);
    setEditValue(invalidEmails[index]);
  };

  const saveEditInvalid = (index: number) => {
    const email = editValue.trim().toLowerCase();
    if (!email) {
      // Remove if emptied
      setInvalidEmails(invalidEmails.filter((_, i) => i !== index));
    } else if (EMAIL_REGEX.test(email)) {
      // Valid now — move to valid list
      if (!emails.includes(email)) {
        onChange([...emails, email]);
      }
      setInvalidEmails(invalidEmails.filter((_, i) => i !== index));
    } else {
      // Still invalid — update in place
      setInvalidEmails(invalidEmails.map((e, i) => (i === index ? email : e)));
    }
    setEditingIndex(null);
    setEditValue("");
  };

  const removeInvalid = (index: number) => {
    setInvalidEmails(invalidEmails.filter((_, i) => i !== index));
    if (editingIndex === index) {
      setEditingIndex(null);
      setEditValue("");
    }
  };

  const fixAllInvalid = () => {
    // Try to re-validate all — move any that are now valid
    const stillInvalid: string[] = [];
    const newEmails = [...emails];
    for (const raw of invalidEmails) {
      const email = raw.trim().toLowerCase();
      if (EMAIL_REGEX.test(email) && !newEmails.includes(email)) {
        newEmails.push(email);
      } else if (!EMAIL_REGEX.test(email)) {
        stillInvalid.push(email);
      }
    }
    onChange(newEmails);
    setInvalidEmails(stillInvalid);
  };

  const dismissAllInvalid = () => {
    setInvalidEmails([]);
    setEditingIndex(null);
  };

  return (
    <div className="space-y-3">
      {/* Email chips input */}
      <div>
        <div
          className="flex flex-wrap gap-1.5 p-2 min-h-11 max-h-48 overflow-y-auto border rounded-md bg-background cursor-text focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1"
          onClick={() => inputRef.current?.focus()}
        >
          {emails.map((email, i) => (
            <Badge
              key={email}
              variant="secondary"
              className="gap-1 pl-2.5 pr-1 py-1 text-xs font-normal shrink-0"
            >
              {email}
              {!disabled && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeEmail(i);
                  }}
                  className="ml-0.5 rounded-full hover:bg-muted-foreground/20 p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </Badge>
          ))}
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setError("");
            }}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            onBlur={() => {
              if (inputValue.trim()) {
                if (addEmail(inputValue)) {
                  setInputValue("");
                }
              }
            }}
            disabled={disabled}
            placeholder={emails.length === 0 ? "Type or paste emails..." : ""}
            className="flex-1 min-w-45 border-none outline-none bg-transparent text-sm placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex items-center justify-between mt-1.5">
          {error ? (
            <p className="text-xs text-destructive">{error}</p>
          ) : (
            <p className="text-xs text-muted-foreground">
              Separate with comma, space, Enter, or paste a list
            </p>
          )}
          {emails.length > 0 && (
            <p className="text-xs text-muted-foreground font-medium shrink-0 ml-2">
              {emails.length} valid email{emails.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>
      </div>

      {/* Invalid emails review panel */}
      {invalidEmails.length > 0 && (
        <div className="border border-amber-300 dark:border-amber-700 rounded-lg bg-amber-50/60 dark:bg-amber-950/20 overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 bg-amber-100/60 dark:bg-amber-900/30 border-b border-amber-200 dark:border-amber-800">
            <div className="flex items-center gap-2 text-sm font-medium text-amber-800 dark:text-amber-300">
              <AlertTriangle className="h-4 w-4" />
              {invalidEmails.length} invalid email{invalidEmails.length !== 1 ? "s" : ""} — fix or remove
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={fixAllInvalid}
                className="text-xs px-2 py-1 rounded bg-amber-200/70 dark:bg-amber-800/50 hover:bg-amber-300 dark:hover:bg-amber-700 text-amber-900 dark:text-amber-200 transition-colors"
              >
                Re-validate all
              </button>
              <button
                type="button"
                onClick={dismissAllInvalid}
                className="text-xs px-2 py-1 rounded hover:bg-amber-200/70 dark:hover:bg-amber-800/50 text-amber-700 dark:text-amber-400 transition-colors"
              >
                Dismiss all
              </button>
            </div>
          </div>
          <div className="max-h-52 overflow-y-auto divide-y divide-amber-200/60 dark:divide-amber-800/40">
            {invalidEmails.map((inv, i) => (
              <div key={`${inv}-${i}`} className="flex items-center gap-2 px-3 py-1.5 group">
                {editingIndex === i ? (
                  <>
                    <input
                      ref={editRef}
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          saveEditInvalid(i);
                        } else if (e.key === "Escape") {
                          setEditingIndex(null);
                          setEditValue("");
                        }
                      }}
                      className="flex-1 text-sm bg-white dark:bg-background border rounded px-2 py-1 outline-none focus:ring-1 focus:ring-primary"
                    />
                    <button
                      type="button"
                      onClick={() => saveEditInvalid(i)}
                      className="p-1 rounded hover:bg-green-100 dark:hover:bg-green-900/30 text-green-700 dark:text-green-400"
                      title="Save"
                    >
                      <Check className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => { setEditingIndex(null); setEditValue(""); }}
                      className="p-1 rounded hover:bg-muted text-muted-foreground"
                      title="Cancel"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </>
                ) : (
                  <>
                    <span className="flex-1 text-sm font-mono text-amber-900 dark:text-amber-200 truncate">
                      {inv}
                    </span>
                    <button
                      type="button"
                      onClick={() => startEditInvalid(i)}
                      className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-amber-200/70 dark:hover:bg-amber-800/50 text-amber-700 dark:text-amber-300 transition-opacity"
                      title="Edit"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeInvalid(i)}
                      className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-opacity"
                      title="Remove"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ManualTicketsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [bulkResults, setBulkResults] = useState<{ email: string; success: boolean; message: string }[] | null>(null);

  // Progress tracking for bulk operations
  const [bulkProgress, setBulkProgress] = useState<{
    processed: number;
    total: number;
    currentBatch: number;
    totalBatches: number;
  } | null>(null);
  const abortRef = useRef(false);

  // Single ticket form
  const [singleEventId, setSingleEventId] = useState("");
  const [singleEmail, setSingleEmail] = useState("");
  const [singleError, setSingleError] = useState("");

  // Season pass form
  const [seasonEmail, setSeasonEmail] = useState("");
  const [seasonBulkEmails, setSeasonBulkEmails] = useState<string[]>([]);
  const [isBulk, setIsBulk] = useState(false);

  const { isAuthorized, isLoading, session } = useAuthorization(["super-admin"]);
  const userRole = (session?.user as any)?.role;

  useEffect(() => {
    if (isAuthorized) {
      fetchEvents();
    }
  }, [isAuthorized, userRole]);

  if (isLoading || !isAuthorized) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const fetchEvents = async () => {
    const data = await getEvents();
    setEvents(data);
  };

  const handleSingleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSingleError("");
    if (!singleEventId) {
      setSingleError("Select an event");
      return;
    }
    if (!singleEmail.trim() || !EMAIL_REGEX.test(singleEmail.trim())) {
      setSingleError("Enter a valid email");
      return;
    }

    setLoading(true);
    setMessage(null);
    setBulkResults(null);
    try {
      const res = await issueManualTicket(singleEventId, singleEmail.trim(), false);
      setMessage({ type: "success", text: res.message || "Ticket issued successfully!" });
      setSingleEmail("");
      fetchEvents();
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "Failed to issue ticket" });
    } finally {
      setLoading(false);
    }
  };

  const handleSeasonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setBulkResults(null);
    setBulkProgress(null);
    abortRef.current = false;

    try {
      if (isBulk) {
        if (seasonBulkEmails.length === 0) {
          setMessage({ type: "error", text: "Add at least one email" });
          setLoading(false);
          return;
        }

        // Process in batches of 25
        const BATCH_SIZE = 25;
        const allEmails = [...seasonBulkEmails];
        const totalBatches = Math.ceil(allEmails.length / BATCH_SIZE);
        const allResults: { email: string; success: boolean; message: string }[] = [];

        setBulkProgress({ processed: 0, total: allEmails.length, currentBatch: 0, totalBatches });

        for (let i = 0; i < totalBatches; i++) {
          if (abortRef.current) {
            setMessage({ type: "error", text: `Stopped after ${allResults.length}/${allEmails.length} emails. ${allResults.filter(r => r.success).length} issued successfully.` });
            break;
          }

          const batch = allEmails.slice(i * BATCH_SIZE, (i + 1) * BATCH_SIZE);
          setBulkProgress({ processed: i * BATCH_SIZE, total: allEmails.length, currentBatch: i + 1, totalBatches });

          try {
            const res = await issueBulkManualTickets("", batch, true);
            allResults.push(...res.results);
          } catch (err: any) {
            // If server call itself fails, mark entire batch as failed
            for (const email of batch) {
              allResults.push({ email, success: false, message: err.message || "Network error" });
            }
          }

          setBulkResults([...allResults]);
          setBulkProgress({ processed: Math.min((i + 1) * BATCH_SIZE, allEmails.length), total: allEmails.length, currentBatch: i + 1, totalBatches });
        }

        if (!abortRef.current) {
          const successCount = allResults.filter(r => r.success).length;
          const failCount = allResults.length - successCount;
          setMessage({
            type: successCount > 0 ? "success" : "error",
            text: `Done: ${successCount} issued${failCount > 0 ? `, ${failCount} failed` : ""} out of ${allResults.length}`,
          });
        }

        // Remove successfully issued emails from the tag list
        const successEmails = new Set(allResults.filter(r => r.success).map(r => r.email));
        setSeasonBulkEmails(seasonBulkEmails.filter(e => !successEmails.has(e)));
      } else {
        if (!seasonEmail.trim() || !EMAIL_REGEX.test(seasonEmail.trim())) {
          setMessage({ type: "error", text: "Enter a valid email" });
          setLoading(false);
          return;
        }
        const res = await issueManualTicket("", seasonEmail.trim(), true);
        setMessage({ type: "success", text: res.message || "Season pass issued!" });
        setSeasonEmail("");
      }
      fetchEvents();
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "Failed to issue season pass" });
    } finally {
      setLoading(false);
      setBulkProgress(null);
    }
  };

  const regularEvents = events.filter((e: any) => e.type !== "fest-day");
  const festDays = events.filter((e: any) => e.type === "fest-day");

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manual Ticket Assignment</h1>
        <p className="text-muted-foreground mt-1">
          Issue tickets to any email. Users who haven&apos;t signed up yet will see their tickets automatically once they log in.
        </p>
      </div>

      <Tabs defaultValue="single" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="single" className="gap-2">
            <UserPlus className="h-4 w-4" /> Single Ticket
          </TabsTrigger>
          <TabsTrigger value="season" className="gap-2">
            <Users className="h-4 w-4" /> Season Pass
          </TabsTrigger>
        </TabsList>

        <TabsContent value="single">
          <Card>
            <CardHeader>
              <CardTitle>Issue Single Ticket</CardTitle>
              <CardDescription>
                Issue a ticket for a specific event or individual fest day to one user.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSingleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Event</Label>
                  <Select value={singleEventId} onValueChange={setSingleEventId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an event" />
                    </SelectTrigger>
                    <SelectContent>
                      {festDays.length > 0 && (
                        <>
                          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                            Fest Days
                          </div>
                          {festDays.map((event) => (
                            <SelectItem key={event._id} value={event._id}>
                              {event.title} — ₹{event.price} ({event.ticketsSold}/{event.capacity === -1 ? "∞" : event.capacity})
                            </SelectItem>
                          ))}
                          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-t mt-1 pt-2">
                            Events
                          </div>
                        </>
                      )}
                      {regularEvents.map((event) => (
                        <SelectItem key={event._id} value={event._id}>
                          {event.title} — ₹{event.price} ({event.ticketsSold}/{event.capacity === -1 ? "∞" : event.capacity})
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
                    value={singleEmail}
                    onChange={(e) => setSingleEmail(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    User doesn&apos;t need to be signed up — ticket links by email on login.
                  </p>
                </div>

                {singleError && <p className="text-sm text-destructive">{singleError}</p>}

                <Button type="submit" disabled={loading} className="w-full">
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Issue Ticket
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="season">
          <Card>
            <CardHeader>
              <CardTitle>Issue Season Pass</CardTitle>
              <CardDescription>
                Generates a separate ticket for each fest day (
                {festDays.map((d) => d.title).join(", ") || "D1, D2, D3, D4"}).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSeasonSubmit} className="space-y-4">
                {/* Toggle: single vs bulk */}
                <div className="flex items-center gap-3 p-3 rounded-md border bg-muted/30">
                  <button
                    type="button"
                    onClick={() => setIsBulk(false)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${!isBulk ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    Single Email
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsBulk(true)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${isBulk ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    Bulk Emails
                  </button>
                </div>

                {isBulk ? (
                  <div className="space-y-2">
                    <Label>User Emails</Label>
                    <EmailTagInput
                      emails={seasonBulkEmails}
                      onChange={setSeasonBulkEmails}
                      disabled={loading}
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label>User Email</Label>
                    <Input
                      type="email"
                      placeholder="student@example.com"
                      value={seasonEmail}
                      onChange={(e) => setSeasonEmail(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      User doesn&apos;t need to be signed up — ticket links by email on login.
                    </p>
                  </div>
                )}

                <Button type="submit" disabled={loading} className="w-full">
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isBulk
                    ? `Issue ${seasonBulkEmails.length || ""} Season Pass${seasonBulkEmails.length !== 1 ? "es" : ""}`
                    : "Issue Season Pass"}
                </Button>

                {/* Bulk progress bar */}
                {bulkProgress && (
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Batch {bulkProgress.currentBatch}/{bulkProgress.totalBatches} — {bulkProgress.processed}/{bulkProgress.total} emails
                      </span>
                      <button
                        type="button"
                        onClick={() => { abortRef.current = true; }}
                        className="text-xs px-2 py-1 rounded border border-destructive text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        Stop
                      </button>
                    </div>
                    <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${Math.round((bulkProgress.processed / bulkProgress.total) * 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {Math.round((bulkProgress.processed / bulkProgress.total) * 100)}% complete — completed batches are already saved
                    </p>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Status Message */}
      {message && (
        <Alert
          variant={message.type === "success" ? "default" : "destructive"}
          className={message.type === "success" ? "border-green-500 text-green-700 bg-green-50 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800" : ""}
        >
          {message.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      {/* Bulk Results Breakdown */}
      {bulkResults && bulkResults.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Bulk Issue Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1.5 max-h-60 overflow-y-auto">
              {bulkResults.map((r, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between text-sm px-3 py-2 rounded-md ${r.success ? "bg-green-50 dark:bg-green-950/20" : "bg-red-50 dark:bg-red-950/20"}`}
                >
                  <span className="font-mono text-xs">{r.email}</span>
                  <Badge variant={r.success ? "default" : "destructive"} className="text-xs">
                    {r.success ? "Issued" : r.message}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
