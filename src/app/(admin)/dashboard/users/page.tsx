import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getAllUsersWithRoles } from "@/actions/admin-actions";
import { UserDashboard } from "@/components/admin/user-dashboard";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

async function UserList({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
    const page = Number(searchParams.page) || 1;
    const limit = 10;
    const search = (searchParams.search as string) || "";
    const clubId = (searchParams.clubId as string) || "all";
    const role = (searchParams.role as string) || "all";

    const { users, totalPages, total } = await getAllUsersWithRoles({
        page,
        limit,
        search,
        clubId: clubId === "all" ? undefined : clubId,
        role: role === "all" ? undefined : role,
    });

    return (
        <UserDashboard
            users={users}
            totalPages={totalPages}
            totalUsers={total}
            currentPage={page}
        />
    );
}

export default async function UserRolesPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || session.user.role !== "super-admin") {
        redirect("/dashboard");
    }

    const resolvedParams = await searchParams;

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
                    <p className="text-muted-foreground">
                        Manage authorized users, global roles, and club assignments.
                    </p>
                </div>
            </div>
            <Suspense fallback={
                <div className="flex justify-center p-12">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                </div>
            }>
                <UserList searchParams={resolvedParams} />
            </Suspense>
        </div >
    );
}

