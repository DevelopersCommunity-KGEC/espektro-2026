"use client";

import { useEffect, useState, useCallback } from "react";
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
import { Loader2, Search, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
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
        setFilters(prev => ({ ...prev, [key]: value, page: 1 })); // Reset to page 1 on filter change
    };

    const handlePageChange = (newPage: number) => {
        setFilters(prev => ({ ...prev, page: newPage }));
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>All Tickets</CardTitle>
                <div className="flex gap-2">
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
                            placeholder="Search email, name, ID..."
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
                                <TableHead>Date</TableHead>
                                <TableHead>User / details</TableHead>
                                <TableHead>Event</TableHead>
                                <TableHead>Club</TableHead>
                                <TableHead>Issued By</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                        <TableCell><Skeleton className="h-10 w-40" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                        <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                                    </TableRow>
                                ))
                            ) : tickets.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">
                                        No tickets found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                tickets.map((ticket) => (
                                    <TableRow key={ticket._id}>
                                        <TableCell className="whitespace-nowrap">
                                            {new Date(ticket.purchaseDate).toLocaleDateString()}
                                            <div className="text-xs text-muted-foreground">{new Date(ticket.purchaseDate).toLocaleTimeString()}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium">
                                                    {ticket.user?.name || ticket.guestName || "Guest"}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {ticket.userEmail}
                                                </span>
                                                {(ticket.user?.phone || ticket.guestPhone) && (
                                                    <span className="text-xs text-muted-foreground">
                                                        {ticket.user?.phone || ticket.guestPhone}
                                                    </span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>{ticket.event?.title}</TableCell>
                                        <TableCell className="capitalize">{ticket.event?.clubId}</TableCell>
                                        <TableCell>
                                            {ticket.issuedBy ? (
                                                <span className="text-xs bg-muted px-2 py-1 rounded-sm block w-fit truncate max-w-37.5" title={ticket.issuedBy}>
                                                    {ticket.issuedBy}
                                                </span>
                                            ) : (
                                                <span className="text-xs text-muted-foreground">System</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={ticket.status === 'checked-in' ? 'default' : ticket.status === 'cancelled' ? 'destructive' : 'secondary'}>
                                                {ticket.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))
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
