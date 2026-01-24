"use client";

import React, { useEffect, useState } from "react";
import { getAnalyticsData } from "@/actions/analytics-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Ticket, IndianRupee, Users } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { AllTicketsTable } from "@/components/admin/all-tickets-table";
import { AnalyticsSkeleton, EventPerformanceSkeleton } from "@/components/skeletons";
import { EventPerformance } from "@/components/admin/event-performance";

export default function DashboardPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
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

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
            </div>

            {loading ? (
                <AnalyticsSkeleton />
            ) : (
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                            <IndianRupee className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">₹{data?.totalRevenue?.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">
                                Total sales from all events
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
                <EventPerformance events={data?.eventStats} />
            )}

            <AllTicketsTable />
        </div>
    );
}

