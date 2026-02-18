"use client";

import { useState, useMemo, Fragment } from "react";
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
import { Button } from "@/components/ui/button";
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
import { ChevronDown, ChevronRight, Download, Users } from "lucide-react";

interface Participant {
    _id: string;
    userEmail: string;
    status: string;
    checkInTime?: string;
    purchaseDate?: string;
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
    price?: number;
    discountAmount?: number;
    couponCode?: string;
    paymentId?: string;
    qrCodeToken?: string;
    teamMembers?: { name: string; email: string; phone: string }[];
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
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
    const router = useRouter();

    const toggleRow = (id: string) => {
        setExpandedRows((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

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

    const filteredParticipants = useMemo(() => {
        const q = search.toLowerCase();
        return participants.filter((p) => {
            const matchesSearch =
                !q ||
                p.userEmail.toLowerCase().includes(q) ||
                (p.userId?.name || p.guestName || "").toLowerCase().includes(q) ||
                (p.userId?.phone || p.guestPhone || "").includes(q) ||
                p._id.toLowerCase().includes(q) ||
                (p.userId?.collegeName || "").toLowerCase().includes(q) ||
                (p.userId?.course || "").toLowerCase().includes(q) ||
                (p.couponCode || "").toLowerCase().includes(q) ||
                (p.paymentId || "").toLowerCase().includes(q) ||
                (p.issueType || "").toLowerCase().includes(q) ||
                (p.teamMembers || []).some(
                    (m) =>
                        m.name.toLowerCase().includes(q) ||
                        m.email.toLowerCase().includes(q) ||
                        m.phone.includes(q),
                );

            const matchesEvent = eventFilter === "all" || p.eventId._id === eventFilter;
            const matchesIssuer = !issuedByMe || p.issuedBy === currentUserEmail;

            return matchesSearch && matchesEvent && matchesIssuer;
        });
    }, [participants, search, eventFilter, issuedByMe, currentUserEmail]);

    const downloadCSV = () => {
        const headers = [
            "Name",
            "Email",
            "Phone",
            "Event",
            "Status",
            "Price (₹)",
            "Discount (₹)",
            "Coupon Code",
            "Ticket Type",
            "Issued By",
            "College",
            "Course",
            "Graduation Year",
            "Payment ID",
            "Purchase Date",
            "Check-In Time",
            "Team Members",
        ];

        const rows = filteredParticipants.map((p) => [
            p.userId?.name || p.guestName || "Guest",
            p.userEmail,
            p.userId?.phone || p.guestPhone || "",
            p.eventId?.title || "",
            p.status,
            p.price ?? 0,
            p.discountAmount ?? 0,
            p.couponCode || "",
            p.issueType,
            p.issuedBy || "System",
            p.userId?.collegeName || "",
            p.userId?.course || "",
            p.userId?.graduationYear || "",
            p.paymentId || "",
            p.purchaseDate ? new Date(p.purchaseDate).toLocaleString() : "",
            p.checkInTime ? new Date(p.checkInTime).toLocaleString() : "",
            (p.teamMembers || []).map((m) => `${m.name} (${m.email})`).join("; "),
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map((row) =>
                row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
            ),
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `participants_${clubId}_${new Date().toISOString().slice(0, 10)}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const statusColor = (status: string) => {
        switch (status) {
            case "checked-in": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
            case "booked": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
            case "cancelled": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
            default: return "";
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <Input
                            placeholder="Search name, email, phone, coupon, college..."
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
                    <div className="flex items-center gap-3">
                        {clubId.toLowerCase() !== "espektro" && (
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="issued-by-me"
                                    checked={issuedByMe}
                                    onCheckedChange={(checked) => setIssuedByMe(checked as boolean)}
                                />
                                <Label htmlFor="issued-by-me">Issued by me</Label>
                            </div>
                        )}
                        <Button variant="outline" size="sm" onClick={downloadCSV}>
                            <Download className="w-4 h-4 mr-1" /> Export CSV
                        </Button>
                        {canIssueTickets && clubId.toLowerCase() !== "espektro" && (
                            <ManualTicketDialog clubId={clubId} events={events} />
                        )}
                    </div>
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-8"></TableHead>
                            <TableHead>Participant</TableHead>
                            <TableHead>Event</TableHead>
                            <TableHead className="text-right">Price</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Ticket Type</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredParticipants.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-4">
                                    No participants found
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredParticipants.map((participant) => {
                                const isExpanded = expandedRows.has(participant._id);
                                return (
                                    <Fragment key={participant._id}>
                                        {/* Main Row */}
                                        <TableRow
                                            className="cursor-pointer hover:bg-muted/50"
                                            onClick={() => toggleRow(participant._id)}
                                        >
                                            <TableCell className="w-8 px-2">
                                                {isExpanded ? (
                                                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                                                ) : (
                                                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">
                                                        {participant.userId?.name || participant.guestName || "Guest"}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {participant.userEmail}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{participant.eventId?.title}</TableCell>
                                            <TableCell className="text-right font-mono">
                                                {participant.discountAmount && participant.discountAmount > 0 ? (
                                                    <div className="flex flex-col items-end">
                                                        <span>₹{participant.price ?? 0}</span>
                                                        <span className="text-xs text-green-600">-₹{participant.discountAmount}</span>
                                                    </div>
                                                ) : (
                                                    <span>₹{participant.price ?? 0}</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={`${statusColor(participant.status)} border-0 font-medium`}>
                                                    {participant.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{participant.issueType}</Badge>
                                            </TableCell>
                                        </TableRow>

                                        {/* Expanded Detail Row */}
                                        {isExpanded && (
                                            <TableRow className="bg-muted/30 hover:bg-muted/30">
                                                <TableCell colSpan={6} className="p-0">
                                                    <div className="px-6 py-4 space-y-4">
                                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                            <DetailItem label="Phone" value={participant.userId?.phone || participant.guestPhone || "—"} />
                                                            <DetailItem label="College" value={participant.userId?.collegeName || "—"} />
                                                            <DetailItem label="Course" value={
                                                                participant.userId?.course
                                                                    ? `${participant.userId.course}${participant.userId.graduationYear ? ` (${participant.userId.graduationYear})` : ""}`
                                                                    : "—"
                                                            } />
                                                            <DetailItem label="Issued By" value={
                                                                participant.issuedBy
                                                                    ? (participant.issuedBy === currentUserEmail ? "Me" : participant.issuedBy)
                                                                    : "System"
                                                            } />
                                                            <DetailItem label="Purchase Date" value={
                                                                participant.purchaseDate
                                                                    ? new Date(participant.purchaseDate).toLocaleString()
                                                                    : "—"
                                                            } />
                                                            <DetailItem label="Check-In Time" value={
                                                                participant.checkInTime
                                                                    ? new Date(participant.checkInTime).toLocaleString()
                                                                    : "—"
                                                            } />
                                                            <DetailItem label="Payment ID" value={participant.paymentId || "—"} />
                                                            <DetailItem label="Coupon Code" value={participant.couponCode || "—"} />
                                                        </div>

                                                        {/* Team Members */}
                                                        {participant.teamMembers && participant.teamMembers.length > 0 && (
                                                            <div className="space-y-2">
                                                                <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
                                                                    <Users className="w-3.5 h-3.5" />
                                                                    Team Members ({participant.teamMembers.length})
                                                                </div>
                                                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                                                    {participant.teamMembers.map((m, i) => (
                                                                        <div key={i} className="text-xs border rounded-md px-3 py-2 bg-background">
                                                                            <span className="font-medium">{m.name}</span>
                                                                            <span className="text-muted-foreground block">{m.email}</span>
                                                                            <span className="text-muted-foreground">{m.phone}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Status change */}
                                                        <div className="flex items-center gap-2 pt-1">
                                                            <span className="text-sm text-muted-foreground">Change status:</span>
                                                            <Select
                                                                value={participant.status}
                                                                onValueChange={(val) => handleStatusChange(participant._id, val)}
                                                            >
                                                                <SelectTrigger className="w-40 h-8">
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="booked">Booked</SelectItem>
                                                                    <SelectItem value="checked-in">Checked In</SelectItem>
                                                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </Fragment>
                                );
                            })
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

function DetailItem({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <span className="text-xs text-muted-foreground">{label}</span>
            <p className="font-medium text-sm break-all">{value}</p>
        </div>
    );
}
