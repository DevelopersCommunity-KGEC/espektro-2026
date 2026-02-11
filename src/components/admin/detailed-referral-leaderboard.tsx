"use client";

import { useState, useEffect } from "react";
import { getAdminReferralLeaderboard } from "@/actions/referral-analytics-actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Search, Loader2, Trophy, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";

interface LeaderboardProps {
    clubId?: string; // Optional: If provided, filters by club
}

export function DetailedReferralLeaderboard({ clubId }: LeaderboardProps) {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchData(1, search);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    // Initial fetch
    useEffect(() => {
        // Triggered by search effect primarily, but if clubId changes
        fetchData(1, search);
    }, [clubId]);

    const fetchData = async (p: number, s: string) => {
        setLoading(true);
        try {
            const res = await getAdminReferralLeaderboard({
                page: p,
                limit: 10,
                search: s,
                clubId: clubId
            });
            setData(res.data);
            setTotalPages(res.totalPages);
            setTotalRecords(res.total);
            setPage(p);
        } catch (error) {
            console.error("Failed to fetch leaderboard", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            fetchData(newPage, search);
        }
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Trophy className="h-5 w-5 text-yellow-500" />
                            Referral Leaderboard
                        </CardTitle>
                        <CardDescription>
                            Top performers driving ticket sales {clubId ? "for this club" : "across all events"}
                        </CardDescription>
                    </div>
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search user..."
                            className="pl-8"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12.5">Rank</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead className="hidden md:table-cell">College</TableHead>
                                <TableHead className="text-right">Sales Count</TableHead>
                                <TableHead className="text-right">Revenue Generated</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                                    </TableCell>
                                </TableRow>
                            ) : data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                        No referrals found matching your criteria.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                data.map((user, index) => (
                                    <TableRow key={user.userId}>
                                        <TableCell className="font-medium text-muted-foreground">
                                            #{((page - 1) * 10) + index + 1}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={user.image} alt={user.name} />
                                                    <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-sm">{user.name}</span>
                                                    <span className="text-xs text-muted-foreground">{user.email}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                                            {user.collegeName || "-"}
                                        </TableCell>
                                        <TableCell className="text-right font-medium">
                                            <Badge variant="secondary">{user.totalReferrals}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            ₹{user.totalRevenue}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between space-x-2 py-4">
                    <div className="text-sm text-muted-foreground">
                        Showing {data.length} of {totalRecords} results
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 1 || loading}
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                        </Button>
                        <div className="text-sm font-medium">Page {page} of {totalPages || 1}</div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page === totalPages || loading}
                        >
                            Next
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
