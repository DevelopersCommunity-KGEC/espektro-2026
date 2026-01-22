import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getAllUsersWithRoles } from "@/actions/admin-actions";
import { UserDashboard } from "@/components/admin/user-dashboard";

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
    const page = Number(resolvedParams.page) || 1;
    const limit = 10;
    const search = (resolvedParams.search as string) || "";
    const clubId = (resolvedParams.clubId as string) || "all";
    const role = (resolvedParams.role as string) || "all";

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

