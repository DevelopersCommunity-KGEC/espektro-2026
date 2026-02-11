import { Skeleton } from "@/components/ui/skeleton";

export function EventDetailSkeleton() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <Skeleton className="w-full h-96" />
                <div className="p-8">
                    <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
                        <div className="w-full md:w-2/3 space-y-4">
                            <Skeleton className="h-10 w-3/4" />
                            <div className="flex gap-2">
                                <Skeleton className="h-5 w-32" />
                                <Skeleton className="h-5 w-32" />
                            </div>
                        </div>
                        <Skeleton className="h-12 w-32" />
                    </div>

                    <div className="space-y-4 mt-8">
                        <Skeleton className="h-6 w-48 mb-4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>
                </div>
            </div>
        </div>
    );
}
