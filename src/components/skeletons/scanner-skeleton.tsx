import { Skeleton } from "@/components/ui/skeleton";

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
