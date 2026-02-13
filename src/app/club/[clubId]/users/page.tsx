
import React from "react";
import { getClubTeam } from "@/actions/admin-actions";
import { getCurrentUser, hasClubPermission } from "@/lib/rbac";
import { redirect, notFound } from "next/navigation";
import { ClubUserList } from "@/components/clubs/club-user-list";

export default async function ClubUsersPage({ params }: { params: Promise<{ clubId: string }> }) {
    const user = await getCurrentUser();
    if (!user) redirect("/login");

    const { clubId } = await params;

    const canManage = await hasClubPermission(user.id, clubId, ["club-admin"]);
    if (!canManage) return notFound();

    const users = await getClubTeam(clubId);

    return (
        <div className="container mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-6 capitalize">{clubId} Team</h1>
            <ClubUserList initialUsers={users} clubId={clubId} />
        </div>
    );
}
