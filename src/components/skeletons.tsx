import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ParticipantsTableSkeleton() {
    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex gap-2 w-full sm:w-auto">
                    <Skeleton className="h-10 w-62.5" />
                    <Skeleton className="h-10 w-50" />
                </div>
                <Skeleton className="h-10 w-30" />
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead><Skeleton className="h-4 w-20" /></TableHead>
                            <TableHead><Skeleton className="h-4 w-20" /></TableHead>
                            <TableHead><Skeleton className="h-4 w-20" /></TableHead>
                            <TableHead><Skeleton className="h-4 w-20" /></TableHead>
                            <TableHead><Skeleton className="h-4 w-20" /></TableHead>
                            <TableHead><Skeleton className="h-4 w-20" /></TableHead>
                            <TableHead><Skeleton className="h-4 w-20" /></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.from({ length: 5 }).map((_, i) => (
                            <TableRow key={i}>
                                <TableCell><Skeleton className="h-10 w-full" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                                <TableCell><Skeleton className="h-8 w-24" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

export function AnalyticsSkeleton() {
    return (
        <div className="grid gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-4 rounded-full" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-8 w-16 mb-2" />
                        <Skeleton className="h-3 w-32" />
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

export function EventPerformanceSkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

export function EventsGridSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden border">
                    <Skeleton className="w-full h-48" />
                    <div className="p-6">
                        <Skeleton className="h-8 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-2/3 mb-4" />
                        <div className="flex justify-between items-center">
                            <Skeleton className="h-6 w-16" />
                            <Skeleton className="h-10 w-28 rounded-lg" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export function MyTicketsSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-xl border bg-card text-card-foreground shadow h-56 flex flex-col p-6 space-y-4">
                    <div className="flex justify-between items-start">
                        <div className="space-y-2">
                            <Skeleton className="h-6 w-40" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                        <Skeleton className="h-8 w-24 rounded-full" />
                    </div>
                    <div className="space-y-3 pt-4 border-t border-dashed">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                    </div>
                </div>
            ))}
        </div>
    )
}

export function DashboardTableSkeleton() {
    return (
        <div className="bg-white rounded shadow overflow-hidden">
            <div className="p-4 border-b">
                <div className="flex justify-between items-center">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-10 w-32" />
                </div>
            </div>
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {Array.from({ length: 6 }).map((_, i) => (
                                <TableHead key={i}><Skeleton className="h-4 w-24" /></TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.from({ length: 8 }).map((_, i) => (
                            <TableRow key={i}>
                                <TableCell><Skeleton className="h-10 w-10 rounded-full inline-block mr-2" /><Skeleton className="h-4 w-32 inline-block" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                                <TableCell><Skeleton className="h-8 w-20" /></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export function ScannerSkeleton() {
    return (
        <div className="flex flex-col items-center justify-center p-4 space-y-6 max-w-md mx-auto">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="w-full aspect-square rounded-2xl" />
            <div className="w-full space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-24 w-full" />
            </div>
        </div>
    )
}
