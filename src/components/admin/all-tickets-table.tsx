"use client";

import { useEffect, useState, useCallback, Fragment } from "react";
import { getAllTickets, TicketFilter, getAdminFilterOptions } from "@/actions/admin-ticket-actions";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, ChevronLeft, ChevronRight, RefreshCw, ChevronDown, Download, Users } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Simple debounce hook implementation if not exists
function useDebounceValue<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
}

export function AllTicketsTable() {
    const [tickets, setTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

    // Filter Options
    const [filterOptions, setFilterOptions] = useState<{
        events: any[];
        clubs: { id: string, name: string }[];
        issuers: string[];
    }>({ events: [], clubs: [], issuers: [] });

    // Filter State
    const [filters, setFilters] = useState<TicketFilter>({
        page: 1,
        limit: 10,
        search: "",
        clubId: "all",
        eventId: "all",
        issuedBy: "all",
    });

    const debouncedSearch = useDebounceValue(filters.search, 500);

    const toggleRow = (id: string) => {
        setExpandedRows((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const fetchTickets = useCallback(async () => {
        setLoading(true);
        try {
            const result = await getAllTickets({
                ...filters,
                search: debouncedSearch
            });
            setTickets(result.tickets);
            setTotal(result.total);
            setTotalPages(result.totalPages);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [filters.page, filters.limit, filters.clubId, filters.eventId, filters.issuedBy, debouncedSearch]);

    // Initial Load of Options
    useEffect(() => {
        getAdminFilterOptions().then(setFilterOptions);
    }, []);

    // Fetch when filters change
    useEffect(() => {
        fetchTickets();
    }, [fetchTickets]);


    const handleFilterChange = (key: string, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
    };

    const handlePageChange = (newPage: number) => {
        setFilters(prev => ({ ...prev, page: newPage }));
    };

    const statusColor = (status: string) => {
        switch (status) {
            case "checked-in": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
            case "booked": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
            case "cancelled": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
            default: return "";
        }
    };

    const downloadCSV = () => {
        const headers = [
            "Name", "Email", "Phone", "Event", "Club", "Status",
            "Price (₹)", "Discount (₹)", "Coupon Code", "Ticket Type",
            "Issued By", "College", "Course", "Graduation Year",
            "Payment ID", "Purchase Date", "Check-In Time", "Team Members",
        ];

        const rows = tickets.map((t: any) => [
            t.user?.name || t.guestName || "Guest",
            t.userEmail,
            t.user?.phone || t.guestPhone || "",
            t.event?.title || "",
            t.event?.clubId || "",
            t.status,
            t.price ?? 0,
            t.discountAmount ?? 0,
            t.couponCode || "",
            t.issueType || "",
            t.issuedBy || "System",
            t.user?.collegeName || "",
            t.user?.course || "",
            t.user?.graduationYear || "",
            t.paymentId || "",
            t.purchaseDate ? new Date(t.purchaseDate).toLocaleString() : "",
            t.checkInTime ? new Date(t.checkInTime).toLocaleString() : "",
            (t.teamMembers || []).map((m: any) => `${m.name} (${m.email})`).join("; "),
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map((row: any) =>
                row.map((cell: any) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
            ),
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `all_tickets_${new Date().toISOString().slice(0, 10)}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const DetailItem = ({ label, value }: { label: string; value: React.ReactNode }) =>
        value ? (
            <div>
                <span className="text-xs text-muted-foreground">{label}</span>
                <p className="text-sm font-medium">{value}</p>
            </div>
        ) : null;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>All Tickets</CardTitle>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={downloadCSV} disabled={tickets.length === 0}>
                        <Download className="h-4 w-4 mr-1" /> CSV
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => fetchTickets()}>
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search email, name, phone, payment ID..."
                            className="pl-8"
                            value={filters.search}
                            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                        />
                    </div>

                    <Select value={filters.clubId} onValueChange={(val) => handleFilterChange("clubId", val)}>
                        <SelectTrigger>
                            <SelectValue placeholder="All Clubs" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Clubs</SelectItem>
                            {filterOptions.clubs.map(c => (
                                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={filters.eventId} onValueChange={(val) => handleFilterChange("eventId", val)}>
                        <SelectTrigger>
                            <SelectValue placeholder="All Events" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Events</SelectItem>
                            {filterOptions.events
                                .filter(e => filters.clubId === "all" || e.clubId === filters.clubId)
                                .map(e => (
                                    <SelectItem key={e._id} value={e._id}>{e.title}</SelectItem>
                                ))}
                        </SelectContent>
                    </Select>

                    <Select value={filters.issuedBy} onValueChange={(val) => handleFilterChange("issuedBy", val)}>
                        <SelectTrigger>
                            <SelectValue placeholder="All Issuers" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Issuers</SelectItem>
                            {filterOptions.issuers.map(issuer => (
                                <SelectItem key={issuer} value={issuer}>{issuer}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Table */}
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-8" />
                                <TableHead>Name / Email</TableHead>
                                <TableHead>Event</TableHead>
                                <TableHead className="text-right">Price</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Type</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                                        <TableCell><Skeleton className="h-10 w-40" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                                        <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                                    </TableRow>
                                ))
                            ) : tickets.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">
                                        No tickets found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                tickets.map((ticket) => {
                                    const isExpanded = expandedRows.has(ticket._id);
                                    const name = ticket.user?.name || ticket.guestName || "Guest";
                                    const price = ticket.price ?? 0;
                                    const discount = ticket.discountAmount ?? 0;

                                    return (
                                        <Fragment key={ticket._id}>
                                            {/* Main Row */}
                                            <TableRow
                                                className="cursor-pointer hover:bg-muted/50"
                                                onClick={() => toggleRow(ticket._id)}
                                            >
                                                <TableCell className="px-2">
                                                    <ChevronDown
                                                        className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-0" : "-rotate-90"}`}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">{name}</span>
                                                        <span className="text-xs text-muted-foreground">{ticket.userEmail}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span>{ticket.event?.title}</span>
                                                    <div className="text-xs text-muted-foreground capitalize">{ticket.event?.clubId}</div>
                                                </TableCell>
                                                <TableCell className="text-right whitespace-nowrap">
                                                    {discount > 0 ? (
                                                        <div className="flex flex-col items-end">
                                                            <span className="font-medium">₹{price - discount}</span>
                                                            <span className="text-xs line-through text-muted-foreground">₹{price}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="font-medium">{price === 0 ? "Free" : `₹${price}`}</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={statusColor(ticket.status)}>
                                                        {ticket.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="capitalize text-xs">
                                                    {ticket.issueType || "online"}
                                                </TableCell>
                                            </TableRow>

                                            {/* Expanded Detail Row */}
                                            {isExpanded && (
                                                <TableRow className="bg-muted/30 hover:bg-muted/30">
                                                    <TableCell colSpan={6} className="p-4">
                                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                                            <DetailItem label="Phone" value={ticket.user?.phone || ticket.guestPhone} />
                                                            <DetailItem label="College" value={ticket.user?.collegeName} />
                                                            <DetailItem label="Course" value={ticket.user?.course} />
                                                            <DetailItem label="Graduation Year" value={ticket.user?.graduationYear} />
                                                            <DetailItem label="Club" value={ticket.event?.clubId} />
                                                            <DetailItem
                                                                label="Issued By"
                                                                value={ticket.issuedBy || "System"}
                                                            />
                                                            <DetailItem label="Payment ID" value={ticket.paymentId} />
                                                            <DetailItem label="Coupon Code" value={ticket.couponCode} />
                                                            <DetailItem
                                                                label="Purchase Date"
                                                                value={ticket.purchaseDate ? new Date(ticket.purchaseDate).toLocaleString() : null}
                                                            />
                                                            <DetailItem
                                                                label="Check-In Time"
                                                                value={ticket.checkInTime ? new Date(ticket.checkInTime).toLocaleString() : null}
                                                            />
                                                            {ticket.teamMembers?.length > 0 && (
                                                                <div className="col-span-full">
                                                                    <span className="text-xs text-muted-foreground">Team Members</span>
                                                                    <div className="flex flex-wrap gap-2 mt-1">
                                                                        {ticket.teamMembers.map((m: any, idx: number) => (
                                                                            <span
                                                                                key={idx}
                                                                                className="inline-flex items-center gap-1 text-xs bg-secondary px-2 py-1 rounded-md"
                                                                            >
                                                                                <Users className="h-3 w-3" />
                                                                                {m.name} ({m.email})
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}
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

                {/* Pagination */}
                <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                        Page {filters.page} of {totalPages} ({total} tickets)
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={(filters.page || 1) <= 1 || loading}
                            onClick={() => handlePageChange((filters.page || 1) - 1)}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={filters.page! >= totalPages || loading}
                            onClick={() => handlePageChange((filters.page || 1) + 1)}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
