"use client";

import React, { useEffect, useState } from "react";
import { getAnalyticsData } from "@/actions/analytics-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Ticket, IndianRupee, Users } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { AllTicketsTable } from "@/components/admin/all-tickets-table";
import { EventPerformanceSkeleton, AnalyticsSkeleton } from "@/components/skeletons";
import { EventPerformance } from "@/components/admin/event-performance";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { DODO_COMMISION_PERCENTAGE, DODO_COMMISION_FIXED_PER_TRANSACTION } from "@/data/config";

export default function DashboardPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [netRevenueMode, setNetRevenueMode] = useState(false);
    const { data: session } = authClient.useSession();
    const router = useRouter();

    useEffect(() => {
        async function fetchData() {
            try {
                const stats = await getAnalyticsData();
                setData(stats);
            } catch (error) {
                console.error("Failed to fetch analytics", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [session, router]);

    const calculateTotalRevenue = () => {
        if (!data) return 0;
        let revenue = data.totalRevenue;

        if (netRevenueMode) {
            // Percent Fee
            const percentFee = (revenue * DODO_COMMISION_PERCENTAGE) / 100;
            // Fixed Fee (Approximated by ticket count as transaction count not tracked globally here easily without new aggregation)
            const fixedFee = (data.totalTicketsSold || 0) * DODO_COMMISION_FIXED_PER_TRANSACTION;
            revenue = Math.max(0, revenue - percentFee - fixedFee);
        }
        return Math.round(revenue).toLocaleString();
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
                <div className="flex items-center space-x-2 bg-muted/50 p-2 rounded-lg border">
                    <Switch
                        id="net-revenue"
                        checked={netRevenueMode}
                        onCheckedChange={setNetRevenueMode}
                    />
                    <Label htmlFor="net-revenue">Show Net Revenue (Excl. 4% + ₹4 per txn)</Label>
                </div>
            </div>

            {loading ? (
                <AnalyticsSkeleton />
            ) : (
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {netRevenueMode ? "Net Revenue" : "Total Revenue"}
                            </CardTitle>
                            <IndianRupee className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">₹{calculateTotalRevenue()}</div>
                            <p className="text-xs text-muted-foreground">
                                {netRevenueMode
                                    ? "After gateway charges deducted"
                                    : "Total sales from all events"}
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Tickets Sold</CardTitle>
                            <Ticket className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{data?.totalTicketsSold}</div>
                            <p className="text-xs text-muted-foreground">
                                Across {data?.eventStats?.length} active events
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Check-ins</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{data?.totalCheckedIn}</div>
                            <p className="text-xs text-muted-foreground">
                                Attendees validated at venue
                            </p>
                        </CardContent>
                    </Card>
                </div>
            )}

            {loading ? (
                <EventPerformanceSkeleton />
            ) : (
                <EventPerformance events={data?.eventStats} netRevenueMode={netRevenueMode} />
            )}

            <AllTicketsTable />
        </div>
    );
}

