import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/user/profile-form";
import { ReferralSection } from "@/components/user/referral-section";
import { Leaderboard } from "@/components/user/leaderboard";
import { getMyReferralCode, getMyReferralStats, getReferralLeaderboard } from "@/actions/user-actions";
import { Separator } from "@/components/ui/separator";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export default async function ProfilePage() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        redirect("/login");
    }

    await dbConnect();
    const user = await User.findById(session.user.id).lean();

    if (!user) {
        redirect("/login");
    }

    // Parallel data fetching
    const [referralData, stats, leaderboard] = await Promise.all([
        getMyReferralCode(),
        getMyReferralStats(),
        getReferralLeaderboard()
    ]);

    // Format user for form (convert dates/IDs to strings if needed)
    const userData = {
        name: user.name,
        email: user.email,
        image: user.image,
        phone: user.phone || "",
        course: user.course || "",
        graduationYear: user.graduationYear || "",
        collegeName: user.collegeName || "",
    };

    return (
        <div className="container max-w-6xl mx-auto py-8 px-4 md:px-6 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Your Profile</h2>
                    <p className="text-muted-foreground text-sm md:text-base">Manage your personal details and track your referrals.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                {/* Left Column (Main Content) */}
                <div className="lg:col-span-2 space-y-6 md:space-y-8">
                    {/* Profile Information Card */}
                    <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
                        <div className="p-6 md:p-8 bg-muted/20 border-b">
                            <h3 className="font-semibold text-lg md:text-xl flex items-center gap-2">
                                Personal Information
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">Update your contact details and college information.</p>
                        </div>
                        <div className="p-6 md:p-8">
                            <ProfileForm user={userData} />
                        </div>
                    </div>

                    {/* Referral Section Card */}
                    <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden" id="referral">
                        <div className="p-6 md:p-8 bg-linear-to-r from-primary/10 to-transparent border-b">
                            <h3 className="font-semibold text-lg md:text-xl text-primary">Referral Program</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                Share your unique link to invite friends. Track your invites below.
                            </p>
                        </div>
                        <div className="p-6 md:p-8">
                            <ReferralSection code={referralData.code} stats={stats} />
                        </div>
                    </div>
                </div>

                {/* Right Column (Sidebar/Leaderboard) */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="sticky top-24">
                        <Leaderboard data={JSON.parse(JSON.stringify(leaderboard))} />

                        {/* Optional Helper / Info Box for Mobile Context or Desktop filling */}
                        <div className="mt-6 rounded-lg border bg-muted/50 p-4 text-sm text-muted-foreground hidden lg:block">
                            <p className="font-medium text-foreground mb-1">How it works?</p>
                            Share your referral link found in the section on the left. When your friends register and book tickets, you climb the leaderboard!
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
