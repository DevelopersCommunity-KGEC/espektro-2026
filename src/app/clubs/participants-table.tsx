"use client";

import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ManualTicketDialog } from "./manual-ticket-dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { updateTicketStatus } from "@/actions/ticket-status-action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Participant {
    _id: string;
    userEmail: string;
    status: string;
    checkInTime?: string;
    eventId: {
        _id: string;
        title: string;
    };
    userId?: {
        name: string;
        phone: string;
        image: string;
        course?: string;
        graduationYear?: string;
        collegeName?: string;
    };
    guestName?: string;
    guestPhone?: string;
    issueType: string;
    issuedBy?: string;
}

interface ParticipantsTableProps {
    participants: Participant[];
    events: { _id: string; title: string }[];
    clubId: string;
    currentUserEmail: string;
    canIssueTickets: boolean;
}

export function ParticipantsTable({ participants, events, clubId, currentUserEmail, canIssueTickets }: ParticipantsTableProps) {
    const [search, setSearch] = useState("");
    const [eventFilter, setEventFilter] = useState("all");
    const [issuedByMe, setIssuedByMe] = useState(false);
    const router = useRouter();

    const handleStatusChange = async (ticketId: string, newStatus: string) => {
        try {
            const result = await updateTicketStatus(clubId, ticketId, newStatus);
            if (result.success) {
                toast.success(result.message);
                router.refresh();
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error("Status update failed:", error);
            toast.error("Failed to update status");
        }
    };

    const filteredParticipants = participants.filter((p) => {
        const matchesSearch =
            p.userEmail.toLowerCase().includes(search.toLowerCase()) ||
            (p.userId?.name || p.guestName || "").toLowerCase().includes(search.toLowerCase()) ||
            (p.userId?.phone || p.guestPhone || "").includes(search) ||
            p._id.toLowerCase().includes(search.toLowerCase());

        const matchesEvent = eventFilter === "all" || p.eventId._id === eventFilter;

        const matchesIssuer = !issuedByMe || p.issuedBy === currentUserEmail;

        return matchesSearch && matchesEvent && matchesIssuer;
    });

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <Input
                            placeholder="Search by email, name, phone..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="max-w-sm"
                        />
                        <Select
                            value={eventFilter}
                            onValueChange={(val) => setEventFilter(val)}
                        >
                            <SelectTrigger className="w-full sm:w-[200px]">
                                <SelectValue placeholder="All Events" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Events</SelectItem>
                                {events.map((e) => (
                                    <SelectItem key={e._id} value={e._id}>
                                        {e.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="issued-by-me"
                            checked={issuedByMe}
                            onCheckedChange={(checked) => setIssuedByMe(checked as boolean)}
                        />
                        <Label htmlFor="issued-by-me">Issued by me</Label>
                    </div>
                    {canIssueTickets && (
                        <ManualTicketDialog clubId={clubId} events={events} />
                    )}
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Participant</TableHead>
                            <TableHead>Event</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Details</TableHead>
                            <TableHead>Ticket Type</TableHead>
                            <TableHead>Issued By</TableHead>
                            <TableHead>Check-In Time</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredParticipants.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-4">
                                    No participants found
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredParticipants.map((participant) => (
                                <TableRow key={participant._id}>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">
                                                {participant.userId?.name || participant.guestName || "Guest"}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {participant.userEmail}
                                            </span>
                                            {(participant.userId?.phone || participant.guestPhone) && (
                                                <span className="text-xs text-muted-foreground">
                                                    {participant.userId?.phone || participant.guestPhone}
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>{participant.eventId?.title}</TableCell>
                                    <TableCell>
                                        <Select
                                            defaultValue={participant.status}
                                            onValueChange={(val) => handleStatusChange(participant._id, val)}
                                        >
                                            <SelectTrigger className="w-32.5 h-8">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="booked">Booked</SelectItem>
                                                <SelectItem value="checked-in">Checked In</SelectItem>
                                                <SelectItem value="cancelled">Cancelled</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col text-xs">
                                            {participant.userId?.collegeName && (
                                                <span>{participant.userId.collegeName}</span>
                                            )}
                                            {participant.userId?.course && (
                                                <span>{participant.userId.course} ({participant.userId.graduationYear})</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{participant.issueType}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-xs text-muted-foreground">
                                            {participant.issuedBy ?
                                                (participant.issuedBy === currentUserEmail ? "Me" : participant.issuedBy)
                                                : "System"}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        {participant.checkInTime ? new Date(participant.checkInTime).toLocaleString() : "-"}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="text-sm text-muted-foreground">
                Showing {filteredParticipants.length} of {participants.length} participants
            </div>
        </div>
    );
}
