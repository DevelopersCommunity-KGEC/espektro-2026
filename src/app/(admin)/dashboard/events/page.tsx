import React, { Suspense } from "react";
import Link from "next/link";
import { getEvents } from "@/actions/admin-actions";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { DashboardTableSkeleton } from "@/components/skeletons";
import { SeedButton } from "@/components/admin/seed-button";
import { Button } from "@/components/ui/button";

async function EventsTable() {
    const events = await getEvents();

    return (
        <div className="bg-white rounded shadow overflow-hidden overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Event
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Club
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Venue
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Entry Fees
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Sold
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {events.map((event: any) => (
                        <tr key={event._id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="h-10 w-10 shrink-0">
                                        <img className="h-10 w-10 rounded-full object-cover" src={event.image} alt="" />
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">{event.title}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {event.club?.name || event.clubId || "Unknown"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(event.date).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {event.venue}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                ₹{event.price}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {event.ticketsSold} / {event.capacity === -1 ? "Unlimited" : event.capacity}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <Link href={`/dashboard/events/${event._id}`} className="text-blue-600 hover:text-blue-900 mr-4">
                                    Edit
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default async function EventsPage() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    const userRole = session?.user?.role;
    if (userRole !== "super-admin") {
        redirect("/dashboard");
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Manage Events</h1>
                <div className="flex items-center gap-2">
                    <SeedButton />
                    <Button asChild>
                        <Link href="/dashboard/events/new">
                            Add New Event
                        </Link>
                    </Button>
                </div>
            </div>

            <Suspense fallback={<DashboardTableSkeleton />}>
                <EventsTable />
            </Suspense>
        </div>
    );
}
