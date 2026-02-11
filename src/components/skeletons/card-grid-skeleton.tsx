import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function CardGridSkeleton() {
    return (
        <div className="container mx-auto py-10 px-4">
            <div className="flex justify-between items-center mb-6">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-10 w-32" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i}>
                        <CardHeader className="p-0">
                            <Skeleton className="h-48 w-full rounded-t-xl mb-4" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-6 w-3/4 mb-2" />
                            <Skeleton className="h-4 w-1/2 mb-4" />
                            <div className="flex gap-2">
                                <Skeleton className="h-9 w-24" />
                                <Skeleton className="h-9 w-24" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
