import { getClubParticipants, getClubEventsSimple } from "@/actions/club-actions";
import { ParticipantsTable } from "@/components/clubs/participants-table";
import { getCurrentUser, hasClubPermission } from "@/lib/rbac";
import { notFound, redirect } from "next/navigation";

export default async function ClubParticipantsPage({ params }: { params: Promise<{ clubId: string }> }) {
    const user = await getCurrentUser();
    if (!user) redirect("/login");

    const { clubId } = await params;

    const canView = await hasClubPermission(user.id, clubId, ["club-admin", "volunteer", "event-editor"]);
    if (!canView) return notFound();

    const [participants, events] = await Promise.all([
        getClubParticipants(clubId),
        getClubEventsSimple(clubId)
    ]);

    return (
        <div className="container mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-6 capitalize">{clubId} Participants</h1>
            <ParticipantsTable participants={participants} events={events} clubId={clubId} />
        </div>
    );
}
