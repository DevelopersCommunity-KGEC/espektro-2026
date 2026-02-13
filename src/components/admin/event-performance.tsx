"use client";

import { useState, useMemo } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { clubs } from "@/data/clubs";
import { DODO_COMMISION_PERCENTAGE, DODO_COMMISION_FIXED_PER_TRANSACTION } from "@/data/config";

interface EventStat {
    id: string;
    title: string;
    clubId: string;
    ticketsSold: number;
    revenue: number;
    capacity: number;
    occupancy: number;
    checkedInCount: number;
}

interface EventPerformanceProps {
    events: EventStat[];
    netRevenueMode?: boolean;
}

export function EventPerformance({ events = [], netRevenueMode = false }: EventPerformanceProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedClub, setSelectedClub] = useState("all");

    const getClubName = (id: string) => clubs.find(c => c.id === id)?.name || id;

    const calculateNetRevenue = (revenue: number, sold: number) => {
        if (!netRevenueMode || sold === 0) return revenue;

        const percentageFee = (revenue * DODO_COMMISION_PERCENTAGE) / 100;
        const fixedFee = sold * DODO_COMMISION_FIXED_PER_TRANSACTION;
        return Math.max(0, revenue - percentageFee - fixedFee);
    };

    const filteredEvents = useMemo(() => {
        return events.filter(event => {
            const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesClub = selectedClub === "all" || event.clubId === selectedClub;
            return matchesSearch && matchesClub;
        });
    }, [events, searchTerm, selectedClub]);

    return (
        <Card className="col-span-full">
            <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <CardTitle>Event Performance</CardTitle>
                        <CardDescription>Detailed breakdown of ticket sales by event.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search events..."
                            className="pl-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Select value={selectedClub} onValueChange={setSelectedClub}>
                        <SelectTrigger className="w-full sm:w-45">
                            <SelectValue placeholder="All Clubs" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Clubs</SelectItem>
                            {clubs.map(club => (
                                <SelectItem key={club.id} value={club.id}>
                                    {club.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Event Name</TableHead>
                                <TableHead>Club</TableHead>
                                <TableHead className="text-right">Sold</TableHead>
                                <TableHead className="text-right">Checked In</TableHead>
                                <TableHead className="text-right">Check-in Rate</TableHead>
                                <TableHead className="text-right">Capacity</TableHead>
                                <TableHead className="text-right">Revenue</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredEvents.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                        No events found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredEvents.map((event) => {
                                    const checkInRate = event.ticketsSold > 0
                                        ? Math.round((event.checkedInCount / event.ticketsSold) * 100)
                                        : 0;

                                    return (
                                        <TableRow key={event.id}>
                                            <TableCell className="font-medium whitespace-nowrap">{event.title}</TableCell>
                                            <TableCell>{getClubName(event.clubId)}</TableCell>
                                            <TableCell className="text-right">{event.ticketsSold}</TableCell>
                                            <TableCell className="text-right">{event.checkedInCount}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <span className={`text-xs ${checkInRate > 80 ? 'text-green-600 font-bold' : ''}`}>
                                                        {checkInRate}%
                                                    </span>
                                                    <div className="h-1.5 w-16 bg-secondary rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-primary"
                                                            style={{ width: `${Math.min(checkInRate, 100)}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">{event.capacity === -1 ? "Unlimited" : event.capacity}</TableCell>
                                            <TableCell className="text-right font-mono">
                                                ₹{Math.round(calculateNetRevenue(event.revenue, event.ticketsSold)).toLocaleString()}
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
